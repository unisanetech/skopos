import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposUiConsoleMissionView } from '../../../contracts/skopos-ui-console-state.js';
import { Card } from '../../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import { toneForMissionState } from '../../../support/ui/tone-helpers.js';

export function MissionFrameCard({
  missionView,
}: {
  missionView: SkoposUiConsoleMissionView;
}): React.JSX.Element {
  const mission = missionView.mission;
  const completeItems = mission.items.filter((item) => item.status === 'complete');

  return (
    <Card
      title="Mission brief"
      description="Keep the mission readable as a human work packet instead of a raw execution record."
    >
      <div className="border-y border-[var(--line)]">
        <section className="py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Summary
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
            {mission.summary}
          </p>
        </section>
        <section className="border-t border-[var(--line)] py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Objective
          </p>
          <p className="mt-1.5 text-[13px] font-medium tracking-[-0.02em]">
            {mission.objective}
          </p>
        </section>
        <section className="border-t border-[var(--line)] py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Progress
          </p>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-[var(--panel-muted)]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{
                width: `${Math.max(
                  8,
                  Math.round((completeItems.length / Math.max(1, mission.items.length)) * 100),
                )}%`,
              }}
            />
          </div>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
            {completeItems.length} of {mission.items.length} items complete.
          </p>
        </section>
      </div>
    </Card>
  );
}

export function MissionChecklistCard({
  missionView,
}: {
  missionView: SkoposUiConsoleMissionView;
}): React.JSX.Element {
  return (
    <Card title="Checklist" description="Execution items tracked by the mission runtime surface.">
      <div className="border-y border-[var(--line)]">
        {missionView.mission.items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-3.5 py-3.5 ${
              index > 0 ? 'border-t border-[var(--line)]' : ''
            }`}
          >
            <div
              className={`mt-0.5 grid h-[1.375rem] w-[1.375rem] shrink-0 place-items-center rounded-full border text-[11px] font-semibold ${
                item.status === 'complete'
                  ? 'border-transparent bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'border-[var(--line-strong)] bg-transparent text-[var(--muted)]'
              }`}
            >
              {item.status === 'complete' ? '✓' : '•'}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[12.75px] font-medium tracking-[-0.01em]">{item.title}</p>
                <StatusPill value={item.kind} tone="neutral" />
              </div>
              <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MissionLinkedWorkCard({
  linkedMissionViews,
}: {
  linkedMissionViews: SkoposUiConsoleMissionView[];
}): React.JSX.Element {
  return (
    <Card
      title="Linked work"
      description="Child missions created from this mission stay readable as related work, not graph trivia."
    >
      {linkedMissionViews.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          {linkedMissionViews.map((linkedMissionView, index) => (
            <Link
              key={linkedMissionView.mission.id}
              to="/missions/$missionId"
              params={{ missionId: linkedMissionView.mission.id }}
              className={`block py-3.5 transition-colors hover:bg-[color:rgba(255,252,246,0.4)] ${
                index > 0 ? 'border-t border-[var(--line)]' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium tracking-[-0.01em]">
                    {linkedMissionView.mission.title}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--muted)]">
                    {linkedMissionView.mission.scope.scope.title}
                  </p>
                </div>
                <StatusPill
                  value={linkedMissionView.mission.state}
                  tone={toneForMissionState(linkedMissionView.mission.state)}
                />
              </div>
              <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                {linkedMissionView.mission.objective}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No linked slices"
          description="This mission is currently operating without child execution slices."
        />
      )}
    </Card>
  );
}
