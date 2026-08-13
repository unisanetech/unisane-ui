import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Command } from 'commander';
import { afterEach, describe, expect, it } from 'vitest';
import { registerUiCommands } from '../src/commands/register.js';
import { createDefaultUiConfig } from '../src/commands/ui-config.js';
import { runUiCommand } from '../src/handlers/ui.js';
import type { UiPackCommandDescriptor } from '../src/pack-contract.js';

const registryDirectory = path.resolve(import.meta.dirname, '../../ui/registry');
const manifest = JSON.parse(
  await readFile(path.resolve(import.meta.dirname, '../pack.manifest.json'), 'utf8'),
) as { commands: UiPackCommandDescriptor[] };
const temporaryDirectories: string[] = [];

process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;

afterEach(async () => {
  process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

function command(id: string): UiPackCommandDescriptor {
  const descriptor = manifest.commands.find((candidate) => candidate.id === id);
  if (!descriptor) throw new Error(`Missing test command descriptor: ${id}`);
  return descriptor;
}

describe('UI pack handler', () => {
  it('registers the standalone executable commands directly at the root', () => {
    const program = new Command().name('unisane-ui');

    registerUiCommands(program, { cwd: process.cwd() }, { root: true });

    expect(program.commands.map((candidate) => candidate.name())).toEqual([
      'init',
      'add',
      'list',
      'search',
      'view',
      'diff',
      'doctor',
      'theme',
      'appearance',
    ]);
  });

  it('returns one structured JSON-safe result for an exact read command', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-handler-list-'));
    temporaryDirectories.push(cwd);
    await writeFile(
      path.join(cwd, 'components.json'),
      JSON.stringify(createDefaultUiConfig('blue', { hasSrc: true })),
    );
    const descriptor = command('ui.appearance-list');

    const result = await runUiCommand({
      argv: [],
      cwd,
      manifests: [],
      json: true,
      selection: { command: descriptor, packId: 'ui' },
    });

    expect(result).toMatchObject({
      schemaVersion: 1,
      command: 'ui.appearance-list',
      pack: 'ui',
      status: 'ok',
      actualEffect: 'offline',
      result: { exitCode: 0 },
    });
    expect(result.presentation).toBeUndefined();
    expect(result.result).toMatchObject({ exitCode: 0 });
  });

  it('preserves human presentation and dry-run zero-write behavior', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-handler-init-'));
    temporaryDirectories.push(cwd);
    await mkdir(path.join(cwd, 'src', 'app'), { recursive: true });
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({ name: 'fixture', private: true, dependencies: { next: '^16.0.0' } }),
    );
    const descriptor = command('ui.init');

    const result = await runUiCommand({
      argv: ['--dry-run'],
      cwd,
      manifests: [],
      json: false,
      selection: { command: descriptor, packId: 'ui' },
    });

    expect(result.status).toBe('ok');
    expect(result.presentation).toEqual({ stdout: '', stderr: '' });
    await expect(access(path.join(cwd, 'src', 'app', 'globals.css'))).rejects.toThrow();
    await expect(access(path.join(cwd, 'components.json'))).rejects.toThrow();
  });
});
