import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { syncInstructionMirrors } from '@skopos/instructions';
import type {
  SkoposAdoptionApprovalArtifact,
  SkoposAdoptionExecutionInput,
  SkoposAdoptionRestructuringProposalArtifact,
  SkoposScopesLiteArtifact,
} from '../../../model/src/index.js';
import { buildSkoposAdoptionVerificationRuntime } from '../../../runtime/src/application/adoption/adoption.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('adoption standard verification', () => {
  it('fails closed when execution evidence is not bound to the approved digest', async () => {
    const fixture = await createVerificationWorkspace();
    const input = buildExecutionInput();
    input.proposalDigest = 'stale-digest';
    const inputPath = await writeExecutionInput(fixture.root, input);

    await expect(
      buildSkoposAdoptionVerificationRuntime({
        cwd: fixture.root,
        inputPath,
        actor: 'verification-agent',
      }),
    ).rejects.toThrow('digests must match exactly');
  });

  it('fails closed when reported result paths differ from the approved operation', async () => {
    const fixture = await createVerificationWorkspace();
    const input = buildExecutionInput();
    input.operations[0]!.resultPaths = ['docs/wrong.md'];
    const inputPath = await writeExecutionInput(fixture.root, input);

    await expect(
      buildSkoposAdoptionVerificationRuntime({
        cwd: fixture.root,
        inputPath,
        actor: 'verification-agent',
      }),
    ).rejects.toThrow('approved-operation-topology');
  });

  it('records standard-verified only after all standard checks pass', async () => {
    const fixture = await createVerificationWorkspace();
    const inputPath = await writeExecutionInput(fixture.root, buildExecutionInput());

    const result = await buildSkoposAdoptionVerificationRuntime({
      cwd: fixture.root,
      inputPath,
      actor: 'verification-agent',
    });

    expect(result).toMatchObject({
      adoptionState: 'standard-verified',
      verificationWrite: 'written',
      actorId: 'verification-agent',
      verification: {
        authority: 'generated',
        proposalDigest: 'proposal-digest',
        verifiedOperationIds: ['keep-standard-docs'],
        verifiedByActorId: 'verification-agent',
      },
    });
    expect(result.verification.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'strict-project-memory', status: 'pass' }),
        expect.objectContaining({
          id: 'approved-operation-topology',
          status: 'pass',
        }),
        expect.objectContaining({ id: 'document-contract', status: 'pass' }),
        expect.objectContaining({ id: 'memory-role-coverage', status: 'pass' }),
        expect.objectContaining({
          id: 'instruction-mirror-parity',
          status: 'pass',
        }),
      ]),
    );
    expect(result.verification).not.toHaveProperty('agentReady');
    expect(JSON.parse(await readFile(result.verificationPath, 'utf8'))).toMatchObject({
      adoptionState: 'standard-verified',
    });
  });

  it('honors an explicitly empty project mirror list during adoption verification', async () => {
    const fixture = await createVerificationWorkspace();
    const configPath = join(fixture.root, 'skopos.config.yaml');
    const config = await readFile(configPath, 'utf8');
    await writeFile(
      configPath,
      config.replace(
        /  syncMirrors:[^\n]*\n(?:    - [^\n]*\n)*/,
        '  syncMirrors: []\n',
      ),
      'utf8',
    );
    await Promise.all([
      rm(join(fixture.root, 'CLAUDE.md'), { force: true }),
      rm(join(fixture.root, '.cursor/rules/project.mdc'), { force: true }),
      rm(join(fixture.root, '.github/copilot-instructions.md'), { force: true }),
    ]);
    const inputPath = await writeExecutionInput(fixture.root, buildExecutionInput());

    await expect(
      buildSkoposAdoptionVerificationRuntime({
        cwd: fixture.root,
        inputPath,
        actor: 'verification-agent',
      }),
    ).resolves.toMatchObject({
      verification: {
        checks: expect.arrayContaining([
          expect.objectContaining({
            id: 'instruction-mirror-parity',
            status: 'pass',
          }),
        ]),
      },
    });
  });
});

const createVerificationWorkspace = async (): Promise<{ root: string }> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-adoption-verification-'));
  temporaryRoots.push(root);
  await writeFile(
    join(root, 'package.json'),
    JSON.stringify({ name: 'verification-fixture', private: true }),
    'utf8',
  );
  await initSkoposProject({
    cwd: root,
    mode: 'greenfield',
    actor: 'verification-agent',
    forceInstructions: true,
  });
  const scopes = JSON.parse(
    await readFile(join(root, '.skopos/index/scopes.json'), 'utf8'),
  ) as SkoposScopesLiteArtifact;
  const scopeId = scopes.scopes.find((scope) => scope.kind === 'workspace')!.id;
  await mkdir(join(root, 'tools/skopos'), { recursive: true });
  await writeFile(
    join(root, 'tools/skopos/scopes.yaml'),
    `schemaVersion: 1
scopes:
  - id: ${scopeId}
    title: Verification Fixture
    kind: workspace
    path: .
    memoryRoot: docs
    codeRoots:
      - .
    parent: null
    profile: core.workspace
    dependsOn: []
    owners:
      - fixture-owner
    aliases: []
`,
    'utf8',
  );
  await writeFile(
    join(root, 'docs/overview.md'),
    canonicalDocument({
      title: 'Product Overview',
      id: 'PRODUCT-OVERVIEW',
      scopeId,
      role: 'overview',
      body: 'The fixture product purpose.',
    }),
    'utf8',
  );
  await syncInstructionMirrors({ cwd: root });
  await mkdir(join(root, '.skopos/adoption'), { recursive: true });
  const proposal = buildProposal(root);
  const approval = buildApproval(root);
  await Promise.all([
    writeFile(
      join(root, '.skopos/adoption/restructuring-proposal.json'),
      JSON.stringify(proposal),
      'utf8',
    ),
    writeFile(
      join(root, '.skopos/adoption/proposal-approval.json'),
      JSON.stringify(approval),
      'utf8',
    ),
  ]);
  return { root };
};

const buildProposal = (
  workspaceRoot: string,
): SkoposAdoptionRestructuringProposalArtifact => ({
  schemaVersion: 1,
  id: 'adoption-restructuring-proposal',
  type: 'adoption-restructuring-proposal',
  status: 'draft',
  authority: 'supporting',
  summary: 'Keep the conforming standard documents.',
  updatedAt: '2026-07-29T00:00:00.000Z',
  generatedAt: '2026-07-29T00:00:00.000Z',
  workspaceRoot,
  intakeDigest: 'intake-digest',
  proposalDigest: 'proposal-digest',
  adoptionState: 'restructuring-proposed',
  approval: 'pending',
  requiresApproval: true,
  operations: [
    {
      id: 'keep-standard-docs',
      operation: 'keep',
      sourcePaths: ['docs/00-start-here.md', 'docs/overview.md'],
      targetPaths: [],
      rationale: 'The generated router and reviewed overview already conform.',
      retainedTruth: 'All current product truth remains.',
      informationLossRisk: 'none',
      linkImpact: [],
      authorityImpact: 'The router and overview remain canonical.',
    },
  ],
  targetTree: ['docs/00-start-here.md', 'docs/overview.md'],
  linkImpact: [],
  authorityImpact: [
    {
      operationId: 'keep-standard-docs',
      summary: 'The router and overview remain canonical.',
    },
  ],
  informationLossRisks: [],
});

const buildApproval = (
  workspaceRoot: string,
): SkoposAdoptionApprovalArtifact => ({
  schemaVersion: 1,
  id: 'adoption-proposal-approval',
  type: 'adoption-proposal-approval',
  status: 'active',
  authority: 'canonical',
  summary: 'Exact proposal approved.',
  updatedAt: '2026-07-29T00:01:00.000Z',
  generatedAt: '2026-07-29T00:01:00.000Z',
  workspaceRoot,
  adoptionState: 'restructuring',
  proposalDigest: 'proposal-digest',
  approvedOperationIds: ['keep-standard-docs'],
  materialRiskAccepted: false,
  approvedAt: '2026-07-29T00:01:00.000Z',
  approvedByActorId: 'approver',
  reason: 'The standard structure is correct.',
});

const buildExecutionInput = (): SkoposAdoptionExecutionInput => ({
  schemaVersion: 1,
  proposalDigest: 'proposal-digest',
  operations: [
    {
      operationId: 'keep-standard-docs',
      resultPaths: ['docs/00-start-here.md', 'docs/overview.md'],
      summary: 'The approved standard documents remain in place.',
      retainedTruthVerified: true,
    },
  ],
});

const writeExecutionInput = async (
  root: string,
  input: SkoposAdoptionExecutionInput,
): Promise<string> => {
  const path = join(root, '.skopos/adoption/execution-input.json');
  await writeFile(path, JSON.stringify(input), 'utf8');
  return path;
};

const canonicalDocument = ({
  title,
  id,
  scopeId,
  role,
  body,
}: {
  title: string;
  id: string;
  scopeId: string;
  role: 'overview';
  body: string;
}): string => `---
title: ${title}
status: active
owner: fixture-owner
id: ${id}
scope: ${scopeId}
role: ${role}
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-07-29
relatedDocs: []
reviewCycle: when product truth changes
---

# ${title}

${body}

## Changelog

- \`2026-07-29\`: Established the verified fixture document.
`;
