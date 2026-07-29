import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleDiscussionCheckpointView,
  SkoposUiConsoleDiscussionHandoffView,
  SkoposUiConsoleTaskView,
} from '../../contracts/skopos-ui-console-state.js';
import { Card } from '../../patterns/sections/content-primitives.js';
import { EmptyMessage, StatusPill } from '../../patterns/sections/inspector-primitives.js';

const formatDiscussionPromotionTrigger = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value.replaceAll('-', ' ');
};

const formatDiscussionPromotionKind = (value: string): string => value.replaceAll('-', ' ');

export function OverviewRecentDiscussionCard({
  latestDiscussionHandoff,
  recentDiscussionCheckpoints,
  activeTaskView,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  recentDiscussionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  activeTaskView?: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  const hasDiscussionState = Boolean(latestDiscussionHandoff) || recentDiscussionCheckpoints.length > 0;

  return (
    <Card
      title="Recent discussion"
      description="The latest action handoff keeps accepted direction visible without replaying the full chat."
    >
      {hasDiscussionState ? (
        <div className="border-y border-[var(--line)]">
          {latestDiscussionHandoff ? (
            <section className="py-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill
                  value={latestDiscussionHandoff.handoff.handoffKind.replaceAll('-', ' ')}
                  tone="info"
                />
                {latestDiscussionHandoff.handoff.overBudget ? (
                  <StatusPill value="over budget" tone="warning" />
                ) : (
                  <StatusPill
                    value={`${latestDiscussionHandoff.handoff.estimatedTokens} tokens`}
                    tone="neutral"
                  />
                )}
                <StatusPill
                  value={`${latestDiscussionHandoff.handoff.openQuestions.length} open questions`}
                  tone={
                    latestDiscussionHandoff.handoff.openQuestions.length > 0 ? 'warning' : 'positive'
                  }
                />
              </div>
              <p className="mt-2 text-[13px] font-medium tracking-[-0.02em]">
                {latestDiscussionHandoff.handoff.currentDirection}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                {latestDiscussionHandoff.handoff.resumeSummary}
              </p>
            </section>
          ) : null}
          {activeTaskView && latestDiscussionHandoff ? (
            <Link
              to="/tasks/$taskId"
              params={{ taskId: activeTaskView.task.id }}
              className="block border-t border-[var(--line)] py-3.5 transition-colors hover:bg-[color:rgba(255,252,246,0.4)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Active task
              </p>
              <p className="mt-1.5 text-[12.75px] font-medium tracking-[-0.01em]">
                {activeTaskView.task.title}
              </p>
              <p className="mt-1 text-[12px] leading-[1.35rem] text-[var(--muted)]">
                {activeTaskView.task.summary}
              </p>
            </Link>
          ) : null}
          {recentDiscussionCheckpoints.length > 0 ? (
            <section className="border-t border-[var(--line)] py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Checkpoint history
              </p>
              <div className="mt-2 space-y-2">
                {recentDiscussionCheckpoints.slice(0, 3).map((checkpointView) => (
                  <div key={checkpointView.checkpoint.id}>
                    <p className="text-[12.75px] font-medium tracking-[-0.01em]">
                      {checkpointView.checkpoint.currentDirection}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-[1.35rem] text-[var(--muted)]">
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
          title="No recent discussion yet"
          description="A action handoff will appear here once the runtime has current discussion resume state."
        />
      )}
    </Card>
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
    <Card
      title="Discussion context"
      description="Keep the current task tied to the latest accepted direction and unresolved discussion pressure."
    >
      {Boolean(latestDiscussionHandoff) || taskCheckpoints.length > 0 ? (
        <div className="border-y border-[var(--line)]">
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
              <p className="mt-2 text-[13px] font-medium tracking-[-0.02em]">
                {latestDiscussionHandoff.handoff.currentDirection}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                {latestDiscussionHandoff.handoff.resumeSummary}
              </p>
            </section>
          ) : null}
          {latestDiscussionHandoff && latestDiscussionHandoff.handoff.acceptedDecisions.length > 0 ? (
            <section className="border-t border-[var(--line)] py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Accepted direction
              </p>
              <div className="mt-2 space-y-2">
                {latestDiscussionHandoff.handoff.acceptedDecisions.slice(0, 3).map((decision) => (
                  <div key={decision.id}>
                    <p className="text-[12.75px] font-medium tracking-[-0.01em]">{decision.title}</p>
                    <p className="mt-0.5 text-[12px] leading-[1.35rem] text-[var(--muted)]">
                      {decision.resolvedOptionLabel ?? decision.resolvedOptionId}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {latestDiscussionHandoff && latestDiscussionHandoff.handoff.openQuestions.length > 0 ? (
            <section className="border-t border-[var(--line)] py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Open questions
              </p>
              <div className="mt-2 space-y-2">
                {latestDiscussionHandoff.handoff.openQuestions.slice(0, 3).map((question) => (
                  <div key={question.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[12.75px] font-medium tracking-[-0.01em]">{question.title}</p>
                      {question.blocking ? (
                        <StatusPill value="blocking" tone="warning" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[12px] leading-[1.35rem] text-[var(--muted)]">
                      Recommended option: {question.recommendedOptionId}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {latestDiscussionHandoff?.handoff.recommendedNextCommand ? (
            <section className="border-t border-[var(--line)] py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Recommended next command
              </p>
              <p className="mt-1.5 overflow-x-auto text-[12px] leading-[1.35rem] text-[var(--muted-strong)] [font-family:var(--font-mono,ui-monospace,SFMono-Regular,Menlo,monospace)]">
                {latestDiscussionHandoff.handoff.recommendedNextCommand}
              </p>
            </section>
          ) : null}
          {taskCheckpoints.length > 0 ? (
            <section className="border-t border-[var(--line)] py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Checkpoint history
              </p>
              <div className="mt-2 space-y-2">
                {taskCheckpoints.slice(0, 4).map((checkpointView) => (
                  <div key={checkpointView.checkpoint.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[12.75px] font-medium tracking-[-0.01em]">
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
                    <p className="mt-0.5 text-[12px] leading-[1.35rem] text-[var(--muted)]">
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
    </Card>
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
    <Card
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
    </Card>
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
    <Card
      title="Saved discussion context"
      description="The latest handoff appears first, followed by checkpoints that explain how the work direction changed over time."
    >
      {latestDiscussionHandoff || checkpoints.length > 0 ? (
        <div className="border-y border-[var(--line)]">
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
              <p className="mt-2 text-[13px] font-medium tracking-[-0.02em]">
                {latestDiscussionHandoff.handoff.currentDirection}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                {latestDiscussionHandoff.handoff.resumeSummary}
              </p>
            </section>
          ) : null}
          {checkpoints.length > 0 ? (
            <section className={`${latestDiscussionHandoff ? 'border-t border-[var(--line)] ' : ''}py-3.5`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Checkpoints
              </p>
              <div className="mt-2 space-y-2.5">
                {checkpoints.map((checkpointView) => {
                  const taskId = checkpointView.checkpoint.activeTaskId;
                  const taskTitle = taskId ? taskTitleById[taskId] : undefined;

                  return (
                    <div key={checkpointView.checkpoint.id} className="rounded-[18px] border border-[var(--line)] px-3.5 py-3">
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
                            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)] hover:underline"
                          >
                            {taskTitle ?? taskId}
                          </Link>
                        ) : null}
                      </div>
                      <p className="mt-2 text-[12.75px] font-medium tracking-[-0.01em]">
                        {checkpointView.checkpoint.currentDirection}
                      </p>
                      {checkpointView.checkpoint.promotionKinds?.length ? (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {checkpointView.checkpoint.promotionKinds.map((kind) => (
                            <StatusPill key={kind} value={formatDiscussionPromotionKind(kind)} tone="neutral" />
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-1 text-[12px] leading-[1.35rem] text-[var(--muted)]">
                        {checkpointView.checkpoint.resumeSummary}
                      </p>
                      {checkpointView.checkpoint.supersedesCheckpointId ? (
                        <p className="mt-1 text-[11.5px] leading-[1.3rem] text-[var(--muted)]">
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
    </Card>
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
    <div className="border-t border-[var(--line)] pt-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]">
        {text}
      </p>
    </div>
  );
}
