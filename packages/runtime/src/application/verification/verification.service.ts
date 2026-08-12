import { readFile, readdir } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { join, relative, resolve } from 'node:path';

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
  SkoposBrowserEvidenceArtifact,
  SkoposBrowserEvidenceCaptureKind,
  SkoposObservationEvidenceArtifact,
  SkoposTaskActionEvidenceLink,
  SkoposTaskArtifact,
  SkoposTaskPathAttribution,
  SkoposTaskPathMutationAttribution,
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
  isSkoposTrackedTaskProjectionPath,
  moveSkoposTaskToVerificationRuntime,
  resolveSkoposTrackedTaskProjectionPaths,
  showSkoposTaskRuntime,
} from '../task/task.service.js';
import { resolveSkoposTaskDirectory } from '../task/task-paths.js';
import {
  buildSkoposWorkQueueRuntime,
  WORK_QUEUE_ARTIFACT_PATH,
} from '../work-queue/work-queue.service.js';
import { loadSkoposQueryState } from '@skopos/query';
import {
  auditSkoposCoordinationTask,
  getSkoposCoordinationStatus,
} from '../coordination/coordination.service.js';

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
  const linkedChildren = await Promise.all(
    task.childTasks.map(async (reference) => {
      try {
        return {
          reference,
          task: await showSkoposTaskRuntime({
            cwd: workspaceRoot,
            taskId: reference.taskId,
          }),
        };
      } catch (error) {
        return {
          reference,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );
  const mutationAttributions = await loadTaskMutationAttributions(workspaceRoot);
  const taskChanges = await resolveSkoposTaskChangedPaths({
    workspaceRoot,
    changeScope: task.changeScope,
    currentTaskId: task.id,
    linkedChildTaskIds: task.childTasks.map((child) => child.taskId),
    mutationAttributions,
    generatedOutputPaths: task.selectedActions.flatMap((action) => action.outputPaths),
  });
  const taskProjectionPaths = resolveSkoposTrackedTaskProjectionPaths(
    task.trackedDocumentPath,
  );
  const evidenceChangedPaths = excludeTrackedTaskDocuments(
    taskChanges.changedPaths,
    taskProjectionPaths,
  );
  const impact = await buildSkoposImpactReport({
    cwd: workspaceRoot,
    changedPaths: evidenceChangedPaths,
    phase,
    risk: task.risk,
  });
  impact.ignoredPreExistingPaths = excludeTrackedTaskDocuments(
    taskChanges.ignoredPreExistingPaths,
    taskProjectionPaths,
  );
  impact.excludedOtherTaskPaths = excludeTrackedTaskDocuments(
    taskChanges.excludedOtherTaskPaths,
    taskProjectionPaths,
  );
  impact.externalUnattributedPaths = excludeTrackedTaskDocuments(
    taskChanges.externalUnattributedPaths,
    taskProjectionPaths,
  );
  impact.pathAttributions = excludeTrackedTaskProjectionAttributions(
    taskChanges.pathAttributions,
    taskProjectionPaths,
  );
  const requiredActions = dedupeActions(impact.requiredActions);
  const requiredActionIds = new Set(requiredActions.map((action) => action.id));
  const [manifests, runs, observations, browserReceipts, actionLinks, memoryCatalog] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadActionRuns(workspaceRoot),
    loadObservationEvidence(workspaceRoot, task.taskIdentity),
    loadBrowserEvidence(workspaceRoot, task.taskIdentity),
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
        ignoredSourcePaths: taskProjectionPaths,
      }),
    ),
  );
  const validActionIds = new Set(
    actionEvidence.filter((entry) => entry.status === 'pass').map((entry) => entry.id),
  );
  const observationValidity = await Promise.all(
    observations.map(async (observation) => {
      const recordedSourcePaths = observation.sourcePathStates
        .filter((entry) => !taskProjectionPaths.includes(entry.path))
        .map((entry) => entry.path);
      const currentObservationSources = await captureSkoposTaskPathStates({
        workspaceRoot,
        paths: recordedSourcePaths,
      });
      return {
        observation,
        valid:
          digestSkoposTaskPathStates(currentObservationSources) ===
          digestSkoposTaskPathStates(
            observation.sourcePathStates.filter(
              (entry) => !taskProjectionPaths.includes(entry.path),
            ),
          ),
      };
    }),
  );
  const validObservations = observationValidity
    .filter((entry) => entry.valid)
    .map((entry) => entry.observation);
  const browserReceiptValidity = await Promise.all(
    browserReceipts.map(async (receipt) => {
      const currentReceiptSources = await captureSkoposTaskPathStates({
        workspaceRoot,
        paths: receipt.sourcePathStates.map((entry) => entry.path),
      });
      return {
        receipt,
        valid: digestSkoposTaskPathStates(currentReceiptSources) === receipt.sourceStateDigest,
      };
    }),
  );
  const validBrowserReceipts = browserReceiptValidity
    .filter((entry) => entry.valid)
    .map((entry) => entry.receipt);
  const matchedGuardIds = new Set(impact.matchedGuards.map((guard) => guard.id));
  const acceptanceCoverage = task.evidenceRequirements
    .filter((requirement) => requirement.phase === phase)
    .filter((requirement) =>
      isApplicableAcceptanceRequirement(requirement.guardIds, matchedGuardIds),
    )
    .map((requirement) => {
      const mappedChildren = linkedChildren.filter((entry) =>
        (entry.reference.parentAcceptanceRequirementIds ?? []).includes(requirement.id),
      );
      const childrenCovered =
        requirement.id.startsWith('acceptance-') &&
        mappedChildren.length > 0 &&
        mappedChildren.every((entry) => entry.task?.state === 'complete');
      const applicableActionIds = selectApplicableAcceptanceActionIds(
        requirement.actionIds,
        requiredActionIds,
      );
      const actionsCovered = applicableActionIds.every((id) => validActionIds.has(id));
      const hasLinkedObservation = [...validObservations, ...validBrowserReceipts].some(
        (observation) =>
          observation.requirementId === requirement.id ||
          requirement.guardIds.some((id) => observation.guardIds.includes(id)),
      );
      const guardsCovered = requirement.guardIds.every((id) => {
        const matched = impact.matchedGuards.find((guard) => guard.id === id);
        return Boolean(
          matched &&
            (matched.evidence === 'source-bound-action' ||
              validObservations.some((observation) =>
                observation.guardIds.includes(id),
              ) || validBrowserReceipts.some((receipt) => receipt.guardIds.includes(id))),
        );
      });
      const covered = childrenCovered ||
        (requirement.evidence === 'agent-observation'
          ? hasLinkedObservation && guardsCovered
          : actionsCovered &&
            guardsCovered &&
            applicableActionIds.length + requirement.guardIds.length > 0);
      return {
        requirementId: requirement.id,
        acceptanceCriterion: requirement.acceptanceCriterion,
        status: covered ? 'covered' as const : 'missing' as const,
        actionIds: applicableActionIds,
        guardIds: requirement.guardIds,
        summary: childrenCovered
          ? `Acceptance criterion is satisfied by completed linked child Tasks: ${mappedChildren.map((entry) => entry.reference.taskId).join(', ')}.`
          : covered
            ? 'Acceptance criterion is linked to valid source-bound Evidence.'
          : 'Acceptance criterion lacks valid linked Evidence.',
      };
    });
  const blockers = [
    ...(phase === 'closure'
      ? linkedChildren.flatMap((entry) =>
          entry.error
            ? [`Linked child Task ${entry.reference.taskId} cannot be loaded: ${entry.error}`]
            : entry.task?.state !== 'complete'
              ? [`Linked child Task ${entry.reference.taskId} is ${entry.task?.state ?? entry.reference.state}; parent closure requires successful child completion.`]
              : [],
        )
      : []),
    ...(phase === 'closure'
      ? task.memoryObligations
          .filter((obligation) => obligation.status === 'open')
          .map(
            (obligation) =>
              `Memory obligation ${obligation.id} is open: ${obligation.reason}`,
          )
      : []),
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
          !validObservations.some((observation) => observation.guardIds.includes(guard.id)) &&
          !validBrowserReceipts.some((receipt) => receipt.guardIds.includes(guard.id)),
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
    proofSubject: task.proofSubject,
    changedPaths: impact.changedPaths,
    ignoredPreExistingPaths: impact.ignoredPreExistingPaths ?? [],
    excludedOtherTaskPaths: impact.excludedOtherTaskPaths ?? [],
    externalUnattributedPaths: impact.externalUnattributedPaths ?? [],
    pathAttributions: impact.pathAttributions ?? [],
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

export const isApplicableAcceptanceRequirement = (
  guardIds: string[],
  matchedGuardIds: ReadonlySet<string>,
): boolean =>
  guardIds.length === 0 ||
  guardIds.every((guardId) => matchedGuardIds.has(guardId));

export const excludeTrackedTaskDocument = (
  changedPaths: string[],
  trackedDocumentPath?: string,
): string[] =>
  excludeTrackedTaskDocuments(
    changedPaths,
    resolveSkoposTrackedTaskProjectionPaths(trackedDocumentPath),
  );

export const excludeTrackedTaskDocuments = (
  changedPaths: string[],
  trackedDocumentPaths: string[],
): string[] =>
  changedPaths.filter(
    (path) => !isSkoposTrackedTaskProjectionPath(path, trackedDocumentPaths),
  );

export const excludeTrackedTaskProjectionAttributions = (
  attributions: SkoposTaskPathAttribution[],
  trackedDocumentPaths: string[],
): SkoposTaskPathAttribution[] =>
  attributions.filter(
    ({ path }) => !isSkoposTrackedTaskProjectionPath(path, trackedDocumentPaths),
  );

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
    currentTaskId: task.id,
    linkedChildTaskIds: task.childTasks.map((child) => child.taskId),
    mutationAttributions: await loadTaskMutationAttributions(workspaceRoot),
    generatedOutputPaths: task.selectedActions.flatMap((action) => action.outputPaths),
  });
  const sourcePathStates = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: excludeTrackedTaskDocuments(
      changed.changedPaths,
      resolveSkoposTrackedTaskProjectionPaths(task.trackedDocumentPath),
    ),
  });
  const observedAt = new Date().toISOString();
  const artifact: SkoposObservationEvidenceArtifact = {
    schemaVersion: 1,
    id: `${task.id}.observation.${cryptoSafeId(observedAt, requirementId ?? guardIds.join('-'))}.${randomUUID().replaceAll('-', '').slice(0, 8)}`,
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

export const recordSkoposBrowserEvidenceRuntime = async ({
  cwd,
  taskId,
  requirementId,
  guardIds = [],
  url,
  viewport,
  conditions = [],
  interaction,
  captureKind,
  capturePath,
  measurement,
  browser,
  actor,
  dryRun = false,
}: {
  cwd: string;
  taskId: string;
  requirementId?: string;
  guardIds?: string[];
  url: string;
  viewport: { width: number; height: number; deviceScaleFactor?: number };
  conditions?: string[];
  interaction: string;
  captureKind: SkoposBrowserEvidenceCaptureKind;
  capturePath?: string;
  measurement?: string;
  browser: string;
  actor?: string;
  dryRun?: boolean;
}): Promise<SkoposBrowserEvidenceArtifact> => {
  const workspaceRoot = resolve(cwd);
  const task = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  const actorId = actor?.trim() || process.env.SKOPOS_ACTOR?.trim();
  if (!actorId) throw new Error('Browser Evidence requires --actor <id> or SKOPOS_ACTOR.');
  const normalizedUrl = validateBrowserEvidenceUrl(url);
  const normalizedInteraction = interaction.trim();
  if (!normalizedInteraction) throw new Error('Browser Evidence requires a performed interaction or inspected state.');
  const normalizedBrowser = browser.trim();
  if (!normalizedBrowser) throw new Error('Browser Evidence requires browser identity.');
  if (!Number.isInteger(viewport.width) || viewport.width <= 0 ||
      !Number.isInteger(viewport.height) || viewport.height <= 0) {
    throw new Error('Browser Evidence viewport width and height must be positive integers.');
  }
  if (viewport.deviceScaleFactor !== undefined &&
      (!Number.isFinite(viewport.deviceScaleFactor) || viewport.deviceScaleFactor <= 0)) {
    throw new Error('Browser Evidence device scale factor must be positive.');
  }
  if (!requirementId && guardIds.length === 0) {
    throw new Error('Browser Evidence must cover an acceptance requirement or Guard.');
  }
  if (requirementId &&
      !task.evidenceRequirements.some((requirement) => requirement.id === requirementId)) {
    throw new Error(`Task ${task.id} has no Evidence requirement ${requirementId}.`);
  }
  if (guardIds.length > 0) {
    const guards = await loadSkoposGuardManifests({ cwd: workspaceRoot });
    const guardById = new Map(guards.map((guard) => [guard.id, guard]));
    for (const guardId of new Set(guardIds)) {
      const guard = guardById.get(guardId);
      if (!guard) throw new Error(`Project has no registered Guard ${guardId}.`);
      if (guard.requires.evidence !== 'agent-observation') {
        throw new Error(
          `Guard ${guardId} requires ${guard.requires.evidence} Evidence and cannot be satisfied by a browser receipt.`,
        );
      }
    }
  }
  const capture = await buildBrowserEvidenceCapture({
    workspaceRoot,
    captureKind,
    capturePath,
    measurement,
  });
  const sourcePathStates = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: excludeTrackedTaskDocuments(
      task.changeScope.declaredOwnedPaths,
      resolveSkoposTrackedTaskProjectionPaths(task.trackedDocumentPath),
    ),
  });
  const observedAt = new Date().toISOString();
  const artifact: SkoposBrowserEvidenceArtifact = {
    schemaVersion: 1,
    id: `${task.id}.browser.${cryptoSafeId(observedAt, requirementId ?? guardIds.join('-'))}.${randomUUID().replaceAll('-', '').slice(0, 8)}`,
    type: 'browser-evidence',
    status: 'generated',
    authority: 'generated',
    generatedAt: observedAt,
    updatedAt: observedAt,
    summary: `${normalizedInteraction} at ${normalizedUrl} (${viewport.width}x${viewport.height}).`,
    workspaceRoot,
    taskId,
    requirementId,
    guardIds: [...new Set(guardIds)].sort(),
    url: normalizedUrl,
    viewport,
    conditions: [...new Set(conditions.map((entry) => entry.trim()).filter(Boolean))].sort(),
    interaction: normalizedInteraction,
    capture,
    browser: normalizedBrowser,
    environment: {
      platform: process.platform,
      architecture: process.arch,
      nodeVersion: process.version,
    },
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

const validateBrowserEvidenceUrl = (value: string): string => {
  const normalized = value.trim();
  if (normalized.startsWith('/')) return normalized;
  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error();
    return parsed.toString();
  } catch {
    throw new Error('Browser Evidence URL must be an http(s) URL or a route beginning with /.');
  }
};

const buildBrowserEvidenceCapture = async ({
  workspaceRoot,
  captureKind,
  capturePath,
  measurement,
}: {
  workspaceRoot: string;
  captureKind: SkoposBrowserEvidenceCaptureKind;
  capturePath?: string;
  measurement?: string;
}): Promise<SkoposBrowserEvidenceArtifact['capture']> => {
  const normalizedMeasurement = measurement?.trim();
  if (Boolean(capturePath) === Boolean(normalizedMeasurement)) {
    throw new Error('Browser Evidence requires exactly one capture path or measurement.');
  }
  if (capturePath) {
    const absolutePath = resolve(workspaceRoot, capturePath);
    const projectPath = relative(workspaceRoot, absolutePath).replaceAll('\\', '/');
    if (!projectPath || projectPath === '..' || projectPath.startsWith('../')) {
      throw new Error('Browser Evidence capture path must stay inside the workspace.');
    }
    const content = await readFile(absolutePath);
    return {
      kind: captureKind,
      path: projectPath,
      digest: createHash('sha256').update(content).digest('hex'),
    };
  }
  if (captureKind !== 'dom-measurement' && captureKind !== 'accessibility') {
    throw new Error('Inline Browser Evidence measurements require dom-measurement or accessibility capture kind.');
  }
  return {
    kind: captureKind,
    measurement: normalizedMeasurement,
    digest: createHash('sha256').update(normalizedMeasurement!).digest('hex'),
  };
};

const loadTaskMutationAttributions = async (
  workspaceRoot: string,
): Promise<SkoposTaskPathMutationAttribution[]> => {
  const status = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
  return status.mutations.flatMap((mutation) =>
    mutation.status === 'recorded' && mutation.afterDigest && mutation.completedAt
      ? [{
          path: mutation.path,
          taskId: mutation.taskId,
          digest: mutation.afterDigest,
          attributedAt: mutation.completedAt,
        }]
      : [],
  );
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
      ? await verifyLatestTaskSnapshot(workspaceRoot, task)
      : undefined;
  const unfinishedPreVerificationSteps = task.steps.filter(
    (step) =>
      step.kind !== 'verification' &&
      step.status !== 'complete' &&
      step.status !== 'skipped',
  );
  const stepBlocker =
    target === 'close' &&
    task.state === 'active' &&
    unfinishedPreVerificationSteps.length > 0
      ? `Task ${task.id} has unfinished pre-verification steps: ${unfinishedPreVerificationSteps.map((step) => step.id).join(', ')}.`
      : undefined;
  const openQuestions = task.questions.filter((question) => question.status === 'open');
  const questionBlocker =
    target === 'close' && openQuestions.length > 0
      ? `Task ${task.id} has open decision questions: ${openQuestions.map((question) => question.id).join(', ')}. Resolve each with skopos decide <question-id> <option-id> . --actor <id>.`
      : undefined;
  const closeAdvanceFromActive =
    target === 'close' && advance && task.state === 'active';
  const closeAdvanceFromVerifying =
    target === 'close' && advance && task.state === 'verifying';
  const stateBlocker =
    target === 'integrate' && task.state !== 'verifying'
      ? `Task must be verifying before integration Readiness; current state is ${task.state}.`
      : target === 'close' &&
          task.state !== 'ready-to-integrate' &&
          task.state !== 'complete' &&
          !closeAdvanceFromActive &&
          !closeAdvanceFromVerifying
        ? `Task must be ready-to-integrate before closure Readiness; current state is ${task.state}.`
        : undefined;
  const blockers = [
    ...verification.blockers,
    ...coordinationAudit.contamination.map(
      (entry) => `Coordination contamination at ${entry.path}: ${entry.reason}`,
    ),
    ...(snapshotBlocker ? [snapshotBlocker] : []),
    ...(stepBlocker ? [stepBlocker] : []),
    ...(questionBlocker ? [questionBlocker] : []),
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
    proofSubject: task.proofSubject,
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
    if (closeAdvanceFromActive) {
      await moveSkoposTaskToVerificationRuntime({
        cwd: workspaceRoot,
        taskId,
        actor,
      });
    }
    if (closeAdvanceFromActive || closeAdvanceFromVerifying) {
      await applySkoposTaskReadinessStateRuntime({
        cwd: workspaceRoot,
        taskId,
        actor,
        target: 'integrate',
      });
    }
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

export const finishSkoposTaskRuntime = async ({
  cwd,
  taskId,
  actor,
  dryRun = false,
}: {
  cwd: string;
  taskId: string;
  actor?: string;
  dryRun?: boolean;
}): Promise<SkoposReadinessArtifact> => {
  const workspaceRoot = resolve(cwd);
  const advanced = await assessSkoposTaskReadinessRuntime({
    cwd: workspaceRoot,
    taskId,
    target: 'close',
    actor,
    advance: true,
    dryRun,
  });
  if (dryRun || advanced.readiness !== 'ready') {
    return advanced;
  }
  return assessSkoposTaskReadinessRuntime({
    cwd: workspaceRoot,
    taskId,
    target: 'close',
    actor,
  });
};

const verifyLatestTaskSnapshot = async (
  workspaceRoot: string,
  task: Pick<SkoposTaskArtifact, 'id' | 'changeScope'>,
): Promise<string | undefined> => {
  const taskId = task.id;
  const directory = join(workspaceRoot, 'docs', 'work', 'tasks', 'snapshots');
  try {
    const names = (await readdir(directory)).filter(
      (name) => name.startsWith(`${taskId}-S-`) && name.endsWith('.json'),
    );
    const snapshots = await Promise.all(
      names.map(async (name) => {
        try {
          const snapshot = JSON.parse(
            await readFile(join(directory, name), 'utf8'),
          ) as {
            createdAt?: string;
            digest?: string;
            paths?: Array<{ path: string; digest: string }>;
          };
          return { name, snapshot };
        } catch {
          return { name, snapshot: {} };
        }
      }),
    );
    const latest = snapshots.sort((left, right) =>
      (right.snapshot.createdAt ?? '').localeCompare(left.snapshot.createdAt ?? '') ||
      right.name.localeCompare(left.name),
    )[0];
    if (!latest) {
      return `High-impact Task ${taskId} requires an immutable Task snapshot before close Readiness.`;
    }
    const { name: latestName, snapshot } = latest;
    if (!snapshot.digest || !Array.isArray(snapshot.paths)) {
      return `Task snapshot ${latestName} is invalid.`;
    }
    if (snapshot.paths.length === 0) {
      return `Task snapshot ${latestName} does not cover any Task-owned paths.`;
    }
    const snapshottedPaths = new Set(snapshot.paths.map((entry) => entry.path));
    const missingOwnedPaths = task.changeScope.declaredOwnedPaths.filter(
      (path) => !snapshottedPaths.has(path),
    );
    if (missingOwnedPaths.length > 0) {
      return `Task snapshot ${latestName} does not cover Task-owned paths: ${missingOwnedPaths.join(', ')}.`;
    }
    const current = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: snapshot.paths.map((entry) => entry.path),
      ignoredTaskId: taskId,
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

const loadBrowserEvidence = async (
  workspaceRoot: string,
  taskIdentity: Parameters<typeof resolveSkoposTaskDirectory>[1],
): Promise<SkoposBrowserEvidenceArtifact[]> => {
  const root = join(resolveSkoposTaskDirectory(workspaceRoot, taskIdentity), 'evidence');
  try {
    const entries = await readdir(root);
    const artifacts = await Promise.all(
      entries.filter((entry) => entry.endsWith('.json')).map(async (entry) =>
        JSON.parse(await readFile(join(root, entry), 'utf8')) as SkoposBrowserEvidenceArtifact),
    );
    return artifacts.filter(
      (artifact): artifact is SkoposBrowserEvidenceArtifact => artifact.type === 'browser-evidence',
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
