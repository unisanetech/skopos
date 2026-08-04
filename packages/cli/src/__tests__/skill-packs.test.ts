import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  loadSkoposProjectSkillBindings,
  loadSkoposSkillPacks,
} from '../../../indexer/src/index.js';
import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));

describe('product UI craft skill pack', () => {
  it('loads a bounded, component-library-neutral polish module', async () => {
    const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const pack = packs.find((candidate) => candidate.packId === 'ui.product-craft');

    expect(pack).toMatchObject({
      version: '0.4.0',
      selection: {
        maximumContextTokens: 2200,
        maximumModules: 3,
      },
    });
    expect(pack?.contextModules).toContainEqual(
      expect.objectContaining({
        id: 'ui-craft.visual-composition-and-polish',
        path: 'guidance/visual-composition-and-polish.md',
      }),
    );
    expect(pack?.contextModules).toContainEqual(
      expect.objectContaining({
        id: 'ui-craft.component-architecture-and-naming',
        path: 'guidance/component-architecture-and-naming.md',
      }),
    );
    expect(pack?.contextModules).toContainEqual(
      expect.objectContaining({
        id: 'ui-craft.human-interface-writing',
        path: 'guidance/human-interface-writing.md',
      }),
    );

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
      packVersion: '0.4.0',
      lifecycle: 'accepted',
    });
  });
});
