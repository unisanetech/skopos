import { resolve } from 'node:path';

import {
  buildSkoposUiConsoleApp,
  devSkoposUiConsoleApp,
  renderSkoposUiPortal,
  serveSkoposUiConsoleApp,
} from '@skopos/ui';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedUiArgs {
  cwd: string;
  outputPath?: string;
  outputDirectory?: string;
  host?: string;
  port?: number;
  dryRun: boolean;
  json: boolean;
}

const UI_HELP_FLAGS = new Set(['--help', '-h']);
const UI_SUBCOMMANDS = new Set(['render', 'build', 'serve', 'dev']);

export const runUiCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (!subcommand || UI_HELP_FLAGS.has(subcommand)) {
    printUiHelp();
    return;
  }

  if (rest.some((argument) => UI_HELP_FLAGS.has(argument))) {
    if (!UI_SUBCOMMANDS.has(subcommand)) {
      throw new Error(`Unknown Skopos ui subcommand: ${subcommand}`);
    }

    printUiHelp(subcommand);
    return;
  }

  if (subcommand === 'render') {
    const parsed = parseUiArgs(rest);
    const result = await renderSkoposUiPortal({
      cwd: parsed.cwd,
      outputPath: parsed.outputPath,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos ui render',
      `- workspace: ${result.workspaceRoot}`,
      `- portal: ${result.outputPath} (${result.writeStatus})`,
      `- graph portal: ${result.graphPortalPath} (${result.graphPortalWriteStatus})`,
      `- readiness: ${result.readiness}`,
      `- graphs: ${result.graphCount}`,
    ]);
    return;
  }

  if (subcommand === 'build') {
    const parsed = parseUiArgs(rest);
    const result = await buildSkoposUiConsoleApp({
      cwd: parsed.cwd,
      outputDirectory: parsed.outputDirectory,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos ui build',
      `- workspace: ${result.workspaceRoot}`,
      `- app: ${result.entryHtmlPath} (${result.writeStatus})`,
      `- state: ${result.statePath} (${result.writeStatus})`,
      `- search index: ${result.searchIndexPath} (${result.writeStatus})`,
      `- readiness: ${result.readiness}`,
      `- assets: ${result.assetPaths.length}`,
    ]);
    return;
  }

  if (subcommand === 'serve') {
    const parsed = parseUiArgs(rest);

    if (parsed.dryRun) {
      throw new Error('Skopos ui serve does not support --dry-run.');
    }

    if (parsed.outputPath) {
      throw new Error('Skopos ui serve does not support --output. Use --output-dir instead.');
    }

    const result = await serveSkoposUiConsoleApp({
      cwd: parsed.cwd,
      outputDirectory: parsed.outputDirectory,
      host: parsed.host,
      port: parsed.port,
    });

    const closeServer = (): void => {
      result.server.close();
    };

    process.once('SIGINT', closeServer);
    process.once('SIGTERM', closeServer);

    if (parsed.json) {
      writeJsonOutput({
        workspaceRoot: result.workspaceRoot,
        outputDirectory: result.outputDirectory,
        entryHtmlPath: result.entryHtmlPath,
        statePath: result.statePath,
        searchIndexPath: result.searchIndexPath,
        assetPaths: result.assetPaths,
        writeStatus: result.writeStatus,
        generatedAt: result.generatedAt,
        readiness: result.readiness,
        host: result.host,
        port: result.port,
        url: result.url,
      });
      return;
    }

    writeLines([
      'Skopos ui serve (snapshot preview)',
      `- workspace: ${result.workspaceRoot}`,
      `- app: ${result.entryHtmlPath}`,
      `- state: ${result.statePath}`,
      `- search index: ${result.searchIndexPath}`,
      `- url: ${result.url}`,
      '- mode: snapshot; restart this command after workspace state changes',
      '- live mode: use skopos ui dev for auto-refreshing workspace state',
      `- readiness: ${result.readiness}`,
      '- stop: Ctrl+C',
    ]);
    return;
  }

  if (subcommand === 'dev') {
    const parsed = parseUiArgs(rest);

    if (parsed.dryRun) {
      throw new Error('Skopos ui dev does not support --dry-run.');
    }

    if (parsed.outputPath) {
      throw new Error('Skopos ui dev does not support --output.');
    }

    if (parsed.outputDirectory) {
      throw new Error('Skopos ui dev does not support --output-dir.');
    }

    const result = await devSkoposUiConsoleApp({
      cwd: parsed.cwd,
      host: parsed.host,
      port: parsed.port,
    });

    const closeServer = (): void => {
      void result.server.close();
    };

    process.once('SIGINT', closeServer);
    process.once('SIGTERM', closeServer);

    if (parsed.json) {
      writeJsonOutput({
        workspaceRoot: result.workspaceRoot,
        host: result.host,
        port: result.port,
        url: result.url,
        stateEndpointPath: result.stateEndpointPath,
        fileEndpointPath: result.fileEndpointPath,
        generatedAt: result.generatedAt,
        readiness: result.readiness,
      });
      return;
    }

    writeLines([
      'Skopos ui dev (live workspace)',
      `- workspace: ${result.workspaceRoot}`,
      `- url: ${result.url}`,
      `- state endpoint: ${result.stateEndpointPath}`,
      `- file endpoint: ${result.fileEndpointPath}`,
      '- mode: live; refreshes when docs or .skopos state changes',
      `- readiness: ${result.readiness}`,
      '- stop: Ctrl+C',
    ]);
    return;
  }

  throw new Error(`Unknown Skopos ui subcommand: ${subcommand}`);
};

const printUiHelp = (subcommand?: string): void => {
  const linesBySubcommand: Record<string, string[]> = {
    render: [
      'Skopos UI render',
      '',
      'Usage:',
      '  skopos ui render [target] [--output <path>] [--dry-run] [--json]',
      '',
      'Use this when you need the legacy static portal artifact.',
    ],
    build: [
      'Skopos UI build',
      '',
      'Usage:',
      '  skopos ui build [target] [--output-dir <path>] [--dry-run] [--json]',
      '',
      'Use this when you need a built routed console app on disk.',
    ],
    serve: [
      'Skopos UI serve',
      '',
      'Usage:',
      '  skopos ui serve [target] [--output-dir <path>] [--host <host>] [--port <port>] [--json]',
      '',
      'Use this for a snapshot preview. Restart it after docs or .skopos state changes.',
      'For live project-state refresh while working, use: skopos ui dev [target].',
    ],
    dev: [
      'Skopos UI dev',
      '',
      'Usage:',
      '  skopos ui dev [target] [--host <host>] [--port <port>] [--json]',
      '',
      'Use this as the normal live workspace UI while working. It refreshes workspace state as docs and .skopos artifacts change.',
    ],
  };

  if (subcommand) {
    writeLines(linesBySubcommand[subcommand]);
    return;
  }

  writeLines([
    'Skopos UI commands',
    '',
    'Usage:',
    '  skopos ui render [target] [--output <path>] [--dry-run] [--json]',
    '  skopos ui build [target] [--output-dir <path>] [--dry-run] [--json]',
    '  skopos ui dev [target] [--host <host>] [--port <port>] [--json]',
    '  skopos ui serve [target] [--output-dir <path>] [--host <host>] [--port <port>] [--json]',
    '',
    'Common choice:',
    '  skopos ui dev . --host 127.0.0.1 --port 4174',
    '',
    'Mode guide:',
    '  dev    live workspace UI; use while coding or reviewing changing Skopos state',
    '  serve  snapshot preview; restart after state changes',
    '  build  write the routed console app to disk',
    '  render write the legacy static portal artifact',
    '',
    'For subcommand details, run:',
    '  skopos ui dev --help',
    '  skopos ui serve --help',
  ]);
};

const parseUiArgs = (args: string[]): ParsedUiArgs => {
  let cwd = process.cwd();
  let outputPath: string | undefined;
  let outputDirectory: string | undefined;
  let host: string | undefined;
  let port: number | undefined;
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

    if (argument === '--output') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --output.');
      }
      outputPath = nextValue;
      index += 1;
      continue;
    }

    if (argument === '--output-dir') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --output-dir.');
      }
      outputDirectory = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--output=')) {
      outputPath = argument.slice('--output='.length);
      continue;
    }

    if (argument.startsWith('--output-dir=')) {
      outputDirectory = argument.slice('--output-dir='.length);
      continue;
    }

    if (argument === '--host') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --host.');
      }
      host = nextValue;
      index += 1;
      continue;
    }

    if (argument.startsWith('--host=')) {
      host = argument.slice('--host='.length);
      continue;
    }

    if (argument === '--port') {
      const nextValue = args[index + 1];
      if (!nextValue || nextValue.startsWith('-')) {
        throw new Error('Missing value for --port.');
      }
      port = parseUiPort(nextValue);
      index += 1;
      continue;
    }

    if (argument.startsWith('--port=')) {
      port = parseUiPort(argument.slice('--port='.length));
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos ui flag: ${argument}`);
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra ui target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, outputPath, outputDirectory, host, port, dryRun, json };
};

const parseUiPort = (value: string): number => {
  const port = Number.parseInt(value, 10);
  if (!Number.isInteger(port) || port < 0 || port > 65_535) {
    throw new Error(`Unsupported Skopos ui port: ${value}`);
  }
  return port;
};
