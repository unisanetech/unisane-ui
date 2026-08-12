import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { uiInit } from '../src/commands/init.js';
import {
  THEME_REGION_END,
  THEME_REGION_START,
  replaceManagedThemeRegion,
  uiTheme,
} from '../src/commands/theme.js';

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

async function createNextFixture() {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-theme-'));
  temporaryDirectories.push(cwd);
  await mkdir(path.join(cwd, 'src', 'app'), { recursive: true });
  await writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'fixture', private: true, dependencies: { next: '^16.0.0' } }),
  );
  return cwd;
}

describe('UI theme installation', () => {
  it('rejects malformed or duplicate managed regions', () => {
    const replacement = `${THEME_REGION_START}\n:root {}\n${THEME_REGION_END}`;
    expect(() => replaceManagedThemeRegion(':root {}', replacement)).toThrow(/one valid/);
    expect(() =>
      replaceManagedThemeRegion(
        `${replacement}\n${THEME_REGION_START}\n:root {}\n${THEME_REGION_END}`,
        replacement,
      ),
    ).toThrow(/one valid/);
  });

  it('initializes one globals.css and safely replaces only its theme region later', async () => {
    const cwd = await createNextFixture();
    const globalsPath = path.join(cwd, 'src', 'app', 'globals.css');
    const original = '/* existing app CSS */\n.app { color: red; }\n';
    await writeFile(globalsPath, original);

    await expect(uiInit({ cwd, theme: 'blue' })).resolves.toBe(1);
    expect(await readFile(globalsPath, 'utf8')).toBe(original);

    await expect(uiInit({ cwd, theme: 'blue', force: true })).resolves.toBe(0);
    const initialized = await readFile(globalsPath, 'utf8');
    expect(initialized).toContain('@import "tailwindcss"');
    expect(initialized).toContain(THEME_REGION_START);
    expect(initialized).toContain('--color-primary:');
    expect(initialized).not.toMatch(/--(?:ref|tone)-|data-(?:color-theme|scheme)|data-theme-scope/);
    expect(await readFile(`${globalsPath}.backup`, 'utf8')).toBe(original);
    await expect(access(path.join(cwd, 'src', 'styles', 'unisane.css'))).rejects.toThrow();
    expect(JSON.parse(await readFile(path.join(cwd, 'unisane-ui.json'), 'utf8'))).toMatchObject({
      schemaVersion: 1,
      theme: 'blue',
      appearance: { enabledAxes: [], persistence: 'none' },
    });

    const appOwnedCss = '\n/* app-owned */\n.product-shell { min-height: 100dvh; }\n';
    await writeFile(globalsPath, `${initialized}${appOwnedCss}`);
    await expect(uiTheme({ cwd, theme: 'green' })).resolves.toBe(0);

    const changed = await readFile(globalsPath, 'utf8');
    expect(changed).toContain(appOwnedCss.trim());
    expect(changed).not.toBe(`${initialized}${appOwnedCss}`);
    expect(await readFile(`${globalsPath}.backup`, 'utf8')).toBe(`${initialized}${appOwnedCss}`);
    expect(JSON.parse(await readFile(path.join(cwd, 'unisane-ui.json'), 'utf8')).theme).toBe(
      'green',
    );
  });

  it('rejects unknown themes without changing globals.css', async () => {
    const cwd = await createNextFixture();
    await expect(uiInit({ cwd, force: true })).resolves.toBe(0);
    const globalsPath = path.join(cwd, 'src', 'app', 'globals.css');
    const before = await readFile(globalsPath, 'utf8');

    await expect(uiTheme({ cwd, theme: 'missing' })).resolves.toBe(1);
    expect(await readFile(globalsPath, 'utf8')).toBe(before);
  });
});
