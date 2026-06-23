import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposReadiness, SkoposTrustLevel } from './skopos-trust-report.js';

export type SkoposMemoryLayerKind =
  | 'observed'
  | 'inferred'
  | 'accepted'
  | 'operational'
  | 'agent-ready';

export type SkoposMemoryFreshnessStatus = 'fresh' | 'stale' | 'partial' | 'unknown';

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

export interface SkoposMemoryStateArtifact extends SkoposArtifactEnvelope<'memory-state'> {
  workspaceRoot: string;
  trustLevel: SkoposTrustLevel | 'unknown';
  readiness: SkoposReadiness | 'unknown';
  freshness: SkoposMemoryFreshnessStatus;
  summary: string;
  layers: SkoposMemoryLayerSummary[];
  sourceProbes: SkoposMemorySourceProbe[];
  acceptedDecisionSnapshots: SkoposMemoryDecisionSnapshot[];
  agentBriefPaths: string[];
  policyArtifactPaths: string[];
  stackArtifactPaths: string[];
  driftReportPath?: string;
  staleReasons: string[];
}
