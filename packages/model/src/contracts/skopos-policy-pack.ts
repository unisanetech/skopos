import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposSourceDependency } from './skopos-source-dependency.js';
import type { SkoposTaskRisk } from './skopos-task.js';

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
  | 'stack'
  | 'verification';

export type SkoposProjectLifecycle =
  | 'greenfield'
  | 'early-product'
  | 'established-brownfield'
  | 'legacy-stabilization';

export type SkoposPolicySignalConfidence = 'low' | 'medium' | 'high';

export type SkoposRepositoryFamily =
  | 'application'
  | 'service'
  | 'cli'
  | 'library'
  | 'platform-monorepo'
  | 'mobile'
  | 'data-ml'
  | 'infrastructure'
  | 'documentation'
  | 'embedded'
  | 'unknown';

export interface SkoposRepositoryProfile {
  primaryFamily: SkoposRepositoryFamily;
  families: SkoposRepositoryFamily[];
  languages: string[];
  confidence: SkoposPolicySignalConfidence;
  evidence: string[];
}

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

export interface SkoposPolicyStructureTreeNode {
  path: string;
  label: string;
  responsibility: string;
  required?: boolean;
  matchPaths?: string[];
  examples?: string[];
  antiPatterns?: string[];
  children?: SkoposPolicyStructureTreeNode[];
}

export interface SkoposPolicyStructureTree {
  title: string;
  summary: string;
  rootLabel: string;
  nodes: SkoposPolicyStructureTreeNode[];
}

export interface SkoposPolicyDependencyDirection {
  mayImport: string[];
}

export interface SkoposPolicyForbiddenImport {
  from: string;
  to: string[];
}

export interface SkoposPolicyGuardSet {
  required: string[];
  recommended: string[];
}

export interface SkoposPolicyAgentPrompts {
  beforeEditing: string[];
  beforeReadiness: string[];
}

export interface SkoposPolicyPackManifest extends SkoposArtifactEnvelope<'policy-pack'> {
  packId: string;
  family: SkoposPolicyPackFamily;
  variant: string;
  version: string;
  displayName: string;
  description: string;
  plainLanguageSummary?: string;
  bestFor?: string[];
  notFor?: string[];
  userQuestions?: string[];
  qualityBar?: string[];
  agentUse?: string[];
  structureTree?: SkoposPolicyStructureTree;
  recommendedLayers?: string[];
  dependencyDirection?: Record<string, SkoposPolicyDependencyDirection>;
  forbiddenImports?: SkoposPolicyForbiddenImport[];
  guards?: SkoposPolicyGuardSet;
  agentPrompts?: SkoposPolicyAgentPrompts;
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

export interface SkoposTrackedPolicyAcceptance
  extends Omit<SkoposAcceptedPolicyPack, 'acceptedBy'> {
  acceptedBy: string;
}

export interface SkoposPolicyOverride {
  id: string;
  findingId?: string;
  ruleId?: string;
  packId?: string;
  sourcePath?: string;
  severity?: SkoposPolicySeverity;
  reason: string;
  owner?: string;
  expiresAt?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
}

export interface SkoposPolicyOverrideArtifact extends SkoposArtifactEnvelope<'policy-overrides'> {
  workspaceRoot: string;
  overrides: SkoposPolicyOverride[];
}

export type SkoposPolicyRoleMappingStatus = 'inferred' | 'confirmed' | 'needs-review' | 'missing' | 'ignored';

export type SkoposPolicyRoleMappingConfidence = 'low' | 'medium' | 'high';

export interface SkoposPolicyRoleMapping {
  packId: string;
  sourcePath: string;
  role: string;
  label: string;
  required: boolean;
  status: SkoposPolicyRoleMappingStatus;
  confidence: SkoposPolicyRoleMappingConfidence;
  checkedAliases: string[];
  matchedAliases: string[];
  matchedPaths: string[];
  reason: string;
}

export interface SkoposPolicyRoleMappingArtifact
  extends SkoposArtifactEnvelope<'policy-role-mapping'> {
  workspaceRoot: string;
  resolvedPolicyPath?: string;
  mappings: SkoposPolicyRoleMapping[];
}

export type SkoposPolicyRoleMappingDecisionStatus = 'confirmed' | 'ignored';

export interface SkoposPolicyRoleMappingDecision {
  id: string;
  packId: string;
  role: string;
  status: SkoposPolicyRoleMappingDecisionStatus;
  matchedPaths?: string[];
  reason: string;
  owner?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
}

export interface SkoposPolicyRoleMappingDecisionArtifact
  extends SkoposArtifactEnvelope<'policy-role-mapping-decisions'> {
  workspaceRoot: string;
  decisions: SkoposPolicyRoleMappingDecision[];
}

export interface SkoposProjectPolicySource {
  schemaVersion: 1;
  updatedAt: string;
  defaultTaskRisk: SkoposTaskRisk;
  acceptedPacks: SkoposTrackedPolicyAcceptance[];
  overrides: SkoposPolicyOverride[];
  roleMappings: SkoposPolicyRoleMappingDecision[];
}

export interface SkoposTaskRiskRule {
  risk: SkoposTaskRisk;
  summary: string;
  triggers: string[];
  defaultEvidence: string[];
}

export interface SkoposPolicyRecommendationEntry {
  packId: string;
  version: string;
  family: SkoposPolicyPackFamily;
  variant: string;
  displayName: string;
  confidence: SkoposPolicySignalConfidence;
  recommendation: 'apply' | 'review' | 'avoid';
  reason: string;
  plainLanguageSummary?: string;
  qualityBar?: string[];
  accepted: boolean;
  signals: SkoposPolicySignal[];
  antiSignals: SkoposPolicySignal[];
  sourcePath: string;
}

export interface SkoposPolicyRecommendationArtifact
  extends SkoposArtifactEnvelope<'policy-recommendations'> {
  workspaceRoot: string;
  projectLifecycle: SkoposProjectLifecycle;
  repositoryProfile: SkoposRepositoryProfile;
  defaultTaskRisk: SkoposTaskRisk;
  recommendedTaskRisks: SkoposTaskRiskRule[];
  recommendations: SkoposPolicyRecommendationEntry[];
}

export interface SkoposResolvedPolicyArtifact extends SkoposArtifactEnvelope<'resolved-policy'> {
  workspaceRoot: string;
  profileId?: string;
  projectLifecycle: SkoposProjectLifecycle;
  defaultTaskRisk: SkoposTaskRisk;
  recommendedTaskRisks: SkoposTaskRiskRule[];
  acceptedPacks: SkoposAcceptedPolicyPack[];
  overrides: SkoposPolicyOverride[];
  activeRules: SkoposPolicyRule[];
  sourceDependencies: SkoposSourceDependency[];
  generatedDocPaths: string[];
}
