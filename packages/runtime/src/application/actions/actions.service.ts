import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';

import { loadSkoposActionManifests } from '@skopos/indexer';
import type {
  SkoposActionManifest,
  SkoposActionRunArtifact,
  SkoposActionRunResult,
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
}: RunSkoposActionRuntimeOptions): Promise<SkoposActionRunResult> => {
  const workspaceRoot = resolve(cwd);
  const manifest = await showSkoposActionRuntime({
    cwd: workspaceRoot,
    action,
  });
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
    });
    await writeRunArtifact(runPath, artifact);
    return { run: artifact };
  }

  const startedAt = new Date().toISOString();
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
  });
  await writeRunArtifact(runPath, runningArtifact);

  const actionCwd = resolve(workspaceRoot, manifest.cwd);
  if (artifactRoot) await mkdir(artifactRoot, { recursive: true });
  const workspaceBefore = await captureWorkspaceEffectState(workspaceRoot);
  const execution = await executeSkoposShellCommand({
    command: manifest.command,
    cwd: actionCwd,
    environment: artifactRoot ? { SKOPOS_ARTIFACT_ROOT: artifactRoot } : {},
  });
  const effectViolations = await detectWorkspaceEffectViolations({
    workspaceRoot,
    manifest,
    before: workspaceBefore,
  });
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
  let artifact = buildActionRunArtifact({
    id: runId,
    workspaceRoot,
    manifest,
    runStatus: execution.exitCode === 0 && effectViolations.length === 0 ? 'succeeded' : 'failed',
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
  });

  await writeRunArtifact(runPath, artifact);
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'action-run',
    status: execution.exitCode === 0 && effectViolations.length === 0 ? 'succeeded' : 'failed',
    summary: `Action ${manifest.id} ${execution.exitCode === 0 && effectViolations.length === 0 ? 'completed' : 'failed'}.`,
    relatedArtifactPaths: [
      runPath,
      manifest.sourcePath,
      ...outputPaths,
    ],
    metadata: {
      actionId: manifest.id,
      actionSafety: manifest.safety,
      requiresApproval: manifest.requiresApproval,
      exitCode: effectViolations.length > 0 ? 1 : execution.exitCode,
      actorId: actorId ?? null,
      evidenceExecutionKey: finalizedEvidence.executionKey,
      evidenceSourceDigest: finalizedEvidence.sourceState.digest,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  if (execution.exitCode !== 0 || effectViolations.length > 0) {
    throw new Error(
      effectViolations.length > 0
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
  runStatus,
  exitCode,
  startedAt,
  finishedAt,
  outputPaths,
  artifactRoot,
  capabilityIssues,
  effectViolations,
  evidence,
  stdoutExcerpt,
  stderrExcerpt,
});

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
    return new Map();
  }
  const states = await captureSkoposTaskPathStates({ workspaceRoot, paths });
  return new Map(states.map((state) => [state.path, state.digest]));
};

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
