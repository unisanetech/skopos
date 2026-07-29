import type {
  SkoposAgentNativeOperatingModel,
  SkoposCompactTaskBrief,
  SkoposContextEntry,
  SkoposExecutionPhase,
  SkoposGuard,
  SkoposResolvedPolicyArtifact,
  SkoposSelectedSkill,
  SkoposTaskArtifact,
  SkoposTaskContract,
  SkoposTaskQuestionArtifact,
  SkoposTaskRisk,
} from '@skopos/model';
import { resolveSkoposScopeContextIds } from '@skopos/query';

const COMPACT_CONTEXT_LIMIT = 8;
const COMPACT_GUARD_LIMIT = 8;

export interface BuildSkoposCompactTaskBriefOptions {
  task: SkoposTaskArtifact;
  questions: SkoposTaskQuestionArtifact;
  operatingModel: SkoposAgentNativeOperatingModel;
  phase: SkoposExecutionPhase;
  risk: SkoposTaskRisk;
  selectedSkills?: SkoposSelectedSkill[];
}

export const buildSkoposCompactTaskBrief = ({
  task: taskArtifact,
  questions,
  operatingModel,
  phase,
  risk,
  selectedSkills = [],
}: BuildSkoposCompactTaskBriefOptions): SkoposCompactTaskBrief => {
  const task = buildTaskContract(taskArtifact, questions);
  const skillActionIds = new Set(selectedSkills.flatMap((skill) => skill.selectedActionIds));
  const skillGuardIds = new Set(selectedSkills.flatMap((skill) => skill.selectedGuardIds));
  const selectedActionIds = new Set([
    ...taskArtifact.selectedActions.map((action) => action.id),
    ...skillActionIds,
  ]);
  const selectedActions = operatingModel.actions.filter(
    (action) => selectedActionIds.has(action.id) && action.phases.includes(phase),
  );
  const taskContext = buildTaskContext(taskArtifact, task);
  const policyContext = selectContext(
    operatingModel.context,
    taskArtifact,
    task,
    risk,
    selectedActions.flatMap((action) => [
      action.id,
      action.title,
      action.description,
      ...action.affectedPaths,
    ]),
  );
  const selectedGuards = selectGuards({
    guards: operatingModel.guards,
    phase,
    selectedIds: new Set([...taskArtifact.selectedGuardIds, ...skillGuardIds]),
  });
  const skillContext = selectedSkills.flatMap((skill) => skill.selectedContext);
  return {
    schemaVersion: 1,
    task,
    phase,
    risk,
    context: {
      availableCount: operatingModel.context.length + 1,
      selectedCount: 1 + policyContext.length + skillContext.length,
      entries: [taskContext, ...policyContext, ...skillContext],
    },
    actions: {
      availableCount: operatingModel.actions.length,
      selectedCount: selectedActions.length,
      entries: selectedActions,
    },
    guards: {
      availableCount: operatingModel.guards.length,
      selectedCount: selectedGuards.length,
      entries: selectedGuards,
    },
    skills: {
      availableCount: selectedSkills.length,
      selectedCount: selectedSkills.length,
      entries: selectedSkills.map((skill) => ({
        packId: skill.packId,
        version: skill.version,
        bindingId: skill.bindingId,
        reason: skill.reason,
        selectedModuleIds: skill.selectedModuleIds,
        estimatedContextTokens: skill.estimatedContextTokens,
      })),
    },
    diagnostics: [...new Set(operatingModel.diagnostics)],
  };
};

export const inferSkoposTaskRisk = ({
  policy,
  questions,
}: {
  policy?: SkoposResolvedPolicyArtifact;
  questions: SkoposTaskQuestionArtifact;
}): SkoposTaskRisk => {
  const highImpactCategories = new Set([
    'architecture',
    'migration',
    'provider',
    'public-api',
    'security',
  ]);
  if (
    questions.entries.some((question) =>
      highImpactCategories.has(question.category),
    )
  ) {
    return 'high-impact';
  }
  return policy?.defaultTaskRisk === 'high-impact'
    ? 'high-impact'
    : policy?.defaultTaskRisk === 'light'
      ? 'light'
      : 'standard';
};

const buildTaskContract = (
  task: SkoposTaskArtifact,
  questions: SkoposTaskQuestionArtifact,
): SkoposTaskContract => {
  const openDecisions = questions.entries
    .filter((question) => question.status === 'open')
    .map((question) => ({
      id: question.id,
      question: question.question,
      blocking: question.blocking,
    }));
  return {
    goal: task.goal,
    scope: task.scope,
    acceptanceCriteria: task.contract.acceptanceCriteria,
    nonGoals: task.contract.nonGoals,
    constraints: task.contract.constraints,
    openDecisions,
    requiredProof: [
      ...task.evidenceRequirements.map((requirement) => ({
        id: requirement.id,
        kind: 'acceptance-evidence' as const,
        summary: requirement.acceptanceCriterion,
      })),
      ...task.selectedActions.map((action) => ({
        id: `action:${action.id}`,
        kind: 'action' as const,
        summary: action.reason,
      })),
    ],
    missingFields: [
      ...(task.contract.acceptanceCriteria.length === 0
        ? ['acceptanceCriteria' as const]
        : []),
      ...(task.contract.nonGoals.length === 0 ? ['nonGoals' as const] : []),
      ...(task.contract.constraints.length === 0 ? ['constraints' as const] : []),
    ],
    provenance: [
      {
        authority: 'declared',
        sourceKind: 'task',
        sourceId: task.id,
      },
    ],
  };
};

const buildTaskContext = (
  artifact: SkoposTaskArtifact,
  task: SkoposTaskContract,
): SkoposContextEntry => ({
  id: `task:${artifact.id}`,
  kind: 'task',
  title: artifact.title,
  summary: task.goal,
  importance: 'required',
  appliesTo: [task.scope.scope.id, ...(task.scope.scope.codeRoots ?? [])],
  provenance: task.provenance,
});

const selectContext = (
  entries: SkoposContextEntry[],
  artifact: SkoposTaskArtifact,
  task: SkoposTaskContract,
  risk: SkoposTaskRisk,
  actionSignals: string[],
): SkoposContextEntry[] => {
  const scope = task.scope.scope;
  const terms = significantTerms(
    [
      task.goal,
      ...task.acceptanceCriteria,
      ...task.nonGoals,
      ...task.constraints,
      ...task.openDecisions.flatMap((decision) => [decision.id, decision.question]),
      scope.id,
      scope.title,
      ...(scope.aliases ?? []),
      ...(scope.codeRoots ?? []),
      ...artifact.changeScope.declaredOwnedPaths,
      ...artifact.selectedActions.map((action) => action.id),
      ...actionSignals,
      risk,
    ].join(' '),
  );
  const scopeIds = new Set(resolveSkoposScopeContextIds(scope));
  return entries
    .filter((entry) => !entry.scopeId || scopeIds.has(entry.scopeId))
    .map((entry) => ({ entry, score: relevanceScore(entry, terms) }))
    .filter(({ entry, score }) => score > 0 || entry.importance === 'required')
    .sort((left, right) => right.score - left.score || left.entry.id.localeCompare(right.entry.id))
    .slice(0, COMPACT_CONTEXT_LIMIT)
    .map(({ entry }) => entry);
};

const selectGuards = ({
  guards,
  phase,
  selectedIds,
}: {
  guards: SkoposGuard[];
  phase: SkoposExecutionPhase;
  selectedIds: Set<string>;
}): SkoposGuard[] =>
  guards
    .filter(
      (guard) =>
        guard.phases.includes(phase) &&
        (guard.requiredness === 'required' || selectedIds.has(guard.id)),
    )
    .sort(
      (left, right) =>
        Number(right.requiredness === 'required') -
          Number(left.requiredness === 'required') ||
        left.id.localeCompare(right.id),
    )
    .slice(0, COMPACT_GUARD_LIMIT);

const relevanceScore = (entry: SkoposContextEntry, taskTerms: Set<string>): number => {
  const entryTerms = significantTerms(
    `${entry.title} ${entry.summary} ${entry.appliesTo.join(' ')}`,
  );
  let score = entry.importance === 'required' ? 1 : 0;
  for (const term of taskTerms) {
    if (entryTerms.has(term)) score += 2;
  }
  return score;
};

const significantTerms = (value: string): Set<string> =>
  new Set(
    value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((term) => term.length >= 2 && !STOP_WORDS.has(term)),
  );

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'into',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'this',
  'to',
  'with',
]);
