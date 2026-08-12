import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, posix, relative, resolve } from 'node:path';

import { buildSkoposDocumentCatalog } from '@skopos/indexer';
import {
  resolveSkoposScopeExpansion,
  type SkoposScopeExpansionKind,
} from '@skopos/query';
import type {
  SkoposDocumentKnowledgeEntry,
  SkoposPlanResult,
  SkoposImpactReport,
  SkoposProofSubjectKind,
  SkoposResolvedScope,
  SkoposTaskArtifact,
  SkoposTaskContractDeclaration,
  SkoposTaskDetail,
  SkoposTaskDispositionKind,
  SkoposTaskMemoryObligation,
  SkoposTaskRisk,
  SkoposTaskAdmissionAssessment,
  SkoposTaskRunResult,
  SkoposTaskWorkflowAssessment,
  SkoposTaskState,
  SkoposTaskQuestionDispositionKind,
  SkoposTaskQuestionArtifact,
  SkoposTaskRecommendationArtifact,
  SkoposChildTaskReference,
  SkoposTaskStep,
} from '@skopos/model';
import {
  buildSkoposImpactReport,
  buildSkoposTaskIdentity,
  captureSkoposTaskChangeScope,
  captureSkoposTaskPathStates,
  resolveSkoposTaskChangedPaths,
  resolveSkoposWorkspaceIdentity,
} from '@skopos/verification';

import { withSkoposTaskMutationTransaction } from '../coordination/coordination.service.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import {
  resolveSkoposTaskArtifactPath,
  resolveSkoposTaskQuestionsPath,
  resolveSkoposTaskRecommendationsPath,
} from './task-paths.js';

export interface CreateSkoposTaskRuntimeOptions {
  cwd: string;
  plan: SkoposPlanResult;
  actor?: string;
  planIds?: string[];
  acceptanceCriteria?: string[];
  nonGoals?: string[];
  constraints?: string[];
  ownedPaths?: string[];
  risk?: SkoposTaskRisk;
  detail?: SkoposTaskDetail;
  priority?: number;
  dependencyTaskIds?: string[];
  taskId?: string;
  parentTaskId?: string;
  proofSubjectKind?: SkoposProofSubjectKind;
  dryRun?: boolean;
}

export const prepareSkoposTaskRuntime = async ({
  cwd,
  plan,
  actor,
  planIds = [],
  acceptanceCriteria = [],
  nonGoals = [],
  constraints = [],
  ownedPaths = [],
  risk,
  detail,
  priority = 0,
  dependencyTaskIds = [],
  taskId: requestedTaskId,
  parentTaskId,
  proofSubjectKind = 'task-closure',
  dryRun = false,
}: CreateSkoposTaskRuntimeOptions): Promise<SkoposTaskRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const now = new Date().toISOString();
  const taskId = requestedTaskId ?? `T-${randomUUID().replaceAll('-', '').slice(0, 8)}`;
  if (!/^T-[a-z0-9]+$/iu.test(taskId)) {
    throw new Error(`Invalid Task id: ${taskId}.`);
  }
  if (parentTaskId === taskId) {
    throw new Error('A Task cannot be its own parent.');
  }
  const taskIdentity = buildSkoposTaskIdentity({
    workspace: await resolveSkoposWorkspaceIdentity(workspaceRoot),
    taskId,
    actorId,
  });
  const contract = normalizeTaskContract({
    acceptanceCriteria,
    nonGoals,
    constraints,
  });
  const admissionImpact =
    ownedPaths.length > 0
      ? await buildSkoposImpactReport({
          cwd: workspaceRoot,
          changedPaths: ownedPaths,
          phase: 'closure',
        })
      : undefined;
  const admission = assessSkoposTaskAdmission({
    plan,
    impact: admissionImpact,
    ownedPaths,
    explicitRisk: risk,
    explicitDetail: detail,
    proofSubjectKind,
  });
  const resolvedRisk = admission.selectedRisk;
  if (proofSubjectKind === 'project-integration' && ownedPaths.length === 0) {
    throw new Error('Project-integration proof requires at least one explicitly owned path.');
  }
  const declaredImpact =
    ownedPaths.length > 0
      ? await buildSkoposImpactReport({
          cwd: workspaceRoot,
          changedPaths: ownedPaths,
          phase: 'closure',
          risk: resolvedRisk,
        })
      : undefined;
  const selectedActions = declaredImpact?.requiredActions ?? [];
  const selectedGuards = declaredImpact?.matchedGuards ?? [];
  const questions = buildTaskQuestions({
    workspaceRoot,
    taskIdentity,
    taskId,
    now,
    plan,
  });
  const recommendations = buildTaskRecommendations({
    workspaceRoot,
    taskIdentity,
    taskId,
    now,
    plan,
    questions,
    selectedActions,
  });
  const hasBlockingQuestions = questions.entries.some(
    (question) => question.blocking && question.status === 'open',
  );
  const resolvedDetail = admission.selectedDetail;
  const memoryObligations = await inferSkoposTaskMemoryObligationsRuntime({
    cwd: workspaceRoot,
    scope: plan.scope,
    risk: resolvedRisk,
    ownedPaths,
    goal: plan.goal,
    contract,
  });
  const taskState = hasBlockingQuestions ? 'blocked' : 'active';
  const trackedDocumentPath = resolveTrackedTaskDocumentPath({
    risk: resolvedRisk,
    state: taskState,
    scopeMemoryRoot: plan.scope.scope.memoryRoot,
    scopeKind: plan.scope.scope.kind,
    scopeMatchedBy: plan.scope.matchedBy,
    taskId,
    title: plan.title,
  });
  const changeScope = await captureSkoposTaskChangeScope({
    workspaceRoot,
    declaredOwnedPaths: ownedPaths,
    capturedAt: now,
  });
  const task: SkoposTaskArtifact = {
    schemaVersion: 1,
    id: taskId,
    type: 'task',
    status: 'active',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    workspaceRoot,
    taskIdentity,
    trackedDocumentPath,
    planIds,
    ...(parentTaskId ? { parentTaskId } : {}),
    childTasks: [],
    state: taskState,
    detail: resolvedDetail,
    title: plan.title,
    goal: plan.goal,
    scope: plan.scope,
    contract,
    risk: resolvedRisk,
    admission,
    proofSubject: {
      kind: proofSubjectKind,
      baselineId: buildProofSubjectBaselineId(changeScope),
    },
    priority: normalizeTaskPriority(priority),
    dependencyTaskIds: [...new Set(dependencyTaskIds.map((id) => id.trim()).filter(Boolean))],
    changeScope,
    steps: buildTaskSteps(plan, selectedActions),
    selectedActions,
    selectedGuardIds: selectedGuards.map((guard) => guard.id),
    evidenceRequirements: [
      ...contract.acceptanceCriteria.map((acceptanceCriterion, index) => ({
        id: `acceptance-${index + 1}`,
        acceptanceCriterion,
        phase: 'closure' as const,
        actionIds: [],
        guardIds: [],
        evidence: 'agent-observation' as const,
      })),
      ...selectedGuards
        .filter((guard) => guard.strength === 'required')
        .map((guard) => ({
          id: `guard-${guard.id}`,
          acceptanceCriterion: `Guard ${guard.id}: ${guard.title}`,
          phase: 'closure' as const,
          actionIds: guard.requiredActionIds,
          guardIds: [guard.id],
          evidence: guard.evidence,
        })),
    ],
    memoryObligations,
    questions: questions.entries,
    recommendations: recommendations.entries,
    coordination: actorId
      ? {
          claimedBy: {
            actorId,
            claimedAt: now,
          },
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        }
      : {},
  };
  const taskPath = resolveSkoposTaskArtifactPath(workspaceRoot, taskIdentity);
  const questionsPath = resolveSkoposTaskQuestionsPath(workspaceRoot, taskIdentity);
  const recommendationsPath = resolveSkoposTaskRecommendationsPath(
    workspaceRoot,
    taskIdentity,
  );

  return {
    workspaceRoot,
    actorId,
    summary: `Created active Task ${task.id} for ${task.scope.scope.id}.`,
    taskPath,
    taskWrite: dryRun ? 'dry-run' : 'written',
    task,
    questionsPath,
    questionsWrite: dryRun ? 'dry-run' : 'written',
    questions,
    recommendationsPath,
    recommendationsWrite: dryRun ? 'dry-run' : 'written',
    recommendations,
  };
};

const buildProofSubjectBaselineId = (
  changeScope: SkoposTaskArtifact['changeScope'],
): string => `baseline-${createHash('sha256')
  .update(JSON.stringify({
    trackingMode: changeScope.trackingMode ?? 'unavailable',
    baselineRevision: changeScope.baselineRevision ?? null,
    baselineDirtyPaths: changeScope.baselineDirtyPaths,
    declaredOwnedPaths: changeScope.declaredOwnedPaths,
    capturedAt: changeScope.capturedAt,
  }))
  .digest('hex')
  .slice(0, 16)}`;

const normalizeTaskPriority = (priority: number): number => {
  if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
    throw new Error('Task priority must be an integer from 0 to 100.');
  }
  return priority;
};

export const writeSkoposTaskAuxiliaryArtifactsRuntime = async ({
  prepared,
  dryRun = false,
}: {
  prepared: SkoposTaskRunResult;
  dryRun?: boolean;
}): Promise<void> => {
  if (prepared.task.trackedDocumentPath) {
    await writeSkoposTrackedTaskDocumentRuntime({
      workspaceRoot: prepared.workspaceRoot,
      task: prepared.task,
      dryRun,
    });
  }
  await writeJsonArtifact({
    artifactPath: prepared.questionsPath,
    artifact: prepared.questions,
    dryRun,
  });
  await writeJsonArtifact({
    artifactPath: prepared.recommendationsPath,
    artifact: prepared.recommendations,
    dryRun,
  });
};

export const publishSkoposTaskAuthorityRuntime = async ({
  prepared,
  dryRun = false,
}: {
  prepared: SkoposTaskRunResult;
  dryRun?: boolean;
}): Promise<void> => {
  await writeJsonArtifact({
    artifactPath: prepared.taskPath,
    artifact: prepared.task,
    dryRun,
  });
};

export const createSkoposTaskRuntime = async (
  options: CreateSkoposTaskRuntimeOptions,
): Promise<SkoposTaskRunResult> => {
  const prepared = await prepareSkoposTaskRuntime(options);
  await writeSkoposTaskAuxiliaryArtifactsRuntime({
    prepared,
    dryRun: options.dryRun,
  });
  await publishSkoposTaskAuthorityRuntime({
    prepared,
    dryRun: options.dryRun,
  });
  return prepared;
};

export const loadSkoposTaskRuntime = async ({
  cwd,
  taskPath,
}: {
  cwd: string;
  taskPath: string;
}): Promise<SkoposTaskArtifact> =>
  JSON.parse(await readFile(resolve(cwd, taskPath), 'utf8')) as SkoposTaskArtifact;

export const reconstructTrackedSkoposTasksRuntime = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposTaskArtifact[]> => {
  const workspaceRoot = resolve(cwd);
  const catalog = await buildSkoposDocumentCatalog({ cwd: workspaceRoot });
  const documentPaths = catalog.documents
    .filter(
      (document) =>
        document.role === 'task' &&
        (document.lifecycle === 'active' || document.lifecycle === 'historical') &&
        /(?:^|\/)work\/(?:tasks|archive\/tasks)\/T-[a-z0-9]+.*\.md$/iu.test(document.path),
    )
    .map((document) => resolve(workspaceRoot, document.path))
    .sort((left, right) => left.localeCompare(right));
  const workspace = await resolveSkoposWorkspaceIdentity(workspaceRoot);
  const reconstructed: SkoposTaskArtifact[] = [];
  const portableDocuments = (
    await Promise.all(
      documentPaths.map(async (documentPath) => ({
        documentPath,
        portable: parsePortableTaskState(await readFile(documentPath, 'utf8')),
      })),
    )
  ).filter(
    (
      entry,
    ): entry is { documentPath: string; portable: PortableTaskState } =>
      entry.portable !== undefined,
  );
  const portableOwners = new Map<string, string>();

  for (const { documentPath, portable } of portableDocuments) {
    const existingOwner = portableOwners.get(portable.id);
    if (existingOwner) {
      throw new Error(
        `Tracked Task ${portable.id} is declared by both ${relative(workspaceRoot, existingOwner)} and ${relative(workspaceRoot, documentPath)}.`,
      );
    }
    portableOwners.set(portable.id, documentPath);
  }

  for (const { documentPath, portable } of portableDocuments) {
    const taskIdentity = buildSkoposTaskIdentity({
      workspace,
      taskId: portable.id,
    });
    const taskPath = resolveSkoposTaskArtifactPath(workspaceRoot, taskIdentity);
    try {
      await readFile(taskPath, 'utf8');
      continue;
    } catch (error) {
      if (!isMissingFileError(error)) throw error;
    }
    const { declaredOwnedPaths, ...portableTask } = portable;
    const task: SkoposTaskArtifact = {
      ...portableTask,
      workspaceRoot,
      taskIdentity,
      trackedDocumentPath: normalizeProjectPath(relative(workspaceRoot, documentPath)),
      authority: 'generated',
      changeScope: await captureSkoposTaskChangeScope({
        workspaceRoot,
        declaredOwnedPaths,
        capturedAt: new Date().toISOString(),
      }),
      coordination: {},
    };
    await Promise.all([
      writeJsonArtifact({ artifactPath: taskPath, artifact: task }),
      writeJsonArtifact({
        artifactPath: resolveSkoposTaskQuestionsPath(workspaceRoot, taskIdentity),
        artifact: buildTaskQuestionProjection(task),
      }),
      writeJsonArtifact({
        artifactPath: resolveSkoposTaskRecommendationsPath(workspaceRoot, taskIdentity),
        artifact: buildTaskRecommendationProjection(task),
      }),
    ]);
    reconstructed.push(task);
  }
  return reconstructed;
};

export const showSkoposTaskRuntime = async ({
  cwd,
  taskId,
}: {
  cwd: string;
  taskId: string;
}): Promise<SkoposTaskArtifact> => {
  const workspaceRoot = resolve(cwd);
  await reconstructTrackedSkoposTasksRuntime({ cwd: workspaceRoot });
  const taskIdentity = buildSkoposTaskIdentity({
    workspace: await resolveSkoposWorkspaceIdentity(workspaceRoot),
    taskId,
  });
  return loadSkoposTaskRuntime({
    cwd: workspaceRoot,
    taskPath: resolveSkoposTaskArtifactPath(workspaceRoot, taskIdentity),
  });
};

export const assessSkoposTaskWorkflowRuntime = async ({
  cwd,
  taskId,
}: {
  cwd: string;
  taskId: string;
}): Promise<SkoposTaskWorkflowAssessment> => {
  const workspaceRoot = resolve(cwd);
  const task = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  const changes = await resolveSkoposTaskChangedPaths({
    workspaceRoot,
    changeScope: task.changeScope,
    currentTaskId: task.id,
    linkedChildTaskIds: task.childTasks.map((child) => child.taskId),
    generatedOutputPaths: task.selectedActions.flatMap((action) => action.outputPaths),
  });
  const projectionPaths = new Set(
    resolveSkoposTrackedTaskProjectionPaths(task.trackedDocumentPath),
  );
  const unownedPaths = changes.externalUnattributedPaths
    .filter((path) =>
      !isSkoposTrackedTaskProjectionPath(path, [...projectionPaths]),
    )
    .sort((left, right) => left.localeCompare(right));
  const actorId = task.coordination.claimedBy?.actorId ?? '<id>';
  const ownershipCommand = unownedPaths.length > 0
    ? [
        'skopos task ownership add',
        task.id,
        ...unownedPaths.flatMap((path) => ['--own', shellQuote(path)]),
        '--reason',
        shellQuote('Adopt reviewed changed paths discovered during active work.'),
        '--actor',
        shellQuote(actorId),
      ].join(' ')
    : undefined;
  const openQuestions = task.questions.filter((question) => question.status === 'open');
  const blockingOpenQuestions = openQuestions.filter((question) => question.blocking);
  const pendingAction = task.selectedActions.find((action) =>
    task.steps.some(
      (step) => step.id === `action-${action.id}` && step.status !== 'complete',
    ),
  );
  const pendingStep = task.steps.find(
    (step) => step.status !== 'complete' && step.status !== 'skipped',
  );
  const terminal = ['complete', 'cancelled', 'superseded'].includes(task.state);
  const workflow = task.admission?.workflow ??
    (task.risk === 'light' ? 'fast-path' : task.risk === 'high-impact' ? 'strict' : 'tracked');

  if (terminal && openQuestions.length === 0) {
    return {
      taskId: task.id,
      workflow,
      readiness: 'ready-for-closure',
      nextCommand: `skopos task show ${shellQuote(task.id)} . --json`,
      nextReason: `Task ${task.id} is ${task.state}; inspect its durable result instead of mutating it.`,
      evidence: workflowEvidence(task),
    };
  }

  if (terminal && openQuestions.length > 0) {
    const question = openQuestions[0]!;
    return {
      taskId: task.id,
      workflow,
      readiness: 'blocked',
      nextCommand: `skopos decide ${shellQuote(question.id)} <option-id> . --actor ${shellQuote(actorId)}`,
      nextReason: `Task ${task.id} is ${task.state}, but terminal state cannot retain an open decision. ${question.whyItMatters}`,
      evidence: workflowEvidence(task),
    };
  }

  if (ownershipCommand) {
    return {
      taskId: task.id,
      workflow,
      readiness: 'blocked',
      nextCommand: ownershipCommand,
      nextReason: `${unownedPaths.length} changed path${unownedPaths.length === 1 ? ' is' : 's are'} outside declared Task ownership and must be reviewed before proof.`,
      ownershipSuggestion: {
        paths: unownedPaths,
        reason: 'Changed after Task admission without current Task ownership or attribution.',
        command: ownershipCommand,
        confirmationRequired: task.risk === 'high-impact',
      },
      evidence: workflowEvidence(task),
    };
  }

  if (blockingOpenQuestions.length > 0) {
    const question = blockingOpenQuestions[0]!;
    return {
      taskId: task.id,
      workflow,
      readiness: 'blocked',
      nextCommand: `skopos decide ${shellQuote(question.id)} <option-id> . --actor ${shellQuote(actorId)}`,
      nextReason: question.whyItMatters,
      evidence: workflowEvidence(task),
    };
  }

  const incompleteChild = task.childTasks.find((child) => child.state !== 'complete');
  if (incompleteChild) {
    const cancelled = ['cancelled', 'superseded'].includes(incompleteChild.state);
    return {
      taskId: task.id,
      workflow,
      readiness: 'blocked',
      nextCommand: cancelled
        ? `skopos task show ${shellQuote(incompleteChild.taskId)} . --json`
        : incompleteChild.claimedByActorId
          ? `skopos task show ${shellQuote(incompleteChild.taskId)} . --json`
          : `skopos task assign ${shellQuote(incompleteChild.taskId)} . --actor <actor-id> --session-id <session-id> --host <host> --json`,
      nextReason: cancelled
        ? `Linked child Task ${incompleteChild.taskId} ended ${incompleteChild.state}; repair or replace that child before parent closure.`
        : `Linked child Task ${incompleteChild.taskId} is ${incompleteChild.state}; every blocking child must complete before parent closure.`,
      evidence: workflowEvidence(task),
    };
  }

  if (pendingAction) {
    return {
      taskId: task.id,
      workflow,
      readiness: 'work-in-progress',
      nextCommand: `skopos actions run ${shellQuote(pendingAction.id)} . --task ${shellQuote(task.id)} --actor ${shellQuote(actorId)} --json`,
      nextReason: pendingAction.reason,
      evidence: workflowEvidence(task),
    };
  }

  if (pendingStep) {
    return {
      taskId: task.id,
      workflow,
      readiness: 'work-in-progress',
      nextCommand: `skopos task step complete ${shellQuote(task.id)} ${shellQuote(pendingStep.id)} . --actor ${shellQuote(actorId)}`,
      nextReason: `Complete “${pendingStep.title}” before closure.`,
      evidence: workflowEvidence(task),
    };
  }

  if (openQuestions.length > 0) {
    const question = openQuestions[0]!;
    return {
      taskId: task.id,
      workflow,
      readiness: 'blocked',
      nextCommand: `skopos decide ${shellQuote(question.id)} <option-id> . --actor ${shellQuote(actorId)}`,
      nextReason: `Implementation may proceed without this answer, but Task closure requires an explicit disposition. ${question.whyItMatters}`,
      evidence: workflowEvidence(task),
    };
  }

  return {
    taskId: task.id,
    workflow,
    readiness: 'ready-for-closure',
    nextCommand:
      workflow === 'fast-path'
        ? `skopos finish ${shellQuote(task.id)} . --actor ${shellQuote(actorId)} --json`
        : `skopos verify ${shellQuote(task.id)} . --phase closure --json`,
    nextReason:
      workflow === 'fast-path'
        ? 'The light fast path can perform closure verification inside finish.'
        : 'Run closure verification before finishing tracked or strict work.',
    evidence: workflowEvidence(task),
  };
};

const workflowEvidence = (
  task: SkoposTaskArtifact,
): SkoposTaskWorkflowAssessment['evidence'] => ({
  requiredActionIds: task.selectedActions.map((action) => action.id),
  acceptanceRequirementIds: task.evidenceRequirements.map((requirement) => requirement.id),
});

const shellQuote = (value: string): string =>
  `'${value.replaceAll("'", "'\\''")}'`;

export const claimSkoposTaskRuntime = async ({
  cwd,
  taskId,
  actor,
}: {
  cwd: string;
  taskId: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> =>
  mutateTask({
    cwd,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      const currentActor = task.coordination.claimedBy?.actorId;
      if (currentActor && currentActor !== actorId) {
        throw new Error(`Task ${task.id} is claimed by ${currentActor}.`);
      }
      if (task.state === 'complete' || task.state === 'cancelled' || task.state === 'superseded') {
        throw new Error(`Task ${task.id} is ${task.state} and cannot be claimed.`);
      }
      if (task.state === 'deferred') {
        throw new Error(`Task ${task.id} is deferred; resume its disposition before claiming it.`);
      }
      return {
        ...task,
        state: task.state === 'ready' ? 'active' : task.state,
        coordination: {
          claimedBy: { actorId, claimedAt: now },
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });

export const releaseSkoposTaskRuntime = async ({
  cwd,
  taskId,
  actor,
}: {
  cwd: string;
  taskId: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> =>
  mutateTask({
    cwd,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      assertTaskActor(task, actorId);
      return {
        ...task,
        coordination: {
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });

export const linkSkoposChildTasksRuntime = async ({
  cwd,
  parentTaskId,
  children,
  expectedParentUpdatedAt,
  actor,
}: {
  cwd: string;
  parentTaskId: string;
  children: SkoposChildTaskReference[];
  expectedParentUpdatedAt: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> => {
  if (children.length === 0) {
    throw new Error('A Task split must link at least one child Task.');
  }
  const childIds = children.map((child) => child.taskId);
  if (new Set(childIds).size !== childIds.length) {
    throw new Error('A Task split cannot link the same child Task more than once.');
  }
  return mutateTask({
    cwd,
    taskId: parentTaskId,
    actor,
    mutate: (task, actorId, now) => {
      assertTaskActor(task, actorId);
      if (!['active', 'ready', 'blocked'].includes(task.state)) {
        throw new Error(
          `Parent Task ${task.id} is ${task.state}; split active, ready, or blocked work instead.`,
        );
      }
      if ((task.updatedAt ?? task.generatedAt ?? '') !== expectedParentUpdatedAt) {
        throw new Error(
          `Parent Task ${task.id} changed after the split proposal was generated; propose the split again.`,
        );
      }
      const existingIds = new Set(task.childTasks.map((child) => child.taskId));
      const duplicate = children.find((child) => existingIds.has(child.taskId));
      if (duplicate) {
        throw new Error(`Parent Task ${task.id} already links child ${duplicate.taskId}.`);
      }
      return {
        ...task,
        childTasks: [...task.childTasks, ...children],
        state: 'blocked',
        recommendations: task.recommendations.map((recommendation) =>
          recommendation.actionKind === 'start-child-task' && recommendation.status === 'open'
            ? { ...recommendation, status: 'complete' as const }
            : recommendation,
        ),
        coordination: {
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });
};

export const expandSkoposTaskOwnershipRuntime = async ({
  cwd,
  taskId,
  ownedPaths,
  reason,
  actor,
}: {
  cwd: string;
  taskId: string;
  ownedPaths: string[];
  reason: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Task ownership expansion requires --actor <id> or SKOPOS_ACTOR.');
  }
  const normalizedReason = reason.trim();
  if (!normalizedReason) {
    throw new Error('Task ownership expansion requires a non-empty reason.');
  }
  const requestedPaths = [...new Set(ownedPaths.map(normalizeProjectPath).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
  if (requestedPaths.length === 0) {
    throw new Error('Task ownership expansion requires at least one --own <path>.');
  }
  for (const path of requestedPaths) {
    if (!isWorkspaceRelativePath(path)) {
      throw new Error(`Task-owned path must stay inside the workspace: ${path}.`);
    }
  }

  const existing = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  assertTaskActor(existing, actorId);
  if (!['active', 'blocked'].includes(existing.state)) {
    throw new Error(
      `Task ${taskId} must be active or blocked before ownership can expand; current state is ${existing.state}.`,
    );
  }
  const addedPaths = requestedPaths.filter(
    (path) =>
      !existing.changeScope.declaredOwnedPaths.some(
        (declaredPath) => path === declaredPath || isPathInside(path, declaredPath),
      ),
  );
  if (addedPaths.length === 0) {
    throw new Error(`Task ${taskId} already owns every requested path.`);
  }
  const declaredOwnedPaths = [
    ...new Set([...existing.changeScope.declaredOwnedPaths, ...addedPaths]),
  ].sort((left, right) => left.localeCompare(right));
  const scopeExpansion = await resolveSkoposScopeExpansion({
    cwd: workspaceRoot,
    currentScope: existing.scope,
    paths: declaredOwnedPaths,
  });
  if (scopeExpansion.kind === 'unrelated' || !scopeExpansion.authority) {
    const splitCommands = Object.entries(scopeExpansion.pathsByScope).map(
      ([scopeId, paths]) =>
        [
          'skopos start',
          shellQuote(existing.goal),
          '.',
          '--scope',
          shellQuote(scopeId),
          ...paths.flatMap((path) => ['--own', shellQuote(path)]),
          '--actor',
          shellQuote(actorId),
        ].join(' '),
    );
    throw new Error(
      `Task ${taskId} ownership expansion spans unrelated declared Scopes: ${scopeExpansion.affectedScopeIds.join(', ')}. ` +
      `Start independent child Tasks (${splitCommands.join(' ; ')}) or start an explicitly scoped workspace/project-integration Task.`,
    );
  }
  const nextScope = scopeExpansion.authority;
  const expansionClassification = scopeExpansion.kind as Exclude<
    SkoposScopeExpansionKind,
    'unrelated'
  >;
  const [impact, baselinePaths, inferredMemoryObligations] = await Promise.all([
    buildSkoposImpactReport({
      cwd: workspaceRoot,
      changedPaths: declaredOwnedPaths,
      phase: 'closure',
      risk: existing.risk,
    }),
    captureSkoposTaskPathStates({
      workspaceRoot,
      paths: addedPaths,
      ignoredTaskId: taskId,
    }),
    inferSkoposTaskMemoryObligationsRuntime({
      cwd: workspaceRoot,
      scope: nextScope,
      risk: existing.risk,
      ownedPaths: declaredOwnedPaths,
      goal: existing.goal,
      contract: existing.contract,
    }),
  ]);

  return mutateTask({
    cwd: workspaceRoot,
    taskId,
    actor: actorId,
    mutate: (task, resolvedActorId, now) => {
      assertTaskActor(task, resolvedActorId);
      if (task.updatedAt !== existing.updatedAt) {
        throw new Error(`Task ${taskId} changed while ownership expansion was prepared; retry.`);
      }
      if (!['active', 'blocked'].includes(task.state)) {
        throw new Error(
          `Task ${taskId} must be active or blocked before ownership can expand; current state is ${task.state}.`,
        );
      }
      const changeScope = {
        ...task.changeScope,
        declaredOwnedPaths,
      };
      const existingMemoryObligations = new Map(
        task.memoryObligations.map((entry) => [entry.id, entry]),
      );
      const memoryObligations = [
        ...inferredMemoryObligations.map(
          (entry) => existingMemoryObligations.get(entry.id) ?? entry,
        ),
        ...task.memoryObligations.filter(
          (entry) =>
            entry.status === 'complete' &&
            !inferredMemoryObligations.some((candidate) => candidate.id === entry.id),
        ),
      ].sort((left, right) => left.id.localeCompare(right.id));
      const selectedActions = impact.requiredActions;
      const selectedGuards = impact.matchedGuards;
      const splitRecommendation = buildTaskSplitRecommendation({
        task,
        addedPaths,
        impact,
        affectedScopeIds: scopeExpansion.affectedScopeIds,
        nextScopeId: nextScope.scope.id,
        actorId: resolvedActorId,
      });
      return {
        ...task,
        scope: nextScope,
        proofSubject: {
          ...task.proofSubject,
          baselineId: buildProofSubjectBaselineId(changeScope),
        },
        changeScope,
        ownershipExpansions: [
          ...(task.ownershipExpansions ?? []),
          {
            paths: addedPaths,
            reason: normalizedReason,
            actorId: resolvedActorId,
            recordedAt: now,
            baselinePaths,
            classification: expansionClassification,
            priorScopeId: task.scope.scope.id,
            nextScopeId: nextScope.scope.id,
            affectedScopeIds: scopeExpansion.affectedScopeIds,
          },
        ],
        selectedActions,
        selectedGuardIds: selectedGuards.map((guard) => guard.id),
        evidenceRequirements: [
          ...task.evidenceRequirements.filter((entry) => !entry.id.startsWith('guard-')),
          ...selectedGuards
            .filter((guard) => guard.strength === 'required')
            .map((guard) => ({
              id: `guard-${guard.id}`,
              acceptanceCriterion: `Guard ${guard.id}: ${guard.title}`,
              phase: 'closure' as const,
              actionIds: guard.requiredActionIds,
              guardIds: [guard.id],
              evidence: guard.evidence,
            })),
        ],
        steps: [
          ...task.steps.filter((step) => !step.id.startsWith('action-')),
          ...selectedActions.map((action) => ({
            id: `action-${action.id}`,
            kind: 'action' as const,
            title: action.title,
            detail: action.reason,
            status: 'pending' as const,
          })),
        ],
        recommendations: [
          ...task.recommendations.filter(
            (entry) =>
              entry.actionKind !== 'run-action' &&
              entry.id !== TASK_SPLIT_RECOMMENDATION_ID,
          ),
          ...(splitRecommendation ? [splitRecommendation] : []),
          ...selectedActions.map((action) => ({
            id: `run-${action.id}`,
            title: action.title,
            summary: action.reason,
            priority: 'medium' as const,
            actionKind: 'run-action' as const,
            actionId: action.id,
            blocking: false,
            status: 'open' as const,
          })),
        ],
        memoryObligations,
        coordination: {
          ...task.coordination,
          lastUpdatedBy: resolvedActorId,
          lastUpdatedAt: now,
        },
      };
    },
    afterPersist: async (updated) => {
      await writeJsonArtifact({
        artifactPath: resolveSkoposTaskRecommendationsPath(
          workspaceRoot,
          updated.taskIdentity,
        ),
        artifact: buildTaskRecommendationProjection(updated),
      });
    },
  });
};

const TASK_SPLIT_RECOMMENDATION_ID = 'start-bounded-child-task';
const REPEATED_EXPANSION_SPLIT_THRESHOLD = 3;

const buildTaskSplitRecommendation = ({
  task,
  addedPaths,
  impact,
  affectedScopeIds,
  nextScopeId,
  actorId,
}: {
  task: SkoposTaskArtifact;
  addedPaths: string[];
  impact: SkoposImpactReport;
  affectedScopeIds: string[];
  nextScopeId: string;
  actorId: string;
}): SkoposTaskArtifact['recommendations'][number] | undefined => {
  const existing = task.recommendations.find(
    (entry) => entry.id === TASK_SPLIT_RECOMMENDATION_ID,
  );
  if (existing && existing.status !== 'open') return existing;

  const expansionCount = (task.ownershipExpansions?.length ?? 0) + 1;
  const admissionScopeIds = new Set(task.admission?.signals.affectedScopeIds ?? []);
  const introducedScopeIds = affectedScopeIds.filter(
    (scopeId) => !admissionScopeIds.has(scopeId),
  );
  const admissionCategories = new Set(task.admission?.signals.impactCategories ?? []);
  const introducedCategories = [
    ...new Set(
      impact.changed
        .map((entry) => entry.category)
        .filter((category) => !admissionCategories.has(category)),
    ),
  ];
  const repeatedExpansion = expansionCount >= REPEATED_EXPANSION_SPLIT_THRESHOLD;
  const semanticDivergence =
    introducedScopeIds.length > 0 || introducedCategories.length > 0;
  if (!existing && !repeatedExpansion && !semanticDivergence) return undefined;

  const priorSuggestedPaths = existing?.ownedPaths ?? [];
  const expansionPaths = repeatedExpansion
    ? (task.ownershipExpansions ?? []).flatMap((entry) => entry.paths)
    : [];
  const ownedPaths = [
    ...new Set([...priorSuggestedPaths, ...expansionPaths, ...addedPaths]),
  ].sort((left, right) => left.localeCompare(right));
  const reasons = [
    ...(repeatedExpansion
      ? [`ownership expanded ${expansionCount} times`]
      : []),
    ...(introducedScopeIds.length > 0
      ? [`new declared Scopes appeared (${introducedScopeIds.join(', ')})`]
      : []),
    ...(introducedCategories.length > 0
      ? [`new impact categories appeared (${introducedCategories.join(', ')})`]
      : []),
  ];
  const childGoal = `Continue ${task.goal} as bounded follow-up work`;
  const reason = `The Task may be drifting from its admitted subject because ${reasons.join(' and ')}.`;
  const command = [
    'skopos task child start',
    shellQuote(task.id),
    shellQuote(childGoal),
    '.',
    '--scope',
    shellQuote(nextScopeId),
    ...ownedPaths.flatMap((path) => ['--own', shellQuote(path)]),
    '--reason',
    shellQuote(reason),
    '--actor',
    shellQuote(actorId),
  ].join(' ');

  return {
    id: TASK_SPLIT_RECOMMENDATION_ID,
    title: 'Start a bounded child Task',
    summary: `${reason} Keep this Task intact and move the suggested paths into focused follow-up work.`,
    priority: semanticDivergence ? 'high' : 'medium',
    actionKind: 'start-child-task',
    command,
    ownedPaths,
    scopeId: nextScopeId,
    reason,
    blocking: false,
    status: 'open',
  };
};

export const applySkoposTaskDispositionRuntime = async ({
  cwd,
  taskId,
  disposition,
  reason,
  successorTaskId,
  actor,
}: {
  cwd: string;
  taskId: string;
  disposition: SkoposTaskDispositionKind;
  reason: string;
  successorTaskId?: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> => {
  const normalizedReason = reason.trim();
  if (!normalizedReason) {
    throw new Error('Task disposition requires a non-empty reason.');
  }
  if (disposition === 'supersede') {
    if (!successorTaskId?.trim()) {
      throw new Error('Superseding a Task requires --successor <task-id>.');
    }
    if (successorTaskId === taskId) {
      throw new Error('A Task cannot supersede itself.');
    }
    const successor = await showSkoposTaskRuntime({ cwd, taskId: successorTaskId });
    if (['complete', 'cancelled', 'superseded'].includes(successor.state)) {
      throw new Error(
        `Successor Task ${successor.id} is ${successor.state} and cannot own future work.`,
      );
    }
  } else if (successorTaskId) {
    throw new Error('--successor is valid only for the supersede disposition.');
  }

  return mutateTask({
    cwd,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      const priorState = task.state;
      const nextState = resolveTaskDispositionState(task, disposition);
      const claimsWork = disposition === 'resume' || disposition === 'return-from-verification';
      const terminalQuestionDisposition =
        disposition === 'cancel'
          ? {
              status: 'dismissed' as const,
              disposition: {
                kind: 'dismissed' as const,
                reason: `Task cancelled: ${normalizedReason}`,
                actorId,
                recordedAt: now,
              },
            }
          : disposition === 'supersede'
            ? {
                status: 'promoted' as const,
                disposition: {
                  kind: 'promoted' as const,
                  reason: `Task superseded: ${normalizedReason}`,
                  actorId,
                  recordedAt: now,
                  target: {
                    kind: 'task' as const,
                    ref: successorTaskId!,
                  },
                },
              }
            : undefined;
      return {
        ...task,
        state: nextState,
        disposition: {
          kind: disposition,
          reason: normalizedReason,
          actorId,
          recordedAt: now,
          priorState,
          nextState,
          ...(successorTaskId ? { successorTaskId } : {}),
        },
        ...(disposition === 'supersede'
          ? { supersededByTaskId: successorTaskId }
          : {}),
        ...(terminalQuestionDisposition
          ? {
              questions: task.questions.map((question) =>
                question.status === 'open'
                  ? { ...question, ...terminalQuestionDisposition }
                  : question,
              ),
              steps: task.steps.map((step) =>
                step.kind === 'decision' && step.status !== 'complete'
                  ? { ...step, status: 'skipped' as const }
                  : step,
              ),
              recommendations: task.recommendations.map((recommendation) =>
                recommendation.linkedQuestionId && recommendation.status === 'open'
                  ? {
                      ...recommendation,
                      status:
                        disposition === 'cancel'
                          ? 'dismissed' as const
                          : 'complete' as const,
                    }
                  : recommendation,
              ),
            }
          : {}),
        coordination: {
          ...(claimsWork ? { claimedBy: { actorId, claimedAt: now } } : {}),
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
    afterPersist: async (updated) => {
      await Promise.all([
        writeJsonArtifact({
          artifactPath: resolveSkoposTaskQuestionsPath(
            resolve(cwd),
            updated.taskIdentity,
          ),
          artifact: buildTaskQuestionProjection(updated),
        }),
        writeJsonArtifact({
          artifactPath: resolveSkoposTaskRecommendationsPath(
            resolve(cwd),
            updated.taskIdentity,
          ),
          artifact: buildTaskRecommendationProjection(updated),
        }),
      ]);
    },
  });
};

export const disposeSkoposTaskQuestionRuntime = async ({
  cwd,
  taskId,
  questionId,
  disposition,
  reason,
  targetPath,
  actor,
}: {
  cwd: string;
  taskId: string;
  questionId: string;
  disposition: Exclude<SkoposTaskQuestionDispositionKind, 'answered'>;
  reason: string;
  targetPath?: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> => {
  const workspaceRoot = resolve(cwd);
  const normalizedReason = reason.trim();
  const normalizedTargetPath = targetPath?.trim();
  if (!normalizedReason) {
    throw new Error('Question disposition requires a non-empty reason.');
  }
  if (disposition === 'promoted' && !normalizedTargetPath) {
    throw new Error('Promoting a Task question requires --target <path>.');
  }
  if (disposition === 'dismissed' && normalizedTargetPath) {
    throw new Error('A dismissed Task question does not accept --target.');
  }
  if (normalizedTargetPath && !isWorkspaceRelativePath(normalizedTargetPath)) {
    throw new Error('Question promotion target must be a workspace-relative path.');
  }
  if (normalizedTargetPath) {
    const catalog = await buildSkoposDocumentCatalog({ cwd: workspaceRoot });
    const normalized = normalizeProjectPath(normalizedTargetPath);
    const target = catalog.documents.find((document) => document.path === normalized);
    if (
      !target ||
      !['decision', 'finding', 'plan'].includes(target.role) ||
      target.authority !== 'canonical' ||
      !['active', 'durable'].includes(target.lifecycle)
    ) {
      throw new Error(
        `Question promotion target ${normalizedTargetPath} must be active canonical Decision, Finding, or Plan Memory.`,
      );
    }
  }

  return mutateTask({
    cwd: workspaceRoot,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      const terminal = ['complete', 'cancelled', 'superseded'].includes(task.state);
      if (!terminal) assertTaskActor(task, actorId);
      const question = task.questions.find((entry) => entry.id === questionId);
      if (!question) {
        throw new Error(`Task ${task.id} has no decision question ${questionId}.`);
      }
      if (question.status !== 'open') {
        if (question.status === disposition) {
          return task;
        }
        throw new Error(
          `Task question ${questionId} already has terminal disposition ${question.status}.`,
        );
      }
      const disposedQuestion = {
        ...question,
        status: disposition,
        disposition: {
          kind: disposition,
          reason: normalizedReason,
          actorId,
          recordedAt: now,
          ...(normalizedTargetPath
            ? {
                target: {
                  kind: 'document' as const,
                  ref: normalizeProjectPath(normalizedTargetPath),
                },
              }
            : {}),
        },
      };
      return {
        ...task,
        questions: task.questions.map((entry) =>
          entry.id === questionId ? disposedQuestion : entry,
        ),
        steps: task.steps.map((step) =>
          step.id === `decision-${questionId}`
            ? { ...step, status: 'skipped' as const }
            : step,
        ),
        recommendations: task.recommendations.map((recommendation) =>
          recommendation.linkedQuestionId === questionId
            ? {
                ...recommendation,
                status:
                  disposition === 'dismissed'
                    ? 'dismissed' as const
                    : 'complete' as const,
              }
            : recommendation,
        ),
        coordination: {
          ...task.coordination,
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
    afterPersist: async (updated) => {
      await Promise.all([
        writeJsonArtifact({
          artifactPath: resolveSkoposTaskQuestionsPath(
            workspaceRoot,
            updated.taskIdentity,
          ),
          artifact: buildTaskQuestionProjection(updated),
        }),
        writeJsonArtifact({
          artifactPath: resolveSkoposTaskRecommendationsPath(
            workspaceRoot,
            updated.taskIdentity,
          ),
          artifact: buildTaskRecommendationProjection(updated),
        }),
      ]);
    },
  });
};

const resolveTaskDispositionState = (
  task: SkoposTaskArtifact,
  disposition: SkoposTaskDispositionKind,
): SkoposTaskState => {
  const allowed: Record<SkoposTaskDispositionKind, SkoposTaskState[]> = {
    resume: ['ready', 'deferred'],
    ready: ['active', 'blocked'],
    defer: ['ready', 'active', 'blocked'],
    'return-from-verification': ['verifying', 'ready-to-integrate'],
    cancel: ['ready', 'active', 'blocked', 'deferred', 'verifying', 'ready-to-integrate'],
    supersede: ['ready', 'active', 'blocked', 'deferred', 'verifying', 'ready-to-integrate'],
  };
  if (!allowed[disposition].includes(task.state)) {
    throw new Error(
      `Task ${task.id} cannot apply disposition ${disposition} from state ${task.state}.`,
    );
  }
  if (disposition === 'resume' || disposition === 'return-from-verification') {
    return 'active';
  }
  if (disposition === 'ready') return 'ready';
  if (disposition === 'defer') return 'deferred';
  if (disposition === 'cancel') return 'cancelled';
  return 'superseded';
};

export const completeSkoposTaskStepRuntime = async ({
  cwd,
  taskId,
  stepId,
  actor,
}: {
  cwd: string;
  taskId: string;
  stepId: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> =>
  mutateTask({
    cwd,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      assertTaskActor(task, actorId);
      if (!task.steps.some((step) => step.id === stepId)) {
        throw new Error(`Task ${task.id} has no step ${stepId}.`);
      }
      return {
        ...task,
        steps: task.steps.map((step) =>
          step.id === stepId ? { ...step, status: 'complete' } : step,
        ),
        coordination: {
          ...task.coordination,
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });

export const resolveSkoposTaskMemoryObligationRuntime = async ({
  cwd,
  taskId,
  obligationId,
  resolution,
  reason,
  targetPath,
  actor,
}: {
  cwd: string;
  taskId: string;
  obligationId: string;
  resolution: 'memory-updated' | 'reviewed-no-change';
  reason: string;
  targetPath?: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> => {
  const normalizedReason = reason.trim();
  if (!normalizedReason) {
    throw new Error('Memory obligation resolution requires a non-empty reason.');
  }
  const normalizedTargetPath = targetPath?.trim();
  if (resolution === 'memory-updated' && !normalizedTargetPath) {
    throw new Error('A memory-updated resolution requires --target <path>.');
  }
  if (resolution === 'reviewed-no-change' && normalizedTargetPath) {
    throw new Error(
      'A reviewed-no-change resolution uses the inferred target and does not accept --target.',
    );
  }
  if (normalizedTargetPath && !isWorkspaceRelativePath(normalizedTargetPath)) {
    throw new Error('Memory obligation target must be a workspace-relative path.');
  }
  let resolvedTargetRole: SkoposTaskMemoryObligation['role'] | undefined;
  if (resolution === 'memory-updated') {
    const catalog = await buildSkoposDocumentCatalog({ cwd: resolve(cwd) });
    const targetDocument = catalog.documents.find(
      (document) => document.path === normalizeProjectPath(normalizedTargetPath!),
    );
    if (!targetDocument || !isDurableMemoryDocument(targetDocument)) {
      throw new Error(
        `Memory obligation target ${normalizedTargetPath} is not adopted canonical durable Memory.`,
      );
    }
    resolvedTargetRole = targetDocument.role;
  }

  return mutateTask({
    cwd,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      assertTaskActor(task, actorId);
      const obligation = task.memoryObligations.find(
        (entry) => entry.id === obligationId,
      );
      if (!obligation) {
        throw new Error(`Task ${task.id} has no Memory obligation ${obligationId}.`);
      }
      if (resolvedTargetRole && resolvedTargetRole !== obligation.role) {
        throw new Error(
          `Memory target role ${resolvedTargetRole} does not satisfy ${obligation.role} obligation ${obligation.id}.`,
        );
      }
      return {
        ...task,
        memoryObligations: task.memoryObligations.map((entry) =>
          entry.id === obligationId
            ? {
                ...entry,
                status: 'complete' as const,
                resolution,
                resolutionReason: normalizedReason,
                targetPath: normalizedTargetPath ?? entry.targetPath,
                resolvedAt: now,
                resolvedByActorId: actorId,
              }
            : entry,
        ),
        coordination: {
          ...task.coordination,
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });
};

export const completeSkoposTaskActionRuntime = async ({
  cwd,
  taskId,
  actionId,
  actor,
}: {
  cwd: string;
  taskId: string;
  actionId: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> => {
  const workspaceRoot = resolve(cwd);
  return mutateTask({
    cwd: workspaceRoot,
    taskId,
    actor,
    mutate: (task, actorId, now) => ({
      ...task,
      steps: task.steps.map((step) =>
        step.id === `action-${actionId}`
          ? { ...step, status: 'complete' as const }
          : step,
      ),
      recommendations: task.recommendations.map((recommendation) =>
        recommendation.actionKind === 'run-action' &&
        recommendation.actionId === actionId
          ? { ...recommendation, status: 'complete' as const }
          : recommendation,
      ),
      coordination: {
        ...task.coordination,
        lastUpdatedBy: actorId,
        lastUpdatedAt: now,
      },
    }),
    afterPersist: async (updated) => {
      await writeJsonArtifact({
        artifactPath: resolveSkoposTaskRecommendationsPath(
          workspaceRoot,
          updated.taskIdentity,
        ),
        artifact: buildTaskRecommendationProjection(updated),
      });
    },
  });
};

export const moveSkoposTaskToVerificationRuntime = async ({
  cwd,
  taskId,
  actor,
}: {
  cwd: string;
  taskId: string;
  actor?: string;
}): Promise<SkoposTaskArtifact> =>
  mutateTask({
    cwd,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      assertTaskActor(task, actorId);
      const unfinished = task.steps.filter(
        (step) =>
          step.kind !== 'verification' &&
          step.status !== 'complete' &&
          step.status !== 'skipped',
      );
      if (unfinished.length > 0) {
        throw new Error(
          `Task ${task.id} has unfinished pre-verification steps: ${unfinished.map((step) => step.id).join(', ')}.`,
        );
      }
      const openQuestions = task.questions.filter((question) => question.status === 'open');
      if (openQuestions.length > 0) {
        throw new Error(
          `Task ${task.id} has open decision questions: ${openQuestions.map((question) => question.id).join(', ')}. Resolve each with skopos decide <question-id> <option-id> . --actor ${actorId}.`,
        );
      }
      return {
        ...task,
        state: 'verifying',
        coordination: {
          ...task.coordination,
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });

export const applySkoposTaskReadinessStateRuntime = async ({
  cwd,
  taskId,
  actor,
  target,
}: {
  cwd: string;
  taskId: string;
  actor?: string;
  target: 'integrate' | 'close';
}): Promise<SkoposTaskArtifact> =>
  mutateTask({
    cwd,
    taskId,
    actor,
    mutate: (task, actorId, now) => {
      assertTaskActor(task, actorId);
      const expectedState = target === 'integrate' ? 'verifying' : 'ready-to-integrate';
      const idempotentClose = target === 'close' && task.state === 'complete';
      if (task.state !== expectedState && !idempotentClose) {
        throw new Error(
          `Task ${task.id} must be ${expectedState} before ${target}; current state is ${task.state}.`,
        );
      }
      return {
        ...task,
        state: target === 'integrate' ? 'ready-to-integrate' : 'complete',
        status: target === 'close' ? 'durable' : task.status,
        steps:
          target === 'integrate'
            ? task.steps.map((step) =>
                step.kind === 'verification'
                  ? { ...step, status: 'complete' as const }
                  : step,
              )
            : task.steps,
        trackedDocumentPath:
          target === 'close' && task.trackedDocumentPath
            ? archiveTrackedTaskDocumentPath(task.trackedDocumentPath)
            : task.trackedDocumentPath,
        coordination: {
          ...task.coordination,
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });

const normalizeTaskContract = ({
  acceptanceCriteria,
  nonGoals,
  constraints,
}: SkoposTaskContractDeclaration): SkoposTaskContractDeclaration => ({
  acceptanceCriteria: normalizeEntries(acceptanceCriteria),
  nonGoals: normalizeEntries(nonGoals),
  constraints: normalizeEntries(constraints),
});

const normalizeEntries = (entries: string[]): string[] =>
  [...new Set(entries.map((entry) => entry.trim()).filter(Boolean))];

const inferTaskDetail = (risk: SkoposTaskRisk): SkoposTaskDetail =>
  risk === 'high-impact' ? 'detailed' : risk;

const HIGH_IMPACT_GOAL_SIGNALS = [
  'architecture',
  'authentication',
  'authorization',
  'breaking change',
  'database migration',
  'data migration',
  'deployment',
  'multi-package',
  'multi-repository',
  'privacy',
  'public api',
  'public contract',
  'release',
  'security',
] as const;

const LIGHT_GOAL_SIGNALS = [
  'comment',
  'copy edit',
  'formatting',
  'spelling',
  'typo',
  'wording',
] as const;

export const assessSkoposTaskAdmission = ({
  plan,
  impact,
  ownedPaths,
  explicitRisk,
  explicitDetail,
  proofSubjectKind,
}: {
  plan: SkoposPlanResult;
  impact?: SkoposImpactReport;
  ownedPaths: string[];
  explicitRisk?: SkoposTaskRisk;
  explicitDetail?: SkoposTaskDetail;
  proofSubjectKind: SkoposProofSubjectKind;
}): SkoposTaskAdmissionAssessment => {
  const searchable = `${plan.goal} ${plan.risks.join(' ')}`.toLowerCase();
  const goalSignals = HIGH_IMPACT_GOAL_SIGNALS.filter((signal) =>
    searchable.includes(signal),
  );
  const lightGoalSignals = LIGHT_GOAL_SIGNALS.filter((signal) =>
    searchable.includes(signal),
  );
  const affectedScopeIds = [
    ...new Set(impact?.affectedScopes.map((scope) => scope.id) ?? [plan.scope.scope.id]),
  ].sort();
  const affectedNonWorkspaceScopeCount =
    impact?.affectedScopes.filter((scope) => scope.kind !== 'workspace').length ??
    (plan.scope.scope.kind === 'workspace' ? 0 : 1);
  const impactCategories = [
    ...new Set(impact?.changed.map((entry) => entry.category) ?? []),
  ].sort();
  const reasons: string[] = [];
  let recommendedRisk: SkoposTaskRisk;

  if (proofSubjectKind === 'project-integration') {
    recommendedRisk = 'high-impact';
    reasons.push('Project-integration proof always requires strict high-impact work.');
  } else if (goalSignals.length > 0) {
    recommendedRisk = 'high-impact';
    reasons.push(`The goal contains high-impact signal${goalSignals.length === 1 ? '' : 's'}: ${goalSignals.join(', ')}.`);
  } else if (affectedNonWorkspaceScopeCount > 1 || ownedPaths.length >= 12) {
    recommendedRisk = 'high-impact';
    reasons.push(
      affectedNonWorkspaceScopeCount > 1
        ? `Declared ownership affects ${affectedNonWorkspaceScopeCount} non-workspace Scopes.`
        : `Declared ownership spans ${ownedPaths.length} paths.`,
    );
  } else {
    const durableSurface = ownedPaths.some((path) =>
      /^(?:AGENTS\.md|skopos\.config\.|tools\/skopos\/|docs\/(?:architecture|decisions|standards)\/)/u.test(
        normalizeProjectPath(path),
      ),
    );
    const clearlyLight =
      ownedPaths.length <= 1 &&
      !durableSurface &&
      (lightGoalSignals.length > 0 || plan.implementationSteps.length <= 3);
    recommendedRisk = clearlyLight ? 'light' : 'standard';
    reasons.push(
      clearlyLight
        ? 'The work is narrow, local, and has no durable-governance or cross-Scope signal.'
        : 'The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.',
    );
  }

  const selectionSource =
    proofSubjectKind === 'project-integration'
      ? 'proof-subject' as const
      : explicitRisk
        ? 'explicit-override' as const
        : 'automatic' as const;
  const selectedRisk =
    proofSubjectKind === 'project-integration'
      ? 'high-impact'
      : explicitRisk ?? recommendedRisk;
  const selectedDetail =
    proofSubjectKind === 'project-integration'
      ? 'detailed'
      : explicitDetail ?? inferTaskDetail(selectedRisk);
  if (explicitRisk && explicitRisk !== recommendedRisk) {
    reasons.push(
      `The caller explicitly selected ${explicitRisk}; Skopos recommended ${recommendedRisk} and kept both values visible.`,
    );
  }

  return {
    recommendedRisk,
    recommendedDetail: inferTaskDetail(recommendedRisk),
    selectedRisk,
    selectedDetail,
    selectionSource,
    workflow:
      selectedRisk === 'light'
        ? 'fast-path'
        : selectedRisk === 'high-impact'
          ? 'strict'
          : 'tracked',
    reasons,
    signals: {
      goalSignals: [...goalSignals, ...lightGoalSignals],
      ownedPathCount: ownedPaths.length,
      affectedScopeIds,
      impactCategories,
      proofSubjectKind,
    },
  };
};

const MEMORY_ROLES = new Set<SkoposTaskMemoryObligation['role']>([
  'architecture',
  'standard',
  'guide',
  'decision',
  'finding',
  'pattern',
]);

export const inferSkoposTaskMemoryObligationsRuntime = async ({
  cwd,
  scope,
  risk,
  ownedPaths,
  goal = '',
  contract,
}: {
  cwd: string;
  scope: SkoposResolvedScope;
  risk: SkoposTaskRisk;
  ownedPaths: string[];
  goal?: string;
  contract?: SkoposTaskContractDeclaration;
}): Promise<SkoposTaskMemoryObligation[]> => {
  const workspaceRoot = resolve(cwd);
  const catalog = await buildSkoposDocumentCatalog({ cwd: workspaceRoot });
  const normalizedOwnedPaths = ownedPaths.map(normalizeProjectPath).filter(Boolean);
  const eligibleDocuments = catalog.documents.filter(isDurableMemoryDocument);
  const ownedDocuments = eligibleDocuments.filter((document) =>
    normalizedOwnedPaths.some((ownedPath) => pathsOverlap(ownedPath, document.path)),
  );
  const obligations = ownedDocuments.map((document) =>
    buildDocumentMemoryObligation(document),
  );

  if (risk === 'high-impact' && obligations.length === 0) {
    const scopeMemoryRoot = normalizeProjectPath(scope.scope.memoryRoot ?? 'docs');
    const scopeDocument = eligibleDocuments
      .filter(
        (document) =>
          document.metadata?.scope === scope.scope.id ||
          isPathInside(document.path, scopeMemoryRoot),
      )
      .sort(compareMemoryCandidates)[0];
    obligations.push({
      id: scopeDocument
        ? buildMemoryObligationId(scopeDocument.role, scopeDocument.path)
        : `memory-architecture-${shortDigest(scope.scope.id)}`,
      role: scopeDocument && MEMORY_ROLES.has(scopeDocument.role)
        ? scopeDocument.role
        : 'architecture',
      reason: scopeDocument
        ? `High-impact work must review and synchronize the existing ${scopeDocument.role} Memory for Scope ${scope.scope.id}.`
        : `High-impact work must review and synchronize durable Memory for Scope ${scope.scope.id}.`,
      status: 'open',
      targetPath: scopeDocument?.path,
    });
  }

  const conventionRole = classifyDurableConventionIntent({ goal, contract });
  if (conventionRole && !obligations.some((entry) => entry.role === conventionRole)) {
    const scopeMemoryRoot = normalizeProjectPath(scope.scope.memoryRoot ?? 'docs');
    const conventionDocument = eligibleDocuments
      .filter(
        (document) =>
          document.role === conventionRole &&
          (document.metadata?.scope === scope.scope.id ||
            isPathInside(document.path, scopeMemoryRoot)),
      )
      .sort(compareMemoryCandidates)[0];
    obligations.push({
      id: conventionDocument
        ? buildMemoryObligationId(conventionRole, conventionDocument.path)
        : `memory-${conventionRole}-convention-${shortDigest(scope.scope.id)}`,
      role: conventionRole,
      reason: conventionDocument
        ? `This Task establishes a durable project convention; review and synchronize the existing ${conventionRole} Memory at ${conventionDocument.path}.`
        : `This Task establishes a durable project convention; create or adopt canonical ${conventionRole} Memory for Scope ${scope.scope.id} instead of leaving the convention only in implementation history.`,
      status: 'open',
      targetPath: conventionDocument?.path,
    });
  }

  return obligations.sort((left, right) => left.id.localeCompare(right.id));
};

const classifyDurableConventionIntent = ({
  goal,
  contract,
}: {
  goal: string;
  contract?: SkoposTaskContractDeclaration;
}): 'pattern' | 'standard' | undefined => {
  const intent = [
    goal,
    ...(contract?.acceptanceCriteria ?? []),
    ...(contract?.constraints ?? []),
  ].join(' ').toLowerCase();
  const durableVerb = /\b(?:adopt|codify|define|enforce|establish|introduce|standardize|standardise)\b/u.test(intent) ||
    /\bmake\b[\s\S]{0,32}\bdefault\b/u.test(intent);
  const durableSubject = /\b(?:convention|design system|guideline|naming scheme|pattern|standard)\b/u.test(intent) ||
    /\b(?:project|repository|repo|workspace)[ -]wide\b/u.test(intent) ||
    /\bacross (?:the )?(?:project|repository|repo|workspace)\b/u.test(intent);
  const explicitlyLocal = /\b(?:one-off|single|local-only|this one|only this)\b/u.test(intent) ||
    /\b(?:adjust|fix|polish|resize|tweak)\b[\s\S]{0,36}\b(?:color|copy|spacing|component|screen|page)\b/u.test(intent);
  const explicitlyDurableScope = /\b(?:project|repository|repo|workspace)[ -]wide\b/u.test(intent) ||
    /\bacross (?:the )?(?:project|repository|repo|workspace)\b/u.test(intent) ||
    /\bfrom now on\b/u.test(intent);
  if (!durableVerb || !durableSubject || (explicitlyLocal && !explicitlyDurableScope)) {
    return undefined;
  }
  return /\b(?:convention|pattern)\b/u.test(intent) ? 'pattern' : 'standard';
};

const isDurableMemoryDocument = (
  document: SkoposDocumentKnowledgeEntry,
): document is SkoposDocumentKnowledgeEntry & {
  role: SkoposTaskMemoryObligation['role'];
} =>
  MEMORY_ROLES.has(document.role as SkoposTaskMemoryObligation['role']) &&
  document.authority === 'canonical' &&
  ['active', 'durable'].includes(document.lifecycle);

const buildDocumentMemoryObligation = (
  document: SkoposDocumentKnowledgeEntry & {
    role: SkoposTaskMemoryObligation['role'];
  },
): SkoposTaskMemoryObligation => ({
  id: buildMemoryObligationId(document.role, document.path),
  role: document.role,
  reason: `The declared Task scope owns canonical ${document.role} Memory at ${document.path}; review and synchronize it if project truth changes.`,
  status: 'open',
  targetPath: document.path,
});

const buildMemoryObligationId = (
  role: SkoposTaskMemoryObligation['role'],
  path: string,
): string => `memory-${role}-${shortDigest(path)}`;

const shortDigest = (value: string): string =>
  createHash('sha256').update(value).digest('hex').slice(0, 10);

const compareMemoryCandidates = (
  left: SkoposDocumentKnowledgeEntry,
  right: SkoposDocumentKnowledgeEntry,
): number =>
  memoryRolePriority(left.role) - memoryRolePriority(right.role) ||
  left.path.localeCompare(right.path);

const memoryRolePriority = (role: SkoposDocumentKnowledgeEntry['role']): number => {
  const order = ['architecture', 'standard', 'guide', 'decision', 'finding', 'pattern'];
  const index = order.indexOf(role);
  return index === -1 ? order.length : index;
};

const normalizeProjectPath = (path: string): string =>
  path.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, '');

const pathsOverlap = (left: string, right: string): boolean =>
  left === right || isPathInside(left, right) || isPathInside(right, left);

const isPathInside = (path: string, parent: string): boolean =>
  parent === '.' || path.startsWith(`${parent}/`);

const isWorkspaceRelativePath = (path: string): boolean => {
  const normalized = normalizeProjectPath(path);
  const segments = normalized.split('/');
  return (
    normalized.length > 0 &&
    !normalized.startsWith('/') &&
    !/^[a-z]:\//iu.test(normalized) &&
    !segments.includes('..')
  );
};

const resolveTrackedTaskDocumentPath = ({
  risk,
  state,
  scopeMemoryRoot,
  scopeKind,
  scopeMatchedBy,
  taskId,
  title,
}: {
  risk: SkoposTaskRisk;
  state: SkoposTaskArtifact['state'];
  scopeMemoryRoot?: string;
  scopeKind: SkoposTaskArtifact['scope']['scope']['kind'];
  scopeMatchedBy: SkoposTaskArtifact['scope']['matchedBy'];
  taskId: string;
  title: string;
}): string | undefined => {
  if (risk === 'light') return undefined;
  const resolvedMemoryRoot =
    scopeMemoryRoot ??
    (scopeKind === 'workspace' && scopeMatchedBy === 'default-root' ? 'docs' : undefined);
  if (!resolvedMemoryRoot || !isWorkspaceRelativePath(resolvedMemoryRoot)) {
    throw new Error(
      `Tracked Task ${taskId} requires a safe workspace-relative Memory root for its declared Scope.`,
    );
  }
  const activePath = posix.join(
    normalizeProjectPath(resolvedMemoryRoot),
    'work',
    'tasks',
    `${taskId}-${slugify(title)}.md`,
  );
  return ['complete', 'cancelled', 'superseded'].includes(state)
    ? archiveTrackedTaskDocumentPath(activePath)
    : activePath;
};

const buildTaskSteps = (
  plan: SkoposPlanResult,
  selectedActions: SkoposTaskArtifact['selectedActions'],
): SkoposTaskStep[] => [
  ...plan.decisionQuestions.map((question) => ({
    id: `decision-${question.id}`,
    kind: 'decision' as const,
    title: question.question,
    detail: question.whyItMatters,
    status: 'pending' as const,
  })),
  ...plan.implementationSteps.map((step) => ({
    id: `step-${step.id}`,
    kind: classifyTaskStep(step.id),
    title: step.title,
    detail: step.detail,
    status: 'pending' as const,
  })),
  ...selectedActions.map((action) => ({
    id: `action-${action.id}`,
    kind: 'action' as const,
    title: action.title,
    detail: action.reason,
    status: 'pending' as const,
  })),
];

const classifyTaskStep = (stepId: string): SkoposTaskStep['kind'] => {
  if (stepId === 'run-checks') {
    return 'verification';
  }
  if (stepId === 'sync-knowledge') {
    return 'docs';
  }
  if (stepId === 'run-actions') {
    return 'action';
  }
  return 'implementation';
};

const mutateTask = async ({
  cwd,
  taskId,
  actor,
  mutate,
  afterPersist,
}: {
  cwd: string;
  taskId: string;
  actor?: string;
  mutate: (
    task: SkoposTaskArtifact,
    actorId: string,
    now: string,
  ) => SkoposTaskArtifact;
  afterPersist?: (task: SkoposTaskArtifact) => Promise<void>;
}): Promise<SkoposTaskArtifact> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Task mutation requires --actor <id> or SKOPOS_ACTOR.');
  }
  const updated = await withSkoposTaskMutationTransaction(
    { cwd: workspaceRoot, taskId },
    async () => {
      const existing = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
      const now = new Date().toISOString();
      const mutated = mutate(existing, actorId, now);
      const updated = {
        ...mutated,
        trackedDocumentPath: resolveTrackedTaskDocumentPath({
          risk: mutated.risk,
          state: mutated.state,
          scopeMemoryRoot: mutated.scope.scope.memoryRoot,
          scopeKind: mutated.scope.scope.kind,
          scopeMatchedBy: mutated.scope.matchedBy,
          taskId: mutated.id,
          title: mutated.title,
        }),
        updatedAt: now,
      };
      await writeJsonArtifact({
        artifactPath: resolveSkoposTaskArtifactPath(workspaceRoot, existing.taskIdentity),
        artifact: updated,
      });
      if (
        existing.trackedDocumentPath &&
        updated.trackedDocumentPath &&
        existing.trackedDocumentPath !== updated.trackedDocumentPath
      ) {
        const sourcePath = resolve(workspaceRoot, existing.trackedDocumentPath);
        const targetPath = resolve(workspaceRoot, updated.trackedDocumentPath);
        await mkdir(dirname(targetPath), { recursive: true });
        try {
          await rename(sourcePath, targetPath);
        } catch (error) {
          if (!isMissingFileError(error)) throw error;
        }
      }
      if (updated.trackedDocumentPath) {
        await writeSkoposTrackedTaskDocumentRuntime({
          workspaceRoot,
          task: updated,
        });
      }
      await afterPersist?.(updated);
      return updated;
    },
  );
  if (updated.parentTaskId) {
    await synchronizeParentChildReference({
      workspaceRoot,
      childTask: updated,
      actorId,
    });
  }
  return updated;
};

const synchronizeParentChildReference = async ({
  workspaceRoot,
  childTask,
  actorId,
}: {
  workspaceRoot: string;
  childTask: SkoposTaskArtifact;
  actorId: string;
}): Promise<void> => {
  const parentTaskId = childTask.parentTaskId;
  if (!parentTaskId) return;
  await mutateTask({
    cwd: workspaceRoot,
    taskId: parentTaskId,
    actor: actorId,
    mutate: (parent, _resolvedActorId, now) => {
      const childIndex = parent.childTasks.findIndex(
        (reference) => reference.taskId === childTask.id,
      );
      if (childIndex < 0) {
        throw new Error(
          `Child Task ${childTask.id} names parent ${parent.id}, but the parent does not link it.`,
        );
      }
      const childTasks = parent.childTasks.map((reference, index) =>
        index === childIndex
          ? {
              ...reference,
              title: childTask.title,
              goal: childTask.goal,
              scopeId: childTask.scope.scope.id,
              state: childTask.state,
              claimedByActorId: childTask.coordination.claimedBy?.actorId,
              ownedPaths: [...childTask.changeScope.declaredOwnedPaths],
              dependencyTaskIds: [...childTask.dependencyTaskIds],
            }
          : reference,
      );
      const hasUnsuccessfulChild = childTasks.some(
        (reference) => reference.state !== 'complete',
      );
      const hasBlockingQuestion = parent.questions.some(
        (question) => question.blocking && question.status === 'open',
      );
      const nextState =
        ['complete', 'cancelled', 'superseded'].includes(parent.state)
          ? parent.state
          : hasUnsuccessfulChild || hasBlockingQuestion
            ? 'blocked'
            : parent.state === 'blocked'
              ? 'ready'
              : parent.state;
      return {
        ...parent,
        childTasks,
        state: nextState,
        coordination: {
          ...parent.coordination,
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });
};

export const writeSkoposTrackedTaskDocumentRuntime = async ({
  workspaceRoot,
  task,
  dryRun = false,
}: {
  workspaceRoot: string;
  task: SkoposTaskArtifact;
  dryRun?: boolean;
}): Promise<void> => {
  if (!task.trackedDocumentPath || dryRun) return;
  const path = resolve(workspaceRoot, task.trackedDocumentPath);
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = join(
    dirname(path),
    `.${basename(path)}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`,
  );
  try {
    await writeFile(temporaryPath, renderTrackedTaskDocument(task), 'utf8');
    await rename(temporaryPath, path);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
};

const renderTrackedTaskDocument = (task: SkoposTaskArtifact): string => {
  const terminal = ['complete', 'cancelled', 'superseded'].includes(task.state);
  const lifecycle = terminal ? 'historical' : 'active';
  const date = (task.updatedAt ?? new Date().toISOString()).slice(0, 10);
  const lines = [
    '---',
    `title: ${yamlString(`Task: ${task.title}`)}`,
    `status: ${task.state}`,
    `owner: ${yamlString(task.coordination.claimedBy?.actorId ?? 'project')}`,
    `id: ${task.id}`,
    `scope: ${yamlString(task.scope.scope.id)}`,
    'role: task',
    `lifecycle: ${lifecycle}`,
    'authority: canonical',
    'provenance: accepted',
    `view: ${terminal ? 'exception' : 'current'}`,
    `risk: ${task.risk}`,
    `proofSubject: ${task.proofSubject?.kind ?? 'task-closure'}`,
    `proofBaseline: ${task.proofSubject?.baselineId ?? `baseline-legacy-${task.id.slice(2)}`}`,
    `lastUpdated: ${date}`,
    ...(task.parentTaskId ? [`parentTaskId: ${task.parentTaskId}`] : []),
    ...(task.planIds.length > 0 ? ['relatedPlans:', ...task.planIds.map((id) => `  - ${id}`)] : []),
    '---',
    '',
    `# Task: ${task.title}`,
    '',
    '## Changelog',
    '',
    `- \`${date}\`: Synchronized Task state \`${task.state}\` from Skopos.`,
    '',
    '## Goal',
    '',
    task.goal,
    '',
    '## Acceptance',
    '',
    ...asBulletList(task.contract.acceptanceCriteria, 'No acceptance criterion was declared.'),
    '',
    '## Non-Goals',
    '',
    ...asBulletList(task.contract.nonGoals, 'None declared.'),
    '',
    '## Constraints',
    '',
    ...asBulletList(task.contract.constraints, 'None declared.'),
    '',
    '## Admission And Workflow',
    '',
    ...(task.admission
      ? [
          `- Workflow: \`${task.admission.workflow}\``,
          `- Selected risk/detail: \`${task.admission.selectedRisk}\` / \`${task.admission.selectedDetail}\``,
          `- Recommended risk/detail: \`${task.admission.recommendedRisk}\` / \`${task.admission.recommendedDetail}\``,
          `- Selection source: \`${task.admission.selectionSource}\``,
          ...task.admission.reasons.map((reason) => `- Reason: ${reason}`),
        ]
      : [`- Legacy Task admission; workflow derives from risk \`${task.risk}\`.`]),
    '',
    '## Owned Paths',
    '',
    ...asBulletList(task.changeScope.declaredOwnedPaths.map((path) => `\`${path}\``), 'None declared.'),
    '',
    '## Ownership Expansions',
    '',
    ...asBulletList(
      (task.ownershipExpansions ?? []).map(
        (entry) =>
          `\`${entry.recordedAt}\` by \`${entry.actorId}\`: ${entry.paths.map((path) => `\`${path}\``).join(', ')} — ${entry.reason}`,
      ),
      'None recorded.',
    ),
    '',
    '## Steps',
    '',
    ...task.steps.map(
      (step) => `- [${step.status === 'complete' ? 'x' : ' '}] **${step.title}** (${step.kind}, ${step.status}) — ${step.detail}`,
    ),
    '',
    '## Actions And Guards',
    '',
    ...asBulletList(
      [
        ...task.selectedActions.map((action) => `Action \`${action.id}\`: ${action.reason}`),
        ...task.selectedGuardIds.map((guardId) => `Guard \`${guardId}\``),
      ],
      'No Action or Guard is selected.',
    ),
    '',
    '## Evidence And Readiness',
    '',
    ...asBulletList(
      task.evidenceRequirements.map(
        (requirement) =>
          `${requirement.acceptanceCriterion} (${requirement.phase}, ${requirement.evidence})`,
      ),
      'No Evidence requirement is declared.',
    ),
    '',
    '## Memory Obligations',
    '',
    ...asBulletList(
      task.memoryObligations.map(
        (obligation) =>
          `[${obligation.status}] ${obligation.role}: ${obligation.reason}${obligation.targetPath ? ` (target: \`${obligation.targetPath}\`)` : ''}${obligation.resolution ? `; resolution: ${obligation.resolution}` : ''}`,
      ),
      'No durable Memory obligation is inferred.',
    ),
    '',
    '## Portable Task State',
    '',
    'This machine-readable block is the durable source used to rebuild local Skopos state.',
    '',
    '<!-- skopos:task-state:start -->',
    '```json',
    JSON.stringify(toPortableTaskState(task), null, 2),
    '```',
    '<!-- skopos:task-state:end -->',
    '',
  ];
  return lines.join('\n');
};

export const archiveTrackedTaskDocumentPath = (trackedDocumentPath: string): string => {
  const normalizedPath = normalizeProjectPath(trackedDocumentPath);
  let memoryWorkRoot = posix.dirname(posix.dirname(normalizedPath));
  while (posix.basename(memoryWorkRoot) === 'archive') {
    memoryWorkRoot = posix.dirname(memoryWorkRoot);
  }
  return posix.join(memoryWorkRoot, 'archive', 'tasks', posix.basename(normalizedPath));
};

export const resolveSkoposTrackedTaskProjectionPaths = (
  trackedDocumentPath?: string,
): string[] => {
  if (!trackedDocumentPath) return [];
  const normalizedPath = normalizeProjectPath(trackedDocumentPath);
  const archivedPath = archiveTrackedTaskDocumentPath(normalizedPath);
  const taskDirectory = posix.dirname(normalizedPath);
  const archiveDirectory = posix.dirname(taskDirectory);
  const activePath =
    posix.basename(taskDirectory) === 'tasks' && posix.basename(archiveDirectory) === 'archive'
      ? posix.join(posix.dirname(archiveDirectory), 'tasks', posix.basename(normalizedPath))
      : normalizedPath;
  return [...new Set([activePath, archivedPath, normalizedPath])];
};

export const isSkoposTrackedTaskProjectionPath = (
  candidatePath: string,
  trackedDocumentPaths: string[],
): boolean => {
  const normalizedCandidate = normalizeProjectPath(candidatePath);
  const normalizedTrackedPaths = trackedDocumentPaths.map(normalizeProjectPath);
  if (normalizedTrackedPaths.includes(normalizedCandidate)) return true;

  for (const trackedPath of normalizedTrackedPaths) {
    const taskId = posix.basename(trackedPath).match(/^(T-[a-z0-9]+)-/iu)?.[1];
    const taskDirectory = posix.dirname(trackedPath);
    if (
      !taskId ||
      posix.basename(taskDirectory) !== 'tasks' ||
      posix.basename(posix.dirname(taskDirectory)) === 'archive'
    ) {
      continue;
    }
    const snapshotPrefix = `${posix.join(taskDirectory, 'snapshots', `${taskId}-S-`)}`;
    if (normalizedCandidate.startsWith(snapshotPrefix) && normalizedCandidate.endsWith('.json')) {
      return true;
    }
  }
  return false;
};

const asBulletList = (values: string[], empty: string): string[] =>
  values.length > 0 ? values.map((value) => `- ${value}`) : [`- ${empty}`];

const yamlString = (value: string): string => JSON.stringify(value);

type PortableTaskState = Omit<
  SkoposTaskArtifact,
  | 'workspaceRoot'
  | 'taskIdentity'
  | 'trackedDocumentPath'
  | 'coordination'
  | 'authority'
  | 'changeScope'
> & {
  declaredOwnedPaths: string[];
};

const toPortableTaskState = (task: SkoposTaskArtifact): PortableTaskState => {
  const {
    workspaceRoot: _workspaceRoot,
    taskIdentity: _taskIdentity,
    trackedDocumentPath: _trackedDocumentPath,
    coordination: _coordination,
    authority: _authority,
    changeScope,
    ...portable
  } = task;
  return {
    ...portable,
    declaredOwnedPaths: changeScope.declaredOwnedPaths,
  };
};

const parsePortableTaskState = (source: string): PortableTaskState | undefined => {
  const match = source.match(
    /<!-- skopos:task-state:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- skopos:task-state:end -->/,
  );
  if (!match?.[1]) return undefined;
  return JSON.parse(match[1]) as PortableTaskState;
};

const buildTaskQuestionProjection = (
  task: SkoposTaskArtifact,
): SkoposTaskQuestionArtifact => ({
  schemaVersion: 1,
  id: `${task.id}.questions`,
  type: 'task-questions',
  status: 'generated',
  authority: 'generated',
  generatedAt: task.generatedAt,
  updatedAt: task.updatedAt,
  workspaceRoot: task.workspaceRoot,
  taskIdentity: task.taskIdentity,
  taskId: task.id,
  entries: task.questions,
});

const buildTaskRecommendationProjection = (
  task: SkoposTaskArtifact,
): SkoposTaskRecommendationArtifact => ({
  schemaVersion: 1,
  id: `${task.id}.recommendations`,
  type: 'task-recommendations',
  status: 'generated',
  authority: 'generated',
  generatedAt: task.generatedAt,
  updatedAt: task.updatedAt,
  workspaceRoot: task.workspaceRoot,
  taskIdentity: task.taskIdentity,
  taskId: task.id,
  entries: task.recommendations,
});

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 56) || 'task';

const assertTaskActor = (task: SkoposTaskArtifact, actorId: string): void => {
  const claimedBy = task.coordination.claimedBy?.actorId;
  if (!claimedBy) {
    throw new Error(`Task ${task.id} must be claimed before it can be mutated.`);
  }
  if (claimedBy !== actorId) {
    throw new Error(`Task ${task.id} is claimed by ${claimedBy}, not ${actorId}.`);
  }
};

const buildTaskQuestions = ({
  workspaceRoot,
  taskIdentity,
  taskId,
  now,
  plan,
}: {
  workspaceRoot: string;
  taskIdentity: SkoposTaskArtifact['taskIdentity'];
  taskId: string;
  now: string;
  plan: SkoposPlanResult;
}): SkoposTaskQuestionArtifact => ({
  schemaVersion: 1,
  id: `${taskId}.questions`,
  type: 'task-questions',
  status: 'generated',
  authority: 'generated',
  generatedAt: now,
  updatedAt: now,
  workspaceRoot,
  taskIdentity,
  taskId,
  entries: plan.decisionQuestions.map((question) => ({
    ...question,
    blocking:
      question.escalation === 'must-ask' ||
      question.escalation === 'forbidden-without-approval',
    status: 'open',
  })),
});

const buildTaskRecommendations = ({
  workspaceRoot,
  taskIdentity,
  taskId,
  now,
  plan,
  questions,
  selectedActions,
}: {
  workspaceRoot: string;
  taskIdentity: SkoposTaskArtifact['taskIdentity'];
  taskId: string;
  now: string;
  plan: SkoposPlanResult;
  questions: SkoposTaskQuestionArtifact;
  selectedActions: SkoposTaskArtifact['selectedActions'];
}): SkoposTaskRecommendationArtifact => ({
  schemaVersion: 1,
  id: `${taskId}.recommendations`,
  type: 'task-recommendations',
  status: 'generated',
  authority: 'generated',
  generatedAt: now,
  updatedAt: now,
  workspaceRoot,
  taskIdentity,
  taskId,
  entries: [
    ...questions.entries.map((question) => ({
      id: `resolve-${question.id}`,
      title: `Resolve: ${question.question}`,
      summary: question.whyItMatters,
      priority: question.blocking ? 'high' as const : 'medium' as const,
      actionKind: 'resolve-question' as const,
      linkedQuestionId: question.id,
      blocking: question.blocking,
      status: 'open' as const,
    })),
    ...selectedActions.map((action) => ({
      id: `run-${action.id}`,
      title: action.title,
      summary: action.reason,
      priority: 'medium' as const,
      actionKind: 'run-action' as const,
      actionId: action.id,
      blocking: false,
      status: 'open' as const,
    })),
  ],
});
