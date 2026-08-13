import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { buildStaticRegistry, verifyStaticRegistry } from './build-static-registry.mjs';

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} failed with ${signal ?? `exit ${code}`}`));
    });
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeAllConnections?.();
  });
}

async function serve(directory) {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const relative = pathname.replace(/^\/+/, '');
      const filePath = path.join(directory, relative || 'index.html');
      const ownedPath = path.relative(directory, filePath);
      if (ownedPath.startsWith('..') || path.isAbsolute(ownedPath)) throw new Error('unsafe path');
      const content = await fs.readFile(filePath);
      response.writeHead(200, {
        'content-type': filePath.endsWith('.json')
          ? 'application/json; charset=utf-8'
          : 'text/html; charset=utf-8',
        'access-control-allow-origin': '*',
      });
      response.end(content);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('Static registry fixture did not bind');
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

async function collectSourceFiles(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectSourceFiles(entryPath)));
    else files.push(entryPath);
  }
  return files;
}

async function verifyOfficialShadcn(temporaryRoot) {
  const fixture = path.join(temporaryRoot, 'shadcn-consumer');
  const fixtureRegistry = path.join(temporaryRoot, 'shadcn-registry');
  await fs.mkdir(path.join(fixture, 'src'), { recursive: true });
  await Promise.all([
    fs.writeFile(
      path.join(fixture, 'package.json'),
      '{"name":"unisane-shadcn-fixture","private":true,"packageManager":"pnpm@10.26.0"}\n',
    ),
    fs.writeFile(path.join(fixture, 'src/index.css'), '@import "tailwindcss";\n'),
    fs.writeFile(
      path.join(fixture, 'tsconfig.json'),
      '{"compilerOptions":{"baseUrl":".","paths":{"@/*":["./src/*"]}}}\n',
    ),
    fs.writeFile(
      path.join(fixture, 'components.json'),
      `${JSON.stringify(
        {
          $schema: 'https://ui.shadcn.com/schema.json',
          style: 'new-york',
          rsc: false,
          tsx: true,
          tailwind: {
            config: '',
            css: 'src/index.css',
            baseColor: 'neutral',
            cssVariables: true,
            prefix: '',
          },
          iconLibrary: 'lucide',
          aliases: {
            components: '@/components',
            ui: '@/components/ui',
            lib: '@/lib',
            hooks: '@/hooks',
            utils: '@/lib/utils',
          },
        },
        null,
        2,
      )}\n`,
    ),
  ]);

  await fs.mkdir(fixtureRegistry, { recursive: true });
  const { server, origin } = await serve(fixtureRegistry);
  try {
    await buildStaticRegistry({ outputDirectory: fixtureRegistry, baseUrl: origin });
    await run(
      'pnpm',
      [
        'dlx',
        'shadcn@4.17.0',
        'add',
        `${origin}/r/button.json`,
        '--cwd',
        fixture,
        '--yes',
        '--overwrite',
      ],
      fixture,
    );
  } finally {
    await closeServer(server);
  }
  await Promise.all([
    fs.access(path.join(fixture, 'src/components/ui/button.tsx')),
    fs.access(path.join(fixture, 'src/components/ui/icon.tsx')),
    fs.access(path.join(fixture, 'src/lib/action-size.ts')),
    fs.access(path.join(fixture, 'src/lib/utils.ts')),
  ]);
  for (const filePath of await collectSourceFiles(path.join(fixture, 'src'))) {
    const content = await fs.readFile(filePath, 'utf8');
    if (content.includes('@unisane/')) {
      throw new Error(`Official Shadcn fixture retained a Unisane runtime import: ${filePath}`);
    }
  }
  const packageManifest = JSON.parse(await fs.readFile(path.join(fixture, 'package.json'), 'utf8'));
  const dependencyNames = Object.keys(packageManifest.dependencies ?? {});
  if (
    !dependencyNames.includes('class-variance-authority') ||
    dependencyNames.some((name) => name.startsWith('@unisane/'))
  ) {
    throw new Error('Official Shadcn fixture did not install the expected npm dependency closure');
  }
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Remote registry returned ${response.status}: ${url}`);
  return response.text();
}

async function verifyRemoteRegistry(baseUrl) {
  const origin = new URL(baseUrl);
  const root = origin.href.endsWith('/') ? origin.href : `${origin.href}/`;
  const [manifestSource, catalogSource, schemaSource, itemSource] = await Promise.all([
    fetchText(new URL('r/manifest.json', root)),
    fetchText(new URL('r/registry.json', root)),
    fetchText(new URL('schema/components.json', root)),
    fetchText(new URL('r/action-size.json', root)),
  ]);
  const manifest = JSON.parse(manifestSource);
  const catalog = JSON.parse(catalogSource);
  const schema = JSON.parse(schemaSource);
  const item = JSON.parse(itemSource);
  if (manifest.itemCount !== 94 || catalog.items.length !== 94) {
    throw new Error('Remote registry catalog is incomplete');
  }
  if (manifest.catalogSha256 !== sha256(catalogSource)) {
    throw new Error('Remote registry catalog digest does not match its manifest');
  }
  if (manifest.componentsSchemaSha256 !== sha256(schemaSource)) {
    throw new Error('Remote components schema digest does not match its manifest');
  }
  if (schema.$id !== 'https://ui.unisane.com/schema/components.json') {
    throw new Error('Remote components schema identity drifted');
  }
  if (
    item.$schema !== 'https://ui.shadcn.com/schema/registry-item.json' ||
    !item.files?.every((file) => typeof file.content === 'string' && file.content.length > 0)
  ) {
    throw new Error('Remote representative item is not content-bearing');
  }
  console.log(`Remote static registry check passed at ${root}`);
}

const remoteIndex = process.argv.indexOf('--remote');
if (remoteIndex !== -1) {
  const remoteUrl = process.argv[remoteIndex + 1];
  if (!remoteUrl) throw new Error('--remote requires the deployed registry base URL');
  await verifyRemoteRegistry(remoteUrl);
} else {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'unisane-static-registry-'));
  try {
    const outputDirectory = path.join(temporaryRoot, 'site');
    const result = await buildStaticRegistry({ outputDirectory });
    await verifyStaticRegistry(outputDirectory, result.manifest.baseUrl);
    if (process.argv.includes('--shadcn')) await verifyOfficialShadcn(temporaryRoot);
    console.log(
      process.argv.includes('--shadcn')
        ? 'Static registry and official Shadcn adoption checks passed.'
        : 'Static registry check passed.',
    );
  } finally {
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
}
