import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import type {
  SkoposDocumentKnowledgeEntry,
  SkoposReadinessArtifact,
  SkoposTaskArtifact,
  SkoposTaskQuestionArtifact,
  SkoposWorkQueueArtifact,
  SkoposWorkQueueDisposition,
  SkoposWorkQueueEntry,
  SkoposWorkQueueRunResult,
} from '@skopos/model';
import { buildSkoposDocumentCatalog } from '@skopos/indexer';

import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import { resolveSkoposTaskArtifactPath } from '../task/task-paths.js';
import { reconstructTrackedSkoposTasksRuntime } from '../task/task.service.js';

export const WORK_QUEUE_ARTIFACT_PATH = '.skopos/index/work-queue.json';

export const buildSkoposWorkQueueRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
}): Promise<SkoposWorkQueueRunResult> => {
  const workspaceRoot = resolve(cwd);
  await reconstructTrackedSkoposTasksRuntime({ cwd: workspaceRoot });
  const actorId = resolveSkoposRuntimeActorId(actor);
  const [tasks, catalog] = await Promise.all([
    loadTaskArtifacts(workspaceRoot),
    buildSkoposDocumentCatalog({ cwd: workspaceRoot }),
  ]);
  const terminalTaskIds = new Set(
    tasks
      .filter((task) => ['complete', 'cancelled', 'superseded'].includes(task.state))
      .map((task) => task.id),
  );
  const openTasks = tasks.filter(
    (task) => !['complete', 'cancelled', 'superseded'].includes(task.state),
  );
  const [questions, readiness] = await Promise.all([
    loadOpenTaskQuestions(workspaceRoot, openTasks),
    loadBlockedReadiness(workspaceRoot, openTasks),
  ]);
  const entries = [
    ...openTasks.map((task) =>
      taskToQueueEntry(workspaceRoot, task, terminalTaskIds),
    ),
    ...catalog.documents
      .filter(isQueueDocument)
      .map(documentToQueueEntry),
    ...questions,
    ...readiness,
  ]
    .sort(sortQueueEntries);
  const now = new Date().toISOString();
  const counts = createEmptyCounts();
  for (const entry of entries) {
    counts[entry.disposition] += 1;
  }
  const workQueue: SkoposWorkQueueArtifact = {
    schemaVersion: 1,
    id: 'skopos.work-queue',
    type: 'work-queue',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    workspaceRoot,
    summary: `Compiled ${entries.length} open Work Queue item${entries.length === 1 ? '' : 's'} from Tasks, accepted Plans, open Findings, material questions, and Readiness blockers.`,
    entries,
    counts,
  };
  const artifactPath = join(workspaceRoot, WORK_QUEUE_ARTIFACT_PATH);
  await writeJsonArtifact({ artifactPath, artifact: workQueue, dryRun });
  const actorTask = actorId
    ? entries.find((entry) => entry.claimedByActorId === actorId)
    : undefined;
  const recommendedEntry =
    actorTask ??
    entries.find((entry) => entry.disposition === 'ready') ??
    entries.find((entry) => entry.disposition === 'in-progress');

  return {
    workspaceRoot,
    actorId,
    artifactPath,
    artifactWrite: dryRun ? 'dry-run' : 'written',
    workQueue,
    currentTaskId: actorTask?.sourceKind === 'task' ? actorTask.id : undefined,
    recommendedEntry,
    summary: recommendedEntry
      ? `Work Queue compiled; next inspect ${recommendedEntry.sourceKind} ${recommendedEntry.id}.`
      : 'Work Queue compiled with no ready or active work.',
  };
};

const loadTaskArtifacts = async (workspaceRoot: string): Promise<SkoposTaskArtifact[]> => {
  const root = join(workspaceRoot, '.skopos', 'tasks');
  const paths = await findTaskFiles(root);
  return Promise.all(
    paths.map(async (path) => JSON.parse(await readFile(path, 'utf8')) as SkoposTaskArtifact),
  );
};

const findTaskFiles = async (directory: string): Promise<string[]> => {
  let entries: Awaited<ReturnType<typeof readdir>>;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }
    throw error;
  }
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        return entry.name === 'plans' ? [] : findTaskFiles(path);
      }
      return entry.isFile() && entry.name === 'task.json' ? [path] : [];
    }),
  );
  return nested.flat();
};

const taskToQueueEntry = (
  workspaceRoot: string,
  task: SkoposTaskArtifact,
  terminalTaskIds: Set<string>,
): SkoposWorkQueueEntry => {
  const unresolvedDependencies = task.dependencyTaskIds.filter(
    (dependencyId) => !terminalTaskIds.has(dependencyId),
  );
  const disposition =
    unresolvedDependencies.length > 0 ? 'blocked' : taskDisposition(task);
  return {
    id: task.id,
    sourceKind: 'task',
    sourcePath: relative(
      workspaceRoot,
      resolveSkoposTaskArtifactPath(workspaceRoot, task.taskIdentity),
    ),
    title: task.title,
    summary: task.goal,
    scopeId: task.scope.scope.id,
    disposition,
    reason:
      unresolvedDependencies.length > 0
        ? `Task depends on unfinished Task${unresolvedDependencies.length === 1 ? '' : 's'}: ${unresolvedDependencies.join(', ')}.`
        : explainTaskDisposition(task, disposition),
    taskState: task.state,
    risk: task.risk,
    priority: task.priority,
    dependencyIds: task.dependencyTaskIds,
    claimedByActorId: task.coordination.claimedBy?.actorId,
    updatedAt: task.updatedAt ?? task.generatedAt,
  };
};

const loadOpenTaskQuestions = async (
  workspaceRoot: string,
  tasks: SkoposTaskArtifact[],
): Promise<SkoposWorkQueueEntry[]> => {
  const entries = await Promise.all(
    tasks.map(async (task) => {
      const taskDirectory = join(
        workspaceRoot,
        '.skopos',
        'tasks',
        task.taskIdentity.worktreeId,
        task.id,
      );
      const sourcePath = join(taskDirectory, 'questions.json');
      const artifact = await readJsonIfExists<SkoposTaskQuestionArtifact>(sourcePath);
      return (artifact?.entries ?? [])
        .filter((question) => question.status === 'open' && question.blocking)
        .map(
          (question): SkoposWorkQueueEntry => ({
            id: `${task.id}:${question.id}`,
            sourceKind: 'question',
            sourcePath: relative(workspaceRoot, sourcePath),
            title: question.question,
            summary: question.whyItMatters,
            scopeId: task.scope.scope.id,
            disposition: 'blocked',
            reason: `Task ${task.id} cannot proceed until this material question is resolved.`,
            priority: Math.max(task.priority, 75),
            dependencyIds: [task.id],
            updatedAt: artifact?.updatedAt,
          }),
        );
    }),
  );
  return entries.flat();
};

const loadBlockedReadiness = async (
  workspaceRoot: string,
  tasks: SkoposTaskArtifact[],
): Promise<SkoposWorkQueueEntry[]> => {
  const entries = await Promise.all(
    tasks.map(async (task) => {
      const taskDirectory = join(
        workspaceRoot,
        '.skopos',
        'tasks',
        task.taskIdentity.worktreeId,
        task.id,
      );
      return Promise.all(
        (['continue', 'integrate', 'close'] as const).map(async (target) => {
          const sourcePath = join(taskDirectory, `readiness-${target}.json`);
          const artifact = await readJsonIfExists<SkoposReadinessArtifact>(sourcePath);
          if (!artifact || artifact.readiness !== 'blocked') return [];
          return artifact.blockers.map(
            (blocker, index): SkoposWorkQueueEntry => ({
              id: `${task.id}:readiness:${target}:${index + 1}`,
              sourceKind: 'readiness-blocker',
              sourcePath: relative(workspaceRoot, sourcePath),
              title: `${task.title}: ${target} Readiness`,
              summary: blocker,
              scopeId: task.scope.scope.id,
              disposition: 'blocked',
              reason: `Task ${task.id} has recorded ${target} Readiness Evidence that is not yet sufficient.`,
              priority: Math.max(task.priority, 80),
              dependencyIds: [task.id],
              updatedAt: artifact.updatedAt,
            }),
          );
        }),
      ).then((groups) => groups.flat());
    }),
  );
  return entries.flat();
};

const isQueueDocument = (document: SkoposDocumentKnowledgeEntry): boolean => {
  if (
    document.adoption !== 'adopted' ||
    document.lifecycle !== 'active' ||
    !document.defaultVisible
  ) {
    return false;
  }
  if (document.role === 'plan') {
    return document.metadata?.provenance === 'accepted';
  }
  return document.role === 'finding';
};

const documentToQueueEntry = (
  document: SkoposDocumentKnowledgeEntry,
): SkoposWorkQueueEntry => ({
  id: document.id,
  sourceKind: document.role === 'plan' ? 'plan' : 'finding',
  sourcePath: document.path,
  title: document.title,
  summary: document.summary ?? `Open ${document.role} ${document.id}.`,
  scopeId: document.metadata?.scope ?? 'workspace',
  disposition: 'ready',
  reason:
    document.role === 'plan'
      ? 'Accepted active Plan may yield one or more Tasks; it is not directly claimable.'
      : 'Open Finding records unresolved project truth that may yield a Task.',
  priority: document.metadata?.priority ?? (document.role === 'finding' ? 60 : 40),
  dependencyIds: document.metadata?.dependencyIds ?? [],
  updatedAt: document.updatedAt,
});

const taskDisposition = (task: SkoposTaskArtifact): SkoposWorkQueueDisposition => {
  if (task.state === 'verifying') return 'verifying';
  if (task.state === 'ready-to-integrate') return 'ready-to-integrate';
  if (task.state === 'deferred') return 'deferred';
  if (task.state === 'blocked') return 'blocked';
  if (task.state === 'active') return 'in-progress';
  return 'ready';
};

const explainTaskDisposition = (
  task: SkoposTaskArtifact,
  disposition: SkoposWorkQueueDisposition,
): string => {
  if (disposition === 'blocked') {
    return `Task authority is blocked with ${task.questions.length} declared decision question${task.questions.length === 1 ? '' : 's'}.`;
  }
  if (disposition === 'in-progress') {
    return task.coordination.claimedBy
      ? `Task is active and claimed by ${task.coordination.claimedBy.actorId}.`
      : 'Task is active without a Session claim.';
  }
  if (disposition === 'verifying') return 'Task implementation is waiting for required Evidence and Guards.';
  if (disposition === 'ready-to-integrate') return 'Task Readiness permits integration.';
  if (disposition === 'deferred') {
    return task.disposition?.reason
      ? `Task is deferred: ${task.disposition.reason}`
      : 'Task is explicitly deferred.';
  }
  return 'Task authority is ready and not currently claimed.';
};

const sortQueueEntries = (
  left: SkoposWorkQueueEntry,
  right: SkoposWorkQueueEntry,
): number => {
  const order: Record<SkoposWorkQueueDisposition, number> = {
    'in-progress': 0,
    verifying: 1,
    'ready-to-integrate': 2,
    ready: 3,
    blocked: 4,
    deferred: 5,
  };
  return (
    order[left.disposition] - order[right.disposition] ||
    right.priority - left.priority ||
    (right.updatedAt ?? '').localeCompare(left.updatedAt ?? '') ||
    left.id.localeCompare(right.id)
  );
};

const readJsonIfExists = async <T>(path: string): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if (isMissingFileError(error)) return undefined;
    throw error;
  }
};

const createEmptyCounts = (): Record<SkoposWorkQueueDisposition, number> => ({
  'in-progress': 0,
  ready: 0,
  deferred: 0,
  blocked: 0,
  verifying: 0,
  'ready-to-integrate': 0,
});

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
