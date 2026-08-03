import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { buildSkoposDocumentCatalog } from '@skopos/indexer';
import type {
  SkoposDocumentKnowledgeEntry,
  SkoposPlanResult,
  SkoposTaskArtifact,
  SkoposTaskContractDeclaration,
  SkoposTaskDetail,
  SkoposTaskMemoryObligation,
  SkoposTaskRisk,
  SkoposTaskRunResult,
  SkoposTaskQuestionArtifact,
  SkoposTaskRecommendationArtifact,
  SkoposTaskStep,
} from '@skopos/model';
import {
  buildSkoposImpactReport,
  buildSkoposTaskIdentity,
  captureSkoposTaskChangeScope,
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
  dryRun = false,
}: CreateSkoposTaskRuntimeOptions): Promise<SkoposTaskRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const now = new Date().toISOString();
  const taskId = `T-${randomUUID().replaceAll('-', '').slice(0, 8)}`;
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
  const resolvedRisk = risk ?? inferTaskRisk(plan);
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
  const resolvedDetail = detail ?? inferTaskDetail(resolvedRisk);
  const memoryObligations = await inferSkoposTaskMemoryObligationsRuntime({
    cwd: workspaceRoot,
    plan,
    risk: resolvedRisk,
    ownedPaths,
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
    childTasks: [],
    state: taskState,
    detail: resolvedDetail,
    title: plan.title,
    goal: plan.goal,
    scope: plan.scope,
    contract,
    risk: resolvedRisk,
    priority: normalizeTaskPriority(priority),
    dependencyTaskIds: [...new Set(dependencyTaskIds.map((id) => id.trim()).filter(Boolean))],
    changeScope: await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: ownedPaths,
      capturedAt: now,
    }),
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
        document.lifecycle === 'active' &&
        /(?:^|\/)work\/tasks\/T-[a-z0-9]+.*\.md$/iu.test(document.path),
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
      trackedDocumentPath: relative(workspaceRoot, documentPath),
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
        state: task.state === 'active' ? 'ready' : task.state,
        coordination: {
          lastUpdatedBy: actorId,
          lastUpdatedAt: now,
        },
      };
    },
  });

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

const inferTaskRisk = (plan: SkoposPlanResult): SkoposTaskRisk => {
  const searchable = `${plan.goal} ${plan.risks.join(' ')}`.toLowerCase();
  if (
    ['architecture', 'migration', 'security', 'public api', 'release', 'multi-package'].some(
      (signal) => searchable.includes(signal),
    )
  ) {
    return 'high-impact';
  }
  return plan.implementationSteps.length <= 3 ? 'light' : 'standard';
};

const inferTaskDetail = (risk: SkoposTaskRisk): SkoposTaskDetail =>
  risk === 'high-impact' ? 'detailed' : risk;

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
  plan,
  risk,
  ownedPaths,
}: {
  cwd: string;
  plan: SkoposPlanResult;
  risk: SkoposTaskRisk;
  ownedPaths: string[];
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
    const scopeMemoryRoot = normalizeProjectPath(plan.scope.scope.memoryRoot ?? 'docs');
    const scopeDocument = eligibleDocuments
      .filter(
        (document) =>
          document.metadata?.scope === plan.scope.scope.id ||
          isPathInside(document.path, scopeMemoryRoot),
      )
      .sort(compareMemoryCandidates)[0];
    obligations.push({
      id: scopeDocument
        ? buildMemoryObligationId(scopeDocument.role, scopeDocument.path)
        : `memory-architecture-${shortDigest(plan.scope.scope.id)}`,
      role: scopeDocument && MEMORY_ROLES.has(scopeDocument.role)
        ? scopeDocument.role
        : 'architecture',
      reason: scopeDocument
        ? `High-impact work must review and synchronize the existing ${scopeDocument.role} Memory for Scope ${plan.scope.scope.id}.`
        : `High-impact work must review and synchronize durable Memory for Scope ${plan.scope.scope.id}.`,
      status: 'open',
      targetPath: scopeDocument?.path,
    });
  }

  return obligations.sort((left, right) => left.id.localeCompare(right.id));
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
  const activePath = join(
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
  return withSkoposTaskMutationTransaction(
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
    '## Owned Paths',
    '',
    ...asBulletList(task.changeScope.declaredOwnedPaths.map((path) => `\`${path}\``), 'None declared.'),
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
  let memoryWorkRoot = dirname(dirname(trackedDocumentPath));
  while (basename(memoryWorkRoot) === 'archive') {
    memoryWorkRoot = dirname(memoryWorkRoot);
  }
  return join(memoryWorkRoot, 'archive', 'tasks', basename(trackedDocumentPath));
};

export const resolveSkoposTrackedTaskProjectionPaths = (
  trackedDocumentPath?: string,
): string[] => {
  if (!trackedDocumentPath) return [];
  const archivedPath = archiveTrackedTaskDocumentPath(trackedDocumentPath);
  const taskDirectory = dirname(trackedDocumentPath);
  const archiveDirectory = dirname(taskDirectory);
  const activePath =
    basename(taskDirectory) === 'tasks' && basename(archiveDirectory) === 'archive'
      ? join(dirname(archiveDirectory), 'tasks', basename(trackedDocumentPath))
      : trackedDocumentPath;
  return [...new Set([activePath, archivedPath, trackedDocumentPath])];
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
