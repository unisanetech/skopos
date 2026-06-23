import { resolve } from 'node:path';

import { loadSkoposPolicyPacks } from '@skopos/indexer';
import type { SkoposLoadedPolicyPack } from '@skopos/indexer';

export interface ListSkoposPolicyPacksRuntimeOptions {
  cwd: string;
}

export interface ShowSkoposPolicyPackRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  pack: string;
}

export const listSkoposPolicyPacksRuntime = async ({
  cwd,
}: ListSkoposPolicyPacksRuntimeOptions): Promise<SkoposLoadedPolicyPack[]> =>
  loadSkoposPolicyPacks({
    cwd: resolve(cwd),
  });

export const showSkoposPolicyPackRuntime = async ({
  cwd,
  pack,
}: ShowSkoposPolicyPackRuntimeOptions): Promise<SkoposLoadedPolicyPack> => {
  const packs = await listSkoposPolicyPacksRuntime({ cwd });
  const matched = packs.find(
    (candidate) => candidate.packId === pack || candidate.id === pack || candidate.sourcePath === pack,
  );

  if (!matched) {
    throw new Error(`Unknown Skopos policy pack: ${pack}`);
  }

  return matched;
};
