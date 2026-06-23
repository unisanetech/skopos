import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';

export type SkoposScopeKind = 'workspace' | 'package' | 'docs-root' | 'instruction-file';

export interface SkoposScopeLite {
  id: string;
  kind: SkoposScopeKind;
  title: string;
  path: string;
  aliases: string[];
  summary: string;
  confidence: SkoposConfidence;
}

export interface SkoposScopesLiteArtifact extends SkoposArtifactEnvelope<'scopes-lite'> {
  workspaceRoot: string;
  focusSubtree?: string;
  scopes: SkoposScopeLite[];
}

export type SkoposResolveMatch = 'default-root' | 'id' | 'alias' | 'path';

export interface SkoposResolvedScope {
  query: string;
  matchedBy: SkoposResolveMatch;
  scope: SkoposScopeLite;
}
