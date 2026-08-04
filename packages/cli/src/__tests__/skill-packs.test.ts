import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadSkoposProjectSkillBindings,
  loadSkoposSkillPacks,
} from '../../../indexer/src/index.js';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposTaskContract,
} from '../../../model/src/index.js';
import { selectSkoposSkillsForTaskRuntime } from '../../../runtime/src/index.js';
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
    const operatingModel = buildSkillTestOperatingModel();

    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
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
      task: buildSkillTestTask('Refactor the backend rendering adapter.', {
        id: 'skopos-runtime',
        title: 'Skopos Runtime',
        path: 'packages/runtime',
        kind: 'service',
      }),
      taskRisk: 'standard',
      changedPaths: ['packages/runtime/src/adapters/database.ts'],
      operatingModel: buildSkillTestOperatingModel(),
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
      task: buildSkillTestTask('Refresh the product interface rendering output.'),
      taskRisk: 'standard',
      changedPaths: ['.cache/generated/product-page.tsx'],
      operatingModel: buildSkillTestOperatingModel(),
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
      task,
      taskRisk: 'standard',
      changedPaths: ['packages/ui/src/app/page.tsx'],
      operatingModel: buildSkillTestOperatingModel(),
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
      task: buildSkillTestTask(
        'Rewrite interface labels, errors, empty states, typography, spacing, and responsive recovery.',
      ),
      taskRisk: 'standard',
      changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
      operatingModel: buildSkillTestOperatingModel(),
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
      task: buildSkillTestTask('Rewrite the interface labels and action wording.'),
      taskRisk: 'light',
      changedPaths: ['packages/ui/src/screens/settings-page.tsx'],
      operatingModel: buildSkillTestOperatingModel(),
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

const buildSkillTestOperatingModel = (): SkoposAgentNativeOperatingModel => ({
  schemaVersion: 1,
  context: [],
  actions: [
    { id: 'ui.build-console-app' },
    { id: 'quality.run-proof-phase' },
  ],
  guards: [
    { id: 'quality.typecheck' },
    { id: 'quality.focused-behavior-proof' },
  ],
  diagnostics: [],
} as SkoposAgentNativeOperatingModel);
