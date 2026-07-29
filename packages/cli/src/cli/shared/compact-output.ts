import type {
  SkoposDecisionQuestion,
  SkoposProjectKnowledgeGuidance,
} from '@skopos/model';

export type CompactTransportSurfaceKind =
  | 'compact-command-response'
  | 'compact-human-response';

export interface CompactTransportBudget {
  surfaceKind: CompactTransportSurfaceKind;
  title: string;
  estimatedTokens: number;
  budgetTokens: number;
  status: 'within-budget' | 'over-budget';
  summary: string;
}

const COMPACT_RESPONSE_BUDGET_TOKENS = 700;

export const buildCompactTransportBudget = ({
  title,
  surfaceKind,
  value,
  budgetTokens = COMPACT_RESPONSE_BUDGET_TOKENS,
}: {
  title: string;
  surfaceKind: CompactTransportSurfaceKind;
  value: unknown;
  budgetTokens?: number;
}): CompactTransportBudget => {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  const estimatedTokens = Math.ceil((serialized?.trim().length ?? 0) / 4);
  const status =
    estimatedTokens > budgetTokens ? 'over-budget' as const : 'within-budget' as const;
  return {
    surfaceKind,
    title,
    estimatedTokens,
    budgetTokens,
    status,
    summary:
      status === 'over-budget'
        ? `${title} is over the compact response budget. Request specific fields before loading more context.`
        : `${title} is within the compact response budget.`,
  };
};

export const buildProjectKnowledgeGuidanceLines = (
  projectKnowledge?: SkoposProjectKnowledgeGuidance,
): string[] => {
  if (!projectKnowledge) return [];
  return [
    'Project Memory:',
    `- ${projectKnowledge.summary}`,
    `- freshness: ${projectKnowledge.freshness}`,
    `- load first: ${projectKnowledge.command}`,
    ...(projectKnowledge.recommendedReads.length > 0
      ? [
          '- recommended reads:',
          ...projectKnowledge.recommendedReads.map(
            (read) => `  - ${read.title}: ${read.path}`,
          ),
        ]
      : []),
    ...(projectKnowledge.attentionAreas.length > 0
      ? [
          '- needs attention:',
          ...projectKnowledge.attentionAreas
            .slice(0, 3)
            .map(
              (area) =>
                `  - ${area.title} [${area.status}]${area.nextAction ? `: ${area.nextAction}` : ''}`,
            ),
        ]
      : []),
  ];
};

export const buildGuidedDecisionQuestionLines = (
  questions: SkoposDecisionQuestion[],
): string[] => {
  if (questions.length === 0) return [];
  const lines = ['Questions:'];
  for (const question of questions) {
    const recommended = question.options.find(
      (option) => option.id === question.recommendedOptionId,
    );
    lines.push(
      `Question: ${question.question}`,
      `Recommended: ${recommended?.label ?? question.recommendedOptionId}`,
      `Why this matters: ${question.whyItMatters}`,
      'Options:',
      ...question.options.map(
        (option) =>
          `- ${option.label}${option.id === question.recommendedOptionId ? ' (recommended)' : ''}: ${option.rationale}`,
      ),
    );
  }
  return lines;
};
