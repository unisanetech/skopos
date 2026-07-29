import { appendFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import {
  buildSkoposDocumentCatalog,
  loadSkoposActionManifests,
} from '@skopos/indexer';
import type {
  SkoposActionRunArtifact,
  SkoposAgentCommunicationBriefArtifact,
  SkoposAgentPromptBriefArtifact,
  SkoposBootstrapArtifact,
  SkoposContentIndexArtifact,
  SkoposContentIndexEntry,
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposOperationalLogEntry,
  SkoposOperationalLogEventKind,
  SkoposOperationalLogStatus,
  SkoposProjectReadinessArtifact,
  SkoposScopesLiteArtifact,
  SkoposTaskArtifact,
  SkoposTokenTelemetryArtifact,
  SkoposWorkQueueArtifact,
} from '@skopos/model';

import { WORK_QUEUE_ARTIFACT_PATH } from '../work-queue/work-queue.service.js';
import {
  COMMUNICATION_BRIEF_ARTIFACT_PATH,
  DISCUSSION_INDEX_ARTIFACT_PATH,
  PROMPT_BRIEF_ARTIFACT_PATH,
  TOKEN_TELEMETRY_ARTIFACT_PATH,
} from './token-control-constants.js';
import { writeJsonArtifact } from './write-json-artifact.js';

interface AppendSkoposOperationalLogEntryOptions {
  workspaceRoot: string;
  eventKind: SkoposOperationalLogEventKind;
  status: SkoposOperationalLogStatus;
  summary: string;
  relatedArtifactPaths?: string[];
  metadata?: Record<string, string | number | boolean | null>;
  dryRun?: boolean;
}

export interface SkoposOperationalLogWriteResult {
  path: string;
  write: 'written' | 'dry-run';
  entry: SkoposOperationalLogEntry;
}

export interface SkoposKnowledgeIndexWriteResult {
  path: string;
  write: 'written' | 'dry-run';
  artifact: SkoposContentIndexArtifact;
}

const LOG_PATH = '.skopos/runs/operations.jsonl';
const INDEX_PATH = '.skopos/index/memory.json';

export const appendSkoposOperationalLogEntry = async ({
  workspaceRoot,
  eventKind,
  status,
  summary,
  relatedArtifactPaths = [],
  metadata,
  dryRun = false,
}: AppendSkoposOperationalLogEntryOptions): Promise<SkoposOperationalLogWriteResult> => {
  const root = resolve(workspaceRoot);
  const timestamp = new Date().toISOString();
  const path = join(root, LOG_PATH);
  const entry: SkoposOperationalLogEntry = {
    schemaVersion: 1,
    id: `${eventKind}-${timestamp.replace(/[-:.]/g, '').replace('Z', 'z')}-${process.pid}`,
    type: 'log-entry',
    workspaceRoot: root,
    eventKind,
    status,
    timestamp,
    summary,
    relatedArtifactPaths: relatedArtifactPaths.map((artifactPath) =>
      normalizeWorkspacePath(root, artifactPath),
    ),
    metadata,
  };
  if (!dryRun) {
    await mkdir(dirname(path), { recursive: true });
    await appendFile(path, `${JSON.stringify(entry)}\n`, 'utf8');
  }
  return { path, write: dryRun ? 'dry-run' : 'written', entry };
};

export const refreshSkoposKnowledgeIndex = async ({
  workspaceRoot,
  dryRun = false,
}: {
  workspaceRoot: string;
  dryRun?: boolean;
}): Promise<SkoposKnowledgeIndexWriteResult> => {
  const root = resolve(workspaceRoot);
  const artifact = await buildKnowledgeIndex(root);
  const path = join(root, INDEX_PATH);
  const write = await writeJsonArtifact({ artifactPath: path, artifact, dryRun });
  return { path, write, artifact };
};

const buildKnowledgeIndex = async (
  workspaceRoot: string,
): Promise<SkoposContentIndexArtifact> => {
  const [
    bootstrap,
    scopes,
    readiness,
    workQueue,
    promptBrief,
    communicationBrief,
    telemetry,
    discussionIndex,
    catalog,
    actions,
    tasks,
    actionRuns,
    graphs,
    checkpoints,
    logEntries,
  ] = await Promise.all([
    readJson<SkoposBootstrapArtifact>(join(workspaceRoot, '.skopos/index/bootstrap.json')),
    readJson<SkoposScopesLiteArtifact>(join(workspaceRoot, '.skopos/index/scopes.json')),
    readJson<SkoposProjectReadinessArtifact>(
      join(workspaceRoot, '.skopos/index/readiness.json'),
    ),
    readJson<SkoposWorkQueueArtifact>(join(workspaceRoot, WORK_QUEUE_ARTIFACT_PATH)),
    readJson<SkoposAgentPromptBriefArtifact>(
      join(workspaceRoot, PROMPT_BRIEF_ARTIFACT_PATH),
    ),
    readJson<SkoposAgentCommunicationBriefArtifact>(
      join(workspaceRoot, COMMUNICATION_BRIEF_ARTIFACT_PATH),
    ),
    readJson<SkoposTokenTelemetryArtifact>(
      join(workspaceRoot, TOKEN_TELEMETRY_ARTIFACT_PATH),
    ),
    readJson<SkoposDiscussionIndexArtifact>(
      join(workspaceRoot, DISCUSSION_INDEX_ARTIFACT_PATH),
    ),
    buildSkoposDocumentCatalog({ cwd: workspaceRoot }),
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadRecursiveArtifacts<SkoposTaskArtifact>(
      join(workspaceRoot, '.skopos/tasks'),
      workspaceRoot,
      (name) => name === 'task.json',
    ),
    loadRecursiveArtifacts<SkoposActionRunArtifact>(
      join(workspaceRoot, '.skopos/runs'),
      workspaceRoot,
      (name) => name.endsWith('.json'),
    ),
    loadRecursiveArtifacts<Record<string, unknown>>(
      join(workspaceRoot, '.skopos/graph'),
      workspaceRoot,
      (name) => name.endsWith('.json'),
    ),
    loadRecursiveArtifacts<SkoposDiscussionCheckpointArtifact>(
      join(workspaceRoot, '.skopos/sessions/checkpoints'),
      workspaceRoot,
      (name) => name.endsWith('.json'),
    ),
    loadOperationalLogEntries(workspaceRoot),
  ]);
  const entries: SkoposContentIndexEntry[] = [
    entry('config', 'config', 'Root config', 'Tracked Skopos workspace config.', 'skopos.config.yaml'),
  ];
  if (bootstrap) {
    entries.push(
      entry(
        'bootstrap',
        'core-artifact',
        'Bootstrap',
        bootstrap.summary ?? 'Compiled workspace bootstrap.',
        '.skopos/index/bootstrap.json',
        bootstrap.updatedAt,
      ),
    );
  }
  if (scopes) {
    entries.push(
      entry(
        'scopes',
        'core-artifact',
        'Scopes',
        scopes.summary ?? 'Compiled Scope registry.',
        '.skopos/index/scopes.json',
        scopes.updatedAt,
      ),
    );
  }
  if (workQueue) {
    entries.push(
      entry(
        'work-queue',
        'core-artifact',
        'Work Queue',
        workQueue.summary ?? 'Compiled project work candidates.',
        WORK_QUEUE_ARTIFACT_PATH,
        workQueue.updatedAt,
      ),
    );
  }
  if (readiness) {
    entries.push(
      entry(
        'readiness',
        'readiness-artifact',
        'Project Readiness',
        readiness.summary,
        '.skopos/index/readiness.json',
        readiness.updatedAt,
      ),
    );
  }
  if (promptBrief) {
    entries.push(
      entry(
        promptBrief.id,
        'agent-brief-artifact',
        'Prompt loading brief',
        promptBrief.summary ?? 'Compact context loading guidance.',
        PROMPT_BRIEF_ARTIFACT_PATH,
        promptBrief.updatedAt,
      ),
    );
  }
  if (communicationBrief) {
    entries.push(
      entry(
        communicationBrief.id,
        'agent-brief-artifact',
        'Communication brief',
        communicationBrief.summary ?? 'Project communication guidance.',
        COMMUNICATION_BRIEF_ARTIFACT_PATH,
        communicationBrief.updatedAt,
      ),
    );
  }
  if (telemetry) {
    entries.push(
      entry(
        telemetry.id,
        'telemetry-artifact',
        'Context telemetry',
        telemetry.summary ?? 'Compact context budget measurements.',
        TOKEN_TELEMETRY_ARTIFACT_PATH,
        telemetry.updatedAt,
      ),
    );
  }
  if (discussionIndex) {
    entries.push(
      entry(
        discussionIndex.id,
        'discussion-artifact',
        'Task continuation history',
        discussionIndex.summary ?? 'Task-local checkpoints and handoffs.',
        DISCUSSION_INDEX_ARTIFACT_PATH,
        discussionIndex.updatedAt,
      ),
    );
  }
  entries.push(
    ...tasks
      .filter((task) =>
        !['complete', 'cancelled', 'superseded'].includes(task.artifact.state),
      )
      .map((task) =>
        entry(
          task.artifact.id,
          'task-artifact',
          task.artifact.title,
          `${task.artifact.state} Task for ${task.artifact.scope.scope.id}.`,
          task.path,
          task.artifact.updatedAt,
        ),
      ),
    ...actionRuns.slice(-8).map((run) =>
      entry(
        run.artifact.id,
        'action-run-artifact',
        run.artifact.actionTitle,
        `${run.artifact.runStatus} Action run.`,
        run.path,
        run.artifact.updatedAt,
      ),
    ),
    ...graphs.map((graph) =>
      entry(
        String(graph.artifact.id ?? graph.path),
        'graph-artifact',
        String(graph.artifact.title ?? graph.artifact.id ?? 'Graph'),
        String(graph.artifact.summary ?? 'Compiled graph projection.'),
        graph.path,
        typeof graph.artifact.updatedAt === 'string'
          ? graph.artifact.updatedAt
          : undefined,
      ),
    ),
    ...checkpoints.slice(-6).map((checkpoint) =>
      entry(
        checkpoint.artifact.id,
        'discussion-artifact',
        `Task checkpoint: ${checkpoint.artifact.activeTaskId ?? 'unbound'}`,
        checkpoint.artifact.resumeSummary,
        checkpoint.path,
        checkpoint.artifact.updatedAt,
      ),
    ),
  );
  const latestEvent = logEntries.at(-1);
  const docsRoot = bootstrap?.recommendedConfig?.docs.root;
  const docsStartHerePath =
    bootstrap?.detected?.docsHealth.hasStartHere && docsRoot
      ? bootstrap.recommendedConfig.docs.startHerePath ?? `${docsRoot}/00-start-here.md`
      : undefined;
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    id: 'knowledge-index',
    type: 'index',
    status: 'generated',
    authority: 'generated',
    summary: 'Compact compiled Project Memory and runtime-state index.',
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    focusSubtree: bootstrap?.focusSubtree,
    docsRoot,
    readiness: readiness?.readiness ?? 'unknown',
    counts: {
      packageCount: bootstrap?.detected?.packageCount ?? 0,
      workspacePackageCount: bootstrap?.detected?.workspacePackageCount ?? 0,
      scopeCount: scopes?.scopes?.length ?? 0,
      agentBriefCount: Number(Boolean(promptBrief)) + Number(Boolean(communicationBrief)),
      referenceArtifactCount: catalog.documents.filter(
        (document) => document.role === 'reference',
      ).length,
      graphCount: graphs.length,
      planCount: catalog.documents.filter((document) => document.role === 'plan').length,
      taskCount: tasks.length,
      actionRunCount: actionRuns.length,
      actionManifestCount: actions.length,
      documentCount: catalog.documents.length,
    },
    quickLinks: {
      configPath: 'skopos.config.yaml',
      bootstrapPath: bootstrap ? '.skopos/index/bootstrap.json' : undefined,
      docsStartHerePath,
      logPath: LOG_PATH,
    },
    latestEvent: latestEvent
      ? {
          id: latestEvent.id,
          eventKind: latestEvent.eventKind,
          status: latestEvent.status,
          timestamp: latestEvent.timestamp,
          summary: latestEvent.summary,
        }
      : undefined,
    documents: catalog.documents,
    entries: entries.sort(
      (left, right) =>
        (Date.parse(right.updatedAt ?? '') || 0) -
          (Date.parse(left.updatedAt ?? '') || 0) ||
        left.id.localeCompare(right.id),
    ),
  };
};

const entry = (
  id: string,
  kind: SkoposContentIndexEntry['kind'],
  title: string,
  summary: string,
  path: string,
  updatedAt?: string,
): SkoposContentIndexEntry => ({ id, kind, title, summary, path, updatedAt });

const readJson = async <T>(path: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch {
    return null;
  }
};

const loadRecursiveArtifacts = async <T>(
  root: string,
  workspaceRoot: string,
  include: (name: string) => boolean,
): Promise<Array<{ artifact: T; path: string }>> => {
  const files = await collectFiles(root, include);
  return Promise.all(
    files.map(async (path) => ({
      artifact: JSON.parse(await readFile(path, 'utf8')) as T,
      path: normalizeWorkspacePath(workspaceRoot, path),
    })),
  );
};

const collectFiles = async (
  directory: string,
  include: (name: string) => boolean,
): Promise<string[]> => {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return (
      await Promise.all(
        entries.map((entry) => {
          const path = join(directory, entry.name);
          if (entry.isDirectory()) return collectFiles(path, include);
          return entry.isFile() && include(entry.name) ? [path] : [];
        }),
      )
    ).flat();
  } catch {
    return [];
  }
};

const loadOperationalLogEntries = async (
  workspaceRoot: string,
): Promise<SkoposOperationalLogEntry[]> => {
  try {
    return (await readFile(join(workspaceRoot, LOG_PATH), 'utf8'))
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SkoposOperationalLogEntry);
  } catch {
    return [];
  }
};

const normalizeWorkspacePath = (workspaceRoot: string, path: string): string => {
  const normalized = relative(workspaceRoot, resolve(workspaceRoot, path));
  return normalized || '.';
};
