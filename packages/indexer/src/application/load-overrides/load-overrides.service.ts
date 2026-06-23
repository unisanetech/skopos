import { join } from 'node:path';

import type {
  SkoposAppliedOverride,
  SkoposOverrideArtifact,
  SkoposOverrideEntry,
  SkoposOverrideKey,
  SkoposOverrideValueMap,
} from '@skopos/model';

import { readJsonFile } from '../../adapters/workspace-filesystem.adapter.js';

const OVERRIDES_PATH = '.skopos/overrides.json' as const;
const VALID_ARCHETYPES = new Set([
  'saas',
  'api',
  'library',
  'monorepo-platform',
  'internal-tool',
  'custom',
]);
const VALID_REPO_MODES = new Set(['single', 'multi-package', 'monorepo']);

export interface LoadSkoposOverrideArtifactOptions {
  cwd: string;
}

export const loadSkoposOverrideArtifact = async ({
  cwd,
}: LoadSkoposOverrideArtifactOptions): Promise<SkoposOverrideArtifact | null> => {
  const artifact = await readJsonFile<SkoposOverrideArtifact>(join(cwd, OVERRIDES_PATH));
  if (!artifact || !Array.isArray(artifact.entries)) {
    return null;
  }

  const entries = artifact.entries.filter(isValidOverrideEntry);
  return {
    ...artifact,
    entries,
  };
};

export const getSkoposOverrideValue = <TKey extends SkoposOverrideKey>(
  artifact: SkoposOverrideArtifact | null,
  key: TKey,
): SkoposOverrideValueMap[TKey] | undefined => {
  const entry = artifact?.entries.find((candidate) => candidate.key === key);
  return entry?.value as SkoposOverrideValueMap[TKey] | undefined;
};

export const buildAppliedOverrides = (
  artifact: SkoposOverrideArtifact | null,
): SkoposAppliedOverride[] =>
  artifact?.entries.map((entry) => ({
    key: entry.key,
    value: entry.value,
    sourcePath: OVERRIDES_PATH,
  })) ?? [];

const isValidOverrideEntry = (
  entry: SkoposOverrideEntry | undefined,
): entry is SkoposOverrideEntry => {
  if (!entry || typeof entry !== 'object' || typeof entry.key !== 'string') {
    return false;
  }

  if (entry.key === 'project.archetype') {
    return typeof entry.value === 'string' && VALID_ARCHETYPES.has(entry.value);
  }

  if (entry.key === 'project.repoMode') {
    return typeof entry.value === 'string' && VALID_REPO_MODES.has(entry.value);
  }

  if (entry.key === 'docs.root') {
    return typeof entry.value === 'string' && entry.value.trim().length > 0;
  }

  return false;
};
