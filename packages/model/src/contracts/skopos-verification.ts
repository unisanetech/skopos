import type { SkoposActionRequirementEvidence } from './skopos-action.js';
import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposGuardMatch } from './skopos-guard.js';
import type { SkoposTaskRisk } from './skopos-task.js';
import type { SkoposTaskPathState } from './skopos-task.js';
import type { SkoposScanSummary } from './skopos-scan-summary.js';

export type SkoposVerificationPhase =
  | 'admission'
  | 'iteration'
  | 'stabilization'
  | 'closure';

export interface SkoposAcceptanceEvidenceCoverage {
  requirementId: string;
  acceptanceCriterion: string;
  status: 'covered' | 'missing';
  actionIds: string[];
  guardIds: string[];
  summary: string;
}

export interface SkoposObservationEvidenceArtifact
  extends SkoposArtifactEnvelope<'observation-evidence'> {
  workspaceRoot: string;
  taskId: string;
  requirementId?: string;
  guardIds: string[];
  statement: string;
  observedByActorId: string;
  observedAt: string;
  sourceStateDigest: string;
  sourcePathStates: SkoposTaskPathState[];
}

export interface SkoposVerificationArtifact extends SkoposArtifactEnvelope<'verification'> {
  workspaceRoot: string;
  taskId: string;
  phase: SkoposVerificationPhase;
  risk: SkoposTaskRisk;
  changedPaths: string[];
  ignoredPreExistingPaths: string[];
  matchedGuards: SkoposGuardMatch[];
  actionEvidence: SkoposActionRequirementEvidence[];
  acceptanceCoverage: SkoposAcceptanceEvidenceCoverage[];
  verificationStatus: 'pass' | 'fail';
  blockers: string[];
}

export type SkoposReadinessTarget = 'continue' | 'integrate' | 'close';
export type SkoposReadinessStatus = 'ready' | 'blocked';

export interface SkoposReadinessArtifact extends SkoposArtifactEnvelope<'readiness'> {
  workspaceRoot: string;
  taskId: string;
  target: SkoposReadinessTarget;
  readiness: SkoposReadinessStatus;
  taskState: string;
  verificationPath: string;
  blockers: string[];
  evidenceSummary: {
    required: number;
    valid: number;
    missingOrStale: number;
  };
}

export interface SkoposProjectReadinessCheck {
  id: string;
  status: 'pass' | 'warn' | 'fail';
  summary: string;
}

export interface SkoposProjectReadinessArtifact
  extends SkoposArtifactEnvelope<'project-readiness'> {
  workspaceRoot: string;
  readiness: 'ready' | 'attention' | 'blocked';
  summary: string;
  checks: SkoposProjectReadinessCheck[];
  blockers: string[];
  warnings: string[];
  workQueuePath: string;
  detected: SkoposScanSummary;
}
