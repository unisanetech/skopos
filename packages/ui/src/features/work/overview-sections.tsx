import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleAdapterSupportView,
  SkoposUiConsoleMemoryView,
  SkoposUiConsoleMissionView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleUnderstandingView,
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
          { label: 'Evidence pass rate', value: proofPassRate },
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
      description="The work Skopos is actively tracking right now."
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
          description="Skopos is not tracking an active work session yet. If files are changing, start or claim a mission so progress, decisions, and evidence stay connected."
        />
      )}
    </Card>
  );
}

export function OverviewUnderstandingCard({
  understanding,
}: {
  understanding?: SkoposUiConsoleUnderstandingView;
}): React.JSX.Element {
  return (
    <Card
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
            <p className="mt-3 text-[13px] leading-[1.5rem] text-[var(--text)]">
              {understanding.summary.purpose}
            </p>
            {understanding.setupReview ? (
              <p className="mt-2 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
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
          <div className="border-y border-[var(--line)]">
            {understanding.summary.mainAreas.slice(0, 5).map((area, index) => (
              <div
                key={`${area.title}-${area.path}`}
                className={`py-3.5 ${index > 0 ? 'border-t border-[var(--line)]' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium tracking-[-0.01em]">{area.title}</p>
                    <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                      {area.summary}
                    </p>
                  </div>
                  <div className="grid gap-1.5 text-right text-[12px] text-[var(--muted)]">
                    <span className="font-mono">{area.path}</span>
                    <span>{area.confidence} confidence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
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
          description="Run `skopos understand` after bootstrap to generate a compact project summary, feature inventory, and implementation hotspots."
        />
      )}
    </Card>
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
    <Card
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
          <p className="text-[13px] leading-[1.5rem] text-[var(--text)]">
            {attentionCount === 0
              ? 'Skopos found clear sources for the main project knowledge areas. Agents can use this as a compact starting point before reading deeper docs.'
              : 'Some project knowledge areas still need review. Check them before broad or risky agent work.'}
          </p>
          <div className="border-y border-[var(--line)]">
            {memoryView.memory.roles.slice(0, 4).map((role, index) => (
              <div
                key={role.role}
                className={`py-3.5 ${index > 0 ? 'border-t border-[var(--line)]' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium tracking-[-0.01em]">{role.title}</p>
                    <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
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
            className="inline-flex text-[12.5px] font-semibold text-[var(--accent)] hover:underline"
          >
            Open Project Knowledge
          </Link>
        </div>
      ) : (
        <EmptyMessage
          title="Project knowledge is not available"
          description="Run `skopos init` or `skopos trust` to generate the project knowledge view."
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
      description="Planning notes for larger or riskier work that needs a clear path before editing."
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
          description="Small tasks may not need a saved plan. Bigger changes will show here once Skopos creates or links a plan."
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
      description="How well connected coding tools can resume Skopos context without losing the thread."
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
