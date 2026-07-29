import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposUiConsoleTaskView } from '../../../contracts/skopos-ui-console-state.js';
import type { TaskGuidanceContext } from '../../../platform/console-state/work-selectors.js';
import { Card } from '../../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import { toneForTaskState } from '../../../support/ui/tone-helpers.js';

const ACTION_RECORDING_STEP_ID = 'step-record-action-lane';

export function TaskGuidanceCard({
  guidance,
}: {
  guidance: TaskGuidanceContext;
}): React.JSX.Element {
  return (
    <Card
      title="Current guidance"
      description="Simple status for the developer supervising this task."
    >
      <div className="border-y border-[var(--line)]">
        <div className="grid gap-0 md:grid-cols-3">
          <GuidanceMetric
            label="Progress"
            value={`${guidance.completedCount} of ${guidance.totalCount}`}
            helper={`About ${guidance.percentComplete}% complete.`}
          />
          <GuidanceMetric
            label="Current phase"
            value={guidance.phase}
            helper="This phase is derived from task state, checklist items, and open questions."
          />
          <GuidanceMetric
            label="Doing now"
            value={guidance.doingNowText}
            helper="The next concrete item or question that needs attention."
          />
        </div>
        <GuidanceRow label="Completion" value={guidance.doneText} />
        <GuidanceRow label="Decisions" value={guidance.decisionText} />
        <GuidanceRow label="Issues" value={guidance.findingText} />
        <GuidanceRow label="Blockers" value={guidance.blockerText} />
        <GuidanceRow label="Evidence needed" value={guidance.proofText} />
      </div>
      {guidance.openQuestions.length > 0 ? (
        <div className="mt-4 border-y border-[var(--line)]">
          {guidance.openQuestions.map((question, index) => {
            const recommendedOption = question.options.find(
              (option) => option.id === question.recommendedOptionId,
            );
            return (
              <div
                key={question.id}
                className={`py-3.5 ${index > 0 ? 'border-t border-[var(--line)]' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[12.75px] font-semibold tracking-[-0.01em]">
                    {question.question}
                  </p>
                  <StatusPill value={question.escalation.replaceAll('-', ' ')} tone="warning" />
                </div>
                <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                  {question.whyItMatters}
                </p>
                <p className="mt-2 text-[12.25px] font-medium text-[var(--muted-strong)]">
                  Recommended: {recommendedOption?.label ?? question.recommendedOptionId}
                </p>
                <div className="mt-2 grid gap-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className="border-l border-[var(--line-strong)] pl-3"
                    >
                      <p className="text-[12.25px] font-medium tracking-[-0.01em]">
                        {option.label}
                        {option.id === question.recommendedOptionId ? ' (recommended)' : ''}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-[1.35rem] text-[var(--muted)]">
                        {option.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}

function GuidanceMetric({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-[var(--line)] px-3 py-3 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0">
      <p className="skopos-metric-label">{label}</p>
      <p className="mt-1.5 text-[13px] font-semibold tracking-[-0.01em] text-[var(--text)]">
        {value}
      </p>
      <p className="mt-1 text-[12px] leading-[1.35rem] text-[var(--muted)]">{helper}</p>
    </div>
  );
}

function GuidanceRow({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-[var(--line)] px-3 py-3">
      <p className="skopos-metric-label">{label}</p>
      <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">{value}</p>
    </div>
  );
}

export function TaskActionRecordingCard({
  taskView,
}: {
  taskView: SkoposUiConsoleTaskView;
}): React.JSX.Element | null {
  const actionStep = taskView.task.steps.find(
    (step) => step.id === ACTION_RECORDING_STEP_ID,
  );

  if (!actionStep) {
    return null;
  }

  return (
    <Card
      title="Why this task needs tracking"
      description="Skopos added this because the work looks broader or riskier than a tiny edit."
    >
      <div className="border-y border-[var(--line)]">
        <ActionRecordingRow
          label="Before coding"
          value="Confirm the detail level: light, standard, or detailed. This keeps the work proportional."
        />
        <ActionRecordingRow
          label="While working"
          value="Keep the task and plan current so another agent or developer can continue without guessing."
        />
        <ActionRecordingRow
          label="When project truth changes"
          value="Add a decision for durable product or architecture choices. Add a finding for structural gaps."
        />
        <div className="border-t border-[var(--line)] px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="skopos-metric-label">Current tracking step</p>
            <StatusPill
              value={actionStep.status}
              tone={actionStep.status === 'complete' ? 'positive' : 'warning'}
            />
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

export function TaskFrameCard({
  taskView,
}: {
  taskView: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  const task = taskView.task;
  const completeSteps = task.steps.filter((item) => item.status === 'complete');

  return (
    <Card
      title="Task brief"
      description="Keep the task readable as a human work packet instead of a raw execution record."
    >
      <div className="border-y border-[var(--line)]">
        <section className="py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Summary
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
            {task.summary}
          </p>
        </section>
        <section className="border-t border-[var(--line)] py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Objective
          </p>
          <p className="mt-1.5 text-[13px] font-medium tracking-[-0.02em]">
            {task.goal}
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
                  Math.round((completeSteps.length / Math.max(1, task.steps.length)) * 100),
                )}%`,
              }}
            />
          </div>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
            {completeSteps.length} of {task.steps.length} steps complete.
          </p>
        </section>
      </div>
    </Card>
  );
}

export function TaskChecklistCard({
  taskView,
}: {
  taskView: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  return (
    <Card title="Checklist" description="Execution items tracked by the task runtime surface.">
      <div className="border-y border-[var(--line)]">
        {taskView.task.steps.map((item, index) => (
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

export function TaskLinkedWorkCard({
  linkedTaskViews,
}: {
  linkedTaskViews: SkoposUiConsoleTaskView[];
}): React.JSX.Element {
  return (
    <Card
      title="Linked work"
      description="Child tasks created from this task stay readable as related work, not graph trivia."
    >
      {linkedTaskViews.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          {linkedTaskViews.map((linkedTaskView, index) => (
            <Link
              key={linkedTaskView.task.id}
              to="/tasks/$taskId"
              params={{ taskId: linkedTaskView.task.id }}
              className={`block py-3.5 transition-colors hover:bg-[color:rgba(255,252,246,0.4)] ${
                index > 0 ? 'border-t border-[var(--line)]' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium tracking-[-0.01em]">
                    {linkedTaskView.task.title}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--muted)]">
                    {linkedTaskView.task.scope.scope.title}
                  </p>
                </div>
                <StatusPill
                  value={linkedTaskView.task.state}
                  tone={toneForTaskState(linkedTaskView.task.state)}
                />
              </div>
              <p className="mt-1 text-[12.5px] leading-[1.4rem] text-[var(--muted)]">
                {linkedTaskView.task.goal}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No child Tasks"
          description="This Task currently has no delegated child Tasks."
        />
      )}
    </Card>
  );
}
