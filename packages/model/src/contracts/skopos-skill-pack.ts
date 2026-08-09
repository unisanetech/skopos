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
import type { SkoposScopeKind } from './skopos-scope-lite.js';

export type SkoposSkillPackFamily =
  | 'project-intelligence'
  | 'interface-design'
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

export interface SkoposSkillContextBinding {
  path: string;
  maximumMeasuredTokens: number;
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
  scopeKinds: SkoposScopeKind[];
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
  contextLibrary?: SkoposSkillContextBinding;
  modules: SkoposSkillModuleManifest[];
  failureSignals: SkoposSkillFailureSignal[];
  rubricPath: string;
  researchSources: SkoposSkillResearchSource[];
  proofFixtureIds: string[];
  evaluationSuiteIds: string[];
}

export type SkoposSkillFixtureCategory =
  | 'positive'
  | 'negative'
  | 'ambiguous'
  | 'generated-output'
  | 'capability-locality'
  | 'budget';

export interface SkoposSkillFixtureScope {
  id: string;
  title: string;
  path: string;
  kind:
    | 'workspace'
    | 'product'
    | 'application'
    | 'service'
    | 'package'
    | 'domain'
    | 'infrastructure'
    | 'tool';
  ancestorIds: string[];
  aliases: string[];
  codeRoots: string[];
}

export interface SkoposSkillFixtureTask {
  goal: string;
  scope: SkoposSkillFixtureScope;
  acceptanceCriteria: string[];
  constraints: string[];
  nonGoals: string[];
  openDecisions: string[];
  risk: SkoposTaskRisk;
  phase: SkoposExecutionPhase;
  ownedPaths: string[];
  changedPaths: string[];
  affectedCapabilities: string[];
  selectedActionIds: string[];
  applicableGuardIds: string[];
  acceptedFailureEvidence: SkoposSkillAcceptedFailureEvidence[];
  projectLifecycle: SkoposProjectLifecycle;
}

export interface SkoposSkillFixtureExpectation {
  selectedModuleIds: string[];
  suppressedModuleReasonCodes: Record<string, SkoposSkillSelectionReasonCode>;
  selectedActionIds: string[];
  selectedGuardIds: string[];
  maximumSelectedModules?: number;
  maximumMeasuredTokens?: number;
}

export interface SkoposSkillFixtureManifest
  extends SkoposArtifactEnvelope<'skill-selection-fixture'> {
  fixtureId: string;
  packId: string;
  category: SkoposSkillFixtureCategory;
  task: SkoposSkillFixtureTask;
  expectation: SkoposSkillFixtureExpectation;
}

export interface SkoposSkillFixtureFailure {
  field: string;
  expected: unknown;
  observed: unknown;
}

export interface SkoposSkillFixtureResult {
  fixtureId: string;
  category: SkoposSkillFixtureCategory;
  sourcePath: string;
  status: 'pass' | 'fail';
  selectedModuleIds: string[];
  selectedActionIds: string[];
  selectedGuardIds: string[];
  measuredTokens: number;
  failures: SkoposSkillFixtureFailure[];
}

export interface SkoposSkillFixtureEvaluationIdentity {
  packSourceDigest: string;
  bindingSourceDigest: string;
  projectSourceDigest: string;
  capabilityCatalogDigest: string;
  evaluationSourceDigest: string;
  combinedDigest: string;
}

export interface SkoposSkillFixtureEvaluationArtifact
  extends SkoposArtifactEnvelope<'skill-fixture-evaluation'> {
  workspaceRoot: string;
  packId: string;
  packVersion: string;
  bindingId: string;
  identity: SkoposSkillFixtureEvaluationIdentity;
  passed: number;
  failed: number;
  results: SkoposSkillFixtureResult[];
}

export interface SkoposSkillEvaluationCase {
  caseId: string;
  title: string;
  taskPrompt: string;
  projectTemplatePath: string;
  candidateModuleIds: string[];
  rubricDimensions: string[];
}

export interface SkoposSkillEvaluationSuiteManifest
  extends SkoposArtifactEnvelope<'skill-evaluation-suite'> {
  suiteId: string;
  packId: string;
  cases: SkoposSkillEvaluationCase[];
}

export interface SkoposSkillEvaluationWorkerInput {
  caseId: string;
  taskPrompt: string;
  workspaceRoot: string;
  additionalContext: SkoposContextEntry[];
}

export interface SkoposSkillEvaluationWorkerOutput {
  status: 'completed' | 'invalid' | 'aborted';
  summary: string;
  artifactPaths: string[];
  measuredInputTokens: number;
  measuredCachedInputTokens: number;
  measuredOutputTokens: number;
  toolCalls: number;
  correctionTurns: number;
  supervisionEvents: number;
  durationMs: number;
  authorityViolationIds: string[];
  failure?: {
    stage: string;
    message: string;
  };
}

export interface SkoposSkillEvaluationReviewInput {
  caseId: string;
  taskPrompt: string;
  rubricDimensions: string[];
  alternatives: Array<{
    label: string;
    summary: string;
    artifactPaths: string[];
  }>;
}

export interface SkoposSkillEvaluationReviewOutput {
  status: 'completed' | 'invalid' | 'aborted';
  winner: string | 'tie';
  reason: string;
  dimensionScores: Record<string, Record<string, number>>;
  measuredInputTokens: number;
  measuredCachedInputTokens: number;
  measuredOutputTokens: number;
  durationMs: number;
  failure?: {
    stage: string;
    message: string;
  };
}

export interface SkoposSkillEvaluationCaseResult {
  caseId: string;
  outcome: 'candidate-win' | 'control-win' | 'tie' | 'invalid' | 'aborted';
  reviewReason: string;
  blindedLabelMapping?: { candidate: string; control: string };
  candidateInputTokens: number;
  candidateCachedInputTokens: number;
  candidateOutputTokens: number;
  controlInputTokens: number;
  controlCachedInputTokens: number;
  controlOutputTokens: number;
  reviewerInputTokens: number;
  reviewerCachedInputTokens: number;
  reviewerOutputTokens: number;
  candidateToolCalls: number;
  controlToolCalls: number;
  candidateCorrectionTurns: number;
  controlCorrectionTurns: number;
  candidateSupervisionEvents: number;
  controlSupervisionEvents: number;
  candidateDurationMs: number;
  controlDurationMs: number;
  reviewerDurationMs: number;
  candidateAuthorityViolationIds: string[];
  controlAuthorityViolationIds: string[];
  failure?: {
    stage: string;
    arm?: 'candidate' | 'control' | 'reviewer';
    message: string;
  };
  dimensionScores: Record<string, { candidate: number; control: number }>;
}

export interface SkoposSkillEvaluationEnvironmentIdentity {
  modelId: string;
  reasoningEffort: string;
  hostId: string;
  workerAdapterId: string;
  reviewerId: string;
  evaluationStage: 'smoke' | 'full';
  selectedCaseSetDigest: string;
  workerPromptDigest: string;
  reviewerPromptDigest: string;
  budgetDigest: string;
  projectTemplateDigest: string;
  packDigest: string;
  bindingDigest: string;
  capabilityDigest: string;
  fixtureDigest: string;
  rubricDigest: string;
  suiteDigest: string;
  toolchainDigest: string;
  permissionsDigest: string;
}

export interface SkoposSkillEvaluationArtifact
  extends SkoposArtifactEnvelope<'skill-paired-evaluation'> {
  workspaceRoot: string;
  packId: string;
  packVersion: string;
  bindingId: string;
  suiteId: string;
  runId: string;
  identity: SkoposSkillAcceptanceIdentity & { suiteSourceDigest: string };
  environment: SkoposSkillEvaluationEnvironmentIdentity;
  environmentDigest: string;
  candidateWins: number;
  controlWins: number;
  ties: number;
  invalidCases: number;
  abortedCases: number;
  authorityRegressions: number;
  candidateInputTokens: number;
  controlInputTokens: number;
  candidateCachedInputTokens: number;
  controlCachedInputTokens: number;
  candidateOutputTokens: number;
  controlOutputTokens: number;
  reviewerInputTokens: number;
  reviewerCachedInputTokens: number;
  reviewerOutputTokens: number;
  candidateCorrectionTurns: number;
  controlCorrectionTurns: number;
  candidateSupervisionEvents: number;
  controlSupervisionEvents: number;
  results: SkoposSkillEvaluationCaseResult[];
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

export type SkoposSkillAdaptationRoleKind = 'context' | 'action' | 'guard';

export interface SkoposSkillAdaptationGap {
  roleKind: SkoposSkillAdaptationRoleKind;
  role: string;
  summary: string;
}

export interface SkoposSelectedSkillAdaptation {
  sourceBindings: Record<string, string[]>;
  actionBindings: Record<string, string>;
  guardBindings: Record<string, string>;
  notes: string[];
  gaps: SkoposSkillAdaptationGap[];
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
  adaptation: SkoposSelectedSkillAdaptation;
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
  scopeKinds: SkoposScopeKind[];
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
