import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import { loadSkoposWorkflowManifests } from '@skopos/indexer';
import type { SkoposWorkflowManifest, SkoposWorkflowRunArtifact } from '@skopos/model';
import {
  buildSkoposWorkflowReceipt,
  finalizeSkoposWorkflowReceipt,
  validateSkoposWorkflowReceipt,
} from '@skopos/trust';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { executeSkoposShellCommand } from '../shared/execute-shell-command.js';
import { pathExists } from '../shared/path-exists.js';
import { writeSkoposReceiptProjection } from '../agent-native/artifact-lifecycle.js';

export interface ListSkoposWorkflowsRuntimeOptions {
  cwd: string;
}

export interface ShowSkoposWorkflowRuntimeOptions extends ListSkoposWorkflowsRuntimeOptions {
  workflow: string;
}

export interface RunSkoposWorkflowRuntimeOptions extends ShowSkoposWorkflowRuntimeOptions {
  dryRun?: boolean;
  approve?: boolean;
  actor?: string;
  force?: boolean;
}

export const listSkoposWorkflowsRuntime = async ({
  cwd,
}: ListSkoposWorkflowsRuntimeOptions): Promise<SkoposWorkflowManifest[]> =>
  loadSkoposWorkflowManifests({
    cwd: resolve(cwd),
  });

export const showSkoposWorkflowRuntime = async ({
  cwd,
  workflow,
}: ShowSkoposWorkflowRuntimeOptions): Promise<SkoposWorkflowManifest> => {
  const workspaceRoot = resolve(cwd);
  const manifests = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const matched = manifests.find(
    (manifest) => manifest.id === workflow || manifest.sourcePath === workflow,
  );

  if (!matched) {
    throw new Error(`Unknown Skopos workflow: ${workflow}`);
  }

  return matched;
};

export const runSkoposWorkflowRuntime = async ({
  cwd,
  workflow,
  dryRun = false,
  approve = false,
  actor,
  force = false,
}: RunSkoposWorkflowRuntimeOptions): Promise<SkoposWorkflowRunArtifact> => {
  const workspaceRoot = resolve(cwd);
  const manifest = await showSkoposWorkflowRuntime({
    cwd: workspaceRoot,
    workflow,
  });

  if (!dryRun && (manifest.requiresApproval || manifest.safety === 'destructive') && !approve) {
    throw new Error(
      `Workflow ${manifest.id} requires explicit approval before execution. Re-run with --approve.`,
    );
  }

  const actorId =
    dryRun || manifest.safety === 'read-only'
      ? resolveWorkflowActorId(actor)
      : requireWorkflowActorId(actor, manifest.id);

  const runId = `run-${formatTimestamp(new Date())}-${slugify(manifest.id)}-${randomUUID().slice(0, 8)}`;
  const runPath = join(workspaceRoot, '.skopos', 'runs', `${runId}.json`);

  if (dryRun) {
    const artifact = buildWorkflowRunArtifact({
      id: runId,
      workspaceRoot,
      manifest,
      runStatus: 'dry-run',
      exitCode: null,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      outputPaths: manifest.outputs,
      runByActorId: actorId,
    });
    await writeRunArtifact(runPath, artifact);
    await appendSkoposOperationalLogEntry({
      workspaceRoot,
      eventKind: 'workflow-run',
      status: 'dry-run',
      summary: `Previewed workflow ${manifest.id}.`,
      relatedArtifactPaths: [runPath, manifest.sourcePath],
      metadata: {
        workflowId: manifest.id,
        workflowSafety: manifest.safety,
        requiresApproval: manifest.requiresApproval,
        actorId: actorId ?? null,
      },
    });
    await refreshSkoposKnowledgeIndex({
      workspaceRoot,
    });
    return artifact;
  }

  const startedAt = new Date().toISOString();
  const receipt = await buildSkoposWorkflowReceipt({
    workspaceRoot,
    manifest,
    runId,
    actorId,
    capturedAt: startedAt,
  });
  const existingRuns = await loadWorkflowRunArtifacts(workspaceRoot);
  const exactRuns = existingRuns.filter(
    (artifact) => artifact.receipt?.executionKey === receipt.executionKey,
  );
  const activeRun = exactRuns.find(
    (artifact) =>
      artifact.runStatus === 'running' &&
      Date.parse(artifact.receipt?.owner.leaseExpiresAt ?? '') > Date.now(),
  );
  if (activeRun) {
    throw new Error(
      `Workflow ${manifest.id} already has exact execution owner ${activeRun.id} for this source state.`,
    );
  }

  if (!force && (manifest.safety === 'read-only' || manifest.outputs.length > 0)) {
    for (const existingRun of exactRuns.filter((artifact) => artifact.runStatus === 'succeeded')) {
      const validation = await validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest,
        artifact: existingRun,
      });
      if (validation.status === 'valid') {
        const existingRunPath = join(
          workspaceRoot,
          '.skopos',
          'runs',
          `${existingRun.id}.json`,
        );
        const receiptProjectionPath = await writeSkoposReceiptProjection({
          workspaceRoot,
          authorityRunPath: existingRunPath,
          artifact: existingRun,
        });
        await appendSkoposOperationalLogEntry({
          workspaceRoot,
          eventKind: 'workflow-run',
          status: 'succeeded',
          summary: `Reused source-bound workflow receipt ${existingRun.id} for ${manifest.id}.`,
          relatedArtifactPaths: [
            existingRunPath,
            ...(receiptProjectionPath ? [receiptProjectionPath] : []),
            manifest.sourcePath,
            ...existingRun.outputPaths,
          ],
          metadata: {
            workflowId: manifest.id,
            workflowSafety: manifest.safety,
            actorId: actorId ?? null,
            reusedRunId: existingRun.id,
            receiptExecutionKey: receipt.executionKey,
          },
        });
        await refreshSkoposKnowledgeIndex({
          workspaceRoot,
        });
        return {
          ...existingRun,
          summary: `${manifest.id} reused source-bound receipt ${existingRun.id}.`,
          reusedFromRunId: existingRun.id,
        };
      }
    }
  }

  const runningArtifact = buildWorkflowRunArtifact({
    id: runId,
    workspaceRoot,
    manifest,
    runStatus: 'running',
    exitCode: null,
    startedAt,
    outputPaths: [],
    runByActorId: actorId,
    receipt,
  });
  await writeRunArtifact(runPath, runningArtifact);

  const workflowCwd = resolve(workspaceRoot, manifest.cwd);
  const execution = await executeSkoposShellCommand({
    command: manifest.command,
    cwd: workflowCwd,
  });
  const outputPaths = (
    await Promise.all(
      manifest.outputs.map(async (outputPath) => {
        const absolutePath = resolve(workflowCwd, outputPath);
        return (await pathExists(absolutePath))
          ? relativeToWorkspace(workspaceRoot, absolutePath)
          : null;
      }),
    )
  ).filter((value): value is string => Boolean(value));
  const finalizedReceipt =
    execution.exitCode === 0
      ? await finalizeSkoposWorkflowReceipt({
          workspaceRoot,
          manifest,
          receipt,
        })
      : receipt;
  const artifact = buildWorkflowRunArtifact({
    id: runId,
    workspaceRoot,
    manifest,
    runStatus: execution.exitCode === 0 ? 'succeeded' : 'failed',
    exitCode: execution.exitCode,
    startedAt,
    finishedAt: execution.finishedAt,
    outputPaths,
    stdoutExcerpt: execution.stdoutExcerpt,
    stderrExcerpt: execution.stderrExcerpt,
    runByActorId: actorId,
    receipt: finalizedReceipt,
  });

  await writeRunArtifact(runPath, artifact);
  const receiptProjectionPath = await writeSkoposReceiptProjection({
    workspaceRoot,
    authorityRunPath: runPath,
    artifact,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'workflow-run',
    status: execution.exitCode === 0 ? 'succeeded' : 'failed',
    summary: `Workflow ${manifest.id} ${execution.exitCode === 0 ? 'completed' : 'failed'}.`,
    relatedArtifactPaths: [
      runPath,
      ...(receiptProjectionPath ? [receiptProjectionPath] : []),
      manifest.sourcePath,
      ...outputPaths,
    ],
    metadata: {
      workflowId: manifest.id,
      workflowSafety: manifest.safety,
      requiresApproval: manifest.requiresApproval,
      exitCode: execution.exitCode,
      actorId: actorId ?? null,
      receiptExecutionKey: finalizedReceipt.executionKey,
      receiptSourceDigest: finalizedReceipt.sourceState.digest,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  if (execution.exitCode !== 0) {
    throw new Error(
      `Workflow ${manifest.id} failed with exit code ${execution.exitCode}. Run artifact: ${runPath}`,
    );
  }

  return artifact;
};

interface BuildWorkflowRunArtifactInput {
  id: string;
  workspaceRoot: string;
  manifest: SkoposWorkflowManifest;
  runStatus: SkoposWorkflowRunArtifact['runStatus'];
  exitCode: number | null;
  startedAt?: string;
  finishedAt?: string;
  outputPaths: string[];
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
  runByActorId?: string;
  receipt?: SkoposWorkflowRunArtifact['receipt'];
}

const buildWorkflowRunArtifact = ({
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
  receipt,
}: BuildWorkflowRunArtifactInput): SkoposWorkflowRunArtifact => ({
  schemaVersion: 1,
  id,
  type: 'workflow-run',
  status: 'generated',
  authority: 'generated',
  summary: `${manifest.id} ${runStatus}.`,
  updatedAt: finishedAt ?? startedAt,
  generatedAt: finishedAt ?? startedAt,
  workspaceRoot,
  workflowId: manifest.id,
  workflowTitle: manifest.title,
  workflowCategory: manifest.category,
  workflowSafety: manifest.safety,
  runByActorId,
  sourcePath: manifest.sourcePath,
  command: manifest.command,
  cwd: manifest.cwd,
  runStatus,
  exitCode,
  startedAt,
  finishedAt,
  outputPaths,
  receipt,
  stdoutExcerpt,
  stderrExcerpt,
});

const resolveWorkflowActorId = (actor?: string): string | undefined => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    return undefined;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const requireWorkflowActorId = (actor: string | undefined, workflowId: string): string => {
  const actorId = resolveWorkflowActorId(actor);
  if (!actorId) {
    throw new Error(
      `Workflow ${workflowId} mutates workspace state. Re-run with --actor <id> so the run evidence is attributable.`,
    );
  }

  return actorId;
};

const writeRunArtifact = async (
  runPath: string,
  artifact: SkoposWorkflowRunArtifact,
): Promise<void> => {
  await mkdir(dirname(runPath), { recursive: true });
  await writeFile(runPath, JSON.stringify(artifact, null, 2), 'utf8');
};

const loadWorkflowRunArtifacts = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowRunArtifact[]> => {
  const runsRoot = join(workspaceRoot, '.skopos', 'runs');

  try {
    const entries = await readdir(runsRoot);
    const artifacts = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) =>
          JSON.parse(await readFile(join(runsRoot, entry), 'utf8')) as SkoposWorkflowRunArtifact,
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
