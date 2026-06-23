import type {
  SkoposBackgroundEvalRunResult,
  SkoposDoneReport,
  SkoposEvalRunResult,
  SkoposJobShowRunResult,
  SkoposProgramNextRunResult,
  SkoposProgramSyncRunResult,
  SkoposTrustCheck,
  SkoposTrustReport,
} from '@skopos/model';

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

const pickAttentionChecks = (checks: SkoposTrustCheck[]) =>
  checks
    .filter((check) => check.status !== 'pass')
    .map((check) => ({
      id: check.id,
      status: check.status,
      summary: check.summary,
    }));

export const buildCompactTrustOutput = <
  T extends SkoposTrustReport & {
    actorId?: string;
  },
>(
  report: T,
) => ({
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

export const buildCompactDoneOutput = (report: SkoposDoneReport) => ({
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

export const buildCompactEvalOutput = (result: SkoposEvalRunResult) => ({
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
  trust: {
    trustLevel: result.eval.trust.trustLevel,
    readiness: result.eval.trust.readiness,
    summary: result.eval.trust.summary,
  },
  blockingQuestionIds: result.eval.blockingQuestionIds,
  pendingItemIds: result.eval.pendingItemIds,
  nextCommand: result.nextCommand,
});

export const buildCompactBackgroundEvalOutput = (result: SkoposBackgroundEvalRunResult) => ({
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

export const buildCompactJobShowOutput = (result: SkoposJobShowRunResult) => ({
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

export const buildCompactProgramNextOutput = (result: SkoposProgramNextRunResult) => ({
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

export const buildCompactProgramSyncOutput = (result: SkoposProgramSyncRunResult) => ({
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
    `- trust: ${report.trustLevel} / ${report.readiness}`,
    `- summary: ${report.summary}`,
    `- checks: ${counts.pass} pass, ${counts.warn} warn, ${counts.fail} fail`,
  ];

  const attentionChecks = pickAttentionChecks(report.checks);
  if (attentionChecks.length > 0) {
    lines.push('- attention:');
    for (const check of attentionChecks) {
      lines.push(`  - [${check.status}] ${check.id}: ${check.summary}`);
    }
  }

  return lines;
};

export const buildCompactDoneLines = (report: SkoposDoneReport): string[] => {
  const counts = summarizeTrustChecks(report.checks);
  const lines = [
    'Skopos done',
    `- closure: ${report.closureStatus}`,
    `- summary: ${report.summary}`,
    `- trust: ${report.trust.trustLevel} / ${report.trust.readiness}`,
    `- checks: ${counts.pass} pass, ${counts.warn} warn, ${counts.fail} fail`,
    `- required actions: ${report.requiredActions.length}`,
  ];

  const attentionChecks = pickAttentionChecks(report.checks);
  if (attentionChecks.length > 0) {
    lines.push('- attention:');
    for (const check of attentionChecks) {
      lines.push(`  - [${check.status}] ${check.id}: ${check.summary}`);
    }
  }

  if (report.requiredActions.length > 0) {
    lines.push(`- next action: ${report.requiredActions[0]}`);
  }

  return lines;
};

export const buildCompactEvalLines = (result: SkoposEvalRunResult): string[] => {
  const counts = summarizeEvalChecks(result.eval.checkRuns);
  const lines = [
    'Skopos eval',
    `- mission: ${result.missionId}`,
    `- status: ${result.eval.evaluationStatus}`,
    `- summary: ${result.summary}`,
    `- checks: ${counts.pass} pass, ${counts.fail} fail, ${counts.skipped} skipped`,
    `- proof: ${result.eval.proof.status}`,
    `- trust: ${result.eval.trust.trustLevel} / ${result.eval.trust.readiness}`,
  ];

  const failedChecks = result.eval.checkRuns.filter((check) => check.status === 'fail');
  if (failedChecks.length > 0) {
    lines.push('- failing checks:');
    for (const check of failedChecks) {
      lines.push(`  - ${check.command}: ${check.summary}`);
    }
  }

  if (result.nextCommand) {
    lines.push(`- next: ${result.nextCommand}`);
  }

  return lines;
};

export const buildCompactBackgroundEvalLines = (
  result: SkoposBackgroundEvalRunResult,
): string[] => [
  'Skopos eval',
  '- mode: background',
  `- mission: ${result.missionId}`,
  `- job: ${result.jobId}`,
  `- state: ${result.jobState}`,
  `- summary: ${result.summary}`,
  `- next: ${result.nextCommand}`,
];

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

  return lines;
};

export const buildCompactProgramNextLines = (result: SkoposProgramNextRunResult): string[] => [
  'Skopos program next',
  `- disposition: ${result.currentDisposition}`,
  `- summary: ${result.summary}`,
  `- current mission: ${result.currentMissionId ?? '(none)'}`,
  `- recommended item: ${result.recommendedItem?.title ?? '(none)'}`,
  `- open obligations: ${result.obligations.length}`,
  ...(result.nextCommand ? [`- next: ${result.nextCommand}`] : []),
];

export const buildCompactProgramSyncLines = (result: SkoposProgramSyncRunResult): string[] => [
  'Skopos program sync',
  `- summary: ${result.summary}`,
  `- items: ${result.state.items.length}`,
  `- open obligations: ${result.state.obligations.filter((entry) => entry.status === 'open').length}`,
  `- do now: ${result.doNowItem?.title ?? '(none)'}`,
  `- do next: ${result.doNextItem?.title ?? '(none)'}`,
  ...(result.nextCommand ? [`- next: ${result.nextCommand}`] : []),
];
