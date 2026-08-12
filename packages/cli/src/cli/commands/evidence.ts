import { resolve } from 'node:path';

import {
  recordSkoposBrowserEvidenceRuntime,
  recordSkoposObservationEvidenceRuntime,
  reuseSkoposTaskActionEvidenceRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

export const runEvidenceCommand = async (args: string[]): Promise<void> => {
  const parsed = parseEvidenceArgs(args);
  if (parsed.subcommand === 'reuse') {
    const report = await reuseSkoposTaskActionEvidenceRuntime({
      cwd: parsed.cwd,
      taskId: parsed.taskId,
      actor: parsed.actor,
    });
    const unresolved = report.outcomes.filter(
      (outcome) => outcome.status === 'rejected' || outcome.status === 'missing',
    );
    if (parsed.json) {
      writeJsonOutput(
        parsed.compact
          ? {
              schemaVersion: 1,
              id: report.id,
              type: 'task-evidence-reuse-summary',
              status: report.status,
              summary: report.summary,
              workspaceRoot: report.workspaceRoot,
              taskId: report.taskId,
              actorId: report.actorId,
              selectedActionCount: report.selectedActionCount,
              linkedCount: report.linkedCount,
              alreadyLinkedCount: report.alreadyLinkedCount,
              rejectedCount: report.rejectedCount,
              missingCount: report.missingCount,
              processExecutionCount: report.processExecutionCount,
              unresolved: unresolved.slice(0, 20),
              truncatedUnresolvedCount: Math.max(0, unresolved.length - 20),
              detailPath: report.reportPath,
            }
          : report,
      );
      return;
    }
    writeLines([
      'Skopos Evidence reuse',
      `Task: ${report.taskId}`,
      `Linked: ${report.linkedCount}`,
      `Already linked: ${report.alreadyLinkedCount}`,
      `Rejected: ${report.rejectedCount}`,
      `Missing: ${report.missingCount}`,
      `Action processes executed: ${report.processExecutionCount}`,
      ...unresolved.slice(0, 20).map(
        (outcome) => `- ${outcome.actionId} [${outcome.status}]: ${outcome.summary}`,
      ),
      unresolved.length > 20
        ? `- ${unresolved.length - 20} more unresolved outcome(s) in ${report.reportPath}`
        : `Details: ${report.reportPath}`,
    ]);
    return;
  }
  if (parsed.subcommand === 'record-browser') {
    const artifact = await recordSkoposBrowserEvidenceRuntime({
      cwd: parsed.cwd,
      taskId: parsed.taskId,
      requirementId: parsed.requirementId,
      guardIds: parsed.guardIds,
      url: parsed.url,
      viewport: parsed.viewport,
      conditions: parsed.conditions,
      interaction: parsed.interaction,
      captureKind: parsed.captureKind,
      capturePath: parsed.capturePath,
      measurement: parsed.measurement,
      browser: parsed.browser,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });
    if (parsed.json) {
      writeJsonOutput(parsed.compact ? {
        schemaVersion: 1,
        id: artifact.id,
        type: 'browser-evidence-summary',
        status: artifact.status,
        workspaceRoot: artifact.workspaceRoot,
        taskId: artifact.taskId,
        requirementId: artifact.requirementId,
        guardIds: artifact.guardIds,
        url: artifact.url,
        viewport: artifact.viewport,
        interaction: artifact.interaction,
        capture: artifact.capture,
        browser: artifact.browser,
        environment: artifact.environment,
        observedByActorId: artifact.observedByActorId,
        observedAt: artifact.observedAt,
        sourceStateDigest: artifact.sourceStateDigest,
        sourcePathCount: artifact.sourcePathStates.length,
      } : artifact);
      return;
    }
    writeLines([
      'Skopos Browser Evidence',
      `Task: ${artifact.taskId}`,
      `Evidence: ${artifact.id}`,
      `URL: ${artifact.url}`,
      `Viewport: ${artifact.viewport.width}x${artifact.viewport.height}`,
      `Interaction: ${artifact.interaction}`,
      `Capture: ${artifact.capture.kind} ${artifact.capture.path ?? '(inline measurement)'}`,
      `Browser: ${artifact.browser}`,
      `Source digest: ${artifact.sourceStateDigest}`,
    ]);
    return;
  }
  if (parsed.subcommand !== 'record-observation') {
    throw new Error(`Unknown Skopos Evidence subcommand: ${parsed.subcommand ?? '(missing)'}`);
  }
  const artifact = await recordSkoposObservationEvidenceRuntime({
    cwd: parsed.cwd,
    taskId: parsed.taskId,
    requirementId: parsed.requirementId,
    guardIds: parsed.guardIds,
    statement: parsed.statement,
    actor: parsed.actor,
    dryRun: parsed.dryRun,
  });
  if (parsed.json) {
    writeJsonOutput(
      parsed.compact
        ? {
            schemaVersion: 1,
            id: artifact.id,
            type: 'observation-evidence-summary',
            status: artifact.status,
            workspaceRoot: artifact.workspaceRoot,
            taskId: artifact.taskId,
            requirementId: artifact.requirementId,
            guardIds: artifact.guardIds,
            statement: artifact.statement,
            observedByActorId: artifact.observedByActorId,
            observedAt: artifact.observedAt,
            sourceStateDigest: artifact.sourceStateDigest,
            sourcePathCount: artifact.sourcePathStates.length,
          }
        : artifact,
    );
    return;
  }
  writeLines([
    'Skopos Evidence',
    `Task: ${artifact.taskId}`,
    `Evidence: ${artifact.id}`,
    `Observed by: ${artifact.observedByActorId}`,
    `Acceptance requirement: ${artifact.requirementId ?? '(none)'}`,
    `Guards: ${artifact.guardIds.join(', ') || '(none)'}`,
    `Statement: ${artifact.statement}`,
    `Source digest: ${artifact.sourceStateDigest}`,
  ]);
};

const parseEvidenceArgs = (args: string[]) => {
  const positionals: string[] = [];
  let cwd = process.cwd();
  let requirementId: string | undefined;
  const guardIds: string[] = [];
  let statement = '';
  let url = '';
  let viewport: { width: number; height: number; deviceScaleFactor?: number } = {
    width: 0,
    height: 0,
  };
  const conditions: string[] = [];
  let interaction = '';
  let captureKind: 'screenshot' | 'accessibility' | 'dom-measurement' = 'screenshot';
  let capturePath: string | undefined;
  let measurement: string | undefined;
  let browser = '';
  let actor: string | undefined;
  let dryRun = false;
  let compact = true;
  let json = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]!;
    if (argument === '--json') json = true;
    else if (argument === '--compact') compact = true;
    else if (argument === '--full') compact = false;
    else if (argument === '--dry-run') dryRun = true;
    else if (argument === '--requirement') requirementId = requireValue(args, ++index, '--requirement');
    else if (argument.startsWith('--requirement=')) requirementId = argument.slice('--requirement='.length);
    else if (argument === '--guard') guardIds.push(requireValue(args, ++index, '--guard'));
    else if (argument.startsWith('--guard=')) guardIds.push(argument.slice('--guard='.length));
    else if (argument === '--statement') statement = requireValue(args, ++index, '--statement');
    else if (argument.startsWith('--statement=')) statement = argument.slice('--statement='.length);
    else if (argument === '--url') url = requireValue(args, ++index, '--url');
    else if (argument.startsWith('--url=')) url = argument.slice('--url='.length);
    else if (argument === '--viewport') viewport = parseViewport(requireValue(args, ++index, '--viewport'));
    else if (argument.startsWith('--viewport=')) viewport = parseViewport(argument.slice('--viewport='.length));
    else if (argument === '--condition') conditions.push(requireValue(args, ++index, '--condition'));
    else if (argument.startsWith('--condition=')) conditions.push(argument.slice('--condition='.length));
    else if (argument === '--interaction') interaction = requireValue(args, ++index, '--interaction');
    else if (argument.startsWith('--interaction=')) interaction = argument.slice('--interaction='.length);
    else if (argument === '--capture-kind') captureKind = parseCaptureKind(requireValue(args, ++index, '--capture-kind'));
    else if (argument.startsWith('--capture-kind=')) captureKind = parseCaptureKind(argument.slice('--capture-kind='.length));
    else if (argument === '--capture') capturePath = requireValue(args, ++index, '--capture');
    else if (argument.startsWith('--capture=')) capturePath = argument.slice('--capture='.length);
    else if (argument === '--measurement') measurement = requireValue(args, ++index, '--measurement');
    else if (argument.startsWith('--measurement=')) measurement = argument.slice('--measurement='.length);
    else if (argument === '--browser') browser = requireValue(args, ++index, '--browser');
    else if (argument.startsWith('--browser=')) browser = argument.slice('--browser='.length);
    else if (argument === '--actor') actor = requireValue(args, ++index, '--actor');
    else if (argument.startsWith('--actor=')) actor = argument.slice('--actor='.length);
    else if (argument.startsWith('-')) throw new Error(`Unknown Skopos Evidence flag: ${argument}`);
    else positionals.push(argument);
  }
  const [subcommand, taskId, target] = positionals;
  if (!taskId) throw new Error('Evidence command requires a Task id.');
  if (target) cwd = resolve(target);
  return {
    subcommand,
    taskId,
    cwd,
    requirementId,
    guardIds,
    statement,
    url,
    viewport,
    conditions,
    interaction,
    captureKind,
    capturePath,
    measurement,
    browser,
    actor,
    dryRun,
    compact,
    json,
  };
};

const parseViewport = (
  value: string,
): { width: number; height: number; deviceScaleFactor?: number } => {
  const match = /^(\d+)x(\d+)(?:@(\d+(?:\.\d+)?))?$/u.exec(value.trim());
  if (!match) throw new Error('--viewport requires WIDTHxHEIGHT or WIDTHxHEIGHT@SCALE.');
  const width = Number(match[1]);
  const height = Number(match[2]);
  const deviceScaleFactor = match[3] ? Number(match[3]) : undefined;
  if (width <= 0 || height <= 0 || (deviceScaleFactor !== undefined && deviceScaleFactor <= 0)) {
    throw new Error('--viewport values must be positive.');
  }
  return { width, height, ...(deviceScaleFactor ? { deviceScaleFactor } : {}) };
};

const parseCaptureKind = (
  value: string,
): 'screenshot' | 'accessibility' | 'dom-measurement' => {
  if (value === 'screenshot' || value === 'accessibility' || value === 'dom-measurement') {
    return value;
  }
  throw new Error('--capture-kind requires screenshot, accessibility, or dom-measurement.');
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index];
  if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}.`);
  return value;
};
