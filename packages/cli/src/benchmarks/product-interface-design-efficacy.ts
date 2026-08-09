import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  buildSkoposSkillSourceDigest,
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
  loadSkoposSkillPacks,
} from '@skopos/indexer';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposSkillEvaluationEnvironmentIdentity,
  SkoposSkillEvaluationReviewInput,
  SkoposSkillEvaluationReviewOutput,
  SkoposSkillEvaluationWorkerInput,
  SkoposSkillEvaluationWorkerOutput,
} from '@skopos/model';
import {
  evaluateSkoposSkillFixturesRuntime,
  renderSkoposSkillContextBriefRuntime,
  resolveSkoposSkillContextBriefRuntime,
  runSkoposSkillPairedEvaluationRuntime,
  type SkoposSkillEvaluationReviewer,
  type SkoposSkillPairedComparison,
  type SkoposSkillEvaluationWorker,
} from '@skopos/runtime';
import { chromium } from 'playwright';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const bindingPath = 'tools/skopos/skills/ui.product-interface-design.json';
const packPath = 'skill-packs/ui/product-interface-design/pack.json';
const suitePath = 'skill-packs/ui/product-interface-design/evaluations/core.suite.json';
const contextMatrixPath =
  'skill-packs/ui/product-interface-design/design-context/evaluations/candidate.matrix.json';
const contextLibraryPath =
  'skill-packs/ui/product-interface-design/design-context/library.json';
const rubricPath = 'skill-packs/ui/product-interface-design/rubrics/product-interface-review.json';
const templateRoot = 'skill-packs/ui/product-interface-design/evaluations/templates';
const fixtureRoot = 'skill-packs/ui/product-interface-design/fixtures';
const modelId = process.env.SKOPOS_EFFICACY_MODEL ?? 'gpt-5.6-sol';
const reasoningEffort = process.env.SKOPOS_EFFICACY_REASONING ?? 'medium';
const codexPath = process.env.SKOPOS_CODEX_PATH ?? '/Applications/ChatGPT.app/Contents/Resources/codex';
const coreSmokeCaseIds = ['operations-workbench'];
const coreFullCaseIds = [
  'operations-workbench', 'transaction-trust', 'discovery-coordination', 'documentation-workspace',
  'responsive-transformation', 'failure-recovery', 'product-character', 'complete-service-flow',
];
const contextSmokeCaseIds = ['developer-workbench'];
const contextFullCaseIds = [
  'developer-workbench', 'ai-delegated-work', 'commerce-onboarding',
  'financial-review', 'developer-monitoring', 'commerce-mobile-transformation',
];
const contextTemplateCases: Record<string, string> = {
  'developer-workbench': 'documentation-workspace',
  'ai-delegated-work': 'discovery-coordination',
  'commerce-onboarding': 'complete-service-flow',
  'financial-review': 'transaction-trust',
  'developer-monitoring': 'operations-workbench',
  'commerce-mobile-transformation': 'responsive-transformation',
};
const contextRubricDimensions = [
  'task-archetype and reference fit',
  'information hierarchy and brand fit',
  'color-role clarity and product-specific character',
  'navigation and interaction state clarity',
  'state and recovery completeness',
  'responsive transformation and truthful limitations',
  'accessibility and keyboard behavior',
  'inclusion, user agency, and interruption discipline',
  'rendered proof quality',
];
const sanitizedPath = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
const disabledFeatures = ['plugins', 'apps', 'multi_agent', 'browser_use', 'in_app_browser', 'workspace_dependencies'];
const budgets = {
  smoke: { maximumInputTokens: 750_000, maximumFreshInputTokens: 225_000, maximumOutputTokens: 36_000 },
  full: { maximumInputTokens: 4_000_000, maximumFreshInputTokens: 1_200_000, maximumOutputTokens: 200_000 },
};
const estimatedExposure = {
  smoke: { inputTokens: { minimum: 200_000, maximum: 500_000 }, freshInputTokens: { minimum: 50_000, maximum: 180_000 },
    outputTokens: { minimum: 8_000, maximum: 30_000 } },
  full: { inputTokens: { minimum: 2_000_000, maximum: 3_500_000 }, freshInputTokens: { minimum: 500_000, maximum: 1_000_000 },
    outputTokens: { minimum: 70_000, maximum: 140_000 } },
};
const workerInstruction = 'isolated-static-ui-worker-v3:case-local-template:no-git:no-network:no-parent-read:no-dependency-install';
const reviewerInstruction = 'blinded-rendered-ui-reviewer-v3:case-local-rubric-only:0-3:model-review-is-not-human-adjudication';

type CommandRecord = {
  id: string;
  role: 'worker' | 'reviewer';
  caseId: string;
  opaqueWorkspace: string;
  executable: string;
  args: string[];
  exitCode: number | null;
  durationMs: number;
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  toolCalls: number;
  tracePath: string;
  finalOutputPath: string;
};

type RunReport = {
  schemaVersion: 1;
  purpose: 'pipeline-canary' | 'paired-release-efficacy' |
    'design-context-pipeline-canary' | 'design-context-paired-efficacy';
  comparison: 'core-vs-no-skill' | 'core-plus-context-vs-core';
  result: 'pass' | 'fail' | 'inconclusive';
  stage: 'smoke' | 'full';
  runId: string;
  generatedAt: string;
  authorization: 'not-required' | 'explicit-user-authorization';
  matrix: { cases: number; workerCalls: number; reviewerCalls: number; totalCalls: number };
  estimatedExposure: (typeof estimatedExposure)[keyof typeof estimatedExposure];
  identities: SkoposSkillEvaluationEnvironmentIdentity;
  evaluationArtifactPath?: string;
  evidenceRoot: string;
  commands: CommandRecord[];
  preflight: { status: 'pass' | 'fail'; checks: Array<{ id: string; status: 'pass' | 'fail'; detail: string }> };
  budget: typeof budgets.smoke & { observedInputTokens: number; observedFreshInputTokens: number; observedOutputTokens: number };
  adjudication: {
    modelReview: 'not-run' | 'complete' | 'incomplete';
    independentHumanReview: 'not-required-for-smoke' | 'pending';
    promotionDecision: 'not-evaluated' | 'pending-human-review' | 'inconclusive';
  };
  containment: {
    isolatedRoot: string;
    sourceCheckoutReferences: string[];
    crossArmReferences: string[];
    nodePathPresent: boolean;
  };
  failure?: { stage: string; message: string };
};

const args = new Set(process.argv.slice(2));
const execute = args.has('--execute');
const authorized = args.has('--authorized');
const comparisonArg = process.argv.find((value) => value.startsWith('--comparison='))
  ?.slice('--comparison='.length);
if (comparisonArg && comparisonArg !== 'core' && comparisonArg !== 'design-context') {
  throw new Error(`Unknown evaluation comparison: ${comparisonArg}`);
}
const comparisonMode = (comparisonArg ?? 'core') as 'core' | 'design-context';
const stageArg = process.argv.find((value) => value.startsWith('--stage='))?.slice('--stage='.length);
if (stageArg && stageArg !== 'smoke' && stageArg !== 'full') throw new Error(`Unknown evaluation stage: ${stageArg}`);
const stage = (stageArg ?? 'smoke') as 'smoke' | 'full';
const smokeCaseIds = comparisonMode === 'design-context' ? contextSmokeCaseIds : coreSmokeCaseIds;
const fullCaseIds = comparisonMode === 'design-context' ? contextFullCaseIds : coreFullCaseIds;
const selectedCaseIds = stage === 'smoke' ? smokeCaseIds : fullCaseIds;
const runIdArg = process.argv.find((value) => value.startsWith('--run-id='));
const runId = runIdArg?.slice('--run-id='.length) ??
  `product-interface-design${comparisonMode === 'design-context' ? '-context' : ''}-${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}`;
const isolatedRoot = join(tmpdir(), `skopos-${runId}`);
const artifactBaseRoot = process.env.SKOPOS_ARTIFACT_ROOT ? resolve(process.env.SKOPOS_ARTIFACT_ROOT) : skoposRoot;
const evidenceRoot = join(artifactBaseRoot, '.skopos/evaluations', runId);
const commands: CommandRecord[] = [];

const main = async (): Promise<void> => {
  if (execute && !authorized) throw new Error('--execute requires --authorized.');
  await Promise.all([mkdir(isolatedRoot, { recursive: true }), mkdir(evidenceRoot, { recursive: true })]);
  const comparison = comparisonMode === 'design-context'
    ? await buildDesignContextComparison()
    : undefined;
  const identities = await buildIdentities(stage, selectedCaseIds);
  const preflight = await runPreflight();
  const matrix = { cases: selectedCaseIds.length, workerCalls: selectedCaseIds.length * 2,
    reviewerCalls: selectedCaseIds.length, totalCalls: selectedCaseIds.length * 3 };
  const reportBase = {
    schemaVersion: 1 as const,
    purpose: comparisonMode === 'design-context'
      ? stage === 'smoke'
        ? 'design-context-pipeline-canary' as const
        : 'design-context-paired-efficacy' as const
      : stage === 'smoke'
        ? 'pipeline-canary' as const
        : 'paired-release-efficacy' as const,
    comparison: comparisonMode === 'design-context'
      ? 'core-plus-context-vs-core' as const
      : 'core-vs-no-skill' as const,
    stage,
    runId,
    generatedAt: new Date().toISOString(),
    authorization: execute ? 'explicit-user-authorization' as const : 'not-required' as const,
    matrix,
    estimatedExposure: estimatedExposure[stage],
    identities,
    evidenceRoot,
    commands,
    preflight,
  };
  const smokeReportArg = process.argv.find((value) => value.startsWith('--smoke-report='));
  if (stage === 'full' && (execute || smokeReportArg)) await assertValidSmokeReport(identities);
  if (!execute) {
    const report: RunReport = {
      ...reportBase,
      result: preflight.status === 'pass' ? 'pass' : 'fail',
      budget: observedBudget(),
      adjudication: { modelReview: 'not-run', independentHumanReview: stage === 'smoke' ? 'not-required-for-smoke' : 'pending',
        promotionDecision: 'not-evaluated' },
      containment: await inspectContainment(),
    };
    await writeReport(report);
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (report.result === 'fail') process.exitCode = 1;
    return;
  }
  if (preflight.status === 'fail') throw new Error('Evaluation preflight failed; no model call was started.');

  const operatingModel = await buildOperatingModel();
  const adapter = new CodexEvaluationAdapter();
  const result = await runSkoposSkillPairedEvaluationRuntime({
    cwd: skoposRoot,
    pack: 'ui.product-interface-design',
    binding: 'skopos.ui.product-interface-design',
    suite: 'ui-product-interface-design-core',
    runId,
    evaluationRoot: isolatedRoot,
    artifactBaseRoot,
    worker: adapter,
    reviewer: adapter,
    operatingModel,
    environment: identities,
    caseIds: selectedCaseIds,
    comparison,
  });
  const containment = await inspectContainment();
  const failed = result.artifact.invalidCases > 0 || result.artifact.abortedCases > 0 ||
    containment.sourceCheckoutReferences.length > 0 || containment.crossArmReferences.length > 0;
  const budget = observedBudget();
  const overBudget = budget.observedInputTokens > budget.maximumInputTokens ||
    budget.observedFreshInputTokens > budget.maximumFreshInputTokens ||
    budget.observedOutputTokens > budget.maximumOutputTokens;
  const report: RunReport = {
    ...reportBase,
    result: failed || overBudget ? 'fail' : stage === 'full' ? 'inconclusive' : 'pass',
    evaluationArtifactPath: result.artifactPath,
    budget,
    adjudication: {
      modelReview: result.artifact.invalidCases === 0 && result.artifact.abortedCases === 0 ? 'complete' : 'incomplete',
      independentHumanReview: stage === 'smoke' ? 'not-required-for-smoke' : 'pending',
      promotionDecision: stage === 'full' ? 'pending-human-review' : 'not-evaluated',
    },
    containment,
  };
  await writeReport(report);
  await writeExternalReceipt('succeeded');
  process.stdout.write(`${JSON.stringify({ report, evaluation: result.artifact }, null, 2)}\n`);
  if (failed || overBudget) process.exitCode = 1;
};

const buildDesignContextComparison = async (): Promise<SkoposSkillPairedComparison> => {
  const [packs, matrixSource, suiteSource] = await Promise.all([
    loadSkoposSkillPacks({ cwd: skoposRoot }),
    readFile(join(skoposRoot, contextMatrixPath), 'utf8'),
    readFile(join(skoposRoot, suitePath), 'utf8'),
  ]);
  const pack = packs.find((candidate) => candidate.packId === 'ui.product-interface-design');
  if (!pack?.loadedContextLibrary || !pack.contextLibrary) {
    throw new Error('Product Interface Design has no loaded Context Library.');
  }
  const matrix = JSON.parse(matrixSource) as {
    id: string;
    status: string;
    cases: Array<{
      caseId: string;
      taskPrompt: string;
      selectors: Record<string, string[]>;
    }>;
  };
  if (matrix.status !== 'prepared-not-executed') {
    throw new Error(`Unexpected Design Context matrix status: ${matrix.status}.`);
  }
  if (matrix.cases.map(({ caseId }) => caseId).join('\n') !== contextFullCaseIds.join('\n')) {
    throw new Error('Design Context matrix cases no longer match the frozen runner order.');
  }
  const suite = JSON.parse(suiteSource) as {
    cases: Array<{ caseId: string; title: string; projectTemplatePath: string }>;
  };
  const templates = new Map(suite.cases.map((entry) => [entry.caseId, entry]));
  const moduleIds = ['interface-design.structure', 'interface-design.behavior', 'interface-design.finish'];
  const baseMeasuredTokens = moduleIds.reduce((total, moduleId) => {
    const module = pack.modules.find((candidate) => candidate.id === moduleId);
    if (!module) throw new Error(`Missing Product Interface Design module ${moduleId}.`);
    return total + module.measuredTokens;
  }, 0);
  const maximumMeasuredTokens = Math.min(
    pack.selection.maximumMeasuredTokens,
    baseMeasuredTokens + pack.contextLibrary.maximumMeasuredTokens,
  );
  const generatedAt = new Date().toISOString();
  const briefRoot = join(evidenceRoot, 'resolved-context-briefs');
  await mkdir(briefRoot, { recursive: true });

  const cases = await Promise.all(matrix.cases.map(async (entry) => {
    const templateCaseId = contextTemplateCases[entry.caseId];
    const template = templateCaseId ? templates.get(templateCaseId) : undefined;
    if (!template) throw new Error(`No frozen template mapping exists for ${entry.caseId}.`);
    const portableTemplatePath = join(dirname(suitePath), '..', template.projectTemplatePath);
    const templateDigest = await digestTree(join(skoposRoot, portableTemplatePath));
    const brief = resolveSkoposSkillContextBriefRuntime({
      taskId: `evaluation-${entry.caseId}`,
      packId: pack.packId,
      packVersion: pack.version,
      library: pack.loadedContextLibrary!,
      selectors: entry.selectors,
      taskEvidence: [
        entry.taskPrompt,
        ...Object.entries(entry.selectors).map(([dimension, values]) =>
          `${dimension}: ${values.join(', ')}`),
      ],
      projectAuthorities: [{
        id: `evaluation-template.${entry.caseId}`,
        role: 'interface-authority',
        sourcePaths: [portableTemplatePath],
        sourceDigest: templateDigest,
        summary: 'The case-local components, tokens, language, and behavior remain authoritative.',
      }],
      maximumMeasuredTokens,
      baseMeasuredTokens,
      asOf: generatedAt.slice(0, 10),
      generatedAt,
    });
    if (brief.principles.length < 2) {
      throw new Error(`Design Context case ${entry.caseId} resolved fewer than two primary principles.`);
    }
    await writeFile(
      join(briefRoot, `${entry.caseId}.json`),
      `${JSON.stringify(brief, null, 2)}\n`,
    );
    return {
      caseId: entry.caseId,
      title: template.title,
      taskPrompt: entry.taskPrompt,
      projectTemplatePath: template.projectTemplatePath,
      controlModuleIds: moduleIds,
      candidateModuleIds: moduleIds,
      candidateAdditionalContext: [{
        id: `skill-context-brief.${entry.caseId}`,
        kind: 'skill' as const,
        title: 'Resolved Context Brief',
        summary: renderSkoposSkillContextBriefRuntime(brief),
        importance: 'recommended' as const,
        appliesTo: Object.values(entry.selectors).flat(),
        provenance: [contextMatrixPath, contextLibraryPath].map((path) => ({
          authority: 'accepted' as const,
          sourceKind: 'skill' as const,
          sourceId: `${pack.packId}@${pack.version}`,
          path,
        })),
      }],
      rubricDimensions: contextRubricDimensions,
    };
  }));

  return {
    comparisonId: 'ui-product-interface-design-context',
    sourcePaths: [contextMatrixPath, contextLibraryPath, suitePath],
    cases,
  };
};

class CodexEvaluationAdapter implements SkoposSkillEvaluationWorker, SkoposSkillEvaluationReviewer {
  private hardFailure: { stage: string; message: string } | undefined;

  async execute(input: SkoposSkillEvaluationWorkerInput): Promise<SkoposSkillEvaluationWorkerOutput> {
    const startedAt = Date.now();
    if (this.hardFailure) {
      return {
        status: 'aborted', summary: 'Run stopped after an earlier infrastructure failure.', artifactPaths: [],
        measuredInputTokens: 0, measuredCachedInputTokens: 0, measuredOutputTokens: 0, toolCalls: 0, correctionTurns: 0,
        supervisionEvents: 0, durationMs: 0, authorityViolationIds: [], failure: this.hardFailure,
      };
    }
    const callId = `${input.caseId}-${basename(input.workspaceRoot)}`;
    const callRoot = join(evidenceRoot, 'calls', callId);
    await mkdir(callRoot, { recursive: true });
    const schemaPath = join(callRoot, 'worker-schema.json');
    const finalOutputPath = join(callRoot, 'final.json');
    const tracePath = join(callRoot, 'events.jsonl');
    await writeFile(schemaPath, `${JSON.stringify(workerSchema, null, 2)}\n`);
    const prompt = workerPrompt(input);
    const commandArgs = [
      'exec', '--ephemeral', '--json', '--skip-git-repo-check',
      '--disable', 'plugins', '--disable', 'apps', '--disable', 'multi_agent',
      '--disable', 'browser_use', '--disable', 'in_app_browser', '--disable', 'workspace_dependencies',
      '--model', modelId,
      '-c', `model_reasoning_effort=\"${reasoningEffort}\"`,
      '--sandbox', 'workspace-write', '--cd', input.workspaceRoot,
      '--output-schema', schemaPath, '--output-last-message', finalOutputPath,
      prompt,
    ];
    const command = await runCodex({ id: callId, role: 'worker', caseId: input.caseId,
      workspaceRoot: input.workspaceRoot, args: commandArgs, tracePath, finalOutputPath });
    if (budgetExceeded()) {
      const output = failedWorker('aborted', command, 'token-budget', new Error('Declared run token ceiling exceeded.'));
      this.hardFailure = output.failure;
      return output;
    }
    if (command.exitCode !== 0) {
      const output = failedWorker('aborted', command, 'codex-exec');
      if (command.inputTokens === 0 && command.outputTokens === 0) this.hardFailure = output.failure;
      return output;
    }
    let parsed: { summary: string; authorityViolationIds: string[] };
    try {
      parsed = JSON.parse(await readFile(finalOutputPath, 'utf8')) as typeof parsed;
    } catch (error) {
      return failedWorker('invalid', command, 'worker-output', error);
    }
    const sourceReference = await traceReferencesSource(tracePath);
    if (sourceReference.length > 0) {
      return failedWorker('invalid', command, 'isolation', new Error(`Source checkout referenced: ${sourceReference.join(', ')}`));
    }
    let artifactPaths: string[];
    try {
      artifactPaths = await captureRenderedArtifacts(input.workspaceRoot);
    } catch (error) {
      return failedWorker('invalid', command, 'render-proof', error);
    }
    return {
      status: 'completed',
      summary: parsed.summary,
      artifactPaths,
      measuredInputTokens: command.inputTokens,
      measuredCachedInputTokens: command.cachedInputTokens,
      measuredOutputTokens: command.outputTokens,
      toolCalls: command.toolCalls,
      correctionTurns: 0,
      supervisionEvents: 0,
      durationMs: Date.now() - startedAt,
      authorityViolationIds: parsed.authorityViolationIds,
    };
  }

  async review(input: SkoposSkillEvaluationReviewInput): Promise<SkoposSkillEvaluationReviewOutput> {
    const startedAt = Date.now();
    const callId = `${input.caseId}-blinded-review`;
    const callRoot = join(evidenceRoot, 'calls', callId);
    const reviewRoot = join(isolatedRoot, input.caseId, 'review');
    await Promise.all([mkdir(callRoot, { recursive: true }), mkdir(reviewRoot, { recursive: true })]);
    const schema = reviewerSchema(input.rubricDimensions);
    const schemaPath = join(callRoot, 'reviewer-schema.json');
    const finalOutputPath = join(callRoot, 'final.json');
    const tracePath = join(callRoot, 'events.jsonl');
    await writeFile(schemaPath, `${JSON.stringify(schema, null, 2)}\n`);
    const reviewInput = await materializeBlindedReviewBundle(input, callRoot);
    const imageArgs = reviewInput.alternatives.flatMap((alternative) =>
      alternative.artifactPaths.filter((path) => path.endsWith('.png')).flatMap((path) => ['--image', path]));
    const commandArgs = [
      'exec', '--ephemeral', '--json', '--skip-git-repo-check',
      '--disable', 'plugins', '--disable', 'apps', '--disable', 'multi_agent',
      '--disable', 'browser_use', '--disable', 'in_app_browser', '--disable', 'workspace_dependencies',
      '--model', modelId,
      '-c', `model_reasoning_effort=\"${reasoningEffort}\"`,
      '--sandbox', 'read-only', '--cd', reviewRoot,
      ...imageArgs, '--output-schema', schemaPath, '--output-last-message', finalOutputPath,
      reviewerPrompt(reviewInput),
    ];
    const command = await runCodex({ id: callId, role: 'reviewer', caseId: input.caseId,
      workspaceRoot: reviewRoot, args: commandArgs, tracePath, finalOutputPath });
    if (budgetExceeded()) return failedReview('aborted', command, 'token-budget', new Error('Declared run token ceiling exceeded.'));
    if (command.exitCode !== 0) return failedReview('aborted', command, 'codex-exec');
    try {
      const parsed = JSON.parse(await readFile(finalOutputPath, 'utf8')) as {
        winner: string; reason: string; dimensionScores: Record<string, Record<string, number>>;
      };
      return {
        status: 'completed',
        ...parsed,
        measuredInputTokens: command.inputTokens,
        measuredCachedInputTokens: command.cachedInputTokens,
        measuredOutputTokens: command.outputTokens,
        durationMs: Date.now() - startedAt,
      };
    } catch (error) {
      return failedReview('invalid', command, 'reviewer-output', error);
    }
  }
}

const workerPrompt = (input: SkoposSkillEvaluationWorkerInput): string => {
  const context = input.additionalContext.map((entry) => `## ${entry.title}\n${entry.summary}`).join('\n\n');
  return `You are implementing one bounded UI task in an isolated static project. Work only inside the current workspace. This is deliberately not a Git repository; do not run Git commands. Do not inspect parent directories, other workspaces, evaluation files, rubrics, or Skopos source. Preserve existing behavior and use only files already present; do not install dependencies or use network access. Inspect the project, implement the task, and check the result locally. Do not mention evaluation arms, skills, guidance, or scoring in your final response.\n\nTask:\n${input.taskPrompt}${context ? `\n\nProject-local guidance:\n${context}` : ''}\n\nReturn only the required JSON. Report an authority violation ID if you read outside the workspace, use network access, install a dependency, or alter evaluation evidence.`;
};

const materializeBlindedReviewBundle = async (
  input: SkoposSkillEvaluationReviewInput,
  callRoot: string,
): Promise<SkoposSkillEvaluationReviewInput> => {
  const alternatives = await Promise.all(input.alternatives.map(async (alternative) => {
    const alternativeRoot = join(callRoot, 'alternatives', alternative.label);
    await mkdir(alternativeRoot, { recursive: true });
    const artifactPaths = await Promise.all(alternative.artifactPaths.map(async (sourcePath) => {
      const destination = join(alternativeRoot, basename(sourcePath));
      await cp(sourcePath, destination, { force: false, errorOnExist: true });
      return destination;
    }));
    return { ...alternative, summary: 'Rendered implementation evidence.', artifactPaths };
  }));
  const reviewInput = { ...input, alternatives };
  await writeFile(join(callRoot, 'blinded-review-bundle.json'), `${JSON.stringify(reviewInput, null, 2)}\n`);
  return reviewInput;
};

const reviewerPrompt = (input: SkoposSkillEvaluationReviewInput): string => {
  const alternatives = input.alternatives.map((alternative) =>
    `${alternative.label}: ${alternative.artifactPaths.map((path) => basename(path)).join(', ')}`).join('\n');
  return `Act as an independent blinded UI reviewer. Compare alternatives A and B only from the attached desktop/mobile screenshots and their rendered source artifacts. You do not know which process produced either alternative. Do not inspect parent directories, evaluation configuration, Skill guidance, or any other workspace. Judge only the task and listed dimensions using the 0-3 scale: 0 missing/harmful, 1 material correction required, 2 acceptable with bounded improvements, 3 strong and evidence-backed. Automated build or accessibility checks are not substitutes for visible design-quality judgment. Choose A, B, or tie.\n\nTask:\n${input.taskPrompt}\n\nDimensions:\n${input.rubricDimensions.map((dimension) => `- ${dimension}`).join('\n')}\n\nAttached alternatives:\n${alternatives}\n\nReturn only the required JSON.`;
};

const workerSchema = {
  type: 'object', additionalProperties: false, required: ['summary', 'authorityViolationIds'],
  properties: {
    summary: { type: 'string' },
    authorityViolationIds: { type: 'array', items: { type: 'string' } },
  },
};

const reviewerSchema = (dimensions: string[]) => ({
  type: 'object', additionalProperties: false, required: ['winner', 'reason', 'dimensionScores'],
  properties: {
    winner: { enum: ['A', 'B', 'tie'] },
    reason: { type: 'string' },
    dimensionScores: {
      type: 'object', additionalProperties: false, required: dimensions,
      properties: Object.fromEntries(dimensions.map((dimension) => [dimension, {
        type: 'object', additionalProperties: false, required: ['A', 'B'],
        properties: { A: { type: 'number', minimum: 0, maximum: 3 }, B: { type: 'number', minimum: 0, maximum: 3 } },
      }])),
    },
  },
});

const runCodex = async ({ id, role, caseId, workspaceRoot, args, tracePath, finalOutputPath }: {
  id: string; role: 'worker' | 'reviewer'; caseId: string; workspaceRoot: string;
  args: string[]; tracePath: string; finalOutputPath: string;
}): Promise<CommandRecord> => {
  const startedAt = Date.now();
  const safeArgs = args.map((arg, index) => index === args.length - 1 ? '[PROMPT]' : arg);
  const output = await new Promise<{ exitCode: number | null; stdout: string; stderr: string }>((done) => {
    const child = spawn(codexPath, args, {
      cwd: workspaceRoot,
      env: {
        ...Object.fromEntries(Object.entries(process.env).filter(([key, value]) => key !== 'NODE_PATH' && key !== 'PATH' && value !== undefined)),
        PATH: sanitizedPath,
      } as NodeJS.ProcessEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.stderr.on('data', (chunk) => { stderr += String(chunk); });
    child.on('close', (exitCode) => done({ exitCode, stdout, stderr }));
    child.on('error', (error) => done({ exitCode: null, stdout, stderr: `${stderr}\n${error.message}` }));
  });
  await writeFile(tracePath, output.stdout);
  if (output.stderr) await writeFile(`${tracePath}.stderr.txt`, output.stderr);
  const telemetry = parseTelemetry(output.stdout);
  const record: CommandRecord = {
    id, role, caseId, opaqueWorkspace: workspaceRoot, executable: codexPath, args: safeArgs,
    exitCode: output.exitCode, durationMs: Date.now() - startedAt,
    inputTokens: telemetry.inputTokens, cachedInputTokens: telemetry.cachedInputTokens,
    outputTokens: telemetry.outputTokens,
    toolCalls: telemetry.toolCalls, tracePath, finalOutputPath,
  };
  commands.push(record);
  await writeFile(join(evidenceRoot, 'command-ledger.json'), `${JSON.stringify(commands, null, 2)}\n`);
  return record;
};

const parseTelemetry = (jsonl: string): { inputTokens: number; cachedInputTokens: number; outputTokens: number; toolCalls: number } => {
  let inputTokens = 0;
  let cachedInputTokens = 0;
  let outputTokens = 0;
  let toolCalls = 0;
  for (const line of jsonl.split('\n').filter(Boolean)) {
    try {
      const event = JSON.parse(line) as Record<string, unknown>;
      const usage = findUsage(event);
      if (usage) {
        inputTokens = Math.max(inputTokens, usage.input);
        cachedInputTokens = Math.max(cachedInputTokens, usage.cached);
        outputTokens = Math.max(outputTokens, usage.output);
      }
      if (event.type === 'item.completed') {
        const item = event.item as Record<string, unknown> | undefined;
        if (item?.type === 'command_execution' || item?.type === 'mcp_tool_call') toolCalls += 1;
      }
    } catch { /* retain raw line for diagnosis */ }
  }
  return { inputTokens, cachedInputTokens, outputTokens, toolCalls };
};

const findUsage = (value: unknown): { input: number; cached: number; output: number } | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const input = record.input_tokens ?? record.inputTokens;
  const output = record.output_tokens ?? record.outputTokens;
  const cached = record.cached_input_tokens ?? record.cachedInputTokens ?? 0;
  if (typeof input === 'number' && typeof output === 'number') return { input, cached: typeof cached === 'number' ? cached : 0, output };
  for (const child of Object.values(record)) {
    const found = findUsage(child);
    if (found) return found;
  }
  return undefined;
};

const captureRenderedArtifacts = async (workspaceRoot: string): Promise<string[]> => {
  const required = ['index.html', 'styles.css', 'src.js'].map((path) => join(workspaceRoot, path));
  await Promise.all(required.map((path) => stat(path)));
  const browser = await chromium.launch({ headless: true });
  try {
    const paths: string[] = [...required];
    for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      await page.goto(pathToFileURL(required[0]!).href, { waitUntil: 'load' });
      const screenshot = join(workspaceRoot, `${viewport.name}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      await page.close();
      paths.push(screenshot);
    }
    return paths;
  } finally {
    await browser.close();
  }
};

const failedWorker = (status: 'invalid' | 'aborted', command: CommandRecord, stage: string, error?: unknown): SkoposSkillEvaluationWorkerOutput => ({
  status, summary: `${stage} failed.`, artifactPaths: [], measuredInputTokens: command.inputTokens,
  measuredCachedInputTokens: command.cachedInputTokens,
  measuredOutputTokens: command.outputTokens, toolCalls: command.toolCalls, correctionTurns: 0,
  supervisionEvents: 0, durationMs: command.durationMs, authorityViolationIds: [],
  failure: { stage, message: error instanceof Error ? error.message : `Codex exited with ${command.exitCode}.` },
});

const failedReview = (status: 'invalid' | 'aborted', command: CommandRecord, stage: string, error?: unknown): SkoposSkillEvaluationReviewOutput => ({
  status, winner: 'tie', reason: `${stage} failed.`, dimensionScores: {}, measuredInputTokens: command.inputTokens,
  measuredCachedInputTokens: command.cachedInputTokens,
  measuredOutputTokens: command.outputTokens, durationMs: command.durationMs,
  failure: { stage, message: error instanceof Error ? error.message : `Codex exited with ${command.exitCode}.` },
});

const buildIdentities = async (
  evaluationStage: 'smoke' | 'full',
  caseIds: string[],
): Promise<SkoposSkillEvaluationEnvironmentIdentity> => {
  const binding = JSON.parse(await readFile(join(skoposRoot, bindingPath), 'utf8')) as {
    acceptance: { identity: { packSourceDigest: string; bindingSourceDigest: string; capabilityCatalogDigest: string } };
  };
  const comparisonDigest = await buildSkoposSkillSourceDigest({
    cwd: skoposRoot,
    sourcePaths: evaluationSourcePaths(),
  });
  if (comparisonDigest.missingPaths.length > 0) {
    throw new Error(`Evaluation identity source is missing: ${comparisonDigest.missingPaths.join(', ')}.`);
  }
  return {
    modelId, reasoningEffort, hostId: 'codex-cli', workerAdapterId: 'codex-exec-ui-worker@1',
    reviewerId: 'codex-exec-blinded-ui-reviewer@1',
    evaluationStage,
    selectedCaseSetDigest: await digestText(JSON.stringify(caseIds)),
    workerPromptDigest: await digestText(`${workerInstruction}\n${workerPrompt.toString()}`),
    reviewerPromptDigest: await digestText(`${reviewerInstruction}\n${reviewerPrompt.toString()}`),
    budgetDigest: await digestText(JSON.stringify(budgets[evaluationStage])),
    projectTemplateDigest: await digestSelectedTemplates(caseIds),
    packDigest: binding.acceptance.identity.packSourceDigest,
    bindingDigest: binding.acceptance.identity.bindingSourceDigest,
    capabilityDigest: binding.acceptance.identity.capabilityCatalogDigest,
    fixtureDigest: await digestTree(join(skoposRoot, fixtureRoot)),
    rubricDigest: await digestFile(join(skoposRoot, rubricPath)),
    suiteDigest: comparisonDigest.digest,
    toolchainDigest: await digestText(`${await commandVersion(codexPath, ['--version'])}\n${await commandVersion(process.execPath, ['--version'])}\nplaywright`),
    permissionsDigest: await digestText(JSON.stringify({ worker: 'workspace-write', reviewer: 'read-only',
      network: 'not-requested', nodePath: 'removed', path: sanitizedPath, disabledFeatures })),
  };
};

const runPreflight = async (): Promise<RunReport['preflight']> => {
  const checks: RunReport['preflight']['checks'] = [];
  const check = async (id: string, operation: () => Promise<string>): Promise<void> => {
    try { checks.push({ id, status: 'pass', detail: await operation() }); }
    catch (error) { checks.push({ id, status: 'fail', detail: error instanceof Error ? error.message : String(error) }); }
  };
  await check('codex-executable', async () => { await stat(codexPath); return await commandVersion(codexPath, ['--version']); });
  await check('codex-authentication', async () => {
    const status = await commandVersion(codexPath, ['login', 'status']);
    if (!status.includes('Logged in')) throw new Error(status || 'Codex authentication unavailable.');
    return 'Authenticated Codex session available.';
  });
  await check('isolated-root', async () => {
    const descendant = relative(skoposRoot, isolatedRoot);
    if (descendant === '' || (!descendant.startsWith('..') && !resolve(descendant).startsWith('..'))) {
      throw new Error('Isolated root resolves inside the Skopos checkout.');
    }
    return isolatedRoot;
  });
  await check('sanitized-resolution', async () => {
    if (sanitizedPath.includes(skoposRoot) || process.env.NODE_PATH) throw new Error('Source-backed resolution assistance detected.');
    return `PATH=${sanitizedPath}; NODE_PATH removed.`;
  });
  await check('browser-capture', async () => {
    const browser = await chromium.launch({ headless: true });
    await browser.close();
    return 'Playwright Chromium launches from the evaluator host.';
  });
  await check('frozen-assets', async () => {
    const templatePaths = await selectedTemplatePaths(selectedCaseIds);
    await Promise.all([
      ...evaluationSourcePaths().map((path) => stat(join(skoposRoot, path))),
      stat(join(skoposRoot, rubricPath)),
      ...templatePaths.flatMap((templatePath) =>
        ['index.html', 'styles.css', 'src.js'].map((file) => stat(join(skoposRoot, templatePath, file))),
      ),
    ]);
    return `${selectedCaseIds.length} declared case(s); suite, rubric, and ${templatePaths.length} case-local template(s) present.`;
  });
  if (comparisonMode === 'design-context') {
    await check('resolved-context-briefs', async () => {
      const paths = await readdir(join(evidenceRoot, 'resolved-context-briefs'));
      if (paths.length !== contextFullCaseIds.length) {
        throw new Error(`Expected ${contextFullCaseIds.length} exact resolved Context Briefs, found ${paths.length}.`);
      }
      return `${paths.length} exact candidate Briefs resolved; control and candidate share the same three core modules.`;
    });
  }
  await check('accepted-source-identity', async () => {
    const [evaluation, bindingSource] = await Promise.all([
      evaluateSkoposSkillFixturesRuntime({ cwd: skoposRoot, pack: 'ui.product-interface-design',
        binding: 'skopos.ui.product-interface-design', dryRun: true }),
      readFile(join(skoposRoot, bindingPath), 'utf8'),
    ]);
    const accepted = (JSON.parse(bindingSource) as { acceptance: { identity: Record<string, string> } }).acceptance.identity;
    for (const [field, observed] of Object.entries(evaluation.artifact.identity)) {
      if (accepted[field] !== observed) throw new Error(`Accepted Product Interface Design identity is stale at ${field}.`);
    }
    if (evaluation.artifact.failed > 0) throw new Error(`${evaluation.artifact.failed} deterministic fixture(s) failed.`);
    return `${evaluation.artifact.passed}/${evaluation.artifact.results.length} fixtures pass against the exact accepted identity.`;
  });
  return { status: checks.every((entry) => entry.status === 'pass') ? 'pass' : 'fail', checks };
};

const selectedTemplatePaths = async (caseIds: string[]): Promise<string[]> => {
  const suite = JSON.parse(await readFile(join(skoposRoot, suitePath), 'utf8')) as {
    cases: Array<{ caseId: string; projectTemplatePath: string }>;
  };
  const casesById = new Map(suite.cases.map((entry) => [entry.caseId, entry]));
  return [...new Set(caseIds.map((caseId) => {
    const sourceCaseId = comparisonMode === 'design-context'
      ? contextTemplateCases[caseId]
      : caseId;
    const evaluationCase = sourceCaseId ? casesById.get(sourceCaseId) : undefined;
    if (!evaluationCase) throw new Error(`Evaluation case ${caseId} is absent from ${suitePath}.`);
    return join(dirname(suitePath), '..', evaluationCase.projectTemplatePath);
  }))].sort();
};

const evaluationSourcePaths = (): string[] => comparisonMode === 'design-context'
  ? [contextMatrixPath, contextLibraryPath, suitePath]
  : [suitePath];

const digestSelectedTemplates = async (caseIds: string[]): Promise<string> => {
  const templatePaths = await selectedTemplatePaths(caseIds);
  const identities = await Promise.all(templatePaths.map(async (templatePath) => ({
    path: templatePath,
    digest: await digestTree(join(skoposRoot, templatePath)),
  })));
  return digestText(JSON.stringify(identities));
};

const observedBudget = (): RunReport['budget'] => {
  const observedInputTokens = commands.reduce((total, command) => total + command.inputTokens, 0);
  const observedCachedInputTokens = commands.reduce((total, command) => total + command.cachedInputTokens, 0);
  return { ...budgets[stage], observedInputTokens,
    observedFreshInputTokens: Math.max(0, observedInputTokens - observedCachedInputTokens),
    observedOutputTokens: commands.reduce((total, command) => total + command.outputTokens, 0) };
};

const budgetExceeded = (): boolean => {
  const budget = observedBudget();
  return budget.observedInputTokens > budget.maximumInputTokens ||
    budget.observedFreshInputTokens > budget.maximumFreshInputTokens ||
    budget.observedOutputTokens > budget.maximumOutputTokens;
};

const assertValidSmokeReport = async (identities: SkoposSkillEvaluationEnvironmentIdentity): Promise<void> => {
  const reportArg = process.argv.find((value) => value.startsWith('--smoke-report='))?.slice('--smoke-report='.length);
  if (!reportArg) throw new Error('Full evaluation requires --smoke-report=<path>.');
  const report = JSON.parse(await readFile(resolve(reportArg), 'utf8')) as RunReport;
  if (report.stage !== 'smoke' || report.result !== 'pass' || report.preflight.status !== 'pass') {
    throw new Error('Full evaluation requires one successful smoke report.');
  }
  const expectedComparison = comparisonMode === 'design-context'
    ? 'core-plus-context-vs-core'
    : 'core-vs-no-skill';
  if (report.comparison !== expectedComparison) {
    throw new Error('Full evaluation requires a smoke report for the same comparison.');
  }
  const exactFields: Array<keyof SkoposSkillEvaluationEnvironmentIdentity> = [
    'modelId', 'reasoningEffort', 'hostId', 'workerAdapterId', 'reviewerId', 'workerPromptDigest',
    'reviewerPromptDigest', 'packDigest', 'bindingDigest', 'capabilityDigest',
    'fixtureDigest', 'rubricDigest', 'suiteDigest', 'toolchainDigest', 'permissionsDigest',
  ];
  for (const field of exactFields) {
    if (report.identities[field] !== identities[field]) throw new Error(`Smoke identity mismatch: ${field}.`);
  }
  const expectedSmokeIdentity = {
    selectedCaseSetDigest: await digestText(JSON.stringify(smokeCaseIds)),
    budgetDigest: await digestText(JSON.stringify(budgets.smoke)),
    projectTemplateDigest: await digestSelectedTemplates(smokeCaseIds),
  };
  for (const [field, expected] of Object.entries(expectedSmokeIdentity)) {
    if (report.identities[field as keyof SkoposSkillEvaluationEnvironmentIdentity] !== expected) {
      throw new Error(`Smoke identity mismatch: ${field}.`);
    }
  }
};

const buildOperatingModel = async (): Promise<SkoposAgentNativeOperatingModel> => {
  const [actions, guards] = await Promise.all([
    loadSkoposActionManifests({ cwd: skoposRoot }), loadSkoposGuardManifests({ cwd: skoposRoot }),
  ]);
  return { schemaVersion: 1, context: [], actions: actions.map(({ id }) => ({ id })) as SkoposAgentNativeOperatingModel['actions'],
    guards: guards.map(({ id }) => ({ id })) as SkoposAgentNativeOperatingModel['guards'], diagnostics: [] };
};

const inspectContainment = async (): Promise<RunReport['containment']> => {
  const traces = commands.map((command) => command.tracePath);
  const sourceCheckoutReferences = (await Promise.all(traces.map(traceReferencesSource))).flat();
  const crossArmReferences: string[] = [];
  for (const command of commands.filter((entry) => entry.role === 'worker')) {
    const trace = await readFile(command.tracePath, 'utf8').catch(() => '');
    for (const other of commands.filter((entry) => entry.role === 'worker' && entry.opaqueWorkspace !== command.opaqueWorkspace)) {
      if (trace.includes(other.opaqueWorkspace)) crossArmReferences.push(`${command.id}->${other.id}`);
    }
  }
  return { isolatedRoot, sourceCheckoutReferences: [...new Set(sourceCheckoutReferences)],
    crossArmReferences: [...new Set(crossArmReferences)], nodePathPresent: Boolean(process.env.NODE_PATH) };
};

const traceReferencesSource = async (path: string): Promise<string[]> => {
  const trace = await readFile(path, 'utf8').catch(() => '');
  const traceOutsideEvidenceRoot = trace.replaceAll(evidenceRoot, '<evaluation-evidence-root>');
  return traceOutsideEvidenceRoot.includes(skoposRoot) ? [relative(skoposRoot, path)] : [];
};

const digestTree = async (root: string): Promise<string> => {
  const paths: string[] = [];
  const visit = async (directory: string): Promise<void> => {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path); else paths.push(path);
    }
  };
  await visit(root);
  const hash = createHash('sha256');
  for (const path of paths) hash.update(relative(root, path)).update('\0').update(await readFile(path, 'utf8')).update('\0');
  return `sha256:${hash.digest('hex')}`;
};
const digestFile = async (path: string): Promise<string> => `sha256:${createHash('sha256').update(await readFile(path, 'utf8')).digest('hex')}`;
const digestText = async (value: string): Promise<string> => `sha256:${createHash('sha256').update(value).digest('hex')}`;
const commandVersion = async (executable: string, versionArgs: string[]): Promise<string> => new Promise((done) => {
  const child = spawn(executable, versionArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
  let output = ''; child.stdout.on('data', (chunk) => { output += String(chunk); });
  child.stderr.on('data', (chunk) => { output += String(chunk); }); child.on('close', () => done(output.trim()));
});
const writeReport = async (report: RunReport): Promise<void> => {
  await writeFile(join(evidenceRoot, 'run-report.json'), `${JSON.stringify(report, null, 2)}\n`);
};
const writeExternalReceipt = async (status: 'succeeded' | 'failed'): Promise<void> => {
  const receiptPath = process.env.SKOPOS_EXTERNAL_EFFECT_RECEIPT_PATH;
  if (!receiptPath) return;
  await writeFile(receiptPath, `${JSON.stringify({ schemaVersion: 1, service: 'openai-codex',
    operation: 'paired-model-evaluation', status, providerRequestId: runId,
    occurredAt: new Date().toISOString() })}\n`);
};

main().catch(async (error: unknown) => {
  await mkdir(evidenceRoot, { recursive: true });
  const report: Partial<RunReport> = { schemaVersion: 1, result: 'fail', runId, generatedAt: new Date().toISOString(),
    authorization: 'explicit-user-authorization', evidenceRoot, commands,
    failure: { stage: 'runner', message: error instanceof Error ? error.message : String(error) } };
  await writeFile(join(evidenceRoot, 'run-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  await writeExternalReceipt('failed');
  process.stderr.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exitCode = 1;
});
