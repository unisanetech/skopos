import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve } from 'node:path';

import { loadSkoposConfig, writeSkoposConfig } from '@skopos/config';
import { checkInstructionMirrorParity } from '@skopos/instructions';
import {
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
  loadSkoposScopeRegistry,
} from '@skopos/indexer';
import {
  SKOPOS_SCOPE_KINDS,
} from '@skopos/model';
import type {
  SkoposActionManifest,
  SkoposCapabilityCandidate,
  SkoposGuardManifest,
  SkoposSetupAgentPacketArtifact,
  SkoposSetupAnalysisArtifact,
  SkoposSetupCompletionReceiptArtifact,
  SkoposSetupDisposition,
  SkoposSetupDispositionKind,
  SkoposSetupDispositionRuntimeResult,
  SkoposSetupHostDeliveryReceiptArtifact,
  SkoposSetupLane,
  SkoposSetupMaterialQuestion,
  SkoposSetupRecommendation,
  SkoposSetupRuntimeResult,
  SkoposSetupStateArtifact,
  SkoposScopesLiteArtifact,
} from '@skopos/model';
import {
  captureSkoposTaskPathStates,
  digestSkoposTaskPathStates,
} from '@skopos/verification';

import { initSkoposProject } from '../init/init.service.js';
import {
  buildSkoposAdoptionAssessmentRuntime,
} from '../adoption/adoption.service.js';
import {
  applySkoposCapabilityIntegrationsRuntime,
  approveSkoposCapabilityIntegrationsRuntime,
  proposeSkoposCapabilityIntegrationsRuntime,
} from '../integrations/capability-integrations.service.js';
import {
  applySkoposPolicyPackRuntime,
  recommendSkoposPolicyPacksRuntime,
} from '../policies/policies.service.js';
import {
  applySkoposSkillPackRuntime,
  recommendSkoposSkillPacksRuntime,
} from '../skills/skills.service.js';
import { syncSkoposInstructions } from '../instructions-sync/instructions-sync.service.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { SKOPOS_RUNTIME_SETUP_CERTIFICATION_CONSTRAINT } from '../shared/setup-certification.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import { buildSkoposSessionContextRuntime } from '../session/session-context.service.js';
import { prepareSkoposPlanRuntime } from '../plan/plan.service.js';
import {
  createSkoposTaskRuntime,
  reconstructTrackedSkoposTasksRuntime,
} from '../task/task.service.js';
import {
  buildSkoposSetupAnswerRuntime,
  buildSkoposUnderstandingRuntime,
} from '../understanding/understanding.service.js';

export const SKOPOS_SETUP_STATE_PATH = '.skopos/setup/state.json';
export const SKOPOS_SETUP_AGENT_PACKET_PATH = '.skopos/setup/agent-packet.json';
export const SKOPOS_SETUP_HOST_DELIVERY_PATH = '.skopos/setup/host-delivery.json';
export const SKOPOS_SETUP_ANALYSIS_PATH = '.skopos/setup/analysis.json';
export const SKOPOS_SETUP_COMPLETION_DIRECTORY = '.skopos/setup/completions';
const MISSING_PATH_DIGEST = createHash('sha256').update('missing').digest('hex');

export interface BuildSkoposSetupRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
  initialize?: boolean;
  host?: string;
  sessionId?: string;
}

export interface RecordSkoposSetupDispositionRuntimeOptions
  extends BuildSkoposSetupRuntimeOptions {
  recommendationId: string;
  disposition: SkoposSetupDispositionKind;
  note?: string;
}

export interface ConfirmSkoposSetupHostDeliveryRuntimeOptions {
  cwd: string;
  actor: string;
  host: string;
  sessionId: string;
  communicationContractMarker: string;
  communicationContractDigest: string;
  dryRun?: boolean;
}

export interface SubmitSkoposSetupCompletionRuntimeOptions {
  cwd: string;
  inputPath: string;
  actor?: string;
  dryRun?: boolean;
}

export const submitSkoposSetupAnalysisRuntime = async ({
  cwd,
  inputPath,
  actor,
  dryRun = false,
}: {
  cwd: string;
  inputPath: string;
  actor?: string;
  dryRun?: boolean;
}): Promise<SkoposSetupRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) throw new Error('Submitting setup analysis requires an explicit actor.');
  const input = validateSetupAnalysisInput(
    await readOptionalJson<unknown>(resolve(inputPath)),
  );
  const sourcePaths = collectSetupAnalysisSourcePaths(input);
  const sourcePathStates = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: sourcePaths,
  });
  const now = new Date().toISOString();
  const artifact: SkoposSetupAnalysisArtifact = {
    ...input,
    schemaVersion: 1,
    id: 'setup-analysis',
    type: 'setup-analysis',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary: `Coding-agent setup analysis contains ${input.claims.length} claims, ${input.scopeProposals.length} Scope proposals, and ${input.documentOperations.length} document operations.`,
    workspaceRoot,
    sourceDigest: digestSkoposTaskPathStates(sourcePathStates),
    sourcePathStates,
    submittedByActorId: actorId,
  };
  await writeJsonArtifact({
    artifactPath: join(workspaceRoot, SKOPOS_SETUP_ANALYSIS_PATH),
    artifact,
    dryRun,
  });
  return buildSkoposSetupRuntime({ cwd: workspaceRoot, actor: actorId, dryRun });
};

export const submitSkoposSetupCompletionRuntime = async ({
  cwd,
  inputPath,
  actor,
  dryRun = false,
}: SubmitSkoposSetupCompletionRuntimeOptions): Promise<SkoposSetupRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireSetupActor(actor, 'Submitting setup completion Evidence');
  const input = validateSetupCompletionInput(await readOptionalJson<unknown>(resolve(inputPath)));
  const current = await buildSkoposSetupRuntime({ cwd: workspaceRoot, actor: actorId, dryRun });
  const recommendation = current.state.recommendations.find(
    (entry) => entry.id === input.recommendationId,
  );
  if (!recommendation) {
    throw new Error(`Unknown or stale setup recommendation: ${input.recommendationId}.`);
  }
  if (!['agent-memory-work', 'scope-review'].includes(recommendation.applyKind)) {
    throw new Error(`Setup recommendation ${recommendation.id} is not completed by coding-agent Evidence.`);
  }
  if (recommendation.sourceDigest !== input.recommendationSourceDigest) {
    throw new Error(`Setup completion for ${recommendation.id} is stale because its recommendation source changed.`);
  }
  const disposition = current.state.dispositions.find(
    (entry) => entry.recommendationId === recommendation.id,
  );
  if (disposition?.disposition !== 'accept') {
    throw new Error(`Setup recommendation ${recommendation.id} must be accepted before completion can be submitted.`);
  }
  const setupAnalysis = await readOptionalJson<SkoposSetupAnalysisArtifact>(
    join(workspaceRoot, SKOPOS_SETUP_ANALYSIS_PATH),
  );
  const expected = expectedAgentOwnedPostconditions(recommendation, setupAnalysis);
  if (expected.length === 0) {
    throw new Error(`Setup completion for ${recommendation.id} has no verifiable postconditions.`);
  }
  const suppliedByPath = new Map(input.sourcePathStates.map((entry) => [entry.path, entry]));
  for (const condition of expected) {
    const supplied = suppliedByPath.get(condition.path);
    if (!supplied) {
      throw new Error(`Setup completion for ${recommendation.id} must include postcondition path ${condition.path}.`);
    }
    if (condition.expectation === 'missing' && supplied.digest !== MISSING_PATH_DIGEST) {
      throw new Error(`Setup completion expected ${condition.path} to be removed.`);
    }
    if (condition.expectation === 'present' && supplied.digest === MISSING_PATH_DIGEST) {
      throw new Error(`Setup completion expected ${condition.path} to exist.`);
    }
  }
  const currentStates = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: input.sourcePathStates.map((entry) => entry.path),
  });
  const suppliedDigest = digestSkoposTaskPathStates(input.sourcePathStates);
  const currentDigest = digestSkoposTaskPathStates(currentStates);
  if (suppliedDigest !== input.sourceStateDigest || currentDigest !== input.sourceStateDigest) {
    throw new Error(`Setup completion for ${recommendation.id} does not match current project sources.`);
  }
  await assertAgentOwnedSemanticPostconditions({
    workspaceRoot,
    recommendation,
    setupAnalysis,
  });
  const now = new Date().toISOString();
  const receipt: SkoposSetupCompletionReceiptArtifact = {
    schemaVersion: 1,
    id: `setup-completion-${digest({ recommendationId: recommendation.id, currentDigest }).slice(0, 12)}`,
    type: 'setup-completion-receipt',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary: `Coding-agent setup work ${recommendation.id} was verified against current source postconditions.`,
    workspaceRoot,
    recommendationId: recommendation.id,
    recommendationSourceDigest: recommendation.sourceDigest,
    statement: input.statement,
    sourcePathStates: currentStates,
    sourceStateDigest: currentDigest,
    submittedByActorId: actorId,
    submittedAt: now,
  };
  await writeJsonArtifact({
    artifactPath: join(workspaceRoot, SKOPOS_SETUP_COMPLETION_DIRECTORY, `${safeSetupId(recommendation.id)}.json`),
    artifact: receipt,
    dryRun,
  });
  await writeJsonArtifact({
    artifactPath: current.statePath,
    artifact: {
      ...current.state,
      completedApplyIds: [...new Set([...current.state.completedApplyIds, recommendation.id])].sort(),
      updatedAt: now,
    },
    dryRun,
  });
  return buildSkoposSetupRuntime({ cwd: workspaceRoot, actor: actorId, dryRun });
};

export const buildSkoposSetupRuntime = async ({
  cwd,
  actor,
  dryRun = false,
  initialize = false,
  host,
  sessionId,
}: BuildSkoposSetupRuntimeOptions): Promise<SkoposSetupRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const hadSkoposDirectory = await lstat(join(workspaceRoot, '.skopos'))
    .then(() => true)
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return false;
      throw error;
    });
  const previewArtifactPaths = [
    '.skopos/index/bootstrap.json',
    '.skopos/index/scopes.json',
    '.skopos/index/diagnosis.json',
    '.skopos/index/architecture.json',
    '.skopos/index/enforcement.json',
  ];
  const hadSkoposIndexDirectory = await lstat(join(workspaceRoot, '.skopos/index'))
    .then(() => true)
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return false;
      throw error;
    });
  const initialPreviewArtifactContents = new Map(
    await Promise.all(previewArtifactPaths.map(async (path) => [
      path,
      await readFile(join(workspaceRoot, path), 'utf8').catch(
        (error: NodeJS.ErrnoException) => {
          if (error.code === 'ENOENT') return undefined;
          throw error;
        },
      ),
    ] as const)),
  );
  try {
    const existingConfig = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));
    const bootstrapPreview = await ensureLocalSetupBootstrap({
      workspaceRoot,
      actorId,
      dryRun,
      refresh: initialize,
    });
    if (!existingConfig && !dryRun) {
      await writeJsonArtifact({
        artifactPath: join(workspaceRoot, '.skopos/setup/bootstrap-recommendation.json'),
        artifact: bootstrapPreview.bootstrap.recommendedConfig,
        dryRun,
      });
    }

  const previous = await readOptionalJson<SkoposSetupStateArtifact>(
    join(workspaceRoot, SKOPOS_SETUP_STATE_PATH),
  );
  const storedSetupAnalysis = await readOptionalJson<SkoposSetupAnalysisArtifact>(
    join(workspaceRoot, SKOPOS_SETUP_ANALYSIS_PATH),
  );
  const setupAnalysisCurrent = storedSetupAnalysis
    ? await setupAnalysisMatchesCurrentSources(workspaceRoot, storedSetupAnalysis)
    : true;
  const setupAnalysis = setupAnalysisCurrent ? storedSetupAnalysis : undefined;
  const [understanding, adoption, capabilities, policies, skills, actions, guards, scopes] =
    await Promise.all([
      buildSkoposUnderstandingRuntime({ cwd: workspaceRoot, actor: actorId, dryRun }),
      buildSkoposAdoptionAssessmentRuntime({ cwd: workspaceRoot, actor: actorId, dryRun: true }),
      proposeSkoposCapabilityIntegrationsRuntime({ cwd: workspaceRoot, dryRun }),
      recommendSkoposPolicyPacksRuntime({ cwd: workspaceRoot, dryRun }),
      recommendSkoposSkillPacksRuntime({ cwd: workspaceRoot, dryRun }),
      loadSkoposActionManifests({ cwd: workspaceRoot }),
      loadSkoposGuardManifests({ cwd: workspaceRoot }),
      readOptionalJson<SkoposScopesLiteArtifact>(
        join(workspaceRoot, '.skopos', 'index', 'scopes.json'),
      ),
    ]);
  const config = existingConfig ?? bootstrapPreview.bootstrap.recommendedConfig;

  const instructionSourcePath = config.agents.canonicalInstructions;
  const instructionSourceDigest = await digestFile(
    join(workspaceRoot, instructionSourcePath),
  );
  const hostDeliveryReceipt = await readValidHostDeliveryReceipt({
    workspaceRoot,
    actorId,
    host,
    sessionId,
    instructionSourcePath,
    instructionSourceDigest,
  });
  const hostDelivered = Boolean(hostDeliveryReceipt);

  const instructionParity = instructionSourceDigest === 'missing'
    ? {
        sourcePath: join(workspaceRoot, config.agents.canonicalInstructions),
        issues: [
          { path: join(workspaceRoot, config.agents.canonicalInstructions), status: 'missing' as const },
          ...config.agents.syncMirrors.map((path) => ({
            path: join(workspaceRoot, path),
            status: 'missing' as const,
          })),
        ],
      }
    : await checkInstructionMirrorParity({
        cwd: workspaceRoot,
        instructionSourcePath: config.agents.canonicalInstructions,
        mirrorTargets: config.agents.syncMirrors,
      });
  const recommendations = buildRecommendations({
    understanding,
    capabilities: capabilities.proposal,
    policies,
    skills,
    actions,
    guards,
    scopes: scopes?.scopes ?? [],
    instructionIssueCount: instructionParity.issues.length,
    hostDelivered,
    setupAnalysis,
    bootstrapRequired: !existingConfig,
  });
  const materialQuestions = [
    ...understanding.setupReview.openConfirmationQuestions.map((question) => ({
      id: question.id,
      question: question.question,
      whyItMatters: question.whyItMatters,
      evidencePaths: [],
      recommendedOptionId: question.recommendedOptionId,
      options: question.options,
      answerCommand: `skopos setup answer ${question.id} ${question.recommendedOptionId} . --actor <id>`,
      blocking: true as const,
      interaction: 'must-ask-and-wait' as const,
    })),
    ...adoption.intake.authorityConflicts.slice(0, 1).map((conflict) => ({
      id: `authority.${digest(conflict).slice(0, 12)}`,
      question: `Which source should own this project truth: ${conflict.paths.join(' or ')}?`,
      whyItMatters: conflict.summary,
      evidencePaths: conflict.paths,
      recommendedOptionId: 'review-current-sources',
      options: [
        {
          id: 'review-current-sources',
          label: 'Review current sources',
          rationale: 'Compare the conflicting sources and recommend which truth should be retained before changing either one.',
        },
        {
          id: 'defer',
          label: 'Defer this decision',
          rationale: 'Make no authority-changing mutation and keep setup blocked on this lane.',
        },
      ],
      answerCommand: 'Resolve this material authority question with the coding agent; the revised setup recommendation will record the exact approved source.',
      blocking: true as const,
      interaction: 'must-ask-and-wait' as const,
    })),
    ...(setupAnalysis?.materialQuestions ?? []).map((question) => ({
      ...question,
      answerCommand: 'Discuss this material question with the coding agent, then submit the revised setup analysis.',
      blocking: true as const,
      interaction: 'must-ask-and-wait' as const,
    })),
    ...(!setupAnalysisCurrent && storedSetupAnalysis ? [{
      id: 'analysis.sources-changed',
      question: 'Project evidence changed after the coding-agent setup analysis. Should the agent inspect the changed sources again?',
      whyItMatters: 'Scopes, document changes, and project-truth recommendations must stay bound to the source evidence they were based on.',
      evidencePaths: storedSetupAnalysis.sourcePathStates.map((entry) => entry.path),
      recommendedOptionId: 'reanalyze-current-sources',
      options: [
        {
          id: 'reanalyze-current-sources',
          label: 'Reanalyze current sources',
          rationale: 'Refresh the bounded setup analysis before approving project changes.',
        },
        {
          id: 'defer',
          label: 'Defer setup',
          rationale: 'Keep setup blocked and make no source-changing setup mutations.',
        },
      ],
      answerCommand: 'Ask the coding agent to refresh the setup analysis from current sources, then submit it with skopos setup submit.',
      blocking: true as const,
      interaction: 'must-ask-and-wait' as const,
    }] : []),
  ];
  const recommendationById = new Map(
    recommendations.map((recommendation) => [recommendation.id, recommendation]),
  );
  const dispositions = (previous?.dispositions ?? []).filter(
    (entry) =>
      recommendationById.get(entry.recommendationId)?.sourceDigest === entry.sourceDigest,
  );
  const invalidatedDispositionIds = (previous?.dispositions ?? [])
    .filter(
      (entry) =>
        recommendationById.get(entry.recommendationId)?.sourceDigest !== entry.sourceDigest,
    )
    .map((entry) => entry.recommendationId);
  const completedApplyIds = await resolveCurrentCompletedApplyIds({
    workspaceRoot,
    recommendationIds: previous?.completedApplyIds ?? [],
    recommendations,
    dispositions,
    setupAnalysis,
  });
  const lanes = buildLanes({
    understanding,
    recommendations,
    dispositions,
    scopes: scopes?.scopes ?? [],
    hostDelivered,
    completedApplyIds,
    instructionSourcePath,
  });
  const openQuestionCount = materialQuestions.length;
  const deferredRecommendationCount = dispositions.filter(
    (entry) => entry.disposition === 'defer',
  ).length;
  const undecidedCount = recommendations.filter(
    (entry) => !dispositions.some((decision) => decision.recommendationId === entry.id),
  ).length;
  const baseStage = resolveSetupStage({
    lanes,
    openQuestionCount,
    undecidedCount,
    deferredRecommendationCount,
  });
  const durableLanesReady = openQuestionCount === 0 && setupDurableLanesReady(lanes);
  const certification = durableLanesReady
    ? await inspectSetupCertification({ workspaceRoot, lanes, instructionSourcePath })
    : undefined;
  const stage = certification && certification.status !== 'complete'
    ? 'verification-blocked'
    : baseStage;
  const now = new Date().toISOString();
  const agentPacketPath = join(workspaceRoot, SKOPOS_SETUP_AGENT_PACKET_PATH);
  const hostDeliveryReceiptPath = join(
    workspaceRoot,
    SKOPOS_SETUP_HOST_DELIVERY_PATH,
  );
  const agentPacket = buildSetupAgentPacket({
    workspaceRoot,
    stage,
    understanding,
    recommendations,
    dispositions,
    materialQuestions,
    actorId,
    setupAnalysis,
  });
  await writeJsonArtifact({
    artifactPath: agentPacketPath,
    artifact: agentPacket,
    dryRun,
  });
  const state: SkoposSetupStateArtifact = {
    schemaVersion: 1,
    id: 'setup-state',
    type: 'setup-state',
    status: 'generated',
    authority: 'generated',
    generatedAt: previous?.generatedAt ?? now,
    updatedAt: now,
    summary: renderSetupSummary(stage, lanes),
    workspaceRoot,
    stage,
    currentStep: resolveCurrentStep(stage),
    conversation: buildSetupConversationState({
      stage,
      currentQuestion: materialQuestions[0],
      actorId,
    }),
    lanes,
    recommendations,
    dispositions,
    openQuestionCount,
    materialQuestions,
    deferredRecommendationCount,
    invalidatedDispositionIds,
    completedApplyIds,
    ...(certification ? { certificationTaskId: certification.taskId } : {}),
    ...(previous?.failedApply ? { failedApply: previous.failedApply } : {}),
    agentPacketPath,
    hostDeliveryReceiptPath,
    nextCommand: resolveNextCommand({
      stage,
      currentQuestion: materialQuestions[0],
      actorId,
      host,
      sessionId,
      hostDelivered,
      certification,
    }),
  };
  const statePath = join(workspaceRoot, SKOPOS_SETUP_STATE_PATH);
  const stateWrite = await writeJsonArtifact({ artifactPath: statePath, artifact: state, dryRun });
    return { workspaceRoot, statePath, stateWrite, state, actorId };
  } finally {
    if (dryRun) {
      await Promise.all(
        previewArtifactPaths.map((path) => {
          const initialContents = initialPreviewArtifactContents.get(path);
          return initialContents === undefined
            ? rm(join(workspaceRoot, path), { force: true })
            : writeFile(join(workspaceRoot, path), initialContents);
        }),
      );
      if (!hadSkoposDirectory) {
        await rm(join(workspaceRoot, '.skopos'), { recursive: true, force: true });
      } else if (!hadSkoposIndexDirectory) {
        await rm(join(workspaceRoot, '.skopos/index'), { recursive: true, force: true });
      }
    }
  }
};

export const recordSkoposSetupDispositionRuntime = async ({
  recommendationId,
  disposition,
  note,
  ...options
}: RecordSkoposSetupDispositionRuntimeOptions): Promise<SkoposSetupDispositionRuntimeResult> => {
  const actorId = requireSetupActor(options.actor, 'Recording a setup recommendation decision');
  const current = await buildSkoposSetupRuntime({ ...options, initialize: false });
  if (current.state.openQuestionCount > 0) {
    const question = current.state.materialQuestions[0];
    throw new Error(
      question
        ? `Answer the current material setup question before reviewing recommendations: ${question.id}. ${question.answerCommand}`
        : 'Refresh and answer the current material setup question before reviewing recommendations.',
    );
  }
  const recommendation = current.state.recommendations.find(
    (entry) => entry.id === recommendationId,
  );
  if (!recommendation) throw new Error(`Unknown setup recommendation: ${recommendationId}`);
  if (disposition === 'edit' && !note?.trim()) {
    throw new Error('Editing a setup recommendation requires a note describing the requested change.');
  }
  if (recommendation.required && disposition === 'reject') {
    throw new Error(`Required setup recommendation ${recommendationId} cannot be rejected.`);
  }
  const decision: SkoposSetupDisposition = {
    recommendationId,
    sourceDigest: recommendation.sourceDigest,
    disposition,
    ...(note?.trim() ? { note: note.trim() } : {}),
    decidedAt: new Date().toISOString(),
    actorId,
  };
  if (disposition === 'edit') {
    const revisionInputPath = join(
      current.workspaceRoot,
      '.skopos',
      'setup',
      `revision-${recommendationId.replaceAll(/[^a-z0-9.-]/giu, '-')}.json`,
    );
    await writeJsonArtifact({
      artifactPath: revisionInputPath,
      artifact: {
        recommendationId,
        requestedChange: note!.trim(),
        currentRecommendation: recommendation,
        requiredOutput: {
          recommendationId,
          title: 'optional revised title',
          summary: 'optional revised summary',
          reason: 'optional revised reason',
          applyRef: 'optional revised target or binding',
          evidencePaths: ['paths inspected to support the revision'],
        },
        exactContinuation: 'Add the revision to recommendationRevisions in .skopos/setup/analysis-input.json, submit it with skopos setup submit, then review the revised recommendation before accepting it.',
      },
      dryRun: options.dryRun,
    });
  }
  const state = {
    ...current.state,
    dispositions: [
      ...current.state.dispositions.filter(
        (entry) => entry.recommendationId !== recommendationId,
      ),
      decision,
    ].sort((left, right) => left.recommendationId.localeCompare(right.recommendationId)),
  };
  await writeJsonArtifact({
    artifactPath: current.statePath,
    artifact: state,
    dryRun: options.dryRun,
  });
  const refreshed = await buildSkoposSetupRuntime({ ...options, initialize: false });
  return { ...refreshed, disposition: decision };
};

export const answerSkoposSetupQuestionRuntime = async (
  options: Parameters<typeof buildSkoposSetupAnswerRuntime>[0],
): ReturnType<typeof buildSkoposSetupAnswerRuntime> => {
  const actorId = requireSetupActor(options.actor, 'Answering a material setup question');
  const preview = await buildSkoposSetupAnswerRuntime({
    ...options,
    actor: actorId,
    dryRun: true,
  });
  const answer = { ...preview.answer, actorId };
  const answers = [
    ...preview.setupAnswers.answers.filter((entry) => entry.questionId !== answer.questionId),
    answer,
  ];
  const setupAnswers = {
    ...preview.setupAnswers,
    summary: `${answers.length} setup-review answer${answers.length === 1 ? '' : 's'} recorded.`,
    updatedAt: answer.answeredAt,
    answers,
  };
  const setupAnswersWrite = await writeJsonArtifact({
    artifactPath: preview.setupAnswersPath,
    artifact: setupAnswers,
    dryRun: options.dryRun,
  });
  return {
    ...preview,
    answer,
    setupAnswers,
    configWrite: options.dryRun ? 'dry-run' : 'unchanged',
    setupAnswersWrite,
  };
};

export const resumeSkoposSetupRuntime = async (
  options: BuildSkoposSetupRuntimeOptions,
): Promise<SkoposSetupRuntimeResult> => {
  const actorId = requireSetupActor(options.actor, 'Resuming setup Apply');
  const current = await buildSkoposSetupRuntime({ ...options, initialize: false });
  const accepted = current.state.dispositions
    .filter((entry) => entry.disposition === 'accept')
    .map((entry) => current.state.recommendations.find((candidate) => candidate.id === entry.recommendationId))
    .filter((entry): entry is SkoposSetupRecommendation => Boolean(entry));
  const foundationalBlocker = current.state.openQuestionCount > 0 || current.state.recommendations.some(
    (recommendation) => recommendation.required && !current.state.dispositions.some(
      (entry) => entry.recommendationId === recommendation.id && entry.disposition === 'accept',
    ),
  );
  if (foundationalBlocker) {
    return current;
  }

  await applyRecordedSetupAnswers({
    workspaceRoot: current.workspaceRoot,
    actorId,
    dryRun: options.dryRun ?? false,
  });

  const pending = accepted.filter(
    (entry) => !current.state.completedApplyIds.includes(entry.id),
  );
  const completedApplyIds = [...current.state.completedApplyIds];
  const writeCheckpoint = async (
    failedApply?: SkoposSetupStateArtifact['failedApply'],
  ): Promise<void> => {
    await writeJsonArtifact({
      artifactPath: current.statePath,
      artifact: {
        ...current.state,
        stage: failedApply ? 'verification-blocked' : 'applying',
        currentStep: failedApply ? 'verify' : 'apply',
        completedApplyIds: [...new Set(completedApplyIds)].sort(),
        ...(failedApply ? { failedApply } : { failedApply: undefined }),
        updatedAt: new Date().toISOString(),
      },
      dryRun: options.dryRun,
    });
  };
  const capabilityEntries = pending.filter(
    (entry) => entry.applyKind === 'capability-candidate' && entry.applyRef,
  );
  const capabilityIds = capabilityEntries
    .filter((entry) => entry.applyKind === 'capability-candidate' && entry.applyRef)
    .map((entry) => entry.applyRef!);
  try {
    await writeCheckpoint();
    const bootstrapEntry = pending.find((entry) => entry.applyKind === 'setup-bootstrap');
    if (bootstrapEntry) {
      const setupAnswers = await readOptionalJson<{ answers?: Array<{ questionId: string; optionId: string }> }>(
        join(current.workspaceRoot, '.skopos/index/understanding/setup-answers.json'),
      );
      const lifecycle = setupAnswers?.answers?.find((entry) => entry.questionId === 'understanding.lifecycle');
      await initSkoposProject({
        cwd: current.workspaceRoot,
        mode: lifecycle?.optionId === 'new-project' ? 'greenfield' : 'existing',
        actor: actorId,
        dryRun: options.dryRun,
        buildAdoptionAssessment: false,
        scaffoldMemoryBoundary: true,
      });
      completedApplyIds.push(bootstrapEntry.id);
      await writeCheckpoint();
    }
    if (capabilityIds.length > 0) {
      const proposal = await proposeSkoposCapabilityIntegrationsRuntime({
        cwd: current.workspaceRoot,
        dryRun: options.dryRun,
      });
      const approval = await approveSkoposCapabilityIntegrationsRuntime({
        cwd: current.workspaceRoot,
        proposalDigest: proposal.proposal.proposalDigest,
        acceptedCandidateIds: capabilityIds,
        actor: actorId,
        reason: 'Accepted through the consolidated Skopos setup review.',
        dryRun: options.dryRun,
      });
      await applySkoposCapabilityIntegrationsRuntime({
        cwd: current.workspaceRoot,
        approvalDigest: approval.approval.approvalDigest,
        actor: actorId,
        dryRun: options.dryRun,
      });
      completedApplyIds.push(...capabilityEntries.map((entry) => entry.id));
      await writeCheckpoint();
    }
    for (const recommendation of pending.filter((entry) => !['capability-candidate', 'setup-bootstrap'].includes(entry.applyKind))) {
      if (recommendation.applyKind === 'policy-pack' && recommendation.applyRef) {
        await applySkoposPolicyPackRuntime({
          cwd: current.workspaceRoot,
          pack: recommendation.applyRef,
          actor: actorId,
          reason: 'Accepted through the consolidated Skopos setup review.',
          dryRun: options.dryRun,
        });
      }
      if (recommendation.applyKind === 'skill-pack' && recommendation.applyRef) {
        const [pack, binding] = recommendation.applyRef.split('::');
        if (pack && binding) {
          await applySkoposSkillPackRuntime({
            cwd: current.workspaceRoot,
            pack,
            binding,
            actor: actorId,
            reason: 'Accepted through the consolidated Skopos setup review.',
            dryRun: options.dryRun,
          });
        }
      }
      if (recommendation.applyKind === 'instruction-sync') {
        await syncSkoposInstructions({
          cwd: current.workspaceRoot,
          actor: actorId,
          dryRun: options.dryRun,
        });
      }
      if (!['agent-memory-work', 'scope-review', 'host-proof'].includes(recommendation.applyKind)) {
        completedApplyIds.push(recommendation.id);
        await writeCheckpoint();
      }
    }
  } catch (error) {
    const recommendationId = pending.find(
      (entry) => !completedApplyIds.includes(entry.id),
    )?.id ?? 'setup.apply';
    await writeCheckpoint({
      recommendationId,
      message: error instanceof Error ? error.message : String(error),
      failedAt: new Date().toISOString(),
    });
    throw error;
  }
  const refreshed = await buildSkoposSetupRuntime({ ...options, initialize: false });
  if (
    refreshed.state.openQuestionCount > 0 ||
    !setupDurableLanesReady(refreshed.state.lanes)
  ) {
    return refreshed;
  }
  const refreshedConfig = await loadSkoposConfig(
    join(refreshed.workspaceRoot, 'skopos.config.yaml'),
  );
  const certification = await inspectSetupCertification({
    workspaceRoot: refreshed.workspaceRoot,
    lanes: refreshed.state.lanes,
    instructionSourcePath: refreshedConfig?.agents.canonicalInstructions ?? 'AGENTS.md',
  });
  if (certification.status === 'required') {
    await createSetupCertificationTask({
      workspaceRoot: refreshed.workspaceRoot,
      state: refreshed.state,
      actorId,
      dryRun: options.dryRun ?? false,
    });
    return buildSkoposSetupRuntime({ ...options, initialize: false });
  }
  return refreshed;
};

const buildRecommendations = ({
  understanding,
  capabilities,
  policies,
  skills,
  actions,
  guards,
  scopes,
  instructionIssueCount,
  hostDelivered,
  setupAnalysis,
  bootstrapRequired,
}: {
  understanding: Awaited<ReturnType<typeof buildSkoposUnderstandingRuntime>>;
  capabilities: Awaited<ReturnType<typeof proposeSkoposCapabilityIntegrationsRuntime>>['proposal'];
  policies: Awaited<ReturnType<typeof recommendSkoposPolicyPacksRuntime>>;
  skills: Awaited<ReturnType<typeof recommendSkoposSkillPacksRuntime>>;
  actions: Awaited<ReturnType<typeof loadSkoposActionManifests>>;
  guards: Awaited<ReturnType<typeof loadSkoposGuardManifests>>;
  scopes: SkoposScopesLiteArtifact['scopes'];
  instructionIssueCount: number;
  hostDelivered: boolean;
  setupAnalysis?: SkoposSetupAnalysisArtifact;
  bootstrapRequired: boolean;
}): SkoposSetupRecommendation[] => {
  const recommendations: SkoposSetupRecommendation[] = [];
  if (bootstrapRequired) {
    recommendations.push(recommendation({
      id: 'setup.bootstrap-tracked-project-layer',
      laneId: 'understanding',
      title: 'Create the tracked Skopos project layer',
      summary: 'Write the accepted project config, Scope registry, gitignore entries, and instruction source during Apply.',
      reason: 'Understand and Review are preview-only; tracked project truth is created only after an explicit accepted Apply.',
      source: { bootstrapRequired },
      required: true,
      risk: 'medium',
      defaultDisposition: 'accept',
      applyKind: 'setup-bootstrap',
    }));
  }
  for (const proposal of setupAnalysis?.scopeProposals ?? []) {
    recommendations.push(recommendation({
      id: `scope.${proposal.id}`,
      laneId: 'scopes',
      title: `Adopt ${proposal.title} as a project area`,
      summary: `${proposal.kind}: ${proposal.codeRoots.join(', ')}`,
      reason: proposal.rationale,
      source: proposal,
      required: true,
      risk: 'medium',
      defaultDisposition: 'accept',
      applyKind: 'scope-review',
      applyRef: proposal.id,
    }));
  }
  for (const operation of setupAnalysis?.documentOperations ?? []) {
    recommendations.push(recommendation({
      id: `memory.operation.${operation.id}`,
      laneId: 'memory',
      title: `${operation.operation}: ${operation.targetPaths[0] ?? operation.sourcePaths[0] ?? operation.id}`,
      summary: operation.rationale,
      reason: `Retained truth: ${operation.retainedTruth}`,
      source: operation,
      required: operation.operation === 'create-from-evidence',
      risk: operation.informationLossRisk === 'material' ? 'high' : 'medium',
      defaultDisposition: operation.informationLossRisk === 'material' ? 'defer' : 'accept',
      applyKind: 'agent-memory-work',
      applyRef: operation.targetPaths[0] ?? operation.sourcePaths[0] ?? operation.id,
    }));
  }
  for (const output of understanding.agentAnalysisBrief.durableOutputs.filter(
    (entry) => entry.required && entry.status === 'missing',
  )) {
    recommendations.push(recommendation({
      id: `memory.${output.id}`,
      laneId: 'memory',
      title: `Create ${output.title}`,
      summary: output.purpose,
      reason: 'Future coding agents need reviewed project truth rather than scanner guesses.',
      source: output,
      required: true,
      risk: 'medium',
      defaultDisposition: 'accept',
      applyKind: 'agent-memory-work',
      applyRef: output.path,
    }));
  }
  if (needsMeaningfulScopeReview(scopes, understanding.summary.mainAreas.length)) {
    recommendations.push(recommendation({
      id: 'scopes.review-meaningful-boundaries',
      laneId: 'scopes',
      title: 'Review meaningful project areas',
      summary: 'Propose ownership boundaries around real product areas instead of treating the whole repository as one undifferentiated Scope.',
      reason: 'Scope-aware Memory, ownership, and checks depend on accepted project boundaries.',
      source: understanding.summary.mainAreas,
      required: true,
      risk: 'medium',
      defaultDisposition: 'accept',
      applyKind: 'scope-review',
    }));
  }
  for (const candidate of selectSetupCapabilityCandidates({
    candidates: capabilities.candidates,
    actions,
    guards,
  })) {
    const actionId = candidate.suggestedAction?.id;
    if (!actionId) continue;
    recommendations.push(recommendation({
      id: `capability.${candidate.id}`,
      laneId: 'capabilities',
      title: `Use ${candidate.name} as a project check`,
      summary: candidate.command,
      reason: candidate.rationale,
      source: {
        candidate,
        existingAction: actions.find((entry) => entry.id === actionId),
        existingGuard: guards.find((entry) => entry.id === candidate.suggestedGuard?.id),
      },
      required: ['quality.test', 'quality.typecheck'].includes(actionId),
      risk: 'low',
      defaultDisposition: ['quality.test', 'quality.typecheck'].includes(actionId) ? 'accept' : 'defer',
      applyKind: 'capability-candidate',
      applyRef: candidate.id,
    }));
  }
  for (const entry of policies.recommendations.filter(
    (candidate) => !candidate.accepted && candidate.recommendation !== 'avoid',
  )) {
    recommendations.push(recommendation({
      id: `policy.${entry.packId}`,
      laneId: 'policies',
      title: `Adopt ${entry.displayName}`,
      summary: entry.plainLanguageSummary ?? entry.reason,
      reason: entry.reason,
      source: entry,
      required: entry.recommendation === 'apply',
      risk: 'medium',
      defaultDisposition: entry.recommendation === 'apply' ? 'accept' : 'defer',
      applyKind: 'policy-pack',
      applyRef: entry.packId,
    }));
  }
  for (const entry of skills.recommendations.filter(
    (candidate) => !candidate.accepted && candidate.recommendation !== 'avoid',
  )) {
    recommendations.push(recommendation({
      id: `skill.${entry.packId}`,
      laneId: 'skills',
      title: `Add ${entry.displayName} when relevant`,
      summary: entry.reason,
      reason: entry.missingRequiredRoles.length > 0
        ? `A project binding still needs: ${entry.missingRequiredRoles.join(', ')}.`
        : entry.reason,
      source: entry,
      required: false,
      risk: 'low',
      defaultDisposition: entry.bindingPath ? 'accept' : 'defer',
      applyKind: 'skill-pack',
      applyRef: entry.bindingPath ? `${entry.packId}::${entry.bindingPath}` : undefined,
    }));
  }
  if (instructionIssueCount > 0) {
    recommendations.push(recommendation({
      id: 'instructions.sync',
      laneId: 'instructions',
      title: 'Synchronize coding-agent instructions',
      summary: `${instructionIssueCount} host instruction projection${instructionIssueCount === 1 ? ' is' : 's are'} missing or stale.`,
      reason: 'Every supported coding agent should receive the same accepted project operating contract.',
      source: { instructionIssueCount },
      required: true,
      risk: 'low',
      defaultDisposition: 'accept',
      applyKind: 'instruction-sync',
    }));
  }
  if (!hostDelivered) {
    recommendations.push(recommendation({
      id: 'host-delivery.verify',
      laneId: 'host-delivery',
      title: 'Verify this coding agent receives Skopos context',
      summary: 'Generated adapter files exist, but this setup run has no bound host Session receipt.',
      reason: 'Configuration alone cannot prove the coding agent actually received current project context.',
      source: { hostDelivered },
      required: true,
      risk: 'low',
      defaultDisposition: 'accept',
      applyKind: 'host-proof',
    }));
  }
  const revisions = new Map(
    (setupAnalysis?.recommendationRevisions ?? []).map((entry) => [entry.recommendationId, entry]),
  );
  return recommendations
    .map((entry) => {
      const revision = revisions.get(entry.id);
      if (!revision) return entry;
      const revised = {
        ...entry,
        ...(revision.title ? { title: revision.title } : {}),
        ...(revision.summary ? { summary: revision.summary } : {}),
        ...(revision.reason ? { reason: revision.reason } : {}),
        ...(revision.applyRef ? { applyRef: revision.applyRef } : {}),
      };
      return {
        ...revised,
        sourceDigest: digest({
          previousSourceDigest: entry.sourceDigest,
          revision,
        }),
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
};

const selectSetupCapabilityCandidates = ({
  candidates,
  actions,
  guards,
}: {
  candidates: SkoposCapabilityCandidate[];
  actions: SkoposActionManifest[];
  guards: SkoposGuardManifest[];
}): SkoposCapabilityCandidate[] => {
  const actionsById = new Map(actions.map((action) => [action.id, action]));
  const guardsById = new Map(guards.map((guard) => [guard.id, guard]));
  const candidatesByActionId = new Map<string, SkoposCapabilityCandidate[]>();
  for (const candidate of candidates) {
    const actionId = candidate.suggestedAction?.id;
    if (!actionId || !candidate.suggestedGuard) continue;
    const group = candidatesByActionId.get(actionId) ?? [];
    group.push(candidate);
    candidatesByActionId.set(actionId, group);
  }

  return [...candidatesByActionId.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([actionId, group]) => {
      const existingAction = actionsById.get(actionId);
      const existingGuard = guardsById.get(actionId);
      const represented = group.some((candidate) =>
        existingAction &&
        existingGuard &&
        normalizeCapabilityCommand(existingAction.command) ===
          normalizeCapabilityCommand(candidate.command) &&
        existingAction.cwd === candidate.cwd &&
        existingGuard.requires.actionIds.includes(existingAction.id) &&
        existingGuard.requires.evidence === candidate.suggestedGuard?.requires.evidence,
      );
      if (represented) return [];
      return [
        [...group].sort((left, right) =>
          compareSetupCapabilityCandidates(actionId, left, right),
        )[0]!,
      ];
    });
};

const compareSetupCapabilityCandidates = (
  actionId: string,
  left: SkoposCapabilityCandidate,
  right: SkoposCapabilityCandidate,
): number => {
  const canonicalName = actionId.split('.').at(-1) ?? actionId;
  const rank = (candidate: SkoposCapabilityCandidate): [number, number, number, string] => [
    candidate.source === 'configured-command' ? 0 : 1,
    normalizeCapabilityName(candidate.name) === canonicalName ? 0 : 1,
    candidate.command.length,
    candidate.id,
  ];
  const leftRank = rank(left);
  const rightRank = rank(right);
  return leftRank[0] - rightRank[0]
    || leftRank[1] - rightRank[1]
    || leftRank[2] - rightRank[2]
    || leftRank[3].localeCompare(rightRank[3]);
};

const normalizeCapabilityCommand = (command: string): string =>
  command.trim().replaceAll(/\s+/gu, ' ');

const normalizeCapabilityName = (name: string): string =>
  name.trim().toLowerCase().replaceAll(/[^a-z0-9]+/gu, '');

const recommendation = (
  input: Omit<SkoposSetupRecommendation, 'sourceDigest' | 'options'> & { source: unknown },
): SkoposSetupRecommendation => {
  const { source, ...value } = input;
  return {
    ...value,
    sourceDigest: digest(source),
    options: [
      { id: 'accept', label: 'Accept', rationale: 'Include this recommendation in the approved setup envelope.' },
      { id: 'edit', label: 'Edit', rationale: 'Request a revised recommendation before approval.' },
      { id: 'defer', label: 'Defer', rationale: 'Keep it visible for later without silently accepting it.' },
      { id: 'reject', label: 'Reject', rationale: 'Do not repeat it until its material source changes.' },
    ],
  };
};

const buildLanes = ({
  understanding,
  recommendations,
  dispositions,
  scopes,
  hostDelivered,
  completedApplyIds,
  instructionSourcePath,
}: {
  understanding: Awaited<ReturnType<typeof buildSkoposUnderstandingRuntime>>;
  recommendations: SkoposSetupRecommendation[];
  dispositions: SkoposSetupDisposition[];
  scopes: SkoposScopesLiteArtifact['scopes'];
  hostDelivered: boolean;
  completedApplyIds: string[];
  instructionSourcePath: string;
}): SkoposSetupLane[] => {
  const lane = (
    id: SkoposSetupLane['id'],
    title: string,
    baseReady: boolean,
    evidencePaths: string[],
  ): SkoposSetupLane => {
    const related = recommendations.filter((entry) => entry.laneId === id);
    const unresolved = related.filter(
      (entry) => !dispositions.some((decision) => decision.recommendationId === entry.id),
    );
    const edited = related.filter((entry) =>
      dispositions.some(
        (decision) => decision.recommendationId === entry.id && decision.disposition === 'edit',
      ),
    );
    const requiredDeferred = related.filter(
      (entry) => entry.required && dispositions.some(
        (decision) => decision.recommendationId === entry.id && decision.disposition === 'defer',
      ),
    );
    const optionalDeferred = related.filter(
      (entry) => !entry.required && dispositions.some(
        (decision) => decision.recommendationId === entry.id && decision.disposition === 'defer',
      ),
    );
    const blocked = requiredDeferred.length > 0 || edited.length > 0;
    const acceptedUnapplied = related.filter(
      (entry) => dispositions.some(
        (decision) => decision.recommendationId === entry.id && decision.disposition === 'accept',
      ) && !completedApplyIds.includes(entry.id),
    );
    const status = blocked
      ? 'blocked'
      : unresolved.length > 0 || acceptedUnapplied.length > 0 || !baseReady
        ? 'needs-review'
        : optionalDeferred.length > 0
          ? 'deferred'
          : 'ready';
    return {
      id,
      title,
      status,
      summary:
        status === 'ready'
          ? `${title} is ready from current project sources.`
          : `${title} has ${unresolved.length + edited.length + requiredDeferred.length} item${unresolved.length + edited.length + requiredDeferred.length === 1 ? '' : 's'} needing attention.`,
      required: true,
      evidencePaths,
      ...(blocked ? { blocker: 'A required recommendation was deferred or needs revision.' } : {}),
    };
  };
  return [
    lane('understanding', 'Project understanding', understanding.agentAnalysisBrief.analysisStatus === 'agent-reviewed', [understanding.agentAnalysisBriefPath]),
    lane(
      'scopes',
      'Project areas and ownership',
      !needsMeaningfulScopeReview(scopes, understanding.summary.mainAreas.length),
      ['tools/skopos/scopes.yaml'],
    ),
    lane('memory', 'Project Memory', understanding.agentAnalysisBrief.analysisStatus === 'agent-reviewed', understanding.agentAnalysisBrief.durableOutputs.map((entry) => entry.path)),
    lane('capabilities', 'Project checks and capabilities', true, ['tools/skopos/actions', 'tools/skopos/guards']),
    lane('policies', 'Project rules', true, ['tools/skopos/policies.yaml']),
    lane('skills', 'Task-selective specialist guidance', true, ['skill-packs', 'tools/skopos/skills']),
    lane('instructions', 'Coding-agent instructions', true, [instructionSourcePath]),
    lane('host-delivery', 'Coding-agent context delivery', hostDelivered, ['.skopos/cache/tooling']),
  ];
};

const resolveSetupStage = ({
  lanes,
  openQuestionCount,
  undecidedCount,
  deferredRecommendationCount,
}: {
  lanes: SkoposSetupLane[];
  openQuestionCount: number;
  undecidedCount: number;
  deferredRecommendationCount: number;
}): SkoposSetupStateArtifact['stage'] => {
  if (openQuestionCount > 0) return 'questions-open';
  if (lanes.some((lane) => lane.id === 'understanding' && lane.status !== 'ready')) return 'inspection-required';
  if (undecidedCount > 0) return 'plan-ready';
  if (lanes.some((lane) => lane.status === 'blocked' || lane.status === 'needs-review')) return 'verification-blocked';
  return deferredRecommendationCount > 0
    ? 'setup-ready-with-deferred-options'
    : 'setup-ready';
};

const resolveCurrentStep = (stage: SkoposSetupStateArtifact['stage']): string =>
  ({
    'inspection-required': 'understand',
    'questions-open': 'clarify',
    'plan-ready': 'review',
    applying: 'apply',
    'verification-blocked': 'verify',
    'setup-ready': 'complete',
    'setup-ready-with-deferred-options': 'complete',
  })[stage];

const resolveNextCommand = ({
  stage,
  currentQuestion,
  actorId,
  host,
  sessionId,
  hostDelivered,
  certification,
}: {
  stage: SkoposSetupStateArtifact['stage'];
  currentQuestion?: SkoposSetupMaterialQuestion;
  actorId?: string;
  host?: string;
  sessionId?: string;
  hostDelivered: boolean;
  certification?: SetupCertificationStatus;
}): string => {
  if (stage === 'inspection-required') {
    return `skopos setup submit .skopos/setup/analysis-input.json . --actor ${actorId ?? '<id>'}`;
  }
  if (stage === 'questions-open') {
    return currentQuestion?.answerCommand ?? 'skopos setup status .';
  }
  if (stage === 'plan-ready') return 'skopos setup review .';
  if (stage === 'verification-blocked' && !hostDelivered) {
    return `After the host injects current Session context, run: skopos setup confirm-host-delivery . --actor ${actorId ?? '<id>'} --host ${host ?? '<host>'} --session-id ${sessionId ?? '<session-id>'} --context-marker <marker> --context-digest <digest>`;
  }
  if (stage === 'verification-blocked' && certification?.status === 'active') {
    return `Complete Task ${certification.taskId} through normal Evidence, verify, and finish authority; then run skopos setup status . --actor ${actorId ?? '<id>'}`;
  }
  if (stage === 'verification-blocked') return `skopos setup resume . --actor ${actorId ?? '<id>'}`;
  return 'skopos session context . --json';
};

const buildSetupConversationState = ({
  stage,
  currentQuestion,
  actorId,
}: {
  stage: SkoposSetupStateArtifact['stage'];
  currentQuestion?: SkoposSetupMaterialQuestion;
  actorId?: string;
}): SkoposSetupStateArtifact['conversation'] => {
  if (stage === 'questions-open') {
    return {
      mode: 'ask-and-wait',
      instruction: currentQuestion
        ? 'Ask exactly the current material question, explain the recommended default and alternatives in plain language, then wait. Do not infer the answer, batch later questions, present a consolidated plan, or request broad approval.'
        : 'Material setup questions remain unresolved, but this local state does not contain the current question. Refresh setup state before review; do not infer answers or present a consolidated plan.',
      finalPlanAllowed: false,
      ...(currentQuestion ? { currentQuestion } : {}),
    };
  }
  if (stage === 'inspection-required') {
    return {
      mode: 'inspect-and-submit',
      instruction: 'Follow the generated agent packet, inspect current project evidence, write the required analysis file, and submit it to Skopos before review. Do not leave Scope or document proposals only in chat prose.',
      finalPlanAllowed: false,
      submissionPath: '.skopos/setup/analysis-input.json',
      submissionCommand: `skopos setup submit .skopos/setup/analysis-input.json . --actor ${actorId ?? '<id>'}`,
    };
  }
  if (stage === 'plan-ready') {
    return {
      mode: 'review',
      instruction: 'Present the consolidated setup review. Keep every recommendation independently accept, edit, defer, or reject; do not treat blanket approval as permission for newly discovered work.',
      finalPlanAllowed: true,
    };
  }
  if (stage === 'applying') {
    return {
      mode: 'apply',
      instruction: 'Apply only accepted recommendations through their existing authority and stop on invalidation or failure.',
      finalPlanAllowed: false,
    };
  }
  if (stage === 'verification-blocked') {
    return {
      mode: 'verify',
      instruction: 'Explain the exact readiness blocker and the one bounded recovery step. Do not claim setup is ready.',
      finalPlanAllowed: false,
    };
  }
  return {
    mode: 'complete',
    instruction: 'Report the verified setup outcome, any deferred optional improvements, and the next normal project action.',
    finalPlanAllowed: false,
  };
};

const renderSetupSummary = (
  stage: SkoposSetupStateArtifact['stage'],
  lanes: SkoposSetupLane[],
): string =>
  `Setup is ${stage}; ${lanes.filter((lane) => lane.status === 'ready').length}/${lanes.length} readiness lanes are ready.`;

const digest = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');

const digestFile = async (path: string): Promise<string> => {
  try {
    return createHash('sha256').update(await readFile(path)).digest('hex');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 'missing';
    throw error;
  }
};

const collectSetupAnalysisSourcePaths = (
  input: Pick<
    SkoposSetupAnalysisArtifact,
    'claims' | 'materialQuestions' | 'scopeProposals' | 'documentOperations' | 'recommendationRevisions'
  >,
): string[] => {
  const paths = [
    ...input.claims.flatMap((entry) => entry.evidencePaths),
    ...input.materialQuestions.flatMap((entry) => entry.evidencePaths),
    ...input.scopeProposals.flatMap((entry) => entry.evidencePaths),
    ...input.documentOperations.flatMap((entry) => [
      ...entry.sourcePaths,
      ...entry.evidencePaths,
    ]),
    ...(input.recommendationRevisions ?? []).flatMap((entry) => entry.evidencePaths),
  ];
  return [...new Set(paths)].sort();
};

const setupAnalysisMatchesCurrentSources = async (
  workspaceRoot: string,
  analysis: SkoposSetupAnalysisArtifact,
): Promise<boolean> => {
  for (const entry of analysis.sourcePathStates) {
    const normalized = relative(workspaceRoot, resolve(workspaceRoot, entry.path));
    if (normalized.startsWith('..') || isAbsolute(normalized)) {
      throw new Error(`Setup analysis evidence path must stay inside the workspace: ${entry.path}`);
    }
  }
  const current = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: analysis.sourcePathStates.map((entry) => entry.path),
  });
  return digestSkoposTaskPathStates(current) === analysis.sourceDigest;
};

const collectSetupCertificationPaths = ({
  workspaceRoot,
  lanes,
  instructionSourcePath,
}: {
  workspaceRoot: string;
  lanes: SkoposSetupLane[];
  instructionSourcePath: string;
}): string[] =>
  [...new Set([
    'skopos.config.yaml',
    instructionSourcePath,
    ...lanes
      .filter((lane) => lane.id !== 'host-delivery')
      .flatMap((lane) => lane.evidencePaths),
  ].map((path) =>
    (relative(workspaceRoot, resolve(workspaceRoot, path)) || '.')
      .replaceAll('\\', '/'),
  ))]
    .filter((path) =>
      path !== '.skopos' &&
      !path.startsWith('.skopos/') &&
      path !== '..' &&
      !path.startsWith('../') &&
      !isAbsolute(path),
    )
    .sort();

const setupDurableLanesReady = (lanes: SkoposSetupLane[]): boolean =>
  lanes
    .filter((lane) => lane.id !== 'host-delivery')
    .every((lane) => lane.status === 'ready' || lane.status === 'deferred');

interface SetupCertificationStatus {
  status: 'required' | 'active' | 'complete';
  taskId: string;
}

const resolveSetupCertificationIdentity = async ({
  workspaceRoot,
  lanes,
  instructionSourcePath,
}: {
  workspaceRoot: string;
  lanes: SkoposSetupLane[];
  instructionSourcePath: string;
}): Promise<{ taskId: string; paths: string[] }> => {
  const paths = collectSetupCertificationPaths({ workspaceRoot, lanes, instructionSourcePath });
  const sourceStates = await captureSkoposTaskPathStates({ workspaceRoot, paths });
  return {
    taskId: `T-setup${digestSkoposTaskPathStates(sourceStates).slice(0, 8)}`,
    paths,
  };
};

const inspectSetupCertification = async ({
  workspaceRoot,
  lanes,
  instructionSourcePath,
}: {
  workspaceRoot: string;
  lanes: SkoposSetupLane[];
  instructionSourcePath: string;
}): Promise<SetupCertificationStatus> => {
  const identity = await resolveSetupCertificationIdentity({ workspaceRoot, lanes, instructionSourcePath });
  const tasks = await reconstructTrackedSkoposTasksRuntime({ cwd: workspaceRoot });
  const task = tasks.find((entry) =>
    entry.id === identity.taskId &&
    entry.contract.constraints.includes(SKOPOS_RUNTIME_SETUP_CERTIFICATION_CONSTRAINT),
  );
  return {
    taskId: identity.taskId,
    status: task?.state === 'complete' ? 'complete' : task ? 'active' : 'required',
  };
};

const createSetupCertificationTask = async ({
  workspaceRoot,
  state,
  actorId,
  dryRun,
}: {
  workspaceRoot: string;
  state: SkoposSetupStateArtifact;
  actorId?: string;
  dryRun: boolean;
}): Promise<SetupCertificationStatus> => {
  const instructionSourcePath = (
    await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'))
  )?.agents.canonicalInstructions ?? 'AGENTS.md';
  const identity = await resolveSetupCertificationIdentity({
    workspaceRoot,
    lanes: state.lanes,
    instructionSourcePath,
  });
  const existing = await inspectSetupCertification({
    workspaceRoot,
    lanes: state.lanes,
    instructionSourcePath,
  });
  if (existing.status !== 'required') return existing;
  const plan = await prepareSkoposPlanRuntime({
    cwd: workspaceRoot,
    goal: 'Certify unified setup as standard-verified and agent-ready',
  });
  const prepared = await createSkoposTaskRuntime({
    cwd: workspaceRoot,
    plan,
    actor: actorId,
    taskId: identity.taskId,
    risk: 'high-impact',
    detail: 'detailed',
    acceptanceCriteria: [
      'Unified setup certification is standard-verified and agent-ready from current tracked project owners.',
      'Host delivery remains checkout-local and is reverified per Session.',
    ],
    constraints: [SKOPOS_RUNTIME_SETUP_CERTIFICATION_CONSTRAINT],
    ownedPaths: identity.paths,
    dryRun,
  });
  return { status: 'active', taskId: prepared.task.id };
};

const needsMeaningfulScopeReview = (
  scopes: SkoposScopesLiteArtifact['scopes'],
  mainAreaCount: number,
): boolean =>
  scopes.length === 1 && scopes[0]?.kind === 'workspace' && mainAreaCount > 1;

const buildSetupAgentPacket = ({
  workspaceRoot,
  stage,
  understanding,
  recommendations,
  dispositions,
  materialQuestions,
  actorId,
  setupAnalysis,
}: {
  workspaceRoot: string;
  stage: SkoposSetupStateArtifact['stage'];
  understanding: Awaited<ReturnType<typeof buildSkoposUnderstandingRuntime>>;
  recommendations: SkoposSetupRecommendation[];
  dispositions: SkoposSetupDisposition[];
  materialQuestions: SkoposSetupMaterialQuestion[];
  actorId?: string;
  setupAnalysis?: SkoposSetupAnalysisArtifact;
}): SkoposSetupAgentPacketArtifact => {
  const dispositionById = new Map(
    dispositions.map((entry) => [entry.recommendationId, entry]),
  );
  const memoryItems = recommendations
    .filter((entry) => entry.applyKind === 'agent-memory-work')
    .map((entry) => {
      const operation = setupAnalysis?.documentOperations.find(
        (candidate) => `memory.operation.${candidate.id}` === entry.id,
      );
      const expectedPathStates = expectedAgentOwnedPostconditions(entry, setupAnalysis);
      return {
        id: entry.id,
        laneId: entry.laneId,
        title: entry.title,
        instruction: `${dispositionById.get(entry.id)?.disposition === 'accept' ? 'This work is approved. ' : ''}${operation ? `Perform the exact approved ${operation.operation} operation. ` : ''}Create only the minimum useful durable project truth at ${entry.applyRef}. Bind factual claims to inspected source paths, label inference and unknowns, and preserve existing human intent.`,
        targetPath: entry.applyRef,
        operation: operation?.operation ?? 'create-from-evidence' as const,
        approvalRequired: dispositionById.get(entry.id)?.disposition !== 'accept',
        ...(operation ? {
          sourcePaths: operation.sourcePaths,
          targetPaths: operation.targetPaths,
          evidencePaths: operation.evidencePaths,
          retainedTruth: operation.retainedTruth,
          informationLossRisk: operation.informationLossRisk,
        } : {}),
        completionRequirements: {
          recommendationId: entry.id,
          recommendationSourceDigest: entry.sourceDigest,
          expectedPathStates,
          submitCommand: 'skopos setup submit-completion <receipt.json> . --actor <id>',
        },
      };
    });
  const scopeItems = recommendations
    .filter((entry) => entry.applyKind === 'scope-review')
    .map((entry) => {
      const proposal = setupAnalysis?.scopeProposals.find(
        (candidate) => `scope.${candidate.id}` === entry.id,
      );
      return {
        id: entry.id,
        laneId: entry.laneId,
        title: entry.title,
        instruction: `${dispositionById.get(entry.id)?.disposition === 'accept' ? 'This Scope operation is approved. Apply exactly the source-bound proposal. ' : ''}Propose meaningful product, application, service, package, domain, infrastructure, or tool boundaries from behavior and ownership evidence. Do not mirror folders mechanically.`,
        operation: 'review-scope' as const,
        approvalRequired: dispositionById.get(entry.id)?.disposition !== 'accept',
        ...(proposal ? {
          evidencePaths: proposal.evidencePaths,
          scopeProposal: {
            kind: proposal.kind,
            codeRoots: proposal.codeRoots,
            memoryRoot: proposal.memoryRoot,
            rationale: proposal.rationale,
          },
        } : {}),
        completionRequirements: {
          recommendationId: entry.id,
          recommendationSourceDigest: entry.sourceDigest,
          expectedPathStates: expectedAgentOwnedPostconditions(entry, setupAnalysis),
          submitCommand: 'skopos setup submit-completion <receipt.json> . --actor <id>',
        },
      };
    });
  const approvedApplyItems = recommendations
    .filter((entry) =>
      dispositionById.get(entry.id)?.disposition === 'accept' &&
      !['agent-memory-work', 'scope-review', 'host-proof'].includes(entry.applyKind),
    )
    .map((entry) => ({
      id: entry.id,
      laneId: entry.laneId,
      title: entry.title,
      instruction: `Apply the accepted ${entry.laneId} recommendation through its existing Skopos authority.`,
      targetPath: entry.applyRef,
      operation: 'apply-approved' as const,
      approvalRequired: false,
    }));
  const now = new Date().toISOString();
  const currentQuestion = materialQuestions[0];
  const submissionCommand = `skopos setup submit .skopos/setup/analysis-input.json . --actor ${actorId ?? '<id>'}`;
  return {
    schemaVersion: 1,
    id: 'setup-agent-packet',
    type: 'setup-agent-packet',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary: 'Bounded coding-agent work packet for the current Skopos setup stage.',
    workspaceRoot,
    stage,
    objective: 'Make future coding-agent work substantially more coherent by establishing reviewed project understanding, ownership, Memory, checks, rules, specialist guidance, and context delivery.',
    responseObjective: currentQuestion
      ? 'Ask exactly the current material question in simple language, explain the recommended default and alternatives, and wait for the answer. Do not present the consolidated setup plan yet.'
      : stage === 'inspection-required'
        ? 'Explain the project in simple language, distinguish facts from inference, write the required analysis file, and submit it to Skopos before presenting a consolidated plan.'
        : 'Explain the current setup outcome in simple language, recommend a clear default where needed, and say what will happen next.',
    requiredReads: understanding.agentAnalysisBrief.requiredReads,
    workItems: [...memoryItems, ...scopeItems, ...approvedApplyItems],
    approvalBoundaries: [
      'Do not change human-authored project truth or ownership before the relevant recommendation is accepted.',
      'Do not accept Policies, bind Skills, or create executable Actions and Guards without an exact accepted recommendation.',
      'Stop when evidence conflicts with intended behavior, architecture authority, security, or public behavior.',
    ],
    prohibitedClaims: [
      'Do not call scanner output reviewed project truth.',
      'Do not call generated adapter files proof of host delivery.',
      'Do not call setup ready while a required lane is blocked or unverified.',
      'Do not present a consolidated review or request broad approval while a material question remains open.',
    ],
    responseSections: [
      'What I understand',
      'What I recommend and why',
      'The decision I need from you, when material',
      'What happens next',
    ],
    submissionPath: '.skopos/setup/analysis-input.json',
    submissionCommand,
    submissionSchema: {
      claims: 'fact | inference | contradiction | unknown, each with evidencePaths',
      materialQuestions: 'question, whyItMatters, evidencePaths, recommended option and alternatives',
      scopeProposals: 'id, title, kind, codeRoots, memoryRoot, evidencePaths and rationale',
      documentOperations: 'keep | move | merge | split | rewrite | archive | delete | create-from-evidence with source/target paths and retained truth',
    },
    ...(currentQuestion ? { currentQuestion } : {}),
    finalPlanAllowed: stage === 'plan-ready',
    exactContinuation: currentQuestion?.answerCommand ??
      (stage === 'inspection-required'
        ? submissionCommand
        : `skopos setup resume . --actor ${actorId ?? '<id>'}`),
  };
};

export const confirmSkoposSetupHostDeliveryRuntime = async ({
  workspaceRoot,
  actorId,
  host,
  sessionId,
  dryRun,
  communicationContractMarker,
  communicationContractDigest,
  instructionSourcePath,
  instructionSourceDigest,
}: {
  workspaceRoot: string;
  actorId: string;
  host: string;
  sessionId: string;
  dryRun: boolean;
  communicationContractMarker: string;
  communicationContractDigest: string;
  instructionSourcePath: string;
  instructionSourceDigest: string;
}): Promise<SkoposSetupHostDeliveryReceiptArtifact> => {
  const path = join(workspaceRoot, SKOPOS_SETUP_HOST_DELIVERY_PATH);
  const context = await buildSkoposSessionContextRuntime({
    cwd: workspaceRoot,
    actor: actorId,
    host,
    sessionId,
    dryRun: false,
  });
  if (
    context.coordination?.session.sessionId !== sessionId ||
    context.coordination.session.host !== host ||
    context.coordination.session.actorId !== actorId
  ) {
    throw new Error('Host delivery confirmation must match the requested live coding-agent Session exactly.');
  }
  const expectedDigest = digest(context.communicationContract);
  if (
    communicationContractMarker !== context.communicationContract.marker ||
    communicationContractDigest !== expectedDigest
  ) {
    throw new Error('Host delivery confirmation does not match current delivered Session context.');
  }
  const now = new Date().toISOString();
  const receipt: SkoposSetupHostDeliveryReceiptArtifact = {
      schemaVersion: 1,
      id: `setup-host-delivery-${digest({ host, sessionId, actorId }).slice(0, 12)}`,
      type: 'setup-host-delivery-receipt',
      status: 'generated',
      authority: 'generated',
      generatedAt: now,
      updatedAt: now,
      summary: `Current Skopos context was delivered to ${host} Session ${sessionId}.`,
      workspaceRoot,
      host,
      sessionId,
      actorId,
      communicationContractMarker: context.communicationContract.marker,
      communicationContractDigest: digest(context.communicationContract),
      instructionSourcePath,
      instructionSourceDigest,
      deliveredAt: now,
      deliveryAuthority: 'host-confirmed',
  };
  await writeJsonArtifact({ artifactPath: path, artifact: receipt, dryRun });
  return receipt;
};

export const confirmSkoposSetupHostDelivery = async (
  options: ConfirmSkoposSetupHostDeliveryRuntimeOptions,
): Promise<SkoposSetupRuntimeResult> => {
  const workspaceRoot = resolve(options.cwd);
  const actorId = requireSetupActor(options.actor, 'Confirming host delivery');
  const config = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));
  if (!config) throw new Error('Host delivery confirmation requires an initialized Skopos project.');
  const instructionSourcePath = config.agents.canonicalInstructions;
  const instructionSourceDigest = await digestFile(join(workspaceRoot, instructionSourcePath));
  await confirmSkoposSetupHostDeliveryRuntime({
    workspaceRoot,
    actorId,
    host: requireNonEmpty(options.host, '--host'),
    sessionId: requireNonEmpty(options.sessionId, '--session-id'),
    communicationContractMarker: requireNonEmpty(options.communicationContractMarker, '--context-marker'),
    communicationContractDigest: requireSha256(options.communicationContractDigest, '--context-digest'),
    instructionSourcePath,
    instructionSourceDigest,
    dryRun: options.dryRun ?? false,
  });
  return buildSkoposSetupRuntime({
    cwd: workspaceRoot,
    actor: actorId,
    host: options.host,
    sessionId: options.sessionId,
    dryRun: options.dryRun,
  });
};

const readValidHostDeliveryReceipt = async ({
  workspaceRoot,
  actorId,
  host,
  sessionId,
  instructionSourcePath,
  instructionSourceDigest,
}: {
  workspaceRoot: string;
  actorId?: string;
  host?: string;
  sessionId?: string;
  instructionSourcePath: string;
  instructionSourceDigest: string;
}): Promise<SkoposSetupHostDeliveryReceiptArtifact | undefined> => {
  if (!actorId || !host || !sessionId) return undefined;
  const receipt = await readOptionalJson<SkoposSetupHostDeliveryReceiptArtifact>(
    join(workspaceRoot, SKOPOS_SETUP_HOST_DELIVERY_PATH),
  );
  if (!receipt || receipt.deliveryAuthority !== 'host-confirmed') return undefined;
  if (
    receipt.actorId !== actorId ||
    receipt.host !== host ||
    receipt.sessionId !== sessionId ||
    receipt.instructionSourcePath !== instructionSourcePath ||
    receipt.instructionSourceDigest !== instructionSourceDigest
  ) return undefined;
  const context = await buildSkoposSessionContextRuntime({
    cwd: workspaceRoot,
    actor: actorId,
    host,
    sessionId,
    dryRun: false,
  });
  if (
    context.coordination?.session.sessionId !== sessionId ||
    context.coordination.session.host !== host ||
    context.coordination.session.actorId !== actorId ||
    context.communicationContract.marker !== receipt.communicationContractMarker ||
    digest(context.communicationContract) !== receipt.communicationContractDigest
  ) return undefined;
  return receipt;
};

const readOptionalJson = async <T>(path: string): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
};

const requireSetupActor = (actor: string | undefined, action: string): string => {
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) throw new Error(`${action} requires an explicit actor.`);
  return actorId;
};

const requireNonEmpty = (value: string | undefined, option: string): string => {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`Host delivery confirmation requires ${option}.`);
  return normalized;
};

const requireSha256 = (value: string | undefined, option: string): string => {
  const normalized = requireNonEmpty(value, option);
  if (!/^[a-f0-9]{64}$/u.test(normalized)) {
    throw new Error(`${option} must be a lowercase SHA-256 digest.`);
  }
  return normalized;
};

const safeSetupId = (value: string): string =>
  value.replaceAll(/[^a-z0-9.-]/giu, '-');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const assertWorkspaceRelativePath = (path: unknown, label: string): string => {
  if (typeof path !== 'string' || path.trim().length === 0) {
    throw new Error(`${label} must be a non-empty workspace-relative path.`);
  }
  const normalized = path.replaceAll('\\', '/');
  if (isAbsolute(normalized) || normalized.split('/').includes('..')) {
    throw new Error(`${label} must stay inside the workspace: ${path}`);
  }
  return normalized.replace(/^\.\//u, '');
};

const assertStringArray = (value: unknown, label: string): string[] => {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  return value.map((entry, index) => {
    if (typeof entry !== 'string' || entry.trim().length === 0) {
      throw new Error(`${label}[${index}] must be a non-empty string.`);
    }
    return entry.trim();
  });
};

const assertNonEmptyString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value.trim();
};

const assertPathArray = (value: unknown, label: string): string[] =>
  assertStringArray(value, label).map((entry, index) =>
    assertWorkspaceRelativePath(entry, `${label}[${index}]`),
  );

const validateSetupAnalysisInput = (
  value: unknown,
): Omit<SkoposSetupAnalysisArtifact, keyof import('@skopos/model').SkoposArtifactEnvelope<string>> => {
  if (!isRecord(value)) throw new Error('Setup analysis input must be a JSON object.');
  const normalized = structuredClone(value) as Record<string, unknown>;
  const claims = Array.isArray(normalized.claims) ? normalized.claims : undefined;
  const materialQuestions = Array.isArray(normalized.materialQuestions) ? normalized.materialQuestions : undefined;
  const scopeProposals = Array.isArray(normalized.scopeProposals) ? normalized.scopeProposals : undefined;
  const documentOperations = Array.isArray(normalized.documentOperations) ? normalized.documentOperations : undefined;
  if (!claims || !materialQuestions || !scopeProposals || !documentOperations) {
    throw new Error('Setup analysis must include claims, materialQuestions, scopeProposals, and documentOperations arrays.');
  }
  for (const [collectionName, collection] of [
    ['claims', claims],
    ['materialQuestions', materialQuestions],
    ['scopeProposals', scopeProposals],
    ['documentOperations', documentOperations],
  ] as const) {
    const seen = new Set<string>();
    for (const [index, entry] of collection.entries()) {
      if (!isRecord(entry) || typeof entry.id !== 'string' || !/^[a-z0-9][a-z0-9._-]*$/iu.test(entry.id)) {
        throw new Error(`${collectionName}[${index}] must have a stable id.`);
      }
      if (seen.has(entry.id)) throw new Error(`${collectionName} contains duplicate id ${entry.id}.`);
      seen.add(entry.id);
      entry.evidencePaths = assertPathArray(entry.evidencePaths, `${collectionName}[${index}].evidencePaths`);
    }
  }
  const validClaimKinds = new Set(['fact', 'inference', 'contradiction', 'unknown']);
  for (const [index, claim] of claims.entries()) {
    if (!isRecord(claim) || !validClaimKinds.has(String(claim.kind))) {
      throw new Error(`claims[${index}].kind is invalid.`);
    }
    claim.summary = assertNonEmptyString(claim.summary, `claims[${index}].summary`);
  }
  for (const [index, question] of materialQuestions.entries()) {
    if (!isRecord(question)) continue;
    question.question = assertNonEmptyString(question.question, `materialQuestions[${index}].question`);
    question.whyItMatters = assertNonEmptyString(question.whyItMatters, `materialQuestions[${index}].whyItMatters`);
    question.recommendedOptionId = assertNonEmptyString(
      question.recommendedOptionId,
      `materialQuestions[${index}].recommendedOptionId`,
    );
    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new Error(`materialQuestions[${index}].options must contain at least two choices.`);
    }
    const optionIds = new Set<string>();
    for (const [optionIndex, option] of question.options.entries()) {
      if (!isRecord(option)) {
        throw new Error(`materialQuestions[${index}].options[${optionIndex}] must be an object.`);
      }
      const optionId = assertNonEmptyString(option.id, `materialQuestions[${index}].options[${optionIndex}].id`);
      option.id = optionId;
      option.label = assertNonEmptyString(option.label, `materialQuestions[${index}].options[${optionIndex}].label`);
      option.rationale = assertNonEmptyString(option.rationale, `materialQuestions[${index}].options[${optionIndex}].rationale`);
      if (optionIds.has(optionId)) {
        throw new Error(`materialQuestions[${index}].options contains duplicate id ${optionId}.`);
      }
      optionIds.add(optionId);
    }
    if (!optionIds.has(String(question.recommendedOptionId))) {
      throw new Error(`materialQuestions[${index}].recommendedOptionId must match an option.`);
    }
  }
  const validScopeKinds = new Set<string>(SKOPOS_SCOPE_KINDS);
  for (const [index, proposal] of scopeProposals.entries()) {
    if (!isRecord(proposal)) continue;
    proposal.title = assertNonEmptyString(proposal.title, `scopeProposals[${index}].title`);
    proposal.rationale = assertNonEmptyString(proposal.rationale, `scopeProposals[${index}].rationale`);
    if (!validScopeKinds.has(String(proposal.kind))) {
      throw new Error(`scopeProposals[${index}].kind is invalid.`);
    }
    const codeRoots = assertPathArray(proposal.codeRoots, `scopeProposals[${index}].codeRoots`);
    proposal.codeRoots = codeRoots;
    if (codeRoots.length === 0) {
      throw new Error(`scopeProposals[${index}].codeRoots must contain at least one path.`);
    }
    proposal.memoryRoot = assertWorkspaceRelativePath(proposal.memoryRoot, `scopeProposals[${index}].memoryRoot`);
  }
  const validOperations = new Set(['keep', 'move', 'merge', 'split', 'rewrite', 'archive', 'delete', 'create-from-evidence']);
  for (const [index, operation] of documentOperations.entries()) {
    if (!isRecord(operation) || !validOperations.has(String(operation.operation))) {
      throw new Error(`documentOperations[${index}].operation is invalid.`);
    }
    const sourcePaths = assertPathArray(operation.sourcePaths, `documentOperations[${index}].sourcePaths`);
    const targetPaths = assertPathArray(operation.targetPaths, `documentOperations[${index}].targetPaths`);
    operation.sourcePaths = sourcePaths;
    operation.targetPaths = targetPaths;
    operation.rationale = assertNonEmptyString(operation.rationale, `documentOperations[${index}].rationale`);
    operation.retainedTruth = assertNonEmptyString(operation.retainedTruth, `documentOperations[${index}].retainedTruth`);
    if (operation.operation === 'create-from-evidence' && targetPaths.length === 0) {
      throw new Error(`documentOperations[${index}].targetPaths must contain the created path.`);
    }
    if (operation.operation !== 'create-from-evidence' && sourcePaths.length === 0) {
      throw new Error(`documentOperations[${index}].sourcePaths must contain the operated-on path.`);
    }
    if (!['none', 'low', 'material'].includes(String(operation.informationLossRisk))) {
      throw new Error(`documentOperations[${index}].informationLossRisk is invalid.`);
    }
  }
  if (Array.isArray(normalized.recommendationRevisions)) {
    for (const [index, revision] of normalized.recommendationRevisions.entries()) {
      if (!isRecord(revision)) throw new Error(`recommendationRevisions[${index}] must be an object.`);
      revision.recommendationId = assertNonEmptyString(
        revision.recommendationId,
        `recommendationRevisions[${index}].recommendationId`,
      );
      revision.evidencePaths = assertPathArray(revision.evidencePaths, `recommendationRevisions[${index}].evidencePaths`);
      for (const field of ['title', 'summary', 'reason'] as const) {
        if (revision[field] !== undefined) {
          revision[field] = assertNonEmptyString(
            revision[field],
            `recommendationRevisions[${index}].${field}`,
          );
        }
      }
      if (revision.applyRef !== undefined) {
        revision.applyRef = assertWorkspaceRelativePath(revision.applyRef, `recommendationRevisions[${index}].applyRef`);
      }
    }
  }
  return normalized as unknown as Omit<SkoposSetupAnalysisArtifact, keyof import('@skopos/model').SkoposArtifactEnvelope<string>>;
};

const validateSetupCompletionInput = (value: unknown): {
  recommendationId: string;
  recommendationSourceDigest: string;
  statement: string;
  sourcePathStates: Array<{ path: string; digest: string }>;
  sourceStateDigest: string;
} => {
  if (!isRecord(value)) throw new Error('Setup completion input must be a JSON object.');
  if (typeof value.recommendationId !== 'string' || typeof value.statement !== 'string' || !value.statement.trim()) {
    throw new Error('Setup completion requires recommendationId and a non-empty statement.');
  }
  const recommendationSourceDigest = requireSha256(
    typeof value.recommendationSourceDigest === 'string' ? value.recommendationSourceDigest : undefined,
    'recommendationSourceDigest',
  );
  const sourceStateDigest = requireSha256(
    typeof value.sourceStateDigest === 'string' ? value.sourceStateDigest : undefined,
    'sourceStateDigest',
  );
  if (!Array.isArray(value.sourcePathStates) || value.sourcePathStates.length === 0) {
    throw new Error('Setup completion requires at least one sourcePathState.');
  }
  const sourcePathStates = value.sourcePathStates.map((entry, index) => {
    if (!isRecord(entry) || typeof entry.digest !== 'string' || !/^[a-f0-9]{64}$/u.test(entry.digest)) {
      throw new Error(`sourcePathStates[${index}] must contain a workspace path and SHA-256 digest.`);
    }
    return {
      path: assertWorkspaceRelativePath(entry.path, `sourcePathStates[${index}].path`),
      digest: entry.digest,
    };
  });
  if (new Set(sourcePathStates.map((entry) => entry.path)).size !== sourcePathStates.length) {
    throw new Error('Setup completion sourcePathStates must not contain duplicate paths.');
  }
  return {
    recommendationId: value.recommendationId,
    recommendationSourceDigest,
    statement: value.statement.trim(),
    sourcePathStates,
    sourceStateDigest,
  };
};

const expectedAgentOwnedPostconditions = (
  recommendation: SkoposSetupRecommendation,
  analysis?: SkoposSetupAnalysisArtifact,
): Array<{ path: string; expectation: 'present' | 'missing' }> => {
  const operation = analysis?.documentOperations.find(
    (entry) => `memory.operation.${entry.id}` === recommendation.id,
  );
  if (operation) {
    const expected = [
      ...operation.targetPaths.map((path) => ({ path, expectation: 'present' as const })),
      ...(['move', 'archive', 'delete'].includes(operation.operation)
        ? operation.sourcePaths.map((path) => ({ path, expectation: 'missing' as const }))
        : operation.sourcePaths.map((path) => ({ path, expectation: 'present' as const }))),
    ];
    return [...new Map(expected.map((entry) => [entry.path, entry])).values()];
  }
  if (recommendation.applyKind === 'scope-review') {
    return [{ path: 'tools/skopos/scopes.yaml', expectation: 'present' }];
  }
  return recommendation.applyRef
    ? [{ path: recommendation.applyRef, expectation: 'present' }]
    : [];
};

const resolveCurrentCompletedApplyIds = async ({
  workspaceRoot,
  recommendationIds,
  recommendations,
  dispositions,
  setupAnalysis,
}: {
  workspaceRoot: string;
  recommendationIds: string[];
  recommendations: SkoposSetupRecommendation[];
  dispositions: SkoposSetupDisposition[];
  setupAnalysis?: SkoposSetupAnalysisArtifact;
}): Promise<string[]> => {
  const recommendationById = new Map(
    recommendations.map((recommendation) => [recommendation.id, recommendation]),
  );
  const currentIds: string[] = [];
  for (const recommendationId of [...new Set(recommendationIds)].sort()) {
    const recommendation = recommendationById.get(recommendationId);
    if (!recommendation) continue;
    if (!dispositions.some(
      (entry) =>
        entry.recommendationId === recommendationId &&
        entry.sourceDigest === recommendation.sourceDigest &&
        entry.disposition === 'accept',
    )) {
      continue;
    }
    if (!['agent-memory-work', 'scope-review'].includes(recommendation.applyKind)) {
      currentIds.push(recommendationId);
      continue;
    }
    const receipt = await readOptionalJson<SkoposSetupCompletionReceiptArtifact>(
      join(
        workspaceRoot,
        SKOPOS_SETUP_COMPLETION_DIRECTORY,
        `${safeSetupId(recommendationId)}.json`,
      ),
    );
    if (
      !receipt ||
      receipt.workspaceRoot !== workspaceRoot ||
      receipt.recommendationId !== recommendationId ||
      receipt.recommendationSourceDigest !== recommendation.sourceDigest ||
      !receipt.submittedByActorId?.trim() ||
      !Array.isArray(receipt.sourcePathStates) ||
      receipt.sourcePathStates.length === 0
    ) {
      continue;
    }
    try {
      const receiptPaths = receipt.sourcePathStates.map((entry, index) => {
        if (!/^[a-f0-9]{64}$/u.test(entry.digest)) {
          throw new Error(`Completion receipt path state ${index} has an invalid digest.`);
        }
        return assertWorkspaceRelativePath(
          entry.path,
          `completion receipt path state ${index}`,
        );
      });
      if (new Set(receiptPaths).size !== receiptPaths.length) continue;
      if (
        digestSkoposTaskPathStates(receipt.sourcePathStates) !==
        receipt.sourceStateDigest
      ) {
        continue;
      }
      const currentStates = await captureSkoposTaskPathStates({
        workspaceRoot,
        paths: receiptPaths,
      });
      if (
        digestSkoposTaskPathStates(currentStates) !== receipt.sourceStateDigest ||
        !agentOwnedPostconditionsMatch({
          expected: expectedAgentOwnedPostconditions(recommendation, setupAnalysis),
          states: currentStates,
        })
      ) {
        continue;
      }
      await assertAgentOwnedSemanticPostconditions({
        workspaceRoot,
        recommendation,
        setupAnalysis,
      });
      currentIds.push(recommendationId);
    } catch {
      // Checkout-local completion receipts are derived Evidence. Malformed, stale, or
      // semantically mismatched receipts lose completion credit instead of blocking setup.
    }
  }
  return currentIds;
};

const agentOwnedPostconditionsMatch = ({
  expected,
  states,
}: {
  expected: Array<{ path: string; expectation: 'present' | 'missing' }>;
  states: Array<{ path: string; digest: string }>;
}): boolean => {
  const stateByPath = new Map(states.map((entry) => [entry.path, entry.digest]));
  return expected.length > 0 && expected.every((condition) => {
    const digestValue = stateByPath.get(condition.path);
    if (!digestValue) return false;
    return condition.expectation === 'missing'
      ? digestValue === MISSING_PATH_DIGEST
      : digestValue !== MISSING_PATH_DIGEST;
  });
};

const assertAgentOwnedSemanticPostconditions = async ({
  workspaceRoot,
  recommendation,
  setupAnalysis,
}: {
  workspaceRoot: string;
  recommendation: SkoposSetupRecommendation;
  setupAnalysis?: SkoposSetupAnalysisArtifact;
}): Promise<void> => {
  if (recommendation.applyKind !== 'scope-review') return;
  const proposal = setupAnalysis?.scopeProposals.find(
    (candidate) => `scope.${candidate.id}` === recommendation.id,
  );
  if (!proposal) {
    throw new Error(
      `Setup completion for ${recommendation.id} requires an exact source-bound Scope proposal.`,
    );
  }
  const registry = await loadSkoposScopeRegistry({ cwd: workspaceRoot });
  const declared = registry?.scopes.find((scope) => scope.id === proposal.id);
  const sameCodeRoots = declared
    ? JSON.stringify([...declared.codeRoots].sort()) ===
      JSON.stringify([...proposal.codeRoots].sort())
    : false;
  if (
    !declared ||
    declared.title !== proposal.title ||
    declared.kind !== proposal.kind ||
    declared.memoryRoot !== proposal.memoryRoot ||
    !sameCodeRoots
  ) {
    throw new Error(
      `Setup completion for ${recommendation.id} does not match the approved Scope proposal.`,
    );
  }
};

const ensureLocalSetupBootstrap = async ({
  workspaceRoot,
  actorId,
  dryRun,
  refresh,
}: {
  workspaceRoot: string;
  actorId?: string;
  dryRun: boolean;
  refresh: boolean;
}): Promise<Awaited<ReturnType<typeof initSkoposProject>>> => {
  const bootstrap = await readOptionalJson<import('@skopos/model').SkoposBootstrapArtifact>(
    join(workspaceRoot, '.skopos/index/bootstrap.json'),
  );
  if (bootstrap && !refresh) {
    return { bootstrap } as Awaited<ReturnType<typeof initSkoposProject>>;
  }
  return previewFreshSetupBootstrap({ workspaceRoot, actorId });
};

const previewFreshSetupBootstrap = async ({
  workspaceRoot,
  actorId,
}: {
  workspaceRoot: string;
  actorId?: string;
}): Promise<Awaited<ReturnType<typeof initSkoposProject>>> => {
  const preview = await initSkoposProject({
    cwd: workspaceRoot,
    mode: 'existing',
    actor: actorId,
    dryRun: true,
    buildAdoptionAssessment: false,
    scaffoldInstructions: false,
    scaffoldMemoryBoundary: false,
  });
  await mkdir(join(workspaceRoot, '.skopos/index'), { recursive: true });
  const previewWrites = await Promise.allSettled([
    writeFile(join(workspaceRoot, '.skopos/index/bootstrap.json'), `${JSON.stringify(preview.bootstrap, null, 2)}\n`),
    writeFile(join(workspaceRoot, '.skopos/index/scopes.json'), `${JSON.stringify(preview.scopesLite, null, 2)}\n`),
    writeFile(join(workspaceRoot, '.skopos/index/diagnosis.json'), `${JSON.stringify(preview.diagnosis, null, 2)}\n`),
    writeFile(join(workspaceRoot, '.skopos/index/architecture.json'), `${JSON.stringify(preview.architecture, null, 2)}\n`),
    writeFile(join(workspaceRoot, '.skopos/index/enforcement.json'), `${JSON.stringify(preview.enforcement, null, 2)}\n`),
  ]);
  const failedWrite = previewWrites.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );
  if (failedWrite) throw failedWrite.reason;
  return preview;
};

const applyRecordedSetupAnswers = async ({
  workspaceRoot,
  actorId,
  dryRun,
}: {
  workspaceRoot: string;
  actorId: string;
  dryRun: boolean;
}): Promise<void> => {
  const answers = await readOptionalJson<{ answers?: Array<{ questionId: string; optionId: string }> }>(
    join(workspaceRoot, '.skopos/index/understanding/setup-answers.json'),
  );
  const configPath = join(workspaceRoot, 'skopos.config.yaml');
  if (!(await loadSkoposConfig(configPath))) {
    const recommended = await readOptionalJson<import('@skopos/model').SkoposRootConfig>(
      join(workspaceRoot, '.skopos/setup/bootstrap-recommendation.json'),
    );
    if (!recommended) {
      throw new Error('Setup Apply requires the generated bootstrap recommendation. Run skopos setup . again.');
    }
    if (!dryRun) await writeSkoposConfig(configPath, recommended);
  }
  for (const answer of answers?.answers ?? []) {
    await buildSkoposSetupAnswerRuntime({
      cwd: workspaceRoot,
      actor: actorId,
      questionId: answer.questionId,
      optionId: answer.optionId,
      dryRun,
    });
  }
};
