import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposMissionArtifact } from './skopos-plan.js';
import type { SkoposProofReportArtifact } from './skopos-proof-report.js';
import type { SkoposTrustReport } from './skopos-trust-report.js';
import type {
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
} from './skopos-workflow-question.js';
import type {
  SkoposWorkflowRecommendationArtifact,
  SkoposWorkflowExecutionSurfaceRecommendation,
  SkoposWorkflowRecommendationEntry,
} from './skopos-workflow-recommendation.js';
import type { SkoposWorkflowRequirementEvidence } from './skopos-workflow.js';

export type SkoposEvalStatus = 'complete' | 'needs-review' | 'blocked';
export type SkoposEvalCheckRunStatus = 'pass' | 'fail' | 'skipped' | 'timed-out';
export type SkoposEvalProofStatus = 'pass' | 'fail' | 'missing';

export interface SkoposEvalCheckRun {
  command: string;
  status: SkoposEvalCheckRunStatus;
  summary: string;
  exitCode: number | null;
  timeoutMs?: number;
  startedAt?: string;
  finishedAt?: string;
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
}

export interface SkoposEvalProofEvidence {
  path: string;
  status: SkoposEvalProofStatus;
  summary: string;
  updatedAt?: string;
  scorecardStatus?: SkoposProofReportArtifact['scorecard']['status'];
  comparisonStatus?: SkoposProofReportArtifact['comparison']['status'];
  weightedPassRate?: number;
  regressedBenchmarkCount?: number;
  regressedCategoryCount?: number;
}

export interface SkoposEvalArtifact extends SkoposArtifactEnvelope<'eval'> {
  workspaceRoot: string;
  actorId?: string;
  missionId: string;
  missionTitle: string;
  missionPath: string;
  planId: string;
  codeAllowed: boolean;
  evaluationStatus: SkoposEvalStatus;
  blockingQuestionIds: string[];
  pendingItemIds: string[];
  checkRuns: SkoposEvalCheckRun[];
  workflowEvidence: SkoposWorkflowRequirementEvidence[];
  proof: SkoposEvalProofEvidence;
  trust: Pick<SkoposTrustReport, 'trustLevel' | 'readiness' | 'summary' | 'checks'>;
}

export interface SkoposEvalRunResult {
  workspaceRoot: string;
  actorId?: string;
  summary: string;
  missionId: string;
  missionPath: string;
  missionWrite: 'written' | 'dry-run';
  mission: SkoposMissionArtifact;
  evalPath: string;
  evalWrite: 'written' | 'dry-run';
  eval: SkoposEvalArtifact;
  questionsPath: string;
  questions: SkoposWorkflowQuestionArtifact;
  blockingQuestions: SkoposWorkflowQuestionEntry[];
  recommendationsPath: string;
  recommendationsWrite: 'written' | 'dry-run';
  executionSurface: SkoposWorkflowExecutionSurfaceRecommendation;
  recommendations: SkoposWorkflowRecommendationArtifact;
  recommendedAction?: SkoposWorkflowRecommendationEntry;
  nextCommand?: string;
}
