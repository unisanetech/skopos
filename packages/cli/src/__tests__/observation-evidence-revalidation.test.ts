import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rename, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  recordSkoposObservationEvidenceRuntime,
  verifySkoposTaskRuntime,
} from '../../../runtime/src/application/verification/verification.service.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  const { rm } = await import('node:fs/promises');
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('observation Evidence source revalidation', () => {
  it('survives Git rename normalization after commit and still rejects real mutation', async () => {
    const root = await mkdtemp(join(tmpdir(), 'skopos-observation-rename-'));
    temporaryRoots.push(root);
    await mkdir(join(root, 'src'), { recursive: true });
    await mkdir(join(root, 'docs'), { recursive: true });
    await mkdir(join(root, 'tools', 'skopos'), { recursive: true });
    await writeFile(join(root, 'src', 'before.ts'), 'export const value = 1;\n', 'utf8');
    await writeFile(join(root, 'README.md'), '# Observation Evidence fixture\n', 'utf8');
    await writeFile(
      join(root, 'tools', 'skopos', 'scopes.yaml'),
      [
        'schemaVersion: 1',
        'scopes:',
        '  - id: observation-evidence-fixture',
        '    title: Observation Evidence Fixture',
        '    kind: workspace',
        '    path: .',
        '    memoryRoot: docs',
        '    codeRoots: [.]',
        '    parent: null',
        '    profile: fixture.workspace',
        '    dependsOn: []',
        '    owners: [fixture]',
        '    aliases: [fixture]',
        '',
      ].join('\n'),
      'utf8',
    );
    runGit(root, ['init', '-q']);
    runGit(root, ['config', 'user.name', 'Skopos Test']);
    runGit(root, ['config', 'user.email', 'skopos-test@localhost']);
    runGit(root, ['add', '-A']);
    runGit(root, ['commit', '-qm', 'baseline']);

    await initSkoposProject({
      cwd: root,
      mode: 'existing',
      actor: 'rename-proof',
      scaffoldInstructions: false,
    });
    const started = await buildSkoposStartRuntime({
      cwd: root,
      scope: 'observation-evidence-fixture',
      goal: 'Rename one owned source without invalidating unchanged observation Evidence',
      actor: 'rename-proof',
      risk: 'standard',
      acceptanceCriteria: ['The renamed source remains covered after the rename is committed.'],
      ownedPaths: ['src'],
    });

    await rename(join(root, 'src', 'before.ts'), join(root, 'src', 'after.ts'));
    const requirement = started.task.evidenceRequirements.find(
      (entry) => entry.phase === 'closure' && entry.evidence === 'agent-observation',
    );
    expect(requirement).toBeDefined();
    await recordSkoposObservationEvidenceRuntime({
      cwd: root,
      taskId: started.task.id,
      requirementId: requirement!.id,
      statement: 'The source rename preserves the implementation bytes and intended behavior.',
      actor: 'rename-proof',
    });

    runGit(root, ['add', '-A']);
    runGit(root, ['commit', '-qm', 'rename source']);

    const afterCommit = await verifySkoposTaskRuntime({
      cwd: root,
      taskId: started.task.id,
      phase: 'closure',
    });
    expect(afterCommit.acceptanceCoverage).toContainEqual(
      expect.objectContaining({ requirementId: requirement!.id, status: 'covered' }),
    );

    await writeFile(join(root, 'src', 'after.ts'), 'export const value = 2;\n', 'utf8');
    const afterMutation = await verifySkoposTaskRuntime({
      cwd: root,
      taskId: started.task.id,
      phase: 'closure',
    });
    expect(afterMutation.acceptanceCoverage).toContainEqual(
      expect.objectContaining({ requirementId: requirement!.id, status: 'missing' }),
    );
  }, 20_000);
});

const runGit = (cwd: string, args: string[]): string =>
  execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
