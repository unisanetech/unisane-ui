#!/usr/bin/env node

import { createUiCli } from './program.js';

await createUiCli().parseAsync(process.argv);
