import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
} from '../../../indexer/src/index.js';
import {
  applySkoposCapabilityIntegrationsRuntime,
  approveSkoposCapabilityIntegrationsRuntime,
  proposeSkoposCapabilityIntegrationsRuntime,
} from '../../../runtime/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('reviewed project capability integrations', () => {
  it('discovers candidates without tracked writes, then requires bound approval before activation', async () => {
    const root = await createWorkspace();
    const proposed = await proposeSkoposCapabilityIntegrationsRuntime({ cwd: root });
    const candidate = proposed.proposal.candidates.find(
      (entry) => entry.name === 'check-types',
    );

    expect(candidate).toMatchObject({
      source: 'package-script',
      command: 'npm run check-types',
      suggestedAction: { id: 'quality.typecheck' },
      suggestedGuard: {
        id: 'quality.typecheck',
        requires: { actionIds: ['quality.typecheck'] },
      },
    });
    expect(proposed.proposal.trackedDeclarationsWritten).toBe(false);
    await expect(
      access(join(root, 'tools/skopos/actions/quality-typecheck.yaml')),
    ).rejects.toThrow();

    await expect(
      approveSkoposCapabilityIntegrationsRuntime({
        cwd: root,
        proposalDigest: 'wrong-digest',
        acceptedCandidateIds: [candidate!.id],
        actor: 'reviewer',
        reason: 'Use the existing project type proof.',
      }),
    ).rejects.toThrow(/proposal digest mismatch/);

    const approved = await approveSkoposCapabilityIntegrationsRuntime({
      cwd: root,
      proposalDigest: proposed.proposal.proposalDigest,
      acceptedCandidateIds: [candidate!.id],
      actor: 'reviewer',
      reason: 'Use the existing project type proof.',
    });
    await expect(
      access(join(root, 'tools/skopos/actions/quality-typecheck.yaml')),
    ).rejects.toThrow();

    await expect(
      applySkoposCapabilityIntegrationsRuntime({
        cwd: root,
        approvalDigest: 'wrong-digest',
        actor: 'integrator',
      }),
    ).rejects.toThrow(/approval digest mismatch/);

    const activated = await applySkoposCapabilityIntegrationsRuntime({
      cwd: root,
      approvalDigest: approved.approval.approvalDigest,
      actor: 'integrator',
    });
    const [actions, guards] = await Promise.all([
      loadSkoposActionManifests({ cwd: root }),
      loadSkoposGuardManifests({ cwd: root }),
    ]);

    expect(activated.activation.providerValidation).toBe('pass');
    expect(actions).toContainEqual(
      expect.objectContaining({
        id: 'quality.typecheck',
        command: 'npm run check-types',
      }),
    );
    expect(guards).toContainEqual(
      expect.objectContaining({
        id: 'quality.typecheck',
        requires: {
          actionIds: ['quality.typecheck'],
          evidence: 'source-bound-action',
        },
      }),
    );
  });

  it('rejects proposal content changed after its digest was emitted', async () => {
    const root = await createWorkspace();
    const proposed = await proposeSkoposCapabilityIntegrationsRuntime({ cwd: root });
    const proposalPath = join(root, proposed.proposalPath);
    const proposal = JSON.parse(await readFile(proposalPath, 'utf8')) as {
      candidates: Array<{ command: string }>;
    };
    proposal.candidates[0]!.command = 'unexpected replacement';
    await writeFile(proposalPath, JSON.stringify(proposal, null, 2), 'utf8');

    await expect(
      approveSkoposCapabilityIntegrationsRuntime({
        cwd: root,
        proposalDigest: proposed.proposal.proposalDigest,
        acceptedCandidateIds: [proposed.proposal.candidates[0]!.id],
        actor: 'reviewer',
        reason: 'Review exact proposal.',
      }),
    ).rejects.toThrow(/proposal content digest mismatch/);
  });

  it('does not overwrite an existing tracked Action or Guard declaration', async () => {
    const root = await createWorkspace();
    const proposed = await proposeSkoposCapabilityIntegrationsRuntime({ cwd: root });
    const candidate = proposed.proposal.candidates.find(
      (entry) => entry.name === 'check-types',
    )!;
    const approved = await approveSkoposCapabilityIntegrationsRuntime({
      cwd: root,
      proposalDigest: proposed.proposal.proposalDigest,
      acceptedCandidateIds: [candidate.id],
      actor: 'reviewer',
      reason: 'Use the existing project type proof.',
    });
    await mkdir(join(root, 'tools/skopos/actions'), { recursive: true });
    await writeFile(
      join(root, 'tools/skopos/actions/existing.yaml'),
      `${JSON.stringify(
        {
          ...candidate.suggestedAction,
          sourcePath: undefined,
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    await expect(
      applySkoposCapabilityIntegrationsRuntime({
        cwd: root,
        approvalDigest: approved.approval.approvalDigest,
        actor: 'integrator',
      }),
    ).rejects.toThrow(/Action quality.typecheck already exists/);
  });
});

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-capability-integration-'));
  temporaryRoots.push(root);
  await writeFile(
    join(root, 'package.json'),
    JSON.stringify(
      {
        name: 'example',
        private: true,
        scripts: {
          'check-types': 'tsc --noEmit',
          release: 'node scripts/release.js',
        },
      },
      null,
      2,
    ),
    'utf8',
  );
  return root;
};
