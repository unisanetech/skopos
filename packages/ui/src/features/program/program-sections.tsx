import * as React from 'react';
import type {
  SkoposProgramInterruptRecommendation,
  SkoposProgramItem,
  SkoposProgramObligation,
  SkoposProgramRecommendedAction,
} from '@skopos/model';

import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import { Card } from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import {
  resolveProgramItemHref,
  resolveProgramObligationHref,
} from '../../platform/console-state/program-selectors.js';

export function ProgramAttentionCard({
  state,
  doNowItem,
  doNextItem,
  currentItemObligations,
  openProgramQuestionCount,
  interruptRecommendation,
  recommendedAction,
}: {
  state: SkoposUiConsoleState;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  currentItemObligations: SkoposProgramObligation[];
  openProgramQuestionCount: number;
  interruptRecommendation: SkoposProgramInterruptRecommendation;
  recommendedAction?: SkoposProgramRecommendedAction;
}): React.JSX.Element {
  return (
    <Card
      title="Program attention"
      description="The program router keeps the current do-now item, next queued work, and live obligation pressure readable in one place."
    >
      {doNowItem ? (
        <div className="border-y border-[var(--line)]">
          <ProgramItemRow
            label="Do now"
            item={doNowItem}
            href={resolveProgramItemHref(state, doNowItem)}
          />
          {doNextItem ? (
            <ProgramItemRow
              label="Do next"
              item={doNextItem}
              href={resolveProgramItemHref(state, doNextItem)}
              bordered
            />
          ) : null}
          <section className="border-t border-[var(--line)] py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                value={interruptRecommendation.decision.replaceAll('-', ' ')}
                tone={toneForInterruptDecision(interruptRecommendation.decision)}
              />
              {recommendedAction ? (
                <StatusPill
                  value={recommendedAction.kind.replaceAll('-', ' ')}
                  tone={toneForRecommendedAction(recommendedAction.kind)}
                />
              ) : null}
              {openProgramQuestionCount > 0 ? (
                <StatusPill value={`${openProgramQuestionCount} open questions`} tone="warning" />
              ) : null}
              <StatusPill value={`${currentItemObligations.length} open obligations`} tone="neutral" />
            </div>
            <p className="mt-2 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
              {interruptRecommendation.summary}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
              {interruptRecommendation.reason}
            </p>
            {recommendedAction ? (
              <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
                Next action: {recommendedAction.summary}
              </p>
            ) : null}
          </section>
        </div>
      ) : (
        <EmptyMessage
          title="No program attention yet"
          description="Build program state to surface do-now, do-next, and obligation pressure in the routed console."
        />
      )}
    </Card>
  );
}

export function MissionProgramContextCard({
  state,
  missionItem,
  openObligations,
  doNextItem,
  recommendedAction,
}: {
  state: SkoposUiConsoleState;
  missionItem?: SkoposProgramItem;
  openObligations: SkoposProgramObligation[];
  doNextItem?: SkoposProgramItem;
  recommendedAction?: SkoposProgramRecommendedAction;
}): React.JSX.Element {
  return (
    <Card
      title="Program context"
      description="Keep this mission anchored to why it is in the queue now and what remains open around it."
    >
      {missionItem ? (
        <div className="border-y border-[var(--line)]">
          <section className="py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill value={missionItem.recommendedDisposition.replaceAll('-', ' ')} tone="info" />
              <StatusPill value={missionItem.priority} tone={toneForProgramPriority(missionItem.priority)} />
              <StatusPill value={missionItem.sourceKind.replaceAll('-', ' ')} tone="neutral" />
            </div>
            <p className="mt-2 text-[12.75px] font-medium tracking-[-0.01em]">{missionItem.title}</p>
            <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
              {missionItem.whyNow}
            </p>
            {recommendedAction ? (
              <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
                Recommended next action: {recommendedAction.summary}
              </p>
            ) : null}
          </section>
          <section className="border-t border-[var(--line)] py-3.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Open obligations
              </p>
              <StatusPill value={String(openObligations.length)} tone={openObligations.length > 0 ? 'warning' : 'positive'} />
            </div>
            {openObligations.length > 0 ? (
              <div className="mt-2 border-y border-[var(--line)]">
                {openObligations.slice(0, 4).map((obligation, index) => (
                  <ProgramObligationRow
                    key={obligation.id}
                    obligation={obligation}
                    href={resolveProgramObligationHref(state, obligation)}
                    bordered={index > 0}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                No open program obligations currently point at this mission.
              </p>
            )}
          </section>
          {doNextItem ? (
            <ProgramItemRow
              label="Queued next"
              item={doNextItem}
              href={resolveProgramItemHref(state, doNextItem)}
              bordered
            />
          ) : null}
        </div>
      ) : (
        <EmptyMessage
          title="No upstream program item"
          description="This mission is not currently claimed by the compact program router state."
        />
      )}
    </Card>
  );
}

export function ProgramPressureCard({
  state,
  doNowItem,
  doNextItem,
  closureObligations,
  openProgramQuestionCount,
  interruptRecommendation,
  recommendedAction,
}: {
  state: SkoposUiConsoleState;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  closureObligations: SkoposProgramObligation[];
  openProgramQuestionCount: number;
  interruptRecommendation?: SkoposProgramInterruptRecommendation;
  recommendedAction?: SkoposProgramRecommendedAction;
}): React.JSX.Element {
  return (
    <Card
      title="Program pressure"
      description="Program-level sequencing and obligation pressure stay visible here so trust is not reduced to raw check output."
    >
      {doNowItem || doNextItem || closureObligations.length > 0 || openProgramQuestionCount > 0 ? (
        <div className="border-y border-[var(--line)]">
          {doNowItem ? (
            <ProgramItemRow
              label="Current do now"
              item={doNowItem}
              href={resolveProgramItemHref(state, doNowItem)}
            />
          ) : null}
          {doNextItem ? (
            <ProgramItemRow
              label="Queued next"
              item={doNextItem}
              href={resolveProgramItemHref(state, doNextItem)}
              bordered={Boolean(doNowItem)}
            />
          ) : null}
          <section className="border-t border-[var(--line)] py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              {interruptRecommendation ? (
                <StatusPill
                  value={interruptRecommendation.decision.replaceAll('-', ' ')}
                  tone={toneForInterruptDecision(interruptRecommendation.decision)}
                />
              ) : null}
              {recommendedAction ? (
                <StatusPill
                  value={recommendedAction.kind.replaceAll('-', ' ')}
                  tone={toneForRecommendedAction(recommendedAction.kind)}
                />
              ) : null}
              {openProgramQuestionCount > 0 ? (
                <StatusPill value={`${openProgramQuestionCount} open questions`} tone="warning" />
              ) : null}
              <StatusPill
                value={`${closureObligations.length} closure obligations`}
                tone={closureObligations.length > 0 ? 'warning' : 'positive'}
              />
            </div>
            <p className="mt-2 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
              {interruptRecommendation?.summary ?? 'No interrupt recommendation is currently active.'}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
              {interruptRecommendation?.reason ??
                'Build or refresh program state to make queue order and interruption pressure explicit.'}
            </p>
            {recommendedAction ? (
              <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
                Next action: {recommendedAction.summary}
              </p>
            ) : null}
          </section>
          {closureObligations.length > 0 ? (
            <div className="border-t border-[var(--line)]">
              {closureObligations.slice(0, 4).map((obligation, index) => (
                <ProgramObligationRow
                  key={obligation.id}
                  obligation={obligation}
                  href={resolveProgramObligationHref(state, obligation)}
                  bordered={index > 0}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyMessage
          title="No program pressure"
          description="No program-state blockers or closure obligations are currently active."
        />
      )}
    </Card>
  );
}

function ProgramItemRow({
  label,
  item,
  href,
  bordered = false,
}: {
  label: string;
  item: SkoposProgramItem;
  href?: string;
  bordered?: boolean;
}): React.JSX.Element {
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {label}
        </p>
        <StatusPill value={item.priority} tone={toneForProgramPriority(item.priority)} />
      </div>
      <p className="mt-2 text-[12.75px] font-medium tracking-[-0.01em]">{item.title}</p>
      <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">{item.summary}</p>
    </>
  );

  const className = `py-3.5 ${bordered ? 'border-t border-[var(--line)]' : ''}`;

  if (!href) {
    return <section className={className}>{body}</section>;
  }

  return (
    <a href={href} className={`${className} block transition-colors hover:bg-[color:rgba(255,252,246,0.42)]`}>
      {body}
    </a>
  );
}

function ProgramObligationRow({
  obligation,
  href,
  bordered = false,
}: {
  obligation: SkoposProgramObligation;
  href?: string;
  bordered?: boolean;
}): React.JSX.Element {
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[12.5px] font-medium tracking-[-0.01em]">{obligation.title}</p>
        <StatusPill value={obligation.kind} tone={toneForObligationKind(obligation.kind)} />
      </div>
      <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">{obligation.reason}</p>
    </>
  );

  const className = `py-3.5 ${bordered ? 'border-t border-[var(--line)]' : ''}`;

  if (!href) {
    return <section className={className}>{body}</section>;
  }

  return (
    <a href={href} className={`${className} block transition-colors hover:bg-[color:rgba(255,252,246,0.42)]`}>
      {body}
    </a>
  );
}

const toneForProgramPriority = (
  priority: SkoposProgramItem['priority'],
): 'danger' | 'warning' | 'info' | 'neutral' => {
  switch (priority) {
    case 'critical':
      return 'danger';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    default:
      return 'neutral';
  }
};

const toneForObligationKind = (
  kind: SkoposProgramObligation['kind'],
): 'warning' | 'info' | 'neutral' => {
  switch (kind) {
    case 'validation':
    case 'workflows':
      return 'warning';
    case 'ui':
    case 'runtime':
      return 'info';
    default:
      return 'neutral';
  }
};

const toneForInterruptDecision = (
  decision: SkoposProgramInterruptRecommendation['decision'],
): 'warning' | 'info' | 'neutral' => {
  switch (decision) {
    case 'interrupt-current':
      return 'warning';
    case 'start-do-now':
      return 'info';
    default:
      return 'neutral';
  }
};

const toneForRecommendedAction = (
  kind: SkoposProgramRecommendedAction['kind'],
): 'positive' | 'warning' | 'info' | 'neutral' => {
  switch (kind) {
    case 'complete-current-mission':
      return 'positive';
    case 'start-mission':
      return 'warning';
    case 'continue-current-mission':
      return 'info';
    default:
      return 'neutral';
  }
};
