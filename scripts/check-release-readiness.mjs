#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const approvedVersion = '0.1.0';
const standaloneCli = {
  packageName: '@unisane/ui-cli',
  executable: 'unisane-ui',
  invocation: 'pnpm dlx @unisane/ui-cli@latest',
};
const publicPackages = [
  'packages/tokens/package.json',
  'packages/ui/package.json',
  'packages/ui-cli/package.json',
  'packages/data-table/package.json',
  'packages/email-templates/package.json',
];
const approvedPackageNames = [
  '@unisane/tokens',
  '@unisane/ui',
  '@unisane/ui-cli',
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
  'packages/ui-cli/LICENSE',
];
const expectedRepositoryUrl = 'https://github.com/unisanetech/unisane-ui.git';
const expectedHomepage = 'https://github.com/unisanetech/unisane-ui#readme';
const expectedBugsUrl = 'https://github.com/unisanetech/unisane-ui/issues';
const publishWorkflowPath = '.github/workflows/publish-release.yml';
const approvedPublishCommand =
  'run: pnpm publish --access public --tag latest --provenance --no-git-checks';
const blockers = [];

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (typeof value !== 'object' || value === null) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, stableValue(entry)]),
  );
}

function hashValue(value) {
  return createHash('sha256')
    .update(JSON.stringify(stableValue(value)))
    .digest('hex');
}

for (const relativePath of requiredLegalArtifacts) {
  try {
    await access(path.join(repoRoot, relativePath));
  } catch {
    blockers.push(`missing legal/release prerequisite: ${relativePath}`);
  }
}

try {
  const workflow = await readFile(path.join(repoRoot, publishWorkflowPath), 'utf8');
  const approvedCommandCount = workflow.split(approvedPublishCommand).length - 1;
  if (approvedCommandCount !== approvedPackageNames.length) {
    blockers.push(
      `${publishWorkflowPath} must use the pnpm publish path for all ${approvedPackageNames.length} packages`,
    );
  }
  if (/run:\s+npm publish\b/u.test(workflow)) {
    blockers.push(`${publishWorkflowPath} must not publish source manifests with npm publish`);
  }
} catch {
  blockers.push(`${publishWorkflowPath} is missing or invalid`);
}

const manifests = new Map();
for (const relativePath of publicPackages) {
  const manifest = JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'));
  manifests.set(manifest.name, manifest);

  if (manifest.version !== approvedVersion) {
    blockers.push(`${manifest.name} does not use approved version ${approvedVersion}`);
  }
  if (manifest.private !== false) blockers.push(`${manifest.name} is not public`);
  if (manifest.license !== 'MIT') blockers.push(`${manifest.name} is not MIT licensed`);
  if (manifest.repository?.url !== expectedRepositoryUrl) {
    blockers.push(`${manifest.name} has incorrect repository metadata`);
  }
  if (manifest.homepage !== expectedHomepage || manifest.bugs?.url !== expectedBugsUrl) {
    blockers.push(`${manifest.name} has incomplete public support metadata`);
  }
  if (!Array.isArray(manifest.keywords) || manifest.keywords.length === 0) {
    blockers.push(`${manifest.name} has no npm discovery keywords`);
  }
  if (
    manifest.publishConfig?.access !== 'public' ||
    manifest.publishConfig?.provenance !== true ||
    manifest.publishConfig?.tag !== 'latest'
  ) {
    blockers.push(`${manifest.name} has incorrect stable public publish metadata`);
  }
}

const uiManifest = manifests.get('@unisane/ui');
if (!uiManifest?.files?.includes('registry')) {
  blockers.push('@unisane/ui must include the generated registry parity artifact');
}

const uiCliManifest = manifests.get('@unisane/ui-cli');
if (
  JSON.stringify(uiCliManifest?.bin) !==
  JSON.stringify({ [standaloneCli.executable]: './dist/cli.js' })
) {
  blockers.push('@unisane/ui-cli must publish the exact standalone unisane-ui executable');
}
for (const forbiddenDependency of ['unisane', '@unisane/ui', '@unisane/tokens']) {
  if (
    uiCliManifest?.dependencies?.[forbiddenDependency] ||
    uiCliManifest?.peerDependencies?.[forbiddenDependency] ||
    uiCliManifest?.optionalDependencies?.[forbiddenDependency]
  ) {
    blockers.push(`@unisane/ui-cli must not depend on ${forbiddenDependency}`);
  }
}

try {
  const packManifest = JSON.parse(
    await readFile(path.join(repoRoot, 'packages/ui-cli/pack.manifest.json'), 'utf8'),
  );
  const { integrity, ...payload } = packManifest;
  if (
    packManifest.packageName !== '@unisane/ui-cli' ||
    packManifest.version !== approvedVersion ||
    integrity?.algorithm !== 'sha256' ||
    integrity?.manifestHash !== hashValue(payload)
  ) {
    blockers.push('@unisane/ui-cli pack manifest identity or integrity is stale');
  }
} catch {
  blockers.push('@unisane/ui-cli pack manifest is missing or invalid');
}

const docsManifest = JSON.parse(
  await readFile(path.join(repoRoot, 'apps/docs/package.json'), 'utf8'),
);
if (docsManifest.private !== true || docsManifest.publishConfig) {
  blockers.push(`${docsManifest.name} must remain private and non-publishable`);
}

try {
  const approval = JSON.parse(
    await readFile(path.join(repoRoot, 'docs/release-approval.json'), 'utf8'),
  );
  const registryDistribution = approval.registryDistribution;
  if (
    approval.status !== 'approved' ||
    approval.approvedBy !== 'founder' ||
    !approval.approvedAt ||
    approval.license !== 'MIT' ||
    approval.publicDistribution !== true ||
    JSON.stringify(approval.packages) !== JSON.stringify(approvedPackageNames) ||
    JSON.stringify(approval.excludedPackages) !== JSON.stringify(['@unisane/ui-docs']) ||
    approval.release?.version !== approvedVersion ||
    approval.release?.registry !== 'https://registry.npmjs.org/' ||
    approval.release?.tag !== 'latest' ||
    approval.release?.access !== 'public' ||
    approval.release?.provenanceRequired !== true ||
    registryDistribution?.model !== 'registry-first-dual-distribution' ||
    registryDistribution?.cliPackage !== standaloneCli.packageName ||
    registryDistribution?.cliExecutable !== standaloneCli.executable ||
    registryDistribution?.directInvocation !== standaloneCli.invocation ||
    registryDistribution?.consumerImportPrefix !== '@/components/ui' ||
    registryDistribution?.runtimeUiPackageRequired !== false
  ) {
    blockers.push('release approval does not match the registry-first stable public contract');
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
  `Registry-first release source readiness passed for ${approvedPackageNames.length} packages at ${approvedVersion}.`,
);
console.log(
  'Publishing still requires an authenticated @unisane owner and provenance-enabled npm execution.',
);
