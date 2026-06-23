#!/usr/bin/env node

export { runSkoposCli } from './cli/index.js';

import { isEntrypoint, runSkoposCli } from './cli/index.js';

if (isEntrypoint()) {
  runSkoposCli().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
