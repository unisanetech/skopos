import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposDuplicateReferenceKind = 'doc-id' | 'package-command';

export interface SkoposDuplicateOwner {
  label: string;
  path: string;
}

export interface SkoposDuplicateReferenceEntry {
  id: string;
  kind: SkoposDuplicateReferenceKind;
  key: string;
  summary: string;
  owners: SkoposDuplicateOwner[];
  recommendedAction?: string;
}

export interface SkoposDuplicateReferenceArtifact extends SkoposArtifactEnvelope<'duplicates'> {
  workspaceRoot: string;
  focusSubtree?: string;
  entries: SkoposDuplicateReferenceEntry[];
}
