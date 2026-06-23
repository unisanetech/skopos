import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleAdapterSupportView,
  SkoposUiConsoleMissionView,
  SkoposUiConsolePlanView,
} from '../../contracts/skopos-ui-console-state.js';
import { Card } from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { countPendingMissionItems } from '../../support/execution/mission-metrics.js';
import { formatDateTime } from '../../support/formatting/console-formatting.js';
import { toneForMissionState } from '../../support/ui/tone-helpers.js';

export function OverviewInspectorAside({
  activeMissionCount,
  attentionLabel,
  proofPassRate,
  programItemCount,
  openObligationCount,
  generatedAt,
}: {
  activeMissionCount: number;
  attentionLabel: string;
  proofPassRate: string;
  programItemCount: number;
  openObligationCount: number;
  generatedAt?: string;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: 'Active missions', value: String(activeMissionCount) },
          { label: 'Attention', value: attentionLabel },
          { label: 'Program items', value: String(programItemCount) },
          { label: 'Open obligations', value: String(openObligationCount) },
          { label: 'Proof pass rate', value: proofPassRate },
          { label: 'Generated', value: formatDateTime(generatedAt) },
        ]}
      />
    </SidebarCard>
  );
}

export function MissionFocusCard({
  missions,
}: {
  missions: SkoposUiConsoleMissionView[];
}): React.JSX.Element {
  return (
    <Card
      title="Current focus"
      description="Active missions currently driving this workspace."
    >
      {missions.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          {missions.slice(0, 3).map((missionView, index) => (
            <Link
              key={missionView.mission.id}
              to="/missions/$missionId"
              params={{ missionId: missionView.mission.id }}
              className={`block py-3.5 transition-colors hover:bg-[color:rgba(255,252,246,0.4)] ${
                index > 0 ? 'border-t border-[var(--line)]' : ''
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill
                      value={missionView.mission.state}
                      tone={toneForMissionState(missionView.mission.state)}
                    />
                    {missionView.mission.coordination.claimedBy?.actorId ? (
                      <StatusPill
                        value={`claimed ${missionView.mission.coordination.claimedBy.actorId}`}
                        tone="neutral"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-2 text-[14px] font-semibold tracking-[-0.03em]">
                    {missionView.mission.title}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                    {missionView.mission.summary}
                  </p>
                </div>
                <div className="grid gap-1.5 text-right text-[12px] text-[var(--muted)]">
                  <span>{missionView.mission.scope.scope.title}</span>
                  <span>{countPendingMissionItems(missionView.mission)} pending items</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No active missions"
          description="No unfinished mission is currently driving workspace work."
        />
      )}
    </Card>
  );
}

export function OverviewRecentPlansCard({
  recentPlans,
}: {
  recentPlans: SkoposUiConsolePlanView[];
}): React.JSX.Element {
  return (
    <Card
      title="Recent plans"
      description="Recent plan updates that still affect current work."
    >
      {recentPlans.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          {recentPlans.map((planView, index) => (
            <Link
              key={planView.plan.id}
              to="/plans/$planId"
              params={{ planId: planView.plan.id }}
              className={`block py-3.5 transition-colors hover:bg-[color:rgba(255,252,246,0.4)] ${
                index > 0 ? 'border-t border-[var(--line)]' : ''
              }`}
            >
              <p className="text-[13px] font-medium tracking-[-0.01em]">{planView.plan.title}</p>
              <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                {planView.plan.summary}
              </p>
              <p className="mt-1.5 text-[12px] text-[var(--muted)]">
                {formatDateTime(planView.plan.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No recent plans"
          description="Recent plan updates will appear here once plans are available."
        />
      )}
    </Card>
  );
}

export function OverviewAdapterSupportCard({
  adapterSupport,
}: {
  adapterSupport?: SkoposUiConsoleAdapterSupportView;
}): React.JSX.Element {
  return (
    <Card
      title="Adapter support"
      description="Current host coverage for discussion-memory continuity and compact resume context."
    >
      {adapterSupport && adapterSupport.adapters.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          {adapterSupport.adapters.map((adapter, index) => {
            const coveredEvents = Object.values(adapter.lifecycleCoverage).filter(Boolean).length;
            const workflowRouterCoverageCount = Object.values(adapter.workflowRouterCoverage).filter(
              Boolean,
            ).length;
            return (
              <div
                key={adapter.toolId}
                className={`py-3.5 ${index > 0 ? 'border-t border-[var(--line)]' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill value={adapter.supportStatus} tone="positive" />
                      <StatusPill value={adapter.supportTier} tone="neutral" />
                    </div>
                    <h3 className="mt-2 text-[14px] font-semibold tracking-[-0.03em]">
                      {adapter.displayName}
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                      {adapter.summary}
                    </p>
                  </div>
                  <div className="grid gap-1.5 text-right text-[12px] text-[var(--muted)]">
                    <span>{coveredEvents}/5 lifecycle events</span>
                    <span>{workflowRouterCoverageCount}/2 router boundaries</span>
                    <span>{adapter.installMode}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusPill
                    value={
                      adapter.workflowRouterCoverage.sessionStart
                        ? 'router-guided resume'
                        : 'no router resume'
                    }
                    tone={adapter.workflowRouterCoverage.sessionStart ? 'positive' : 'neutral'}
                  />
                  <StatusPill
                    value={
                      adapter.workflowRouterCoverage.stopBoundary
                        ? 'router-enforced stop'
                        : 'no stop enforcement'
                    }
                    tone={adapter.workflowRouterCoverage.stopBoundary ? 'positive' : 'neutral'}
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
    </Card>
  );
}
