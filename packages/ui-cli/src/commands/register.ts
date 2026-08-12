import type { Command } from 'commander';
import { log } from '../cli-support.js';
import {
  uiAppearanceDisable,
  uiAppearanceEnable,
  uiAppearanceList,
  uiInit,
  uiAdd,
  uiDiff,
  uiDoctor,
  uiTheme,
} from './index.js';

interface UiCliOptions {
  force?: boolean;
  yes?: boolean;
  overwrite?: boolean;
  all?: boolean;
  dryRun?: boolean;
  theme?: string;
  axes?: string;
  persistence?: string;
}

interface UiCommandEnvironment {
  cwd: string;
}

export function registerUiCommands(
  program: Command,
  environment: UiCommandEnvironment = { cwd: process.cwd() },
): void {
  const ui = program.command('ui').description('UI component management (shadcn-style)');

  ui.command('init')
    .description('Initialize Unisane UI in your project')
    .option('-f, --force', 'Overwrite existing files')
    .option('--theme <name>', 'Initial generated color theme', 'blue')
    .option('--dry-run', 'Preview changes without writing files')
    .action(async (options: UiCliOptions) => {
      log.banner('Unisane');
      const code = await uiInit({
        cwd: environment.cwd,
        force: options.force,
        dryRun: options.dryRun,
        theme: options.theme,
      });
      process.exitCode = code;
    });

  ui.command('add [components...]')
    .description('Add UI components to your project')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('-o, --overwrite', 'Overwrite existing files')
    .option('-a, --all', 'Add all components')
    .option('--dry-run', 'Preview changes without writing files')
    .action(async (components: string[] | undefined, options: UiCliOptions) => {
      log.banner('Unisane');
      const code = await uiAdd({
        cwd: environment.cwd,
        components: components?.length ? components : undefined,
        all: options.all,
        overwrite: options.overwrite,
        yes: options.yes,
        dryRun: options.dryRun,
      });
      process.exitCode = code;
    });

  ui.command('diff [component]')
    .description('Check for component updates')
    .action(async (component: string | undefined) => {
      log.banner('Unisane');
      const code = await uiDiff({ cwd: environment.cwd, component });
      process.exitCode = code;
    });

  ui.command('doctor')
    .description('Check UI installation health')
    .action(async () => {
      const code = await uiDoctor({ cwd: environment.cwd });
      process.exitCode = code;
    });

  ui.command('theme <name>')
    .description('Replace the generated semantic color theme in globals.css')
    .option('--dry-run', 'Preview changes without writing files')
    .action(async (name: string, options: UiCliOptions) => {
      log.banner('Unisane');
      const code = await uiTheme({
        cwd: environment.cwd,
        theme: name,
        dryRun: options.dryRun,
      });
      process.exitCode = code;
    });

  const appearance = ui
    .command('appearance')
    .description('Manage opt-in runtime appearance preferences');

  appearance
    .command('enable')
    .description('Enable local runtime appearance axes')
    .requiredOption('--axes <axes>', 'Comma-separated axes')
    .option('--persistence <policy>', 'none, localStorage, or cookie', 'localStorage')
    .option('--dry-run', 'Preview changes without writing files')
    .action(async (options: UiCliOptions) => {
      log.banner('Unisane');
      const code = await uiAppearanceEnable({
        cwd: environment.cwd,
        axes: (options.axes ?? '')
          .split(',')
          .map((axis) => axis.trim())
          .filter(Boolean),
        persistence: options.persistence,
        dryRun: options.dryRun,
      });
      process.exitCode = code;
    });

  appearance
    .command('disable <axis>')
    .description('Disable one runtime appearance axis')
    .option('--dry-run', 'Preview changes without writing files')
    .action(async (axis: string, options: UiCliOptions) => {
      log.banner('Unisane');
      const code = await uiAppearanceDisable({
        cwd: environment.cwd,
        axis,
        dryRun: options.dryRun,
      });
      process.exitCode = code;
    });

  appearance
    .command('list')
    .description('Show enabled runtime appearance axes')
    .action(async () => {
      log.banner('Unisane');
      process.exitCode = await uiAppearanceList({ cwd: environment.cwd });
    });
}
