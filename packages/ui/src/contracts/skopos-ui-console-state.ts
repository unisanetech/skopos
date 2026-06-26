import type {
  SkoposContentIndexArtifact,
  SkoposDriftReportArtifact,
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionHandoffArtifact,
  SkoposEnforcementProfileArtifact,
  SkoposMissionArtifact,
  SkoposPlanArtifact,
  SkoposPolicyPackManifest,
  SkoposPolicyOverrideArtifact,
  SkoposPolicyRecommendationArtifact,
  SkoposPolicyRoleMappingArtifact,
  SkoposRepoUnderstandingSummaryArtifact,
  SkoposFeatureInventoryArtifact,
  SkoposImplementationHotspotsArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposProgramStateArtifact,
  SkoposProofReportArtifact,
  SkoposScopeLite,
  SkoposToolAdapterSummary,
  SkoposTrustReport,
  SkoposWorkflowQuestionArtifact,
} from '@skopos/model';

import type { SkoposUiActivityViewsResult } from './skopos-ui-activity-view.js';
import type { SkoposUiGraphViewsResult } from './skopos-ui-graph-view.js';
import type { SkoposUiArtifactCounts } from './skopos-ui-portal.js';
import type { SkoposUiConsoleSearchIndex } from './skopos-ui-search.js';

export type SkoposUiConsoleLinkKind =
  | 'doc'
  | 'config'
  | 'artifact'
  | 'report'
  | 'portal'
  | 'instructions';

export type SkoposUiConsoleDocumentFormat =
  | 'markdown'
  | 'json'
  | 'yaml'
  | 'html'
  | 'text'
  | 'unknown';

export type SkoposUiConsoleDocumentLifecycle = 'active' | 'durable' | 'historical';

export interface SkoposUiConsoleLink {
  id: string;
  title: string;
  href: string;
  displayPath: string;
  exists: boolean;
  kind: SkoposUiConsoleLinkKind;
}

export interface SkoposUiConsoleDocumentSection {
  id: string;
  title: string;
  body: string;
  level: number;
  kind: 'narrative' | 'metadata' | 'changelog' | 'reference' | 'preview';
}

export type SkoposUiConsoleArtifactTone =
  | 'neutral'
  | 'positive'
  | 'warning'
  | 'danger'
  | 'info';

export interface SkoposUiConsoleArtifactMetric {
  label: string;
  value: string;
  tone?: SkoposUiConsoleArtifactTone;
  monospace?: boolean;
}

export interface SkoposUiConsoleArtifactEntry {
  title: string;
  summary?: string;
  meta?: string;
  badge?: string;
  tone?: SkoposUiConsoleArtifactTone;
}

export interface SkoposUiConsoleArtifactTable {
  columns: string[];
  rows: string[][];
}

export interface SkoposUiConsoleArtifactSection {
  id: string;
  title: string;
  description?: string;
  layout: 'key-value' | 'entries' | 'list' | 'table' | 'json';
  items?: Array<{ label: string; value: string; monospace?: boolean }>;
  entries?: SkoposUiConsoleArtifactEntry[];
  listItems?: string[];
  table?: SkoposUiConsoleArtifactTable;
  code?: string;
  defaultExpanded?: boolean;
}

export interface SkoposUiConsoleArtifactView {
  kind: 'architecture' | 'bootstrap' | 'diagnosis' | 'index' | 'generic';
  summary?: string;
  metrics: SkoposUiConsoleArtifactMetric[];
  sections: SkoposUiConsoleArtifactSection[];
}

export interface SkoposUiConsoleDocumentView {
  id: string;
  title: string;
  kind: SkoposUiConsoleLinkKind;
  format: SkoposUiConsoleDocumentFormat;
  lifecycle: SkoposUiConsoleDocumentLifecycle;
  href: string;
  displayPath: string;
  exists: boolean;
  summary: string;
  excerpt: string;
  headings: string[];
  sections: SkoposUiConsoleDocumentSection[];
  artifactView?: SkoposUiConsoleArtifactView;
  updatedAt?: string;
}

export interface SkoposUiConsolePlanView {
  artifactPath: string;
  plan: SkoposPlanArtifact;
}

export interface SkoposUiConsoleMissionView {
  artifactPath: string;
  mission: SkoposMissionArtifact;
  plan?: SkoposUiConsolePlanView;
}

export interface SkoposUiConsoleScopeView {
  scope: SkoposScopeLite;
  relatedPlanIds: string[];
  relatedMissionIds: string[];
  relatedPlanCount: number;
  relatedMissionCount: number;
}

export interface SkoposUiConsoleDiscussionHandoffView {
  artifactPath: string;
  handoff: SkoposDiscussionHandoffArtifact;
}

export interface SkoposUiConsoleDiscussionCheckpointView {
  artifactPath: string;
  checkpoint: SkoposDiscussionCheckpointArtifact;
}

export interface SkoposUiConsoleAdapterSupportView {
  artifactPath: string;
  enforcement?: SkoposEnforcementProfileArtifact;
  adapters: SkoposToolAdapterSummary[];
}

export interface SkoposUiConsolePolicyStructureMatchNode {
  path: string;
  label: string;
  responsibility: string;
  required: boolean;
  checkedPatterns: string[];
  matchedPatterns: string[];
  matchedPaths: string[];
  status: 'matched' | 'missing' | 'optional';
  children: SkoposUiConsolePolicyStructureMatchNode[];
}

export interface SkoposUiConsolePolicyStructureMatch {
  title: string;
  summary: string;
  rootLabel: string;
  nodes: SkoposUiConsolePolicyStructureMatchNode[];
}

export interface SkoposUiConsolePolicyReviewView {
  resolvedPolicy?: {
    artifactPath: string;
    policy: SkoposResolvedPolicyArtifact;
  };
  recommendations?: {
    artifactPath: string;
    recommendations: SkoposPolicyRecommendationArtifact;
  };
  overrides?: {
    artifactPath: string;
    overrides: SkoposPolicyOverrideArtifact;
  };
  roleMapping?: {
    artifactPath: string;
    mapping: SkoposPolicyRoleMappingArtifact;
  };
  driftReport?: {
    artifactPath: string;
    report: SkoposDriftReportArtifact;
  };
  packManifests: Array<{
    artifactPath: string;
    manifest: SkoposPolicyPackManifest;
    structureMatch?: SkoposUiConsolePolicyStructureMatch;
  }>;
}

export interface SkoposUiConsoleUnderstandingView {
  summaryPath: string;
  featureInventoryPath: string;
  hotspotsPath: string;
  summary: SkoposRepoUnderstandingSummaryArtifact;
  featureInventory: SkoposFeatureInventoryArtifact;
  hotspots: SkoposImplementationHotspotsArtifact;
}

export interface SkoposUiConsoleState {
  workspaceRoot: string;
  workspaceLabel: string;
  outputDirectory: string;
  generatedAt: string;
  artifactCounts: SkoposUiArtifactCounts;
  trustReport: SkoposTrustReport;
  programState?: SkoposProgramStateArtifact;
  workflowQuestions?: SkoposWorkflowQuestionArtifact;
  indexArtifact?: SkoposContentIndexArtifact;
  proofReport?: SkoposProofReportArtifact;
  activity: SkoposUiActivityViewsResult;
  graphs: SkoposUiGraphViewsResult;
  plans: SkoposUiConsolePlanView[];
  missions: SkoposUiConsoleMissionView[];
  scopes: SkoposUiConsoleScopeView[];
  adapterSupport?: SkoposUiConsoleAdapterSupportView;
  policyReview?: SkoposUiConsolePolicyReviewView;
  understanding?: SkoposUiConsoleUnderstandingView;
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  discussionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  docsLinks: SkoposUiConsoleLink[];
  documents: SkoposUiConsoleDocumentView[];
  searchIndex?: SkoposUiConsoleSearchIndex;
}
