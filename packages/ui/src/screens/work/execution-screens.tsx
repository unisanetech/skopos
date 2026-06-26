import * as React from 'react';
import { Link } from '@tanstack/react-router';

import {
  DiscussionGuidanceCard,
  DiscussionHistoryCard,
  MissionChecklistCard,
  MissionDiscussionContextCard,
  MissionDetailInspectorAside,
  MissionFocusCard,
  MissionFrameCard,
  MissionGuidanceCard,
  MissionLinkedWorkCard,
  MissionListGuidanceCard,
  MissionListInspectorAside,
  MissionQueueCard,
  OverviewAdapterSupportCard,
  OverviewInspectorAside,
  OverviewRecentDiscussionCard,
  OverviewRecentPlansCard,
  OverviewUnderstandingCard,
} from '../../features/work/mission-sections.js';
import {
  MissionProgramContextCard,
  ProgramAttentionCard,
} from '../../features/program/program-sections.js';
import { DetailPage } from '../../patterns/pages/detail-page.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { ReviewPage } from '../../patterns/pages/review-page.js';
import {
  Card,
  RouteFilterBar,
} from '../../patterns/sections/content-primitives.js';
import {
  getMissionProgramContext,
  getProgramOverviewContext,
} from '../../platform/console-state/program-selectors.js';
import {
  getExecutionOverviewContext,
  getMissionDetailContext,
  getMissionListContext,
} from '../../platform/console-state/work-selectors.js';
import {
  getMissionDiscussionContext,
  getOverviewDiscussionContext,
} from '../../platform/console-state/discussion-selectors.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import {
  toneForCheck,
  toneForMissionState,
  toneForReadiness,
  toneForTrust,
} from '../../support/ui/tone-helpers.js';
import { filterChipClass } from '../../support/ui/filter-chip.js';

export function ExecutionOverviewView(): React.JSX.Element {
  const state = requireConsoleState();
  const { activeMissions, warningChecks, proofSummary, recentPlans } =
    getExecutionOverviewContext(state);
  const { latestDiscussionHandoff, recentDiscussionCheckpoints, activeMissionView } =
    getOverviewDiscussionContext(state);
  const {
    doNowItem,
    doNextItem,
    currentActiveItem,
    currentItemObligations,
    openProgramQuestionCount,
    interruptRecommendation,
    recommendedAction,
  } = getProgramOverviewContext(state);

  return (
    <ReviewPage
      kicker="Current work"
      title={state.workspaceLabel}
      description={buildReadinessSentence({
        readiness: state.trustReport.readiness,
        passCount: state.trustReport.checks.filter((check) => check.status === 'pass').length,
        warningCount: warningChecks.length,
        failureCount: state.trustReport.checks.filter((check) => check.status === 'fail').length,
      })}
      badges={[
        <StatusPill
          key="trust"
          value={`confidence ${state.trustReport.trustLevel}`}
          tone={toneForTrust(state.trustReport.trustLevel)}
        />,
        <StatusPill
          key="readiness"
          value={state.trustReport.readiness}
          tone={toneForReadiness(state.trustReport.readiness)}
        />,
        state.proofReport ? (
          <StatusPill
            key="proof"
            value={`evidence ${state.proofReport.scorecard.status}`}
            tone={state.proofReport.scorecard.status === 'pass' ? 'positive' : 'danger'}
          />
        ) : null,
      ]}
      aside={
        <OverviewInspectorAside
          activeMissionCount={activeMissions.length}
          attentionLabel={warningChecks.length > 0 ? `${warningChecks.length} checks` : 'clear'}
          programItemCount={state.programState?.items.length ?? 0}
          openObligationCount={state.programState?.attention.openObligationCount ?? 0}
          proofPassRate={
            proofSummary
              ? `${Math.round(proofSummary.scorecard.weightedPassRate * 100)}%`
              : 'not run'
          }
          generatedAt={state.generatedAt}
        />
      }
    >
      <PageSectionStack>
        <OverviewUnderstandingCard understanding={state.understanding} />
        <MissionFocusCard missions={activeMissions} />
        <ProgramAttentionCard
          state={state}
          doNowItem={doNowItem}
          doNextItem={doNextItem}
          currentActiveItem={currentActiveItem}
          currentItemObligations={currentItemObligations}
          openProgramQuestionCount={openProgramQuestionCount}
          interruptRecommendation={interruptRecommendation}
          recommendedAction={recommendedAction}
        />
        <OverviewAdapterSupportCard adapterSupport={state.adapterSupport} />
        <OverviewRecentDiscussionCard
          latestDiscussionHandoff={latestDiscussionHandoff}
          recentDiscussionCheckpoints={recentDiscussionCheckpoints}
          activeMissionView={activeMissionView}
        />
        <Card
          title="Attention"
          description="Checks currently asking for human review."
        >
          {warningChecks.length > 0 ? (
            <div className="border-y border-[var(--line)]">
              {warningChecks.slice(0, 4).map((check, index) => (
                <div
                  key={check.id}
                  className={`py-3.5 ${index > 0 ? 'border-t border-[var(--line)]' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-medium tracking-[-0.01em]">{check.id}</p>
                    <StatusPill value={check.status} tone={toneForCheck(check.status)} />
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                    {check.summary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyMessage
              title="Nothing urgent"
              description="Readiness checks are currently not surfacing blockers or warning-level attention."
            />
          )}
        </Card>
        <OverviewRecentPlansCard recentPlans={recentPlans} />
      </PageSectionStack>
    </ReviewPage>
  );
}

const buildReadinessSentence = ({
  readiness,
  passCount,
  warningCount,
  failureCount,
}: {
  readiness: string;
  passCount: number;
  warningCount: number;
  failureCount: number;
}): string =>
  `Readiness is ${readiness} with ${passCount} ${passCount === 1 ? 'passing check' : 'passing checks'}, ${warningCount} ${warningCount === 1 ? 'warning' : 'warnings'}, and ${failureCount} ${failureCount === 1 ? 'failure' : 'failures'}.`;

export function ExecutionMissionsView({
  search,
}: {
  search: { view: 'open' | 'blocked' | 'claimed' | 'complete' };
}): React.JSX.Element {
  const state = requireConsoleState();
  const {
    openMissions,
    allCompletedMissions,
    completedMissions,
    blockedMissionCount,
    claimedMissionCount,
    latestMission,
    primaryMissions,
    primaryTitle,
    primaryDescription,
  } = getMissionListContext(state, search.view);

  return (
    <ListPage
      kicker="Missions"
      title="Tracked work sessions"
      description="A mission is the active container Skopos uses to track work, decisions, progress, and closure evidence."
      aside={
        <MissionListInspectorAside
          openCount={openMissions.length}
          blockedCount={blockedMissionCount}
          claimedCount={claimedMissionCount}
          completeCount={allCompletedMissions.length}
          updatedAt={latestMission?.mission.updatedAt}
        />
      }
      filters={
        <RouteFilterBar label="Queue view">
          {([
            ['open', 'Open'],
            ['blocked', 'Blocked'],
            ['claimed', 'Claimed'],
            ['complete', 'Closed'],
          ] as const).map(([value, label]) => (
            <Link
              key={value}
              to="/missions"
              search={{ view: value }}
              className={filterChipClass(search.view === value)}
            >
              {label}
            </Link>
          ))}
        </RouteFilterBar>
      }
    >
      <PageSectionStack className="gap-5">
        <MissionListGuidanceCard
          openCount={openMissions.length}
          blockedCount={blockedMissionCount}
          claimedCount={claimedMissionCount}
        />
        <MissionQueueCard
          title={primaryTitle}
          description={primaryDescription}
          missions={primaryMissions}
          emptyTitle={`No ${search.view} missions`}
          emptyDescription="No mission matches this view. Start or claim a mission when work should be tracked across files, decisions, and checks."
          compact={search.view === 'complete'}
        />
        {search.view !== 'complete' ? (
          <MissionQueueCard
            title="Recently closed"
            description="Completed slices stay visible without competing with the live queue."
            missions={completedMissions}
            emptyTitle="No completed missions"
            emptyDescription="Completed missions will appear here after Skopos records a closed work session."
            compact
          />
        ) : null}
      </PageSectionStack>
    </ListPage>
  );
}

export function ExecutionDiscussionView(): React.JSX.Element {
  const state = requireConsoleState();
  const missionTitleById = Object.fromEntries(
    state.missions.map((missionView) => [missionView.mission.id, missionView.mission.title]),
  );
  const activeMissionCount = state.discussionCheckpoints.filter(
    (checkpointView) => checkpointView.checkpoint.activeMissionId,
  ).length;

  return (
    <ReviewPage
      kicker="Discussion"
      title="What did we agree in chat?"
      description="Handoffs and checkpoints that preserve accepted direction, open questions, and resume context."
      badges={[
        <StatusPill
          key="handoff"
          value={state.latestDiscussionHandoff ? 'handoff ready' : 'handoff missing'}
          tone={state.latestDiscussionHandoff ? 'positive' : 'warning'}
        />,
        <StatusPill
          key="checkpoints"
          value={`${state.discussionCheckpoints.length} checkpoints`}
          tone={state.discussionCheckpoints.length > 0 ? 'info' : 'neutral'}
        />,
      ]}
      aside={
        <OverviewInspectorAside
          activeMissionCount={activeMissionCount}
          attentionLabel={
            state.latestDiscussionHandoff?.handoff.overBudget ? 'budget warning' : 'compact'
          }
          programItemCount={state.programState?.items.length ?? 0}
          openObligationCount={state.programState?.attention.openObligationCount ?? 0}
          proofPassRate={
            state.proofReport
              ? `${Math.round(state.proofReport.scorecard.weightedPassRate * 100)}%`
              : 'not run'
          }
          generatedAt={state.generatedAt}
        />
      }
    >
      <PageSectionStack>
        <DiscussionGuidanceCard
          latestDiscussionHandoff={state.latestDiscussionHandoff}
          checkpointCount={state.discussionCheckpoints.length}
          activeMissionCount={activeMissionCount}
        />
        <DiscussionHistoryCard
          latestDiscussionHandoff={state.latestDiscussionHandoff}
          checkpoints={state.discussionCheckpoints}
          missionTitleById={missionTitleById}
        />
      </PageSectionStack>
    </ReviewPage>
  );
}

export function ExecutionMissionDetailView({
  missionId,
}: {
  missionId: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const { missionView, missionWorkflows, linkedMissionViews, guidance } = getMissionDetailContext(
    state,
    missionId,
  );
  const { latestDiscussionHandoff, missionCheckpoints } = getMissionDiscussionContext(
    state,
    missionId,
  );
  const { missionItem, openObligations, doNextItem, recommendedAction } = getMissionProgramContext(
    state,
    missionId,
  );

  if (!missionView) {
    return (
      <DetailPage
        kicker="Mission detail"
        title="Mission not found"
        description="The requested mission is not present in this snapshot."
      >
        <EmptyMessage
          title="Unknown mission"
          description="Refresh the app after rebuilding Skopos state if the mission changed."
        />
      </DetailPage>
    );
  }

  const mission = missionView.mission;

  return (
    <DetailPage
      kicker="Mission detail"
      title={mission.title}
      description={mission.summary}
      badges={[
        <StatusPill
          key="state"
          value={mission.state}
          tone={toneForMissionState(mission.state)}
        />,
        <StatusPill key="scope" value={mission.scope.scope.title} tone="neutral" />,
        mission.coordination.claimedBy?.actorId ? (
          <StatusPill
            key="claim"
            value={`claimed ${mission.coordination.claimedBy.actorId}`}
            tone="info"
          />
        ) : null,
      ]}
      aside={
        <MissionDetailInspectorAside
          missionView={missionView}
          missionWorkflows={missionWorkflows}
          programItemDisposition={missionItem?.recommendedDisposition.replaceAll('-', ' ')}
          openProgramObligationCount={openObligations.length}
          queuedNextTitle={doNextItem?.title}
        />
      }
    >
      <PageSectionStack>
        {guidance ? <MissionGuidanceCard guidance={guidance} /> : null}
        <MissionFrameCard missionView={missionView} />
        <MissionProgramContextCard
          state={state}
          missionItem={missionItem}
          openObligations={openObligations}
          doNextItem={doNextItem}
          recommendedAction={recommendedAction}
        />
        <MissionDiscussionContextCard
          latestDiscussionHandoff={latestDiscussionHandoff}
          missionCheckpoints={missionCheckpoints}
        />
        <MissionChecklistCard missionView={missionView} />
        <MissionLinkedWorkCard linkedMissionViews={linkedMissionViews} />
      </PageSectionStack>
    </DetailPage>
  );
}
