import { spawnSync } from 'node:child_process';
import fse from 'fs-extra';
import path from 'node:path';
import type { PackageInstallRunner, PackageManager } from './add-types.js';

const { existsSync, readFileSync } = fse;

const LOCKFILES: Array<[string, PackageManager]> = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lock', 'bun'],
  ['bun.lockb', 'bun'],
  ['package-lock.json', 'npm'],
  ['npm-shrinkwrap.json', 'npm'],
];

export interface InstallCommand {
  command: PackageManager;
  args: string[];
}

function packageManagerFromPackageJson(cwd: string): PackageManager | null {
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!existsSync(packageJsonPath)) return null;
  try {
    const parsed: unknown = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    const packageManager = (parsed as Record<string, unknown>).packageManager;
    if (typeof packageManager !== 'string') return null;
    const name = packageManager.split('@')[0];
    return name === 'pnpm' || name === 'npm' || name === 'yarn' || name === 'bun' ? name : null;
  } catch {
    return null;
  }
}

export function detectPackageManager(cwd: string): PackageManager {
  for (const [filename, manager] of LOCKFILES) {
    if (existsSync(path.join(cwd, filename))) return manager;
  }
  return packageManagerFromPackageJson(cwd) ?? 'pnpm';
}

function installArgs(manager: PackageManager, packages: string[], development: boolean): string[] {
  if (manager === 'npm') {
    return ['install', ...(development ? ['--save-dev'] : []), ...packages];
  }
  if (manager === 'bun') {
    return ['add', ...(development ? ['--dev'] : []), ...packages];
  }
  return ['add', ...(development ? ['--dev'] : []), ...packages];
}

export function buildInstallCommands(
  manager: PackageManager,
  dependencies: string[],
  devDependencies: string[],
): InstallCommand[] {
  const commands: InstallCommand[] = [];
  if (dependencies.length > 0) {
    commands.push({ command: manager, args: installArgs(manager, dependencies, false) });
  }
  if (devDependencies.length > 0) {
    commands.push({ command: manager, args: installArgs(manager, devDependencies, true) });
  }
  return commands;
}

export const defaultInstallRunner: PackageInstallRunner = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) return 1;
  return result.status ?? 1;
};

export async function runInstallCommands(
  commands: InstallCommand[],
  cwd: string,
  runner: PackageInstallRunner = defaultInstallRunner,
): Promise<boolean> {
  for (const command of commands) {
    const code = await runner(command.command, command.args, cwd);
    if (code !== 0) return false;
  }
  return true;
}

export function formatInstallCommand(command: InstallCommand): string {
  return [command.command, ...command.args].join(' ');
}

export const INSTALL_MUTATION_FILES = [
  'package.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lock',
  'bun.lockb',
  'package-lock.json',
  'npm-shrinkwrap.json',
] as const;
