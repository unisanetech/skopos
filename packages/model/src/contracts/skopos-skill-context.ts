import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposSkillContextRecordKind = 'guide' | 'signal' | 'source-note';

export type SkoposSkillContextRecordState =
  | 'active'
  | 'needs-review'
  | 'retired';

export interface SkoposSkillContextRecordType {
  typeId: string;
  kind: SkoposSkillContextRecordKind;
  displayName: string;
  requiredSelectorDimensions: string[];
  requiredConstraintKinds: string[];
  allowedFacetValues: Record<string, string[]>;
}

export interface SkoposSkillContextApplicability {
  selectors: Record<string, string[]>;
  positiveSignals: string[];
  negativeSignals: string[];
}

export interface SkoposSkillContextFreshness {
  state: SkoposSkillContextRecordState;
  createdAt: string;
  reviewedAt: string;
  reviewAfter: string;
}

export interface SkoposSkillContextGuidanceRecord {
  id: string;
  kind: 'guide' | 'signal';
  typeId: string;
  title: string;
  purpose: string;
  applicability: SkoposSkillContextApplicability;
  problem: string;
  guidance: string;
  failureModes: string[];
  constraints: Record<string, string[]>;
  operationalCost?: string;
  sourceNoteIds: string[];
  facets: Record<string, string>;
  freshness: SkoposSkillContextFreshness;
  contentDigest: string;
}

export type SkoposSkillContextSourceType =
  | 'normative-standard'
  | 'official-documentation'
  | 'official-design-system'
  | 'platform-guidance'
  | 'official-product'
  | 'primary-research'
  | 'supporting-research'
  | 'project-authority';

export interface SkoposSkillContextSourceNote {
  id: string;
  kind: 'source-note';
  typeId: string;
  title: string;
  sourceOwner: string;
  sourceType: SkoposSkillContextSourceType;
  officialUrl?: string;
  projectPath?: string;
  relevantSurface: string;
  observation: string;
  transferRationale: string;
  doNotCopy: string[];
  limitations: string[];
  licenseOrAssetRestrictions: string;
  observedAt: string;
  reviewAfter: string;
  contentDigest: string;
}

export interface SkoposSkillContextLibrary
  extends SkoposArtifactEnvelope<'skill-context-library'> {
  libraryId: string;
  namespace: string;
  version: string;
  consumerPackIds: string[];
  recordTypes: SkoposSkillContextRecordType[];
  records: SkoposSkillContextGuidanceRecord[];
  sourceNotes: SkoposSkillContextSourceNote[];
  contentDigest: string;
}

export type SkoposSkillContextSuppressionReason =
  | 'irrelevant'
  | 'ambiguous'
  | 'negative-signal'
  | 'project-authority-precedence'
  | 'expired'
  | 'retired'
  | 'budget-suppressed'
  | 'consumer-boundary';

export interface SkoposSkillContextProjectAuthority {
  id: string;
  role: string;
  sourcePaths: string[];
  sourceDigest: string;
  summary: string;
}

export interface SkoposSkillContextBriefRecordDecision {
  recordId: string;
  typeId: string;
  reason: string;
  measuredTokens: number;
}

export interface SkoposSkillContextBriefSuppression
  extends SkoposSkillContextBriefRecordDecision {
  reasonCode: SkoposSkillContextSuppressionReason;
}

export interface SkoposSkillContextBriefPrinciple {
  recordId: string;
  guidance: string;
  taskEvidence: string[];
  adaptation: string;
  deliberateDifference: string;
  doNotCopy: string[];
}

export interface SkoposSkillContextBrief
  extends SkoposArtifactEnvelope<'skill-context-brief'> {
  taskId: string;
  packId: string;
  packVersion: string;
  libraryId: string;
  libraryVersion: string;
  libraryDigest: string;
  projectAuthorities: SkoposSkillContextProjectAuthority[];
  selectedRecords: SkoposSkillContextBriefRecordDecision[];
  suppressedRecords: SkoposSkillContextBriefSuppression[];
  principles: SkoposSkillContextBriefPrinciple[];
  unresolvedProjectContextGaps: string[];
  budget: {
    maximumMeasuredTokens: number;
    measuredTokens: number;
  };
  sourceNotes: Array<{
    id: string;
    observedAt: string;
  }>;
  contentDigest: string;
}

export type SkoposSkillContextFixtureCategory =
  | 'positive'
  | 'negative'
  | 'ambiguous'
  | 'expired'
  | 'retired'
  | 'multi-selector'
  | 'budget';

export interface SkoposSkillContextFixtureCase {
  caseId: string;
  category: SkoposSkillContextFixtureCategory;
  task: {
    goal: string;
    selectors: Record<string, string[]>;
    projectAuthorityIds: string[];
    maximumMeasuredTokens: number;
    asOf: string;
  };
  expectation: {
    selectedRecordIds: string[];
    suppressedRecordReasonCodes: Record<
      string,
      SkoposSkillContextSuppressionReason
    >;
  };
}

export interface SkoposSkillContextContractFixture
  extends SkoposArtifactEnvelope<'skill-context-contract-fixture'> {
  fixtureId: string;
  library: SkoposSkillContextLibrary;
  cases: SkoposSkillContextFixtureCase[];
}
