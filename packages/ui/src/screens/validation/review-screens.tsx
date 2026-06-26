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
  TrustAttentionCard,
  TrustGuidanceCard,
  TrustInspectorAside,
} from '../../features/validation/review-sections.js';
import { ProgramPressureCard } from '../../features/program/program-sections.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { ReviewPage } from '../../patterns/pages/review-page.js';
import {
  Card,
  TrustCheckGroup,
} from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import { getTrustProgramContext } from '../../platform/console-state/program-selectors.js';
import {
  getActivityViewContext,
  getPolicyViewContext,
  getProofViewContext,
  getTrustViewContext,
} from '../../platform/console-state/validation-selectors.js';
import {
  toneForReadiness,
  toneForTrust,
} from '../../support/ui/tone-helpers.js';

export function TrustView(): React.JSX.Element {
  const state = requireConsoleState();
  const {
    passChecks,
    allChecks,
    warningChecks,
    failureChecks,
    sourceLinks,
    workspaceSignalItems,
    docsPostureItems,
  } = getTrustViewContext(state);
  const {
    doNowItem,
    doNextItem,
    closureObligations,
    openProgramQuestionCount,
    interruptRecommendation,
    recommendedAction,
  } = getTrustProgramContext(state);

  return (
    <ReviewPage
      kicker="Readiness"
      title="Can this work continue?"
      description={buildReadinessSentence({
        readiness: state.trustReport.readiness,
        passCount: passChecks.length,
        warningCount: warningChecks.length,
        failureCount: failureChecks.length,
      })}
      badges={[
        <StatusPill
          key="trust"
          value={state.trustReport.trustLevel}
          tone={toneForTrust(state.trustReport.trustLevel)}
        />,
        <StatusPill
          key="readiness"
          value={state.trustReport.readiness}
          tone={toneForReadiness(state.trustReport.readiness)}
        />,
      ]}
      aside={
        <TrustInspectorAside
          checkCount={state.trustReport.checks.length}
          warningCount={warningChecks.length}
          failureCount={failureChecks.length}
          findingCount={state.trustReport.findings.length}
          generatedAt={state.generatedAt}
          sourceLinks={sourceLinks}
          docsPostureItems={docsPostureItems}
          workspaceSignalItems={workspaceSignalItems}
          allChecks={allChecks}
        />
      }
    >
      <TrustGuidanceCard
        failureCount={failureChecks.length}
        warningCount={warningChecks.length}
        findingCount={state.trustReport.findings.length}
      />
      <TrustAttentionCard
        failureChecks={failureChecks}
        warningChecks={warningChecks}
        findings={state.trustReport.findings}
        unresolvedAssumptions={state.trustReport.unresolvedAssumptions}
      />
      <ProgramPressureCard
        state={state}
        doNowItem={doNowItem}
        doNextItem={doNextItem}
        closureObligations={closureObligations}
        openProgramQuestionCount={openProgramQuestionCount}
        interruptRecommendation={interruptRecommendation}
        recommendedAction={recommendedAction}
      />
      <Card
        title="Supporting checks"
        description="Passing checks that explain why Skopos is comfortable with the current state."
      >
        {passChecks.length > 0 ? (
          <TrustCheckGroup title="Passing checks" checks={passChecks} tone="positive" />
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
      <RuleDriftCard context={context} />
      <LocalExceptionsCard context={context} />
      <ActiveRulesCard context={context} />
    </ReviewPage>
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
      description="Recent work, readiness, evidence, and workflow changes recorded by Skopos."
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
