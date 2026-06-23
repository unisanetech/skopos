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

export interface SkoposToolAdapterWorkflowRouterCoverage {
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
  workflowRouterCoverage: SkoposToolAdapterWorkflowRouterCoverage;
}

export interface SkoposEnforcementProfileArtifact extends SkoposArtifactEnvelope<'enforcement'> {
  workspaceRoot: string;
  instructionSourcePath: string;
  primarySurface: 'cli-and-mcp';
  requiredWorkflowCount: number;
  approvalRequiredWorkflowCount: number;
  rules: SkoposEnforcementRule[];
  toolAdapters: SkoposToolAdapterSummary[];
}
