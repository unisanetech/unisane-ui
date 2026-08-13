import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildInstallCommands, detectPackageManager } from '../src/commands/package-manager.js';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

async function fixture(): Promise<string> {
  const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-package-manager-'));
  temporaryDirectories.push(cwd);
  return cwd;
}

describe('package-manager detection and exact commands', () => {
  it('detects every supported lockfile', async () => {
    for (const [filename, expected] of [
      ['pnpm-lock.yaml', 'pnpm'],
      ['package-lock.json', 'npm'],
      ['yarn.lock', 'yarn'],
      ['bun.lock', 'bun'],
    ] as const) {
      const cwd = await fixture();
      await writeFile(path.join(cwd, filename), 'lock\n');
      expect(detectPackageManager(cwd)).toBe(expected);
    }
  });

  it('uses packageManager when no lock exists and defaults to pnpm', async () => {
    const configured = await fixture();
    await writeFile(
      path.join(configured, 'package.json'),
      JSON.stringify({ packageManager: 'yarn@4.6.0' }),
    );
    expect(detectPackageManager(configured)).toBe('yarn');
    expect(detectPackageManager(await fixture())).toBe('pnpm');
  });

  it('builds production and development install commands without changing specifiers', () => {
    expect(buildInstallCommands('npm', ['clsx@^2.1.1'], ['tailwindcss@4.1.18'])).toEqual([
      { command: 'npm', args: ['install', 'clsx@^2.1.1'] },
      { command: 'npm', args: ['install', '--save-dev', 'tailwindcss@4.1.18'] },
    ]);
    expect(buildInstallCommands('pnpm', ['clsx@^2.1.1'], ['tailwindcss@4.1.18'])).toEqual([
      { command: 'pnpm', args: ['add', 'clsx@^2.1.1'] },
      { command: 'pnpm', args: ['add', '--save-dev', 'tailwindcss@4.1.18'] },
    ]);
    expect(buildInstallCommands('yarn', [], ['tailwindcss@4.1.18'])).toEqual([
      { command: 'yarn', args: ['add', '--dev', 'tailwindcss@4.1.18'] },
    ]);
    expect(buildInstallCommands('bun', [], ['tailwindcss@4.1.18'])).toEqual([
      { command: 'bun', args: ['add', '--dev', 'tailwindcss@4.1.18'] },
    ]);
  });
});
