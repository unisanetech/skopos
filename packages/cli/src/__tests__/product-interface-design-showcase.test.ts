import { describe, expect, it } from 'vitest';

import {
  buildShowcaseWorkerPrompt,
  renderShowcaseGallery,
  selectFreshShowcaseScenarios,
  type ProductInterfaceShowcaseScenario,
} from '../benchmarks/product-interface-design-showcase-support.js';

const scenarios: ProductInterfaceShowcaseScenario[] = ['alpha', 'beta', 'gamma'].map((id) => ({
  id,
  title: `Scenario ${id}`,
  archetype: 'test interface',
  taskPrompt: `Create ${id}.`,
  brandBrief: `Brand ${id}.`,
  requiredBehaviors: ['Change state', 'Recover safely'],
  moduleIds: ['interface-design.structure'],
}));

describe('Product Interface Design showcase', () => {
  it('selects unused scenarios and does not silently repeat the current Skill identity', () => {
    expect(selectFreshShowcaseScenarios({
      scenarios,
      usedScenarioIds: new Set(['alpha']),
      count: 2,
    }).map(({ id }) => id)).toEqual(['beta', 'gamma']);

    expect(() => selectFreshShowcaseScenarios({
      scenarios,
      usedScenarioIds: new Set(['alpha', 'beta']),
      count: 2,
    })).toThrow(/Only 1 fresh showcase scenario/);
  });

  it('requires an explicit override before rerunning a requested scenario', () => {
    expect(() => selectFreshShowcaseScenarios({
      scenarios,
      usedScenarioIds: new Set(['beta']),
      count: 1,
      requestedScenarioIds: ['beta'],
    })).toThrow(/already ran for this Skill identity/);

    expect(selectFreshShowcaseScenarios({
      scenarios,
      usedScenarioIds: new Set(['beta']),
      count: 1,
      requestedScenarioIds: ['beta'],
      allowRepeat: true,
    })[0]?.id).toBe('beta');
  });

  it('builds a candidate-only fresh-page prompt with the selected Skill guidance', () => {
    const prompt = buildShowcaseWorkerPrompt({
      scenario: scenarios[0]!,
      guidance: [{ title: 'Structure', summary: 'Make the reading order explicit.' }],
    });
    expect(prompt).toContain('deliberately minimal static project');
    expect(prompt).toContain('Create alpha.');
    expect(prompt).toContain('Make the reading order explicit.');
    expect(prompt).toContain('fresh design showcase, not a paired evaluation');
  });

  it('labels the rendered gallery as qualitative rather than promotion Evidence', () => {
    const gallery = renderShowcaseGallery({
      runId: 'showcase-test',
      packVersion: '0.5.0',
      results: [{
        scenario: scenarios[0]!,
        summary: 'Created a new interface.',
        sourcePaths: ['cases/alpha/index.html'],
        desktopScreenshotPath: 'cases/alpha/desktop.png',
        mobileScreenshotPath: 'cases/alpha/mobile.png',
        checks: { desktopHorizontalOverflow: false, mobileHorizontalOverflow: false, pageErrors: [] },
      }],
    });
    expect(gallery).toContain('Fresh candidate-only pages');
    expect(gallery).toContain('not paired efficacy or promotion Evidence');
    expect(gallery).toContain('cases/alpha/desktop.png');
    expect(gallery).toContain('cases/alpha/mobile.png');
  });

});
