import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderProjectInstructions } from '../../../instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.js';
import { runSkoposCli, SKOPOS_CLI_VERSION } from '../cli/index.js';
import { renderSkoposCliFailure } from '../cli/shared/error-guidance.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('public command help contract', () => {
  it.each([['--version'], ['-v']])('reports the installed CLI version for %s', async (flag) => {
    const output = await captureStdout(() => runSkoposCli([flag]));
    expect(output).toBe(`${SKOPOS_CLI_VERSION}\n`);
    expect(output).toBe('0.1.0\n');
  });

  it.each([
    {
      args: ['setup', '--help'],
      expected: ['Skopos setup', 'normal project onboarding entry point', 'accept|edit|defer|reject', 'Use init only as a low-level'],
    },
    {
      args: ['start', '--help'],
      expected: ['Task risk:', '--risk <light|standard|high-impact>', 'goal, owned paths, affected Scopes', 'Fast path:', 'Proof subjects:', 'task-closure', 'project-integration'],
    },
    {
      args: ['help', 'start'],
      expected: ['Proof subjects:', 'project-integration'],
    },
    {
      args: ['decide', '--help'],
      expected: ['Skopos decide', 'exact option ids', 'recomputes the Work Queue'],
    },
    {
      args: ['actions', '--help'],
      expected: ['Skopos actions', 'workspaceMode: overlay-safe'],
    },
    {
      args: ['skills', '--help'],
      expected: ['Skopos skills', 'exact deterministic fixtures', 'canonical compact Task brief'],
    },
    {
      args: ['skills', 'context', '--help'],
      expected: ['Skopos skills context', 'module-local Skill guidance', 'zero Skill context'],
    },
    {
      args: ['actions', 'run', '--help'],
      expected: ['Skopos actions run', '--task <id>'],
    },
    {
      args: ['verify', '--help'],
      expected: ['Skopos verify', 'does not run Actions'],
    },
    {
      args: ['finish', '--help'],
      expected: ['Skopos finish', 'atomic closure'],
    },
    {
      args: ['task', '--help'],
      expected: ['Skopos task', 'ownership add', 'explicit and audited'],
    },
    {
      args: ['task', 'ownership', '--help'],
      expected: ['Skopos task ownership', '--own <path>', 'Create a follow-up Task'],
    },
    {
      args: ['impact', '--help'],
      expected: ['Skopos impact', '--why', 'selected and skipped', 'guard-decisions'],
    },
  ])('renders focused help for $args', async ({ args, expected }) => {
    const output = await captureStdout(() => runSkoposCli(args));
    for (const fragment of expected) expect(output).toContain(fragment);
  });

  it('projects proof-subject guidance into adopter instructions', () => {
    const instructions = renderProjectInstructions({
      projectName: 'Fixture',
      mode: 'existing',
      repoMode: 'single',
      archetype: 'custom',
      docsRoot: 'docs',
      docsStartHerePath: 'docs/00-start-here.md',
      commands: { typecheck: 'pnpm typecheck' },
    });

    expect(instructions).toContain('default `task-closure` proof subject');
    expect(instructions).toContain('--proof-subject project-integration');
    expect(instructions).toContain('does not absorb unrelated dirty-worktree changes');
  });

  it('renders human and JSON recovery guidance for failed commands', () => {
    const human = renderSkoposCliFailure(
      new Error('Unknown Skopos task flag: --wat.'),
      ['task', 'show', 'T-fixture', '--wat'],
    );
    const json = JSON.parse(
      renderSkoposCliFailure(
        new Error('Task T-fixture has verification blockers.'),
        ['finish', 'T-fixture', '--json'],
      ),
    );

    expect(human).toContain('What happened:');
    expect(human).toContain('Next step: skopos help task');
    expect(json).toMatchObject({
      type: 'cli-failure',
      readiness: 'blocked',
      nextCommand: 'skopos verify T-fixture . --phase closure --json',
    });
  });
});

const captureStdout = async (run: () => Promise<void>): Promise<string> => {
  const writes: string[] = [];
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    writes.push(String(chunk));
    return true;
  });
  await run();
  return writes.join('');
};
