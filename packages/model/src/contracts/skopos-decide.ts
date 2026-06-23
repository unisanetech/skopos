import type { SkoposMissionArtifact } from './skopos-plan.js';
import type {
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
} from './skopos-workflow-question.js';
import type {
  SkoposWorkflowRecommendationArtifact,
  SkoposWorkflowExecutionSurfaceRecommendation,
  SkoposWorkflowRecommendationEntry,
} from './skopos-workflow-recommendation.js';

export interface SkoposDecideRunResult {
  workspaceRoot: string;
  actorId?: string;
  questionId: string;
  selectedOptionId: string;
  summary: string;
  codeAllowed: boolean;
  questionsPath: string;
  questionsWrite: 'written' | 'dry-run';
  questions: SkoposWorkflowQuestionArtifact;
  recommendationsPath: string;
  recommendationsWrite: 'written' | 'dry-run';
  executionSurface: SkoposWorkflowExecutionSurfaceRecommendation;
  recommendations: SkoposWorkflowRecommendationArtifact;
  resolvedQuestion: SkoposWorkflowQuestionEntry;
  recommendedAction?: SkoposWorkflowRecommendationEntry;
  nextCommand?: string;
  mission?: SkoposMissionArtifact;
  missionPath?: string;
  missionWrite?: 'written' | 'dry-run';
}
