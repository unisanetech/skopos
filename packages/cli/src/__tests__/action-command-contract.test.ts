import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runActionsCommand } from '../cli/commands/actions.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('public Action command contract', () => {
  it('exposes capability, effect, and concurrency declarations from show JSON', async () => {
    const root = await mkdtemp(join(tmpdir(), 'skopos-action-command-'));
    temporaryRoots.push(root);
    await mkdir(join(root, 'tools/skopos/actions'), { recursive: true });
    await writeFile(
      join(root, 'tools/skopos/actions/browser-proof.yaml'),
      [
        'id: browser.proof',
        'title: Browser proof',
        'description: Prove the public Action command contract.',
        'category: quality-check',
        'scope: [workspace]',
        'command: pnpm test',
        'cwd: .',
        'inputs: [package.json]',
        'outputs: [report.json]',
        'affects: []',
        'capabilities:',
        '  process: required',
        '  network: none',
        '  browser: required',
        '  tools: [pnpm]',
        '  secrets: []',
        '  services: []',
        'effects:',
        '  workspace: none',
        '  artifacts: isolated',
        '  external: none',
        'concurrency: shared',
        'workspaceMode: overlay-safe',
        'safety: artifact-producing',
        'requiresApproval: false',
        'recommendedAfter: []',
        'owner: fixture',
        '',
      ].join('\n'),
      'utf8',
    );
    const writes: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      writes.push(String(chunk));
      return true;
    });

    await runActionsCommand(['show', 'browser.proof', root, '--json']);

    expect(JSON.parse(writes.join(''))).toMatchObject({
      actionId: 'browser.proof',
      capabilities: {
        process: 'required',
        network: 'none',
        browser: 'required',
        tools: ['pnpm'],
        secrets: [],
        services: [],
      },
      effects: {
        workspace: 'none',
        artifacts: 'isolated',
        external: 'none',
      },
      concurrency: 'shared',
      workspaceMode: 'overlay-safe',
      safety: 'artifact-producing',
    });
  });
});
