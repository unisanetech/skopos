import type {
  SkoposContextBundle,
  SkoposDecisionQuestion,
  SkoposPlanStep,
  SkoposCommandName,
  SkoposRootConfig,
  SkoposScanSummary,
  SkoposPlanResult,
  SkoposWorkflowRequirement,
} from '@skopos/model';

export interface SkoposPlanPackageValidationSurface {
  scopeId: string;
  scopeTitle: string;
  scopeAliases: string[];
  packageName: string;
  scripts: string[];
  matchPhrases: string[];
}

const DOCS_ONLY_GOAL_PATTERNS = [
  'docs',
  'documentation',
  'readme',
  'changelog',
  'runbook',
  'metadata',
  'wording',
  'copy',
  'instruction',
  'instructions',
  'commentary',
  'spelling',
  'typo',
];

const CODE_LIKE_GOAL_PATTERNS = [
  'api',
  'endpoint',
  'route',
  'schema',
  'runtime',
  'service',
  'adapter',
  'module',
  'package',
  'build',
  'test',
  'lint',
  'typecheck',
  'proof',
  'eval',
  'cli',
  'ui',
  'watch',
  'command',
  'script',
  'token',
  'auth',
  'security',
  'privacy',
];

export interface BuildSkoposPlanOptions {
  workspaceRoot: string;
  goal: string;
  context: SkoposContextBundle;
  scanSummary: SkoposScanSummary;
  config: SkoposRootConfig;
  recommendedWorkflows?: SkoposWorkflowRequirement[];
  packageValidationSurfaces?: SkoposPlanPackageValidationSurface[];
}

export const buildSkoposPlan = ({
  workspaceRoot,
  goal,
  context,
  scanSummary,
  config,
  recommendedWorkflows = [],
  packageValidationSurfaces = [],
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
  const recommendedChecks = buildRecommendedChecks({
    config,
    scope: context.scope,
    goal: normalizedGoal,
    packageValidationSurfaces,
  });
  const implementationSteps = buildImplementationSteps({
    goal: normalizedGoal,
    scopeTitle,
    decisionQuestions,
    recommendedChecks,
    recommendedWorkflows,
  });
  const nextSteps = buildNextSteps(decisionQuestions, recommendedChecks, recommendedWorkflows);

  return {
    workspaceRoot,
    goal: normalizedGoal,
    title: buildPlanTitle(normalizedGoal),
    summary: `Plan ${actionVerbForGoal(normalizedGoal)} in ${scopeTitle} using compact scope-first context and explicit decision gates where needed.`,
    scope: context.scope,
    confidence: scanSummary.confidence,
    references: context.references,
    implementationSteps,
    recommendedChecks,
    recommendedWorkflows,
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
        'Should this change stay at workspace scope, or should it be narrowed to one package or domain?',
      whyItMatters:
        'Wide-scope plans in monorepos drift faster and make trust reports less precise.',
      recommendedOptionId: 'narrow-scope-first',
      options: [
        {
          id: 'narrow-scope-first',
          label: 'Narrow scope first',
          rationale:
            'Recommended because a single package or domain keeps context, checks, and docs impact easier to control.',
        },
        {
          id: 'keep-workspace-scope',
          label: 'Keep workspace scope',
          rationale:
            'Useful when the change truly spans multiple packages and you intend to coordinate a multi-scope rollout.',
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
        'Architecture changes should be explicit so future retrieval and trust rules do not model the wrong pattern as canonical.',
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
            'Recommended because staged rollouts reduce drift and make trust checks easier to reason about.',
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
      `Planning at workspace scope for ${scopeTitle} may broaden change impact across multiple packages.`,
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

const COMMAND_NAMES: readonly SkoposCommandName[] = ['typecheck', 'test', 'build', 'lint'];

const PACKAGE_SCRIPT_CANDIDATES: Record<SkoposCommandName, readonly string[]> = {
  dev: ['dev'],
  build: ['build'],
  test: ['test'],
  typecheck: ['typecheck', 'check-types'],
  lint: ['lint'],
};

const buildRecommendedChecks = ({
  config,
  scope,
  goal,
  packageValidationSurfaces,
}: {
  config: SkoposRootConfig;
  scope: SkoposContextBundle['scope'];
  goal: string;
  packageValidationSurfaces?: SkoposPlanPackageValidationSurface[];
}): string[] => {
  if (isDocsOnlyValidationLane({ scope, goal })) {
    return [];
  }

  const packageValidationSurface = resolveValidationSurfaceForPlan({
    scope,
    goal,
    packageValidationSurfaces: packageValidationSurfaces ?? [],
  });

  return COMMAND_NAMES.flatMap((commandName) => {
    const configuredCommand = config.commands[commandName];
    if (typeof configuredCommand !== 'string' || configuredCommand.trim().length === 0) {
      return [];
    }

    return (
      buildScopedValidationCommand({
        commandName,
        configuredCommand,
        packageValidationSurface,
      }) ?? configuredCommand
    );
  });
};

const isDocsOnlyValidationLane = ({
  scope,
  goal,
}: {
  scope: SkoposContextBundle['scope'];
  goal: string;
}): boolean => {
  if (scope.scope.kind === 'docs-root' || scope.scope.kind === 'instruction-file') {
    return true;
  }

  const normalizedGoal = goal.toLowerCase();
  return (
    DOCS_ONLY_GOAL_PATTERNS.some((pattern) => normalizedGoal.includes(pattern)) &&
    !CODE_LIKE_GOAL_PATTERNS.some((pattern) => normalizedGoal.includes(pattern))
  );
};

const buildScopedValidationCommand = ({
  commandName,
  configuredCommand,
  packageValidationSurface,
}: {
  commandName: SkoposCommandName;
  configuredCommand: string;
  packageValidationSurface?: SkoposPlanPackageValidationSurface;
}): string | null => {
  if (!configuredCommand.startsWith('pnpm')) {
    return null;
  }

  const packageName = packageValidationSurface?.packageName?.trim();
  if (!packageName) {
    return null;
  }

  const availableScripts = new Set(packageValidationSurface?.scripts ?? []);
  const scriptName = PACKAGE_SCRIPT_CANDIDATES[commandName].find((candidate) =>
    availableScripts.has(candidate),
  );
  if (scriptName) {
    return `pnpm --filter ${packageName} ${scriptName}`;
  }

  const packageFamily = packageName.match(/^(@[^/]+)\//)?.[1];
  if (!packageFamily) {
    return null;
  }

  return `pnpm --recursive --filter ${packageFamily}/* ${commandName}`;
};

const resolveValidationSurfaceForPlan = ({
  scope,
  goal,
  packageValidationSurfaces,
}: {
  scope: SkoposContextBundle['scope'];
  goal: string;
  packageValidationSurfaces: SkoposPlanPackageValidationSurface[];
}): SkoposPlanPackageValidationSurface | undefined => {
  if (packageValidationSurfaces.length === 0) {
    return undefined;
  }

  if (scope.scope.kind === 'package') {
    return packageValidationSurfaces.find((entry) => entry.scopeId === scope.scope.id);
  }

  if (scope.scope.kind !== 'workspace') {
    return undefined;
  }

  const normalizedGoal = normalizeMatchValue(goal);
  const matches = packageValidationSurfaces.filter((entry) =>
    entry.matchPhrases.some((phrase) => normalizedGoal.includes(phrase)),
  );

  return matches.length === 1 ? matches[0] : undefined;
};

const normalizeMatchValue = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

interface BuildImplementationStepsInput {
  goal: string;
  scopeTitle: string;
  decisionQuestions: SkoposDecisionQuestion[];
  recommendedChecks: string[];
  recommendedWorkflows: SkoposWorkflowRequirement[];
}

const buildImplementationSteps = ({
  goal,
  scopeTitle,
  decisionQuestions,
  recommendedChecks,
  recommendedWorkflows,
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

  if (recommendedWorkflows.length > 0) {
    steps.push({
      id: 'run-workflows',
      title: 'Run registered project workflows',
      detail: `Use the registered workflow surface where needed: ${recommendedWorkflows.map((workflow) => workflow.id).join(' | ')}`,
    });
  }

  if (recommendedChecks.length > 0) {
    steps.push({
      id: 'run-checks',
      title: 'Run canonical validation commands',
      detail: `Validate with the configured command surface: ${recommendedChecks.join(' | ')}`,
    });
  }

  return steps;
};

const buildNextSteps = (
  decisionQuestions: SkoposDecisionQuestion[],
  recommendedChecks: string[],
  recommendedWorkflows: SkoposWorkflowRequirement[],
): string[] => {
  const nextSteps = ['Review the compact references before making code changes.'];

  if (decisionQuestions.length > 0) {
    nextSteps.push('Answer the plan questions that Skopos marked as high-impact.');
  }

  if (recommendedChecks.length > 0) {
    nextSteps.push('Use the canonical command surface for validation rather than ad hoc commands.');
  }

  if (recommendedWorkflows.length > 0) {
    nextSteps.push(
      `Run the registered workflow surface when applicable: ${recommendedWorkflows.map((workflow) => workflow.id).join(', ')}.`,
    );
  }

  nextSteps.push('Keep docs and trust surfaces in sync as part of the same change.');

  return nextSteps;
};
