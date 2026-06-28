import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposReadiness, SkoposTrustLevel } from './skopos-trust-report.js';

export type SkoposMemoryLayerKind =
  | 'observed'
  | 'inferred'
  | 'accepted'
  | 'operational'
  | 'agent-ready';

export type SkoposMemoryFreshnessStatus = 'fresh' | 'stale' | 'partial' | 'unknown';

export type SkoposMemoryRoleKind =
  | 'agent-entrypoint'
  | 'project-overview'
  | 'architecture-structure'
  | 'validation-gates'
  | 'decisions-rationale'
  | 'findings-drift'
  | 'generated-artifacts'
  | 'accepted-policy'
  | 'stack-decisions'
  | 'active-work'
  | 'discussion-handoff';

export type SkoposMemoryRoleAuthority =
  | 'canonical'
  | 'supporting'
  | 'generated'
  | 'unknown';

export type SkoposMemoryRoleStatus = 'mapped' | 'needs-review' | 'missing' | 'stale';

export type SkoposMemorySourceKind =
  | 'human-doc'
  | 'instruction'
  | 'config'
  | 'package-manifest'
  | 'generated-artifact'
  | 'workflow-artifact';

export type SkoposMemorySuggestionSeverity = 'must' | 'should' | 'advisory';

export interface SkoposMemorySourceProbe {
  path: string;
  kind: string;
  existsAtBuild: boolean;
  fingerprint?: string;
  checkedAt?: string;
}

export interface SkoposMemoryLayerSummary {
  kind: SkoposMemoryLayerKind;
  status: SkoposMemoryFreshnessStatus;
  summary: string;
  artifactPaths: string[];
  staleSourceCount: number;
  missingSourceCount: number;
}

export interface SkoposMemoryDecisionSnapshot {
  id: string;
  title: string;
  kind: 'policy' | 'stack' | 'workflow' | 'architecture' | 'project' | 'override';
  status: 'accepted' | 'rejected' | 'deferred' | 'superseded';
  sourcePath?: string;
  summary: string;
}

export interface SkoposMemoryRoleSource {
  path: string;
  kind: SkoposMemorySourceKind;
  authority: SkoposMemoryRoleAuthority;
  existsAtBuild: boolean;
  summary: string;
}

export interface SkoposMemorySuggestion {
  id: string;
  role: SkoposMemoryRoleKind;
  severity: SkoposMemorySuggestionSeverity;
  summary: string;
  nextAction: string;
  suggestedPaths: string[];
  requiresApproval: boolean;
}

export interface SkoposMemoryRole {
  role: SkoposMemoryRoleKind;
  title: string;
  status: SkoposMemoryRoleStatus;
  authority: SkoposMemoryRoleAuthority;
  confidence: 'low' | 'medium' | 'high';
  freshness: SkoposMemoryFreshnessStatus;
  summary: string;
  sources: SkoposMemoryRoleSource[];
  suggestionIds: string[];
}

export interface SkoposMemoryStateArtifact extends SkoposArtifactEnvelope<'memory-state'> {
  workspaceRoot: string;
  trustLevel: SkoposTrustLevel | 'unknown';
  readiness: SkoposReadiness | 'unknown';
  freshness: SkoposMemoryFreshnessStatus;
  summary: string;
  roles: SkoposMemoryRole[];
  suggestions: SkoposMemorySuggestion[];
  layers: SkoposMemoryLayerSummary[];
  sourceProbes: SkoposMemorySourceProbe[];
  acceptedDecisionSnapshots: SkoposMemoryDecisionSnapshot[];
  agentBriefPaths: string[];
  policyArtifactPaths: string[];
  stackArtifactPaths: string[];
  driftReportPath?: string;
  staleReasons: string[];
}

export interface SkoposProjectKnowledgeGuidance {
  summary: string;
  freshness: SkoposMemoryFreshnessStatus;
  knownAreaCount: number;
  totalAreaCount: number;
  attentionAreaCount: number;
  suggestionCount: number;
  agentGuideReady: boolean;
  command: string;
  memoryPath: string;
  communicationBriefPath: string;
  recommendedReads: Array<{
    role: SkoposMemoryRoleKind;
    title: string;
    path: string;
  }>;
  attentionAreas: Array<{
    role: SkoposMemoryRoleKind;
    title: string;
    status: SkoposMemoryRoleStatus;
    nextAction?: string;
  }>;
}
