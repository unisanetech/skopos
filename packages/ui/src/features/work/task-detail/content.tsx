import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleState,
  SkoposUiConsoleTaskView,
} from '../../../contracts/skopos-ui-console-state.js';
import type { TaskGuidanceContext } from '../../../platform/console-state/work-selectors.js';
import { ContentSection } from '../../../patterns/sections/content-primitives.js';
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
    <ContentSection
      title="Do this next"
      description="The current step comes first. Progress, blockers, and proof stay visible underneath."
    >
      <div className="border-y border-outline-weak">
        <div className="px-3 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-label-medium text-on-surface-variant">Current step</p>
            <StatusPill value={guidance.workflow.replace('-', ' ')} tone="info" />
          </div>
          <p className="mt-1.5 text-title-large text-on-surface wrap-break-word">
            {guidance.doingNowText}
          </p>
        </div>
        <div className="grid gap-0 border-t border-outline-weak md:grid-cols-2">
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
        </div>
        <GuidanceRow label="Completion" value={guidance.doneText} />
        <GuidanceRow label="Decisions" value={guidance.decisionText} />
        <GuidanceRow label="Issues" value={guidance.findingText} />
        <GuidanceRow label="Blockers" value={guidance.blockerText} />
        <GuidanceRow label="Evidence needed" value={guidance.proofText} />
        <div className="border-t border-outline-weak px-3 py-3">
          <p className="text-label-small text-on-surface-variant">Exact next command</p>
          <code className="mt-1 block break-all whitespace-pre-wrap font-mono text-body-small text-on-surface">
            {guidance.nextCommand}
          </code>
          <p className="mt-1 text-body-small text-on-surface-variant">
            {guidance.nextReason}
          </p>
        </div>
      </div>
      {guidance.ownershipSuggestion ? (
        <div className="mt-4 border-y border-warning px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-title-small text-on-surface">Review unowned changes</p>
            <StatusPill
              value={guidance.ownershipSuggestion.confirmationRequired ? 'confirmation required' : 'review suggested'}
              tone="warning"
            />
          </div>
          <p className="mt-1 text-body-small text-on-surface-variant">
            {guidance.ownershipSuggestion.reason}
          </p>
          <ul className="mt-2 grid gap-1 font-mono text-body-small text-on-surface">
            {guidance.ownershipSuggestion.paths.map((path) => <li key={path}>{path}</li>)}
          </ul>
        </div>
      ) : null}
      {guidance.openQuestions.length > 0 ? (
        <div className="mt-4 border-y border-outline-weak">
          {guidance.openQuestions.map((question, index) => {
            const recommendedOption = question.options.find(
              (option) => option.id === question.recommendedOptionId,
            );
            return (
              <div
                key={question.id}
                className={`py-3.5 ${index > 0 ? 'border-t border-outline-weak' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-label-medium">
                    {question.question}
                  </p>
                  <StatusPill value={question.escalation.replaceAll('-', ' ')} tone="warning" />
                </div>
                <p className="mt-1.5 text-body-small text-on-surface-variant">
                  {question.whyItMatters}
                </p>
                <p className="mt-2 text-body-small font-medium text-on-surface">
                  Recommended: {recommendedOption?.label ?? question.recommendedOptionId}
                </p>
                <div className="mt-2 grid gap-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className="border-l border-outline-soft pl-3"
                    >
                      <p className="text-body-small font-medium">
                        {option.label}
                        {option.id === question.recommendedOptionId ? ' (recommended)' : ''}
                      </p>
                      <p className="mt-0.5 text-body-small text-on-surface-variant">
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
    </ContentSection>
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
    <div className="border-t border-outline-weak px-3 py-3 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0">
      <p className="text-label-small text-on-surface-variant">{label}</p>
      <p className="mt-1.5 text-title-small text-on-surface">
        {value}
      </p>
      <p className="mt-1 text-body-small text-on-surface-variant">{helper}</p>
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
    <div className="border-t border-outline-weak px-3 py-3">
      <p className="text-label-small text-on-surface-variant">{label}</p>
      <p className="mt-1 text-body-small text-on-surface">{value}</p>
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
    <ContentSection
      title="Why this task needs tracking"
      description="Skopos added this because the work looks broader or riskier than a tiny edit."
    >
      <div className="border-y border-outline-weak">
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
        <div className="border-t border-outline-weak px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-label-small text-on-surface-variant">Current tracking step</p>
            <StatusPill
              value={actionStep.status}
              tone={actionStep.status === 'complete' ? 'positive' : 'warning'}
            />
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

export function TaskContractCard({
  state,
  taskView,
}: {
  state: SkoposUiConsoleState;
  taskView: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  const task = taskView.task;
  const actorId = task.coordination.claimedBy?.actorId ?? '<id>';
  const claimCount =
    state.sessionContext?.currentTaskId === task.id
      ? state.sessionContext.coordination?.claims.length ?? 0
      : 0;

  return (
    <ContentSection
      title="What this Task promises"
      description="The accepted boundary and proof contract Skopos will use before this work can close."
    >
      <div className="grid gap-5">
        <div className="grid gap-3 md:grid-cols-3">
          <ContractSummary label="Scope" value={task.scope.scope.title} helper={task.scope.scope.id} />
          <ContractSummary label="Risk and detail" value={`${task.risk} · ${task.detail}`} helper="Controls how much contract and proof is required." />
          <ContractSummary label="Proof subject" value={task.proofSubject.kind} helper={`Baseline ${task.proofSubject.baselineId}`} />
        </div>
        {task.admission ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <p className="text-label-small text-on-surface-variant">Why this workflow</p>
              <div className="mt-2 border-y border-outline-weak">
                <ContractRow label="Workflow" value={task.admission.workflow.replace('-', ' ')} />
                <ContractRow label="Selection" value={task.admission.selectionSource.replace('-', ' ')} />
                <ContractRow label="Recommended" value={`${task.admission.recommendedRisk} · ${task.admission.recommendedDetail}`} />
              </div>
            </div>
            <ContractList
              title="Admission reasons"
              items={task.admission.reasons}
              empty="No admission explanation recorded."
            />
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-3">
          <ContractList title="Acceptance" items={task.contract.acceptanceCriteria} empty="No acceptance criteria recorded." />
          <ContractList title="Not part of this Task" items={task.contract.nonGoals} empty="No explicit non-goals recorded." />
          <ContractList title="Constraints" items={task.contract.constraints} empty="No additional constraints recorded." />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <ContractList
            title="Owned paths"
            items={task.changeScope.declaredOwnedPaths}
            empty="No paths are owned by this Task."
            monospace
          />
          <div>
            <p className="text-label-small text-on-surface-variant">Coordination</p>
            <div className="mt-2 border-y border-outline-weak">
              <ContractRow label="Claimed by" value={task.coordination.claimedBy?.actorId ?? 'Unclaimed'} />
              <ContractRow label="Active path claims" value={String(claimCount)} />
              <ContractRow label="Child Tasks" value={String(task.childTasks.length)} />
            </div>
          </div>
        </div>
        {task.parentTaskId || task.childTasks.length > 0 ? (
          <div>
            <p className="text-label-small text-on-surface-variant">Linked work</p>
            <div className="mt-2 border-y border-outline-weak">
              {task.parentTaskId ? (
                <Link
                  to="/tasks/$taskId"
                  params={{ taskId: task.parentTaskId }}
                  className="flex items-center justify-between gap-3 px-3 py-3 text-body-small hover:bg-surface-container"
                >
                  <span>Parent Task</span>
                  <code className="font-mono">{task.parentTaskId}</code>
                </Link>
              ) : null}
              {task.childTasks.map((child, index) => (
                <Link
                  key={child.taskId}
                  to="/tasks/$taskId"
                  params={{ taskId: child.taskId }}
                  className={`grid gap-1 px-3 py-3 hover:bg-surface-container md:grid-cols-[minmax(0,1fr)_auto] ${index > 0 || task.parentTaskId ? 'border-t border-outline-weak' : ''}`}
                >
                  <span className="min-w-0">
                    <span className="block text-body-medium font-medium text-on-surface">
                      {child.title}
                    </span>
                    <span className="mt-0.5 block text-body-small text-on-surface-variant">
                      {child.scopeId} · {(child.ownedPaths ?? []).length} owned path{(child.ownedPaths ?? []).length === 1 ? '' : 's'}
                    </span>
                  </span>
                  <StatusPill
                    value={child.state}
                    tone={toneForTaskState(child.state)}
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-3">
          <ContractList
            title="Selected Actions"
            items={task.selectedActions.map((action) => action.id)}
            empty="No registered Actions selected."
            monospace
          />
          <ContractList
            title="Guards"
            items={task.selectedGuardIds}
            empty="No Guards selected."
            monospace
          />
          <ContractList
            title="Evidence"
            items={task.evidenceRequirements.map(
              (requirement) => `${requirement.acceptanceCriterion} · ${requirement.evidence}`,
            )}
            empty="No Evidence requirements recorded."
          />
        </div>
        <div className="rounded-sm bg-surface-container px-3 py-3">
          <p className="text-label-small text-on-surface-variant">Closure path</p>
          <p className="mt-1.5 text-body-small text-on-surface">
            Verify the Task-local proof first. Finish only after required Evidence,
            Memory obligations, decisions, and Readiness blockers are resolved.
          </p>
          <div className="mt-2 grid gap-1.5 font-mono text-body-small leading-5 text-on-surface-variant">
            <code className="break-all whitespace-pre-wrap">skopos verify {task.id} . --phase closure --json</code>
            <code className="break-all whitespace-pre-wrap">skopos finish {task.id} . --actor {actorId}</code>
          </div>
        </div>
      </div>
    </ContentSection>
  );
}

function ContractSummary({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-outline-weak pt-3">
      <p className="text-label-small text-on-surface-variant">{label}</p>
      <p className="mt-1 text-title-small text-on-surface">{value}</p>
      <p className="mt-1 text-body-small leading-5 text-on-surface-variant">{helper}</p>
    </div>
  );
}

function ContractList({
  title,
  items,
  empty,
  monospace = false,
}: {
  title: string;
  items: string[];
  empty: string;
  monospace?: boolean;
}): React.JSX.Element {
  return (
    <div>
      <p className="text-label-small text-on-surface-variant">{title}</p>
      <div className="mt-2 border-y border-outline-weak">
        {items.length > 0 ? (
          items.map((item, index) => (
            <p
              key={`${title}-${item}`}
              className={`${index > 0 ? 'border-t border-outline-weak ' : ''}py-2.5 text-body-small text-on-surface wrap-break-word ${monospace ? 'font-mono text-body-small break-all' : ''}`}
            >
              {item}
            </p>
          ))
        ) : (
          <p className="py-2.5 text-body-small text-on-surface-variant">{empty}</p>
        )}
      </div>
    </div>
  );
}

function ContractRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-outline-weak py-2.5 first:border-t-0">
      <span className="text-body-small text-on-surface-variant">{label}</span>
      <span className="text-body-small font-medium text-on-surface">{value}</span>
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
    <ContentSection
      title="Task brief"
      description="Keep the task readable as a human work packet instead of a raw execution record."
    >
      <div className="border-y border-outline-weak">
        <section className="py-3.5">
          <p className="text-label-small uppercase text-on-surface-variant">
            Summary
          </p>
          <p className="mt-1.5 text-body-small text-on-surface">
            {task.summary}
          </p>
        </section>
        <section className="border-t border-outline-weak py-3.5">
          <p className="text-label-small uppercase text-on-surface-variant">
            Objective
          </p>
          <p className="mt-1.5 text-body-medium font-medium">
            {task.goal}
          </p>
        </section>
        <section className="border-t border-outline-weak py-3.5">
          <p className="text-label-small uppercase text-on-surface-variant">
            Progress
          </p>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-[var(--color-primary)]"
              style={{
                width: `${Math.max(
                  8,
                  Math.round((completeSteps.length / Math.max(1, task.steps.length)) * 100),
                )}%`,
              }}
            />
          </div>
          <p className="mt-1.5 text-body-small text-on-surface-variant">
            {completeSteps.length} of {task.steps.length} steps complete.
          </p>
        </section>
        {task.disposition ? (
          <section className="border-t border-outline-weak py-3.5">
            <p className="text-label-small uppercase text-on-surface-variant">
              Latest disposition
            </p>
            <p className="mt-1.5 text-body-medium font-medium">
              {task.disposition.kind}: {task.disposition.priorState} →{' '}
              {task.disposition.nextState}
            </p>
            <p className="mt-1 text-body-small text-on-surface">
              {task.disposition.reason}
            </p>
            <p className="mt-1 text-body-small text-on-surface-variant">
              {task.disposition.actorId} · {task.disposition.recordedAt}
              {task.disposition.successorTaskId
                ? ` · successor ${task.disposition.successorTaskId}`
                : ''}
            </p>
          </section>
        ) : null}
      </div>
    </ContentSection>
  );
}

export function TaskChecklistCard({
  taskView,
}: {
  taskView: SkoposUiConsoleTaskView;
}): React.JSX.Element {
  return (
    <ContentSection title="Checklist" description="Execution items tracked by the task runtime surface.">
      <div className="border-y border-outline-weak">
        {taskView.task.steps.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start gap-3.5 py-3.5 ${
              index > 0 ? 'border-t border-outline-weak' : ''
            }`}
          >
            <div
              className={`mt-0.5 grid h-[1.375rem] w-[1.375rem] shrink-0 place-items-center rounded-full border text-label-small ${
                item.status === 'complete'
                  ? 'border-transparent bg-primary-container text-primary'
                  : 'border-outline-soft bg-transparent text-on-surface-variant'
              }`}
            >
              {item.status === 'complete' ? '✓' : '•'}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-body-small font-medium">{item.title}</p>
                <StatusPill value={item.kind} tone="neutral" />
              </div>
              <p className="mt-1 text-body-small text-on-surface-variant">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ContentSection>
  );
}

export function TaskLinkedWorkCard({
  linkedTaskViews,
}: {
  linkedTaskViews: SkoposUiConsoleTaskView[];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Linked work"
      description="Child tasks created from this task stay readable as related work, not graph trivia."
    >
      {linkedTaskViews.length > 0 ? (
        <div className="border-y border-outline-weak">
          {linkedTaskViews.map((linkedTaskView, index) => (
            <Link
              key={linkedTaskView.task.id}
              to="/tasks/$taskId"
              params={{ taskId: linkedTaskView.task.id }}
              className={`block py-3.5 transition-colors hover:bg-state-hover ${
                index > 0 ? 'border-t border-outline-weak' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-body-medium font-medium">
                    {linkedTaskView.task.title}
                  </p>
                  <p className="mt-1 text-body-small text-on-surface-variant">
                    {linkedTaskView.task.scope.scope.title}
                  </p>
                </div>
                <StatusPill
                  value={linkedTaskView.task.state}
                  tone={toneForTaskState(linkedTaskView.task.state)}
                />
              </div>
              <p className="mt-1 text-body-small text-on-surface-variant">
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
    </ContentSection>
  );
}
