import * as React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import {
  PlanDecisionPressureCard,
  PlanDetailGuidanceCard,
  PlanDetailInspectorAside,
  PlanListGuidanceCard,
  PlanListCard,
  PlansInspectorAside,
  PlanActionRecordingCard,
  PlanWorkPlanCard,
} from '../../features/knowledge/plans/index.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { DetailPage } from '../../patterns/pages/detail-page.js';
import { PageSectionStack } from '../../patterns/pages/shared.js';
import { RouteFilterBar } from '../../patterns/sections/content-primitives.js';
import { EmptyMessage, StatusPill } from '../../patterns/sections/inspector-primitives.js';
import { SegmentedButton } from '../../components/ui/segmented-button.js';
import { getPlanCollections, getPlanDetailContext } from '../../platform/console-state/knowledge-selectors.js';
import { requireConsoleState } from '../../platform/console-state/access.js';

export function PlansView({
  search,
}: {
  search: { view: 'current' | 'library' | 'all' };
}): React.JSX.Element {
  const state = requireConsoleState();
  const navigate = useNavigate();
  const { activePlans, taskLinkedPlans, libraryPlans, latestPlan, linkedTaskByPlanId } =
    getPlanCollections(state);
  const showCurrentPlans = search.view !== 'library';
  const showLibraryPlans = search.view !== 'current';

  return (
    <ListPage
      title="Plans"
      description="Plans are saved when work is large, risky, or needs a clear path before editing."
      aside={
        <PlansInspectorAside
          currentCount={activePlans.length}
          linkedCount={taskLinkedPlans.length}
          libraryCount={libraryPlans.length}
          updatedAt={latestPlan?.plan.updatedAt}
        />
      }
      filters={
        <RouteFilterBar label="Plan view">
          <SegmentedButton
            aria-label="Plan view"
            size="sm"
            value={search.view}
            options={[
              { value: 'current', label: 'Current' },
              { value: 'library', label: 'Library' },
              { value: 'all', label: 'All' },
            ]}
            onValueChange={(view) => void navigate({ to: '/plans', search: { view } })}
          />
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
            linkedTaskByPlanId={linkedTaskByPlanId}
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
  const { planView, relatedTask } = getPlanDetailContext(state, planId);

  if (!planView) {
    return (
      <DetailPage
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
      title={planView.plan.title}
      description={planView.plan.goal}
      badges={[
        <StatusPill
          key="confidence"
          value={planView.plan.confidence}
          tone={planView.plan.confidence === 'high' ? 'positive' : 'warning'}
        />,
        relatedTask ? (
          <StatusPill key="task" value={relatedTask.task.state} tone="info" />
        ) : null,
      ]}
      aside={<PlanDetailInspectorAside planView={planView} relatedTask={relatedTask} />}
    >
      <PageSectionStack>
        <PlanDetailGuidanceCard planView={planView} relatedTask={relatedTask} />
        <PlanWorkPlanCard
          implementationSteps={planView.plan.implementationSteps}
          nextSteps={planView.plan.nextSteps}
        />
        <PlanDecisionPressureCard
          decisionQuestions={planView.plan.decisionQuestions}
          risks={planView.plan.risks}
        />
        <PlanActionRecordingCard planView={planView} />
      </PageSectionStack>
    </DetailPage>
  );
}
