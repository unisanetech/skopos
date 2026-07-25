import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import type {
  SkoposAgentNativeOperatingModel,
  SkoposResolvedSkillArtifact,
  SkoposTaskContract,
} from '@skopos/model';
import {
  applySkoposSkillPackRuntime,
  listSkoposSkillPacksRuntime,
  selectSkoposSkillsForTaskRuntime,
} from '../../../runtime/src/application/skills/skills.service.js';
import { describe, expect, it } from 'vitest';

const repositoryRoot = resolve(import.meta.dirname, '../../../..');

describe('project-adapted skill packs', () => {
  it('loads the Product UI Craft example as a strict Skopos pack', async () => {
    const packs = await listSkoposSkillPacksRuntime({ cwd: repositoryRoot });

    expect(packs).toContainEqual(
      expect.objectContaining({
        packId: 'ui.product-craft',
        family: 'ui-craft',
        authorityBoundary: {
          workflowAuthority: 'skopos',
          taskStateAuthority: 'skopos',
          closureAuthority: 'skopos',
        },
      }),
    );
  });

  it('selects bounded UI guidance and existing capabilities only for relevant tasks', async () => {
    const fixtureRoot = await createProjectFixture();
    const uiSelection = await selectSkoposSkillsForTaskRuntime({
      cwd: fixtureRoot,
      task: task('Build a responsive customer dashboard with human interface copy'),
      riskLane: 'normal',
      operatingModel,
    });
    const backendSelection = await selectSkoposSkillsForTaskRuntime({
      cwd: fixtureRoot,
      task: task('Refactor backend infrastructure data processing internals'),
      riskLane: 'normal',
      operatingModel,
    });

    expect(uiSelection.diagnostics).toEqual([]);
    expect(uiSelection.selectedSkills).toHaveLength(1);
    expect(uiSelection.selectedSkills[0]).toEqual(
      expect.objectContaining({
        packId: 'ui.product-craft',
        bindingId: 'fixture.ui.product-craft',
        selectedActionIds: ['ui.capture'],
        selectedGuardIds: ['ui.typecheck'],
        estimatedContextTokens: 1350,
      }),
    );
    expect(uiSelection.selectedSkills[0]?.selectedModuleIds).toHaveLength(3);
    expect(uiSelection.selectedSkills[0]?.selectedContext).toSatisfy(
      (entries: Array<{ kind: string }>) => entries.every((entry) => entry.kind === 'skill'),
    );
    expect(backendSelection.selectedSkills).toEqual([]);
  });

  it('requires explicit adoption and records the accepted pack without creating workflow state', async () => {
    const fixtureRoot = await createProjectFixture(false);

    await expect(
      applySkoposSkillPackRuntime({
        cwd: fixtureRoot,
        pack: 'ui.product-craft',
        binding: 'fixture.ui.product-craft',
        actor: '',
        reason: 'Project owner approved the adapted UI capability.',
      }),
    ).rejects.toThrow('explicit actor');

    const result = await applySkoposSkillPackRuntime({
      cwd: fixtureRoot,
      pack: 'ui.product-craft',
      binding: 'fixture.ui.product-craft',
      actor: 'test-agent',
      reason: 'Project owner approved the adapted UI capability.',
    });
    const persisted = JSON.parse(
      await readFile(join(fixtureRoot, '.skopos/skills/resolved.json'), 'utf8'),
    ) as SkoposResolvedSkillArtifact;

    expect(result.artifact.acceptedSkills).toEqual([
      expect.objectContaining({
        packId: 'ui.product-craft',
        bindingId: 'fixture.ui.product-craft',
        acceptedBy: 'test-agent',
      }),
    ]);
    expect(persisted.acceptedSkills).toEqual(result.artifact.acceptedSkills);
    expect(persisted).not.toHaveProperty('missionId');
    expect(persisted).not.toHaveProperty('workflowId');
    expect(result.projections).toHaveLength(5);
    expect([...new Set(result.projections.map((projection) => projection.sourceDigest))]).toHaveLength(1);
    for (const projection of result.projections) {
      expect(projection.sourceAuthority).toBe('skopos-resolved-skills');
      expect(projection.acceptedSkillPackIds).toEqual(['ui.product-craft']);
      expect(projection.skills[0]).toEqual(
        expect.objectContaining({
          packId: 'ui.product-craft',
          bindingId: 'fixture.ui.product-craft',
          capabilities: {
            actionIds: ['ui.capture'],
            guardIds: ['ui.typecheck'],
          },
        }),
      );
      expect(
        JSON.parse(
          await readFile(
            join(fixtureRoot, `.skopos/skills/projections/${projection.hostId}.json`),
            'utf8',
          ),
        ),
      ).toEqual(projection);
    }
  });
});

const createProjectFixture = async (accepted = true): Promise<string> => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'skopos-skill-pack-'));
  await cp(
    join(repositoryRoot, 'skill-packs/ui/product-craft'),
    join(fixtureRoot, 'skill-packs/ui/product-craft'),
    { recursive: true },
  );
  const binding = {
    schemaVersion: 1,
    id: 'project-skill-binding.fixture.ui.product-craft',
    type: 'project-skill-binding',
    status: 'active',
    authority: 'canonical',
    summary: 'Fixture binding.',
    updatedAt: '2026-07-25',
    bindingId: 'fixture.ui.product-craft',
    packId: 'ui.product-craft',
    packVersion: '0.1.0',
    lifecycle: 'adapted',
    sourceBindings: {
      'brand-doctrine': ['docs/brand.md'],
      'design-tokens': ['src/styles.css'],
      'component-catalog': ['src/components'],
    },
    actionBindings: {
      'responsive-visual-capture': 'ui.capture',
    },
    guardBindings: {
      'frontend-type-safety': 'ui.typecheck',
    },
    adaptationNotes: ['Fixture sources are project-owned.'],
  };
  await writeFixtureFile(
    fixtureRoot,
    'tools/skopos/skills/ui.product-craft.json',
    `${JSON.stringify(binding, null, 2)}\n`,
  );
  await writeFixtureFile(fixtureRoot, 'docs/brand.md', '# Brand\n');
  await writeFixtureFile(fixtureRoot, 'src/styles.css', ':root {}\n');
  await mkdir(join(fixtureRoot, 'src/components'), { recursive: true });
  await writeFixtureFile(
    fixtureRoot,
    'tools/skopos/workflows/ui-capture.yaml',
    [
      'id: ui.capture',
      'title: Capture responsive UI evidence',
      'description: Capture project-owned responsive UI evidence.',
      'category: quality-check',
      'scope:',
      '  - workspace',
      'command: pnpm test',
      'cwd: .',
      'inputs:',
      '  - src',
      'outputs: []',
      'affects: []',
      'safety: read-only',
      'requiresApproval: false',
      'whenToUse: Run for relevant UI changes.',
      'requiredForDone: false',
      'recommendedAfter: []',
      'owner: fixture',
      '',
    ].join('\n'),
  );
  await writeFixtureFile(
    fixtureRoot,
    '.skopos/gates/resolved.json',
    `${JSON.stringify({ gates: [{ id: 'ui.typecheck' }] }, null, 2)}\n`,
  );

  if (accepted) {
    const acceptedAt = '2026-07-25T00:00:00.000Z';
    await writeFixtureFile(
      fixtureRoot,
      '.skopos/skills/resolved.json',
      `${JSON.stringify(
        {
          schemaVersion: 1,
          id: 'resolved-skills',
          type: 'resolved-skills',
          status: 'generated',
          authority: 'generated',
          summary: 'One accepted skill.',
          updatedAt: acceptedAt,
          generatedAt: acceptedAt,
          workspaceRoot: fixtureRoot,
          acceptedSkills: [
            {
              packId: 'ui.product-craft',
              version: '0.1.0',
              bindingId: 'fixture.ui.product-craft',
              acceptedAt,
              acceptedBy: 'project-owner',
              reason: 'Accepted for fixture.',
              sourcePath: 'skill-packs/ui/product-craft/pack.json',
              bindingPath: 'tools/skopos/skills/ui.product-craft.json',
            },
          ],
          sourcePaths: ['skill-packs/ui/product-craft/pack.json'],
          bindingPaths: ['tools/skopos/skills/ui.product-craft.json'],
        } satisfies SkoposResolvedSkillArtifact,
        null,
        2,
      )}\n`,
    );
  }
  return fixtureRoot;
};

const writeFixtureFile = async (
  fixtureRoot: string,
  relativePath: string,
  contents: string,
): Promise<void> => {
  const target = join(fixtureRoot, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, 'utf8');
};

const task = (goal: string): SkoposTaskContract => ({
  goal,
  scope: {
    query: 'workspace',
    matchedBy: 'default-root',
    scope: {
      id: 'workspace',
      kind: 'workspace',
      title: 'Workspace',
      path: '.',
      aliases: ['root'],
      summary: 'Fixture workspace.',
      confidence: 'high',
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

const operatingModel = {
  schemaVersion: 1,
  context: [],
  actions: [{ id: 'ui.capture' }],
  guards: [{ id: 'ui.typecheck' }],
  diagnostics: [],
} as unknown as SkoposAgentNativeOperatingModel;
