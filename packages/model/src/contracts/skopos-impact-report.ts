import type { SkoposScopeLite } from './skopos-scope-lite.js';
import type { SkoposActionRequirement } from './skopos-action.js';
import type { SkoposGuardMatch } from './skopos-guard.js';

export type SkoposImpactCategory =
  | 'root-config'
  | 'generated-artifact'
  | 'action-artifact'
  | 'docs'
  | 'instruction-source'
  | 'instruction-mirror'
  | 'package-manifest'
  | 'scope-source'
  | 'workspace-file';

export interface SkoposImpactEntry {
  path: string;
  category: SkoposImpactCategory;
  affectedScopeIds: string[];
}

export interface SkoposImpactReport {
  workspaceRoot: string;
  changedPathSource: 'explicit' | 'git-status' | 'task';
  changedPaths: string[];
  ignoredPreExistingPaths?: string[];
  changed: SkoposImpactEntry[];
  affectedScopes: SkoposScopeLite[];
  recommendedCommands: string[];
  recommendedChecks: string[];
  matchedGuards: SkoposGuardMatch[];
  requiredActions: SkoposActionRequirement[];
  warnings: string[];
  instructionMirrorIssues: string[];
  graphPath?: string;
  graphWrite?: 'written';
  summary: string;
}
