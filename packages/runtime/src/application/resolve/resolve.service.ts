import { resolve } from 'node:path';

import { resolveSkoposScope } from '@skopos/query';
import type { SkoposResolvedScope } from '@skopos/model';

export interface ResolveSkoposScopeRuntimeOptions {
  cwd: string;
  query?: string;
}

export const resolveSkoposScopeRuntime = async ({
  cwd,
  query,
}: ResolveSkoposScopeRuntimeOptions): Promise<SkoposResolvedScope> =>
  resolveSkoposScope({
    cwd: resolve(cwd),
    query,
  });
