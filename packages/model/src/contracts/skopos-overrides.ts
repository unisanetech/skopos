import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposProjectArchetype, SkoposRepoMode } from './skopos-root-config.js';

export type SkoposOverrideKey = 'project.archetype' | 'project.repoMode' | 'docs.root';

export interface SkoposOverrideValueMap {
  'project.archetype': SkoposProjectArchetype;
  'project.repoMode': SkoposRepoMode;
  'docs.root': string;
}

export interface SkoposOverrideEntry<TKey extends SkoposOverrideKey = SkoposOverrideKey> {
  key: TKey;
  value: SkoposOverrideValueMap[TKey];
  reason?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface SkoposAppliedOverride<TKey extends SkoposOverrideKey = SkoposOverrideKey> {
  key: TKey;
  value: SkoposOverrideValueMap[TKey];
  sourcePath: '.skopos/overrides.json';
}

export interface SkoposOverrideArtifact extends SkoposArtifactEnvelope<'overrides'> {
  workspaceRoot: string;
  entries: SkoposOverrideEntry[];
}
