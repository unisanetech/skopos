import { resolve } from 'node:path';

import { buildSkoposContext } from '@skopos/query';
import type { SkoposContextBundle } from '@skopos/model';

export interface BuildSkoposContextRuntimeOptions {
  cwd: string;
  scope?: string;
}

export const buildSkoposContextRuntime = async ({
  cwd,
  scope,
}: BuildSkoposContextRuntimeOptions): Promise<SkoposContextBundle> =>
  buildSkoposContext({
    cwd: resolve(cwd),
    scope,
  });
