import { stat, unlink } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

import type {
  SkoposStartRunResult,
  SkoposTaskCoordinationState,
  SkoposTaskDetail,
  SkoposProofSubjectKind,
  SkoposTaskRisk,
} from '@skopos/model';

import {
  claimSkoposCoordinationResource,
  ensureSkoposCoordinationSession,
  getSkoposCoordinationStatus,
  releaseSkoposCoordinationTask,
  reserveSkoposCoordinationTask,
} from '../coordination/coordination.service.js';
import { prepareSkoposPlanRuntime } from '../plan/plan.service.js';
import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { buildSkoposProjectKnowledgeGuidance } from '../shared/memory-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import {
  prepareSkoposTaskRuntime,
  publishSkoposTaskAuthorityRuntime,
  writeSkoposTaskAuxiliaryArtifactsRuntime,
} from '../task/task.service.js';

export interface BuildSkoposStartRuntimeOptions {
  cwd: string;
  goal: string;
  scope?: string;
  actor?: string;
  dryRun?: boolean;
  acceptanceCriteria?: string[];
  nonGoals?: string[];
  constraints?: string[];
  ownedPaths?: string[];
  risk?: SkoposTaskRisk;
  detail?: SkoposTaskDetail;
  priority?: number;
  dependencyTaskIds?: string[];
  sessionId?: string;
  host?: string;
  leaseSeconds?: number;
  proofSubjectKind?: SkoposProofSubjectKind;
}

export const buildSkoposStartRuntime = async ({
  cwd,
  goal,
  scope,
  actor,
  dryRun = false,
  acceptanceCriteria = [],
  nonGoals = [],
  constraints = [],
  ownedPaths = [],
  risk,
  detail,
  priority,
  dependencyTaskIds,
  sessionId,
  host = 'manual-cli',
  leaseSeconds,
  proofSubjectKind,
}: BuildSkoposStartRuntimeOptions): Promise<SkoposStartRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (sessionId && !actorId) {
    throw new Error(
      'Coordination-aware Task start requires an explicit actor through --actor or SKOPOS_ACTOR.',
    );
  }

  const plan = await prepareSkoposPlanRuntime({
    cwd: workspaceRoot,
    goal,
    scope,
  });
  const created = await prepareSkoposTaskRuntime({
    cwd: workspaceRoot,
    plan,
    actor: actorId,
    acceptanceCriteria,
    nonGoals,
    constraints,
    ownedPaths,
    risk,
    detail,
    priority,
    dependencyTaskIds,
    proofSubjectKind,
    dryRun,
  });
  let coordination: SkoposTaskCoordinationState | undefined;
  if (!dryRun) {
    await writeSkoposTaskAuxiliaryArtifactsRuntime({ prepared: created });
    try {
      if (sessionId && actorId) {
        coordination = await coordinateStartedTask({
          workspaceRoot,
          actorId,
          host,
          sessionId,
          leaseSeconds,
          taskId: created.task.id,
          ownedPaths,
        });
      }
      await publishSkoposTaskAuthorityRuntime({ prepared: created });
    } catch (error) {
      if (coordination && sessionId) {
        await releaseSkoposCoordinationTask({
          cwd: workspaceRoot,
          sessionId,
          taskId: created.task.id,
          reason: 'Task authority publication failed.',
        }).catch(() => undefined);
      }
      await Promise.all([
        unlink(created.questionsPath).catch(() => undefined),
        unlink(created.recommendationsPath).catch(() => undefined),
        ...(created.task.trackedDocumentPath
          ? [unlink(resolve(workspaceRoot, created.task.trackedDocumentPath)).catch(() => undefined)]
          : []),
      ]);
      throw error;
    }
  }

  const blockingQuestions = created.questions.entries.filter(
    (question) => question.blocking && question.status === 'open',
  );
  const codeAllowed = blockingQuestions.length === 0;
  const recommendedAction = created.recommendations.entries.find(
    (recommendation) => recommendation.status === 'open',
  );
  const summary = codeAllowed
    ? `Started Task ${created.task.id}; implementation is admitted.`
    : `Started blocked Task ${created.task.id} with ${blockingQuestions.length} decision${blockingQuestions.length === 1 ? '' : 's'} requiring user input.`;
  const projectKnowledge = await buildSkoposProjectKnowledgeGuidance({
    workspaceRoot,
    dryRun,
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'start',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [
      created.taskPath,
      created.questionsPath,
      created.recommendationsPath,
      ...(created.task.trackedDocumentPath
        ? [resolve(workspaceRoot, created.task.trackedDocumentPath)]
        : []),
      projectKnowledge.memoryPath,
      projectKnowledge.communicationBriefPath,
    ],
    metadata: {
      goal: created.task.goal,
      scopeId: created.task.scope.scope.id,
      actorId: actorId ?? null,
      taskId: created.task.id,
      risk: created.task.risk,
      detail: created.task.detail,
      codeAllowed,
      blockingQuestionCount: blockingQuestions.length,
      coordinationSessionId: coordination?.session.sessionId ?? null,
      coordinationClaimCount: coordination?.claims.length ?? 0,
    },
    dryRun,
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    goal: created.task.goal,
    summary,
    actorId,
    scope: created.task.scope,
    codeAllowed,
    taskPath: created.taskPath,
    taskWrite: created.taskWrite,
    task: created.task,
    coordination,
    questionsPath: created.questionsPath,
    questionsWrite: created.questionsWrite,
    questions: created.questions,
    recommendationsPath: created.recommendationsPath,
    recommendationsWrite: created.recommendationsWrite,
    recommendations: created.recommendations,
    projectKnowledge,
    blockingQuestions,
    recommendedAction,
  };
};

const coordinateStartedTask = async ({
  workspaceRoot,
  actorId,
  host,
  sessionId,
  leaseSeconds,
  taskId,
  ownedPaths,
}: {
  workspaceRoot: string;
  actorId: string;
  host: string;
  sessionId: string;
  leaseSeconds?: number;
  taskId: string;
  ownedPaths: string[];
}): Promise<SkoposTaskCoordinationState> => {
  const ensured = await ensureSkoposCoordinationSession({
    cwd: workspaceRoot,
    actorId,
    host,
    sessionId,
    leaseSeconds,
  });
  let reserved = false;
  try {
    await reserveSkoposCoordinationTask({
      cwd: workspaceRoot,
      sessionId,
      taskId,
    });
    reserved = true;
    for (const ownedPath of ownedPaths) {
      const resource = await resolveOwnedPathClaim(workspaceRoot, ownedPath);
      await claimSkoposCoordinationResource({
        cwd: workspaceRoot,
        sessionId,
        taskId,
        resourceKind: resource.kind,
        resourceKey: resource.key,
      });
    }
    const status = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
    return {
      enforcementLevel: ensured.enforcementLevel,
      preventiveSafety: ensured.preventiveSafety,
      session: status.sessions.find((candidate) => candidate.sessionId === sessionId)!,
      reservation: status.reservations.find((candidate) => candidate.taskId === taskId),
      claims: status.claims.filter((claim) => claim.taskId === taskId),
    };
  } catch (error) {
    if (reserved) {
      await releaseSkoposCoordinationTask({
        cwd: workspaceRoot,
        sessionId,
        taskId,
        reason: 'Task start admission failed before coordination completed.',
      });
    }
    throw error;
  }
};

const resolveOwnedPathClaim = async (
  workspaceRoot: string,
  ownedPath: string,
): Promise<{ kind: 'exact-path' | 'path-pattern'; key: string }> => {
  const projectPath = relative(workspaceRoot, resolve(workspaceRoot, ownedPath))
    .replaceAll('\\', '/');
  if (
    projectPath === '..' ||
    projectPath.startsWith('../') ||
    projectPath.startsWith('/')
  ) {
    throw new Error(`Owned path must stay inside the workspace: ${ownedPath}.`);
  }
  if (/[*?]/.test(ownedPath)) {
    return { kind: 'path-pattern', key: ownedPath.replaceAll('\\', '/') };
  }
  try {
    const info = await stat(resolve(workspaceRoot, ownedPath));
    if (info.isDirectory()) {
      return {
        kind: 'path-pattern',
        key: projectPath === '' ? '**' : `${projectPath.replace(/\/+$/, '')}/**`,
      };
    }
  } catch {
    return { kind: 'exact-path', key: projectPath };
  }
  return { kind: 'exact-path', key: projectPath };
};
