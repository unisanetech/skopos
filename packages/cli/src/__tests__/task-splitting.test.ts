import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import {
  assignSkoposTaskToSessionRuntime,
  buildSkoposStartRuntime,
} from '../../../runtime/src/application/start/start.service.js';
import {
  applySkoposTaskSplitRuntime,
  proposeSkoposTaskSplitRuntime,
} from '../../../runtime/src/application/task/task-split.service.js';
import {
  assessSkoposTaskWorkflowRuntime,
  completeSkoposTaskStepRuntime,
  showSkoposTaskRuntime,
} from '../../../runtime/src/application/task/task.service.js';
import {
  finishSkoposTaskRuntime,
  recordSkoposObservationEvidenceRuntime,
  verifySkoposTaskRuntime,
} from '../../../runtime/src/application/verification/verification.service.js';
import { getSkoposCoordinationStatus } from '../../../runtime/src/application/coordination/coordination.service.js';
import { buildSkoposWorkQueueRuntime } from '../../../runtime/src/application/work-queue/work-queue.service.js';
import { callSkoposMcpTool } from '../../../mcp/src/index.js';
import { syncCodexWrapperAdapter } from '../../../instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.js';
import { runTaskCommand } from '../cli/commands/task.js';

const temporaryRoots: string[] = [];
const originalCodexHome = process.env.CODEX_HOME;
const execFileAsync = promisify(execFile);

afterEach(async () => {
  if (originalCodexHome === undefined) delete process.env.CODEX_HOME;
  else process.env.CODEX_HOME = originalCodexHome;
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('linked parent and child Tasks', () => {
  it('proposes without mutation, then applies one exact reviewed linked split', async () => {
    const root = await createWorkspace();
    const parent = await startParent(root);

    const splitChildren = splitDrafts();
    const proposed = await callSkoposMcpTool('skopos_task_split_propose', {
      cwd: root,
      parentTaskId: parent.task.id,
      childrenJson: JSON.stringify(splitChildren),
      actor: 'parent-agent',
      reason: 'The two source files are independently claimable and can proceed in parallel.',
    }) as Awaited<ReturnType<typeof proposeSkoposTaskSplitRuntime>>;
    expect(proposed.proposal).toMatchObject({
      parentTaskId: parent.task.id,
      reviewRequired: true,
      taskAuthoritiesWritten: false,
      children: [
        { key: 'left', parentAcceptanceRequirementIds: ['acceptance-1'] },
        { key: 'right', parentAcceptanceRequirementIds: ['acceptance-2'] },
      ],
    });
    await expect(
      showSkoposTaskRuntime({ cwd: root, taskId: parent.task.id }),
    ).resolves.toMatchObject({ childTasks: [] });

    const applied = await callSkoposMcpTool('skopos_task_split_apply', {
      cwd: root,
      parentTaskId: parent.task.id,
      proposalDigest: proposed.proposal.proposalDigest,
      actor: 'parent-agent',
      reason: 'The reviewed children have independent ownership and acceptance.',
    }) as Awaited<ReturnType<typeof applySkoposTaskSplitRuntime>>;

    expect(applied.parentTask).toMatchObject({
      id: parent.task.id,
      state: 'blocked',
      coordination: { lastUpdatedBy: 'parent-agent' },
      childTasks: [
        {
          taskId: applied.childTasks[0]!.id,
          ownedPaths: ['src/left.ts'],
          parentAcceptanceRequirementIds: ['acceptance-1'],
        },
        {
          taskId: applied.childTasks[1]!.id,
          ownedPaths: ['src/right.ts'],
          parentAcceptanceRequirementIds: ['acceptance-2'],
        },
      ],
    });
    expect(applied.childTasks[0]).toMatchObject({
      parentTaskId: parent.task.id,
      dependencyTaskIds: [],
      coordination: {},
    });
    expect(applied.childTasks[1]).toMatchObject({
      parentTaskId: parent.task.id,
      dependencyTaskIds: [applied.childTasks[0]!.id],
    });
    expect(applied.activation.assignments).toEqual(
      applied.childTasks.map((child) =>
        expect.objectContaining({
          taskId: child.id,
          title: expect.stringMatching(/^Task Splitting Fixture: /u),
          projectShort: 'Task Splitting Fixture',
          reviewer: {
            parentTaskId: parent.task.id,
            actorId: 'parent-agent',
          },
          childActorId: `child-${child.id.toLowerCase()}`,
          sessionLeaseSeconds: 3600,
          hostContract: {
            requiredCapabilities: [
              'create-session',
              'inject-initial-prompt',
              'return-session-identity',
              'send-follow-up',
              'wait-for-result',
            ],
            sessionIdSource: 'returned-host-session-identity',
            deliveryStatus: 'not-attempted',
          },
          mcpTool: 'skopos_task_assign',
          cliCommand: expect.stringContaining(`task assign ${child.id}`),
          sessionContextCommand: expect.stringContaining('--lease-seconds 3600'),
          reviewCommand: `skopos task show ${child.id} . --full --json`,
          prompt: expect.stringContaining(`bounded child worker for linked Skopos Task ${child.id}`),
          sessionBindingFollowUp: expect.stringContaining('<returned-host-session-id>'),
          manualFallback: expect.objectContaining({
            reason: expect.stringContaining('Generated instructions are not host delivery'),
          }),
        }),
      ),
    );
    for (const [index, assignment] of applied.activation.assignments.entries()) {
      expect(assignment.prompt).toContain(applied.childTasks[index]!.goal);
      expect(assignment.prompt).toContain(
        applied.childTasks[index]!.changeScope.declaredOwnedPaths[0]!,
      );
      expect(assignment.cliCommand).toContain('--lease-seconds 3600');
      expect(assignment.sessionBindingFollowUp).toContain(parent.task.id);
      expect(assignment.manualFallback.prompt).toBe(assignment.prompt);
      expect(assignment.title.length).toBeLessThanOrEqual(56);
      expect(assignment.title).not.toContain(assignment.taskId);
    }
  });

  it('creates concise deterministic Codex task titles and suffixes only collisions', async () => {
    const root = await createWorkspace('skopos');
    const parent = await startParent(root);
    const longGoal = 'Generate exact truthful Skopos Codex child-task launch and parent-review instructions from an approved split';
    const proposed = await proposeSkoposTaskSplitRuntime({
      cwd: root,
      parentTaskId: parent.task.id,
      actor: 'parent-agent',
      reason: 'Exercise deterministic host-visible titles.',
      children: [
        {
          key: 'one',
          goal: longGoal,
          ownedPaths: ['src/left.ts'],
          parentAcceptanceRequirementIds: ['acceptance-1'],
        },
        {
          key: 'two',
          goal: longGoal,
          ownedPaths: ['src/right.ts'],
          parentAcceptanceRequirementIds: ['acceptance-2'],
        },
      ],
    });
    const applied = await applySkoposTaskSplitRuntime({
      cwd: root,
      parentTaskId: parent.task.id,
      proposalDigest: proposed.proposal.proposalDigest,
      actor: 'parent-agent',
      reason: 'Approve the deterministic title fixture.',
    });
    expect(applied.activation.assignments.map((assignment) => assignment.title)).toEqual([
      'Skopos: Codex child launch contract · 1',
      'Skopos: Codex child launch contract · 2',
    ]);
    for (const assignment of applied.activation.assignments) {
      expect(assignment.title.length).toBeLessThanOrEqual(56);
      expect(assignment.title).not.toContain(assignment.taskId);
    }
  });

  it('generates a truthful Codex launch contract and preserves the selected Session lease', async () => {
    const root = await createWorkspace();
    const result = await syncCodexWrapperAdapter({ cwd: root });
    const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8')) as {
      childTaskLaunch: Record<string, unknown>;
    };
    expect(manifest.childTaskLaunch).toMatchObject({
      requiresExplicitUserApproval: true,
      taskTitle: {
        format: '<ProjectShort>: <bounded child title>',
        maxCharacters: 56,
      },
      sessionIdSource: 'returned-codex-thread-identity',
      sessionLeaseSeconds: 3600,
      deliveryStatus: 'not-attempted-until-host-call-succeeds',
      requiredHostCapabilities: [
        'create-task',
        'inject-initial-prompt',
        'return-thread-identity',
        'send-follow-up',
        'wait-for-result',
      ],
    });
    expect(manifest.childTaskLaunch.workflow).toEqual(
      expect.arrayContaining([
        expect.stringContaining('explicit user approval'),
        expect.stringContaining('returned Codex thread identity'),
        expect.stringContaining('review canonical child Task state'),
      ]),
    );
    expect(manifest.childTaskLaunch.manualFallback).toContain(
      'Prompt generation is not delivery',
    );

    const entrypoint = await readFile(result.entrypointPath, 'utf8');
    expect(entrypoint).toContain("process.env.SKOPOS_SESSION_LEASE_SECONDS ?? 3600");
    expect(entrypoint).toContain("'--lease-seconds',\n  sessionLeaseSeconds");
    expect(entrypoint.match(/runSkopos\(projectDir, buildSessionContextArgs\(\)\)/gu)).toHaveLength(2);

    const readmePath = result.writes.find((write) => write.path.endsWith('/README.md'))!.path;
    const readme = await readFile(readmePath, 'utf8');
    expect(readme).toContain('must not create tasks until the user explicitly approves');
    expect(readme).toContain('use the returned Codex thread identity');
    expect(readme).toContain('wait for every child result');
    expect(readme).toContain('review canonical child Task state');
    expect(readme).toContain('never evidence of host');
  });

  it('rejects overlapping children and stale parent revisions before authority changes', async () => {
    const root = await createWorkspace();
    const parent = await startParent(root);

    await expect(
      proposeSkoposTaskSplitRuntime({
        cwd: root,
        parentTaskId: parent.task.id,
        actor: 'parent-agent',
        reason: 'This invalid proposal overlaps.',
        children: [
          { key: 'one', goal: 'Own the source tree', ownedPaths: ['src'] },
          { key: 'two', goal: 'Own one nested source', ownedPaths: ['src/right.ts'] },
        ],
      }),
    ).rejects.toThrow('Child ownership overlaps');

    const proposed = await proposeSplit(root, parent.task.id);
    await completeSkoposTaskStepRuntime({
      cwd: root,
      taskId: parent.task.id,
      stepId: parent.task.steps[0]!.id,
      actor: 'parent-agent',
    });
    await expect(
      applySkoposTaskSplitRuntime({
        cwd: root,
        parentTaskId: parent.task.id,
        proposalDigest: proposed.proposal.proposalDigest,
        actor: 'parent-agent',
        reason: 'Attempt to apply stale reviewed content.',
      }),
    ).rejects.toThrow('changed after proposal');
    await expect(
      showSkoposTaskRuntime({ cwd: root, taskId: parent.task.id }),
    ).resolves.toMatchObject({ childTasks: [] });
  });

  it('exposes the same review-only proposal through the public CLI parser', async () => {
    const root = await createWorkspace();
    const parent = await startParent(root);
    const proposalInputPath = join(root, 'split.json');
    await writeFile(
      proposalInputPath,
      JSON.stringify({
        reason: 'Exercise the public CLI split contract.',
        children: splitDrafts(),
      }),
      'utf8',
    );
    const writes: string[] = [];
    const output = vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      writes.push(String(chunk));
      return true;
    });
    try {
      await runTaskCommand([
        'split',
        'propose',
        parent.task.id,
        root,
        '--from',
        proposalInputPath,
        '--actor',
        'parent-agent',
        '--json',
      ]);
    } finally {
      output.mockRestore();
    }
    expect(JSON.parse(writes.join(''))).toMatchObject({
      proposal: {
        parentTaskId: parent.task.id,
        reviewRequired: true,
        taskAuthoritiesWritten: false,
      },
    });
  });

  it('assigns independent children to separate Sessions and preserves one writer per Session', async () => {
    const root = await createWorkspace();
    const parent = await startParent(root);
    const proposed = await proposeSplit(root, parent.task.id);
    const applied = await applySkoposTaskSplitRuntime({
      cwd: root,
      parentTaskId: parent.task.id,
      proposalDigest: proposed.proposal.proposalDigest,
      actor: 'parent-agent',
      reason: 'Assign the reviewed work in parallel.',
    });
    const [left, right] = applied.childTasks;

    const initialQueue = await buildSkoposWorkQueueRuntime({ cwd: root });
    expect(
      initialQueue.workQueue.entries.find((entry) => entry.id === right!.id),
    ).toMatchObject({
      disposition: 'blocked',
      dependencyIds: [left!.id],
    });

    await assignSkoposTaskToSessionRuntime({
      cwd: root,
      taskId: left!.id,
      actor: 'left-agent',
      sessionId: 'left-session',
      host: 'codex',
    });
    await assignSkoposTaskToSessionRuntime({
      cwd: root,
      taskId: right!.id,
      actor: 'right-agent',
      sessionId: 'right-session',
      host: 'claude-code',
    });
    await expect(
      assignSkoposTaskToSessionRuntime({
        cwd: root,
        taskId: right!.id,
        actor: 'left-agent',
        sessionId: 'left-session',
        host: 'codex',
      }),
    ).rejects.toThrow(/already reserves writing Task|reserved by Session/u);

    const status = await getSkoposCoordinationStatus({ cwd: root });
    expect(status.reservations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ taskId: left!.id, sessionId: 'left-session' }),
        expect.objectContaining({ taskId: right!.id, sessionId: 'right-session' }),
      ]),
    );
    expect(status.claims).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ taskId: left!.id, resourceKey: 'src/left.ts' }),
        expect.objectContaining({ taskId: right!.id, resourceKey: 'src/right.ts' }),
      ]),
    );
  });

  it('blocks parent closure until children complete and reconstructs the linked family', async () => {
    const root = await createWorkspace();
    const parent = await startParent(root);
    const proposed = await proposeSplit(root, parent.task.id);
    const applied = await applySkoposTaskSplitRuntime({
      cwd: root,
      parentTaskId: parent.task.id,
      proposalDigest: proposed.proposal.proposalDigest,
      actor: 'parent-agent',
      reason: 'Use completed children as parent acceptance proof.',
    });
    const blocked = await verifySkoposTaskRuntime({
      cwd: root,
      taskId: parent.task.id,
      phase: 'closure',
    });
    expect(blocked.blockers.join('\n')).toContain('Linked child Task');

    await finishChild(root, applied.childTasks[0]!, 'left-agent', 'left-session');
    await finishChild(root, applied.childTasks[1]!, 'right-agent', 'right-session');
    await mkdir(join(root, 'docs/work/tasks/snapshots'), { recursive: true });
    await writeFile(
      join(
        root,
        'docs/work/tasks/snapshots',
        `${applied.childTasks[0]!.id}-S-linked-proof.json`,
      ),
      '{"state":"complete"}\n',
      'utf8',
    );

    const refreshedParent = await showSkoposTaskRuntime({
      cwd: root,
      taskId: parent.task.id,
    });
    expect(refreshedParent).toMatchObject({
      state: 'ready',
      childTasks: [{ state: 'complete' }, { state: 'complete' }],
    });
    const completedQueue = await buildSkoposWorkQueueRuntime({ cwd: root });
    expect(
      completedQueue.workQueue.entries.find((entry) => entry.id === parent.task.id),
    ).toMatchObject({ disposition: 'ready' });
    const parentWorkflow = await assessSkoposTaskWorkflowRuntime({
      cwd: root,
      taskId: parent.task.id,
    });
    expect(parentWorkflow.ownershipSuggestion).toBeUndefined();
    const verified = await verifySkoposTaskRuntime({
      cwd: root,
      taskId: parent.task.id,
      phase: 'closure',
    });
    expect(verified.blockers, verified.blockers.join('\n')).toEqual([]);
    expect(verified.acceptanceCoverage).toEqual([
      expect.objectContaining({ status: 'covered', summary: expect.stringContaining('linked child') }),
      expect.objectContaining({ status: 'covered', summary: expect.stringContaining('linked child') }),
    ]);

    await rm(join(root, '.skopos/tasks'), { recursive: true, force: true });
    const reconstructedParent = await showSkoposTaskRuntime({
      cwd: root,
      taskId: parent.task.id,
    });
    expect(reconstructedParent.childTasks).toEqual([
      expect.objectContaining({ taskId: applied.childTasks[0]!.id, state: 'complete' }),
      expect.objectContaining({ taskId: applied.childTasks[1]!.id, state: 'complete' }),
    ]);
    await expect(
      showSkoposTaskRuntime({ cwd: root, taskId: applied.childTasks[0]!.id }),
    ).resolves.toMatchObject({ parentTaskId: parent.task.id, state: 'complete' });
  }, 20_000);
});

const startParent = (root: string) =>
  buildSkoposStartRuntime({
    cwd: root,
    goal: 'Deliver the two-part fixture through independently ownable work',
    actor: 'parent-agent',
    risk: 'standard',
    acceptanceCriteria: [
      'The left implementation is complete.',
      'The right implementation is complete.',
    ],
    ownedPaths: ['src/left.ts', 'src/right.ts'],
  });

const proposeSplit = (root: string, parentTaskId: string) =>
  proposeSkoposTaskSplitRuntime({
    cwd: root,
    parentTaskId,
    actor: 'parent-agent',
    reason: 'The two source files are independently claimable and can proceed in parallel.',
    children: splitDrafts(),
  });

const splitDrafts = () => [
  {
    key: 'left',
    goal: 'Complete the left implementation',
    acceptanceCriteria: ['The left child closes with focused proof.'],
    ownedPaths: ['src/left.ts'],
    parentAcceptanceRequirementIds: ['acceptance-1'],
  },
  {
    key: 'right',
    goal: 'Complete the right implementation after the left contract exists',
    acceptanceCriteria: ['The right child closes with focused proof.'],
    ownedPaths: ['src/right.ts'],
    dependsOnKeys: ['left'],
    parentAcceptanceRequirementIds: ['acceptance-2'],
  },
];

const finishChild = async (
  root: string,
  initialTask: Awaited<ReturnType<typeof showSkoposTaskRuntime>>,
  actor: string,
  sessionId: string,
): Promise<void> => {
  await assignSkoposTaskToSessionRuntime({
    cwd: root,
    taskId: initialTask.id,
    actor,
    sessionId,
    host: 'codex',
  });
  let task = await showSkoposTaskRuntime({ cwd: root, taskId: initialTask.id });
  for (const step of task.steps.filter((entry) => entry.kind !== 'verification')) {
    task = await completeSkoposTaskStepRuntime({
      cwd: root,
      taskId: task.id,
      stepId: step.id,
      actor,
    });
  }
  for (const requirement of task.evidenceRequirements) {
    await recordSkoposObservationEvidenceRuntime({
      cwd: root,
      taskId: task.id,
      requirementId: requirement.id,
      statement: `Focused proof for ${task.id}.`,
      actor,
    });
  }
  const readiness = await finishSkoposTaskRuntime({
    cwd: root,
    taskId: task.id,
    actor,
  });
  expect(readiness.blockers, readiness.blockers.join('\n')).toEqual([]);
  expect(readiness.taskState).toBe('complete');
};

const createWorkspace = async (projectName = 'task-splitting-fixture'): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-task-splitting-'));
  temporaryRoots.push(root);
  process.env.CODEX_HOME = join(root, '.codex-home');
  await Promise.all([
    mkdir(join(root, 'src'), { recursive: true }),
    mkdir(join(root, '.codex-home/sessions'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(root, 'package.json'),
      JSON.stringify({ name: projectName, private: true }),
      'utf8',
    ),
    writeFile(join(root, 'README.md'), '# Task splitting fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Agent rules\n', 'utf8'),
    writeFile(join(root, 'src/left.ts'), 'export const left = true;\n', 'utf8'),
    writeFile(join(root, 'src/right.ts'), 'export const right = true;\n', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  const configPath = join(root, 'skopos.config.yaml');
  const configSource = await readFile(configPath, 'utf8');
  await writeFile(
    configPath,
    configSource.replace(/^  name: .*$/mu, `  name: ${projectName}`),
    'utf8',
  );
  await mkdir(join(root, 'tools/skopos'), { recursive: true });
  await writeFile(
    join(root, 'tools/skopos/scopes.yaml'),
    [
      'schemaVersion: 1',
      'scopes:',
      '  - id: task-splitting-fixture',
      '    title: Task Splitting Fixture',
      '    kind: workspace',
      '    path: .',
      '    memoryRoot: docs',
      '    codeRoots: [.]',
      '    parent: null',
      '    profile: fixture.workspace',
      '    dependsOn: []',
      '    owners: [fixture]',
      '    aliases: [fixture]',
      '',
    ].join('\n'),
    'utf8',
  );
  await execFileAsync('git', ['init'], { cwd: root });
  await execFileAsync('git', ['config', 'user.email', 'fixture@example.test'], { cwd: root });
  await execFileAsync('git', ['config', 'user.name', 'Skopos Fixture'], { cwd: root });
  await execFileAsync('git', ['add', '.'], { cwd: root });
  await execFileAsync('git', ['commit', '-m', 'fixture baseline'], { cwd: root });
  return root;
};
