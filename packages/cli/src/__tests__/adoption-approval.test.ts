import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { SkoposAdoptionRestructuringProposalArtifact } from '../../../model/src/index.js';
import { buildSkoposAdoptionApprovalRuntime } from '../../../runtime/src/application/adoption/adoption.service.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('adoption proposal approval', () => {
  it('rejects approval for any digest other than the current exact proposal', async () => {
    const root = await createApprovalWorkspace();

    await expect(
      buildSkoposAdoptionApprovalRuntime({
        cwd: root,
        proposalDigest: 'stale-proposal-digest',
        actor: 'approver',
        reason: 'The reviewed structure is correct.',
      }),
    ).rejects.toThrow('Proposal digest mismatch');
  });

  it('requires explicit acknowledgement when the proposal has material loss risk', async () => {
    const root = await createApprovalWorkspace();

    await expect(
      buildSkoposAdoptionApprovalRuntime({
        cwd: root,
        proposalDigest: 'proposal-digest',
        actor: 'approver',
        reason: 'The duplicate document may be removed.',
      }),
    ).rejects.toThrow('material information-loss risk');
  });

  it('records exact authority without executing document operations', async () => {
    const root = await createApprovalWorkspace();
    const before = await readProjectFiles(root);

    const result = await buildSkoposAdoptionApprovalRuntime({
      cwd: root,
      proposalDigest: 'proposal-digest',
      actor: 'approver',
      reason: 'The duplicate document is superseded and its durable truth is retained.',
      acceptMaterialRisk: true,
    });

    expect(result).toMatchObject({
      adoptionState: 'restructuring',
      actorId: 'approver',
      approvalWrite: 'written',
      executionBriefWrite: 'written',
      approval: {
        authority: 'canonical',
        proposalDigest: 'proposal-digest',
        approvedOperationIds: ['delete-duplicate'],
        materialRiskAccepted: true,
        approvedByActorId: 'approver',
      },
      executionBrief: {
        authority: 'canonical',
        proposalDigest: 'proposal-digest',
        approvedOperationIds: ['delete-duplicate'],
        verificationCommand:
          'skopos adopt verify . --execution .skopos/adoption/execution-input.json --actor <id>',
        executionInputTemplate: {
          proposalDigest: 'proposal-digest',
          operations: [
            {
              operationId: 'delete-duplicate',
              resultPaths: [],
              retainedTruthVerified: true,
            },
          ],
        },
      },
    });
    expect(await readProjectFiles(root)).toEqual(before);
    const persisted = JSON.parse(await readFile(result.approvalPath, 'utf8'));
    expect(persisted).not.toHaveProperty('executed');
    const persistedBrief = JSON.parse(
      await readFile(result.executionBriefPath, 'utf8'),
    );
    expect(persistedBrief.operations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'delete-duplicate', operation: 'delete' }),
      ]),
    );
  });
});

const createApprovalWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-adoption-approval-'));
  temporaryRoots.push(root);
  await mkdir(join(root, '.skopos/adoption'), { recursive: true });
  await Promise.all([
    writeFile(join(root, 'README.md'), '# Product\n', 'utf8'),
    writeFile(join(root, 'docs-duplicate.md'), '# Duplicate\n', 'utf8'),
  ]);
  const proposal: SkoposAdoptionRestructuringProposalArtifact = {
    schemaVersion: 1,
    id: 'adoption-restructuring-proposal',
    type: 'adoption-restructuring-proposal',
    status: 'draft',
    authority: 'supporting',
    summary: 'Approval-required restructuring proposal.',
    updatedAt: '2026-07-29T00:00:00.000Z',
    generatedAt: '2026-07-29T00:00:00.000Z',
    workspaceRoot: root,
    intakeDigest: 'intake-digest',
    proposalDigest: 'proposal-digest',
    adoptionState: 'restructuring-proposed',
    approval: 'pending',
    requiresApproval: true,
    operations: [
      {
        id: 'delete-duplicate',
        operation: 'delete',
        sourcePaths: ['docs-duplicate.md'],
        targetPaths: [],
        rationale: 'Remove superseded duplication.',
        retainedTruth: 'README retains the current product purpose.',
        informationLossRisk: 'material',
        linkImpact: [],
        authorityImpact: 'README remains authoritative.',
      },
    ],
    targetTree: ['README.md'],
    linkImpact: [],
    authorityImpact: [
      {
        operationId: 'delete-duplicate',
        summary: 'README remains authoritative.',
      },
    ],
    informationLossRisks: [
      {
        operationId: 'delete-duplicate',
        risk: 'material',
        retainedTruth: 'README retains the current product purpose.',
      },
    ],
  };
  await writeFile(
    join(root, '.skopos/adoption/restructuring-proposal.json'),
    JSON.stringify(proposal),
    'utf8',
  );
  return root;
};

const readProjectFiles = async (root: string): Promise<Record<string, string>> => ({
  'README.md': await readFile(join(root, 'README.md'), 'utf8'),
  'docs-duplicate.md': await readFile(join(root, 'docs-duplicate.md'), 'utf8'),
});
