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
    const task = {
      goal: 'Narrow the hydration boundary.',
      scope: {
        scope: {
          id: 'skopos-ui',
          title: 'Skopos UI',
          path: 'packages/ui',
        },
      },
    } as SkoposTaskContract;
    const operatingModel = {
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
    } as SkoposAgentNativeOperatingModel;

    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: skoposRoot,
      task,
      taskRisk: 'standard',
      changedPaths: ['packages/ui/src/app/styles.css'],
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
