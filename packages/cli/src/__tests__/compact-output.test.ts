import { describe, expect, it } from 'vitest';

import type {
  SkoposDoneReport,
  SkoposEvalRunResult,
  SkoposNextRunResult,
  SkoposProgramNextRunResult,
  SkoposProgramSyncRunResult,
} from '@skopos/model';

import {
  buildCompactDoneLines,
  buildCompactDoneOutput,
  buildCompactEvalLines,
  buildCompactEvalOutput,
  buildCompactNextLines,
  buildCompactProgramNextLines,
  buildCompactProgramNextOutput,
  buildCompactProgramSyncLines,
  buildCompactProgramSyncOutput,
  buildCompactTransportBudget,
  buildCompactTrustLines,
  buildCompactTrustOutput,
  buildGuidedDecisionQuestionLines,
  buildGuidedWorkflowQuestionLines,
} from '../cli/shared/compact-output.js';
import { buildSummaryLines, parseFieldList, projectJsonOutput } from '../cli/shared/output.js';

describe('compact output projections', () => {
  it('collapses trust output into counts and attention checks', () => {
    const report = {
      workspaceRoot: '/workspace',
      actorId: 'agent-core',
      trustLevel: 'medium',
      readiness: 'needs-review',
      summary: 'One warning remains.',
      checks: [
        { id: 'docs', status: 'pass', summary: 'Docs aligned.' },
        { id: 'mirror', status: 'warn', summary: 'Instruction mirror drift.' },
      ],
      unresolvedAssumptions: ['Assume docs sync is still pending.'],
      findings: ['F-1'],
      detected: {
        repoMode: 'monorepo',
        packageCount: 2,
        docsRoots: ['docs'],
        instructionFiles: ['AGENTS.md'],
        packageManager: 'pnpm',
      },
    } as const;

    expect(buildCompactTrustOutput(report)).toMatchObject({
      workspaceRoot: '/workspace',
      actorId: 'agent-core',
      trustLevel: 'medium',
      readiness: 'needs-review',
      summary: 'One warning remains.',
      checkCounts: { pass: 1, warn: 1, fail: 0 },
      attentionChecks: [
        {
          id: 'mirror',
          status: 'warn',
          summary: 'Instruction mirror drift.',
        },
      ],
      unresolvedAssumptions: ['Assume docs sync is still pending.'],
      findings: ['F-1'],
      transportBudget: {
        surfaceKind: 'compact-command-response',
        title: 'Skopos trust compact output',
        status: 'within-budget',
      },
    });

    expect(buildCompactTrustLines(report)).toEqual([
      'Skopos trust',
      'Status: Review needed',
      'Summary: One warning remains.',
      'Checks: 1 pass, 1 review, 0 fix',
      'Attention:',
      '- Review this: mirror - Instruction mirror drift.',
      'Next step:',
      'Review `mirror`, then run `skopos trust` again before closing the work.',
    ]);

    expect(projectJsonOutput(buildCompactTrustOutput(report), { summary: true })).toEqual({
      summary: 'One warning remains.',
    });
    expect(
      projectJsonOutput(buildCompactTrustOutput(report), {
        fields: ['summary', 'checkCounts.warn', 'attentionChecks'],
      }),
    ).toEqual({
      summary: 'One warning remains.',
      checkCounts: {
        warn: 1,
      },
      attentionChecks: [
        {
          id: 'mirror',
          status: 'warn',
          summary: 'Instruction mirror drift.',
        },
      ],
    });
    expect(buildSummaryLines(buildCompactTrustOutput(report))).toEqual(['One warning remains.']);
  });

  it('projects done output to closure, actions, and failing workflow evidence', () => {
    const report = {
      workspaceRoot: '/workspace',
      closureStatus: 'needs-review',
      summary: 'A workflow still needs to run.',
      checks: [
        { id: 'trust', status: 'pass', summary: 'Trust is high.' },
        { id: 'workflow-eval', status: 'warn', summary: 'Eval artifact missing.' },
      ],
      requiredActions: ['Run skopos eval before closure.'],
      impact: {
        workspaceRoot: '/workspace',
        changedPathSource: 'explicit',
        changedPaths: ['packages/cli/src/cli/commands/trust.ts'],
        changed: [],
        affectedScopes: [{ id: 'scope:@skopos/cli', title: '@skopos/cli', kind: 'package', path: 'packages/cli' }],
        requiredActions: ['Run skopos eval before closure.'],
        recommendedChecks: [],
        requiredWorkflows: [
          {
            id: 'quality.run-proof-phase',
            title: 'Run proof',
            category: 'quality-check',
            safety: 'mutating',
            sourcePath: 'workflows/proof.yaml',
            reason: 'Closure requires proof.',
            matchedPaths: [],
            outputPaths: [],
            requiredForDone: true,
            requiresApproval: false,
          },
        ],
        warnings: [],
        instructionMirrorIssues: [],
        summary: 'One package source changed.',
      },
      trust: {
        workspaceRoot: '/workspace',
        trustLevel: 'high',
        readiness: 'agent-ready',
        summary: 'Workspace is healthy.',
        checks: [],
        unresolvedAssumptions: [],
        findings: [],
        detected: {
          repoMode: 'monorepo',
          packageCount: 2,
          docsRoots: ['docs'],
          instructionFiles: ['AGENTS.md'],
          packageManager: 'pnpm',
        },
      },
      missionEvidence: {
        mission: {
          id: 'mission-1',
          title: 'Compact transport',
          state: 'active',
        },
        pendingItemIds: ['step-run-eval'],
        claimedByActorId: 'agent-core',
      },
      workflowQuestions: {
        openQuestionIds: [],
        blockingQuestionIds: [],
        advisoryQuestionIds: ['plan.scope-confirmation'],
      },
      missionEval: {
        missionId: 'mission-1',
        evaluationStatus: 'needs-review',
        blockingQuestionIds: [],
        pendingItemIds: ['step-run-eval'],
      },
      workflowEvidence: [
        {
          id: 'quality.run-proof-phase',
          title: 'Run proof',
          category: 'quality-check',
          safety: 'mutating',
          sourcePath: 'workflows/proof.yaml',
          reason: 'Closure requires proof.',
          matchedPaths: [],
          outputPaths: [],
          requiredForDone: true,
          requiresApproval: false,
          status: 'fail',
          summary: 'Proof has not been rerun.',
        },
      ],
    } as SkoposDoneReport;

    expect(buildCompactDoneOutput(report)).toMatchObject({
      closureStatus: 'needs-review',
      checkCounts: { pass: 1, warn: 1, fail: 0 },
      requiredActions: ['Run skopos eval before closure.'],
      mission: {
        id: 'mission-1',
        state: 'active',
        pendingItemIds: ['step-run-eval'],
      },
      failedWorkflowEvidence: [{ id: 'quality.run-proof-phase', summary: 'Proof has not been rerun.' }],
    });

    expect(buildCompactDoneLines(report)).toEqual([
      'Skopos done',
      'Status: Review needed',
      'Summary: A workflow still needs to run.',
      'Trust: high / agent-ready',
      'Checks: 1 pass, 1 review, 0 fix',
      'Required actions: 1',
      'Progress: 1 mission checklist item still pending.',
      'Attention:',
      '- Review this: workflow-eval - Eval artifact missing.',
      'Next step:',
      'Run skopos eval before closure.',
    ]);
  });

  it('projects eval output to counts, proof summary, and next command', () => {
    const result = {
      workspaceRoot: '/workspace',
      actorId: 'agent-core',
      summary: 'Evaluation still needs proof.',
      missionId: 'mission-1',
      missionPath: '/workspace/.skopos/missions/mission-1.json',
      missionWrite: 'written',
      mission: {
        id: 'mission-1',
        planId: 'plan-1',
        title: 'Compact transport',
        goal: 'ship compact transport',
        state: 'active',
        scope: { id: 'scope:@skopos/cli', title: '@skopos/cli', kind: 'package', path: 'packages/cli' },
        coordination: { lastUpdatedAt: '2026-04-12T00:00:00.000Z' },
        items: [
          {
            id: 'step-update-output',
            kind: 'implementation',
            title: 'Update command output',
            detail: 'Make command output easier to read.',
            status: 'complete',
          },
          {
            id: 'step-run-proof',
            kind: 'validation',
            title: 'Run proof checks',
            detail: 'Verify the command output contract.',
            status: 'pending',
          },
        ],
        blockers: [],
        recommendedChecks: [],
        recommendedWorkflows: [],
      },
      evalPath: '/workspace/.skopos/evals/mission-1.json',
      evalWrite: 'written',
      eval: {
        kind: 'eval',
        schemaVersion: 1,
        generatedAt: '2026-04-12T00:00:00.000Z',
        workspaceRoot: '/workspace',
        actorId: 'agent-core',
        missionId: 'mission-1',
        missionTitle: 'Compact transport',
        missionPath: '/workspace/.skopos/missions/mission-1.json',
        planId: 'plan-1',
        codeAllowed: true,
        evaluationStatus: 'needs-review',
        blockingQuestionIds: [],
        pendingItemIds: ['step-run-proof'],
        checkRuns: [
          {
            command: 'pnpm typecheck',
            status: 'pass',
            summary: 'Typecheck passed.',
            exitCode: 0,
          },
          {
            command: 'pnpm proof',
            status: 'fail',
            summary: 'Proof comparison regressed.',
            exitCode: 1,
          },
        ],
        workflowEvidence: [
          {
            id: 'quality.run-proof-phase',
            title: 'Run proof',
            category: 'quality-check',
            safety: 'mutating',
            sourcePath: 'workflows/proof.yaml',
            reason: 'Closure requires proof.',
            matchedPaths: [],
            outputPaths: [],
            requiredForDone: true,
            requiresApproval: false,
            status: 'fail',
            summary: 'Proof workflow is stale.',
          },
        ],
        proof: {
          path: '/workspace/.skopos/proof/latest-report.json',
          status: 'fail',
          summary: 'Scorecard regressed.',
          weightedPassRate: 0.75,
          regressedBenchmarkCount: 2,
        },
        trust: {
          trustLevel: 'high',
          readiness: 'agent-ready',
          summary: 'Trust is high.',
          checks: [],
        },
      },
      questionsPath: '/workspace/.skopos/questions.json',
      questions: { kind: 'questions', schemaVersion: 1, generatedAt: '2026-04-12T00:00:00.000Z', workspaceRoot: '/workspace', entries: [] },
      blockingQuestions: [],
      recommendationsPath: '/workspace/.skopos/recommendations.json',
      recommendationsWrite: 'written',
      executionSurface: {
        kind: 'artifact-only',
        summary: 'Artifacts are sufficient.',
        reason: 'Scope is narrow.',
        signals: [],
      },
      recommendations: {
        kind: 'recommendations',
        schemaVersion: 1,
        generatedAt: '2026-04-12T00:00:00.000Z',
        workspaceRoot: '/workspace',
        executionSurface: {
          kind: 'artifact-only',
          summary: 'Artifacts are sufficient.',
          reason: 'Scope is narrow.',
          signals: [],
        },
        entries: [],
      },
      nextCommand: 'skopos done --mission mission-1',
    } as SkoposEvalRunResult;

    expect(buildCompactEvalOutput(result)).toMatchObject({
      missionId: 'mission-1',
      evaluationStatus: 'needs-review',
      executionSurface: 'artifact-only',
      checkCounts: { pass: 1, fail: 1, skipped: 0 },
      failedChecks: [{ command: 'pnpm proof', summary: 'Proof comparison regressed.' }],
      workflowFailures: [{ id: 'quality.run-proof-phase', summary: 'Proof workflow is stale.' }],
      proof: { status: 'fail', weightedPassRate: 0.75, regressedBenchmarkCount: 2 },
      progress: {
        total: 2,
        completed: 1,
        pending: 1,
        percent: 50,
        phase: 'verification',
        completedItemTitles: ['Update command output'],
        pendingItemTitles: ['Run proof checks'],
      },
      nextCommand: 'skopos done --mission mission-1',
    });

    expect(buildCompactEvalLines(result)).toEqual([
      'Skopos eval',
      'Status: Review needed',
      'Mission: mission-1',
      'Summary: Evaluation still needs proof.',
      'Checks: 1 pass, 1 fix, 0 skipped',
      'Proof: fail',
      'Trust: high / agent-ready',
      'Progress: 1 of 2 checklist items complete (about 50%).',
      'Current phase: verification',
      'Done: Update command output',
      'Doing now: Run proof checks',
      'Decisions: No decision items are tracked for this mission.',
      'Findings: No active findings or follow-up slices are linked here.',
      'Blockers: None.',
      'Proof needed: skopos done --mission mission-1',
      'Attention:',
      '- Fix before closing: pnpm proof - Proof comparison regressed.',
      'Next step:',
      'skopos done --mission mission-1',
    ]);
  });

  it('projects next output to current item, status, and next step', () => {
    const result = {
      workspaceRoot: '/workspace',
      actorId: 'agent-core',
      summary: 'Continue the current mission.',
      codeAllowed: true,
      missionId: 'mission-1',
      missionPath: '/workspace/.skopos/missions/mission-1.json',
      mission: {
        id: 'mission-1',
        planId: 'plan-1',
        title: 'Human output',
        goal: 'make output readable',
        state: 'active',
        scope: { id: 'scope:@skopos/cli', title: '@skopos/cli', kind: 'package', path: 'packages/cli' },
        coordination: { lastUpdatedAt: '2026-06-24T00:00:00.000Z' },
        items: [
          {
            id: 'item-0',
            kind: 'implementation',
            title: 'Plan output contract',
            detail: 'Decide what should be shown first.',
            status: 'complete',
          },
          {
            id: 'item-1',
            kind: 'implementation',
            title: 'Update command output',
            detail: 'Make the next command human-readable.',
            status: 'pending',
          },
        ],
        blockers: [],
        recommendedChecks: [],
        recommendedWorkflows: [],
      },
      questionsPath: '/workspace/.skopos/questions.json',
      questions: { kind: 'questions', schemaVersion: 1, generatedAt: '2026-06-24T00:00:00.000Z', workspaceRoot: '/workspace', entries: [] },
      blockingQuestions: [],
      recommendationsPath: '/workspace/.skopos/recommendations.json',
      recommendationsWrite: 'written',
      executionSurface: {
        kind: 'artifact-only',
        summary: 'Use mission artifacts.',
        reason: 'Scope is bounded.',
        signals: [],
      },
      recommendations: {
        kind: 'recommendations',
        schemaVersion: 1,
        generatedAt: '2026-06-24T00:00:00.000Z',
        workspaceRoot: '/workspace',
        executionSurface: {
          kind: 'artifact-only',
          summary: 'Use mission artifacts.',
          reason: 'Scope is bounded.',
          signals: [],
        },
        entries: [],
      },
      nextCommand: 'skopos eval --mission mission-1',
      nextItem: {
        id: 'item-1',
        title: 'Update command output',
        detail: 'Make the next command human-readable.',
        status: 'todo',
      },
      pendingItems: [],
      trust: {
        trustLevel: 'high',
        readiness: 'agent-ready',
        summary: 'Trust is high.',
        checks: [],
      },
    } as SkoposNextRunResult;

    expect(buildCompactNextLines(result)).toEqual([
      'Skopos next',
      'Status: Ready for next action',
      'Mission: mission-1',
      'Summary: Continue the current mission.',
      'Code allowed: yes',
      'Trust: high / agent-ready',
      'Progress: 1 of 2 checklist items complete (about 50%).',
      'Current phase: implementation',
      'Done: Plan output contract',
      'Doing now: Update command output',
      'Decisions: No decision items are tracked for this mission.',
      'Findings: No active findings or follow-up slices are linked here.',
      'Blockers: None.',
      'Proof needed: skopos eval --mission mission-1',
      'Current item:',
      '- Update command output: Make the next command human-readable.',
      'Next step:',
      'skopos eval --mission mission-1',
    ]);
  });

  it('projects program state to low-noise queue summaries', () => {
    const sync = {
      workspaceRoot: '/workspace',
      actorId: 'agent-core',
      summary: 'Current mission should continue.',
      statePath: '/workspace/.skopos/program/state.json',
      stateWrite: 'written',
      currentMissionId: 'mission-1',
      state: {
        kind: 'program-state',
        schemaVersion: 1,
        generatedAt: '2026-04-12T00:00:00.000Z',
        workspaceRoot: '/workspace',
        items: [
          {
            id: 'program-item.mission.mission-1',
            title: 'Compact transport',
            summary: 'Land compact command output.',
            sourceKind: 'mission',
            sourceRef: 'mission-1',
            scope: { id: 'scope:@skopos/cli', title: '@skopos/cli', kind: 'package', path: 'packages/cli' },
            status: 'active',
            priority: 'high',
            whyNow: 'This is the do-now item.',
            dependencies: [],
            interruptsCurrentMission: false,
            recommendedDisposition: 'do-now',
            obligationIds: ['obligation-ui-1'],
          },
        ],
        sequence: {
          currentActiveItemId: 'program-item.mission.mission-1',
          doNow: 'program-item.mission.mission-1',
          doNext: 'program-item.finding.F-1',
          deferred: [],
          interruptRecommendation: {
            decision: 'continue-current',
            summary: 'Stay on the current mission.',
            reason: 'No stronger blocker exists.',
          },
          openProgramQuestions: [],
        },
        obligations: [
          {
            id: 'obligation-ui-1',
            kind: 'ui',
            title: 'Update mission detail',
            reason: 'Workflow state must surface in UI.',
            targetRef: 'route:mission-detail',
            linkedItemId: 'program-item.mission.mission-1',
            status: 'open',
          },
        ],
        attention: {
          title: 'One active mission.',
          summary: 'Low-noise queue.',
          openItemCount: 1,
          openObligationCount: 1,
          interruptingItemCount: 0,
        },
        sourcesDigest: {
          activeFindingCount: 1,
          activeMissionCount: 1,
          promotedCheckpointCount: 0,
          workflowQuestionCount: 0,
          workflowRecommendationCount: 1,
          trustLevel: 'high',
          readiness: 'agent-ready',
        },
      },
      doNowItem: {
        id: 'program-item.mission.mission-1',
        title: 'Compact transport',
        summary: 'Land compact command output.',
        sourceKind: 'mission',
        sourceRef: 'mission-1',
        scope: { id: 'scope:@skopos/cli', title: '@skopos/cli', kind: 'package', path: 'packages/cli' },
        status: 'active',
        priority: 'high',
        whyNow: 'This is the do-now item.',
        dependencies: [],
        interruptsCurrentMission: false,
        recommendedDisposition: 'do-now',
        obligationIds: ['obligation-ui-1'],
      },
      doNextItem: {
        id: 'program-item.finding.F-1',
        title: 'Token-control gap',
        summary: 'Add compact transport.',
        sourceKind: 'finding',
        sourceRef: 'F-1',
        scope: { id: 'scope:workspace', title: 'workspace', kind: 'workspace', path: '.' },
        status: 'ready',
        priority: 'medium',
        whyNow: 'Queued next.',
        dependencies: [],
        interruptsCurrentMission: false,
        recommendedDisposition: 'do-next',
        obligationIds: [],
      },
      recommendedAction: {
        kind: 'continue-current-mission',
        title: 'Continue current mission',
        summary: 'The current mission is still the do-now item.',
        command: 'skopos next /workspace --mission mission-1',
        linkedItemId: 'program-item.mission.mission-1',
      },
      nextCommand: 'skopos next /workspace --mission mission-1',
    } as SkoposProgramSyncRunResult;

    const next = {
      ...sync,
      currentDisposition: 'continue-current',
      recommendedItem: sync.doNowItem,
      obligations: sync.state.obligations,
    } as SkoposProgramNextRunResult;

    expect(buildCompactProgramSyncOutput(sync)).toMatchObject({
      itemCount: 1,
      openObligationCount: 1,
      doNow: {
        id: 'program-item.mission.mission-1',
        title: 'Compact transport',
        priority: 'high',
        sourceKind: 'mission',
      },
      doNext: {
        id: 'program-item.finding.F-1',
        title: 'Token-control gap',
        priority: 'medium',
        sourceKind: 'finding',
      },
      nextCommand: 'skopos next /workspace --mission mission-1',
    });

    expect(buildCompactProgramNextOutput(next)).toMatchObject({
      currentDisposition: 'continue-current',
      currentMissionId: 'mission-1',
      recommendedItem: {
        id: 'program-item.mission.mission-1',
        title: 'Compact transport',
        recommendedDisposition: 'do-now',
      },
      openObligationCount: 1,
      interruptRecommendation: {
        decision: 'continue-current',
        summary: 'Stay on the current mission.',
      },
      nextCommand: 'skopos next /workspace --mission mission-1',
    });

    expect(buildCompactProgramSyncLines(sync)).toEqual([
      'Skopos program sync',
      'Status: Program state refreshed',
      'Summary: Current mission should continue.',
      'Items: 1',
      'Findings: 0 active finding items',
      'Open obligations: 1',
      'Do now: Compact transport',
      'Do next: Token-control gap',
      'Next step:',
      'skopos next /workspace --mission mission-1',
    ]);

    expect(buildCompactProgramNextLines(next)).toEqual([
      'Skopos program next',
      'Status: Ready for next action',
      'Summary: Current mission should continue.',
      'Current mission: mission-1',
      'Recommended item: Compact transport',
      'Findings: 0 active finding items',
      'Open obligations: 1',
      'Next step:',
      'skopos next /workspace --mission mission-1',
    ]);
  });

  it('formats decision and workflow questions with clear guidance', () => {
    expect(
      buildGuidedDecisionQuestionLines([
        {
          id: 'plan.public-api-change',
          category: 'architecture',
          escalation: 'must-ask',
          question: 'Should this change alter the public API?',
          whyItMatters: 'Public API changes can break users and need a clear migration path.',
          recommendedOptionId: 'keep-compatible',
          options: [
            {
              id: 'keep-compatible',
              label: 'Keep it compatible',
              rationale: 'Use the existing public contract and avoid a breaking release.',
            },
            {
              id: 'break-api',
              label: 'Allow a breaking change',
              rationale: 'Only use this when the product owner accepts migration work.',
            },
          ],
        },
      ]),
    ).toEqual([
      'Questions:',
      'Question: Should this change alter the public API?',
      'Recommended: Keep it compatible',
      'Why this matters: Public API changes can break users and need a clear migration path.',
      'Options:',
      '- Keep it compatible (recommended): Use the existing public contract and avoid a breaking release.',
      '- Allow a breaking change: Only use this when the product owner accepts migration work.',
    ]);

    expect(
      buildGuidedWorkflowQuestionLines([
        {
          id: 'plan.vendor-choice',
          title: 'Choose vendor',
          question: 'Which vendor should this integration use?',
          category: 'stack',
          escalation: 'recommend-and-ask',
          blocking: true,
          recommendedOptionId: 'existing-vendor',
          options: [
            {
              id: 'existing-vendor',
              label: 'Use the existing vendor',
              rationale: 'This keeps operations simple and avoids extra credentials.',
            },
            {
              id: 'new-vendor',
              label: 'Add a new vendor',
              rationale: 'This is useful only if the existing vendor cannot meet the requirement.',
            },
          ],
          whyItMatters: 'Vendor choices affect setup, cost, secrets, and support.',
          whatHappensAfterAnswer: 'Skopos updates the mission and tells the agent whether code can start.',
          linkedPlanId: 'plan-1',
          linkedMissionId: 'mission-1',
          evidenceRefs: [],
          status: 'open',
        },
      ]),
    ).toEqual([
      'Questions:',
      'Question: Which vendor should this integration use?',
      'Recommended: Use the existing vendor',
      'Why this matters: Vendor choices affect setup, cost, secrets, and support.',
      'Options:',
      '- Use the existing vendor (recommended): This keeps operations simple and avoids extra credentials.',
      '- Add a new vendor: This is useful only if the existing vendor cannot meet the requirement.',
      'After you answer: Skopos updates the mission and tells the agent whether code can start.',
    ]);
  });

  it('reports compact transport budget pressure without hiding the response', () => {
    expect(
      buildCompactTransportBudget({
        title: 'Large compact response',
        surfaceKind: 'compact-command-response',
        value: { payload: 'x'.repeat(120) },
        budgetTokens: 10,
      }),
    ).toEqual({
      surfaceKind: 'compact-command-response',
      title: 'Large compact response',
      estimatedTokens: 34,
      budgetTokens: 10,
      status: 'over-budget',
      summary:
        'Large compact response is over the compact response budget. Ask for specific fields or summary output before loading it into agent context.',
    });
  });

  it('parses field lists and rejects unknown field paths', () => {
    expect(parseFieldList('summary, trust.readiness , nextCommand')).toEqual([
      'summary',
      'trust.readiness',
      'nextCommand',
    ]);

    expect(() =>
      projectJsonOutput(
        {
          summary: 'Compact result',
          trust: {
            readiness: 'agent-ready',
          },
        },
        {
          fields: ['trust.missing'],
        },
      ),
    ).toThrow('Unknown output field: trust.missing');
  });
});
