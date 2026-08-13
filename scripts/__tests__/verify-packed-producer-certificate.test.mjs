import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  EXTERNAL_CONSUMER_INSTALL_ARGS,
  PACKED_CONSUMER_LOCK_PATH,
  assertConsumerCoverage,
  assertExternalConsumerLock,
  assertFrozenExternalConsumerLock,
  assertPackedManifest,
  buildCertificateSummary,
  collectConsumerImports,
  resolveOwnedDependencyVersions,
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
  assert.deepEqual(EXTERNAL_CONSUMER_INSTALL_ARGS.slice(0, 5), [
    'install',
    '--offline',
    '--frozen-lockfile',
    '--ignore-workspace',
    '--config.shared-workspace-lockfile=false',
  ]);
  const storeArgument = EXTERNAL_CONSUMER_INSTALL_ARGS.at(-1);
  assert.match(storeArgument, /^--store-dir=.+/u);
  assert.equal(path.isAbsolute(storeArgument.slice('--store-dir='.length)), true);

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

  const targetRoot = mkdtempSync(path.join(tmpdir(), 'ui-owner-resolution-'));
  const ownerRoot = path.join(targetRoot, 'packages/ui');
  const rootHoist = path.join(targetRoot, 'node_modules/react');
  const ownerInstall = path.join(ownerRoot, 'node_modules/react');
  const escapedInstall = mkdtempSync(path.join(tmpdir(), 'ui-owner-escape-'));
  const writeManifest = (filePath, value) => {
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(filePath, `${JSON.stringify(value)}\n`);
  };
  try {
    writeManifest(path.join(ownerRoot, 'package.json'), {
      name: '@unisane/ui',
      peerDependencies: { react: '^19' },
    });
    writeManifest(path.join(rootHoist, 'package.json'), { name: 'react', version: '99.0.0' });
    writeManifest(path.join(ownerInstall, 'package.json'), { name: 'react', version: '19.2.8' });
    const contract = [{ field: 'peerDependencies', name: 'react' }];
    assert.deepEqual(resolveOwnedDependencyVersions({ targetRoot, contracts: contract }), {
      react: '19.2.8',
    });

    writeManifest(path.join(ownerRoot, 'package.json'), {
      name: '@unisane/ui',
      peerDependencies: { react: '^18' },
    });
    assert.throws(
      () => resolveOwnedDependencyVersions({ targetRoot, contracts: contract }),
      /does not satisfy/u,
    );

    writeManifest(path.join(ownerRoot, 'package.json'), {
      name: '@unisane/ui',
      peerDependencies: { react: '^19' },
    });
    rmSync(ownerInstall, { recursive: true, force: true });
    writeManifest(path.join(escapedInstall, 'package.json'), {
      name: 'react',
      version: '19.2.8',
    });
    symlinkSync(escapedInstall, ownerInstall, 'dir');
    assert.throws(
      () => resolveOwnedDependencyVersions({ targetRoot, contracts: contract }),
      /outside the standalone target/u,
    );
  } finally {
    rmSync(targetRoot, { recursive: true, force: true });
    rmSync(escapedInstall, { recursive: true, force: true });
  }
});

test('frozen external consumer lock is exact, portable, and source-owned', () => {
  const lock = readFileSync(PACKED_CONSUMER_LOCK_PATH, 'utf8');
  assert.doesNotThrow(() => assertFrozenExternalConsumerLock(lock));
  assert.match(lock, /file:\.\.\/tarballs\/unisane-ui-0\.1\.0\.tgz/u);
  assert.doesNotMatch(lock, /\/(?:Users|private|var)\//u);
  const resolutionLines = lock.match(/^    resolution: \{.*\}$/gmu) ?? [];
  const packedTarballResolutionLines = resolutionLines.filter((line) =>
    line.includes('tarball: file:../tarballs/unisane-'),
  );
  assert.equal(packedTarballResolutionLines.length, 3);
  assert.ok(
    packedTarballResolutionLines.every(
      (line) => line.startsWith('    resolution: {tarball: ') && !line.includes('integrity:'),
    ),
  );
  assert.ok(
    resolutionLines
      .filter((line) => !line.includes('tarball: file:../tarballs/unisane-'))
      .every((line) => line.includes('integrity: sha512-')),
  );
  assert.throws(
    () =>
      assertFrozenExternalConsumerLock(
        lock.replace(
          'resolution: {tarball: file:../tarballs/unisane-ui-0.1.0.tgz}',
          'resolution: {integrity: sha512-forged, tarball: file:../tarballs/unisane-ui-0.1.0.tgz}',
        ),
      ),
    /omit host-specific integrity/u,
  );
  assert.throws(
    () =>
      assertFrozenExternalConsumerLock(
        lock.replace(/^    resolution: \{integrity: sha512-[^\n]+\}$/mu, '    resolution: {}'),
      ),
    /Registry package resolutions must retain/u,
  );
  assert.throws(
    () =>
      assertFrozenExternalConsumerLock(
        lock.replace("lockfileVersion: '9.0'", "lockfileVersion: '8.0'"),
      ),
    /lock drifted/u,
  );
});

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'ui-certificate-fixture-'));
  mkdirSync(path.join(root, 'dist'), { recursive: true });
  writeFileSync(path.join(root, 'dist/index.js'), 'export const Button = () => null;\n');
  writeFileSync(path.join(root, 'dist/index.d.ts'), 'export declare const Button: () => null;\n');
  writeFileSync(path.join(root, 'LICENSE'), 'MIT License\n');
  return root;
}

const profile = {
  name: '@unisane/ui',
  allowedRoots: ['dist', 'LICENSE', 'package.json'],
};

function manifest(overrides = {}) {
  return {
    name: '@unisane/ui',
    version: '0.1.0',
    private: false,
    license: 'MIT',
    publishConfig: { access: 'public', provenance: true, tag: 'latest' },
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

test('accepts exact approved stable public metadata and exports', () => {
  const root = fixture();
  try {
    const result = assertPackedManifest(
      profile,
      manifest(),
      ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json'],
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
          ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /retains local dependency locators/u,
    );
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest(),
          ['LICENSE', 'dist/index.js', 'package.json'],
          root,
        ),
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
          ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /(?:emitted sibling or local locator|path outside the packed archive)/u,
    );
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest({ private: true }),
          ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /approved stable public metadata drifted/u,
    );
    assert.throws(
      () =>
        assertPackedManifest(
          profile,
          manifest(),
          ['dist/index.d.ts', 'dist/index.js', 'package.json'],
          root,
        ),
      /must include its MIT LICENSE/u,
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
            ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json'],
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
          ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json'],
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
          ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'dist/stale-private.js', 'package.json'],
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
      'registry/components/button.tsx',
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
      const content =
        entry === 'registry/registry.json'
          ? '{"items":[{"files":[{"path":"components/button.tsx"}]}]}\n'
          : entry.endsWith('.json')
            ? '{}\n'
            : '/* owned */\n';
      writeFileSync(filePath, content);
    }
    assert.doesNotThrow(() =>
      assertPackedManifest(
        { ...profile, allowedRoots: [...profile.allowedRoots, 'registry'] },
        manifest(),
        ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json', ...registryEntries],
        registryRoot,
      ),
    );
    mkdirSync(path.join(registryRoot, 'registry/private'), { recursive: true });
    writeFileSync(path.join(registryRoot, 'registry/private/stale.tsx'), 'export {};\n');
    assert.throws(
      () =>
        assertPackedManifest(
          { ...profile, allowedRoots: [...profile.allowedRoots, 'registry'] },
          manifest(),
          [
            'LICENSE',
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
    writeFileSync(path.join(registryRoot, 'registry/registry.json'), '{"components":{}}\n');
    assert.throws(
      () =>
        assertPackedManifest(
          { ...profile, allowedRoots: [...profile.allowedRoots, 'registry'] },
          manifest(),
          ['LICENSE', 'dist/index.d.ts', 'dist/index.js', 'package.json', ...registryEntries],
          registryRoot,
        ),
      /must declare the Shadcn item array/u,
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

test('certificate summary records legal approval while external execution stays blocked', () => {
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
  assert.equal(summary.legalApproved, true);
  assert.equal(summary.licenseApproved, true);
  assert.equal(summary.registryApproved, false);
  assert.equal(summary.releaseAuthorized, false);
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
