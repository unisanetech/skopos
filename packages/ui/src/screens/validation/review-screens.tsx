import * as React from 'react';
import { Link } from '@tanstack/react-router';

import {
  ActivityGuidanceCard,
  ActivityInspectorAside,
  ActivityTimelineCard,
  AcceptedPacksCard,
  ActiveRulesCard,
  LocalExceptionsCard,
  PackArchitectureContractCard,
  PackDetailInspectorAside,
  PackGuardStatusCard,
  PackOverviewCard,
  PackRoleMappingReviewCard,
  PackRulesCard,
  PackStructureTreeCard,
  PolicyRuleEnforcementCard,
  PolicyRuleExamplesCard,
  PolicyRuleInspectorAside,
  PolicyRuleMeaningCard,
  PolicyRuleProjectStatusCard,
  ProofCategoryWatchCard,
  ProofGuidanceCard,
  ProofInspectorAside,
  ProofMustWinCard,
  ProofPostureCard,
  ProofRegressedBenchmarksCard,
  RuleDriftCard,
  RulesGuidanceCard,
  RulesInspectorAside,
  RulesSummaryCard,
  ReadinessAttentionCard,
  ReadinessGuidanceCard,
  ReadinessInspectorAside,
} from '../../features/validation/review-sections.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { ReviewPage } from '../../patterns/pages/review-page.js';
import {
  ContentSection,
  ReadinessCheckGroup,
} from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import {
  getActivityViewContext,
  getPolicyRuleDetailContext,
  getPolicyViewContext,
  getProofViewContext,
  getReadinessViewContext,
} from '../../platform/console-state/validation-selectors.js';
import {
  toneForReadiness,
} from '../../support/ui/tone-helpers.js';

export function ReadinessView(): React.JSX.Element {
  const state = requireConsoleState();
  const {
    passChecks,
    allChecks,
    warningChecks,
    failureChecks,
    sourceLinks,
    workspaceSignalItems,
    docsPostureItems,
  } = getReadinessViewContext(state);
  const hasAttention =
    failureChecks.length > 0 ||
    warningChecks.length > 0 ||
    state.readinessReport.blockers.length > 0 ||
    state.readinessReport.warnings.length > 0;

  return (
    <ReviewPage
      title={buildReadinessTitle(state.readinessReport.readiness)}
      description={buildReadinessSentence({
        readiness: state.readinessReport.readiness,
        passCount: passChecks.length,
        warningCount: warningChecks.length,
        failureCount: failureChecks.length,
      })}
      badges={[
        <StatusPill
          key="readiness"
          value={`adoption ${state.readinessReport.readiness}`}
          tone={toneForReadiness(state.readinessReport.readiness)}
        />,
      ]}
      aside={
        <ReadinessInspectorAside
          checkCount={state.readinessReport.checks.length}
          warningCount={warningChecks.length}
          failureCount={failureChecks.length}
          findingCount={state.readinessReport.blockers.length}
          generatedAt={state.generatedAt}
          sourceLinks={sourceLinks}
          docsPostureItems={docsPostureItems}
          workspaceSignalItems={workspaceSignalItems}
          allChecks={allChecks}
        />
      }
    >
      {hasAttention ? (
        <ReadinessAttentionCard
          failureChecks={failureChecks}
          warningChecks={warningChecks}
          findings={state.readinessReport.blockers}
          unresolvedAssumptions={state.readinessReport.warnings}
        />
      ) : null}
      <ReadinessSubjectsCard state={state} />
      <ContentSection
        title="Supporting checks"
        description="Passing checks that explain why Skopos is comfortable with the current state."
      >
        {passChecks.length > 0 ? (
          <ReadinessCheckGroup title="Passing checks" checks={passChecks} tone="positive" />
        ) : (
          <EmptyMessage
            title="No passing checks"
            description="This snapshot did not record passing readiness checks."
          />
        )}
      </ContentSection>
      <ReadinessGuidanceCard
        failureCount={failureChecks.length}
        warningCount={warningChecks.length}
        findingCount={state.readinessReport.blockers.length}
      />
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
  `Adoption readiness is ${readiness} with ${passCount} ${passCount === 1 ? 'passing check' : 'passing checks'}, ${warningCount} ${warningCount === 1 ? 'warning' : 'warnings'}, and ${failureCount} ${failureCount === 1 ? 'failure' : 'failures'}.`;

const buildReadinessTitle = (readiness: string): string => {
  if (readiness === 'ready' || readiness === 'agent-ready') {
    return 'Skopos can safely guide this project';
  }
  if (readiness === 'needs-review') {
    return 'Review this project before relying on Skopos';
  }
  return 'Stabilize this project before relying on Skopos';
};

function ReadinessSubjectsCard({
  state,
}: {
  state: ReturnType<typeof requireConsoleState>;
}): React.JSX.Element {
  const task = state.sessionContext?.currentTask;
  const taskView = task
    ? state.tasks.find((candidate) => candidate.task.id === task.id)
    : undefined;
  const taskProofSubject = taskView?.task.proofSubject.kind;
  const decision = state.sessionContext?.pendingDecision;
  const workflow = state.currentTaskWorkflow?.taskId === task?.id
    ? state.currentTaskWorkflow
    : undefined;

  return (
    <ContentSection
      title="What this page answers"
      description="This page checks project adoption. Task progress, Task closure, and project integration are separate questions."
    >
      <div className="border-y border-outline-weak">
        <ReadinessSubjectRow
          title="Project adoption"
          state={state.readinessReport.readiness}
          explanation="Whether Skopos understands this Project well enough to guide work safely. This is the assessment shown on this page."
        />
        <ReadinessSubjectRow
          title="Task continuation"
          state={task ? (decision?.blocking ? 'blocked by a decision' : workflow?.readiness ?? task.state) : 'no current Task'}
          explanation={
            task
              ? workflow
                ? `${workflow.nextReason} Next: ${workflow.nextCommand}`
                : `Whether ${task.id} may take its next step now.`
              : 'Select or start a Task before asking whether implementation can continue.'
          }
        />
        <ReadinessSubjectRow
          title="Task ownership"
          state={workflow?.ownershipSuggestion ? 'review needed' : task ? 'bounded' : 'not in scope'}
          explanation={
            workflow?.ownershipSuggestion
              ? `${workflow.ownershipSuggestion.paths.length} changed path${workflow.ownershipSuggestion.paths.length === 1 ? ' is' : 's are'} outside declared ownership.`
              : task
                ? 'No current changed path is waiting for ownership review.'
                : 'Ownership is evaluated after a Task starts.'
          }
        />
        <ReadinessSubjectRow
          title="Task closure"
          state={task ? 'verify before finishing' : 'not in scope'}
          explanation={
            task
              ? `Run closure verification for ${task.id}; the adoption assessment does not certify its Evidence.`
              : 'Task closure is evaluated against one Task contract and its Evidence.'
          }
        />
        <ReadinessSubjectRow
          title="Project integration"
          state={taskProofSubject === 'project-integration' ? 'current proof subject' : 'not requested'}
          explanation="Only an explicit project-integration Task can certify an owned integrated baseline."
        />
      </div>
    </ContentSection>
  );
}

function ReadinessSubjectRow({
  title,
  state,
  explanation,
}: {
  title: string;
  state: string;
  explanation: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-outline-weak py-3.5 first:border-t-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-title-small text-on-surface">{title}</p>
        <StatusPill value={state} tone="neutral" />
      </div>
      <p className="mt-1 text-body-small text-on-surface-variant">{explanation}</p>
    </div>
  );
}

export function ProofView(): React.JSX.Element {
  const state = requireConsoleState();
  const {
    proofReport,
    mustWinBenchmarks,
    regressedBenchmarks,
    regressedCategorySet,
    improvedCategoryCount,
    improvedCategorySet,
    visibleCategoryWatch,
    sourceLinks,
  } = getProofViewContext(state);

  return (
    <ReviewPage
      title="What proves the work is safe?"
      description="Tests, benchmarks, and comparison results that help decide whether work can be closed."
      badges={
        proofReport
          ? [
              <StatusPill
                key="status"
                value={proofReport.scorecard.status}
                tone={proofReport.scorecard.status === 'pass' ? 'positive' : 'danger'}
              />,
              <StatusPill
                key="comparison"
                value={proofReport.comparison.status}
                tone={proofReport.comparison.status === 'pass' ? 'positive' : 'danger'}
              />,
            ]
          : undefined
      }
      aside={
        proofReport ? (
          <ProofInspectorAside
            proofReport={proofReport}
            sourceLinks={sourceLinks}
            improvedCategoryCount={improvedCategoryCount}
            regressedCategorySet={regressedCategorySet}
            improvedCategorySet={improvedCategorySet}
          />
        ) : (
        <EmptyMessage
          title="No evidence report"
          description="Run the evidence/proof command when a task needs test or benchmark proof before closure."
        />
        )
      }
    >
      <PageSectionStack>
        <ProofGuidanceCard proofReport={proofReport} />
        {proofReport ? (
          <>
          <ProofPostureCard proofReport={proofReport} />
          <ProofCategoryWatchCard
            categories={visibleCategoryWatch}
            regressedCategorySet={regressedCategorySet}
          />
          <ProofMustWinCard benchmarks={mustWinBenchmarks} />
          <ProofRegressedBenchmarksCard benchmarks={regressedBenchmarks} />
          </>
        ) : (
          <EmptyMessage
            title="No evidence report available"
            description="This snapshot does not include test or benchmark evidence yet."
          />
        )}
      </PageSectionStack>
    </ReviewPage>
  );
}

export function RulesView(): React.JSX.Element {
  const state = requireConsoleState();
  const context = getPolicyViewContext(state);
  const openDriftCount = context.openDriftFindings.length;

  return (
    <ReviewPage
      title="Which project rules are active?"
      description={buildRulesSentence({
        packCount: context.acceptedPacks.length,
        ruleCount:
          context.mustRules.length + context.shouldRules.length + context.advisoryRules.length,
        openDriftCount,
        overrideCount: context.localOverrides.length,
      })}
      badges={[
        <StatusPill
          key="packs"
          value={`${context.acceptedPacks.length} packs`}
          tone={context.acceptedPacks.length > 0 ? 'positive' : 'warning'}
        />,
        <StatusPill
          key="drift"
          value={openDriftCount > 0 ? `${openDriftCount} open drift` : 'no open drift'}
          tone={openDriftCount > 0 ? 'danger' : 'positive'}
        />,
        <StatusPill
          key="skills"
          value={`${state.skillReview?.resolved?.skills.acceptedSkills.length ?? 0} skills`}
          tone={
            (state.skillReview?.resolved?.skills.acceptedSkills.length ?? 0) > 0
              ? 'positive'
              : 'neutral'
          }
        />,
      ]}
      aside={
        <RulesInspectorAside
          context={context}
          generatedAt={state.generatedAt}
        />
      }
    >
      <RulesGuidanceCard context={context} />
      <RulesSummaryCard context={context} />
      <AcceptedPacksCard packs={context.acceptedPacks} />
      <SkillPacksCard skillReview={state.skillReview} />
      <RuleDriftCard context={context} />
      <LocalExceptionsCard context={context} />
      <ActiveRulesCard context={context} />
    </ReviewPage>
  );
}

function SkillPacksCard({
  skillReview,
}: {
  skillReview: ReturnType<typeof requireConsoleState>['skillReview'];
}): React.JSX.Element {
  const accepted = skillReview?.resolved?.skills.acceptedSkills ?? [];
  const recommendations =
    skillReview?.recommendations?.recommendations.recommendations ?? [];
  const projectionCount = skillReview?.projections.length ?? 0;

  return (
    <ContentSection
      title="Task skills"
      description="Accepted skills add compact project guidance and select existing actions and guards. They do not create another action or closure authority."
    >
      {accepted.length > 0 ? (
        <div className="border-y border-outline-weak">
          {accepted.map((skill, index) => {
            const recommendation = recommendations.find(
              (entry) => entry.packId === skill.packId,
            );
            return (
              <div
                key={skill.packId}
                className={`py-3.5 ${index > 0 ? 'border-t border-outline-weak' : ''}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-body-small text-on-surface font-medium">
                    {recommendation?.displayName ?? skill.packId}
                  </p>
                  <StatusPill value="accepted" tone="positive" />
                </div>
                <p className="text-body-medium text-on-surface-variant mt-1.5">
                  {skill.bindingId} · {skill.version} · projected to {projectionCount}{' '}
                  host{projectionCount === 1 ? '' : 's'}
                </p>
                <p className="text-body-small text-on-surface-variant mt-1.5">{skill.reason}</p>
              </div>
            );
          })}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="border-y border-outline-weak py-3.5">
          <p className="text-body-small text-on-surface font-medium">
            {recommendations.filter((entry) => entry.recommendation === 'adopt').length}{' '}
            ready to adopt
          </p>
          <p className="text-body-medium text-on-surface-variant mt-1.5">
            Review the project binding and approve adoption explicitly before task
            selection can use a skill.
          </p>
        </div>
      ) : (
        <EmptyMessage
          title="No skill recommendation"
          description="Run the skill recommendation command after project sources, actions, and guards are mapped."
        />
      )}
    </ContentSection>
  );
}

const buildRulesSentence = ({
  packCount,
  ruleCount,
  openDriftCount,
  overrideCount,
}: {
  packCount: number;
  ruleCount: number;
  openDriftCount: number;
  overrideCount: number;
}): string =>
  `${packCount} ${packCount === 1 ? 'pack is' : 'packs are'} accepted with ${ruleCount} active ${ruleCount === 1 ? 'rule' : 'rules'}, ${openDriftCount} open drift ${openDriftCount === 1 ? 'item' : 'items'}, and ${overrideCount} local ${overrideCount === 1 ? 'exception' : 'exceptions'}.`;

export function PackDetailView({
  packId,
}: {
  packId: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const context = getPolicyViewContext(state);
  const decodedPackId = decodeURIComponent(packId);
  const pack = context.packDetails.find((entry) => entry.packId === decodedPackId);

  if (!pack) {
    return (
      <ReviewPage
        title="Pack not found"
        description="The requested rule pack is not present in the current policy snapshot."
      >
        <EmptyMessage
          title="Unknown pack"
          description="Return to Rules and choose one of the available or accepted packs currently visible to this project."
        />
      </ReviewPage>
    );
  }

  return (
    <ReviewPage
      title={pack.displayName}
      description={pack.summary}
      badges={[
        <StatusPill key="family" value={pack.family ?? 'policy'} tone="info" />,
        <StatusPill key="rules" value={`${pack.rules.length} rules`} tone="neutral" />,
        <StatusPill
          key="structure"
          value={pack.structureMatch ? 'structure tree' : 'no structure tree'}
          tone={pack.structureMatch ? 'positive' : 'warning'}
        />,
      ]}
      aside={<PackDetailInspectorAside pack={pack} />}
    >
      <PackOverviewCard pack={pack} />
      <PackRulesCard pack={pack} />
      <PackStructureTreeCard pack={pack} />
      <PackRoleMappingReviewCard pack={pack} />
      <PackArchitectureContractCard pack={pack} />
      <PackGuardStatusCard pack={pack} />
    </ReviewPage>
  );
}

export function PolicyRuleDetailView({
  packId,
  ruleId,
}: {
  packId: string;
  ruleId: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const decodedPackId = decodeURIComponent(packId);
  const decodedRuleId = decodeURIComponent(ruleId);
  const detail = getPolicyRuleDetailContext(state, decodedPackId, decodedRuleId);

  if (!detail) {
    return (
      <ReviewPage
        title="Rule not found"
        description="The requested rule is not active in this policy pack."
      >
        <EmptyMessage
          title="Unknown rule"
          description="Return to Rules and choose a rule from an accepted pack in the current policy snapshot."
        />
      </ReviewPage>
    );
  }

  const openDriftCount = detail.driftFindings.filter((finding) => finding.status === 'open').length;

  return (
    <ReviewPage
      title={detail.rule.title}
      description={detail.rule.summary}
      badges={[
        <StatusPill key="severity" value={detail.rule.severity} tone={detail.rule.severity === 'must' ? 'danger' : detail.rule.severity === 'should' ? 'warning' : 'neutral'} />,
        <StatusPill key="pack" value={detail.pack.displayName} tone="info" />,
        <StatusPill
          key="posture"
          value={openDriftCount > 0 ? `${openDriftCount} open drift` : 'no recorded drift'}
          tone={openDriftCount > 0 ? 'danger' : 'positive'}
        />,
      ]}
      headerActions={
        <Link
          to="/rules/packs/$packId"
          params={{ packId: detail.pack.packId }}
          className="inline-flex h-9 items-center rounded-button border border-outline-weak bg-surface px-3 text-label-small text-on-surface transition-colors hover:bg-state-hover"
        >
          Back to pack
        </Link>
      }
      aside={<PolicyRuleInspectorAside detail={detail} />}
    >
      <PolicyRuleMeaningCard detail={detail} />
      <PolicyRuleExamplesCard detail={detail} />
      <PolicyRuleProjectStatusCard detail={detail} />
      <PolicyRuleEnforcementCard detail={detail} />
    </ReviewPage>
  );
}

export function ActivityView(): React.JSX.Element {
  const state = requireConsoleState();
  const { latestEntry, postureItems, feedGroups } = getActivityViewContext(state);
  const latestStory =
    feedGroups.flatMap((group) => group.entries).find((entry) => entry.feedKind !== 'event') ??
    latestEntry;

  return (
    <ReviewPage
      title="What changed recently?"
      description="Recent work, readiness, evidence, and action changes recorded by Skopos."
      aside={
        <ActivityInspectorAside
          postureItems={postureItems}
          latestEntry={latestStory}
        />
      }
    >
      <ActivityGuidanceCard
        latestEntry={latestStory}
        eventGroupCount={feedGroups.length}
      />
      <ActivityTimelineCard feedGroups={feedGroups} />
    </ReviewPage>
  );
}
