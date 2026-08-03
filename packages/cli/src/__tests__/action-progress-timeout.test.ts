import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { SkoposActionRunArtifact } from '@skopos/model';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createActionProgressTracker,
  runSkoposActionRuntime,
} from '../../../runtime/src/application/actions/actions.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposSessionContextRuntime } from '../../../runtime/src/application/session/session-context.service.js';
import { executeSkoposShellCommand } from '../../../runtime/src/application/shared/execute-shell-command.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import { writeActionProgress } from '../cli/commands/actions.js';

const temporaryRoots: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;

afterEach(async () => {
  vi.restoreAllMocks();
  if (originalCodexHome === undefined) delete process.env.CODEX_HOME;
  else process.env.CODEX_HOME = originalCodexHome;
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('bounded Action progress and timeout recovery', () => {
  it('caps retained events without losing phase disposition', () => {
    const progress = createActionProgressTracker({
      startedAt: '2026-08-03T00:00:00.000Z',
    });
    progress.record('admission', 'completed', 'Admitted.');
    progress.record('preflight', 'completed', 'Available.');
    for (let index = 0; index < 20; index += 1) {
      progress.record('execution', 'running', `Heartbeat ${index}.`);
    }
    progress.record('execution', 'interrupted', 'Timed out.');
    progress.record('finalization', 'completed', 'Finalized.');

    const summary = progress.snapshot();
    expect(summary.eventCount).toBe(24);
    expect(summary.events).toHaveLength(12);
    expect(summary.completedPhases).toEqual(['admission', 'preflight', 'finalization']);
    expect(summary.interruptedPhases).toEqual(['execution']);
    expect(summary.remainingPhases).toEqual(['execution']);
  });

  it('keeps JSON progress sparse and isolated on stderr', () => {
    const stderr: string[] = [];
    const stdout = vi.spyOn(process.stdout, 'write');
    vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
      stderr.push(String(chunk));
      return true;
    });

    writeActionProgress({
      phase: 'execution',
      status: 'running',
      at: '2026-08-03T00:00:00.000Z',
      elapsedMs: 30_000,
      message: 'Action is still running after 30s.',
    }, true);

    expect(stdout).not.toHaveBeenCalled();
    expect(JSON.parse(stderr.join(''))).toEqual({
      type: 'action-progress',
      phase: 'execution',
      status: 'running',
      at: '2026-08-03T00:00:00.000Z',
      elapsedMs: 30_000,
      message: 'Action is still running after 30s.',
    });
  });

  it('emits sparse shell progress and terminates the process group at timeout', async () => {
    const events: string[] = [];
    const execution = await executeSkoposShellCommand({
      command: `node -e "setTimeout(() => {}, 200)"`,
      cwd: process.cwd(),
      timeoutMs: 60,
      progressIntervalMs: 15,
      onProgress: (event) => events.push(event.kind),
    });

    expect(execution.timedOut).toBe(true);
    expect(events[0]).toBe('started');
    expect(events).toContain('heartbeat');
    expect(events).toContain('timing-out');
    expect(events.at(-1)).toBe('finished');
    expect(events.length).toBeLessThan(10);
  });

  it('records interrupted phases and gives Session Context the exact resume Action', async () => {
    const root = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Prove timeout recovery',
      actor: 'fixture-agent',
      acceptanceCriteria: ['Timeout recovery remains explicit.'],
      ownedPaths: ['src/input.ts'],
    });
    const liveEvents: string[] = [];

    await expect(
      runSkoposActionRuntime({
        cwd: root,
        action: 'fixture.timeout',
        taskId: started.task.id,
        actor: 'fixture-agent',
        onProgress: (event) => liveEvents.push(`${event.phase}:${event.status}`),
      }),
    ).rejects.toThrow('timed out after 60ms');

    const run = await readLatestRun(root);
    expect(run).toMatchObject({
      actionId: 'fixture.timeout',
      taskId: started.task.id,
      runStatus: 'interrupted',
      timedOut: true,
      timeoutMs: 60,
      progress: {
        completedPhases: ['admission', 'preflight', 'finalization'],
        interruptedPhases: ['execution'],
        remainingPhases: ['execution'],
        resume: {
          actionId: 'fixture.timeout',
          command: `skopos actions run fixture.timeout . --task ${started.task.id} --actor fixture-agent --json`,
          requiresApproval: false,
        },
      },
    });
    expect(run.progress?.events.length).toBeLessThanOrEqual(12);
    expect(liveEvents).toEqual(expect.arrayContaining([
      'admission:completed',
      'execution:running',
      'execution:interrupted',
      'finalization:completed',
    ]));

    const context = await buildSkoposSessionContextRuntime({
      cwd: root,
      actor: 'fixture-agent',
    });
    expect(context.interruptedAction).toMatchObject({
      runId: run.id,
      actionId: 'fixture.timeout',
      resumeCommand: run.progress?.resume?.command,
      requiresApproval: false,
    });
    expect(context.nextCommand).toBe(run.progress?.resume?.command);
    expect(context.additionalContext).toContain(`Interrupted Action: fixture.timeout`);
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-action-progress-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, 'tools/skopos/actions'), { recursive: true }),
    mkdir(join(root, 'tools/skopos/guards'), { recursive: true }),
    mkdir(join(root, 'src'), { recursive: true }),
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(root, 'package.json'), '{"name":"fixture","private":true}\n', 'utf8'),
    writeFile(join(root, 'README.md'), '# Progress fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Fixture agent rules\n', 'utf8'),
    writeFile(join(root, 'src/input.ts'), 'export const input = true;\n', 'utf8'),
    writeFile(join(root, 'tools/skopos/actions/fixture-timeout.yaml'), actionSource, 'utf8'),
    writeFile(join(root, 'tools/skopos/guards/fixture-timeout.yaml'), guardSource, 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return root;
};

const readLatestRun = async (root: string): Promise<SkoposActionRunArtifact> => {
  const runsRoot = join(root, '.skopos/runs');
  const entry = (await readdir(runsRoot)).find(
    (candidate) => candidate.startsWith('run-') && candidate.endsWith('.json'),
  );
  if (!entry) throw new Error('Expected an Action run artifact.');
  return JSON.parse(await readFile(join(runsRoot, entry), 'utf8')) as SkoposActionRunArtifact;
};

const actionSource = [
  'id: fixture.timeout',
  'title: Fixture timeout',
  'description: Prove bounded timeout recovery.',
  'category: quality-check',
  'scope: [workspace]',
  'command: node -e "setTimeout(() => {}, 500)"',
  'cwd: .',
  'timeoutMs: 60',
  'inputs: [package.json, src/input.ts]',
  'outputs: []',
  'affects: []',
  'capabilities:',
  '  process: required',
  '  network: none',
  '  browser: none',
  '  tools: [node]',
  '  secrets: []',
  '  services: []',
  'effects:',
  '  workspace: none',
  '  artifacts: none',
  '  external: none',
  'concurrency: shared',
  'workspaceMode: overlay-safe',
  'safety: read-only',
  'requiresApproval: false',
  'phases: [closure]',
  'risks: [standard]',
  'recommendedAfter: []',
  'owner: fixture',
  '',
].join('\n');

const guardSource = [
  'id: fixture.timeout',
  'title: Fixture timeout proof',
  'description: Select timeout proof for fixture source.',
  'owner: fixture',
  'scope: [workspace]',
  'strength: required',
  'appliesTo:',
  '  paths: [src/**]',
  '  phases: [closure]',
  '  risks: [standard]',
  'requires:',
  '  actionIds: [fixture.timeout]',
  '  evidence: source-bound-action',
  '',
].join('\n');
