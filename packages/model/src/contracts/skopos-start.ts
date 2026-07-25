import type { SkoposMissionArtifact, SkoposPlanRunResult } from './skopos-plan.js';
import type { SkoposCompactTaskBrief } from './skopos-agent-native-operating-model.js';
import type { SkoposProjectKnowledgeGuidance } from './skopos-memory-state.js';
import type { SkoposResolvedScope } from './skopos-scope-lite.js';
import type { SkoposTaskStatePaths } from './skopos-task-identity.js';
import type {
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowQuestionEntry,
} from './skopos-workflow-question.js';
import type {
  SkoposWorkflowRecommendationArtifact,
  SkoposWorkflowExecutionSurfaceRecommendation,
  SkoposWorkflowRecommendationEntry,
} from './skopos-workflow-recommendation.js';

export interface SkoposStartRunResult {
  workspaceRoot: string;
  goal: string;
  summary: string;
  actorId?: string;
  scope: SkoposResolvedScope;
  codeAllowed: boolean;
  taskState?: SkoposTaskStatePaths;
  planId: string;
  planPath: string;
  missionId: string;
  missionPath: string;
  missionState: SkoposMissionArtifact['state'];
  missionClaimedByActorId?: string;
  questionsPath: string;
  questionsWrite: 'written' | 'dry-run';
  questions: SkoposWorkflowQuestionArtifact;
  recommendationsPath: string;
  recommendationsWrite: 'written' | 'dry-run';
  executionSurface: SkoposWorkflowExecutionSurfaceRecommendation;
  taskBrief?: SkoposCompactTaskBrief;
  recommendations: SkoposWorkflowRecommendationArtifact;
  projectKnowledge: SkoposProjectKnowledgeGuidance;
  blockingQuestions: SkoposWorkflowQuestionEntry[];
  recommendedAction?: SkoposWorkflowRecommendationEntry;
  nextCommand?: string;
  plan: SkoposPlanRunResult;
  mission: SkoposMissionArtifact;
}
