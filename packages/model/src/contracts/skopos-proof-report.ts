import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposProofScorecard,
  SkoposProofScorecardComparison,
} from './skopos-proof-scorecard.js';

export interface SkoposProofReportArtifact extends SkoposArtifactEnvelope<'proof-report'> {
  workspaceRoot: string;
  definitionSetPath: string;
  baselinePath: string;
  scorecard: SkoposProofScorecard;
  comparison: SkoposProofScorecardComparison;
}
