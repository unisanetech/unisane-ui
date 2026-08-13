#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const approvedVersion = '0.1.0-next.b67ebfd0';
const publicPackages = [
  'packages/ui/package.json',
  'packages/tokens/package.json',
  'packages/data-table/package.json',
  'packages/email-templates/package.json',
];
const approvedPackageNames = [
  '@unisane/tokens',
  '@unisane/ui',
  '@unisane/data-table',
  '@unisane/email-templates',
];
const requiredLegalArtifacts = [
  'LICENSE',
  'NOTICE',
  'THIRD_PARTY_NOTICES.md',
  'CONTRIBUTING.md',
  'docs/asset-provenance.json',
  'docs/release-approval.json',
];
const blockers = [];

for (const relativePath of requiredLegalArtifacts) {
  try {
    await access(path.join(repoRoot, relativePath));
  } catch {
    blockers.push(`missing legal/release prerequisite: ${relativePath}`);
  }
}

for (const relativePath of publicPackages) {
  const manifest = JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'));
  if (manifest.version !== approvedVersion) {
    blockers.push(`${manifest.name} does not use approved version ${approvedVersion}`);
  }
  if (manifest.private !== false) blockers.push(`${manifest.name} is not public`);
  if (manifest.license !== 'MIT') blockers.push(`${manifest.name} is not MIT licensed`);
  if (manifest.repository?.url !== 'https://github.com/unisanetech/unisane-ui.git') {
    blockers.push(`${manifest.name} has incorrect repository metadata`);
  }
  if (
    manifest.publishConfig?.access !== 'public' ||
    manifest.publishConfig?.provenance !== true ||
    manifest.publishConfig?.tag !== 'next'
  ) {
    blockers.push(`${manifest.name} has incorrect public prerelease publish metadata`);
  }
}

for (const relativePath of ['packages/ui-cli/package.json', 'apps/docs/package.json']) {
  const manifest = JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'));
  if (manifest.private !== true || manifest.publishConfig) {
    blockers.push(`${manifest.name} must remain private and non-publishable`);
  }
}

try {
  const approval = JSON.parse(
    await readFile(path.join(repoRoot, 'docs/release-approval.json'), 'utf8'),
  );
  if (
    approval.status !== 'approved' ||
    approval.approvedBy !== 'founder' ||
    !approval.approvedAt ||
    approval.license !== 'MIT' ||
    approval.publicDistribution !== true ||
    JSON.stringify(approval.packages) !== JSON.stringify(approvedPackageNames) ||
    approval.release?.version !== approvedVersion ||
    approval.release?.registry !== 'https://registry.npmjs.org/' ||
    approval.release?.tag !== 'next' ||
    approval.release?.access !== 'public' ||
    approval.release?.provenanceRequired !== true
  ) {
    blockers.push('release approval does not match the approved public prerelease contract');
  }
} catch {
  // The missing approval artifact is already reported above.
}

try {
  const provenance = JSON.parse(
    await readFile(path.join(repoRoot, 'docs/asset-provenance.json'), 'utf8'),
  );
  if (provenance.status !== 'approved' || provenance.approvedBy !== 'founder') {
    blockers.push('asset provenance is not approved');
  }
} catch {
  // The missing provenance artifact is already reported above.
}

if (blockers.length > 0) {
  console.error('Release source readiness failed:');
  for (const failure of blockers) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Release source readiness passed for ${approvedPackageNames.length} packages at ${approvedVersion}.`,
);
console.log('Publishing still requires authenticated provenance-enabled npm execution.');
