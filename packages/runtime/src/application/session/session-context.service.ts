import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  SKOPOS_COMMUNICATION_CONTRACT,
  SKOPOS_COMMUNICATION_CONTRACT_VERSION,
  resolveDecisionDefaultBehavior,
} from '@skopos/instructions';
import {
  SKOPOS_ADOPTION_ANALYSIS_PATH,
  SKOPOS_ADOPTION_ANALYSIS_BRIEF_PATH,
  SKOPOS_ADOPTION_ACTIVATION_PATH,
  SKOPOS_ADOPTION_APPROVAL_PATH,
  SKOPOS_ADOPTION_EXECUTION_BRIEF_PATH,
  SKOPOS_ADOPTION_INTAKE_PATH,
  SKOPOS_ADOPTION_PROPOSAL_PATH,
  SKOPOS_ADOPTION_VERIFICATION_PATH,
} from '@skopos/docs-engine';
import type {
  SkoposAdoptionApprovalArtifact,
  SkoposAdoptionActivationArtifact,
  SkoposAdoptionIntakeArtifact,
  SkoposAdoptionRestructuringProposalArtifact,
  SkoposAdoptionReviewedAnalysisArtifact,
  SkoposAdoptionState,
  SkoposAdoptionVerificationArtifact,
  SkoposAgentResponseMode,
  SkoposSessionContextRunResult,
  SkoposSessionPendingDecision,
  SkoposTaskQuestionArtifact,
  SkoposTaskQuestion,
} from '@skopos/model';

import { buildSkoposDiscussionRecentRuntime } from '../discussion/discussion.service.js';
import { buildSkoposWorkQueueRuntime } from '../work-queue/work-queue.service.js';
import { resolveCurrentTaskState } from '../shared/current-task-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import {
  ensureSkoposCoordinationSession,
  getSkoposCoordinationStatus,
} from '../coordination/coordination.service.js';

export interface BuildSkoposSessionContextRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
  sessionId?: string;
  host?: string;
  leaseSeconds?: number;
}

export const buildSkoposSessionContextRuntime = async ({
  cwd,
  actor,
  dryRun = false,
  sessionId,
  host = 'manual-cli',
  leaseSeconds,
}: BuildSkoposSessionContextRuntimeOptions): Promise<SkoposSessionContextRunResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const warnings: string[] = [];
  let coordination: SkoposSessionContextRunResult['coordination'];
  if (sessionId && !actorId) {
    warnings.push(
      'Coordination Session identity was provided without an actor; no Session was opened or renewed.',
    );
  } else if (sessionId && actorId && !dryRun) {
    try {
      const ensured = await ensureSkoposCoordinationSession({
        cwd: workspaceRoot,
        actorId,
        host,
        sessionId,
        leaseSeconds,
      });
      const status = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
      const reservation = status.reservations.find(
        (candidate) => candidate.sessionId === sessionId,
      );
      coordination = {
        enforcementLevel: ensured.enforcementLevel,
        preventiveSafety: ensured.preventiveSafety,
        session: ensured.session,
        reservation,
        claims: reservation
          ? status.claims.filter(
              (claim) => claim.taskId === reservation.taskId,
            )
          : [],
      };
    } catch (error) {
      warnings.push(`Coordination context unavailable: ${errorMessage(error)}`);
    }
  }
  const discussion = await buildSkoposDiscussionRecentRuntime({ cwd: workspaceRoot }).catch(
    (error: unknown) => {
      warnings.push(`Discussion context unavailable: ${errorMessage(error)}`);
      return undefined;
    },
  );
  const workQueue = await buildSkoposWorkQueueRuntime({
    cwd: workspaceRoot,
    actor: actorId,
    dryRun,
  }).catch((error: unknown) => {
    warnings.push(`Work Queue unavailable: ${errorMessage(error)}`);
    return undefined;
  });
  const currentTask = await resolveCurrentTaskState({
    workspaceRoot,
    actorId,
  }).catch(() => undefined);
  const openQuestions = currentTask
    ? await loadOpenQuestions(currentTask.questionsPath, warnings)
    : [];
  const orderedQuestions = [...openQuestions].sort(
    (left, right) => Number(right.blocking) - Number(left.blocking),
  );
  const taskPendingDecision = orderedQuestions[0]
    ? buildPendingDecision(orderedQuestions[0])
    : undefined;
  const adoption = await buildSkoposAdoptionSessionState(workspaceRoot, warnings);
  const pendingDecision = adoption?.pendingDecision ?? taskPendingDecision;
  const resumeSummary = compactText(
    discussion?.latestHandoff?.resumeSummary ?? discussion?.additionalContext,
    420,
  );
  const workQueueSummary = compactText(workQueue?.summary, 420);
  const nextCommand = pendingDecision
    ? undefined
    : adoption?.nextCommand ??
      undefined;
  const currentTaskId = workQueue?.currentTaskId ?? currentTask?.task.id;
  const responseMode = resolveResponseMode({
    pendingDecision,
    currentTaskId,
    resumeSummary,
  });
  const additionalPendingDecisionCount = adoption?.pendingDecision
    ? adoption.additionalDecisionCount + orderedQuestions.length
    : Math.max(0, orderedQuestions.length - 1);
  const result: SkoposSessionContextRunResult = {
    schemaVersion: SKOPOS_COMMUNICATION_CONTRACT_VERSION,
    workspaceRoot,
    summary: pendingDecision
      ? `A ${pendingDecision.blocking ? 'blocking ' : ''}user decision is pending.`
      : currentTaskId
        ? 'Current work and response guidance are ready.'
        : 'Response guidance is ready; no current Task is selected.',
    responseMode,
    communicationContract: {
      marker: SKOPOS_COMMUNICATION_CONTRACT.marker,
      tokenBudget: SKOPOS_COMMUNICATION_CONTRACT.tokenBudget,
      coreRules: SKOPOS_COMMUNICATION_CONTRACT.coreRules,
    },
    currentTaskId,
    workQueueSummary,
    nextCommand,
    resumeSummary,
    pendingDecision,
    adoption: adoption
      ? {
          state: adoption.state,
          assessmentOnly: adoption.assessmentOnly,
          ...(adoption.proposalDigest
            ? { proposalDigest: adoption.proposalDigest }
            : {}),
        }
      : undefined,
    coordination,
    additionalPendingDecisionCount,
    warnings,
    additionalContext: '',
  };

  result.additionalContext = renderSkoposSessionAdditionalContext(result);
  return result;
};

export interface SkoposAdoptionSessionState {
  state: SkoposAdoptionState;
  assessmentOnly: boolean;
  proposalDigest?: string;
  pendingDecision?: SkoposSessionPendingDecision;
  additionalDecisionCount: number;
  nextCommand?: string;
}

export const buildSkoposAdoptionSessionState = async (
  workspaceRoot: string,
  warnings: string[],
): Promise<SkoposAdoptionSessionState | undefined> => {
  const [intake, analysis, proposal, approval, verification, activation] =
    await Promise.all([
    readOptionalJson<SkoposAdoptionIntakeArtifact>(
      `${workspaceRoot}/${SKOPOS_ADOPTION_INTAKE_PATH}`,
      warnings,
      'Adoption intake',
    ),
    readOptionalJson<SkoposAdoptionReviewedAnalysisArtifact>(
      `${workspaceRoot}/${SKOPOS_ADOPTION_ANALYSIS_PATH}`,
      warnings,
      'Adoption reviewed analysis',
    ),
    readOptionalJson<SkoposAdoptionRestructuringProposalArtifact>(
      `${workspaceRoot}/${SKOPOS_ADOPTION_PROPOSAL_PATH}`,
      warnings,
      'Adoption restructuring proposal',
    ),
    readOptionalJson<SkoposAdoptionApprovalArtifact>(
      `${workspaceRoot}/${SKOPOS_ADOPTION_APPROVAL_PATH}`,
      warnings,
      'Adoption proposal approval',
    ),
    readOptionalJson<SkoposAdoptionVerificationArtifact>(
      `${workspaceRoot}/${SKOPOS_ADOPTION_VERIFICATION_PATH}`,
      warnings,
      'Adoption standard verification',
    ),
    readOptionalJson<SkoposAdoptionActivationArtifact>(
      `${workspaceRoot}/${SKOPOS_ADOPTION_ACTIVATION_PATH}`,
      warnings,
      'Adoption activation',
    ),
  ]);

  if (!intake && !analysis && !proposal && !approval && !verification && !activation) {
    return undefined;
  }

  if (
    activation &&
    verification &&
    proposal &&
    activation.proposalDigest === proposal.proposalDigest &&
    verification.proposalDigest === proposal.proposalDigest
  ) {
    return {
      state: 'agent-ready',
      assessmentOnly: false,
      proposalDigest: proposal.proposalDigest,
      additionalDecisionCount: 0,
      nextCommand: 'Project Memory adoption is active; continue through normal Skopos task routing.',
    };
  }

  if (
    verification &&
    proposal &&
    approval &&
    verification.proposalDigest === proposal.proposalDigest &&
    approval.proposalDigest === proposal.proposalDigest
  ) {
    return {
      state: 'standard-verified',
      assessmentOnly: false,
      proposalDigest: proposal.proposalDigest,
      additionalDecisionCount: 0,
      nextCommand:
        'Standard verification passed. Complete explicit adoption activation before claiming agent-ready.',
    };
  }

  if (
    approval &&
    proposal &&
    approval.proposalDigest === proposal.proposalDigest
  ) {
    return {
      state: 'restructuring',
      assessmentOnly: false,
      proposalDigest: proposal.proposalDigest,
      additionalDecisionCount: 0,
      nextCommand: `Open ${SKOPOS_ADOPTION_EXECUTION_BRIEF_PATH}, execute only its approved operations through project-aware coding-agent tools, complete its evidence template, then run its verification command.`,
    };
  }

  if (proposal) {
    return {
      state: 'restructuring-proposed',
      assessmentOnly: true,
      proposalDigest: proposal.proposalDigest,
      pendingDecision: buildProposalApprovalDecision(proposal),
      additionalDecisionCount: 0,
    };
  }

  if (analysis?.materialQuestions.length) {
    const [question, ...additionalQuestions] = analysis.materialQuestions;
    return {
      state: 'questions-open',
      assessmentOnly: true,
      pendingDecision: {
        id: question!.id,
        question: question!.question,
        escalation: 'must-ask',
        blocking: true,
        whyItMatters: question!.whyItMatters,
        recommendedOptionId: question!.recommendedOptionId,
        recommendedOption: question!.options.find(
          (option) => option.id === question!.recommendedOptionId,
        ),
        alternatives: question!.options.filter(
          (option) => option.id !== question!.recommendedOptionId,
        ),
        defaultBehavior: 'wait-for-answer',
        whatHappensAfterAnswer: question!.whatHappensAfterAnswer,
        source: 'adoption-question',
      },
      additionalDecisionCount: additionalQuestions.length,
    };
  }

  if (analysis) {
    return {
      state: analysis.adoptionState,
      assessmentOnly: true,
      additionalDecisionCount: 0,
      nextCommand: `skopos adopt propose . --analysis <reviewed-analysis-input> --actor <id>`,
    };
  }

  return {
    state: 'agent-analysis-required',
    assessmentOnly: true,
    additionalDecisionCount: 0,
    nextCommand: `cat ${SKOPOS_ADOPTION_ANALYSIS_BRIEF_PATH}`,
  };
};

const buildProposalApprovalDecision = (
  proposal: SkoposAdoptionRestructuringProposalArtifact,
): SkoposSessionPendingDecision => {
  const materialRiskCount = proposal.informationLossRisks.filter(
    (entry) => entry.risk === 'material',
  ).length;
  const approveOption = {
    id: 'approve-proposal',
    label: 'Approve exact proposal',
    rationale:
      materialRiskCount > 0
        ? `Authorizes ${proposal.operations.length} exact operations and explicitly accepts ${materialRiskCount} material information-loss risk${materialRiskCount === 1 ? '' : 's'}.`
        : `Authorizes only the ${proposal.operations.length} operations bound to this proposal digest.`,
  };
  const reviseOption = {
    id: 'revise-proposal',
    label: 'Request revision',
    rationale: 'Return the proposal to agent review without authorizing document changes.',
  };
  const cancelOption = {
    id: 'cancel-adoption',
    label: 'Stop at assessment',
    rationale: 'Keep the project assessment-only and do not claim full adoption.',
  };
  const recommendedOption = materialRiskCount > 0 ? reviseOption : approveOption;

  return {
    id: `adoption.proposal.${proposal.proposalDigest.slice(0, 12)}`,
    question: `Approve restructuring proposal ${proposal.proposalDigest.slice(0, 12)} with ${proposal.operations.length} document operation${proposal.operations.length === 1 ? '' : 's'}?`,
    escalation: 'must-ask',
    blocking: true,
    whyItMatters:
      materialRiskCount > 0
        ? `The proposal includes ${materialRiskCount} material information-loss risk${materialRiskCount === 1 ? '' : 's'} and cannot execute without explicit acknowledgement.`
        : 'Approval authorizes exact moves, merges, splits, rewrites, archives, or deletions; Skopos must not infer consent.',
    recommendedOptionId: recommendedOption.id,
    recommendedOption,
    alternatives: [approveOption, reviseOption, cancelOption].filter(
      (option) => option.id !== recommendedOption.id,
    ),
    defaultBehavior: 'require-explicit-approval',
    whatHappensAfterAnswer: `If approved, run \`skopos adopt approve . --proposal ${proposal.proposalDigest} --actor <id> --reason <text>${materialRiskCount > 0 ? ' --accept-material-risk' : ''}\`. Revision or cancellation leaves all project documents unchanged.`,
    source: 'adoption-approval',
  };
};

const readOptionalJson = async <T>(
  path: string,
  warnings: string[],
  label: string,
): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if (isMissingFileError(error)) return undefined;
    warnings.push(`${label} unavailable: ${errorMessage(error)}`);
    return undefined;
  }
};

const loadOpenQuestions = async (
  questionsPath: string,
  warnings: string[],
): Promise<SkoposTaskQuestion[]> => {
  try {
    const artifact = JSON.parse(
      await readFile(questionsPath, 'utf8'),
    ) as SkoposTaskQuestionArtifact;
    return artifact.entries.filter((entry) => entry.status === 'open');
  } catch (error) {
    if (isMissingFileError(error)) {
      return [];
    }
    warnings.push(`Pending decisions unavailable: ${errorMessage(error)}`);
    return [];
  }
};

const buildPendingDecision = (
  question: SkoposTaskQuestion,
): SkoposSessionPendingDecision => {
  const recommendedOption = question.options.find(
    (option) => option.id === question.recommendedOptionId,
  );

  return {
    id: question.id,
    question: question.question,
    escalation: question.escalation,
    blocking: question.blocking,
    whyItMatters: question.whyItMatters,
    recommendedOptionId: question.recommendedOptionId,
    recommendedOption,
    alternatives: question.options.filter(
      (option) => option.id !== question.recommendedOptionId,
    ),
    defaultBehavior: resolveDecisionDefaultBehavior(question.escalation),
    whatHappensAfterAnswer: 'Skopos updates the Task admission state and recomputes the Work Queue.',
    source: 'task',
  };
};

const resolveResponseMode = ({
  pendingDecision,
  currentTaskId,
  resumeSummary,
}: {
  pendingDecision?: SkoposSessionPendingDecision;
  currentTaskId?: string;
  resumeSummary?: string;
}): SkoposAgentResponseMode => {
  if (pendingDecision) {
    return 'decision';
  }
  if (currentTaskId) {
    return resumeSummary ? 'progress' : 'work-start';
  }
  return 'direct-answer';
};

export const renderSkoposSessionAdditionalContext = (
  context: SkoposSessionContextRunResult,
): string => {
  const lines = [
    context.communicationContract.marker,
    `Response mode: ${context.responseMode}`,
    ...context.communicationContract.coreRules.map((rule) => `- ${rule}`),
  ];

  if (context.resumeSummary) {
    lines.push('', `Resume: ${context.resumeSummary}`);
  }
  if (context.workQueueSummary) {
    lines.push(`Work Queue: ${context.workQueueSummary}`);
  }
  if (context.nextCommand) {
    lines.push(`Next command: ${context.nextCommand}`);
  }
  if (context.adoption) {
    lines.push(
      `Adoption state: ${context.adoption.state}${context.adoption.assessmentOnly ? ' (assessment only)' : ''}`,
    );
    if (context.adoption.proposalDigest) {
      lines.push(`Adoption proposal: ${context.adoption.proposalDigest}`);
    }
  }
  if (context.coordination) {
    lines.push(
      `Coordination: ${context.coordination.enforcementLevel}; Session ${context.coordination.session.sessionId} is ${context.coordination.session.state}; preventive safety: no.`,
    );
    if (context.coordination.reservation) {
      lines.push(
        `Reserved Task: ${context.coordination.reservation.taskId}; resource claims: ${context.coordination.claims.length}.`,
      );
    } else {
      lines.push(
        'No writing Task is reserved. Pass this Session id to `skopos start --session-id <id> --host <host>` before editing.',
      );
    }
  }

  const decision = context.pendingDecision;
  if (decision) {
    lines.push(
      '',
      'Pending decision:',
      `Question: ${decision.question}`,
      `Recommended: ${decision.recommendedOption?.label ?? decision.recommendedOptionId}`,
      `Reason: ${decision.whyItMatters}`,
      `Default behavior: ${decision.defaultBehavior}`,
      `Blocking: ${decision.blocking ? 'yes' : 'no'}`,
    );
    if (decision.recommendedOption?.rationale) {
      lines.push(`Recommendation tradeoff: ${decision.recommendedOption.rationale}`);
    }
    if (decision.alternatives.length > 0) {
      lines.push(
        'Alternatives:',
        ...decision.alternatives.map(
          (option) => `- ${option.label}: ${option.rationale}`,
        ),
      );
    }
    lines.push(`After the answer: ${decision.whatHappensAfterAnswer}`);
    if (context.additionalPendingDecisionCount > 0) {
      lines.push(
        `${context.additionalPendingDecisionCount} additional decision${context.additionalPendingDecisionCount === 1 ? '' : 's'} remain queued; ask one directional question at a time.`,
      );
    }
  }

  if (context.warnings.length > 0) {
    lines.push('', ...context.warnings.map((warning) => `Context warning: ${warning}`));
  }

  return lines.join('\n');
};

const compactText = (value: string | undefined, limit: number): string | undefined => {
  const compact = value?.replace(/\s+/g, ' ').trim();
  if (!compact) {
    return undefined;
  }
  return compact.length <= limit ? compact : `${compact.slice(0, limit - 1)}…`;
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
