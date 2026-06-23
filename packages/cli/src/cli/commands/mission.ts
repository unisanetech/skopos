import { resolve } from 'node:path';

import {
  claimSkoposMissionRuntime,
  completeSkoposMissionRuntime,
  loadSkoposMissionRuntime,
  releaseSkoposMissionRuntime,
  sliceSkoposMissionRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedMissionArgs {
  cwd: string;
  mission: string;
  actor?: string;
  force: boolean;
  json: boolean;
}

interface ParsedMissionSliceArgs extends ParsedMissionArgs {
  goal: string;
  scope?: string;
  claim: boolean;
}

export const runMissionCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'show') {
    const parsed = parseMissionArgs(rest);
    const result = await loadSkoposMissionRuntime({
      cwd: parsed.cwd,
      mission: parsed.mission,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos mission',
      `- id: ${result.id}`,
      `- state: ${result.state}`,
      `- title: ${result.title}`,
      `- pending items: ${result.items.filter((item) => item.status !== 'complete').length}`,
      `- claimed by: ${result.coordination.claimedBy?.actorId ?? '(unclaimed)'}`,
    ]);
    return;
  }

  if (subcommand === 'claim') {
    const parsed = parseMissionArgs(rest);
    const result = await claimSkoposMissionRuntime({
      cwd: parsed.cwd,
      mission: parsed.mission,
      actor: parsed.actor,
      force: parsed.force,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos mission claim',
      `- id: ${result.id}`,
      `- state: ${result.state}`,
      `- claimed by: ${result.coordination.claimedBy?.actorId ?? '(unclaimed)'}`,
    ]);
    return;
  }

  if (subcommand === 'slice') {
    const parsed = parseMissionSliceArgs(rest);
    const result = await sliceSkoposMissionRuntime({
      cwd: parsed.cwd,
      mission: parsed.mission,
      goal: parsed.goal,
      scope: parsed.scope,
      actor: parsed.actor,
      claim: parsed.claim,
      force: parsed.force,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos mission slice',
      `- parent: ${result.parentMission.id}`,
      `- child mission: ${result.sliceMission.id}`,
      `- child plan: ${result.slicePlan.planId}`,
      `- scope: ${result.sliceMission.scope.scope.id}`,
      `- actor: ${result.actorId}`,
      `- claimed by: ${result.sliceMission.coordination.claimedBy?.actorId ?? '(unclaimed)'}`,
    ]);
    return;
  }

  if (subcommand === 'release') {
    const parsed = parseMissionArgs(rest);
    const result = await releaseSkoposMissionRuntime({
      cwd: parsed.cwd,
      mission: parsed.mission,
      actor: parsed.actor,
      force: parsed.force,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos mission release',
      `- id: ${result.id}`,
      `- state: ${result.state}`,
      `- claimed by: ${result.coordination.claimedBy?.actorId ?? '(unclaimed)'}`,
    ]);
    return;
  }

  if (subcommand === 'complete') {
    const parsed = parseMissionArgs(rest);
    const result = await completeSkoposMissionRuntime({
      cwd: parsed.cwd,
      mission: parsed.mission,
      actor: parsed.actor,
      force: parsed.force,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos mission complete',
      `- id: ${result.id}`,
      `- state: ${result.state}`,
      `- claimed by: ${result.coordination.claimedBy?.actorId ?? '(unclaimed)'}`,
      `- completed items: ${result.items.length}`,
    ]);
    return;
  }

  throw new Error(`Unknown Skopos mission subcommand: ${subcommand ?? '(missing)'}`);
};

const parseMissionArgs = (args: string[]): ParsedMissionArgs => {
  let cwd = process.cwd();
  let mission: string | undefined;
  let actor: string | undefined;
  let force = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--force') {
      force = true;
      continue;
    }

    if (argument === '--actor') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --actor.');
      }
      actor = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--actor=')) {
      actor = argument.slice('--actor='.length);
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos mission flag: ${argument}`);
    }

    if (!mission) {
      mission = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra mission target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (!mission || mission.trim().length === 0) {
    throw new Error('Missing mission id or path.');
  }

  return { cwd, mission, actor, force, json };
};

const parseMissionSliceArgs = (args: string[]): ParsedMissionSliceArgs => {
  let cwd = process.cwd();
  let mission: string | undefined;
  let goal: string | undefined;
  let scope: string | undefined;
  let actor: string | undefined;
  let claim = false;
  let force = false;
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--claim') {
      claim = true;
      continue;
    }

    if (argument === '--force') {
      force = true;
      continue;
    }

    if (argument === '--scope') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --scope.');
      }
      scope = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--scope=')) {
      scope = argument.slice('--scope='.length);
      continue;
    }

    if (argument === '--actor') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --actor.');
      }
      actor = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--actor=')) {
      actor = argument.slice('--actor='.length);
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos mission slice flag: ${argument}`);
    }

    if (!mission) {
      mission = argument;
      continue;
    }

    if (!goal) {
      goal = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra mission slice target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (!mission) {
    throw new Error('Missing mission id.');
  }

  if (!goal || goal.trim().length === 0) {
    throw new Error('Missing mission slice goal.');
  }

  return { cwd, mission, goal, scope, actor, claim, force, json };
};
