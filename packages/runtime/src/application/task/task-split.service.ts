import { createHash, randomUUID } from 'node:crypto';
import { readFile, rm } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import type {
  SkoposChildTaskReference,
  SkoposTaskArtifact,
  SkoposTaskAssignmentInstruction,
  SkoposTaskSplitActivation,
  SkoposTaskSplitActivationResult,
  SkoposTaskSplitChildDraft,
  SkoposTaskSplitChildPlan,
  SkoposTaskSplitProposal,
  SkoposTaskSplitProposalResult,
} from '@skopos/model';
import { resolveSkoposScopeForOwnedPaths } from '@skopos/query';

import { getSkoposCoordinationStatus } from '../coordination/coordination.service.js';
import { prepareSkoposPlanRuntime } from '../plan/plan.service.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  linkSkoposChildTasksRuntime,
  prepareSkoposTaskRuntime,
  publishSkoposTaskAuthorityRuntime,
  showSkoposTaskRuntime,
  writeSkoposTaskAuxiliaryArtifactsRuntime,
} from './task.service.js';
import {
  resolveSkoposTaskDirectory,
  resolveSkoposTaskSplitActivationPath,
  resolveSkoposTaskSplitProposalPath,
} from './task-paths.js';

export const proposeSkoposTaskSplitRuntime = async ({
  cwd,
  parentTaskId,
  children,
  actor,
  reason,
  dryRun = false,
}: {
  cwd: string;
  parentTaskId: string;
  children: SkoposTaskSplitChildDraft[];
  actor?: string;
  reason: string;
  dryRun?: boolean;
}): Promise<SkoposTaskSplitProposalResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireActor(actor);
  const proposalReason = requireText(reason, 'Task split proposal requires a non-empty reason.');
  const parent = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId: parentTaskId });
  assertSplittableParent(parent);
  assertTaskClaim(parent, actorId);
  const normalizedChildren = normalizeSplitChildren({
    workspaceRoot,
    parent,
    children,
  });
  const parentUpdatedAt = parent.updatedAt ?? parent.generatedAt;
  if (!parentUpdatedAt) {
    throw new Error(`Parent Task ${parent.id} has no revision timestamp.`);
  }
  const proposalDigest = digestSplitProposal({
    workspaceRoot,
    parentTaskId: parent.id,
    parentUpdatedAt,
    proposedByActorId: actorId,
    proposalReason,
    children: normalizedChildren,
  });
  const generatedAt = new Date().toISOString();
  const proposal: SkoposTaskSplitProposal = {
    schemaVersion: 1,
    id: `TSP-${proposalDigest.slice(0, 12)}`,
    type: 'task-split-proposal',
    status: 'draft',
    authority: 'generated',
    generatedAt,
    updatedAt: generatedAt,
    summary: `Proposed ${normalizedChildren.length} linked child Task${normalizedChildren.length === 1 ? '' : 's'} for ${parent.id}; no Task authority was changed.`,
    workspaceRoot,
    parentTaskId: parent.id,
    parentUpdatedAt,
    proposalDigest,
    proposedByActorId: actorId,
    proposalReason,
    children: normalizedChildren,
    reviewRequired: true,
    taskAuthoritiesWritten: false,
  };
  const proposalPath = resolveSkoposTaskSplitProposalPath(
    workspaceRoot,
    parent.taskIdentity,
  );
  const proposalWrite = await writeJsonArtifact({
    artifactPath: proposalPath,
    artifact: proposal,
    dryRun,
  });
  return { proposal, proposalPath, proposalWrite };
};

export const applySkoposTaskSplitRuntime = async ({
  cwd,
  parentTaskId,
  proposalDigest,
  actor,
  reason,
  dryRun = false,
}: {
  cwd: string;
  parentTaskId: string;
  proposalDigest: string;
  actor?: string;
  reason: string;
  dryRun?: boolean;
}): Promise<SkoposTaskSplitActivationResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireActor(actor);
  const approvalReason = requireText(reason, 'Applying a Task split requires a non-empty approval reason.');
  const parent = await showSkoposTaskRuntime({ cwd: workspaceRoot, taskId: parentTaskId });
  const proposalPath = resolveSkoposTaskSplitProposalPath(
    workspaceRoot,
    parent.taskIdentity,
  );
  const proposal = await readArtifact<SkoposTaskSplitProposal>(
    proposalPath,
    `Run skopos task split propose ${parentTaskId} first.`,
  );
  assertProposalIntegrity(proposal);
  if (proposal.parentTaskId !== parentTaskId) {
    throw new Error(
      `Split proposal targets ${proposal.parentTaskId}, not requested parent ${parentTaskId}.`,
    );
  }
  if (proposal.proposalDigest !== proposalDigest) {
    throw new Error(
      `Task split proposal digest mismatch. Expected ${proposal.proposalDigest}; received ${proposalDigest}.`,
    );
  }
  assertSplittableParent(parent);
  assertTaskClaim(parent, actorId);
  const currentRevision = parent.updatedAt ?? parent.generatedAt ?? '';
  if (currentRevision !== proposal.parentUpdatedAt) {
    throw new Error(
      `Parent Task ${parent.id} changed after proposal ${proposal.id}; propose the split again.`,
    );
  }
  const coordination = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
  const liveReservation = coordination.reservations.find(
    (reservation) => reservation.taskId === parent.id,
  );
  if (liveReservation) {
    throw new Error(
      `Parent Task ${parent.id} is still reserved by Session ${liveReservation.sessionId}. Release it before applying the split: skopos coordination task release ${parent.id} . --session ${liveReservation.sessionId} --reason 'Transfer writing ownership to linked child Tasks'.`,
    );
  }

  const taskIdByKey = new Map(
    proposal.children.map((child) => [
      child.key,
      `T-${randomUUID().replaceAll('-', '').slice(0, 8)}`,
    ]),
  );
  const preparedChildren = await Promise.all(
    proposal.children.map(async (child) => {
      const inferredScope =
        child.scopeId === undefined && child.ownedPaths.length > 0
          ? await resolveSkoposScopeForOwnedPaths({
              cwd: workspaceRoot,
              paths: child.ownedPaths,
            })
          : undefined;
      const plan = await prepareSkoposPlanRuntime({
        cwd: workspaceRoot,
        goal: child.goal,
        scope: child.scopeId ?? inferredScope?.scope.id,
      });
      const dependencyTaskIds = [
        ...child.dependencyTaskIds,
        ...child.dependsOnKeys.map((key) => taskIdByKey.get(key)!),
      ];
      return prepareSkoposTaskRuntime({
        cwd: workspaceRoot,
        plan,
        planIds: parent.planIds,
        acceptanceCriteria: child.acceptanceCriteria,
        nonGoals: child.nonGoals,
        constraints: child.constraints,
        ownedPaths: child.ownedPaths,
        risk: child.risk,
        priority: child.priority,
        dependencyTaskIds,
        taskId: taskIdByKey.get(child.key),
        parentTaskId: parent.id,
        dryRun,
      });
    }),
  );
  const childReferences: SkoposChildTaskReference[] = preparedChildren.map(
    (prepared, index) => {
      const childPlan = proposal.children[index]!;
      return {
        taskId: prepared.task.id,
        title: prepared.task.title,
        goal: prepared.task.goal,
        scopeId: prepared.task.scope.scope.id,
        state: prepared.task.state,
        createdAt: prepared.task.generatedAt ?? new Date().toISOString(),
        createdByActorId: actorId,
        ownedPaths: [...prepared.task.changeScope.declaredOwnedPaths],
        dependencyTaskIds: [...prepared.task.dependencyTaskIds],
        parentAcceptanceRequirementIds: [
          ...childPlan.parentAcceptanceRequirementIds,
        ],
      };
    },
  );

  let parentTask = parent;
  if (!dryRun) {
    const persistedChildren: typeof preparedChildren = [];
    try {
      for (const prepared of preparedChildren) {
        await writeSkoposTaskAuxiliaryArtifactsRuntime({ prepared });
        await publishSkoposTaskAuthorityRuntime({ prepared });
        persistedChildren.push(prepared);
      }
      parentTask = await linkSkoposChildTasksRuntime({
        cwd: workspaceRoot,
        parentTaskId: parent.id,
        children: childReferences,
        expectedParentUpdatedAt: proposal.parentUpdatedAt,
        actor: actorId,
      });
    } catch (error) {
      await Promise.all(
        persistedChildren.map((prepared) => cleanupPreparedChild(workspaceRoot, prepared.task)),
      );
      throw error;
    }
  } else {
    parentTask = {
      ...parent,
      childTasks: [...parent.childTasks, ...childReferences],
      state: 'blocked',
    };
  }

  const config = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));
  if (!config) {
    throw new Error('Task assignment generation requires canonical project.name.');
  }
  const projectSettings = config.project as typeof config.project & {
    shortName?: string;
  };
  const projectShort = titleCaseProjectShort(
    projectSettings.shortName ?? projectSettings.name,
  );
  const assignmentTitles = buildAssignmentTitles(
    projectShort,
    preparedChildren.map(({ task }) => task.title),
  );
  const assignments = preparedChildren.map(({ task }, index) =>
    buildAssignmentInstruction({
      task,
      title: assignmentTitles[index]!,
      projectShort,
      parentTaskId: parent.id,
      reviewerActorId: actorId,
    }),
  );
  const activatedAt = new Date().toISOString();
  const activation: SkoposTaskSplitActivation = {
    schemaVersion: 1,
    id: `TSA-${proposal.proposalDigest.slice(0, 12)}`,
    type: 'task-split-activation',
    status: 'generated',
    authority: 'generated',
    generatedAt: activatedAt,
    updatedAt: activatedAt,
    summary: `Created and linked ${preparedChildren.length} child Task${preparedChildren.length === 1 ? '' : 's'} under ${parent.id}.`,
    workspaceRoot,
    parentTaskId: parent.id,
    proposalDigest: proposal.proposalDigest,
    appliedByActorId: actorId,
    approvalReason,
    childTaskIds: preparedChildren.map(({ task }) => task.id),
    assignments,
  };
  const activationPath = resolveSkoposTaskSplitActivationPath(
    workspaceRoot,
    parent.taskIdentity,
  );
  const activationWrite = await writeJsonArtifact({
    artifactPath: activationPath,
    artifact: activation,
    dryRun,
  });
  return {
    activation,
    activationPath,
    activationWrite,
    parentTask,
    childTasks: preparedChildren.map(({ task }) => task),
  };
};

export const startSkoposLinkedChildTaskRuntime = async ({
  cwd,
  parentTaskId,
  goal,
  ownedPaths,
  actor,
  reason,
  scopeId,
  acceptanceCriteria = [],
  nonGoals = [],
  constraints = [],
  dependencyTaskIds = [],
  parentAcceptanceRequirementIds = [],
  risk = 'standard',
  priority,
}: {
  cwd: string;
  parentTaskId: string;
  goal: string;
  ownedPaths: string[];
  actor?: string;
  reason: string;
  scopeId?: string;
  acceptanceCriteria?: string[];
  nonGoals?: string[];
  constraints?: string[];
  dependencyTaskIds?: string[];
  parentAcceptanceRequirementIds?: string[];
  risk?: 'standard' | 'high-impact';
  priority?: number;
}): Promise<SkoposTaskSplitActivationResult> => {
  const keyDigest = createHash('sha256')
    .update(JSON.stringify({ parentTaskId, goal, ownedPaths }))
    .digest('hex')
    .slice(0, 10);
  const proposed = await proposeSkoposTaskSplitRuntime({
    cwd,
    parentTaskId,
    actor,
    reason,
    children: [
      {
        key: `child-${keyDigest}`,
        goal,
        scopeId,
        acceptanceCriteria,
        nonGoals,
        constraints,
        ownedPaths,
        dependencyTaskIds,
        parentAcceptanceRequirementIds,
        risk,
        priority,
      },
    ],
    dryRun: false,
  });
  return applySkoposTaskSplitRuntime({
    cwd,
    parentTaskId,
    proposalDigest: proposed.proposal.proposalDigest,
    actor,
    reason,
  });
};

const normalizeSplitChildren = ({
  workspaceRoot,
  parent,
  children,
}: {
  workspaceRoot: string;
  parent: SkoposTaskArtifact;
  children: SkoposTaskSplitChildDraft[];
}): SkoposTaskSplitChildPlan[] => {
  if (children.length === 0) {
    throw new Error('A Task split proposal requires at least one child.');
  }
  const normalized = children.map((child, index): SkoposTaskSplitChildPlan => {
    const key = child.key.trim();
    if (!/^[a-z0-9][a-z0-9-]*$/u.test(key)) {
      throw new Error(
        `Child ${index + 1} key must use lowercase letters, numbers, and hyphens.`,
      );
    }
    const goal = requireText(child.goal, `Child ${key} requires a non-empty goal.`);
    const ownedPaths = uniqueStrings(child.ownedPaths).map((path) =>
      normalizeOwnedPath(workspaceRoot, path),
    );
    if (ownedPaths.length === 0) {
      throw new Error(`Child ${key} requires at least one owned path.`);
    }
    return {
      key,
      goal,
      ...(child.scopeId?.trim() ? { scopeId: child.scopeId.trim() } : {}),
      acceptanceCriteria: uniqueStrings(child.acceptanceCriteria ?? []),
      nonGoals: uniqueStrings(child.nonGoals ?? []),
      constraints: uniqueStrings(child.constraints ?? []),
      ownedPaths,
      dependsOnKeys: uniqueStrings(child.dependsOnKeys ?? []),
      dependencyTaskIds: uniqueStrings(child.dependencyTaskIds ?? []),
      parentAcceptanceRequirementIds: uniqueStrings(
        child.parentAcceptanceRequirementIds ?? [],
      ),
      risk: child.risk ?? 'standard',
      priority: normalizePriority(child.priority ?? parent.priority),
    };
  });
  const keySet = new Set(normalized.map((child) => child.key));
  if (keySet.size !== normalized.length) {
    throw new Error('Every proposed child requires a unique key.');
  }
  const parentRequirementIds = new Set(
    parent.evidenceRequirements
      .filter((requirement) => requirement.id.startsWith('acceptance-'))
      .map((requirement) => requirement.id),
  );
  for (const child of normalized) {
    for (const dependencyKey of child.dependsOnKeys) {
      if (!keySet.has(dependencyKey)) {
        throw new Error(
          `Child ${child.key} depends on unknown proposed child ${dependencyKey}.`,
        );
      }
      if (dependencyKey === child.key) {
        throw new Error(`Child ${child.key} cannot depend on itself.`);
      }
    }
    for (const requirementId of child.parentAcceptanceRequirementIds) {
      if (!parentRequirementIds.has(requirementId)) {
        throw new Error(
          `Child ${child.key} maps unknown parent acceptance requirement ${requirementId}.`,
        );
      }
    }
  }
  assertAcyclicDependencies(normalized);
  assertNonOverlappingChildOwnership(normalized, parent.childTasks);
  return normalized;
};

const assertAcyclicDependencies = (children: SkoposTaskSplitChildPlan[]): void => {
  const byKey = new Map(children.map((child) => [child.key, child]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (key: string): void => {
    if (visited.has(key)) return;
    if (visiting.has(key)) {
      throw new Error(`Proposed child dependency cycle includes ${key}.`);
    }
    visiting.add(key);
    for (const dependency of byKey.get(key)?.dependsOnKeys ?? []) visit(dependency);
    visiting.delete(key);
    visited.add(key);
  };
  for (const child of children) visit(child.key);
};

const assertNonOverlappingChildOwnership = (
  children: SkoposTaskSplitChildPlan[],
  existingChildren: SkoposChildTaskReference[],
): void => {
  const entries = [
    ...existingChildren.flatMap((child) =>
      (child.ownedPaths ?? []).map((path) => ({ owner: child.taskId, path })),
    ),
    ...children.flatMap((child) =>
      child.ownedPaths.map((path) => ({ owner: child.key, path })),
    ),
  ];
  for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
    const left = entries[leftIndex]!;
    for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
      const right = entries[rightIndex]!;
      if (left.owner !== right.owner && pathsOverlap(left.path, right.path)) {
        throw new Error(
          `Child ownership overlaps between ${left.owner} (${left.path}) and ${right.owner} (${right.path}).`,
        );
      }
    }
  }
};

const pathsOverlap = (left: string, right: string): boolean => {
  const leftBase = pathPatternBase(left);
  const rightBase = pathPatternBase(right);
  return (
    leftBase === rightBase ||
    leftBase.startsWith(`${rightBase}/`) ||
    rightBase.startsWith(`${leftBase}/`)
  );
};

const pathPatternBase = (path: string): string =>
  path.slice(0, path.search(/[*?]/u) < 0 ? path.length : path.search(/[*?]/u))
    .replace(/\/+$/u, '');

const normalizeOwnedPath = (workspaceRoot: string, value: string): string => {
  const trimmed = value.trim().replaceAll('\\', '/');
  if (!trimmed) throw new Error('Child owned paths cannot be empty.');
  const projectPath = relative(workspaceRoot, resolve(workspaceRoot, trimmed))
    .replaceAll('\\', '/');
  if (
    projectPath === '..' ||
    projectPath.startsWith('../') ||
    projectPath.startsWith('/')
  ) {
    throw new Error(`Child owned path must stay inside the workspace: ${value}.`);
  }
  return projectPath || '.';
};

const assertSplittableParent = (parent: SkoposTaskArtifact): void => {
  if (!['active', 'ready', 'blocked'].includes(parent.state)) {
    throw new Error(
      `Task ${parent.id} is ${parent.state}; only active, ready, or blocked work can be split.`,
    );
  }
};

const assertTaskClaim = (task: SkoposTaskArtifact, actorId: string): void => {
  const claimedBy = task.coordination.claimedBy?.actorId;
  if (!claimedBy) {
    throw new Error(`Task ${task.id} must be claimed before its work can be split.`);
  }
  if (claimedBy !== actorId) {
    throw new Error(`Task ${task.id} is claimed by ${claimedBy}, not ${actorId}.`);
  }
};

const assertProposalIntegrity = (proposal: SkoposTaskSplitProposal): void => {
  const actual = digestSplitProposal({
    workspaceRoot: proposal.workspaceRoot,
    parentTaskId: proposal.parentTaskId,
    parentUpdatedAt: proposal.parentUpdatedAt,
    proposedByActorId: proposal.proposedByActorId,
    proposalReason: proposal.proposalReason,
    children: proposal.children,
  });
  if (actual !== proposal.proposalDigest) {
    throw new Error('Task split proposal content changed after generation; propose it again.');
  }
};

const digestSplitProposal = (value: {
  workspaceRoot: string;
  parentTaskId: string;
  parentUpdatedAt: string;
  proposedByActorId: string;
  proposalReason: string;
  children: SkoposTaskSplitChildPlan[];
}): string => createHash('sha256').update(JSON.stringify(value)).digest('hex');

const CHILD_SESSION_LEASE_SECONDS = 3600;

const buildAssignmentInstruction = ({
  task,
  title,
  projectShort,
  parentTaskId,
  reviewerActorId,
}: {
  task: SkoposTaskArtifact;
  title: string;
  projectShort: string;
  parentTaskId: string;
  reviewerActorId: string;
}): SkoposTaskAssignmentInstruction => {
  const childActorId = `child-${task.id.toLowerCase()}`;
  const sessionId = '<returned-host-session-id>';
  const cliCommand = [
    `skopos task assign ${task.id} .`,
    `--actor ${childActorId}`,
    `--session-id ${sessionId}`,
    '--host <host>',
    `--lease-seconds ${CHILD_SESSION_LEASE_SECONDS}`,
    '--json',
  ].join(' ');
  const sessionContextCommand = [
    'skopos session context .',
    `--actor ${childActorId}`,
    `--session-id ${sessionId}`,
    '--host <host>',
    `--lease-seconds ${CHILD_SESSION_LEASE_SECONDS}`,
    '--json',
  ].join(' ');
  const prompt = [
    `You are a bounded child worker for linked Skopos Task ${task.id}.`,
    `Goal: ${task.goal}`,
    `Work only in the assigned project and only in these Task-owned paths: ${task.changeScope.declaredOwnedPaths.join(', ')}.`,
    task.contract.acceptanceCriteria.length > 0
      ? `Acceptance: ${task.contract.acceptanceCriteria.join(' | ')}`
      : 'Acceptance: follow the Task Evidence requirements and focused proof selected by Skopos.',
    `Parent Task ${parentTaskId}, reviewed by actor ${reviewerActorId}, remains the integration and final-review authority.`,
    'Do not edit yet. The originating host must first send the exact returned host Session identity to bind as the Skopos Session id.',
    'Do not adopt parent or sibling Task documents unless this child explicitly owns them.',
  ].join('\n');
  const sessionBindingFollowUp = [
    `Use the exact host Session identity returned by the host in place of ${sessionId}.`,
    `First run: ${cliCommand}`,
    `Then run: ${sessionContextCommand}`,
    `Keep --lease-seconds ${CHILD_SESSION_LEASE_SECONDS} on every later session-context refresh.`,
    `Finish Task ${task.id}, release its coordination claims, and report changed behavior, Evidence, Memory resolution, and remaining risk to reviewer ${reviewerActorId} on parent Task ${parentTaskId}.`,
  ].join('\n');
  return {
    taskId: task.id,
    title,
    projectShort,
    reviewer: {
      parentTaskId,
      actorId: reviewerActorId,
    },
    childActorId,
    sessionLeaseSeconds: CHILD_SESSION_LEASE_SECONDS,
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
    cliCommand,
    sessionContextCommand,
    reviewCommand: `skopos task show ${task.id} . --full --json`,
    mcpTool: 'skopos_task_assign',
    prompt,
    sessionBindingFollowUp,
    manualFallback: {
      reason: 'Use when the host cannot create, identify, message, or wait on a fresh coding-agent Session. Generated instructions are not host delivery.',
      prompt,
      sessionBindingFollowUp,
    },
  };
};

const MAX_ASSIGNMENT_TITLE_LENGTH = 56;
const GENERIC_TITLE_VERB = /^(?:implement|generate|expose|create|build|add|update|make|deliver)\s+/iu;

const buildAssignmentTitles = (
  projectShort: string,
  childTitles: string[],
): string[] => {
  const bases = childTitles.map((childTitle) =>
    buildAssignmentTitleBase(projectShort, childTitle),
  );
  const totals = new Map<string, number>();
  for (const base of bases) {
    const key = base.toLocaleLowerCase('en-US');
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }
  const seen = new Map<string, number>();
  return bases.map((base) => {
    const key = base.toLocaleLowerCase('en-US');
    if ((totals.get(key) ?? 0) === 1) return fitAssignmentTitle(base);
    const ordinal = (seen.get(key) ?? 0) + 1;
    seen.set(key, ordinal);
    return fitAssignmentTitle(base, ` · ${ordinal}`);
  });
};

const buildAssignmentTitleBase = (
  projectShort: string,
  childTitle: string,
): string => {
  const escapedProject = projectShort.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const boundedTitle = childTitle
    .trim()
    .replace(new RegExp(`^${escapedProject}(?:\\s*[:\\-–—]\\s*|\\s+)`, 'iu'), '')
    .replace(GENERIC_TITLE_VERB, '')
    .replace(/\bfrom\s+(?:an?\s+)?approved\s+split\b/giu, '')
    .replace(/\b(?:exact|truthful)\b/giu, '')
    .replace(new RegExp(`^\\s*${escapedProject}(?:\\s*[:\\-–—]\\s*|\\s+)`, 'iu'), '')
    .replace(/\bchild[- ]task\b/giu, 'child')
    .replace(/\bparent[- ]review\b/giu, '')
    .replace(/\binstructions?\b/giu, 'contract')
    .replace(/\s+and\s+(?=contract\b)/giu, ' ')
    .replace(/\s+/gu, ' ')
    .replace(/^[\s:–—-]+|[\s:–—-]+$/gu, '');
  return `${projectShort}: ${sentenceCase(boundedTitle || 'Bounded child work')}`;
};

const fitAssignmentTitle = (base: string, suffix = ''): string => {
  const available = MAX_ASSIGNMENT_TITLE_LENGTH - suffix.length;
  if (base.length <= available) return `${base}${suffix}`;
  const clipped = base.slice(0, available + 1);
  const boundary = clipped.lastIndexOf(' ');
  const compact = (boundary > base.indexOf(':') + 2
    ? clipped.slice(0, boundary)
    : base.slice(0, available)).trimEnd();
  return `${compact}${suffix}`;
};

const titleCaseProjectShort = (value: string): string =>
  value
    .trim()
    .split(/[\s_-]+/u)
    .filter(Boolean)
    .map((word) =>
      word === word.toUpperCase()
        ? word
        : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(' ');

const sentenceCase = (value: string): string =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

const cleanupPreparedChild = async (
  workspaceRoot: string,
  task: SkoposTaskArtifact,
): Promise<void> => {
  await Promise.all([
    rm(resolveSkoposTaskDirectory(workspaceRoot, task.taskIdentity), {
      recursive: true,
      force: true,
    }),
    ...(task.trackedDocumentPath
      ? [rm(resolve(workspaceRoot, task.trackedDocumentPath), { force: true })]
      : []),
  ]);
};

const readArtifact = async <T>(path: string, missingMessage: string): Promise<T> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(missingMessage);
    }
    throw error;
  }
};

const requireActor = (actor?: string): string => {
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Task split mutation requires --actor <id> or SKOPOS_ACTOR.');
  }
  return actorId;
};

const requireText = (value: string, message: string): string => {
  const normalized = value.trim();
  if (!normalized) throw new Error(message);
  return normalized;
};

const uniqueStrings = (values: string[]): string[] => [
  ...new Set(values.map((value) => value.trim()).filter(Boolean)),
];

const normalizePriority = (priority: number): number => {
  if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
    throw new Error('Child Task priority must be an integer from 0 to 100.');
  }
  return priority;
};
