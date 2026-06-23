import { join, resolve } from 'node:path';

import { loadSkoposOverrideArtifact } from '@skopos/indexer';
import type {
  SkoposOverrideArtifact,
  SkoposOverrideEntry,
  SkoposOverrideKey,
  SkoposOverrideValueMap,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

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

export interface ShowSkoposOverridesRuntimeOptions {
  cwd: string;
}

export interface SetSkoposOverrideRuntimeOptions<
  TKey extends SkoposOverrideKey = SkoposOverrideKey,
> {
  cwd: string;
  key: TKey;
  value: string;
  reason?: string;
  actor?: string;
  force?: boolean;
}

export interface SetSkoposOverrideRuntimeResult {
  overridePath: string;
  write: 'written';
  overrides: SkoposOverrideArtifact;
  updatedEntry: SkoposOverrideEntry;
}

export const showSkoposOverridesRuntime = async ({
  cwd,
}: ShowSkoposOverridesRuntimeOptions): Promise<SkoposOverrideArtifact> => {
  const workspaceRoot = resolve(cwd);
  const existing = await loadSkoposOverrideArtifact({
    cwd: workspaceRoot,
  });

  return existing ?? createEmptyOverrideArtifact(workspaceRoot);
};

export const setSkoposOverrideRuntime = async <TKey extends SkoposOverrideKey>({
  cwd,
  key,
  value,
  reason,
  actor,
  force = false,
}: SetSkoposOverrideRuntimeOptions<TKey>): Promise<SetSkoposOverrideRuntimeResult> => {
  assertOverrideValue(key, value);

  const workspaceRoot = resolve(cwd);
  const overridePath = join(workspaceRoot, OVERRIDES_PATH);
  const existing = await showSkoposOverridesRuntime({
    cwd: workspaceRoot,
  });
  const actorId = requireOverrideActorId(actor);
  const existingEntry = existing.entries.find((entry) => entry.key === key);

  if (existingEntry?.updatedBy && existingEntry.updatedBy !== actorId && !force) {
    throw new Error(
      `Override ${key} was last updated by ${existingEntry.updatedBy}. Re-run with --actor ${existingEntry.updatedBy} or use --force to take over this override.`,
    );
  }

  const updatedEntry: SkoposOverrideEntry<TKey> = {
    key,
    value: value as SkoposOverrideValueMap[TKey],
    reason,
    updatedAt: new Date().toISOString(),
    updatedBy: actorId,
  };
  const nextEntries = mergeOverrideEntries(existing.entries, updatedEntry);
  const overrides: SkoposOverrideArtifact = {
    ...existing,
    updatedAt: updatedEntry.updatedAt,
    entries: nextEntries,
  };

  await writeJsonArtifact({
    artifactPath: overridePath,
    artifact: overrides,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'override-set',
    status: 'succeeded',
    summary: `Updated override ${key}.`,
    relatedArtifactPaths: [overridePath],
    metadata: {
      key,
      value,
      reason: reason ?? null,
      actorId,
      forceOverride: force,
      previousActorId: existingEntry?.updatedBy ?? null,
      overrideCount: overrides.entries.length,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return {
    overridePath,
    write: 'written',
    overrides,
    updatedEntry,
  };
};

const createEmptyOverrideArtifact = (workspaceRoot: string): SkoposOverrideArtifact => ({
  schemaVersion: 1,
  id: 'overrides',
  type: 'overrides',
  status: 'durable',
  authority: 'canonical',
  summary: 'Checked-in human canonical overrides that outrank heuristic inference.',
  updatedAt: new Date().toISOString(),
  workspaceRoot,
  entries: [],
});

const mergeOverrideEntries = (
  existing: SkoposOverrideArtifact['entries'],
  updatedEntry: SkoposOverrideEntry,
): SkoposOverrideArtifact['entries'] => {
  const next = existing.filter((entry) => entry.key !== updatedEntry.key);
  next.push(updatedEntry);
  return next.sort((left, right) => left.key.localeCompare(right.key));
};

const assertOverrideValue = <TKey extends SkoposOverrideKey>(key: TKey, value: string): void => {
  if (key === 'project.archetype' && (!isNonEmptyString(value) || !VALID_ARCHETYPES.has(value))) {
    throw new Error(`Unsupported override value for ${key}: ${String(value)}`);
  }

  if (key === 'project.repoMode' && (!isNonEmptyString(value) || !VALID_REPO_MODES.has(value))) {
    throw new Error(`Unsupported override value for ${key}: ${String(value)}`);
  }

  if (key === 'docs.root' && !isNonEmptyString(value)) {
    throw new Error(`Unsupported override value for ${key}: ${String(value)}`);
  }
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const requireOverrideActorId = (actor?: string): string => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (!isNonEmptyString(candidate)) {
    throw new Error('Missing override actor id. Pass --actor <id> or set SKOPOS_ACTOR.');
  }

  return candidate.trim();
};
