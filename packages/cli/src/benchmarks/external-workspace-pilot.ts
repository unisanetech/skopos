import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { COMPACT_JSON_BUDGET_BYTES } from '../cli/shared/pagination.js';

type SurfaceMeasurement = {
  name: string;
  bytes: number;
  durationMs: number;
};

export type ExternalWorkspacePilotReport = {
  schemaVersion: 1;
  workspace: string;
  dirtyStatusEntryCount: number;
  surfaces: SurfaceMeasurement[];
  queue: {
    total: number;
    firstReturned: number;
    secondReturned: number;
    cursorPresent: boolean;
    overlapCount: number;
    counts: Record<string, number>;
  };
  actions: {
    total: number;
    firstReturned: number;
    secondReturned: number;
    cursorPresent: boolean;
    overlapCount: number;
  };
  selectedTask?: { id: string; state?: string; scopeId?: string };
  questionIds: string[];
  prohibitedQuestionIds: string[];
  toolCallCount: number;
  actionsExecuted: 0;
  tasksCreated: 0;
  compactBudgetBytes: number;
  limitations: string[];
};

export const runExternalWorkspacePilot = (
  target: string,
): ExternalWorkspacePilotReport => {
  const targetRoot = resolve(target);
  const cliPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist/cli.js');
  const calls: SurfaceMeasurement[] = [];
  const invoke = <T>(name: string, args: string[]): T => {
    const startedAt = performance.now();
    const output = execFileSync(process.execPath, [cliPath, ...args], {
      cwd: targetRoot,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
    calls.push({
      name,
      bytes: Buffer.byteLength(output, 'utf8'),
      durationMs: performance.now() - startedAt,
    });
    return JSON.parse(output) as T;
  };

  const session = invoke<Record<string, unknown>>('session', [
    'session',
    'context',
    '.',
    '--actor',
    'external-workspace-pilot',
    '--dry-run',
    '--json',
  ]);
  const queueFirst = invoke<QueuePage>('work-queue-first', [
    'work',
    'queue',
    '.',
    '--actor',
    'external-workspace-pilot',
    '--dry-run',
    '--json',
  ]);
  const queueSecond = queueFirst.page.nextCursor
    ? invoke<QueuePage>('work-queue-second', [
        'work',
        'queue',
        '.',
        '--actor',
        'external-workspace-pilot',
        '--cursor',
        queueFirst.page.nextCursor,
        '--dry-run',
        '--json',
      ])
    : emptyQueuePage();
  const actionFirst = invoke<ActionPage>('actions-first', [
    'actions',
    'list',
    '.',
    '--limit',
    '10',
    '--json',
  ]);
  const actionSecond = actionFirst.page.nextCursor
    ? invoke<ActionPage>('actions-second', [
        'actions',
        'list',
        '.',
        '--limit',
        '10',
        '--cursor',
        actionFirst.page.nextCursor,
        '--json',
      ])
    : emptyActionPage();
  const selectedQueueTask = [...queueFirst.entries, ...queueSecond.entries].find(
    (entry) => entry.sourceKind === 'task',
  );
  const task = selectedQueueTask
    ? invoke<TaskSummary>('task', [
        'task',
        'show',
        selectedQueueTask.id,
        '.',
        '--json',
      ])
    : undefined;
  const plan = invoke<PlanSummary>('plan-dry-run', [
    'plan',
    'Bound Session context transport and replace unbounded Task verification output with cursor paging',
    '.',
    '--actor',
    'external-workspace-pilot',
    '--dry-run',
    '--full',
    '--json',
  ]);
  void session;

  const dirtyStatusEntryCount = execFileSync('git', ['status', '--short'], {
    cwd: targetRoot,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  })
    .split('\n')
    .filter(Boolean).length;
  const prohibitedQuestionIds = [
    'plan.vendor-choice',
    'plan.destructive-migration',
    'plan.security-privacy-change',
  ];
  const report: ExternalWorkspacePilotReport = {
    schemaVersion: 1,
    workspace: basename(targetRoot),
    dirtyStatusEntryCount,
    surfaces: calls,
    queue: {
      total: queueFirst.page.total,
      firstReturned: queueFirst.page.returned,
      secondReturned: queueSecond.page.returned,
      cursorPresent: Boolean(queueFirst.page.nextCursor),
      overlapCount: intersectionCount(
        queueFirst.entries.map((entry) => entry.id),
        queueSecond.entries.map((entry) => entry.id),
      ),
      counts: queueFirst.counts,
    },
    actions: {
      total: actionFirst.page.total,
      firstReturned: actionFirst.page.returned,
      secondReturned: actionSecond.page.returned,
      cursorPresent: Boolean(actionFirst.page.nextCursor),
      overlapCount: intersectionCount(
        actionFirst.actions.map((entry) => entry.actionId),
        actionSecond.actions.map((entry) => entry.actionId),
      ),
    },
    selectedTask: task
      ? { id: task.id, state: task.state, scopeId: task.scopeId }
      : undefined,
    questionIds: plan.decisionQuestions.map((question) => question.id),
    prohibitedQuestionIds,
    toolCallCount: calls.length,
    actionsExecuted: 0,
    tasksCreated: 0,
    compactBudgetBytes: COMPACT_JSON_BUDGET_BYTES,
    limitations: [
      'The pilot validates Skopos transport, retrieval, classification, and project integration behavior; it does not certify Unisane product implementation or production deployment.',
      'The live Unisane Work Queue and dirty worktree remain project-owned state and are reported, not resolved, by this pilot.',
      'Command durations are local wall-clock observations and exclude model reasoning or network latency.',
    ],
  };
  assertExternalWorkspacePilot(report);
  return report;
};

export const assertExternalWorkspacePilot = (
  report: ExternalWorkspacePilotReport,
): void => {
  const oversized = report.surfaces.filter(
    (surface) => surface.bytes >= report.compactBudgetBytes,
  );
  if (oversized.length > 0) {
    throw new Error(
      `Compact budget exceeded: ${oversized.map((surface) => `${surface.name}=${surface.bytes}`).join(', ')}`,
    );
  }
  if (report.queue.overlapCount > 0 || report.actions.overlapCount > 0) {
    throw new Error('Cursor pages contain duplicate collection entries.');
  }
  const falseQuestions = report.questionIds.filter((id) =>
    report.prohibitedQuestionIds.includes(id),
  );
  if (falseQuestions.length > 0) {
    throw new Error(`Operational homonyms created unrelated questions: ${falseQuestions.join(', ')}`);
  }
};

export const renderExternalWorkspacePilotReport = (
  report: ExternalWorkspacePilotReport,
): string => {
  const surfaceRows = report.surfaces
    .map(
      (surface) =>
        `| ${surface.name} | ${surface.bytes.toLocaleString('en-US')} | ${surface.durationMs.toFixed(1)} | pass |`,
    )
    .join('\n');
  const limitations = report.limitations.map((entry) => `- ${entry}`).join('\n');
  return `---
title: Unisane External Workspace Pilot
status: generated
owner: skopos-core
id: DOC-unisane-external-workspace-pilot
scope: skopos
role: reference
lifecycle: durable
authority: generated
provenance: observed
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - ../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
---

# Unisane External Workspace Pilot

## Result

- Workspace label: ${report.workspace}
- Dirty Git status entries: ${report.dirtyStatusEntryCount.toLocaleString('en-US')}
- Work Queue: ${report.queue.total} total; ${report.queue.firstReturned} first-page and ${report.queue.secondReturned} second-page entries; overlap ${report.queue.overlapCount}
- Queue disposition counts: ${Object.entries(report.queue.counts).map(([key, value]) => `${key}=${value}`).join(', ')}
- Action catalog: ${report.actions.total} total; ${report.actions.firstReturned} first-page and ${report.actions.secondReturned} second-page entries; overlap ${report.actions.overlapCount}
- Selected existing Task: ${report.selectedTask ? `${report.selectedTask.id} (${report.selectedTask.state ?? 'unknown'}, ${report.selectedTask.scopeId ?? 'unknown'})` : 'none'}
- Dry-run question ids: ${report.questionIds.join(', ') || 'none'}
- Actions executed by pilot: ${report.actionsExecuted}
- Tasks created by pilot: ${report.tasksCreated}

All measured agent JSON surfaces remained below ${report.compactBudgetBytes.toLocaleString('en-US')} bytes.

| Surface | JSON bytes | Local ms | Budget |
| --- | ---: | ---: | --- |
${surfaceRows}

## Method

The pilot invokes the current built Skopos CLI against the live external workspace. It
uses dry-run Session, Work Queue, and Plan calls; cursor-paged Action and queue reads;
and compact Task detail for one existing Task. It counts Git status entries but does
not execute a project Action or create, claim, or mutate a project Task.

## Limits

${limitations}

## Reproduce

Build Skopos, then run \`pnpm benchmark:external-workspace --target <workspace> --write\`.
`;
};

type Page = {
  total: number;
  returned: number;
  nextCursor?: string;
};

type QueuePage = {
  entries: Array<{ id: string; sourceKind: string }>;
  counts: Record<string, number>;
  page: Page;
};

type ActionPage = {
  actions: Array<{ actionId: string }>;
  page: Page;
};

type TaskSummary = { id: string; state?: string; scopeId?: string };
type PlanSummary = { decisionQuestions: Array<{ id: string }> };

const emptyQueuePage = (): QueuePage => ({
  entries: [],
  counts: {},
  page: { total: 0, returned: 0 },
});

const emptyActionPage = (): ActionPage => ({
  actions: [],
  page: { total: 0, returned: 0 },
});

const intersectionCount = (left: string[], right: string[]): number => {
  const leftSet = new Set(left);
  return right.filter((entry) => leftSet.has(entry)).length;
};

const parseArguments = (): { target: string; write: boolean } => {
  const targetIndex = process.argv.indexOf('--target');
  const target = targetIndex >= 0 ? process.argv[targetIndex + 1] : undefined;
  if (!target) throw new Error('Usage: --target <workspace> [--write].');
  return { target, write: process.argv.includes('--write') };
};

const main = async (): Promise<void> => {
  const args = parseArguments();
  const report = runExternalWorkspacePilot(args.target);
  if (!args.write) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }
  const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
  const outputPath = resolve(
    workspaceRoot,
    `docs/reference/generated/${report.workspace.toLowerCase()}-external-workspace-pilot.md`,
  );
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderExternalWorkspacePilotReport(report), 'utf8');
  process.stdout.write(`${outputPath}\n`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
