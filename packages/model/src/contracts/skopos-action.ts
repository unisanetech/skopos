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

export type SkoposActionSafety =
  | 'read-only'
  | 'artifact-producing'
  | 'mutating'
  | 'destructive';
export type SkoposActionRequirementLevel = 'none' | 'required';
export type SkoposActionWorkspaceEffect = 'none' | 'declared';
export type SkoposActionArtifactEffect = 'none' | 'isolated';
export type SkoposActionExternalEffect = 'none' | 'declared';
export type SkoposActionConcurrency = 'shared' | 'exclusive';
export type SkoposActionWorkspaceMode = 'overlay-safe';
export type SkoposActionProgressPhase =
  | 'admission'
  | 'preflight'
  | 'execution'
  | 'finalization';
export type SkoposActionProgressStatus =
  | 'running'
  | 'completed'
  | 'failed'
  | 'interrupted';

export interface SkoposActionCapabilities {
  process: 'required';
  network: SkoposActionRequirementLevel;
  browser: SkoposActionRequirementLevel;
  tools: string[];
  secrets: string[];
  services: string[];
}

export interface SkoposActionEffects {
  workspace: SkoposActionWorkspaceEffect;
  artifacts: SkoposActionArtifactEffect;
  external: SkoposActionExternalEffect;
}
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
  timeoutMs?: number;
  inputs: string[];
  sourceExcludes?: string[];
  outputs: string[];
  outputExcludes?: string[];
  affects: string[];
  capabilities: SkoposActionCapabilities;
  effects: SkoposActionEffects;
  concurrency: SkoposActionConcurrency;
  workspaceMode: SkoposActionWorkspaceMode;
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

export type SkoposActionRunStatus =
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'interrupted'
  | 'unavailable'
  | 'dry-run';

export interface SkoposActionProgressEvent {
  phase: SkoposActionProgressPhase;
  status: SkoposActionProgressStatus;
  at: string;
  elapsedMs: number;
  message: string;
}

export interface SkoposActionProgressSummary {
  eventCount: number;
  events: SkoposActionProgressEvent[];
  completedPhases: SkoposActionProgressPhase[];
  failedPhases: SkoposActionProgressPhase[];
  interruptedPhases: SkoposActionProgressPhase[];
  remainingPhases: SkoposActionProgressPhase[];
  resume?: {
    actionId: string;
    command: string;
    requiresApproval: boolean;
  };
}

export interface SkoposExternalEffectReceipt {
  schemaVersion: 1;
  service: string;
  operation: string;
  status: 'succeeded';
  providerRequestId: string;
  occurredAt: string;
  receiptPath: string;
}

export interface SkoposActionRecoveryRecord {
  recoveredAt: string;
  recoveredByActorId: string;
  reason: string;
  priorLeaseExpiresAt: string;
}

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
    capabilities: SkoposActionCapabilities;
    effects: SkoposActionEffects;
    concurrency: SkoposActionConcurrency;
    workspaceMode: SkoposActionWorkspaceMode;
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
  taskId?: string;
  runStatus: SkoposActionRunStatus;
  exitCode: number | null;
  timeoutMs: number;
  timedOut?: boolean;
  startedAt?: string;
  finishedAt?: string;
  outputPaths: string[];
  artifactRoot?: string;
  capabilityIssues?: string[];
  effectViolations?: string[];
  externalEffectReceipt?: SkoposExternalEffectReceipt;
  recovery?: SkoposActionRecoveryRecord;
  progress?: SkoposActionProgressSummary;
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

export type SkoposTaskEvidenceReuseStatus =
  | 'linked'
  | 'already-linked'
  | 'rejected'
  | 'missing';

export interface SkoposTaskEvidenceReuseOutcome {
  actionId: string;
  status: SkoposTaskEvidenceReuseStatus;
  summary: string;
  runId?: string;
}

export interface SkoposTaskEvidenceReuseReport
  extends SkoposArtifactEnvelope<'task-evidence-reuse-report'> {
  workspaceRoot: string;
  taskId: string;
  actorId: string;
  reportPath: string;
  selectedActionCount: number;
  linkedCount: number;
  alreadyLinkedCount: number;
  rejectedCount: number;
  missingCount: number;
  processExecutionCount: 0;
  outcomes: SkoposTaskEvidenceReuseOutcome[];
}
