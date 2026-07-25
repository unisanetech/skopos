import type {
  SkoposAgentNativeOperatingModel,
  SkoposCompactTaskBrief,
  SkoposContextEntry,
  SkoposExecutionLane,
  SkoposExecutionPhase,
  SkoposGuard,
  SkoposMissionArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposSelectedSkill,
  SkoposTaskContract,
  SkoposTaskProofRequirement,
  SkoposWorkflowQuestionArtifact,
} from '@skopos/model';

import { formatSkoposStructuredCommand } from './structured-command.js';

const COMPACT_CONTEXT_LIMIT = 8;
const COMPACT_GUARD_LIMIT = 8;

export interface BuildSkoposCompactTaskBriefOptions {
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
  operatingModel: SkoposAgentNativeOperatingModel;
  phase: SkoposExecutionPhase;
  riskLane: SkoposExecutionLane;
  selectedSkills?: SkoposSelectedSkill[];
}

export const buildSkoposCompactTaskBrief = ({
  mission,
  questions,
  operatingModel,
  phase,
  riskLane,
  selectedSkills = [],
}: BuildSkoposCompactTaskBriefOptions): SkoposCompactTaskBrief => {
  const task = buildTaskContract({ mission, questions });
  const taskContext = buildTaskContext(task, mission);
  const policyContext = selectPolicyContext({
    entries: operatingModel.context,
    task,
  });
  const skillActionIds = new Set(selectedSkills.flatMap((skill) => skill.selectedActionIds));
  const skillGuardIds = new Set(selectedSkills.flatMap((skill) => skill.selectedGuardIds));
  const skillContext = selectedSkills.flatMap((skill) => skill.selectedContext);
  const selectedActions = operatingModel.actions.filter(
    (action) =>
      (mission.recommendedWorkflowIds.includes(action.id) || skillActionIds.has(action.id)) &&
      action.phases.includes(phase),
  );
  const selectedGuards = selectGuards({
    guards: operatingModel.guards,
    task,
    phase,
    selectedIds: skillGuardIds,
  });
  const diagnostics = [...operatingModel.diagnostics];

  if (task.missingFields.includes('acceptanceCriteria')) {
    diagnostics.push(
      'The current mission has no explicit acceptance criteria, non-goals, or constraints; record them before closure when they matter.',
    );
  }

  return {
    schemaVersion: 1,
    task,
    phase,
    riskLane,
    context: {
      availableCount: operatingModel.context.length + 1,
      selectedCount: policyContext.length + skillContext.length + 1,
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
    diagnostics: dedupeStrings(diagnostics),
  };
};

export const inferSkoposTaskRiskLane = ({
  policy,
  questions,
}: {
  policy?: SkoposResolvedPolicyArtifact;
  questions: SkoposWorkflowQuestionArtifact;
}): SkoposExecutionLane => {
  const workpackCategories = new Set([
    'architecture',
    'migration',
    'provider',
    'public-api',
    'security',
  ]);
  if (questions.entries.some((question) => workpackCategories.has(question.category))) {
    return 'workpack';
  }

  return policy?.defaultExecutionLane ?? 'normal';
};

const buildTaskContract = ({
  mission,
  questions,
}: {
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
}): SkoposTaskContract => {
  const openDecisions = questions.entries
    .filter((question) => question.status === 'open')
    .map((question) => ({
      id: question.id,
      question: question.question,
      blocking: question.blocking,
    }));

  return {
    goal: mission.objective,
    scope: mission.scope,
    acceptanceCriteria: [],
    nonGoals: [],
    constraints: [],
    openDecisions,
    requiredProof: buildTaskProofRequirements(mission),
    missingFields: ['acceptanceCriteria', 'nonGoals', 'constraints'],
    provenance: [
      {
        authority: 'declared',
        sourceKind: 'mission',
        sourceId: mission.id,
        path: `.skopos/missions/${mission.id}.json`,
      },
    ],
  };
};

const buildTaskProofRequirements = (
  mission: SkoposMissionArtifact,
): SkoposTaskProofRequirement[] => [
  ...mission.recommendedChecks.map((command) => ({
    id: `command:${command}`,
    kind: 'command' as const,
    summary: command,
  })),
  ...mission.recommendedWorkflowIds.map((workflowId) => ({
    id: `action:${workflowId}`,
    kind: 'action' as const,
    summary: `Run project action ${workflowId} when its declared trigger applies.`,
  })),
];

const buildTaskContext = (
  task: SkoposTaskContract,
  mission: SkoposMissionArtifact,
): SkoposContextEntry => ({
  id: `task:${mission.id}`,
  kind: 'task',
  title: mission.title,
  summary: task.goal,
  importance: 'required',
  appliesTo: [task.scope.scope.id, task.scope.scope.path],
  provenance: task.provenance,
});

const selectPolicyContext = ({
  entries,
  task,
}: {
  entries: SkoposContextEntry[];
  task: SkoposTaskContract;
}): SkoposContextEntry[] => {
  const taskTerms = significantTerms(
    `${task.goal} ${task.scope.scope.id} ${task.scope.scope.title} ${task.scope.scope.path}`,
  );

  return entries
    .map((entry) => ({
      entry,
      score: relevanceScore(entry, taskTerms),
    }))
    .filter(({ entry, score }) => score > 0 || entry.importance === 'required')
    .sort((left, right) => right.score - left.score || left.entry.id.localeCompare(right.entry.id))
    .slice(0, COMPACT_CONTEXT_LIMIT)
    .map(({ entry }) => entry);
};

const selectGuards = ({
  guards,
  task,
  phase,
  selectedIds,
}: {
  guards: SkoposGuard[];
  task: SkoposTaskContract;
  phase: SkoposExecutionPhase;
  selectedIds?: Set<string>;
}): SkoposGuard[] => {
  const requiredCommands = new Set(
    task.requiredProof
      .filter((proof) => proof.kind === 'command')
      .map((proof) => proof.summary),
  );

  return guards
    .filter(
      (guard) =>
        guard.phases.includes(phase) &&
        (guard.requiredness === 'required' ||
          selectedIds?.has(guard.id) ||
          (guard.command && requiredCommands.has(formatSkoposStructuredCommand(guard.command)))),
    )
    .sort((left, right) => {
      const requiredness =
        Number(right.requiredness === 'required') - Number(left.requiredness === 'required');
      return requiredness || left.id.localeCompare(right.id);
    })
    .slice(0, COMPACT_GUARD_LIMIT);
};

const relevanceScore = (entry: SkoposContextEntry, taskTerms: Set<string>): number => {
  const entryTerms = significantTerms(
    `${entry.title} ${entry.summary} ${entry.appliesTo.join(' ')}`,
  );
  let score = entry.importance === 'required' ? 1 : 0;

  for (const term of taskTerms) {
    if (entryTerms.has(term)) {
      score += 2;
    }
  }

  return score;
};

const significantTerms = (value: string): Set<string> =>
  new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((term) => term.length >= 4),
  );

const dedupeStrings = (values: string[]): string[] => [...new Set(values)];
