import type { SkoposResolvedScope } from './skopos-scope-lite.js';

export interface SkoposContextReference {
  kind:
    | 'bootstrap'
    | 'config'
    | 'instructions'
    | 'docs-start-here'
    | 'project-doc'
    | 'symbols'
    | 'duplicates'
    | 'contradictions'
    | 'scope-path'
    | 'package-manifest';
  path: string;
  reason: string;
}

export interface SkoposContextBundle {
  workspaceRoot: string;
  scope: SkoposResolvedScope;
  summary: string;
  references: SkoposContextReference[];
}
