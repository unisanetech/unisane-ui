#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliPath = path.join(packageDir, 'dist', 'cli.js');
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-adoption-'));

const baseDependencies = {
  react: '19.2.8',
  'react-dom': '19.2.8',
  'class-variance-authority': '^0.7.1',
  clsx: '^2.1.1',
  'tailwind-merge': '^3.4.0',
};
const baseDevDependencies = {
  '@types/node': '22.20.1',
  '@types/react': '19.2.18',
  '@types/react-dom': '19.2.4',
  tailwindcss: '4.1.18',
  typescript: '5.9.2',
};

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      CI: '1',
      NEXT_TELEMETRY_DISABLED: '1',
    },
  });
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function collectSource(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectSource(entryPath)));
    else if (/\.(?:ts|tsx|json)$/.test(entry.name)) files.push(entryPath);
  }
  return files;
}

async function verifyGeneratedSource(projectDir) {
  const buttonPath = path.join(projectDir, 'src', 'components', 'ui', 'button.tsx');
  const canonicalButton = await readFile(buttonPath, 'utf8');
  await writeFile(buttonPath, `// application-owned edit\n${canonicalButton}`);
  run('node', [cliPath, 'add', 'button', '--yes'], projectDir);
  const preserved = await readFile(buttonPath, 'utf8');
  if (!preserved.startsWith('// application-owned edit')) {
    throw new Error('Repeated add overwrote application-owned source');
  }
  run('node', [cliPath, 'add', 'button', '--yes', '--overwrite'], projectDir);
  if ((await readFile(buttonPath, 'utf8')) !== canonicalButton) {
    throw new Error('--overwrite did not restore the generated registry source');
  }

  for (const filePath of await collectSource(path.join(projectDir, 'src'))) {
    const content = await readFile(filePath, 'utf8');
    if (/@unisane\/|@ui\/|@\/(?:primitives|layout)\//.test(content)) {
      throw new Error(`Generated source retains a forbidden runtime fallback: ${filePath}`);
    }
  }
}

async function createNextFixture() {
  const projectDir = path.join(temporaryRoot, 'next-app');
  await mkdir(path.join(projectDir, 'src', 'app'), { recursive: true });
  await writeJson(path.join(projectDir, 'package.json'), {
    name: 'unisane-next-adoption-fixture',
    private: true,
    packageManager: 'pnpm@10.26.0',
    scripts: { build: 'next build', typecheck: 'tsc --noEmit' },
    dependencies: { ...baseDependencies, next: '16.0.10' },
    devDependencies: baseDevDependencies,
  });
  await writeJson(path.join(projectDir, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      lib: ['dom', 'dom.iterable', 'esnext'],
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      jsx: 'preserve',
      baseUrl: '.',
      paths: { '@/*': ['./src/*'] },
      plugins: [{ name: 'next' }],
    },
    include: ['next-env.d.ts', 'src/**/*.ts', 'src/**/*.tsx', '.next/types/**/*.ts'],
  });
  await writeFile(path.join(projectDir, 'src', 'app', 'globals.css'), '.app-owned {}\n');
  await writeFile(
    path.join(projectDir, 'src', 'app', 'layout.tsx'),
    `import type { ReactNode } from 'react';\nimport './globals.css';\nexport default function Layout({ children }: { children: ReactNode }) { return <html><body>{children}</body></html>; }\n`,
  );
  await writeFile(
    path.join(projectDir, 'src', 'app', 'page.tsx'),
    `import { Button } from '@/components/ui/button';\nexport default function Page() { return <main><Button>Ready</Button></main>; }\n`,
  );

  run('pnpm', ['install', '--ignore-workspace'], projectDir);
  run('node', [cliPath, 'init'], projectDir);
  run('node', [cliPath, 'add', 'button', '--yes'], projectDir);
  await verifyGeneratedSource(projectDir);
  run('pnpm', ['run', 'typecheck'], projectDir);
  run('pnpm', ['run', 'build'], projectDir);
}

async function writeViteProject(projectDir, name) {
  await mkdir(path.join(projectDir, 'src'), { recursive: true });
  await writeJson(path.join(projectDir, 'package.json'), {
    name,
    private: true,
    packageManager: 'pnpm@10.26.0',
    scripts: { build: 'vite build', typecheck: 'tsc --noEmit' },
    dependencies: baseDependencies,
    devDependencies: { ...baseDevDependencies, vite: '7.3.6' },
  });
  await writeJson(path.join(projectDir, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      useDefineForClassFields: true,
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: false,
      moduleResolution: 'Bundler',
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: 'force',
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      baseUrl: '.',
      paths: { '@/*': ['./src/*'] },
    },
    include: ['src'],
  });
  await writeFile(
    path.join(projectDir, 'vite.config.ts'),
    `import path from 'node:path';\nimport { fileURLToPath } from 'node:url';\nimport { defineConfig } from 'vite';\nconst root = path.dirname(fileURLToPath(import.meta.url));\nexport default defineConfig({ resolve: { alias: { '@': path.join(root, 'src') } } });\n`,
  );
  await writeFile(
    path.join(projectDir, 'index.html'),
    '<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n',
  );
  await writeFile(path.join(projectDir, 'src', 'index.css'), '.app-owned {}\n');
  await writeFile(
    path.join(projectDir, 'src', 'main.tsx'),
    `import { createRoot } from 'react-dom/client';\nimport { Button } from '@/components/ui/button';\nimport './index.css';\ncreateRoot(document.getElementById('root')!).render(<Button>Ready</Button>);\n`,
  );
}

async function createViteFixture() {
  const projectDir = path.join(temporaryRoot, 'vite-app');
  await writeViteProject(projectDir, 'unisane-vite-adoption-fixture');
  run('pnpm', ['install', '--ignore-workspace'], projectDir);
  run('node', [cliPath, 'init'], projectDir);
  run('node', [cliPath, 'add', 'button', '--yes'], projectDir);
  await verifyGeneratedSource(projectDir);
  run('pnpm', ['run', 'typecheck'], projectDir);
  run('pnpm', ['run', 'build'], projectDir);
}

async function createMonorepoFixture() {
  const workspaceDir = path.join(temporaryRoot, 'monorepo');
  const projectDir = path.join(workspaceDir, 'packages', 'web');
  await writeViteProject(projectDir, 'unisane-monorepo-adoption-fixture');
  await writeFile(path.join(workspaceDir, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n');
  await writeJson(path.join(workspaceDir, 'package.json'), {
    name: 'unisane-adoption-monorepo',
    private: true,
    packageManager: 'pnpm@10.26.0',
  });
  run('pnpm', ['install'], workspaceDir);
  run('node', [cliPath, 'init'], projectDir);
  run('node', [cliPath, 'add', 'button', '--yes'], projectDir);
  await verifyGeneratedSource(projectDir);
  run('pnpm', ['run', 'typecheck'], projectDir);
  run('pnpm', ['run', 'build'], projectDir);
}

try {
  await createNextFixture();
  await createViteFixture();
  await createMonorepoFixture();
  console.log('Next.js, Vite, and pnpm monorepo adoption fixtures passed.');
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
