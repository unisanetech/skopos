import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';

export const SKOPOS_SCOPE_KINDS = [
  'workspace',
  'product',
  'application',
  'service',
  'package',
  'domain',
  'infrastructure',
  'tool',
] as const;

export type SkoposScopeKind = (typeof SKOPOS_SCOPE_KINDS)[number];

export interface SkoposScopeLite {
  id: string;
  kind: SkoposScopeKind;
  title: string;
  path: string;
  aliases: string[];
  summary: string;
  confidence: SkoposConfidence;
  parent?: string;
  ancestorIds?: string[];
  profile?: string;
  memoryRoot?: string;
  codeRoots?: string[];
  dependsOn?: string[];
  owners?: string[];
}

export interface SkoposDeclaredScope {
  id: string;
  kind: SkoposScopeKind;
  title: string;
  path: string;
  aliases: string[];
  memoryRoot: string;
  codeRoots: string[];
  parent: string | null;
  profile: string;
  dependsOn: string[];
  owners: string[];
}

export interface SkoposScopeRegistry {
  schemaVersion: 1;
  scopes: SkoposDeclaredScope[];
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
