import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposReadiness, SkoposTrustLevel } from './skopos-trust-report.js';

export type SkoposContentIndexEntryKind =
  | 'config'
  | 'doc-router'
  | 'core-artifact'
  | 'agent-brief-artifact'
  | 'discussion-artifact'
  | 'telemetry-artifact'
  | 'understanding-artifact'
  | 'reference-artifact'
  | 'override-artifact'
  | 'graph-artifact'
  | 'plan-artifact'
  | 'mission-artifact'
  | 'workflow-run-artifact'
  | 'tool-adapter';

export interface SkoposContentIndexCounts {
  packageCount: number;
  workspacePackageCount: number;
  scopeCount: number;
  agentBriefCount: number;
  referenceArtifactCount: number;
  graphCount: number;
  planCount: number;
  missionCount: number;
  workflowRunCount: number;
  workflowManifestCount: number;
  overrideEntryCount: number;
}

export interface SkoposContentIndexQuickLinks {
  configPath: string;
  bootstrapPath?: string;
  docsStartHerePath?: string;
  overridesPath?: string;
  logPath: string;
}

export interface SkoposContentIndexLatestEvent {
  id: string;
  eventKind: SkoposOperationalLogEventKind;
  status: SkoposOperationalLogStatus;
  timestamp: string;
  summary: string;
}

export interface SkoposContentIndexEntry {
  id: string;
  kind: SkoposContentIndexEntryKind;
  title: string;
  summary: string;
  path: string;
  updatedAt?: string;
}

export interface SkoposContentIndexArtifact extends SkoposArtifactEnvelope<'index'> {
  workspaceRoot: string;
  focusSubtree?: string;
  docsRoot?: string;
  readiness: SkoposReadiness | 'unknown';
  trustLevel: SkoposTrustLevel | 'unknown';
  counts: SkoposContentIndexCounts;
  quickLinks: SkoposContentIndexQuickLinks;
  latestEvent?: SkoposContentIndexLatestEvent;
  entries: SkoposContentIndexEntry[];
}

export type SkoposOperationalLogEventKind =
  | 'init'
  | 'scan'
  | 'start'
  | 'decision'
  | 'program-sync'
  | 'program-next'
  | 'next'
  | 'eval'
  | 'instructions-scaffold'
  | 'instructions-sync'
  | 'policy'
  | 'policy-drift'
  | 'plan'
  | 'mission-slice'
  | 'mission-claim'
  | 'mission-release'
  | 'mission-complete'
  | 'workflow-run'
  | 'impact'
  | 'done'
  | 'trust'
  | 'override-set'
  | 'understanding';

export type SkoposOperationalLogStatus = 'succeeded' | 'failed' | 'dry-run';

export interface SkoposOperationalLogEntry {
  schemaVersion: number;
  id: string;
  type: 'log-entry';
  workspaceRoot: string;
  eventKind: SkoposOperationalLogEventKind;
  status: SkoposOperationalLogStatus;
  timestamp: string;
  summary: string;
  relatedArtifactPaths: string[];
  metadata?: Record<string, string | number | boolean | null>;
}
