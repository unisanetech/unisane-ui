import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(
  repositoryRoot,
  'docs/reference/generated/repository-convergence-report.json',
);
const mode = process.argv.includes('--write') ? 'write' : 'check';
const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.skopos',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);
const textExtensions = new Set([
  '.css',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);
const canonicalRepositoryUrl = 'https://github.com/unisanetech/unisane-ui';
const currentAuthorityPaths = new Set([
  'README.md',
  'docs/overview.md',
  'docs/guides/repository-provenance.md',
]);
const violations = [];

async function collectFiles(directory, relativeDirectory = '') {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const relativePath = relativeDirectory
      ? path.posix.join(relativeDirectory, entry.name)
      : entry.name;
    if (relativePath.startsWith('docs/work/')) continue;
    if (relativePath === 'docs/reference/generated/repository-convergence-report.json') continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath, relativePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }

  return files;
}

function classify(relativePath) {
  if (relativePath.startsWith('packages/ui/registry/')) {
    return { disposition: 'regenerate', owner: '@unisane/ui registry generator' };
  }
  if (relativePath.startsWith('packages/tokens/dist/')) {
    return { disposition: 'regenerate', owner: '@unisane/tokens generator' };
  }
  if (/\.(?:test|spec)\.[cm]?[jt]sx?$/.test(relativePath) || relativePath.includes('/e2e/')) {
    return { disposition: 'retain', owner: 'nearest package or application test boundary' };
  }
  if (relativePath.includes('__snapshots__') || relativePath.includes('-snapshots/')) {
    return { disposition: 'retain', owner: 'nearest deterministic test owner' };
  }
  if (relativePath.startsWith('docs/')) {
    return { disposition: 'retain', owner: 'repository documentation' };
  }
  if (relativePath.startsWith('apps/docs/public/')) {
    return { disposition: 'retain', owner: 'approved UI docs asset provenance' };
  }
  if (relativePath.startsWith('apps/docs/')) {
    return { disposition: 'retain', owner: '@unisane/ui-docs' };
  }
  if (relativePath.startsWith('packages/ui/')) {
    return { disposition: 'retain', owner: '@unisane/ui' };
  }
  if (relativePath.startsWith('packages/ui-cli/')) {
    return { disposition: 'retain', owner: '@unisane/ui-cli' };
  }
  if (relativePath.startsWith('packages/data-table/')) {
    return { disposition: 'retain', owner: '@unisane/data-table' };
  }
  if (relativePath.startsWith('packages/email-templates/')) {
    return { disposition: 'retain', owner: '@unisane/email-templates' };
  }
  if (relativePath.startsWith('packages/tokens/')) {
    return { disposition: 'retain', owner: '@unisane/tokens' };
  }
  if (relativePath.startsWith('scripts/')) {
    return { disposition: 'retain', owner: 'repository tooling' };
  }
  return { disposition: 'retain', owner: 'repository foundation' };
}

function recordViolation(relativePath, message) {
  violations.push(`${relativePath}: ${message}`);
}

const files = await collectFiles(repositoryRoot);
const authority = 'standalone-unisane-ui-public-source';
const records = [];

if (files.includes('docs/guides/migration-shadow.md')) {
  recordViolation('docs/guides/migration-shadow.md', 'obsolete active shadow authority remains');
}
if (!files.includes('docs/guides/repository-provenance.md')) {
  recordViolation('docs/guides/repository-provenance.md', 'current authority guide is missing');
}

for (const relativePath of files) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  const content = await fs.readFile(absolutePath);
  const classification = classify(relativePath);
  records.push({
    path: relativePath,
    ...classification,
    sha256: createHash('sha256').update(content).digest('hex'),
  });

  if (
    relativePath.includes('packages/core/') ||
    relativePath.includes('packages/tailwind-config/') ||
    relativePath.includes('/src/__tests__/') ||
    /(?:^|\/)(?:TEMP_.+|.+_PLAN|ROADMAP|USAGE)\.md$/.test(relativePath) ||
    relativePath.endsWith('export-2026-07-09.pdf')
  ) {
    recordViolation(relativePath, 'retired structural path or execution artifact remains');
  }

  if (!textExtensions.has(path.extname(relativePath))) continue;
  const text = content.toString('utf8');
  if (currentAuthorityPaths.has(relativePath)) {
    if (!text.includes(canonicalRepositoryUrl)) {
      recordViolation(relativePath, 'canonical public source repository is missing');
    }
    for (const staleAuthority of [
      'umbrella remains the sole writable source authority',
      'local non-authoritative migration shadow',
      'local, non-authoritative migration shadow',
    ]) {
      if (text.toLowerCase().includes(staleAuthority)) {
        recordViolation(relativePath, `obsolete source authority remains: ${staleAuthority}`);
      }
    }
  }
  const isBoundaryChecker = relativePath === 'scripts/check-repository-boundaries.mjs';
  if (!isBoundaryChecker && text.includes('/Users/bhaskarbarma/')) {
    recordViolation(relativePath, 'machine-absolute path remains');
  }

  const isCurrentCodeOrConfig =
    !relativePath.startsWith('docs/') && relativePath !== 'MIGRATION.md' && !isBoundaryChecker;
  if (isCurrentCodeOrConfig) {
    for (const forbidden of [
      '@unisane/eslint-config',
      '@unisane/tailwind-config',
      '@unisane/typescript-config',
      '@unisane/web',
      'packages/core',
    ]) {
      if (text.includes(forbidden)) {
        recordViolation(relativePath, `umbrella or retired reference remains: ${forbidden}`);
      }
    }
  }
}

const publicPackagePaths = [
  'packages/tokens/package.json',
  'packages/ui/package.json',
  'packages/ui-cli/package.json',
  'packages/data-table/package.json',
  'packages/email-templates/package.json',
];
const publicManifests = new Map();
for (const packagePath of publicPackagePaths) {
  const manifest = JSON.parse(await fs.readFile(path.join(repositoryRoot, packagePath), 'utf8'));
  publicManifests.set(manifest.name, manifest);
  if (manifest.private !== false) recordViolation(packagePath, 'approved package is not public');
  if (manifest.license !== 'MIT') recordViolation(packagePath, 'approved package is not MIT');
  if (manifest.version !== '0.1.0-next.b67ebfd0') {
    recordViolation(packagePath, 'approved prerelease identity drifted');
  }
  if (
    manifest.publishConfig?.access !== 'public' ||
    manifest.publishConfig?.provenance !== true ||
    manifest.publishConfig?.tag !== 'next'
  ) {
    recordViolation(packagePath, 'approved public publish configuration drifted');
  }
}

const uiCliManifest = publicManifests.get('@unisane/ui-cli');
if (uiCliManifest?.bin?.['unisane-ui'] !== './dist/cli.js') {
  recordViolation(
    'packages/ui-cli/package.json',
    'UI registry pack must publish the exact standalone unisane-ui binary',
  );
}
if (!uiCliManifest?.files?.includes('LICENSE')) {
  recordViolation('packages/ui-cli/package.json', 'UI registry pack must publish its MIT license');
}
for (const packageName of ['unisane', '@unisane/ui', '@unisane/tokens']) {
  if (
    uiCliManifest?.dependencies?.[packageName] ||
    uiCliManifest?.peerDependencies?.[packageName] ||
    uiCliManifest?.optionalDependencies?.[packageName]
  ) {
    recordViolation(
      'packages/ui-cli/package.json',
      `UI registry pack must not require ${packageName} at runtime`,
    );
  }
}

const registry = JSON.parse(
  await fs.readFile(path.join(repositoryRoot, 'packages/ui/registry/registry.json'), 'utf8'),
);
if (registry.components?.['data-table']) {
  recordViolation('packages/ui/registry/registry.json', 'UI registry still owns DataTable source');
}
if (files.some((file) => file.startsWith('packages/ui/registry/components/data-table/'))) {
  recordViolation('packages/ui/registry', 'DataTable files remain in the UI-owned registry');
}
if (files.some((file) => file.includes('/docs/internal/'))) {
  recordViolation('apps/docs', 'test fixture remains under a public docs route');
}

records.sort((left, right) => left.path.localeCompare(right.path));
const dispositionCounts = records.reduce((counts, record) => {
  counts[record.disposition] = (counts[record.disposition] ?? 0) + 1;
  return counts;
}, {});
const report = {
  schemaVersion: 1,
  authority,
  generatedBy: 'scripts/check-repository-boundaries.mjs',
  fileCount: records.length,
  dispositionCounts,
  unresolvedReleaseBlockers: [
    'authenticated npm publisher and completed provenance-enabled publish transaction',
    'protected branch governance and recovery identities',
  ],
  violations: violations.sort(),
  files: records,
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (mode === 'write') {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, serialized);
} else {
  let current = '';
  try {
    current = await fs.readFile(reportPath, 'utf8');
  } catch {
    recordViolation(
      'docs/reference/generated/repository-convergence-report.json',
      'report missing',
    );
  }
  if (current && current !== serialized) {
    recordViolation(
      'docs/reference/generated/repository-convergence-report.json',
      'report is stale',
    );
  }
}

if (violations.length) {
  console.error(`Repository boundary check failed with ${violations.length} violation(s):`);
  for (const violation of violations.sort()) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Repository boundary check passed for ${records.length} files.`);
