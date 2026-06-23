import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import { loadSkoposWorkflowManifests } from '@skopos/indexer';
import type { SkoposWorkflowManifest, SkoposWorkflowRunArtifact } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { executeSkoposShellCommand } from '../shared/execute-shell-command.js';
import { pathExists } from '../shared/path-exists.js';

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

  const runId = `run-${formatTimestamp(new Date())}-${slugify(manifest.id)}`;
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
  });

  await writeRunArtifact(runPath, artifact);
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'workflow-run',
    status: execution.exitCode === 0 ? 'succeeded' : 'failed',
    summary: `Workflow ${manifest.id} ${execution.exitCode === 0 ? 'completed' : 'failed'}.`,
    relatedArtifactPaths: [runPath, manifest.sourcePath, ...outputPaths],
    metadata: {
      workflowId: manifest.id,
      workflowSafety: manifest.safety,
      requiresApproval: manifest.requiresApproval,
      exitCode: execution.exitCode,
      actorId: actorId ?? null,
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
