import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { syncInstructionMirrors } from '@skopos/instructions';
import type { SkoposAdoptionReviewedAnalysisInput, SkoposScopesLiteArtifact } from '@skopos/model';
import {
  buildSkoposAdoptionActivationRuntime,
  buildSkoposAdoptionApprovalRuntime,
  buildSkoposAdoptionAssessmentRuntime,
  buildSkoposAdoptionProposalRuntime,
  buildSkoposAdoptionSessionState,
  buildSkoposAdoptionVerificationRuntime,
  initSkoposProject,
} from '../../../runtime/src/index.js';
import { requiresAdoptionOrientation } from '../../../ui/src/platform/console-state/work-selectors.js';
import type { SkoposUiConsoleState } from '../../../ui/src/contracts/skopos-ui-console-state.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('agent-reviewed adoption matrix', () => {
  it('keeps scanner-only intake visibly assessment-only in Session and UI projections', async () => {
    const root = await createExistingWorkspace('assessment-only');
    await initSkoposProject({
      cwd: root,
      mode: 'existing',
      actor: 'matrix-assessor',
      scaffoldInstructions: false,
    });

    const before = await readProjectSources(root, ['README.md', 'AGENTS.md']);
    const assessment = await buildSkoposAdoptionAssessmentRuntime({
      cwd: root,
      actor: 'matrix-assessor',
    });
    const session = await buildSkoposAdoptionSessionState(root, []);

    expect(assessment).toMatchObject({
      adoptionState: 'agent-analysis-required',
      assessmentOnly: true,
    });
    expect(session).toMatchObject({
      state: 'agent-analysis-required',
      assessmentOnly: true,
    });
    expect(requiresAdoptionOrientation(uiState(session))).toBe(true);
    expect(JSON.stringify(session)).not.toContain('agent-ready');
    expect(await readProjectSources(root, ['README.md', 'AGENTS.md'])).toEqual(before);
  }, 15_000);

  it.each([
    { name: 'new project', mode: 'greenfield' as const },
    { name: 'healthy brownfield', mode: 'existing' as const },
  ])('certifies the complete reviewed lifecycle for a $name', async ({ mode }) => {
    const root =
      mode === 'greenfield'
        ? await createEmptyWorkspace('healthy-new')
        : await createExistingWorkspace('healthy-brownfield');
    await initSkoposProject({
      cwd: root,
      mode,
      actor: 'matrix-agent',
      forceInstructions: true,
    });
    await writeStandardMemory(root, mode === 'existing' ? 'Healthy Brownfield' : 'Healthy New Project');
    await syncInstructionMirrors({ cwd: root });

    const result = await completeKeepAdoption(root, 'matrix-agent');

    expect(result.session).toMatchObject({ state: 'agent-ready', assessmentOnly: false });
    expect(requiresAdoptionOrientation(uiState(result.session))).toBe(false);
    expect(result.verification.verification.checks.every((check) => check.status === 'pass')).toBe(true);
    expect(result.activation.activation).toMatchObject({
      adoptionState: 'agent-ready',
      activatedByActorId: 'matrix-agent',
    });
  });

  it('stops a messy brownfield project for material review, then certifies only the approved restructuring', async () => {
    const root = await createExistingWorkspace('messy-brownfield');
    await mkdir(join(root, 'docs'), { recursive: true });
    await Promise.all([
      writeFile(join(root, 'docs/product-notes.md'), '# Product notes\n', 'utf8'),
      writeFile(join(root, 'docs/architecture-old.md'), '# Conflicting architecture\n', 'utf8'),
    ]);
    await initSkoposProject({
      cwd: root,
      mode: 'existing',
      actor: 'matrix-agent',
      forceInstructions: true,
    });
    const assessment = await buildSkoposAdoptionAssessmentRuntime({
      cwd: root,
      actor: 'matrix-agent',
    });
    const sourcePaths = currentDocumentPaths(assessment.intake.documents);
    const before = await readProjectSources(root, sourcePaths);
    const questionInput: SkoposAdoptionReviewedAnalysisInput = {
      schemaVersion: 1,
      intakeDigest: assessment.intake.inputDigest,
      claims: [groundedClaim(sourcePaths[0]!)],
      materialQuestions: [
        {
          id: 'architecture-authority',
          question: 'Which architecture statement is authoritative?',
          whyItMatters: 'The answer changes the canonical overview and what can be retired.',
          evidencePaths: sourcePaths,
          material: true,
          recommendedOptionId: 'review-and-converge',
          options: [
            {
              id: 'review-and-converge',
              label: 'Review and converge',
              rationale: 'Retain verified product and architecture truth in standard Memory.',
            },
            {
              id: 'keep-conflict',
              label: 'Keep both current',
              rationale: 'Preserves ambiguity and therefore cannot activate adoption.',
            },
          ],
          whatHappensAfterAnswer: 'The reviewed analysis is regenerated with one approved target tree.',
        },
      ],
      documentDispositions: [],
    };
    const inputPath = join(root, '.skopos/adoption-input.json');
    await writeFile(inputPath, JSON.stringify(questionInput), 'utf8');

    const stopped = await buildSkoposAdoptionProposalRuntime({
      cwd: root,
      inputPath,
      actor: 'matrix-agent',
    });
    const stoppedSession = await buildSkoposAdoptionSessionState(root, []);

    expect(stopped).toMatchObject({ adoptionState: 'questions-open' });
    expect(stopped.proposal).toBeUndefined();
    expect(stoppedSession).toMatchObject({
      state: 'questions-open',
      assessmentOnly: true,
      pendingDecision: { id: 'architecture-authority', blocking: true },
    });
    expect(await readProjectSources(root, sourcePaths)).toEqual(before);

    const resolvedInput: SkoposAdoptionReviewedAnalysisInput = {
      ...questionInput,
      materialQuestions: [],
      documentDispositions: buildMessyDispositions(sourcePaths),
    };
    await writeFile(inputPath, JSON.stringify(resolvedInput), 'utf8');
    const proposal = await buildSkoposAdoptionProposalRuntime({
      cwd: root,
      inputPath,
      actor: 'matrix-agent',
    });
    const approval = await buildSkoposAdoptionApprovalRuntime({
      cwd: root,
      proposalDigest: proposal.proposal!.proposalDigest,
      actor: 'matrix-approver',
      reason: 'The reviewed target preserves the bounded product and architecture truth.',
    });
    await Promise.all(sourcePaths.map((path) => rm(join(root, path), { force: true })));
    await writeStandardMemory(root, 'Messy Brownfield');
    await syncInstructionMirrors({ cwd: root });
    await enableStrictMemory(root);
    const executionPath = await writeExecutionInput(root, approval.executionBrief.executionInputTemplate);
    const verification = await buildSkoposAdoptionVerificationRuntime({
      cwd: root,
      inputPath: executionPath,
      actor: 'matrix-verifier',
    });
    await buildSkoposAdoptionActivationRuntime({
      cwd: root,
      actor: 'matrix-activator',
      reason: 'The approved restructuring passed every standard verification check.',
    });
    const session = await buildSkoposAdoptionSessionState(root, []);

    expect(verification.verification.checks.every((check) => check.status === 'pass')).toBe(true);
    expect(session).toMatchObject({ state: 'agent-ready', assessmentOnly: false });
  });
});

const completeKeepAdoption = async (root: string, actor: string) => {
  const assessment = await buildSkoposAdoptionAssessmentRuntime({ cwd: root, actor });
  const sourcePaths = currentDocumentPaths(assessment.intake.documents);
  const input: SkoposAdoptionReviewedAnalysisInput = {
    schemaVersion: 1,
    intakeDigest: assessment.intake.inputDigest,
    claims: [groundedClaim(sourcePaths[0]!)],
    materialQuestions: [],
    documentDispositions: [
      {
        id: 'keep-standard-memory',
        operation: 'keep',
        sourcePaths,
        targetPaths: [],
        rationale: 'The reviewed Memory already conforms to the standard.',
        retainedTruth: 'All current project truth remains in place.',
        informationLossRisk: 'none',
        linkImpact: [],
        authorityImpact: 'Existing canonical authority remains unchanged.',
      },
    ],
  };
  const inputPath = join(root, '.skopos/adoption-input.json');
  await writeFile(inputPath, JSON.stringify(input), 'utf8');
  const proposal = await buildSkoposAdoptionProposalRuntime({ cwd: root, inputPath, actor });
  const approval = await buildSkoposAdoptionApprovalRuntime({
    cwd: root,
    proposalDigest: proposal.proposal!.proposalDigest,
    actor,
    reason: 'The reviewed standard Memory is correct.',
  });
  expect(approval.executionBrief.instructions).toContain(
    'After the approved document operations conform, enable docs.strictMetadata and docs.strictLinking in skopos.config.yaml; standard verification checks this configuration activation before adoption can become agent-ready.',
  );
  await enableStrictMemory(root);
  const executionPath = await writeExecutionInput(root, approval.executionBrief.executionInputTemplate);
  const verification = await buildSkoposAdoptionVerificationRuntime({
    cwd: root,
    inputPath: executionPath,
    actor,
  });
  const activation = await buildSkoposAdoptionActivationRuntime({
    cwd: root,
    actor,
    reason: 'Every approved operation passed standard verification.',
  });
  const session = await buildSkoposAdoptionSessionState(root, []);
  return { verification, activation, session };
};

const uiState = (
  sessionContext: Awaited<ReturnType<typeof buildSkoposAdoptionSessionState>>,
): SkoposUiConsoleState =>
  ({
    sessionContext: sessionContext
      ? {
          schemaVersion: 1,
          workspaceRoot: '/fixture',
          summary: 'Adoption projection fixture.',
          responseMode: 'direct-answer',
          communicationContract: { marker: 'fixture', tokenBudget: 1, coreRules: [] },
          additionalPendingDecisionCount: 0,
          warnings: [],
          additionalContext: '',
          adoption: sessionContext,
        }
      : undefined,
  }) as SkoposUiConsoleState;

const writeExecutionInput = async (root: string, input: unknown): Promise<string> => {
  const path = join(root, '.skopos/adoption/execution-input.json');
  await writeFile(path, JSON.stringify(input), 'utf8');
  return path;
};

const currentDocumentPaths = (
  documents: Awaited<ReturnType<typeof buildSkoposAdoptionAssessmentRuntime>>['intake']['documents'],
): string[] =>
  documents
    .filter(
      (document) =>
        document.defaultVisible &&
        document.authority !== 'generated' &&
        ['active', 'durable'].includes(document.lifecycle),
    )
    .map((document) => document.path);

const groundedClaim = (path: string): SkoposAdoptionReviewedAnalysisInput['claims'][number] => ({
  id: 'reviewed-purpose',
  kind: 'fact',
  summary: 'The reviewed source describes the project purpose.',
  evidencePaths: [path],
  confidence: 'high',
});

const buildMessyDispositions = (
  sourcePaths: string[],
): SkoposAdoptionReviewedAnalysisInput['documentDispositions'] => {
  const [routerSource, ...overviewSources] = sourcePaths;
  if (!routerSource || overviewSources.length === 0) {
    throw new Error('Messy fixture requires at least two conflicting document sources.');
  }
  return [
    {
      id: 'promote-router',
      operation: 'move',
      sourcePaths: [routerSource],
      targetPaths: ['docs/00-start-here.md'],
      rationale: 'Promote one reviewed source into the standard Memory router.',
      retainedTruth: 'The project retains an explicit entrypoint to current Memory.',
      informationLossRisk: 'none',
      linkImpact: [],
      authorityImpact: 'The standard router becomes canonical.',
    },
    {
      id: 'converge-overview',
      operation: overviewSources.length === 1 ? 'move' : 'merge',
      sourcePaths: overviewSources,
      targetPaths: ['docs/overview.md'],
      rationale: 'Converge the remaining reviewed sources into one standard overview.',
      retainedTruth: 'The product purpose and reviewed architecture boundary remain explicit.',
      informationLossRisk: 'none',
      linkImpact: [],
      authorityImpact: 'The standard overview becomes the only current overview authority.',
    },
  ];
};

const enableStrictMemory = async (root: string): Promise<void> => {
  const path = join(root, 'skopos.config.yaml');
  const config = await readFile(path, 'utf8');
  await writeFile(
    path,
    config
      .replace('strictMetadata: false', 'strictMetadata: true')
      .replace('strictLinking: false', 'strictLinking: true'),
    'utf8',
  );
};

const createEmptyWorkspace = async (name: string): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), `skopos-adoption-matrix-${name}-`));
  temporaryRoots.push(root);
  await writeFile(join(root, 'package.json'), JSON.stringify({ name, private: true }), 'utf8');
  return root;
};

const createExistingWorkspace = async (name: string): Promise<string> => {
  const root = await createEmptyWorkspace(name);
  await mkdir(join(root, 'tools/skopos'), { recursive: true });
  await Promise.all([
    writeFile(join(root, 'README.md'), `# ${name}\n\nExisting project purpose.\n`, 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Project instructions\n\nKeep project truth current.\n', 'utf8'),
    writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      `schemaVersion: 1
scopes:
  - id: fixture
    title: ${name}
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
    ),
  ]);
  return root;
};

const writeStandardMemory = async (root: string, title: string): Promise<void> => {
  const scopes = JSON.parse(
    await readFile(join(root, '.skopos/index/scopes.json'), 'utf8'),
  ) as SkoposScopesLiteArtifact;
  const scopeId = scopes.scopes.find((scope) => scope.kind === 'workspace')!.id;
  await mkdir(join(root, 'docs'), { recursive: true });
  await Promise.all([
    writeFile(
      join(root, 'docs/00-start-here.md'),
      canonicalDocument(title, `${scopeId}-ROUTER`, scopeId, 'router', 'Read [Project overview](./overview.md).', [
        'overview.md',
      ]),
      'utf8',
    ),
    writeFile(
      join(root, 'docs/overview.md'),
      canonicalDocument(title, `${scopeId}-OVERVIEW`, scopeId, 'overview', `${title} has reviewed product and architecture boundaries.`, []),
      'utf8',
    ),
  ]);
};

const canonicalDocument = (
  title: string,
  id: string,
  scope: string,
  role: 'router' | 'overview',
  body: string,
  relatedDocs: string[],
): string => `---
title: ${title}
status: active
owner: fixture-owner
id: ${id}
scope: ${scope}
role: ${role}
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-05
relatedDocs: ${JSON.stringify(relatedDocs)}
reviewCycle: when project truth changes
---

# ${title}

${body}
`;

const readProjectSources = async (
  root: string,
  paths: string[],
): Promise<Record<string, string>> =>
  Object.fromEntries(
    await Promise.all(paths.map(async (path) => [path, await readFile(join(root, path), 'utf8')] as const)),
  );
