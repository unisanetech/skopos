export type SkoposProofBenchmarkCategory =
  | 'brownfield-clean'
  | 'brownfield-mixed'
  | 'brownfield-messy'
  | 'docs-trust'
  | 'override-canonicalization'
  | 'knowledge-index-log'
  | 'hot-path-performance'
  | 'compiled-state-invalidation'
  | 'workflow-closure'
  | 'workflow-approval'
  | 'architecture-interpretation'
  | 'large-repo-slice'
  | 'tool-native-enforcement'
  | 'workspace-boundary'
  | 'self-hosting-dogfood'
  | 'multi-actor-runtime'
  | 'batch-execution';

export type SkoposProofBenchmarkPriority = 'must-win' | 'supporting';

export type SkoposProofMetricSeverity = 'must' | 'should';

export type SkoposProofBenchmarkStatus = 'pass' | 'fail';

export interface SkoposProofBenchmarkDefinition {
  id: string;
  fixture: string;
  goal: string;
  scope: string;
  category: SkoposProofBenchmarkCategory;
  priority: SkoposProofBenchmarkPriority;
}

export interface SkoposProofBenchmarkDefinitionSet {
  schemaVersion: number;
  id: string;
  benchmarks: SkoposProofBenchmarkDefinition[];
}

export interface SkoposProofBenchmarkMetric {
  id: string;
  pass: boolean;
  note: string;
  severity: SkoposProofMetricSeverity;
  weight?: number;
}

export interface SkoposProofBenchmarkResult {
  id: string;
  fixture: string;
  category: SkoposProofBenchmarkCategory;
  priority: SkoposProofBenchmarkPriority;
  status: SkoposProofBenchmarkStatus;
  passedChecks: number;
  failedChecks: number;
  totalChecks: number;
  score: number;
  maxScore: number;
  weightedPassRate: number;
  failedMetricIds: string[];
  metrics: SkoposProofBenchmarkMetric[];
}

export interface SkoposProofCategorySummary {
  category: SkoposProofBenchmarkCategory;
  benchmarkCount: number;
  passedBenchmarks: number;
  failedBenchmarks: number;
  score: number;
  maxScore: number;
  weightedPassRate: number;
}

export interface SkoposProofScoringPolicy {
  minimumWeightedPassRate: number;
  failOnAnyBenchmarkFailure: boolean;
  failOnAnyMustWinBenchmarkFailure: boolean;
}

export interface SkoposProofBenchmarkBaseline {
  id: string;
  requiredStatus: SkoposProofBenchmarkStatus;
  minimumWeightedPassRate: number;
}

export interface SkoposProofCategoryBaseline {
  category: SkoposProofBenchmarkCategory;
  requiredStatus: SkoposProofBenchmarkStatus;
  minimumWeightedPassRate: number;
}

export interface SkoposProofScorecardBaseline {
  schemaVersion: number;
  id: string;
  definitionSetId: string;
  requiredStatus: SkoposProofBenchmarkStatus;
  benchmarkCount: number;
  minimumWeightedPassRate: number;
  benchmarks: SkoposProofBenchmarkBaseline[];
  categories: SkoposProofCategoryBaseline[];
}

export type SkoposProofComparisonStatus = 'improved' | 'matched' | 'regressed';

export interface SkoposProofBenchmarkComparison {
  id: string;
  status: SkoposProofComparisonStatus;
  baselineStatus: SkoposProofBenchmarkStatus;
  currentStatus: SkoposProofBenchmarkStatus;
  baselineMinimumWeightedPassRate: number;
  currentWeightedPassRate: number;
}

export interface SkoposProofCategoryComparison {
  category: SkoposProofBenchmarkCategory;
  status: SkoposProofComparisonStatus;
  baselineStatus: SkoposProofBenchmarkStatus;
  currentStatus: SkoposProofBenchmarkStatus;
  baselineMinimumWeightedPassRate: number;
  currentWeightedPassRate: number;
}

export interface SkoposProofScorecardComparison {
  baselineId: string;
  definitionSetId: string;
  status: SkoposProofBenchmarkStatus;
  benchmarkCountMatches: boolean;
  weightedPassRateDelta: number;
  regressedBenchmarks: string[];
  regressedCategories: SkoposProofBenchmarkCategory[];
  benchmarkComparisons: SkoposProofBenchmarkComparison[];
  categoryComparisons: SkoposProofCategoryComparison[];
}

export interface SkoposProofScorecard {
  definitionSetId: string;
  status: SkoposProofBenchmarkStatus;
  benchmarkCount: number;
  passedBenchmarks: number;
  failedBenchmarks: number;
  mustWinBenchmarks: number;
  passedMustWinBenchmarks: number;
  failedMustWinBenchmarks: number;
  score: number;
  maxScore: number;
  weightedPassRate: number;
  scoringPolicy: SkoposProofScoringPolicy;
  categorySummaries: SkoposProofCategorySummary[];
  benchmarks: SkoposProofBenchmarkResult[];
}
