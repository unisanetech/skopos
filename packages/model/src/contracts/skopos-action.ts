import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposTaskRisk } from './skopos-task.js';
import type { SkoposWorkspaceIdentity } from './skopos-task-identity.js';

export type SkoposActionCategory =
  | 'docs-generator'
  | 'docs-validator'
  | 'reference-generator'
  | 'graph-generator'
  | 'quality-check'
  | 'migration'
  | 'maintenance'
  | 'domain-tool';

export type SkoposActionSafety = 'read-only' | 'mutating' | 'destructive';
export type SkoposActionPhase =
  | 'admission'
  | 'iteration'
  | 'stabilization'
  | 'closure';

export interface SkoposActionManifest {
  id: string;
  title: string;
  description: string;
  category: SkoposActionCategory;
  scope: string[];
  command: string;
  cwd: string;
  inputs: string[];
  sourceExcludes?: string[];
  outputs: string[];
  affects: string[];
  safety: SkoposActionSafety;
  requiresApproval: boolean;
  whenToUse?: string;
  phases?: SkoposActionPhase[];
  risks?: SkoposTaskRisk[];
  recommendedAfter: string[];
  owner: string;
  sourcePath: string;
}

export interface SkoposActionRequirement {
  id: string;
  title: string;
  category: SkoposActionCategory;
  safety: SkoposActionSafety;
  sourcePath: string;
  reason: string;
  matchedPaths: string[];
  outputPaths: string[];
  requiresApproval: boolean;
}

export interface SkoposActionRequirementEvidence extends SkoposActionRequirement {
  status: 'pass' | 'fail';
  summary: string;
  evidenceStatus?: 'valid' | 'stale' | 'active';
  evidenceExecutionKey?: string;
  evidenceSourceDigest?: string;
  latestSuccessfulRunId?: string;
  latestSuccessfulRunAt?: string;
  latestSuccessfulRunByActorId?: string;
}

export type SkoposActionRunStatus = 'running' | 'succeeded' | 'failed' | 'dry-run';

export interface SkoposEvidencePathDigest {
  path: string;
  kind: 'file' | 'directory' | 'symlink' | 'missing';
  digest: string;
  fileCount: number;
}

export interface SkoposEvidenceState {
  algorithm: 'sha256';
  digest: string;
  paths: SkoposEvidencePathDigest[];
}

export interface SkoposEvidence {
  schemaVersion: 1;
  executionKey: string;
  actionId: string;
  command: {
    raw: string;
    cwd: string;
    digest: string;
  };
  sourceState: SkoposEvidenceState;
  environment: {
    platform: string;
    architecture: string;
    nodeVersion: string;
    workspace: SkoposWorkspaceIdentity;
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
  outputState?: SkoposEvidenceState;
}

export interface SkoposActionRunArtifact extends SkoposArtifactEnvelope<'action-run'> {
  workspaceRoot: string;
  actionId: string;
  actionTitle: string;
  actionCategory: SkoposActionCategory;
  actionSafety: SkoposActionSafety;
  runByActorId?: string;
  sourcePath: string;
  command: string;
  cwd: string;
  runStatus: SkoposActionRunStatus;
  exitCode: number | null;
  startedAt?: string;
  finishedAt?: string;
  outputPaths: string[];
  evidence?: SkoposEvidence;
  reusedFromRunId?: string;
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
}

export interface SkoposTaskActionEvidenceLink
  extends SkoposArtifactEnvelope<'task-action-evidence-link'> {
  workspaceRoot: string;
  taskId: string;
  actionId: string;
  runId: string;
  linkedAt: string;
  linkedByActorId: string;
}

export interface SkoposActionRunResult {
  run: SkoposActionRunArtifact;
  taskEvidenceLink?: SkoposTaskActionEvidenceLink;
  taskEvidenceLinkPath?: string;
}
