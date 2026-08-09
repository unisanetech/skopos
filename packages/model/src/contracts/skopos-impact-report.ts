import type { SkoposScopeLite } from './skopos-scope-lite.js';
import type { SkoposActionRequirement } from './skopos-action.js';
import type { SkoposGuardMatch } from './skopos-guard.js';
import type { SkoposTaskPathAttribution } from './skopos-task.js';

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

export type SkoposImpactSelectionStatus = 'selected' | 'skipped';

export interface SkoposGuardSelectionExplanation {
  id: string;
  status: SkoposImpactSelectionStatus;
  reason: string;
  matchedPaths: string[];
}

export interface SkoposActionSelectionExplanation {
  id: string;
  status: SkoposImpactSelectionStatus;
  reason: string;
  requiredByGuardIds: string[];
}

export interface SkoposImpactSelectionExplanation {
  guards: SkoposGuardSelectionExplanation[];
  actions: SkoposActionSelectionExplanation[];
}

export interface SkoposImpactReport {
  workspaceRoot: string;
  changedPathSource: 'explicit' | 'git-status' | 'task';
  changedPaths: string[];
  ignoredPreExistingPaths?: string[];
  excludedOtherTaskPaths?: string[];
  externalUnattributedPaths?: string[];
  pathAttributions?: SkoposTaskPathAttribution[];
  changed: SkoposImpactEntry[];
  affectedScopes: SkoposScopeLite[];
  recommendedCommands: string[];
  matchedGuards: SkoposGuardMatch[];
  requiredActions: SkoposActionRequirement[];
  selectionExplanation: SkoposImpactSelectionExplanation;
  warnings: string[];
  instructionMirrorIssues: string[];
  graphPath?: string;
  graphWrite?: 'written';
  summary: string;
}
