import { resolve } from 'node:path';

import {
  applySkoposCapabilityIntegrationsRuntime,
  approveSkoposCapabilityIntegrationsRuntime,
  proposeSkoposCapabilityIntegrationsRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedIntegrationArgs {
  subcommand?: string;
  cwd: string;
  proposalDigest?: string;
  approvalDigest?: string;
  acceptedCandidateIds: string[];
  actor?: string;
  reason?: string;
  dryRun: boolean;
  json: boolean;
}

export const runIntegrationsCommand = async (args: string[]): Promise<void> => {
  const parsed = parseIntegrationArgs(args);

  if (parsed.subcommand === 'propose') {
    const result = await proposeSkoposCapabilityIntegrationsRuntime({
      cwd: parsed.cwd,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }
    const integrable = result.proposal.candidates.filter(
      (candidate) => candidate.suggestedAction && candidate.suggestedGuard,
    );
    writeLines([
      'Skopos capability integration proposal',
      `- proposal: ${result.proposal.proposalDigest}`,
      `- artifact: ${result.proposalPath} (${result.proposalWrite})`,
      `- candidates: ${result.proposal.candidates.length}`,
      `- complete Action/Guard suggestions: ${integrable.length}`,
      '- tracked declarations written: no',
      '- next: review exact suggestions, then explicitly approve selected candidate ids.',
      ...integrable.map(
        (candidate) =>
          `  - ${candidate.id}: ${candidate.name} -> ${candidate.suggestedAction?.id}`,
      ),
    ]);
    return;
  }

  if (parsed.subcommand === 'approve') {
    if (!parsed.proposalDigest) throw new Error('Missing --proposal <digest>.');
    if (!parsed.actor) throw new Error('Missing --actor <id>.');
    if (!parsed.reason) throw new Error('Missing --reason <text>.');
    const result = await approveSkoposCapabilityIntegrationsRuntime({
      cwd: parsed.cwd,
      proposalDigest: parsed.proposalDigest,
      acceptedCandidateIds: parsed.acceptedCandidateIds,
      actor: parsed.actor,
      reason: parsed.reason,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }
    writeLines([
      'Skopos capability integration approval',
      `- approval: ${result.approval.approvalDigest}`,
      `- proposal: ${result.approval.proposalDigest}`,
      `- accepted candidates: ${result.approval.acceptedCandidateIds.length}`,
      `- artifact: ${result.approvalPath} (${result.approvalWrite})`,
      '- tracked declarations written: no',
      '- next: apply this exact approval digest to write and validate declarations.',
    ]);
    return;
  }

  if (parsed.subcommand === 'apply') {
    if (!parsed.approvalDigest) throw new Error('Missing --approval <digest>.');
    if (!parsed.actor) throw new Error('Missing --actor <id>.');
    const result = await applySkoposCapabilityIntegrationsRuntime({
      cwd: parsed.cwd,
      approvalDigest: parsed.approvalDigest,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }
    writeLines([
      'Skopos capability integration activation',
      `- provider validation: ${result.activation.providerValidation}`,
      `- Actions: ${result.activation.actionPaths.length}`,
      `- Guards: ${result.activation.guardPaths.length}`,
      `- artifact: ${result.activationPath} (${result.activationWrite})`,
      `- tracked declarations written: ${parsed.dryRun ? 'no (dry-run)' : 'yes'}`,
    ]);
    return;
  }

  throw new Error(
    `Unknown Skopos integrations subcommand: ${parsed.subcommand ?? '(missing)'}`,
  );
};

const parseIntegrationArgs = (args: string[]): ParsedIntegrationArgs => {
  let subcommand: string | undefined;
  let cwd = process.cwd();
  let proposalDigest: string | undefined;
  let approvalDigest: string | undefined;
  const acceptedCandidateIds: string[] = [];
  let actor: string | undefined;
  let reason: string | undefined;
  let dryRun = false;
  let json = false;
  let targetProvided = false;

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
    if (argument === '--proposal') {
      proposalDigest = requireValue(args, index, argument);
      index += 1;
      continue;
    }
    if (argument === '--approval') {
      approvalDigest = requireValue(args, index, argument);
      index += 1;
      continue;
    }
    if (argument === '--accept') {
      acceptedCandidateIds.push(requireValue(args, index, argument));
      index += 1;
      continue;
    }
    if (argument === '--actor') {
      actor = requireValue(args, index, argument);
      index += 1;
      continue;
    }
    if (argument === '--reason') {
      reason = requireValue(args, index, argument);
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos integrations flag: ${argument}`);
    }
    if (!subcommand) {
      subcommand = argument;
      continue;
    }
    if (targetProvided) {
      throw new Error(`Unexpected extra integrations target: ${argument}`);
    }
    cwd = resolve(argument);
    targetProvided = true;
  }

  return {
    subcommand,
    cwd,
    proposalDigest,
    approvalDigest,
    acceptedCandidateIds,
    actor,
    reason,
    dryRun,
    json,
  };
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error(`Missing value for ${flag}.`);
  }
  return value;
};
