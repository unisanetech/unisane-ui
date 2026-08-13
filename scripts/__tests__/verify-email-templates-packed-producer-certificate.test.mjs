import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  assertEmailPackedCandidate,
  buildCertificateSummary,
  collectBuildToolVersions,
  writeCertificateArtifact,
} from '../verify-email-templates-packed-producer-certificate.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'email-certificate-fixture-'));
  mkdirSync(path.join(root, 'dist'), { recursive: true });
  writeFileSync(
    path.join(root, 'dist/index.js'),
    'export const renderEmailTemplate = () => ({});\n',
  );
  writeFileSync(
    path.join(root, 'dist/index.d.ts'),
    'export declare const renderEmailTemplate: () => Record<string, never>;\n',
  );
  writeFileSync(path.join(root, 'unisane.meta.json'), '{}\n');
  writeFileSync(path.join(root, 'README.md'), '# Email templates\n');
  writeFileSync(path.join(root, 'LICENSE'), 'MIT License\n');
  return root;
}

function manifest(overrides = {}) {
  return {
    name: '@unisane/email-templates',
    version: '0.1.1',
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
      tag: 'latest',
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
    ...overrides,
  };
}

const entries = [
  'LICENSE',
  'README.md',
  'dist/index.d.ts',
  'dist/index.js',
  'package.json',
  'unisane.meta.json',
];

test('resolves build tools through package-local pnpm execution from repository root', () => {
  const pnpmLookup = spawnSync('/usr/bin/which', ['pnpm'], { encoding: 'utf8' });
  assert.equal(pnpmLookup.status, 0);
  const isolatedPath = [
    path.dirname(process.execPath),
    path.dirname(pnpmLookup.stdout.trim()),
    '/usr/bin',
    '/bin',
  ].join(path.delimiter);
  const isolatedEnvironment = { ...process.env, PATH: isolatedPath };

  for (const tool of ['tsc', 'tsc-alias']) {
    const bareProbe = spawnSync(tool, ['--version'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      env: isolatedEnvironment,
    });
    assert.equal(bareProbe.error?.code, 'ENOENT');
  }

  const versions = collectBuildToolVersions({ env: { PATH: isolatedPath } });
  assert.equal(versions.typescript, 'Version 5.9.2');
  const [tscAliasMajor, tscAliasMinor] = versions.tscAlias.split('.').map(Number);
  assert.equal(tscAliasMajor, 1);
  assert.ok(tscAliasMinor >= 8);
});

test('accepts the exact dependency-free email archive contract', () => {
  const root = fixture();
  try {
    const boundary = assertEmailPackedCandidate(manifest(), entries, root);
    assert.equal(boundary.ownedArchiveEntryCount, entries.length);
    assert.deepEqual(boundary.runtimeAssets, []);
    assert.equal(boundary.runtimeDependencyCount, 0);
    assert.equal(boundary.peerDependencyCount, 0);
    assert.equal(boundary.transitiveDependencyCount, 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects computed loaders and undeclared literal packages', () => {
  for (const source of [
    "const name = 'hidden-package'; void import(name);\n",
    "const name = 'hidden-package'; void require(name);\n",
    "const name = 'hidden-package'; void require.resolve(name);\n",
    "void import('hidden-package');\n",
  ]) {
    const root = fixture();
    try {
      writeFileSync(path.join(root, 'dist/index.js'), source);
      assert.throws(
        () => assertEmailPackedCandidate(manifest(), entries, root),
        /(?:nonliteral (?:import\(\)|require\(\)|require\.resolve\(\))|undeclared package references)/u,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test('rejects unexpected archive files, assets, local locators, and authority drift', () => {
  const cases = [
    {
      entries: [...entries, 'dist/private.js'],
      mutate(root) {
        writeFileSync(path.join(root, 'dist/private.js'), 'export const privateValue = true;\n');
      },
      manifest: manifest(),
      pattern: /unowned archive entries/u,
    },
    {
      entries: [...entries, 'dist/email.css'],
      mutate(root) {
        writeFileSync(path.join(root, 'dist/email.css'), '.email {}\n');
      },
      manifest: manifest(),
      pattern: /unexpectedly packs runtime CSS or assets/u,
    },
    {
      entries,
      manifest: manifest({ dependencies: { hidden: 'workspace:*' } }),
      pattern: /must keep dependencies empty/u,
    },
    {
      entries,
      manifest: manifest({ private: true }),
      pattern: /manifest field private drifted/u,
    },
  ];
  for (const fixtureCase of cases) {
    const root = fixture();
    try {
      fixtureCase.mutate?.(root);
      assert.throws(
        () => assertEmailPackedCandidate(fixtureCase.manifest, fixtureCase.entries, root),
        fixtureCase.pattern,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test('certificate records legal approval and keeps external execution gates false', () => {
  const artifactRoot = mkdtempSync(path.join(tmpdir(), 'email-certificate-artifact-'));
  const artifactPath = path.join(artifactRoot, 'packed-producer-certificate.json');
  const candidate = {
    manifest: manifest(),
    boundary: {
      exportTargetCount: 4,
      ownedArchiveEntryCount: entries.length,
      runtimeAssets: [],
    },
    bytes: 100,
    entries,
    contentDigest: 'a'.repeat(64),
    runArtifactSha256: 'b'.repeat(64),
    runArtifactIntegrity: 'sha512-test',
    buildTools: { typescript: 'Version 5.9.2', tscAlias: '1.8.10' },
  };
  const sourceIdentity = {
    producerGit: {
      revision: 'c'.repeat(40),
      repositoryTree: 'd'.repeat(40),
      packageTree: 'e'.repeat(40),
      certifiedPaths: ['producer'],
      inputDigest: 'f'.repeat(64),
    },
    consumerContract: {
      authority: 'standalone-target-owned',
      source: 'scripts/verify-email-templates-packed-producer-certificate.mjs',
    },
  };
  const summary = buildCertificateSummary(
    candidate,
    { specifier: '@unisane/email-templates', values: ['renderEmailTemplate'], types: [] },
    { cleanExternalRoot: true, sourceFallbacks: [] },
    sourceIdentity,
  );
  try {
    writeCertificateArtifact(summary, artifactPath);
    assert.deepEqual(JSON.parse(readFileSync(artifactPath, 'utf8')), summary);
    for (const gate of ['legalApproved', 'licenseApproved']) {
      assert.equal(summary[gate], true);
    }
    for (const gate of [
      'authorityCutoverAuthorized',
      'consumerConversionAuthorized',
      'publicationAuthorized',
      'registryApproved',
      'releaseAuthorized',
      'remoteAuthorized',
    ]) {
      assert.equal(summary[gate], false);
    }
    assert.deepEqual(summary.externalEffects, []);
    assert.match(summary.reproducibleIdentity.certificateInputDigest, /^[a-f0-9]{64}$/u);
  } finally {
    rmSync(artifactRoot, { recursive: true, force: true });
  }
});
