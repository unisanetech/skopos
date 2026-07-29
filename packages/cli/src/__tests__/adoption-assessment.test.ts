import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildSkoposAdoptionAssessmentRuntime } from '../../../runtime/src/application/adoption/adoption.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('read-only adoption assessment', () => {
  it('records provenance-aware intake without claiming agent review or rewriting project docs', async () => {
    const workspaceRoot = await createWorkspace();
    await initSkoposProject({
      cwd: workspaceRoot,
      mode: 'existing',
      actor: 'adoption-test',
      scaffoldInstructions: false,
    });
    await expect(
      readFile(join(workspaceRoot, 'docs/00-start-here.md'), 'utf8'),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    const projectFilesBefore = await readProjectFiles(workspaceRoot);

    const result = await buildSkoposAdoptionAssessmentRuntime({
      cwd: workspaceRoot,
      actor: 'adoption-test',
    });

    expect(result).toMatchObject({
      adoptionState: 'agent-analysis-required',
      assessmentOnly: true,
      intakeWrite: 'written',
      analysisBriefWrite: 'written',
    });
    expect(result.intake.documents.length).toBeGreaterThan(0);
    expect(result.intake.codeRoots).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '.', provenance: 'observed' }),
      ]),
    );
    expect(result.intake.instructionFiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'AGENTS.md', provenance: 'observed' }),
      ]),
    );
    expect(result.intake.commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'test', provenance: 'observed' }),
      ]),
    );
    expect(result.intake.ciPaths).toEqual([
      expect.objectContaining({ path: '.github/workflows', provenance: 'observed' }),
    ]);
    expect(result.intake.generatedSourcePaths).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'docs/reference/generated',
          provenance: 'inferred',
        }),
      ]),
    );
    expect(result.intake.memoryRoleGaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: 'overview',
          status: 'present-unverified',
        }),
      ]),
    );
    expect(result.intake.authorityConflicts).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'missing-id' }),
        expect.objectContaining({ code: 'noncanonical-metadata-format' }),
      ]),
    );
    expect(result.analysisBrief.prohibitedClaims).toContain(
      'Do not call scanner output agent-reviewed.',
    );
    expect(result.analysisBrief.analysisTasks.map((task) => task.id)).toEqual([
      'separate-claims',
      'resolve-authority',
      'map-memory',
      'prepare-restructuring',
    ]);
    expect(await readProjectFiles(workspaceRoot)).toEqual(projectFilesBefore);
  });

  it('keeps dry-run assessment entirely in memory', async () => {
    const workspaceRoot = await createWorkspace();
    await initSkoposProject({
      cwd: workspaceRoot,
      mode: 'existing',
      actor: 'adoption-test',
      scaffoldInstructions: false,
    });
    const intakeBefore = await readFile(
      join(workspaceRoot, '.skopos/adoption/intake.json'),
      'utf8',
    );
    const briefBefore = await readFile(
      join(workspaceRoot, '.skopos/adoption/analysis-brief.json'),
      'utf8',
    );

    const result = await buildSkoposAdoptionAssessmentRuntime({
      cwd: workspaceRoot,
      actor: 'adoption-test',
      dryRun: true,
    });

    expect(result.intakeWrite).toBe('dry-run');
    expect(result.analysisBriefWrite).toBe('dry-run');
    expect(await readFile(result.intakePath, 'utf8')).toBe(intakeBefore);
    expect(await readFile(result.analysisBriefPath, 'utf8')).toBe(briefBefore);
  });
});

const createWorkspace = async (): Promise<string> => {
  const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-adoption-assessment-'));
  temporaryRoots.push(workspaceRoot);
  await Promise.all([
    mkdir(join(workspaceRoot, 'docs/reference/generated'), { recursive: true }),
    mkdir(join(workspaceRoot, '.github/workflows'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(workspaceRoot, 'package.json'),
      JSON.stringify({
        name: 'brownfield-fixture',
        private: true,
        scripts: {
          test: 'vitest run',
          build: 'tsc',
        },
      }),
      'utf8',
    ),
    writeFile(
      join(workspaceRoot, 'README.md'),
      '# Existing product\n\nLegacy product overview.\n',
      'utf8',
    ),
    writeFile(
      join(workspaceRoot, 'AGENTS.md'),
      '# Existing agent rules\n\nKeep project truth current.\n',
      'utf8',
    ),
    writeFile(
      join(workspaceRoot, 'docs/reference/generated/api.md'),
      '# Generated API\n',
      'utf8',
    ),
    writeFile(
      join(workspaceRoot, '.github/workflows/ci.yml'),
      'name: CI\n',
      'utf8',
    ),
  ]);

  return workspaceRoot;
};

const readProjectFiles = async (
  workspaceRoot: string,
): Promise<Record<string, string>> => ({
  'README.md': await readFile(join(workspaceRoot, 'README.md'), 'utf8'),
  'AGENTS.md': await readFile(join(workspaceRoot, 'AGENTS.md'), 'utf8'),
  'docs/reference/generated/api.md': await readFile(
    join(workspaceRoot, 'docs/reference/generated/api.md'),
    'utf8',
  ),
  '.github/workflows/ci.yml': await readFile(
    join(workspaceRoot, '.github/workflows/ci.yml'),
    'utf8',
  ),
});
