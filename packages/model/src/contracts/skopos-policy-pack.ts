import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposPolicySeverity = 'must' | 'should' | 'advisory';

export type SkoposPolicyLifecycle = 'candidate' | 'recommended' | 'accepted' | 'rejected' | 'retired';

export type SkoposPolicyPackFamily =
  | 'architecture'
  | 'clean-code'
  | 'structure-tree'
  | 'naming'
  | 'ui-components'
  | 'api-contracts'
  | 'data-modeling'
  | 'testing'
  | 'docs-governance'
  | 'security-privacy'
  | 'release-public-api'
  | 'generated-artifacts'
  | 'gates'
  | 'workflow';

export type SkoposProjectLifecycle =
  | 'greenfield'
  | 'early-product'
  | 'established-brownfield'
  | 'legacy-stabilization';

export type SkoposPolicySignalConfidence = 'low' | 'medium' | 'high';

export interface SkoposPolicySignal {
  id: string;
  summary: string;
  confidence: SkoposPolicySignalConfidence;
  evidence: string[];
}

export interface SkoposPolicyRule {
  id: string;
  title: string;
  severity: SkoposPolicySeverity;
  summary: string;
  rationale?: string;
  appliesTo: string[];
  examples?: string[];
  antiPatterns?: string[];
  checkIds?: string[];
}

export interface SkoposPolicyPackManifest extends SkoposArtifactEnvelope<'policy-pack'> {
  packId: string;
  family: SkoposPolicyPackFamily;
  variant: string;
  version: string;
  displayName: string;
  description: string;
  projectLifecycles: SkoposProjectLifecycle[];
  appliesWhen: SkoposPolicySignal[];
  avoidWhen: SkoposPolicySignal[];
  rules: SkoposPolicyRule[];
  requiredDocs: string[];
  generatedArtifacts: string[];
  driftCheckIds: string[];
  proofFixtureIds: string[];
}

export interface SkoposAcceptedPolicyPack {
  packId: string;
  version: string;
  acceptedAt: string;
  acceptedBy?: string;
  reason: string;
  source: 'recommended' | 'manual' | 'profile';
}

export interface SkoposPolicyOverride {
  id: string;
  ruleId?: string;
  packId?: string;
  severity?: SkoposPolicySeverity;
  reason: string;
  owner?: string;
  expiresAt?: string;
}

export interface SkoposResolvedPolicyArtifact extends SkoposArtifactEnvelope<'resolved-policy'> {
  workspaceRoot: string;
  profileId?: string;
  projectLifecycle: SkoposProjectLifecycle;
  acceptedPacks: SkoposAcceptedPolicyPack[];
  overrides: SkoposPolicyOverride[];
  activeRules: SkoposPolicyRule[];
  sourcePaths: string[];
  generatedDocPaths: string[];
}
