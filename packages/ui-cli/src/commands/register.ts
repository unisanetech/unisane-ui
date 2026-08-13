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
  uiList,
  uiSearch,
  uiTheme,
  uiView,
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
  install?: boolean;
  json?: boolean;
}

interface UiCommandEnvironment {
  cwd: string;
}

interface UiCommandRegistration {
  root?: boolean;
}

export function registerUiCommands(
  program: Command,
  environment: UiCommandEnvironment = { cwd: process.cwd() },
  registration: UiCommandRegistration = {},
): void {
  const ui = registration.root
    ? program.description('Install and manage application-owned Unisane UI source')
    : program.command('ui').description('UI component management (shadcn-style)');

  ui.command('init')
    .description('Initialize Unisane UI in your project')
    .option('-f, --force', 'Overwrite existing files')
    .option('--theme <name>', 'Initial generated color theme', 'blue')
    .option('--no-install', 'Write source and print dependency commands without installing')
    .option('--dry-run', 'Preview changes without writing files')
    .action(async (options: UiCliOptions) => {
      log.banner('Unisane');
      const code = await uiInit({
        cwd: environment.cwd,
        force: options.force,
        dryRun: options.dryRun,
        theme: options.theme,
        install: options.install,
      });
      process.exitCode = code;
    });

  ui.command('add [components...]')
    .description('Add UI components to your project')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('-o, --overwrite', 'Overwrite existing files')
    .option('-a, --all', 'Add all components')
    .option('--no-install', 'Write source and print dependency commands without installing')
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
        install: options.install,
      });
      process.exitCode = code;
    });

  ui.command('list')
    .description('List items in the generated registry catalog')
    .option('--json', 'Print machine-readable JSON')
    .action(async (options: UiCliOptions) => {
      process.exitCode = await uiList({ json: options.json });
    });

  ui.command('search <query>')
    .description('Search the generated registry catalog')
    .option('--json', 'Print machine-readable JSON')
    .action(async (query: string, options: UiCliOptions) => {
      process.exitCode = await uiSearch(query, { json: options.json });
    });

  ui.command('view <item>')
    .description('Show one registry item and its dependency closure')
    .option('--json', 'Print machine-readable JSON')
    .action(async (item: string, options: UiCliOptions) => {
      process.exitCode = await uiView(item, { json: options.json });
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
    .option('--no-install', 'Write source and print dependency commands without installing')
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
        install: options.install,
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
