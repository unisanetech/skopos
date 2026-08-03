import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type {
  SkoposDecideRunResult,
  SkoposTaskQuestionArtifact,
  SkoposTaskRecommendationArtifact,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { withSkoposTaskMutationTransaction } from '../coordination/coordination.service.js';
import { resolveCurrentTaskState } from '../shared/current-task-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import { writeSkoposTrackedTaskDocumentRuntime } from '../task/task.service.js';

export interface BuildSkoposDecideRuntimeOptions {
  cwd: string;
  questionId: string;
  optionId: string;
  actor?: string;
  dryRun?: boolean;
}

export const buildSkoposDecideRuntime = async ({
  cwd,
  questionId,
  optionId,
  actor,
  dryRun = false,
}: BuildSkoposDecideRuntimeOptions): Promise<SkoposDecideRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Decision mutation requires --actor <id> or SKOPOS_ACTOR.');
  }
  const initialCurrent = await resolveCurrentTaskState({ workspaceRoot, actorId });
  if (!initialCurrent) {
    throw new Error(`Actor ${actorId} does not own exactly one current Task.`);
  }
  const performMutation = async () => {
    const current = await resolveCurrentTaskState({ workspaceRoot, actorId });
    if (!current || current.task.id !== initialCurrent.task.id) {
      throw new Error(`Actor ${actorId} no longer owns Task ${initialCurrent.task.id}.`);
    }
    const claimedBy = current.task.coordination.claimedBy?.actorId;
    if (claimedBy !== actorId) {
      throw new Error(`Task ${current.task.id} is not claimed by ${actorId}.`);
    }
    const [questions, recommendations] = await Promise.all([
      readJson<SkoposTaskQuestionArtifact>(current.questionsPath),
      readJson<SkoposTaskRecommendationArtifact>(current.recommendationsPath),
    ]);
    const question = questions.entries.find((entry) => entry.id === questionId);
    if (!question) {
      throw new Error(`Task ${current.task.id} has no decision question ${questionId}.`);
    }
    if (!question.options.some((option) => option.id === optionId)) {
      throw new Error(`Question ${questionId} has no option ${optionId}.`);
    }
    const now = new Date().toISOString();
    const resolvedQuestion = {
      ...question,
      status: 'resolved' as const,
      resolvedOptionId: optionId,
      resolvedAt: now,
      resolvedByActorId: actorId,
    };
    const updatedQuestions: SkoposTaskQuestionArtifact = {
      ...questions,
      updatedAt: now,
      entries: questions.entries.map((entry) =>
        entry.id === questionId ? resolvedQuestion : entry,
      ),
    };
    const updatedRecommendations: SkoposTaskRecommendationArtifact = {
      ...recommendations,
      updatedAt: now,
      entries: recommendations.entries.map((entry) =>
        entry.linkedQuestionId === questionId
          ? { ...entry, status: 'complete' as const }
          : entry,
      ),
    };
    const blockingQuestions = updatedQuestions.entries.filter(
      (entry) => entry.blocking && entry.status === 'open',
    );
    const updatedTask = {
      ...current.task,
      updatedAt: now,
      state:
        current.task.state === 'blocked' && blockingQuestions.length === 0
          ? 'active' as const
          : current.task.state,
      coordination: {
        ...current.task.coordination,
        lastUpdatedBy: actorId,
        lastUpdatedAt: now,
      },
      steps: current.task.steps.map((step) =>
        step.id === `decision-${questionId}`
          ? { ...step, status: 'complete' as const }
          : step,
      ),
      questions: updatedQuestions.entries,
      recommendations: updatedRecommendations.entries,
    };
    await Promise.all([
      writeJsonArtifact({
        artifactPath: current.questionsPath,
        artifact: updatedQuestions,
        dryRun,
      }),
      writeJsonArtifact({
        artifactPath: current.recommendationsPath,
        artifact: updatedRecommendations,
        dryRun,
      }),
      writeJsonArtifact({
        artifactPath: current.taskPath,
        artifact: updatedTask,
        dryRun,
      }),
    ]);
    await writeSkoposTrackedTaskDocumentRuntime({
      workspaceRoot,
      task: updatedTask,
      dryRun,
    });
    return {
      current,
      updatedQuestions,
      updatedRecommendations,
      blockingQuestions,
      updatedTask,
      resolvedQuestion,
    };
  };
  const mutation = dryRun
    ? await performMutation()
    : await withSkoposTaskMutationTransaction(
        { cwd: workspaceRoot, taskId: initialCurrent.task.id },
        performMutation,
      );
  const {
    current,
    updatedQuestions,
    updatedRecommendations,
    blockingQuestions,
    updatedTask,
    resolvedQuestion,
  } = mutation;
  const codeAllowed = blockingQuestions.length === 0;
  const recommendedAction = updatedRecommendations.entries.find(
    (entry) => entry.status === 'open',
  );
  const summary = codeAllowed
    ? `Resolved ${questionId}; Task ${updatedTask.id} is admitted.`
    : `Resolved ${questionId}; ${blockingQuestions.length} blocking decision${blockingQuestions.length === 1 ? '' : 's'} remain.`;
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'decision',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary,
    relatedArtifactPaths: [
      current.taskPath,
      current.questionsPath,
      current.recommendationsPath,
    ],
    metadata: {
      actorId,
      taskId: current.task.id,
      questionId,
      selectedOptionId: optionId,
      codeAllowed,
      blockingQuestionCount: blockingQuestions.length,
    },
    dryRun,
  });
  await refreshSkoposKnowledgeIndex({ workspaceRoot, dryRun });

  return {
    workspaceRoot,
    actorId,
    taskId: current.task.id,
    questionId,
    selectedOptionId: optionId,
    summary,
    codeAllowed,
    questionsPath: current.questionsPath,
    questionsWrite: dryRun ? 'dry-run' : 'written',
    questions: updatedQuestions,
    recommendationsPath: current.recommendationsPath,
    recommendationsWrite: dryRun ? 'dry-run' : 'written',
    recommendations: updatedRecommendations,
    resolvedQuestion,
    recommendedAction,
    task: updatedTask,
    taskPath: current.taskPath,
    taskWrite: dryRun ? 'dry-run' : 'written',
  };
};

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, 'utf8')) as T;
