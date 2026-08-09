import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import type {
  SkoposActionManifest,
  SkoposGuardManifest,
  SkoposImpactReport,
  SkoposPlanResult,
} from '@skopos/model';
import { matchSkoposRequiredActionsForImpact } from '../../../indexer/src/index.js';
import {
  assessSkoposTaskAdmission,
  assessSkoposTaskWorkflowRuntime,
  buildSkoposStartRuntime,
  excludeTrackedTaskProjectionAttributions,
  initSkoposProject,
  isSkoposTrackedTaskProjectionPath,
} from '../../../runtime/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const workspaceRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const fixtureRoot = join(workspaceRoot, 'fixtures', 'repos');
const semanticPackRoot = join(
  workspaceRoot,
  'policy-packs',
  'verification',
  'semantic-drift',
);
const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('progressive Task workflow', () => {
  it.each([
    {
      fixture: 'docs-project',
      goal: 'Fix a wording typo',
      paths: ['docs/index.md'],
      scopes: [],
      expected: 'light',
    },
    {
      fixture: 'rust-cli',
      goal: 'Add bounded command parsing behavior',
      paths: ['src/main.rs', 'Cargo.toml'],
      scopes: ['rust-cli'],
      expected: 'standard',
    },
    {
      fixture: 'basic-monorepo',
      goal: 'Refactor architecture across packages',
      paths: ['packages/api/src/index.ts', 'packages/web/package.json'],
      scopes: ['api', 'web'],
      expected: 'high-impact',
    },
    {
      fixture: 'terraform-infrastructure',
      goal: 'Prepare a public release deployment migration',
      paths: ['main.tf'],
      scopes: ['infrastructure'],
      expected: 'high-impact',
    },
  ])(
    'recommends $expected for the $fixture repository scenario',
    async ({ fixture, goal, paths, scopes, expected }) => {
      await Promise.all(paths.map((path) => access(join(fixtureRoot, fixture, path))));
      const plan = fixturePlan(goal);
      const impact = fixtureImpact(paths, scopes);
      const assessment = assessSkoposTaskAdmission({
        plan,
        impact,
        ownedPaths: paths,
        proofSubjectKind: 'task-closure',
      });

      expect(assessment.recommendedRisk).toBe(expected);
      expect(assessment.selectedRisk).toBe(expected);
      expect(assessment.reasons.every((reason) => reason.trim().length > 0)).toBe(true);
    },
  );

  it('keeps an explicit lower override visible without weakening project integration', () => {
    const plan = fixturePlan('Prepare release architecture');
    const impact = fixtureImpact(['packages/api/src/index.ts'], ['api']);
    const overridden = assessSkoposTaskAdmission({
      plan,
      impact,
      ownedPaths: ['packages/api/src/index.ts'],
      explicitRisk: 'standard',
      proofSubjectKind: 'task-closure',
    });
    const integration = assessSkoposTaskAdmission({
      plan,
      impact,
      ownedPaths: ['packages/api/src/index.ts'],
      explicitRisk: 'light',
      proofSubjectKind: 'project-integration',
    });

    expect(overridden).toMatchObject({
      recommendedRisk: 'high-impact',
      selectedRisk: 'standard',
      selectionSource: 'explicit-override',
      workflow: 'tracked',
    });
    expect(integration).toMatchObject({
      selectedRisk: 'high-impact',
      selectedDetail: 'detailed',
      selectionSource: 'proof-subject',
      workflow: 'strict',
    });
  });

  it('keeps light work compact and suggests changed paths outside ownership', async () => {
    const root = await createGitWorkspace('light-fast-path');
    await writeFile(join(root, 'README.md'), '# Fixture\n', 'utf8');
    await initSkoposProject({ cwd: root, mode: 'greenfield', actor: 'workflow-agent' });
    commitWorkspace(root, 'baseline');

    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Fix a wording typo',
      actor: 'workflow-agent',
      ownedPaths: ['README.md'],
      acceptanceCriteria: ['The corrected wording is present.'],
    });
    await writeFile(join(root, 'unowned-note.md'), '# New note\n', 'utf8');
    const workflow = await assessSkoposTaskWorkflowRuntime({
      cwd: root,
      taskId: started.task.id,
    });

    expect(started.task).toMatchObject({
      risk: 'light',
      detail: 'light',
      trackedDocumentPath: undefined,
      admission: { workflow: 'fast-path', selectionSource: 'automatic' },
    });
    expect(workflow.ownershipSuggestion).toMatchObject({
      paths: ['unowned-note.md'],
      confirmationRequired: false,
    });
    expect(workflow.nextCommand).toContain('task ownership add');
  });

  it('does not report runtime-managed Task projections as external ownership drift', () => {
    expect(
      isSkoposTrackedTaskProjectionPath(
        'docs/work/tasks/snapshots/T-fixture-S-1234.json',
        ['docs/work/tasks/T-fixture-workflow.md'],
      ),
    ).toBe(true);
    const result = excludeTrackedTaskProjectionAttributions(
      [
        {
          path: 'docs/work/tasks/T-fixture.md',
          kind: 'external-unattributed',
          reason: 'unattributed-post-admission-change',
        },
        {
          path: 'packages/runtime/src/index.ts',
          kind: 'task-owned',
          reason: 'declared-task-ownership',
        },
      ],
      ['docs/work/tasks/T-fixture.md'],
    );

    expect(result).toEqual([
      {
        path: 'packages/runtime/src/index.ts',
        kind: 'task-owned',
        reason: 'declared-task-ownership',
      },
    ]);
  });

  it('explains selected and skipped Guards and Actions', () => {
    const actions = [action('docs.check'), action('ui.check')];
    const guards = [
      guard('docs.guard', ['docs/**'], ['docs.check']),
      guard('ui.guard', ['packages/ui/**'], ['ui.check']),
      guard('release.guard', ['docs/**'], ['docs.check'], ['high-impact']),
    ];
    const selection = matchSkoposRequiredActionsForImpact({
      actions,
      guards,
      changed: [{ path: 'docs/guide.md', category: 'docs', affectedScopeIds: ['workspace'] }],
      phase: 'closure',
      risk: 'light',
    });

    expect(selection.actions.map((entry) => entry.id)).toEqual(['docs.check']);
    expect(selection.explanation.guards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'docs.guard', status: 'selected' }),
        expect.objectContaining({ id: 'ui.guard', status: 'skipped', reason: expect.stringContaining('no changed path') }),
        expect.objectContaining({ id: 'release.guard', status: 'skipped', reason: expect.stringContaining('risk light') }),
      ]),
    );
    expect(selection.explanation.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'docs.check', status: 'selected' }),
        expect.objectContaining({ id: 'ui.check', status: 'skipped' }),
      ]),
    );
  });

  it('ships an executable semantic Guard template with allowed and violating fixtures', async () => {
    const script = join(semanticPackRoot, 'templates', 'semantic-guidance-check.mjs');
    const config = join(
      semanticPackRoot,
      'templates',
      'semantic-guidance.config.example.json',
    );
    const good = spawnSync(process.execPath, [script, '--config', config, join(semanticPackRoot, 'fixtures', 'good')], {
      cwd: workspaceRoot,
      encoding: 'utf8',
    });
    const drift = spawnSync(process.execPath, [script, '--config', config, join(semanticPackRoot, 'fixtures', 'drift')], {
      cwd: workspaceRoot,
      encoding: 'utf8',
    });

    expect(good.status).toBe(0);
    expect(JSON.parse(good.stdout)).toMatchObject({ status: 'pass', violations: [] });
    expect(drift.status).toBe(1);
    expect(JSON.parse(drift.stdout)).toMatchObject({ status: 'fail' });
    expect(JSON.parse(drift.stdout).violations).toHaveLength(3);
  });
});

const fixturePlan = (goal: string): SkoposPlanResult => ({
  workspaceRoot: '/fixture',
  goal,
  title: goal,
  summary: goal,
  scope: {
    scope: {
      id: 'workspace',
      title: 'Workspace',
      kind: 'workspace',
      path: '.',
      codeRoots: ['.'],
    },
    matchedBy: 'default-root',
  },
  confidence: 'high',
  references: [],
  implementationSteps: [
    { id: 'review', title: 'Review', detail: 'Review.' },
    { id: 'implement', title: 'Implement', detail: 'Implement.' },
    { id: 'verify', title: 'Verify', detail: 'Verify.' },
  ],
  recommendedActions: [],
  decisionQuestions: [],
  risks: [],
  nextSteps: [],
});

const fixtureImpact = (paths: string[], scopes: string[]): SkoposImpactReport => ({
  workspaceRoot: '/fixture',
  changedPathSource: 'explicit',
  changedPaths: paths,
  changed: paths.map((path) => ({
    path,
    category: path.startsWith('docs/') ? 'docs' : 'scope-source',
    affectedScopeIds: ['workspace', ...scopes],
  })),
  affectedScopes: [
    { id: 'workspace', title: 'Workspace', kind: 'workspace', path: '.', codeRoots: ['.'] },
    ...scopes.map((id) => ({ id, title: id, kind: 'package' as const, path: id, codeRoots: [id] })),
  ],
  recommendedCommands: [],
  matchedGuards: [],
  requiredActions: [],
  selectionExplanation: { guards: [], actions: [] },
  warnings: [],
  instructionMirrorIssues: [],
  summary: 'Fixture impact.',
});

const action = (id: string): SkoposActionManifest => ({
  id,
  title: id,
  description: id,
  category: 'quality-check',
  scope: ['workspace'],
  command: 'true',
  cwd: '.',
  inputs: [],
  outputs: [],
  affects: [],
  capabilities: { process: 'required', network: 'none', browser: 'none', tools: [], secrets: [], services: [] },
  effects: { workspace: 'none', artifacts: 'none', external: 'none' },
  concurrency: 'shared',
  workspaceMode: 'overlay-safe',
  safety: 'read-only',
  requiresApproval: false,
  recommendedAfter: [],
  owner: 'fixture',
  sourcePath: `tools/skopos/actions/${id}.yaml`,
});

const guard = (
  id: string,
  paths: string[],
  actionIds: string[],
  risks?: Array<'light' | 'standard' | 'high-impact'>,
): SkoposGuardManifest => ({
  id,
  title: id,
  description: id,
  owner: 'fixture',
  scope: ['workspace'],
  strength: 'required',
  appliesTo: { paths, phases: ['closure'], risks },
  requires: { actionIds, evidence: 'source-bound-action' },
  sourcePath: `tools/skopos/guards/${id}.yaml`,
});

const createGitWorkspace = async (name: string): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), `skopos-${name}-`));
  temporaryRoots.push(root);
  git(root, ['init']);
  git(root, ['config', 'user.email', 'fixture@example.com']);
  git(root, ['config', 'user.name', 'Fixture']);
  return root;
};

const commitWorkspace = (root: string, message: string): void => {
  git(root, ['add', '.']);
  git(root, ['commit', '-m', message]);
};

const git = (cwd: string, args: string[]): void => {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout);
  }
};
