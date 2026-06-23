import type { SkoposScopeLite } from './skopos-scope-lite.js';
import type { SkoposWorkflowRequirement } from './skopos-workflow.js';

export type SkoposImpactCategory =
  | 'root-config'
  | 'override-artifact'
  | 'generated-artifact'
  | 'workflow-artifact'
  | 'docs'
  | 'instruction-source'
  | 'instruction-mirror'
  | 'package-manifest'
  | 'package-source'
  | 'workspace-file';

export interface SkoposImpactEntry {
  path: string;
  category: SkoposImpactCategory;
  affectedScopeIds: string[];
}

export interface SkoposImpactReport {
  workspaceRoot: string;
  changedPathSource: 'explicit' | 'git-status';
  changedPaths: string[];
  changed: SkoposImpactEntry[];
  affectedScopes: SkoposScopeLite[];
  requiredActions: string[];
  recommendedChecks: string[];
  requiredWorkflows: SkoposWorkflowRequirement[];
  warnings: string[];
  instructionMirrorIssues: string[];
  graphPath?: string;
  graphWrite?: 'written';
  summary: string;
}
