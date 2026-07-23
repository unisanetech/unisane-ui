import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(testDir, '../..');
const registry = JSON.parse(
  await readFile(path.join(packageDir, 'registry', 'registry.json'), 'utf8'),
);
const packageJson = JSON.parse(await readFile(path.join(packageDir, 'package.json'), 'utf8'));

test('registry records complete representative local and npm dependency closure', () => {
  assert.deepEqual(registry.components.alert.registryDependencies, ['icon', 'typography', 'utils']);
  assert.deepEqual(registry.components.banner.registryDependencies, [
    'button',
    'icon',
    'icon-button',
    'surface',
    'text',
    'utils',
  ]);
  assert.deepEqual(registry.components.badge.registryDependencies, ['utils']);
  assert.deepEqual(registry.components.button.dependencies, ['class-variance-authority@^0.7.1']);
  assert.deepEqual(registry.components.button.registryDependencies, [
    'action-control',
    'action-size',
    'icon',
    'ripple',
    'utils',
  ]);
  assert.deepEqual(registry.components.checkbox.registryDependencies, [
    'ripple',
    'selection-control-size',
    'utils',
  ]);
  assert.deepEqual(registry.components.radio.registryDependencies, [
    'ripple',
    'selection-control-size',
    'utils',
  ]);
  assert.deepEqual(registry.components.switch.registryDependencies, ['utils']);
  assert.deepEqual(registry.components['segmented-button'].dependencies, []);
  assert.deepEqual(registry.components['segmented-button'].registryDependencies, [
    'action-size',
    'icon',
    'ripple',
    'use-controllable-state',
    'utils',
  ]);
  assert.deepEqual(registry.components.pagination.dependencies, []);
  assert.deepEqual(registry.components.pagination.registryDependencies, [
    'action-size',
    'icon',
    'ripple',
    'text',
    'utils',
  ]);
  assert.deepEqual(registry.components.stepper.dependencies, []);
  assert.deepEqual(registry.components.stepper.registryDependencies, [
    'icon',
    'ripple',
    'text',
    'utils',
  ]);
  assert.deepEqual(registry.components.divider.registryDependencies, ['utils']);
  assert.deepEqual(registry.components.list.registryDependencies, [
    'divider',
    'ripple',
    'typography',
    'utils',
  ]);
  assert.equal(registry.components['selection-controls'], undefined);
  assert.deepEqual(registry.components['text-field'].registryDependencies, [
    'field',
    'field-shell',
    'field-size',
    'utils',
  ]);
  assert.deepEqual(registry.components.field.registryDependencies, ['label', 'utils']);
  assert.deepEqual(registry.components.select.registryDependencies, [
    'field-shell',
    'field-size',
    'icon',
    'portal-layer',
    'use-controllable-state',
    'use-overlay-behavior',
    'utils',
  ]);
  assert.deepEqual(registry.components['select-field'].registryDependencies, [
    'field',
    'field-shell',
    'field-size',
    'select',
    'use-controllable-state',
    'utils',
  ]);
  assert.deepEqual(registry.components.toast.registryDependencies, [
    'button',
    'icon',
    'icon-button',
    'utils',
  ]);
  assert.deepEqual(registry.components.calendar.registryDependencies, [
    'icon',
    'icon-button',
    'ripple',
    'surface',
    'text',
    'utils',
  ]);
  assert.deepEqual(registry.components['date-input'].registryDependencies, [
    'field',
    'field-shell',
    'field-size',
    'use-controllable-state',
    'utils',
  ]);
  assert.deepEqual(registry.components['date-picker'].registryDependencies, [
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
  assert.deepEqual(registry.components['navigation-action'].registryDependencies, [
    'navigation-types',
    'use-controllable-state',
  ]);
  assert.deepEqual(registry.components['navigation-bar'].registryDependencies, [
    'navigation-action',
    'navigation-types',
    'navigation-visuals',
    'ripple',
    'utils',
  ]);
  assert.deepEqual(registry.components['navigation-rail'].registryDependencies, [
    'navigation-action',
    'navigation-types',
    'navigation-visuals',
    'ripple',
    'utils',
  ]);
  assert.deepEqual(registry.components['navigation-drawer'].registryDependencies, [
    'navigation-action',
    'navigation-types',
    'navigation-visuals',
    'ripple',
    'use-controllable-state',
    'use-overlay-behavior',
    'use-scroll-lock',
    'utils',
  ]);
  assert.equal(registry.components.navigation, undefined);
  assert.equal(registry.components['use-navigation-state'], undefined);
  assert.ok(registry.components.dialog.registryDependencies.includes('use-scroll-lock'));
  assert.ok(registry.components.dialog.registryDependencies.includes('use-controllable-state'));
  assert.deepEqual(registry.components['confirm-dialog'].registryDependencies, [
    'button',
    'dialog',
    'icon',
    'use-controllable-state',
  ]);
});

test('nested composites depend on external owners without treating their own files as items', () => {
  const sidebar = registry.components.sidebar;
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
  assert.equal(registry.components['sidebar-drawer'], undefined);
  assert.equal(registry.components['sidebar-provider'], undefined);
});

test('icon has one canonical component owner', () => {
  assert.deepEqual(registry.components.icon.files, ['components/icon.tsx']);
  assert.equal(registry.components.icon.type, 'components:ui');
  assert.ok(registry.components['icon-button'].registryDependencies.includes('icon'));
  assert.ok(registry.components.button.registryDependencies.includes('icon'));
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
  for (const owner of Object.keys(registry.components)) {
    if (
      registry.components[owner].type === 'components:ui' &&
      owner !== 'ripple' &&
      owner !== 'data-table'
    ) {
      assert.ok(packageJson.exports[`./${owner}`], `missing flat runtime export ./${owner}`);
    }
  }
  assert.equal(packageJson.exports['./ripple'], undefined);
});

test('DataTable installs as one dependency-complete local composite', () => {
  const dataTable = registry.components['data-table'];
  assert.equal(dataTable.type, 'components:ui');
  assert.ok(dataTable.files.includes('components/data-table/index.ts'));
  assert.ok(dataTable.files.includes('components/data-table/components/data-table.tsx'));
  assert.ok(dataTable.files.length > 100);
  assert.ok(dataTable.registryDependencies.includes('button'));
  assert.ok(dataTable.registryDependencies.includes('icon'));
  assert.ok(dataTable.registryDependencies.includes('utils'));
  assert.ok(
    dataTable.dependencies.some((dependency) => dependency.startsWith('@tanstack/react-virtual@')),
  );
});
