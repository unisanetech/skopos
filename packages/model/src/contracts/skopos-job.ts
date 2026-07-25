import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposEvalExecutionPhase } from './skopos-eval.js';

export type SkoposJobKind = 'eval';
export type SkoposJobState = 'queued' | 'running' | 'succeeded' | 'failed';

export interface SkoposJobArtifact extends SkoposArtifactEnvelope<'job'> {
  workspaceRoot: string;
  jobKind: SkoposJobKind;
  jobState: SkoposJobState;
  requestedByActorId?: string;
  missionId?: string;
  executionPhase?: SkoposEvalExecutionPhase;
  command: string;
  pollCommand: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  resultPath?: string;
  resultSummary?: string;
  errorMessage?: string;
}

export interface SkoposBackgroundEvalRunResult {
  workspaceRoot: string;
  actorId?: string;
  missionId: string;
  summary: string;
  jobId: string;
  jobPath: string;
  jobState: SkoposJobState;
  nextCommand: string;
  job: SkoposJobArtifact;
}

export interface SkoposJobShowRunResult {
  workspaceRoot: string;
  summary: string;
  jobId: string;
  jobPath: string;
  nextCommand?: string;
  job: SkoposJobArtifact;
}
