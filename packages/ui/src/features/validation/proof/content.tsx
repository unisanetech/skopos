import * as React from 'react';

import type { SkoposUiConsoleState } from '../../../contracts/skopos-ui-console-state.js';
import { ContentSection } from '../../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  ReviewRow,
  StatusPill,
} from '../../../patterns/sections/inspector-primitives.js';
import {
  formatPercent,
  humanize,
} from '../../../support/formatting/console-formatting.js';
import { cn } from '../../../support/ui/classnames.js';

export function ProofPostureCard({
  proofReport,
}: {
  proofReport: NonNullable<SkoposUiConsoleState['proofReport']>;
}): React.JSX.Element {
  return (
    <ContentSection
      title="Evidence summary"
      description="The main pass rate, must-win coverage, and regression status from the latest proof run."
    >
      <div className="grid gap-3">
        <ReviewRow
          label="Weighted pass rate"
          value={formatPercent(proofReport.scorecard.weightedPassRate)}
        />
        <ReviewRow
          label="Benchmarks"
          value={`${proofReport.scorecard.passedBenchmarks}/${proofReport.scorecard.benchmarkCount} passing`}
        />
        <ReviewRow
          label="Must-win"
          value={`${proofReport.scorecard.passedMustWinBenchmarks}/${proofReport.scorecard.mustWinBenchmarks} passing`}
        />
        <ReviewRow
          label="Regressions"
          value={
            proofReport.comparison.regressedBenchmarks.length > 0
              ? `${proofReport.comparison.regressedBenchmarks.length} benchmark regressions`
              : 'No benchmark regressions'
          }
        />
      </div>
    </ContentSection>
  );
}

export function ProofGuidanceCard({
  proofReport,
}: {
  proofReport?: SkoposUiConsoleState['proofReport'];
}): React.JSX.Element {
  const hasRegression = (proofReport?.comparison.regressedBenchmarks.length ?? 0) > 0;
  const isPassing =
    proofReport?.scorecard.status === 'pass' && proofReport.comparison.status === 'pass';

  return (
    <ContentSection
      title="How to use this page"
      description="Evidence shows whether tests, benchmarks, or comparison results are strong enough to close risky work."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Start here"
          text={
            !proofReport
              ? 'No proof report is available yet for this workspace snapshot.'
              : isPassing
              ? 'The current evidence is passing against the recorded baseline.'
              : 'Review failed checks or regressions before closing the task.'
          }
        />
        <GuidancePoint
          label="Use when"
          text="The change affects behavior, architecture, policy, generated files, or anything risky enough to need proof."
        />
        <GuidancePoint
          label="Next step"
          text={
            !proofReport
              ? 'Run the proof command when the current work needs test or benchmark evidence.'
              : hasRegression
              ? 'Fix or explain the regressed benchmark, then rerun proof.'
              : 'Keep this evidence with the task closure summary if the work is ready.'
          }
        />
      </div>
    </ContentSection>
  );
}

export function ProofCategoryWatchCard({
  categories,
  regressedCategorySet,
}: {
  categories: NonNullable<SkoposUiConsoleState['proofReport']>['comparison']['categoryComparisons'];
  regressedCategorySet: Set<string>;
}): React.JSX.Element {
  return (
    <ContentSection
      title="What changed since baseline"
      description="Categories that changed or need review compared with the committed proof baseline."
    >
      {categories.length > 0 ? (
        <div className="border-y border-outline-weak">
          {categories.map((category, index) => (
            <div
              key={category.category}
              className={cn(
                'flex items-center justify-between gap-4 py-4',
                index > 0 ? 'border-t border-outline-weak' : undefined,
              )}
            >
              <div>
                <p className="text-body-medium font-medium">
                  {humanize(category.category)}
                </p>
                <p className="mt-1 text-body-small text-on-surface-variant">
                  {`Baseline ${category.baselineStatus} -> current ${category.currentStatus}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {regressedCategorySet.has(category.category) ? (
                  <StatusPill value="regressed" tone="danger" />
                ) : null}
                <p className="text-title-small">
                  {formatPercent(category.currentWeightedPassRate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No changed categories"
          description="No category drift is currently interrupting proof review."
        />
      )}
    </ContentSection>
  );
}

export function ProofMustWinCard({
  benchmarks,
}: {
  benchmarks: NonNullable<SkoposUiConsoleState['proofReport']>['scorecard']['benchmarks'];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Must-pass checks"
      description="Benchmarks marked as important enough that they should pass before closure."
    >
      {benchmarks.length > 0 ? (
        <div className="border-y border-outline-weak">
          {benchmarks.map((benchmark, index) => (
            <div
              key={benchmark.id}
              className={cn('py-4', index > 0 ? 'border-t border-outline-weak' : undefined)}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-body-medium font-medium">{benchmark.id}</p>
                  <p className="mt-1 text-body-small text-on-surface-variant">
                    {humanize(benchmark.category)}
                  </p>
                </div>
                <StatusPill
                  value={benchmark.status}
                  tone={benchmark.status === 'pass' ? 'positive' : 'danger'}
                />
              </div>
              <p className="mt-2 text-body-medium leading-6 text-on-surface-variant">
                {benchmark.failedMetricIds.length > 0
                  ? `Missing: ${benchmark.failedMetricIds.join(' · ')}`
                  : 'No failed metrics in this must-win benchmark.'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No must-win benchmarks"
          description="No must-win benchmark entries are present in this report."
        />
      )}
    </ContentSection>
  );
}

export function ProofRegressedBenchmarksCard({
  benchmarks,
}: {
  benchmarks: NonNullable<SkoposUiConsoleState['proofReport']>['scorecard']['benchmarks'];
}): React.JSX.Element {
  return (
    <ContentSection
      title="Regressed benchmarks"
      description="Any benchmark that fell behind the committed baseline stays visible as direct review pressure."
    >
      {benchmarks.length > 0 ? (
        <div className="border-y border-outline-weak">
          {benchmarks.map((benchmark, index) => (
            <div
              key={benchmark.id}
              className={cn('py-4', index > 0 ? 'border-t border-outline-weak' : undefined)}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-body-medium font-medium">{benchmark.id}</p>
                  <p className="mt-1 text-body-small text-on-surface-variant">
                    {humanize(benchmark.category)} · {benchmark.fixture}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={benchmark.priority} tone="warning" />
                  <StatusPill value={benchmark.status} tone="danger" />
                </div>
              </div>
              <p className="mt-2 text-body-medium leading-6 text-on-surface-variant">
                {benchmark.failedMetricIds.length > 0
                  ? `Missing: ${benchmark.failedMetricIds.join(' · ')}`
                  : 'Baseline drift was recorded without failed metric ids in this snapshot.'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No regressed benchmarks"
          description="The committed baseline is not currently reporting benchmark regressions."
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
