import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
export type SkoposContentIndexEntryKind =
  | 'config'
  | 'doc-router'
  | 'core-artifact'
  | 'agent-brief-artifact'
  | 'discussion-artifact'
  | 'telemetry-artifact'
  | 'understanding-artifact'
  | 'reference-artifact'
  | 'graph-artifact'
  | 'plan-artifact'
  | 'task-artifact'
  | 'action-run-artifact'
  | 'verification-artifact'
  | 'readiness-artifact'
  | 'tool-adapter';

export interface SkoposContentIndexCounts {
  packageCount: number;
  workspacePackageCount: number;
  scopeCount: number;
  agentBriefCount: number;
  referenceArtifactCount: number;
  graphCount: number;
  planCount: number;
  taskCount: number;
  actionRunCount: number;
  actionManifestCount: number;
  documentCount?: number;
}

export type SkoposDocumentRole =
  | 'router'
  | 'overview'
  | 'architecture'
  | 'standard'
  | 'domain'
  | 'guide'
  | 'operation'
  | 'decision'
  | 'finding'
  | 'plan'
  | 'task'
  | 'pattern'
  | 'reference'
  | 'document';

export type SkoposDocumentLifecycle = 'active' | 'durable' | 'historical' | 'dead';

export type SkoposDocumentAuthority =
  | 'canonical'
  | 'supporting'
  | 'generated';

export type SkoposDocumentProvenance =
  | 'declared'
  | 'accepted'
  | 'observed'
  | 'inferred'
  | 'proposed';

export type SkoposDocumentView = 'current' | 'target' | 'transition' | 'exception';

export type SkoposPatternKind = 'preferred-pattern' | 'failure-pattern';

export type SkoposFindingSeverity = 'MUST' | 'SHOULD' | 'COULD';

export type SkoposDocumentAdoption = 'adopted' | 'discovery';

export interface SkoposDocumentMetadata {
  id?: string;
  status?: string;
  owner?: string;
  scope?: string;
  role?: SkoposDocumentRole;
  lifecycle?: SkoposDocumentLifecycle;
  authority?: SkoposDocumentAuthority;
  provenance?: SkoposDocumentProvenance;
  view?: SkoposDocumentView;
  severity?: SkoposFindingSeverity;
  priority?: number;
  dependencyIds?: string[];
  patternKind?: SkoposPatternKind;
  appliesTo?: string[];
}

export interface SkoposDocumentKnowledgeEntry {
  id: string;
  title: string;
  path: string;
  sourceId: string;
  adoption: SkoposDocumentAdoption;
  role: SkoposDocumentRole;
  lifecycle: SkoposDocumentLifecycle;
  authority: SkoposDocumentAuthority;
  defaultVisible: boolean;
  summary?: string;
  updatedAt?: string;
  metadata?: SkoposDocumentMetadata;
}

export interface SkoposContentIndexQuickLinks {
  configPath: string;
  bootstrapPath?: string;
  docsStartHerePath?: string;
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
  readiness: 'ready' | 'attention' | 'blocked' | 'unknown';
  counts: SkoposContentIndexCounts;
  quickLinks: SkoposContentIndexQuickLinks;
  latestEvent?: SkoposContentIndexLatestEvent;
  documents?: SkoposDocumentKnowledgeEntry[];
  entries: SkoposContentIndexEntry[];
}

export type SkoposOperationalLogEventKind =
  | 'init'
  | 'scan'
  | 'start'
  | 'decision'
  | 'next'
  | 'work-queue'
  | 'verification'
  | 'readiness'
  | 'evidence'
  | 'adoption'
  | 'coordination'
  | 'instructions-scaffold'
  | 'instructions-sync'
  | 'policy'
  | 'policy-drift'
  | 'plan'
  | 'task-claim'
  | 'task-release'
  | 'task-step-complete'
  | 'task-complete'
  | 'action-run'
  | 'impact'
  | 'discussion'
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
