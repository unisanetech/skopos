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
import { SKOPOS_SCOPE_KINDS } from '../../../model/src/index.js';
import {
  evaluateSkoposSkillFixturesRuntime,
  selectSkoposSkillsForTaskRuntime,
} from '../../../runtime/src/index.js';
import {
  assertSkoposSkillAcceptanceIdentityRuntime,
  buildSkoposSkillAcceptanceIdentityRuntime,
} from '../../../runtime/src/application/skills/skill-identity.service.js';
import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));

describe('Product Interface Design skill pack', () => {
  it('loads exactly three bounded, component-library-neutral capabilities', async () => {
    const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const pack = packs.find((candidate) => candidate.packId === 'ui.product-interface-design');

    expect(pack).toMatchObject({
      displayName: 'Product Interface Design',
      family: 'interface-design',
      version: '0.5.0',
      selection: {
        maximumMeasuredTokens: 2200,
        maximumModules: 3,
      },
    });
    expect(pack?.modules.map(({ id, path }) => ({ id, path }))).toEqual([
      { id: 'interface-design.structure', path: 'guidance/structure.md' },
      { id: 'interface-design.finish', path: 'guidance/finish.md' },
      { id: 'interface-design.behavior', path: 'guidance/behavior.md' },
    ]);
    expect(pack?.modules.every((module) => module.measuredTokens > 0)).toBe(true);
    expect(pack?.contextLibrary).toBeUndefined();
    expect(pack?.loadedContextLibrary).toBeUndefined();
    expect(pack?.modules.every((module) => module.positiveSignals.length > 0)).toBe(true);
    expect(
      pack?.modules.every((module) =>
        module.applicability.scopeKinds.every((kind) =>
          SKOPOS_SCOPE_KINDS.includes(kind),
        ),
      ),
    ).toBe(true);
    expect(pack?.modules.every((module) => module.rubricDimensions.length > 0)).toBe(true);
    const rubric = JSON.parse(
      await readFile(
        `${skoposRoot}/skill-packs/ui/product-interface-design/rubrics/product-interface-review.json`,
        'utf8',
      ),
    ) as { dimensions: string[]; blockingConditions: string[] };
    expect(rubric.dimensions).toEqual(
      expect.arrayContaining([
        'task-archetype and reference fit',
        'color-role clarity and product-specific character',
        'visual quietness and attention economy',
        'background, layer, and contrast architecture',
        'responsive transformation and truthful limitations',
      ]),
    );
    expect(pack?.failureSignals.map((signal) => signal.id)).toEqual(
      expect.arrayContaining([
        'failure.archetype-mismatch',
        'failure.reference-mismatch',
        'failure.color-role-ambiguity',
        'failure.attention-color-overuse',
        'failure.background-layer-confusion',
        'failure.legacy-dashboard-convergence',
        'failure.generic-ai-convergence',
      ]),
    );
    expect(pack?.fixtures.map((fixture) => fixture.category).sort()).toEqual([
      'ambiguous',
      'budget',
      'capability-locality',
      'capability-locality',
      'generated-output',
      'negative',
      'positive',
      'positive',
    ]);
    expect(pack?.fixtures.map((fixture) => fixture.fixtureId).sort()).toEqual(
      [...(pack?.proofFixtureIds ?? [])].sort(),
    );

    const finishGuidance = await readFile(
      `${skoposRoot}/skill-packs/ui/product-interface-design/guidance/finish.md`,
      'utf8',
    );
    expect(finishGuidance).toContain('Use semantic type roles');
    expect(finishGuidance).toContain('few alignment lines');
    expect(finishGuidance).toContain('one main containment treatment');
    expect(finishGuidance).toContain('canvas and persistent');
    expect(finishGuidance).toMatch(/Let type, space, alignment, and order carry hierarchy/);
    expect(finishGuidance).toContain('Large regions earn space');
    expect(finishGuidance).toMatch(/Keep icons\s+coherent and subordinate/);
    expect(finishGuidance).toContain('## Bad to Better');
    expect(finishGuidance).toContain('Card every section');
    expect(finishGuidance).toContain('Add a local hex');
    expect(finishGuidance).toContain('Approve one desktop image');
    expect(finishGuidance).not.toMatch(/Unisane|shadcn|Material UI|Radix|Tailwind/i);

    const behaviorGuidance = await readFile(
      `${skoposRoot}/skill-packs/ui/product-interface-design/guidance/behavior.md`,
      'utf8',
    );
    expect(behaviorGuidance).toContain('Inventory components');
    expect(behaviorGuidance).toContain('Prefer reuse');
    expect(behaviorGuidance).toContain('Move focus in');
    expect(behaviorGuidance).toContain('background inert');
    expect(behaviorGuidance).toContain('restore focus');
    expect(behaviorGuidance).toContain('## Bad to Better');
    expect(behaviorGuidance).toContain('Add `CheckoutBlueButton`');
    expect(behaviorGuidance).toContain('Stack the shrunken desktop UI');
    expect(behaviorGuidance).toContain('Framework guidance is conditional');
    expect(behaviorGuidance).toMatch(/Never introduce\s+React/);
    expect(behaviorGuidance).not.toMatch(/Unisane|shadcn|Material UI|Radix|Tailwind/i);

    expect(rubric.blockingConditions).toEqual(expect.arrayContaining([
      expect.stringContaining('modal drawer or dialog omits focus transfer'),
      expect.stringContaining('local scrollbar, clipped control row'),
      expect.stringContaining('states are visually indistinguishable'),
      expect.stringContaining('icon size or stroke weight'),
      expect.stringContaining('task evidence, decision, or action value'),
    ]));

    const structureGuidance = await readFile(
      `${skoposRoot}/skill-packs/ui/product-interface-design/guidance/structure.md`,
      'utf8',
    );
    expect(structureGuidance).toContain('Give each string one role');
    expect(structureGuidance).toContain('Actions name a verb and outcome');
    expect(structureGuidance).toContain('Errors state what happened');
    expect(structureGuidance).toContain('## Bad to Better');
    expect(structureGuidance).toContain('Save billing address');
    expect(structureGuidance).toContain("You don't have permission to edit this workspace");
    expect(structureGuidance).toContain('Your work is preserved—try again');
    expect(structureGuidance).toContain('Invitation sent to maya@example.com');
    expect(structureGuidance).toContain('Webhook returned HTTP 500');
    expect(structureGuidance).not.toMatch(/Unisane|shadcn|Material UI|Radix|Tailwind/i);
  });

  it('keeps the accepted project binding aligned to the pack version', async () => {
    const bindings = await loadSkoposProjectSkillBindings({ cwd: skoposRoot });

    expect(
      bindings.find((binding) => binding.packId === 'ui.product-interface-design'),
    ).toMatchObject({
      packVersion: '0.5.0',
      lifecycle: 'accepted',
    });
  });

  it('executes every declared fixture against the candidate pack and binding', async () => {
    const result = await evaluateSkoposSkillFixturesRuntime({
      cwd: skoposRoot,
      pack: 'ui.product-interface-design',
      binding: 'skopos.ui.product-interface-design',
      dryRun: true,
    });

    expect(result.artifact).toMatchObject({
      authority: 'generated',
      type: 'skill-fixture-evaluation',
      passed: 8,
      failed: 0,
      identity: {
        packSourceDigest: expect.stringMatching(/^sha256:/),
        bindingSourceDigest: expect.stringMatching(/^sha256:/),
        projectSourceDigest: expect.stringMatching(/^sha256:/),
        capabilityCatalogDigest: expect.stringMatching(/^sha256:/),
        evaluationSourceDigest: expect.stringMatching(/^sha256:/),
        combinedDigest: expect.stringMatching(/^sha256:/),
      },
    });
    expect(result.artifact.results).toHaveLength(8);
    expect(result.artifact.results.every((fixture) => fixture.status === 'pass')).toBe(true);
  });

  it('rejects missing and undeclared fixture manifests', async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'skopos-skill-fixtures-'));
    const temporaryPackDirectory = join(
      temporaryRoot,
      'skill-packs',
      'ui',
      'product-interface-design',
    );
    await cp(
      join(skoposRoot, 'skill-packs/ui/product-interface-design'),
      temporaryPackDirectory,
      { recursive: true },
    );
    const undeclaredFixturePath = join(
      temporaryPackDirectory,
      'fixtures/undeclared.fixture.json',
    );
    const sourceFixturePath = join(
      temporaryPackDirectory,
      'fixtures/positive-hierarchy.fixture.json',
    );
    await writeFile(
      undeclaredFixturePath,
      `${JSON.stringify({
        ...(JSON.parse(
          await readFile(sourceFixturePath, 'utf8'),
        ) as Record<string, unknown>),
        id: 'skill-selection-fixture.undeclared-fixture',
        fixtureId: 'undeclared-fixture',
      }, null, 2)}\n`,
      'utf8',
    );

    await expect(loadSkoposSkillPacks({ cwd: temporaryRoot })).rejects.toThrow(
      /fixture declarations do not match discovered manifests.*Undeclared: undeclared-fixture/,
    );
    await rm(undeclaredFixturePath);

    const packPath = join(temporaryPackDirectory, 'pack.json');
    const pack = JSON.parse(await readFile(packPath, 'utf8')) as {
      proofFixtureIds: string[];
    };
    pack.proofFixtureIds.push('missing-fixture');
    await writeFile(packPath, `${JSON.stringify(pack, null, 2)}\n`, 'utf8');
    await expect(loadSkoposSkillPacks({ cwd: temporaryRoot })).rejects.toThrow(
      /fixture declarations do not match discovered manifests.*Missing: missing-fixture/,
    );

    pack.proofFixtureIds = pack.proofFixtureIds.filter(
      (fixtureId) => fixtureId !== 'missing-fixture',
    );
    await writeFile(packPath, `${JSON.stringify(pack, null, 2)}\n`, 'utf8');
    await cp(
      sourceFixturePath,
      join(temporaryPackDirectory, 'fixtures/duplicate.fixture.json'),
    );
    await expect(loadSkoposSkillPacks({ cwd: temporaryRoot })).rejects.toThrow(
      /Duplicate skill fixture id: ui-product-interface-design-positive-hierarchy/,
    );
    await rm(temporaryRoot, { recursive: true, force: true });
  });

  it('rejects noncanonical pseudo-Scope kinds in packed manifests', async () => {
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'skopos-skill-scope-kind-'));
    const temporaryPackDirectory = join(
      temporaryRoot,
      'skill-packs',
      'ui',
      'product-interface-design',
    );
    await cp(
      join(skoposRoot, 'skill-packs/ui/product-interface-design'),
      temporaryPackDirectory,
      { recursive: true },
    );
    const packPath = join(temporaryPackDirectory, 'pack.json');
    const pack = JSON.parse(await readFile(packPath, 'utf8')) as {
      modules: Array<{ applicability: { scopeKinds: string[] } }>;
    };
    pack.modules[0]!.applicability.scopeKinds = ['frontend'];
    await writeFile(packPath, `${JSON.stringify(pack, null, 2)}\n`, 'utf8');

    try {
      await expect(loadSkoposSkillPacks({ cwd: temporaryRoot })).rejects.toThrow();
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
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
        'interface-design.behavior',
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
        moduleId: 'interface-design.behavior',
        outcome: 'selected',
        reasonCode: 'selected',
      }),
    );
  });

  it('projects each project design-system binding and reports missing conformance honestly', async () => {
    const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const bindings = await loadSkoposProjectSkillBindings({ cwd: skoposRoot });
    const pack = packs.find((candidate) => candidate.packId === 'ui.product-interface-design');
    const binding = bindings.find((candidate) => candidate.packId === 'ui.product-interface-design');
    if (!pack || !binding) throw new Error('Product Interface Design candidate sources are missing.');

    const task = buildSkillTestTask(
      'Compose rendered navigation, tabs, buttons, and a data table from the project component catalog and semantic design tokens.',
    );
    task.acceptanceCriteria.push(
      'Reuse matching controls and explain every custom primitive or local visual token.',
    );
    const baseOperatingModel = await buildSkillTestOperatingModel();
    const selectWith = async ({
      bindingId,
      catalogPath,
      tokenPath,
      inventoryAction,
      conformanceGuard,
      adaptationNotes = [],
    }: {
      bindingId: string;
      catalogPath: string;
      tokenPath: string;
      inventoryAction?: string;
      conformanceGuard?: string;
      adaptationNotes?: string[];
    }) => {
      const candidateBinding = {
        ...binding,
        bindingId,
        sourceBindings: {
          ...binding.sourceBindings,
          'component-catalog': [catalogPath],
          'design-tokens': [tokenPath],
        },
        actionBindings: {
          ...binding.actionBindings,
          ...(inventoryAction ? { 'design-system-inventory': inventoryAction } : {}),
        },
        guardBindings: {
          ...binding.guardBindings,
          ...(conformanceGuard ? { 'design-system-conformance': conformanceGuard } : {}),
        },
        adaptationNotes,
        acceptance: undefined,
      };
      const operatingModel = {
        ...baseOperatingModel,
        actions: [
          ...baseOperatingModel.actions,
          ...(inventoryAction ? [{ id: inventoryAction }] : []),
        ],
        guards: [
          ...baseOperatingModel.guards,
          ...(conformanceGuard ? [{ id: conformanceGuard }] : []),
        ],
      } as SkoposAgentNativeOperatingModel;
      return selectSkoposSkillsForTaskRuntime({
        cwd: skoposRoot,
        taskId: `T-${bindingId}`,
        cacheMode: 'bypass',
        task,
        taskRisk: 'standard',
        changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
        affectedCapabilities: ['component-library', 'design-tokens'],
        operatingModel,
        candidateSkill: {
          pack,
          binding: candidateBinding,
          projectLifecycle: 'established-brownfield',
        },
      });
    };

    const alpha = await selectWith({
      bindingId: 'project.alpha.ui-product-interface-design',
      catalogPath: 'packages/ui/src',
      tokenPath: 'packages/ui/src/app/styles.css',
      inventoryAction: 'project.alpha.design-system-inventory',
      conformanceGuard: 'project.alpha.design-system-conformance',
    });
    const beta = await selectWith({
      bindingId: 'project.beta.ui-product-interface-design',
      catalogPath: 'docs/00-start-here.md',
      tokenPath: 'docs/standards/terminology.md',
      inventoryAction: 'project.beta.design-system-inventory',
      conformanceGuard: 'project.beta.design-system-conformance',
    });

    for (const [result, expected] of [
      [alpha, {
        catalogPath: 'packages/ui/src',
        inventoryAction: 'project.alpha.design-system-inventory',
        conformanceGuard: 'project.alpha.design-system-conformance',
      }],
      [beta, {
        catalogPath: 'docs/00-start-here.md',
        inventoryAction: 'project.beta.design-system-inventory',
        conformanceGuard: 'project.beta.design-system-conformance',
      }],
    ] as const) {
      const selected = result.selectedSkills[0];
      expect(selected?.selectedModuleIds).toContain(
        'interface-design.behavior',
      );
      expect(selected?.adaptation.sourceBindings['component-catalog']).toEqual([
        expected.catalogPath,
      ]);
      expect(selected?.adaptation.actionBindings['design-system-inventory']).toBe(
        expected.inventoryAction,
      );
      expect(selected?.adaptation.guardBindings['design-system-conformance']).toBe(
        expected.conformanceGuard,
      );
      expect(selected?.adaptation.gaps).not.toContainEqual(
        expect.objectContaining({ role: 'design-system-conformance' }),
      );
      expect(selected?.selectedContext[0]).toMatchObject({
        id: 'skill:ui.product-interface-design:project-adaptation',
      });
      expect(selected?.selectedContext[0]?.summary).toContain(expected.catalogPath);
      expect(selected?.selectedContext[0]?.summary).toContain(expected.inventoryAction);
      expect(selected?.selectedContext[0]?.summary).toContain(expected.conformanceGuard);
    }

    const projectWithoutAutomatedConformance = await selectWith({
      bindingId: 'project.no-automation.ui-product-interface-design',
      catalogPath: 'docs/00-start-here.md',
      tokenPath: 'docs/standards/terminology.md',
      adaptationNotes: [
        'This project has no shared component package; this source records its local component authority.',
      ],
    });
    const selected = projectWithoutAutomatedConformance.selectedSkills[0];
    expect(selected?.adaptation.gaps).toEqual(expect.arrayContaining([
      expect.objectContaining({ roleKind: 'action', role: 'design-system-inventory' }),
      expect.objectContaining({ roleKind: 'guard', role: 'design-system-conformance' }),
    ]));
    expect(selected?.selectedContext[0]?.summary).toContain(
      'Missing Actions or Guards are limitations, not proof.',
    );
    expect(selected?.adaptation.notes).toContain(
      'This project has no shared component package; this source records its local component authority.',
    );
  });

  it('suppresses keyword overlap without relevant UI applicability', async () => {
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-backend-suppression',
      cacheMode: 'bypass',
      task: buildSkillTestTask(
        'Refactor the backend rendering adapter while preserving product interface hierarchy and layout.',
        {
        id: 'skopos-runtime',
        title: 'Skopos Runtime',
        path: 'packages/runtime',
        kind: 'service',
        },
      ),
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
    task.constraints.push(
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
        (entry) => entry.moduleId === 'interface-design.structure',
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
        'Rewrite interface labels, errors, empty states, typography, spacing, alignment, and responsive recovery.',
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
    expect(moduleCount).toBe(3);
    expect(result.explanations).not.toContainEqual(
      expect.objectContaining({
        reasonCode: expect.stringMatching(/^(module|token)-budget-exhausted$/),
      }),
    );
  });

  it('keeps one focused capability intact inside the light Task budget', async () => {
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      taskId: 'T-skill-light-budget',
      cacheMode: 'bypass',
      task: buildSkillTestTask(
        'Rewrite the interface labels, action wording, and error guidance.',
      ),
      taskRisk: 'light',
      changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
      operatingModel: await buildSkillTestOperatingModel(),
    });

    expect(
      result.selectedSkills.flatMap((skill) => skill.selectedModuleIds),
    ).toEqual(['interface-design.structure']);
    expect(
      result.selectedSkills.reduce(
        (total, skill) => total + skill.measuredContextTokens,
        0,
      ),
    ).toBeLessThanOrEqual(800);
    expect(result.explanations).not.toContainEqual(
      expect.objectContaining({
        moduleId: 'interface-design.structure',
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
    const temporaryPackDirectory = join(temporaryRoot, 'product-interface-design');
    const temporaryProjectSource = join(temporaryRoot, 'project-source.md');
    await cp(
      join(skoposRoot, 'skill-packs/ui/product-interface-design'),
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

      const guidancePath = join(temporaryPackDirectory, 'guidance/structure.md');
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

      const fixturePath = join(
        temporaryPackDirectory,
        'fixtures/positive-hierarchy.fixture.json',
      );
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
        `${skoposRoot}/skill-packs/ui/product-interface-design/pack.json`,
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
