import type {
  SkoposContextBundle,
  SkoposDecisionQuestion,
  SkoposPlanStep,
  SkoposRootConfig,
  SkoposScanSummary,
  SkoposPlanResult,
  SkoposActionRequirement,
} from '@skopos/model';

export interface BuildSkoposPlanOptions {
  workspaceRoot: string;
  goal: string;
  context: SkoposContextBundle;
  scanSummary: SkoposScanSummary;
  config: SkoposRootConfig;
  recommendedActions?: SkoposActionRequirement[];
}

export const buildSkoposPlan = ({
  workspaceRoot,
  goal,
  context,
  scanSummary,
  config,
  recommendedActions = [],
}: BuildSkoposPlanOptions): SkoposPlanResult => {
  const normalizedGoal = goal.trim();
  const scopeTitle = context.scope.scope.title;
  const decisionQuestions = buildDecisionQuestions({
    goal: normalizedGoal,
    scopeTitle,
    scopeKind: context.scope.scope.kind,
    scanSummary,
    config,
  });
  const risks = buildRisks({
    scanSummary,
    scopeTitle,
    scopeKind: context.scope.scope.kind,
    decisionQuestions,
  });
  const implementationSteps = buildImplementationSteps({
    goal: normalizedGoal,
    scopeTitle,
    scopeKind: context.scope.scope.kind,
    decisionQuestions,
    recommendedActions,
  });
  const nextSteps = buildNextSteps({
    scopeKind: context.scope.scope.kind,
    decisionQuestions,
    recommendedActions,
  });

  return {
    workspaceRoot,
    goal: normalizedGoal,
    title: buildPlanTitle(normalizedGoal),
    summary: `Plan ${actionVerbForGoal(normalizedGoal)} in ${scopeTitle} using compact scope-first context and explicit decision gates where needed.`,
    scope: context.scope,
    confidence: scanSummary.confidence,
    references: context.references,
    implementationSteps,
    recommendedActions,
    decisionQuestions,
    risks,
    nextSteps,
  };
};

const buildPlanTitle = (goal: string): string => {
  const trimmed = goal.trim();
  return trimmed.length === 0
    ? 'Untitled plan'
    : `${trimmed.slice(0, 1).toUpperCase()}${trimmed.slice(1)}`;
};

const actionVerbForGoal = (goal: string): string => {
  const normalized = goal.toLowerCase();

  if (normalized.includes('fix')) {
    return 'to fix the requested issue';
  }

  if (normalized.includes('refactor') || normalized.includes('restructure')) {
    return 'to refactor the requested area';
  }

  if (normalized.includes('add') || normalized.includes('create') || normalized.includes('build')) {
    return 'to add the requested change';
  }

  return 'for the requested change';
};

interface BuildDecisionQuestionsInput {
  goal: string;
  scopeTitle: string;
  scopeKind: SkoposContextBundle['scope']['scope']['kind'];
  scanSummary: SkoposScanSummary;
  config: SkoposRootConfig;
}

const buildDecisionQuestions = ({
  goal,
  scopeTitle,
  scopeKind,
  scanSummary,
  config,
}: BuildDecisionQuestionsInput): SkoposDecisionQuestion[] => {
  const questions: SkoposDecisionQuestion[] = [];
  const normalizedGoal = goal.toLowerCase();
  const configuredDecisionTypes = new Set(config.decisions.askFor);

  if (
    scanSummary.repoMode === 'monorepo' &&
    scopeKind === 'workspace' &&
    scanSummary.packageCount > 1
  ) {
    questions.push({
      id: 'plan.scope-confirmation',
      category: 'scope',
      escalation: 'recommend-and-ask',
      question:
        'Should this change stay at workspace scope, or should it be narrowed to one declared Scope?',
      whyItMatters:
        'Wide-scope Plans in monorepos drift faster and make Readiness less precise.',
      recommendedOptionId: 'narrow-scope-first',
      options: [
        {
          id: 'narrow-scope-first',
          label: 'Narrow scope first',
          rationale:
            'Recommended because one declared Scope keeps context, checks, and docs impact easier to control.',
        },
        {
          id: 'keep-workspace-scope',
          label: 'Keep workspace scope',
          rationale:
            'Useful when the change truly spans multiple Scopes and you intend to coordinate a cross-Scope rollout.',
        },
      ],
    });
  }

  if (
    configuredDecisionTypes.has('architecture-shift') &&
    matchesAny(normalizedGoal, [
      'architect',
      'restructur',
      'redesign',
      'split',
      'merge',
      'rewrite',
      'replatform',
      'refactor',
    ])
  ) {
    questions.push({
      id: 'plan.architecture-shift',
      category: 'architecture',
      escalation: 'must-ask',
      question: `Does this plan intentionally change the current architecture or package boundaries around ${scopeTitle}?`,
      whyItMatters:
        'Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.',
      recommendedOptionId: 'preserve-current-boundaries',
      options: [
        {
          id: 'preserve-current-boundaries',
          label: 'Preserve current boundaries',
          rationale: 'Recommended unless the goal explicitly requires a structural redesign.',
        },
        {
          id: 'approve-architecture-change',
          label: 'Approve architecture change',
          rationale:
            'Use this when the change should redefine package, scope, or runtime boundaries.',
        },
      ],
    });
  }

  if (
    configuredDecisionTypes.has('public-api-change') &&
    matchesAny(normalizedGoal, ['api', 'endpoint', 'route', 'public', 'contract', 'sdk', 'schema'])
  ) {
    questions.push({
      id: 'plan.public-api-change',
      category: 'public-api',
      escalation: 'must-ask',
      question: 'Should this plan change a public contract, route, or SDK surface?',
      whyItMatters:
        'Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.',
      recommendedOptionId: 'confirm-contract-first',
      options: [
        {
          id: 'confirm-contract-first',
          label: 'Confirm contract first',
          rationale:
            'Recommended because contract decisions should be explicit before implementation starts.',
        },
        {
          id: 'internal-only-change',
          label: 'Keep change internal',
          rationale:
            'Use this when the goal should not affect public behavior or external consumers.',
        },
      ],
    });
  }

  if (
    configuredDecisionTypes.has('destructive-migration') &&
    matchesAny(normalizedGoal, ['migrat', 'rename', 'remove', 'delete', 'drop', 'replace'])
  ) {
    questions.push({
      id: 'plan.destructive-migration',
      category: 'migration',
      escalation: 'must-ask',
      question: 'Does this plan require a destructive rename, removal, or migration path?',
      whyItMatters:
        'Destructive changes need an explicit cutover strategy instead of an implicit agent decision.',
      recommendedOptionId: 'stage-the-change',
      options: [
        {
          id: 'stage-the-change',
          label: 'Stage the change',
          rationale:
            'Recommended because staged rollouts reduce drift and make Readiness easier to reason about.',
        },
        {
          id: 'hard-cutover',
          label: 'Hard cutover',
          rationale: 'Use only when an immediate break is intentional and fully understood.',
        },
      ],
    });
  }

  if (
    configuredDecisionTypes.has('vendor-choice') &&
    matchesAny(normalizedGoal, [
      'vendor',
      'provider',
      'stripe',
      'database',
      'postgres',
      'mysql',
      'mongodb',
      'redis',
      'storage',
      'billing',
      'email',
      'queue',
    ])
  ) {
    questions.push({
      id: 'plan.vendor-choice',
      category: 'provider',
      escalation: 'must-ask',
      question: 'Does this plan require choosing or replacing a provider or vendor integration?',
      whyItMatters:
        'Provider choices carry cost, lock-in, and operational tradeoffs that the agent should not invent.',
      recommendedOptionId: 'stay-with-current-provider',
      options: [
        {
          id: 'stay-with-current-provider',
          label: 'Stay with current provider',
          rationale: 'Recommended unless there is a clear user decision to switch providers.',
        },
        {
          id: 'approve-provider-change',
          label: 'Approve provider change',
          rationale: 'Use when the migration is intentional and the tradeoffs are accepted.',
        },
      ],
    });
  }

  if (
    configuredDecisionTypes.has('security-privacy-change') &&
    matchesAny(normalizedGoal, [
      'auth',
      'security',
      'privacy',
      'permission',
      'rbac',
      'secret',
      'token',
      'session',
      'scope',
    ])
  ) {
    questions.push({
      id: 'plan.security-privacy-change',
      category: 'security',
      escalation: 'must-ask',
      question:
        'Does this plan change authentication, authorization, privacy, or security-sensitive behavior?',
      whyItMatters:
        'Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.',
      recommendedOptionId: 'confirm-security-policy',
      options: [
        {
          id: 'confirm-security-policy',
          label: 'Confirm policy first',
          rationale:
            'Recommended because security-sensitive changes should follow an explicit policy choice.',
        },
        {
          id: 'implement-fast-path',
          label: 'Implement fast path',
          rationale: 'Use only when the required policy is already settled and documented.',
        },
      ],
    });
  }

  return questions;
};

const matchesAny = (goal: string, patterns: string[]): boolean =>
  patterns.some((pattern) => goal.includes(pattern));

interface BuildRisksInput {
  scanSummary: SkoposScanSummary;
  scopeTitle: string;
  scopeKind: SkoposContextBundle['scope']['scope']['kind'];
  decisionQuestions: SkoposDecisionQuestion[];
}

const buildRisks = ({
  scanSummary,
  scopeTitle,
  scopeKind,
  decisionQuestions,
}: BuildRisksInput): string[] => {
  const risks: string[] = [];

  if (scopeKind === 'workspace' && scanSummary.repoMode === 'monorepo') {
    risks.push(
      `Planning at workspace scope for ${scopeTitle} may broaden change impact across multiple declared Scopes.`,
    );
  }

  if (scanSummary.findings.length > 0) {
    risks.push(...scanSummary.findings.slice(0, 3));
  }

  if (decisionQuestions.some((question) => question.escalation === 'must-ask')) {
    risks.push('One or more human decisions should be answered before implementation begins.');
  }

  return risks;
};

interface BuildImplementationStepsInput {
  goal: string;
  scopeTitle: string;
  scopeKind: SkoposContextBundle['scope']['scope']['kind'];
  decisionQuestions: SkoposDecisionQuestion[];
  recommendedActions: SkoposActionRequirement[];
}

const buildImplementationSteps = ({
  goal,
  scopeTitle,
  scopeKind,
  decisionQuestions,
  recommendedActions,
}: BuildImplementationStepsInput) => {
  const steps: SkoposPlanStep[] = [];

  if (decisionQuestions.length > 0) {
    steps.push({
      id: 'resolve-decisions',
      title: 'Resolve plan decisions',
      detail:
        'Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.',
    });
  }

  if (requiresWorkflowRecordGuard({
    scopeKind,
    decisionQuestions,
    recommendedActions,
  })) {
    steps.push({
      id: 'record-task-risk',
      title: 'Record Task risk and detail before editing',
      detail:
        'Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.',
    });
  }

  steps.push(
    {
      id: 'review-current-pattern',
      title: `Review the current pattern in ${scopeTitle}`,
      detail:
        'Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.',
    },
    {
      id: 'implement-scoped-change',
      title: 'Implement the smallest scoped change',
      detail: `Carry out "${goal}" inside the resolved scope before widening impact to adjacent areas.`,
    },
    {
      id: 'sync-knowledge',
      title: 'Sync docs and instruction surfaces if touched',
      detail:
        'Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.',
    },
  );

  if (recommendedActions.length > 0) {
    steps.push({
      id: 'run-actions',
      title: 'Run selected project Actions',
      detail: `Use the registered Action surface where needed: ${recommendedActions.map((action) => action.id).join(' | ')}`,
    });
  }

  return steps;
};

const buildNextSteps = ({
  scopeKind,
  decisionQuestions,
  recommendedActions,
}: {
  scopeKind: SkoposContextBundle['scope']['scope']['kind'];
  decisionQuestions: SkoposDecisionQuestion[];
  recommendedActions: SkoposActionRequirement[];
}): string[] => {
  const nextSteps = ['Review the compact references before making code changes.'];

  if (decisionQuestions.length > 0) {
    nextSteps.push('Answer the plan questions that Skopos marked as high-impact.');
  }

  if (requiresWorkflowRecordGuard({
    scopeKind,
    decisionQuestions,
    recommendedActions,
  })) {
    nextSteps.push(
      'Before editing, confirm Task risk and detail, then record Task, Decision, Finding, or Plan Memory only when the work requires it.',
    );
  }

  if (recommendedActions.length > 0) {
    nextSteps.push(
      `Run the registered Action surface when applicable: ${recommendedActions.map((action) => action.id).join(', ')}.`,
    );
  }

  nextSteps.push('Keep docs and Readiness surfaces in sync as part of the same change.');

  return nextSteps;
};

const requiresWorkflowRecordGuard = ({
  scopeKind,
  decisionQuestions,
  recommendedActions,
}: {
  scopeKind: SkoposContextBundle['scope']['scope']['kind'];
  decisionQuestions: SkoposDecisionQuestion[];
  recommendedActions: SkoposActionRequirement[];
}): boolean =>
  scopeKind === 'workspace' ||
  decisionQuestions.some((question) => question.escalation === 'must-ask') ||
  recommendedActions.length >= 2;
