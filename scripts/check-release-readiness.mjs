#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repoRoot = path.resolve(import.meta.dirname, '..');
const expectBlocked = process.argv.includes('--expect-blocked');
const publicPackages = [
  'packages/ui/package.json',
  'packages/tokens/package.json',
  'packages/data-table/package.json',
  'packages/email-templates/package.json',
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
const unsafeStates = [];

for (const relativePath of requiredLegalArtifacts) {
  try {
    await access(path.join(repoRoot, relativePath));
  } catch {
    blockers.push(`missing legal/release prerequisite: ${relativePath}`);
  }
}

for (const relativePath of publicPackages) {
  const manifest = JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'));
  if (manifest.repository?.url !== 'https://github.com/unisane/unisane-ui.git') {
    unsafeStates.push(`${manifest.name} has incorrect repository metadata`);
  }
  if (manifest.private === true) blockers.push(`${manifest.name} is still private`);
  if (manifest.license === 'UNLICENSED') blockers.push(`${manifest.name} remains unlicensed`);
  if (manifest.private !== true && manifest.license === 'UNLICENSED') {
    unsafeStates.push(`${manifest.name} is public-intent while still unlicensed`);
  }
  if (manifest.publishConfig && manifest.private === true) {
    unsafeStates.push(`${manifest.name} has publish configuration while still private`);
  }
  if (manifest.private !== true && manifest.publishConfig?.access !== 'public') {
    blockers.push(`${manifest.name} is missing public publish access`);
  }
  if (manifest.private !== true && manifest.publishConfig?.provenance !== true) {
    blockers.push(`${manifest.name} is missing publish provenance enforcement`);
  }
}

try {
  const approval = JSON.parse(
    await readFile(path.join(repoRoot, 'docs/release-approval.json'), 'utf8'),
  );
  if (approval.status !== 'approved') blockers.push('release approval is not approved');
  if (!approval.approvedBy || !approval.approvedAt) {
    blockers.push('release approval lacks approver or approval timestamp');
  }
} catch {
  // The missing approval artifact is already reported above.
}

if (unsafeStates.length > 0) {
  console.error('Unsafe release state:');
  for (const failure of unsafeStates) console.error(`- ${failure}`);
  process.exit(1);
}

if (expectBlocked) {
  if (blockers.length === 0) {
    console.error('Expected release to remain blocked, but no blocker was found.');
    process.exit(1);
  }
  console.log(`Release policy remains safely blocked by ${blockers.length} prerequisite(s).`);
  process.exit(0);
}

if (blockers.length > 0) {
  console.error('Release remains blocked:');
  for (const failure of blockers) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Release prerequisites are present. Publishing still requires human approval.');

