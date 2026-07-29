import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleTaskView,
  SkoposUiConsolePlanView,
} from '../../../contracts/skopos-ui-console-state.js';
import { Card } from '../../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  ReviewRow,
  SidebarCard,
  SidebarList,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';

const ACTION_RECORDING_STEP_ID = 'record-action-lane';

export function PlanDetailInspectorAside({
  planView,
  relatedTask,
}: {
  planView: SkoposUiConsolePlanView;
  relatedTask?: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Scope', value: planView.plan.scope.scope.title },
            { label: 'Confidence', value: planView.plan.confidence },
            {
              label: 'Decision gates',
              value: planView.plan.decisionQuestions.length
                ? `${planView.plan.decisionQuestions.length} open`
                : 'none',
            },
            { label: 'Risks', value: String(planView.plan.risks.length) },
            { label: 'Updated', value: formatDateTime(planView.plan.updatedAt) },
          ]}
        />
      </SidebarCard>
      <SidebarCard
        title="Validation"
        badge={String(
          planView.plan.recommendedChecks.length + planView.plan.recommendedActions.length,
        )}
        collapsible
        defaultOpen={false}
      >
        <div className="grid gap-3">
          <ReviewRow
            label="Checks"
            value={
              planView.plan.recommendedChecks.length > 0
                ? planView.plan.recommendedChecks.join(' · ')
                : 'No recommended checks'
            }
          />
          <ReviewRow
            label="Actions"
            value={
              planView.plan.recommendedActions.length > 0
                ? planView.plan.recommendedActions.map((action) => action.id).join(' · ')
                : 'No recommended actions'
            }
          />
        </div>
      </SidebarCard>
      <SidebarCard
        title="Related task"
        badge={relatedTask ? '1' : '0'}
        collapsible
        defaultOpen={false}
      >
        <SidebarList
          items={relatedTask ? [relatedTask] : []}
          getKey={(taskView) => taskView.task.id}
          renderItem={(taskView) => (
            <Link
              to="/tasks/$taskId"
              params={{ taskId: taskView.task.id }}
              className="block transition-colors hover:bg-[color:rgba(255,252,246,0.5)]"
            >
              <p className="text-[13px] font-medium tracking-[-0.01em]">
                {taskView.task.title}
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-[var(--muted)]">
                {taskView.task.state}
              </p>
            </Link>
          )}
          emptyTitle="No linked task"
          emptyDescription="This plan is not currently paired with a task."
        />
      </SidebarCard>
    </>
  );
}

export function PlanActionRecordingCard({
  planView,
}: {
  planView: SkoposUiConsolePlanView;
}): React.JSX.Element | null {
  const actionStep = planView.plan.implementationSteps.find(
    (step) => step.id === ACTION_RECORDING_STEP_ID,
  );

  if (!actionStep) {
    return null;
  }

  return (
    <Card
      title="Why this plan needs tracking"
      description="Skopos added this guard because the plan has enough scope or risk to need a clear work record."
    >
      <div className="border-y border-[var(--line)]">
        <ActionRecordingRow
          label="Task risk"
          value="Use light risk for narrow edits, standard risk for coordinated changes, and high-impact risk for broad or sensitive work."
        />
        <ActionRecordingRow
          label="Record while working"
          value="Keep task progress and plan direction current instead of leaving the next developer to reconstruct the story."
        />
        <ActionRecordingRow
          label="Save durable truth"
          value="Write a decision for lasting product or architecture choices. Write a finding when you discover a structural problem."
        />
        <div className="border-t border-[var(--line)] px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="skopos-metric-label">Guard step</p>
            <StatusPill value="action" tone="info" />
          </div>
          <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
            {actionStep.detail}
          </p>
        </div>
      </div>
    </Card>
  );
}

function ActionRecordingRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-[var(--line)] px-3 py-3 first:border-t-0">
      <p className="skopos-metric-label">{label}</p>
      <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">{value}</p>
    </div>
  );
}

export function PlanFrameCard({
  planView,
}: {
  planView: SkoposUiConsolePlanView;
}): React.JSX.Element {
  return (
    <Card
      title="Plan brief"
      description="Goal, summary, and scope for the current plan."
    >
      <div className="grid gap-3">
        <ReviewRow label="Goal" value={planView.plan.goal} />
        <ReviewRow label="Summary" value={planView.plan.summary} />
        <ReviewRow label="Scope" value={planView.plan.scope.scope.title} />
      </div>
    </Card>
  );
}

export function PlanDetailGuidanceCard({
  planView,
  relatedTask,
}: {
  planView: SkoposUiConsolePlanView;
  relatedTask?: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  const hasDecisionPressure =
    planView.plan.decisionQuestions.length > 0 || planView.plan.risks.length > 0;

  return (
    <Card
      title="How to read this plan"
      description="Use this plan as the agreed path for the work, then keep task progress and closure proof in sync with it."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Start here"
          text="Read the goal and scope first so the implementation does not drift."
        />
        <GuidancePoint
          label="Watch for"
          text={
            hasDecisionPressure
              ? 'Open decisions or risks that may change the implementation path.'
              : 'No open decision pressure is attached to this plan right now.'
          }
        />
        <GuidancePoint
          label="Next step"
          text={
            relatedTask
              ? 'Use the linked task to track live progress and closure evidence.'
              : 'Link this plan to a task when implementation starts.'
          }
        />
      </div>
    </Card>
  );
}

export function PlanWorkPlanCard({
  implementationSteps,
  nextSteps,
}: {
  implementationSteps: SkoposUiConsolePlanView['plan']['implementationSteps'];
  nextSteps: string[];
}): React.JSX.Element {
  return (
    <Card
      title="Execution plan"
      description="Primary implementation intent and follow-on work should stay together in one readable sequence."
    >
      {implementationSteps.length > 0 || nextSteps.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          <section className="py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Implementation steps
            </p>
            {implementationSteps.length > 0 ? (
              <ol className="mt-2.5 grid gap-3">
                {implementationSteps.map((step, index) => (
                  <li key={`${step.title}-${index}`} className="flex items-start gap-3">
                    <span className="mt-[0.1rem] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--panel-strong)] text-[11px] font-semibold text-[var(--muted-strong)]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.75px] font-medium tracking-[-0.01em] text-[var(--foreground)]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No implementation steps are recorded right now.
              </p>
            )}
          </section>
          <section className="border-t border-[var(--line)] py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Follow-on steps
            </p>
            {nextSteps.length > 0 ? (
              <ul className="mt-2.5 grid gap-2">
                {nextSteps.map((step) => (
                  <li
                    key={step}
                    className="text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]"
                  >
                    {step}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No follow-on steps are recorded right now.
              </p>
            )}
          </section>
        </div>
      ) : (
        <EmptyMessage
          title="No execution plan"
          description="This plan does not currently carry implementation or follow-on guidance."
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

export function PlanDecisionPressureCard({
  decisionQuestions,
  risks,
}: {
  decisionQuestions: SkoposUiConsolePlanView['plan']['decisionQuestions'];
  risks: string[];
}): React.JSX.Element {
  return (
    <Card
      title="Decision pressure"
      description="Open decisions and risk notes should stay readable without fragmenting the plan into separate mini-panels."
    >
      {decisionQuestions.length > 0 || risks.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          <section className="py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Decision gates
            </p>
            {decisionQuestions.length > 0 ? (
              <ul className="mt-2.5 grid gap-2">
                {decisionQuestions.map((question) => (
                  <li
                    key={question.id}
                    className="text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]"
                  >
                    {question.question}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No unresolved decision gates are recorded for this plan.
              </p>
            )}
          </section>
          <section className="border-t border-[var(--line)] py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Risks
            </p>
            {risks.length > 0 ? (
              <ul className="mt-2.5 grid gap-2">
                {risks.map((risk) => (
                  <li
                    key={risk}
                    className="text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]"
                  >
                    {risk}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No explicit risk notes are attached to this plan.
              </p>
            )}
          </section>
        </div>
      ) : (
        <EmptyMessage
          title="No decision pressure"
          description="This plan is not currently carrying unresolved gates or explicit risks."
        />
      )}
    </Card>
  );
}
