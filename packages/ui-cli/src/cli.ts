#!/usr/bin/env node

import { createUiCli } from './program.js';

await createUiCli().showHelpAfterError().parseAsync(process.argv);
