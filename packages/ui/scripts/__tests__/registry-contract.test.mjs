import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'vitest';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(testDir, '../..');
const registry = JSON.parse(
  await readFile(path.join(packageDir, 'registry', 'registry.json'), 'utf8'),
);
const components = Object.fromEntries(
  registry.items.map((item) => [
    item.name,
    { ...item, files: item.files.map((file) => file.path) },
  ]),
);
const packageJson = JSON.parse(await readFile(path.join(packageDir, 'package.json'), 'utf8'));

test('registry records complete representative local and npm dependency closure', () => {
  assert.deepEqual(components.alert.registryDependencies, ['icon', 'typography', 'utils']);
  assert.deepEqual(components.banner.registryDependencies, [
    'button',
    'icon',
    'icon-button',
    'surface',
    'text',
    'utils',
  ]);
  assert.deepEqual(components.badge.registryDependencies, ['utils']);
  assert.deepEqual(components.button.dependencies, ['class-variance-authority@^0.7.1']);
  assert.deepEqual(components.button.registryDependencies, [
    'action-control',
    'action-size',
    'icon',
    'ripple',
    'utils',
  ]);
  assert.deepEqual(components.checkbox.registryDependencies, [
    'ripple',
    'selection-control-size',
    'utils',
  ]);
  assert.deepEqual(components.radio.registryDependencies, [
    'ripple',
    'selection-control-size',
    'utils',
  ]);
  assert.deepEqual(components.switch.registryDependencies, ['utils']);
  assert.deepEqual(components['segmented-button'].dependencies, []);
  assert.deepEqual(components['segmented-button'].registryDependencies, [
    'action-size',
    'icon',
    'ripple',
    'use-controllable-state',
    'utils',
  ]);
  assert.deepEqual(components.pagination.dependencies, []);
  assert.deepEqual(components.pagination.registryDependencies, [
    'action-size',
    'icon',
    'ripple',
    'text',
    'utils',
  ]);
  assert.deepEqual(components.stepper.dependencies, []);
  assert.deepEqual(components.stepper.registryDependencies, ['icon', 'ripple', 'text', 'utils']);
  assert.deepEqual(components.divider.registryDependencies, ['utils']);
  assert.deepEqual(components.list.registryDependencies, [
    'divider',
    'ripple',
    'typography',
    'utils',
  ]);
  assert.equal(components['selection-controls'], undefined);
  assert.deepEqual(components['text-field'].registryDependencies, [
    'field',
    'field-shell',
    'field-size',
    'utils',
  ]);
  assert.deepEqual(components.field.registryDependencies, ['label', 'utils']);
  assert.deepEqual(components.select.registryDependencies, [
    'field-shell',
    'field-size',
    'icon',
    'portal-layer',
    'use-controllable-state',
    'use-overlay-behavior',
    'utils',
  ]);
  assert.deepEqual(components['select-field'].registryDependencies, [
    'field',
    'field-shell',
    'field-size',
    'select',
    'use-controllable-state',
    'utils',
  ]);
  assert.deepEqual(components.toast.registryDependencies, [
    'button',
    'icon',
    'icon-button',
    'utils',
  ]);
  assert.deepEqual(components.calendar.registryDependencies, [
    'icon',
    'icon-button',
    'ripple',
    'surface',
    'text',
    'utils',
  ]);
  assert.deepEqual(components['date-input'].registryDependencies, [
    'field',
    'field-shell',
    'field-size',
    'use-controllable-state',
    'utils',
  ]);
  assert.deepEqual(components['date-picker'].registryDependencies, [
    'calendar',
    'date-input',
    'icon',
    'icon-button',
    'portal-layer',
    'use-anchored-overlay-position',
    'use-controllable-state',
    'use-overlay-behavior',
    'utils',
  ]);
  assert.deepEqual(components['navigation-action'].registryDependencies, [
    'navigation-types',
    'use-controllable-state',
  ]);
  assert.deepEqual(components['navigation-bar'].registryDependencies, [
    'navigation-action',
    'navigation-types',
    'navigation-visuals',
    'ripple',
    'utils',
  ]);
  assert.deepEqual(components['navigation-rail'].registryDependencies, [
    'navigation-action',
    'navigation-types',
    'navigation-visuals',
    'ripple',
    'utils',
  ]);
  assert.deepEqual(components['navigation-drawer'].registryDependencies, [
    'navigation-action',
    'navigation-types',
    'navigation-visuals',
    'ripple',
    'use-controllable-state',
    'use-overlay-behavior',
    'use-scroll-lock',
    'utils',
  ]);
  assert.equal(components.navigation, undefined);
  assert.equal(components['use-navigation-state'], undefined);
  assert.ok(components.dialog.registryDependencies.includes('use-scroll-lock'));
  assert.ok(components.dialog.registryDependencies.includes('use-controllable-state'));
  assert.deepEqual(components['confirm-dialog'].registryDependencies, [
    'button',
    'dialog',
    'icon',
    'use-controllable-state',
  ]);
});

test('nested composites depend on external owners without treating their own files as items', () => {
  const sidebar = components.sidebar;
  assert.ok(sidebar.files.includes('components/sidebar/components/sidebar-drawer.tsx'));
  assert.ok(sidebar.files.includes('components/sidebar/components/sidebar-navigation.tsx'));
  assert.equal(sidebar.files.length, 9);
  assert.deepEqual(sidebar.registryDependencies, [
    'icon',
    'navigation-action',
    'navigation-rail',
    'navigation-types',
    'navigation-visuals',
    'ripple',
    'use-controllable-state',
    'use-overlay-behavior',
    'use-scroll-lock',
    'utils',
  ]);
  assert.equal(components['sidebar-drawer'], undefined);
  assert.equal(components['sidebar-provider'], undefined);
});

test('icon has one canonical component owner', () => {
  assert.deepEqual(components.icon.files, ['components/icon.tsx']);
  assert.equal(components.icon.type, 'registry:ui');
  assert.ok(components['icon-button'].registryDependencies.includes('icon'));
  assert.ok(components.button.registryDependencies.includes('icon'));
});

test('runtime package exposes canonical flat component subpaths', () => {
  const subpaths = Object.keys(packageJson.exports);
  assert.equal(packageJson.exports['.'], undefined);
  assert.equal(
    subpaths.some((subpath) => subpath.includes('*')),
    false,
  );
  assert.equal(
    subpaths.some((subpath) => /^\.\/(components|primitives|layout|hooks|lib)\//.test(subpath)),
    false,
  );
  for (const owner of Object.keys(components)) {
    if (
      components[owner].files.some((file) => file.startsWith('components/')) &&
      owner !== 'ripple'
    ) {
      assert.ok(packageJson.exports[`./${owner}`], `missing flat runtime export ./${owner}`);
    }
  }
  assert.equal(packageJson.exports['./ripple'], undefined);
});
