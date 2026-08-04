import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposContextEntry,
  SkoposExecutionPhase,
} from './skopos-agent-native-operating-model.js';
import type {
  SkoposPolicySignal,
  SkoposPolicySignalConfidence,
  SkoposProjectLifecycle,
} from './skopos-policy-pack.js';
import type { SkoposTaskRisk } from './skopos-task.js';

export type SkoposSkillPackFamily =
  | 'project-intelligence'
  | 'ui-craft'
  | 'frontend-engineering'
  | 'accessibility'
  | 'ux-writing'
  | 'seo-content'
  | 'performance'
  | 'security-privacy'
  | 'testing'
  | 'production-readiness'
  | 'domain';

export type SkoposSkillPackLifecycle =
  | 'candidate'
  | 'recommended'
  | 'accepted'
  | 'adapted'
  | 'validated'
  | 'rejected'
  | 'retired';

export const SKOPOS_SKILL_PROJECTION_HOST_IDS = [
  'codex',
  'claude-code',
  'cursor',
  'github-copilot',
  'manual-hosts',
] as const;

export type SkoposSkillProjectionHostId =
  (typeof SKOPOS_SKILL_PROJECTION_HOST_IDS)[number];

export interface SkoposSkillAuthorityBoundary {
  actionAuthority: 'skopos';
  taskStateAuthority: 'skopos';
  readinessAuthority: 'skopos';
}

export interface SkoposSkillSelectionPolicy {
  maximumMeasuredTokens: number;
  maximumModules: number;
}

export interface SkoposSkillTaskBudget {
  maximumPacks: number;
  maximumModules: number;
  maximumMeasuredTokens: number;
}

export const SKOPOS_SKILL_TASK_BUDGETS: Record<SkoposTaskRisk, SkoposSkillTaskBudget> = {
  light: { maximumPacks: 1, maximumModules: 1, maximumMeasuredTokens: 800 },
  standard: { maximumPacks: 2, maximumModules: 3, maximumMeasuredTokens: 1800 },
  'high-impact': { maximumPacks: 3, maximumModules: 5, maximumMeasuredTokens: 2800 },
};

export interface SkoposSkillRoleRequirements {
  context: string[];
  recommendedContext: string[];
  actions: string[];
  recommendedActions: string[];
  guards: string[];
  recommendedGuards: string[];
}

export interface SkoposSkillPackOwnership {
  purpose: string;
  owns: string[];
  excludes: string[];
  overlapRules: string[];
}

export interface SkoposSkillModuleApplicability {
  scopeKinds: string[];
  pathKinds: string[];
  capabilities: string[];
}

export interface SkoposSkillModuleManifest {
  id: string;
  title: string;
  summary: string;
  path: string;
  importance: 'required' | 'recommended' | 'on-demand';
  positiveSignals: SkoposPolicySignal[];
  negativeSignals: SkoposPolicySignal[];
  applicability: SkoposSkillModuleApplicability;
  projectRoles: SkoposSkillRoleRequirements;
  rubricDimensions: string[];
  failureSignalIds: string[];
}

export interface SkoposSkillFailureSignal {
  id: string;
  summary: string;
  evidenceKinds: Array<
    'guard-failure' | 'finding' | 'user-correction' | 'review-finding' | 'source-observation'
  >;
  minimumOccurrences: number;
}

export interface SkoposSkillResearchSource {
  id: string;
  title: string;
  kind:
    | 'normative-standard'
    | 'official-documentation'
    | 'project-authority'
    | 'expert-review'
    | 'supporting-research';
  url?: string;
  path?: string;
  reviewedAt: string;
  reviewAfter?: string;
  supports: string[];
}

export interface SkoposSkillPackManifest extends SkoposArtifactEnvelope<'skill-pack'> {
  packId: string;
  family: SkoposSkillPackFamily;
  variant: string;
  version: string;
  displayName: string;
  description: string;
  plainLanguageSummary: string;
  authorityBoundary: SkoposSkillAuthorityBoundary;
  ownership: SkoposSkillPackOwnership;
  projectLifecycles: SkoposProjectLifecycle[];
  taskRisks: SkoposTaskRisk[];
  selection: SkoposSkillSelectionPolicy;
  modules: SkoposSkillModuleManifest[];
  failureSignals: SkoposSkillFailureSignal[];
  rubricPath: string;
  researchSources: SkoposSkillResearchSource[];
  proofFixtureIds: string[];
}

export interface SkoposProjectSkillBinding
  extends SkoposArtifactEnvelope<'project-skill-binding'> {
  bindingId: string;
  packId: string;
  packVersion: string;
  lifecycle: SkoposSkillPackLifecycle;
  sourceBindings: Record<string, string[]>;
  actionBindings: Record<string, string>;
  guardBindings: Record<string, string>;
  adaptationNotes: string[];
  acceptance?: SkoposSkillAcceptance;
}

export interface SkoposSkillAcceptance {
  acceptedAt: string;
  acceptedBy: string;
  reason: string;
  identity: SkoposSkillAcceptanceIdentity;
}

export interface SkoposSkillAcceptanceIdentity {
  packSourceDigest: string;
  bindingSourceDigest: string;
  projectSourceDigest: string;
  capabilityCatalogDigest: string;
  evaluationSourceDigest: string;
  combinedDigest: string;
}

export interface SkoposSkillRecommendationEntry {
  packId: string;
  version: string;
  family: SkoposSkillPackFamily;
  displayName: string;
  confidence: SkoposPolicySignalConfidence;
  recommendation: 'adopt' | 'review' | 'avoid';
  reason: string;
  accepted: boolean;
  signals: SkoposPolicySignal[];
  antiSignals: SkoposPolicySignal[];
  missingRequiredRoles: string[];
  sourcePath: string;
  bindingPath?: string;
}

export interface SkoposSkillRecommendationArtifact
  extends SkoposArtifactEnvelope<'skill-recommendations'> {
  workspaceRoot: string;
  projectLifecycle: SkoposProjectLifecycle;
  recommendations: SkoposSkillRecommendationEntry[];
}

export interface SkoposAcceptedSkillPack {
  packId: string;
  version: string;
  bindingId: string;
  acceptedAt: string;
  acceptedBy: string;
  reason: string;
  identity: SkoposSkillAcceptanceIdentity;
  sourcePath: string;
  bindingPath: string;
}

export interface SkoposResolvedSkillArtifact
  extends SkoposArtifactEnvelope<'resolved-skills'> {
  workspaceRoot: string;
  acceptedSkills: SkoposAcceptedSkillPack[];
  sourcePaths: string[];
  bindingPaths: string[];
}

export interface SkoposSelectedSkill {
  packId: string;
  version: string;
  bindingId: string;
  reason: string;
  selectedModuleIds: string[];
  selectedContext: SkoposContextEntry[];
  selectedActionIds: string[];
  selectedGuardIds: string[];
  selectedRubricDimensions: string[];
  selectedFailureSignalIds: string[];
  measuredContextTokens: number;
  selectionEvidence: SkoposSkillModuleSelectionEvidence[];
  sourcePaths: string[];
}

export type SkoposSkillTaskPathKind =
  | 'authored-source'
  | 'test'
  | 'style'
  | 'localization'
  | 'evidence'
  | 'public-export'
  | 'generated'
  | 'vendored'
  | 'build'
  | 'distribution'
  | 'documentation'
  | 'configuration'
  | 'unknown';

export interface SkoposSkillTaskPathSignal {
  path: string;
  kinds: SkoposSkillTaskPathKind[];
  source: 'owned' | 'changed';
}

export interface SkoposSkillAcceptedFailureEvidence {
  id: string;
  summary: string;
}

export interface SkoposSkillTaskSignalEnvelope {
  goal: string;
  acceptanceCriteria: string[];
  constraints: string[];
  nonGoals: string[];
  openDecisions: string[];
  risk: SkoposTaskRisk;
  phase: SkoposExecutionPhase;
  scopeIds: string[];
  scopeKinds: string[];
  scopeTerms: string[];
  paths: SkoposSkillTaskPathSignal[];
  affectedCapabilities: string[];
  selectedActionIds: string[];
  applicableGuardIds: string[];
  acceptedFailureEvidence: SkoposSkillAcceptedFailureEvidence[];
  projectLifecycle: SkoposProjectLifecycle;
}

export type SkoposSkillSelectionReasonCode =
  | 'selected'
  | 'risk-mismatch'
  | 'lifecycle-mismatch'
  | 'binding-invalid'
  | 'positive-signal-missing'
  | 'applicability-missing'
  | 'blocking-anti-signal'
  | 'review-phase-mismatch'
  | 'duplicate-judgment'
  | 'pack-budget-exhausted'
  | 'module-budget-exhausted'
  | 'token-budget-exhausted';

export interface SkoposSkillModuleSelectionEvidence {
  moduleId: string;
  positiveSignalIds: string[];
  applicabilityEvidence: string[];
  failureSignalIds: string[];
  score: number;
  measuredTokens: number;
}

export interface SkoposSkillSelectionExplanation {
  packId: string;
  moduleId?: string;
  outcome: 'selected' | 'suppressed';
  reasonCode: SkoposSkillSelectionReasonCode;
  summary: string;
  evidenceIds: string[];
  measuredTokens: number;
}

export interface SkoposSkillSelectionResult {
  envelope: SkoposSkillTaskSignalEnvelope;
  budget: SkoposSkillTaskBudget;
  selectedSkills: SkoposSelectedSkill[];
  explanations: SkoposSkillSelectionExplanation[];
  diagnostics: string[];
  cache: SkoposSkillSelectionCacheResult;
}

export interface SkoposSkillSelectionIdentityEntry {
  packId: string;
  version: string;
  bindingId: string;
  acceptanceDigest: string;
}

export interface SkoposSkillSelectionIdentity {
  algorithmId: string;
  taskSignalDigest: string;
  acceptedSkills: SkoposSkillSelectionIdentityEntry[];
  acceptedSkillsDigest: string;
  capabilityCatalogDigest: string;
  resolvedPolicyDigest: string;
  combinedDigest: string;
}

export interface SkoposSkillSelectionCacheResult {
  status: 'hit' | 'miss' | 'bypassed';
  artifactPath?: string;
  identityDigest: string;
}

export interface SkoposSkillSelectionArtifact
  extends SkoposArtifactEnvelope<'skill-selection'> {
  workspaceRoot: string;
  taskId: string;
  identity: SkoposSkillSelectionIdentity;
  envelope: SkoposSkillTaskSignalEnvelope;
  budget: SkoposSkillTaskBudget;
  selectedSkills: SkoposSelectedSkill[];
  explanations: SkoposSkillSelectionExplanation[];
  diagnostics: string[];
}

export interface SkoposSkillProjectionCapabilityReferences {
  actionIds: string[];
  guardIds: string[];
}

export interface SkoposSkillHostProjectionEntry {
  packId: string;
  version: string;
  bindingId: string;
  selectedBy: 'skopos-task-admission';
  moduleIds: string[];
  capabilities: SkoposSkillProjectionCapabilityReferences;
  sourcePaths: string[];
  sourceDigest: string;
}

export interface SkoposSkillHostProjectionArtifact
  extends SkoposArtifactEnvelope<'skill-host-projection'> {
  workspaceRoot: string;
  hostId: string;
  sourceAuthority: 'tracked-project-skill-bindings';
  resolvedSkillsPath: string;
  acceptedSkillPackIds: string[];
  sourceDigest: string;
  skills: SkoposSkillHostProjectionEntry[];
}
