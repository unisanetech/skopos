import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { type SkoposTaskArtifact } from '@skopos/model';
import { reconstructTrackedSkoposAdoptionReadinessRuntime } from '../../../runtime/src/application/adoption/adoption.service.js';
import {
  captureSkoposTaskPathStates,
  digestSkoposTaskPathStates,
} from '../../../verification/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];
const SETUP_CERTIFICATION_CONSTRAINT = 'skopos.setup-certification.v1';
afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('tracked unified-setup readiness reconstruction', () => {
  it('rejects a completed high-impact Task that only claims setup readiness in prose', async () => {
    const root = await createWorkspace();
    await writeCertification(root, {
      constraints: [],
      paths: ['README.md'],
    });

    expect(await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: root })).toBeUndefined();
  });

  it('rejects snapshots with the wrong Task identity or a forged stored digest', async () => {
    const wrongTaskRoot = await createWorkspace();
    await writeCertification(wrongTaskRoot, {
      snapshotTaskId: 'T-other',
      paths: ['README.md'],
    });
    expect(
      await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: wrongTaskRoot }),
    ).toBeUndefined();

    const wrongDigestRoot = await createWorkspace();
    await writeCertification(wrongDigestRoot, {
      snapshotDigest: 'forged-digest',
      paths: ['README.md'],
    });
    expect(
      await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: wrongDigestRoot }),
    ).toBeUndefined();
  });

  it('reconstructs a genuinely complete typed setup certification', async () => {
    const root = await createWorkspace();
    const taskId = await writeCertification(root, { paths: ['README.md'] });

    expect(await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: root })).toMatchObject({
      state: 'agent-ready',
      source: 'tracked-reconstruction',
      certificationTaskId: taskId,
      lanes: expect.arrayContaining([
        expect.objectContaining({ id: 'memory', status: 'ready' }),
      ]),
    });
  });

  it('classifies drift under configured and Scope-specific Memory roots as Memory staleness', async () => {
    const root = await createWorkspace({
      docsRoot: 'project-memory',
      extraScopeMemoryRoot: 'apps/web/project-memory',
    });
    await writeCertification(root, {
      paths: ['project-memory/overview.md', 'apps/web/project-memory/overview.md'],
    });
    await expect(readFile(join(root, 'docs'), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    });
    await writeFile(
      join(root, 'apps/web/project-memory/overview.md'),
      '# Changed web truth\n',
      'utf8',
    );

    const readiness = await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: root });
    expect(readiness?.state).toBe('agent-analysis-required');
    expect(readiness?.lanes.find((lane) => lane.id === 'memory')).toMatchObject({
      status: 'stale',
      affectedPaths: ['apps/web/project-memory/overview.md'],
    });
    expect(readiness?.lanes.find((lane) => lane.id === 'configuration')?.affectedPaths).not.toContain(
      'apps/web/project-memory/overview.md',
    );
    expect(readiness?.snapshotPath).toMatch(
      /^project-memory\/work\/tasks\/snapshots\/T-setupcert-S-/u,
    );
  });

  it('classifies portable snapshot paths even when a prior host wrote Windows separators', async () => {
    const root = await createWorkspace({
      docsRoot: 'project-memory',
      extraScopeMemoryRoot: 'apps/web/project-memory',
    });
    await writeCertification(root, {
      paths: ['apps/web/project-memory/overview.md'],
      snapshotPathSeparator: 'windows',
    });
    await writeFile(
      join(root, 'apps/web/project-memory/overview.md'),
      '# Changed web truth\n',
      'utf8',
    );

    const readiness = await reconstructTrackedSkoposAdoptionReadinessRuntime({ cwd: root });
    expect(readiness?.state).toBe('agent-analysis-required');
    expect(readiness?.lanes.find((lane) => lane.id === 'memory')).toMatchObject({
      status: 'stale',
      affectedPaths: ['apps/web/project-memory/overview.md'],
    });
  });
});

const createWorkspace = async ({
  docsRoot = 'docs',
  extraScopeMemoryRoot,
}: {
  docsRoot?: string;
  extraScopeMemoryRoot?: string;
} = {}): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-setup-reconstruction-'));
  temporaryRoots.push(root);
  const memoryRoots = [docsRoot, ...(extraScopeMemoryRoot ? [extraScopeMemoryRoot] : [])];
  const canonicalTaskRoot = join(root, docsRoot, 'work/archive/tasks');
  await Promise.all([
    mkdir(canonicalTaskRoot, { recursive: true }),
    mkdir(join(root, docsRoot, 'work/tasks/snapshots'), { recursive: true }),
    mkdir(join(root, 'tools/skopos'), { recursive: true }),
    ...memoryRoots.map((memoryRoot) => mkdir(join(root, memoryRoot), { recursive: true })),
  ]);
  await Promise.all([
    writeFile(join(root, 'README.md'), '# Project\n', 'utf8'),
    writeFile(join(root, docsRoot, 'overview.md'), '# Project truth\n', 'utf8'),
    ...(extraScopeMemoryRoot
      ? [
          mkdir(join(root, 'apps/web'), { recursive: true }),
          writeFile(
            join(root, extraScopeMemoryRoot, 'overview.md'),
            '# Web truth\n',
            'utf8',
          ),
        ]
      : []),
    writeFile(
      join(root, 'skopos.config.yaml'),
      [
        'schemaVersion: 1',
        'project:',
        '  name: setup-reconstruction',
        '  archetype: custom',
        '  repoMode: single',
        '  scopeStrategy: domain',
        '  mode: brownfield',
        'commands: {}',
        'workspace:',
        '  ignore: []',
        'docs:',
        `  root: ${docsRoot}`,
        `  startHerePath: ${docsRoot}/overview.md`,
        '  usePerDomainArchive: true',
        '  strictMetadata: false',
        '  strictLinking: false',
        'agents:',
        '  canonicalInstructions: AGENTS.md',
        '  syncMirrors: []',
        '  mcp: true',
        'verification:',
        '  mode: stabilize',
        '  requireDocsSync: true',
        '  requireEvidenceForReadiness: true',
        'decisions:',
        '  mode: balanced',
        '  askFor: []',
        'security:',
        '  privacyMode: local-only',
        '  redactSecrets: true',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(join(root, 'AGENTS.md'), '# Rules\n', 'utf8'),
    writeFile(
      join(root, 'tools/skopos/scopes.yaml'),
      [
        'schemaVersion: 1',
        'scopes:',
        '  - id: workspace',
        '    title: Project',
        '    kind: workspace',
        '    path: .',
        `    memoryRoot: ${docsRoot}`,
        '    codeRoots: [.]',
        '    parent: null',
        '    profile: default',
        '    dependsOn: []',
        '    owners: [project]',
        '    aliases: []',
        ...(extraScopeMemoryRoot
          ? [
              '  - id: web',
              '    title: Web',
              '    kind: application',
              '    path: apps/web',
              `    memoryRoot: ${extraScopeMemoryRoot}`,
              '    codeRoots: [apps/web]',
              '    parent: workspace',
              '    profile: default',
              '    dependsOn: []',
              '    owners: [web]',
              '    aliases: []',
            ]
          : []),
        '',
      ].join('\n'),
      'utf8',
    ),
  ]);
  return root;
};

const writeCertification = async (
  root: string,
  {
    constraints = [SETUP_CERTIFICATION_CONSTRAINT],
    paths,
    snapshotTaskId,
    snapshotDigest,
    snapshotPathSeparator,
  }: {
    constraints?: string[];
    paths: string[];
    snapshotTaskId?: string;
    snapshotDigest?: string;
    snapshotPathSeparator?: 'windows';
  },
): Promise<string> => {
  const taskId = 'T-setupcert';
  const now = '2026-08-13T00:00:00.000Z';
  const portable: Omit<
    SkoposTaskArtifact,
    | 'workspaceRoot'
    | 'taskIdentity'
    | 'trackedDocumentPath'
    | 'coordination'
    | 'authority'
    | 'changeScope'
  > & { declaredOwnedPaths: string[] } = {
    schemaVersion: 1,
    id: taskId,
    type: 'task',
    status: 'durable',
    generatedAt: now,
    updatedAt: now,
    planIds: [],
    childTasks: [],
    state: 'complete',
    detail: 'detailed',
    title: 'Unified setup certification',
    goal: 'Certify unified setup as standard-verified and agent-ready',
    scope: {
      query: 'workspace',
      matchedBy: 'id',
      scope: {
        id: 'workspace',
        kind: 'workspace',
        title: 'Project',
        path: '.',
        aliases: [],
        summary: 'Project Scope',
        confidence: 'high',
      },
    },
    contract: {
      acceptanceCriteria: ['Unified setup is standard-verified and agent-ready.'],
      nonGoals: [],
      constraints,
    },
    risk: 'high-impact',
    proofSubject: { kind: 'task-closure', baselineId: 'setup-certification' },
    priority: 0,
    dependencyTaskIds: [],
    steps: [],
    selectedActions: [],
    selectedGuardIds: [],
    evidenceRequirements: [],
    memoryObligations: [],
    questions: [],
    recommendations: [],
    declaredOwnedPaths: paths,
  };
  const configSource = await readFile(join(root, 'skopos.config.yaml'), 'utf8');
  const docsRoot = /^\s*root:\s*(.+)$/mu.exec(configSource)?.[1]?.trim() ?? 'docs';
  await writeFile(
    join(root, docsRoot, 'work/archive/tasks/T-setupcert-unified-setup-certification.md'),
    [
      '---',
      'title: "Task: Unified setup certification"',
      'status: complete',
      'owner: setup-test',
      `id: ${taskId}`,
      'scope: workspace',
      'role: task',
      'lifecycle: historical',
      'authority: canonical',
      'provenance: accepted',
      'view: exception',
      'risk: high-impact',
      'proofSubject: task-closure',
      'proofBaseline: setup-certification',
      'lastUpdated: 2026-08-13',
      '---',
      '',
      '# Task: Unified setup certification',
      '',
      '<!-- skopos:task-state:start -->',
      '```json',
      JSON.stringify(portable, null, 2),
      '```',
      '<!-- skopos:task-state:end -->',
      '',
    ].join('\n'),
    'utf8',
  );
  const states = await captureSkoposTaskPathStates({
    workspaceRoot: root,
    paths,
    ignoredTaskId: taskId,
  });
  const portableStates = snapshotPathSeparator === 'windows'
    ? states.map((entry) => ({ ...entry, path: entry.path.replaceAll('/', '\\') }))
    : states;
  const actualDigest = digestSkoposTaskPathStates(portableStates);
  const digest = snapshotDigest ?? actualDigest;
  const snapshotId = `S-${digest.slice(0, 12)}`;
  const artifactPath = `${docsRoot}/work/tasks/snapshots/${taskId}-${snapshotId}.json`;
  await writeFile(
    join(root, artifactPath),
    JSON.stringify(
      {
        snapshotId,
        taskId: snapshotTaskId ?? taskId,
        sessionId: 'setup-session',
        actorId: 'setup-test',
        baseRevision: null,
        paths: portableStates,
        digest,
        createdAt: now,
        artifactPath,
      },
      null,
      2,
    ),
    'utf8',
  );
  return taskId;
};
