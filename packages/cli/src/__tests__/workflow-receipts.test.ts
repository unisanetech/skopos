import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { SkoposWorkflowManifest, SkoposWorkflowRunArtifact } from '@skopos/model';
import {
  buildSkoposWorkflowReceipt,
  finalizeSkoposWorkflowReceipt,
  validateSkoposWorkflowReceipt,
} from '../../../trust/src/application/workflow-receipts/workflow-receipt.service.js';
import { describe, expect, it } from 'vitest';

describe('source-bound workflow receipts', () => {
  it('binds exact action, source, environment, and output state', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-receipt-'));
    await mkdir(join(workspaceRoot, 'src'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/workflows'), { recursive: true });
    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 1;\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/workflows/quality-focused.yaml'),
      'id: quality.focused\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');

    const receipt = await buildSkoposWorkflowReceipt({
      workspaceRoot,
      manifest,
      runId: 'run-proof',
      actorId: 'agent-proof',
      capturedAt: '2026-07-25T00:00:00.000Z',
    });
    await writeFile(join(workspaceRoot, 'proof.txt'), 'pass\n', 'utf8');
    const finalizedReceipt = await finalizeSkoposWorkflowReceipt({
      workspaceRoot,
      manifest,
      receipt,
    });
    const artifact = buildRunArtifact(finalizedReceipt);

    await expect(
      validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest,
        artifact,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        status: 'valid',
        currentSourceDigest: receipt.sourceState.digest,
      }),
    );

    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 2;\n', 'utf8');
    await expect(
      validateSkoposWorkflowReceipt({
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
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-receipt-'));
    await mkdir(join(workspaceRoot, 'src'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/workflows'), { recursive: true });
    await writeFile(join(workspaceRoot, 'src/input.ts'), 'export const value = 1;\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/workflows/quality-focused.yaml'),
      'id: quality.focused\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    await writeFile(join(workspaceRoot, 'proof.txt'), 'pass\n', 'utf8');

    const receipt = await finalizeSkoposWorkflowReceipt({
      workspaceRoot,
      manifest,
      receipt: await buildSkoposWorkflowReceipt({
        workspaceRoot,
        manifest,
        runId: 'run-proof',
      }),
    });
    const artifact = buildRunArtifact(receipt);

    await writeFile(join(workspaceRoot, 'proof.txt'), 'changed\n', 'utf8');
    await expect(
      validateSkoposWorkflowReceipt({
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
      validateSkoposWorkflowReceipt({
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
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-receipt-mutating-'));
    await mkdir(join(workspaceRoot, 'tools/skopos/workflows'), { recursive: true });
    await writeFile(join(workspaceRoot, 'state.txt'), 'before\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'tools/skopos/workflows/maintenance-refresh.yaml'),
      'id: maintenance.refresh\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    const mutatingManifest: SkoposWorkflowManifest = {
      ...manifest,
      id: 'maintenance.refresh',
      title: 'Refresh state',
      category: 'maintenance',
      safety: 'mutating',
      command: 'node refresh.mjs',
      inputs: ['state.txt'],
      outputs: ['proof.txt'],
      affects: ['state.txt', 'proof.txt'],
      sourcePath: 'tools/skopos/workflows/maintenance-refresh.yaml',
    };
    const runningReceipt = await buildSkoposWorkflowReceipt({
      workspaceRoot,
      manifest: mutatingManifest,
      runId: 'run-mutating',
    });

    await writeFile(join(workspaceRoot, 'state.txt'), 'after\n', 'utf8');
    await writeFile(join(workspaceRoot, 'proof.txt'), 'refreshed\n', 'utf8');
    const finalizedReceipt = await finalizeSkoposWorkflowReceipt({
      workspaceRoot,
      manifest: mutatingManifest,
      receipt: runningReceipt,
    });

    expect(finalizedReceipt.executionKey).not.toBe(runningReceipt.executionKey);
    expect(finalizedReceipt.sourceState.digest).not.toBe(runningReceipt.sourceState.digest);
    await expect(
      validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest: mutatingManifest,
        artifact: {
          ...buildRunArtifact(finalizedReceipt),
          workflowId: mutatingManifest.id,
          workflowTitle: mutatingManifest.title,
          workflowCategory: mutatingManifest.category,
          workflowSafety: mutatingManifest.safety,
          sourcePath: mutatingManifest.sourcePath,
          command: mutatingManifest.command,
        },
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));
  });

  it('ignores high-churn discussion and memory projections without ignoring mission truth', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-receipt-state-'));
    await mkdir(join(workspaceRoot, '.skopos/discussions/checkpoints'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos/missions'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos/memory'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos/current'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos/receipts'), { recursive: true });
    await mkdir(join(workspaceRoot, 'tools/skopos/workflows'), { recursive: true });
    await writeFile(
      join(workspaceRoot, '.skopos/missions/current.json'),
      '{"state":"active"}\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, 'tools/skopos/workflows/project-state.yaml'),
      'id: project.state\n',
      'utf8',
    );
    await writeFile(join(workspaceRoot, 'skopos.config.yaml'), 'schemaVersion: 1\n', 'utf8');
    const stateManifest: SkoposWorkflowManifest = {
      ...manifest,
      id: 'project.state',
      title: 'Project state',
      inputs: ['.skopos'],
      outputs: [],
      sourcePath: 'tools/skopos/workflows/project-state.yaml',
    };
    const receipt = await finalizeSkoposWorkflowReceipt({
      workspaceRoot,
      manifest: stateManifest,
      receipt: await buildSkoposWorkflowReceipt({
        workspaceRoot,
        manifest: stateManifest,
        runId: 'run-state',
      }),
    });
    const artifact = {
      ...buildRunArtifact(receipt),
      workflowId: stateManifest.id,
      workflowTitle: stateManifest.title,
      sourcePath: stateManifest.sourcePath,
    };

    await writeFile(
      join(workspaceRoot, '.skopos/discussions/checkpoints/latest.json'),
      '{"checkpoint":true}\n',
      'utf8',
    );
    await expect(
      validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));

    await writeFile(
      join(workspaceRoot, '.skopos/memory/state.json'),
      '{"freshness":"fresh"}\n',
      'utf8',
    );
    await expect(
      validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));

    await writeFile(
      join(workspaceRoot, '.skopos/project.json'),
      '{"migrationStrategy":"staged"}\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos/current/brief.json'),
      '{"phase":"iteration"}\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos/receipts/example.json'),
      '{"authorityRunPath":".skopos/runs/example.json"}\n',
      'utf8',
    );
    await expect(
      validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'valid' }));

    await writeFile(
      join(workspaceRoot, '.skopos/missions/current.json'),
      '{"state":"complete"}\n',
      'utf8',
    );
    await expect(
      validateSkoposWorkflowReceipt({
        workspaceRoot,
        manifest: stateManifest,
        artifact,
      }),
    ).resolves.toEqual(expect.objectContaining({ status: 'stale' }));
  });
});

const manifest: SkoposWorkflowManifest = {
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
  sourcePath: 'tools/skopos/workflows/quality-focused.yaml',
};

const buildRunArtifact = (
  receipt: NonNullable<SkoposWorkflowRunArtifact['receipt']>,
): SkoposWorkflowRunArtifact => ({
  schemaVersion: 1,
  id: receipt.owner.runId,
  type: 'workflow-run',
  status: 'generated',
  authority: 'generated',
  summary: 'quality.focused succeeded.',
  workspaceRoot: '/workspace',
  workflowId: manifest.id,
  workflowTitle: manifest.title,
  workflowCategory: manifest.category,
  workflowSafety: manifest.safety,
  sourcePath: manifest.sourcePath,
  command: manifest.command,
  cwd: manifest.cwd,
  runStatus: 'succeeded',
  exitCode: 0,
  outputPaths: manifest.outputs,
  receipt,
});
