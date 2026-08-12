import { access, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { uiAdd } from '../src/commands/add.js';
import {
  getTargetFilePath,
  loadConfig,
  resolveRegistryDir,
  transformImports,
} from '../src/commands/add-helpers.js';

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

describe('UI registry installation helpers', () => {
  it('preserves nested paths under the configured consumer owner', () => {
    const cwd = '/project';
    const config = {
      srcDir: 'src',
      aliases: {
        components: '@/components/ui',
        lib: '@/lib',
        hooks: '@/hooks',
        types: '@/types',
      },
    };

    expect(
      getTargetFilePath(
        'components/sidebar/components/sidebar-drawer.tsx',
        'components:ui',
        config,
        cwd,
      ),
    ).toBe('/project/src/components/ui/sidebar/components/sidebar-drawer.tsx');
    expect(getTargetFilePath('types/navigation.ts', 'types:ui', config, cwd)).toBe(
      '/project/src/types/navigation.ts',
    );
  });

  it('rewrites internal categories to canonical consumer aliases', () => {
    const config = {
      aliases: {
        components: '~/ui',
        lib: '~/lib',
        hooks: '~/hooks',
        types: '~/types',
      },
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

  it('installs representative components without a consumer @unisane/ui package', async () => {
    const registryDir = resolveRegistryDir();
    expect(registryDir).toBe(registryDirectory);

    const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-consumer-'));
    temporaryDirectories.push(cwd);
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({ name: 'fixture', private: true }),
    );
    await writeFile(
      path.join(cwd, 'unisane.json'),
      JSON.stringify({
        srcDir: 'src',
        aliases: {
          components: '@/components/ui',
          lib: '@/lib',
          hooks: '@/hooks',
          types: '@/types',
        },
      }),
    );

    expect(loadConfig(cwd).srcDir).toBe('src');
    await expect(
      uiAdd({
        cwd,
        components: [
          'alert',
          'banner',
          'badge',
          'divider',
          'list',
          'checkbox',
          'radio',
          'switch',
          'segmented-button',
          'button',
          'icon-button',
          'icon',
          'typography',
          'field',
          'text-field',
          'select',
          'select-field',
          'dialog',
          'confirm-dialog',
          'toast',
          'date-picker',
          'carousel',
          'scroll-area',
          'pagination',
          'stepper',
          'navigation-bar',
          'navigation-drawer',
          'navigation-rail',
          'sidebar',
        ],
        yes: true,
      }),
    ).resolves.toBe(0);

    await access(path.join(cwd, 'src/components/ui/alert.tsx'));
    await access(path.join(cwd, 'src/components/ui/banner.tsx'));
    await access(path.join(cwd, 'src/components/ui/badge.tsx'));
    await access(path.join(cwd, 'src/components/ui/divider.tsx'));
    await access(path.join(cwd, 'src/components/ui/list.tsx'));
    await access(path.join(cwd, 'src/components/ui/checkbox.tsx'));
    await access(path.join(cwd, 'src/components/ui/radio.tsx'));
    await access(path.join(cwd, 'src/components/ui/switch.tsx'));
    await access(path.join(cwd, 'src/components/ui/segmented-button.tsx'));
    await access(path.join(cwd, 'src/components/ui/button.tsx'));
    await access(path.join(cwd, 'src/components/ui/icon-button.tsx'));
    await access(path.join(cwd, 'src/components/ui/sidebar/components/sidebar-drawer.tsx'));
    await access(path.join(cwd, 'src/components/ui/sidebar/components/sidebar-navigation.tsx'));
    await access(path.join(cwd, 'src/components/ui/icon.tsx'));
    await access(path.join(cwd, 'src/components/ui/typography.tsx'));
    await access(path.join(cwd, 'src/components/ui/field.tsx'));
    await access(path.join(cwd, 'src/components/ui/text-field.tsx'));
    await access(path.join(cwd, 'src/components/ui/select.tsx'));
    await access(path.join(cwd, 'src/components/ui/select-field.tsx'));
    await access(path.join(cwd, 'src/components/ui/dialog.tsx'));
    await access(path.join(cwd, 'src/components/ui/confirm-dialog.tsx'));
    await access(path.join(cwd, 'src/components/ui/toast.tsx'));
    await access(path.join(cwd, 'src/components/ui/calendar.tsx'));
    await access(path.join(cwd, 'src/components/ui/date-input.tsx'));
    await access(path.join(cwd, 'src/components/ui/date-picker.tsx'));
    await access(path.join(cwd, 'src/components/ui/carousel.tsx'));
    await access(path.join(cwd, 'src/components/ui/scroll-area.tsx'));
    await access(path.join(cwd, 'src/components/ui/pagination.tsx'));
    await access(path.join(cwd, 'src/components/ui/stepper.tsx'));
    await access(path.join(cwd, 'src/components/ui/navigation-bar.tsx'));
    await access(path.join(cwd, 'src/components/ui/navigation-drawer.tsx'));
    await access(path.join(cwd, 'src/components/ui/navigation-rail.tsx'));
    await access(path.join(cwd, 'src/lib/navigation-action.tsx'));
    await access(path.join(cwd, 'src/lib/navigation-visuals.tsx'));
    await access(path.join(cwd, 'src/lib/use-anchored-overlay-position.ts'));
    await access(path.join(cwd, 'src/lib/use-overlay-behavior.ts'));
    await access(path.join(cwd, 'src/lib/use-controllable-state.ts'));
    await access(path.join(cwd, 'src/hooks/use-scroll-lock.ts'));
    await access(path.join(cwd, 'src/types/navigation.ts'));

    await expect(
      uiAdd({
        cwd,
        components: [
          'alert',
          'banner',
          'badge',
          'divider',
          'list',
          'checkbox',
          'radio',
          'switch',
          'segmented-button',
          'button',
          'icon-button',
          'icon',
          'typography',
          'field',
          'text-field',
          'select',
          'select-field',
          'dialog',
          'confirm-dialog',
          'toast',
          'date-picker',
          'carousel',
          'scroll-area',
          'pagination',
          'stepper',
          'navigation-bar',
          'navigation-drawer',
          'navigation-rail',
          'sidebar',
        ],
        yes: true,
      }),
    ).resolves.toBe(0);

    const rootComponentFiles = await readdir(path.join(cwd, 'src/components/ui'));
    expect(rootComponentFiles).not.toContain('sidebar-drawer.tsx');

    const installedFiles: string[] = [];
    async function collectFiles(directory: string): Promise<void> {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          await collectFiles(entryPath);
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          installedFiles.push(entryPath);
        }
      }
    }
    await collectFiles(path.join(cwd, 'src'));

    for (const file of installedFiles) {
      const content = await readFile(file, 'utf8');
      expect(content).not.toMatch(/@unisane\//);
      expect(content).not.toMatch(/@ui\//);
      expect(content).not.toMatch(/@\/(primitives|layout)\//);
    }
  });
});
