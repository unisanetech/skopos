import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { discoverSkoposCapabilityCandidates } from '../../../indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.js';
import {
  answerSkoposSetupQuestionRuntime,
  buildSkoposSetupRuntime,
  recordSkoposSetupDispositionRuntime,
  resumeSkoposSetupRuntime,
  submitSkoposSetupAnalysisRuntime,
  submitSkoposSetupCompletionRuntime,
  confirmSkoposSetupHostDelivery,
} from '../../../runtime/src/application/setup/setup.service.js';
import { reconstructTrackedSkoposAdoptionReadinessRuntime } from '../../../runtime/src/application/adoption/adoption.service.js';
import { buildSkoposSetupAnswerRuntime } from '../../../runtime/src/application/understanding/understanding.service.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('unified intelligent project setup', () => {
  it('uses one resumable state for setup, review choices, source invalidation, and the agent packet', async () => {
    const root = await createNodeWorkspace();
    const initial = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });

    expect(['inspection-required', 'questions-open']).toContain(initial.state.stage);
    expect(initial.state.materialQuestions.map((question) => question.id)).toEqual(
      expect.arrayContaining(['bootstrap.project-archetype', 'bootstrap.docs-root']),
    );
    expect(initial.state.lanes.map((lane) => lane.id)).toEqual([
      'understanding',
      'scopes',
      'memory',
      'capabilities',
      'policies',
      'skills',
      'instructions',
      'host-delivery',
    ]);
    expect(initial.state.lanes.find((lane) => lane.id === 'skills')?.evidencePaths).toContain(
      'tools/skopos/skills',
    );
    expect(initial.state.recommendations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ applyKind: 'capability-candidate' }),
        expect.objectContaining({ id: 'host-delivery.verify', required: true }),
      ]),
    );
    const packet = JSON.parse(await readFile(initial.state.agentPacketPath, 'utf8')) as {
      workItems: Array<{ operation: string }>;
      responseObjective: string;
    };
    expect(Array.isArray(packet.workItems)).toBe(true);
    expect(packet.responseObjective).toContain('simple language');

    const optional = initial.state.recommendations.find(
      (entry) => entry.applyKind === 'capability-candidate' && !entry.required,
    )!;
    const deferred = await recordSkoposSetupDispositionRuntime({
      cwd: root,
      actor: 'setup-test',
      recommendationId: optional.id,
      disposition: 'defer',
    });
    expect(deferred.state.dispositions).toContainEqual(
      expect.objectContaining({ recommendationId: optional.id, disposition: 'defer' }),
    );

    const packageJsonPath = join(root, 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
      scripts: Record<string, string>;
    };
    const capabilityName = optional.title.match(/^Use (.+) as a project check$/)?.[1];
    expect(capabilityName).toBeTruthy();
    packageJson.scripts[capabilityName!] = 'changed command';
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
    const refreshed = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    expect(refreshed.state.invalidatedDispositionIds).toContain(optional.id);
  });

  it('reuses an existing exact Action and recommends only one provider for each missing capability', async () => {
    const root = await createNodeWorkspace();
    const candidates = await discoverSkoposCapabilityCandidates({ cwd: root });
    const testCandidate = candidates.find((entry) => entry.name === 'test')!;
    const candidateActionIds = new Map(
      candidates.map((candidate) => [candidate.id, candidate.suggestedAction?.id]),
    );
    const initial = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    const initialActionIds = initial.state.recommendations
      .filter((entry) => entry.applyKind === 'capability-candidate')
      .map((entry) => candidateActionIds.get(entry.applyRef!));

    expect(initialActionIds).toContain('quality.test');
    expect(new Set(initialActionIds).size).toBe(initialActionIds.length);

    await Promise.all([
      mkdir(join(root, 'tools/skopos/actions'), { recursive: true }),
      mkdir(join(root, 'tools/skopos/guards'), { recursive: true }),
    ]);
    await writeFile(
      join(root, 'tools/skopos/actions/quality-test.yaml'),
      `${JSON.stringify({ ...testCandidate.suggestedAction, sourcePath: undefined }, null, 2)}\n`,
    );
    const loneAction = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    const loneActionIds = loneAction.state.recommendations
      .filter((entry) => entry.applyKind === 'capability-candidate')
      .map((entry) => candidateActionIds.get(entry.applyRef!));

    expect(loneActionIds).toContain('quality.test');

    await writeFile(
      join(root, 'tools/skopos/guards/quality-test.yaml'),
      `${JSON.stringify({ ...testCandidate.suggestedGuard, sourcePath: undefined }, null, 2)}\n`,
    );
    const reused = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    const reusedActionIds = reused.state.recommendations
      .filter((entry) => entry.applyKind === 'capability-candidate')
      .map((entry) => candidateActionIds.get(entry.applyRef!));

    expect(reusedActionIds).not.toContain('quality.test');
    expect(reused.state.failedApply).toBeUndefined();

    await writeFile(
      join(root, 'tools/skopos/actions/quality-test.yaml'),
      `${JSON.stringify({
        ...testCandidate.suggestedAction,
        command: 'npm run stale-test',
        sourcePath: undefined,
      }, null, 2)}\n`,
    );
    const drifted = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    const driftedActionIds = drifted.state.recommendations
      .filter((entry) => entry.applyKind === 'capability-candidate')
      .map((entry) => candidateActionIds.get(entry.applyRef!));

    expect(driftedActionIds).toContain('quality.test');
  });

  it('applies an accepted source-bound update to a stale same-id Action and Guard', async () => {
    const root = await createNodeWorkspace();
    await Promise.all([
      mkdir(join(root, 'docs/architecture'), { recursive: true }),
      mkdir(join(root, 'tools/skopos/actions'), { recursive: true }),
      mkdir(join(root, 'tools/skopos/guards'), { recursive: true }),
    ]);
    await Promise.all([
      writeFile(join(root, 'AGENTS.md'), '# Project instructions\n'),
      writeFile(join(root, 'docs/00-start-here.md'), '# Project docs\n'),
      writeFile(join(root, 'docs/architecture/overview.md'), '# Architecture\n'),
    ]);
    await writeConfiguredSkoposProject(root);
    const candidates = await discoverSkoposCapabilityCandidates({ cwd: root });
    const candidate = candidates.find(
      (entry) => entry.suggestedAction?.id === 'quality.test' && entry.source === 'configured-command',
    )!;
    await Promise.all([
      writeFile(
        join(root, 'tools/skopos/actions/quality-test.yaml'),
        `${JSON.stringify({
          ...candidate.suggestedAction,
          command: 'pnpm stale-test',
          sourcePath: undefined,
        }, null, 2)}\n`,
      ),
      writeFile(
        join(root, 'tools/skopos/guards/quality-test.yaml'),
        `${JSON.stringify({
          ...candidate.suggestedGuard,
          description: 'Stale Guard awaiting reviewed setup repair.',
          sourcePath: undefined,
        }, null, 2)}\n`,
      ),
    ]);

    let setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    while (setup.state.materialQuestions.length > 0) {
      const question = setup.state.materialQuestions[0]!;
      await answerSkoposSetupQuestionRuntime({
        cwd: root,
        actor: 'setup-test',
        questionId: question.id,
        optionId: question.recommendedOptionId,
      });
      setup = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    }
    const capability = setup.state.recommendations.find(
      (entry) => entry.applyKind === 'capability-candidate' && entry.applyRef === candidate.id,
    );
    expect(capability).toBeDefined();
    for (const recommendation of setup.state.recommendations) {
      await recordSkoposSetupDispositionRuntime({
        cwd: root,
        actor: 'setup-test',
        recommendationId: recommendation.id,
        disposition:
          recommendation.id === capability!.id || recommendation.required
            ? 'accept'
            : 'defer',
      });
    }

    await resumeSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    const [action, guard] = await Promise.all([
      readFile(join(root, 'tools/skopos/actions/quality-test.yaml'), 'utf8'),
      readFile(join(root, 'tools/skopos/guards/quality-test.yaml'), 'utf8'),
    ]);
    expect(JSON.parse(action)).toMatchObject({
      id: 'quality.test',
      command: candidate.command,
    });
    expect(JSON.parse(guard)).toMatchObject({
      id: 'quality.test',
      description: candidate.suggestedGuard!.description,
      requires: { actionIds: ['quality.test'], evidence: 'source-bound-action' },
    });
  });

  it('keeps fresh Understand and Review local while dry-run writes nothing', async () => {
    const root = await createNodeWorkspace();
    const dryRun = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
      dryRun: true,
    });
    expect(dryRun.stateWrite).toBe('dry-run');
    await expect(readFile(join(root, '.skopos/index/bootstrap.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, '.skopos/setup/state.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, 'skopos.config.yaml'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, 'tools/skopos/scopes.yaml'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, 'AGENTS.md'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, '.gitignore'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });

    const review = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    expect(review.state.recommendations).toContainEqual(
      expect.objectContaining({ id: 'setup.bootstrap-tracked-project-layer', applyKind: 'setup-bootstrap' }),
    );
    await expect(readFile(join(root, 'skopos.config.yaml'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, 'tools/skopos/scopes.yaml'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('gives an undocumented project a safe Memory root plus explicit create-from-evidence work', async () => {
    const root = await createNodeWorkspace(false);
    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    const packet = JSON.parse(await readFile(setup.state.agentPacketPath, 'utf8')) as {
      workItems: Array<{ operation: string; instruction: string }>;
    };
    expect(packet.workItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operation: 'create-from-evidence',
          instruction: expect.stringContaining('minimum useful durable project truth'),
        }),
      ]),
    );
    await expect(readFile(join(root, 'tools/skopos/scopes.yaml'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    const generatedScopes = JSON.parse(await readFile(join(root, '.skopos/index/scopes.json'), 'utf8')) as { scopes: Array<{ memoryRoot: string }> };
    expect(generatedScopes.scopes.length).toBeGreaterThan(0);
    await expect(readFile(join(root, 'docs/00-start-here.md'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, 'docs/architecture/overview.md'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('keeps existing project docs and declared Scope Memory boundaries unchanged', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs'), { recursive: true });
    await mkdir(join(root, 'tools/skopos'), { recursive: true });
    const existingRouter = '# Existing project docs\n';
    const existingScopes = [
      'schemaVersion: 1',
      'scopes:',
      '  - id: existing-workspace',
      '    title: Existing workspace',
      '    kind: workspace',
      '    path: .',
      '    memoryRoot: docs',
      '    codeRoots: [.]',
      '    parent: null',
      '    profile: default',
      '    dependsOn: []',
      '    owners: [project-maintainers]',
      '    aliases: [root]',
      '',
    ].join('\n');
    await Promise.all([
      writeFile(join(root, 'docs/00-start-here.md'), existingRouter),
      writeFile(join(root, 'tools/skopos/scopes.yaml'), existingScopes),
    ]);

    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });

    expect(await readFile(join(root, 'docs/00-start-here.md'), 'utf8')).toBe(existingRouter);
    expect(await readFile(join(root, 'tools/skopos/scopes.yaml'), 'utf8')).toBe(existingScopes);
  });

  it('reads configured project truth from the real workspace during fresh setup', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs'), { recursive: true });
    await writeFile(join(root, 'docs/00-start-here.md'), '# Canonical project docs\n');
    await writeConfiguredSkoposProject(root);

    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    const bootstrap = JSON.parse(
      await readFile(join(root, '.skopos/index/bootstrap.json'), 'utf8'),
    ) as {
      detected: { docsRoots: string[] };
      recommendedQuestions: Array<{ id: string }>;
      recommendedNextSteps: string[];
    };

    expect(bootstrap.detected.docsRoots).toContain('docs');
    expect(bootstrap.recommendedQuestions.map((question) => question.id)).not.toEqual(
      expect.arrayContaining(['bootstrap.project-archetype', 'bootstrap.docs-root']),
    );
    expect(setup.state.materialQuestions.map((question) => question.id)).not.toEqual(
      expect.arrayContaining(['bootstrap.project-archetype', 'bootstrap.docs-root']),
    );
    expect(bootstrap.recommendedNextSteps.join(' ')).not.toContain(
      'confirm project archetype',
    );
  });

  it('keeps a missing configured docs root as a material setup question', async () => {
    const root = await createNodeWorkspace();
    await writeConfiguredSkoposProject(root, 'guides');

    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });

    expect(setup.state.materialQuestions.map((question) => question.id)).toContain(
      'bootstrap.docs-root',
    );
    expect(setup.state.materialQuestions.map((question) => question.id)).not.toContain(
      'bootstrap.project-archetype',
    );
  });

  it('refreshes cached setup discovery when initialization is explicitly requested', async () => {
    const root = await createNodeWorkspace();
    const initial = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    expect(initial.state.materialQuestions.map((question) => question.id)).toContain(
      'bootstrap.project-archetype',
    );

    await mkdir(join(root, 'docs'), { recursive: true });
    await writeFile(join(root, 'docs/00-start-here.md'), '# Canonical project docs\n');
    await writeConfiguredSkoposProject(root);
    const refreshed = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });

    expect(refreshed.state.materialQuestions.map((question) => question.id)).not.toEqual(
      expect.arrayContaining(['bootstrap.project-archetype', 'bootstrap.docs-root']),
    );
  });

  it('restores cached discovery bytes after a refreshed dry-run', async () => {
    const root = await createNodeWorkspace();
    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    const previewPaths = [
      '.skopos/index/bootstrap.json',
      '.skopos/index/scopes.json',
      '.skopos/index/diagnosis.json',
      '.skopos/index/architecture.json',
      '.skopos/index/enforcement.json',
    ];
    const before = await Promise.all(
      previewPaths.map((path) => readFile(join(root, path), 'utf8')),
    );
    await writeFile(join(root, 'docs-new.md'), '# Newly discovered source\n');

    await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
      dryRun: true,
    });

    const after = await Promise.all(
      previewPaths.map((path) => readFile(join(root, path), 'utf8')),
    );
    expect(after).toEqual(before);
  });

  it('restores the preview boundary when a dry-run preview write fails', async () => {
    const root = await createNodeWorkspace();
    const indexRoot = join(root, '.skopos/index');
    await mkdir(indexRoot, { recursive: true });
    const originalEnforcement = '{"sentinel":"original-enforcement"}\n';
    await writeFile(join(indexRoot, 'enforcement.json'), originalEnforcement);
    await symlink(
      join(root, '.skopos/missing-preview-parent/architecture.json'),
      join(indexRoot, 'architecture.json'),
    );

    await expect(
      buildSkoposSetupRuntime({
        cwd: root,
        actor: 'setup-test',
        initialize: true,
        dryRun: true,
      }),
    ).rejects.toMatchObject({ code: 'ENOENT' });

    expect(await readFile(join(indexRoot, 'enforcement.json'), 'utf8')).toBe(
      originalEnforcement,
    );
    for (const path of [
      'bootstrap.json',
      'scopes.json',
      'diagnosis.json',
      'architecture.json',
    ]) {
      await expect(readFile(join(indexRoot, path), 'utf8')).rejects.toMatchObject({
        code: 'ENOENT',
      });
    }
    await expect(
      readFile(join(root, '.skopos/setup/state.json'), 'utf8'),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('respects configured custom instructions and config-only commands', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs'), { recursive: true });
    await Promise.all([
      writeFile(join(root, 'docs/00-start-here.md'), '# Canonical project docs\n'),
      writeFile(join(root, 'PROJECT_AGENT.md'), '# Project agent instructions\n'),
      writeFile(join(root, 'package.json'), JSON.stringify({ name: 'example' })),
    ]);
    await writeConfiguredSkoposProject(root, 'docs', 'PROJECT_AGENT.md');

    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    const bootstrap = JSON.parse(
      await readFile(join(root, '.skopos/index/bootstrap.json'), 'utf8'),
    ) as {
      detected: {
        instructionFiles: string[];
        commands: Record<string, string>;
        findings: string[];
      };
      recommendedNextSteps: string[];
    };

    expect(bootstrap.detected.instructionFiles).toContain('PROJECT_AGENT.md');
    expect(bootstrap.detected.commands).toMatchObject({
      build: 'pnpm build',
      test: 'pnpm test',
      typecheck: 'pnpm typecheck',
    });
    expect(bootstrap.detected.findings.join(' ')).not.toContain('instruction source');
    expect(bootstrap.detected.findings.join(' ')).not.toContain('command surface');
    expect(bootstrap.recommendedNextSteps.join(' ')).not.toContain(
      'Add the configured canonical instruction source',
    );
    expect(setup.state.materialQuestions.map((question) => question.id)).not.toEqual(
      expect.arrayContaining(['bootstrap.instructions-source', 'bootstrap.commands']),
    );
  });

  it('asks when the configured canonical instruction source is missing even if AGENTS.md exists', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs'), { recursive: true });
    await Promise.all([
      writeFile(join(root, 'docs/00-start-here.md'), '# Canonical project docs\n'),
      writeFile(join(root, 'AGENTS.md'), '# An unrelated instruction file\n'),
    ]);
    await writeConfiguredSkoposProject(root, 'docs', 'PROJECT_AGENT.md');

    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    const bootstrap = JSON.parse(
      await readFile(join(root, '.skopos/index/bootstrap.json'), 'utf8'),
    ) as { detected: { findings: string[] } };

    expect(setup.state.materialQuestions.map((question) => question.id)).toContain(
      'bootstrap.instructions-source',
    );
    expect(bootstrap.detected.findings.join(' ')).toContain(
      'No canonical PROJECT_AGENT.md instruction source detected.',
    );

    expect(
      setup.state.materialQuestions.find((question) => question.id === 'bootstrap.instructions-source'),
    ).toMatchObject({
      recommendedOptionId: 'restore-configured-instructions',
      options: expect.arrayContaining([
        expect.objectContaining({ id: 'switch-instruction-source:AGENTS.md' }),
      ]),
    });

    await answerSkoposSetupQuestionRuntime({
      cwd: root,
      actor: 'setup-test',
      questionId: 'bootstrap.instructions-source',
      optionId: 'restore-configured-instructions',
    });
    const config = await readFile(join(root, 'skopos.config.yaml'), 'utf8');
    expect(config).toContain('canonicalInstructions: PROJECT_AGENT.md');
    const answers = JSON.parse(
      await readFile(join(root, '.skopos/index/understanding/setup-answers.json'), 'utf8'),
    ) as { answers: Array<{ questionId: string; appliedEffects: Array<{ path?: string; summary: string }> }> };
    expect(
      answers.answers.find((answer) => answer.questionId === 'bootstrap.instructions-source')?.appliedEffects,
    ).toContainEqual(expect.objectContaining({
      path: 'PROJECT_AGENT.md',
      summary: expect.stringContaining('without changing project configuration'),
    }));

    let review = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    for (const question of review.state.materialQuestions) {
      if (question.id === 'bootstrap.instructions-source') continue;
      await answerSkoposSetupQuestionRuntime({
        cwd: root,
        actor: 'setup-test',
        questionId: question.id,
        optionId: question.recommendedOptionId,
      });
    }
    review = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    const instructionSync = review.state.recommendations.find(
      (recommendation) => recommendation.id === 'instructions.sync',
    );
    expect(instructionSync).toBeDefined();
    for (const recommendation of review.state.recommendations) {
      await recordSkoposSetupDispositionRuntime({
        cwd: root,
        actor: 'setup-test',
        recommendationId: recommendation.id,
        disposition: recommendation.required ? 'accept' : 'defer',
      });
    }
    review = await resumeSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });

    const [restoredInstructions, codexReadme, claudePostEditHook, manualGuide] =
      await Promise.all([
        readFile(join(root, 'PROJECT_AGENT.md'), 'utf8'),
        readFile(join(root, '.skopos/cache/tooling/codex/README.md'), 'utf8'),
        readFile(
          join(root, '.skopos/cache/tooling/claude-code/hooks/post-edit-hook.mjs'),
          'utf8',
        ),
        readFile(join(root, '.skopos/cache/tooling/manual-hosts/README.md'), 'utf8'),
      ]);
    expect(restoredInstructions).toContain('# PROJECT_AGENT.md instructions for example');
    expect(restoredInstructions).toContain('Canonical instruction source: `PROJECT_AGENT.md`');
    expect(restoredInstructions).toContain('Read `PROJECT_AGENT.md` first');
    expect(codexReadme).toContain('`PROJECT_AGENT.md` plus');
    expect(claudePostEditHook).toContain('const instructionSourcePath = "PROJECT_AGENT.md"');
    expect(manualGuide).toContain('Read `PROJECT_AGENT.md`');
    expect(
      review.state.recommendations.some(
        (recommendation) => recommendation.id === 'instructions.sync',
      ),
    ).toBe(false);
    expect(review.state.lanes.find((lane) => lane.id === 'instructions')?.status).toBe(
      'ready',
    );
  });

  it('removes a selected canonical instruction source from mirror targets atomically', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs'), { recursive: true });
    await Promise.all([
      writeFile(join(root, 'docs/00-start-here.md'), '# Canonical project docs\n'),
      writeFile(join(root, 'AGENTS.md'), '# Original source\n'),
      writeFile(join(root, 'PROJECT_AGENT.md'), '# Project source\n'),
    ]);
    await writeConfiguredSkoposProject(root, 'docs', 'MISSING_AGENT.md');
    const configPath = join(root, 'skopos.config.yaml');
    await writeFile(
      configPath,
      (await readFile(configPath, 'utf8')).replace(
        '  syncMirrors: []',
        '  syncMirrors:\n    - AGENTS.md\n    - CLAUDE.md',
      ),
      'utf8',
    );

    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    const review = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    const question = review.state.materialQuestions.find((entry) => entry.id === 'bootstrap.instructions-source');
    expect(question?.options).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'switch-instruction-source:AGENTS.md' }),
    ]));
    await buildSkoposSetupAnswerRuntime({
      cwd: root,
      actor: 'setup-test',
      questionId: 'bootstrap.instructions-source',
      optionId: 'switch-instruction-source:AGENTS.md',
    });
    const nextConfig = await readFile(configPath, 'utf8');
    expect(nextConfig).toContain('canonicalInstructions: AGENTS.md');
    expect(nextConfig).toContain('    - CLAUDE.md');
    expect(nextConfig).not.toContain('    - AGENTS.md');
  });

  it('discovers mixed-stack project-owned checks without making Node the product boundary', async () => {
    const root = await mkdtemp(join(tmpdir(), 'skopos-setup-mixed-'));
    temporaryRoots.push(root);
    await Promise.all([
      writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { lint: 'eslint .' } })),
      writeFile(join(root, 'pyproject.toml'), '[build-system]\nrequires=[]\n[tool.pytest.ini_options]\n[tool.ruff]\n'),
      writeFile(join(root, 'go.mod'), 'module example.test/mixed\n\ngo 1.24\n'),
      writeFile(join(root, 'Cargo.toml'), '[package]\nname="mixed"\nversion="0.1.0"\n'),
    ]);

    const candidates = await discoverSkoposCapabilityCandidates({ cwd: root });
    expect(candidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ source: 'package-script', command: 'npm run lint' }),
        expect.objectContaining({ source: 'python-project', command: 'python -m pytest' }),
        expect.objectContaining({ source: 'go-project', command: 'go test ./...' }),
        expect.objectContaining({ source: 'rust-project', command: 'cargo check' }),
      ]),
    );
  });

  it('does not treat host names as context-delivery proof', async () => {
    const root = await createNodeWorkspace();
    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
      host: 'codex',
    });
    expect(setup.state.lanes.find((lane) => lane.id === 'host-delivery')).toMatchObject({
      status: 'needs-review',
    });
    expect(setup.state.recommendations).toContainEqual(
      expect.objectContaining({ id: 'host-delivery.verify' }),
    );
  });

  it('records a source-bound receipt only after the host explicitly confirms an exact live Session context', async () => {
    const root = await createNodeWorkspace();
    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
      host: 'codex',
      sessionId: 'setup-session-1',
    });
    const bootstrap = JSON.parse(await readFile(join(root, '.skopos/setup/bootstrap-recommendation.json'), 'utf8'));
    const { writeSkoposConfig } = await import('../../../config/src/application/write-config/write-config.service.js');
    await writeSkoposConfig(join(root, 'skopos.config.yaml'), bootstrap);
    await writeFile(join(root, 'AGENTS.md'), '# Example instructions\n');
    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    expect(setup.state.lanes.find((lane) => lane.id === 'host-delivery')).toMatchObject({ status: 'needs-review' });
    const context = await (await import('../../../runtime/src/application/session/session-context.service.js')).buildSkoposSessionContextRuntime({
      cwd: root, actor: 'setup-test', host: 'codex', sessionId: 'setup-session-1', dryRun: true,
    });
    const { createHash } = await import('node:crypto');
    const confirmed = await confirmSkoposSetupHostDelivery({
      cwd: root,
      actor: 'setup-test',
      host: 'codex',
      sessionId: 'setup-session-1',
      communicationContractMarker: context.communicationContract.marker,
      communicationContractDigest: createHash('sha256').update(JSON.stringify(context.communicationContract)).digest('hex'),
    });
    expect(confirmed.state.lanes.find((lane) => lane.id === 'host-delivery')).toMatchObject({ status: 'ready' });
    const receipt = JSON.parse(await readFile(confirmed.state.hostDeliveryReceiptPath, 'utf8')) as {
      host: string;
      sessionId: string;
      communicationContractDigest: string;
      instructionSourceDigest: string;
    };
    expect(receipt).toMatchObject({ host: 'codex', sessionId: 'setup-session-1', deliveryAuthority: 'host-confirmed' });
    expect(receipt.communicationContractDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(receipt.instructionSourceDigest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('keeps setup certification identity independent of ignored generated evidence paths', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs'), { recursive: true });
    await mkdir(join(root, 'docs/architecture'), { recursive: true });
    await Promise.all([
      writeFile(join(root, 'docs/00-start-here.md'), '# Canonical project docs\n'),
      writeFile(join(root, 'docs/architecture/overview.md'), '# Architecture\n'),
      writeFile(join(root, 'AGENTS.md'), '# Example instructions\n'),
    ]);
    await writeConfiguredSkoposProject(root);
    const candidates = await discoverSkoposCapabilityCandidates({ cwd: root });
    await mkdir(join(root, 'tools/skopos/actions'), { recursive: true });
    const actionsById = new Map(
      candidates
        .filter((candidate) => candidate.suggestedAction)
        .map((candidate) => [candidate.suggestedAction!.id, candidate.suggestedAction!]),
    );
    await Promise.all([...actionsById.values()].map((action) =>
      writeFile(
        join(root, 'tools/skopos/actions', `${action.id.replaceAll('.', '-')}.yaml`),
        `${JSON.stringify({ ...action, sourcePath: undefined }, null, 2)}\n`,
      ),
    ));
    let initial = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    expect(
      initial.state.lanes
        .find((lane) => lane.id === 'understanding')
        ?.evidencePaths[0]
        ?.replaceAll('\\', '/'),
    ).toContain('/.skopos/');

    const lifecycle = initial.state.materialQuestions.find(
      (question) => question.id === 'understanding.lifecycle',
    );
    if (lifecycle) {
      await answerSkoposSetupQuestionRuntime({
        cwd: root,
        actor: 'setup-test',
        questionId: lifecycle.id,
        optionId: 'existing-project',
      });
      initial = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    }
    const analysisPath = join(root, '.skopos/setup/identity-analysis.json');
    await writeFile(analysisPath, JSON.stringify({
      claims: [{
        id: 'fact-project',
        kind: 'fact',
        summary: 'The configured project sources were reviewed.',
        evidencePaths: ['package.json', 'docs/architecture/overview.md'],
      }],
      materialQuestions: [],
      scopeProposals: [],
      documentOperations: [],
    }));
    initial = await submitSkoposSetupAnalysisRuntime({
      cwd: root,
      inputPath: analysisPath,
      actor: 'setup-test',
    });
    for (const recommendation of initial.state.recommendations) {
      await recordSkoposSetupDispositionRuntime({
        cwd: root,
        actor: 'setup-test',
        recommendationId: recommendation.id,
        disposition: recommendation.required ? 'accept' : 'defer',
      });
    }

    const first = await resumeSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    if (!first.state.certificationTaskId) {
      throw new Error(JSON.stringify({
        stage: first.state.stage,
        lanes: first.state.lanes,
        recommendations: first.state.recommendations,
      }));
    }
    expect(first.state.certificationTaskId).toMatch(/^T-setup[a-f0-9]{8}$/);
    await writeFile(
      join(root, '.skopos/index/understanding/agent-analysis-brief.json'),
      '{"ignored":"generated-state-changed"}\n',
    );
    const second = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    expect(second.state.certificationTaskId).toBe(first.state.certificationTaskId);
  });

  it('turns contradictory canonical project truth into one understandable material question', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs'), { recursive: true });
    const frontmatter = (id: string, title: string): string => `---\ntitle: ${title}\nstatus: active\nowner: example\nid: ${id}\nscope: workspace\nrole: overview\nlifecycle: durable\nauthority: canonical\nprovenance: declared\nview: current\n---\n\n# ${title}\n`;
    await Promise.all([
      writeFile(join(root, 'docs/overview.md'), frontmatter('OVERVIEW-ONE', 'First truth')),
      writeFile(join(root, 'docs/product.md'), frontmatter('OVERVIEW-TWO', 'Second truth')),
    ]);
    const setup = await buildSkoposSetupRuntime({
      cwd: root,
      actor: 'setup-test',
      initialize: true,
    });
    expect(setup.state.materialQuestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          question: expect.stringContaining('Which source should own this project truth'),
          recommendedOptionId: 'review-current-sources',
        }),
      ]),
    );
    expect(setup.state.stage).toBe('questions-open');
  });

  it('turns coding-agent Scope and document analysis into the same consolidated review', async () => {
    const root = await createNodeWorkspace(false);
    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    const inputPath = join(root, '.skopos/setup/analysis-input.json');
    await writeFile(inputPath, JSON.stringify({
      claims: [
        { id: 'fact-web', kind: 'fact', summary: 'The web app is a separately deployable product surface.', evidencePaths: ['apps/web/index.ts'] },
      ],
      materialQuestions: [],
      scopeProposals: [
        { id: 'web', title: 'Web application', kind: 'application', codeRoots: ['apps/web'], memoryRoot: 'docs/scopes/web', evidencePaths: ['apps/web/index.ts'], rationale: 'It has a distinct deployable lifecycle and ownership boundary.' },
      ],
      documentOperations: [
        { id: 'create-overview', operation: 'create-from-evidence', sourcePaths: ['apps/web/index.ts'], targetPaths: ['docs/overview.md'], rationale: 'The project has no durable product overview.', retainedTruth: 'Observed product purpose and explicit unknowns.', evidencePaths: ['apps/web/index.ts'], informationLossRisk: 'none' },
      ],
    }));
    const setup = await submitSkoposSetupAnalysisRuntime({
      cwd: root,
      inputPath,
      actor: 'setup-test',
    });
    expect(setup.state.recommendations).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'scope.web', applyKind: 'scope-review' }),
      expect.objectContaining({
        id: 'memory.operation.create-overview',
        applyKind: 'agent-memory-work',
        applyRef: 'docs/overview.md',
      }),
    ]));

    await writeFile(join(root, 'apps/web/index.ts'), 'export const web = false;\n');
    const invalidated = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    expect(invalidated.state.recommendations).not.toContainEqual(
      expect.objectContaining({ id: 'scope.web' }),
    );
    expect(invalidated.state.materialQuestions).toContainEqual(
      expect.objectContaining({ id: 'analysis.sources-changed' }),
    );
  });

  it('credits accepted agent-owned work only from a current source-bound completion receipt', async () => {
    const root = await createNodeWorkspace(false);
    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    const inputPath = join(root, '.skopos/setup/analysis-input.json');
    await writeFile(inputPath, JSON.stringify({
      claims: [{ id: 'fact-web', kind: 'fact', summary: 'Web entrypoint exists.', evidencePaths: ['apps/web/index.ts'] }],
      materialQuestions: [],
      scopeProposals: [],
      documentOperations: [{
        id: 'create-overview', operation: 'create-from-evidence', sourcePaths: ['apps/web/index.ts'], targetPaths: ['docs/overview.md'],
        rationale: 'Create durable product truth.', retainedTruth: 'Observed app purpose and explicit unknowns.', evidencePaths: ['apps/web/index.ts'], informationLossRisk: 'none',
      }],
    }));
    let setup = await submitSkoposSetupAnalysisRuntime({ cwd: root, inputPath, actor: 'setup-test' });
    const recommendation = setup.state.recommendations.find((entry) => entry.id === 'memory.operation.create-overview')!;
    await recordSkoposSetupDispositionRuntime({ cwd: root, actor: 'setup-test', recommendationId: recommendation.id, disposition: 'accept' });
    setup = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    expect(setup.state.completedApplyIds).not.toContain(recommendation.id);
    await mkdir(join(root, 'docs'), { recursive: true });
    await writeFile(join(root, 'docs/overview.md'), '# Reviewed overview\n');
    const { captureSkoposTaskPathStates, digestSkoposTaskPathStates } = await import('../../../verification/src/application/task-change-scope/task-change-scope.service.js');
    const sourcePathStates = await captureSkoposTaskPathStates({ workspaceRoot: root, paths: ['docs/overview.md', 'apps/web/index.ts'] });
    const receiptPath = join(root, '.skopos/setup/completion-input.json');
    await writeFile(receiptPath, JSON.stringify({
      recommendationId: recommendation.id,
      recommendationSourceDigest: recommendation.sourceDigest,
      statement: 'Created the approved overview from current app evidence.',
      sourcePathStates,
      sourceStateDigest: digestSkoposTaskPathStates(sourcePathStates),
    }));
    const completed = await submitSkoposSetupCompletionRuntime({ cwd: root, inputPath: receiptPath, actor: 'setup-test' });
    expect(completed.state.completedApplyIds).toContain(recommendation.id);
    await writeFile(join(root, 'docs/overview.md'), '# Changed after receipt\n');
    const stale = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    expect(stale.state.completedApplyIds).not.toContain(recommendation.id);
    await expect(submitSkoposSetupCompletionRuntime({ cwd: root, inputPath: receiptPath, actor: 'setup-test' })).rejects.toThrow(
      'does not match current project sources',
    );
  });

  it('rejects completion Evidence when a declared Scope differs from the exact approved proposal', async () => {
    const root = await createNodeWorkspace(false);
    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    const inputPath = join(root, '.skopos/setup/analysis-input.json');
    await writeFile(inputPath, JSON.stringify({
      claims: [],
      materialQuestions: [],
      scopeProposals: [{
        id: 'web', title: 'Web application', kind: 'application', codeRoots: ['apps/web'],
        memoryRoot: 'docs/scopes/web', evidencePaths: ['apps/web/index.ts'],
        rationale: 'The web application is independently deployable.',
      }],
      documentOperations: [],
    }));
    let setup = await submitSkoposSetupAnalysisRuntime({ cwd: root, inputPath, actor: 'setup-test' });
    const recommendation = setup.state.recommendations.find((entry) => entry.id === 'scope.web')!;
    await recordSkoposSetupDispositionRuntime({
      cwd: root,
      actor: 'setup-test',
      recommendationId: recommendation.id,
      disposition: 'accept',
    });
    await mkdir(join(root, 'tools/skopos'), { recursive: true });
    await writeFile(join(root, 'tools/skopos/scopes.yaml'), [
      'schemaVersion: 1',
      'scopes:',
      '  - id: workspace',
      '    title: Workspace',
      '    kind: workspace',
      '    path: .',
      '    memoryRoot: docs',
      '    codeRoots: [.]',
      '    parent: null',
      '    profile: default',
      '    dependsOn: []',
      '    owners: [project-maintainers]',
      '    aliases: [root]',
      '  - id: web',
      '    title: Web application',
      '    kind: application',
      '    path: apps/web',
      '    memoryRoot: docs/wrong',
      '    codeRoots: [apps/web]',
      '    parent: workspace',
      '    profile: default',
      '    dependsOn: []',
      '    owners: [project-maintainers]',
      '    aliases: []',
      '',
    ].join('\n'));
    const { captureSkoposTaskPathStates, digestSkoposTaskPathStates } = await import('../../../verification/src/application/task-change-scope/task-change-scope.service.js');
    const sourcePathStates = await captureSkoposTaskPathStates({ workspaceRoot: root, paths: ['tools/skopos/scopes.yaml'] });
    const receiptPath = join(root, '.skopos/setup/scope-completion-input.json');
    await writeFile(receiptPath, JSON.stringify({
      recommendationId: recommendation.id,
      recommendationSourceDigest: recommendation.sourceDigest,
      statement: 'Applied the approved Scope proposal.',
      sourcePathStates,
      sourceStateDigest: digestSkoposTaskPathStates(sourcePathStates),
    }));
    await expect(submitSkoposSetupCompletionRuntime({
      cwd: root,
      inputPath: receiptPath,
      actor: 'setup-test',
    })).rejects.toThrow('does not match the approved Scope proposal');

    await writeFile(join(root, 'tools/skopos/scopes.yaml'), (await readFile(join(root, 'tools/skopos/scopes.yaml'), 'utf8')).replace('docs/wrong', 'docs/scopes/web'));
    const exactStates = await captureSkoposTaskPathStates({ workspaceRoot: root, paths: ['tools/skopos/scopes.yaml'] });
    await writeFile(receiptPath, JSON.stringify({
      recommendationId: recommendation.id,
      recommendationSourceDigest: recommendation.sourceDigest,
      statement: 'Applied the exact approved Scope proposal.',
      sourcePathStates: exactStates,
      sourceStateDigest: digestSkoposTaskPathStates(exactStates),
    }));
    setup = await submitSkoposSetupCompletionRuntime({ cwd: root, inputPath: receiptPath, actor: 'setup-test' });
    expect(setup.state.completedApplyIds).toContain(recommendation.id);
  });

  it('rejects malformed nested setup analysis before it can enter runtime state', async () => {
    const root = await createNodeWorkspace(false);
    const inputPath = join(root, 'bad-setup-analysis.json');
    await writeFile(inputPath, JSON.stringify({
      claims: [{ id: 'fact-web', kind: 'fact', evidencePaths: ['apps/web/index.ts'] }],
      materialQuestions: [],
      scopeProposals: [],
      documentOperations: [],
    }));
    await expect(submitSkoposSetupAnalysisRuntime({
      cwd: root,
      inputPath,
      actor: 'setup-test',
    })).rejects.toThrow('claims[0].summary must be a non-empty string');
  });

  it('makes the existing versus new project decision change actual setup mode', async () => {
    const root = await createNodeWorkspace();
    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    await answerSkoposSetupQuestionRuntime({
      cwd: root,
      actor: 'setup-test',
      questionId: 'understanding.lifecycle',
      optionId: 'new-project',
    });
    await expect(readFile(join(root, 'skopos.config.yaml'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
    const answers = JSON.parse(await readFile(join(root, '.skopos/index/understanding/setup-answers.json'), 'utf8')) as { answers: Array<{ optionId: string }> };
    expect(answers.answers).toContainEqual(expect.objectContaining({ optionId: 'new-project' }));
  });

  it('records project lifecycle without overwriting an explicit operating mode', async () => {
    const root = await createNodeWorkspace();
    await writeConfiguredSkoposProject(root);
    await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    await answerSkoposSetupQuestionRuntime({
      cwd: root,
      actor: 'setup-test',
      questionId: 'understanding.lifecycle',
      optionId: 'existing-project',
    });

    const config = await readFile(join(root, 'skopos.config.yaml'), 'utf8');
    expect(config).toContain('mode: clean-refactor');
    expect(config).not.toContain('mode: brownfield');
  });

  it('turns edit into a source-bound revised recommendation before approval', async () => {
    const root = await createNodeWorkspace(false);
    const initial = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    const memory = initial.state.recommendations.find((entry) => entry.id === 'memory.project-overview')!;
    const edited = await recordSkoposSetupDispositionRuntime({
      cwd: root,
      actor: 'setup-test',
      recommendationId: memory.id,
      disposition: 'edit',
      note: 'Use PRODUCT.md as the canonical overview instead.',
    });
    expect(edited.state.nextCommand).toBe('skopos setup review .');

    const inputPath = join(root, '.skopos/setup/analysis-input.json');
    await writeFile(inputPath, JSON.stringify({
      claims: [], materialQuestions: [], scopeProposals: [], documentOperations: [],
      recommendationRevisions: [{
        recommendationId: memory.id,
        applyRef: 'PRODUCT.md',
        summary: 'Create the approved project overview in PRODUCT.md.',
        evidencePaths: ['README.md'],
      }],
    }));
    const revised = await submitSkoposSetupAnalysisRuntime({ cwd: root, inputPath, actor: 'setup-test' });
    expect(revised.state.recommendations).toContainEqual(
      expect.objectContaining({ id: memory.id, applyRef: 'PRODUCT.md' }),
    );
    expect(revised.state.dispositions).not.toContainEqual(
      expect.objectContaining({ recommendationId: memory.id }),
    );
  });

  it('returns an actionable host-bound continuation instead of a no-op resume loop', async () => {
    const root = await createNodeWorkspace();
    const setup = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test', initialize: true });
    expect(setup.state.nextCommand).not.toContain('--host');
    const state = JSON.parse(await readFile(setup.statePath, 'utf8')) as typeof setup.state;
    state.stage = 'verification-blocked';
    state.openQuestionCount = 0;
    state.materialQuestions = [];
    await writeFile(setup.statePath, JSON.stringify(state));
    const rebuilt = await buildSkoposSetupRuntime({ cwd: root, actor: 'setup-test' });
    if (rebuilt.state.stage === 'verification-blocked') {
      expect(rebuilt.state.nextCommand).toContain('--host <host> --session-id <session-id>');
    }
  });

  it('reconstructs tracked readiness from unified setup certification and invalidates only drifted lanes', async () => {
    const root = await createNodeWorkspace();
    await mkdir(join(root, 'docs/work/archive/tasks'), { recursive: true });
    await mkdir(join(root, 'docs/work/tasks/snapshots'), { recursive: true });
    const readme = await readFile(join(root, 'README.md'), 'utf8');
    const { createHash } = await import('node:crypto');
    const digest = createHash('sha256').update('file\0').update(Buffer.from(readme).toString('base64')).digest('hex');
    const taskId = 'T-setupcert';
    const portable = { schemaVersion: 1, id: taskId, type: 'task', status: 'durable', authority: 'accepted', generatedAt: '2026-08-13T00:00:00.000Z', updatedAt: '2026-08-13T00:00:00.000Z', workspaceRoot: root, title: 'Unified setup certification', goal: 'Certify unified setup as standard-verified and agent-ready', state: 'complete', risk: 'high-impact', detail: 'detailed', contract: { acceptanceCriteria: ['Unified setup is standard-verified and agent-ready.'], nonGoals: [], constraints: ['skopos.setup-certification.v1'] }, steps: [], memoryObligations: [], questions: [], coordination: {}, recommendations: [], selectedActions: [], selectedGuardIds: [], evidenceRequirements: [], childTasks: [], planIds: [], priority: 0, dependencyTaskIds: [] };
    await writeFile(join(root, 'docs/work/archive/tasks/T-setupcert.md'), [
      '---', 'title: "Task: Unified setup certification"', 'status: complete', 'owner: project',
      `id: ${taskId}`, 'scope: workspace', 'role: task', 'lifecycle: historical',
      'authority: canonical', 'provenance: accepted', 'view: exception', '---', '',
      '<!-- skopos:task-state:start -->', '```json', JSON.stringify(portable, null, 2), '```',
      '<!-- skopos:task-state:end -->', '',
    ].join('\n'));
    const paths = [{ path: 'README.md', digest }];
    const snapshotDigest = createHash('sha256').update(paths.map((entry) => `${entry.path}\0${entry.digest}`).join('\n')).digest('hex');
    const snapshotId = `S-${snapshotDigest.slice(0, 12)}`;
    await writeFile(join(root, `docs/work/tasks/snapshots/${taskId}-${snapshotId}.json`), JSON.stringify({ snapshotId, taskId, createdAt: '2026-08-13T00:00:00.000Z', paths, digest: snapshotDigest }));
    const ready = await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: root });
    expect(ready?.state).toBe('agent-ready');
    await writeFile(join(root, 'README.md'), '# Changed truth\n');
    const stale = await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: root });
    expect(stale?.state).toBe('agent-analysis-required');
    expect(stale?.lanes.find((lane) => lane.id === 'memory')?.status).toBe('stale');
  });
});

const createNodeWorkspace = async (includeReadme = true): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-setup-'));
  temporaryRoots.push(root);
  await Promise.all([
    mkdir(join(root, 'apps/web'), { recursive: true }),
    mkdir(join(root, 'packages/core'), { recursive: true }),
  ]);
  await Promise.all([
    ...(includeReadme ? [writeFile(join(root, 'README.md'), '# Example\n\nA useful example product.\n')] : []),
    writeFile(join(root, 'apps/web/index.ts'), 'export const web = true;\n'),
    writeFile(join(root, 'packages/core/index.ts'), 'export const core = true;\n'),
    writeFile(join(root, 'package.json'), `${JSON.stringify({
      name: 'example',
      scripts: {
        test: 'vitest run',
        typecheck: 'tsc --noEmit',
        lint: 'eslint .',
        build: 'tsc',
      },
    }, null, 2)}\n`),
  ]);
  return root;
};

const writeConfiguredSkoposProject = async (
  root: string,
  docsRoot = 'docs',
  canonicalInstructions = 'AGENTS.md',
): Promise<void> => {
  await writeFile(join(root, 'skopos.config.yaml'), [
    'schemaVersion: 1',
    'project:',
    '  name: example',
    '  archetype: library',
    '  repoMode: monorepo',
    '  scopeStrategy: package',
    '  mode: clean-refactor',
    'commands:',
    '  build: pnpm build',
    '  test: pnpm test',
    '  typecheck: pnpm typecheck',
    'workspace:',
    '  ignore: []',
    'docs:',
    `  root: ${docsRoot}`,
    `  startHerePath: ${docsRoot}/00-start-here.md`,
    '  usePerDomainArchive: true',
    '  strictMetadata: true',
    '  strictLinking: true',
    'agents:',
    `  canonicalInstructions: ${canonicalInstructions}`,
    '  syncMirrors: []',
    '  mcp: true',
    'verification:',
    '  mode: balanced',
    '  requireDocsSync: true',
    '  requireEvidenceForReadiness: true',
    'decisions:',
    '  mode: balanced',
    '  askFor: []',
    'security:',
    '  privacyMode: local-only',
    '  redactSecrets: true',
    '',
  ].join('\n'));
};
