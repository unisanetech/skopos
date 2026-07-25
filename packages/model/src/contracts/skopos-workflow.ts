import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposWorkspaceIdentity } from './skopos-task-identity.js';

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
  receiptStatus?: 'valid' | 'stale' | 'legacy' | 'active';
  receiptExecutionKey?: string;
  receiptSourceDigest?: string;
  latestSuccessfulRunId?: string;
  latestSuccessfulRunAt?: string;
  latestSuccessfulRunByActorId?: string;
}

export type SkoposWorkflowRunStatus = 'running' | 'succeeded' | 'failed' | 'dry-run';

export interface SkoposWorkflowReceiptPathDigest {
  path: string;
  kind: 'file' | 'directory' | 'symlink' | 'missing';
  digest: string;
  fileCount: number;
}

export interface SkoposWorkflowReceiptState {
  algorithm: 'sha256';
  digest: string;
  paths: SkoposWorkflowReceiptPathDigest[];
}

export interface SkoposWorkflowReceipt {
  schemaVersion: 1;
  executionKey: string;
  actionId: string;
  command: {
    raw: string;
    cwd: string;
    digest: string;
  };
  sourceState: SkoposWorkflowReceiptState;
  environment: {
    platform: string;
    architecture: string;
    nodeVersion: string;
    workspace?: SkoposWorkspaceIdentity;
  };
  owner: {
    runId: string;
    actorId?: string;
    leaseExpiresAt: string;
  };
  freshness: {
    policy: 'source-bound';
    capturedAt: string;
  };
  outputState?: SkoposWorkflowReceiptState;
}

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
  receipt?: SkoposWorkflowReceipt;
  reusedFromRunId?: string;
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
}
