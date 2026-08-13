import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const packageCases = [
  {
    directory: 'packages/ui',
    allowedRoots: ['dist', 'registry', 'LICENSE', 'package.json', 'README.md', 'unisane.meta.json'],
  },
  {
    directory: 'packages/ui-cli',
    allowedRoots: [
      'dist',
      'pack.manifest.json',
      'LICENSE',
      'package.json',
      'README.md',
      'unisane.meta.json',
    ],
  },
  {
    directory: 'packages/tokens',
    allowedRoots: ['dist', 'LICENSE', 'package.json', 'README.md', 'unisane.meta.json'],
  },
  {
    directory: 'packages/data-table',
    allowedRoots: ['dist', 'LICENSE', 'package.json', 'README.md', 'unisane.meta.json'],
  },
  {
    directory: 'packages/email-templates',
    allowedRoots: ['dist', 'LICENSE', 'package.json', 'README.md', 'unisane.meta.json'],
  },
];

const forbiddenPath =
  /(?:^|[./_-])(?:__tests__|test|tests|spec|legacy|deprecated|deprecation|dummy|temp|roadmap|checklist|migration)(?:[./_-]|$)/i;

function collectExportTargets(value, targets = []) {
  if (typeof value === 'string') {
    if (!value.includes('*')) {
      targets.push(value.replace(/^\.\//, ''));
    }
    return targets;
  }

  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) {
      collectExportTargets(child, targets);
    }
  }

  return targets;
}

for (const packageCase of packageCases) {
  const packageRoot = resolve(repositoryRoot, packageCase.directory);
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'));
  const pack = spawnSync('pnpm', ['pack', '--dry-run', '--json'], {
    cwd: packageRoot,
    encoding: 'utf8',
  });

  if (pack.status !== 0) {
    throw new Error(`Package dry run failed for ${manifest.name}:\n${pack.stderr || pack.stdout}`);
  }

  const result = JSON.parse(pack.stdout);
  const packedFiles = new Set(result.files.map((file) => file.path));
  const allowedRoots = new Set(packageCase.allowedRoots);
  const unexpected = [...packedFiles].filter((path) => !allowedRoots.has(path.split('/')[0]));
  const forbidden = [...packedFiles].filter(
    (path) => path.startsWith('src/') || forbiddenPath.test(path),
  );
  const requiredTargets = collectExportTargets(manifest.exports);

  for (const field of ['main', 'module', 'types']) {
    if (typeof manifest[field] === 'string') {
      requiredTargets.push(manifest[field].replace(/^\.\//, ''));
    }
  }

  const binaries =
    typeof manifest.bin === 'string'
      ? [manifest.bin]
      : manifest.bin && typeof manifest.bin === 'object'
        ? Object.values(manifest.bin)
        : [];
  for (const binary of binaries) {
    if (typeof binary === 'string') requiredTargets.push(binary.replace(/^\.\//, ''));
  }

  const missingTargets = [...new Set(requiredTargets)].filter((path) => !packedFiles.has(path));

  if (unexpected.length > 0 || forbidden.length > 0 || missingTargets.length > 0) {
    throw new Error(
      [
        `Package-content check failed for ${manifest.name}.`,
        unexpected.length > 0 ? `Unexpected roots: ${unexpected.join(', ')}` : '',
        forbidden.length > 0 ? `Forbidden files: ${forbidden.join(', ')}` : '',
        missingTargets.length > 0 ? `Missing export targets: ${missingTargets.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  console.log(`${manifest.name}: ${packedFiles.size} files; exports and package boundary passed.`);
}
