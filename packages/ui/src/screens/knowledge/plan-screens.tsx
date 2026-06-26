import * as React from 'react';
import { Link } from '@tanstack/react-router';

import {
  PlanDecisionPressureCard,
  PlanDetailGuidanceCard,
  PlanDetailInspectorAside,
  PlanFrameCard,
  PlanListGuidanceCard,
  PlanListCard,
  PlansInspectorAside,
  PlanWorkPlanCard,
} from '../../features/knowledge/plans/index.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { DetailPage } from '../../patterns/pages/detail-page.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { RouteFilterBar } from '../../patterns/sections/content-primitives.js';
import { EmptyMessage, StatusPill } from '../../patterns/sections/inspector-primitives.js';
import { getPlanCollections, getPlanDetailContext } from '../../platform/console-state/knowledge-selectors.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import { filterChipClass } from '../../support/ui/filter-chip.js';

export function PlansView({
  search,
}: {
  search: { view: 'current' | 'library' | 'all' };
}): React.JSX.Element {
  const state = requireConsoleState();
  const { activePlans, missionLinkedPlans, libraryPlans, latestPlan, linkedMissionByPlanId } =
    getPlanCollections(state);
  const showCurrentPlans = search.view !== 'library';
  const showLibraryPlans = search.view !== 'current';

  return (
    <ListPage
      kicker="Plans"
      title="Plans"
      description="Plans are saved when work is large, risky, or needs a clear path before editing."
      aside={
        <PlansInspectorAside
          currentCount={activePlans.length}
          linkedCount={missionLinkedPlans.length}
          libraryCount={libraryPlans.length}
          updatedAt={latestPlan?.plan.updatedAt}
        />
      }
      filters={
        <RouteFilterBar label="Plan view">
          {([
            ['current', 'Current'],
            ['library', 'Library'],
            ['all', 'All'],
          ] as const).map(([value, label]) => (
            <Link
              key={value}
              to="/plans"
              search={{ view: value }}
              className={filterChipClass(search.view === value)}
            >
              {label}
            </Link>
          ))}
        </RouteFilterBar>
      }
    >
      <PageSectionStack>
        <PlanListGuidanceCard
          currentCount={activePlans.length}
          libraryCount={libraryPlans.length}
        />
        {showCurrentPlans ? (
          <PlanListCard
            title="Current plan queue"
            description="Plans still attached to active work."
            plans={activePlans}
            linkedMissionByPlanId={linkedMissionByPlanId}
            emptyTitle="No active plans"
            emptyDescription="No active work is using a saved plan. Small tasks can stay lightweight; larger work should create or link a plan before editing."
          />
        ) : null}
        {showLibraryPlans ? (
          <PlanListCard
            title="Plan library"
            description="Retained plans that are not currently driving active work."
            plans={libraryPlans}
            compact
            emptyTitle="No library plans"
            emptyDescription="Older or reusable plans will appear here after they are saved outside the active work queue."
          />
        ) : null}
      </PageSectionStack>
    </ListPage>
  );
}

export function PlanDetailView({ planId }: { planId: string }): React.JSX.Element {
  const state = requireConsoleState();
  const { planView, relatedMission } = getPlanDetailContext(state, planId);

  if (!planView) {
    return (
      <DetailPage
        kicker="Plan detail"
        title="Plan not found"
        description="The requested plan is not present in this snapshot."
      >
        <EmptyMessage
          title="Unknown plan"
          description="Refresh the app after rebuilding Skopos state if plans changed."
        />
      </DetailPage>
    );
  }

  return (
    <DetailPage
      kicker="Plan detail"
      title={planView.plan.title}
      description={planView.plan.summary}
      badges={[
        <StatusPill
          key="confidence"
          value={planView.plan.confidence}
          tone={planView.plan.confidence === 'high' ? 'positive' : 'warning'}
        />,
        relatedMission ? (
          <StatusPill key="mission" value={relatedMission.mission.state} tone="info" />
        ) : null,
      ]}
      aside={<PlanDetailInspectorAside planView={planView} relatedMission={relatedMission} />}
    >
      <PlanDetailGuidanceCard planView={planView} relatedMission={relatedMission} />
      <PlanFrameCard planView={planView} />
      <PlanWorkPlanCard
        implementationSteps={planView.plan.implementationSteps}
        nextSteps={planView.plan.nextSteps}
      />
      <PlanDecisionPressureCard
        decisionQuestions={planView.plan.decisionQuestions}
        risks={planView.plan.risks}
      />
    </DetailPage>
  );
}
