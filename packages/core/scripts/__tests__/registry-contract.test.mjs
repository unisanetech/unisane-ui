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
  for (const subpath of [
    './appearance-provider',
    './alert',
    './banner',
    './badge',
    './button',
    './calendar',
    './checkbox',
    './confirm-dialog',
    './dialog',
    './divider',
    './date-input',
    './date-picker',
    './field',
    './icon',
    './list',
    './navigation',
    './navigation-bar',
    './navigation-drawer',
    './navigation-rail',
    './radio',
    './segmented-button',
    './select',
    './select-field',
    './sidebar',
    './surface',
    './switch',
    './text-field',
    './toast',
  ]) {
    assert.ok(packageJson.exports[subpath], `missing flat runtime export ${subpath}`);
  }

  assert.equal(packageJson.exports['./components/icon'], null);
  assert.equal(packageJson.exports['./components/alert'], null);
  assert.equal(packageJson.exports['./components/banner'], null);
  assert.equal(packageJson.exports['./components/badge'], null);
  assert.equal(packageJson.exports['./components/checkbox'], null);
  assert.equal(packageJson.exports['./components/radio'], null);
  assert.equal(packageJson.exports['./components/segmented-button'], null);
  assert.equal(packageJson.exports['./components/selection-controls'], null);
  assert.equal(packageJson.exports['./components/switch'], null);
  assert.equal(packageJson.exports['./selection-controls'], null);
  assert.equal(packageJson.exports['./components/navigation'], null);
  assert.equal(packageJson.exports['./components/navigation-bar'], null);
  assert.equal(packageJson.exports['./components/navigation-drawer'], null);
  assert.equal(packageJson.exports['./components/navigation-rail'], null);
  assert.equal(packageJson.exports['./components/sidebar'], null);
  assert.equal(packageJson.exports['./components/calendar'], null);
  assert.equal(packageJson.exports['./components/date-input'], null);
  assert.equal(packageJson.exports['./components/date-picker'], null);
  assert.equal(packageJson.exports['./components/dialog'], null);
  assert.equal(packageJson.exports['./components/divider'], null);
  assert.equal(packageJson.exports['./components/confirm-dialog'], null);
  assert.equal(packageJson.exports['./components/field'], null);
  assert.equal(packageJson.exports['./components/list'], null);
  assert.equal(packageJson.exports['./components/select'], null);
  assert.equal(packageJson.exports['./components/select-field'], null);
  assert.equal(packageJson.exports['./components/text-field'], null);
  assert.equal(packageJson.exports['./components/toast'], null);
  assert.equal(packageJson.exports['./primitives/icon'], null);
});
