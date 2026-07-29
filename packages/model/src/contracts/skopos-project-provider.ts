import type {
  SkoposAction,
  SkoposContextEntry,
  SkoposExecutionPhase,
  SkoposGuard,
  SkoposStructuredCommand,
  SkoposTaskContract,
} from './skopos-agent-native-operating-model.js';
import type { SkoposTaskIdentity } from './skopos-task-identity.js';
import type { SkoposTaskRisk } from './skopos-task.js';

export const SKOPOS_PROJECT_PROVIDER_PROTOCOL_VERSION = 1;

export type SkoposProjectProviderMethod = 'describe' | 'brief' | 'verify';

export interface SkoposProjectProviderRequestEnvelope<TMethod extends SkoposProjectProviderMethod> {
  protocolVersion: typeof SKOPOS_PROJECT_PROVIDER_PROTOCOL_VERSION;
  requestId: string;
  method: TMethod;
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
}

export interface SkoposProjectProviderAuthorityBoundary {
  actionAuthority: 'skopos';
  taskStateAuthority: 'skopos';
  readinessAuthority: 'skopos';
}

export interface SkoposProjectProviderDescribeRequest
  extends SkoposProjectProviderRequestEnvelope<'describe'> {}

export interface SkoposProjectProviderDescription {
  providerId: string;
  providerVersion: string;
  protocolVersion: typeof SKOPOS_PROJECT_PROVIDER_PROTOCOL_VERSION;
  title: string;
  summary: string;
  methods: SkoposProjectProviderMethod[];
  authorityBoundary: SkoposProjectProviderAuthorityBoundary;
  sourcePaths: string[];
  context: SkoposContextEntry[];
  actions: SkoposAction[];
  guards: SkoposGuard[];
}

export interface SkoposProjectProviderDescribeResponse {
  requestId: string;
  method: 'describe';
  description: SkoposProjectProviderDescription;
}

export interface SkoposProjectProviderBriefRequest
  extends SkoposProjectProviderRequestEnvelope<'brief'> {
  task: SkoposTaskContract;
  phase: SkoposExecutionPhase;
  taskRisk: SkoposTaskRisk;
  changedPaths: string[];
}

export interface SkoposProjectProviderBriefResponse {
  requestId: string;
  method: 'brief';
  providerId: string;
  context: SkoposContextEntry[];
  actions: SkoposAction[];
  guards: SkoposGuard[];
  diagnostics: string[];
}

export type SkoposProjectProviderEvidenceKind =
  | 'command-result'
  | 'artifact'
  | 'source-observation';

export interface SkoposProjectProviderEvidence {
  id: string;
  kind: SkoposProjectProviderEvidenceKind;
  status: 'pass' | 'fail' | 'unavailable';
  summary: string;
  command?: SkoposStructuredCommand;
  path?: string;
  sourceDigest?: string;
}

export interface SkoposProjectProviderVerifyRequest
  extends SkoposProjectProviderRequestEnvelope<'verify'> {
  phase: 'iteration' | 'closure';
  changedPaths: string[];
  acceptanceCriteria: string[];
}

export interface SkoposProjectProviderVerifyResponse {
  requestId: string;
  method: 'verify';
  providerId: string;
  phase: 'iteration' | 'closure';
  evidence: SkoposProjectProviderEvidence[];
  diagnostics: string[];
}

export type SkoposProjectProviderRequest =
  | SkoposProjectProviderDescribeRequest
  | SkoposProjectProviderBriefRequest
  | SkoposProjectProviderVerifyRequest;

export type SkoposProjectProviderResponse =
  | SkoposProjectProviderDescribeResponse
  | SkoposProjectProviderBriefResponse
  | SkoposProjectProviderVerifyResponse;
