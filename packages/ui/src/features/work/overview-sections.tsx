import * as React from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '../../components/ui/button.js';
import type {
  SkoposUiConsoleAdapterSupportView,
  SkoposUiConsoleMemoryView,
  SkoposUiConsoleState,
  SkoposUiConsoleTaskView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleUnderstandingView,
} from '../../contracts/skopos-ui-console-state.js';
import { ContentSection } from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { countPendingTaskItems } from '../../support/execution/task-metrics.js';
import { formatDateTime } from '../../support/formatting/console-formatting.js';
import { toneForTaskState } from '../../support/ui/tone-helpers.js';

export function NowGuidanceCard({
  state,
}: {
  state: SkoposUiConsoleState;
}): React.JSX.Element {
  const context = state.sessionContext;
  const decision = context?.pendingDecision;
  const interruptedAction = context?.interruptedAction;
  const currentTask = context?.currentTask;
  const recommendedWork = context?.recommendedWork;
  const title = decision
    ? decision.blocking
      ? 'Your decision is needed'
      : 'A decision is recommended'
    : interruptedAction
      ? 'An Action can be resumed'
      : currentTask
        ? 'Continue the current Task'
        : recommendedWork
          ? 'Recommended next work'
          : 'No Session Task selected';
  const description = decision
    ? decision.question
    : interruptedAction
      ? `${interruptedAction.actionId} stopped before it finished.`
      : currentTask
        ? currentTask.nextStep?.title ?? 'Review the Task and choose its next safe step.'
        : recommendedWork
          ? recommendedWork.title
          : context?.summary ?? 'This view has no actor-specific Task selected.';
  const explanation = decision
    ? decision.whyItMatters
    : interruptedAction
      ? 'Resume the recorded run so Evidence and coordination stay connected to the same Task.'
      : currentTask
        ? `${currentTask.completedStepCount} of ${currentTask.totalStepCount} steps are complete in ${currentTask.scopeId}.`
        : recommendedWork
          ? recommendedWork.reason
          : state.tasks.some((taskView) => !['complete', 'cancelled', 'superseded'].includes(taskView.task.state))
            ? 'Several Tasks may be active. Open Work and choose the Task relevant to your Session.'
            : 'Choose from the Work Queue when new implementation should begin.';
  const command =
    interruptedAction?.resumeCommand ??
    context?.nextCommand ??
    (decision?.recommendedOptionId
      ? `skopos decide ${decision.id} ${decision.recommendedOptionId} . --actor <id>`
      : undefined);
  const consequence = decision
    ? decision.blocking
      ? decision.whatHappensAfterAnswer
      : decision.defaultBehavior === 'proceed-with-recommended-if-no-preference' ||
          decision.defaultBehavior === 'proceed-with-recommended'
        ? 'If you have no preference, Skopos can continue with the recommended choice.'
        : decision.whatHappensAfterAnswer
    : interruptedAction
      ? 'The interrupted Action continues from its recorded run and keeps its Evidence attached.'
      : currentTask
        ? currentTask.nextStep
          ? `Completing “${currentTask.nextStep.title}” moves this Task closer to closure.`
          : 'Review closure readiness before finishing this Task.'
        : recommendedWork
          ? 'Starting this work gives the Session one explicit focus and proof boundary.'
          : 'Selecting a Task gives Skopos enough context to guide the next safe action.';

  return (
    <ContentSection
      title={title}
      description={description}
    >
      <div className="border-y border-outline-weak py-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill
            value={
              decision
                ? decision.blocking
                  ? 'decision required'
                  : 'recommendation'
                : interruptedAction
                  ? 'Action interrupted'
                  : currentTask
                    ? 'Task active'
                    : recommendedWork
                      ? 'recommended'
                      : 'no current Task'
            }
            tone={decision ? 'warning' : interruptedAction ? 'warning' : currentTask ? 'info' : 'neutral'}
          />
          {currentTask ? <StatusPill value={currentTask.risk} tone="neutral" /> : null}
        </div>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-label-small uppercase text-on-surface-variant">
              Why this matters
            </p>
            <p className="mt-1.5 text-body-medium leading-6 text-on-surface">{explanation}</p>
          </div>
          <div>
            <p className="text-label-small uppercase text-on-surface-variant">
              What happens next
            </p>
            <p className="mt-1.5 text-body-medium leading-6 text-on-surface">{consequence}</p>
          </div>
        </div>
        {decision?.recommendedOption ? (
          <div className="mt-4 border-l-2 border-[var(--color-primary)] pl-3">
            <p className="text-label-small uppercase text-on-surface-variant">
              Recommended choice
            </p>
            <p className="mt-1 text-title-small text-on-surface">
              {decision.recommendedOption.label}
            </p>
            <p className="mt-1 text-body-small text-on-surface-variant">
              {decision.recommendedOption.rationale}
            </p>
          </div>
        ) : null}
        {command ? (
          <CommandHandoff
            command={command.replace('--actor <id>', '--actor <your-agent-id>')}
            description={
              decision
                ? 'Replace the agent identity, then run this command when you want to record the choice.'
                : 'Replace the agent identity, then run this command to continue from the terminal.'
            }
          />
        ) : null}
        {decision && decision.alternatives.length > 0 ? (
          <details className="mt-4 text-body-small text-on-surface-variant">
            <summary className="cursor-pointer font-medium text-on-surface">
              Consider {decision.alternatives.length} alternative
              {decision.alternatives.length === 1 ? '' : 's'}
            </summary>
            <ul className="mt-2 grid gap-2 pl-4">
              {decision.alternatives.map((alternative) => (
                <li key={alternative.id}>
                  <span className="font-medium text-on-surface">{alternative.label}:</span>{' '}
                  {alternative.rationale}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
      {context && context.additionalPendingDecisionCount > 0 ? (
        <p className="mt-3 text-body-small text-on-surface-variant">
          {context.additionalPendingDecisionCount} more decision
          {context.additionalPendingDecisionCount === 1 ? '' : 's'} will follow after this one.
        </p>
      ) : null}
    </ContentSection>
  );
}

function CommandHandoff({
  command,
  description,
}: {
  command: string;
  description: string;
}): React.JSX.Element {
  const [copyState, setCopyState] = React.useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      if (resetTimer.current !== undefined) {
        window.clearTimeout(resetTimer.current);
      }
    },
  );

  const copyCommand = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(command);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }

    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 1800);
  };

  return (
    <div className="mt-4 rounded-sm bg-surface-container px-3 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-label-small uppercase text-on-surface-variant">
            Continue from the terminal
          </p>
          <p className="mt-1 text-body-small text-on-surface-variant">
            {description}
          </p>
        </div>
        <Button
          variant="tonal"
          size="sm"
          onClick={() => {
            void copyCommand();
          }}
          aria-label="Copy command"
        >
          {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy command'}
        </Button>
      </div>
      <code className="mt-2 block overflow-x-auto text-body-small leading-5 text-on-surface">
        {command}
      </code>
    </div>
  );
}

export function OverviewInspectorAside({
  activeTaskCount,
  attentionLabel,
  decisionLabel,
  proofPassRate,
  generatedAt,
}: {
  activeTaskCount: number;
  attentionLabel: string;
  decisionLabel?: string;
  proofPassRate?: string;
  generatedAt?: string;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: 'Active tasks', value: String(activeTaskCount) },
          ...(decisionLabel ? [{ label: 'Decision', value: decisionLabel }] : []),
          { label: 'Attention', value: attentionLabel },
          ...(proofPassRate ? [{ label: 'Evidence pass rate', value: proofPassRate }] : []),
          ...(generatedAt
            ? [{ label: 'Generated', value: formatDateTime(generatedAt) }]
            : []),
        ]}
      />
    </SidebarCard>
  );
}

export function TaskFocusCard({
  tasks,
}: {
  tasks: SkoposUiConsoleTaskView[];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Current focus"
      description="The work Skopos is actively tracking right now."
    >
      {tasks.length > 0 ? (
        <div className="border-y border-outline-weak">
          {tasks.slice(0, 3).map((taskView, index) => (
            <Link
              key={taskView.task.id}
              to="/tasks/$taskId"
              params={{ taskId: taskView.task.id }}
              className={`block py-3.5 transition-colors hover:bg-state-hover ${
                index > 0 ? 'border-t border-outline-weak' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill
                      value={taskView.task.state}
                      tone={toneForTaskState(taskView.task.state)}
                    />
                    {taskView.task.coordination.claimedBy?.actorId ? (
                      <StatusPill
                        value={`claimed ${taskView.task.coordination.claimedBy.actorId}`}
                        tone="neutral"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-title-small">
                    {taskView.task.title}
                  </h3>
                  {taskView.task.summary ? (
                    <p className="mt-1 text-body-small text-on-surface-variant">
                      {taskView.task.summary}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-1.5 text-right text-body-small text-on-surface-variant">
                  <span>{taskView.task.scope.scope.title}</span>
                  <span>{countPendingTaskItems(taskView.task)} pending items</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No active tasks"
          description="Skopos is not tracking an active work session yet. If files are changing, start or claim a task so progress, decisions, and evidence stay connected."
        />
      )}
    </ContentSection>
  );
}

export function OverviewUnderstandingCard({
  understanding,
}: {
  understanding?: SkoposUiConsoleUnderstandingView;
}): React.JSX.Element {
  return (
    <ContentSection
      title="Repo understanding"
      description="A compact orientation layer for what this project appears to be and where to look first."
    >
      {understanding ? (
        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusPill value={understanding.summary.repoMode} tone="neutral" />
              <StatusPill value={understanding.summary.archetype} tone="info" />
              <StatusPill
                value={`${understanding.featureInventory.features.length} areas`}
                tone="neutral"
              />
              {understanding.setupReview ? (
                <StatusPill
                  value={
                    understanding.setupReview.readiness === 'ready'
                      ? 'setup ready'
                      : 'needs confirmation'
                  }
                  tone={understanding.setupReview.readiness === 'ready' ? 'positive' : 'warning'}
                />
              ) : null}
            </div>
            <p className="mt-3 text-body-medium text-on-surface">
              {understanding.summary.purpose}
            </p>
            {understanding.setupReview ? (
              <p className="mt-2 text-body-small text-on-surface-variant">
                Setup review has {understanding.setupReview.assumptions.length} assumption
                {understanding.setupReview.assumptions.length === 1 ? '' : 's'} and{' '}
                {understanding.setupReview.openConfirmationQuestions.length} open question
                {understanding.setupReview.openConfirmationQuestions.length === 1 ? '' : 's'}.
                {understanding.setupReview.answeredQuestions.length > 0
                  ? ` ${understanding.setupReview.answeredQuestions.length} setup question${understanding.setupReview.answeredQuestions.length === 1 ? '' : 's'} already answered.`
                  : ' Answer setup questions before broad work.'}
              </p>
            ) : null}
          </div>
          <div className="border-y border-outline-weak">
            {understanding.summary.mainAreas.slice(0, 5).map((area, index) => (
              <div
                key={`${area.title}-${area.path}`}
                className={`py-3.5 ${index > 0 ? 'border-t border-outline-weak' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body-medium font-medium">{area.title}</p>
                    <p className="mt-1 text-body-small text-on-surface-variant">
                      {area.summary}
                    </p>
                  </div>
                  <div className="grid gap-1.5 text-right text-body-small text-on-surface-variant">
                    <span className="font-mono">{area.path}</span>
                    <span>{area.confidence} confidence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-label-medium uppercase text-on-surface-variant">
              First places to look
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {understanding.hotspots.hotspots.slice(0, 6).map((hotspot) => (
                <StatusPill key={hotspot.id} value={hotspot.path} tone="neutral" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <EmptyMessage
          title="No repo understanding yet"
          description="Run `skopos setup` to build or refresh the project summary, feature inventory, and implementation hotspots."
        />
      )}
    </ContentSection>
  );
}

export function OverviewProjectKnowledgeCard({
  memoryView,
}: {
  memoryView?: SkoposUiConsoleMemoryView;
}): React.JSX.Element {
  const mappedCount = memoryView?.memory.roles.filter((role) => role.status === 'mapped').length ?? 0;
  const totalCount = memoryView?.memory.roles.length ?? 0;
  const attentionCount = memoryView?.memory.roles.filter((role) => role.status !== 'mapped').length ?? 0;

  return (
    <ContentSection
      title="Project knowledge"
      description="What Skopos knows before agents start work."
    >
      {memoryView ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <StatusPill
              value={`${mappedCount}/${totalCount} areas known`}
              tone={attentionCount === 0 ? 'positive' : 'warning'}
            />
            <StatusPill
              value={`${attentionCount} need attention`}
              tone={attentionCount === 0 ? 'positive' : 'warning'}
            />
            <StatusPill
              value={memoryView.communicationBrief ? 'agent guide ready' : 'agent guide missing'}
              tone={memoryView.communicationBrief ? 'positive' : 'warning'}
            />
            <StatusPill value={memoryView.memory.freshness} tone="neutral" />
          </div>
          <p className="text-body-medium text-on-surface">
            {attentionCount === 0
              ? 'Skopos found clear sources for the main project knowledge areas. Agents can use this as a compact starting point before reading deeper docs.'
              : 'Some project knowledge areas still need review. Check them before broad or risky agent work.'}
          </p>
          <div className="border-y border-outline-weak">
            {memoryView.memory.roles.slice(0, 4).map((role, index) => (
              <div
                key={role.role}
                className={`py-3.5 ${index > 0 ? 'border-t border-outline-weak' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body-medium font-medium">{role.title}</p>
                    <p className="mt-1 text-body-small text-on-surface-variant">
                      {role.summary}
                    </p>
                  </div>
                  <StatusPill
                    value={role.status}
                    tone={role.status === 'mapped' ? 'positive' : 'warning'}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/memory"
            className="inline-flex text-label-medium text-primary hover:underline"
          >
            Open Project Knowledge
          </Link>
        </div>
      ) : (
        <EmptyMessage
          title="Project knowledge is not available"
          description="Run `skopos setup` to build or refresh the project knowledge view."
        />
      )}
    </ContentSection>
  );
}

export function OverviewRecentPlansCard({
  recentPlans,
}: {
  recentPlans: SkoposUiConsolePlanView[];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Recent plans"
      description="Planning notes for larger or riskier work that needs a clear path before editing."
    >
      {recentPlans.length > 0 ? (
        <div className="border-y border-outline-weak">
          {recentPlans.map((planView, index) => (
            <Link
              key={planView.plan.id}
              to="/plans/$planId"
              params={{ planId: planView.plan.id }}
              className={`block py-3.5 transition-colors hover:bg-state-hover ${
                index > 0 ? 'border-t border-outline-weak' : ''
              }`}
            >
              <p className="text-body-medium font-medium">{planView.plan.title}</p>
              <p className="mt-1 text-body-small text-on-surface-variant">
                {planView.plan.summary}
              </p>
              <p className="mt-1.5 text-body-small text-on-surface-variant">
                {formatDateTime(planView.plan.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No recent plans"
          description="Small tasks may not need a saved plan. Bigger changes will show here once Skopos creates or links a plan."
        />
      )}
    </ContentSection>
  );
}

export function OverviewAdapterSupportCard({
  adapterSupport,
}: {
  adapterSupport?: SkoposUiConsoleAdapterSupportView;
}): React.JSX.Element {
  return (
    <ContentSection
      title="Adapter support"
      description="How well connected coding tools can resume Skopos context without losing the thread."
    >
      {adapterSupport && adapterSupport.adapters.length > 0 ? (
        <div className="border-y border-outline-weak">
          {adapterSupport.adapters.map((adapter, index) => {
            const coveredEvents = Object.values(adapter.lifecycleCoverage).filter(Boolean).length;
            const actionRouterCoverageCount = Object.values(adapter.actionRouterCoverage).filter(
              Boolean,
            ).length;
            return (
              <div
                key={adapter.toolId}
                className={`py-3.5 ${index > 0 ? 'border-t border-outline-weak' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill value={adapter.supportStatus} tone="positive" />
                      <StatusPill value={adapter.supportTier} tone="neutral" />
                    </div>
                    <h3 className="mt-2 text-title-small">
                      {adapter.displayName}
                    </h3>
                    <p className="mt-1 text-body-small text-on-surface-variant">
                      {adapter.summary}
                    </p>
                  </div>
                  <div className="grid gap-1.5 text-right text-body-small text-on-surface-variant">
                    <span>{coveredEvents}/5 lifecycle events</span>
                    <span>{actionRouterCoverageCount}/2 router boundaries</span>
                    <span>{adapter.installMode}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusPill
                    value={
                      adapter.actionRouterCoverage.sessionStart
                        ? 'router-guided resume'
                        : 'no router resume'
                    }
                    tone={adapter.actionRouterCoverage.sessionStart ? 'positive' : 'neutral'}
                  />
                  <StatusPill
                    value={
                      adapter.actionRouterCoverage.stopBoundary
                        ? 'router-enforced stop'
                        : 'no stop enforcement'
                    }
                    tone={adapter.actionRouterCoverage.stopBoundary ? 'positive' : 'neutral'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyMessage
          title="No adapter support indexed"
          description="Generated enforcement adapters will appear here once the workspace has current adapter state."
        />
      )}
    </ContentSection>
  );
}
