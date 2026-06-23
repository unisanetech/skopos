import { randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type {
  SkoposBackgroundEvalRunResult,
  SkoposJobArtifact,
  SkoposJobShowRunResult,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRecommendationArtifact,
} from '@skopos/model';

import { buildSkoposEvalRuntime } from '../eval/eval.service.js';
import { resolveCurrentMissionRuntime } from '../shared/current-mission.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  loadWorkflowQuestionsArtifact,
  loadWorkflowRecommendationsArtifact,
} from '../workflow-router/workflow-router-state.service.js';

const JOBS_DIRECTORY = '.skopos/jobs';

export interface EnqueueSkoposEvalBackgroundJobRuntimeOptions {
  cwd: string;
  mission?: string;
  actor?: string;
  dryRun?: boolean;
}

export interface RunSkoposEvalBackgroundJobRuntimeOptions {
  cwd: string;
  jobId: string;
}

export interface LoadSkoposJobRuntimeOptions {
  cwd: string;
  jobId: string;
}

export const enqueueSkoposEvalBackgroundJobRuntime = async ({
  cwd,
  mission,
  actor,
  dryRun = false,
}: EnqueueSkoposEvalBackgroundJobRuntimeOptions): Promise<SkoposBackgroundEvalRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireJobActorId(actor);
  const missionArtifact = await resolveCurrentMissionRuntime({
    workspaceRoot,
    mission,
    actorId,
    questions: await loadOptionalQuestions(workspaceRoot),
    recommendations: await loadOptionalRecommendations(workspaceRoot),
  });
  const createdAt = new Date().toISOString();
  const jobId = `job-${createdAt.replaceAll(/[:.]/g, '')}-${randomUUID().slice(0, 8)}`;
  const jobPath = resolveJobArtifactPath(workspaceRoot, jobId);
  const pollCommand = `skopos jobs show ${jobId} ${workspaceRoot} --compact --json`;
  const summary = `Queued background eval for ${missionArtifact.id}.`;
  const job: SkoposJobArtifact = {
    schemaVersion: 1,
    id: jobId,
    type: 'job',
    status: 'generated',
    authority: 'generated',
    summary,
    updatedAt: createdAt,
    generatedAt: createdAt,
    workspaceRoot,
    jobKind: 'eval',
    jobState: 'queued',
    requestedByActorId: actorId,
    missionId: missionArtifact.id,
    command: `skopos eval ${workspaceRoot} --mission ${missionArtifact.id} --actor ${actorId} --compact --json`,
    pollCommand,
    createdAt,
  };

  await writeJsonArtifact({
    artifactPath: jobPath,
    artifact: job,
    dryRun,
  });

  return {
    workspaceRoot,
    actorId,
    missionId: missionArtifact.id,
    summary,
    jobId,
    jobPath,
    jobState: job.jobState,
    nextCommand: pollCommand,
    job,
  };
};

export const loadSkoposJobRuntime = async ({
  cwd,
  jobId,
}: LoadSkoposJobRuntimeOptions): Promise<SkoposJobArtifact> => {
  const workspaceRoot = resolve(cwd);
  const contents = await readFile(resolveJobArtifactPath(workspaceRoot, jobId), 'utf8');
  return JSON.parse(contents) as SkoposJobArtifact;
};

export const showSkoposJobRuntime = async ({
  cwd,
  jobId,
}: LoadSkoposJobRuntimeOptions): Promise<SkoposJobShowRunResult> => {
  const workspaceRoot = resolve(cwd);
  const jobPath = resolveJobArtifactPath(workspaceRoot, jobId);
  const job = await loadSkoposJobRuntime({
    cwd: workspaceRoot,
    jobId,
  });

  return {
    workspaceRoot,
    summary: job.summary ?? `Background job ${job.id} is ${job.jobState}.`,
    jobId: job.id,
    jobPath,
    nextCommand: job.jobState === 'queued' || job.jobState === 'running' ? job.pollCommand : undefined,
    job,
  };
};

export const listSkoposJobsRuntime = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposJobArtifact[]> => {
  const workspaceRoot = resolve(cwd);
  const jobsRoot = join(workspaceRoot, JOBS_DIRECTORY);

  try {
    const entries = await readdir(jobsRoot, { withFileTypes: true });
    const jobPaths = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => join(jobsRoot, entry.name));
    const jobs = await Promise.all(
      jobPaths.map(async (jobPath) => JSON.parse(await readFile(jobPath, 'utf8')) as SkoposJobArtifact),
    );

    return jobs.sort((left, right) => {
      const leftTime = Date.parse(left.updatedAt ?? left.createdAt);
      const rightTime = Date.parse(right.updatedAt ?? right.createdAt);
      return rightTime - leftTime;
    });
  } catch {
    return [];
  }
};

export const runSkoposEvalBackgroundJobRuntime = async ({
  cwd,
  jobId,
}: RunSkoposEvalBackgroundJobRuntimeOptions): Promise<SkoposJobArtifact> => {
  const workspaceRoot = resolve(cwd);
  const existingJob = await loadSkoposJobRuntime({
    cwd: workspaceRoot,
    jobId,
  });
  const jobPath = resolveJobArtifactPath(workspaceRoot, jobId);

  if (existingJob.jobState === 'succeeded' || existingJob.jobState === 'failed') {
    return existingJob;
  }

  const startedAt = new Date().toISOString();
  const runningJob: SkoposJobArtifact = {
    ...existingJob,
    jobState: 'running',
    summary: `Running background eval for ${existingJob.missionId ?? 'the active mission'}.`,
    updatedAt: startedAt,
    startedAt: existingJob.startedAt ?? startedAt,
  };

  await writeJsonArtifact({
    artifactPath: jobPath,
    artifact: runningJob,
  });

  try {
    const result = await buildSkoposEvalRuntime({
      cwd: workspaceRoot,
      mission: runningJob.missionId,
      actor: runningJob.requestedByActorId,
    });
    const finishedAt = new Date().toISOString();
    const succeededJob: SkoposJobArtifact = {
      ...runningJob,
      jobState: 'succeeded',
      summary: `Background eval succeeded for ${result.missionId}.`,
      updatedAt: finishedAt,
      finishedAt,
      resultPath: result.evalPath,
      resultSummary: result.summary,
    };

    await writeJsonArtifact({
      artifactPath: jobPath,
      artifact: succeededJob,
    });

    return succeededJob;
  } catch (error) {
    const finishedAt = new Date().toISOString();
    const failedJob: SkoposJobArtifact = {
      ...runningJob,
      jobState: 'failed',
      summary: `Background eval failed for ${runningJob.missionId ?? 'the active mission'}.`,
      updatedAt: finishedAt,
      finishedAt,
      errorMessage: error instanceof Error ? error.message : String(error),
    };

    await writeJsonArtifact({
      artifactPath: jobPath,
      artifact: failedJob,
    });

    return failedJob;
  }
};

export const resolveJobArtifactPath = (workspaceRoot: string, jobId: string): string =>
  join(workspaceRoot, JOBS_DIRECTORY, `${jobId}.json`);

const requireJobActorId = (actor?: string): string => {
  const actorId = actor?.trim();
  if (!actorId) {
    throw new Error('Background eval requires --actor <id>.');
  }

  return actorId;
};

const loadOptionalQuestions = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowQuestionArtifact | undefined> => {
  try {
    return await loadWorkflowQuestionsArtifact(workspaceRoot);
  } catch {
    return undefined;
  }
};

const loadOptionalRecommendations = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowRecommendationArtifact | undefined> => {
  try {
    return await loadWorkflowRecommendationsArtifact(workspaceRoot);
  } catch {
    return undefined;
  }
};
