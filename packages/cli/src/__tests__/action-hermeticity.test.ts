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
  delete process.env.SKOPOS_BROWSER_AVAILABLE;
  delete process.env.SKOPOS_SERVICE_FIXTURE_PROVIDER_AVAILABLE;
  delete process.env.FIXTURE_PROOF_SECRET;
  if (originalCodexHome === undefined) delete process.env.CODEX_HOME;
  else process.env.CODEX_HOME = originalCodexHome;
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('Action effects and hermetic capability contract', () => {
  it('keeps capability assertions identical across unavailable and available hosts', async () => {
    const root = await createWorkspace(false);
    await writeManifest(root, 'host-capability-proof', {
      command: `node -e "process.exit(0)"`,
      capabilities: {
        network: 'required',
        browser: 'required',
        secrets: ['FIXTURE_PROOF_SECRET'],
      },
    });

    const unavailable = await runSkoposActionRuntime({
      cwd: root,
      action: 'host.capability.proof',
    });
    expect(unavailable.run).toMatchObject({
      runStatus: 'unavailable',
      capabilityIssues: [
        'Required secret FIXTURE_PROOF_SECRET is unavailable.',
        'Required network capability is unavailable.',
        'Required browser capability is unavailable.',
      ],
    });

    process.env.SKOPOS_NETWORK_AVAILABLE = '1';
    process.env.SKOPOS_BROWSER_AVAILABLE = '1';
    process.env.FIXTURE_PROOF_SECRET = '<SECRET>';
    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'host.capability.proof' }),
    ).resolves.toMatchObject({ run: { runStatus: 'succeeded' } });
  });

  it('requires a provider receipt for successful external mutation', async () => {
    const root = await createWorkspace(false);
    process.env.SKOPOS_SERVICE_FIXTURE_PROVIDER_AVAILABLE = '1';
    await writeManifest(root, 'external-receipt-proof', {
      command: `node -e "require('node:fs').writeFileSync(process.env.SKOPOS_EXTERNAL_EFFECT_RECEIPT_PATH,JSON.stringify({schemaVersion:1,service:'fixture-provider',operation:'fixture.create',status:'succeeded',providerRequestId:'provider-request-1',occurredAt:new Date().toISOString()}))"`,
      capabilities: { services: ['fixture-provider'] },
      externalEffect: 'declared',
      safety: 'mutating',
      concurrency: 'exclusive',
    });

    const result = await runSkoposActionRuntime({
      cwd: root,
      action: 'external.receipt.proof',
      actor: 'fixture-agent',
    });
    expect(result.run).toMatchObject({
      runStatus: 'succeeded',
      externalEffectReceipt: {
        schemaVersion: 1,
        service: 'fixture-provider',
        operation: 'fixture.create',
        status: 'succeeded',
        providerRequestId: 'provider-request-1',
        receiptPath: expect.stringMatching(/external-effect-receipt\.json$/),
      },
    });
  });

  it('fails external certification when the provider receipt is missing', async () => {
    const root = await createWorkspace(false);
    process.env.SKOPOS_SERVICE_FIXTURE_PROVIDER_AVAILABLE = '1';
    await writeManifest(root, 'external-missing-receipt', {
      command: `node -e "process.exit(0)"`,
      capabilities: { services: ['fixture-provider'] },
      externalEffect: 'declared',
      safety: 'mutating',
      concurrency: 'exclusive',
    });

    await expect(
      runSkoposActionRuntime({
        cwd: root,
        action: 'external.missing.receipt',
        actor: 'fixture-agent',
      }),
    ).rejects.toThrow('did not produce provider receipt');
  });

  it('rejects a provider receipt for an undeclared service', async () => {
    const root = await createWorkspace(false);
    process.env.SKOPOS_SERVICE_FIXTURE_PROVIDER_AVAILABLE = '1';
    await writeManifest(root, 'external-mismatched-receipt', {
      command: `node -e "require('node:fs').writeFileSync(process.env.SKOPOS_EXTERNAL_EFFECT_RECEIPT_PATH,JSON.stringify({schemaVersion:1,service:'other-provider',operation:'fixture.create',status:'succeeded',providerRequestId:'provider-request-2',occurredAt:new Date().toISOString()}))"`,
      capabilities: { services: ['fixture-provider'] },
      externalEffect: 'declared',
      safety: 'mutating',
      concurrency: 'exclusive',
    });

    await expect(
      runSkoposActionRuntime({
        cwd: root,
        action: 'external.mismatched.receipt',
        actor: 'fixture-agent',
      }),
    ).rejects.toThrow('receipt service is not declared');
  });

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

  it('rejects undeclared mutation without a Git worktree', async () => {
    const root = await createWorkspace(false);
    await writeManifest(root, 'portable-read-only-proof', {
      command: `node -e "require('node:fs').writeFileSync('portable.txt','changed')"`,
    });

    await expect(
      runSkoposActionRuntime({ cwd: root, action: 'portable.read.only.proof' }),
    ).rejects.toThrow('undeclared workspace mutation at portable.txt');
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

  it('rejects out-of-bound declared mutation without a Git worktree', async () => {
    const root = await createWorkspace(false);
    await writeManifest(root, 'portable-mutating-proof', {
      command: `node -e "require('node:fs').writeFileSync('outside.txt','changed')"`,
      safety: 'mutating',
      affects: ['allowed'],
      workspaceEffect: 'declared',
      concurrency: 'exclusive',
    });

    await expect(
      runSkoposActionRuntime({
        cwd: root,
        action: 'portable.mutating.proof',
        actor: 'fixture-agent',
      }),
    ).rejects.toThrow('workspace mutation outside affects at outside.txt');
  });

  it('permits declared in-bound mutation without a Git worktree', async () => {
    const root = await createWorkspace(false);
    await mkdir(join(root, 'allowed'), { recursive: true });
    await writeManifest(root, 'portable-allowed-proof', {
      command: `node -e "require('node:fs').writeFileSync('allowed/result.txt','changed')"`,
      safety: 'mutating',
      affects: ['allowed'],
      workspaceEffect: 'declared',
      concurrency: 'exclusive',
    });

    await expect(
      runSkoposActionRuntime({
        cwd: root,
        action: 'portable.allowed.proof',
        actor: 'fixture-agent',
      }),
    ).resolves.toMatchObject({ run: { runStatus: 'succeeded' } });
  });

  it('isolates concurrent artifact-producing Action outputs by run id', async () => {
    const root = await createWorkspace(false);
    const command = `node -e "const fs=require('node:fs');const p=require('node:path');fs.writeFileSync(p.join(process.env.SKOPOS_ARTIFACT_ROOT,'result.json'),JSON.stringify({root:process.env.SKOPOS_ARTIFACT_ROOT}))"`;
    await Promise.all([
      writeManifest(root, 'artifact-a', {
        command,
        safety: 'artifact-producing',
        outputs: ['result.json'],
        artifactEffect: 'isolated',
      }),
      writeManifest(root, 'artifact-b', {
        command,
        safety: 'artifact-producing',
        outputs: ['result.json'],
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
    expect(left.run.outputPaths).toEqual([`${left.run.artifactRoot}/result.json`]);
    expect(right.run.outputPaths).toEqual([`${right.run.artifactRoot}/result.json`]);
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
  capabilities?: {
    network?: 'none' | 'required';
    browser?: 'none' | 'required';
    secrets?: string[];
    services?: string[];
  };
  safety?: 'read-only' | 'artifact-producing' | 'mutating';
  affects?: string[];
  outputs?: string[];
  workspaceEffect?: 'none' | 'declared';
  artifactEffect?: 'none' | 'isolated';
  externalEffect?: 'none' | 'declared';
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
    `  browser: ${overrides.capabilities?.browser ?? 'none'}`,
    '  tools: [node]',
    `  secrets: ${JSON.stringify(overrides.capabilities?.secrets ?? [])}`,
    `  services: ${JSON.stringify(overrides.capabilities?.services ?? [])}`,
    'effects:',
    `  workspace: ${overrides.workspaceEffect ?? 'none'}`,
    `  artifacts: ${overrides.artifactEffect ?? 'none'}`,
    `  external: ${overrides.externalEffect ?? 'none'}`,
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
