export const SKOPOS_COORDINATION_SESSION_MODES = [
  'writer',
  'read-only',
  'reviewer',
] as const;

export type SkoposCoordinationSessionMode =
  (typeof SKOPOS_COORDINATION_SESSION_MODES)[number];

export const SKOPOS_COORDINATION_SESSION_STATES = [
  'live',
  'stale',
  'closed',
] as const;

export type SkoposCoordinationSessionState =
  (typeof SKOPOS_COORDINATION_SESSION_STATES)[number];

export const SKOPOS_COORDINATION_RESOURCE_KINDS = [
  'exact-path',
  'path-pattern',
  'semantic-resource',
  'action-output',
  'verification-input',
  'git-mutation',
] as const;

export type SkoposCoordinationResourceKind =
  (typeof SKOPOS_COORDINATION_RESOURCE_KINDS)[number];

export interface SkoposCoordinationSession {
  sessionId: string;
  actorId: string;
  host: string;
  processId: number;
  checkoutPath: string;
  branch: string | null;
  baseRevision: string | null;
  mode: SkoposCoordinationSessionMode;
  state: SkoposCoordinationSessionState;
  openedAt: string;
  heartbeatAt: string;
  leaseExpiresAt: string;
  closedAt: string | null;
}

export interface SkoposTaskReservation {
  taskId: string;
  sessionId: string;
  actorId: string;
  reservedAt: string;
}

export interface SkoposResourceClaim {
  claimId: string;
  taskId: string;
  sessionId: string;
  actorId: string;
  resourceKind: SkoposCoordinationResourceKind;
  resourceKey: string;
  claimedAt: string;
}

export type SkoposMutationOperation = 'create' | 'edit' | 'delete' | 'rename';
export type SkoposMutationStatus = 'open' | 'recorded' | 'contaminated';

export interface SkoposMutationLedgerEntry {
  mutationId: string;
  taskId: string;
  sessionId: string;
  actorId: string;
  path: string;
  operation: SkoposMutationOperation;
  beforeDigest: string;
  afterDigest: string | null;
  status: SkoposMutationStatus;
  reason: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface SkoposCoordinationContamination {
  contaminationId: string;
  taskId: string | null;
  sessionId: string | null;
  path: string;
  expectedDigest: string | null;
  observedDigest: string;
  reason: string;
  state: 'open' | 'reconciled';
  detectedAt: string;
  reconciledAt: string | null;
  reconciledByActorId: string | null;
}

export interface SkoposTaskSnapshotPath {
  path: string;
  digest: string;
}

export interface SkoposTaskSnapshot {
  snapshotId: string;
  taskId: string;
  sessionId: string;
  actorId: string;
  baseRevision: string | null;
  paths: SkoposTaskSnapshotPath[];
  digest: string;
  createdAt: string;
  artifactPath: string;
}

export interface SkoposCoordinationStatus {
  workspaceRoot: string;
  databasePath: string;
  enforcementLevel: 'cooperative';
  preventiveSafety: false;
  sessions: SkoposCoordinationSession[];
  reservations: SkoposTaskReservation[];
  claims: SkoposResourceClaim[];
  mutations: SkoposMutationLedgerEntry[];
  contamination: SkoposCoordinationContamination[];
}

export interface SkoposOpenCoordinationSessionResult {
  workspaceRoot: string;
  databasePath: string;
  enforcementLevel: 'cooperative';
  session: SkoposCoordinationSession;
}

export interface SkoposHeartbeatCoordinationSessionResult {
  workspaceRoot: string;
  databasePath: string;
  session: SkoposCoordinationSession;
}

export interface SkoposEnsureCoordinationSessionResult
  extends SkoposHeartbeatCoordinationSessionResult {
  enforcementLevel: 'cooperative';
  preventiveSafety: false;
  created: boolean;
}

export interface SkoposReserveTaskResult {
  workspaceRoot: string;
  databasePath: string;
  reservation: SkoposTaskReservation;
}

export interface SkoposClaimResourceResult {
  workspaceRoot: string;
  databasePath: string;
  reused: boolean;
  claim: SkoposResourceClaim;
}

export interface SkoposReleaseTaskResult {
  workspaceRoot: string;
  databasePath: string;
  releasedTaskId: string;
  releasedClaimCount: number;
  reason: string;
}

export interface SkoposMutationResult {
  workspaceRoot: string;
  databasePath: string;
  mutation: SkoposMutationLedgerEntry;
}

export interface SkoposCoordinationAuditResult {
  workspaceRoot: string;
  databasePath: string;
  taskId: string;
  clean: boolean;
  contamination: SkoposCoordinationContamination[];
}

export type SkoposTaskRecoveryOperation = 'resume' | 'release';
export type SkoposTaskRecoveryOutcome = 'resumed' | 'released';

export interface SkoposTaskRecoveryLedgerState {
  open: number;
  recorded: number;
  contaminated: number;
}

export interface SkoposRecoverTaskResult {
  workspaceRoot: string;
  databasePath: string;
  taskId: string;
  priorSessionId: string;
  sessionId: string;
  actorId: string;
  generation: number;
  outcome: SkoposTaskRecoveryOutcome;
  releasedClaimCount: number;
  ledgerState: SkoposTaskRecoveryLedgerState;
  reason: string;
}

export interface SkoposTaskSnapshotResult {
  workspaceRoot: string;
  databasePath: string;
  snapshot: SkoposTaskSnapshot;
}

export interface SkoposTaskCoordinationState {
  enforcementLevel: 'cooperative';
  preventiveSafety: false;
  session: SkoposCoordinationSession;
  reservation?: SkoposTaskReservation;
  claims: SkoposResourceClaim[];
}
