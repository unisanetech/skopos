import type {
  SkoposMissionArtifact,
  SkoposProjectProviderDescription,
  SkoposResolvedGatesArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposWorkflowManifest,
  SkoposWorkflowQuestionArtifact,
} from '@skopos/model';
import {
  buildSkoposCompactTaskBrief,
  compileSkoposAgentNativeOperatingModel,
  evaluateSkoposKnowledgePromotion,
  mergeSkoposProjectProviderDescription,
  parseSkoposStructuredCommand,
  selectSkoposEvalCheckCommands,
  selectSkoposEvalWorkflowIds,
  validateSkoposProjectProviderBrief,
  validateSkoposProjectProviderDescription,
  validateSkoposProjectProviderVerification,
} from '../../../runtime/src/application/agent-native/agent-native-operating-model.service.js';
import { describe, expect, it } from 'vitest';

describe('agent-native operating model', () => {
  it('compiles workflows, accepted policy, and gates into actions, context, and guards', () => {
    const model = compileSkoposAgentNativeOperatingModel({
      workflows: [workflow],
      policy,
      gates,
    });

    expect(model.actions).toEqual([
      expect.objectContaining({
        id: 'quality.focused',
        command: {
          executable: 'pnpm',
          arguments: ['test', '--filter', '@skopos/model'],
          cwd: '.',
        },
        approval: 'none',
        phases: ['iteration'],
      }),
    ]);
    expect(model.context).toEqual([
      expect.objectContaining({
        id: 'policy:gates.progressive-validation.changed-scope',
        importance: 'required',
        provenance: [
          expect.objectContaining({
            authority: 'accepted',
            sourceId: 'gates.progressive-validation@0.1.0',
          }),
        ],
      }),
    ]);
    expect(model.guards).toEqual([
      expect.objectContaining({
        id: 'gates.progressive-validation.gate.typecheck',
        enforcement: 'command',
        phases: ['closure'],
      }),
    ]);
    expect(model.diagnostics).toEqual([]);
  });

  it('rejects shell control syntax instead of projecting unrestricted shell actions', () => {
    expect(parseSkoposStructuredCommand('pnpm test | tee result.txt', '.')).toBeUndefined();

    const model = compileSkoposAgentNativeOperatingModel({
      workflows: [
        {
          ...workflow,
          command: 'pnpm test && pnpm build',
        },
      ],
    });

    expect(model.actions[0]).toEqual(
      expect.objectContaining({
        command: undefined,
        unavailableReason: expect.stringContaining('not a safely structured executable'),
      }),
    );
    expect(model.diagnostics).toContain(
      'Workflow quality.focused uses shell syntax that cannot be projected as a structured action.',
    );
  });

  it('builds a compact task brief without inventing missing acceptance criteria', () => {
    const operatingModel = compileSkoposAgentNativeOperatingModel({
      workflows: [workflow],
      policy,
      gates,
    });
    const brief = buildSkoposCompactTaskBrief({
      mission,
      questions,
      operatingModel,
      phase: 'iteration',
      riskLane: 'workpack',
    });

    expect(brief.task).toEqual(
      expect.objectContaining({
        goal: 'Add the agent-native operating model',
        acceptanceCriteria: [],
        missingFields: ['acceptanceCriteria', 'nonGoals', 'constraints'],
        openDecisions: [
          expect.objectContaining({
            id: 'plan.public-api-change',
            blocking: true,
          }),
        ],
      }),
    );
    expect(brief.context.entries[0]).toEqual(
      expect.objectContaining({
        id: 'task:mission-agent-native',
        kind: 'task',
      }),
    );
    expect(brief.actions.entries.map((action) => action.id)).toEqual(['quality.focused']);
    expect(brief.guards.entries).toEqual([]);
    expect(brief.diagnostics).toContain(
      'The current mission has no explicit acceptance criteria, non-goals, or constraints; record them before closure when they matter.',
    );
  });

  it('selects relevant negative knowledge without promoting inference', () => {
    const operatingModel = compileSkoposAgentNativeOperatingModel({
      memory: {
        schemaVersion: 1,
        id: 'memory-state',
        type: 'memory-state',
        status: 'generated',
        authority: 'generated',
        summary: 'Project memory.',
        workspaceRoot: '/workspace',
        trustLevel: 'high',
        readiness: 'agent-ready',
        freshness: 'fresh',
        roles: [],
        suggestions: [],
        layers: [],
        sourceProbes: [],
        acceptedDecisionSnapshots: [
          {
            id: 'legacy-verify',
            title: 'Legacy verify command is retired',
            kind: 'workflow',
            status: 'superseded',
            summary: 'Do not use legacy verify; closure owns final proof.',
            sourcePath:
              'docs/decisions/039-agent-native-single-control-plane-and-project-adoption-contract.md',
          },
        ],
        agentBriefPaths: [],
        policyArtifactPaths: [],
        stackArtifactPaths: [],
        staleReasons: [],
      },
    });
    const negativeMission = {
      ...mission,
      objective: 'Replace the retired legacy verify command in closure',
    };
    const brief = buildSkoposCompactTaskBrief({
      mission: negativeMission,
      questions,
      operatingModel,
      phase: 'iteration',
      riskLane: 'workpack',
    });

    expect(brief.context.entries).toContainEqual(
      expect.objectContaining({
        id: 'knowledge:decision:legacy-verify',
        kind: 'negative-knowledge',
      }),
    );

    const inferred = {
      id: 'inferred-command',
      kind: 'noncanonical-command' as const,
      title: 'Possible noncanonical command',
      summary: 'This command may not be canonical.',
      authority: 'inferred' as const,
      lifecycle: 'active' as const,
      appliesTo: ['commands'],
      provenance: [
        {
          authority: 'inferred' as const,
          sourceKind: 'project-memory' as const,
          sourceId: 'agent-summary',
        },
      ],
    };

    expect(
      evaluateSkoposKnowledgePromotion({
        entry: inferred,
        targetAuthority: 'accepted',
        requestedByActorId: 'codex',
        evidence: inferred.provenance,
      }),
    ).toEqual(
      expect.objectContaining({
        status: 'rejected',
        reason: 'project-evidence-required',
      }),
    );
    expect(
      evaluateSkoposKnowledgePromotion({
        entry: inferred,
        targetAuthority: 'accepted',
        requestedByActorId: 'codex',
        evidence: [
          {
            authority: 'accepted',
            sourceKind: 'acceptance',
            sourceId: 'SKOPOS-DECISION-039',
          },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        status: 'promoted',
        entry: expect.objectContaining({
          authority: 'accepted',
        }),
      }),
    );
  });

  it('selects changed-scope iteration checks, generator stabilization, and final closure once', () => {
    expect(
      selectSkoposEvalCheckCommands({
        executionPhase: 'iteration',
        missionChecks: ['pnpm typecheck', 'pnpm test', 'pnpm build'],
        changedScopeChecks: [
          'pnpm --filter @skopos/runtime check-types',
          'pnpm --filter @skopos/runtime test',
          'pnpm --filter @skopos/runtime build',
        ],
      }),
    ).toEqual([
      'pnpm --filter @skopos/runtime check-types',
      'pnpm --filter @skopos/runtime test',
    ]);
    expect(
      selectSkoposEvalCheckCommands({
        executionPhase: 'stabilization',
        missionChecks: ['pnpm typecheck', 'pnpm test', 'pnpm build'],
      }),
    ).toEqual([]);
    expect(
      selectSkoposEvalCheckCommands({
        executionPhase: 'closure',
        missionChecks: ['pnpm typecheck', 'pnpm test', 'pnpm build'],
      }),
    ).toEqual(['pnpm typecheck', 'pnpm test', 'pnpm build']);

    const generatorWorkflow: SkoposWorkflowManifest = {
      ...workflow,
      id: 'knowledge.refresh',
      category: 'maintenance',
      command: 'pnpm skopos:init',
    };
    const proofWorkflow: SkoposWorkflowManifest = {
      ...workflow,
      id: 'quality.proof',
      command: 'pnpm proof',
    };
    const workflows = [workflow, generatorWorkflow, proofWorkflow];
    const missionWorkflowIds = workflows.map((entry) => entry.id);

    expect(
      selectSkoposEvalWorkflowIds({
        executionPhase: 'iteration',
        missionWorkflowIds,
        workflows,
      }),
    ).toEqual(['quality.focused']);
    expect(
      selectSkoposEvalWorkflowIds({
        executionPhase: 'stabilization',
        missionWorkflowIds,
        workflows,
      }),
    ).toEqual(['knowledge.refresh']);
    expect(
      selectSkoposEvalWorkflowIds({
        executionPhase: 'closure',
        missionWorkflowIds,
        workflows,
      }),
    ).toEqual(missionWorkflowIds);
  });

  it('keeps provider contributions inside Skopos authority boundaries', () => {
    const description: SkoposProjectProviderDescription = {
      providerId: 'example.project',
      providerVersion: '1.0.0',
      protocolVersion: 1,
      title: 'Example project provider',
      summary: 'Contributes one project action.',
      methods: ['describe', 'brief', 'verify'],
      authorityBoundary: {
        workflowAuthority: 'skopos',
        taskStateAuthority: 'skopos',
        closureAuthority: 'skopos',
      },
      sourcePaths: ['tools/example-provider.mjs'],
      context: [],
      actions: [
        {
          ...compileSkoposAgentNativeOperatingModel({ workflows: [workflow] }).actions[0]!,
          id: 'example.project.verify',
          provenance: [
            {
              authority: 'declared',
              sourceKind: 'provider',
              sourceId: 'example.project@1.0.0',
              path: 'tools/example-provider.mjs',
            },
          ],
        },
      ],
      guards: [],
    };

    expect(validateSkoposProjectProviderDescription(description)).toEqual([]);
    expect(
      mergeSkoposProjectProviderDescription({
        operatingModel: compileSkoposAgentNativeOperatingModel({}),
        description,
      }).actions.map((action) => action.id),
    ).toEqual(['example.project.verify']);
    expect(
      validateSkoposProjectProviderBrief({
        description,
        brief: {
          requestId: 'request-1',
          method: 'brief',
          providerId: 'example.project',
          context: [],
          actions: [{ ...description.actions[0]!, id: 'undeclared.action' }],
          guards: [],
          diagnostics: [],
        },
      }),
    ).toContain('Provider brief returned undeclared action id undeclared.action.');
    expect(
      validateSkoposProjectProviderVerification({
        requestId: 'request-2',
        method: 'verify',
        providerId: 'example.project',
        phase: 'closure',
        evidence: [
          {
            id: 'project-check',
            kind: 'source-observation',
            status: 'pass',
            summary: 'Claims success without source-bound evidence.',
          },
        ],
        diagnostics: [],
      }),
    ).toContain('Provider evidence project-check has no command, path, or source digest.');

    const invalidBoundary = {
      ...description,
      authorityBoundary: {
        ...description.authorityBoundary,
        closureAuthority: 'provider',
      },
    } as unknown as SkoposProjectProviderDescription;
    expect(validateSkoposProjectProviderDescription(invalidBoundary)).toContain(
      'Provider example.project claims authority reserved for Skopos.',
    );
  });
});

const workflow: SkoposWorkflowManifest = {
  id: 'quality.focused',
  title: 'Run focused model tests',
  description: 'Run the focused model contract proof.',
  category: 'quality-check',
  scope: ['workspace'],
  command: 'pnpm test --filter "@skopos/model"',
  cwd: '.',
  inputs: ['packages/model'],
  outputs: [],
  affects: [],
  safety: 'read-only',
  requiresApproval: false,
  requiredForDone: false,
  recommendedAfter: ['typecheck'],
  owner: 'skopos-core',
  sourcePath: 'tools/skopos/workflows/quality-focused.yaml',
};

const policy: SkoposResolvedPolicyArtifact = {
  schemaVersion: 1,
  id: 'resolved-policy',
  type: 'resolved-policy',
  status: 'generated',
  authority: 'generated',
  summary: 'One accepted rule.',
  workspaceRoot: '/workspace',
  projectLifecycle: 'established-brownfield',
  defaultExecutionLane: 'normal',
  recommendedExecutionLanes: [],
  acceptedPacks: [
    {
      packId: 'gates.progressive-validation',
      version: '0.1.0',
      acceptedAt: '2026-07-25T00:00:00.000Z',
      reason: 'Accepted for proof.',
      source: 'manual',
    },
  ],
  overrides: [],
  activeRules: [
    {
      id: 'gates.progressive-validation.changed-scope',
      title: 'Changed scope has proof',
      severity: 'must',
      summary: 'Run focused proof for affected behavior.',
      appliesTo: ['tests', 'source'],
      checkIds: ['gates.progressive-validation.changed-scope'],
    },
  ],
  sourcePaths: ['policy-packs/gates/progressive-validation/pack.json'],
  generatedDocPaths: [],
};

const gates: SkoposResolvedGatesArtifact = {
  schemaVersion: 1,
  id: 'skopos.resolved-gates',
  type: 'resolved-gates',
  status: 'generated',
  authority: 'generated',
  summary: 'One gate.',
  workspaceRoot: '/workspace',
  packageManager: 'pnpm',
  detectedScripts: ['typecheck'],
  gates: [
    {
      id: 'gates.progressive-validation.gate.typecheck',
      packId: 'gates.progressive-validation',
      label: 'typecheck',
      kind: 'project-command',
      requiredness: 'required',
      status: 'available',
      severity: 'must',
      summary: 'Typecheck is available.',
      command: 'pnpm typecheck',
      matchedScript: 'typecheck',
    },
  ],
  missingRecommended: [],
  missingRequired: [],
};

const mission: SkoposMissionArtifact = {
  schemaVersion: 1,
  id: 'mission-agent-native',
  type: 'mission',
  status: 'generated',
  authority: 'generated',
  summary: 'Implement the operating model.',
  workspaceRoot: '/workspace',
  planId: 'plan-agent-native',
  state: 'active',
  title: 'Agent-native operating model',
  objective: 'Add the agent-native operating model',
  scope: {
    query: 'workspace',
    matchedBy: 'default-root',
    scope: {
      id: 'workspace',
      kind: 'workspace',
      title: 'Workspace',
      path: '.',
      aliases: ['root'],
      summary: 'Workspace root.',
      confidence: 'high',
    },
  },
  items: [],
  recommendedChecks: ['pnpm typecheck'],
  recommendedWorkflowIds: ['quality.focused'],
  decisionQuestionIds: ['plan.public-api-change'],
  linkedSlices: [],
  coordination: {},
};

const questions: SkoposWorkflowQuestionArtifact = {
  schemaVersion: 1,
  id: 'questions',
  type: 'questions',
  status: 'generated',
  authority: 'generated',
  summary: 'One open question.',
  workspaceRoot: '/workspace',
  generatedForPlanId: 'plan-agent-native',
  generatedForMissionId: 'mission-agent-native',
  entries: [
    {
      id: 'plan.public-api-change',
      title: 'Public API change',
      question: 'Should the public contract change?',
      category: 'public-api',
      escalation: 'must-ask',
      blocking: true,
      recommendedOptionId: 'confirm',
      options: [
        {
          id: 'confirm',
          label: 'Confirm',
          rationale: 'The contract is explicit.',
        },
      ],
      whyItMatters: 'Public contracts require confirmation.',
      whatHappensAfterAnswer: 'Implementation can continue.',
      linkedPlanId: 'plan-agent-native',
      linkedMissionId: 'mission-agent-native',
      evidenceRefs: ['.skopos/plans/plan-agent-native.json'],
      status: 'open',
    },
  ],
};
