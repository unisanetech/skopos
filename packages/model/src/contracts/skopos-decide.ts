import type {
  SkoposTaskArtifact,
  SkoposTaskQuestion,
  SkoposTaskQuestionArtifact,
  SkoposTaskRecommendation,
  SkoposTaskRecommendationArtifact,
} from './skopos-task.js';

export interface SkoposDecideRunResult {
  workspaceRoot: string;
  actorId: string;
  taskId: string;
  questionId: string;
  selectedOptionId: string;
  summary: string;
  codeAllowed: boolean;
  questionsPath: string;
  questionsWrite: 'written' | 'dry-run';
  questions: SkoposTaskQuestionArtifact;
  recommendationsPath: string;
  recommendationsWrite: 'written' | 'dry-run';
  recommendations: SkoposTaskRecommendationArtifact;
  resolvedQuestion: SkoposTaskQuestion;
  recommendedAction?: SkoposTaskRecommendation;
  task: SkoposTaskArtifact;
  taskPath: string;
  taskWrite: 'written' | 'dry-run';
}
