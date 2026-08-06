import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

import type {
  SkoposConversationCapsule,
  SkoposDiscussionHandoffArtifact,
  SkoposDiscussionHandoffFreshness,
  SkoposDiscussionHandoffValidation,
  SkoposTaskArtifact,
  SkoposTaskIdentity,
} from '@skopos/model';

import {
  claimSkoposCoordinationResource,
  getSkoposCoordinationStatus,
  releaseSkoposCoordinationTask,
  reserveSkoposCoordinationTask,
} from '../coordination/coordination.service.js';
import { resolveCurrentTaskState } from './current-task-state.js';
import { estimateTokens, readJsonIfExists } from './token-control-state.js';
import { writeJsonArtifact } from './write-json-artifact.js';

const HANDOFF_BUDGET_TOKENS = 4_000;
const SECRET_PATTERN = /(-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:api[_-]?key|token|secret|password)\s*[:=]\s*[^\s,;]+)/giu;

export interface RefreshSkoposDiscussionHandoffResult {
  path: string;
  write: 'written' | 'dry-run';
  artifact: SkoposDiscussionHandoffArtifact;
}

export const refreshSkoposDiscussionHandoff = async ({
  workspaceRoot,
  taskId,
  taskIdentity,
  conversationCapsule,
  dryRun = false,
}: {
  workspaceRoot: string;
  taskId?: string;
  taskIdentity?: SkoposTaskIdentity;
  conversationCapsule?: SkoposConversationCapsule;
  dryRun?: boolean;
}): Promise<RefreshSkoposDiscussionHandoffResult> => {
  const current = await resolveCurrentTaskState({ workspaceRoot, taskId, taskIdentity });
  if (!current) throw new Error('Task-scoped discussion handoff requires an exact current Task identity.');

  const previous = await readJsonIfExists<SkoposDiscussionHandoffArtifact>(current.handoffPath);
  const capsule = sanitizeAndValidateCapsule(conversationCapsule ?? previous?.conversationCapsule);
  const compiledState = await compileLiveState(workspaceRoot, current.task);
  const prompt = renderContinuationPrompt({ task: current.task, capsule: capsule.value });
  const estimatedTokens = estimateTokens(prompt);
  const coordinationReasons = coordinationConflicts(compiledState.coordinationIdentity);
  const validation = buildValidation({
    freshness: coordinationReasons.length ? 'conflicted' : 'current',
    sensitive: capsule.sensitive,
    overBudget: estimatedTokens > HANDOFF_BUDGET_TOKENS,
    reasons: [...capsule.reasons, ...coordinationReasons],
  });
  const now = new Date().toISOString();
  const artifact: SkoposDiscussionHandoffArtifact = {
    schemaVersion: 1,
    id: `discussion-handoff-${digest(`${current.task.taskIdentity.worktreeId}\0${current.task.id}`).slice(0, 16)}`,
    type: 'discussion-handoff',
    status: 'generated',
    authority: 'generated',
    summary: `Fresh-session continuation handoff for ${current.task.id}.`,
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    handoffKind: 'fresh-session-continuation',
    activeTaskId: current.task.id,
    conversationCapsule: capsule.value,
    compiledState,
    validation,
    delivery: { state: 'generated' },
    currentDirection: current.task.goal,
    acceptedDecisions: current.task.questions.filter((q) => q.status === 'resolved' && q.resolvedOptionId).map((q) => ({
      id: q.id,
      title: q.question,
      resolvedOptionId: q.resolvedOptionId!,
      resolvedOptionLabel: q.options.find((option) => option.id === q.resolvedOptionId)?.label,
    })),
    openQuestions: current.task.questions.filter((q) => q.status === 'open').map((q) => ({
      id: q.id,
      title: q.question,
      blocking: q.blocking,
      recommendedOptionId: q.recommendedOptionId,
    })),
    recommendedNextCommand: `skopos session context . --actor <receiving-actor> --json`,
    linkedCheckpointIds: [],
    linkedArtifactPaths: [
      relative(workspaceRoot, current.taskPath),
      ...(current.task.trackedDocumentPath ? [current.task.trackedDocumentPath] : []),
    ],
    resumeSummary: prompt,
    estimatedTokens,
    budgetTokens: HANDOFF_BUDGET_TOKENS,
    overBudget: validation.overBudget,
  };
  const write = await writeJsonArtifact({ artifactPath: current.handoffPath, artifact, dryRun });
  return { path: current.handoffPath, write, artifact };
};

export const verifySkoposDiscussionHandoff = async ({
  workspaceRoot,
  taskId,
  taskIdentity,
}: {
  workspaceRoot: string;
  taskId?: string;
  taskIdentity?: SkoposTaskIdentity;
}): Promise<{ path: string; artifact: SkoposDiscussionHandoffArtifact; validation: SkoposDiscussionHandoffValidation }> => {
  const current = await resolveCurrentTaskState({ workspaceRoot, taskId, taskIdentity });
  if (!current) throw new Error('Handoff verification requires an exact current Task identity.');
  const artifact = await readJsonIfExists<SkoposDiscussionHandoffArtifact>(current.handoffPath);
  if (!artifact || artifact.handoffKind !== 'fresh-session-continuation' || !artifact.conversationCapsule) {
    throw new Error(`Task ${current.task.id} has no schemaVersion 1 conversation-aware handoff.`);
  }
  const live = await compileLiveState(workspaceRoot, current.task);
  const reasons: string[] = [];
  let freshness: SkoposDiscussionHandoffFreshness = 'current';
  if (artifact.activeTaskId !== current.task.id || artifact.compiledState.workspaceIdentity.repositoryId !== live.workspaceIdentity.repositoryId || artifact.compiledState.workspaceIdentity.worktreeId !== live.workspaceIdentity.worktreeId) {
    freshness = 'invalid'; reasons.push('Project, worktree, or Task identity does not match.');
  } else {
    const conflicts = coordinationConflicts(live.coordinationIdentity);
    if (conflicts.length) { freshness = 'conflicted'; reasons.push(...conflicts); }
    else if (artifact.compiledState.taskIdentity.revisionDigest !== live.taskIdentity.revisionDigest) { freshness = 'refreshable'; reasons.push('Live Task state changed and can be recompiled around the preserved capsule.'); }
    else if (artifact.compiledState.coordinationIdentity.digest !== live.coordinationIdentity.digest) { freshness = 'refreshable'; reasons.push('Claims, reservation, or reconciled mutation state changed and can be recompiled safely.'); }
    else if (artifact.compiledState.sourceIdentity.ownedPathDigest !== live.sourceIdentity.ownedPathDigest || artifact.compiledState.evidenceIdentities.join('\0') !== live.evidenceIdentities.join('\0')) { freshness = 'stale'; reasons.push('Owned source or relevant Evidence identity changed.'); }
    else if (artifact.compiledState.policyIdentity !== live.policyIdentity || artifact.compiledState.skillSelectionIdentity !== live.skillSelectionIdentity) { freshness = 'refreshable'; reasons.push('Policy or relevant Skill selection identity changed.'); }
  }
  const validation = buildValidation({ freshness, sensitive: artifact.validation.sensitive, overBudget: artifact.overBudget, reasons });
  return { path: current.handoffPath, artifact: { ...artifact, validation }, validation };
};

export const acceptSkoposDiscussionHandoff = async ({ workspaceRoot, taskId, actor, receivingSessionId, destinationHost, dryRun = false }: { workspaceRoot: string; taskId?: string; actor: string; receivingSessionId: string; destinationHost: string; dryRun?: boolean }): Promise<RefreshSkoposDiscussionHandoffResult> => {
  const verified = await verifySkoposDiscussionHandoff({ workspaceRoot, taskId });
  if (!verified.validation.valid || !verified.validation.safeToTransfer) throw new Error(`Handoff cannot be accepted: ${verified.validation.reasons.join(' ')}`);
  const coordination = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
  const receivingSession = coordination.sessions.find((entry) => entry.sessionId === receivingSessionId && entry.state === 'live' && entry.mode === 'writer');
  if (!receivingSession || receivingSession.actorId !== actor) throw new Error(`Receiving Session ${receivingSessionId} must be a live writer owned by ${actor}.`);
  const reservation = coordination.reservations.find((entry) => entry.taskId === verified.artifact.activeTaskId);
  const priorClaims = coordination.claims.filter((entry) => entry.taskId === verified.artifact.activeTaskId);
  if (reservation && reservation.sessionId !== verified.artifact.conversationCapsule.origin.sessionId) throw new Error(`Task is reserved by ${reservation.sessionId}, not the handoff origin Session.`);
  if (!dryRun) {
    if (reservation && reservation.sessionId !== receivingSessionId) await releaseSkoposCoordinationTask({ cwd: workspaceRoot, sessionId: reservation.sessionId, taskId: verified.artifact.activeTaskId, reason: `Explicit fresh-session continuation accepted by ${actor}.` });
    await reserveSkoposCoordinationTask({ cwd: workspaceRoot, sessionId: receivingSessionId, taskId: verified.artifact.activeTaskId });
    for (const claim of priorClaims) await claimSkoposCoordinationResource({ cwd: workspaceRoot, sessionId: receivingSessionId, taskId: verified.artifact.activeTaskId, resourceKind: claim.resourceKind, resourceKey: claim.resourceKey });
  }
  const now = new Date().toISOString();
  const current = await resolveCurrentTaskState({ workspaceRoot, taskId: verified.artifact.activeTaskId });
  if (!current) throw new Error('Accepted handoff lost its exact current Task identity.');
  const compiledState = dryRun ? verified.artifact.compiledState : await compileLiveState(workspaceRoot, current.task);
  const artifact: SkoposDiscussionHandoffArtifact = { ...verified.artifact, compiledState, validation: verified.validation, updatedAt: now, delivery: { ...verified.artifact.delivery, state: 'accepted', destinationHost, receivingSessionId, reviewedBy: actor, reviewedAt: now, acceptedBy: actor, acceptedAt: now } };
  const write = await writeJsonArtifact({ artifactPath: verified.path, artifact, dryRun });
  return { path: verified.path, write, artifact };
};

export const loadSkoposDiscussionHandoff = async (workspaceRoot: string, taskId?: string): Promise<{ path: string; artifact: SkoposDiscussionHandoffArtifact }> => {
  const current = await resolveCurrentTaskState({ workspaceRoot, taskId });
  if (!current) throw new Error('Handoff inspection requires an exact current Task identity.');
  const artifact = await readJsonIfExists<SkoposDiscussionHandoffArtifact>(current.handoffPath);
  if (!artifact) throw new Error(`Task ${current.task.id} has no handoff.`);
  return { path: current.handoffPath, artifact };
};

export const recordSkoposDiscussionHandoffDelivery = async ({ workspaceRoot, taskId, actor, result, destinationRef, originMessageOutcome, detail, dryRun = false }: { workspaceRoot: string; taskId?: string; actor: string; result: 'pass' | 'fail'; destinationRef?: string; originMessageOutcome: 'succeeded' | 'failed' | 'unsupported'; detail: string; dryRun?: boolean }): Promise<RefreshSkoposDiscussionHandoffResult> => {
  const loaded = await loadSkoposDiscussionHandoff(workspaceRoot, taskId);
  if (loaded.artifact.delivery.state !== 'accepted') throw new Error('Delivery can be recorded only after the exact handoff is accepted for a receiving Session.');
  const now = new Date().toISOString();
  const outcome = JSON.stringify({ result, actor, destinationRef, originMessageOutcome, detail, recordedAt: now });
  const artifact: SkoposDiscussionHandoffArtifact = { ...loaded.artifact, updatedAt: now, delivery: { ...loaded.artifact.delivery, state: result === 'pass' ? 'delivered' : 'failed', outcome } };
  const write = await writeJsonArtifact({ artifactPath: loaded.path, artifact, dryRun });
  return { path: loaded.path, write, artifact };
};

export const renderSkoposDiscussionContinuationPrompt = (artifact: SkoposDiscussionHandoffArtifact): string => artifact.resumeSummary;

const compileLiveState = async (workspaceRoot: string, task: SkoposTaskArtifact) => {
  const coordination = await getSkoposCoordinationStatus({ cwd: workspaceRoot });
  const taskClaims = coordination.claims.filter((entry) => entry.taskId === task.id);
  const taskMutations = coordination.mutations.filter((entry) => entry.taskId === task.id);
  const contamination = coordination.contamination.filter((entry) => entry.taskId === task.id && entry.state === 'open');
  const runningActionIds = await loadRunningActionIds(workspaceRoot, task.id);
  const ownedPathDigest = await digestPaths(workspaceRoot, task.changeScope.declaredOwnedPaths);
  const branch = git(workspaceRoot, ['branch', '--show-current']);
  const commit = git(workspaceRoot, ['rev-parse', 'HEAD']);
  const evidenceIdentities = await loadEvidenceIdentities(workspaceRoot, task.id);
  const policyIdentity = await digestPaths(workspaceRoot, ['AGENTS.md', 'tools/skopos/policies.yaml']);
  const skillSelectionIdentity = await optionalDigest(join(workspaceRoot, '.skopos/cache/agent/skill-context.json'));
  const coordinationIdentity = {
    digest: digest(JSON.stringify({ reservations: coordination.reservations.filter((r) => r.taskId === task.id), claims: taskClaims, mutations: taskMutations, contamination, runningActionIds })),
    reservationSessionId: coordination.reservations.find((entry) => entry.taskId === task.id)?.sessionId,
    claimCount: taskClaims.length,
    openMutationCount: taskMutations.filter((entry) => entry.status === 'open').length,
    contaminationCount: contamination.length,
    runningActionIds,
  };
  return {
    workspaceIdentity: { repositoryId: task.taskIdentity.repositoryId, worktreeId: task.taskIdentity.worktreeId, workspaceRootDigest: digest(resolve(workspaceRoot)) },
    taskIdentity: { taskId: task.id, revisionDigest: digest(JSON.stringify({ updatedAt: task.updatedAt, state: task.state, steps: task.steps, questions: task.questions, recommendations: task.recommendations })), state: task.state },
    sourceIdentity: { branch: branch || undefined, commit: commit || undefined, ownedPathDigest },
    coordinationIdentity,
    policyIdentity,
    skillSelectionIdentity,
    evidenceIdentities,
    compiledAt: new Date().toISOString(),
  };
};

const sanitizeAndValidateCapsule = (capsule?: SkoposConversationCapsule): { value: SkoposConversationCapsule; sensitive: boolean; reasons: string[] } => {
  if (!capsule || !capsule.authoredBy?.trim() || !capsule.origin?.host?.trim() || !capsule.origin?.sessionId?.trim() || !Array.isArray(capsule.statements) || capsule.statements.length === 0) throw new Error('Creating a fresh-session handoff requires a non-empty agent-authored conversation capsule with origin host and Session identity.');
  let sensitive = false;
  const statements = capsule.statements.map((statement) => ({ ...statement, sourceRefs: statement.sourceRefs ?? [], text: statement.text.replace(SECRET_PATTERN, () => { sensitive = true; return '[REDACTED SECRET-LIKE VALUE]'; }) }));
  return { value: { ...capsule, statements }, sensitive, reasons: sensitive ? ['Secret-like content was redacted before persistence.'] : [] };
};

const renderContinuationPrompt = ({ task, capsule }: { task: SkoposTaskArtifact; capsule: SkoposConversationCapsule }): string => {
  const statements = capsule.statements.map((entry) => `- [${entry.classification}; ${entry.section}] ${entry.text}${entry.sourceRefs.length ? ` (sources: ${entry.sourceRefs.join(', ')})` : ''}`).join('\n');
  return `[SKOPOS_FRESH_CONTINUATION_V1]\nContinue exact Task ${task.id} in ${task.workspaceRoot}.\n\nLive Task objective: ${task.goal}\nTask state at compilation: ${task.state}\nOwned paths: ${task.changeScope.declaredOwnedPaths.join(', ')}\n\nAgent-authored conversation capsule (${capsule.authoredBy}, ${capsule.origin.host}/${capsule.origin.sessionId}):\n${statements}\n\nRestore protocol:\n1. Run skopos session context . --actor <receiving-actor> --json.\n2. Run skopos discuss handoff verify . --task ${task.id} --json and stop unless freshness is current.\n3. Accept the handoff through the existing Session/Task authority before editing.\n4. Treat live Project Memory, Task, source, Evidence, and coordination state as authoritative over remembered context.\n[/SKOPOS_FRESH_CONTINUATION_V1]`;
};

const buildValidation = ({ freshness, sensitive, overBudget, reasons }: { freshness: SkoposDiscussionHandoffFreshness; sensitive: boolean; overBudget: boolean; reasons: string[] }): SkoposDiscussionHandoffValidation => ({ freshness, valid: freshness !== 'invalid' && !overBudget, safeToTransfer: freshness === 'current' && !overBudget, sensitive, overBudget, reasons: [...reasons, ...(overBudget ? [`Continuation prompt exceeds the ${HANDOFF_BUDGET_TOKENS}-token budget; meaning was not truncated.`] : [])], checkedAt: new Date().toISOString() });
const coordinationConflicts = (state: { openMutationCount: number; contaminationCount: number; runningActionIds: string[] }): string[] => [...(state.runningActionIds.length ? [`Running Actions must be recovered first: ${state.runningActionIds.join(', ')}.`] : []), ...(state.openMutationCount ? ['Open Task mutations prevent transfer.'] : []), ...(state.contaminationCount ? ['Open Task contamination prevents transfer.'] : [])];
const digest = (value: string): string => createHash('sha256').update(value).digest('hex');
const git = (cwd: string, args: string[]): string => { try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };
const optionalDigest = async (path: string): Promise<string | undefined> => { try { return digest((await readFile(path)).toString('base64')); } catch { return undefined; } };
const digestPaths = async (root: string, paths: string[]): Promise<string> => digest((await Promise.all(paths.sort().map(async (path) => `${path}\0${await digestTree(join(root, path))}`))).join('\0'));
const digestTree = async (path: string): Promise<string> => { try { const info = await stat(path); if (info.isFile()) return digest((await readFile(path)).toString('base64')); if (!info.isDirectory()) return digest('other'); const entries = await readdir(path); return digest((await Promise.all(entries.sort().map(async (entry) => `${entry}\0${await digestTree(join(path, entry))}`))).join('\0')); } catch { return digest('missing'); } };
const findJsonFiles = async (root: string): Promise<string[]> => { try { const entries = await readdir(root, { withFileTypes: true }); return (await Promise.all(entries.map((entry) => entry.isDirectory() ? findJsonFiles(join(root, entry.name)) : entry.isFile() && entry.name.endsWith('.json') ? [join(root, entry.name)] : []))).flat(); } catch { return []; } };
const loadRunningActionIds = async (root: string, taskId: string): Promise<string[]> => { const files = await findJsonFiles(join(root, '.skopos/runs')); const ids: string[] = []; for (const file of files) { try { const value = JSON.parse(await readFile(file, 'utf8')) as { taskId?: string; runStatus?: string; id?: string }; if (value.taskId === taskId && value.runStatus === 'running' && value.id) ids.push(value.id); } catch {} } return ids.sort(); };
const loadEvidenceIdentities = async (root: string, taskId: string): Promise<string[]> => { const files = (await findJsonFiles(join(root, '.skopos/tasks'))).filter((file) => normalizeRuntimePath(file).includes('/evidence/')); const identities: string[] = []; for (const file of files) { try { const bytes = await readFile(file); if (bytes.includes(Buffer.from(taskId))) identities.push(digest(bytes.toString('base64'))); } catch {} } return identities.sort(); };
const normalizeRuntimePath = (path: string): string => path.replaceAll('\\', '/');
