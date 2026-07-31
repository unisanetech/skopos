import { describe, expect, it } from 'vitest';

import { renderProjectInstructions } from '../../../instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.js';

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
        'finish',
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

  it('renders only executable current Task and closure commands', () => {
    const instructions = renderProjectInstructions({
      projectName: 'Fixture',
      mode: 'existing',
      repoMode: 'single',
      archetype: 'custom',
      docsRoot: 'docs',
      docsStartHerePath: 'docs/00-start-here.md',
      commands: {},
    });

    expect(instructions).toContain('skopos task show <task-id> . --json');
    expect(instructions).toContain('skopos finish <task-id> . --actor <id>');
    expect(instructions).not.toContain('skopos task current');
    expect(instructions).not.toContain('skopos done');
    expect(instructions).not.toContain('skopos trust');
  });
});
