import { lstat, mkdir, mkdtemp, readFile, readdir, rm, stat, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createDefaultSkoposConfig, writeSkoposConfig } from '../../../config/src/index.js';
import {
  buildSkoposStoragePinRuntime,
  buildSkoposStoragePruneRuntime,
  buildSkoposStorageStatusRuntime,
  buildSkoposStorageUnpinRuntime,
  SKOPOS_STORAGE_PRIVACY_WARNING,
} from '../../../runtime/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('Skopos storage lifecycle', () => {
  it('previews by default and deletes only expired, unreferenced, unpinned units', async () => {
    const root = await createStorageWorkspace();
    const secret = 'private prompt: customer-token-should-not-enter-receipt';
    const oldCache = '.skopos/cache/old-cache';
    const oldDiagnostic = '.skopos/evaluations/old-unreferenced';
    const pinnedDiagnostic = '.skopos/evaluations/pinned-diagnostic';
    const protectedRun = '.skopos/runs/run-20260101T000000Z-protected';
    const releaseEvidence = '.skopos/evidence/proof/release-one';

    await Promise.all([
      writeFixture(root, `${oldCache}/data.json`, secret),
      writeFixture(root, `${oldDiagnostic}/report.json`, secret),
      writeFixture(root, `${pinnedDiagnostic}/report.json`, secret),
      writeFixture(root, `${protectedRun}.json`, JSON.stringify({ id: protectedRun.split('/').at(-1), runStatus: 'succeeded' })),
      writeFixture(root, `${protectedRun}/artifacts/proof.json`, secret),
      writeFixture(root, `${releaseEvidence}/report.json`, secret),
      writeFixture(
        root,
        '.skopos/tasks/worktree/T-open/task.json',
        JSON.stringify({
          id: 'T-open',
          state: 'active',
          evidence: [`${protectedRun}/artifacts/proof.json`],
        }),
      ),
      writeFixture(
        root,
        'docs/release-baseline.md',
        `Release proof: ${releaseEvidence}/report.json\n`,
      ),
    ]);
    await makeOld(root, [
      oldCache,
      oldDiagnostic,
      pinnedDiagnostic,
      `${protectedRun}.json`,
      protectedRun,
      releaseEvidence,
      '.skopos/tasks/worktree/T-open',
    ]);

    const pin = await buildSkoposStoragePinRuntime({
      cwd: root,
      path: pinnedDiagnostic,
      actor: 'storage-test',
      reason: 'Keep for a human investigation',
    });

    const status = await buildSkoposStorageStatusRuntime({ cwd: root });
    expect(status.privacyWarning).toBe(SKOPOS_STORAGE_PRIVACY_WARNING);
    expect(status.classSummaries.map((summary) => summary.storageClass)).toEqual([
      'temporary',
      'cache',
      'diagnostic',
      'task-evidence',
      'release-evidence',
      'user-pinned',
    ]);
    expect(findUnit(status.units, pinnedDiagnostic)).toMatchObject({
      storageClass: 'user-pinned',
      protected: true,
      eligible: false,
    });
    expect(findUnit(status.units, protectedRun)).toMatchObject({ protected: true, eligible: false });
    expect(findUnit(status.units, releaseEvidence)).toMatchObject({ protected: true, eligible: false });

    const preview = await buildSkoposStoragePruneRuntime({ cwd: root });
    expect(preview).toMatchObject({
      mode: 'dry-run',
      deletedUnitCount: 0,
    });
    expect(preview).not.toHaveProperty('receiptPath');
    expect(preview.units.map((unit) => unit.path)).toEqual(
      expect.arrayContaining([oldCache, oldDiagnostic]),
    );
    await expect(stat(join(root, oldCache))).resolves.toBeDefined();
    await expect(stat(join(root, oldDiagnostic))).resolves.toBeDefined();

    await expect(
      buildSkoposStoragePruneRuntime({ cwd: root, apply: true }),
    ).rejects.toThrow('Missing value for --actor');

    const applied = await buildSkoposStoragePruneRuntime({
      cwd: root,
      apply: true,
      actor: 'storage-test',
    });
    expect(applied.mode).toBe('apply');
    expect(applied.deletedUnitCount).toBeGreaterThanOrEqual(2);
    await expect(stat(join(root, oldCache))).rejects.toThrow();
    await expect(stat(join(root, oldDiagnostic))).rejects.toThrow();
    await expect(stat(join(root, pinnedDiagnostic))).resolves.toBeDefined();
    await expect(stat(join(root, `${protectedRun}.json`))).resolves.toBeDefined();
    await expect(stat(join(root, releaseEvidence))).resolves.toBeDefined();

    const receipt = await readFile(join(root, applied.receiptPath ?? ''), 'utf8');
    expect(receipt).toContain('storage-prune-receipt');
    expect(receipt).toContain('storage-test');
    expect(receipt).not.toContain(secret);

    const removed = await buildSkoposStorageUnpinRuntime({
      cwd: root,
      pin: pin.pin.id,
      actor: 'storage-test',
    });
    expect(removed.removed.path).toBe(pinnedDiagnostic);
  });

  it('uses configured soft and hard limits in status', async () => {
    const root = await createStorageWorkspace({ softLimitMb: 1, hardLimitMb: 1 });
    await writeFixture(root, '.skopos/cache/large-cache/data.bin', 'x'.repeat(1024 * 1024 + 1));

    const status = await buildSkoposStorageStatusRuntime({ cwd: root });
    expect(status.limitState).toBe('above-hard-limit');
    expect(findUnit(status.units, '.skopos/cache/large-cache')).toMatchObject({
      eligible: true,
      eligibilityReasons: ['size pressure: total exceeds 1 MiB soft limit'],
    });
  });
});

const createStorageWorkspace = async (
  limits: { softLimitMb: number; hardLimitMb: number } = {
    softLimitMb: 512,
    hardLimitMb: 1024,
  },
): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-storage-lifecycle-'));
  temporaryRoots.push(root);
  const config = createDefaultSkoposConfig({
    projectName: 'storage-lifecycle-test',
    archetype: 'library',
    repoMode: 'single',
    projectMode: 'new-project',
  });
  config.storage = {
    ...limits,
    retentionDays: {
      temporary: 1,
      cache: 1,
      diagnostic: 1,
      taskEvidence: 1,
      releaseEvidence: 1,
    },
  };
  await writeSkoposConfig(join(root, 'skopos.config.yaml'), config);
  return root;
};

const writeFixture = async (root: string, path: string, contents: string): Promise<void> => {
  const absolutePath = join(root, path);
  await mkdir(join(absolutePath, '..'), { recursive: true });
  await writeFile(absolutePath, contents, 'utf8');
};

const makeOld = async (root: string, paths: string[]): Promise<void> => {
  const old = new Date('2025-01-01T00:00:00.000Z');
  const visit = async (path: string): Promise<void> => {
    const metadata = await lstat(path);
    if (metadata.isDirectory()) {
      for (const entry of await readdir(path)) await visit(join(path, entry));
    }
    await utimes(path, old, old);
  };
  for (const path of paths) await visit(join(root, path));
};

const findUnit = <T extends { path: string }>(units: T[], path: string): T => {
  const unit = units.find((candidate) => candidate.path === path);
  if (!unit) throw new Error(`Missing storage unit in test: ${path}`);
  return unit;
};
