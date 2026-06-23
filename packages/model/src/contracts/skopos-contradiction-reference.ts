import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposDiagnosisSeverity,
  SkoposPatternClassification,
} from './skopos-diagnosis-report.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';

export type SkoposContradictionReferenceSource = 'diagnosis' | 'architecture';

export interface SkoposContradictionReferenceEntry {
  id: string;
  source: SkoposContradictionReferenceSource;
  summary: string;
  confidence: SkoposConfidence;
  severity: SkoposDiagnosisSeverity;
  classification: SkoposPatternClassification | 'divergent-architecture';
  evidence: string[];
  relatedIds: string[];
  recommendedAction?: string;
}

export interface SkoposContradictionReferenceArtifact
  extends SkoposArtifactEnvelope<'contradictions'> {
  workspaceRoot: string;
  focusSubtree?: string;
  entries: SkoposContradictionReferenceEntry[];
}
