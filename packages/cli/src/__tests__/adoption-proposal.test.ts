import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type {
  SkoposAdoptionIntakeArtifact,
  SkoposAdoptionReviewedAnalysisInput,
} from '../../../model/src/index.js';
import { buildSkoposAdoptionProposal } from '../../../docs-engine/src/adoption-proposal.js';
import {
  buildSkoposAdoptionAssessmentRuntime,
  buildSkoposAdoptionProposalRuntime,
} from '../../../runtime/src/application/adoption/adoption.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('adoption proposal contract', () => {
  it('stops at questions-open and does not create a proposal', async () => {
    const root = await createProposalWorkspace();
    const intake = buildIntake(root);
    const input = buildInput(intake);
    input.materialQuestions.push({
      id: 'question-authority',
      question: 'Which architecture document is authoritative?',
      whyItMatters: 'The answer changes which document can be archived.',
      evidencePaths: ['README.md', 'docs/old-architecture.md'],
      material: true,
      recommendedOptionId: 'keep-current',
      options: [
        {
          id: 'keep-current',
          label: 'Keep current authority',
          rationale: 'Use the currently linked architecture source.',
        },
        {
          id: 'promote-legacy',
          label: 'Promote legacy source',
          rationale: 'Use only when evidence proves it is the intended authority.',
        },
      ],
      whatHappensAfterAnswer: 'The agent updates reviewed analysis and reruns the proposal.',
    });
    input.documentDispositions = [];

    const result = await buildSkoposAdoptionProposal({
      workspaceRoot: root,
      generatedAt: '2026-07-29T00:00:00.000Z',
      actorId: 'agent-reviewer',
      intake,
      input,
    });

    expect(result.analysis.adoptionState).toBe('questions-open');
    expect(result.analysis.reviewedByActorId).toBe('agent-reviewer');
    expect(result.proposal).toBeUndefined();
  });

  it('builds one approval-required proposal with target and impact views', async () => {
    const root = await createProposalWorkspace();
    const intake = buildIntake(root);
    const result = await buildSkoposAdoptionProposal({
      workspaceRoot: root,
      generatedAt: '2026-07-29T00:00:00.000Z',
      actorId: 'agent-reviewer',
      intake,
      input: buildInput(intake),
    });

    expect(result.analysis.adoptionState).toBe('restructuring-proposed');
    expect(result.proposal).toMatchObject({
      adoptionState: 'restructuring-proposed',
      approval: 'pending',
      requiresApproval: true,
      targetTree: [
        'README.md',
        'docs/00-start-here.md',
        'docs/architecture/overview.md',
      ],
    });
    expect(result.proposal?.operations.map((operation) => operation.operation)).toEqual([
      'keep',
      'keep',
      'move',
    ]);
    expect(result.proposal?.linkImpact).toEqual([
      {
        operationId: 'move-architecture',
        references: ['docs/00-start-here.md'],
      },
    ]);
    expect(result.proposal?.authorityImpact).toHaveLength(3);
  });

  it('requires non-current documents to be classified', async () => {
    const root = await createProposalWorkspace();
    const intake = buildIntake(root);
    await writeFile(join(root, 'docs/history.md'), '# Historical context\n', 'utf8');
    await writeFile(join(root, 'docs/generated.md'), '# Generated reference\n', 'utf8');
    intake.documents.push({
      ...document('docs/history.md', 'overview'),
      lifecycle: 'historical',
      defaultVisible: false,
    });
    intake.documents.push({
      ...document('docs/generated.md', 'overview'),
      authority: 'generated',
      defaultVisible: false,
    });
    const input = buildInput(intake);

    await expect(
      buildSkoposAdoptionProposal({
        workspaceRoot: root,
        generatedAt: '2026-07-29T00:00:00.000Z',
        actorId: 'agent-reviewer',
        intake,
        input,
      }),
    ).rejects.toThrow('docs/history.md');

    input.documentDispositions.push({
      id: 'keep-history',
      operation: 'keep',
      sourcePaths: ['docs/history.md'],
      targetPaths: [],
      rationale: 'Retain historical context in the approved adoption envelope.',
      retainedTruth: 'Historical context remains available but non-authoritative.',
      informationLossRisk: 'none',
      linkImpact: [],
      authorityImpact: 'Historical context remains non-current.',
    });
    input.documentDispositions.push({
      id: 'keep-generated',
      operation: 'keep',
      sourcePaths: ['docs/generated.md'],
      targetPaths: [],
      rationale: 'Keep generator-owned output inside the approved adoption envelope.',
      retainedTruth: 'Generated reference content remains reproducible.',
      informationLossRisk: 'none',
      linkImpact: [],
      authorityImpact: 'The document remains generated authority.',
    });

    await expect(
      buildSkoposAdoptionProposal({
        workspaceRoot: root,
        generatedAt: '2026-07-29T00:00:00.000Z',
        actorId: 'agent-reviewer',
        intake,
        input,
      }),
    ).resolves.toMatchObject({
      proposal: {
        approval: 'pending',
      },
    });
  });

  it.each([
    {
      name: 'stale intake',
      mutate: (input: SkoposAdoptionReviewedAnalysisInput) => {
        input.intakeDigest = 'stale';
      },
      error: 'analysis is stale',
    },
    {
      name: 'missing evidence',
      mutate: (input: SkoposAdoptionReviewedAnalysisInput) => {
        input.claims[0]!.evidencePaths = ['missing.md'];
      },
      error: 'evidence path does not exist',
    },
    {
      name: 'escaped target',
      mutate: (input: SkoposAdoptionReviewedAnalysisInput) => {
        input.documentDispositions[2]!.targetPaths = ['../architecture.md'];
      },
      error: 'project-relative',
    },
    {
      name: 'duplicate source ownership',
      mutate: (input: SkoposAdoptionReviewedAnalysisInput) => {
        input.documentDispositions.push({
          ...input.documentDispositions[0]!,
          id: 'duplicate-readme',
        });
      },
      error: 'more than one disposition',
    },
    {
      name: 'incomplete classification',
      mutate: (input: SkoposAdoptionReviewedAnalysisInput) => {
        input.documentDispositions = input.documentDispositions.slice(0, 2);
      },
      error: 'does not classify',
    },
  ])('fails closed for $name', async ({ mutate, error }) => {
    const root = await createProposalWorkspace();
    const intake = buildIntake(root);
    const input = buildInput(intake);
    mutate(input);

    await expect(
      buildSkoposAdoptionProposal({
        workspaceRoot: root,
        generatedAt: '2026-07-29T00:00:00.000Z',
        actorId: 'agent-reviewer',
        intake,
        input,
      }),
    ).rejects.toThrow(error);
  });
});

describe('adoption proposal runtime', () => {
  it('writes only local adoption artifacts and leaves project documents unchanged', async () => {
    const root = await createRuntimeWorkspace();
    await initSkoposProject({
      cwd: root,
      mode: 'existing',
      actor: 'agent-reviewer',
      scaffoldInstructions: false,
    });
    const assessment = await buildSkoposAdoptionAssessmentRuntime({
      cwd: root,
      actor: 'agent-reviewer',
    });
    const input: SkoposAdoptionReviewedAnalysisInput = {
      schemaVersion: 1,
      intakeDigest: assessment.intake.inputDigest,
      claims: [
        {
          id: 'fact-purpose',
          kind: 'fact',
          summary: 'README describes the fixture product.',
          evidencePaths: ['README.md'],
          confidence: 'high',
        },
      ],
      materialQuestions: [],
      documentDispositions: [
        {
          id: 'keep-current-documents',
          operation: 'keep',
          sourcePaths: assessment.intake.documents
            .filter(
              (document) =>
                document.defaultVisible &&
                document.authority !== 'generated' &&
                ['active', 'durable'].includes(document.lifecycle),
            )
            .map((document) => document.path),
          targetPaths: [],
          rationale: 'The fixture already has a low-churn documentation shape.',
          retainedTruth: 'All current project truth remains in place.',
          informationLossRisk: 'none',
          linkImpact: [],
          authorityImpact: 'No authority changes are proposed.',
        },
      ],
    };
    const analysisInputPath = join(root, '.skopos', 'adoption-input.json');
    await writeFile(analysisInputPath, JSON.stringify(input), 'utf8');
    const before = await readProjectFiles(root);

    const result = await buildSkoposAdoptionProposalRuntime({
      cwd: root,
      inputPath: analysisInputPath,
      actor: 'agent-reviewer',
    });

    expect(result.adoptionState).toBe('restructuring-proposed');
    expect(result.proposal).toMatchObject({
      approval: 'pending',
      requiresApproval: true,
    });
    expect(await readProjectFiles(root)).toEqual(before);
    expect(JSON.parse(await readFile(result.analysisPath, 'utf8'))).toMatchObject({
      type: 'adoption-reviewed-analysis',
      reviewedByActorId: 'agent-reviewer',
    });
    expect(JSON.parse(await readFile(result.proposalPath!, 'utf8'))).toMatchObject({
      type: 'adoption-restructuring-proposal',
      approval: 'pending',
    });
  });
});

const createProposalWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-adoption-proposal-'));
  temporaryRoots.push(root);
  await mkdir(join(root, 'docs'), { recursive: true });
  await Promise.all([
    writeFile(join(root, 'README.md'), '# Product\n\nPurpose.\n', 'utf8'),
    writeFile(join(root, 'docs/00-start-here.md'), '# Start\n', 'utf8'),
    writeFile(join(root, 'docs/old-architecture.md'), '# Old architecture\n', 'utf8'),
  ]);
  return root;
};

const buildIntake = (workspaceRoot: string): SkoposAdoptionIntakeArtifact => ({
  schemaVersion: 1,
  id: 'adoption-intake',
  type: 'adoption-intake',
  status: 'generated',
  authority: 'generated',
  workspaceRoot,
  adoptionState: 'agent-analysis-required',
  assessmentOnly: true,
  inputDigest: 'intake-digest',
  memoryRoots: [{ scopeId: 'workspace', path: 'docs' }],
  documents: [
    document('README.md', 'overview'),
    document('docs/00-start-here.md', 'router'),
    document('docs/old-architecture.md', 'architecture'),
  ],
  codeRoots: [],
  instructionFiles: [],
  commands: [],
  ciPaths: [],
  generatedSourcePaths: [],
  authorityConflicts: [],
  memoryRoleGaps: [],
});

const document = (
  path: string,
  role: 'overview' | 'router' | 'architecture',
): SkoposAdoptionIntakeArtifact['documents'][number] => ({
  id: path,
  title: path,
  path,
  sourceId: 'fixture',
  adoption: 'discovery',
  role,
  lifecycle: 'durable',
  authority: 'supporting',
  defaultVisible: true,
});

const buildInput = (
  intake: SkoposAdoptionIntakeArtifact,
): SkoposAdoptionReviewedAnalysisInput => ({
  schemaVersion: 1,
  intakeDigest: intake.inputDigest,
  claims: [
    {
      id: 'fact-purpose',
      kind: 'fact',
      summary: 'README describes the product purpose.',
      evidencePaths: ['README.md'],
      confidence: 'high',
    },
  ],
  materialQuestions: [],
  documentDispositions: [
    {
      id: 'keep-readme',
      operation: 'keep',
      sourcePaths: ['README.md'],
      targetPaths: [],
      rationale: 'Keep the public project introduction.',
      retainedTruth: 'Product purpose remains public.',
      informationLossRisk: 'none',
      linkImpact: [],
      authorityImpact: 'README remains supporting project introduction.',
    },
    {
      id: 'keep-router',
      operation: 'keep',
      sourcePaths: ['docs/00-start-here.md'],
      targetPaths: [],
      rationale: 'Keep the canonical documentation router.',
      retainedTruth: 'The current navigation entrypoint remains.',
      informationLossRisk: 'none',
      linkImpact: [],
      authorityImpact: 'The router remains canonical.',
    },
    {
      id: 'move-architecture',
      operation: 'move',
      sourcePaths: ['docs/old-architecture.md'],
      targetPaths: ['docs/architecture/overview.md'],
      rationale: 'Converge architecture truth on the standard role path.',
      retainedTruth: 'All architecture content moves without rewriting.',
      informationLossRisk: 'low',
      linkImpact: ['docs/00-start-here.md'],
      authorityImpact: 'The moved document becomes the architecture role candidate.',
    },
  ],
});

const createRuntimeWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-adoption-runtime-'));
  temporaryRoots.push(root);
  await Promise.all([
    mkdir(join(root, 'docs'), { recursive: true }),
    writeFile(
      join(root, 'package.json'),
      JSON.stringify({
        name: 'adoption-runtime-fixture',
        private: true,
        scripts: { test: 'vitest run' },
      }),
      'utf8',
    ),
    writeFile(join(root, 'README.md'), '# Runtime fixture\n\nPurpose.\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Agent rules\n', 'utf8'),
  ]);
  return root;
};

const readProjectFiles = async (root: string): Promise<Record<string, string>> => ({
  'README.md': await readFile(join(root, 'README.md'), 'utf8'),
  'AGENTS.md': await readFile(join(root, 'AGENTS.md'), 'utf8'),
});
