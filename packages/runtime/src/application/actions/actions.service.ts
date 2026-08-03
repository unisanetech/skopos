import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { mkdir, open, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';

import { loadSkoposActionManifests } from '@skopos/indexer';
import type {
  SkoposActionManifest,
  SkoposActionProgressEvent,
  SkoposActionProgressPhase,
  SkoposActionProgressSummary,
  SkoposActionRunArtifact,
  SkoposActionRunResult,
  SkoposExternalEffectReceipt,
} from '@skopos/model';
import {
  buildSkoposEvidence,
  finalizeSkoposEvidence,
  captureSkoposTaskPathStates,
  validateSkoposEvidence,
} from '@skopos/verification';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { executeSkoposShellCommand } from '../shared/execute-shell-command.js';
import { pathExists } from '../shared/path-exists.js';
import { linkSkoposActionRunToTask } from '../evidence/evidence-reuse.service.js';
import {
  resolveSkoposTrackedTaskProjectionPaths,
  showSkoposTaskRuntime,
} from '../task/task.service.js';

const execFileAsync = promisify(execFile);
const DEFAULT_ACTION_TIMEOUT_MS = 900_000;

export interface ListSkoposActionsRuntimeOptions {
  cwd: string;
}

export interface ShowSkoposActionRuntimeOptions extends ListSkoposActionsRuntimeOptions {
  action: string;
}

export interface RunSkoposActionRuntimeOptions extends ShowSkoposActionRuntimeOptions {
  dryRun?: boolean;
  approve?: boolean;
  actor?: string;
  force?: boolean;
  taskId?: string;
  onProgress?: (event: SkoposActionProgressEvent) => void;
}

export interface RecoverSkoposActionRunRuntimeOptions {
  cwd: string;
  runId: string;
  actor: string;
  reason: string;
}

export const listSkoposActionsRuntime = async ({
  cwd,
}: ListSkoposActionsRuntimeOptions): Promise<SkoposActionManifest[]> =>
  loadSkoposActionManifests({
    cwd: resolve(cwd),
  });

export const showSkoposActionRuntime = async ({
  cwd,
  action,
}: ShowSkoposActionRuntimeOptions): Promise<SkoposActionManifest> => {
  const workspaceRoot = resolve(cwd);
  const manifests = await loadSkoposActionManifests({
    cwd: workspaceRoot,
  });
  const matched = manifests.find(
    (manifest) => manifest.id === action || manifest.sourcePath === action,
  );

  if (!matched) {
    throw new Error(`Unknown Skopos Action: ${action}`);
  }

  return matched;
};

export const runSkoposActionRuntime = async ({
  cwd,
  action,
  dryRun = false,
  approve = false,
  actor,
  force = false,
  taskId,
  onProgress,
}: RunSkoposActionRuntimeOptions): Promise<SkoposActionRunResult> => {
  const workspaceRoot = resolve(cwd);
  const manifest = await showSkoposActionRuntime({
    cwd: workspaceRoot,
    action,
  });
  const timeoutMs = manifest.timeoutMs ?? DEFAULT_ACTION_TIMEOUT_MS;
  const task = taskId
    ? await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId })
    : undefined;
  const ignoredSourcePaths = resolveSkoposTrackedTaskProjectionPaths(
    task?.trackedDocumentPath,
  );

  if (!dryRun && (manifest.requiresApproval || manifest.safety === 'destructive') && !approve) {
    throw new Error(
      `Action ${manifest.id} requires explicit approval before execution. Re-run with --approve.`,
    );
  }

  const actorId =
    dryRun || manifest.safety === 'read-only'
      ? resolveActionActorId(actor)
      : requireActionActorId(actor, manifest.id);

  const runId = `run-${formatTimestamp(new Date())}-${slugify(manifest.id)}-${randomUUID().slice(0, 8)}`;
  const runPath = join(workspaceRoot, '.skopos', 'runs', `${runId}.json`);
  const artifactRoot = manifest.effects.artifacts === 'isolated'
    ? join(workspaceRoot, '.skopos', 'runs', runId, 'artifacts')
    : undefined;
  const externalReceiptPath = manifest.effects.external === 'declared'
    ? join(workspaceRoot, '.skopos', 'runs', runId, 'external-effect-receipt.json')
    : undefined;

  if (dryRun) {
    const artifact = buildActionRunArtifact({
      id: runId,
      workspaceRoot,
      manifest,
      runStatus: 'dry-run',
      exitCode: null,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      outputPaths: manifest.outputs,
      artifactRoot: artifactRoot ? relativeToWorkspace(workspaceRoot, artifactRoot) : undefined,
      runByActorId: actorId,
      taskId,
    });
    await writeRunArtifact(runPath, artifact);
    await appendSkoposOperationalLogEntry({
      workspaceRoot,
      eventKind: 'action-run',
      status: 'dry-run',
      summary: `Previewed Action ${manifest.id}.`,
      relatedArtifactPaths: [runPath, manifest.sourcePath],
      metadata: {
        actionId: manifest.id,
        actionSafety: manifest.safety,
        requiresApproval: manifest.requiresApproval,
        actorId: actorId ?? null,
      },
    });
    await refreshSkoposKnowledgeIndex({
      workspaceRoot,
    });
    return { run: artifact };
  }

  const capabilityIssues = await preflightActionCapabilities(manifest);
  if (capabilityIssues.length > 0) {
    const now = new Date().toISOString();
    const artifact = buildActionRunArtifact({
      id: runId,
      workspaceRoot,
      manifest,
      runStatus: 'unavailable',
      exitCode: null,
      startedAt: now,
      finishedAt: now,
      outputPaths: [],
      runByActorId: actorId,
      artifactRoot: artifactRoot ? relativeToWorkspace(workspaceRoot, artifactRoot) : undefined,
      capabilityIssues,
      taskId,
    });
    await writeRunArtifact(runPath, artifact);
    return { run: artifact };
  }

  const startedAt = new Date().toISOString();
  const progress = createActionProgressTracker({ startedAt, onProgress });
  progress.record('admission', 'completed', `Action ${manifest.id} admitted.`);
  progress.record('preflight', 'completed', 'Required capabilities are available.');
  const evidence = await buildSkoposEvidence({
    workspaceRoot,
    manifest,
    runId,
    actorId,
    capturedAt: startedAt,
    ignoredSourcePaths,
  });
  const existingRuns = await loadActionRunArtifacts(workspaceRoot);
  const exactRuns = existingRuns.filter(
    (artifact) => artifact.evidence?.executionKey === evidence.executionKey,
  );
  const activeRun = exactRuns.find(
    (artifact) =>
      artifact.runStatus === 'running' &&
      Date.parse(artifact.evidence?.owner.leaseExpiresAt ?? '') > Date.now(),
  );
  if (activeRun) {
    throw new Error(
      `Action ${manifest.id} already has exact execution owner ${activeRun.id} for this source state.`,
    );
  }

  if (!force && (manifest.safety === 'read-only' || manifest.outputs.length > 0)) {
    for (const existingRun of exactRuns.filter((artifact) => artifact.runStatus === 'succeeded')) {
      const validation = await validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact: existingRun,
        ignoredSourcePaths,
      });
      if (validation.status === 'valid') {
        const existingRunPath = join(
          workspaceRoot,
          '.skopos',
          'runs',
          `${existingRun.id}.json`,
        );
        await appendSkoposOperationalLogEntry({
          workspaceRoot,
          eventKind: 'action-run',
          status: 'succeeded',
          summary: `Reused source-bound Evidence ${existingRun.id} for Action ${manifest.id}.`,
          relatedArtifactPaths: [
            existingRunPath,
            manifest.sourcePath,
            ...existingRun.outputPaths,
          ],
          metadata: {
            actionId: manifest.id,
            actionSafety: manifest.safety,
            actorId: actorId ?? null,
            reusedRunId: existingRun.id,
            evidenceExecutionKey: evidence.executionKey,
          },
        });
        await refreshSkoposKnowledgeIndex({
          workspaceRoot,
        });
        const reusedRun = {
          ...existingRun,
          summary: `${manifest.id} reused source-bound Evidence ${existingRun.id}.`,
          reusedFromRunId: existingRun.id,
        };
        return linkSkoposActionRunToTask({
          workspaceRoot,
          taskId,
          actor,
          run: reusedRun,
        });
      }
    }
  }

  const releaseSchedulingLease = await acquireActionSchedulingLease({
    workspaceRoot,
    manifest,
    runId,
    actorId,
    timeoutMs,
  });
  try {
  const runningArtifact = buildActionRunArtifact({
    id: runId,
    workspaceRoot,
    manifest,
    runStatus: 'running',
    exitCode: null,
    startedAt,
    outputPaths: [],
    runByActorId: actorId,
    evidence,
    artifactRoot: artifactRoot ? relativeToWorkspace(workspaceRoot, artifactRoot) : undefined,
    taskId,
    progress: progress.snapshot(),
  });
  await writeRunArtifact(runPath, runningArtifact);

  const actionCwd = resolve(workspaceRoot, manifest.cwd);
  if (artifactRoot) await mkdir(artifactRoot, { recursive: true });
  if (externalReceiptPath) await mkdir(dirname(externalReceiptPath), { recursive: true });
  const workspaceBefore = await captureWorkspaceEffectState(workspaceRoot);
  progress.record('execution', 'running', `Executing ${manifest.command}.`);
  const execution = await executeSkoposShellCommand({
    command: manifest.command,
    cwd: actionCwd,
    timeoutMs,
    environment: {
      ...(artifactRoot ? { SKOPOS_ARTIFACT_ROOT: artifactRoot } : {}),
      ...(externalReceiptPath
        ? { SKOPOS_EXTERNAL_EFFECT_RECEIPT_PATH: externalReceiptPath }
        : {}),
    },
    onProgress: (event) => {
      if (event.kind === 'heartbeat') {
        progress.record(
          'execution',
          'running',
          `Action is still running after ${formatElapsed(event.elapsedMs)}.`,
          event.at,
          event.elapsedMs,
        );
      } else if (event.kind === 'timing-out') {
        progress.record(
          'execution',
          'running',
          `Timeout reached after ${formatElapsed(event.elapsedMs)}; stopping the command.`,
          event.at,
          event.elapsedMs,
        );
      }
    },
  });
  progress.record(
    'execution',
    execution.timedOut
      ? 'interrupted'
      : execution.exitCode === 0
        ? 'completed'
        : 'failed',
    execution.timedOut
      ? `Execution was interrupted at the ${formatElapsed(execution.timeoutMs ?? timeoutMs)} timeout.`
      : execution.exitCode === 0
        ? 'Command execution completed.'
        : `Command execution failed with exit code ${execution.exitCode}.`,
    execution.finishedAt,
  );
  progress.record('finalization', 'running', 'Finalizing effects and Evidence.');
  const workspaceEffectViolations = await detectWorkspaceEffectViolations({
    workspaceRoot,
    manifest,
    before: workspaceBefore,
  });
  const externalReceiptResult =
    execution.exitCode === 0 && manifest.effects.external === 'declared'
      ? await loadExternalEffectReceipt({
          manifest,
          receiptPath: externalReceiptPath!,
          workspaceRoot,
          startedAt,
          finishedAt: execution.finishedAt,
        })
      : undefined;
  const effectViolations = [
    ...workspaceEffectViolations,
    ...(externalReceiptResult?.violation ? [externalReceiptResult.violation] : []),
  ];
  const outputBase = artifactRoot ?? actionCwd;
  const outputPaths = (
    await Promise.all(
      manifest.outputs.map(async (outputPath) => {
        const absolutePath = resolve(outputBase, outputPath);
        return (await pathExists(absolutePath))
          ? relativeToWorkspace(workspaceRoot, absolutePath)
          : null;
      }),
    )
  ).filter((value): value is string => Boolean(value));
  const finalizedEvidence =
    execution.exitCode === 0 && effectViolations.length === 0
      ? await finalizeSkoposEvidence({
          workspaceRoot,
          manifest,
          evidence,
          ignoredSourcePaths,
        })
      : evidence;
  progress.record('finalization', 'completed', 'Action run Evidence was finalized.');
  const runStatus: SkoposActionRunArtifact['runStatus'] = execution.timedOut
    ? 'interrupted'
    : execution.exitCode === 0 && effectViolations.length === 0
      ? 'succeeded'
      : 'failed';
  const resume = execution.timedOut
    ? {
        actionId: manifest.id,
        command: buildActionResumeCommand({ manifest, taskId, actorId }),
        requiresApproval: manifest.requiresApproval || manifest.safety === 'destructive',
      }
    : undefined;
  let artifact = buildActionRunArtifact({
    id: runId,
    workspaceRoot,
    manifest,
    runStatus,
    exitCode: effectViolations.length > 0 ? 1 : execution.exitCode,
    startedAt,
    finishedAt: execution.finishedAt,
    outputPaths,
    stdoutExcerpt: execution.stdoutExcerpt,
    stderrExcerpt: execution.stderrExcerpt,
    runByActorId: actorId,
    evidence: finalizedEvidence,
    artifactRoot: artifactRoot ? relativeToWorkspace(workspaceRoot, artifactRoot) : undefined,
    effectViolations,
    taskId,
    timedOut: execution.timedOut,
    progress: progress.snapshot(resume),
    externalEffectReceipt: externalReceiptResult?.receipt,
  });

  await writeRunArtifact(runPath, artifact);
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'action-run',
    status: runStatus === 'succeeded' ? 'succeeded' : 'failed',
    summary: `Action ${manifest.id} ${runStatus === 'succeeded' ? 'completed' : runStatus}.`,
    relatedArtifactPaths: [
      runPath,
      manifest.sourcePath,
      ...outputPaths,
      ...(externalReceiptResult?.receipt
        ? [externalReceiptResult.receipt.receiptPath]
        : []),
    ],
    metadata: {
      actionId: manifest.id,
      actionSafety: manifest.safety,
      requiresApproval: manifest.requiresApproval,
      exitCode: effectViolations.length > 0 ? 1 : execution.exitCode,
      actorId: actorId ?? null,
      evidenceExecutionKey: finalizedEvidence.executionKey,
      evidenceSourceDigest: finalizedEvidence.sourceState.digest,
      timedOut: execution.timedOut,
      externalEffectReceiptPath: externalReceiptResult?.receipt?.receiptPath ?? null,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  if (execution.exitCode !== 0 || effectViolations.length > 0) {
    throw new Error(
      execution.timedOut
        ? `Action ${manifest.id} timed out after ${timeoutMs}ms. Resume with: ${resume?.command}. Run artifact: ${runPath}`
        : effectViolations.length > 0
        ? `Action ${manifest.id} violated its declared effects: ${effectViolations.join('; ')}. Run artifact: ${runPath}`
        : `Action ${manifest.id} failed with exit code ${execution.exitCode}. Run artifact: ${runPath}`,
    );
  }

  const settledEvidence = await finalizeSkoposEvidence({
    workspaceRoot,
    manifest,
    evidence: finalizedEvidence,
    ignoredSourcePaths,
  });
  artifact = {
    ...artifact,
    evidence: settledEvidence,
  };
  await writeRunArtifact(runPath, artifact);

  return linkSkoposActionRunToTask({
    workspaceRoot,
    taskId,
    actor,
    run: artifact,
  });
  } finally {
    await releaseSchedulingLease();
  }
};

export const recoverSkoposActionRunRuntime = async ({
  cwd,
  runId,
  actor,
  reason,
}: RecoverSkoposActionRunRuntimeOptions): Promise<SkoposActionRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = actor.trim();
  const recoveryReason = reason.trim();
  if (!actorId) throw new Error('Action recovery requires --actor <id>.');
  if (!recoveryReason) throw new Error('Action recovery requires --reason <text>.');
  if (!/^run-[a-zA-Z0-9-]+$/.test(runId)) {
    throw new Error(`Invalid Action run id: ${runId}`);
  }
  const runPath = join(workspaceRoot, '.skopos', 'runs', `${runId}.json`);
  let run: SkoposActionRunArtifact;
  try {
    run = JSON.parse(await readFile(runPath, 'utf8')) as SkoposActionRunArtifact;
  } catch {
    throw new Error(`Unknown Action run: ${runId}`);
  }
  if (run.type !== 'action-run' || run.id !== runId) {
    throw new Error(`Action run identity mismatch at ${runPath}`);
  }
  if (run.runStatus !== 'running') {
    throw new Error(`Action run ${runId} is ${run.runStatus} and cannot be recovered.`);
  }
  const leaseExpiresAt = run.evidence?.owner.leaseExpiresAt;
  if (!leaseExpiresAt || Date.parse(leaseExpiresAt) > Date.now()) {
    throw new Error(
      `Action run ${runId} still has an active execution lease until ${leaseExpiresAt ?? 'an unknown time'}.`,
    );
  }
  const recoveredAt = new Date().toISOString();
  const recoveryEvent: SkoposActionProgressEvent = {
    phase: 'execution',
    status: 'interrupted',
    at: recoveredAt,
    elapsedMs: Math.max(0, Date.parse(recoveredAt) - Date.parse(run.startedAt ?? recoveredAt)),
    message: `Expired Action execution was recovered by ${actorId}.`,
  };
  const priorProgress = run.progress;
  const events = [...(priorProgress?.events ?? []), recoveryEvent].slice(-MAX_PROGRESS_EVENTS);
  const resume = {
    actionId: run.actionId,
    command: [
      'skopos actions run',
      run.actionId,
      '.',
      ...(run.taskId ? ['--task', run.taskId] : []),
      '--actor',
      actorId,
      '--json',
    ].join(' '),
    requiresApproval: run.actionSafety === 'destructive',
  };
  run = {
    ...run,
    summary: `${run.actionId} interrupted after expired execution recovery.`,
    updatedAt: recoveredAt,
    finishedAt: recoveredAt,
    runStatus: 'interrupted',
    exitCode: null,
    progress: {
      eventCount: (priorProgress?.eventCount ?? 0) + 1,
      events,
      completedPhases: priorProgress?.completedPhases ?? ['admission', 'preflight'],
      failedPhases: priorProgress?.failedPhases ?? [],
      interruptedPhases: ['execution'],
      remainingPhases: ['execution', 'finalization'],
      resume,
    },
    recovery: {
      recoveredAt,
      recoveredByActorId: actorId,
      reason: recoveryReason,
      priorLeaseExpiresAt: leaseExpiresAt,
    },
  };
  await writeRunArtifact(runPath, run);
  await unlink(join(workspaceRoot, '.skopos', 'locks', 'actions', `${runId}.json`)).catch(
    (error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    },
  );
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'action-run',
    status: 'failed',
    summary: `Recovered expired Action run ${runId} as interrupted.`,
    relatedArtifactPaths: [runPath, run.sourcePath],
    metadata: {
      actionId: run.actionId,
      actorId,
      reason: recoveryReason,
      priorLeaseExpiresAt: leaseExpiresAt,
    },
  });
  await refreshSkoposKnowledgeIndex({ workspaceRoot });
  return { run };
};

interface BuildActionRunArtifactInput {
  id: string;
  workspaceRoot: string;
  manifest: SkoposActionManifest;
  runStatus: SkoposActionRunArtifact['runStatus'];
  exitCode: number | null;
  startedAt?: string;
  finishedAt?: string;
  outputPaths: string[];
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
  runByActorId?: string;
  evidence?: SkoposActionRunArtifact['evidence'];
  artifactRoot?: string;
  capabilityIssues?: string[];
  effectViolations?: string[];
  taskId?: string;
  timedOut?: boolean;
  progress?: SkoposActionProgressSummary;
  externalEffectReceipt?: SkoposExternalEffectReceipt;
}

const buildActionRunArtifact = ({
  id,
  workspaceRoot,
  manifest,
  runStatus,
  exitCode,
  startedAt,
  finishedAt,
  outputPaths,
  stdoutExcerpt,
  stderrExcerpt,
  runByActorId,
  evidence,
  artifactRoot,
  capabilityIssues,
  effectViolations,
  taskId,
  timedOut,
  progress,
  externalEffectReceipt,
}: BuildActionRunArtifactInput): SkoposActionRunArtifact => ({
  schemaVersion: 1,
  id,
  type: 'action-run',
  status: 'generated',
  authority: 'generated',
  summary: `${manifest.id} ${runStatus}.`,
  updatedAt: finishedAt ?? startedAt,
  generatedAt: finishedAt ?? startedAt,
  workspaceRoot,
  actionId: manifest.id,
  actionTitle: manifest.title,
  actionCategory: manifest.category,
  actionSafety: manifest.safety,
  runByActorId,
  sourcePath: manifest.sourcePath,
  command: manifest.command,
  cwd: manifest.cwd,
  taskId,
  runStatus,
  exitCode,
  timeoutMs: manifest.timeoutMs ?? DEFAULT_ACTION_TIMEOUT_MS,
  timedOut,
  startedAt,
  finishedAt,
  outputPaths,
  artifactRoot,
  capabilityIssues,
  effectViolations,
  progress,
  externalEffectReceipt,
  evidence,
  stdoutExcerpt,
  stderrExcerpt,
});

const loadExternalEffectReceipt = async ({
  manifest,
  receiptPath,
  workspaceRoot,
  startedAt,
  finishedAt,
}: {
  manifest: SkoposActionManifest;
  receiptPath: string;
  workspaceRoot: string;
  startedAt: string;
  finishedAt: string;
}): Promise<{ receipt?: SkoposExternalEffectReceipt; violation?: string }> => {
  let value: unknown;
  try {
    value = JSON.parse(await readFile(receiptPath, 'utf8'));
  } catch {
    return {
      violation: `declared external mutation did not produce provider receipt at ${relativeToWorkspace(workspaceRoot, receiptPath)}`,
    };
  }
  if (!value || typeof value !== 'object') {
    return { violation: 'external effect provider receipt must be a JSON object' };
  }
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== 1) {
    return { violation: 'external effect provider receipt requires schemaVersion 1' };
  }
  if (
    typeof candidate.service !== 'string' ||
    !manifest.capabilities.services.includes(candidate.service)
  ) {
    return {
      violation: 'external effect provider receipt service is not declared by the Action',
    };
  }
  if (typeof candidate.operation !== 'string' || candidate.operation.trim().length === 0) {
    return { violation: 'external effect provider receipt operation is missing' };
  }
  if (candidate.status !== 'succeeded') {
    return { violation: 'external effect provider receipt status must be succeeded' };
  }
  if (
    typeof candidate.providerRequestId !== 'string' ||
    candidate.providerRequestId.trim().length === 0
  ) {
    return { violation: 'external effect provider receipt request identity is missing' };
  }
  if (typeof candidate.occurredAt !== 'string' || !Number.isFinite(Date.parse(candidate.occurredAt))) {
    return { violation: 'external effect provider receipt timestamp is invalid' };
  }
  const occurredAt = Date.parse(candidate.occurredAt);
  if (occurredAt < Date.parse(startedAt) - 5_000 || occurredAt > Date.parse(finishedAt) + 5_000) {
    return { violation: 'external effect provider receipt timestamp is outside the Action run' };
  }
  return {
    receipt: {
      schemaVersion: 1,
      service: candidate.service,
      operation: candidate.operation.trim(),
      status: 'succeeded',
      providerRequestId: candidate.providerRequestId.trim(),
      occurredAt: candidate.occurredAt,
      receiptPath: relativeToWorkspace(workspaceRoot, receiptPath),
    },
  };
};

const ACTION_PROGRESS_PHASES: SkoposActionProgressPhase[] = [
  'admission',
  'preflight',
  'execution',
  'finalization',
];
const MAX_PROGRESS_EVENTS = 12;

export const createActionProgressTracker = ({
  startedAt,
  onProgress,
}: {
  startedAt: string;
  onProgress?: (event: SkoposActionProgressEvent) => void;
}) => {
  const startedAtMs = Date.parse(startedAt);
  const events: SkoposActionProgressEvent[] = [];
  const latest = new Map<SkoposActionProgressPhase, SkoposActionProgressEvent>();
  let eventCount = 0;

  const record = (
    phase: SkoposActionProgressPhase,
    status: SkoposActionProgressEvent['status'],
    message: string,
    at = new Date().toISOString(),
    elapsedMs = Math.max(0, Date.parse(at) - startedAtMs),
  ): void => {
    const event = { phase, status, message, at, elapsedMs };
    eventCount += 1;
    events.push(event);
    latest.set(phase, event);
    if (events.length > MAX_PROGRESS_EVENTS) events.shift();
    onProgress?.(event);
  };

  const snapshot = (
    resume?: SkoposActionProgressSummary['resume'],
  ): SkoposActionProgressSummary => {
    const withStatus = (status: SkoposActionProgressEvent['status']) =>
      ACTION_PROGRESS_PHASES.filter((phase) => latest.get(phase)?.status === status);
    const completedPhases = withStatus('completed');
    const failedPhases = withStatus('failed');
    const interruptedPhases = withStatus('interrupted');
    const remainingPhases = ACTION_PROGRESS_PHASES.filter(
      (phase) => !completedPhases.includes(phase) && !failedPhases.includes(phase),
    );
    return {
      eventCount,
      events: [...events],
      completedPhases,
      failedPhases,
      interruptedPhases,
      remainingPhases,
      resume,
    };
  };

  return { record, snapshot };
};

const buildActionResumeCommand = ({
  manifest,
  taskId,
  actorId,
}: {
  manifest: SkoposActionManifest;
  taskId?: string;
  actorId?: string;
}): string => [
  'skopos actions run',
  manifest.id,
  '.',
  ...(taskId ? ['--task', taskId] : []),
  ...(actorId ? ['--actor', actorId] : []),
  '--json',
].join(' ');

const formatElapsed = (elapsedMs: number): string =>
  elapsedMs < 1000 ? `${elapsedMs}ms` : `${Math.round(elapsedMs / 1000)}s`;

const preflightActionCapabilities = async (
  manifest: SkoposActionManifest,
): Promise<string[]> => {
  const issues: string[] = [];
  for (const tool of manifest.capabilities.tools) {
    if (!/^[a-zA-Z0-9._+-]+$/.test(tool)) {
      issues.push(`Tool capability ${tool} has an invalid executable name.`);
      continue;
    }
    try {
      await execFileAsync('/usr/bin/env', ['which', tool]);
    } catch {
      issues.push(`Required tool ${tool} is unavailable.`);
    }
  }
  for (const secret of manifest.capabilities.secrets) {
    if (!process.env[secret]) issues.push(`Required secret ${secret} is unavailable.`);
  }
  if (
    manifest.capabilities.network === 'required' &&
    process.env.SKOPOS_NETWORK_AVAILABLE !== '1'
  ) {
    issues.push('Required network capability is unavailable.');
  }
  if (
    manifest.capabilities.browser === 'required' &&
    process.env.SKOPOS_BROWSER_AVAILABLE !== '1'
  ) {
    issues.push('Required browser capability is unavailable.');
  }
  for (const service of manifest.capabilities.services) {
    const key = `SKOPOS_SERVICE_${service.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_AVAILABLE`;
    if (process.env[key] !== '1') issues.push(`Required service ${service} is unavailable.`);
  }
  return issues;
};

type WorkspaceEffectState = Map<string, string>;

const captureWorkspaceEffectState = async (
  workspaceRoot: string,
): Promise<WorkspaceEffectState> => {
  let paths: string[];
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['status', '--porcelain=v1', '--untracked-files=all'],
      { cwd: workspaceRoot },
    );
    paths = stdout
      .split('\n')
      .map((line) => line.slice(3).trim())
      .filter(Boolean)
      .map((path) => path.includes(' -> ') ? path.split(' -> ')[1]! : path)
      .filter((path) => !path.startsWith('.skopos/'));
  } catch {
    return capturePortableWorkspaceEffectState(workspaceRoot);
  }
  const states = await captureSkoposTaskPathStates({ workspaceRoot, paths });
  return new Map(states.map((state) => [state.path, state.digest]));
};

const PORTABLE_SNAPSHOT_EXCLUDES = new Set(['.git', '.skopos', 'node_modules']);

const capturePortableWorkspaceEffectState = async (
  workspaceRoot: string,
): Promise<WorkspaceEffectState> => {
  const paths = await listPortableWorkspacePaths(workspaceRoot);
  const states = await captureSkoposTaskPathStates({ workspaceRoot, paths });
  return new Map(states.map((state) => [state.path, state.digest]));
};

const listPortableWorkspacePaths = async (
  workspaceRoot: string,
  current = '',
): Promise<string[]> => {
  const directory = current ? join(workspaceRoot, current) : workspaceRoot;
  const entries = await readdir(directory, { withFileTypes: true });
  const paths: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (PORTABLE_SNAPSHOT_EXCLUDES.has(entry.name)) continue;
    const path = current ? `${current}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      paths.push(...await listPortableWorkspacePaths(workspaceRoot, path));
    } else {
      paths.push(path);
    }
  }
  return paths;
};

interface ActionSchedulingLease {
  schemaVersion: 1;
  runId: string;
  actionId: string;
  actorId?: string;
  concurrency: SkoposActionManifest['concurrency'];
  acquiredAt: string;
  expiresAt: string;
}

const acquireActionSchedulingLease = async ({
  workspaceRoot,
  manifest,
  runId,
  actorId,
  timeoutMs,
}: {
  workspaceRoot: string;
  manifest: SkoposActionManifest;
  runId: string;
  actorId?: string;
  timeoutMs: number;
}): Promise<() => Promise<void>> => {
  const leasesRoot = join(workspaceRoot, '.skopos', 'locks', 'actions');
  const mutexPath = join(leasesRoot, '.admission.lock');
  const leasePath = join(leasesRoot, `${runId}.json`);
  await mkdir(leasesRoot, { recursive: true });
  const releaseMutex = await acquireSchedulingMutex(mutexPath);
  try {
    const active = await loadActiveSchedulingLeases(leasesRoot);
    const conflicts = active.filter((lease) =>
      manifest.concurrency === 'exclusive' || lease.concurrency === 'exclusive',
    );
    if (conflicts.length > 0) {
      throw new Error(
        `Action ${manifest.id} cannot acquire ${manifest.concurrency} scheduling while ${conflicts.map((lease) => `${lease.actionId} (${lease.runId})`).join(', ')} is active.`,
      );
    }
    const now = new Date();
    const lease: ActionSchedulingLease = {
      schemaVersion: 1,
      runId,
      actionId: manifest.id,
      actorId,
      concurrency: manifest.concurrency,
      acquiredAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + timeoutMs + 10_000).toISOString(),
    };
    await writeFile(leasePath, JSON.stringify(lease, null, 2), { encoding: 'utf8', flag: 'wx' });
  } finally {
    await releaseMutex();
  }
  return async () => {
    await unlink(leasePath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error;
    });
  };
};

const acquireSchedulingMutex = async (
  mutexPath: string,
): Promise<() => Promise<void>> => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const handle = await open(mutexPath, 'wx');
      await handle.writeFile(JSON.stringify({ expiresAt: Date.now() + 1_000 }));
      return async () => {
        await handle.close();
        await unlink(mutexPath).catch((error: NodeJS.ErrnoException) => {
          if (error.code !== 'ENOENT') throw error;
        });
      };
    } catch (error) {
      const fileError = error as NodeJS.ErrnoException;
      if (fileError.code !== 'EEXIST') throw error;
      const stale = await readFile(mutexPath, 'utf8')
        .then((value) => Number((JSON.parse(value) as { expiresAt?: number }).expiresAt) <= Date.now())
        .catch(() => false);
      if (stale) {
        await unlink(mutexPath).catch(() => undefined);
        continue;
      }
      await delay(25);
    }
  }
  throw new Error('Action scheduling admission is busy; retry the Action.');
};

const loadActiveSchedulingLeases = async (
  leasesRoot: string,
): Promise<ActionSchedulingLease[]> => {
  const entries = (await readdir(leasesRoot)).filter((entry) => entry.endsWith('.json'));
  const active: ActionSchedulingLease[] = [];
  for (const entry of entries) {
    const path = join(leasesRoot, entry);
    try {
      const lease = JSON.parse(await readFile(path, 'utf8')) as ActionSchedulingLease;
      if (Date.parse(lease.expiresAt) <= Date.now()) {
        await unlink(path).catch(() => undefined);
      } else {
        active.push(lease);
      }
    } catch {
      throw new Error(`Action scheduling lease is unreadable: ${path}`);
    }
  }
  return active;
};

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

const detectWorkspaceEffectViolations = async ({
  workspaceRoot,
  manifest,
  before,
}: {
  workspaceRoot: string;
  manifest: SkoposActionManifest;
  before: WorkspaceEffectState;
}): Promise<string[]> => {
  const after = await captureWorkspaceEffectState(workspaceRoot);
  const changed = [...new Set([...before.keys(), ...after.keys()])]
    .filter((path) => before.get(path) !== after.get(path));
  if (manifest.effects.workspace === 'none') {
    return changed.map((path) => `undeclared workspace mutation at ${path}`);
  }
  return changed
    .filter((path) => !manifest.affects.some((affected) => pathIsCovered(path, affected)))
    .map((path) => `workspace mutation outside affects at ${path}`);
};

const pathIsCovered = (path: string, declared: string): boolean => {
  const root = declared.replace(/\/\*\*$/, '').replace(/\/\*$/, '').replace(/\/$/, '');
  return root === '.' || path === root || path.startsWith(`${root}/`);
};

const resolveActionActorId = (actor?: string): string | undefined => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    return undefined;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const requireActionActorId = (actor: string | undefined, actionId: string): string => {
  const actorId = resolveActionActorId(actor);
  if (!actorId) {
    throw new Error(
      `Action ${actionId} produces effects. Re-run with --actor <id> so the Evidence is attributable.`,
    );
  }

  return actorId;
};

const writeRunArtifact = async (
  runPath: string,
  artifact: SkoposActionRunArtifact,
): Promise<void> => {
  await mkdir(dirname(runPath), { recursive: true });
  await writeFile(runPath, JSON.stringify(artifact, null, 2), 'utf8');
};

const loadActionRunArtifacts = async (
  workspaceRoot: string,
): Promise<SkoposActionRunArtifact[]> => {
  const runsRoot = join(workspaceRoot, '.skopos', 'runs');

  try {
    const entries = await readdir(runsRoot);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) =>
          JSON.parse(await readFile(join(runsRoot, entry), 'utf8')) as SkoposActionRunArtifact,
        ),
    );
    return artifacts.sort((left, right) => {
      const leftTime = Date.parse(left.finishedAt ?? left.updatedAt ?? left.generatedAt ?? '');
      const rightTime = Date.parse(right.finishedAt ?? right.updatedAt ?? right.generatedAt ?? '');
      return rightTime - leftTime;
    });
  } catch {
    return [];
  }
};

const formatTimestamp = (now: Date): string =>
  now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

const relativeToWorkspace = (workspaceRoot: string, absolutePath: string): string => {
  const relativePath = relative(workspaceRoot, absolutePath);
  return relativePath.length > 0 ? relativePath : '.';
};
