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
  currentActiveItem,
  currentItemObligations,
  openProgramQuestionCount,
  interruptRecommendation,
  recommendedAction,
}: {
  state: SkoposUiConsoleState;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  currentActiveItem?: SkoposProgramItem;
  currentItemObligations: SkoposProgramObligation[];
  openProgramQuestionCount: number;
  interruptRecommendation: SkoposProgramInterruptRecommendation;
  recommendedAction?: SkoposProgramRecommendedAction;
}): React.JSX.Element {
  return (
    <Card
      title="Next action"
      description="What Skopos recommends doing next, based on current work, open questions, and validation state."
    >
      {doNowItem ? (
        <div className="border-y border-[var(--line)]">
          <section className="py-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill
                value={labelForRecommendedAction(recommendedAction?.kind)}
                tone={toneForRecommendedAction(recommendedAction?.kind ?? 'review-program-state')}
              />
              <StatusPill
                value={labelForRoutingDecision(interruptRecommendation.decision)}
                tone={toneForInterruptDecision(interruptRecommendation.decision)}
              />
              {openProgramQuestionCount > 0 ? (
                <StatusPill value={`${openProgramQuestionCount} question${openProgramQuestionCount === 1 ? '' : 's'}`} tone="warning" />
              ) : null}
            </div>
            <p className="mt-2 text-[13px] font-semibold tracking-[-0.02em]">
              {buildRecommendedActionTitle({ recommendedAction, interruptRecommendation, doNowItem })}
            </p>
            <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]">
              {buildRecommendedActionSummary({ recommendedAction, interruptRecommendation, doNowItem })}
            </p>
            {recommendedAction?.command ? (
              <div className="mt-3 rounded-[6px] border border-[var(--line)] bg-[var(--panel)] px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Command to start it
                </p>
                <p className="mt-1 break-words font-mono text-[11.5px] leading-5 text-[var(--muted-strong)] [overflow-wrap:anywhere]">
                  {recommendedAction.command}
                </p>
              </div>
            ) : null}
          </section>

          {currentActiveItem ? (
            <ProgramItemRow
              label="Current tracked work"
              item={currentActiveItem}
              href={resolveProgramItemHref(state, currentActiveItem)}
              bordered
            />
          ) : null}
          {!currentActiveItem && doNextItem && doNextItem.id !== doNowItem.id ? (
            <ProgramItemRow
              label="After this"
              item={doNextItem}
              href={resolveProgramItemHref(state, doNextItem)}
              bordered
            />
          ) : null}
          <ObligationSummary
            obligations={currentItemObligations}
            state={state}
            bordered
          />
        </div>
      ) : (
        <EmptyMessage
          title="No next action yet"
          description="Refresh Skopos state to show the recommended next action for this workspace."
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
      title="Why this work is active"
      description="Shows why this mission is being tracked now and what still needs attention around it."
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
                No open questions or required follow-up currently point at this mission.
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
          title="No queue context"
          description="Skopos is not currently linking this mission to a queue item."
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
      title="Work still affecting readiness"
      description="Queued work, open questions, and closure items that may affect whether work can continue or close."
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
                'Refresh Skopos state to make queue order and interruption guidance clear.'}
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

function ObligationSummary({
  state,
  obligations,
  bordered = false,
}: {
  state: SkoposUiConsoleState;
  obligations: SkoposProgramObligation[];
  bordered?: boolean;
}): React.JSX.Element {
  const className = `py-3.5 ${bordered ? 'border-t border-[var(--line)]' : ''}`;

  return (
    <section className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Before finishing
        </p>
        <StatusPill
          value={
            obligations.length > 0
              ? `${obligations.length} item${obligations.length === 1 ? '' : 's'}`
              : 'clear'
          }
          tone={obligations.length > 0 ? 'warning' : 'positive'}
        />
      </div>
      {obligations.length > 0 ? (
        <div className="mt-2 border-y border-[var(--line)]">
          {obligations.slice(0, 3).map((obligation, index) => (
            <ProgramObligationRow
              key={obligation.id}
              obligation={obligation}
              href={resolveProgramObligationHref(state, obligation)}
              bordered={index > 0}
            />
          ))}
          {obligations.length > 3 ? (
            <p className="border-t border-[var(--line)] py-3 text-[12px] leading-5 text-[var(--muted)]">
              {obligations.length - 3} more item{obligations.length - 3 === 1 ? '' : 's'} still need attention before this work closes.
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-1.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
          No open questions, checks, or workflow items are attached to the current work.
        </p>
      )}
    </section>
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
      <p className="mt-2 text-[12.75px] font-medium tracking-[-0.01em]">{humanizeProgramItemTitle(item)}</p>
      <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
        {humanizeProgramText(item.summary)}
      </p>
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

const buildRecommendedActionTitle = ({
  recommendedAction,
  interruptRecommendation,
  doNowItem,
}: {
  recommendedAction?: SkoposProgramRecommendedAction;
  interruptRecommendation: SkoposProgramInterruptRecommendation;
  doNowItem: SkoposProgramItem;
}): string => {
  if (recommendedAction?.kind === 'start-mission') {
    return interruptRecommendation.decision === 'interrupt-current'
      ? 'Review this higher-priority item before switching work'
      : 'Start the next tracked work item';
  }

  if (recommendedAction?.kind === 'run-workflow-recommendation') {
    return 'Answer the blocking workflow item';
  }

  if (recommendedAction?.kind === 'continue-current-mission') {
    return 'Continue the active mission';
  }

  if (recommendedAction?.kind === 'complete-current-mission') {
    return 'Finish and close the active mission';
  }

  if (recommendedAction?.kind === 'review-program-state') {
    return 'Review the workspace state before continuing';
  }

  return doNowItem.title;
};

const buildRecommendedActionSummary = ({
  recommendedAction,
  interruptRecommendation,
  doNowItem,
}: {
  recommendedAction?: SkoposProgramRecommendedAction;
  interruptRecommendation: SkoposProgramInterruptRecommendation;
  doNowItem: SkoposProgramItem;
}): string => {
  if (recommendedAction?.kind === 'start-mission') {
    return `${humanizeProgramItemTitle(doNowItem)} is the next ready item.`;
  }

  if (recommendedAction?.kind === 'run-workflow-recommendation') {
    return humanizeProgramText(recommendedAction.summary);
  }

  if (recommendedAction?.summary) {
    return humanizeProgramText(recommendedAction.summary);
  }

  if (interruptRecommendation.decision === 'idle') {
    return 'Skopos does not see urgent work that needs attention right now.';
  }

  return humanizeProgramText(doNowItem.summary);
};

const labelForRoutingDecision = (
  decision: SkoposProgramInterruptRecommendation['decision'],
): string => {
  switch (decision) {
    case 'continue-current':
      return 'keep going';
    case 'interrupt-current':
      return 'needs review';
    case 'start-do-now':
      return 'ready to start';
    default:
      return 'no pressure';
  }
};

const labelForRecommendedAction = (
  kind?: SkoposProgramRecommendedAction['kind'],
): string => {
  switch (kind) {
    case 'continue-current-mission':
      return 'continue mission';
    case 'complete-current-mission':
      return 'finish mission';
    case 'start-mission':
      return 'new mission';
    case 'run-workflow-recommendation':
      return 'answer first';
    case 'review-program-state':
      return 'review state';
    default:
      return 'next action';
  }
};

const humanizeProgramItemTitle = (item: SkoposProgramItem): string => {
  if (item.sourceKind === 'finding') {
    if (item.title === 'Self-Hosted Feature Work Can Still Drift Outside Skopos Mission State') {
      return 'Keep feature work inside a Skopos mission';
    }

    if (item.title === 'The Skopos CLI Entrypoint Had Become A Command Bucket Instead Of A Thin Tool Surface') {
      return 'Keep the CLI entrypoint thin';
    }

    if (item.title === 'Canonical Artifacts Are Rich, But Agent Transport Is Still Too Expensive') {
      return 'Make agent context smaller and cheaper';
    }
  }

  return item.title;
};

const humanizeProgramText = (value: string): string =>
  value
    .replaceAll('`', '')
    .replaceAll('highest-priority ready queued item', 'next ready item')
    .replaceAll('partially fixed.', 'Partially fixed:')
    .replaceAll('open.', 'Open:')
    .replaceAll('unresolved.', 'Unresolved:')
    .replaceAll('do-now', 'current work')
    .replaceAll('do-next', 'next work');

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
    case 'run-workflow-recommendation':
      return 'warning';
    case 'continue-current-mission':
      return 'info';
    default:
      return 'neutral';
  }
};
