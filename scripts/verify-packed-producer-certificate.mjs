import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const dependencyFields = [
  'dependencies',
  'optionalDependencies',
  'peerDependencies',
  'devDependencies',
];

export function validatePackedManifest(manifest, approval, entries) {
  assert(approval.packages.includes(manifest.name), `Unapproved package: ${manifest.name}`);
  assert.equal(
    manifest.version,
    approval.release.version,
    'Packed version differs from approved release',
  );
  assert.equal(manifest.private, false);
  assert.equal(manifest.license, approval.license);
  assert.equal(manifest.publishConfig?.access, approval.release.access);
  assert.equal(manifest.publishConfig?.tag, approval.release.tag);
  assert.equal(manifest.publishConfig?.provenance, true);
  assert(entries.includes('package/LICENSE'), 'Packed license is missing');
  for (const entry of entries) {
    assert(
      entry.startsWith('package/') && !entry.split('/').includes('..'),
      `Unsafe archive path: ${entry}`,
    );
    assert(
      !/(^|\/)(\.env(?:\.[^/]*)?|\.npmrc|node_modules|\.git|src|tests|__tests__)(\/|$)/u.test(
        entry,
      ),
      `Forbidden archive entry: ${entry}`,
    );
  }
  for (const field of dependencyFields) {
    for (const [name, version] of Object.entries(manifest[field] ?? {})) {
      assert(
        !/^(workspace:|file:|link:|portal:|\.|\/)/u.test(version),
        `Local dependency: ${name}`,
      );
      if (approval.packages.includes(name)) {
        assert.equal(
          version,
          approval.release.version,
          `Internal dependency must be exact: ${name}`,
        );
      }
    }
  }
  const targets = (value) =>
    typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(targets);
  for (const target of [
    ...targets(manifest.exports),
    ...targets(manifest.bin),
    ...[manifest.main, manifest.types].filter(Boolean),
  ]) {
    const expected = `package/${target.replace(/^\.\//u, '')}`;
    const expression = new RegExp(
      `^${expected
        .split('*')
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'))
        .join('.*')}$`,
      'u',
    );
    assert(
      entries.some((entry) => expression.test(entry)),
      `Missing export: ${target}`,
    );
  }
}

function run(command, args, cwd = root, env = process.env) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(`${command} failed:\n${result.stderr || result.stdout}`);
  return result.stdout;
}

export function main() {
  const approval = readJson(path.join(root, 'docs/release-approval.json'));
  assert.equal(approval.status, 'approved');
  assert.equal(approval.publicDistribution, true);
  const output = path.join(root, '.tmp/release');
  mkdirSync(output, { recursive: true });
  const work = mkdtempSync(path.join(tmpdir(), 'unisane-ui-consumer-'));
  try {
    const dependencies = {};
    const artifacts = [];
    for (const name of approval.packages) {
      const directory = path.join(root, 'packages', name.split('/')[1]);
      const source = readJson(path.join(directory, 'package.json'));
      assert.equal(source.version, approval.release.version);
      run('pnpm', ['pack', '--pack-destination', output], directory);
      const filename = `${name.replace('@', '').replace('/', '-')}-${source.version}.tgz`;
      const archive = path.join(output, filename);
      const entries = run('tar', ['-tzf', archive]).trim().split('\n');
      const manifest = JSON.parse(run('tar', ['-xOf', archive, 'package/package.json']));
      validatePackedManifest(manifest, approval, entries);
      dependencies[name] = `file:${archive}`;
      artifacts.push({
        name,
        version: manifest.version,
        filename,
        integrity: `sha512-${createHash('sha512').update(readFileSync(archive)).digest('base64')}`,
      });
    }
    const source = readJson(path.join(root, 'packages/ui/package.json'));
    const rootManifest = readJson(path.join(root, 'package.json'));
    writeFileSync(
      path.join(work, 'package.json'),
      JSON.stringify({
        private: true,
        type: 'module',
        dependencies: {
          ...dependencies,
          react: '19.2.3',
          'react-dom': '19.2.3',
          '@types/react': source.devDependencies['@types/react'],
          '@types/react-dom': source.devDependencies['@types/react-dom'],
          typescript: rootManifest.devDependencies.typescript,
        },
        pnpm: { overrides: dependencies },
      }),
    );
    const userconfig = path.join(work, '.npmrc');
    writeFileSync(userconfig, 'registry=https://registry.npmjs.org/\n');
    const env = { ...process.env, NPM_CONFIG_USERCONFIG: userconfig };
    delete env.NODE_AUTH_TOKEN;
    run(
      'pnpm',
      [
        'install',
        '--ignore-workspace',
        '--ignore-scripts',
        '--config.shared-workspace-lockfile=false',
        '--no-frozen-lockfile',
      ],
      work,
      env,
    );
    writeFileSync(
      path.join(work, 'smoke.ts'),
      `import { Button } from '@unisane/ui/button';\nimport { DataTable } from '@unisane/data-table';\nimport { renderEmailTemplate } from '@unisane/email-templates';\nvoid [Button, DataTable, renderEmailTemplate];\n`,
    );
    run(
      'pnpm',
      [
        'exec',
        'tsc',
        '--noEmit',
        '--strict',
        '--skipLibCheck',
        '--module',
        'NodeNext',
        '--moduleResolution',
        'NodeNext',
        '--target',
        'ES2022',
        'smoke.ts',
      ],
      work,
      env,
    );
    writeFileSync(
      path.join(work, 'smoke.mjs'),
      `import assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\nimport { createElement } from 'react';\nimport { renderToStaticMarkup } from 'react-dom/server';\nimport { Button } from '@unisane/ui/button';\nimport { DataTable } from '@unisane/data-table';\nimport { EMAIL_TEMPLATE_NAMES, renderEmailTemplate } from '@unisane/email-templates';\nassert(renderToStaticMarkup(createElement(Button, null, 'Packed UI')).includes('Packed UI'));\nassert(renderToStaticMarkup(createElement(DataTable, { data: [{id:'1', name:'Ada'}], columns: [{key:'name',header:'Name'}], preset:'simple' })).includes('Ada'));\nassert(typeof renderEmailTemplate === 'function' && Object.keys(EMAIL_TEMPLATE_NAMES).length > 0);\nfor (const name of ['@unisane/tokens/unisane.css','@unisane/ui/styles.css','@unisane/data-table/styles.css']) assert(readFileSync(new URL(import.meta.resolve(name))).length > 500);\n`,
    );
    run(process.execPath, ['smoke.mjs'], work, env);
    writeFileSync(
      path.join(output, 'certificate.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          artifacts,
          checks: [
            'packed-manifests',
            'isolated-install',
            'typescript',
            'react-ssr',
            'email-exports',
            'stylesheets',
          ],
          registryPublicationVerified: false,
        },
        null,
        2,
      ) + '\n',
    );
    console.log(
      `Verified ${artifacts.length} release archives in an isolated consumer. Certificate: .tmp/release/certificate.json`,
    );
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
