import { describe, expect, it } from 'vitest';

import { createDefaultSkoposConfig } from '../../../config/src/index.js';
import { matchSkoposRequiredActionsForImpact } from '../../../indexer/src/index.js';
import type {
  SkoposActionManifest,
  SkoposActionRunArtifact,
  SkoposGuardManifest,
  SkoposTaskActionEvidenceLink,
} from '../../../model/src/index.js';
import { buildSkoposPlan } from '../../../planner/src/index.js';
import { projectGuardAvailability } from '../../../runtime/src/application/guards/guards.service.js';
import { selectTaskLinkedActionRuns } from '../../../runtime/src/application/verification/verification.service.js';

describe('canonical Action, Guard, and Evidence authority', () => {
  it('does not select Actions from goal wording', () => {
    const plan = buildSkoposPlan({
      workspaceRoot: '/workspace',
      goal: 'Run quality typecheck and docs validation',
      context: {
        workspaceRoot: '/workspace',
        scope: {
          query: '.',
          matchedBy: 'default-root',
          scope: {
            id: 'example',
            kind: 'workspace',
            title: 'Example',
            path: '.',
            aliases: [],
            summary: 'Example workspace.',
            confidence: 'high',
          },
        },
        summary: 'Compact project context.',
        references: [],
      },
      scanSummary: {
        hasRootPackageJson: true,
        hasPnpmWorkspace: false,
        ignoredPaths: [],
        docsRoots: ['docs'],
        docsHealth: {
          root: 'docs',
          hasStartHere: true,
          startHerePath: 'docs/00-start-here.md',
          markdownFileCount: 1,
          freshnessTrackedCount: 0,
          staleDocPaths: [],
        },
        sourceDependencies: [],
        instructionFiles: ['AGENTS.md'],
        packageCount: 1,
        workspacePackageCount: 1,
        languages: ['TypeScript'],
        frameworks: [],
        commands: { typecheck: 'pnpm typecheck' },
        findings: [],
        confidence: 'high',
        repoMode: 'single',
        archetypeSuggestion: 'library',
      },
      config: createDefaultSkoposConfig({
        projectName: 'example',
        archetype: 'library',
        repoMode: 'single',
      }),
    });

    expect(plan.recommendedActions).toEqual([]);
    expect(plan.implementationSteps.some((step) => step.detail.includes('quality.typecheck'))).toBe(
      false,
    );
  });

  it('does not turn a policy Guard id or label into a guessed command provider', () => {
    const projected = projectGuardAvailability({
        guardId: 'quality.typecheck',
        requirement: {
          guardId: 'quality.typecheck',
          packId: 'clean-code.maintainability@0.1.0',
          strength: 'required',
        },
        actionIds: new Set(['project.check-types', 'project.quality']),
      });

    expect(projected).toMatchObject({
      id: 'quality.typecheck',
      status: 'missing',
    });
    expect('actionId' in projected).toBe(false);
  });

  it('fails Guard availability closed when its explicit Action provider is missing', () => {
    expect(
      projectGuardAvailability({
        guardId: guard.id,
        manifest: guard,
        actionIds: new Set(),
      }),
    ).toMatchObject({
      id: 'quality.typecheck',
      status: 'missing',
      missingReason: 'Declare the missing Action provider: quality.typecheck.',
    });
  });

  it('selects required Actions only through matching Guard path, phase, risk, and Scope', () => {
    const selected = matchSkoposRequiredActionsForImpact({
      actions: [action],
      guards: [guard],
      changed: [
        {
          path: 'packages/model/src/index.ts',
          category: 'scope-source',
          affectedScopeIds: ['model'],
        },
      ],
      phase: 'closure',
      risk: 'standard',
    });
    const wrongPhase = matchSkoposRequiredActionsForImpact({
      actions: [action],
      guards: [guard],
      changed: [
        {
          path: 'packages/model/src/index.ts',
          category: 'scope-source',
          affectedScopeIds: ['model'],
        },
      ],
      phase: 'admission',
      risk: 'standard',
    });

    expect(selected.actions.map((entry) => entry.id)).toEqual(['quality.typecheck']);
    expect(selected.guards.map((entry) => entry.id)).toEqual(['quality.typecheck']);
    expect(wrongPhase).toEqual({ guards: [], actions: [] });
  });

  it('isolates global Action runs through Task-owned Evidence Links', () => {
    const firstRun = actionRun('AR-first');
    const secondRun = actionRun('AR-second');
    const unrelatedRun = actionRun('AR-unrelated');

    expect(
      selectTaskLinkedActionRuns(
        [firstRun, secondRun, unrelatedRun],
        [taskLink('T-first', firstRun.id), taskLink('T-first', secondRun.id)],
      ).map((run) => run.id),
    ).toEqual(['AR-first', 'AR-second']);
  });
});

const action: SkoposActionManifest = {
  id: 'quality.typecheck',
  title: 'Typecheck affected code',
  description: 'Run the project-owned type proof.',
  category: 'quality-check',
  scope: ['model'],
  command: 'pnpm typecheck',
  cwd: '.',
  inputs: ['packages/model'],
  outputs: [],
  affects: ['packages/model'],
  safety: 'read-only',
  requiresApproval: false,
  phases: ['closure'],
  risks: ['standard', 'high-impact'],
  recommendedAfter: [],
  owner: 'project',
  sourcePath: 'tools/skopos/actions/quality-typecheck.yaml',
};

const guard: SkoposGuardManifest = {
  id: 'quality.typecheck',
  title: 'Affected code typechecks',
  description: 'Require the declared project typecheck Action.',
  owner: 'project',
  scope: ['model'],
  strength: 'required',
  appliesTo: {
    paths: ['packages/model/**'],
    phases: ['closure'],
    risks: ['standard', 'high-impact'],
  },
  requires: {
    actionIds: ['quality.typecheck'],
    evidence: 'source-bound-action',
  },
  sourcePath: 'tools/skopos/guards/quality-typecheck.yaml',
};

const actionRun = (id: string): SkoposActionRunArtifact =>
  ({
    schemaVersion: 1,
    id,
    type: 'action-run',
    status: 'historical',
    authority: 'generated',
    generatedAt: '2026-07-30T00:00:00.000Z',
    updatedAt: '2026-07-30T00:00:00.000Z',
    summary: id,
    workspaceRoot: '/workspace',
    actionId: action.id,
    actionTitle: action.title,
    actionCategory: action.category,
    actionSafety: action.safety,
    sourcePath: action.sourcePath,
    command: action.command,
    cwd: action.cwd,
    runStatus: 'succeeded',
    exitCode: 0,
    outputPaths: [],
  }) satisfies SkoposActionRunArtifact;

const taskLink = (taskId: string, runId: string): SkoposTaskActionEvidenceLink =>
  ({
    schemaVersion: 1,
    id: `${taskId}-${runId}`,
    type: 'task-action-evidence-link',
    status: 'active',
    authority: 'generated',
    generatedAt: '2026-07-30T00:00:00.000Z',
    updatedAt: '2026-07-30T00:00:00.000Z',
    summary: `${taskId} links ${runId}.`,
    workspaceRoot: '/workspace',
    taskId,
    actionId: action.id,
    runId,
    linkedAt: '2026-07-30T00:00:00.000Z',
    linkedByActorId: 'codex',
  }) satisfies SkoposTaskActionEvidenceLink;
