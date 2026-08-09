#!/usr/bin/env node

export { runSkoposCli } from './cli/index.js';

import { runSkoposCli } from './cli/index.js';
import { renderSkoposCliFailure } from './cli/shared/error-guidance.js';

runSkoposCli().catch((error: unknown) => {
  process.stderr.write(`${renderSkoposCliFailure(error)}\n`);
  process.exitCode = 1;
});
