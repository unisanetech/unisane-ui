import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  EXTERNAL_CONSUMER_INSTALL_ARGS,
  assertConsumerCoverage,
  assertConsumerSemanticContract,
  assertExternalConsumerLock,
  assertPackedManifest,
  buildCertificateSummary,
  buildConsumerSemanticInventory,
  collectConsumerImports,
  writeCertificateArtifact,
} from '../verify-packed-producer-certificate.mjs';

test('consumer contract ignores unrelated manifest content and rejects UI semantic drift', () => {
  const root = 'unisane-ops/apps/console';
  const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'ui-consumer-semantic-fixture-'));
  const opsMain = path.join(fixtureRoot, root, 'src/browser/main.tsx');
  const saaskitSource = path.join(fixtureRoot, 'unisane/starters/saaskit/src/page.tsx');
  mkdirSync(path.dirname(opsMain), { recursive: true });
  mkdirSync(path.dirname(saaskitSource), { recursive: true });
  writeFileSync(
    opsMain,
    "import '@unisane/ui/styles.css';\nimport '@unisane/data-table/styles.css';\nexport const engineLabel = 'old';\n",
  );
  writeFileSync(saaskitSource, "export const unrelatedContent = 'old';\n");
  const records = collectConsumerImports(fixtureRoot);
  const manifest = {
    name: '@unisane/ops-console',
    private: true,
    engines: { node: '>=18.17.0' },
    scripts: { build: 'old build' },
    dependencies: { '@unisane/ui': 'workspace:*', '@unisane/data-table': 'workspace:*' },
  };
  const manifests = new Map([
    ['unisane/starters/saaskit', { name: 'saaskit', private: true }],
    [root, manifest],
  ]);
  try {
    const expected = buildConsumerSemanticInventory(records, manifests);
    writeFileSync(
      opsMain,
      "import '@unisane/ui/styles.css';\nimport '@unisane/data-table/styles.css';\nexport const engineLabel = 'new';\n",
    );
    writeFileSync(saaskitSource, "export const unrelatedContent = 'new';\n");
    const unrelated = buildConsumerSemanticInventory(
      collectConsumerImports(fixtureRoot),
      new Map([
        ['unisane/starters/saaskit', { name: 'saaskit', private: true }],
        [
          root,
          {
            ...manifest,
            engines: { node: '>=22.12.0' },
            scripts: { build: 'new build', test: 'new test' },
            description: 'unrelated content',
          },
        ],
      ]),
    );
    assert.doesNotThrow(() => assertConsumerSemanticContract(unrelated, expected));

    const changedImport = buildConsumerSemanticInventory(
      records.map((record, index) =>
        index === 1 ? { ...record, specifier: '@unisane/data-table' } : record,
      ),
      manifests,
    );
    assert.throws(
      () => assertConsumerSemanticContract(changedImport, expected),
      /semantic inventory drifted/u,
    );

    for (const changedManifest of [
      { ...manifest, dependencies: { ...manifest.dependencies, '@unisane/ui': '0.1.0' } },
      { ...manifest, private: false },
    ]) {
      const changedCoordinate = buildConsumerSemanticInventory(
        records,
        new Map([
          ['unisane/starters/saaskit', { name: 'saaskit', private: true }],
          [root, changedManifest],
        ]),
      );
      assert.throws(
        () => assertConsumerSemanticContract(changedCoordinate, expected),
        /semantic inventory drifted/u,
      );
    }
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
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
    consumerImportBaseline: {
      revision: '4f9d4a637ab271351a4c7b677b11792490b1c791',
      tree: 'a'.repeat(40),
      paths: ['consumer'],
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
  assert.deepEqual(
    summary.sourceIdentity.consumerImportBaseline,
    sourceIdentity.consumerImportBaseline,
  );
  assert.deepEqual(summary.sourceIdentity.producerGit, sourceIdentity.producerGit);
  assert.match(summary.sourceIdentity.producerContentDigest, /^[a-f0-9]{64}$/u);
});

test('persists the complete certificate summary beneath the isolated artifact root', () => {
  const artifactRoot = mkdtempSync(path.join(tmpdir(), 'ui-certificate-artifact-'));
  const summary = {
    schemaVersion: 1,
    sourceIdentity: {
      consumerImportBaseline: {
        revision: '4f9d4a637ab271351a4c7b677b11792490b1c791',
        tree: 'a'.repeat(40),
        paths: ['consumer'],
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
