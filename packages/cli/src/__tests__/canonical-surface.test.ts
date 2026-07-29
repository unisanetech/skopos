import { describe, expect, it } from 'vitest';

import { skoposCliCommandRegistry } from '../cli/registry.js';

describe('canonical CLI surface', () => {
  it('exposes one first-release work and proof vocabulary', () => {
    expect(Object.keys(skoposCliCommandRegistry)).toEqual(
      expect.arrayContaining([
        'adopt',
        'session',
        'start',
        'task',
        'work',
        'decide',
        'actions',
        'guards',
        'evidence',
        'verify',
        'readiness',
        'coordination',
      ]),
    );
    expect(Object.keys(skoposCliCommandRegistry)).not.toEqual(
      expect.arrayContaining([
        'mission',
        'program',
        'workflows',
        'gates',
        'eval',
        'trust',
        'done',
        'next',
      ]),
    );
  });
});
