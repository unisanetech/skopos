import type { SkoposProjectKnowledgeGuidance } from './skopos-memory-state.js';
import type { SkoposResolvedScope } from './skopos-scope-lite.js';
import type { SkoposTaskCoordinationState } from './skopos-coordination.js';
import type {
  SkoposTaskArtifact,
  SkoposTaskQuestion,
  SkoposTaskQuestionArtifact,
  SkoposTaskRecommendation,
  SkoposTaskRecommendationArtifact,
} from './skopos-task.js';

export interface SkoposStartRunResult {
  workspaceRoot: string;
  goal: string;
  summary: string;
  nextCommand: string;
  nextReason: string;
  actorId?: string;
  scope: SkoposResolvedScope;
  codeAllowed: boolean;
  taskPath: string;
  taskWrite: 'written' | 'dry-run';
  task: SkoposTaskArtifact;
  coordination?: SkoposTaskCoordinationState;
  questionsPath: string;
  questionsWrite: 'written' | 'dry-run';
  questions: SkoposTaskQuestionArtifact;
  recommendationsPath: string;
  recommendationsWrite: 'written' | 'dry-run';
  recommendations: SkoposTaskRecommendationArtifact;
  projectKnowledge: SkoposProjectKnowledgeGuidance;
  blockingQuestions: SkoposTaskQuestion[];
  recommendedAction?: SkoposTaskRecommendation;
}
