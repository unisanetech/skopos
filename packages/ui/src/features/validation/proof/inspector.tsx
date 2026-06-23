import * as React from 'react';

import type { SkoposUiConsoleState } from '../../../contracts/skopos-ui-console-state.js';
import {
  ExternalLinkList,
  KeyValueList,
  SidebarCard,
  SidebarList,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import {
  formatDateTime,
  formatPercent,
  formatSignedPercent,
  humanize,
} from '../../../support/formatting/console-formatting.js';
import { cn } from '../../../support/ui/classnames.js';

export function ProofInspectorAside({
  proofReport,
  sourceLinks,
  improvedCategoryCount,
  regressedCategorySet,
  improvedCategorySet,
}: {
  proofReport: NonNullable<SkoposUiConsoleState['proofReport']>;
  sourceLinks: SkoposUiConsoleState['docsLinks'];
  improvedCategoryCount: number;
  regressedCategorySet: Set<string>;
  improvedCategorySet: Set<string>;
}): React.JSX.Element {
  const changedCategoryCount = proofReport.comparison.categoryComparisons.filter(
    (comparison) => comparison.status !== 'matched',
  ).length;

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Status', value: proofReport.scorecard.status },
            { label: 'Comparison', value: proofReport.comparison.status },
            {
              label: 'Pass rate',
              value: formatPercent(proofReport.scorecard.weightedPassRate),
            },
            {
              label: 'Must win',
              value: `${proofReport.scorecard.passedMustWinBenchmarks}/${proofReport.scorecard.mustWinBenchmarks}`,
            },
            { label: 'Updated', value: formatDateTime(proofReport.updatedAt) },
          ]}
        />
      </SidebarCard>
      <SidebarCard
        title="Comparison summary"
        badge={String(changedCategoryCount)}
        collapsible
        defaultOpen={false}
      >
        <KeyValueList
          items={[
            {
              label: 'Weighted delta',
              value: formatSignedPercent(proofReport.comparison.weightedPassRateDelta),
            },
            {
              label: 'Changed categories',
              value: String(changedCategoryCount),
            },
            {
              label: 'Regressed categories',
              value: String(proofReport.comparison.regressedCategories.length),
            },
            {
              label: 'Improved categories',
              value: String(improvedCategoryCount),
            },
            {
              label: 'Regressed benchmarks',
              value: String(proofReport.comparison.regressedBenchmarks.length),
            },
            {
              label: 'Benchmark parity',
              value: proofReport.comparison.benchmarkCountMatches
                ? 'Matched baseline'
                : 'Count drift detected',
            },
          ]}
        />
      </SidebarCard>
      <SidebarCard
        title="Category scorecard"
        badge={String(proofReport.scorecard.categorySummaries.length)}
        collapsible
        defaultOpen={false}
      >
        <SidebarList
          items={proofReport.scorecard.categorySummaries}
          getKey={(category) => category.category}
          renderItem={(category) => (
            <>
              <div className="flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium tracking-[-0.01em]">
                    {humanize(category.category)}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
                    {category.passedBenchmarks}/{category.benchmarkCount} passing
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {regressedCategorySet.has(category.category) ? (
                    <StatusPill value="regressed" tone="danger" />
                  ) : null}
                  {improvedCategorySet.has(category.category) ? (
                    <StatusPill value="improved" tone="positive" />
                  ) : null}
                  <span
                    className={cn(
                      'text-[12.5px] font-semibold tracking-[-0.02em] text-[var(--muted-strong)]',
                    )}
                  >
                    {formatPercent(category.weightedPassRate)}
                  </span>
                </div>
              </div>
            </>
          )}
          emptyTitle="No categories"
          emptyDescription="No category scorecard entries are available in this proof report."
        />
      </SidebarCard>
      <SidebarCard
        title="Source links"
        badge={String(sourceLinks.length)}
        collapsible
        defaultOpen={false}
      >
        <ExternalLinkList
          links={sourceLinks.slice(0, 4)}
          totalCount={sourceLinks.length}
          showPaths={false}
        />
      </SidebarCard>
    </>
  );
}
