import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
  loadSkoposSkillPacks,
} from '../../../indexer/src/index.js';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposSkillEvaluationReviewInput,
  SkoposSkillEvaluationWorkerInput,
} from '../../../model/src/index.js';
import { runSkoposSkillPairedEvaluationRuntime } from '../../../runtime/src/index.js';
import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));

describe('paired Skill evaluation', () => {
  it('loads one strict versioned Product Interface Design evaluation suite', async () => {
    const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const pack = packs.find((candidate) => candidate.packId === 'ui.product-interface-design');

    expect(pack?.evaluationSuiteIds).toEqual(['ui-product-interface-design-core']);
    expect(pack?.evaluationSuites).toHaveLength(1);
    expect(pack?.evaluationSuites[0]).toMatchObject({
      suiteId: 'ui-product-interface-design-core',
      packId: 'ui.product-interface-design',
    });
    expect(pack?.evaluationSuites[0]?.cases).toHaveLength(8);
    const suite = pack?.evaluationSuites[0];
    const expectedCaseIds = [
      'operations-workbench', 'transaction-trust', 'discovery-coordination', 'documentation-workspace',
      'responsive-transformation', 'failure-recovery', 'product-character', 'complete-service-flow',
    ];
    expect(suite?.cases.map((evaluationCase) => evaluationCase.caseId)).toEqual(expectedCaseIds);
    expect(new Set(suite?.cases.map((evaluationCase) => evaluationCase.projectTemplatePath)).size).toBe(8);
    expect(suite?.cases.find((evaluationCase) => evaluationCase.caseId === 'operations-workbench')).toMatchObject({
      candidateModuleIds: [
        'interface-design.structure',
        'interface-design.finish',
      ],
      rubricDimensions: [
        'task-archetype and reference fit',
        'visual quietness and attention economy',
        'background, layer, and contrast architecture',
        'state and recovery completeness',
      ],
    });

    const rubric = JSON.parse(await readFile(join(
      skoposRoot,
      'skill-packs/ui/product-interface-design/rubrics/product-interface-review.json',
    ), 'utf8')) as { dimensions: string[] };
    for (const evaluationCase of suite?.cases ?? []) {
      expect(evaluationCase.rubricDimensions).toHaveLength(4);
      expect(evaluationCase.rubricDimensions.every((dimension) => rubric.dimensions.includes(dimension))).toBe(true);
      const templateRoot = join(
        skoposRoot,
        'skill-packs/ui/product-interface-design',
        evaluationCase.projectTemplatePath,
      );
      await Promise.all(['index.html', 'styles.css', 'src.js'].map((file) => stat(join(templateRoot, file))));
    }
  });

  it('isolates paired arms and blinds the reviewer to arm identity and guidance', async () => {
    const evaluationRoot = await mkdtemp(join(tmpdir(), 'skopos-paired-skill-'));
    const workerInputs: SkoposSkillEvaluationWorkerInput[] = [];
    const reviewInputs: SkoposSkillEvaluationReviewInput[] = [];

    try {
      const result = await runSkoposSkillPairedEvaluationRuntime({
        cwd: skoposRoot,
        pack: 'ui.product-interface-design',
        binding: 'skopos.ui.product-interface-design',
        suite: 'ui-product-interface-design-core',
        runId: 'paired-evaluation-fixture',
        evaluationRoot,
        operatingModel: await buildOperatingModel(),
        environment: {
          modelId: 'fixture-model',
          reasoningEffort: 'fixed',
          hostId: 'vitest',
          workerAdapterId: 'fixture-worker@1',
          reviewerId: 'fixture-reviewer@1',
          evaluationStage: 'full',
          selectedCaseSetDigest: 'sha256:fixture-cases',
          workerPromptDigest: 'sha256:fixture-worker-prompt',
          reviewerPromptDigest: 'sha256:fixture-reviewer-prompt',
          budgetDigest: 'sha256:fixture-budget',
          projectTemplateDigest: 'sha256:fixture-template',
          packDigest: 'sha256:fixture-pack',
          bindingDigest: 'sha256:fixture-binding',
          capabilityDigest: 'sha256:fixture-capability',
          fixtureDigest: 'sha256:fixture-fixtures',
          rubricDigest: 'sha256:fixture-rubric',
          suiteDigest: 'sha256:fixture-suite',
          toolchainDigest: 'sha256:fixture-toolchain',
          permissionsDigest: 'sha256:fixture-permissions',
        },
        dryRun: true,
        worker: {
          execute: async (input) => {
            workerInputs.push(input);
            const usedGuidance = input.additionalContext.length > 0;
            await writeFile(`${input.workspaceRoot}/result.json`, '{}\n');
            return {
              status: 'completed',
              summary: usedGuidance
                ? 'Complete, restrained interface result.'
                : 'Functional baseline result.',
              artifactPaths: [`${input.workspaceRoot}/result.json`],
              measuredInputTokens: usedGuidance ? 700 : 500,
              measuredCachedInputTokens: usedGuidance ? 500 : 300,
              measuredOutputTokens: 300,
              toolCalls: 2,
              correctionTurns: 0,
              supervisionEvents: 0,
              durationMs: 100,
              authorityViolationIds: [],
            };
          },
        },
        reviewer: {
          review: async (input) => {
            reviewInputs.push(input);
            const winner = input.alternatives.find((alternative) =>
              alternative.summary.startsWith('Complete'),
            )?.label;
            if (!winner) throw new Error('Expected one stronger rendered alternative.');
            return {
              status: 'completed',
              winner,
              reason: 'The winning alternative is clearer and more complete.',
              dimensionScores: Object.fromEntries(
                input.rubricDimensions.map((dimension) => [
                  dimension,
                  Object.fromEntries(
                    input.alternatives.map((alternative) => [
                      alternative.label,
                      alternative.label === winner ? 3 : 2,
                    ]),
                  ),
                ]),
              ),
              measuredInputTokens: 200,
              measuredCachedInputTokens: 100,
              measuredOutputTokens: 100,
              durationMs: 50,
            };
          },
        },
      });

      expect(result.artifact).toMatchObject({
        type: 'skill-paired-evaluation',
        authority: 'generated',
        suiteId: 'ui-product-interface-design-core',
        candidateWins: 8,
        controlWins: 0,
        ties: 0,
        invalidCases: 0,
        abortedCases: 0,
        authorityRegressions: 0,
        candidateInputTokens: 5600,
        controlInputTokens: 4000,
        identity: {
          packSourceDigest: expect.stringMatching(/^sha256:/),
          suiteSourceDigest: expect.stringMatching(/^sha256:/),
        },
        environment: {
          modelId: 'fixture-model',
          workerAdapterId: 'fixture-worker@1',
          reviewerId: 'fixture-reviewer@1',
        },
        environmentDigest: expect.stringMatching(/^[a-f0-9]{64}$/),
      });
      expect(workerInputs).toHaveLength(16);
      expect(new Set(workerInputs.map((input) => input.workspaceRoot)).size).toBe(16);
      expect(
        workerInputs.every(
          (input) =>
            !input.workspaceRoot.includes('candidate') &&
            !input.workspaceRoot.includes('control'),
        ),
      ).toBe(true);
      expect(
        workerInputs.filter((input) => input.additionalContext.length > 0),
      ).toHaveLength(8);
      expect(reviewInputs).toHaveLength(8);
      expect(
        reviewInputs.every(
          (input) =>
            !('additionalContext' in input) &&
            input.alternatives.every(
              (alternative) =>
                !('arm' in alternative) && !('bindingId' in alternative),
            ),
        ),
      ).toBe(true);
      expect(
        new Set(reviewInputs.flatMap((input) => input.alternatives.map(({ label }) => label))),
      ).toEqual(new Set(['A', 'B']));
    } finally {
      await rm(evaluationRoot, { recursive: true, force: true });
    }
  });

  it('runs a one-case smoke stage and retains an aborted arm as partial evidence', async () => {
    const evaluationRoot = await mkdtemp(join(tmpdir(), 'skopos-paired-smoke-'));
    let reviewerCalls = 0;
    try {
      const result = await runSkoposSkillPairedEvaluationRuntime({
        cwd: skoposRoot,
        pack: 'ui.product-interface-design',
        binding: 'skopos.ui.product-interface-design',
        suite: 'ui-product-interface-design-core',
        caseIds: ['operations-workbench'],
        runId: 'paired-evaluation-smoke-fixture',
        evaluationRoot,
        operatingModel: await buildOperatingModel(),
        environment: {
          modelId: 'fixture-model', reasoningEffort: 'fixed', hostId: 'vitest',
          workerAdapterId: 'fixture-worker@1', reviewerId: 'fixture-reviewer@1',
          evaluationStage: 'smoke', selectedCaseSetDigest: 'sha256:fixture-smoke-cases',
          workerPromptDigest: 'sha256:fixture-worker-prompt', reviewerPromptDigest: 'sha256:fixture-reviewer-prompt',
          budgetDigest: 'sha256:fixture-budget', projectTemplateDigest: 'sha256:fixture-template',
          packDigest: 'sha256:fixture-pack', bindingDigest: 'sha256:fixture-binding',
          capabilityDigest: 'sha256:fixture-capability', fixtureDigest: 'sha256:fixture-fixtures',
          rubricDigest: 'sha256:fixture-rubric', suiteDigest: 'sha256:fixture-suite',
          toolchainDigest: 'sha256:fixture-toolchain', permissionsDigest: 'sha256:fixture-permissions',
        },
        dryRun: true,
        worker: {
          execute: async (input) => {
            if (input.additionalContext.length > 0) return {
              status: 'aborted' as const, summary: 'Fixture adapter unavailable.', artifactPaths: [],
              measuredInputTokens: 80, measuredCachedInputTokens: 40, measuredOutputTokens: 10,
              toolCalls: 0, correctionTurns: 0, supervisionEvents: 0, durationMs: 5,
              authorityViolationIds: [], failure: { stage: 'fixture-adapter', message: 'Unavailable.' },
            };
            const artifactPath = `${input.workspaceRoot}/result.json`;
            await writeFile(artifactPath, '{}\n');
            return { status: 'completed' as const, summary: 'Control complete.', artifactPaths: [artifactPath],
              measuredInputTokens: 100, measuredCachedInputTokens: 60, measuredOutputTokens: 20,
              toolCalls: 1, correctionTurns: 0, supervisionEvents: 0, durationMs: 10,
              authorityViolationIds: [] };
          },
        },
        reviewer: {
          review: async () => {
            reviewerCalls += 1;
            throw new Error('Reviewer must not run when an arm is incomplete.');
          },
        },
      });
      expect(result.artifact).toMatchObject({ candidateWins: 0, controlWins: 0, ties: 0,
        invalidCases: 0, abortedCases: 1, candidateInputTokens: 80, candidateCachedInputTokens: 40,
        controlInputTokens: 100, controlCachedInputTokens: 60 });
      expect(result.artifact.results).toHaveLength(1);
      expect(result.artifact.results[0]).toMatchObject({ caseId: 'operations-workbench', outcome: 'aborted',
        failure: { stage: 'fixture-adapter', arm: 'candidate' } });
      expect(reviewerCalls).toBe(0);
    } finally {
      await rm(evaluationRoot, { recursive: true, force: true });
    }
  });
});

const buildOperatingModel = async (): Promise<SkoposAgentNativeOperatingModel> => {
  const [actions, guards] = await Promise.all([
    loadSkoposActionManifests({ cwd: skoposRoot }),
    loadSkoposGuardManifests({ cwd: skoposRoot }),
  ]);
  return {
    schemaVersion: 1,
    context: [],
    actions: actions.map((action) => ({ id: action.id })) as SkoposAgentNativeOperatingModel['actions'],
    guards: guards.map((guard) => ({ id: guard.id })) as SkoposAgentNativeOperatingModel['guards'],
    diagnostics: [],
  };
};
