import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  uiAppearanceDisable,
  uiAppearanceEnable,
  uiAppearanceList,
} from '../src/commands/appearance.js';
import { uiInit } from '../src/commands/init.js';

const temporaryDirectories: string[] = [];
const registryDirectory = path.resolve(import.meta.dirname, '../../ui/registry');

process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;

afterEach(async () => {
  process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

async function createFixture() {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-appearance-'));
  temporaryDirectories.push(cwd);
  await mkdir(path.join(cwd, 'src', 'app'), { recursive: true });
  await writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'fixture', private: true, dependencies: { next: '^16.0.0' } }),
  );
  await expect(uiInit({ cwd, theme: 'blue', install: false })).resolves.toBe(0);
  return cwd;
}

describe('UI appearance capability', () => {
  it('enables explicit axes and installs a local provider without runtime imports', async () => {
    const cwd = await createFixture();
    await expect(
      uiAppearanceEnable({
        cwd,
        axes: ['mode', 'density', 'contrast'],
        persistence: 'cookie',
        install: false,
      }),
    ).resolves.toBe(0);

    const config = JSON.parse(await readFile(path.join(cwd, 'components.json'), 'utf8'));
    expect(config.unisane.appearance).toEqual({
      enabledAxes: ['mode', 'density', 'contrast'],
      persistence: 'cookie',
    });
    const providerPath = path.join(cwd, 'src', 'components', 'ui', 'appearance-provider.tsx');
    await access(providerPath);
    expect(await readFile(providerPath, 'utf8')).not.toMatch(/@unisane\//);
    await expect(uiAppearanceList({ cwd })).resolves.toBe(0);
  });

  it('disables one axis while preserving the other configuration', async () => {
    const cwd = await createFixture();
    await uiAppearanceEnable({
      cwd,
      axes: ['mode', 'density'],
      persistence: 'localStorage',
      install: false,
    });
    await expect(uiAppearanceDisable({ cwd, axis: 'density' })).resolves.toBe(0);

    const config = JSON.parse(await readFile(path.join(cwd, 'components.json'), 'utf8'));
    expect(config.unisane.appearance).toEqual({
      enabledAxes: ['mode'],
      persistence: 'localStorage',
    });
  });

  it('fails safely for invalid axes and malformed configuration', async () => {
    const cwd = await createFixture();
    const configPath = path.join(cwd, 'components.json');
    const before = await readFile(configPath, 'utf8');
    await expect(uiAppearanceEnable({ cwd, axes: ['colorTheme'], install: false })).resolves.toBe(
      1,
    );
    expect(await readFile(configPath, 'utf8')).toBe(before);

    await writeFile(configPath, '{ malformed');
    await expect(uiAppearanceEnable({ cwd, axes: ['mode'], install: false })).resolves.toBe(1);
    expect(await readFile(configPath, 'utf8')).toBe('{ malformed');
  });
});
