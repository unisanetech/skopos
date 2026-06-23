import * as React from 'react';

import {
  ActivityInspectorAside,
  ActivityTimelineCard,
  ProofCategoryWatchCard,
  ProofInspectorAside,
  ProofMustWinCard,
  ProofPostureCard,
  ProofRegressedBenchmarksCard,
  TrustAttentionCard,
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
      kicker="Trust surface"
      title="Readiness and evidence"
      description={state.trustReport.summary}
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
        description="Passing checks that help explain the current trust posture."
      >
        {passChecks.length > 0 ? (
          <TrustCheckGroup title="Passing checks" checks={passChecks} tone="positive" />
        ) : (
          <EmptyMessage
            title="No passing checks"
            description="This snapshot did not record passing trust checks."
          />
        )}
      </Card>
    </ReviewPage>
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
      kicker="Proof posture"
      title="Reliability scorecard"
      description="Latest benchmark posture across pass rate, must-win coverage, and baseline drift."
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
          title="No proof report"
          description="Run proof to populate the reliability scorecard."
        />
        )
      }
    >
      {proofReport ? (
        <PageSectionStack>
          <ProofPostureCard proofReport={proofReport} />
          <ProofCategoryWatchCard
            categories={visibleCategoryWatch}
            regressedCategorySet={regressedCategorySet}
          />
          <ProofMustWinCard benchmarks={mustWinBenchmarks} />
          <ProofRegressedBenchmarksCard benchmarks={regressedBenchmarks} />
        </PageSectionStack>
      ) : (
        <EmptyMessage
          title="No proof report available"
          description="This snapshot does not include a proof report."
        />
      )}
    </ReviewPage>
  );
}

export function ActivityView(): React.JSX.Element {
  const state = requireConsoleState();
  const { latestEntry, postureItems, feedGroups } = getActivityViewContext(state);

  return (
    <ReviewPage
      kicker="Operational history"
      title="Activity and provenance"
      description="Recent operational changes across trust, plans, missions, and workflow evidence."
      aside={
        <ActivityInspectorAside
          postureItems={postureItems}
          latestEntry={latestEntry}
        />
      }
    >
      <ActivityTimelineCard feedGroups={feedGroups} />
    </ReviewPage>
  );
}
