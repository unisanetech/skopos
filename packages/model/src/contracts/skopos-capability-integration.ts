import type { SkoposActionManifest } from './skopos-action.js';
import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposGuardManifest } from './skopos-guard.js';

export type SkoposCapabilityCandidateSource =
  | 'configured-command'
  | 'package-script';

export interface SkoposCapabilityCandidate {
  id: string;
  source: SkoposCapabilityCandidateSource;
  sourcePath: string;
  name: string;
  command: string;
  cwd: string;
  rationale: string;
  suggestedAction?: SkoposActionManifest;
  suggestedGuard?: SkoposGuardManifest;
}

export interface SkoposCapabilityIntegrationProposal
  extends SkoposArtifactEnvelope<'capability-integration-proposal'> {
  workspaceRoot: string;
  proposalDigest: string;
  candidates: SkoposCapabilityCandidate[];
  reviewRequired: true;
  trackedDeclarationsWritten: false;
}

export interface SkoposCapabilityIntegrationApproval
  extends SkoposArtifactEnvelope<'capability-integration-approval'> {
  workspaceRoot: string;
  proposalDigest: string;
  approvalDigest: string;
  acceptedCandidateIds: string[];
  approvedByActorId: string;
  approvalReason: string;
  reviewedDeclarations: SkoposReviewedCapabilityDeclarations[];
}

export interface SkoposReviewedCapabilityDeclarations {
  candidateId: string;
  action: SkoposActionManifest;
  guard: SkoposGuardManifest;
}

export interface SkoposCapabilityIntegrationActivation
  extends SkoposArtifactEnvelope<'capability-integration-activation'> {
  workspaceRoot: string;
  proposalDigest: string;
  approvalDigest: string;
  activatedByActorId: string;
  actionPaths: string[];
  guardPaths: string[];
  providerValidation: 'pass';
}

export interface SkoposCapabilityIntegrationProposalResult {
  proposal: SkoposCapabilityIntegrationProposal;
  proposalPath: string;
  proposalWrite: 'written' | 'dry-run';
}

export interface SkoposCapabilityIntegrationApprovalResult {
  approval: SkoposCapabilityIntegrationApproval;
  approvalPath: string;
  approvalWrite: 'written' | 'dry-run';
}

export interface SkoposCapabilityIntegrationActivationResult {
  activation: SkoposCapabilityIntegrationActivation;
  activationPath: string;
  activationWrite: 'written' | 'dry-run';
}
