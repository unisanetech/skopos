import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

import {
  buildSkoposDocumentCatalog,
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
} from '@skopos/indexer';
import type {
  SkoposActionRequirement,
  SkoposActionRequirementEvidence,
  SkoposActionRunArtifact,
  SkoposReadinessArtifact,
  SkoposReadinessTarget,
  SkoposObservationEvidenceArtifact,
  SkoposTaskActionEvidenceLink,
  SkoposVerificationArtifact,
  SkoposVerificationPhase,
  SkoposProjectReadinessArtifact,
} from '@skopos/model';
import {
  buildSkoposImpactReport,
  captureSkoposTaskPathStates,
  digestSkoposTaskPathStates,
  resolveSkoposTaskChangedPaths,
  validateSkoposEvidence,
} from '@skopos/verification';

import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  applySkoposTaskReadinessStateRuntime,
  showSkoposTaskRuntime,
} from '../task/task.service.js';
import { resolveSkoposTaskDirectory } from '../task/task-paths.js';
import {
  buildSkoposWorkQueueRuntime,
  WORK_QUEUE_ARTIFACT_PATH,
} from '../work-queue/work-queue.service.js';
import { loadSkoposQueryState } from '@skopos/query';
import { auditSkoposCoordinationTask } from '../coordination/coordination.service.js';

export const verifySkoposTaskRuntime = async ({
  cwd,
  taskId,
  phase = 'closure',
  dryRun = false,
}: {
  cwd: string;
  taskId: string;
  phase?: SkoposVerificationPhase;
  dryRun?: boolean;
}): Promise<SkoposVerificationArtifact> => {
  const workspaceRoot = resolve(cwd);
  const task = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  const taskChanges = await resolveSkoposTaskChangedPaths({
    workspaceRoot,
    changeScope: task.changeScope,
  });
  const evidenceChangedPaths = excludeTrackedTaskDocument(
    taskChanges.changedPaths,
    task.trackedDocumentPath,
  );
  const impact = await buildSkoposImpactReport({
    cwd: workspaceRoot,
    changedPaths: evidenceChangedPaths,
    phase,
    risk: task.risk,
  });
  impact.ignoredPreExistingPaths = taskChanges.ignoredPreExistingPaths;
  const requiredActions = dedupeActions(impact.requiredActions);
  const requiredActionIds = new Set(requiredActions.map((action) => action.id));
  const [manifests, runs, observations, actionLinks, memoryCatalog] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadActionRuns(workspaceRoot),
    loadObservationEvidence(workspaceRoot, task.taskIdentity),
    loadTaskActionEvidenceLinks(workspaceRoot, task.taskIdentity),
    buildSkoposDocumentCatalog({ cwd: workspaceRoot }),
  ]);
  const manifestIds = new Set(manifests.map((manifest) => manifest.id));
  const taskRuns = selectTaskLinkedActionRuns(runs, actionLinks);
  const actionEvidence = await Promise.all(
    requiredActions.map((requirement) =>
      evaluateActionEvidence({
        workspaceRoot,
        requirement,
        manifests,
        runs: taskRuns,
        ignoredSourcePaths: task.trackedDocumentPath
          ? [task.trackedDocumentPath]
          : [],
      }),
    ),
  );
  const validActionIds = new Set(
    actionEvidence.filter((entry) => entry.status === 'pass').map((entry) => entry.id),
  );
  const currentPathStates = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: impact.changedPaths,
  });
  const currentSourceStateDigest = digestSkoposTaskPathStates(currentPathStates);
  const validObservations = observations.filter(
    (observation) =>
      digestSkoposTaskPathStates(
        observation.sourcePathStates.filter(
          (entry) => entry.path !== task.trackedDocumentPath,
        ),
      ) === currentSourceStateDigest,
  );
  const acceptanceCoverage = task.evidenceRequirements
    .filter((requirement) => requirement.phase === phase)
    .map((requirement) => {
      const applicableActionIds = selectApplicableAcceptanceActionIds(
        requirement.actionIds,
        requiredActionIds,
      );
      const actionsCovered = applicableActionIds.every((id) => validActionIds.has(id));
      const linkedObservation = validObservations.find(
        (observation) =>
          observation.requirementId === requirement.id ||
          requirement.guardIds.some((id) => observation.guardIds.includes(id)),
      );
      const guardsCovered = requirement.guardIds.every((id) => {
        const matched = impact.matchedGuards.find((guard) => guard.id === id);
        return Boolean(
          matched &&
            (matched.evidence === 'source-bound-action' ||
              linkedObservation?.guardIds.includes(id)),
        );
      });
      const covered =
        requirement.evidence === 'agent-observation'
          ? Boolean(linkedObservation) && guardsCovered
          : actionsCovered &&
            guardsCovered &&
            applicableActionIds.length + requirement.guardIds.length > 0;
      return {
        requirementId: requirement.id,
        acceptanceCriterion: requirement.acceptanceCriterion,
        status: covered ? 'covered' as const : 'missing' as const,
        actionIds: applicableActionIds,
        guardIds: requirement.guardIds,
        summary: covered
          ? 'Acceptance criterion is linked to valid source-bound Evidence.'
          : 'Acceptance criterion lacks valid linked Evidence.',
      };
    });
  const blockers = [
    ...memoryCatalog.issues.map(
      (issue) => `Project Memory ${issue.path}: ${issue.summary}`,
    ),
    ...impact.matchedGuards
      .filter((guard) => guard.strength === 'prohibited')
      .map(
        (guard) =>
          `Guard ${guard.id} prohibits changes to ${guard.matchedPaths.join(', ')}.`,
      ),
    ...impact.matchedGuards
      .filter((guard) => guard.strength === 'required')
      .flatMap((guard) =>
        guard.requiredActionIds
          .filter((actionId) => !manifestIds.has(actionId))
          .map(
            (actionId) =>
              `Guard ${guard.id} requires missing Action provider ${actionId}.`,
          ),
      ),
    ...actionEvidence
      .filter((entry) => entry.status === 'fail')
      .map((entry) => entry.summary),
    ...impact.matchedGuards
      .filter(
        (guard) =>
          guard.strength === 'required' &&
          guard.evidence === 'agent-observation' &&
          guard.requiredActionIds.length === 0 &&
          !validObservations.some((observation) => observation.guardIds.includes(guard.id)),
      )
      .map((guard) => `Guard ${guard.id} requires recorded observation Evidence.`),
    ...acceptanceCoverage
      .filter((coverage) => coverage.status === 'missing')
      .map((coverage) => `Acceptance ${coverage.requirementId}: ${coverage.summary}`),
  ];
  const now = new Date().toISOString();
  const artifact: SkoposVerificationArtifact = {
    schemaVersion: 1,
    id: `${task.id}.verification.${phase}`,
    type: 'verification',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary:
      blockers.length === 0
        ? `Task ${task.id} passed ${phase} verification.`
        : `Task ${task.id} has ${blockers.length} ${phase} verification blocker${blockers.length === 1 ? '' : 's'}.`,
    workspaceRoot,
    taskId: task.id,
    phase,
    risk: task.risk,
    changedPaths: impact.changedPaths,
    ignoredPreExistingPaths: impact.ignoredPreExistingPaths ?? [],
    matchedGuards: impact.matchedGuards,
    actionEvidence,
    acceptanceCoverage,
    verificationStatus: blockers.length === 0 ? 'pass' : 'fail',
    blockers,
  };
  await writeJsonArtifact({
    artifactPath: verificationPath(workspaceRoot, task.taskIdentity, phase),
    artifact,
    dryRun,
  });
  return artifact;
};

export const selectApplicableAcceptanceActionIds = (
  declaredActionIds: string[],
  requiredActionIds: ReadonlySet<string>,
): string[] =>
  [...new Set(declaredActionIds)]
    .filter((actionId) => requiredActionIds.has(actionId))
    .sort((left, right) => left.localeCompare(right));

export const excludeTrackedTaskDocument = (
  changedPaths: string[],
  trackedDocumentPath?: string,
): string[] =>
  trackedDocumentPath
    ? changedPaths.filter((path) => path !== trackedDocumentPath)
    : [...changedPaths];

export const recordSkoposObservationEvidenceRuntime = async ({
  cwd,
  taskId,
  requirementId,
  guardIds = [],
  statement,
  actor,
  dryRun = false,
}: {
  cwd: string;
  taskId: string;
  requirementId?: string;
  guardIds?: string[];
  statement: string;
  actor?: string;
  dryRun?: boolean;
}): Promise<SkoposObservationEvidenceArtifact> => {
  const workspaceRoot = resolve(cwd);
  const task = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  const actorId = actor?.trim() || process.env.SKOPOS_ACTOR?.trim();
  if (!actorId) {
    throw new Error('Observation Evidence requires --actor <id> or SKOPOS_ACTOR.');
  }
  const normalizedStatement = statement.trim();
  if (!normalizedStatement) {
    throw new Error('Observation Evidence requires a non-empty statement.');
  }
  if (!requirementId && guardIds.length === 0) {
    throw new Error('Observation Evidence must cover an acceptance requirement or Guard.');
  }
  if (
    requirementId &&
    !task.evidenceRequirements.some((requirement) => requirement.id === requirementId)
  ) {
    throw new Error(`Task ${task.id} has no Evidence requirement ${requirementId}.`);
  }
  if (guardIds.length > 0) {
    const guards = await loadSkoposGuardManifests({ cwd: workspaceRoot });
    const guardById = new Map(guards.map((guard) => [guard.id, guard]));
    for (const guardId of new Set(guardIds)) {
      const guard = guardById.get(guardId);
      if (!guard) {
        throw new Error(`Project has no registered Guard ${guardId}.`);
      }
      if (guard.requires.evidence !== 'agent-observation') {
        throw new Error(
          `Guard ${guardId} requires ${guard.requires.evidence} Evidence and cannot be satisfied by an observation.`,
        );
      }
    }
  }
  const changed = await resolveSkoposTaskChangedPaths({
    workspaceRoot,
    changeScope: task.changeScope,
  });
  const sourcePathStates = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: excludeTrackedTaskDocument(
      changed.changedPaths,
      task.trackedDocumentPath,
    ),
  });
  const observedAt = new Date().toISOString();
  const artifact: SkoposObservationEvidenceArtifact = {
    schemaVersion: 1,
    id: `${task.id}.observation.${cryptoSafeId(observedAt, requirementId ?? guardIds.join('-'))}`,
    type: 'observation-evidence',
    status: 'generated',
    authority: 'generated',
    generatedAt: observedAt,
    updatedAt: observedAt,
    summary: normalizedStatement,
    workspaceRoot,
    taskId,
    requirementId,
    guardIds: [...new Set(guardIds)].sort(),
    statement: normalizedStatement,
    observedByActorId: actorId,
    observedAt,
    sourceStateDigest: digestSkoposTaskPathStates(sourcePathStates),
    sourcePathStates,
  };
  await writeJsonArtifact({
    artifactPath: join(
      resolveSkoposTaskDirectory(workspaceRoot, task.taskIdentity),
      'evidence',
      `${artifact.id}.json`,
    ),
    artifact,
    dryRun,
  });
  return artifact;
};

export const selectTaskLinkedActionRuns = (
  runs: SkoposActionRunArtifact[],
  actionLinks: SkoposTaskActionEvidenceLink[],
): SkoposActionRunArtifact[] => {
  const linkedRunIds = new Set(actionLinks.map((link) => link.runId));
  return runs.filter((run) => linkedRunIds.has(run.id));
};

export const assessSkoposTaskReadinessRuntime = async ({
  cwd,
  taskId,
  target,
  actor,
  advance = false,
  dryRun = false,
}: {
  cwd: string;
  taskId: string;
  target: SkoposReadinessTarget;
  actor?: string;
  advance?: boolean;
  dryRun?: boolean;
}): Promise<SkoposReadinessArtifact> => {
  const workspaceRoot = resolve(cwd);
  const task = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  const phase = target === 'continue' ? 'iteration' : 'closure';
  const verification = await verifySkoposTaskRuntime({
    cwd: workspaceRoot,
    taskId,
    phase,
    dryRun,
  });
  const coordinationAudit = await auditSkoposCoordinationTask({
    cwd: workspaceRoot,
    taskId,
  });
  const snapshotBlocker =
    target === 'close' && task.risk === 'high-impact'
      ? await verifyLatestTaskSnapshot(workspaceRoot, taskId)
      : undefined;
  const stateBlocker =
    target === 'integrate' && task.state !== 'verifying'
      ? `Task must be verifying before integration Readiness; current state is ${task.state}.`
      : target === 'close' &&
          task.state !== 'ready-to-integrate' &&
          task.state !== 'complete'
        ? `Task must be ready-to-integrate before closure Readiness; current state is ${task.state}.`
        : undefined;
  const blockers = [
    ...verification.blockers,
    ...coordinationAudit.contamination.map(
      (entry) => `Coordination contamination at ${entry.path}: ${entry.reason}`,
    ),
    ...(snapshotBlocker ? [snapshotBlocker] : []),
    ...(stateBlocker ? [stateBlocker] : []),
  ];
  const now = new Date().toISOString();
  let artifact: SkoposReadinessArtifact = {
    schemaVersion: 1,
    id: `${task.id}.readiness.${target}`,
    type: 'readiness',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary:
      blockers.length === 0
        ? `Task ${task.id} is ready to ${target}.`
        : `Task ${task.id} is blocked from ${target}.`,
    workspaceRoot,
    taskId,
    target,
    readiness: blockers.length === 0 ? 'ready' : 'blocked',
    taskState: task.state,
    verificationPath: verificationPath(workspaceRoot, task.taskIdentity, phase),
    blockers,
    evidenceSummary: {
      required: verification.actionEvidence.length,
      valid: verification.actionEvidence.filter((entry) => entry.status === 'pass').length,
      missingOrStale: verification.actionEvidence.filter((entry) => entry.status === 'fail').length,
    },
  };
  await writeJsonArtifact({
    artifactPath: join(
      resolveSkoposTaskDirectory(workspaceRoot, task.taskIdentity),
      `readiness-${target}.json`,
    ),
    artifact,
    dryRun,
  });
  if (
    advance &&
    !dryRun &&
    artifact.readiness === 'ready' &&
    (target === 'integrate' || target === 'close')
  ) {
    const updatedTask = await applySkoposTaskReadinessStateRuntime({
      cwd: workspaceRoot,
      taskId,
      actor,
      target,
    });
    artifact = {
      ...artifact,
      taskState: updatedTask.state,
      summary:
        target === 'integrate'
          ? `Task ${taskId} is ready to integrate.`
          : `Task ${taskId} is complete.`,
    };
    await writeJsonArtifact({
      artifactPath: join(
        resolveSkoposTaskDirectory(workspaceRoot, task.taskIdentity),
        `readiness-${target}.json`,
      ),
      artifact,
    });
  }
  return artifact;
};

const verifyLatestTaskSnapshot = async (
  workspaceRoot: string,
  taskId: string,
): Promise<string | undefined> => {
  const directory = join(workspaceRoot, 'docs', 'work', 'tasks', 'snapshots');
  try {
    const names = (await readdir(directory))
      .filter((name) => name.startsWith(`${taskId}-S-`) && name.endsWith('.json'))
      .sort()
      .reverse();
    const latestName = names[0];
    if (!latestName) {
      return `High-impact Task ${taskId} requires an immutable Task snapshot before close Readiness.`;
    }
    const snapshot = JSON.parse(
      await readFile(join(directory, latestName), 'utf8'),
    ) as {
      digest?: string;
      paths?: Array<{ path: string; digest: string }>;
    };
    if (!snapshot.digest || !Array.isArray(snapshot.paths)) {
      return `Task snapshot ${latestName} is invalid.`;
    }
    const current = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: snapshot.paths.map((entry) => entry.path),
    });
    const digest = createHash('sha256')
      .update(current.map((state) => `${state.path}\0${state.digest}`).join('\n'))
      .digest('hex');
    return digest === snapshot.digest
      ? undefined
      : `Task snapshot ${latestName} is stale because owned path content changed.`;
  } catch {
    return `High-impact Task ${taskId} requires a readable immutable Task snapshot before close Readiness.`;
  }
};

export const assessSkoposProjectReadinessRuntime = async ({
  cwd,
  dryRun = false,
}: {
  cwd: string;
  dryRun?: boolean;
}): Promise<SkoposProjectReadinessArtifact> => {
  const workspaceRoot = resolve(cwd);
  const [workQueue, catalog, queryState] = await Promise.all([
    buildSkoposWorkQueueRuntime({ cwd: workspaceRoot, dryRun }),
    buildSkoposDocumentCatalog({ cwd: workspaceRoot }),
    loadSkoposQueryState({ cwd: workspaceRoot }),
  ]);
  const checks = [
    {
      id: 'memory-catalog',
      status: catalog.issues.length === 0 ? 'pass' as const : 'fail' as const,
      summary:
        catalog.issues.length === 0
          ? `Project Memory catalog contains ${catalog.documents.length} adopted document${catalog.documents.length === 1 ? '' : 's'}.`
          : `Project Memory catalog has ${catalog.issues.length} strict issue${catalog.issues.length === 1 ? '' : 's'}.`,
    },
    {
      id: 'work-queue',
      status: workQueue.workQueue.counts.blocked > 0 ? 'warn' as const : 'pass' as const,
      summary:
        workQueue.workQueue.counts.blocked > 0
          ? `${workQueue.workQueue.counts.blocked} Task${workQueue.workQueue.counts.blocked === 1 ? '' : 's'} blocked.`
          : 'No Task is blocked in the Work Queue.',
    },
  ];
  const blockers = catalog.issues.map(
    (issue) => `${issue.path}: ${issue.summary}`,
  );
  const warnings =
    workQueue.workQueue.counts.blocked > 0
      ? [`${workQueue.workQueue.counts.blocked} Work Queue item${workQueue.workQueue.counts.blocked === 1 ? '' : 's'} require decisions or other blockers to clear.`]
      : [];
  const now = new Date().toISOString();
  const artifact: SkoposProjectReadinessArtifact = {
    schemaVersion: 1,
    id: 'skopos.project-readiness',
    type: 'project-readiness',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary:
      blockers.length > 0
        ? `Project Readiness is blocked by ${blockers.length} Memory issue${blockers.length === 1 ? '' : 's'}.`
        : warnings.length > 0
          ? 'Project Readiness needs attention.'
          : 'Project Readiness is ready.',
    workspaceRoot,
    readiness: blockers.length > 0 ? 'blocked' : warnings.length > 0 ? 'attention' : 'ready',
    checks,
    blockers,
    warnings,
    workQueuePath: join(workspaceRoot, WORK_QUEUE_ARTIFACT_PATH),
    detected: queryState.bootstrap.detected,
  };
  await writeJsonArtifact({
    artifactPath: join(workspaceRoot, '.skopos', 'index', 'readiness.json'),
    artifact,
    dryRun,
  });
  return artifact;
};

const evaluateActionEvidence = async ({
  workspaceRoot,
  requirement,
  manifests,
  runs,
  ignoredSourcePaths,
}: {
  workspaceRoot: string;
  requirement: SkoposActionRequirement;
  manifests: Awaited<ReturnType<typeof loadSkoposActionManifests>>;
  runs: SkoposActionRunArtifact[];
  ignoredSourcePaths: string[];
}): Promise<SkoposActionRequirementEvidence> => {
  const manifest = manifests.find((candidate) => candidate.id === requirement.id);
  if (!manifest) {
    return {
      ...requirement,
      status: 'fail',
      summary: `Required Action ${requirement.id} is not registered.`,
    };
  }
  for (const run of runs.filter(
    (candidate) => candidate.actionId === requirement.id && candidate.runStatus === 'succeeded',
  )) {
    const validation = await validateSkoposEvidence({
      workspaceRoot,
      manifest,
      artifact: run,
      ignoredSourcePaths,
    });
    if (validation.status === 'valid') {
      return {
        ...requirement,
        status: 'pass',
        summary: `Action ${requirement.id} has valid source-bound Evidence.`,
        evidenceStatus: 'valid',
        evidenceExecutionKey: run.evidence?.executionKey,
        evidenceSourceDigest: run.evidence?.sourceState.digest,
        latestSuccessfulRunId: run.id,
        latestSuccessfulRunAt: run.finishedAt,
        latestSuccessfulRunByActorId: run.runByActorId,
      };
    }
  }
  return {
    ...requirement,
    status: 'fail',
    summary: `Action ${requirement.id} has no valid source-bound Evidence.`,
    evidenceStatus: 'stale',
  };
};

const loadActionRuns = async (workspaceRoot: string): Promise<SkoposActionRunArtifact[]> => {
  const root = join(workspaceRoot, '.skopos', 'runs');
  try {
    const entries = await readdir(root);
    const runs = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) =>
          JSON.parse(await readFile(join(root, entry), 'utf8')) as SkoposActionRunArtifact,
        ),
    );
    return runs.sort(
      (left, right) =>
        Date.parse(right.finishedAt ?? '') - Date.parse(left.finishedAt ?? ''),
    );
  } catch {
    return [];
  }
};

const loadObservationEvidence = async (
  workspaceRoot: string,
  taskIdentity: Parameters<typeof resolveSkoposTaskDirectory>[1],
): Promise<SkoposObservationEvidenceArtifact[]> => {
  const root = join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'evidence');
  try {
    const entries = await readdir(root);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) =>
          JSON.parse(await readFile(join(root, entry), 'utf8')) as
            | SkoposObservationEvidenceArtifact
            | SkoposTaskActionEvidenceLink,
        ),
    );
    return artifacts.filter(
      (artifact): artifact is SkoposObservationEvidenceArtifact =>
        artifact.type === 'observation-evidence',
    );
  } catch {
    return [];
  }
};

const loadTaskActionEvidenceLinks = async (
  workspaceRoot: string,
  taskIdentity: Parameters<typeof resolveSkoposTaskDirectory>[1],
): Promise<SkoposTaskActionEvidenceLink[]> => {
  const root = join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'evidence');
  try {
    const entries = await readdir(root);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) =>
          JSON.parse(await readFile(join(root, entry), 'utf8')) as
            | SkoposObservationEvidenceArtifact
            | SkoposTaskActionEvidenceLink,
        ),
    );
    return artifacts.filter(
      (artifact): artifact is SkoposTaskActionEvidenceLink =>
        artifact.type === 'task-action-evidence-link',
    );
  } catch {
    return [];
  }
};

const dedupeActions = (actions: SkoposActionRequirement[]): SkoposActionRequirement[] =>
  [...new Map(actions.map((action) => [action.id, action])).values()];

const verificationPath = (
  workspaceRoot: string,
  taskIdentity: Parameters<typeof resolveSkoposTaskDirectory>[1],
  phase: SkoposVerificationPhase,
): string =>
  join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), `verification-${phase}.json`);

const cryptoSafeId = (timestamp: string, value: string): string =>
  `${timestamp.replace(/[^0-9]/g, '').slice(0, 14)}-${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'evidence'}`;
