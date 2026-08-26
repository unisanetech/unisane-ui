import { Command } from 'commander';
import { registerUiCommands } from './commands/register.js';

interface UiCliEnvironment {
  cwd: string;
}

export function createUiCli(environment: UiCliEnvironment = { cwd: process.cwd() }): Command {
  const program = new Command()
    .name('unisane-ui')
    .description('Install and manage Unisane UI in an application');

  registerUiCommands(program, environment, { root: true });
  return program;
}
