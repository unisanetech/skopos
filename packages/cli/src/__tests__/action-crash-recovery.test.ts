import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { recoverSkoposActionRunRuntime } from '../../../runtime/src/application/actions/actions.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { runActionsCommand } from '../cli/commands/actions.js';

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

describe('Action crash recovery', () => {
  it('converts an expired running Action into auditable resumable interruption', async () => {
    const root = await createWorkspace();
    const runId = 'run-20260803T000000Z-fixture-expired';
    const leasePath = await writeRunningAction(root, runId, '2026-01-01T00:00:00.000Z');

    const result = await recoverSkoposActionRunRuntime({
      cwd: root,
      runId,
      actor: 'replacement-agent',
      reason: 'The prior host crashed after its execution lease expired.',
    });

    expect(result.run).toMatchObject({
      runStatus: 'interrupted',
      taskId: 'T-fixture',
      progress: {
        interruptedPhases: ['execution'],
        remainingPhases: ['execution', 'finalization'],
        resume: {
          actionId: 'fixture.crash',
          command:
            'skopos actions run fixture.crash . --task T-fixture --actor replacement-agent --json',
        },
      },
      recovery: {
        recoveredByActorId: 'replacement-agent',
        priorLeaseExpiresAt: '2026-01-01T00:00:00.000Z',
      },
    });
    await expect(access(leasePath)).rejects.toThrow();
    const persisted = await readFile(
      join(root, '.skopos/runs', `${runId}.json`),
      'utf8',
    );
    expect(persisted).toContain('The prior host crashed');
  });

  it('protects a running Action while its execution lease is live', async () => {
    const root = await createWorkspace();
    const runId = 'run-20260803T000000Z-fixture-active';
    await writeRunningAction(root, runId, '2999-01-01T00:00:00.000Z');

    await expect(
      recoverSkoposActionRunRuntime({
        cwd: root,
        runId,
        actor: 'replacement-agent',
        reason: 'Unsafe early recovery attempt.',
      }),
    ).rejects.toThrow('still has an active execution lease');
  });

  it('exposes expired recovery through the public CLI command', async () => {
    const root = await createWorkspace();
    const runId = 'run-20260803T000000Z-fixture-cli';
    await writeRunningAction(root, runId, '2026-01-01T00:00:00.000Z');
    const stdout: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      stdout.push(String(chunk));
      return true;
    });

    await runActionsCommand([
      'recover',
      runId,
      root,
      '--actor',
      'cli-agent',
      '--reason',
      'Recover through the public CLI.',
      '--json',
    ]);

    expect(JSON.parse(stdout.join(''))).toMatchObject({
      runId,
      status: 'interrupted',
      progress: {
        resume: {
          command:
            'skopos actions run fixture.crash . --task T-fixture --actor cli-agent --json',
        },
      },
    });
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-action-crash-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
    writeFile(join(root, 'package.json'), '{"name":"fixture","private":true}\n', 'utf8'),
    writeFile(join(root, 'README.md'), '# Crash recovery fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Fixture agent rules\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return root;
};

const writeRunningAction = async (
  root: string,
  runId: string,
  leaseExpiresAt: string,
): Promise<string> => {
  const runsRoot = join(root, '.skopos', 'runs');
  const locksRoot = join(root, '.skopos', 'locks', 'actions');
  await Promise.all([
    mkdir(runsRoot, { recursive: true }),
    mkdir(locksRoot, { recursive: true }),
  ]);
  const run = {
    schemaVersion: 1,
    id: runId,
    type: 'action-run',
    status: 'generated',
    authority: 'generated',
    summary: 'fixture.crash running.',
    generatedAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    workspaceRoot: root,
    actionId: 'fixture.crash',
    actionTitle: 'Fixture crash',
    actionCategory: 'quality-check',
    actionSafety: 'read-only',
    runByActorId: 'stale-agent',
    sourcePath: 'tools/skopos/actions/fixture-crash.yaml',
    command: 'pnpm test',
    cwd: '.',
    taskId: 'T-fixture',
    runStatus: 'running',
    exitCode: null,
    timeoutMs: 900000,
    startedAt: '2026-01-01T00:00:00.000Z',
    outputPaths: [],
    evidence: {
      schemaVersion: 1,
      executionKey: 'fixture-execution-key',
      actionId: 'fixture.crash',
      command: { raw: 'pnpm test', cwd: '.', digest: 'command-digest' },
      sourceState: { algorithm: 'sha256', digest: 'source-digest', paths: [] },
      environment: {
        platform: 'fixture',
        architecture: 'fixture',
        nodeVersion: process.version,
        workspace: { workspaceId: 'fixture', worktreeId: 'fixture' },
        capabilities: {
          process: 'required',
          network: 'none',
          browser: 'none',
          tools: [],
          secrets: [],
          services: [],
        },
        effects: { workspace: 'none', artifacts: 'none', external: 'none' },
        concurrency: 'shared',
      },
      owner: { runId, actorId: 'stale-agent', leaseExpiresAt },
      freshness: { policy: 'source-bound', capturedAt: '2026-01-01T00:00:00.000Z' },
    },
    progress: {
      eventCount: 3,
      events: [],
      completedPhases: ['admission', 'preflight'],
      failedPhases: [],
      interruptedPhases: [],
      remainingPhases: ['execution', 'finalization'],
    },
  };
  await writeFile(join(runsRoot, `${runId}.json`), JSON.stringify(run, null, 2), 'utf8');
  const leasePath = join(locksRoot, `${runId}.json`);
  await writeFile(leasePath, JSON.stringify({ runId }), 'utf8');
  return leasePath;
};
