#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  ACTIVE_PNPM_STORE_DIRECTORY,
  assertPackedManifest,
} from './verify-packed-producer-certificate.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const producerDirectory = 'packages/email-templates';
const producerPackageRoot = path.join(repositoryRoot, producerDirectory);
const approvedPrereleaseVersion = '0.1.0-next.b67ebfd0';
const producerInputPaths = Object.freeze([
  `${producerDirectory}/LICENSE`,
  `${producerDirectory}/README.md`,
  `${producerDirectory}/package.json`,
  `${producerDirectory}/src`,
  `${producerDirectory}/tests`,
  `${producerDirectory}/tsconfig.json`,
  `${producerDirectory}/turbo.json`,
  `${producerDirectory}/unisane.meta.json`,
  `${producerDirectory}/vitest.config.ts`,
]);
const profile = Object.freeze({
  name: '@unisane/email-templates',
  allowedRoots: Object.freeze([
    'dist',
    'LICENSE',
    'package.json',
    'README.md',
    'unisane.meta.json',
  ]),
});
const runtimeAssetPattern =
  /\.(?:css|scss|sass|less|svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf)$/iu;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repositoryRoot,
    encoding: 'utf8',
    env: { ...process.env, ...options.env },
    stdio: options.capture === false ? 'inherit' : 'pipe',
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed (${result.status ?? 'signal'}).\n${result.error?.message || result.stderr || result.stdout || ''}`,
    );
  }
  return result.stdout ?? '';
}

function runProducerPackageTool(tool, args = [], options = {}) {
  return run('pnpm', ['--filter', profile.name, 'exec', tool, ...args], options);
}

export function collectBuildToolVersions(options = {}) {
  return {
    typescript: runProducerPackageTool('tsc', ['--version'], options).trim(),
    tscAlias: runProducerPackageTool('tsc-alias', ['--version'], options).trim(),
  };
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
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

function sha256File(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function integritySha512(filePath) {
  return `sha512-${createHash('sha512').update(readFileSync(filePath)).digest('base64')}`;
}

function archiveEntries(tarballPath) {
  return run('tar', ['-tzf', tarballPath])
    .split('\n')
    .filter(Boolean)
    .map((entry) => entry.replace(/^package\//u, '').replace(/\/$/u, ''))
    .filter(Boolean)
    .sort();
}

function archiveContentDigest(entries, extractedRoot) {
  return hashValue(
    entries.map((entry) => ({
      path: entry,
      sha256: sha256File(path.join(extractedRoot, entry)),
    })),
  );
}

function trackedInputDigest(revision, paths) {
  const records = [];
  for (const relativePath of paths) {
    const output = run('git', ['ls-tree', '-r', '--name-only', revision, '--', relativePath]);
    for (const entry of output.split('\n').filter(Boolean)) {
      records.push({
        path: entry,
        sha256: createHash('sha256')
          .update(run('git', ['show', `${revision}:${entry}`]))
          .digest('hex'),
      });
    }
  }
  return hashValue(records.sort((left, right) => left.path.localeCompare(right.path)));
}

function assertPathsMatchRevision(revision, paths, label) {
  const result = spawnSync('git', ['diff', '--quiet', revision, '--', ...paths], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (result.status !== 0) {
    throw new Error(`${label} do not match immutable revision ${revision}.`);
  }
}

function assertExactManifestContract(manifest) {
  const exactFields = {
    name: '@unisane/email-templates',
    version: approvedPrereleaseVersion,
    description: 'Provider-neutral HTML and text email presentation for Unisane products',
    private: false,
    type: 'module',
    sideEffects: false,
    files: ['dist', 'unisane.meta.json'],
    main: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
        default: './dist/index.js',
      },
      './meta': './unisane.meta.json',
    },
    license: 'MIT',
    publishConfig: {
      access: 'public',
      provenance: true,
      tag: 'next',
    },
    repository: {
      type: 'git',
      url: 'https://github.com/unisanetech/unisane-ui.git',
      directory: 'packages/email-templates',
    },
    engines: { node: '>=22.0.0' },
    scripts: {
      build:
        'pnpm clean && tsc -p tsconfig.json && tsc-alias -p tsconfig.json --resolve-full-paths --resolve-full-extension .js',
      'check-types': 'tsc --noEmit',
      clean: 'node ../../scripts/clean-package-output.mjs',
      lint: 'eslint src tests --max-warnings 0',
      test: 'vitest run',
      'test:run': 'vitest run',
    },
  };
  for (const [field, expected] of Object.entries(exactFields)) {
    if (hashValue(manifest[field]) !== hashValue(expected)) {
      throw new Error(`@unisane/email-templates manifest field ${field} drifted.`);
    }
  }
  for (const field of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
    if (Object.keys(manifest[field] ?? {}).length > 0) {
      throw new Error(`@unisane/email-templates must keep ${field} empty.`);
    }
  }
}

export function assertEmailPackedCandidate(manifest, entries, extractedRoot) {
  const runtimeAssets = entries.filter((entry) => runtimeAssetPattern.test(entry));
  if (runtimeAssets.length > 0) {
    throw new Error(
      `@unisane/email-templates unexpectedly packs runtime CSS or assets: ${runtimeAssets.join(', ')}`,
    );
  }
  assertExactManifestContract(manifest);
  const boundary = assertPackedManifest(profile, manifest, entries, extractedRoot);
  return {
    ...boundary,
    runtimeAssets,
    runtimeDependencyCount: 0,
    peerDependencyCount: 0,
    transitiveDependencyCount: 0,
  };
}

function buildAndPack(workRoot) {
  const tarballRoot = path.join(workRoot, 'tarballs');
  const extractedRoot = path.join(workRoot, 'extracted');
  mkdirSync(tarballRoot, { recursive: true });
  mkdirSync(extractedRoot, { recursive: true });
  const buildTools = collectBuildToolVersions();
  run('pnpm', ['--filter', '@unisane/email-templates', 'build']);
  run('pnpm', ['--filter', '@unisane/email-templates', 'pack', '--pack-destination', tarballRoot]);
  const tarballName = readdirSync(tarballRoot).find(
    (entry) => entry === `unisane-email-templates-${approvedPrereleaseVersion}.tgz`,
  );
  if (!tarballName) {
    throw new Error(
      `Missing packed @unisane/email-templates ${approvedPrereleaseVersion} archive.`,
    );
  }
  const tarballPath = path.join(tarballRoot, tarballName);
  run('tar', ['-xzf', tarballPath, '-C', extractedRoot, '--strip-components=1']);
  const entries = archiveEntries(tarballPath);
  const manifest = readJson(path.join(extractedRoot, 'package.json'));
  const boundary = assertEmailPackedCandidate(manifest, entries, extractedRoot);
  return {
    boundary,
    buildTools,
    bytes: statSync(tarballPath).size,
    contentDigest: archiveContentDigest(entries, extractedRoot),
    entries,
    manifest,
    runArtifactIntegrity: integritySha512(tarballPath),
    runArtifactSha256: sha256File(tarballPath),
    tarballPath,
  };
}

function collectStandaloneConsumerImport() {
  return {
    specifier: '@unisane/email-templates',
    values: ['EMAIL_TEMPLATE_NAMES', 'renderEmailTemplate'],
    types: ['EmailTemplateBrand'],
  };
}

function verifyExternalConsumer(workRoot, candidate) {
  const fixtureRoot = path.join(workRoot, 'consumer');
  mkdirSync(fixtureRoot, { recursive: true });
  writeJson(path.join(fixtureRoot, 'package.json'), {
    name: 'email-templates-packed-certificate-consumer',
    version: '0.0.0',
    private: true,
    type: 'module',
    dependencies: {
      '@unisane/email-templates': `file:${candidate.tarballPath}`,
    },
    packageManager: 'pnpm@10.26.0',
  });
  writeJson(path.join(fixtureRoot, 'tsconfig.json'), {
    compilerOptions: {
      strict: true,
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      skipLibCheck: false,
      noEmit: true,
    },
    include: ['consumer.ts'],
  });
  writeFileSync(
    path.join(fixtureRoot, 'consumer.ts'),
    `import { EMAIL_TEMPLATE_NAMES, renderEmailTemplate, type EmailTemplateBrand } from '@unisane/email-templates';\nconst brand: EmailTemplateBrand = { name: 'Packed Consumer' };\nconst output = renderEmailTemplate({ template: EMAIL_TEMPLATE_NAMES.AUTH_MAGIC_LINK, brand, props: { url: 'https://example.invalid/sign-in', ttlSec: 900 } });\nvoid output;\n`,
  );
  writeFileSync(
    path.join(fixtureRoot, 'runtime-check.mjs'),
    `import { EMAIL_TEMPLATE_NAMES, renderEmailTemplate } from '@unisane/email-templates';\nconst rendered = renderEmailTemplate({ template: EMAIL_TEMPLATE_NAMES.AUTH_MAGIC_LINK, brand: { name: 'Packed Consumer' }, props: { url: 'https://example.invalid/sign-in', ttlSec: 900 } });\nif (!rendered.html.includes('<!doctype html>')) throw new Error('Packed HTML rendering failed.');\nif (!rendered.text.includes('https://example.invalid/sign-in')) throw new Error('Packed text rendering failed.');\nif (rendered.subject.length === 0) throw new Error('Packed subject rendering failed.');\nconsole.log(JSON.stringify({ html: true, text: true, subject: true }));\n`,
  );
  run(
    'pnpm',
    [
      'install',
      '--offline',
      '--ignore-workspace',
      '--config.shared-workspace-lockfile=false',
      `--store-dir=${ACTIVE_PNPM_STORE_DIRECTORY}`,
    ],
    { cwd: fixtureRoot },
  );
  const lockPath = path.join(fixtureRoot, 'pnpm-lock.yaml');
  const lock = readFileSync(lockPath, 'utf8');
  if (
    /workspace:|link:|portal:|(?:\.\.\/)+(?:Unisane|unisane-ui)|packages\/email-templates/u.test(
      lock,
    )
  ) {
    throw new Error(
      'External consumer lock retained a workspace, link, portal, or sibling-source fallback.',
    );
  }
  const installedRoot = realpathSync(
    path.join(fixtureRoot, 'node_modules', '@unisane', 'email-templates'),
  );
  if (!installedRoot.startsWith(realpathSync(fixtureRoot))) {
    throw new Error('@unisane/email-templates resolved outside the disposable consumer.');
  }
  const installedManifest = readJson(path.join(installedRoot, 'package.json'));
  assertExactManifestContract(installedManifest);
  runProducerPackageTool('tsc', ['-p', path.join(fixtureRoot, 'tsconfig.json')]);
  const runtime = JSON.parse(run('node', ['runtime-check.mjs'], { cwd: fixtureRoot }).trim());
  const installedEntries = run('find', ['.', '-type', 'f'], { cwd: installedRoot })
    .split('\n')
    .filter(Boolean)
    .map((entry) => entry.replace(/^\.\//u, ''))
    .sort();
  if (hashValue(installedEntries) !== hashValue(candidate.entries)) {
    throw new Error('Installed package contents differ from the certified packed archive.');
  }
  return {
    cleanExternalRoot: true,
    installMode: 'offline-local-packed-archive',
    installedArchiveContentExact: true,
    sourceFallbacks: [],
    lockSha256: sha256File(lockPath),
    declarationCompile: true,
    runtimeRender: runtime,
    peerDependencies: [],
    transitiveDependencies: [],
  };
}

function collectSourceIdentity() {
  const producerRevision = run('git', ['rev-parse', 'HEAD']).trim();
  assertPathsMatchRevision(producerRevision, producerInputPaths, 'Producer inputs');
  return {
    producerGit: {
      revision: producerRevision,
      repositoryTree: run('git', ['rev-parse', `${producerRevision}^{tree}`]).trim(),
      packageTree: run('git', ['rev-parse', `${producerRevision}:${producerDirectory}`]).trim(),
      certifiedPaths: producerInputPaths,
      inputDigest: trackedInputDigest(producerRevision, producerInputPaths),
    },
    consumerContract: {
      authority: 'standalone-target-owned',
      source: 'scripts/verify-email-templates-packed-producer-certificate.mjs',
    },
  };
}

export function buildCertificateSummary(candidate, consumerImport, consumerProof, sourceIdentity) {
  const reproducibleIdentity = {
    archiveContentDigest: candidate.contentDigest,
    consumerImportDigest: hashValue(consumerImport),
    producerInputDigest: sourceIdentity.producerGit.inputDigest,
  };
  return {
    schemaVersion: 1,
    certificate: '@unisane/email-templates-packed-producer',
    sourceIdentity,
    reproducibleIdentity: {
      ...reproducibleIdentity,
      certificateInputDigest: hashValue(reproducibleIdentity),
    },
    artifact: {
      name: candidate.manifest.name,
      version: candidate.manifest.version,
      private: candidate.manifest.private,
      license: candidate.manifest.license,
      bytes: candidate.bytes,
      fileCount: candidate.entries.length,
      exportTargetCount: candidate.boundary.exportTargetCount,
      ownedArchiveEntryCount: candidate.boundary.ownedArchiveEntryCount,
      runtimeDependencies: [],
      peerDependencies: [],
      transitiveDependencies: [],
      runtimeAssets: candidate.boundary.runtimeAssets,
      buildTools: candidate.buildTools,
      archiveContentDigest: candidate.contentDigest,
      runArtifactSha256: candidate.runArtifactSha256,
      runArtifactIntegrity: candidate.runArtifactIntegrity,
    },
    consumerImport,
    consumerProof,
    unresolvedGates: [
      'authority-cutover',
      'consumer-conversion',
      'authenticated-publisher',
      'publication',
      'registry',
      'release',
      'remote',
    ],
    authorityCutoverAuthorized: false,
    consumerConversionAuthorized: false,
    legalApproved: true,
    licenseApproved: true,
    publicationAuthorized: false,
    registryApproved: false,
    releaseAuthorized: false,
    remoteAuthorized: false,
    externalEffects: [],
  };
}

export function writeCertificateArtifact(
  summary,
  artifactPath = path.join(producerPackageRoot, 'certificates', 'packed-producer-certificate.json'),
) {
  writeJson(artifactPath, summary);
  return artifactPath;
}

export function main() {
  const workRoot = mkdtempSync(path.join(tmpdir(), 'email-templates-packed-certificate-'));
  try {
    const sourceIdentity = collectSourceIdentity();
    const consumerImport = collectStandaloneConsumerImport();
    const candidate = buildAndPack(workRoot);
    const consumerProof = verifyExternalConsumer(workRoot, candidate);
    const summary = buildCertificateSummary(
      candidate,
      consumerImport,
      consumerProof,
      sourceIdentity,
    );
    const artifactPath = writeCertificateArtifact(summary);
    console.log(
      JSON.stringify(
        { artifactPath: path.relative(repositoryRoot, artifactPath), ...summary },
        null,
        2,
      ),
    );
  } finally {
    if (existsSync(workRoot)) rmSync(workRoot, { recursive: true, force: true });
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) main();
