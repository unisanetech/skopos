import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleTaskView,
  SkoposUiConsolePlanView,
} from '../../../contracts/skopos-ui-console-state.js';
import { ContentSection } from '../../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
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
            ...(planView.plan.decisionQuestions.length > 0
              ? [{ label: 'Decisions needed', value: String(planView.plan.decisionQuestions.length) }]
              : []),
            ...(planView.plan.risks.length > 0
              ? [{ label: 'Risks to watch', value: String(planView.plan.risks.length) }]
              : []),
            ...(planView.plan.updatedAt
              ? [{ label: 'Updated', value: formatDateTime(planView.plan.updatedAt) }]
              : []),
          ]}
        />
      </SidebarCard>
      {relatedTask ? (
        <SidebarCard title="Live work">
          <SidebarList
            items={[relatedTask]}
            getKey={(taskView) => taskView.task.id}
            renderItem={(taskView) => (
              <Link
                to="/tasks/$taskId"
                params={{ taskId: taskView.task.id }}
                className="block transition-colors hover:bg-state-hover"
              >
                <p className="text-body-medium font-medium">{taskView.task.title}</p>
                <p className="mt-1.5 text-body-small leading-5 text-on-surface-variant">
                  {taskView.task.steps.filter((step) => step.status === 'complete').length} of{' '}
                  {taskView.task.steps.length} steps complete · {taskView.task.state}
                </p>
              </Link>
            )}
            emptyTitle="No linked task"
            emptyDescription=""
          />
        </SidebarCard>
      ) : null}
      {planView.plan.recommendedActions.length > 0 ? (
        <SidebarCard
          title="Proof to run"
          badge={String(planView.plan.recommendedActions.length)}
          collapsible
          defaultOpen={false}
        >
          <p className="text-body-small leading-5 text-on-surface-variant">
            {planView.plan.recommendedActions.map((action) => action.id).join(' · ')}
          </p>
        </SidebarCard>
      ) : null}
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
    <ContentSection
      title="Why this plan needs tracking"
      description="Skopos added this guard because the plan has enough scope or risk to need a clear work record."
    >
      <div className="border-y border-outline-weak">
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
        <div className="border-t border-outline-weak px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-label-small text-on-surface-variant">Guard step</p>
            <StatusPill value="action" tone="info" />
          </div>
          <p className="mt-1 text-body-small text-on-surface">
            {actionStep.detail}
          </p>
        </div>
      </div>
    </ContentSection>
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
    <div className="border-t border-outline-weak px-3 py-3 first:border-t-0">
      <p className="text-label-small text-on-surface-variant">{label}</p>
      <p className="mt-1 text-body-small text-on-surface">{value}</p>
    </div>
  );
}

export function PlanDetailGuidanceCard({
  planView,
  relatedTask,
}: {
  planView: SkoposUiConsolePlanView;
  relatedTask?: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  const completeStepCount =
    relatedTask?.task.steps.filter((step) => step.status === 'complete').length ?? 0;
  const nextTaskStep = relatedTask?.task.steps.find((step) =>
    ['pending', 'in-progress', 'blocked'].includes(step.status),
  );
  const summaryAddsContext =
    planView.plan.summary.trim().toLowerCase() !== planView.plan.goal.trim().toLowerCase();

  return (
    <ContentSection
      title="Current direction"
      description={planView.plan.goal}
    >
      {summaryAddsContext ? (
        <p className="border-y border-outline-weak py-4 text-body-medium leading-6 text-on-surface-variant">
          {planView.plan.summary}
        </p>
      ) : null}
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Progress"
          text={
            relatedTask
              ? `${completeStepCount} of ${relatedTask.task.steps.length} linked Task steps are complete.`
              : 'Implementation has not started in a linked Task.'
          }
        />
        <GuidancePoint
          label="Next milestone"
          text={
            nextTaskStep?.title ??
            planView.plan.implementationSteps[0]?.title ??
            planView.plan.nextSteps[0] ??
            'Review the plan before choosing the next implementation slice.'
          }
        />
        <GuidancePoint
          label="Watch for"
          text={
            planView.plan.decisionQuestions[0]?.question ??
            planView.plan.risks[0] ??
            'No open decision or explicit risk is changing the path right now.'
          }
        />
      </div>
    </ContentSection>
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
    <ContentSection
      title="Path forward"
      description="The implementation sequence and the work that should follow it."
    >
      {implementationSteps.length > 0 || nextSteps.length > 0 ? (
        <div className="border-y border-outline-weak">
          <section className="py-3.5">
            <p className="text-label-small uppercase text-on-surface-variant">
              Implementation steps
            </p>
            {implementationSteps.length > 0 ? (
              <ol className="mt-2.5 grid gap-3">
                {implementationSteps.map((step, index) => (
                  <li key={`${step.title}-${index}`} className="flex items-start gap-3">
                    <span className="mt-[0.1rem] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-label-small text-on-surface">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-body-small font-medium text-[var(--foreground)]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-body-small text-on-surface-variant">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2.5 text-body-small text-on-surface-variant">
                No implementation steps are recorded right now.
              </p>
            )}
          </section>
          {nextSteps.length > 0 ? <section className="border-t border-outline-weak py-3.5">
            <p className="text-label-small uppercase text-on-surface-variant">
              Follow-on steps
            </p>
            <ul className="mt-2.5 grid gap-2">
              {nextSteps.map((step) => (
                <li key={step} className="text-body-small text-on-surface">{step}</li>
              ))}
            </ul>
          </section> : null}
        </div>
      ) : (
        <EmptyMessage
          title="No execution plan"
          description="This plan does not currently carry implementation or follow-on guidance."
        />
      )}
    </ContentSection>
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
    <div className="border-t border-outline-weak pt-3">
      <p className="text-label-small uppercase text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 text-body-small text-on-surface">
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
}): React.JSX.Element | null {
  if (decisionQuestions.length === 0 && risks.length === 0) {
    return null;
  }

  return (
    <ContentSection
      title="Decision pressure"
      description="Open decisions and risk notes should stay readable without fragmenting the plan into separate mini-panels."
    >
      <div className="border-y border-outline-weak">
          {decisionQuestions.length > 0 ? <section className="py-3.5">
            <p className="text-label-small uppercase text-on-surface-variant">
              Decision gates
            </p>
            <ul className="mt-2.5 grid gap-2">
                {decisionQuestions.map((question) => (
                  <li
                    key={question.id}
                    className="text-body-small text-on-surface"
                  >
                    {question.question}
                  </li>
                ))}
            </ul>
          </section> : null}
          {risks.length > 0 ? <section className={decisionQuestions.length > 0 ? 'border-t border-outline-weak py-3.5' : 'py-3.5'}>
            <p className="text-label-small uppercase text-on-surface-variant">
              Risks
            </p>
            <ul className="mt-2.5 grid gap-2">
                {risks.map((risk) => (
                  <li
                    key={risk}
                    className="text-body-small text-on-surface"
                  >
                    {risk}
                  </li>
                ))}
            </ul>
          </section> : null}
        </div>
    </ContentSection>
  );
}
