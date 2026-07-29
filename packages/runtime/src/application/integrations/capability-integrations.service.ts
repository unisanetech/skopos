import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import {
  discoverSkoposCapabilityCandidates,
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
} from '@skopos/indexer';
import type {
  SkoposActionManifest,
  SkoposCapabilityIntegrationActivation,
  SkoposCapabilityIntegrationActivationResult,
  SkoposCapabilityIntegrationApproval,
  SkoposCapabilityIntegrationApprovalResult,
  SkoposCapabilityIntegrationProposal,
  SkoposCapabilityIntegrationProposalResult,
  SkoposGuardManifest,
} from '@skopos/model';

import { projectGuardAvailability } from '../guards/guards.service.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export const CAPABILITY_PROPOSAL_PATH =
  '.skopos/integrations/capability-proposal.json';
export const CAPABILITY_APPROVAL_PATH =
  '.skopos/integrations/capability-approval.json';
export const CAPABILITY_ACTIVATION_PATH =
  '.skopos/integrations/capability-activation.json';

export const proposeSkoposCapabilityIntegrationsRuntime = async ({
  cwd,
  dryRun = false,
}: {
  cwd: string;
  dryRun?: boolean;
}): Promise<SkoposCapabilityIntegrationProposalResult> => {
  const workspaceRoot = resolve(cwd);
  const candidates = await discoverSkoposCapabilityCandidates({
    cwd: workspaceRoot,
  });
  const generatedAt = new Date().toISOString();
  const proposalDigest = digestValue({ workspaceRoot, candidates });
  const proposal: SkoposCapabilityIntegrationProposal = {
    schemaVersion: 1,
    id: `CIP-${proposalDigest.slice(0, 12)}`,
    type: 'capability-integration-proposal',
    status: 'draft',
    authority: 'inferred',
    generatedAt,
    updatedAt: generatedAt,
    summary: `Detected ${candidates.length} project capability candidate${candidates.length === 1 ? '' : 's'}; no tracked Action or Guard declarations were written.`,
    workspaceRoot,
    proposalDigest,
    candidates,
    reviewRequired: true,
    trackedDeclarationsWritten: false,
  };
  const proposalWrite = await writeJsonArtifact({
    artifactPath: join(workspaceRoot, CAPABILITY_PROPOSAL_PATH),
    artifact: proposal,
    dryRun,
  });
  return {
    proposal,
    proposalPath: CAPABILITY_PROPOSAL_PATH,
    proposalWrite,
  };
};

export const approveSkoposCapabilityIntegrationsRuntime = async ({
  cwd,
  proposalDigest,
  acceptedCandidateIds,
  actor,
  reason,
  dryRun = false,
}: {
  cwd: string;
  proposalDigest: string;
  acceptedCandidateIds: string[];
  actor?: string;
  reason: string;
  dryRun?: boolean;
}): Promise<SkoposCapabilityIntegrationApprovalResult> => {
  const workspaceRoot = resolve(cwd);
  const proposal = await readArtifact<SkoposCapabilityIntegrationProposal>(
    join(workspaceRoot, CAPABILITY_PROPOSAL_PATH),
    'Run `skopos integrations propose` first.',
  );
  assertProposalIntegrity(proposal);
  assertDigest('proposal', proposal.proposalDigest, proposalDigest);
  const actorId = requireActor(actor);
  const approvalReason = reason.trim();
  if (!approvalReason) {
    throw new Error('Capability integration approval requires a non-empty reason.');
  }
  const acceptedIds = [...new Set(acceptedCandidateIds.map((id) => id.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
  if (acceptedIds.length === 0) {
    throw new Error('Capability integration approval requires at least one --accept candidate id.');
  }
  const candidateById = new Map(
    proposal.candidates.map((candidate) => [candidate.id, candidate]),
  );
  for (const candidateId of acceptedIds) {
    const candidate = candidateById.get(candidateId);
    if (!candidate) {
      throw new Error(`Capability proposal has no candidate ${candidateId}.`);
    }
    if (!candidate.suggestedAction || !candidate.suggestedGuard) {
      throw new Error(
        `Capability candidate ${candidateId} has no complete Action/Guard suggestion and cannot be approved automatically.`,
      );
    }
  }
  const approvedAt = new Date().toISOString();
  const approvalDigest = digestValue({
    proposalDigest: proposal.proposalDigest,
    acceptedCandidateIds: acceptedIds,
    approvedByActorId: actorId,
    approvalReason,
  });
  const approval: SkoposCapabilityIntegrationApproval = {
    schemaVersion: 1,
    id: `CIA-${approvalDigest.slice(0, 12)}`,
    type: 'capability-integration-approval',
    status: 'active',
    authority: 'canonical',
    generatedAt: approvedAt,
    updatedAt: approvedAt,
    summary: `Approved ${acceptedIds.length} reviewed capability integration candidate${acceptedIds.length === 1 ? '' : 's'}.`,
    workspaceRoot,
    proposalDigest: proposal.proposalDigest,
    approvalDigest,
    acceptedCandidateIds: acceptedIds,
    approvedByActorId: actorId,
    approvalReason,
  };
  const approvalWrite = await writeJsonArtifact({
    artifactPath: join(workspaceRoot, CAPABILITY_APPROVAL_PATH),
    artifact: approval,
    dryRun,
  });
  return {
    approval,
    approvalPath: CAPABILITY_APPROVAL_PATH,
    approvalWrite,
  };
};

export const applySkoposCapabilityIntegrationsRuntime = async ({
  cwd,
  approvalDigest,
  actor,
  dryRun = false,
}: {
  cwd: string;
  approvalDigest: string;
  actor?: string;
  dryRun?: boolean;
}): Promise<SkoposCapabilityIntegrationActivationResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireActor(actor);
  const [proposal, approval, existingActions, existingGuards] = await Promise.all([
    readArtifact<SkoposCapabilityIntegrationProposal>(
      join(workspaceRoot, CAPABILITY_PROPOSAL_PATH),
      'Run `skopos integrations propose` first.',
    ),
    readArtifact<SkoposCapabilityIntegrationApproval>(
      join(workspaceRoot, CAPABILITY_APPROVAL_PATH),
      'Run `skopos integrations approve` first.',
    ),
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadSkoposGuardManifests({ cwd: workspaceRoot }),
  ]);
  assertProposalIntegrity(proposal);
  assertApprovalIntegrity(approval);
  assertDigest('approval', approval.approvalDigest, approvalDigest);
  assertDigest('proposal', proposal.proposalDigest, approval.proposalDigest);

  const candidateById = new Map(
    proposal.candidates.map((candidate) => [candidate.id, candidate]),
  );
  const selected = approval.acceptedCandidateIds.map((candidateId) => {
    const candidate = candidateById.get(candidateId);
    if (!candidate?.suggestedAction || !candidate.suggestedGuard) {
      throw new Error(
        `Approved capability candidate ${candidateId} is absent or incomplete in the bound proposal.`,
      );
    }
    return {
      action: candidate.suggestedAction,
      guard: candidate.suggestedGuard,
    };
  });
  assertNoDeclarationCollisions(existingActions, existingGuards, selected);
  validateGuardProviders(
    [...existingActions.map((action) => action.id), ...selected.map(({ action }) => action.id)],
    selected.map(({ guard }) => guard),
  );

  if (!dryRun) {
    for (const { action, guard } of selected) {
      await writeTrackedManifest(workspaceRoot, action.sourcePath, action);
      await writeTrackedManifest(workspaceRoot, guard.sourcePath, guard);
    }
    const [activatedActions, activatedGuards] = await Promise.all([
      loadSkoposActionManifests({ cwd: workspaceRoot }),
      loadSkoposGuardManifests({ cwd: workspaceRoot }),
    ]);
    validateGuardProviders(
      activatedActions.map((action) => action.id),
      selected.map(({ guard }) => {
        const activated = activatedGuards.find((entry) => entry.id === guard.id);
        if (!activated) {
          throw new Error(`Activated Guard ${guard.id} was not loadable.`);
        }
        return activated;
      }),
    );
  }

  const activatedAt = new Date().toISOString();
  const activation: SkoposCapabilityIntegrationActivation = {
    schemaVersion: 1,
    id: `CIACT-${approval.approvalDigest.slice(0, 12)}`,
    type: 'capability-integration-activation',
    status: 'active',
    authority: 'generated',
    generatedAt: activatedAt,
    updatedAt: activatedAt,
    summary: `Activated ${selected.length} approved Action/Guard integration${selected.length === 1 ? '' : 's'} after provider validation.`,
    workspaceRoot,
    proposalDigest: proposal.proposalDigest,
    approvalDigest: approval.approvalDigest,
    activatedByActorId: actorId,
    actionPaths: selected.map(({ action }) => action.sourcePath),
    guardPaths: selected.map(({ guard }) => guard.sourcePath),
    providerValidation: 'pass',
  };
  const activationWrite = await writeJsonArtifact({
    artifactPath: join(workspaceRoot, CAPABILITY_ACTIVATION_PATH),
    artifact: activation,
    dryRun,
  });
  return {
    activation,
    activationPath: CAPABILITY_ACTIVATION_PATH,
    activationWrite,
  };
};

const validateGuardProviders = (
  actionIds: string[],
  guards: SkoposGuardManifest[],
): void => {
  const providers = new Set(actionIds);
  for (const guard of guards) {
    const projected = projectGuardAvailability({
      guardId: guard.id,
      manifest: guard,
      actionIds: providers,
    });
    if (projected.status === 'missing') {
      throw new Error(
        `Cannot activate Guard ${guard.id}: ${projected.missingReason ?? projected.summary}`,
      );
    }
  }
};

const assertNoDeclarationCollisions = (
  existingActions: SkoposActionManifest[],
  existingGuards: SkoposGuardManifest[],
  selected: Array<{
    action: SkoposActionManifest;
    guard: SkoposGuardManifest;
  }>,
): void => {
  const actionIds = new Set(existingActions.map((action) => action.id));
  const guardIds = new Set(existingGuards.map((guard) => guard.id));
  for (const { action, guard } of selected) {
    if (actionIds.has(action.id)) {
      throw new Error(`Action ${action.id} already exists; integration will not overwrite it.`);
    }
    if (guardIds.has(guard.id)) {
      throw new Error(`Guard ${guard.id} already exists; integration will not overwrite it.`);
    }
    if (actionIds.has(action.id) || guardIds.has(guard.id)) {
      throw new Error(`Duplicate capability integration declaration ${action.id}.`);
    }
    actionIds.add(action.id);
    guardIds.add(guard.id);
  }
};

const writeTrackedManifest = async (
  workspaceRoot: string,
  sourcePath: string,
  manifest: SkoposActionManifest | SkoposGuardManifest,
): Promise<void> => {
  const artifactPath = join(workspaceRoot, sourcePath);
  const { sourcePath: ignoredSourcePath, ...trackedManifest } = manifest;
  void ignoredSourcePath;
  await mkdir(dirname(artifactPath), { recursive: true });
  await writeFile(artifactPath, `${JSON.stringify(trackedManifest, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
  });
};

const readArtifact = async <T>(path: string, missingGuidance: string): Promise<T> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`${path} does not exist. ${missingGuidance}`);
    }
    throw error;
  }
};

const requireActor = (actor?: string): string => {
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Capability integration requires --actor <id> or SKOPOS_ACTOR.');
  }
  return actorId;
};

const assertDigest = (
  label: string,
  actual: string,
  expected: string,
): void => {
  if (actual !== expected.trim()) {
    throw new Error(
      `Capability integration ${label} digest mismatch: expected ${actual}, received ${expected.trim()}.`,
    );
  }
};

const digestValue = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');

const assertProposalIntegrity = (
  proposal: SkoposCapabilityIntegrationProposal,
): void => {
  const actual = digestValue({
    workspaceRoot: proposal.workspaceRoot,
    candidates: proposal.candidates,
  });
  assertDigest('proposal content', proposal.proposalDigest, actual);
};

const assertApprovalIntegrity = (
  approval: SkoposCapabilityIntegrationApproval,
): void => {
  const actual = digestValue({
    proposalDigest: approval.proposalDigest,
    acceptedCandidateIds: approval.acceptedCandidateIds,
    approvedByActorId: approval.approvedByActorId,
    approvalReason: approval.approvalReason,
  });
  assertDigest('approval content', approval.approvalDigest, actual);
};
