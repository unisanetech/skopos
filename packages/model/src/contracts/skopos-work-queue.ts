import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposTaskRisk, SkoposTaskState } from './skopos-task.js';

export type SkoposWorkQueueDisposition =
  | 'in-progress'
  | 'ready'
  | 'deferred'
  | 'blocked'
  | 'verifying'
  | 'ready-to-integrate';

export interface SkoposWorkQueueEntry {
  id: string;
  sourceKind: 'task' | 'plan' | 'finding' | 'question' | 'readiness-blocker';
  sourcePath: string;
  title: string;
  summary: string;
  scopeId: string;
  disposition: SkoposWorkQueueDisposition;
  reason: string;
  taskState?: SkoposTaskState;
  risk?: SkoposTaskRisk;
  priority: number;
  dependencyIds: string[];
  claimedByActorId?: string;
  updatedAt?: string;
}

export interface SkoposWorkQueueArtifact extends SkoposArtifactEnvelope<'work-queue'> {
  workspaceRoot: string;
  entries: SkoposWorkQueueEntry[];
  counts: Record<SkoposWorkQueueDisposition, number>;
}

export interface SkoposWorkQueueRunResult {
  workspaceRoot: string;
  actorId?: string;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  workQueue: SkoposWorkQueueArtifact;
  currentTaskId?: string;
  recommendedEntry?: SkoposWorkQueueEntry;
  summary: string;
}
