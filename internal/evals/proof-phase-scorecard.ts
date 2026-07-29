import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type {
  SkoposProofBenchmarkBaseline,
  SkoposProofBenchmarkComparison,
  SkoposProofBenchmarkDefinition,
  SkoposProofBenchmarkMetric,
  SkoposProofReportArtifact,
  SkoposProofBenchmarkResult,
  SkoposProofCategoryBaseline,
  SkoposProofCategoryComparison,
  SkoposProofCategorySummary,
  SkoposProofScorecardBaseline,
  SkoposProofScorecardComparison,
  SkoposProofScorecard,
  SkoposProofScoringPolicy,
} from '../../packages/model/src/index.ts';

export type {
  SkoposProofBenchmarkCategory,
  SkoposProofBenchmarkBaseline,
  SkoposProofBenchmarkComparison,
  SkoposProofBenchmarkDefinition,
  SkoposProofBenchmarkDefinitionSet,
  SkoposProofBenchmarkMetric,
  SkoposProofBenchmarkPriority,
  SkoposProofReportArtifact,
  SkoposProofBenchmarkResult,
  SkoposProofBenchmarkStatus,
  SkoposProofCategoryBaseline,
  SkoposProofCategoryComparison,
  SkoposProofCategorySummary,
  SkoposProofComparisonStatus,
  SkoposProofMetricSeverity,
  SkoposProofScorecardBaseline,
  SkoposProofScorecardComparison,
  SkoposProofScorecard,
  SkoposProofScoringPolicy,
} from '../../packages/model/src/index.ts';

export const DEFAULT_SKOPOS_PROOF_SCORING_POLICY: SkoposProofScoringPolicy = {
  minimumWeightedPassRate: 1,
  failOnAnyBenchmarkFailure: true,
  failOnAnyMustWinBenchmarkFailure: true,
};

export const createSkoposProofMetric = (
  id: string,
  pass: boolean,
  note: string,
  severity: SkoposProofBenchmarkMetric['severity'] = 'must',
  weight?: number,
): SkoposProofBenchmarkMetric => ({
  id,
  pass,
  note,
  severity,
  weight,
});

export const buildSkoposProofBenchmarkResult = (
  benchmark: SkoposProofBenchmarkDefinition,
  metrics: SkoposProofBenchmarkMetric[],
): SkoposProofBenchmarkResult => {
  const score = metrics.reduce(
    (total, metric) => total + (metric.pass ? getMetricWeight(metric) : 0),
    0,
  );
  const maxScore = metrics.reduce((total, metric) => total + getMetricWeight(metric), 0);
  const failedMetricIds = metrics.filter((metric) => !metric.pass).map((metric) => metric.id);

  return {
    id: benchmark.id,
    fixture: benchmark.fixture,
    category: benchmark.category,
    priority: benchmark.priority,
    status: failedMetricIds.length === 0 ? 'pass' : 'fail',
    passedChecks: metrics.filter((metric) => metric.pass).length,
    failedChecks: failedMetricIds.length,
    totalChecks: metrics.length,
    score,
    maxScore,
    weightedPassRate: maxScore === 0 ? 1 : score / maxScore,
    failedMetricIds,
    metrics,
  };
};

export const buildSkoposProofScorecard = ({
  definitionSetId,
  benchmarks,
  scoringPolicy = DEFAULT_SKOPOS_PROOF_SCORING_POLICY,
}: {
  definitionSetId: string;
  benchmarks: SkoposProofBenchmarkResult[];
  scoringPolicy?: SkoposProofScoringPolicy;
}): SkoposProofScorecard => {
  const benchmarkCount = benchmarks.length;
  const passedBenchmarks = benchmarks.filter((benchmark) => benchmark.status === 'pass').length;
  const failedBenchmarks = benchmarkCount - passedBenchmarks;
  const mustWinBenchmarks = benchmarks.filter(
    (benchmark) => benchmark.priority === 'must-win',
  ).length;
  const passedMustWinBenchmarks = benchmarks.filter(
    (benchmark) => benchmark.priority === 'must-win' && benchmark.status === 'pass',
  ).length;
  const failedMustWinBenchmarks = mustWinBenchmarks - passedMustWinBenchmarks;
  const score = benchmarks.reduce((total, benchmark) => total + benchmark.score, 0);
  const maxScore = benchmarks.reduce((total, benchmark) => total + benchmark.maxScore, 0);
  const weightedPassRate = maxScore === 0 ? 1 : score / maxScore;
  const categorySummaries = buildCategorySummaries(benchmarks);

  const failedByPolicy =
    (scoringPolicy.failOnAnyBenchmarkFailure && failedBenchmarks > 0) ||
    (scoringPolicy.failOnAnyMustWinBenchmarkFailure && failedMustWinBenchmarks > 0) ||
    weightedPassRate < scoringPolicy.minimumWeightedPassRate;

  return {
    definitionSetId,
    status: failedByPolicy ? 'fail' : 'pass',
    benchmarkCount,
    passedBenchmarks,
    failedBenchmarks,
    mustWinBenchmarks,
    passedMustWinBenchmarks,
    failedMustWinBenchmarks,
    score,
    maxScore,
    weightedPassRate,
    scoringPolicy,
    categorySummaries,
    benchmarks,
  };
};

export const compareSkoposProofScorecardToBaseline = ({
  baseline,
  current,
}: {
  baseline: SkoposProofScorecardBaseline;
  current: SkoposProofScorecard;
}): SkoposProofScorecardComparison => {
  const benchmarkComparisons = baseline.benchmarks.map((item) =>
    compareBenchmarkToBaseline(item, current.benchmarks),
  );
  const categoryComparisons = baseline.categories.map((item) =>
    compareCategoryToBaseline(item, current.categorySummaries),
  );
  const regressedBenchmarks = benchmarkComparisons
    .filter((item) => item.status === 'regressed')
    .map((item) => item.id);
  const regressedCategories = categoryComparisons
    .filter((item) => item.status === 'regressed')
    .map((item) => item.category);
  const benchmarkCountMatches = baseline.benchmarkCount === current.benchmarkCount;
  const status =
    benchmarkCountMatches &&
    current.status === baseline.requiredStatus &&
    current.weightedPassRate >= baseline.minimumWeightedPassRate &&
    regressedBenchmarks.length === 0 &&
    regressedCategories.length === 0
      ? 'pass'
      : 'fail';

  return {
    baselineId: baseline.id,
    definitionSetId: current.definitionSetId,
    status,
    benchmarkCountMatches,
    weightedPassRateDelta: current.weightedPassRate - baseline.minimumWeightedPassRate,
    regressedBenchmarks,
    regressedCategories,
    benchmarkComparisons,
    categoryComparisons,
  };
};

export const buildSkoposProofReportArtifact = ({
  workspaceRoot,
  definitionSetPath,
  baselinePath,
  scorecard,
  comparison,
  generatedAt = new Date().toISOString(),
}: {
  workspaceRoot: string;
  definitionSetPath: string;
  baselinePath: string;
  scorecard: SkoposProofScorecard;
  comparison: SkoposProofScorecardComparison;
  generatedAt?: string;
}): SkoposProofReportArtifact => ({
  schemaVersion: 1,
  id: 'proof-latest-report',
  type: 'proof-report',
  status: 'generated',
  authority: 'generated',
  summary: 'Latest Skopos proof scorecard and committed baseline comparison.',
  updatedAt: generatedAt,
  generatedAt,
  workspaceRoot: resolve(workspaceRoot),
  definitionSetPath,
  baselinePath,
  scorecard,
  comparison,
});

export const writeSkoposProofReportArtifact = async ({
  workspaceRoot,
  artifact,
}: {
  workspaceRoot: string;
  artifact: SkoposProofReportArtifact;
}): Promise<string> => {
  const resolvedWorkspaceRoot = resolve(workspaceRoot);
  const reportPath = join(resolvedWorkspaceRoot, '.skopos', 'evidence', 'proof', 'latest-report.json');

  await mkdir(join(resolvedWorkspaceRoot, '.skopos', 'evidence', 'proof'), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');

  return reportPath;
};

const buildCategorySummaries = (
  benchmarks: SkoposProofBenchmarkResult[],
): SkoposProofCategorySummary[] => {
  const grouped = new Map<SkoposProofBenchmarkResult['category'], SkoposProofBenchmarkResult[]>();

  for (const benchmark of benchmarks) {
    const bucket = grouped.get(benchmark.category);
    if (bucket) {
      bucket.push(benchmark);
      continue;
    }

    grouped.set(benchmark.category, [benchmark]);
  }

  return [...grouped.entries()]
    .map(([category, items]) => {
      const score = items.reduce((total, item) => total + item.score, 0);
      const maxScore = items.reduce((total, item) => total + item.maxScore, 0);

      return {
        category,
        benchmarkCount: items.length,
        passedBenchmarks: items.filter((item) => item.status === 'pass').length,
        failedBenchmarks: items.filter((item) => item.status === 'fail').length,
        score,
        maxScore,
        weightedPassRate: maxScore === 0 ? 1 : score / maxScore,
      };
    })
    .sort((left, right) => left.category.localeCompare(right.category));
};

const getMetricWeight = (metric: SkoposProofBenchmarkMetric): number =>
  metric.weight ?? (metric.severity === 'must' ? 2 : 1);

const compareBenchmarkToBaseline = (
  baseline: SkoposProofBenchmarkBaseline,
  benchmarks: SkoposProofBenchmarkResult[],
): SkoposProofBenchmarkComparison => {
  const current = benchmarks.find((benchmark) => benchmark.id === baseline.id);

  if (!current) {
    return {
      id: baseline.id,
      status: 'regressed',
      baselineStatus: baseline.requiredStatus,
      currentStatus: 'fail',
      baselineMinimumWeightedPassRate: baseline.minimumWeightedPassRate,
      currentWeightedPassRate: 0,
    };
  }

  return {
    id: baseline.id,
    status: classifyComparisonStatus({
      baselineStatus: baseline.requiredStatus,
      currentStatus: current.status,
      baselineMinimumWeightedPassRate: baseline.minimumWeightedPassRate,
      currentWeightedPassRate: current.weightedPassRate,
    }),
    baselineStatus: baseline.requiredStatus,
    currentStatus: current.status,
    baselineMinimumWeightedPassRate: baseline.minimumWeightedPassRate,
    currentWeightedPassRate: current.weightedPassRate,
  };
};

const compareCategoryToBaseline = (
  baseline: SkoposProofCategoryBaseline,
  categories: SkoposProofCategorySummary[],
): SkoposProofCategoryComparison => {
  const current = categories.find((category) => category.category === baseline.category);

  if (!current) {
    return {
      category: baseline.category,
      status: 'regressed',
      baselineStatus: baseline.requiredStatus,
      currentStatus: 'fail',
      baselineMinimumWeightedPassRate: baseline.minimumWeightedPassRate,
      currentWeightedPassRate: 0,
    };
  }

  const currentStatus = current.failedBenchmarks === 0 ? 'pass' : 'fail';

  return {
    category: baseline.category,
    status: classifyComparisonStatus({
      baselineStatus: baseline.requiredStatus,
      currentStatus,
      baselineMinimumWeightedPassRate: baseline.minimumWeightedPassRate,
      currentWeightedPassRate: current.weightedPassRate,
    }),
    baselineStatus: baseline.requiredStatus,
    currentStatus,
    baselineMinimumWeightedPassRate: baseline.minimumWeightedPassRate,
    currentWeightedPassRate: current.weightedPassRate,
  };
};

const classifyComparisonStatus = ({
  baselineStatus,
  currentStatus,
  baselineMinimumWeightedPassRate,
  currentWeightedPassRate,
}: {
  baselineStatus: SkoposProofScorecardBaseline['requiredStatus'];
  currentStatus: SkoposProofBenchmarkResult['status'];
  baselineMinimumWeightedPassRate: number;
  currentWeightedPassRate: number;
}): 'improved' | 'matched' | 'regressed' => {
  if (
    currentStatus !== baselineStatus ||
    currentWeightedPassRate < baselineMinimumWeightedPassRate
  ) {
    return 'regressed';
  }

  if (currentWeightedPassRate > baselineMinimumWeightedPassRate) {
    return 'improved';
  }

  return 'matched';
};
