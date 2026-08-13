#!/usr/bin/env node

import { Command } from 'commander';
import { registerUiCommands } from './commands/register.js';

const program = new Command().name('unisane-ui').showHelpAfterError();

registerUiCommands(program, { cwd: process.cwd() }, { root: true });

await program.parseAsync(process.argv);
