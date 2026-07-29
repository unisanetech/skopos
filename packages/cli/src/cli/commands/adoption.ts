import { resolve } from 'node:path';

import {
  buildSkoposAdoptionAssessmentRuntime,
  buildSkoposAdoptionActivationRuntime,
  buildSkoposAdoptionApprovalRuntime,
  buildSkoposAdoptionProposalRuntime,
  buildSkoposAdoptionVerificationRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedAdoptionAssessmentArgs {
  cwd: string;
  actor?: string;
  dryRun: boolean;
  json: boolean;
}

interface ParsedAdoptionProposalArgs extends ParsedAdoptionAssessmentArgs {
  analysisPath: string;
}

interface ParsedAdoptionApprovalArgs extends ParsedAdoptionAssessmentArgs {
  proposalDigest: string;
  reason: string;
  acceptMaterialRisk: boolean;
}

interface ParsedAdoptionVerificationArgs extends ParsedAdoptionAssessmentArgs {
  executionPath: string;
}

interface ParsedAdoptionActivationArgs extends ParsedAdoptionAssessmentArgs {
  reason: string;
}

export const runAdoptCommand = async (args: string[]): Promise<void> => {
  const subcommand = args[0];

  if (subcommand === 'activate') {
    const parsed = parseAdoptionActivationArgs(args.slice(1));
    const result = await buildSkoposAdoptionActivationRuntime({
      cwd: parsed.cwd,
      actor: parsed.actor,
      reason: parsed.reason,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }
    writeLines([
      'Skopos adopt activate',
      'Status: Project Memory adoption active',
      `Proposal digest: ${result.activation.proposalDigest}`,
      `Activated by: ${result.activation.activatedByActorId}`,
      `Operations verified: ${result.activation.verifiedOperationIds.length}`,
      `Activation artifact: ${result.activationPath} (${result.activationWrite})`,
    ]);
    return;
  }

  if (subcommand === 'verify') {
    const parsed = parseAdoptionVerificationArgs(args.slice(1));
    const result = await buildSkoposAdoptionVerificationRuntime({
      cwd: parsed.cwd,
      inputPath: parsed.executionPath,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos adopt verify',
      'Status: Project Memory standard verified',
      `Proposal digest: ${result.verification.proposalDigest}`,
      `Verified by: ${result.verification.verifiedByActorId}`,
      `Operations verified: ${result.verification.verifiedOperationIds.length}`,
      `Checks passed: ${result.verification.checks.length}`,
      'Agent-ready activation: not yet granted',
      `Verification artifact: ${result.verificationPath} (${result.verificationWrite})`,
    ]);
    return;
  }

  if (subcommand === 'approve') {
    const parsed = parseAdoptionApprovalArgs(args.slice(1));
    const result = await buildSkoposAdoptionApprovalRuntime({
      cwd: parsed.cwd,
      proposalDigest: parsed.proposalDigest,
      actor: parsed.actor,
      reason: parsed.reason,
      acceptMaterialRisk: parsed.acceptMaterialRisk,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos adopt approve',
      'Status: Exact proposal approved',
      `Proposal digest: ${result.approval.proposalDigest}`,
      `Approved by: ${result.approval.approvedByActorId}`,
      `Operations authorized: ${result.approval.approvedOperationIds.length}`,
      `Material risk accepted: ${result.approval.materialRiskAccepted ? 'yes' : 'no'}`,
      'Document operations executed: no',
      `Approval artifact: ${result.approvalPath} (${result.approvalWrite})`,
      `Execution brief: ${result.executionBriefPath} (${result.executionBriefWrite})`,
      'Next: open the execution brief, execute only its approved operations, complete its evidence template, then run the listed verification command.',
    ]);
    return;
  }

  if (subcommand === 'propose') {
    const parsed = parseAdoptionProposalArgs(args.slice(1));
    const result = await buildSkoposAdoptionProposalRuntime({
      cwd: parsed.cwd,
      inputPath: parsed.analysisPath,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos adopt propose',
      `Status: ${result.adoptionState === 'questions-open' ? 'Material questions open' : 'Proposal awaiting approval'}`,
      `Reviewed by: ${result.actorId}`,
      `Claims: ${result.analysis.claims.length}`,
      `Material questions: ${result.analysis.materialQuestions.length}`,
      `Document operations: ${result.analysis.documentDispositions.length}`,
      ...(result.proposal
        ? [
            `Proposal digest: ${result.proposal.proposalDigest}`,
            `Target tree entries: ${result.proposal.targetTree.length}`,
            `Information-loss risks: ${result.proposal.informationLossRisks.length}`,
            'No project documents were changed; explicit proposal approval is required before execution.',
          ]
        : [
            'No proposal was created. Resolve the material questions and submit refreshed reviewed analysis.',
          ]),
      'Artifacts:',
      `- reviewed analysis: ${result.analysisPath} (${result.analysisWrite})`,
      ...(result.proposalPath && result.proposalWrite
        ? [`- restructuring proposal: ${result.proposalPath} (${result.proposalWrite})`]
        : []),
    ]);
    return;
  }

  if (subcommand !== 'assess') {
    throw new Error(
      'Usage: skopos adopt assess [target] [--actor <id>] [--dry-run] [--json]\n       skopos adopt propose [target] --analysis <path> --actor <id> [--dry-run] [--json]\n       skopos adopt approve [target] --proposal <digest> --actor <id> --reason <text> [--accept-material-risk] [--dry-run] [--json]\n       skopos adopt verify [target] --execution <path> --actor <id> [--dry-run] [--json]\n       skopos adopt activate [target] --actor <id> --reason <text> [--dry-run] [--json]',
    );
  }

  const parsed = parseAdoptionAssessmentArgs(args.slice(1));
  const result = await buildSkoposAdoptionAssessmentRuntime(parsed);

  if (parsed.json) {
    writeJsonOutput(result);
    return;
  }

  writeLines([
    'Skopos adopt assess',
    'Status: Agent analysis required',
    'Mode: Assessment only; no human-authored project files were changed',
    `Documents discovered: ${result.intake.documents.length}`,
    `Code roots: ${result.intake.codeRoots.length}`,
    `Instruction files: ${result.intake.instructionFiles.length}`,
    `Commands: ${result.intake.commands.length}`,
    `CI sources: ${result.intake.ciPaths.length}`,
    `Generated-source hints: ${result.intake.generatedSourcePaths.length}`,
    `Authority conflicts: ${result.intake.authorityConflicts.length}`,
    `Memory role gaps: ${result.intake.memoryRoleGaps.length}`,
    `Next: ${result.analysisBrief.nextAgentAction}`,
    'Artifacts:',
    `- intake: ${result.intakePath} (${result.intakeWrite})`,
    `- agent analysis brief: ${result.analysisBriefPath} (${result.analysisBriefWrite})`,
  ]);
};

const parseAdoptionActivationArgs = (
  args: string[],
): ParsedAdoptionActivationArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let reason: string | undefined;
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
    if (argument === '--reason') {
      reason = args[index + 1];
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }
    cwd = resolve(argument);
  }
  if (!actor) throw new Error('Missing --actor for adoption activation.');
  if (!reason) throw new Error('Missing --reason for adoption activation.');
  return { cwd, actor, reason, dryRun, json };
};

const parseAdoptionVerificationArgs = (
  args: string[],
): ParsedAdoptionVerificationArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let executionPath: string | undefined;
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
    if (argument === '--execution') {
      executionPath = args[index + 1];
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }
    cwd = resolve(argument);
  }

  if (!executionPath) {
    throw new Error('Missing --execution for adoption verification evidence.');
  }
  if (!actor) {
    throw new Error('Missing --actor for adoption standard verification.');
  }
  return {
    cwd,
    actor,
    executionPath: resolve(executionPath),
    dryRun,
    json,
  };
};

const parseAdoptionApprovalArgs = (args: string[]): ParsedAdoptionApprovalArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let proposalDigest: string | undefined;
  let reason: string | undefined;
  let acceptMaterialRisk = false;
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
    if (argument === '--accept-material-risk') {
      acceptMaterialRisk = true;
      continue;
    }
    if (argument === '--actor') {
      actor = args[index + 1];
      index += 1;
      continue;
    }
    if (argument === '--proposal') {
      proposalDigest = args[index + 1];
      index += 1;
      continue;
    }
    if (argument === '--reason') {
      reason = args[index + 1];
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }
    cwd = resolve(argument);
  }

  if (!proposalDigest) throw new Error('Missing --proposal digest for approval.');
  if (!actor) throw new Error('Missing --actor for proposal approval.');
  if (!reason) throw new Error('Missing --reason for proposal approval.');

  return {
    cwd,
    actor,
    proposalDigest,
    reason,
    acceptMaterialRisk,
    dryRun,
    json,
  };
};

const parseAdoptionProposalArgs = (args: string[]): ParsedAdoptionProposalArgs => {
  let cwd = process.cwd();
  let actor: string | undefined;
  let analysisPath: string | undefined;
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
    if (argument === '--analysis') {
      analysisPath = args[index + 1];
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos flag: ${argument}`);
    }
    cwd = resolve(argument);
  }

  if (!analysisPath) {
    throw new Error('Missing --analysis for reviewed adoption analysis input.');
  }

  return {
    cwd,
    actor,
    analysisPath: resolve(analysisPath),
    dryRun,
    json,
  };
};

const parseAdoptionAssessmentArgs = (args: string[]): ParsedAdoptionAssessmentArgs => {
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
