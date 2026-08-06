import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { SkoposConversationCapsule } from '../../../model/src/index.js';
import {
  buildSkoposDiscussionHandoffRuntime,
  renderSkoposDiscussionHandoffRuntime,
  verifySkoposDiscussionHandoffRuntime,
  openSkoposCoordinationSession,
  getSkoposCoordinationStatus,
} from '../../../runtime/src/index.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import { callSkoposMcpTool } from '../../../mcp/src/index.js';

const roots: string[] = [];
afterEach(async () => Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))));

describe('conversation-aware fresh-session continuation', () => {
  it('shares create, verify, refresh, render, privacy, and source freshness through runtime and MCP', async () => {
    const root = await createWorkspace();
    const task = await buildSkoposStartRuntime({ cwd: root, goal: 'Continue the exact fixture safely', actor: 'origin-agent', ownedPaths: ['src/input.ts'], sessionId: 'origin-session', host: 'codex' });
    const capsule = fixtureCapsule('origin-session');

    const created = await buildSkoposDiscussionHandoffRuntime({ cwd: root, conversationCapsule: capsule });
    expect(created.handoff).toMatchObject({
      schemaVersion: 1,
      handoffKind: 'fresh-session-continuation',
      activeTaskId: task.task.id,
      validation: { freshness: 'current', valid: true, safeToTransfer: true, sensitive: true },
      delivery: { state: 'generated' },
    });
    expect(created.handoff.resumeSummary).toContain('[SKOPOS_FRESH_CONTINUATION_V1]');
    expect(JSON.stringify(created.handoff)).not.toContain('fixture-secret-value');

    const current = await callSkoposMcpTool('skopos_handoff_verify', { cwd: root, taskId: task.task.id });
    expect(current).toMatchObject({ handoff: { validation: { freshness: 'current' } } });
    const rendered = await renderSkoposDiscussionHandoffRuntime({ cwd: root });
    expect(rendered.prompt).toContain('Run skopos session context');

    await writeFile(join(root, 'src/input.ts'), 'export const input = 2;\n', 'utf8');
    const stale = await verifySkoposDiscussionHandoffRuntime({ cwd: root });
    expect(stale.handoff.validation.freshness).toBe('stale');
    const refreshed = await callSkoposMcpTool('skopos_handoff_refresh', { cwd: root, taskId: task.task.id });
    expect(refreshed).toMatchObject({ handoff: { validation: { freshness: 'current' } } });

    await openSkoposCoordinationSession({ cwd: root, actorId: 'receiving-agent', host: 'codex', sessionId: 'receiving-session' });
    const accepted = await callSkoposMcpTool('skopos_handoff_accept', { cwd: root, taskId: task.task.id, actor: 'receiving-agent', receivingSessionId: 'receiving-session', destinationHost: 'codex' });
    expect(accepted).toMatchObject({ handoff: { delivery: { state: 'accepted', receivingSessionId: 'receiving-session' } } });
    const coordination = await getSkoposCoordinationStatus({ cwd: root });
    expect(coordination.reservations.find((entry) => entry.taskId === task.task.id)?.sessionId).toBe('receiving-session');
    const delivered = await callSkoposMcpTool('skopos_handoff_deliver', { cwd: root, taskId: task.task.id, actor: 'receiving-agent', result: 'pass', destinationRef: 'codex-task-fixture', originMessageOutcome: 'succeeded', detail: 'Host API created the task, injected the prompt, and confirmed origin messaging.' });
    expect(delivered).toMatchObject({ handoff: { delivery: { state: 'delivered', outcome: expect.stringContaining('codex-task-fixture') } } });
  });

  it('fails over budget explicitly without truncating semantic context', async () => {
    const root = await createWorkspace();
    await buildSkoposStartRuntime({ cwd: root, goal: 'Keep a complete bounded handoff', actor: 'origin-agent', ownedPaths: ['src/input.ts'] });
    const capsule = fixtureCapsule('budget-session');
    capsule.statements[0]!.text = Array.from({ length: 18_000 }, (_, index) => `word${index}`).join(' ');
    const created = await buildSkoposDiscussionHandoffRuntime({ cwd: root, conversationCapsule: capsule });
    expect(created.handoff.validation).toMatchObject({ overBudget: true, valid: false, safeToTransfer: false });
    expect(created.handoff.resumeSummary).toContain('word17999');
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-continuation-'));
  roots.push(root);
  await Promise.all([
    mkdir(join(root, 'src'), { recursive: true }),
    writeFile(join(root, 'package.json'), '{"name":"continuation-fixture","private":true}\n', 'utf8'),
    writeFile(join(root, 'README.md'), '# Continuation fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Fixture rules\n', 'utf8'),
    writeFile(join(root, 'src/input.ts'), 'export const input = 1;\n', 'utf8'),
  ]);
  await initSkoposProject({ cwd: root, mode: 'existing', actor: 'fixture-init', scaffoldInstructions: false });
  return root;
};

const fixtureCapsule = (sessionId: string): SkoposConversationCapsule => ({
  authoredBy: 'origin-agent',
  authoredAt: '2026-08-05T00:00:00.000Z',
  origin: { host: 'codex', sessionId, threadId: 'origin-thread' },
  statements: [
    { id: 'objective', section: 'objective', classification: 'user-direction', text: 'Continue without replaying the transcript.', sourceRefs: ['user request'] },
    { id: 'stop', section: 'stopping-point', classification: 'verified-fact', text: 'The contract is ready for focused proof.', sourceRefs: ['Task state'] },
    { id: 'next', section: 'recommended-first-action', classification: 'agent-recommendation', text: 'Verify the exact handoff first; token=fixture-secret-value', sourceRefs: [] },
  ],
});
