import { randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import { loadSkoposActionManifests } from '@skopos/indexer';
import type {
  SkoposActionRunArtifact,
  SkoposTaskActionEvidenceLink,
  SkoposTaskEvidenceReuseOutcome,
  SkoposTaskEvidenceReuseReport,
} from '@skopos/model';
import { validateSkoposEvidence } from '@skopos/verification';

import {
  completeSkoposTaskActionRuntime,
  resolveSkoposTrackedTaskProjectionPaths,
  showSkoposTaskRuntime,
} from '../task/task.service.js';
import { resolveSkoposTaskDirectory } from '../task/task-paths.js';

export interface ReuseSkoposTaskActionEvidenceRuntimeOptions {
  cwd: string;
  taskId: string;
  actor?: string;
}

export const reuseSkoposTaskActionEvidenceRuntime = async ({
  cwd,
  taskId,
  actor,
}: ReuseSkoposTaskActionEvidenceRuntimeOptions): Promise<SkoposTaskEvidenceReuseReport> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireActorId(actor);
  const task = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  const [manifests, runs, links] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadActionRunArtifacts(workspaceRoot),
    loadTaskActionEvidenceLinks(workspaceRoot, task.taskIdentity),
  ]);
  const ignoredSourcePaths = resolveSkoposTrackedTaskProjectionPaths(
    task.trackedDocumentPath,
  );
  const outcomes: SkoposTaskEvidenceReuseOutcome[] = [];

  for (const requirement of task.selectedActions) {
    const manifest = manifests.find((candidate) => candidate.id === requirement.id);
    if (!manifest) {
      outcomes.push({
        actionId: requirement.id,
        status: 'missing',
        summary: `Required Action ${requirement.id} has no declared provider.`,
      });
      continue;
    }

    const actionRuns = runs.filter((run) => run.actionId === manifest.id);
    const successfulRuns = actionRuns.filter((run) => run.runStatus === 'succeeded');
    if (successfulRuns.length === 0) {
      const latestStatus = actionRuns[0]?.runStatus;
      outcomes.push({
        actionId: manifest.id,
        status: 'missing',
        summary: latestStatus
          ? `Action ${manifest.id} has no successful reusable run; latest status is ${latestStatus}.`
          : `Action ${manifest.id} has no prior run.`,
      });
      continue;
    }

    let validRun: SkoposActionRunArtifact | undefined;
    const rejectionSummaries: string[] = [];
    for (const run of successfulRuns) {
      const validation = await validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact: run,
        ignoredSourcePaths,
      });
      if (validation.status === 'valid') {
        validRun = run;
        break;
      }
      rejectionSummaries.push(`${run.id}: ${validation.summary}`);
    }

    if (!validRun) {
      outcomes.push({
        actionId: manifest.id,
        status: 'rejected',
        summary: rejectionSummaries.join(' '),
      });
      continue;
    }

    const existingLink = links.find(
      (link) => link.actionId === manifest.id && link.runId === validRun.id,
    );
    if (existingLink) {
      await completeSkoposTaskActionRuntime({
        cwd: workspaceRoot,
        taskId: task.id,
        actionId: manifest.id,
        actor: actorId,
      });
      outcomes.push({
        actionId: manifest.id,
        status: 'already-linked',
        runId: validRun.id,
        summary: `Task ${task.id} already links valid Action Evidence ${validRun.id}.`,
      });
      continue;
    }

    await linkSkoposActionRunToTask({
      workspaceRoot,
      taskId: task.id,
      actor: actorId,
      run: validRun,
    });
    outcomes.push({
      actionId: manifest.id,
      status: 'linked',
      runId: validRun.id,
      summary: `Linked valid Action Evidence ${validRun.id} without executing ${manifest.id}.`,
    });
  }

  const generatedAt = new Date().toISOString();
  const id = `reuse-${generatedAt.replace(/[^0-9]/g, '').slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const absoluteReportPath = join(
    resolveSkoposTaskDirectory(workspaceRoot, task.taskIdentity),
    'evidence-reuse',
    `${id}.json`,
  );
  const reportPath = relative(workspaceRoot, absoluteReportPath);
  const report: SkoposTaskEvidenceReuseReport = {
    schemaVersion: 1,
    id,
    type: 'task-evidence-reuse-report',
    status: 'generated',
    authority: 'generated',
    summary: buildSummary(task.id, outcomes),
    generatedAt,
    updatedAt: generatedAt,
    workspaceRoot,
    taskId: task.id,
    actorId,
    reportPath,
    selectedActionCount: outcomes.length,
    linkedCount: countStatus(outcomes, 'linked'),
    alreadyLinkedCount: countStatus(outcomes, 'already-linked'),
    rejectedCount: countStatus(outcomes, 'rejected'),
    missingCount: countStatus(outcomes, 'missing'),
    processExecutionCount: 0,
    outcomes,
  };
  await mkdir(dirname(absoluteReportPath), { recursive: true });
  await writeFile(absoluteReportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
};

export const linkSkoposActionRunToTask = async ({
  workspaceRoot,
  taskId,
  actor,
  run,
}: {
  workspaceRoot: string;
  taskId?: string;
  actor?: string;
  run: SkoposActionRunArtifact;
}): Promise<{
  run: SkoposActionRunArtifact;
  taskEvidenceLink?: SkoposTaskActionEvidenceLink;
  taskEvidenceLinkPath?: string;
}> => {
  if (!taskId) return { run };
  const actorId = requireActorId(actor);
  const task = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId });
  const linkedAt = new Date().toISOString();
  const link: SkoposTaskActionEvidenceLink = {
    schemaVersion: 1,
    id: `${task.id}.action-evidence.${slugify(run.actionId)}.${run.id}`,
    type: 'task-action-evidence-link',
    status: 'generated',
    authority: 'generated',
    summary: `Task ${task.id} links Action Evidence ${run.id} for ${run.actionId}.`,
    generatedAt: linkedAt,
    updatedAt: linkedAt,
    workspaceRoot,
    taskId: task.id,
    actionId: run.actionId,
    runId: run.id,
    linkedAt,
    linkedByActorId: actorId,
  };
  const linkPath = join(
    resolveSkoposTaskDirectory(workspaceRoot, task.taskIdentity),
    'evidence',
    `${link.id}.json`,
  );
  await mkdir(dirname(linkPath), { recursive: true });
  await writeFile(linkPath, `${JSON.stringify(link, null, 2)}\n`, 'utf8');
  await completeSkoposTaskActionRuntime({
    cwd: workspaceRoot,
    taskId: task.id,
    actionId: run.actionId,
    actor: actorId,
  });
  return { run, taskEvidenceLink: link, taskEvidenceLinkPath: linkPath };
};

const loadActionRunArtifacts = async (
  workspaceRoot: string,
): Promise<SkoposActionRunArtifact[]> => {
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
    return runs
      .filter((run) => run.type === 'action-run')
      .sort((left, right) => runTime(right) - runTime(left));
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
    const links = await Promise.all(
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map(async (entry) =>
          JSON.parse(await readFile(join(root, entry), 'utf8')) as SkoposTaskActionEvidenceLink,
        ),
    );
    return links.filter((link) => link.type === 'task-action-evidence-link');
  } catch {
    return [];
  }
};

const countStatus = (
  outcomes: SkoposTaskEvidenceReuseOutcome[],
  status: SkoposTaskEvidenceReuseOutcome['status'],
): number => outcomes.filter((outcome) => outcome.status === status).length;

const buildSummary = (
  taskId: string,
  outcomes: SkoposTaskEvidenceReuseOutcome[],
): string =>
  `Task ${taskId} Evidence reuse linked ${countStatus(outcomes, 'linked')}, retained ${countStatus(outcomes, 'already-linked')}, rejected ${countStatus(outcomes, 'rejected')}, and found ${countStatus(outcomes, 'missing')} missing.`;

const runTime = (run: SkoposActionRunArtifact): number =>
  Date.parse(run.finishedAt ?? run.updatedAt ?? run.generatedAt ?? '') || 0;

const requireActorId = (actor?: string): string => {
  const actorId = (actor ?? process.env.SKOPOS_ACTOR)?.trim();
  if (!actorId) throw new Error('Evidence reuse requires --actor <id>.');
  return actorId;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
