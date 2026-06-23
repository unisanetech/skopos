import { resolve } from 'node:path';

import {
  listSkoposJobsRuntime,
  runSkoposEvalBackgroundJobRuntime,
  showSkoposJobRuntime,
} from '@skopos/runtime';

import { buildCompactJobShowLines, buildCompactJobShowOutput } from '../shared/compact-output.js';
import {
  buildSummaryLines,
  parseFieldList,
  projectJsonOutput,
  writeJsonOutput,
  writeLines,
} from '../shared/output.js';

interface ParsedJobsArgs {
  cwd: string;
  compact: boolean;
  summary: boolean;
  fields: string[];
  json: boolean;
}

export const runJobsCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'show') {
    const [jobId, ...remaining] = rest;
    if (!jobId) {
      throw new Error('Missing job id for `skopos jobs show`.');
    }
    const parsed = parseJobsArgs(remaining);
    const result = await showSkoposJobRuntime({
      cwd: parsed.cwd,
      jobId,
    });
    const output = parsed.compact ? buildCompactJobShowOutput(result) : result;

    if (parsed.json) {
      writeJsonOutput(
        projectJsonOutput(output, {
          summary: parsed.summary,
          fields: parsed.fields,
        }),
      );
      return;
    }

    if (parsed.summary) {
      writeLines(buildSummaryLines(output));
      return;
    }

    if (parsed.compact) {
      writeLines(buildCompactJobShowLines(result));
      return;
    }

    const lines = [
      'Skopos jobs show',
      `- job: ${result.jobId}`,
      `- kind: ${result.job.jobKind}`,
      `- state: ${result.job.jobState}`,
      `- summary: ${result.summary}`,
      `- path: ${result.jobPath}`,
      `- mission: ${result.job.missionId ?? '(none)'}`,
      `- command: ${result.job.command}`,
      `- poll: ${result.job.pollCommand}`,
    ];

    if (result.job.resultPath) {
      lines.push(`- result path: ${result.job.resultPath}`);
    }

    if (result.job.resultSummary) {
      lines.push(`- result summary: ${result.job.resultSummary}`);
    }

    if (result.job.errorMessage) {
      lines.push(`- error: ${result.job.errorMessage}`);
    }

    writeLines(lines);
    return;
  }

  if (subcommand === 'list') {
    const parsed = parseJobsArgs(rest);
    const jobs = await listSkoposJobsRuntime({
      cwd: parsed.cwd,
    });

    if (parsed.json) {
      writeJsonOutput(
        jobs.map((job) => ({
          id: job.id,
          kind: job.jobKind,
          state: job.jobState,
          missionId: job.missionId,
          summary: job.summary,
          updatedAt: job.updatedAt,
        })),
      );
      return;
    }

    const lines = ['Skopos jobs list', `- jobs: ${jobs.length}`];
    for (const job of jobs) {
      lines.push(`- [${job.jobState}] ${job.id} (${job.jobKind}) ${job.summary ?? ''}`.trimEnd());
    }
    writeLines(lines);
    return;
  }

  if (subcommand === 'run-eval') {
    const [jobId, target] = rest;
    if (!jobId) {
      throw new Error('Missing job id for `skopos jobs run-eval`.');
    }
    await runSkoposEvalBackgroundJobRuntime({
      cwd: target ? resolve(target) : process.cwd(),
      jobId,
    });
    return;
  }

  throw new Error(`Unknown Skopos jobs subcommand: ${subcommand ?? '(missing)'}`);
};

const parseJobsArgs = (args: string[]): ParsedJobsArgs => {
  let cwd = process.cwd();
  let compact = false;
  let summary = false;
  let fields: string[] = [];
  let json = false;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--compact') {
      compact = true;
      continue;
    }

    if (argument === '--summary') {
      summary = true;
      continue;
    }

    if (argument === '--fields') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --fields.');
      }
      fields = parseFieldList(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--fields=')) {
      fields = parseFieldList(argument.slice('--fields='.length));
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos jobs flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra jobs target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  if (summary && fields.length > 0) {
    throw new Error('Use either --summary or --fields, not both.');
  }

  if (fields.length > 0 && !json) {
    throw new Error('Field selection requires --json.');
  }

  return {
    cwd,
    compact,
    summary,
    fields,
    json,
  };
};
