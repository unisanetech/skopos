import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleDiscussionCheckpointView,
  SkoposUiConsoleDiscussionHandoffView,
  SkoposUiConsoleMissionView,
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
  activeMissionView,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  recentDiscussionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
  activeMissionView?: SkoposUiConsoleMissionView;
}): React.JSX.Element {
  const hasDiscussionState = Boolean(latestDiscussionHandoff) || recentDiscussionCheckpoints.length > 0;

  return (
    <Card
      title="Recent discussion"
      description="The latest workflow handoff keeps accepted direction visible without replaying the full chat."
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
          {activeMissionView && latestDiscussionHandoff ? (
            <Link
              to="/missions/$missionId"
              params={{ missionId: activeMissionView.mission.id }}
              className="block border-t border-[var(--line)] py-3.5 transition-colors hover:bg-[color:rgba(255,252,246,0.4)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Active mission
              </p>
              <p className="mt-1.5 text-[12.75px] font-medium tracking-[-0.01em]">
                {activeMissionView.mission.title}
              </p>
              <p className="mt-1 text-[12px] leading-[1.35rem] text-[var(--muted)]">
                {activeMissionView.mission.summary}
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
          description="A workflow handoff will appear here once the runtime has current discussion resume state."
        />
      )}
    </Card>
  );
}

export function MissionDiscussionContextCard({
  latestDiscussionHandoff,
  missionCheckpoints,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  missionCheckpoints: SkoposUiConsoleDiscussionCheckpointView[];
}): React.JSX.Element {
  return (
    <Card
      title="Discussion context"
      description="Keep the current mission tied to the latest accepted direction and unresolved discussion pressure."
    >
      {Boolean(latestDiscussionHandoff) || missionCheckpoints.length > 0 ? (
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
          {missionCheckpoints.length > 0 ? (
            <section className="border-t border-[var(--line)] py-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Checkpoint history
              </p>
              <div className="mt-2 space-y-2">
                {missionCheckpoints.slice(0, 4).map((checkpointView) => (
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
            missionCheckpoints.length > 0
              ? 'Checkpoint history exists for this mission, but no latest handoff currently points at it.'
              : 'The latest handoff belongs to a different mission, or discussion resume state has not been generated yet.'
          }
        />
      )}
    </Card>
  );
}

export function DiscussionHistoryCard({
  latestDiscussionHandoff,
  checkpoints,
  missionTitleById,
}: {
  latestDiscussionHandoff?: SkoposUiConsoleDiscussionHandoffView;
  checkpoints: SkoposUiConsoleDiscussionCheckpointView[];
  missionTitleById: Record<string, string>;
}): React.JSX.Element {
  return (
    <Card
      title="Discussion history"
      description="Browse the latest workflow handoff and full checkpoint sequence as the canonical discussion-memory layer."
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
                  const missionId = checkpointView.checkpoint.activeMissionId;
                  const missionTitle = missionId ? missionTitleById[missionId] : undefined;

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
                        {missionId ? (
                          <Link
                            to="/missions/$missionId"
                            params={{ missionId }}
                            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)] hover:underline"
                          >
                            {missionTitle ?? missionId}
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
          description="A dedicated discussion route exists now, but it only becomes useful once the runtime generates handoffs or checkpoints."
        />
      )}
    </Card>
  );
}
