import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';
import {
  buildSkoposProofReportArtifact,
  buildSkoposProofBenchmarkResult,
  buildSkoposProofScorecard,
  compareSkoposProofScorecardToBaseline,
  createSkoposProofMetric,
  type SkoposProofBenchmarkDefinition,
  type SkoposProofBenchmarkDefinitionSet,
  type SkoposProofReportArtifact,
  type SkoposProofScorecardBaseline,
  writeSkoposProofReportArtifact,
} from '../../../../internal/evals/proof-phase-scorecard.ts';

const cliEntrypoint = fileURLToPath(new URL('../cli.ts', import.meta.url));
const cliPackageRoot = fileURLToPath(new URL('../..', import.meta.url));
const skoposWorkspaceRoot = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
const fixturesRoot = fileURLToPath(new URL('../../../../fixtures/repos', import.meta.url));
const benchmarksPath = fileURLToPath(
  new URL('../../../../internal/evals/proof-phase-benchmarks.json', import.meta.url),
);
const baselinePath = fileURLToPath(
  new URL('../../../../internal/evals/proof-phase-baseline.json', import.meta.url),
);
const proofReportPath = fileURLToPath(
  new URL('../../../../.skopos/proof/latest-report.json', import.meta.url),
);
const require = createRequire(import.meta.url);
const tsxLoaderPath = join(dirname(require.resolve('tsx/package.json')), 'dist', 'loader.mjs');

const tempDirs: string[] = [];
const metric = createSkoposProofMetric;

describe('skopos proof phase harness', { timeout: 300000 }, () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((directory) =>
        rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );
  });

  it('produces a passing scorecard for the current proof-phase benchmarks', async () => {
    const definitions = JSON.parse(
      await readFile(benchmarksPath, 'utf8'),
    ) as SkoposProofBenchmarkDefinitionSet;
    const baseline = JSON.parse(
      await readFile(baselinePath, 'utf8'),
    ) as SkoposProofScorecardBaseline;

    const benchmarks: ProofBenchmarkResult[] = [];

    for (const benchmark of definitions.benchmarks) {
      if (benchmark.id === 'clean-existing-repo-change') {
        benchmarks.push(await runCleanExistingRepoBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'messy-repo-change') {
        benchmarks.push(await runMessyRepoBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'legacy-structure-drift') {
        benchmarks.push(await runLegacyStructureBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'mixed-command-surface-stabilization') {
        benchmarks.push(await runMixedCommandSurfaceBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'brownfield-stabilization-delta') {
        benchmarks.push(await runBrownfieldStabilizationDeltaBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'partial-library-structure-drift') {
        benchmarks.push(await runPartialLibraryStructureBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'stale-docs-trust') {
        benchmarks.push(await runStaleDocsTrustBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'override-canonicalization') {
        benchmarks.push(await runOverrideCanonicalizationBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'knowledge-index-log') {
        benchmarks.push(await runKnowledgeIndexLogBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'hot-path-performance') {
        benchmarks.push(await runHotPathPerformanceBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'compiled-state-invalidation') {
        benchmarks.push(await runCompiledStateInvalidationBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'workflow-sensitive-change') {
        benchmarks.push(await runWorkflowSensitiveBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'approval-sensitive-workflow') {
        benchmarks.push(await runApprovalSensitiveWorkflowBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'brownfield-architecture-interpretation') {
        benchmarks.push(await runArchitectureInterpretationBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'large-repo-subtree-slice') {
        benchmarks.push(await runLargeRepoSubtreeBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'workspace-boundary-purity') {
        benchmarks.push(await runWorkspaceBoundaryBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'self-hosted-dogfooding') {
        benchmarks.push(await runSelfHostedDogfoodingBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'tool-native-enforcement') {
        benchmarks.push(await runToolNativeEnforcementBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'multi-actor-mission-coordination') {
        benchmarks.push(await runMultiActorMissionCoordinationBenchmark(benchmark));
        continue;
      }

      if (benchmark.id === 'batch-mission-slicing') {
        benchmarks.push(await runBatchMissionSlicingBenchmark(benchmark));
        continue;
      }

      throw new Error(`Unknown proof benchmark "${benchmark.id}".`);
    }

    const scorecard = buildSkoposProofScorecard({
      definitionSetId: definitions.id,
      benchmarks,
    });
    const comparison = compareSkoposProofScorecardToBaseline({
      baseline,
      current: scorecard,
    });
    const report = buildSkoposProofReportArtifact({
      workspaceRoot: skoposWorkspaceRoot,
      definitionSetPath: benchmarksPath,
      baselinePath,
      scorecard,
      comparison,
    });
    const reportPath = await writeSkoposProofReportArtifact({
      workspaceRoot: skoposWorkspaceRoot,
      artifact: report,
    });
    const persistedReport = JSON.parse(
      await readFile(reportPath, 'utf8'),
    ) as SkoposProofReportArtifact;

    expect(scorecard.status).toBe('pass');
    expect(scorecard.benchmarkCount).toBe(20);
    expect(scorecard.failedBenchmarks).toBe(0);
    expect(scorecard.passedBenchmarks).toBe(scorecard.benchmarkCount);
    expect(scorecard.passedMustWinBenchmarks).toBe(scorecard.mustWinBenchmarks);
    expect(scorecard.weightedPassRate).toBe(1);
    expect(scorecard.categorySummaries).toHaveLength(18);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'brownfield-mixed')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find(
        (summary) => summary.category === 'brownfield-comparison',
      )?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find(
        (summary) => summary.category === 'architecture-interpretation',
      )?.benchmarkCount,
    ).toBe(2);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'brownfield-messy')
        ?.benchmarkCount,
    ).toBe(2);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'docs-trust')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find(
        (summary) => summary.category === 'override-canonicalization',
      )?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'knowledge-index-log')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'hot-path-performance')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find(
        (summary) => summary.category === 'compiled-state-invalidation',
      )?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'workspace-boundary')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'self-hosting-dogfood')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'workflow-approval')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'multi-actor-runtime')
        ?.benchmarkCount,
    ).toBe(1);
    expect(
      scorecard.categorySummaries.find((summary) => summary.category === 'batch-execution')
        ?.benchmarkCount,
    ).toBe(1);
    expect(scorecard.benchmarks.every((benchmark) => benchmark.status === 'pass')).toBe(true);
    expect(comparison.status).toBe('pass');
    expect(comparison.benchmarkCountMatches).toBe(true);
    expect(comparison.regressedBenchmarks).toEqual([]);
    expect(comparison.regressedCategories).toEqual([]);
    expect(reportPath).toBe(proofReportPath);
    expect(persistedReport.type).toBe('proof-report');
    expect(persistedReport.workspaceRoot).toBe(skoposWorkspaceRoot);
    expect(persistedReport.definitionSetPath).toBe(benchmarksPath);
    expect(persistedReport.baselinePath).toBe(baselinePath);
    expect(persistedReport.scorecard.status).toBe('pass');
    expect(persistedReport.comparison.status).toBe('pass');
  });
});

const runCleanExistingRepoBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      detected: {
        repoMode: string;
        archetypeSuggestion: string;
        frameworks: string[];
        languages: string[];
      };
    };
    architecture: {
      alignmentStatus: string;
      current: {
        topology: string;
      };
      recommended: {
        topology: string;
      };
      unresolvedDecisions: Array<{ id: string }>;
    };
  }>(['init', workspaceDir, '--json']);
  const plan = runCliJson<{
    scope: { scope: { id: string } };
    recommendedChecks: string[];
  }>(['plan', benchmark.goal, workspaceDir, '--scope', benchmark.scope, '--json']);

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'repo-mode',
      init.bootstrap.detected.repoMode === 'single',
      `repo mode: ${init.bootstrap.detected.repoMode}`,
    ),
    metric(
      'archetype-detected',
      init.bootstrap.detected.archetypeSuggestion === 'api',
      `archetype: ${init.bootstrap.detected.archetypeSuggestion}`,
    ),
    metric(
      'framework-detected',
      init.bootstrap.detected.frameworks.includes('express'),
      `frameworks: ${init.bootstrap.detected.frameworks.join(', ')}`,
    ),
    metric(
      'language-detected',
      init.bootstrap.detected.languages.includes('typescript'),
      `languages: ${init.bootstrap.detected.languages.join(', ')}`,
    ),
    metric('scope-selection', plan.scope.scope.id === 'workspace', `scope: ${plan.scope.scope.id}`),
    metric(
      'canonical-checks',
      plan.recommendedChecks.length === 4,
      `checks: ${plan.recommendedChecks.join(' | ') || 'none'}`,
    ),
    metric(
      'architecture-aligned',
      init.architecture.alignmentStatus === 'aligned',
      `alignment: ${init.architecture.alignmentStatus}`,
    ),
    metric(
      'architecture-stable-topology',
      init.architecture.current.topology === 'single-service' &&
        init.architecture.recommended.topology === 'single-service' &&
        init.architecture.unresolvedDecisions.length === 0,
      `current: ${init.architecture.current.topology}, recommended: ${init.architecture.recommended.topology}, decisions: ${init.architecture.unresolvedDecisions.length}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runMessyRepoBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const diagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
    remediationMissions: Array<{ id: string }>;
  }>(['scan', workspaceDir, '--json']);

  const metrics: ProofBenchmarkMetric[] = [
    metric('repo-health', diagnosis.health === 'at-risk', `health: ${diagnosis.health}`),
    metric(
      'instruction-conflict',
      diagnosis.findings.some(
        (finding) =>
          finding.id === 'instruction-surface' && finding.classification === 'conflicting',
      ),
      `instruction finding: ${stringifyFinding(diagnosis.findings, 'instruction-surface')}`,
    ),
    metric(
      'command-conflict',
      diagnosis.findings.some(
        (finding) => finding.id === 'command-surface' && finding.classification === 'conflicting',
      ),
      `command finding: ${stringifyFinding(diagnosis.findings, 'command-surface')}`,
    ),
    metric(
      'remediation-missions',
      diagnosis.remediationMissions.length >= 3,
      `missions: ${diagnosis.remediationMissions.map((mission) => mission.id).join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runLegacyStructureBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      detected: {
        repoMode: string;
        docsRoots: string[];
        instructionFiles: string[];
      };
    };
    architecture: {
      alignmentStatus: string;
      current: {
        topology: string;
        boundaryQuality: string;
      };
      recommended: {
        topology: string;
      };
      unresolvedDecisions: Array<{ id: string }>;
    };
  }>(['init', workspaceDir, '--json']);
  const diagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
  }>(['scan', workspaceDir, '--json']);

  const metrics = [
    metric(
      'repo-mode',
      init.bootstrap.detected.repoMode === 'multi-package',
      `repo mode: ${init.bootstrap.detected.repoMode}`,
    ),
    metric(
      'docs-and-instructions-canonical',
      init.bootstrap.detected.docsRoots.includes('docs') &&
        init.bootstrap.detected.instructionFiles.includes('AGENTS.md'),
      `docs/instructions: ${init.bootstrap.detected.docsRoots.join(', ') || 'none'} / ${init.bootstrap.detected.instructionFiles.join(', ') || 'none'}`,
    ),
    metric(
      'repo-health',
      diagnosis.health === 'needs-stabilization',
      `health: ${diagnosis.health}`,
    ),
    metric(
      'workspace-structure-recommended',
      diagnosis.findings.some(
        (finding) =>
          finding.id === 'workspace-structure' &&
          finding.classification === 'recommended' &&
          finding.severity === 'medium',
      ),
      `workspace finding: ${stringifyFinding(diagnosis.findings, 'workspace-structure')}`,
    ),
    metric(
      'command-surface-canonical',
      diagnosis.findings.some(
        (finding) => finding.id === 'command-surface' && finding.classification === 'canonical',
      ),
      `command finding: ${stringifyFinding(diagnosis.findings, 'command-surface')}`,
    ),
    metric(
      'architecture-divergent',
      init.architecture.alignmentStatus === 'divergent' &&
        init.architecture.current.topology === 'mixed-monorepo' &&
        init.architecture.recommended.topology === 'platform-monorepo',
      `alignment/current/recommended: ${init.architecture.alignmentStatus}/${init.architecture.current.topology}/${init.architecture.recommended.topology}`,
    ),
    metric(
      'architecture-boundaries-mixed',
      init.architecture.current.boundaryQuality === 'mixed' &&
        init.architecture.unresolvedDecisions.length === 1,
      `boundary quality/decisions: ${init.architecture.current.boundaryQuality}/${init.architecture.unresolvedDecisions.length}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runMixedCommandSurfaceBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      detected: {
        repoMode: string;
        docsRoots: string[];
        instructionFiles: string[];
        commands: Record<string, string | undefined>;
      };
    };
    architecture: {
      alignmentStatus: string;
      current: {
        topology: string;
        boundaryQuality: string;
      };
      unresolvedDecisions: Array<{ id: string }>;
    };
  }>(['init', workspaceDir, '--json']);
  const diagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
    remediationMissions: Array<{ id: string }>;
  }>(['scan', workspaceDir, '--json']);

  const metrics = [
    metric(
      'repo-mode',
      init.bootstrap.detected.repoMode === 'monorepo',
      `repo mode: ${init.bootstrap.detected.repoMode}`,
    ),
    metric(
      'docs-and-instructions-canonical',
      init.bootstrap.detected.docsRoots.includes('docs') &&
        init.bootstrap.detected.instructionFiles.includes('AGENTS.md'),
      `docs/instructions: ${init.bootstrap.detected.docsRoots.join(', ') || 'none'} / ${init.bootstrap.detected.instructionFiles.join(', ') || 'none'}`,
    ),
    metric(
      'partial-root-command-surface',
      Boolean(init.bootstrap.detected.commands.dev) &&
        Boolean(init.bootstrap.detected.commands.build) &&
        !init.bootstrap.detected.commands.test &&
        !init.bootstrap.detected.commands.typecheck &&
        !init.bootstrap.detected.commands.lint,
      `commands: ${Object.entries(init.bootstrap.detected.commands)
        .filter(([, value]) => typeof value === 'string')
        .map(([key]) => key)
        .join(', ')}`,
    ),
    metric(
      'repo-health',
      diagnosis.health === 'needs-stabilization',
      `health: ${diagnosis.health}`,
    ),
    metric(
      'workspace-canonical',
      diagnosis.findings.some(
        (finding) => finding.id === 'workspace-structure' && finding.classification === 'canonical',
      ),
      `workspace finding: ${stringifyFinding(diagnosis.findings, 'workspace-structure')}`,
    ),
    metric(
      'command-surface-recommended',
      diagnosis.findings.some(
        (finding) =>
          finding.id === 'command-surface' &&
          finding.classification === 'recommended' &&
          finding.severity === 'medium',
      ),
      `command finding: ${stringifyFinding(diagnosis.findings, 'command-surface')}`,
    ),
    metric(
      'single-command-remediation',
      diagnosis.remediationMissions.length === 1 &&
        diagnosis.remediationMissions[0]?.id === 'remediate.command-surface',
      `missions: ${diagnosis.remediationMissions.map((mission) => mission.id).join(', ')}`,
    ),
    metric(
      'architecture-stays-partial-not-divergent',
      init.architecture.alignmentStatus === 'partial' &&
        init.architecture.current.topology === 'mixed-monorepo' &&
        init.architecture.current.boundaryQuality === 'mixed' &&
        init.architecture.unresolvedDecisions.length === 0,
      `alignment/topology/boundaries/decisions: ${init.architecture.alignmentStatus}/${init.architecture.current.topology}/${init.architecture.current.boundaryQuality}/${init.architecture.unresolvedDecisions.length}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runBrownfieldStabilizationDeltaBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const beforeWorkspaceDir = await createTempWorkspace(`${benchmark.fixture}-before`);
  const afterWorkspaceDir = await createTempWorkspace(`${benchmark.fixture}-after`);

  const beforeInit = runCliJson<{
    bootstrap: {
      detected: {
        repoMode: string;
        packageCount: number;
        docsHealth: {
          hasStartHere: boolean;
        };
        commands: Record<string, string | undefined>;
      };
    };
  }>(['init', beforeWorkspaceDir, '--json']);
  const beforeDiagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
    remediationMissions: Array<{ id: string }>;
  }>(['scan', beforeWorkspaceDir, '--json']);
  const beforeTrust = runCliJson<{
    readiness: string;
    trustLevel: string;
    checks: Array<{ id: string; status: string }>;
  }>(['trust', beforeWorkspaceDir, '--json']);

  const afterInit = runCliJson<{
    bootstrap: {
      detected: {
        repoMode: string;
        packageCount: number;
        docsHealth: {
          hasStartHere: boolean;
        };
        commands: Record<string, string | undefined>;
      };
    };
  }>(['init', afterWorkspaceDir, '--json']);
  const afterDiagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
    remediationMissions: Array<{ id: string }>;
  }>(['scan', afterWorkspaceDir, '--json']);
  runCliJson(['instructions', 'sync', afterWorkspaceDir, '--json']);
  const afterTrust = runCliJson<{
    readiness: string;
    trustLevel: string;
    checks: Array<{ id: string; status: string }>;
  }>(['trust', afterWorkspaceDir, '--json']);

  const beforeActionableFindings = beforeDiagnosis.findings.filter(
    (finding) => finding.classification !== 'canonical',
  ).length;
  const afterActionableFindings = afterDiagnosis.findings.filter(
    (finding) => finding.classification !== 'canonical',
  ).length;

  const metrics = [
    metric(
      'repo-shape-stable-across-comparison',
      beforeInit.bootstrap.detected.repoMode === 'monorepo' &&
        afterInit.bootstrap.detected.repoMode === 'monorepo' &&
        beforeInit.bootstrap.detected.packageCount === 3 &&
        afterInit.bootstrap.detected.packageCount === 3,
      `repo/package counts: ${beforeInit.bootstrap.detected.repoMode}:${beforeInit.bootstrap.detected.packageCount} -> ${afterInit.bootstrap.detected.repoMode}:${afterInit.bootstrap.detected.packageCount}`,
    ),
    metric(
      'before-state-self-heals-router-but-needs-command-stabilization',
      beforeInit.bootstrap.detected.docsHealth.hasStartHere === true &&
        Boolean(beforeInit.bootstrap.detected.commands.dev) &&
        Boolean(beforeInit.bootstrap.detected.commands.build) &&
        !beforeInit.bootstrap.detected.commands.test &&
        !beforeInit.bootstrap.detected.commands.typecheck,
      `before docs/commands: ${beforeInit.bootstrap.detected.docsHealth.hasStartHere}/${Object.entries(beforeInit.bootstrap.detected.commands)
        .filter(([, value]) => typeof value === 'string')
        .map(([key]) => key)
        .join(', ')}`,
    ),
    metric(
      'before-state-needs-stabilization',
      beforeDiagnosis.health === 'needs-stabilization' &&
        beforeTrust.readiness === 'needs-review',
      `before health/trust: ${beforeDiagnosis.health}/${beforeTrust.readiness}`,
    ),
    metric(
      'before-remediation-and-warnings-present',
      beforeDiagnosis.remediationMissions.length >= 1 &&
        beforeTrust.checks.some((check) => check.status === 'warn'),
      `before remediations/checks: ${beforeDiagnosis.remediationMissions.map((mission) => mission.id).join(', ') || 'none'} / ${beforeTrust.checks.map((check) => `${check.id}:${check.status}`).join(', ')}`,
    ),
    metric(
      'after-state-shows-canonical-stabilization',
      afterInit.bootstrap.detected.docsHealth.hasStartHere === true &&
        Boolean(afterInit.bootstrap.detected.commands.dev) &&
        Boolean(afterInit.bootstrap.detected.commands.build) &&
        Boolean(afterInit.bootstrap.detected.commands.test) &&
        Boolean(afterInit.bootstrap.detected.commands.typecheck),
      `after docs/commands: ${afterInit.bootstrap.detected.docsHealth.hasStartHere}/${Object.entries(afterInit.bootstrap.detected.commands)
        .filter(([, value]) => typeof value === 'string')
        .map(([key]) => key)
        .join(', ')}`,
    ),
    metric(
      'after-state-is-agent-ready',
      afterDiagnosis.health === 'healthy' &&
        afterTrust.readiness === 'agent-ready' &&
        afterTrust.trustLevel === 'high',
      `after health/trust: ${afterDiagnosis.health}/${afterTrust.readiness}/${afterTrust.trustLevel}`,
    ),
    metric(
      'after-remediation-cleared',
      afterDiagnosis.remediationMissions.length === 0 &&
        afterTrust.checks.every((check) => check.status === 'pass'),
      `after remediations/checks: ${afterDiagnosis.remediationMissions.map((mission) => mission.id).join(', ') || 'none'} / ${afterTrust.checks.map((check) => `${check.id}:${check.status}`).join(', ')}`,
    ),
    metric(
      'stabilization-delta-is-positive',
      beforeActionableFindings > afterActionableFindings &&
        beforeTrust.readiness !== afterTrust.readiness,
      `actionable findings/readiness: ${beforeActionableFindings}/${afterActionableFindings} and ${beforeTrust.readiness}/${afterTrust.readiness}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runPartialLibraryStructureBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      detected: {
        repoMode: string;
        docsRoots: string[];
        instructionFiles: string[];
        commands: Record<string, string | undefined>;
      };
    };
    architecture: {
      alignmentStatus: string;
      current: {
        topology: string;
        boundaryQuality: string;
      };
      recommended: {
        topology: string;
        boundaryQuality: string;
      };
      unresolvedDecisions: Array<{ id: string }>;
    };
  }>(['init', workspaceDir, '--json']);
  const diagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
    remediationMissions: Array<{ id: string }>;
  }>(['scan', workspaceDir, '--json']);

  const metrics = [
    metric(
      'repo-mode',
      init.bootstrap.detected.repoMode === 'multi-package',
      `repo mode: ${init.bootstrap.detected.repoMode}`,
    ),
    metric(
      'docs-and-instructions-canonical',
      init.bootstrap.detected.docsRoots.includes('docs') &&
        init.bootstrap.detected.instructionFiles.includes('AGENTS.md'),
      `docs/instructions: ${init.bootstrap.detected.docsRoots.join(', ') || 'none'} / ${init.bootstrap.detected.instructionFiles.join(', ') || 'none'}`,
    ),
    metric(
      'root-command-surface-canonical',
      Boolean(init.bootstrap.detected.commands.dev) &&
        Boolean(init.bootstrap.detected.commands.build) &&
        Boolean(init.bootstrap.detected.commands.test) &&
        Boolean(init.bootstrap.detected.commands.typecheck),
      `commands: ${Object.entries(init.bootstrap.detected.commands)
        .filter(([, value]) => typeof value === 'string')
        .map(([key]) => key)
        .join(', ')}`,
    ),
    metric(
      'repo-health',
      diagnosis.health === 'needs-stabilization',
      `health: ${diagnosis.health}`,
    ),
    metric(
      'workspace-structure-recommended',
      diagnosis.findings.some(
        (finding) =>
          finding.id === 'workspace-structure' &&
          finding.classification === 'recommended' &&
          finding.severity === 'medium',
      ),
      `workspace finding: ${stringifyFinding(diagnosis.findings, 'workspace-structure')}`,
    ),
    metric(
      'command-surface-stays-canonical',
      diagnosis.findings.some(
        (finding) => finding.id === 'command-surface' && finding.classification === 'canonical',
      ),
      `command finding: ${stringifyFinding(diagnosis.findings, 'command-surface')}`,
    ),
    metric(
      'single-workspace-remediation',
      diagnosis.remediationMissions.length === 1 &&
        diagnosis.remediationMissions[0]?.id === 'remediate.workspace-structure',
      `missions: ${diagnosis.remediationMissions.map((mission) => mission.id).join(', ')}`,
    ),
    metric(
      'architecture-stays-partial-library',
      init.architecture.alignmentStatus === 'partial' &&
        init.architecture.current.topology === 'library-monorepo' &&
        init.architecture.recommended.topology === 'library-monorepo' &&
        init.architecture.current.boundaryQuality === 'mixed' &&
        init.architecture.recommended.boundaryQuality === 'mixed' &&
        init.architecture.unresolvedDecisions.length === 1 &&
        init.architecture.unresolvedDecisions[0]?.id === 'decision:workspace-structure',
      `alignment/current/recommended/boundaries/decisions: ${init.architecture.alignmentStatus}/${init.architecture.current.topology}/${init.architecture.recommended.topology}/${init.architecture.current.boundaryQuality}/${init.architecture.recommended.boundaryQuality}/${init.architecture.unresolvedDecisions.map((decision) => decision.id).join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runStaleDocsTrustBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      detected: {
        docsHealth: {
          hasStartHere: boolean;
          freshnessTrackedCount: number;
          staleDocPaths: string[];
        };
      };
    };
  }>(['init', workspaceDir, '--json']);
  const diagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
    remediationMissions: Array<{ id: string }>;
  }>(['scan', workspaceDir, '--json']);
  const trust = runCliJson<{
    readiness: string;
    trustLevel: string;
    checks: Array<{ id: string; status: string }>;
  }>(['trust', workspaceDir, '--json']);

  const metrics = [
    metric(
      'stale-docs-detected',
      init.bootstrap.detected.docsHealth.staleDocPaths.length === 2 &&
        init.bootstrap.detected.docsHealth.freshnessTrackedCount === 2,
      `tracked/stale docs: ${init.bootstrap.detected.docsHealth.freshnessTrackedCount}/${init.bootstrap.detected.docsHealth.staleDocPaths.join(', ')}`,
    ),
    metric(
      'docs-router-generated',
      init.bootstrap.detected.docsHealth.hasStartHere === true,
      `has start-here: ${init.bootstrap.detected.docsHealth.hasStartHere}`,
    ),
    metric(
      'repo-health',
      diagnosis.health === 'needs-stabilization',
      `health: ${diagnosis.health}`,
    ),
    metric(
      'docs-root-canonical',
      diagnosis.findings.some(
        (finding) =>
          finding.id === 'docs-root' &&
          finding.classification === 'canonical' &&
          finding.severity === 'low',
      ),
      `docs-root finding: ${stringifyFinding(diagnosis.findings, 'docs-root')}`,
    ),
    metric(
      'docs-freshness-recommended',
      diagnosis.findings.some(
        (finding) =>
          finding.id === 'docs-freshness' &&
          finding.classification === 'recommended' &&
          finding.severity === 'medium',
      ),
      `docs-freshness finding: ${stringifyFinding(diagnosis.findings, 'docs-freshness')}`,
    ),
    metric(
      'docs-remediation-created',
      diagnosis.remediationMissions.some((mission) => mission.id === 'remediate.docs-freshness'),
      `missions: ${diagnosis.remediationMissions.map((mission) => mission.id).join(', ')}`,
    ),
    metric(
      'trust-needs-review',
      trust.readiness === 'needs-review',
      `readiness: ${trust.readiness}`,
    ),
    metric(
      'trust-checks-warn',
      trust.checks.some((check) => check.id === 'docs-freshness' && check.status === 'warn') &&
        trust.checks.some((check) => check.id === 'scan-findings' && check.status === 'warn'),
      `checks: ${trust.checks.map((check) => `${check.id}:${check.status}`).join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runOverrideCanonicalizationBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const before = runCliJson<{
    bootstrap: {
      detected: {
        archetypeSuggestion: string;
        docsHealth: {
          root?: string;
          hasStartHere: boolean;
        };
      };
      recommendedConfig: {
        docs: {
          root: string;
        };
      };
    };
  }>(['init', workspaceDir, '--dry-run', '--json']);
  const docsOverride = runCliJson<{
    updatedEntry: { key: string; value: string; updatedBy?: string };
  }>([
    'overrides',
    'set',
    'docs.root',
    'knowledge',
    workspaceDir,
    '--reason',
    'knowledge is canonical',
    '--actor',
    'agent-alpha',
    '--json',
  ]);
  const archetypeOverride = runCliJson<{
    updatedEntry: { key: string; value: string; updatedBy?: string };
  }>([
    'overrides',
    'set',
    'project.archetype',
    'api',
    workspaceDir,
    '--reason',
    'service is api-shaped',
    '--actor',
    'agent-alpha',
    '--json',
  ]);
  const blockedOverride = runCliFailure([
    'overrides',
    'set',
    'docs.root',
    'knowledge',
    workspaceDir,
    '--reason',
    'other actor should not silently take over',
    '--actor',
    'agent-beta',
    '--json',
  ]);
  const forcedDocsOverride = runCliJson<{
    updatedEntry: { key: string; value: string; updatedBy?: string };
  }>([
    'overrides',
    'set',
    'docs.root',
    'knowledge',
    workspaceDir,
    '--reason',
    'forced actor transfer',
    '--actor',
    'agent-beta',
    '--force',
    '--json',
  ]);
  const overrides = runCliJson<{
    entries: Array<{ key: string; value: string; updatedBy?: string }>;
  }>(['overrides', 'show', workspaceDir, '--json']);
  const after = runCliJson<{
    bootstrap: {
      detected: {
        archetypeSuggestion: string;
        docsHealth: {
          root?: string;
          hasStartHere: boolean;
        };
        appliedOverrides: Array<{ key: string; value: string }>;
      };
      recommendedConfig: {
        docs: {
          root: string;
        };
      };
    };
  }>(['init', workspaceDir, '--dry-run', '--json']);
  const diagnosis = runCliJson<{
    health: string;
    findings: Array<{ id: string; classification: string; severity: string }>;
  }>(['scan', workspaceDir, '--json']);

  const metrics = [
    metric(
      'default-inference-needs-correction',
      before.bootstrap.detected.archetypeSuggestion === 'saas' &&
        before.bootstrap.recommendedConfig.docs.root === 'docs' &&
        before.bootstrap.detected.docsHealth.root === 'docs' &&
        before.bootstrap.detected.docsHealth.hasStartHere === false,
      `before archetype/docs: ${before.bootstrap.detected.archetypeSuggestion}/${before.bootstrap.recommendedConfig.docs.root}/${before.bootstrap.detected.docsHealth.root}/${before.bootstrap.detected.docsHealth.hasStartHere}`,
    ),
    metric(
      'docs-override-written',
      docsOverride.updatedEntry.key === 'docs.root' &&
        docsOverride.updatedEntry.value === 'knowledge' &&
        docsOverride.updatedEntry.updatedBy === 'agent-alpha',
      `docs override: ${docsOverride.updatedEntry.key}=${docsOverride.updatedEntry.value} [${docsOverride.updatedEntry.updatedBy ?? 'none'}]`,
    ),
    metric(
      'archetype-override-written',
      archetypeOverride.updatedEntry.key === 'project.archetype' &&
        archetypeOverride.updatedEntry.value === 'api' &&
        archetypeOverride.updatedEntry.updatedBy === 'agent-alpha',
      `archetype override: ${archetypeOverride.updatedEntry.key}=${archetypeOverride.updatedEntry.value} [${archetypeOverride.updatedEntry.updatedBy ?? 'none'}]`,
    ),
    metric(
      'override-takeover-blocked',
      blockedOverride.message.includes('last updated by agent-alpha'),
      `blocked message: ${blockedOverride.message}`,
    ),
    metric(
      'override-force-transfer',
      forcedDocsOverride.updatedEntry.updatedBy === 'agent-beta',
      `forced docs override actor: ${forcedDocsOverride.updatedEntry.updatedBy ?? 'none'}`,
    ),
    metric(
      'overrides-visible',
      overrides.entries.length === 2 &&
        overrides.entries.some(
          (entry) =>
            entry.key === 'docs.root' &&
            entry.value === 'knowledge' &&
            entry.updatedBy === 'agent-beta',
        ) &&
        overrides.entries.some(
          (entry) =>
            entry.key === 'project.archetype' &&
            entry.value === 'api' &&
            entry.updatedBy === 'agent-alpha',
        ),
      `overrides: ${overrides.entries.map((entry) => `${entry.key}=${entry.value}[${entry.updatedBy ?? 'none'}]`).join(', ')}`,
    ),
    metric(
      'overrides-applied-to-bootstrap',
      after.bootstrap.detected.archetypeSuggestion === 'api' &&
        after.bootstrap.recommendedConfig.docs.root === 'knowledge' &&
        after.bootstrap.detected.docsHealth.root === 'knowledge' &&
        after.bootstrap.detected.docsHealth.hasStartHere === true,
      `after archetype/docs: ${after.bootstrap.detected.archetypeSuggestion}/${after.bootstrap.recommendedConfig.docs.root}/${after.bootstrap.detected.docsHealth.root}/${after.bootstrap.detected.docsHealth.hasStartHere}`,
    ),
    metric(
      'override-provenance-exposed',
      after.bootstrap.detected.appliedOverrides.length === 2,
      `applied overrides: ${after.bootstrap.detected.appliedOverrides.map((entry) => `${entry.key}=${entry.value}`).join(', ')}`,
    ),
    metric(
      'diagnosis-stabilized',
      diagnosis.health === 'healthy' &&
        diagnosis.findings.some(
          (finding) => finding.id === 'docs-root' && finding.classification === 'canonical',
        ),
      `health/docs-root: ${diagnosis.health}/${stringifyFinding(diagnosis.findings, 'docs-root')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runKnowledgeIndexLogBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    actorId?: string;
    indexWrite: string;
    logWrite: string;
    indexPath: string;
    logPath: string;
  }>(['init', workspaceDir, '--actor', 'agent-bootstrap', '--json']);

  runCliJson(['instructions', 'sync', workspaceDir, '--actor', 'agent-proof', '--json']);
  runCliJson([
    'plan',
    benchmark.goal,
    workspaceDir,
    '--scope',
    benchmark.scope,
    '--actor',
    'agent-planner',
    '--json',
  ]);
  runCliJson([
    'workflows',
    'run',
    'reference.refresh-api-note',
    workspaceDir,
    '--actor',
    'agent-proof',
    '--json',
  ]);
  runCliJson(['scan', workspaceDir, '--actor', 'agent-diagnosis', '--json']);
  runCliJson(['trust', workspaceDir, '--actor', 'agent-review', '--json']);
  runCliJson([
    'impact',
    'packages/api/package.json',
    '--cwd',
    workspaceDir,
    '--actor',
    'agent-impact',
    '--json',
  ]);
  runCliJson(['done', 'packages/api/package.json', '--cwd', workspaceDir, '--json']);

  const index = JSON.parse(await readFile(init.indexPath, 'utf8')) as {
    trustLevel: string;
    readiness: string;
    counts: {
      planCount: number;
      missionCount: number;
      workflowRunCount: number;
      graphCount: number;
    };
    latestEvent?: { eventKind: string; status: string };
    entries: Array<{ kind: string; path: string }>;
  };
  const logEntries = (await readFile(init.logPath, 'utf8'))
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(
      (line) =>
        JSON.parse(line) as {
          eventKind: string;
          status: string;
          metadata?: {
            actorId?: string | null;
          };
        },
    );
  const eventKinds = logEntries.map((entry) => entry.eventKind);

  const metrics = [
    metric(
      'init-writes-index-log',
      init.indexWrite === 'written' &&
        init.logWrite === 'written' &&
        init.actorId === 'agent-bootstrap',
      `index/log writes/actor: ${init.indexWrite}/${init.logWrite}/${init.actorId ?? 'none'}`,
    ),
    metric(
      'index-trust-state',
      index.trustLevel === 'high' && index.readiness === 'agent-ready',
      `trust/readiness: ${index.trustLevel}/${index.readiness}`,
    ),
    metric(
      'index-counts-activity',
      index.counts.planCount === 1 &&
        index.counts.missionCount === 1 &&
        index.counts.workflowRunCount === 1 &&
        index.counts.graphCount >= 5,
      `counts: ${index.counts.planCount}/${index.counts.missionCount}/${index.counts.workflowRunCount}/${index.counts.graphCount}`,
    ),
    metric(
      'index-latest-event',
      index.latestEvent?.eventKind === 'done' && index.latestEvent.status === 'succeeded',
      `latest event: ${index.latestEvent?.eventKind ?? 'none'}/${index.latestEvent?.status ?? 'none'}`,
    ),
    metric(
      'index-references-recent-artifacts',
      index.entries.some((entry) => entry.kind === 'plan-artifact') &&
        index.entries.some((entry) => entry.kind === 'mission-artifact') &&
        index.entries.some((entry) => entry.kind === 'workflow-run-artifact'),
      `entry kinds: ${index.entries.map((entry) => entry.kind).join(', ')}`,
    ),
    metric(
      'log-captures-runtime-events',
      ['init', 'instructions-sync', 'plan', 'workflow-run', 'scan', 'trust', 'impact', 'done'].every((eventKind) =>
        eventKinds.includes(eventKind),
      ),
      `event kinds: ${eventKinds.join(', ')}`,
    ),
    metric(
      'instructions-sync-actor-attributed',
      logEntries.some(
        (entry) => entry.eventKind === 'instructions-sync' && entry.metadata?.actorId === 'agent-proof',
      ),
      `instruction-sync actors: ${logEntries
        .filter((entry) => entry.eventKind === 'instructions-sync')
        .map((entry) => entry.metadata?.actorId ?? 'none')
        .join(', ')}`,
    ),
    metric(
      'scan-actor-attributed',
      logEntries.some(
        (entry) => entry.eventKind === 'scan' && entry.metadata?.actorId === 'agent-diagnosis',
      ),
      `scan actors: ${logEntries
        .filter((entry) => entry.eventKind === 'scan')
        .map((entry) => entry.metadata?.actorId ?? 'none')
        .join(', ')}`,
    ),
    metric(
      'trust-impact-actor-attributed',
      logEntries.some(
        (entry) => entry.eventKind === 'trust' && entry.metadata?.actorId === 'agent-review',
      ) &&
        logEntries.some(
          (entry) => entry.eventKind === 'impact' && entry.metadata?.actorId === 'agent-impact',
        ),
      `trust/impact actors: ${logEntries
        .filter((entry) => entry.eventKind === 'trust' || entry.eventKind === 'impact')
        .map((entry) => `${entry.eventKind}:${entry.metadata?.actorId ?? 'none'}`)
        .join(', ')}`,
    ),
    metric(
      'log-tail-is-done',
      logEntries.at(-1)?.eventKind === 'done' && logEntries.at(-1)?.status === 'succeeded',
      `last entry: ${logEntries.at(-1)?.eventKind ?? 'none'}/${logEntries.at(-1)?.status ?? 'none'}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runHotPathPerformanceBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  runCliJson(['init', workspaceDir, '--json']);
  runCliJson(['instructions', 'sync', workspaceDir, '--json']);
  initializeGitWorkspace(workspaceDir);
  commitWorkspace(workspaceDir, 'baseline');
  await writeFile(
    join(workspaceDir, 'packages/api/package.json'),
    `${await readFile(join(workspaceDir, 'packages/api/package.json'), 'utf8')}\n`,
    'utf8',
  );

  const bootstrapPath = join(workspaceDir, '.skopos', 'bootstrap.json');
  const scopesLitePath = join(workspaceDir, '.skopos', 'scopes-lite.json');
  const bootstrapBefore = await stat(bootstrapPath);
  const scopesBefore = await stat(scopesLitePath);

  const resolveRun = runCliJsonTimed<{ scope: { id: string } }>([
    'resolve',
    benchmark.scope,
    workspaceDir,
    '--json',
  ]);
  const contextRun = runCliJsonTimed<{ scope: { scope: { id: string } } }>([
    'context',
    benchmark.scope,
    workspaceDir,
    '--json',
  ]);
  const planRun = runCliJsonTimed<{ scope: { scope: { id: string } } }>([
    'plan',
    benchmark.goal,
    workspaceDir,
    '--scope',
    benchmark.scope,
    '--json',
  ]);
  const trustRun = runCliJsonTimed<{ trustLevel: string; readiness: string }>([
    'trust',
    workspaceDir,
    '--json',
  ]);
  const impactRun = runCliJsonTimed<{ affectedScopes: Array<{ id: string }> }>([
    'impact',
    '--cwd',
    workspaceDir,
    '--json',
  ]);

  const bootstrapAfter = await stat(bootstrapPath);
  const scopesAfter = await stat(scopesLitePath);
  const totalDurationMs =
    resolveRun.durationMs +
    contextRun.durationMs +
    planRun.durationMs +
    trustRun.durationMs +
    impactRun.durationMs;

  const metrics = [
    metric(
      'compiled-state-stable',
      bootstrapAfter.mtimeMs === bootstrapBefore.mtimeMs &&
        scopesAfter.mtimeMs === scopesBefore.mtimeMs,
      `bootstrap/scopes mtimes: ${bootstrapBefore.mtimeMs}->${bootstrapAfter.mtimeMs} / ${scopesBefore.mtimeMs}->${scopesAfter.mtimeMs}`,
    ),
    metric(
      'resolve-budget',
      resolveRun.durationMs <= 1500 && resolveRun.result.scope.id === benchmark.scope,
      `resolve duration/scope: ${resolveRun.durationMs}ms/${resolveRun.result.scope.id}`,
    ),
    metric(
      'context-budget',
      contextRun.durationMs <= 1800 && contextRun.result.scope.scope.id === benchmark.scope,
      `context duration/scope: ${contextRun.durationMs}ms/${contextRun.result.scope.scope.id}`,
    ),
    metric(
      'plan-budget',
      planRun.durationMs <= 2200 && planRun.result.scope.scope.id === benchmark.scope,
      `plan duration/scope: ${planRun.durationMs}ms/${planRun.result.scope.scope.id}`,
    ),
    metric(
      'trust-budget',
      trustRun.durationMs <= 2000 && ['high', 'medium'].includes(trustRun.result.trustLevel),
      `trust duration/level: ${trustRun.durationMs}ms/${trustRun.result.trustLevel}`,
    ),
    metric(
      'impact-budget',
      impactRun.durationMs <= 2200 &&
        impactRun.result.affectedScopes.some((scope) => scope.id === benchmark.scope),
      `impact duration/scopes: ${impactRun.durationMs}ms/${impactRun.result.affectedScopes.map((scope) => scope.id).join(', ')}`,
    ),
    metric(
      'hot-path-batch-budget',
      totalDurationMs <= 8000,
      `total hot-path duration: ${totalDurationMs}ms`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runCompiledStateInvalidationBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  runCliJson(['init', workspaceDir, '--json']);

  const missingBefore = runCliFailure(['resolve', benchmark.scope, workspaceDir, '--json']);

  const packageDir = join(workspaceDir, 'packages/ops');
  await mkdir(join(packageDir, 'src'), { recursive: true });
  await writeFile(
    join(packageDir, 'package.json'),
    JSON.stringify(
      {
        name: benchmark.scope,
        version: '0.0.0',
        private: true,
        description: 'Late-added package for compiled-state invalidation proof.',
      },
      null,
      2,
    ),
    'utf8',
  );
  await writeFile(join(packageDir, 'src/index.ts'), 'export const ops = true;\n', 'utf8');

  const resolved = runCliJson<{
    matchedBy: string;
    scope: { id: string; path: string };
  }>(['resolve', benchmark.scope, workspaceDir, '--json']);
  const context = runCliJson<{
    scope: { scope: { id: string } };
    references: Array<{ kind: string; path: string }>;
  }>(['context', benchmark.scope, workspaceDir, '--json']);

  const metrics = [
    metric(
      'missing-before-change',
      missingBefore.message.includes('Unable to resolve scope'),
      `missing message: ${missingBefore.message}`,
    ),
    metric(
      'resolve-after-package-addition',
      resolved.matchedBy === 'id' &&
        resolved.scope.id === benchmark.scope &&
        resolved.scope.path === 'packages/ops',
      `resolved: ${resolved.matchedBy}/${resolved.scope.id}/${resolved.scope.path}`,
    ),
    metric(
      'context-after-package-addition',
      context.scope.scope.id === benchmark.scope &&
        context.references.some(
          (reference) =>
            reference.kind === 'package-manifest' &&
            reference.path.endsWith('/packages/ops/package.json'),
        ),
      `context scope/refs: ${context.scope.scope.id}/${context.references.map((reference) => reference.kind).join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runWorkflowSensitiveBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  initializeGitWorkspace(workspaceDir);
  runCliJson(['init', workspaceDir, '--json']);
  runCliJson(['instructions', 'sync', workspaceDir, '--json']);
  commitWorkspace(workspaceDir, 'baseline');

  await writeFile(
    join(workspaceDir, 'packages/api/package.json'),
    `${await readFile(join(workspaceDir, 'packages/api/package.json'), 'utf8')}\n`,
    'utf8',
  );

  const planned = runCliJson<{
    missionId: string;
  }>([
    'plan',
    'refresh the generated API reference note after package changes',
    workspaceDir,
    '--scope',
    '@fixture/api',
    '--actor',
    'agent-proof',
    '--json',
  ]);
  runCliJson([
    'mission',
    'claim',
    planned.missionId,
    workspaceDir,
    '--actor',
    'agent-proof',
    '--json',
  ]);

  const impact = runCliJson<{
    requiredWorkflows: Array<{ id: string }>;
  }>(['impact', '--cwd', workspaceDir, '--json']);
  const doneBefore = runCliJson<{
    closureStatus: string;
    workflowEvidence: Array<{ id: string; status: string }>;
  }>(['done', '--cwd', workspaceDir, '--json']);

  runCliJson([
    'workflows',
    'run',
    'reference.refresh-api-note',
    workspaceDir,
    '--actor',
    'agent-proof',
    '--json',
  ]);

  const doneAfter = runCliJson<{
    closureStatus: string;
    workflowEvidence: Array<{ id: string; status: string; latestSuccessfulRunByActorId?: string }>;
  }>(['done', '--cwd', workspaceDir, '--json']);

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'required-workflow-detected',
      impact.requiredWorkflows.some((workflow) => workflow.id === 'reference.refresh-api-note'),
      `required workflows: ${impact.requiredWorkflows.map((workflow) => workflow.id).join(', ')}`,
    ),
    metric(
      'closure-blocked-before-workflow',
      doneBefore.closureStatus === 'blocked',
      `status: ${doneBefore.closureStatus}`,
    ),
    metric(
      'closure-needs-review-after-workflow',
      doneAfter.closureStatus === 'needs-review',
      `status: ${doneAfter.closureStatus}`,
    ),
    metric(
      'workflow-evidence-passed',
      doneAfter.workflowEvidence.some(
        (workflow) => workflow.id === 'reference.refresh-api-note' && workflow.status === 'pass',
      ),
      `workflow evidence: ${doneAfter.workflowEvidence.map((workflow) => `${workflow.id}:${workflow.status}`).join(', ')}`,
    ),
    metric(
      'workflow-evidence-actor-attributed',
      doneAfter.workflowEvidence.some(
        (workflow) =>
          workflow.id === 'reference.refresh-api-note' &&
          workflow.latestSuccessfulRunByActorId === 'agent-proof',
      ),
      `workflow actors: ${doneAfter.workflowEvidence.map((workflow) => `${workflow.id}:${workflow.latestSuccessfulRunByActorId ?? 'none'}`).join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runApprovalSensitiveWorkflowBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const shown = runCliJson<{
    id: string;
    safety: string;
    requiresApproval: boolean;
  }>(['workflows', 'show', 'maintenance.destructive-cleanup', workspaceDir, '--json']);
  const blocked = runCliFailure([
    'workflows',
    'run',
    'maintenance.destructive-cleanup',
    workspaceDir,
    '--json',
  ]);
  const approvedWithoutActor = runCliFailure([
    'workflows',
    'run',
    'maintenance.destructive-cleanup',
    workspaceDir,
    '--approve',
    '--json',
  ]);
  const approvedRun = runCliJson<{
    workflowId: string;
    workflowSafety: string;
    runStatus: string;
    outputPaths: string[];
    runByActorId?: string;
  }>([
    'workflows',
    'run',
    'maintenance.destructive-cleanup',
    workspaceDir,
    '--approve',
    '--actor',
    'agent-ops',
    '--json',
  ]);
  const outputLog = await readFile(
    join(workspaceDir, '.tmp/skopos/destructive-cleanup.log'),
    'utf8',
  );

  const metrics = [
    metric(
      'workflow-metadata',
      shown.id === 'maintenance.destructive-cleanup',
      `workflow id: ${shown.id}`,
    ),
    metric(
      'approval-required',
      shown.safety === 'destructive' && shown.requiresApproval === true,
      `safety/approval: ${shown.safety}/${shown.requiresApproval}`,
    ),
    metric(
      'blocked-without-approval',
      blocked.message.includes('requires explicit approval'),
      `blocked message: ${blocked.message}`,
    ),
    metric(
      'blocked-without-actor',
      approvedWithoutActor.message.includes('mutates workspace state'),
      `blocked actor message: ${approvedWithoutActor.message}`,
    ),
    metric(
      'approved-run-succeeds',
      approvedRun.workflowId === 'maintenance.destructive-cleanup' &&
        approvedRun.workflowSafety === 'destructive' &&
        approvedRun.runStatus === 'succeeded',
      `workflow/status: ${approvedRun.workflowId}/${approvedRun.runStatus}`,
    ),
    metric(
      'approved-run-attributed',
      approvedRun.runByActorId === 'agent-ops',
      `workflow actor: ${approvedRun.runByActorId ?? 'none'}`,
    ),
    metric(
      'approved-run-produces-output',
      approvedRun.outputPaths.includes('.tmp/skopos/destructive-cleanup.log') &&
        outputLog.includes('destructive cleanup approved'),
      `outputs: ${approvedRun.outputPaths.join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runArchitectureInterpretationBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    architecture: {
      alignmentStatus: string;
      current: {
        topology: string;
        boundaryQuality: string;
      };
      recommended: {
        topology: string;
      };
      unresolvedDecisions: Array<{ id: string }>;
    };
  }>(['init', workspaceDir, '--json']);

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'architecture-diverges',
      init.architecture.alignmentStatus === 'divergent',
      `alignment: ${init.architecture.alignmentStatus}`,
    ),
    metric(
      'current-messy-topology',
      init.architecture.current.topology === 'mixed-monorepo',
      `current topology: ${init.architecture.current.topology}`,
    ),
    metric(
      'recommended-platform-topology',
      init.architecture.recommended.topology === 'platform-monorepo',
      `recommended topology: ${init.architecture.recommended.topology}`,
    ),
    metric(
      'current-boundaries-weak',
      init.architecture.current.boundaryQuality === 'weak',
      `boundary quality: ${init.architecture.current.boundaryQuality}`,
    ),
    metric(
      'unresolved-decisions-present',
      init.architecture.unresolvedDecisions.length >= 2,
      `decisions: ${init.architecture.unresolvedDecisions.map((decision) => decision.id).join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runLargeRepoSubtreeBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      focusSubtree?: string;
      detected: {
        focusSubtree?: string;
        repoMode: string;
        packageCount: number;
        workspacePackageCount: number;
      };
    };
    scopesLite: {
      focusSubtree?: string;
      scopes: Array<{ kind: string; path: string }>;
    };
    architecture: {
      alignmentStatus: string;
      current: {
        topology: string;
        units: Array<{ path: string }>;
      };
    };
  }>(['init', workspaceDir, '--subtree', 'domains/billing', '--json']);
  const scopeRelationsGraph = JSON.parse(
    await readFile(join(workspaceDir, '.skopos', 'graph', 'scope-relations.json'), 'utf8'),
  ) as {
    nodes: Array<{ path?: string }>;
  };

  const packagePaths = init.scopesLite.scopes
    .filter((scope) => scope.kind === 'package')
    .map((scope) => scope.path);
  const architectureUnitPaths = init.architecture.current.units.map((unit) => unit.path);
  const graphPaths = scopeRelationsGraph.nodes
    .map((node) => node.path)
    .filter((path): path is string => Boolean(path));

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'subtree-registered',
      init.bootstrap.detected.focusSubtree === 'domains/billing' &&
        init.scopesLite.focusSubtree === 'domains/billing',
      `focus subtree: ${init.bootstrap.detected.focusSubtree ?? 'none'}`,
    ),
    metric(
      'workspace-slice-count',
      init.bootstrap.detected.packageCount === 2 &&
        init.bootstrap.detected.workspacePackageCount === 6,
      `slice/workspace packages: ${init.bootstrap.detected.packageCount}/${init.bootstrap.detected.workspacePackageCount}`,
    ),
    metric(
      'package-scope-slice',
      packagePaths.length === 2 &&
        packagePaths.every((path) => path.startsWith('domains/billing/')),
      `package scopes: ${packagePaths.join(', ')}`,
    ),
    metric(
      'graph-slice',
      graphPaths.every((path) => path === '.' || path.startsWith('domains/billing/')),
      `graph paths: ${graphPaths.join(', ')}`,
    ),
    metric(
      'architecture-slice-aligned',
      init.architecture.alignmentStatus === 'aligned' &&
        init.architecture.current.topology === 'platform-monorepo' &&
        architectureUnitPaths.every((path) => path === '.' || path.startsWith('domains/billing/')),
      `alignment/topology/units: ${init.architecture.alignmentStatus}/${init.architecture.current.topology}/${architectureUnitPaths.join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runWorkspaceBoundaryBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      detected: {
        ignoredPaths: string[];
        packageCount: number;
        workspacePackageCount: number;
      };
    };
    scopesLite: {
      scopes: Array<{ kind: string; path: string }>;
    };
    architecture: {
      current: {
        units: Array<{ path: string }>;
      };
    };
  }>(['init', workspaceDir, '--json']);
  const workspaceGraph = JSON.parse(
    await readFile(join(workspaceDir, '.skopos', 'graph', 'workspace.json'), 'utf8'),
  ) as {
    nodes: Array<{ id: string }>;
  };
  const scopeRelationsGraph = JSON.parse(
    await readFile(join(workspaceDir, '.skopos', 'graph', 'scope-relations.json'), 'utf8'),
  ) as {
    nodes: Array<{ path?: string }>;
  };

  const packagePaths = init.scopesLite.scopes
    .filter((scope) => scope.kind === 'package')
    .map((scope) => scope.path)
    .sort();
  const architectureUnitPaths = init.architecture.current.units.map((unit) => unit.path).sort();
  const relationPaths = scopeRelationsGraph.nodes
    .map((node) => node.path)
    .filter((path): path is string => Boolean(path))
    .sort();
  const workspaceGraphNodeIds = workspaceGraph.nodes.map((node) => node.id);

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'ignore-policy-loaded',
      init.bootstrap.detected.ignoredPaths.join(',') ===
        ['docs/generated', 'fixtures', 'internal', 'tests'].join(','),
      `ignored paths: ${init.bootstrap.detected.ignoredPaths.join(', ')}`,
    ),
    metric(
      'active-package-count',
      init.bootstrap.detected.packageCount === 2 &&
        init.bootstrap.detected.workspacePackageCount === 2,
      `package counts: ${init.bootstrap.detected.packageCount}/${init.bootstrap.detected.workspacePackageCount}`,
    ),
    metric(
      'package-scopes-clean',
      packagePaths.join(',') === ['packages/sdk-cli', 'packages/sdk-core'].join(','),
      `package scopes: ${packagePaths.join(', ')}`,
    ),
    metric(
      'architecture-units-clean',
      architectureUnitPaths.join(',') === ['.', 'packages/sdk-cli', 'packages/sdk-core'].join(','),
      `architecture units: ${architectureUnitPaths.join(', ')}`,
    ),
    metric(
      'graphs-exclude-internal-roots',
      !workspaceGraphNodeIds.includes('scope:@boundary/example-fixture') &&
        !workspaceGraphNodeIds.includes('scope:@boundary/internal-prototype') &&
        !workspaceGraphNodeIds.includes('scope:@boundary/test-harness') &&
        relationPaths.join(',') === ['.', 'packages/sdk-cli', 'packages/sdk-core'].join(','),
      `workspace graph nodes: ${workspaceGraphNodeIds.join(', ')} | relation paths: ${relationPaths.join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runSelfHostedDogfoodingBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    bootstrap: {
      detected: {
        ignoredPaths: string[];
        packageCount: number;
        workspacePackageCount: number;
      };
    };
    scopesLite: {
      scopes: Array<{ kind: string; path: string }>;
    };
  }>(['init', workspaceDir, '--json']);
  const listed = runCliJson<
    Array<{
      id: string;
      sourcePath: string;
    }>
  >(['workflows', 'list', workspaceDir, '--json']);
  const plan = runCliJson<{
    missionId: string;
    scope: { scope: { id: string } };
    recommendedWorkflows: Array<{ id: string }>;
  }>(['plan', benchmark.goal, workspaceDir, '--scope', benchmark.scope, '--json']);
  runCliJson([
    'mission',
    'claim',
    plan.missionId,
    workspaceDir,
    '--actor',
    'agent-selfhost',
    '--json',
  ]);
  runCliJson(['instructions', 'sync', workspaceDir, '--actor', 'agent-selfhost', '--json']);
  const trust = runCliJson<{
    trustLevel: string;
    readiness: string;
    findings: Array<{ id: string }>;
  }>(['trust', workspaceDir, '--actor', 'agent-selfhost', '--json']);
  const portal = runCliJson<{
    writeStatus: string;
    outputPath: string;
    html: string;
  }>(['ui', 'render', workspaceDir, '--json']);
  const renderedPortal = await readFile(portal.outputPath, 'utf8');

  const packagePaths = init.scopesLite.scopes
    .filter((scope) => scope.kind === 'package')
    .map((scope) => scope.path)
    .sort();
  const workflowIds = listed.map((workflow) => workflow.id).sort();
  const recommendedWorkflowIds = plan.recommendedWorkflows
    .map((workflow) => workflow.id)
    .sort();

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'self-hosted-ignore-policy',
      init.bootstrap.detected.ignoredPaths.join(',') ===
        ['docs/generated', 'fixtures', 'internal', 'tests'].join(','),
      `ignored paths: ${init.bootstrap.detected.ignoredPaths.join(', ')}`,
    ),
    metric(
      'self-hosted-package-model',
      init.bootstrap.detected.packageCount === 3 &&
        init.bootstrap.detected.workspacePackageCount === 3 &&
        packagePaths.join(',') === ['packages/cli', 'packages/core', 'packages/ui'].join(','),
      `package counts/paths: ${init.bootstrap.detected.packageCount}/${init.bootstrap.detected.workspacePackageCount}/${packagePaths.join(', ')}`,
    ),
    metric(
      'self-hosted-workflows-discovered',
      workflowIds.join(',') ===
        [
          'graph.render-local-portal',
          'instructions.sync-mirrors',
          'maintenance.refresh-knowledge',
          'quality.run-proof-phase',
        ].join(','),
      `workflows: ${workflowIds.join(', ')}`,
    ),
    metric(
      'self-hosted-scope-resolution',
      plan.scope.scope.id === '@selfhost/cli',
      `scope: ${plan.scope.scope.id}`,
    ),
    metric(
      'self-hosted-workflows-recommended',
      recommendedWorkflowIds.join(',') ===
        [
          'graph.render-local-portal',
          'instructions.sync-mirrors',
          'maintenance.refresh-knowledge',
          'quality.run-proof-phase',
        ].join(','),
      `recommended workflows: ${recommendedWorkflowIds.join(', ')}`,
    ),
    metric(
      'self-hosted-trust-ready',
      trust.trustLevel === 'high' && trust.readiness === 'agent-ready' && trust.findings.length === 0,
      `trust/readiness/findings: ${trust.trustLevel}/${trust.readiness}/${trust.findings.length}`,
    ),
    metric(
      'self-hosted-portal-renders',
      portal.writeStatus === 'written' &&
        portal.html.includes('Skopos Console') &&
        renderedPortal.includes('Skopos Console') &&
        renderedPortal.includes('Proof snapshot') &&
        renderedPortal.includes('Operational surfaces'),
      `portal status/path: ${portal.writeStatus}/${portal.outputPath}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runToolNativeEnforcementBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  const init = runCliJson<{
    enforcement: {
      primarySurface: string;
      toolAdapters: Array<{ toolId: string; path: string }>;
    };
  }>(['init', workspaceDir, '--json']);
  const settingsPath = join(workspaceDir, '.skopos', 'tooling', 'claude-code', 'settings.json');
  const postEditHookPath = join(
    workspaceDir,
    '.skopos',
    'tooling',
    'claude-code',
    'hooks',
    'post-edit-hook.mjs',
  );
  const stopHookPath = join(
    workspaceDir,
    '.skopos',
    'tooling',
    'claude-code',
    'hooks',
    'stop-hook.mjs',
  );
  const settings = JSON.parse(await readFile(settingsPath, 'utf8')) as {
    hooks: {
      PostToolUse: Array<{ matcher: string }>;
      Stop: Array<{ hooks: Array<{ type: string }> }>;
    };
  };

  await writeFile(
    join(workspaceDir, 'AGENTS.md'),
    `${await readFile(join(workspaceDir, 'AGENTS.md'), 'utf8')}\nProof hook sync marker\n`,
    'utf8',
  );
  execFileSync('node', [postEditHookPath], {
    cwd: workspaceDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      CLAUDE_PROJECT_DIR: workspaceDir,
      SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
      SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
      SKOPOS_CLI_CWD: cliPackageRoot,
    },
    input: JSON.stringify({
      cwd: workspaceDir,
      tool_input: {
        file_path: join(workspaceDir, 'AGENTS.md'),
      },
    }),
  });

  initializeGitWorkspace(workspaceDir);
  commitWorkspace(workspaceDir, 'baseline');
  await writeFile(
    join(workspaceDir, 'packages/api/package.json'),
    `${await readFile(join(workspaceDir, 'packages/api/package.json'), 'utf8')}\n`,
    'utf8',
  );

  const stopOutput = execFileSync('node', [stopHookPath], {
    cwd: workspaceDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      CLAUDE_PROJECT_DIR: workspaceDir,
      SKOPOS_CLI_ENTRYPOINT: cliEntrypoint,
      SKOPOS_NODE_IMPORT_PATH: tsxLoaderPath,
      SKOPOS_CLI_CWD: cliPackageRoot,
    },
    input: JSON.stringify({
      cwd: workspaceDir,
      hook_event_name: 'Stop',
    }),
  });
  const stopDecision = JSON.parse(stopOutput) as { decision: string; reason: string };
  const claudeMirror = await readFile(join(workspaceDir, 'CLAUDE.md'), 'utf8');

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'enforcement-profile',
      init.enforcement.primarySurface === 'cli-and-mcp' &&
        init.enforcement.toolAdapters.some((adapter) => adapter.toolId === 'claude-code'),
      `surface/adapters: ${init.enforcement.primarySurface}/${init.enforcement.toolAdapters.map((adapter) => adapter.toolId).join(', ')}`,
    ),
    metric(
      'settings-generated',
      settings.hooks.PostToolUse[0]?.matcher === 'Edit|Write|MultiEdit' &&
        settings.hooks.Stop[0]?.hooks[0]?.type === 'command',
      `matcher/type: ${settings.hooks.PostToolUse[0]?.matcher ?? 'none'}/${settings.hooks.Stop[0]?.hooks[0]?.type ?? 'none'}`,
    ),
    metric(
      'post-edit-sync',
      claudeMirror.includes('Proof hook sync marker'),
      'CLAUDE.md mirror synced after AGENTS edit',
    ),
    metric(
      'stop-blocks-unfinished-closure',
      stopDecision.decision === 'block',
      `decision: ${stopDecision.decision}`,
    ),
    metric(
      'stop-reason-high-signal',
      stopDecision.reason.includes('no active claimed mission') &&
        stopDecision.reason.includes('skopos trust'),
      `reason: ${stopDecision.reason}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runMultiActorMissionCoordinationBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  runCliJson(['init', workspaceDir, '--json']);
  runCliJson(['instructions', 'sync', workspaceDir, '--json']);
  const plan = runCliJson<{
    actorId?: string;
    missionId: string;
    mission: {
      state: string;
      coordination: {
        claimedBy?: {
          actorId: string;
        };
        lastUpdatedBy?: string;
      };
    };
  }>([
    'plan',
    benchmark.goal,
    workspaceDir,
    '--scope',
    benchmark.scope,
    '--actor',
    'agent-planner',
    '--json',
  ]);
  const claimed = runCliJson<{
    state: string;
    coordination: {
      claimedBy?: {
        actorId: string;
      };
      lastUpdatedBy?: string;
    };
  }>([
    'mission',
    'claim',
    plan.missionId,
    workspaceDir,
    '--actor',
    'agent-alpha',
    '--json',
  ]);
  const blocked = runCliFailure([
    'mission',
    'complete',
    plan.missionId,
    workspaceDir,
    '--actor',
    'agent-beta',
    '--json',
  ]);
  const forcedClaim = runCliJson<{
    coordination: {
      claimedBy?: {
        actorId: string;
      };
    };
  }>([
    'mission',
    'claim',
    plan.missionId,
    workspaceDir,
    '--actor',
    'agent-beta',
    '--force',
    '--json',
  ]);
  const blockedDone = runCliJson<{
    closureStatus: string;
    checks: Array<{ id: string; status: string }>;
    missionEvidence?: {
      claimedByActorId?: string;
      requestedActorId?: string;
    };
  }>([
    'done',
    'packages/shared/package.json',
    '--mission',
    plan.missionId,
    '--actor',
    'agent-alpha',
    '--cwd',
    workspaceDir,
    '--json',
  ]);
  const completed = runCliJson<{
    state: string;
    items: Array<{ status: string }>;
    coordination: {
      claimedBy?: {
        actorId: string;
      };
      lastUpdatedBy?: string;
    };
  }>([
    'mission',
    'complete',
    plan.missionId,
    workspaceDir,
    '--actor',
    'agent-beta',
    '--json',
  ]);
  const ownedDone = runCliJson<{
    closureStatus: string;
    checks: Array<{ id: string; status: string }>;
    missionEvidence?: {
      claimedByActorId?: string;
      requestedActorId?: string;
    };
  }>([
    'done',
    'packages/shared/package.json',
    '--mission',
    plan.missionId,
    '--actor',
    'agent-beta',
    '--cwd',
    workspaceDir,
    '--json',
  ]);

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'plan-actor-attributed',
      plan.actorId === 'agent-planner' && plan.mission.coordination.lastUpdatedBy === 'agent-planner',
      `plan actor/mission updater: ${plan.actorId ?? 'none'}/${plan.mission.coordination.lastUpdatedBy ?? 'none'}`,
    ),
    metric('mission-starts-unclaimed', plan.mission.coordination.claimedBy === undefined, 'mission starts unclaimed'),
    metric(
      'first-actor-claim',
      claimed.state === 'active' &&
        claimed.coordination.claimedBy?.actorId === 'agent-alpha' &&
        claimed.coordination.lastUpdatedBy === 'agent-alpha',
      `state/claim: ${claimed.state}/${claimed.coordination.claimedBy?.actorId ?? 'none'}/${claimed.coordination.lastUpdatedBy ?? 'none'}`,
    ),
    metric(
      'second-actor-blocked',
      blocked.message.includes('currently claimed by agent-alpha'),
      `message: ${blocked.message}`,
    ),
    metric(
      'force-transfer-works',
      forcedClaim.coordination.claimedBy?.actorId === 'agent-beta',
      `claim: ${forcedClaim.coordination.claimedBy?.actorId ?? 'none'}`,
    ),
    metric(
      'wrong-actor-closure-blocked',
      blockedDone.closureStatus === 'blocked' &&
        blockedDone.checks.some(
          (check) => check.id === 'mission-ownership' && check.status === 'fail',
        ) &&
        blockedDone.missionEvidence?.claimedByActorId === 'agent-beta' &&
        blockedDone.missionEvidence?.requestedActorId === 'agent-alpha',
      `closure/owner/requested: ${blockedDone.closureStatus}/${blockedDone.missionEvidence?.claimedByActorId ?? 'none'}/${blockedDone.missionEvidence?.requestedActorId ?? 'none'}`,
    ),
    metric(
      'new-owner-completes',
      completed.state === 'complete' &&
        completed.items.every((item) => item.status === 'complete') &&
        completed.coordination.claimedBy?.actorId === 'agent-beta' &&
        completed.coordination.lastUpdatedBy === 'agent-beta',
      `state/claim/lastUpdatedBy: ${completed.state}/${completed.coordination.claimedBy?.actorId ?? 'none'}/${completed.coordination.lastUpdatedBy ?? 'none'}`,
    ),
    metric(
      'owner-closure-passes',
      ownedDone.checks.some(
          (check) => check.id === 'mission-ownership' && check.status === 'pass',
        ) &&
        ownedDone.missionEvidence?.claimedByActorId === 'agent-beta' &&
        ownedDone.missionEvidence?.requestedActorId === 'agent-beta',
      `closure/owner/requested: ${ownedDone.closureStatus}/${ownedDone.missionEvidence?.claimedByActorId ?? 'none'}/${ownedDone.missionEvidence?.requestedActorId ?? 'none'}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const runBatchMissionSlicingBenchmark = async (
  benchmark: SkoposProofBenchmarkDefinition,
): Promise<ProofBenchmarkResult> => {
  const workspaceDir = await createTempWorkspace(benchmark.fixture);
  runCliJson(['init', workspaceDir, '--json']);
  runCliJson(['instructions', 'sync', workspaceDir, '--json']);
  const parentPlan = runCliJson<{
    planId: string;
    missionId: string;
    mission: {
      scope: { scope: { id: string } };
      items: Array<{ id: string; status: string }>;
      linkedSlices: Array<unknown>;
    };
  }>([
    'plan',
    benchmark.goal,
    workspaceDir,
    '--scope',
    'workspace',
    '--actor',
    'agent-batch',
    '--json',
  ]);
  const claimedParent = runCliJson<{
    state: string;
    coordination: {
      claimedBy?: {
        actorId: string;
      };
    };
  }>([
    'mission',
    'claim',
    parentPlan.missionId,
    workspaceDir,
    '--actor',
    'agent-alpha',
    '--json',
  ]);
  const blocked = runCliFailure([
    'mission',
    'slice',
    parentPlan.missionId,
    'stabilize api workflow proof lane',
    workspaceDir,
    '--actor',
    'agent-alpha',
    '--json',
  ]);
  const blockedCrossActor = runCliFailure([
    'mission',
    'slice',
    parentPlan.missionId,
    'stabilize api workflow proof lane',
    workspaceDir,
    '--scope',
    benchmark.scope,
    '--actor',
    'agent-beta',
    '--json',
  ]);
  const sliced = runCliJson<{
    actorId: string;
    parentMission: {
      id: string;
      state: string;
      items: Array<{ id: string; status: string }>;
      linkedSlices: Array<{
        missionId: string;
        planId: string;
        scopeId: string;
        claimedByActorId?: string;
      }>;
      coordination: {
        claimedBy?: {
          actorId: string;
        };
        lastUpdatedBy?: string;
      };
    };
    slicePlan: {
      planId: string;
      parentPlanId?: string;
      parentMissionId?: string;
    };
    sliceMission: {
      id: string;
      parentMissionId?: string;
      state: string;
      scope: { scope: { id: string } };
      coordination: {
        claimedBy?: {
          actorId: string;
        };
        lastUpdatedBy?: string;
      };
    };
  }>([
    'mission',
    'slice',
    parentPlan.missionId,
    'stabilize api workflow proof lane',
    workspaceDir,
    '--scope',
    benchmark.scope,
    '--actor',
    'agent-beta',
    '--claim',
    '--force',
    '--json',
  ]);
  const completedSlice = runCliJson<{
    id: string;
    state: string;
    coordination: {
      claimedBy?: {
        actorId: string;
      };
    };
  }>([
    'mission',
    'complete',
    sliced.sliceMission.id,
    workspaceDir,
    '--actor',
    'agent-beta',
    '--json',
  ]);
  const refreshedParent = JSON.parse(
    await readFile(
      join(workspaceDir, '.skopos', 'missions', `${parentPlan.missionId}.json`),
      'utf8',
    ),
  ) as {
    linkedSlices: Array<{ missionId: string; state: string; claimedByActorId?: string }>;
  };
  const logEntries = (
    await readFile(join(workspaceDir, '.skopos', 'log.jsonl'), 'utf8')
  )
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as { eventKind: string; metadata?: { childMissionId?: string } });

  const metrics: ProofBenchmarkMetric[] = [
    metric(
      'parent-plan-is-wide',
      parentPlan.mission.scope.scope.id === 'workspace' &&
        parentPlan.mission.items.some((item) => item.id === 'decision-plan.scope-confirmation'),
      `scope/items: ${parentPlan.mission.scope.scope.id}/${parentPlan.mission.items.map((item) => item.id).join(', ')}`,
    ),
    metric(
      'parent-claim-recorded',
      claimedParent.state === 'active' &&
        claimedParent.coordination.claimedBy?.actorId === 'agent-alpha',
      `parent claim/state: ${claimedParent.coordination.claimedBy?.actorId ?? 'none'}/${claimedParent.state}`,
    ),
    metric(
      'workspace-slice-requires-narrow-scope',
      blocked.message.includes('Pass --scope <scope-id>'),
      `message: ${blocked.message}`,
    ),
    metric(
      'cross-actor-slice-blocked-without-force',
      blockedCrossActor.message.includes('currently claimed by agent-alpha'),
      `message: ${blockedCrossActor.message}`,
    ),
    metric(
      'slice-links-parent-and-child',
      sliced.slicePlan.parentPlanId === parentPlan.planId &&
        sliced.slicePlan.parentMissionId === parentPlan.missionId &&
        sliced.sliceMission.parentMissionId === parentPlan.missionId,
      `parent links: ${sliced.slicePlan.parentPlanId ?? 'none'}/${sliced.slicePlan.parentMissionId ?? 'none'}/${sliced.sliceMission.parentMissionId ?? 'none'}`,
    ),
    metric(
      'slice-narrows-scope-and-claims-child',
      sliced.actorId === 'agent-beta' &&
        sliced.sliceMission.scope.scope.id === benchmark.scope &&
        sliced.sliceMission.state === 'active' &&
        sliced.sliceMission.coordination.claimedBy?.actorId === 'agent-beta',
      `actor/scope/state/claim: ${sliced.actorId}/${sliced.sliceMission.scope.scope.id}/${sliced.sliceMission.state}/${sliced.sliceMission.coordination.claimedBy?.actorId ?? 'none'}`,
    ),
    metric(
      'parent-mission-records-linked-slice-and-transfer',
      sliced.parentMission.state === 'active' &&
        sliced.parentMission.linkedSlices.length === 1 &&
        sliced.parentMission.linkedSlices[0]?.missionId === sliced.sliceMission.id &&
        sliced.parentMission.linkedSlices[0]?.claimedByActorId === 'agent-beta' &&
        sliced.parentMission.coordination.claimedBy?.actorId === 'agent-beta',
      `parent state/link: ${sliced.parentMission.state}/${sliced.parentMission.linkedSlices.map((entry) => `${entry.scopeId}:${entry.claimedByActorId ?? 'none'}`).join(', ')}`,
    ),
    metric(
      'child-completion-syncs-parent-link',
      completedSlice.state === 'complete' &&
        completedSlice.coordination.claimedBy?.actorId === 'agent-beta' &&
        refreshedParent.linkedSlices.some(
          (entry) =>
            entry.missionId === sliced.sliceMission.id &&
            entry.state === 'complete' &&
            entry.claimedByActorId === 'agent-beta',
        ),
      `child/parent link state: ${completedSlice.state}/${refreshedParent.linkedSlices.map((entry) => `${entry.missionId}:${entry.state}:${entry.claimedByActorId ?? 'none'}`).join(', ')}`,
    ),
    metric(
      'scope-decision-resolved-on-parent',
      sliced.parentMission.items.some(
        (item) => item.id === 'decision-plan.scope-confirmation' && item.status === 'complete',
      ) &&
        sliced.parentMission.items.some(
          (item) => item.id === 'step-resolve-decisions' && item.status === 'complete',
        ) &&
        sliced.parentMission.coordination.lastUpdatedBy === 'agent-beta',
      `decision statuses/updater: ${sliced.parentMission.items.map((item) => `${item.id}:${item.status}`).join(', ')}/${sliced.parentMission.coordination.lastUpdatedBy ?? 'none'}`,
    ),
    metric(
      'slice-event-recorded',
      logEntries.some(
        (entry) =>
          entry.eventKind === 'mission-slice' &&
          entry.metadata?.childMissionId === sliced.sliceMission.id &&
          entry.metadata?.actorId === 'agent-beta' &&
          entry.metadata?.forceTransfer === true,
      ),
      `events: ${logEntries.map((entry) => entry.eventKind).join(', ')}`,
    ),
  ];

  return buildSkoposProofBenchmarkResult(benchmark, metrics);
};

const createTempWorkspace = async (fixtureName: string): Promise<string> => {
  const tempDir = await mkdtemp(join(tmpdir(), 'skopos-proof-phase-'));
  const workspaceDir = join(tempDir, 'workspace');
  tempDirs.push(tempDir);
  await cp(join(fixturesRoot, fixtureName), workspaceDir, { recursive: true });
  return workspaceDir;
};

const initializeGitWorkspace = (workspaceDir: string): void => {
  runGit(workspaceDir, ['init']);
  runGit(workspaceDir, ['config', 'user.email', 'skopos-fixture@example.com']);
  runGit(workspaceDir, ['config', 'user.name', 'Skopos Fixture']);
};

const commitWorkspace = (workspaceDir: string, message: string): void => {
  runGit(workspaceDir, ['add', '.']);
  runGit(workspaceDir, ['commit', '-m', message]);
};

const stringifyFinding = (
  findings: Array<{ id: string; classification: string; severity: string }>,
  id: string,
): string => {
  const finding = findings.find((item) => item.id === id);
  if (!finding) {
    return 'missing';
  }

  return `${finding.classification}:${finding.severity}`;
};

const runCliJson = <T>(args: string[]): T => {
  const output = execFileSync('node', ['--import', 'tsx', cliEntrypoint, ...args], {
    cwd: cliPackageRoot,
    encoding: 'utf8',
    env: process.env,
  });

  return JSON.parse(output) as T;
};

const runCliJsonTimed = <T>(args: string[]): { result: T; durationMs: number } => {
  const startedAt = Date.now();
  const result = runCliJson<T>(args);
  return {
    result,
    durationMs: Date.now() - startedAt,
  };
};

const runCliFailure = (args: string[]): { message: string; stdout?: string; stderr?: string } => {
  try {
    execFileSync('node', ['--import', 'tsx', cliEntrypoint, ...args], {
      cwd: cliPackageRoot,
      encoding: 'utf8',
      env: process.env,
      stdio: 'pipe',
    });
  } catch (error) {
    const failure = error as Error & { stdout?: string; stderr?: string };
    return {
      message: failure.message,
      stdout: failure.stdout,
      stderr: failure.stderr,
    };
  }

  throw new Error('Expected CLI command to fail, but it succeeded.');
};

const runGit = (cwd: string, args: string[]): string =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: process.env,
  });
