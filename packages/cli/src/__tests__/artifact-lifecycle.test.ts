import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type {
  SkoposCompactTaskBrief,
  SkoposMissionArtifact,
  SkoposWorkflowRunArtifact,
} from '@skopos/model';
import {
  writeSkoposCurrentTaskProjections,
  writeSkoposReceiptProjection,
} from '../../../runtime/src/application/agent-native/artifact-lifecycle.js';
import {
  buildSkoposCompactProjectArtifact,
  validateSkoposCompactProjectArtifact,
} from '../../../trust/src/application/artifact-lifecycle/artifact-lifecycle.service.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('compact artifact lifecycle', () => {
  it('classifies current authority, staged projections, compatibility, and cache', () => {
    const project = buildSkoposCompactProjectArtifact({
      workspaceRoot: '/workspace',
      generatedAt: '2026-07-25T00:00:00.000Z',
    });

    expect(validateSkoposCompactProjectArtifact(project)).toEqual({
      status: 'pass',
      diagnostics: [],
    });
    expect(project.workflowAuthority).toBe('skopos');
    expect(project.families.find((family) => family.id === 'current-task')).toMatchObject({
      migrationState: 'staged-projection',
      authorityPaths: expect.arrayContaining(['.skopos/missions/*.json']),
      compactPaths: [
        '.skopos/current/task.json',
        '.skopos/current/brief.json',
      ],
    });
    expect(project.families.find((family) => family.id === 'derived-cache')).toMatchObject({
      migrationState: 'cache-candidate',
      retention: 'disposable',
    });
  });

  it('writes compact task and receipt projections that point back to existing authority', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-artifact-lifecycle-'));
    temporaryRoots.push(workspaceRoot);
    const mission = buildMission(workspaceRoot);
    const brief = buildBrief();

    await writeSkoposCurrentTaskProjections({
      workspaceRoot,
      mission,
      brief,
    });

    const task = JSON.parse(
      await readFile(join(workspaceRoot, '.skopos/current/task.json'), 'utf8'),
    );
    const project = JSON.parse(
      await readFile(join(workspaceRoot, '.skopos/project.json'), 'utf8'),
    );
    expect(task).toMatchObject({
      authority: 'generated',
      authorityMissionPath: '.skopos/missions/mission-proof.json',
      taskIdentity: { taskId: 'mission-proof', worktreeId: 'worktree-proof' },
    });
    expect(project.workflowAuthority).toBe('skopos');

    const run = buildRun(workspaceRoot);
    const runPath = join(workspaceRoot, '.skopos/runs/run-proof.json');
    const receiptPath = await writeSkoposReceiptProjection({
      workspaceRoot,
      authorityRunPath: runPath,
      artifact: run,
    });
    const receipt = JSON.parse(await readFile(receiptPath!, 'utf8'));
    expect(receipt).toMatchObject({
      authority: 'generated',
      authorityRunPath: '.skopos/runs/run-proof.json',
      runId: 'run-proof',
    });
  });

  it('rejects a compact family that claims a duplicate target path', () => {
    const project = buildSkoposCompactProjectArtifact({ workspaceRoot: '/workspace' });
    project.families[1]!.compactPaths.push('.skopos/project.json');

    expect(validateSkoposCompactProjectArtifact(project)).toEqual({
      status: 'fail',
      diagnostics: [
        'Compact artifact path is owned by more than one family: .skopos/project.json.',
      ],
    });
  });
});

const buildMission = (workspaceRoot: string): SkoposMissionArtifact => ({
  schemaVersion: 1,
  id: 'mission-proof',
  type: 'mission',
  status: 'generated',
  authority: 'generated',
  workspaceRoot,
  planId: 'plan-proof',
  state: 'active',
  title: 'Proof mission',
  summary: 'Proof mission.',
  objective: 'Prove compact projections',
  scope: {
    query: 'workspace',
    matchedBy: 'default-root',
    scope: {
      id: 'workspace',
      kind: 'workspace',
      title: 'Workspace',
      path: '.',
      aliases: ['root'],
      summary: 'Workspace.',
      confidence: 'high',
    },
  },
  items: [],
  recommendedChecks: [],
  recommendedWorkflowIds: [],
  decisionQuestionIds: [],
  linkedSlices: [],
  coordination: {},
  taskIdentity: {
    repositoryId: 'repository-proof',
    repositoryRoot: workspaceRoot,
    worktreeId: 'worktree-proof',
    worktreeRoot: workspaceRoot,
    branch: 'proof',
    taskId: 'mission-proof',
    actorId: 'codex',
  },
});

const buildBrief = (): SkoposCompactTaskBrief => ({
  schemaVersion: 1,
  task: {
    goal: 'Prove compact projections',
    scope: buildMission('/workspace').scope,
    acceptanceCriteria: [],
    nonGoals: [],
    constraints: [],
    openDecisions: [],
    requiredProof: [],
    missingFields: [],
    provenance: [],
  },
  phase: 'iteration',
  riskLane: 'workpack',
  context: { availableCount: 0, selectedCount: 0, entries: [] },
  actions: { availableCount: 0, selectedCount: 0, entries: [] },
  guards: { availableCount: 0, selectedCount: 0, entries: [] },
  diagnostics: [],
});

const buildRun = (workspaceRoot: string): SkoposWorkflowRunArtifact => ({
  schemaVersion: 1,
  id: 'run-proof',
  type: 'workflow-run',
  status: 'generated',
  authority: 'generated',
  workspaceRoot,
  workflowId: 'quality.proof',
  workflowTitle: 'Proof',
  workflowCategory: 'quality-check',
  workflowSafety: 'read-only',
  sourcePath: 'tools/skopos/workflows/quality-proof.yaml',
  command: 'pnpm test',
  cwd: '.',
  runStatus: 'succeeded',
  exitCode: 0,
  outputPaths: [],
  receipt: {
    schemaVersion: 1,
    executionKey: 'receipt-proof',
    actionId: 'quality.proof',
    command: { raw: 'pnpm test', cwd: '.', digest: 'command' },
    sourceState: { algorithm: 'sha256', digest: 'source', paths: [] },
    environment: {
      platform: 'darwin',
      architecture: 'arm64',
      nodeVersion: 'v24',
    },
    owner: {
      runId: 'run-proof',
      actorId: 'codex',
      leaseExpiresAt: '2026-07-25T02:00:00.000Z',
    },
    freshness: {
      policy: 'source-bound',
      capturedAt: '2026-07-25T00:00:00.000Z',
    },
  },
});
