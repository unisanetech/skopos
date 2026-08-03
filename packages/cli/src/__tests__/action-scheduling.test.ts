import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runSkoposActionRuntime } from '../../../runtime/src/application/actions/actions.service.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('Action shared and exclusive scheduling', () => {
  it('allows shared overlap and rejects an exclusive owner until shared work releases', async () => {
    const root = await createWorkspace();
    await Promise.all([
      writeManifest(root, 'shared.a', 'shared', 220, 0),
      writeManifest(root, 'shared.b', 'shared', 220, 0),
      writeManifest(root, 'shared.c', 'shared', 10, 0),
      writeManifest(root, 'exclusive.a', 'exclusive', 10, 0),
      writeManifest(root, 'exclusive.long', 'exclusive', 220, 0),
    ]);

    const sharedA = runSkoposActionRuntime({ cwd: root, action: 'shared.a' });
    const sharedB = runSkoposActionRuntime({ cwd: root, action: 'shared.b' });
    await wait(60);

    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'exclusive.a' }),
    ).rejects.toThrow('cannot acquire exclusive scheduling');
    await expect(Promise.all([sharedA, sharedB])).resolves.toEqual([
      expect.objectContaining({ run: expect.objectContaining({ runStatus: 'succeeded' }) }),
      expect.objectContaining({ run: expect.objectContaining({ runStatus: 'succeeded' }) }),
    ]);
    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'exclusive.a' }),
    ).resolves.toMatchObject({ run: { runStatus: 'succeeded' } });

    const exclusive = runSkoposActionRuntime({ cwd: root, action: 'exclusive.long' });
    await wait(60);
    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'shared.c' }),
    ).rejects.toThrow('cannot acquire shared scheduling');
    await expect(exclusive).resolves.toMatchObject({ run: { runStatus: 'succeeded' } });
  });

  it('releases exclusive ownership after command failure', async () => {
    const root = await createWorkspace();
    await Promise.all([
      writeManifest(root, 'exclusive.fail', 'exclusive', 10, 2),
      writeManifest(root, 'exclusive.next', 'exclusive', 10, 0),
    ]);

    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'exclusive.fail' }),
    ).rejects.toThrow('failed with exit code 2');
    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'exclusive.next' }),
    ).resolves.toMatchObject({ run: { runStatus: 'succeeded' } });
  });

  it('removes expired scheduling leases before admission', async () => {
    const root = await createWorkspace();
    await writeManifest(root, 'exclusive.recovery', 'exclusive', 10, 0);
    const leasesRoot = join(root, '.skopos/locks/actions');
    await mkdir(leasesRoot, { recursive: true });
    const stalePath = join(leasesRoot, 'stale.json');
    await writeFile(stalePath, JSON.stringify({
      schemaVersion: 1,
      runId: 'run-stale',
      actionId: 'exclusive.stale',
      concurrency: 'exclusive',
      acquiredAt: '2026-01-01T00:00:00.000Z',
      expiresAt: '2026-01-01T00:00:01.000Z',
    }), 'utf8');

    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'exclusive.recovery' }),
    ).resolves.toMatchObject({ run: { runStatus: 'succeeded' } });
    await expect(access(stalePath)).rejects.toThrow();
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-action-scheduling-'));
  temporaryRoots.push(root);
  await mkdir(join(root, 'tools/skopos/actions'), { recursive: true });
  await writeFile(join(root, 'package.json'), '{"name":"fixture","private":true}\n', 'utf8');
  return root;
};

const writeManifest = async (
  root: string,
  id: string,
  concurrency: 'shared' | 'exclusive',
  durationMs: number,
  exitCode: number,
): Promise<void> => {
  const source = [
    `id: ${id}`,
    `title: ${id}`,
    'description: Scheduling fixture Action.',
    'category: quality-check',
    'scope: [workspace]',
    `command: node -e "setTimeout(() => process.exit(${exitCode}), ${durationMs})"`,
    'cwd: .',
    'timeoutMs: 1000',
    'inputs: [package.json]',
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
    `concurrency: ${concurrency}`,
    'workspaceMode: overlay-safe',
    'safety: read-only',
    'requiresApproval: false',
    'recommendedAfter: []',
    'owner: fixture',
    '',
  ].join('\n');
  await writeFile(
    join(root, 'tools/skopos/actions', `${id.replaceAll('.', '-')}.yaml`),
    source,
    'utf8',
  );
};

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
