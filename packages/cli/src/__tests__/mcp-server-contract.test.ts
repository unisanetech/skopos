import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  callSkoposMcpTool,
  skoposMcpToolIds,
  skoposMcpTools,
} from '../../../mcp/src/index.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import {
  openSkoposCoordinationSession,
  reserveSkoposCoordinationTask,
} from '../../../runtime/src/application/coordination/coordination.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';

const temporaryRoots: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;

afterEach(async () => {
  if (originalCodexHome === undefined) delete process.env.CODEX_HOME;
  else process.env.CODEX_HOME = originalCodexHome;
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('MCP recovery and disposition contract', () => {
  it('publishes the canonical recovery and disposition mutation tools', () => {
    expect(skoposMcpToolIds).toEqual(expect.arrayContaining([
      'skopos_action_recover',
      'skopos_task_disposition',
      'skopos_coordination_task_recover',
    ]));
    const definitions = Object.fromEntries(skoposMcpTools.map((tool) => [tool.name, tool]));
    expect(definitions.skopos_action_recover?.inputSchema.required).toEqual([
      'cwd',
      'runId',
      'actor',
      'reason',
    ]);
    expect(definitions.skopos_task_disposition?.inputSchema.required).toEqual([
      'cwd',
      'taskId',
      'disposition',
      'actor',
      'reason',
    ]);
    expect(definitions.skopos_coordination_task_recover?.inputSchema.required).toEqual([
      'cwd',
      'taskId',
      'sessionId',
      'operation',
      'reason',
    ]);
  });

  it('dispatches Task disposition to the shared runtime state machine', async () => {
    const root = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Prove MCP disposition parity',
      actor: 'mcp-agent',
      ownedPaths: ['src/input.ts'],
    });

    const result = await callSkoposMcpTool('skopos_task_disposition', {
      cwd: root,
      taskId: started.task.id,
      disposition: 'defer',
      actor: 'mcp-agent',
      reason: 'Pause the fixture through the MCP transport.',
    });

    expect(result).toMatchObject({
      id: started.task.id,
      state: 'deferred',
      disposition: {
        kind: 'defer',
        actorId: 'mcp-agent',
        reason: 'Pause the fixture through the MCP transport.',
      },
    });
  });

  it('dispatches expired Action and stale coordination recovery to shared authorities', async () => {
    const root = await createWorkspace();
    const runId = 'run-20260803T000000Z-mcp-expired';
    await mkdir(join(root, '.skopos/runs'), { recursive: true });
    await writeFile(
      join(root, '.skopos/runs', `${runId}.json`),
      JSON.stringify({
        schemaVersion: 1,
        id: runId,
        type: 'action-run',
        status: 'generated',
        authority: 'generated',
        summary: 'fixture running',
        generatedAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        workspaceRoot: root,
        actionId: 'fixture.mcp',
        actionTitle: 'Fixture MCP',
        actionCategory: 'quality-check',
        actionSafety: 'read-only',
        sourcePath: 'tools/skopos/actions/fixture-mcp.yaml',
        command: 'pnpm test',
        cwd: '.',
        taskId: 'T-mcp-recovery',
        runStatus: 'running',
        exitCode: null,
        timeoutMs: 1000,
        startedAt: '2026-01-01T00:00:00.000Z',
        outputPaths: [],
        evidence: {
          owner: { runId, leaseExpiresAt: '2026-01-01T00:00:01.000Z' },
        },
      }),
      'utf8',
    );
    const recoveredAction = await callSkoposMcpTool('skopos_action_recover', {
      cwd: root,
      runId,
      actor: 'mcp-recovery-agent',
      reason: 'Recover the expired MCP fixture.',
    });
    expect(recoveredAction).toMatchObject({
      run: { id: runId, runStatus: 'interrupted' },
    });

    const stale = await openSkoposCoordinationSession({
      cwd: root,
      actorId: 'stale-agent',
      host: 'mcp-test',
      sessionId: 'stale-session',
    });
    await reserveSkoposCoordinationTask({
      cwd: root,
      sessionId: 'stale-session',
      taskId: 'T-mcp-recovery',
    });
    expireSessionLease(stale.databasePath, 'stale-session');
    await openSkoposCoordinationSession({
      cwd: root,
      actorId: 'replacement-agent',
      host: 'mcp-test',
      sessionId: 'replacement-session',
    });
    const recoveredTask = await callSkoposMcpTool(
      'skopos_coordination_task_recover',
      {
        cwd: root,
        taskId: 'T-mcp-recovery',
        sessionId: 'replacement-session',
        operation: 'resume',
        reason: 'Resume through the MCP recovery authority.',
      },
    );
    expect(recoveredTask).toMatchObject({
      taskId: 'T-mcp-recovery',
      priorSessionId: 'stale-session',
      sessionId: 'replacement-session',
      outcome: 'resumed',
    });
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-mcp-recovery-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
    mkdir(join(root, 'src'), { recursive: true }),
    writeFile(join(root, 'package.json'), '{"name":"fixture","private":true}\n', 'utf8'),
    writeFile(join(root, 'README.md'), '# MCP recovery fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Fixture agent rules\n', 'utf8'),
    writeFile(join(root, 'src/input.ts'), 'export const input = true;\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return root;
};

const expireSessionLease = (databasePath: string, sessionId: string): void => {
  const script = `
    import { DatabaseSync } from 'node:sqlite';
    const db = new DatabaseSync(process.argv[1]);
    db.prepare('UPDATE sessions SET lease_expires_at_ms = 0 WHERE session_id = ?').run(process.argv[2]);
    db.close();
  `;
  const result = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', script, databasePath, sessionId],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) throw new Error(result.stderr || 'Failed to expire Session.');
};
