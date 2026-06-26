#!/usr/bin/env node

export { runSkoposCli } from './cli/index.js';

import { runSkoposCli } from './cli/index.js';

runSkoposCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
