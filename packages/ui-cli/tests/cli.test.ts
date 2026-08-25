import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createUiCli } from '../src/program.js';

const packageRoot = path.resolve(import.meta.dirname, '..');
const registryDirectory = path.resolve(packageRoot, '../ui/registry');
const temporaryDirectories: string[] = [];
const initialExitCode = process.exitCode;

process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;

afterEach(async () => {
  process.exitCode = initialExitCode;
  process.env.UNISANE_UI_REGISTRY_DIR = registryDirectory;
  vi.restoreAllMocks();
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe('independent unisane-ui CLI', () => {
  it('declares one package-owned binary and no host pack surface', async () => {
    const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));

    expect(manifest.bin).toEqual({ 'unisane-ui': './dist/cli.js' });
    expect(manifest.files).not.toContain('pack.manifest.json');
    expect(Object.keys(manifest.exports)).toEqual(['.', './meta']);
    expect(Object.keys(manifest.dependencies)).not.toContain('@unisane/devtools');
    expect(Object.keys(manifest.dependencies)).not.toContain('@unisane/ops');
    await expect(access(path.join(packageRoot, 'pack.manifest.json'))).rejects.toThrow();
  });

  it('owns the exact command surface at the unisane-ui root', () => {
    const program = createUiCli({ cwd: '/fixture' });
    const commands = program.commands.map((command) => command.name());
    const appearance = program.commands.find((command) => command.name() === 'appearance');

    expect(program.name()).toBe('unisane-ui');
    expect(commands).toEqual(['init', 'add', 'diff', 'doctor', 'theme', 'appearance']);
    expect(commands).not.toContain('ui');
    expect(appearance?.commands.map((command) => command.name())).toEqual([
      'enable',
      'disable',
      'list',
    ]);
    expect(program.helpInformation()).toContain('Usage: unisane-ui [options] [command]');
  });

  it('rejects the former nested host command path', async () => {
    const program = createUiCli({ cwd: '/fixture' }).exitOverride();
    program.configureOutput({ writeErr: () => undefined });

    await expect(
      program.parseAsync(['node', 'unisane-ui', 'ui', 'doctor'], { from: 'node' }),
    ).rejects.toMatchObject({ code: 'commander.unknownCommand', exitCode: 1 });
  });

  it('executes a direct dry run without a host or nested ui command', async () => {
    const cwd = await mkdtemp(path.join(os.tmpdir(), 'unisane-ui-cli-'));
    temporaryDirectories.push(cwd);
    await mkdir(path.join(cwd, 'src', 'app'), { recursive: true });
    await writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({ name: 'fixture', private: true, dependencies: { next: '^16.0.0' } }),
    );
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await createUiCli({ cwd }).parseAsync(
      ['node', 'unisane-ui', 'init', '--theme', 'blue', '--dry-run'],
      { from: 'node' },
    );

    expect(process.exitCode).toBe(0);
    await expect(access(path.join(cwd, 'unisane-ui.json'))).rejects.toThrow();
    await expect(access(path.join(cwd, 'src', 'app', 'globals.css'))).rejects.toThrow();
  });
});
