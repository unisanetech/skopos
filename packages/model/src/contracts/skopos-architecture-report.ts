import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposProjectArchetype, SkoposRepoMode } from './skopos-root-config.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';

export type SkoposArchitectureTopology =
  | 'single-service'
  | 'single-web-app'
  | 'single-library'
  | 'single-workspace'
  | 'service-monorepo'
  | 'web-monorepo'
  | 'library-monorepo'
  | 'mixed-monorepo'
  | 'platform-monorepo'
  | 'internal-tool-workspace';

export type SkoposArchitectureBoundaryQuality = 'clear' | 'mixed' | 'weak';

export type SkoposArchitectureAlignmentStatus = 'aligned' | 'partial' | 'divergent';

export type SkoposArchitectureUnitRole =
  | 'workspace-root'
  | 'service'
  | 'web-app'
  | 'library'
  | 'support'
  | 'unknown';

export interface SkoposArchitectureUnit {
  scopeId: string;
  title: string;
  path: string;
  role: SkoposArchitectureUnitRole;
  confidence: SkoposConfidence;
  summary: string;
}

export interface SkoposArchitectureView {
  topology: SkoposArchitectureTopology;
  boundaryQuality: SkoposArchitectureBoundaryQuality;
  summary: string;
  units: SkoposArchitectureUnit[];
  evidence: string[];
}

export interface SkoposArchitectureDecision {
  id: string;
  summary: string;
  reason: string;
  confidence: SkoposConfidence;
  relatedFindingIds: string[];
  recommendedAction?: string;
}

export interface SkoposArchitectureReport extends SkoposArtifactEnvelope<'architecture'> {
  workspaceRoot: string;
  focusSubtree?: string;
  repoMode: SkoposRepoMode;
  archetypeSuggestion: SkoposProjectArchetype;
  alignmentStatus: SkoposArchitectureAlignmentStatus;
  current: SkoposArchitectureView;
  recommended: SkoposArchitectureView;
  unresolvedDecisions: SkoposArchitectureDecision[];
}
