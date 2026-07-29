import { access, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  createDefaultSkoposConfig,
  writeSkoposConfig,
} from '../../../config/src/index.js';
import type { SkoposRootConfig } from '../../../model/src/index.js';
import { writeSkoposProjectArtifact } from '../../../runtime/src/application/agent-native/project-artifact.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { validateSkoposProjectArtifact } from '../../../verification/src/application/project-artifact/project-artifact.service.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

interface InvalidConfigPathCase {
  name: string;
  configure: (config: SkoposRootConfig) => void;
  expectedError: string;
}

const invalidConfigPathCases: InvalidConfigPathCase[] = [
  {
    name: 'workspace ignore path',
    configure: (config) => {
      config.workspace.ignore = ['../fixtures'];
    },
    expectedError: 'Skopos workspace ignore path must stay inside the workspace: ../fixtures',
  },
  {
    name: 'memory root',
    configure: (config) => {
      config.docs.root = '../../docs';
    },
    expectedError: 'Skopos memory root must stay inside the workspace: ../../docs',
  },
  {
    name: 'drive-relative memory root',
    configure: (config) => {
      config.docs.root = 'C:outside';
    },
    expectedError: 'Skopos memory root must stay inside the workspace: C:outside',
  },
  {
    name: 'docs start-here path',
    configure: (config) => {
      config.docs.startHerePath = '../00-start-here.md';
    },
    expectedError:
      'Skopos docs start-here path must stay inside the workspace: ../00-start-here.md',
  },
  {
    name: 'canonical instructions path',
    configure: (config) => {
      config.agents.canonicalInstructions = '../../AGENTS.md';
    },
    expectedError:
      'Skopos canonical instructions path must stay inside the workspace: ../../AGENTS.md',
  },
  {
    name: 'instruction mirror path',
    configure: (config) => {
      config.agents.syncMirrors = ['../../CLAUDE.md'];
    },
    expectedError:
      'Skopos instruction mirror path must stay inside the workspace: ../../CLAUDE.md',
  },
  {
    name: 'start-here path outside its memory root',
    configure: (config) => {
      config.docs.startHerePath = 'reference/00-start-here.md';
    },
    expectedError:
      'Skopos docs start-here path must stay inside the configured memory root docs: reference/00-start-here.md',
  },
  {
    name: 'start-here path equal to its memory root',
    configure: (config) => {
      config.docs.startHerePath = 'docs';
    },
    expectedError:
      'Skopos docs start-here path must stay inside the configured memory root docs: docs',
  },
];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('root config workspace containment', () => {
  it.each(invalidConfigPathCases)(
    'rejects an escaped $name before writing config',
    async ({ configure, expectedError }) => {
      const workspaceRoot = await createTemporaryRoot('skopos-invalid-config-');
      const configPath = join(workspaceRoot, 'skopos.config.yaml');
      const config = createDefaultSkoposConfig({
        projectName: 'invalid-project',
        archetype: 'library',
        repoMode: 'single',
        projectMode: 'new-project',
      });
      configure(config);

      await expect(writeSkoposConfig(configPath, config)).rejects.toThrow(expectedError);
      expect(await pathExists(configPath)).toBe(false);
    },
  );

  it('accepts explicit paths contained by the workspace and memory root', async () => {
    const workspaceRoot = await createTemporaryRoot('skopos-local-config-');
    const configPath = join(workspaceRoot, 'skopos.config.yaml');
    const config = createDefaultSkoposConfig({
      projectName: 'local-project',
      archetype: 'library',
      repoMode: 'single',
      projectMode: 'new-project',
    });
    config.workspace.ignore = ['fixtures', 'packages/*'];
    config.docs.root = 'project-docs';
    config.docs.startHerePath = 'project-docs/00-start-here.md';
    config.agents.canonicalInstructions = '.agents/AGENTS.md';
    config.agents.syncMirrors = ['CLAUDE.md', '.cursor/rules/project.mdc'];

    await writeSkoposConfig(configPath, config);

    expect(await pathExists(configPath)).toBe(true);
    expect(await readFile(configPath, 'utf8')).toContain(
      'startHerePath: project-docs/00-start-here.md',
    );
  });

  it.each([false, true])(
    'rejects inferred parent memory before any init mutation (dryRun=%s)',
    async (dryRun) => {
      const workspaceRoot = await createTemporaryRoot('skopos-nested-init-');
      const targetRoot = join(workspaceRoot, 'packages/api');
      await Promise.all([
        mkdir(join(workspaceRoot, 'docs'), { recursive: true }),
        mkdir(targetRoot, { recursive: true }),
      ]);
      await Promise.all([
        writeFile(
          join(workspaceRoot, 'package.json'),
          JSON.stringify({
            name: 'nested-workspace',
            private: true,
            workspaces: ['packages/*'],
          }),
          'utf8',
        ),
        writeFile(
          join(targetRoot, 'package.json'),
          JSON.stringify({
            name: '@fixture/api',
            private: true,
          }),
          'utf8',
        ),
        writeFile(join(workspaceRoot, 'AGENTS.md'), '# Parent instructions\n', 'utf8'),
        writeFile(join(workspaceRoot, 'docs/00-start-here.md'), '# Parent docs\n', 'utf8'),
      ]);
      const instructionsBefore = await readFile(join(workspaceRoot, 'AGENTS.md'), 'utf8');
      const docsBefore = await readFile(join(workspaceRoot, 'docs/00-start-here.md'), 'utf8');

      await expect(initSkoposProject({ cwd: targetRoot, dryRun })).rejects.toThrow(
        'Skopos memory root must stay inside the workspace: ../../docs',
      );

      expect(await pathExists(join(targetRoot, 'skopos.config.yaml'))).toBe(false);
      expect(await pathExists(join(targetRoot, '.gitignore'))).toBe(false);
      expect(await pathExists(join(targetRoot, '.skopos'))).toBe(false);
      expect(await readFile(join(workspaceRoot, 'AGENTS.md'), 'utf8')).toBe(instructionsBefore);
      expect(await readFile(join(workspaceRoot, 'docs/00-start-here.md'), 'utf8')).toBe(docsBefore);
    },
  );
});

describe('project artifact ownership', () => {
  it('keeps brownfield discovery readable until strict Project Memory adoption is accepted', () => {
    const brownfield = createDefaultSkoposConfig({
      projectName: 'existing-project',
      archetype: 'library',
      repoMode: 'single',
      projectMode: 'brownfield',
    });
    const greenfield = createDefaultSkoposConfig({
      projectName: 'new-project',
      archetype: 'library',
      repoMode: 'single',
      projectMode: 'new-project',
    });

    expect(brownfield.docs).toEqual(
      expect.objectContaining({
        strictMetadata: false,
        strictLinking: false,
      }),
    );
    expect(greenfield.docs).toEqual(
      expect.objectContaining({
        strictMetadata: true,
        strictLinking: true,
      }),
    );
  });

  it('declares only tracked sources and the complete disposable local family', async () => {
    const workspaceRoot = await createWorkspace();
    const result = await writeSkoposProjectArtifact({ workspaceRoot });

    expect(validateSkoposProjectArtifact(result.artifact)).toEqual({
      status: 'pass',
      diagnostics: [],
    });
    expect(result.artifact.trackedRoots).toEqual([
      'AGENTS.md',
      'docs',
      'skopos.config.yaml',
      'tools/skopos',
    ]);
    expect(result.artifact.localState).toEqual({
      root: '.skopos',
      families: [
        'index',
        'graph',
        'sessions',
        'tasks',
        'evidence',
        'handoffs',
        'runs',
        'ui',
        'coordination.sqlite',
        'cache',
      ],
    });
    expect(result.artifact.sourceState.files.every((file) => !file.path.startsWith('.skopos/'))).toBe(true);
  });

  it('is byte-deterministic across clone roots and changes when tracked content changes', async () => {
    const firstRoot = await createWorkspace();
    const secondRoot = await createWorkspace();

    const first = await writeSkoposProjectArtifact({ workspaceRoot: firstRoot });
    const second = await writeSkoposProjectArtifact({ workspaceRoot: secondRoot });
    const firstContents = await readFile(join(firstRoot, '.skopos/project.json'), 'utf8');
    const secondContents = await readFile(join(secondRoot, '.skopos/project.json'), 'utf8');

    expect(second.artifact.sourceState.digest).toBe(first.artifact.sourceState.digest);
    expect(secondContents).toBe(firstContents);

    await writeFile(join(secondRoot, 'docs/overview.md'), '# Changed project\n', 'utf8');
    const changed = await writeSkoposProjectArtifact({ workspaceRoot: secondRoot });
    expect(changed.artifact.sourceState.digest).not.toBe(first.artifact.sourceState.digest);
  });
});

const createWorkspace = async (): Promise<string> => {
  const workspaceRoot = await createTemporaryRoot('skopos-project-artifact-');
  await Promise.all([
    mkdir(join(workspaceRoot, 'docs'), { recursive: true }),
    mkdir(join(workspaceRoot, 'tools/skopos'), { recursive: true }),
  ]);
  await writeSkoposConfig(
    join(workspaceRoot, 'skopos.config.yaml'),
    createDefaultSkoposConfig({
      projectName: 'proof-project',
      archetype: 'library',
      repoMode: 'single',
      projectMode: 'new-project',
    }),
  );
  await Promise.all([
    writeFile(join(workspaceRoot, 'AGENTS.md'), '# Project instructions\n', 'utf8'),
    writeFile(join(workspaceRoot, 'docs/overview.md'), '# Project\n', 'utf8'),
    writeFile(join(workspaceRoot, 'tools/skopos/policies.yaml'), 'schemaVersion: 1\nacceptedPacks: []\n', 'utf8'),
  ]);
  return workspaceRoot;
};

const createTemporaryRoot = async (prefix: string): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), prefix));
  temporaryRoots.push(workspaceRoot);
  return workspaceRoot;
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
