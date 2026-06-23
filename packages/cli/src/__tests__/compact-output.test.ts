import { describe, expect, it } from 'vitest';

import type {
  SkoposDoneReport,
  SkoposEvalRunResult,
  SkoposProgramNextRunResult,
  SkoposProgramSyncRunResult,
} from '@skopos/model';

import {
  buildCompactDoneLines,
  buildCompactDoneOutput,
  buildCompactEvalLines,
  buildCompactEvalOutput,
  buildCompactProgramNextLines,
  buildCompactProgramNextOutput,
  buildCompactProgramSyncLines,
  buildCompactProgramSyncOutput,
  buildCompactTrustLines,
  buildCompactTrustOutput,
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

    expect(buildCompactTrustOutput(report)).toEqual({
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
    });

    expect(buildCompactTrustLines(report)).toEqual([
      'Skopos trust',
      '- trust: medium / needs-review',
      '- summary: One warning remains.',
      '- checks: 1 pass, 1 warn, 0 fail',
      '- attention:',
      '  - [warn] mirror: Instruction mirror drift.',
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
      '- closure: needs-review',
      '- summary: A workflow still needs to run.',
      '- trust: high / agent-ready',
      '- checks: 1 pass, 1 warn, 0 fail',
      '- required actions: 1',
      '- attention:',
      '  - [warn] workflow-eval: Eval artifact missing.',
      '- next action: Run skopos eval before closure.',
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
        items: [],
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
      nextCommand: 'skopos done --mission mission-1',
    });

    expect(buildCompactEvalLines(result)).toEqual([
      'Skopos eval',
      '- mission: mission-1',
      '- status: needs-review',
      '- summary: Evaluation still needs proof.',
      '- checks: 1 pass, 1 fail, 0 skipped',
      '- proof: fail',
      '- trust: high / agent-ready',
      '- failing checks:',
      '  - pnpm proof: Proof comparison regressed.',
      '- next: skopos done --mission mission-1',
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
      '- summary: Current mission should continue.',
      '- items: 1',
      '- open obligations: 1',
      '- do now: Compact transport',
      '- do next: Token-control gap',
      '- next: skopos next /workspace --mission mission-1',
    ]);

    expect(buildCompactProgramNextLines(next)).toEqual([
      'Skopos program next',
      '- disposition: continue-current',
      '- summary: Current mission should continue.',
      '- current mission: mission-1',
      '- recommended item: Compact transport',
      '- open obligations: 1',
      '- next: skopos next /workspace --mission mission-1',
    ]);
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
