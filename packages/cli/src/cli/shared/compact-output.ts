import type {
  SkoposBackgroundEvalRunResult,
  SkoposDecisionQuestion,
  SkoposDoneReport,
  SkoposEvalRunResult,
  SkoposJobShowRunResult,
  SkoposMissionArtifact,
  SkoposNextRunResult,
  SkoposProgramNextRunResult,
  SkoposProgramSyncRunResult,
  SkoposTrustCheck,
  SkoposTrustReport,
  SkoposWorkflowQuestionEntry,
} from '@skopos/model';

type MissionProgressPhase =
  | 'planning'
  | 'implementation'
  | 'verification'
  | 'closure'
  | 'blocked'
  | 'complete';

type CompactTransportSurfaceKind = 'compact-command-response' | 'compact-human-response';

export interface CompactTransportBudget {
  surfaceKind: CompactTransportSurfaceKind;
  title: string;
  estimatedTokens: number;
  budgetTokens: number;
  status: 'within-budget' | 'over-budget';
  summary: string;
}

const COMPACT_RESPONSE_BUDGET_TOKENS = 700;

const estimateTransportTokens = (value: string): number => {
  const normalized = value.trim();
  return normalized.length === 0 ? 0 : Math.ceil(normalized.length / 4);
};

export const buildCompactTransportBudget = ({
  title,
  surfaceKind,
  value,
  budgetTokens = COMPACT_RESPONSE_BUDGET_TOKENS,
}: {
  title: string;
  surfaceKind: CompactTransportSurfaceKind;
  value: unknown;
  budgetTokens?: number;
}): CompactTransportBudget => {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  const estimatedTokens = estimateTransportTokens(serialized ?? '');
  const status = estimatedTokens > budgetTokens ? 'over-budget' : 'within-budget';

  return {
    surfaceKind,
    title,
    estimatedTokens,
    budgetTokens,
    status,
    summary:
      status === 'over-budget'
        ? `${title} is over the compact response budget. Ask for specific fields or summary output before loading it into agent context.`
        : `${title} is within the compact response budget.`,
  };
};

const withCompactTransportBudget = <T extends Record<string, unknown>>(title: string, output: T): T & {
  transportBudget: CompactTransportBudget;
} => ({
  ...output,
  transportBudget: buildCompactTransportBudget({
    title,
    surfaceKind: 'compact-command-response',
    value: output,
  }),
});

const maybeAppendCompactTransportWarning = (title: string, lines: string[]): string[] => {
  const budget = buildCompactTransportBudget({
    title,
    surfaceKind: 'compact-human-response',
    value: lines.join('\n'),
  });

  if (budget.status === 'within-budget') {
    return lines;
  }

  return [
    ...lines.slice(0, -2),
    'Transport warning:',
    budget.summary,
    ...lines.slice(-2),
  ];
};

const summarizeTrustChecks = (checks: SkoposTrustCheck[]) => ({
  pass: checks.filter((check) => check.status === 'pass').length,
  warn: checks.filter((check) => check.status === 'warn').length,
  fail: checks.filter((check) => check.status === 'fail').length,
});

const summarizeEvalChecks = (checks: SkoposEvalRunResult['eval']['checkRuns']) => ({
  pass: checks.filter((check) => check.status === 'pass').length,
  fail: checks.filter((check) => check.status === 'fail').length,
  skipped: checks.filter((check) => check.status === 'skipped').length,
});

const describeReviewStatus = (status: 'complete' | 'needs-review' | 'blocked'): string => {
  if (status === 'complete') {
    return 'Looks good';
  }

  if (status === 'blocked') {
    return 'Blocked';
  }

  return 'Review needed';
};

const pickAttentionChecks = (checks: SkoposTrustCheck[]) =>
  checks
    .filter((check) => check.status !== 'pass')
    .map((check) => ({
      id: check.id,
      status: check.status,
      summary: check.summary,
    }));

const describeTrustStatus = (report: SkoposTrustReport): string => {
  if (report.checks.some((check) => check.status === 'fail') || report.trustLevel === 'low') {
    return 'Fix before closing';
  }

  if (report.checks.some((check) => check.status === 'warn') || report.readiness !== 'agent-ready') {
    return 'Review needed';
  }

  return 'Looks good';
};

const describeAttentionStatus = (status: SkoposTrustCheck['status']): string => {
  if (status === 'fail') {
    return 'Fix before closing';
  }

  if (status === 'warn') {
    return 'Review this';
  }

  return 'Looks good';
};

const buildTrustNextStep = (report: SkoposTrustReport): string => {
  const firstFailingCheck = report.checks.find((check) => check.status === 'fail');
  if (firstFailingCheck) {
    return `Fix \`${firstFailingCheck.id}\`, then run \`skopos trust\` again.`;
  }

  const firstWarningCheck = report.checks.find((check) => check.status === 'warn');
  if (firstWarningCheck) {
    return `Review \`${firstWarningCheck.id}\`, then run \`skopos trust\` again before closing the work.`;
  }

  return 'Continue with the planned work. Run focused checks and `skopos trust` again before closure if files change.';
};

const buildDoneNextStep = (report: SkoposDoneReport): string => {
  if (report.requiredActions.length > 0) {
    return report.requiredActions[0];
  }

  if (report.closureStatus === 'complete') {
    return 'Work can be closed. Keep the report with the completed change as proof.';
  }

  return 'Review the attention items, then run `skopos done` again before closing.';
};

const buildEvalNextStep = (result: SkoposEvalRunResult): string => {
  if (result.nextCommand) {
    return result.nextCommand;
  }

  if (result.eval.evaluationStatus === 'complete') {
    return 'Run `skopos done` to verify closure.';
  }

  const firstFailedCheck = result.eval.checkRuns.find((check) => check.status === 'fail');
  if (firstFailedCheck) {
    return `Fix \`${firstFailedCheck.command}\`, then run \`skopos eval\` again.`;
  }

  return 'Review the evaluation items, then run `skopos eval` again.';
};

const buildProgramNextStep = (result: SkoposProgramNextRunResult): string => {
  if (result.nextCommand) {
    return result.nextCommand;
  }

  if (result.recommendedItem) {
    return `Work on: ${result.recommendedItem.title}.`;
  }

  return 'No program item needs action right now.';
};

const buildProgramSyncNextStep = (result: SkoposProgramSyncRunResult): string => {
  if (result.nextCommand) {
    return result.nextCommand;
  }

  if (result.doNowItem) {
    return `Continue with: ${result.doNowItem.title}.`;
  }

  return 'No active program item needs action right now.';
};

const describeProgramDisposition = (
  disposition: SkoposProgramNextRunResult['currentDisposition'],
): string => {
  if (disposition === 'idle') {
    return 'No active work';
  }

  if (disposition === 'interrupt-current') {
    return 'Change direction';
  }

  return 'Ready for next action';
};

const describeNextStatus = (result: SkoposNextRunResult): string => {
  if (result.blockingQuestions.length > 0) {
    return 'Blocked';
  }

  if (result.trust.checks.some((check) => check.status === 'fail')) {
    return 'Fix before continuing';
  }

  if (result.trust.checks.some((check) => check.status === 'warn')) {
    return 'Review needed';
  }

  return 'Ready for next action';
};

const buildNextStep = (result: SkoposNextRunResult): string => {
  if (result.nextCommand) {
    return result.nextCommand;
  }

  if (result.blockingQuestions.length > 0) {
    return 'Answer the blocking question, then run `skopos next` again.';
  }

  if (result.nextItem) {
    return `Work on: ${result.nextItem.title}.`;
  }

  return 'No next item is available. Review the mission state before continuing.';
};

const summarizeMissionProgress = (
  mission: SkoposMissionArtifact,
  options: {
    blockingQuestionCount?: number;
    evalStatus?: SkoposEvalRunResult['eval']['evaluationStatus'];
  } = {},
) => {
  const total = mission.items.length;
  const completed = mission.items.filter((item) => item.status === 'complete').length;
  const pending = Math.max(total - completed, 0);
  const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
  const phase = deriveMissionPhase(mission, {
    pending,
    blockingQuestionCount: options.blockingQuestionCount ?? 0,
    evalStatus: options.evalStatus,
  });

  return {
    total,
    completed,
    pending,
    percent,
    phase,
    completedItems: mission.items.filter((item) => item.status === 'complete'),
    pendingItems: mission.items.filter((item) => item.status !== 'complete'),
  };
};

const summarizeCompactMissionProgress = (
  mission: SkoposMissionArtifact,
  options: {
    blockingQuestionCount?: number;
    evalStatus?: SkoposEvalRunResult['eval']['evaluationStatus'];
  } = {},
) => {
  const progress = summarizeMissionProgress(mission, options);

  return {
    total: progress.total,
    completed: progress.completed,
    pending: progress.pending,
    percent: progress.percent,
    phase: progress.phase,
    completedItemTitles: progress.completedItems.slice(0, 3).map((item) => item.title),
    pendingItemTitles: progress.pendingItems.slice(0, 3).map((item) => item.title),
  };
};

const deriveMissionPhase = (
  mission: SkoposMissionArtifact,
  options: {
    pending: number;
    blockingQuestionCount: number;
    evalStatus?: SkoposEvalRunResult['eval']['evaluationStatus'];
  },
): MissionProgressPhase => {
  if (mission.state === 'complete' || options.evalStatus === 'complete') {
    return 'complete';
  }

  if (mission.state === 'blocked' || options.blockingQuestionCount > 0) {
    return 'blocked';
  }

  if (mission.items.some((item) => item.kind === 'decision' && item.status !== 'complete')) {
    return 'planning';
  }

  if (
    mission.items.some(
      (item) =>
        (item.kind === 'implementation' || item.kind === 'workflow' || item.kind === 'docs') &&
        item.status !== 'complete',
    )
  ) {
    return 'implementation';
  }

  if (
    mission.items.some((item) => item.kind === 'validation' && item.status !== 'complete') ||
    options.evalStatus === 'needs-review'
  ) {
    return 'verification';
  }

  if (options.pending === 0) {
    return 'closure';
  }

  return 'implementation';
};

const formatMissionProgress = (mission: SkoposMissionArtifact, completed: number, total: number, percent: number): string => {
  if (total === 0) {
    return `${mission.state}; no checklist items are tracked yet.`;
  }

  return `${completed} of ${total} checklist items complete (about ${percent}%).`;
};

const summarizeItemTitles = (items: SkoposMissionArtifact['items']): string =>
  items.length === 0 ? 'None yet.' : items.slice(0, 3).map((item) => item.title).join('; ');

const summarizeMissionDecisionProgress = (mission: SkoposMissionArtifact): string => {
  const decisionItems = mission.items.filter((item) => item.kind === 'decision');
  if (decisionItems.length === 0) {
    return 'No decision items are tracked for this mission.';
  }

  const completed = decisionItems.filter((item) => item.status === 'complete').length;
  const pending = decisionItems.length - completed;
  if (pending === 0) {
    return `${completed} of ${decisionItems.length} decision${decisionItems.length === 1 ? '' : 's'} complete.`;
  }

  return `${pending} of ${decisionItems.length} decision${decisionItems.length === 1 ? '' : 's'} still need attention.`;
};

const summarizeMissionFindingProgress = (
  mission: SkoposMissionArtifact,
  findingCount = 0,
): string => {
  const linkedSliceCount = mission.linkedSlices?.length ?? 0;
  const parts: string[] = [];

  if (findingCount > 0) {
    parts.push(`${findingCount} finding${findingCount === 1 ? '' : 's'} visible in trust.`);
  }

  if (linkedSliceCount > 0) {
    parts.push(`${linkedSliceCount} linked follow-up slice${linkedSliceCount === 1 ? '' : 's'}.`);
  }

  return parts.length === 0 ? 'No active findings or follow-up slices are linked here.' : parts.join(' ');
};

const countProgramFindings = (
  result: SkoposProgramNextRunResult | SkoposProgramSyncRunResult,
): number => result.state.items.filter((item) => item.sourceKind === 'finding' && item.status !== 'done').length;

const countTrustFindings = (trust: unknown): number => {
  if (!trust || typeof trust !== 'object' || !('findings' in trust)) {
    return 0;
  }

  const findings = (trust as { findings?: unknown }).findings;
  return Array.isArray(findings) ? findings.length : 0;
};

const formatQuestionOptions = (
  question: SkoposDecisionQuestion | SkoposWorkflowQuestionEntry,
): string[] =>
  question.options.map((option) => {
    const recommendationSuffix = option.id === question.recommendedOptionId ? ' (recommended)' : '';
    return `- ${option.label}${recommendationSuffix}: ${option.rationale}`;
  });

const formatGuidedQuestionLines = (
  question: SkoposDecisionQuestion | SkoposWorkflowQuestionEntry,
): string[] => {
  const recommendedOption = question.options.find(
    (option) => option.id === question.recommendedOptionId,
  );
  const lines = [
    `Question: ${question.question}`,
    `Recommended: ${recommendedOption?.label ?? question.recommendedOptionId}`,
    `Why this matters: ${question.whyItMatters}`,
    'Options:',
    ...formatQuestionOptions(question),
  ];

  if ('whatHappensAfterAnswer' in question) {
    lines.push(`After you answer: ${question.whatHappensAfterAnswer}`);
  }

  return lines;
};

export const buildGuidedDecisionQuestionLines = (
  questions: SkoposDecisionQuestion[],
): string[] => {
  if (questions.length === 0) {
    return [];
  }

  const lines = ['Questions:'];
  for (const question of questions) {
    lines.push(...formatGuidedQuestionLines(question));
  }

  return lines;
};

export const buildGuidedWorkflowQuestionLines = (
  questions: SkoposWorkflowQuestionEntry[],
): string[] => {
  if (questions.length === 0) {
    return [];
  }

  const lines = ['Questions:'];
  for (const question of questions) {
    lines.push(...formatGuidedQuestionLines(question));
  }

  return lines;
};

const buildMissionProgressLines = ({
  mission,
  blockingQuestionCount = 0,
  findingCount = 0,
  doingNow,
  nextStep,
  evalStatus,
}: {
  mission: SkoposMissionArtifact;
  blockingQuestionCount?: number;
  findingCount?: number;
  doingNow?: string;
  nextStep?: string;
  evalStatus?: SkoposEvalRunResult['eval']['evaluationStatus'];
}): string[] => {
  const progress = summarizeMissionProgress(mission, {
    blockingQuestionCount,
    evalStatus,
  });

  return [
    `Progress: ${formatMissionProgress(mission, progress.completed, progress.total, progress.percent)}`,
    `Current phase: ${progress.phase}`,
    `Done: ${summarizeItemTitles(progress.completedItems)}`,
    `Doing now: ${doingNow ?? progress.pendingItems[0]?.title ?? 'Nothing active.'}`,
    `Decisions: ${summarizeMissionDecisionProgress(mission)}`,
    `Findings: ${summarizeMissionFindingProgress(mission, findingCount)}`,
    `Blockers: ${blockingQuestionCount > 0 ? `${blockingQuestionCount} question${blockingQuestionCount === 1 ? '' : 's'} need an answer.` : 'None.'}`,
    `Proof needed: ${nextStep ?? (progress.phase === 'closure' ? 'Run `skopos eval`, then `skopos done`.' : 'Finish the current checklist item, then run focused checks.')}`,
  ];
};

export const buildCompactTrustOutput = <
  T extends SkoposTrustReport & {
    actorId?: string;
  },
>(
  report: T,
) =>
  withCompactTransportBudget('Skopos trust compact output', {
    workspaceRoot: report.workspaceRoot,
    actorId: report.actorId,
    trustLevel: report.trustLevel,
    readiness: report.readiness,
    summary: report.summary,
    checkCounts: summarizeTrustChecks(report.checks),
    attentionChecks: pickAttentionChecks(report.checks),
    unresolvedAssumptions: report.unresolvedAssumptions,
    findings: report.findings,
  });

export const buildCompactDoneOutput = (report: SkoposDoneReport) =>
  withCompactTransportBudget('Skopos done compact output', {
    workspaceRoot: report.workspaceRoot,
    closureStatus: report.closureStatus,
    summary: report.summary,
    checkCounts: summarizeTrustChecks(report.checks),
    attentionChecks: pickAttentionChecks(report.checks),
    requiredActions: report.requiredActions,
    trust: {
      trustLevel: report.trust.trustLevel,
      readiness: report.trust.readiness,
      summary: report.trust.summary,
    },
    impact: {
      changedPathCount: report.impact.changedPaths.length,
      affectedScopeCount: report.impact.affectedScopes.length,
      requiredActionCount: report.impact.requiredActions.length,
      requiredWorkflowCount: report.impact.requiredWorkflows.length,
      summary: report.impact.summary,
    },
    mission: report.missionEvidence
      ? {
          id: report.missionEvidence.mission.id,
          state: report.missionEvidence.mission.state,
          pendingItemIds: report.missionEvidence.pendingItemIds,
          claimedByActorId: report.missionEvidence.claimedByActorId,
        }
      : undefined,
    workflowQuestions: report.workflowQuestions,
    missionEval: report.missionEval
      ? {
          missionId: report.missionEval.missionId,
          evaluationStatus: report.missionEval.evaluationStatus,
          blockingQuestionIds: report.missionEval.blockingQuestionIds,
          pendingItemIds: report.missionEval.pendingItemIds,
        }
      : undefined,
    failedWorkflowEvidence: report.workflowEvidence
      .filter((entry) => entry.status === 'fail')
      .map((entry) => ({
        id: entry.id,
        summary: entry.summary,
      })),
  });

export const buildCompactEvalOutput = (result: SkoposEvalRunResult) =>
  withCompactTransportBudget('Skopos eval compact output', {
    workspaceRoot: result.workspaceRoot,
    actorId: result.actorId,
    missionId: result.missionId,
    summary: result.summary,
    evaluationStatus: result.eval.evaluationStatus,
    executionSurface: result.executionSurface.kind,
    checkCounts: summarizeEvalChecks(result.eval.checkRuns),
    failedChecks: result.eval.checkRuns
      .filter((check) => check.status === 'fail')
      .map((check) => ({
        command: check.command,
        summary: check.summary,
      })),
    workflowFailures: result.eval.workflowEvidence
      .filter((entry) => entry.status === 'fail')
      .map((entry) => ({
        id: entry.id,
        summary: entry.summary,
      })),
    proof: {
      status: result.eval.proof.status,
      summary: result.eval.proof.summary,
      weightedPassRate: result.eval.proof.weightedPassRate,
      regressedBenchmarkCount: result.eval.proof.regressedBenchmarkCount,
    },
    progress: summarizeCompactMissionProgress(result.mission, {
      blockingQuestionCount: result.blockingQuestions.length,
      evalStatus: result.eval.evaluationStatus,
    }),
    trust: {
      trustLevel: result.eval.trust.trustLevel,
      readiness: result.eval.trust.readiness,
      summary: result.eval.trust.summary,
    },
    blockingQuestionIds: result.eval.blockingQuestionIds,
    pendingItemIds: result.eval.pendingItemIds,
    nextCommand: result.nextCommand,
  });

export const buildCompactBackgroundEvalOutput = (result: SkoposBackgroundEvalRunResult) =>
  withCompactTransportBudget('Skopos background eval compact output', {
    workspaceRoot: result.workspaceRoot,
    actorId: result.actorId,
    missionId: result.missionId,
    summary: result.summary,
    jobId: result.jobId,
    jobState: result.jobState,
    nextCommand: result.nextCommand,
    resultPath: result.job.resultPath,
    errorMessage: result.job.errorMessage,
  });

export const buildCompactJobShowOutput = (result: SkoposJobShowRunResult) =>
  withCompactTransportBudget('Skopos job compact output', {
    workspaceRoot: result.workspaceRoot,
    summary: result.summary,
    jobId: result.jobId,
    jobState: result.job.jobState,
    jobKind: result.job.jobKind,
    missionId: result.job.missionId,
    resultPath: result.job.resultPath,
    resultSummary: result.job.resultSummary,
    errorMessage: result.job.errorMessage,
    nextCommand: result.nextCommand,
  });

export const buildCompactProgramNextOutput = (result: SkoposProgramNextRunResult) =>
  withCompactTransportBudget('Skopos program next compact output', {
    workspaceRoot: result.workspaceRoot,
    actorId: result.actorId,
    summary: result.summary,
    currentDisposition: result.currentDisposition,
    currentMissionId: result.currentMissionId,
    recommendedItem: result.recommendedItem
      ? {
          id: result.recommendedItem.id,
          title: result.recommendedItem.title,
          priority: result.recommendedItem.priority,
          sourceKind: result.recommendedItem.sourceKind,
          status: result.recommendedItem.status,
          recommendedDisposition: result.recommendedItem.recommendedDisposition,
        }
      : undefined,
    openObligationCount: result.obligations.length,
    interruptRecommendation: result.state.sequence.interruptRecommendation,
    nextCommand: result.nextCommand,
  });

export const buildCompactProgramSyncOutput = (result: SkoposProgramSyncRunResult) =>
  withCompactTransportBudget('Skopos program sync compact output', {
    workspaceRoot: result.workspaceRoot,
    actorId: result.actorId,
    summary: result.summary,
    currentMissionId: result.currentMissionId,
    itemCount: result.state.items.length,
    openObligationCount: result.state.obligations.filter((entry) => entry.status === 'open').length,
    doNow: result.doNowItem
      ? {
          id: result.doNowItem.id,
          title: result.doNowItem.title,
          priority: result.doNowItem.priority,
          sourceKind: result.doNowItem.sourceKind,
        }
      : undefined,
    doNext: result.doNextItem
      ? {
          id: result.doNextItem.id,
          title: result.doNextItem.title,
          priority: result.doNextItem.priority,
          sourceKind: result.doNextItem.sourceKind,
        }
      : undefined,
    nextCommand: result.nextCommand,
  });

export const buildCompactTrustLines = <
  T extends SkoposTrustReport & {
    actorId?: string;
  },
>(
  report: T,
): string[] => {
  const counts = summarizeTrustChecks(report.checks);
  const lines = [
    'Skopos trust',
    `Status: ${describeTrustStatus(report)}`,
    `Summary: ${report.summary}`,
    `Checks: ${counts.pass} pass, ${counts.warn} review, ${counts.fail} fix`,
  ];

  const attentionChecks = pickAttentionChecks(report.checks);
  if (attentionChecks.length > 0) {
    lines.push('Attention:');
    for (const check of attentionChecks) {
      lines.push(`- ${describeAttentionStatus(check.status)}: ${check.id} - ${check.summary}`);
    }
  }

  lines.push('Next step:', buildTrustNextStep(report));

  return maybeAppendCompactTransportWarning('Skopos trust compact lines', lines);
};

export const buildCompactDoneLines = (report: SkoposDoneReport): string[] => {
  const counts = summarizeTrustChecks(report.checks);
  const lines = [
    'Skopos done',
    `Status: ${describeReviewStatus(report.closureStatus)}`,
    `Summary: ${report.summary}`,
    `Trust: ${report.trust.trustLevel} / ${report.trust.readiness}`,
    `Checks: ${counts.pass} pass, ${counts.warn} review, ${counts.fail} fix`,
    `Required actions: ${report.requiredActions.length}`,
  ];

  if (report.missionEvidence) {
    lines.push(
      `Progress: ${report.missionEvidence.pendingItemIds.length === 0 ? 'Mission checklist is complete.' : `${report.missionEvidence.pendingItemIds.length} mission checklist item${report.missionEvidence.pendingItemIds.length === 1 ? '' : 's'} still pending.`}`,
    );
  }

  const attentionChecks = pickAttentionChecks(report.checks);
  if (attentionChecks.length > 0) {
    lines.push('Attention:');
    for (const check of attentionChecks) {
      lines.push(`- ${describeAttentionStatus(check.status)}: ${check.id} - ${check.summary}`);
    }
  }

  lines.push('Next step:', buildDoneNextStep(report));

  return maybeAppendCompactTransportWarning('Skopos done compact lines', lines);
};

export const buildCompactEvalLines = (result: SkoposEvalRunResult): string[] => {
  const counts = summarizeEvalChecks(result.eval.checkRuns);
  const lines = [
    'Skopos eval',
    `Status: ${describeReviewStatus(result.eval.evaluationStatus)}`,
    `Mission: ${result.missionId}`,
    `Summary: ${result.summary}`,
    `Checks: ${counts.pass} pass, ${counts.fail} fix, ${counts.skipped} skipped`,
    `Proof: ${result.eval.proof.status}`,
    `Trust: ${result.eval.trust.trustLevel} / ${result.eval.trust.readiness}`,
    ...buildMissionProgressLines({
      mission: result.mission,
      blockingQuestionCount: result.blockingQuestions.length,
      findingCount: countTrustFindings(result.eval.trust),
      evalStatus: result.eval.evaluationStatus,
      nextStep: buildEvalNextStep(result),
    }),
  ];

  const failedChecks = result.eval.checkRuns.filter((check) => check.status === 'fail');
  if (failedChecks.length > 0) {
    lines.push('Attention:');
    for (const check of failedChecks) {
      lines.push(`- Fix before closing: ${check.command} - ${check.summary}`);
    }
  }

  lines.push('Next step:', buildEvalNextStep(result));

  return maybeAppendCompactTransportWarning('Skopos eval compact lines', lines);
};

export const buildCompactBackgroundEvalLines = (
  result: SkoposBackgroundEvalRunResult,
): string[] =>
  maybeAppendCompactTransportWarning('Skopos background eval compact lines', [
    'Skopos eval',
    'Status: Background job started',
    `Mission: ${result.missionId}`,
    `Job: ${result.jobId} (${result.jobState})`,
    `Summary: ${result.summary}`,
    'Next step:',
    result.nextCommand,
  ]);

export const buildCompactJobShowLines = (result: SkoposJobShowRunResult): string[] => {
  const lines = [
    'Skopos job',
    `- job: ${result.jobId}`,
    `- kind: ${result.job.jobKind}`,
    `- state: ${result.job.jobState}`,
    `- summary: ${result.summary}`,
  ];

  if (result.job.resultSummary) {
    lines.push(`- result: ${result.job.resultSummary}`);
  }

  if (result.job.errorMessage) {
    lines.push(`- error: ${result.job.errorMessage}`);
  }

  if (result.nextCommand) {
    lines.push(`- next: ${result.nextCommand}`);
  }

  return maybeAppendCompactTransportWarning('Skopos job compact lines', lines);
};

export const buildCompactProgramNextLines = (result: SkoposProgramNextRunResult): string[] => {
  const activeFindingCount = countProgramFindings(result);
  return maybeAppendCompactTransportWarning('Skopos program next compact lines', [
    'Skopos program next',
    `Status: ${describeProgramDisposition(result.currentDisposition)}`,
    `Summary: ${result.summary}`,
    `Current mission: ${result.currentMissionId ?? '(none)'}`,
    `Recommended item: ${result.recommendedItem?.title ?? '(none)'}`,
    `Findings: ${activeFindingCount} active finding item${activeFindingCount === 1 ? '' : 's'}`,
    `Open obligations: ${result.obligations.length}`,
    'Next step:',
    buildProgramNextStep(result),
  ]);
};

export const buildCompactProgramSyncLines = (result: SkoposProgramSyncRunResult): string[] => {
  const activeFindingCount = countProgramFindings(result);
  return maybeAppendCompactTransportWarning('Skopos program sync compact lines', [
    'Skopos program sync',
    'Status: Program state refreshed',
    `Summary: ${result.summary}`,
    `Items: ${result.state.items.length}`,
    `Findings: ${activeFindingCount} active finding item${activeFindingCount === 1 ? '' : 's'}`,
    `Open obligations: ${result.state.obligations.filter((entry) => entry.status === 'open').length}`,
    `Do now: ${result.doNowItem?.title ?? '(none)'}`,
    `Do next: ${result.doNextItem?.title ?? '(none)'}`,
    'Next step:',
    buildProgramSyncNextStep(result),
  ]);
};

export const buildCompactNextLines = (result: SkoposNextRunResult): string[] => {
  const lines = [
    'Skopos next',
    `Status: ${describeNextStatus(result)}`,
    `Mission: ${result.missionId}`,
    `Summary: ${result.summary}`,
    `Code allowed: ${result.codeAllowed ? 'yes' : 'no'}`,
    `Trust: ${result.trust.trustLevel} / ${result.trust.readiness}`,
    ...buildMissionProgressLines({
      mission: result.mission,
      blockingQuestionCount: result.blockingQuestions.length,
      findingCount: countTrustFindings(result.trust),
      doingNow: result.nextItem?.title ?? result.blockingQuestions[0]?.question,
      nextStep: buildNextStep(result),
    }),
  ];

  if (result.nextItem) {
    lines.push('Current item:', `- ${result.nextItem.title}: ${result.nextItem.detail}`);
  }

  if (result.blockingQuestions.length > 0) {
    lines.push(...buildGuidedWorkflowQuestionLines(result.blockingQuestions));
  }

  lines.push('Next step:', buildNextStep(result));

  return maybeAppendCompactTransportWarning('Skopos next compact lines', lines);
};
