import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, readFile, realpath } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import { buildSkoposSkillSourceDigest } from '@skopos/indexer';
import type {
  SkoposContextEntry,
  SkoposSkillEvaluationArtifact,
  SkoposSkillEvaluationEnvironmentIdentity,
  SkoposSkillEvaluationReviewInput,
  SkoposSkillEvaluationReviewOutput,
  SkoposSkillEvaluationWorkerInput,
  SkoposSkillEvaluationWorkerOutput,
} from '@skopos/model';

import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import { buildSkoposSkillAcceptanceIdentityRuntime } from './skill-identity.service.js';
import {
  listSkoposProjectSkillBindingsRuntime,
  showSkoposSkillPackRuntime,
} from './skills.service.js';

export interface SkoposSkillEvaluationWorker {
  execute(
    input: SkoposSkillEvaluationWorkerInput,
  ): Promise<SkoposSkillEvaluationWorkerOutput>;
}

export interface SkoposSkillEvaluationReviewer {
  review(
    input: SkoposSkillEvaluationReviewInput,
  ): Promise<SkoposSkillEvaluationReviewOutput>;
}

export const runSkoposSkillPairedEvaluationRuntime = async ({
  cwd,
  pack: packId,
  binding: bindingId,
  suite: suiteId,
  runId = createRunId(),
  evaluationRoot,
  artifactBaseRoot,
  worker,
  reviewer,
  operatingModel,
  environment,
  caseIds,
  dryRun = false,
}: {
  cwd: string;
  pack: string;
  binding: string;
  suite: string;
  runId?: string;
  evaluationRoot?: string;
  artifactBaseRoot?: string;
  worker: SkoposSkillEvaluationWorker;
  reviewer: SkoposSkillEvaluationReviewer;
  operatingModel: Parameters<typeof buildSkoposSkillAcceptanceIdentityRuntime>[0]['operatingModel'];
  environment: SkoposSkillEvaluationEnvironmentIdentity;
  caseIds?: string[];
  dryRun?: boolean;
}): Promise<{
  artifact: SkoposSkillEvaluationArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
}> => {
  assertSafeId(runId, 'evaluation run');
  const workspaceRoot = resolve(cwd);
  const [pack, bindings] = await Promise.all([
    showSkoposSkillPackRuntime({ cwd: workspaceRoot, pack: packId }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
  ]);
  const trackedBinding = bindings.find(
    (candidate) =>
      candidate.bindingId === bindingId || candidate.sourcePath === bindingId,
  );
  if (!trackedBinding) throw new Error(`Unknown project skill binding: ${bindingId}`);
  const suite = pack.evaluationSuites.find(
    (candidate) => candidate.suiteId === suiteId || candidate.sourcePath === suiteId,
  );
  if (!suite) throw new Error(`Unknown Skill evaluation suite: ${suiteId}`);
  const { acceptance: _acceptance, ...bindingDeclaration } = trackedBinding;
  const binding = { ...bindingDeclaration, lifecycle: 'accepted' as const };
  const acceptanceIdentity = await buildSkoposSkillAcceptanceIdentityRuntime({
    workspaceRoot,
    pack,
    binding,
    operatingModel,
  });
  const suiteDigest = await buildSkoposSkillSourceDigest({
    cwd: workspaceRoot,
    sourcePaths: [suite.sourcePath],
  });
  if (suiteDigest.missingPaths.length > 0) {
    throw new Error(
      `Skill evaluation suite source is missing: ${suiteDigest.missingPaths.join(', ')}.`,
    );
  }
  const runRoot = resolve(
    evaluationRoot ?? join(workspaceRoot, '.skopos/evaluations', runId),
  );
  await mkdir(runRoot, { recursive: true });
  const packDirectory = dirname(resolve(workspaceRoot, pack.sourcePath));
  const results = [];

  const selectedCases = caseIds
    ? caseIds.map((caseId) => {
        const evaluationCase = suite.cases.find((candidate) => candidate.caseId === caseId);
        if (!evaluationCase) throw new Error(`Unknown Skill evaluation case: ${caseId}`);
        return evaluationCase;
      })
    : suite.cases;
  if (selectedCases.length === 0) throw new Error('Skill evaluation requires at least one case.');

  for (const evaluationCase of selectedCases) {
    const candidateContext = await Promise.all(
      evaluationCase.candidateModuleIds.map(async (moduleId) => {
        const module = pack.modules.find((candidate) => candidate.id === moduleId);
        if (!module) throw new Error(`Unknown candidate module ${moduleId}.`);
        return {
          id: `skill:${pack.packId}:${module.id}`,
          kind: 'skill' as const,
          title: module.title,
          summary: (await readFile(join(packDirectory, module.path), 'utf8')).trim(),
          importance: module.importance,
          appliesTo: [...module.applicability.scopeKinds, ...module.applicability.capabilities],
          provenance: [],
        } satisfies SkoposContextEntry;
      }),
    );
    const arms = await Promise.all(
      (['control', 'candidate'] as const).map(async (arm) => {
        const opaqueArmId = digest(`${runId}:${evaluationCase.caseId}:${arm}`).slice(0, 12);
        const armRoot = join(runRoot, evaluationCase.caseId, opaqueArmId);
        await mkdir(dirname(armRoot), { recursive: true });
        await cp(
          join(packDirectory, evaluationCase.projectTemplatePath),
          armRoot,
          { recursive: true, errorOnExist: true },
        );
        const output = await worker.execute({
          caseId: evaluationCase.caseId,
          taskPrompt: evaluationCase.taskPrompt,
          workspaceRoot: armRoot,
          additionalContext: arm === 'candidate' ? candidateContext : [],
        });
        const realArmRoot = await realpath(armRoot);
        for (const artifactPath of output.artifactPaths) {
          const artifactStat = await lstat(artifactPath);
          if (artifactStat.isSymbolicLink()) {
            throw new Error(`Worker artifact for ${evaluationCase.caseId} must not be a symbolic link: ${artifactPath}`);
          }
          const relativeArtifactPath = relative(realArmRoot, await realpath(artifactPath));
          if (
            relativeArtifactPath === '..' ||
            relativeArtifactPath.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`)
          ) {
            throw new Error(
              `Worker artifact for ${evaluationCase.caseId} escapes its isolated arm workspace: ${artifactPath}`,
            );
          }
        }
        return { arm, opaqueArmId, armRoot, output };
      }),
    );
    const candidateFirst = digest(`${runId}:${evaluationCase.caseId}:review`).charCodeAt(0) % 2 === 0;
    const orderedArms = candidateFirst ? [arms[1]!, arms[0]!] : [arms[0]!, arms[1]!];
    const labeledArms = orderedArms.map((arm, index) => ({
      ...arm,
      label: index === 0 ? 'A' : 'B',
    }));
    const failedArm = arms.find((arm) => arm.output.status !== 'completed');
    if (failedArm) {
      const candidate = arms.find((arm) => arm.arm === 'candidate')!;
      const control = arms.find((arm) => arm.arm === 'control')!;
      results.push(buildIncompleteResult({
        caseId: evaluationCase.caseId,
        candidate: candidate.output,
        control: control.output,
        failedArm: failedArm.arm,
      }));
      continue;
    }
    const review = await reviewer.review({
      caseId: evaluationCase.caseId,
      taskPrompt: evaluationCase.taskPrompt,
      rubricDimensions: evaluationCase.rubricDimensions,
      alternatives: labeledArms.map(({ label, output }) => ({
        label,
        summary: output.summary,
        artifactPaths: output.artifactPaths,
      })),
    });
    if (review.status !== 'completed') {
      const candidate = arms.find((arm) => arm.arm === 'candidate')!;
      const control = arms.find((arm) => arm.arm === 'control')!;
      results.push(buildIncompleteResult({
        caseId: evaluationCase.caseId,
        candidate: candidate.output,
        control: control.output,
        review,
      }));
      continue;
    }
    if (review.winner !== 'tie' && !labeledArms.some((arm) => arm.label === review.winner)) {
      throw new Error(
        `Reviewer returned unknown label ${review.winner} for ${evaluationCase.caseId}.`,
      );
    }
    for (const dimension of evaluationCase.rubricDimensions) {
      const scores = review.dimensionScores[dimension];
      for (const { label } of labeledArms) {
        const score = scores?.[label];
        if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 3) {
          throw new Error(
            `Reviewer omitted numeric score ${dimension}/${label} for ${evaluationCase.caseId}.`,
          );
        }
      }
    }
    const candidate = arms.find((arm) => arm.arm === 'candidate')!;
    const control = arms.find((arm) => arm.arm === 'control')!;
    const candidateLabel = labeledArms.find((arm) => arm.arm === 'candidate')!.label;
    const controlLabel = labeledArms.find((arm) => arm.arm === 'control')!.label;
    results.push({
      caseId: evaluationCase.caseId,
      outcome:
        review.winner === 'tie'
          ? 'tie' as const
          : review.winner === candidateLabel
            ? 'candidate-win' as const
            : 'control-win' as const,
      reviewReason: review.reason,
      blindedLabelMapping: { candidate: candidateLabel, control: controlLabel },
      candidateInputTokens: candidate.output.measuredInputTokens,
      candidateCachedInputTokens: candidate.output.measuredCachedInputTokens,
      candidateOutputTokens: candidate.output.measuredOutputTokens,
      controlInputTokens: control.output.measuredInputTokens,
      controlCachedInputTokens: control.output.measuredCachedInputTokens,
      controlOutputTokens: control.output.measuredOutputTokens,
      reviewerInputTokens: review.measuredInputTokens,
      reviewerCachedInputTokens: review.measuredCachedInputTokens,
      reviewerOutputTokens: review.measuredOutputTokens,
      candidateToolCalls: candidate.output.toolCalls,
      controlToolCalls: control.output.toolCalls,
      candidateCorrectionTurns: candidate.output.correctionTurns,
      controlCorrectionTurns: control.output.correctionTurns,
      candidateSupervisionEvents: candidate.output.supervisionEvents,
      controlSupervisionEvents: control.output.supervisionEvents,
      candidateDurationMs: candidate.output.durationMs,
      controlDurationMs: control.output.durationMs,
      reviewerDurationMs: review.durationMs,
      candidateAuthorityViolationIds: candidate.output.authorityViolationIds,
      controlAuthorityViolationIds: control.output.authorityViolationIds,
      dimensionScores: Object.fromEntries(
        evaluationCase.rubricDimensions.map((dimension) => [
          dimension,
          {
            candidate: review.dimensionScores[dimension]?.[candidateLabel] ?? 0,
            control: review.dimensionScores[dimension]?.[controlLabel] ?? 0,
          },
        ]),
      ),
    });
  }

  const generatedAt = new Date().toISOString();
  const artifact: SkoposSkillEvaluationArtifact = {
    schemaVersion: 1,
    id: `skill-paired-evaluation.${pack.packId}.${runId}`,
    type: 'skill-paired-evaluation',
    status: 'generated',
    authority: 'generated',
    summary: `${results.filter((result) => result.outcome === 'candidate-win').length} candidate wins, ${results.filter((result) => result.outcome === 'control-win').length} control wins, ${results.filter((result) => result.outcome === 'tie').length} ties, ${results.filter((result) => result.outcome === 'invalid').length} invalid, and ${results.filter((result) => result.outcome === 'aborted').length} aborted.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    packId: pack.packId,
    packVersion: pack.version,
    bindingId: binding.bindingId,
    suiteId: suite.suiteId,
    runId,
    identity: { ...acceptanceIdentity, suiteSourceDigest: suiteDigest.digest },
    environment,
    environmentDigest: digest(stableSerialize(environment)),
    candidateWins: results.filter((result) => result.outcome === 'candidate-win').length,
    controlWins: results.filter((result) => result.outcome === 'control-win').length,
    ties: results.filter((result) => result.outcome === 'tie').length,
    invalidCases: results.filter((result) => result.outcome === 'invalid').length,
    abortedCases: results.filter((result) => result.outcome === 'aborted').length,
    authorityRegressions: results.filter(
      (result) =>
        result.candidateAuthorityViolationIds.length >
        result.controlAuthorityViolationIds.length,
    ).length,
    candidateInputTokens: results.reduce(
      (total, result) => total + result.candidateInputTokens,
      0,
    ),
    controlInputTokens: results.reduce(
      (total, result) => total + result.controlInputTokens,
      0,
    ),
    candidateOutputTokens: results.reduce((total, result) => total + result.candidateOutputTokens, 0),
    controlOutputTokens: results.reduce((total, result) => total + result.controlOutputTokens, 0),
    reviewerInputTokens: results.reduce((total, result) => total + result.reviewerInputTokens, 0),
    candidateCachedInputTokens: results.reduce((total, result) => total + result.candidateCachedInputTokens, 0),
    controlCachedInputTokens: results.reduce((total, result) => total + result.controlCachedInputTokens, 0),
    reviewerCachedInputTokens: results.reduce((total, result) => total + result.reviewerCachedInputTokens, 0),
    reviewerOutputTokens: results.reduce((total, result) => total + result.reviewerOutputTokens, 0),
    candidateCorrectionTurns: results.reduce((total, result) => total + result.candidateCorrectionTurns, 0),
    controlCorrectionTurns: results.reduce((total, result) => total + result.controlCorrectionTurns, 0),
    candidateSupervisionEvents: results.reduce((total, result) => total + result.candidateSupervisionEvents, 0),
    controlSupervisionEvents: results.reduce((total, result) => total + result.controlSupervisionEvents, 0),
    results,
  };
  const artifactPath = join(
    resolve(artifactBaseRoot ?? workspaceRoot),
    '.skopos/index/skills/paired-evaluations',
    pack.packId,
    `${runId}.json`,
  );
  const artifactWrite = await writeJsonArtifact({ artifactPath, artifact, dryRun });
  return { artifact, artifactPath, artifactWrite };
};

const buildIncompleteResult = ({
  caseId,
  candidate,
  control,
  failedArm,
  review,
}: {
  caseId: string;
  candidate: SkoposSkillEvaluationWorkerOutput;
  control: SkoposSkillEvaluationWorkerOutput;
  failedArm?: 'candidate' | 'control';
  review?: SkoposSkillEvaluationReviewOutput;
}) => {
  const failure = review?.failure ?? (failedArm === 'candidate' ? candidate.failure : control.failure);
  const status = review?.status ?? (failedArm === 'candidate' ? candidate.status : control.status);
  return {
    caseId,
    outcome: status === 'aborted' ? 'aborted' as const : 'invalid' as const,
    reviewReason: failure?.message ?? 'Evaluation case did not produce valid review evidence.',
    candidateInputTokens: candidate.measuredInputTokens,
    candidateCachedInputTokens: candidate.measuredCachedInputTokens,
    candidateOutputTokens: candidate.measuredOutputTokens,
    controlInputTokens: control.measuredInputTokens,
    controlCachedInputTokens: control.measuredCachedInputTokens,
    controlOutputTokens: control.measuredOutputTokens,
    reviewerInputTokens: review?.measuredInputTokens ?? 0,
    reviewerCachedInputTokens: review?.measuredCachedInputTokens ?? 0,
    reviewerOutputTokens: review?.measuredOutputTokens ?? 0,
    candidateToolCalls: candidate.toolCalls,
    controlToolCalls: control.toolCalls,
    candidateCorrectionTurns: candidate.correctionTurns,
    controlCorrectionTurns: control.correctionTurns,
    candidateSupervisionEvents: candidate.supervisionEvents,
    controlSupervisionEvents: control.supervisionEvents,
    candidateDurationMs: candidate.durationMs,
    controlDurationMs: control.durationMs,
    reviewerDurationMs: review?.durationMs ?? 0,
    candidateAuthorityViolationIds: candidate.authorityViolationIds,
    controlAuthorityViolationIds: control.authorityViolationIds,
    failure: {
      stage: failure?.stage ?? (review ? 'reviewer' : 'worker'),
      arm: review ? 'reviewer' as const : failedArm,
      message: failure?.message ?? 'Unknown evaluation failure.',
    },
    dimensionScores: {},
  };
};

const createRunId = (): string =>
  `${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}-${digest(String(Math.random())).slice(0, 8)}`;

const assertSafeId = (value: string, label: string): void => {
  if (!/^[A-Za-z0-9._-]+$/.test(value)) throw new Error(`Invalid ${label} id: ${value}`);
};

const digest = (value: string): string =>
  createHash('sha256').update(value).digest('hex');

const stableSerialize = (value: unknown): string => JSON.stringify(sortValue(value));

const sortValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortValue(entry)]),
  );
};
