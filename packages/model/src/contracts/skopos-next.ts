import type { SkoposMissionArtifact, SkoposMissionItem } from './skopos-plan.js';
import type { SkoposProjectKnowledgeGuidance } from './skopos-memory-state.js';
import type { SkoposUnderstandingSetupReviewArtifact } from './skopos-understanding.js';
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

export interface SkoposNextRunResult {
  workspaceRoot: string;
  actorId?: string;
  summary: string;
  codeAllowed: boolean;
  missionId: string;
  missionPath: string;
  mission: SkoposMissionArtifact;
  questionsPath: string;
  questions: SkoposWorkflowQuestionArtifact;
  blockingQuestions: SkoposWorkflowQuestionEntry[];
  recommendationsPath: string;
  recommendationsWrite: 'written' | 'dry-run';
  executionSurface: SkoposWorkflowExecutionSurfaceRecommendation;
  recommendations: SkoposWorkflowRecommendationArtifact;
  setupReview?: {
    path: string;
    readiness: SkoposUnderstandingSetupReviewArtifact['readiness'];
    openQuestionCount: number;
    answeredQuestionCount: number;
    nextCommand: string;
    openQuestions: SkoposUnderstandingSetupReviewArtifact['openConfirmationQuestions'];
  };
  projectKnowledge: SkoposProjectKnowledgeGuidance;
  recommendedAction?: SkoposWorkflowRecommendationEntry;
  nextCommand?: string;
  nextItem?: SkoposMissionItem;
  pendingItems: SkoposMissionItem[];
  trust: Pick<SkoposTrustReport, 'trustLevel' | 'readiness' | 'summary' | 'checks'>;
}
