import assert from 'node:assert/strict';
import test from 'node:test';
import { validatePackedManifest } from '../verify-packed-producer-certificate.mjs';

const approval = {
  packages: ['@unisane/ui', '@unisane/tokens'],
  license: 'MIT',
  release: { version: '0.1.2-next.1', access: 'public', tag: 'next' },
};
const manifest = {
  name: '@unisane/ui',
  version: approval.release.version,
  private: false,
  license: 'MIT',
  publishConfig: { access: 'public', tag: 'next', provenance: true },
  exports: { '.': './dist/index.js' },
  dependencies: { '@unisane/tokens': approval.release.version },
};
const entries = ['package/package.json', 'package/LICENSE', 'package/dist/index.js'];
test('accepts the approved artifact with exact internal coordinates', () =>
  validatePackedManifest(manifest, approval, entries));
for (const [label, change] of [
  ['wrong version', { version: '0.1.1' }],
  ['unapproved package', { name: '@unisane/unknown' }],
  ['private artifact', { private: true }],
  ['wrong license', { license: 'UNLICENSED' }],
  ['missing provenance', { publishConfig: { access: 'public', tag: 'next' } }],
  ['local dependency', { dependencies: { '@unisane/tokens': 'workspace:*' } }],
  ['floating internal dependency', { dependencies: { '@unisane/tokens': '^0.1.2' } }],
  ['missing export', { exports: { '.': './dist/missing.js' } }],
])
  test(`rejects ${label}`, () =>
    assert.throws(() => validatePackedManifest({ ...manifest, ...change }, approval, entries)));
for (const entry of [
  'package/.env',
  'package/.npmrc',
  'package/../secret',
  'outside/file',
  'package/src/index.ts',
]) {
  test(`rejects unsafe archive entry ${entry}`, () =>
    assert.throws(() => validatePackedManifest(manifest, approval, [...entries, entry])));
}
test('requires the archive license', () =>
  assert.throws(() =>
    validatePackedManifest(
      manifest,
      approval,
      entries.filter((x) => !x.endsWith('/LICENSE')),
    ),
  ));
test('validates wildcard export coverage', () => {
  validatePackedManifest({ ...manifest, exports: { './*': './dist/*.js' } }, approval, entries);
  assert.throws(() =>
    validatePackedManifest(
      { ...manifest, exports: { './*': './missing/*.js' } },
      approval,
      entries,
    ),
  );
});
