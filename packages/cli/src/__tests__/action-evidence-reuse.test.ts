import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { runSkoposActionRuntime } from '../../../runtime/src/application/actions/actions.service.js';
import { reuseSkoposTaskActionEvidenceRuntime } from '../../../runtime/src/application/evidence/evidence-reuse.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import { runEvidenceCommand } from '../cli/commands/evidence.js';

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

describe('bounded Task Action Evidence reuse', () => {
  it('links every valid reusable run in one command without Action execution', async () => {
    const root = await createWorkspace(['quality.reusable']);
    const prior = await runSkoposActionRuntime({
      cwd: root,
      action: 'quality.reusable',
      actor: 'proof-producer',
    });
    const task = await startFixtureTask(root);
    expect(task.task.selectedActions.map((action) => action.id)).toEqual([
      'quality.reusable',
    ]);
    const runCountBefore = await countActionRuns(root);
    const writes: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      writes.push(String(chunk));
      return true;
    });

    await runEvidenceCommand([
      'reuse',
      task.task.id,
      root,
      '--actor',
      'reuse-agent',
      '--json',
    ]);

    const compact = JSON.parse(writes.join('')) as Record<string, unknown>;
    expect(compact).toMatchObject({
      type: 'task-evidence-reuse-summary',
      taskId: task.task.id,
      selectedActionCount: 1,
      linkedCount: 1,
      alreadyLinkedCount: 0,
      rejectedCount: 0,
      missingCount: 0,
      processExecutionCount: 0,
      unresolved: [],
      truncatedUnresolvedCount: 0,
    });
    expect(compact.detailPath).toEqual(expect.stringContaining('evidence-reuse/reuse-'));
    expect(await countActionRuns(root)).toBe(runCountBefore);
    const report = JSON.parse(
      await readFile(join(root, String(compact.detailPath)), 'utf8'),
    ) as { outcomes: Array<Record<string, unknown>> };
    expect(report.outcomes).toEqual([
      expect.objectContaining({
        actionId: 'quality.reusable',
        status: 'linked',
        runId: prior.run.id,
      }),
    ]);

    const repeated = await reuseSkoposTaskActionEvidenceRuntime({
      cwd: root,
      taskId: task.task.id,
      actor: 'reuse-agent',
    });
    expect(repeated).toMatchObject({
      linkedCount: 0,
      alreadyLinkedCount: 1,
      processExecutionCount: 0,
    });
    expect(await countActionRuns(root)).toBe(runCountBefore);
  }, 30_000);

  it('explains stale successful runs separately from missing runs', async () => {
    const root = await createWorkspace(['quality.stale', 'quality.missing']);
    await runSkoposActionRuntime({
      cwd: root,
      action: 'quality.stale',
      actor: 'proof-producer',
    });
    await writeFile(
      join(root, 'package.json'),
      JSON.stringify({ name: 'evidence-reuse-fixture-changed', private: true }),
      'utf8',
    );
    const task = await startFixtureTask(root);

    const report = await reuseSkoposTaskActionEvidenceRuntime({
      cwd: root,
      taskId: task.task.id,
      actor: 'reuse-agent',
    });

    expect(report).toMatchObject({
      linkedCount: 0,
      rejectedCount: 1,
      missingCount: 1,
      processExecutionCount: 0,
    });
    expect(report.outcomes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actionId: 'quality.stale',
          status: 'rejected',
          summary: expect.stringContaining('source or configuration changed'),
        }),
        expect.objectContaining({
          actionId: 'quality.missing',
          status: 'missing',
          summary: 'Action quality.missing has no prior run.',
        }),
      ]),
    );
  }, 30_000);
});

const createWorkspace = async (actionIds: string[]): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-evidence-reuse-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, 'src'), { recursive: true }),
    mkdir(join(root, 'tools/skopos/actions'), { recursive: true }),
    mkdir(join(root, 'tools/skopos/guards'), { recursive: true }),
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'package.json'),
      JSON.stringify({ name: 'evidence-reuse-fixture', private: true }),
      'utf8',
    ),
    writeFile(join(root, 'README.md'), '# Evidence reuse fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Fixture agent rules\n', 'utf8'),
    writeFile(join(root, 'src/input.ts'), 'export const input = true;\n', 'utf8'),
    writeFile(join(root, 'tools/skopos/guards/fixture-proof.yaml'), guardSource(actionIds), 'utf8'),
    ...actionIds.map((actionId) =>
      writeFile(
        join(root, 'tools/skopos/actions', `${actionId.replaceAll('.', '-')}.yaml`),
        actionSource(actionId),
        'utf8',
      ),
    ),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return root;
};

const startFixtureTask = (root: string) =>
  buildSkoposStartRuntime({
    cwd: root,
    goal: 'Maintain the Evidence reuse fixture',
    actor: 'task-agent',
    acceptanceCriteria: ['The fixture retains exact proof.'],
    ownedPaths: ['src/input.ts'],
  });

const countActionRuns = async (root: string): Promise<number> =>
  (await readdir(join(root, '.skopos/runs'))).filter(
    (entry) => entry.startsWith('run-') && entry.endsWith('.json'),
  ).length;

const actionSource = (actionId: string): string =>
  [
    `id: ${actionId}`,
    `title: ${actionId}`,
    'description: Produce reusable fixture proof.',
    'category: quality-check',
    'scope: [workspace]',
    `command: >-`,
    `  node -e "const fs=require('node:fs');const p=require('node:path');fs.writeFileSync(p.join(process.env.SKOPOS_ARTIFACT_ROOT,'proof.txt'),'pass')"`,
    'cwd: .',
    'inputs: [package.json]',
    'outputs: [proof.txt]',
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
    '  artifacts: isolated',
    '  external: none',
    'concurrency: shared',
    'safety: artifact-producing',
    'requiresApproval: false',
    'recommendedAfter: []',
    'owner: fixture',
    '',
  ].join('\n');

const guardSource = (actionIds: string[]): string =>
  [
    'id: fixture.proof',
    'title: Fixture proof is required',
    'description: Select reusable proof for fixture source.',
    'owner: fixture',
    'scope: [workspace]',
    'strength: required',
    'appliesTo:',
    '  paths: [src/**]',
    '  phases: [closure]',
    '  risks: [standard]',
    'requires:',
    '  actionIds:',
    ...actionIds.map((actionId) => `    - ${actionId}`),
    '  evidence: source-bound-action',
    '',
  ].join('\n');
