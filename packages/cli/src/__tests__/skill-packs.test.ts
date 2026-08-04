import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
  loadSkoposProjectSkillBindings,
  loadSkoposSkillPacks,
} from '../../../indexer/src/index.js';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposResolvedPolicyArtifact,
  SkoposTaskContract,
} from '../../../model/src/index.js';
import { selectSkoposSkillsForTaskRuntime } from '../../../runtime/src/index.js';
import {
  assertSkoposSkillAcceptanceIdentityRuntime,
  buildSkoposSkillAcceptanceIdentityRuntime,
} from '../../../runtime/src/application/skills/skill-identity.service.js';
import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));

describe('product UI craft skill pack', () => {
  it('loads a bounded, component-library-neutral polish module', async () => {
    const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const pack = packs.find((candidate) => candidate.packId === 'ui.product-craft');

    expect(pack).toMatchObject({
      version: '0.1.0',
      selection: {
        maximumMeasuredTokens: 2200,
        maximumModules: 3,
      },
    });
    expect(pack?.modules).toContainEqual(
      expect.objectContaining({
        id: 'ui-craft.visual-composition-and-polish',
        path: 'guidance/visual-composition-and-polish.md',
        measuredTokens: expect.any(Number),
      }),
    );
    expect(pack?.modules).toContainEqual(
      expect.objectContaining({
        id: 'ui-craft.component-architecture-and-naming',
        path: 'guidance/component-architecture-and-naming.md',
      }),
    );
    expect(pack?.modules).toContainEqual(
      expect.objectContaining({
        id: 'ui-craft.human-interface-writing',
        path: 'guidance/human-interface-writing.md',
      }),
    );
    expect(pack?.modules.every((module) => module.positiveSignals.length > 0)).toBe(true);
    expect(pack?.modules.every((module) => module.rubricDimensions.length > 0)).toBe(true);
    expect(pack?.modules.every((module) => module.measuredTokens > 0)).toBe(true);

    const guidance = await readFile(
      `${skoposRoot}/skill-packs/ui/product-craft/guidance/visual-composition-and-polish.md`,
      'utf8',
    );
    expect(guidance).toContain('Use semantic type roles');
    expect(guidance).toContain('Establish a small set of alignment lines');
    expect(guidance).toContain('Give a region one primary containment treatment');
    expect(guidance).toContain('Start from project component defaults');
    expect(guidance).not.toMatch(/Unisane|shadcn|Material UI|Radix|Tailwind/i);

    const writingGuidance = await readFile(
      `${skoposRoot}/skill-packs/ui/product-craft/guidance/human-interface-writing.md`,
      'utf8',
    );
    expect(writingGuidance).toContain('Every sentence must help someone choose, act, or understand');
    expect(writingGuidance).toContain('Label an action with a specific verb and outcome');
    expect(writingGuidance).toContain('An error states the problem in user terms');
    expect(writingGuidance).toContain('| Avoid | Prefer |');
    expect(writingGuidance).toContain('Assign each string one role');
    expect(writingGuidance).toContain('Do not repeat the same noun across all three');
    expect(writingGuidance).not.toMatch(/Unisane|shadcn|Material UI|Radix|Tailwind/i);

    const componentGuidance = await readFile(
      `${skoposRoot}/skill-packs/ui/product-craft/guidance/component-architecture-and-naming.md`,
      'utf8',
    );
    expect(componentGuidance).toContain('Choose in this order');
    expect(componentGuidance).toContain('Do not encode prompt adjectives');
    expect(componentGuidance).toContain('why an existing component could not own the change');
    expect(componentGuidance).not.toMatch(/Unisane|shadcn|Material UI|Radix|Tailwind/i);
  });

  it('keeps the accepted project binding aligned to the pack version', async () => {
    const bindings = await loadSkoposProjectSkillBindings({ cwd: skoposRoot });

    expect(
      bindings.find((binding) => binding.packId === 'ui.product-craft'),
    ).toMatchObject({
      packVersion: '0.1.0',
      lifecycle: 'accepted',
    });
  });

  it('resolves capabilities only from the modules selected for the task', async () => {
    const task = buildSkillTestTask('Narrow the hydration boundary.');
    task.acceptanceCriteria.push('Keep the client rendering boundary narrow.');
    task.constraints.push('Preserve server rendering outside the interactive island.');
    task.nonGoals.push('Do not redesign the product page.');
    task.openDecisions.push({
      id: 'decision.hydration-owner',
      question: 'Which component owns hydration?',
      blocking: false,
    });
    const operatingModel = await buildSkillTestOperatingModel();

    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-react-boundary',
      cacheMode: 'bypass',
      task,
      taskRisk: 'standard',
      ownedPaths: ['packages/ui/src/app'],
      changedPaths: ['packages/ui/src/app/page.tsx'],
      affectedCapabilities: ['hydration'],
      selectedActionIds: ['quality.run-proof-phase'],
      applicableGuardIds: ['quality.typecheck'],
      acceptedFailureEvidence: [
        {
          id: 'failure.client-boundary-expansion',
          summary: 'Client rendering expanded beyond the interactive island.',
        },
      ],
      operatingModel,
    });

    expect(result.diagnostics).toEqual([]);
    expect(result.selectedSkills).toHaveLength(1);
    expect(result.selectedSkills[0]).toMatchObject({
      selectedModuleIds: expect.arrayContaining([
        'ui-craft.react-boundaries',
      ]),
      selectedActionIds: ['quality.run-proof-phase'],
      selectedGuardIds: ['quality.typecheck'],
    });
    expect(result.selectedSkills[0]?.selectedActionIds).not.toContain(
      'ui.build-console-app',
    );
    expect(result.selectedSkills[0]?.measuredContextTokens).toBeGreaterThan(0);
    expect(result.envelope).toMatchObject({
      acceptanceCriteria: ['Keep the client rendering boundary narrow.'],
      constraints: ['Preserve server rendering outside the interactive island.'],
      nonGoals: ['Do not redesign the product page.'],
      openDecisions: ['Which component owns hydration?'],
      selectedActionIds: ['quality.run-proof-phase'],
      applicableGuardIds: ['quality.typecheck'],
      projectLifecycle: 'established-brownfield',
    });
    expect(result.envelope.scopeIds).toEqual(['skopos', 'skopos-ui']);
    expect(result.envelope.paths).toContainEqual(
      expect.objectContaining({
        path: 'packages/ui/src/app/page.tsx',
        source: 'changed',
        kinds: expect.arrayContaining(['authored-source']),
      }),
    );
    expect(result.explanations).toContainEqual(
      expect.objectContaining({
        moduleId: 'ui-craft.react-boundaries',
        outcome: 'selected',
        reasonCode: 'selected',
      }),
    );
  });

  it('suppresses keyword overlap without relevant UI applicability', async () => {
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-backend-suppression',
      cacheMode: 'bypass',
      task: buildSkillTestTask('Refactor the backend rendering adapter.', {
        id: 'skopos-runtime',
        title: 'Skopos Runtime',
        path: 'packages/runtime',
        kind: 'service',
      }),
      taskRisk: 'standard',
      changedPaths: ['packages/runtime/src/adapters/database.ts'],
      operatingModel: await buildSkillTestOperatingModel(),
    });

    expect(result.selectedSkills).toEqual([]);
    expect(result.explanations).toContainEqual(
      expect.objectContaining({
        outcome: 'suppressed',
        reasonCode: 'applicability-missing',
      }),
    );
  });

  it('suppresses Skills when all changed paths are generated output', async () => {
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-generated-suppression',
      cacheMode: 'bypass',
      task: buildSkillTestTask('Refresh the product interface rendering output.'),
      taskRisk: 'standard',
      changedPaths: ['.cache/generated/product-page.tsx'],
      operatingModel: await buildSkillTestOperatingModel(),
    });

    expect(result.selectedSkills).toEqual([]);
    expect(result.envelope.paths[0]?.kinds).toContain('generated');
  });

  it('lets an explicit anti-signal block otherwise relevant intent', async () => {
    const task = buildSkillTestTask('Update the product page hierarchy.');
    task.nonGoals.push(
      'No rendered product surface is in scope; backend infrastructure only.',
    );
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-anti-signal',
      cacheMode: 'bypass',
      task,
      taskRisk: 'standard',
      changedPaths: ['packages/ui/src/app/page.tsx'],
      operatingModel: await buildSkillTestOperatingModel(),
    });

    expect(
      result.explanations.find(
        (entry) => entry.moduleId === 'ui-craft.hierarchy-and-brand',
      ),
    ).toMatchObject({
      outcome: 'suppressed',
      reasonCode: 'blocking-anti-signal',
      evidenceIds: ['anti.no-rendered-product-surface'],
    });
  });

  it('enforces one measured Skill budget across the Task', async () => {
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-standard-budget',
      cacheMode: 'bypass',
      task: buildSkillTestTask(
        'Rewrite interface labels, errors, empty states, typography, spacing, and responsive recovery.',
      ),
      taskRisk: 'standard',
      changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
      operatingModel: await buildSkillTestOperatingModel(),
    });

    const measuredTokens = result.selectedSkills.reduce(
      (total, skill) => total + skill.measuredContextTokens,
      0,
    );
    const moduleCount = result.selectedSkills.reduce(
      (total, skill) => total + skill.selectedModuleIds.length,
      0,
    );
    expect(result.budget).toEqual({
      maximumPacks: 2,
      maximumModules: 3,
      maximumMeasuredTokens: 1800,
    });
    expect(measuredTokens).toBeLessThanOrEqual(result.budget.maximumMeasuredTokens);
    expect(moduleCount).toBeLessThanOrEqual(result.budget.maximumModules);
    expect(result.explanations).toContainEqual(
      expect.objectContaining({
        reasonCode: expect.stringMatching(/^(module|token)-budget-exhausted$/),
      }),
    );
  });

  it('suppresses an oversized module instead of truncating its guidance', async () => {
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-light-budget',
      cacheMode: 'bypass',
      task: buildSkillTestTask('Rewrite the interface labels and action wording.'),
      taskRisk: 'light',
      changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
      operatingModel: await buildSkillTestOperatingModel(),
    });

    expect(
      result.selectedSkills.flatMap((skill) => skill.selectedModuleIds),
    ).not.toContain('ui-craft.human-interface-writing');
    expect(
      result.selectedSkills.reduce(
        (total, skill) => total + skill.measuredContextTokens,
        0,
      ),
    ).toBeLessThanOrEqual(800);
    expect(result.explanations).toContainEqual(
      expect.objectContaining({
        moduleId: 'ui-craft.human-interface-writing',
        reasonCode: 'token-budget-exhausted',
      }),
    );
  });

  it('reuses only the one exact generated selection artifact', async () => {
    const taskId = 'T-skill-selection-cache-fixture';
    const selectionArtifactDirectory = await mkdtemp(
      join(tmpdir(), 'skopos-skill-selection-cache-'),
    );
    const artifactPath = join(selectionArtifactDirectory, `${taskId}.json`);
    const task = buildSkillTestTask('Polish the product interface hierarchy and spacing.');
    const operatingModel = await buildSkillTestOperatingModel();
    const policy = JSON.parse(
      await readFile(join(skoposRoot, '.skopos/index/policies/resolved.json'), 'utf8'),
    ) as SkoposResolvedPolicyArtifact;
    const select = (resolvedPolicy = policy) =>
      selectSkoposSkillsForTaskRuntime({
        cwd: skoposRoot,
        taskId,
        task,
        taskRisk: 'standard',
        changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
        operatingModel,
        resolvedPolicy,
        selectionArtifactDirectory,
      });

    try {
      const first = await select();
      const second = await select();
      expect(first.cache).toMatchObject({ status: 'miss', artifactPath });
      expect(second.cache).toMatchObject({
        status: 'hit',
        artifactPath,
        identityDigest: first.cache.identityDigest,
      });

      task.acceptanceCriteria.push('Keep the responsive reading order stable.');
      const taskChanged = await select();
      expect(taskChanged.cache.status).toBe('miss');
      expect(taskChanged.cache.identityDigest).not.toBe(first.cache.identityDigest);
      expect((await select()).cache.status).toBe('hit');

      const policyChanged = await select({
        ...policy,
        summary: `${policy.summary ?? ''} exact-cache-fixture`,
      });
      expect(policyChanged.cache.status).toBe('miss');
      expect(policyChanged.cache.identityDigest).not.toBe(taskChanged.cache.identityDigest);
      const artifact = JSON.parse(await readFile(artifactPath, 'utf8')) as {
        authority: string;
        type: string;
        identity: { combinedDigest: string };
      };
      expect(artifact).toMatchObject({
        authority: 'generated',
        type: 'skill-selection',
        identity: { combinedDigest: policyChanged.cache.identityDigest },
      });
    } finally {
      await rm(selectionArtifactDirectory, { recursive: true, force: true });
    }
  });

  it('invalidates human acceptance when pack, project, or evaluation content changes', async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'skopos-skill-identity-'));
    const temporaryPackDirectory = join(temporaryRoot, 'product-craft');
    const temporaryProjectSource = join(temporaryRoot, 'project-source.md');
    await cp(
      join(skoposRoot, 'skill-packs/ui/product-craft'),
      temporaryPackDirectory,
      { recursive: true },
    );
    await writeFile(temporaryProjectSource, 'Project source v1\n', 'utf8');
    const [sourcePack] = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const [sourceBinding] = await loadSkoposProjectSkillBindings({ cwd: skoposRoot });
    if (!sourcePack || !sourceBinding) throw new Error('Expected Skill sources.');
    const operatingModel = await buildSkillTestOperatingModel();
    const pack = {
      ...sourcePack,
      sourcePath: join(temporaryPackDirectory, 'pack.json'),
    };
    const binding = {
      ...sourceBinding,
      sourceBindings: {
        ...sourceBinding.sourceBindings,
        'brand-doctrine': [temporaryProjectSource],
      },
      acceptance: undefined,
    };
    const identity = await buildSkoposSkillAcceptanceIdentityRuntime({
      workspaceRoot: skoposRoot,
      pack,
      binding,
      operatingModel,
    });
    const acceptedBinding = {
      ...binding,
      lifecycle: 'accepted' as const,
      acceptance: {
        acceptedAt: '2026-08-04T00:00:00.000Z',
        acceptedBy: 'fixture-reviewer',
        reason: 'Pin the exact fixture sources.',
        identity,
      },
    };

    try {
      await expect(
        assertSkoposSkillAcceptanceIdentityRuntime({
          workspaceRoot: skoposRoot,
          pack,
          binding: acceptedBinding,
          operatingModel,
        }),
      ).resolves.toEqual(identity);

      await writeFile(temporaryProjectSource, 'Project source v2\n', 'utf8');
      await expect(
        assertSkoposSkillAcceptanceIdentityRuntime({
          workspaceRoot: skoposRoot,
          pack,
          binding: acceptedBinding,
          operatingModel,
        }),
      ).rejects.toThrow(/projectSourceDigest.*changed/);
      await writeFile(temporaryProjectSource, 'Project source v1\n', 'utf8');

      const guidancePath = join(temporaryPackDirectory, 'guidance/hierarchy-and-brand.md');
      const guidance = await readFile(guidancePath, 'utf8');
      await writeFile(guidancePath, `${guidance}\nMaterial pack change.\n`, 'utf8');
      await expect(
        assertSkoposSkillAcceptanceIdentityRuntime({
          workspaceRoot: skoposRoot,
          pack,
          binding: acceptedBinding,
          operatingModel,
        }),
      ).rejects.toThrow(/packSourceDigest.*changed/);
      await writeFile(guidancePath, guidance, 'utf8');

      const fixturePath = join(temporaryPackDirectory, 'fixtures/good/README.md');
      const fixture = await readFile(fixturePath, 'utf8');
      await writeFile(fixturePath, `${fixture}\nMaterial evaluation change.\n`, 'utf8');
      await expect(
        assertSkoposSkillAcceptanceIdentityRuntime({
          workspaceRoot: skoposRoot,
          pack,
          binding: acceptedBinding,
          operatingModel,
        }),
      ).rejects.toThrow(/evaluationSourceDigest.*changed/);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it('suppresses a stale accepted Skill without blocking unrelated Task selection', async () => {
    const currentOperatingModel = await buildSkillTestOperatingModel();
    const operatingModel = {
      ...currentOperatingModel,
      actions: [...currentOperatingModel.actions, { id: 'fixture.new-capability' }],
    } as SkoposAgentNativeOperatingModel;
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-stale-skill-acceptance',
      task: buildSkillTestTask('Polish the product interface hierarchy.'),
      taskRisk: 'standard',
      changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
      operatingModel,
    });

    expect(result.selectedSkills).toEqual([]);
    expect(result.cache.status).toBe('bypassed');
    expect(result.diagnostics.join(' ')).toMatch(/capabilityCatalogDigest.*changed/);
    expect(result.explanations).toContainEqual(
      expect.objectContaining({ reasonCode: 'binding-invalid', outcome: 'suppressed' }),
    );
  });

  it('rejects obsolete pack-level selection and context fields', async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'skopos-skill-pack-'));
    const manifestDirectory = join(temporaryRoot, 'skill-packs', 'legacy');
    await mkdir(manifestDirectory, { recursive: true });
    const currentManifest = JSON.parse(
      await readFile(
        `${skoposRoot}/skill-packs/ui/product-craft/pack.json`,
        'utf8',
      ),
    ) as Record<string, unknown>;
    const modules = currentManifest.modules;
    delete currentManifest.modules;
    currentManifest.contextModules = modules;
    currentManifest.requiredProjectRoles = {
      context: [],
      recommendedContext: [],
      actions: [],
      recommendedActions: [],
      guards: [],
      recommendedGuards: [],
    };
    await writeFile(
      join(manifestDirectory, 'pack.json'),
      `${JSON.stringify(currentManifest, null, 2)}\n`,
      'utf8',
    );

    await expect(
      loadSkoposSkillPacks({ cwd: temporaryRoot }),
    ).rejects.toThrow();
    await rm(temporaryRoot, { recursive: true, force: true });
  });
});

const buildSkillTestTask = (
  goal: string,
  scope: {
    id: string;
    title: string;
    path: string;
    kind: 'workspace' | 'product' | 'application' | 'service' | 'package' | 'domain' | 'infrastructure' | 'tool';
  } = {
    id: 'skopos-ui',
    title: 'Skopos UI',
    path: 'packages/ui',
    kind: 'application',
  },
): SkoposTaskContract => ({
  goal,
  scope: {
    query: scope.id,
    matchedBy: 'id',
    scope: {
      ...scope,
      aliases: [],
      summary: scope.title,
      confidence: 'high',
      ancestorIds: ['skopos'],
      codeRoots: [scope.path],
    },
  },
  acceptanceCriteria: [],
  nonGoals: [],
  constraints: [],
  openDecisions: [],
  requiredProof: [],
  missingFields: [],
  provenance: [],
});

const buildSkillTestOperatingModel = async (
  cwd = skoposRoot,
): Promise<SkoposAgentNativeOperatingModel> => {
  const [actions, guards] = await Promise.all([
    loadSkoposActionManifests({ cwd }),
    loadSkoposGuardManifests({ cwd }),
  ]);
  return {
    schemaVersion: 1,
    context: [],
    actions: actions.map((action) => ({ id: action.id })),
    guards: guards.map((guard) => ({ id: guard.id })),
    diagnostics: [],
  } as SkoposAgentNativeOperatingModel;
};
