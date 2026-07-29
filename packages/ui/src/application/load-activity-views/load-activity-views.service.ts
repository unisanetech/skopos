import { join, resolve } from 'node:path';

import { loadSkoposActivityArtifacts } from '../../adapters/activity-artifact-loader.adapter.js';
import type {
  SkoposUiActionRunSummary,
  SkoposUiActivityViewsResult,
  SkoposUiOperationalEventSummary,
  SkoposUiPlanSummary,
  SkoposUiTaskSummary,
} from '../../contracts/skopos-ui-activity-view.js';

export const loadSkoposUiActivityViews = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposUiActivityViewsResult> => {
  const workspaceRoot = resolve(cwd);
  const artifacts = await loadSkoposActivityArtifacts(workspaceRoot);
  return {
    workspaceRoot,
    plans: [],
    tasks: artifacts.tasks
      .map(
        (task): SkoposUiTaskSummary => ({
          id: task.id,
          title: task.title,
          summary: task.goal,
          parentTaskId: task.parentTaskId,
          state: task.state,
          scopeId: task.scope.scope.id,
          pendingStepCount: task.steps.filter(
            (step) => step.status !== 'complete' && step.status !== 'skipped',
          ).length,
          childTaskCount: task.childTasks.length,
          selectedActionIds: task.selectedActions.map((action) => action.id),
          claimedByActorId: task.coordination.claimedBy?.actorId,
          lastUpdatedByActorId: task.coordination.lastUpdatedBy,
          updatedAt: task.updatedAt,
          artifactPath: join(
            workspaceRoot,
            '.skopos/tasks',
            task.taskIdentity.worktreeId,
            task.id,
            'task.json',
          ),
        }),
      )
      .sort(sortByUpdatedAt)
      .slice(0, 8),
    actionRuns: artifacts.actionRuns
      .map(
        (run): SkoposUiActionRunSummary => ({
          id: run.id,
          actionId: run.actionId,
          actionTitle: run.actionTitle,
          runStatus: run.runStatus,
          outputPaths: run.outputPaths,
          runByActorId: run.runByActorId,
          finishedAt: run.finishedAt,
          artifactPath: join(workspaceRoot, '.skopos/runs', `${run.id}.json`),
        }),
      )
      .sort(sortByUpdatedAt)
      .slice(0, 8),
    operationalEvents: artifacts.operationalLog
      .map(
        (event): SkoposUiOperationalEventSummary => ({
          id: event.id,
          eventKind: event.eventKind,
          status: event.status,
          summary: event.summary,
          actorId:
            typeof event.metadata?.actorId === 'string'
              ? event.metadata.actorId
              : undefined,
          timestamp: event.timestamp,
        }),
      )
      .sort((left, right) => Date.parse(right.timestamp) - Date.parse(left.timestamp))
      .slice(0, 12),
  };
};

const sortByUpdatedAt = (
  left: { updatedAt?: string; finishedAt?: string },
  right: { updatedAt?: string; finishedAt?: string },
): number =>
  (Date.parse(right.updatedAt ?? right.finishedAt ?? '') || 0) -
  (Date.parse(left.updatedAt ?? left.finishedAt ?? '') || 0);
