import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposEnforcementTrigger =
  | 'on-session-start'
  | 'manual-readiness'
  | 'after-instruction-source-edit'
  | 'before-context-compact'
  | 'on-user-prompt-submit'
  | 'before-agent-stop';

export type SkoposToolAdapterKind = 'hook-settings' | 'wrapper-manifest';
export type SkoposToolAdapterSupportTier = 'native-lifecycle' | 'wrapper-mediated' | 'manual-fallback';
export type SkoposToolAdapterSupportStatus = 'implemented' | 'planned' | 'manual-only';
export type SkoposToolAdapterInstallMode = 'manual-merge' | 'wrapper-runner' | 'manual-only';

export interface SkoposToolAdapterLifecycleCoverage {
  sessionStart: boolean;
  userTurn: boolean;
  assistantTurn: boolean;
  majorStateChange: boolean;
  preCompact: boolean;
}

export interface SkoposToolAdapterActionRouterCoverage {
  sessionStart: boolean;
  stopBoundary: boolean;
}

export interface SkoposEnforcementRule {
  id: string;
  trigger: SkoposEnforcementTrigger;
  command: string;
  blocking: boolean;
  summary: string;
}

export interface SkoposToolAdapterSummary {
  toolId: string;
  displayName: string;
  summary: string;
  adapterKind: SkoposToolAdapterKind;
  supportTier: SkoposToolAdapterSupportTier;
  supportStatus: SkoposToolAdapterSupportStatus;
  path: string;
  generatedFiles: string[];
  installMode: SkoposToolAdapterInstallMode;
  lifecycleCoverage: SkoposToolAdapterLifecycleCoverage;
  actionRouterCoverage: SkoposToolAdapterActionRouterCoverage;
}

export type SkoposHostProjectionSupport =
  | 'native'
  | 'wrapper'
  | 'manual';

export interface SkoposHostProjection {
  hostId: string;
  displayName: string;
  instructionPath: string;
  instructionProjection: 'canonical' | 'mirror' | 'adapter-guide';
  adapterPath?: string;
  generatedFiles: string[];
  support: SkoposHostProjectionSupport;
  enforcementRuleIds: string[];
}

export interface SkoposHostProjectionModel {
  schemaVersion: 1;
  authority: 'skopos-project-model';
  instructionSourcePath: string;
  enforcementRuleIds: string[];
  hosts: SkoposHostProjection[];
}

export interface SkoposEnforcementProfileArtifact extends SkoposArtifactEnvelope<'enforcement'> {
  workspaceRoot: string;
  instructionSourcePath: string;
  primarySurface: 'cli-and-mcp';
  requiredGuardCount: number;
  approvalRequiredActionCount: number;
  rules: SkoposEnforcementRule[];
  toolAdapters: SkoposToolAdapterSummary[];
  hostProjectionModel: SkoposHostProjectionModel;
}
