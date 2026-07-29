import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposContextEntry,
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
  maximumContextTokens: number;
  maximumModules: number;
  requirePositiveSignal: boolean;
  blockOnMatchingAntiSignal: boolean;
}

export interface SkoposSkillRoleRequirements {
  context: string[];
  recommendedContext: string[];
  actions: string[];
  recommendedActions: string[];
  guards: string[];
  recommendedGuards: string[];
}

export interface SkoposSkillContextModule {
  id: string;
  title: string;
  summary: string;
  path: string;
  triggers: string[];
  appliesTo: string[];
  importance: 'required' | 'recommended' | 'on-demand';
  estimatedTokens: number;
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
  bestFor: string[];
  notFor: string[];
  projectLifecycles: SkoposProjectLifecycle[];
  taskRisks: SkoposTaskRisk[];
  appliesWhen: SkoposPolicySignal[];
  avoidWhen: SkoposPolicySignal[];
  selection: SkoposSkillSelectionPolicy;
  requiredProjectRoles: SkoposSkillRoleRequirements;
  contextModules: SkoposSkillContextModule[];
  failureSignals: SkoposSkillFailureSignal[];
  adaptationQuestions: string[];
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
  estimatedContextTokens: number;
  sourcePaths: string[];
}

export interface SkoposSkillSelectionArtifact
  extends SkoposArtifactEnvelope<'skill-selection'> {
  workspaceRoot: string;
  taskId: string;
  selectedSkills: SkoposSelectedSkill[];
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
