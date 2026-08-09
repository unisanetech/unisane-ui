import { Command } from 'commander';
import {
  runCapturedUiCommand,
  type UiPackCommandContext,
  type UiPackCommandResult,
} from '../pack-contract.js';
import { registerUiCommands } from '../commands/register.js';

export function runUiCommand(context: UiPackCommandContext): Promise<UiPackCommandResult> {
  const selection = context.selection;
  if (!selection) {
    throw new Error('[UI_CLI_SELECTION_MISSING] UI commands require exact pack selection.');
  }
  return runCapturedUiCommand(context, async () => {
    const program = new Command().name('unisane').exitOverride();
    registerUiCommands(program, { cwd: context.cwd });
    await program.parseAsync(['node', 'unisane', ...selection.command.path, ...context.argv], {
      from: 'node',
    });
  });
}
