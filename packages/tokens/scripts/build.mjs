#!/usr/bin/env node

import { runBuildFromArgv } from "./tokens-build/build-pipeline.mjs";

await runBuildFromArgv(process.argv.slice(2));
