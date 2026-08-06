import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleDiscussionCheckpointView,
  SkoposUiConsoleDiscussionHandoffView,
  SkoposUiConsoleTaskView,
} from '../../contracts/skopos-ui-console-state.js';
import { ContentSection } from '../../patterns/sections/content-primitives.js';
import { EmptyMessage, StatusPill } from '../../patterns/sections/inspector-primitives.js';

const formatDiscussionPromotionTrigger = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value.replaceAll('-', ' ');
};

const formatDiscussionPromotionKind = (value: string): string => value.replaceAll('-', ' ');

function FreshContinuationSummary({ view }: { view: SkoposUiConsoleDiscussionHandoffView }): React.JSX.Element {
  const handoff = view.handoff;
  const visibleStatements = handoff.conversationCapsule.statements.filter((statement) =>
    ['objective', 'user-intent', 'constraint', 'completed-work', 'stopping-point', 'rejected-approach', 'open-question', 'recommended-first-action', 'exclusion'].includes(statement.section),
  );
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill value={handoff.validation.freshness} tone={handoff.validation.safeToTransfer ? 'positive' : 'warning'} />
        <StatusPill value={handoff.delivery.state} tone={handoff.delivery.state === 'delivered' || handoff.delivery.state === 'accepted' ? 'positive' : 'info'} />
        <StatusPill value={`${handoff.estimatedTokens}/${handoff.budgetTokens} tokens`} tone={handoff.overBudget ? 'warning' : 'neutral'} />
      </div>
      <p className="mt-2 text-body-medium font-medium">{handoff.currentDirection}</p>
      <div className="mt-2 space-y-2">
        {visibleStatements.map((statement) => (
          <div key={statement.id}>
            <p className="text-label-small uppercase text-on-surface-variant">{statement.section.replaceAll('-', ' ')}</p>
            <p className="mt-0.5 text-body-small text-on-surface">{statement.text}</p>
          </div>
        ))}
      </div>
      {handoff.validation.reasons.length > 0 ? (
        <p className="mt-2 text-body-small text-on-surface-variant">{handoff.validation.reasons.join(' ')}</p>
      ) : null}
    </div>
  );
}

export function OverviewRecentDiscussionCard({
  latestDiscussionHandoff,
  recentDiscussionCheckpoints,
  activeTaskView,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  recentDiscussionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  activeTaskView?: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  const currentDirection =
    latestDiscussionHandoff?.handoff.currentDirection ??
    recentDiscussionCheckpoints[0]?.checkpoint.currentDirection;
  const openQuestionCount =
    latestDiscussionHandoff?.handoff.openQuestions.length ??
    recentDiscussionCheckpoints[0]?.checkpoint.openQuestions.length ??
    0;

  return (
    <ContentSection
      title="Current discussion context"
      description="The latest accepted direction attached to this Task."
    >
      {currentDirection ? (
        <div className="border-y border-outline-weak py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill value="accepted direction" tone="info" />
            {openQuestionCount > 0 ? (
              <StatusPill
                value={`${openQuestionCount} open question${openQuestionCount === 1 ? '' : 's'}`}
                tone="warning"
              />
            ) : null}
          </div>
          <p className="mt-2 text-body-medium leading-6 text-on-surface">
            {currentDirection}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {activeTaskView ? (
            <Link
              to="/tasks/$taskId"
              params={{ taskId: activeTaskView.task.id }}
              className="text-label-medium text-primary hover:underline"
            >
              Open current Task
            </Link>
            ) : null}
            <Link
              to="/discussion"
              className="text-label-medium text-primary hover:underline"
            >
              Open Discussion
            </Link>
          </div>
        </div>
      ) : (
        <EmptyMessage
          title="No current discussion context"
          description="This Task has no attached discussion handoff or checkpoint."
        />
      )}
    </ContentSection>
  );
}

export function TaskDiscussionContextCard({
  latestDiscussionHandoff,
  taskCheckpoints,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  taskCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Discussion context"
      description="Keep the current task tied to the latest accepted direction and unresolved discussion pressure."
    >
      {Boolean(latestDiscussionHandoff) || taskCheckpoints.length > 0 ? (
        <div className="border-y border-outline-weak">
          {latestDiscussionHandoff ? (
            <section className="py-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill
                  value={`${latestDiscussionHandoff.handoff.acceptedDecisions.length} accepted decisions`}
                  tone={
                    latestDiscussionHandoff.handoff.acceptedDecisions.length > 0 ? 'positive' : 'neutral'
                  }
                />
                <StatusPill
                  value={`${latestDiscussionHandoff.handoff.openQuestions.length} open questions`}
                  tone={
                    latestDiscussionHandoff.handoff.openQuestions.length > 0 ? 'warning' : 'positive'
                  }
                />
              </div>
              <div className="mt-2"><FreshContinuationSummary view={latestDiscussionHandoff} /></div>
            </section>
          ) : null}
          {latestDiscussionHandoff && latestDiscussionHandoff.handoff.acceptedDecisions.length > 0 ? (
            <section className="border-t border-outline-weak py-3.5">
              <p className="text-label-small uppercase text-on-surface-variant">
                Accepted direction
              </p>
              <div className="mt-2 space-y-2">
                {latestDiscussionHandoff.handoff.acceptedDecisions.slice(0, 3).map((decision) => (
                  <div key={decision.id}>
                    <p className="text-body-small font-medium">{decision.title}</p>
                    <p className="mt-0.5 text-body-small text-on-surface-variant">
                      {decision.resolvedOptionLabel ?? decision.resolvedOptionId}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {latestDiscussionHandoff && latestDiscussionHandoff.handoff.openQuestions.length > 0 ? (
            <section className="border-t border-outline-weak py-3.5">
              <p className="text-label-small uppercase text-on-surface-variant">
                Open questions
              </p>
              <div className="mt-2 space-y-2">
                {latestDiscussionHandoff.handoff.openQuestions.slice(0, 3).map((question) => (
                  <div key={question.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-body-small font-medium">{question.title}</p>
                      {question.blocking ? (
                        <StatusPill value="blocking" tone="warning" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-body-small text-on-surface-variant">
                      Recommended option: {question.recommendedOptionId}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {latestDiscussionHandoff?.handoff.recommendedNextCommand ? (
            <section className="border-t border-outline-weak py-3.5">
              <p className="text-label-small uppercase text-on-surface-variant">
                Recommended next command
              </p>
              <p className="mt-1.5 overflow-x-auto text-body-small text-on-surface [font-family:var(--font-mono,ui-monospace,SFMono-Regular,Menlo,monospace)]">
                {latestDiscussionHandoff.handoff.recommendedNextCommand}
              </p>
            </section>
          ) : null}
          {taskCheckpoints.length > 0 ? (
            <section className="border-t border-outline-weak py-3.5">
              <p className="text-label-small uppercase text-on-surface-variant">
                Checkpoint history
              </p>
              <div className="mt-2 space-y-2">
                {taskCheckpoints.slice(0, 4).map((checkpointView) => (
                  <div key={checkpointView.checkpoint.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-body-small font-medium">
                        {checkpointView.checkpoint.currentDirection}
                      </p>
                      {(() => {
                        const triggerLabel = formatDiscussionPromotionTrigger(
                          checkpointView.checkpoint.promotionTrigger,
                        );

                        return triggerLabel ? <StatusPill value={triggerLabel} tone="info" /> : null;
                      })()}
                      {checkpointView.checkpoint.overBudget ? (
                        <StatusPill value="over budget" tone="warning" />
                      ) : null}
                    </div>
                    {checkpointView.checkpoint.promotionKinds?.length ? (
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {checkpointView.checkpoint.promotionKinds.slice(0, 3).map((kind) => (
                          <StatusPill key={kind} value={formatDiscussionPromotionKind(kind)} tone="neutral" />
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-0.5 text-body-small text-on-surface-variant">
                      {checkpointView.checkpoint.resumeSummary}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <EmptyMessage
          title="No current discussion context"
          description={
            taskCheckpoints.length > 0
              ? 'Checkpoint history exists for this task, but no latest handoff currently points at it.'
              : 'The latest handoff belongs to a different task, or discussion resume state has not been generated yet.'
          }
        />
      )}
    </ContentSection>
  );
}

export function DiscussionGuidanceCard({
  latestDiscussionHandoff,
  checkpointCount,
  activeTaskCount,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  checkpointCount: number;
  activeTaskCount: number;
}): React.JSX.Element {
  const openQuestionCount = latestDiscussionHandoff?.handoff.openQuestions.length ?? 0;

  return (
    <ContentSection
      title="How to use this page"
      description="Discussion keeps the useful parts of agent conversations: accepted direction, open questions, next commands, and checkpoints."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Start here"
          text={
            openQuestionCount > 0
              ? 'Answer the open discussion questions before asking the agent to continue.'
              : latestDiscussionHandoff
                ? 'Read the latest handoff to understand the current direction.'
                : 'No latest handoff is available yet.'
          }
        />
        <GuidancePoint
          label="Use when"
          text="You need to resume context, understand what was agreed, or see why the agent is continuing a certain way."
        />
        <GuidancePoint
          label="Next step"
          text={
            activeTaskCount > 0
              ? 'Open the linked task when the discussion belongs to active work.'
              : checkpointCount > 0
                ? 'Review checkpoints when you need older reasoning history.'
                : 'Generate a handoff or checkpoint during active work to populate this page.'
          }
        />
      </div>
    </ContentSection>
  );
}

export function DiscussionHistoryCard({
  latestDiscussionHandoff,
  checkpoints,
  taskTitleById,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  checkpoints: SkoposUiConsoleDiscussionCheckpointView[];
  taskTitleById: Record<string, string>;
}): React.JSX.Element {
  return (
    <ContentSection
      title="Saved discussion context"
      description="The latest handoff appears first, followed by checkpoints that explain how the work direction changed over time."
    >
      {latestDiscussionHandoff || checkpoints.length > 0 ? (
        <div className="border-y border-outline-weak">
          {latestDiscussionHandoff ? (
            <section className="py-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill
                  value={latestDiscussionHandoff.handoff.handoffKind.replaceAll('-', ' ')}
                  tone="info"
                />
                <StatusPill
                  value={`${latestDiscussionHandoff.handoff.acceptedDecisions.length} accepted decisions`}
                  tone={
                    latestDiscussionHandoff.handoff.acceptedDecisions.length > 0 ? 'positive' : 'neutral'
                  }
                />
                <StatusPill
                  value={`${latestDiscussionHandoff.handoff.openQuestions.length} open questions`}
                  tone={
                    latestDiscussionHandoff.handoff.openQuestions.length > 0 ? 'warning' : 'positive'
                  }
                />
              </div>
              <div className="mt-2"><FreshContinuationSummary view={latestDiscussionHandoff} /></div>
            </section>
          ) : null}
          {checkpoints.length > 0 ? (
            <section className={`${latestDiscussionHandoff ? 'border-t border-outline-weak ' : ''}py-3.5`}>
              <p className="text-label-small uppercase text-on-surface-variant">
                Checkpoints
              </p>
              <div className="mt-2 space-y-2.5">
                {checkpoints.map((checkpointView) => {
                  const taskId = checkpointView.checkpoint.activeTaskId;
                  const taskTitle = taskId ? taskTitleById[taskId] : undefined;

                  return (
                    <div key={checkpointView.checkpoint.id} className="rounded-sm border border-outline-weak px-3.5 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill
                          value={checkpointView.checkpoint.checkpointKind.replaceAll('-', ' ')}
                          tone="info"
                        />
                        {(() => {
                          const triggerLabel = formatDiscussionPromotionTrigger(
                            checkpointView.checkpoint.promotionTrigger,
                          );

                          return triggerLabel ? <StatusPill value={triggerLabel} tone="info" /> : null;
                        })()}
                        {checkpointView.checkpoint.overBudget ? (
                          <StatusPill value="over budget" tone="warning" />
                        ) : (
                          <StatusPill
                            value={`${checkpointView.checkpoint.estimatedTokens} tokens`}
                            tone="neutral"
                          />
                        )}
                        {taskId ? (
                          <Link
                            to="/tasks/$taskId"
                            params={{ taskId }}
                            className="text-label-small uppercase text-primary hover:underline"
                          >
                            {taskTitle ?? taskId}
                          </Link>
                        ) : null}
                      </div>
                      <p className="mt-2 text-body-small font-medium">
                        {checkpointView.checkpoint.currentDirection}
                      </p>
                      {checkpointView.checkpoint.promotionKinds?.length ? (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {checkpointView.checkpoint.promotionKinds.map((kind) => (
                            <StatusPill key={kind} value={formatDiscussionPromotionKind(kind)} tone="neutral" />
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-1 text-body-small text-on-surface-variant">
                        {checkpointView.checkpoint.resumeSummary}
                      </p>
                      {checkpointView.checkpoint.supersedesCheckpointId ? (
                        <p className="mt-1 text-label-small text-on-surface-variant">
                          Supersedes {checkpointView.checkpoint.supersedesCheckpointId}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <EmptyMessage
          title="No discussion history yet"
          description="Discussion context will appear here after Skopos records a handoff or checkpoint during active work."
        />
      )}
    </ContentSection>
  );
}

function GuidancePoint({
  label,
  text,
}: {
  label: string;
  text: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-outline-weak pt-3">
      <p className="text-label-small uppercase text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 text-body-small text-on-surface">
        {text}
      </p>
    </div>
  );
}
