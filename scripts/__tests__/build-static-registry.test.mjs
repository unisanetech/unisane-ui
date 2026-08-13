import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  buildStaticRegistry,
  isSafeRegistryPath,
  toHostedContent,
  toHostedTarget,
  verifyStaticRegistry,
} from '../build-static-registry.mjs';

test('builds one deterministic content-bearing file for every canonical registry item', async (context) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'unisane-registry-build-test-'));
  context.after(() => fs.rm(root, { recursive: true, force: true }));
  const first = path.join(root, 'first');
  const second = path.join(root, 'second');

  const firstResult = await buildStaticRegistry({ outputDirectory: first });
  const secondResult = await buildStaticRegistry({ outputDirectory: second });
  const verified = await verifyStaticRegistry(first, firstResult.manifest.baseUrl);

  assert.equal(verified.itemCount, 94);
  assert.deepEqual(firstResult.manifest, secondResult.manifest);
  const button = JSON.parse(await fs.readFile(path.join(first, 'r/button.json'), 'utf8'));
  assert.equal(button.$schema, 'https://ui.shadcn.com/schema/registry-item.json');
  assert.ok(button.files.every((file) => file.content.length > 0));
  assert.ok(
    button.files.every((file) => file.target.startsWith('@ui/') || file.target.startsWith('@lib/')),
  );
  assert.ok(
    button.registryDependencies.every((dependency) =>
      dependency.startsWith('https://ui.unisane.com/r/'),
    ),
  );
  const index = await fs.readFile(path.join(first, 'index.html'), 'utf8');
  assert.match(index, /href="r\/registry\.json"/u);
  assert.doesNotMatch(index, /href="\/r\//u);
});

test('converts only supported project-owned aliases and rejects path traversal', () => {
  assert.equal(toHostedTarget('components/ui/button.tsx'), '@ui/button.tsx');
  assert.equal(toHostedTarget('types/navigation.ts'), '@lib/types/navigation.ts');
  assert.equal(
    toHostedContent("import type { NavigationItem } from '@/types/navigation';"),
    "import type { NavigationItem } from '@lib/types/navigation';",
  );
  assert.equal(isSafeRegistryPath('../secret.ts'), false);
  assert.equal(isSafeRegistryPath('components/section/../secret.ts'), false);
  assert.throws(() => toHostedTarget('/tmp/secret.ts'), /Unsafe registry target/u);
  assert.throws(() => toHostedTarget('public/secret.ts'), /Unsupported registry target/u);
});
