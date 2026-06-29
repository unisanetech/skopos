import { resolve } from 'node:path';

import { buildSkoposUnderstandingRuntime } from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedUnderstandingArgs {
  cwd: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
}

export const runUnderstandCommand = async (args: string[]): Promise<void> => {
  const parsed = parseUnderstandingArgs(args);
  const result = await buildSkoposUnderstandingRuntime({
    cwd: parsed.cwd,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos understand',
    'Status: Repo understanding generated',
    `Summary: ${result.summary.purpose}`,
    `Features: ${result.featureInventory.features.length}`,
    `Hotspots: ${result.hotspots.hotspots.length}`,
    `Understanding depth: ${result.agentAnalysisBrief.analysisStatus}`,
    `Setup review: ${result.setupReview.readiness}`,
    `Assumptions: ${result.setupReview.assumptions.length}`,
    `Open questions: ${result.setupReview.openConfirmationQuestions.length}`,
    `Answered questions: ${result.setupReview.answeredQuestions.length}`,
    `Next: ${result.agentAnalysisBrief.analysisStatus === 'agent-reviewed' ? result.setupReview.nextCommand : result.agentAnalysisBrief.nextCommand}`,
    ...(result.agentAnalysisBrief.analysisStatus !== 'agent-reviewed'
      ? [
          'Agent analysis needed:',
          `- ${result.agentAnalysisBrief.nextAgentAction}`,
        ]
      : []),
    'First places to look:',
    ...result.hotspots.hotspots.slice(0, 5).map((hotspot) => `- ${hotspot.title}: ${hotspot.path}`),
    ...(result.setupReview.openConfirmationQuestions.length > 0
      ? [
          'Questions to confirm:',
          ...result.setupReview.openConfirmationQuestions
            .slice(0, 3)
            .map(
              (question) =>
                `- ${question.question} (answer: skopos setup answer ${question.id} ${question.recommendedOptionId} ${result.workspaceRoot})`,
            ),
        ]
      : []),
    'Artifacts:',
    `- repo summary: ${result.summaryPath} (${result.summaryWrite})`,
    `- feature inventory: ${result.featureInventoryPath} (${result.featureInventoryWrite})`,
    `- hotspots: ${result.hotspotsPath} (${result.hotspotsWrite})`,
    `- setup review: ${result.setupReviewPath} (${result.setupReviewWrite})`,
    `- agent analysis brief: ${result.agentAnalysisBriefPath} (${result.agentAnalysisBriefWrite})`,
  ]);
};

const parseUnderstandingArgs = (args: string[]): ParsedUnderstandingArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let dryRun = false;
  let json = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--actor') {
      actor = args[index + 1];
      index += 1;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }

    cwd = resolve(argument);
  }

  return { cwd, actor, dryRun, json };
};
