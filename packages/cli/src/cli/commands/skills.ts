import { resolve } from 'node:path';

import {
  applySkoposSkillPackRuntime,
  listSkoposProjectSkillBindingsRuntime,
  listSkoposSkillPacksRuntime,
  recommendSkoposSkillPacksRuntime,
  showSkoposSkillPackRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedSkillArgs {
  cwd: string;
  json: boolean;
  dryRun: boolean;
  pack?: string;
  binding?: string;
  actor?: string;
  reason?: string;
}

export const runSkillsCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'list') {
    const parsed = parseSkillArgs(rest, false);
    const [packs, bindings] = await Promise.all([
      listSkoposSkillPacksRuntime({ cwd: parsed.cwd }),
      listSkoposProjectSkillBindingsRuntime({ cwd: parsed.cwd }),
    ]);
    if (parsed.json) {
      writeJsonOutput({ packs, bindings });
      return;
    }
    writeLines([
      'Skopos skill packs',
      ...packs.map(
        (pack) =>
          `- ${pack.packId}@${pack.version} [${pack.family}/${pack.variant}]: ${pack.plainLanguageSummary}`,
      ),
      'Project bindings',
      ...(bindings.length > 0
        ? bindings.map(
            (binding) =>
              `- ${binding.bindingId} -> ${binding.packId}@${binding.packVersion} [${binding.lifecycle}]`,
          )
        : ['- none']),
    ]);
    return;
  }

  if (subcommand === 'show') {
    const parsed = parseSkillArgs(rest, true);
    if (!parsed.pack) throw new Error('Missing skill pack id or manifest path.');
    const result = await showSkoposSkillPackRuntime({
      cwd: parsed.cwd,
      pack: parsed.pack,
    });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }
    writeLines([
      'Skopos skill pack',
      `- id: ${result.packId}`,
      `- version: ${result.version}`,
      `- family: ${result.family}`,
      `- variant: ${result.variant}`,
      `- source: ${result.sourcePath}`,
      `- context modules: ${result.contextModules.length}`,
      `- required context roles: ${result.requiredProjectRoles.context.join(', ') || 'none'}`,
      `- required action roles: ${result.requiredProjectRoles.actions.join(', ') || 'none'}`,
      `- required guard roles: ${result.requiredProjectRoles.guards.join(', ') || 'none'}`,
      `- summary: ${result.plainLanguageSummary}`,
      '- authority: Skopos remains workflow, task-state, and closure authority.',
    ]);
    return;
  }

  if (subcommand === 'recommend') {
    const parsed = parseSkillArgs(rest, false);
    const result = await recommendSkoposSkillPacksRuntime({
      cwd: parsed.cwd,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }
    writeLines([
      'Skopos skill recommendations',
      `- project lifecycle: ${result.projectLifecycle}`,
      ...result.recommendations.map(
        (entry) =>
          `- ${entry.recommendation} ${entry.packId}@${entry.version} [${entry.confidence}]: ${entry.reason}`,
      ),
      '- adoption is never automatic; use `skopos skills apply` with an explicit binding, actor, and reason.',
    ]);
    return;
  }

  if (subcommand === 'apply') {
    const parsed = parseSkillArgs(rest, true);
    if (!parsed.pack) throw new Error('Missing skill pack id or manifest path.');
    if (!parsed.binding) throw new Error('Missing --binding for skill adoption.');
    if (!parsed.actor) throw new Error('Missing --actor for skill adoption.');
    if (!parsed.reason) throw new Error('Missing --reason for skill adoption.');
    const result = await applySkoposSkillPackRuntime({
      cwd: parsed.cwd,
      pack: parsed.pack,
      binding: parsed.binding,
      actor: parsed.actor,
      reason: parsed.reason,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }
    writeLines([
      'Skopos skill apply',
      `- status: ${parsed.dryRun ? 'preview only' : 'accepted'}`,
      `- pack: ${parsed.pack}`,
      `- binding: ${parsed.binding}`,
      `- accepted skills: ${result.artifact.acceptedSkills.length}`,
      `- resolved artifact: ${result.artifactPath}`,
      '- skill context is task-selected; Skopos remains the only workflow and closure authority.',
    ]);
    return;
  }

  throw new Error(`Unknown Skopos skills subcommand: ${subcommand ?? '(missing)'}`);
};

const parseSkillArgs = (args: string[], expectPack: boolean): ParsedSkillArgs => {
  let cwd = process.cwd();
  let json = false;
  let dryRun = false;
  let pack: string | undefined;
  let binding: string | undefined;
  let actor: string | undefined;
  let reason: string | undefined;
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
    if (argument === '--binding') {
      binding = requireValue(args, index, '--binding');
      index += 1;
      continue;
    }
    if (argument === '--actor') {
      actor = requireValue(args, index, '--actor');
      index += 1;
      continue;
    }
    if (argument === '--reason') {
      reason = requireValue(args, index, '--reason');
      index += 1;
      continue;
    }
    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos skills flag: ${argument}`);
    }
    if (expectPack && !pack) {
      pack = argument;
      continue;
    }
    if (targetProvided) {
      throw new Error(`Unexpected extra skills target: ${argument}`);
    }
    cwd = resolve(argument);
    targetProvided = true;
  }
  return { cwd, json, dryRun, pack, binding, actor, reason };
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index + 1];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
