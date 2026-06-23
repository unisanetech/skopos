import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposWorkflowCategory =
  | 'docs-generator'
  | 'docs-validator'
  | 'reference-generator'
  | 'graph-generator'
  | 'quality-check'
  | 'migration'
  | 'maintenance'
  | 'domain-tool';

export type SkoposWorkflowSafety = 'read-only' | 'mutating' | 'destructive';

export interface SkoposWorkflowManifest {
  id: string;
  title: string;
  description: string;
  category: SkoposWorkflowCategory;
  scope: string[];
  command: string;
  cwd: string;
  inputs: string[];
  outputs: string[];
  affects: string[];
  safety: SkoposWorkflowSafety;
  requiresApproval: boolean;
  whenToUse?: string;
  requiredForDone: boolean;
  recommendedAfter: string[];
  owner: string;
  sourcePath: string;
}

export interface SkoposWorkflowRequirement {
  id: string;
  title: string;
  category: SkoposWorkflowCategory;
  safety: SkoposWorkflowSafety;
  sourcePath: string;
  reason: string;
  matchedPaths: string[];
  outputPaths: string[];
  requiredForDone: boolean;
  requiresApproval: boolean;
}

export interface SkoposWorkflowRequirementEvidence extends SkoposWorkflowRequirement {
  status: 'pass' | 'fail';
  summary: string;
  latestSuccessfulRunId?: string;
  latestSuccessfulRunAt?: string;
  latestSuccessfulRunByActorId?: string;
}

export type SkoposWorkflowRunStatus = 'succeeded' | 'failed' | 'dry-run';

export interface SkoposWorkflowRunArtifact extends SkoposArtifactEnvelope<'workflow-run'> {
  workspaceRoot: string;
  workflowId: string;
  workflowTitle: string;
  workflowCategory: SkoposWorkflowCategory;
  workflowSafety: SkoposWorkflowSafety;
  runByActorId?: string;
  sourcePath: string;
  command: string;
  cwd: string;
  runStatus: SkoposWorkflowRunStatus;
  exitCode: number | null;
  startedAt?: string;
  finishedAt?: string;
  outputPaths: string[];
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
}
