import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildSkoposAdoptionAssessmentRuntime } from '../../../runtime/src/application/adoption/adoption.service.js';
import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposSetupReadinessSessionState } from '../../../runtime/src/application/session/session-context.service.js';
import { syncInstructionMirrors } from '../../../instructions/src/application/sync-instruction-mirrors/sync-instruction-mirrors.service.js';
import {
  captureSkoposTaskPathStates,
  digestSkoposTaskPathStates,
} from '../../../verification/src/application/task-change-scope/task-change-scope.service.js';

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

  it(
    'does not let retired local adoption activation suppress fresh assessment',
    async () => {
      const workspaceRoot = await createWorkspace();
      await initSkoposProject({
        cwd: workspaceRoot,
        mode: 'existing',
        actor: 'adoption-test',
        scaffoldInstructions: false,
      });
      const adoptionRoot = join(workspaceRoot, '.skopos/adoption');
      const proposalDigest = 'verified-proposal';
      const operationId = 'keep-project-memory';
      await Promise.all([
        writeFile(
          join(adoptionRoot, 'restructuring-proposal.json'),
          JSON.stringify({
            proposalDigest,
            operations: [{ id: operationId }],
          }),
          'utf8',
        ),
        writeFile(
          join(adoptionRoot, 'proposal-approval.json'),
          JSON.stringify({
            proposalDigest,
            approvedOperationIds: [operationId],
          }),
          'utf8',
        ),
        writeFile(
          join(adoptionRoot, 'standard-verification.json'),
          JSON.stringify({
            proposalDigest,
            adoptionState: 'standard-verified',
            verifiedOperationIds: [operationId],
            checks: [{ id: 'document-contract', status: 'pass' }],
          }),
          'utf8',
        ),
        writeFile(
          join(adoptionRoot, 'activation.json'),
          JSON.stringify({
            status: 'active',
            adoptionState: 'agent-ready',
            proposalDigest,
            verifiedOperationIds: [operationId],
          }),
          'utf8',
        ),
      ]);
      const intakeBefore = await readFile(join(adoptionRoot, 'intake.json'), 'utf8');
      await writeFile(
        join(workspaceRoot, 'README.md'),
        '# Existing product\n\nNormal adopted Memory evolution.\n',
        'utf8',
      );

      const result = await initSkoposProject({
        cwd: workspaceRoot,
        mode: 'existing',
        actor: 'adoption-test',
        scaffoldInstructions: false,
      });

      expect(result.adoptionAssessment).toBeDefined();
      expect(await readFile(join(adoptionRoot, 'intake.json'), 'utf8')).not.toBe(
        intakeBefore,
      );
      await expect(
        readFile(join(adoptionRoot, 'activation.json'), 'utf8'),
      ).rejects.toMatchObject({ code: 'ENOENT' });

      const reassessment = await buildSkoposAdoptionAssessmentRuntime({
        cwd: workspaceRoot,
        actor: 'adoption-test',
      });

      expect(reassessment.intake.inputDigest).not.toBe(
        JSON.parse(intakeBefore).inputDigest,
      );
      await expect(
        readFile(join(adoptionRoot, 'activation.json'), 'utf8'),
      ).rejects.toMatchObject({ code: 'ENOENT' });
    },
    15_000,
  );

  it(
    'reconstructs clean-checkout readiness from typed setup certification and invalidates only a changed lane',
    async () => {
      const workspaceRoot = await createWorkspace();
      await initSkoposProject({
        cwd: workspaceRoot,
        mode: 'existing',
        actor: 'adoption-test',
        scaffoldInstructions: false,
      });
      const configPath = join(workspaceRoot, 'skopos.config.yaml');
      await writeFile(
        configPath,
        (await readFile(configPath, 'utf8'))
          .replace('strictMetadata: false', 'strictMetadata: true')
          .replace('strictLinking: false', 'strictLinking: true'),
        'utf8',
      );
      await rm(join(workspaceRoot, 'docs/reference/generated/api.md'));
      await syncInstructionMirrors({ cwd: workspaceRoot });
      await writeTrackedAdoptionCertification(workspaceRoot);
      await rm(join(workspaceRoot, '.skopos'), { recursive: true, force: true });
      const reconstructed = await initSkoposProject({
        cwd: workspaceRoot,
        mode: 'existing',
        actor: 'adoption-test',
        scaffoldInstructions: false,
      });

      expect(reconstructed.adoptionAssessment).toBeUndefined();
      expect(reconstructed.adoptionReconstruction).toMatchObject({
        source: 'tracked-reconstruction',
        state: 'agent-ready',
        certificationTaskId: 'T-a0d0cafe',
      });
      expect(reconstructed.adoptionReconstruction?.lanes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'memory', status: 'ready' }),
          expect.objectContaining({ id: 'scopes', status: 'ready' }),
          expect.objectContaining({ id: 'capabilities', status: 'ready' }),
          expect.objectContaining({ id: 'instructions', status: 'ready' }),
        ]),
      );
      await rm(join(workspaceRoot, '.skopos/adoption'), {
        recursive: true,
        force: true,
      });
      expect(await buildSkoposSetupReadinessSessionState(workspaceRoot, [])).toMatchObject({
        source: 'tracked-certification',
        state: 'ready',
      });

      await writeFile(
        join(workspaceRoot, 'README.md'),
        '# Existing product\n\nTracked project Memory changed after certification.\n',
        'utf8',
      );
      await rm(join(workspaceRoot, '.skopos'), { recursive: true, force: true });
      const drifted = await initSkoposProject({
        cwd: workspaceRoot,
        mode: 'existing',
        actor: 'adoption-test',
        scaffoldInstructions: false,
      });

      expect(drifted.adoptionAssessment).toBeUndefined();
      expect(drifted.adoptionReconstruction?.state).toBe('agent-analysis-required');
      expect(
        drifted.adoptionReconstruction?.lanes.filter(
          (lane) => lane.status === 'stale',
        ),
      ).toEqual([
        expect.objectContaining({
          id: 'memory',
          affectedPaths: expect.arrayContaining(['README.md']),
        }),
      ]);
    },
    20_000,
  );
});

const writeTrackedAdoptionCertification = async (
  workspaceRoot: string,
): Promise<void> => {
  const taskId = 'T-a0d0cafe';
  const updatedAt = '2026-08-13T00:00:00.000Z';
  const taskRoot = join(workspaceRoot, 'docs/work/archive/tasks');
  const snapshotRoot = join(workspaceRoot, 'docs/work/tasks/snapshots');
  await Promise.all([
    mkdir(taskRoot, { recursive: true }),
    mkdir(snapshotRoot, { recursive: true }),
  ]);
  const portable = {
    schemaVersion: 1,
    id: taskId,
    type: 'task',
    status: 'durable',
    generatedAt: updatedAt,
    updatedAt,
    planIds: [],
    childTasks: [],
    state: 'complete',
    detail: 'detailed',
    title: 'Unified setup certification',
    goal: 'Certify unified setup as standard-verified and agent-ready',
    scope: { query: 'workspace', matchedBy: 'id', scope: { id: 'workspace' } },
    contract: {
      acceptanceCriteria: [
        'Unified setup is standard-verified and agent-ready.',
      ],
      nonGoals: [],
      constraints: ['skopos.setup-certification.v1'],
    },
    risk: 'high-impact',
    proofSubject: { kind: 'task-closure', baselineId: 'fixture-baseline' },
    priority: 0,
    dependencyTaskIds: [],
    steps: [],
    selectedActions: [],
    selectedGuardIds: [],
    evidenceRequirements: [],
    memoryObligations: [],
    questions: [],
    recommendations: [],
    declaredOwnedPaths: ['README.md'],
  };
  await writeFile(
    join(taskRoot, `${taskId}-certify-approved-project-adoption.md`),
    `---\ntitle: "Task: Certify approved project adoption"\nstatus: complete\nowner: adoption-test\nid: ${taskId}\nscope: workspace\nrole: task\nlifecycle: historical\nauthority: canonical\nprovenance: accepted\nview: exception\nrisk: high-impact\nproofSubject: task-closure\nproofBaseline: fixture-baseline\nlastUpdated: 2026-08-13\n---\n\n# Task: Certify approved project adoption\n\n<!-- skopos:task-state:start -->\n\`\`\`json\n${JSON.stringify(portable, null, 2)}\n\`\`\`\n<!-- skopos:task-state:end -->\n`,
    'utf8',
  );
  const paths = await captureSkoposTaskPathStates({
    workspaceRoot,
    paths: ['README.md'],
    ignoredTaskId: taskId,
  });
  const digest = digestSkoposTaskPathStates(paths);
  const snapshotId = `S-${digest.slice(0, 12)}`;
  const artifactPath = `docs/work/tasks/snapshots/${taskId}-${snapshotId}.json`;
  await writeFile(
    join(workspaceRoot, artifactPath),
    JSON.stringify(
      {
        snapshotId,
        taskId,
        sessionId: 'setup-session',
        actorId: 'adoption-test',
        baseRevision: null,
        createdAt: updatedAt,
        paths,
        digest,
        artifactPath,
      },
      null,
      2,
    ),
    'utf8',
  );
};

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
