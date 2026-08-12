import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  EXTERNAL_CONSUMER_INSTALL_ARGS,
  assertConsumerCoverage,
  assertExternalConsumerLock,
  assertPackedManifest,
  buildCertificateSummary,
  collectConsumerImports,
  writeCertificateArtifact,
} from '../verify-packed-producer-certificate.mjs';

test('standalone consumer contract is target-owned and covers packed entry points', () => {
  const records = collectConsumerImports();
  assert.deepEqual([...new Set(records.map(({ packageName }) => packageName))].sort(), [
    '@unisane/data-table',
    '@unisane/tokens',
    '@unisane/ui',
  ]);
  assert.ok(records.every(({ file }) => file === 'certificate/consumer.tsx'));
  assert.ok(records.some(({ specifier }) => specifier === '@unisane/data-table/styles.css'));
  assert.ok(records.some(({ specifier }) => specifier === '@unisane/ui/button'));
  assert.ok(records.some(({ specifier }) => specifier === '@unisane/tokens/unisane.css'));
});

test('external consumer install is intrinsically offline and rejects source fallbacks', () => {
  assert.deepEqual(EXTERNAL_CONSUMER_INSTALL_ARGS, [
    'install',
    '--offline',
    '--ignore-workspace',
    '--config.shared-workspace-lockfile=false',
  ]);

  const packedTarballs = [
    'file:../tarballs/unisane-tokens-0.1.0.tgz',
    'file:../tarballs/unisane-ui-0.1.0.tgz',
    'file:../tarballs/unisane-data-table-0.1.0.tgz',
  ].join('\n');
  assert.doesNotThrow(() => assertExternalConsumerLock(packedTarballs));

  for (const fallback of [
    'workspace:*',
    'file:../packages/ui',
    'link:../packages/ui',
    'portal:../packages/ui',
    'file:../../Unisane/unisane-ui/packages/data-table',
    '../../unisane-ui/packages/tokens',
  ]) {
    assert.throws(() => assertExternalConsumerLock(fallback), /source fallback/u);
  }
});

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'ui-certificate-fixture-'));
  mkdirSync(path.join(root, 'dist'), { recursive: true });
  writeFileSync(path.join(root, 'dist/index.js'), 'export const Button = () => null;\n');
  writeFileSync(path.join(root, 'dist/index.d.ts'), 'export declare const Button: () => null;\n');
  return root;
}

const profile = {
  name: '@unisane/ui',
  allowedRoots: ['dist', 'package.json'],
};

function manifest(overrides = {}) {
  return {
    name: '@unisane/ui',
    version: '0.1.0',
    private: true,
    license: 'UNLICENSED',
    exports: {
      './button': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
      },
    },
    peerDependencies: { react: '^19' },
    ...overrides,
  };
}

test('accepts exact fail-closed packed package metadata and exports', () => {
  const root = fixture();
  try {
    const result = assertPackedManifest(
      profile,
      manifest(),
      ['dist/index.d.ts', 'dist/index.js', 'package.json'],
      root,
    );
    assert.equal(result.exportTargetCount, 2);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects local locators, missing targets, sibling references, and publication drift', () => {
  const root = fixture();
  try {
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest({ dependencies: { '@unisane/tokens': 'workspace:*' } }),
          ['dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /retains local dependency locators/u,
    );
    assert.throws(
      () => assertPackedManifest(profile, manifest(), ['dist/index.js', 'package.json'], root),
      /missing packed export targets/u,
    );
    writeFileSync(
      path.join(root, 'dist/index.js'),
      "export * from '../../../unisane-ui/source.js';\n",
    );
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest(),
          ['dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /(?:emitted sibling or local locator|path outside the packed archive)/u,
    );
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest({ private: false, license: 'MIT' }),
          ['dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /remain fail-closed/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects nonliteral emitted loaders and undeclared literal packages', () => {
  for (const expression of [
    'import(packageName)',
    'require(packageName)',
    'require.resolve(packageName)',
  ]) {
    const root = fixture();
    try {
      writeFileSync(
        path.join(root, 'dist/index.js'),
        `const packageName = 'hidden-package';\nvoid ${expression};\n`,
      );
      assert.throws(
        () =>
          assertPackedManifest(
            profile,
            manifest(),
            ['dist/index.d.ts', 'dist/index.js', 'package.json'],
            root,
          ),
        /nonliteral (?:import\(\)|require\(\)|require\.resolve\(\))/u,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  const root = fixture();
  try {
    writeFileSync(path.join(root, 'dist/index.js'), "void import('hidden-package');\n");
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest(),
          ['dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /emits undeclared package references/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rejects arbitrary dist and registry files outside exact archive ownership', () => {
  const root = fixture();
  try {
    writeFileSync(path.join(root, 'dist/stale-private.js'), 'export const secret = true;\n');
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest(),
          ['dist/index.d.ts', 'dist/index.js', 'dist/stale-private.js', 'package.json'],
          root,
        ),
      /unowned archive entries: dist\/stale-private\.js/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }

  const registryRoot = fixture();
  try {
    const registryEntries = [
      'registry/registry.json',
      'registry/registry-schema.json',
      'registry/tsconfig.json',
      'registry/styles/globals.css',
      ...[
        'black',
        'blue',
        'cyan',
        'green',
        'neutral',
        'orange',
        'pink',
        'purple',
        'red',
        'yellow',
      ].map((theme) => `registry/styles/themes/${theme}.css`),
    ];
    for (const entry of registryEntries) {
      const filePath = path.join(registryRoot, entry);
      mkdirSync(path.dirname(filePath), { recursive: true });
      writeFileSync(filePath, entry.endsWith('.json') ? '{"components":{}}\n' : '/* owned */\n');
    }
    mkdirSync(path.join(registryRoot, 'registry/private'), { recursive: true });
    writeFileSync(path.join(registryRoot, 'registry/private/stale.tsx'), 'export {};\n');
    assert.throws(
      () =>
        assertPackedManifest(
          { ...profile, allowedRoots: [...profile.allowedRoots, 'registry'] },
          manifest(),
          [
            'dist/index.d.ts',
            'dist/index.js',
            'package.json',
            ...registryEntries,
            'registry/private/stale.tsx',
          ],
          registryRoot,
        ),
      /unowned archive entries: registry\/private\/stale\.tsx/u,
    );
  } finally {
    rmSync(registryRoot, { recursive: true, force: true });
  }
});

test('rejects consumer subpaths absent from the packed export map', () => {
  const records = [
    {
      file: 'consumer.tsx',
      packageName: '@unisane/ui',
      specifier: '@unisane/ui/missing',
      types: [],
      values: ['Missing'],
    },
  ];
  assert.throws(
    () => assertConsumerCoverage(records, new Map([['@unisane/ui', manifest()]])),
    /absent from the packed export map/u,
  );
});

test('certificate summary keeps publication and consumer conversion unauthorized', () => {
  const sourceIdentity = {
    consumerContract: {
      authority: 'standalone-target-owned',
      digest: 'a'.repeat(64),
      source: 'scripts/verify-packed-producer-certificate.mjs',
    },
    producerGit: { revision: 'b'.repeat(40), tree: 'c'.repeat(40), paths: ['producer'] },
  };
  const summary = buildCertificateSummary(
    [
      {
        name: '@unisane/ui',
        manifest: manifest(),
        contentDigest: 'a'.repeat(64),
        runArtifactSha256: 'b'.repeat(64),
        runArtifactIntegrity: 'sha512-test',
        bytes: 1,
        entries: ['dist/index.js'],
        boundary: { exportTargetCount: 1 },
      },
    ],
    { importDeclarationCount: 1 },
    { runtimeModuleCount: 1 },
    sourceIdentity,
  );
  assert.equal(summary.publicationAuthorized, false);
  assert.equal(summary.consumerConversionAuthorized, false);
  assert.deepEqual(summary.externalEffects, []);
  assert.deepEqual(summary.sourceIdentity.consumerContract, sourceIdentity.consumerContract);
  assert.deepEqual(summary.sourceIdentity.producerGit, sourceIdentity.producerGit);
  assert.match(summary.sourceIdentity.producerContentDigest, /^[a-f0-9]{64}$/u);
});

test('persists the complete certificate summary beneath the isolated artifact root', () => {
  const artifactRoot = mkdtempSync(path.join(tmpdir(), 'ui-certificate-artifact-'));
  const summary = {
    schemaVersion: 1,
    sourceIdentity: {
      consumerContract: {
        authority: 'standalone-target-owned',
        digest: 'a'.repeat(64),
        source: 'scripts/verify-packed-producer-certificate.mjs',
      },
      producerGit: {
        revision: 'b'.repeat(40),
        tree: 'c'.repeat(40),
        paths: ['producer'],
      },
      producerContentDigest: 'd'.repeat(64),
      consumerImportDigest: 'e'.repeat(64),
      certificateInputDigest: 'f'.repeat(64),
    },
    artifacts: [{ name: '@unisane/ui', ownedArchiveEntryCount: 532 }],
    consumerImports: { importDeclarationCount: 395 },
    consumerProof: { runtimeModuleCount: 38 },
    externalEffects: [],
    publicationAuthorized: false,
    consumerConversionAuthorized: false,
  };
  try {
    const artifactPath = writeCertificateArtifact(summary, artifactRoot);
    assert.equal(
      artifactPath,
      path.join(artifactRoot, 'unisane-ui', 'packed-producer-certificate.json'),
    );
    assert.deepEqual(JSON.parse(readFileSync(artifactPath, 'utf8')), summary);
  } finally {
    rmSync(artifactRoot, { recursive: true, force: true });
  }
});
