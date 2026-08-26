import { access, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { uiAdd } from '../src/commands/add.js';
import {
  getTargetFilePath,
  loadConfig,
  loadRegistry,
  resolveRegistryDir,
  transformImports,
} from '../src/commands/add-helpers.js';
import { createDefaultUiConfig } from '../src/commands/ui-config.js';

const temporaryDirectories: string[] = [];
const registryDirectory = path.resolve(import.meta.dirname, '../../ui/registry');
const originalNodeEnvironment = process.env.NODE_ENV;

process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;

afterEach(async () => {
  process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;
  process.env.NODE_ENV = originalNodeEnvironment;
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

async function createFixture(): Promise<string> {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-consumer-'));
  temporaryDirectories.push(cwd);
  await writeFile(path.join(cwd, 'package.json'), '{"name":"fixture","private":true}\n');
  await writeFile(
    path.join(cwd, 'components.json'),
    `${JSON.stringify(createDefaultUiConfig('blue', { hasSrc: true }), null, 2)}\n`,
  );
  return cwd;
}

describe('UI registry installation helpers', () => {
  it('loads one Shadcn-compatible catalog and routes nested targets through components.json', () => {
    const registry = loadRegistry(registryDirectory);
    expect(registry?.$schema).toBe('https://ui.shadcn.com/schema/registry.json');
    expect(registry?.name).toBe('unisane');
    expect(registry?.items.length).toBeGreaterThan(90);
    expect(registry?.items.find((item) => item.name === 'button')).toMatchObject({
      type: 'registry:ui',
      files: [{ path: 'components/button.tsx', target: 'components/ui/button.tsx' }],
    });

    const config = createDefaultUiConfig('blue', { hasSrc: true });
    expect(
      getTargetFilePath(
        {
          path: 'components/sidebar/components/sidebar-drawer.tsx',
          type: 'registry:ui',
          target: 'components/ui/sidebar/components/sidebar-drawer.tsx',
        },
        config,
        '/project',
      ),
    ).toBe('/project/src/components/ui/sidebar/components/sidebar-drawer.tsx');
  });

  it('never activates the test registry override in production', () => {
    process.env.NODE_ENV = 'production';
    process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;
    expect(resolveRegistryDir()).toBeNull();
  });

  it('rejects traversal and non-normalized catalog paths', async () => {
    const registry = loadRegistry(registryDirectory);
    expect(registry).not.toBeNull();
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-unsafe-registry-'));
    temporaryDirectories.push(cwd);

    const traversal = structuredClone(registry!);
    traversal.items[0]!.files[0]!.path = '../secret.ts';
    await writeFile(path.join(cwd, 'registry.json'), JSON.stringify(traversal));
    expect(loadRegistry(cwd)).toBeNull();

    const nonNormalized = structuredClone(registry!);
    nonNormalized.items[0]!.files[0]!.target = 'components/ui/section/../button.tsx';
    await writeFile(path.join(cwd, 'registry.json'), JSON.stringify(nonNormalized));
    expect(loadRegistry(cwd)).toBeNull();
  });

  it('rewrites internal categories to the configured consumer aliases', () => {
    const config = createDefaultUiConfig();
    config.aliases = {
      components: '~/components',
      ui: '~/ui',
      lib: '~/lib',
      hooks: '~/hooks',
      types: '~/types',
    };
    const source = [
      "import { Icon } from '@/components/ui/icon';",
      "import { AppearanceProvider } from '@/layout/appearance-provider';",
      "import { cn } from '@/lib/utils';",
      "import { useScrollLock } from '@/hooks/use-scroll-lock';",
      "import type { NavigationItem } from '@/types/navigation';",
    ].join('\n');

    expect(transformImports(source, config)).toBe(
      [
        "import { Icon } from '~/ui/icon';",
        "import { AppearanceProvider } from '~/ui/appearance-provider';",
        "import { cn } from '~/lib/utils';",
        "import { useScrollLock } from '~/hooks/use-scroll-lock';",
        "import type { NavigationItem } from '~/types/navigation';",
      ].join('\n'),
    );
  });

  it('rewrites internal imports to portable relative paths for alias-free consumers', () => {
    const config = createDefaultUiConfig();
    const source = [
      "import { Icon } from '@/components/ui/icon';",
      "import { cn } from '@/lib/utils';",
      "import type { NavigationItem } from '@/types/navigation';",
    ].join('\n');

    expect(
      transformImports(source, config, {
        cwd: '/project',
        destination: '/project/src/components/ui/button.tsx',
        relative: true,
      }),
    ).toBe(
      [
        "import { Icon } from './icon';",
        "import { cn } from '../../lib/utils';",
        "import type { NavigationItem } from '../../types/navigation';",
      ].join('\n'),
    );
  });

  it('installs a dependency-closed source selection with no Unisane runtime fallback', async () => {
    expect(resolveRegistryDir()).toBe(registryDirectory);
    const cwd = await createFixture();
    expect(loadConfig(cwd)?.aliases.ui).toBe('@/components/ui');

    await expect(
      uiAdd({
        cwd,
        components: ['button', 'date-picker', 'sidebar', 'text-field'],
        yes: true,
        install: false,
      }),
    ).resolves.toBe(0);

    await access(path.join(cwd, 'src/components/ui/button.tsx'));
    await access(path.join(cwd, 'src/components/ui/date-picker.tsx'));
    await access(path.join(cwd, 'src/components/ui/sidebar/components/sidebar-drawer.tsx'));
    await access(path.join(cwd, 'src/lib/use-overlay-behavior.ts'));
    await access(path.join(cwd, 'src/hooks/use-scroll-lock.ts'));

    const installed: string[] = [];
    async function collect(directory: string): Promise<void> {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) await collect(entryPath);
        else if (/\.tsx?$/.test(entry.name)) installed.push(entryPath);
      }
    }
    await collect(path.join(cwd, 'src'));
    for (const file of installed) {
      const content = await readFile(file, 'utf8');
      expect(content).not.toMatch(/@unisane\//);
      expect(content).not.toMatch(/@ui\//);
      expect(content).not.toMatch(/from\s+['"]@\//);
    }

    await writeFile(path.join(cwd, 'src/components/ui/button.tsx'), '// app-owned change\n');
    await expect(uiAdd({ cwd, components: ['button'], yes: true, install: false })).resolves.toBe(
      0,
    );
    expect(await readFile(path.join(cwd, 'src/components/ui/button.tsx'), 'utf8')).toBe(
      '// app-owned change\n',
    );
  });

  it('does not accept retired unisane.json or package.json.unisane routing', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-retired-config-'));
    temporaryDirectories.push(cwd);
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({ name: 'fixture', unisane: { srcDir: 'src' } }),
    );
    await writeFile(path.join(cwd, 'unisane.json'), JSON.stringify({ srcDir: 'src' }));
    await expect(uiAdd({ cwd, components: ['button'], yes: true })).resolves.toBe(1);
    await expect(access(path.join(cwd, 'src/components/ui/button.tsx'))).rejects.toThrow();
  });

  it('rolls back source, manifest, and lock writes when package installation fails', async () => {
    const cwd = await createFixture();
    const originalPackage = await readFile(path.join(cwd, 'package.json'), 'utf8');
    const failingRunner = async () => {
      await writeFile(path.join(cwd, 'package.json'), '{"name":"partially-mutated"}\n');
      await writeFile(path.join(cwd, 'pnpm-lock.yaml'), 'partial\n');
      return 1;
    };

    await expect(
      uiAdd({
        cwd,
        components: ['button'],
        yes: true,
        packageManager: 'pnpm',
        installRunner: failingRunner,
      }),
    ).resolves.toBe(1);

    expect(await readFile(path.join(cwd, 'package.json'), 'utf8')).toBe(originalPackage);
    await expect(access(path.join(cwd, 'pnpm-lock.yaml'))).rejects.toThrow();
    await expect(access(path.join(cwd, 'src/components/ui/button.tsx'))).rejects.toThrow();
  });

  it('runs exact registry dependency installs through the detected package manager', async () => {
    const cwd = await createFixture();
    await writeFile(path.join(cwd, 'pnpm-lock.yaml'), 'lockfileVersion: 9\n');
    const calls: Array<{ command: string; args: string[] }> = [];
    await expect(
      uiAdd({
        cwd,
        components: ['button'],
        yes: true,
        installRunner: (command, args) => {
          calls.push({ command, args });
          return 0;
        },
      }),
    ).resolves.toBe(0);

    expect(calls).toHaveLength(1);
    expect(calls[0]?.command).toBe('pnpm');
    expect(calls[0]?.args).toContain('class-variance-authority@^0.7.1');
    expect(calls[0]?.args.join(' ')).not.toContain('@unisane/');
  });
});
