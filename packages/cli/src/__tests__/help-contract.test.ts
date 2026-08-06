import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderProjectInstructions } from '../../../instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.js';
import { runSkoposCli } from '../cli/index.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('public command help contract', () => {
  it.each([
    {
      args: ['start', '--help'],
      expected: ['Proof subjects:', 'task-closure', 'project-integration'],
    },
    {
      args: ['help', 'start'],
      expected: ['Proof subjects:', 'project-integration'],
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
