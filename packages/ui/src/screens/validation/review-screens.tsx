import * as React from 'react';

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
  Card,
  ReadinessCheckGroup,
} from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import {
  getActivityViewContext,
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

  return (
    <ReviewPage
      kicker="Readiness"
      title="Can this work continue?"
      description={buildReadinessSentence({
        readiness: state.readinessReport.readiness,
        passCount: passChecks.length,
        warningCount: warningChecks.length,
        failureCount: failureChecks.length,
      })}
      badges={[
        <StatusPill
          key="readiness"
          value={state.readinessReport.readiness}
          tone={toneForReadiness(state.readinessReport.readiness)}
        />,
        <StatusPill
          key="readiness"
          value={state.readinessReport.readiness}
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
      <ReadinessGuidanceCard
        failureCount={failureChecks.length}
        warningCount={warningChecks.length}
        findingCount={state.readinessReport.blockers.length}
      />
      <ReadinessAttentionCard
        failureChecks={failureChecks}
        warningChecks={warningChecks}
        findings={state.readinessReport.blockers}
        unresolvedAssumptions={state.readinessReport.warnings}
      />
      <Card
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
      </Card>
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
  `Readiness is ${readiness} with ${passCount} ${passCount === 1 ? 'passing check' : 'passing checks'}, ${warningCount} ${warningCount === 1 ? 'warning' : 'warnings'}, and ${failureCount} ${failureCount === 1 ? 'failure' : 'failures'}.`;

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
      kicker="Evidence"
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
      kicker="Rules"
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
    <Card
      title="Task skills"
      description="Accepted skills add compact project guidance and select existing actions and guards. They do not create another action or closure authority."
    >
      {accepted.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          {accepted.map((skill, index) => {
            const recommendation = recommendations.find(
              (entry) => entry.packId === skill.packId,
            );
            return (
              <div
                key={skill.packId}
                className={`py-3.5 ${index > 0 ? 'border-t border-[var(--line)]' : ''}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="skopos-caption font-medium tracking-[-0.01em]">
                    {recommendation?.displayName ?? skill.packId}
                  </p>
                  <StatusPill value="accepted" tone="positive" />
                </div>
                <p className="skopos-helper-copy mt-1.5">
                  {skill.bindingId} · {skill.version} · projected to {projectionCount}{' '}
                  host{projectionCount === 1 ? '' : 's'}
                </p>
                <p className="skopos-caption-muted mt-1.5">{skill.reason}</p>
              </div>
            );
          })}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="border-y border-[var(--line)] py-3.5">
          <p className="skopos-caption font-medium">
            {recommendations.filter((entry) => entry.recommendation === 'adopt').length}{' '}
            ready to adopt
          </p>
          <p className="skopos-helper-copy mt-1.5">
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
    </Card>
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
        kicker="Rules"
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
      kicker="Rule pack"
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
      <PackStructureTreeCard pack={pack} />
      <PackRoleMappingReviewCard pack={pack} />
      <PackArchitectureContractCard pack={pack} />
      <PackGuardStatusCard pack={pack} />
      <PackRulesCard pack={pack} />
    </ReviewPage>
  );
}

export function ActivityView(): React.JSX.Element {
  const state = requireConsoleState();
  const { latestEntry, postureItems, feedGroups } = getActivityViewContext(state);

  return (
    <ReviewPage
      kicker="Activity"
      title="What changed recently?"
      description="Recent work, readiness, evidence, and action changes recorded by Skopos."
      aside={
        <ActivityInspectorAside
          postureItems={postureItems}
          latestEntry={latestEntry}
        />
      }
    >
      <ActivityGuidanceCard
        latestEntry={latestEntry}
        eventGroupCount={feedGroups.length}
      />
      <ActivityTimelineCard feedGroups={feedGroups} />
    </ReviewPage>
  );
}
