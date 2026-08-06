import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  SKOPOS_COMMUNICATION_CONTRACT,
  resolveDecisionDefaultBehavior,
  syncClaudeCodeHookAdapter,
  syncCodexWrapperAdapter,
} from '@skopos/instructions';
import type {
  SkoposAdoptionIntakeArtifact,
  SkoposAdoptionRestructuringProposalArtifact,
  SkoposAdoptionReviewedAnalysisArtifact,
  SkoposSessionContextRunResult,
} from '@skopos/model';
import {
  buildSkoposAdoptionSessionState,
  renderSkoposSessionAdditionalContext,
} from '@skopos/runtime';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('session communication contract', () => {
  it('uses adaptive response modes and deterministic decision defaults', () => {
    expect(SKOPOS_COMMUNICATION_CONTRACT.responseModes).toEqual([
      'direct-answer',
      'work-start',
      'progress',
      'decision',
      'completion',
    ]);
    expect(SKOPOS_COMMUNICATION_CONTRACT.coreRules).toContain(
      'Use the response mode that fits the moment; do not announce a lane unless risk or execution scope makes it useful.',
    );
    expect(resolveDecisionDefaultBehavior('delegable')).toBe('proceed-with-recommended');
    expect(resolveDecisionDefaultBehavior('recommend-and-ask')).toBe(
      'proceed-with-recommended-if-no-preference',
    );
    expect(resolveDecisionDefaultBehavior('must-ask')).toBe('wait-for-answer');
    expect(resolveDecisionDefaultBehavior('forbidden-without-approval')).toBe(
      'require-explicit-approval',
    );
  });

  it('renders a complete decision without loading the verbose communication brief', () => {
    const context: SkoposSessionContextRunResult = {
      schemaVersion: 1,
      workspaceRoot: '/project',
      summary: 'A blocking user decision is pending.',
      responseMode: 'decision',
      communicationContract: {
        marker: SKOPOS_COMMUNICATION_CONTRACT.marker,
        tokenBudget: SKOPOS_COMMUNICATION_CONTRACT.tokenBudget,
        coreRules: SKOPOS_COMMUNICATION_CONTRACT.coreRules,
      },
      currentTaskId: 'task-1',
      workQueueSummary: 'Choose the storage provider.',
      nextCommand: 'skopos decide storage existing-vendor .',
      pendingDecision: {
        id: 'storage',
        question: 'Which storage provider should the project use?',
        escalation: 'must-ask',
        blocking: true,
        whyItMatters: 'The choice changes deployment and data ownership.',
        recommendedOptionId: 'existing-vendor',
        recommendedOption: {
          id: 'existing-vendor',
          label: 'Keep existing vendor',
          rationale: 'It avoids a migration during this change.',
        },
        alternatives: [
          {
            id: 'new-vendor',
            label: 'Adopt new vendor',
            rationale: 'It improves portability but requires migration work.',
          },
        ],
        defaultBehavior: 'wait-for-answer',
        whatHappensAfterAnswer: 'Implementation can continue.',
      },
      additionalPendingDecisionCount: 0,
      warnings: [],
      additionalContext: '',
    };

    const rendered = renderSkoposSessionAdditionalContext(context);
    expect(rendered).toContain('[SKOPOS_SESSION_CONTEXT_V1]');
    expect(rendered).toContain('Response mode: decision');
    expect(rendered).toContain('Recommended: Keep existing vendor');
    expect(rendered).toContain(
      'Reason: The choice changes deployment and data ownership.',
    );
    expect(rendered).toContain('Default behavior: wait-for-answer');
    expect(rendered).toContain(
      'Adopt new vendor: It improves portability but requires migration work.',
    );
    expect(rendered).not.toContain('communication-brief.json');
  });

  it('projects the same session-context command into Claude and Codex adapters', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-session-contract-'));
    temporaryRoots.push(workspaceRoot);
    const [claude, codex] = await Promise.all([
      syncClaudeCodeHookAdapter({ cwd: workspaceRoot }),
      syncCodexWrapperAdapter({ cwd: workspaceRoot }),
    ]);
    const claudeScript = await readFile(
      claude.writes.find((write) => write.path.endsWith('session-start-hook.mjs'))!.path,
      'utf8',
    );
    const [codexScript, claudePreCompactScript] = await Promise.all([readFile(
      codex.writes.find((write) => write.path.endsWith('codex-discussion-adapter.mjs'))!.path,
      'utf8',
    ), readFile(
      claude.writes.find((write) => write.path.endsWith('pre-compact-hook.mjs'))!.path,
      'utf8',
    )]);

    expect(claudeScript).toContain("'session', 'context'");
    expect(codexScript).toContain("'session', 'context'");
    expect(claudeScript).toContain("'--host', 'claude-code'");
    expect(claudeScript).toContain("'--session-id', input.session_id.trim()");
    expect(codexScript).toContain("'--host', 'codex'");
    expect(codexScript).toContain("'--session-id', payload.sessionId.trim()");
    expect(claudeScript).not.toContain("['discuss', 'recent'");
    expect(codexScript).not.toContain("['discuss', 'recent'");
    expect(claudePreCompactScript).toContain("['discuss', 'handoff', 'refresh'");
    expect(codexScript).toContain("['discuss', 'handoff', 'verify'");
    expect(codexScript).toContain("['discuss', 'handoff', 'render'");
  });

  it('delivers one material adoption question through normal session context', async () => {
    const workspaceRoot = await createAdoptionSessionWorkspace();
    const analysis = buildAnalysis(workspaceRoot);
    await writeFile(
      join(workspaceRoot, '.skopos/adoption/reviewed-analysis.json'),
      JSON.stringify(analysis),
      'utf8',
    );

    const adoption = await buildSkoposAdoptionSessionState(workspaceRoot, []);

    expect(adoption).toMatchObject({
      state: 'questions-open',
      assessmentOnly: true,
      pendingDecision: {
        id: 'question-authority',
        source: 'adoption-question',
        recommendedOptionId: 'keep-current',
        defaultBehavior: 'wait-for-answer',
      },
    });
    expect(adoption?.pendingDecision?.recommendedOption?.label).toBe(
      'Keep current authority',
    );
  });

  it('requires exact proposal approval through normal session context', async () => {
    const workspaceRoot = await createAdoptionSessionWorkspace();
    const proposal = buildProposal(workspaceRoot);
    await writeFile(
      join(workspaceRoot, '.skopos/adoption/restructuring-proposal.json'),
      JSON.stringify(proposal),
      'utf8',
    );

    const adoption = await buildSkoposAdoptionSessionState(workspaceRoot, []);

    expect(adoption).toMatchObject({
      state: 'restructuring-proposed',
      assessmentOnly: true,
      proposalDigest: 'proposal-digest',
      pendingDecision: {
        source: 'adoption-approval',
        recommendedOptionId: 'revise-proposal',
        defaultBehavior: 'require-explicit-approval',
      },
    });
    expect(adoption?.pendingDecision?.alternatives.map((option) => option.id)).toContain(
      'approve-proposal',
    );
    expect(adoption?.pendingDecision?.whatHappensAfterAnswer).toContain(
      '--accept-material-risk',
    );
  });

  it('reports standard verification without claiming agent-ready activation', async () => {
    const workspaceRoot = await createAdoptionSessionWorkspace();
    const proposal = buildProposal(workspaceRoot);
    await Promise.all([
      writeFile(
        join(workspaceRoot, '.skopos/adoption/restructuring-proposal.json'),
        JSON.stringify(proposal),
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, '.skopos/adoption/proposal-approval.json'),
        JSON.stringify({
          schemaVersion: 1,
          id: 'adoption-proposal-approval',
          type: 'adoption-proposal-approval',
          status: 'active',
          authority: 'canonical',
          summary: 'Proposal approved.',
          updatedAt: '2026-07-29T00:01:00.000Z',
          generatedAt: '2026-07-29T00:01:00.000Z',
          workspaceRoot,
          adoptionState: 'restructuring',
          proposalDigest: proposal.proposalDigest,
          approvedOperationIds: ['archive-old-doc'],
          materialRiskAccepted: true,
          approvedAt: '2026-07-29T00:01:00.000Z',
          approvedByActorId: 'approver',
          reason: 'Historical content remains retained.',
        }),
        'utf8',
      ),
      writeFile(
        join(workspaceRoot, '.skopos/adoption/standard-verification.json'),
        JSON.stringify({
          schemaVersion: 1,
          id: 'adoption-standard-verification',
          type: 'adoption-standard-verification',
          status: 'generated',
          authority: 'generated',
          summary: 'Standard verified.',
          updatedAt: '2026-07-29T00:02:00.000Z',
          generatedAt: '2026-07-29T00:02:00.000Z',
          workspaceRoot,
          adoptionState: 'standard-verified',
          proposalDigest: proposal.proposalDigest,
          verifiedOperationIds: ['archive-old-doc'],
          verifiedByActorId: 'verification-agent',
          verifiedAt: '2026-07-29T00:02:00.000Z',
          executionEvidence: [],
          checks: [],
        }),
        'utf8',
      ),
    ]);

    const adoption = await buildSkoposAdoptionSessionState(workspaceRoot, []);

    expect(adoption).toMatchObject({
      state: 'standard-verified',
      assessmentOnly: false,
      proposalDigest: 'proposal-digest',
    });
    expect(adoption?.pendingDecision).toBeUndefined();
    expect(adoption?.nextCommand).toContain('activation');
    expect(adoption?.nextCommand).toContain('before claiming agent-ready');

    await writeFile(
      join(workspaceRoot, '.skopos/adoption/activation.json'),
      JSON.stringify({
        schemaVersion: 1,
        id: 'adoption-activation',
        type: 'adoption-activation',
        status: 'active',
        authority: 'canonical',
        summary: 'Adoption active.',
        updatedAt: '2026-07-29T00:03:00.000Z',
        generatedAt: '2026-07-29T00:03:00.000Z',
        workspaceRoot,
        adoptionState: 'agent-ready',
        proposalDigest: proposal.proposalDigest,
        verifiedOperationIds: ['archive-old-doc'],
        activatedAt: '2026-07-29T00:03:00.000Z',
        activatedByActorId: 'activation-agent',
        reason: 'Verified and ready.',
      }),
      'utf8',
    );
    const activated = await buildSkoposAdoptionSessionState(workspaceRoot, []);
    expect(activated).toMatchObject({
      state: 'agent-ready',
      assessmentOnly: false,
      proposalDigest: 'proposal-digest',
    });
  });
});

const createAdoptionSessionWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-adoption-session-'));
  temporaryRoots.push(workspaceRoot);
  await Promise.all([
    mkdir(join(workspaceRoot, '.skopos/adoption'), { recursive: true }),
    writeFile(join(workspaceRoot, 'README.md'), '# Product\n', 'utf8'),
  ]);
  await writeFile(
    join(workspaceRoot, '.skopos/adoption/intake.json'),
    JSON.stringify(buildIntake(workspaceRoot)),
    'utf8',
  );
  return workspaceRoot;
};

const buildIntake = (workspaceRoot: string): SkoposAdoptionIntakeArtifact => ({
  schemaVersion: 1,
  id: 'adoption-intake',
  type: 'adoption-intake',
  status: 'generated',
  authority: 'generated',
  summary: 'Adoption intake.',
  updatedAt: '2026-07-29T00:00:00.000Z',
  generatedAt: '2026-07-29T00:00:00.000Z',
  workspaceRoot,
  adoptionState: 'agent-analysis-required',
  assessmentOnly: true,
  inputDigest: 'intake-digest',
  memoryRoots: [{ scopeId: 'workspace', path: 'docs' }],
  documents: [],
  codeRoots: [],
  instructionFiles: [],
  commands: [],
  ciPaths: [],
  generatedSourcePaths: [],
  authorityConflicts: [],
  memoryRoleGaps: [],
});

const buildAnalysis = (
  workspaceRoot: string,
): SkoposAdoptionReviewedAnalysisArtifact => ({
  schemaVersion: 1,
  id: 'adoption-reviewed-analysis',
  type: 'adoption-reviewed-analysis',
  status: 'draft',
  authority: 'supporting',
  summary: 'One material question remains.',
  updatedAt: '2026-07-29T00:00:00.000Z',
  generatedAt: '2026-07-29T00:00:00.000Z',
  workspaceRoot,
  intakeDigest: 'intake-digest',
  adoptionState: 'questions-open',
  reviewedByActorId: 'reviewer',
  reviewedAt: '2026-07-29T00:00:00.000Z',
  claims: [],
  materialQuestions: [
    {
      id: 'question-authority',
      question: 'Which architecture document is authoritative?',
      whyItMatters: 'The answer controls which source can be archived.',
      evidencePaths: ['README.md'],
      material: true,
      recommendedOptionId: 'keep-current',
      options: [
        {
          id: 'keep-current',
          label: 'Keep current authority',
          rationale: 'It is the source currently linked by project instructions.',
        },
        {
          id: 'promote-alternative',
          label: 'Promote alternative',
          rationale: 'Choose this only if project evidence establishes newer truth.',
        },
      ],
      whatHappensAfterAnswer: 'The reviewed analysis can be refreshed.',
    },
  ],
  documentDispositions: [],
});

const buildProposal = (
  workspaceRoot: string,
): SkoposAdoptionRestructuringProposalArtifact => ({
  schemaVersion: 1,
  id: 'adoption-restructuring-proposal',
  type: 'adoption-restructuring-proposal',
  status: 'draft',
  authority: 'supporting',
  summary: 'Approval-required restructuring proposal.',
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
      id: 'archive-old-doc',
      operation: 'archive',
      sourcePaths: ['README.md'],
      targetPaths: ['docs/archive/README.md'],
      rationale: 'Move historical content out of the active route.',
      retainedTruth: 'The original content remains in the archive.',
      informationLossRisk: 'material',
      linkImpact: ['AGENTS.md'],
      authorityImpact: 'The archive becomes historical, not canonical.',
    },
  ],
  targetTree: ['docs/archive/README.md'],
  linkImpact: [{ operationId: 'archive-old-doc', references: ['AGENTS.md'] }],
  authorityImpact: [
    {
      operationId: 'archive-old-doc',
      summary: 'The archive becomes historical, not canonical.',
    },
  ],
  informationLossRisks: [
    {
      operationId: 'archive-old-doc',
      risk: 'material',
      retainedTruth: 'The original content remains in the archive.',
    },
  ],
});
