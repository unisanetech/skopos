import { mkdtemp, mkdir, open, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

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

import { syncLatestCodexDiscussionJournal } from '../../../runtime/src/application/shared/codex-session-import.js';

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

describe('Codex session discussion import', () => {
  it('skips a very large nonmatching log before parsing the newest exact-session match', async () => {
    const fixture = await createCodexImportFixture();
    const largeNonmatchingPath = join(
      fixture.codexHome,
      'sessions/2026/08/09/rollout-2026-08-09T04-00-00-nonmatching.jsonl',
    );
    await writeSparseCodexSession({
      path: largeNonmatchingPath,
      sessionId: 'nonmatching-session',
      cwd: join(fixture.root, 'unrelated-repository'),
    });
    await writeCodexSession({
      path: join(
        fixture.codexHome,
        'sessions/2026/08/09/rollout-2026-08-09T03-00-00-newest-match.jsonl',
      ),
      sessionId: 'newest-matching-session',
      cwd: fixture.workspaceRoot,
      messages: [
        codexMessage('2026-08-09T03:00:01.000Z', 'user', 'Continue the exact Task.'),
        codexMessage('2026-08-09T03:00:02.000Z', 'assistant', 'Continuing now.'),
      ],
    });
    await writeCodexSession({
      path: join(
        fixture.codexHome,
        'sessions/2026/08/09/rollout-2026-08-09T02-00-00-older-match.jsonl',
      ),
      sessionId: 'older-matching-session',
      cwd: fixture.workspaceRoot,
      messages: [codexMessage('2026-08-09T02:00:01.000Z', 'user', 'Older context.')],
    });

    const startedAt = Date.now();
    const result = await syncLatestCodexDiscussionJournal({
      workspaceRoot: fixture.workspaceRoot,
      codexHome: fixture.codexHome,
      dryRun: true,
    });
    const elapsedMilliseconds = Date.now() - startedAt;

    expect((await stat(largeNonmatchingPath)).size).toBe(LARGE_NONMATCHING_LOG_BYTES);
    expect(result).toMatchObject({
      matchMode: 'exact-session',
      sourceSessionId: 'newest-matching-session',
      importedTurnCount: 2,
      totalJournalTurnCount: 2,
      journalWrite: 'dry-run',
    });
    expect(elapsedMilliseconds).toBeLessThan(5_000);
  });

  it('completes a no-match scan without reading a very large message body', async () => {
    const fixture = await createCodexImportFixture();
    const largeNonmatchingPath = join(
      fixture.codexHome,
      'sessions/2026/08/09/rollout-2026-08-09T05-00-00-no-match.jsonl',
    );
    await writeSparseCodexSession({
      path: largeNonmatchingPath,
      sessionId: 'no-match-session',
      cwd: join(fixture.root, 'another-repository'),
    });

    const startedAt = Date.now();
    const result = await syncLatestCodexDiscussionJournal({
      workspaceRoot: fixture.workspaceRoot,
      codexHome: fixture.codexHome,
      dryRun: true,
    });
    const elapsedMilliseconds = Date.now() - startedAt;

    expect((await stat(largeNonmatchingPath)).size).toBe(LARGE_NONMATCHING_LOG_BYTES);
    expect(result).toMatchObject({
      importedTurnCount: 0,
      totalJournalTurnCount: 0,
      journalWrite: 'skipped',
    });
    expect(result.sourceSessionId).toBeUndefined();
    expect(elapsedMilliseconds).toBeLessThan(5_000);
  });

  it('preserves segmented-parent-session filtering for the selected match', async () => {
    const fixture = await createCodexImportFixture();
    const parentRoot = dirname(fixture.workspaceRoot);
    await writeCodexSession({
      path: join(
        fixture.codexHome,
        'sessions/2026/08/09/rollout-2026-08-09T06-00-00-segmented.jsonl',
      ),
      sessionId: 'segmented-parent-session',
      cwd: parentRoot,
      messages: [
        codexMessage('2026-08-09T06:00:01.000Z', 'user', 'Work in a sibling repository.'),
        codexMessage('2026-08-09T06:00:02.000Z', 'assistant', 'Sibling work complete.'),
        codexMessage(
          '2026-08-09T06:00:03.000Z',
          'user',
          `Now continue in ${fixture.workspaceRoot}.`,
        ),
        codexMessage('2026-08-09T06:00:04.000Z', 'assistant', 'Workspace work resumed.'),
      ],
    });

    const result = await syncLatestCodexDiscussionJournal({
      workspaceRoot: fixture.workspaceRoot,
      codexHome: fixture.codexHome,
      dryRun: true,
    });

    expect(result).toMatchObject({
      matchMode: 'segmented-parent-session',
      sourceSessionId: 'segmented-parent-session',
      importedTurnCount: 2,
      totalJournalTurnCount: 2,
      journalWrite: 'dry-run',
    });
  });
});

const LARGE_NONMATCHING_LOG_BYTES = 512 * 1024 * 1024;

const createCodexImportFixture = async (): Promise<{
  root: string;
  workspaceRoot: string;
  codexHome: string;
}> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-codex-import-'));
  temporaryRoots.push(root);
  const workspaceRoot = join(root, 'workspace');
  const codexHome = join(root, 'codex-home');
  await Promise.all([
    mkdir(workspaceRoot, { recursive: true }),
    mkdir(join(codexHome, 'sessions'), { recursive: true }),
  ]);
  return { root, workspaceRoot, codexHome };
};

const writeSparseCodexSession = async ({
  path,
  sessionId,
  cwd,
}: {
  path: string;
  sessionId: string;
  cwd: string;
}): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  const file = await open(path, 'w');
  try {
    await file.writeFile(`${JSON.stringify(codexSessionMeta(sessionId, cwd))}\n`, 'utf8');
    await file.truncate(LARGE_NONMATCHING_LOG_BYTES);
  } finally {
    await file.close();
  }
};

const writeCodexSession = async ({
  path,
  sessionId,
  cwd,
  messages,
}: {
  path: string;
  sessionId: string;
  cwd: string;
  messages: unknown[];
}): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(
    path,
    [codexSessionMeta(sessionId, cwd), ...messages]
      .map((entry) => JSON.stringify(entry))
      .join('\n')
      .concat('\n'),
    'utf8',
  );
};

const codexSessionMeta = (sessionId: string, cwd: string): unknown => ({
  timestamp: '2026-08-09T00:00:00.000Z',
  type: 'session_meta',
  payload: { id: sessionId, cwd },
});

const codexMessage = (
  timestamp: string,
  role: 'user' | 'assistant',
  text: string,
): unknown => ({
  timestamp,
  type: 'response_item',
  payload: {
    type: 'message',
    role,
    content: [{ type: role === 'user' ? 'input_text' : 'output_text', text }],
  },
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
