import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { matchSkoposRequiredActionsForImpact } from '../../../indexer/src/index.js';
import type {
  SkoposActionManifest,
  SkoposGuardManifest,
  SkoposImpactEntry,
} from '../../../model/src/index.js';
import {
  captureSkoposTaskChangeScope,
  captureSkoposTaskPathStates,
  resolveSkoposTaskChangedPaths,
} from '../../../verification/src/application/task-change-scope/task-change-scope.service.js';

const TASK_PATH = 'scopes/task/src/owned.ts';
const OTHER_ROOT = 'scopes/other/src';
const EXPECTED_TASK_ACTION_ID = 'quality.task-scope';
const temporaryRoots: string[] = [];

interface SelectionMetrics {
  taskProofChangedPathCount: number;
  ignoredPreExistingPathCount: number;
  otherWorkExcludedPathCount: number;
  selectedActionCount: number;
  falseActionSelectionCount: number;
}

interface OperationalReliabilityBaseline {
  schemaVersion: 1;
  id: string;
  status: 'implemented';
  scenario: {
    id: string;
    fixture: {
      preExistingDirtyPathCount: number;
      postAdmissionOtherWorkMutationCount: number;
      taskOwnedMutationCount: number;
    };
    observed: SelectionMetrics;
    target: SelectionMetrics;
    current: SelectionMetrics;
    control: SelectionMetrics;
  };
}

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('operational reliability baseline', () => {
  it('prevents proof-scope amplification after unrelated work changes again', async () => {
    const baseline = await loadBaseline();
    const workspaceRoot = await createDirtyWorkspace(
      baseline.scenario.fixture.preExistingDirtyPathCount,
    );
    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: [TASK_PATH],
    });

    await Promise.all([
      writeFile(join(workspaceRoot, TASK_PATH), 'export const owned = "task change";\n', 'utf8'),
      writeFile(
        join(workspaceRoot, otherPath(0)),
        'export const other0 = "changed by other work after admission";\n',
        'utf8',
      ),
    ]);

    const [otherState] = await captureSkoposTaskPathStates({
      workspaceRoot,
      paths: [otherPath(0)],
    });
    const changes = await resolveSkoposTaskChangedPaths({
      workspaceRoot,
      changeScope,
      currentTaskId: 'T-current',
      mutationAttributions: [{
        path: otherPath(0),
        taskId: 'T-other',
        digest: otherState!.digest,
        attributedAt: new Date(Date.parse(changeScope.capturedAt) + 1).toISOString(),
      }],
    });
    const metrics = measureSelection(
      changes.changedPaths,
      changes.ignoredPreExistingPaths,
      changes.excludedOtherTaskPaths,
    );

    expect(baseline.scenario.id).toBe('mixed-worktree-task-proof-scope-amplification');
    expect(metrics).toEqual(baseline.scenario.target);
    expect(metrics).toEqual(baseline.scenario.current);
    expect(baseline.scenario.observed.falseActionSelectionCount).toBeGreaterThan(
      metrics.falseActionSelectionCount,
    );
  });

  it('keeps the clean control proportional when unrelated dirty paths remain unchanged', async () => {
    const baseline = await loadBaseline();
    const workspaceRoot = await createDirtyWorkspace(
      baseline.scenario.fixture.preExistingDirtyPathCount,
    );
    const changeScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: [TASK_PATH],
    });

    await writeFile(
      join(workspaceRoot, TASK_PATH),
      'export const owned = "task change";\n',
      'utf8',
    );

    const changes = await resolveSkoposTaskChangedPaths({ workspaceRoot, changeScope });
    const metrics = measureSelection(
      changes.changedPaths,
      changes.ignoredPreExistingPaths,
      changes.excludedOtherTaskPaths,
    );

    expect(metrics).toEqual(baseline.scenario.control);
  });

  it('includes the explicitly owned cross-Scope surface for project integration proof', async () => {
    const baseline = await loadBaseline();
    const workspaceRoot = await createDirtyWorkspace(
      baseline.scenario.fixture.preExistingDirtyPathCount,
    );
    const integrationScope = await captureSkoposTaskChangeScope({
      workspaceRoot,
      declaredOwnedPaths: ['scopes'],
    });
    await writeFile(
      join(workspaceRoot, TASK_PATH),
      'export const owned = "integration candidate";\n',
      'utf8',
    );

    const changes = await resolveSkoposTaskChangedPaths({
      workspaceRoot,
      changeScope: integrationScope,
      currentTaskId: 'T-integration',
    });
    const selection = matchSkoposRequiredActionsForImpact({
      actions,
      guards,
      changed: changes.changedPaths.map(toImpactEntry),
      phase: 'closure',
      risk: 'standard',
    });

    expect(changes.changedPaths).toHaveLength(
      baseline.scenario.fixture.preExistingDirtyPathCount + 1,
    );
    expect(changes.ignoredPreExistingPaths).toEqual([]);
    expect(selection.actions.map((action) => action.id).sort()).toEqual([
      'quality.other-scope',
      EXPECTED_TASK_ACTION_ID,
    ]);
    expect(selection.actions.every((action) => action.reason.length > 0)).toBe(true);
  });
});

const loadBaseline = async (): Promise<OperationalReliabilityBaseline> =>
  JSON.parse(
    await readFile(
      new URL('../../../../internal/evals/operational-reliability-baseline.json', import.meta.url),
      'utf8',
    ),
  ) as OperationalReliabilityBaseline;

const measureSelection = (
  changedPaths: string[],
  ignoredPreExistingPaths: string[],
  excludedOtherTaskPaths: string[],
): SelectionMetrics => {
  const selection = matchSkoposRequiredActionsForImpact({
    actions,
    guards,
    changed: changedPaths.map(toImpactEntry),
    phase: 'closure',
    risk: 'standard',
  });
  const selectedActionIds = selection.actions.map((action) => action.id);

  return {
    taskProofChangedPathCount: changedPaths.length,
    ignoredPreExistingPathCount: ignoredPreExistingPaths.length,
    otherWorkExcludedPathCount: excludedOtherTaskPaths.length,
    selectedActionCount: selectedActionIds.length,
    falseActionSelectionCount: selectedActionIds.filter(
      (actionId) => actionId !== EXPECTED_TASK_ACTION_ID,
    ).length,
  };
};

const toImpactEntry = (path: string): SkoposImpactEntry => ({
  path,
  category: 'scope-source',
  affectedScopeIds: path === TASK_PATH ? ['task-scope'] : ['other-scope'],
});

const createDirtyWorkspace = async (dirtyPathCount: number): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-operational-reliability-'));
  temporaryRoots.push(workspaceRoot);
  await Promise.all([
    mkdir(join(workspaceRoot, 'scopes/task/src'), { recursive: true }),
    mkdir(join(workspaceRoot, OTHER_ROOT), { recursive: true }),
  ]);
  await writeFile(join(workspaceRoot, TASK_PATH), 'export const owned = "baseline";\n', 'utf8');
  await Promise.all(
    Array.from({ length: dirtyPathCount }, (_, index) =>
      writeFile(
        join(workspaceRoot, otherPath(index)),
        `export const other${index} = "baseline";\n`,
        'utf8',
      ),
    ),
  );
  execFileSync('git', ['init', '--initial-branch=main'], { cwd: workspaceRoot });
  execFileSync('git', ['config', 'user.email', 'skopos@example.com'], {
    cwd: workspaceRoot,
  });
  execFileSync('git', ['config', 'user.name', 'Skopos Fixture'], {
    cwd: workspaceRoot,
  });
  execFileSync('git', ['add', '.'], { cwd: workspaceRoot });
  execFileSync('git', ['commit', '-m', 'fixture baseline'], { cwd: workspaceRoot });
  await Promise.all(
    Array.from({ length: dirtyPathCount }, (_, index) =>
      writeFile(
        join(workspaceRoot, otherPath(index)),
        `export const other${index} = "pre-existing dirty state";\n`,
        'utf8',
      ),
    ),
  );
  return workspaceRoot;
};

const otherPath = (index: number): string => `${OTHER_ROOT}/existing-${index}.ts`;

const actions: SkoposActionManifest[] = [
  {
    id: EXPECTED_TASK_ACTION_ID,
    title: 'Check Task Scope',
    description: 'Check the narrow Task Scope.',
    category: 'quality-check',
    scope: ['task-scope'],
    command: 'check-task-scope',
    cwd: '.',
    inputs: ['scopes/task'],
    outputs: [],
    affects: [],
    safety: 'read-only',
    requiresApproval: false,
    phases: ['closure'],
    risks: ['standard'],
    recommendedAfter: [],
    owner: 'fixture',
    sourcePath: 'tools/skopos/actions/check-task-scope.yaml',
  },
  {
    id: 'quality.other-scope',
    title: 'Check Other Scope',
    description: 'Check work outside the narrow Task.',
    category: 'quality-check',
    scope: ['other-scope'],
    command: 'check-other-scope',
    cwd: '.',
    inputs: ['scopes/other'],
    outputs: [],
    affects: [],
    safety: 'read-only',
    requiresApproval: false,
    phases: ['closure'],
    risks: ['standard'],
    recommendedAfter: [],
    owner: 'fixture',
    sourcePath: 'tools/skopos/actions/check-other-scope.yaml',
  },
];

const guards: SkoposGuardManifest[] = [
  {
    id: 'quality.task-scope',
    title: 'Task Scope requires focused proof',
    description: 'Require the focused Task Action for Task-owned source.',
    owner: 'fixture',
    scope: ['task-scope'],
    strength: 'required',
    appliesTo: {
      paths: ['scopes/task/**'],
      phases: ['closure'],
      risks: ['standard'],
    },
    requires: {
      actionIds: [EXPECTED_TASK_ACTION_ID],
      evidence: 'source-bound-action',
    },
    sourcePath: 'tools/skopos/guards/task-scope.yaml',
  },
  {
    id: 'quality.other-scope',
    title: 'Other Scope requires focused proof',
    description: 'Require the other Action only for changes owned by other work.',
    owner: 'fixture',
    scope: ['other-scope'],
    strength: 'required',
    appliesTo: {
      paths: ['scopes/other/**'],
      phases: ['closure'],
      risks: ['standard'],
    },
    requires: {
      actionIds: ['quality.other-scope'],
      evidence: 'source-bound-action',
    },
    sourcePath: 'tools/skopos/guards/other-scope.yaml',
  },
];
