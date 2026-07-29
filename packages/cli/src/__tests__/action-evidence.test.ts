import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { SkoposActionManifest, SkoposActionRunArtifact } from '@skopos/model';
import {
  buildSkoposEvidence,
  finalizeSkoposEvidence,
  validateSkoposEvidence,
} from '../../../verification/src/application/action-evidence/action-evidence.service.js';
import { describe, expect, it } from 'vitest';

describe('source-bound Action Evidence', () => {
  it('rejects a successful Action run that has no source-bound Evidence', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-evidence-missing-'));
    await mkdir(join(workspaceRoot, 'src'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/actions'), { recursive: true });
    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 1;\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/actions/quality-focused.yaml'),
      'id: quality.focused\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    await writeFile(join(workspaceRoot, 'proof.txt'), 'pass\n', 'utf8');

    const evidence = await finalizeSkoposEvidence({
      workspaceRoot,
      manifest,
      evidence: await buildSkoposEvidence({
        workspaceRoot,
        manifest,
        runId: 'run-without-evidence',
      }),
    });
    const { evidence: omittedEvidence, ...artifactWithoutEvidence } = buildRunArtifact(evidence);

    expect(omittedEvidence).toBeDefined();
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact: artifactWithoutEvidence,
      }),
    ).resolves.toEqual({
      status: 'stale',
      summary: 'The successful Action run is missing source-bound Evidence.',
    });
  });

  it('binds exact action, source, environment, and output state', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-evidence-'));
    await mkdir(join(workspaceRoot, 'src'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/actions'), { recursive: true });
    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 1;\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/actions/quality-focused.yaml'),
      'id: quality.focused\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');

    const evidence = await buildSkoposEvidence({
      workspaceRoot,
      manifest,
      runId: 'run-proof',
      actorId: 'agent-proof',
      capturedAt: '2026-07-25T00:00:00.000Z',
    });
    await writeFile(join(workspaceRoot, 'proof.txt'), 'pass\n', 'utf8');
    const finalizedEvidence = await finalizeSkoposEvidence({
      workspaceRoot,
      manifest,
      evidence,
    });
    const artifact = buildRunArtifact(finalizedEvidence);

    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        status: 'valid',
        currentSourceDigest: evidence.sourceState.digest,
      }),
    );

    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 2;\n', 'utf8');
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        status: 'stale',
        summary: expect.stringContaining('source or configuration changed'),
      }),
    );
  });

  it('invalidates output drift and exact command changes', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-evidence-'));
    await mkdir(join(workspaceRoot, 'src'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/actions'), { recursive: true });
    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 1;\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/actions/quality-focused.yaml'),
      'id: quality.focused\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    await writeFile(join(workspaceRoot, 'proof.txt'), 'pass\n', 'utf8');

    const evidence = await finalizeSkoposEvidence({
      workspaceRoot,
      manifest,
      evidence: await buildSkoposEvidence({
        workspaceRoot,
        manifest,
        runId: 'run-proof',
      }),
    });
    const artifact = buildRunArtifact(evidence);

    await writeFile(join(workspaceRoot, 'proof.txt'), 'changed\n', 'utf8');
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        status: 'stale',
        summary: expect.stringContaining('outputs changed'),
      }),
    );

    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest: {
          ...manifest,
          command: 'pnpm test --runInBand',
        },
        artifact,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        status: 'stale',
        summary: expect.stringContaining('exact command changed'),
      }),
    );
  });

  it('finalizes mutating actions against their stable post-action source state', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-evidence-mutating-'));
    await mkdir(join(workspaceRoot, 'tools/skopos/actions'), { recursive: true });
    await writeFile(join(workspaceRoot, 'state.txt'), 'before\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/actions/maintenance-refresh.yaml'),
      'id: maintenance.refresh\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    const mutatingManifest: SkoposActionManifest = {
      ...manifest,
      id: 'maintenance.refresh',
      title: 'Refresh state',
      category: 'maintenance',
      safety: 'mutating',
      command: 'node refresh.mjs',
      inputs: ['state.txt'],
      outputs: ['proof.txt'],
      affects: ['state.txt', 'proof.txt'],
      sourcePath: 'tools/skopos/actions/maintenance-refresh.yaml',
    };
    const runningEvidence = await buildSkoposEvidence({
      workspaceRoot,
      manifest: mutatingManifest,
      runId: 'run-mutating',
    });

    await writeFile(join(workspaceRoot, 'state.txt'), 'after\n', 'utf8');
    await writeFile(join(workspaceRoot, 'proof.txt'), 'refreshed\n', 'utf8');
    const finalizedEvidence = await finalizeSkoposEvidence({
      workspaceRoot,
      manifest: mutatingManifest,
      evidence: runningEvidence,
    });

    expect(finalizedEvidence.executionKey).not.toBe(runningEvidence.executionKey);
    expect(finalizedEvidence.sourceState.digest).not.toBe(runningEvidence.sourceState.digest);
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest: mutatingManifest,
        artifact: {
          ...buildRunArtifact(finalizedEvidence),
          actionId: mutatingManifest.id,
          actionTitle: mutatingManifest.title,
          actionCategory: mutatingManifest.category,
          actionSafety: mutatingManifest.safety,
          sourcePath: mutatingManifest.sourcePath,
          command: mutatingManifest.command,
        },
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));
  });

  it('ignores generated build directories while retaining authored source freshness', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-evidence-build-output-'));
    await mkdir(join(workspaceRoot, 'src/.next/cache'), { recursive: true });
    await mkdir(join(workspaceRoot, 'src/.tmp'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/actions'), { recursive: true });
    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 1;\n', 'utf8');
    await writeFile(join(workspaceRoot, 'src/.next/cache/state.json'), '{"build":1}\n', 'utf8');
    await writeFile(join(workspaceRoot, 'src/.tmp/report.json'), '{"status":"pass"}\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/actions/quality-focused.yaml'),
      'id: quality.focused\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    await writeFile(join(workspaceRoot, 'proof.txt'), 'pass\n', 'utf8');

    const evidence = await finalizeSkoposEvidence({
      workspaceRoot,
      manifest,
      evidence: await buildSkoposEvidence({
        workspaceRoot,
        manifest,
        runId: 'run-build-output',
      }),
    });
    const artifact = buildRunArtifact(evidence);

    await writeFile(join(workspaceRoot, 'src/.next/cache/state.json'), '{"build":2}\n', 'utf8');
    await writeFile(join(workspaceRoot, 'src/.tmp/report.json'), '{"status":"changed"}\n', 'utf8');
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));

    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 2;\n', 'utf8');
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'stale' }));
  });

  it('ignores disposable local state without ignoring tracked Task truth', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-evidence-state-'));
    await mkdir(join(workspaceRoot, '.skopos/sessions'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos/tasks'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos/cache'), { recursive: true });
    await mkdir(join(workspaceRoot, 'docs/work/tasks'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/actions'), { recursive: true });
    await writeFile(
      join(workspaceRoot, 'docs/work/tasks/T-001.md'),
      '# Task\n\nStatus: active\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, 'tools/skopos/actions/project-state.yaml'),
      'id: project.state\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    const stateManifest: SkoposActionManifest = {
      ...manifest,
      id: 'project.state',
      title: 'Project state',
      inputs: ['.skopos', 'docs/work/tasks/T-001.md'],
      outputs: [],
      sourcePath: 'tools/skopos/actions/project-state.yaml',
    };
    const evidence = await finalizeSkoposEvidence({
      workspaceRoot,
      manifest: stateManifest,
      evidence: await buildSkoposEvidence({
        workspaceRoot,
        manifest: stateManifest,
        runId: 'run-state',
      }),
    });
    const artifact = {
      ...buildRunArtifact(evidence),
      actionId: stateManifest.id,
      actionTitle: stateManifest.title,
      sourcePath: stateManifest.sourcePath,
    };

    await writeFile(
      join(workspaceRoot, '.skopos/sessions/current.json'),
      '{"status":"active"}\n',
      'utf8',
    );
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));

    await writeFile(
      join(workspaceRoot, '.skopos/tasks/T-001.json'),
      '{"progress":"working"}\n',
      'utf8',
    );
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));

    await writeFile(
      join(workspaceRoot, '.skopos/project.json'),
      '{"sourceState":{"digest":"changed-local-projection"}}\n',
      'utf8',
    );
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));

    await writeFile(
      join(workspaceRoot, 'docs/work/tasks/T-001.md'),
      '# Task\n\nStatus: complete\n',
      'utf8',
    );
    await expect(
      validateSkoposEvidence({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'stale' }));
  });
});

const manifest: SkoposActionManifest = {
  id: 'quality.focused',
  title: 'Focused proof',
  description: 'Run focused proof.',
  category: 'quality-check',
  scope: ['workspace'],
  command: 'pnpm test',
  cwd: '.',
  inputs: ['src'],
  outputs: ['proof.txt'],
  affects: ['src'],
  safety: 'read-only',
  requiresApproval: false,
  requiredForDone: true,
  recommendedAfter: [],
  owner: 'skopos-core',
  sourcePath: 'tools/skopos/actions/quality-focused.yaml',
};

const buildRunArtifact = (
  evidence: NonNullable<SkoposActionRunArtifact['evidence']>,
): SkoposActionRunArtifact => ({
  schemaVersion: 1,
  id: evidence.owner.runId,
  type: 'action-run',
  status: 'generated',
  authority: 'generated',
  summary: 'quality.focused succeeded.',
  workspaceRoot: '/workspace',
  actionId: manifest.id,
  actionTitle: manifest.title,
  actionCategory: manifest.category,
  actionSafety: manifest.safety,
  sourcePath: manifest.sourcePath,
  command: manifest.command,
  cwd: manifest.cwd,
  runStatus: 'succeeded',
  exitCode: 0,
  outputPaths: manifest.outputs,
  evidence,
});
