import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposCompactTaskBrief,
  SkoposTaskContract,
} from './skopos-agent-native-operating-model.js';
import type { SkoposTaskIdentity } from './skopos-task-identity.js';
import type { SkoposWorkflowReceipt } from './skopos-workflow.js';

export type SkoposArtifactRetention = 'shared' | 'local' | 'disposable';

export type SkoposArtifactMigrationState =
  | 'current-authority'
  | 'staged-projection'
  | 'compatibility-retained'
  | 'cache-candidate'
  | 'retired';

export interface SkoposArtifactFamilyLifecycle {
  id: string;
  authorityPaths: string[];
  compactPaths: string[];
  compatibilityPaths: string[];
  retention: SkoposArtifactRetention;
  migrationState: SkoposArtifactMigrationState;
  summary: string;
  removalCondition?: string;
}

export interface SkoposCompactProjectArtifact
  extends SkoposArtifactEnvelope<'compact-project'> {
  workspaceRoot: string;
  workflowAuthority: 'skopos';
  migrationVersion: 1;
  migrationStrategy: 'staged';
  families: SkoposArtifactFamilyLifecycle[];
}

export interface SkoposCurrentTaskProjection
  extends SkoposArtifactEnvelope<'current-task-projection'> {
  workspaceRoot: string;
  taskIdentity: SkoposTaskIdentity;
  authorityMissionPath: string;
  task: SkoposTaskContract;
}

export interface SkoposCurrentBriefProjection
  extends SkoposArtifactEnvelope<'current-brief-projection'> {
  workspaceRoot: string;
  taskIdentity: SkoposTaskIdentity;
  authorityMissionPath: string;
  brief: SkoposCompactTaskBrief;
}

export interface SkoposReceiptProjection
  extends SkoposArtifactEnvelope<'workflow-receipt-projection'> {
  workspaceRoot: string;
  authorityRunPath: string;
  workflowId: string;
  runId: string;
  receipt: SkoposWorkflowReceipt;
}

export interface SkoposArtifactLifecycleValidation {
  status: 'pass' | 'fail';
  diagnostics: string[];
}
