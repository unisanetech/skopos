import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposProjectArchetype, SkoposRepoMode } from './skopos-root-config.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';

export type SkoposPatternFamily =
  | 'workspace-structure'
  | 'docs-root'
  | 'docs-freshness'
  | 'instruction-surface'
  | 'command-surface';

export type SkoposPatternClassification =
  | 'canonical'
  | 'recommended'
  | 'tolerated'
  | 'legacy'
  | 'conflicting'
  | 'poor'
  | 'unknown';

export type SkoposDiagnosisSeverity = 'low' | 'medium' | 'high';

export type SkoposRepoHealth = 'healthy' | 'needs-stabilization' | 'at-risk';

export interface SkoposDiagnosisFinding {
  id: string;
  family: SkoposPatternFamily;
  classification: SkoposPatternClassification;
  severity: SkoposDiagnosisSeverity;
  confidence: SkoposConfidence;
  summary: string;
  evidence: string[];
  recommendedAction?: string;
  requiresHumanDecision: boolean;
}

export interface SkoposRemediationTask {
  id: string;
  title: string;
  detail: string;
  priority: SkoposDiagnosisSeverity;
  relatedFindingIds: string[];
  recommendedCommand?: string;
}

export interface SkoposDiagnosisReport extends SkoposArtifactEnvelope<'diagnosis'> {
  workspaceRoot: string;
  focusSubtree?: string;
  repoMode: SkoposRepoMode;
  archetypeSuggestion: SkoposProjectArchetype;
  confidence: SkoposConfidence;
  packageCount: number;
  workspacePackageCount: number;
  health: SkoposRepoHealth;
  findings: SkoposDiagnosisFinding[];
  remediationTasks: SkoposRemediationTask[];
}
