import { execFileSync } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runSkoposActionRuntime } from '../../../runtime/src/application/actions/actions.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';

const temporaryRoots: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;

afterEach(async () => {
  delete process.env.SKOPOS_NETWORK_AVAILABLE;
  if (originalCodexHome === undefined) delete process.env.CODEX_HOME;
  else process.env.CODEX_HOME = originalCodexHome;
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('Action effects and hermetic capability contract', () => {
  it('returns unavailable before execution when a required capability is absent', async () => {
    const root = await createWorkspace(false);
    await writeManifest(root, 'network-proof', {
      command: `node -e "require('node:fs').writeFileSync('executed.txt','yes')"`,
      capabilities: { network: 'required' },
    });

    const result = await runSkoposActionRuntime({ cwd: root, action: 'network.proof' });

    expect(result.run).toMatchObject({
      runStatus: 'unavailable',
      capabilityIssues: ['Required network capability is unavailable.'],
    });
    await expect(access(join(root, 'executed.txt'))).rejects.toThrow();
  });

  it('rejects undeclared read-only workspace mutation', async () => {
    const root = await createWorkspace(true);
    await writeManifest(root, 'read-only-proof', {
      command: `node -e "require('node:fs').writeFileSync('changed.txt','changed')"`,
    });
    commitAll(root, 'manifest');

    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'read.only.proof' }),
    ).rejects.toThrow('undeclared workspace mutation at changed.txt');
  });

  it('rejects declared mutation outside the affected path boundary', async () => {
    const root = await createWorkspace(true);
    await writeManifest(root, 'mutating-proof', {
      command: `node -e "require('node:fs').writeFileSync('outside.txt','changed')"`,
      safety: 'mutating',
      affects: ['allowed'],
      workspaceEffect: 'declared',
      concurrency: 'exclusive',
    });
    commitAll(root, 'manifest');

    await expect(
      runSkoposActionRuntime({
        cwd: root,
        action: 'mutating.proof',
        actor: 'fixture-agent',
      }),
    ).rejects.toThrow('workspace mutation outside affects at outside.txt');
  });

  it('isolates concurrent artifact-producing Action outputs by run id', async () => {
    const root = await createWorkspace(false);
    const command = `node -e "const fs=require('node:fs');const p=require('node:path');fs.writeFileSync(p.join(process.env.SKOPOS_ARTIFACT_ROOT,'result.txt'),process.env.SKOPOS_ARTIFACT_ROOT)"`;
    await Promise.all([
      writeManifest(root, 'artifact-a', {
        command,
        safety: 'artifact-producing',
        outputs: ['result.txt'],
        artifactEffect: 'isolated',
      }),
      writeManifest(root, 'artifact-b', {
        command,
        safety: 'artifact-producing',
        outputs: ['result.txt'],
        artifactEffect: 'isolated',
      }),
    ]);

    const [left, right] = await Promise.all([
      runSkoposActionRuntime({ cwd: root, action: 'artifact.a', actor: 'agent-a' }),
      runSkoposActionRuntime({ cwd: root, action: 'artifact.b', actor: 'agent-b' }),
    ]);

    expect(left.run.runStatus).toBe('succeeded');
    expect(right.run.runStatus).toBe('succeeded');
    expect(left.run.artifactRoot).not.toBe(right.run.artifactRoot);
    expect(left.run.outputPaths).toEqual([`${left.run.artifactRoot}/result.txt`]);
    expect(right.run.outputPaths).toEqual([`${right.run.artifactRoot}/result.txt`]);
    await expect(readFile(join(root, left.run.outputPaths[0]!), 'utf8')).resolves.toContain(
      left.run.id,
    );
    await expect(readFile(join(root, right.run.outputPaths[0]!), 'utf8')).resolves.toContain(
      right.run.id,
    );
  });
});

interface ManifestOverrides {
  command: string;
  capabilities?: { network: 'none' | 'required' };
  safety?: 'read-only' | 'artifact-producing' | 'mutating';
  affects?: string[];
  outputs?: string[];
  workspaceEffect?: 'none' | 'declared';
  artifactEffect?: 'none' | 'isolated';
  concurrency?: 'shared' | 'exclusive';
}

const writeManifest = async (
  root: string,
  name: string,
  overrides: ManifestOverrides,
): Promise<void> => {
  const id = name.replaceAll('-', '.');
  const affects = overrides.affects ?? [];
  const outputs = overrides.outputs ?? [];
  const source = [
    `id: ${id}`,
    `title: ${name}`,
    'description: Fixture Action.',
    'category: quality-check',
    'scope: [workspace]',
    `command: >-`,
    `  ${overrides.command}`,
    'cwd: .',
    'inputs: [package.json]',
    `outputs: ${JSON.stringify(outputs)}`,
    `affects: ${JSON.stringify(affects)}`,
    'capabilities:',
    '  process: required',
    `  network: ${overrides.capabilities?.network ?? 'none'}`,
    '  browser: none',
    '  tools: [node]',
    '  secrets: []',
    '  services: []',
    'effects:',
    `  workspace: ${overrides.workspaceEffect ?? 'none'}`,
    `  artifacts: ${overrides.artifactEffect ?? 'none'}`,
    '  external: none',
    `concurrency: ${overrides.concurrency ?? 'shared'}`,
    `safety: ${overrides.safety ?? 'read-only'}`,
    'requiresApproval: false',
    'recommendedAfter: []',
    'owner: fixture',
    '',
  ].join('\n');
  await writeFile(join(root, 'tools/skopos/actions', `${name}.yaml`), source, 'utf8');
};

const createWorkspace = async (git: boolean): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-action-hermeticity-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, 'tools/skopos/actions'), { recursive: true }),
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(root, 'package.json'), '{"name":"fixture","private":true}\n', 'utf8'),
    writeFile(join(root, 'README.md'), '# Action hermeticity fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Fixture agent rules\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  if (git) {
    execFileSync('git', ['init', '--initial-branch=main'], { cwd: root });
    execFileSync('git', ['config', 'user.email', 'skopos@example.com'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'Skopos Fixture'], { cwd: root });
    commitAll(root, 'baseline');
  }
  return root;
};

const commitAll = (root: string, message: string): void => {
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['commit', '-m', message], { cwd: root });
};
