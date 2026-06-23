import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposPolicySignalConfidence } from './skopos-policy-pack.js';

export type SkoposStackCapability =
  | 'database'
  | 'cache'
  | 'redis'
  | 'queue'
  | 'scheduler'
  | 'durable-workflow'
  | 'search'
  | 'realtime'
  | 'auth'
  | 'authorization'
  | 'payments'
  | 'email'
  | 'notifications'
  | 'object-storage'
  | 'webhooks'
  | 'analytics'
  | 'observability'
  | 'feature-flags'
  | 'rate-limiting'
  | 'secrets'
  | 'deployment';

export type SkoposStackRecommendationStatus =
  | 'recommended'
  | 'not-needed'
  | 'needs-decision'
  | 'accepted'
  | 'rejected';

export type SkoposStackDecisionStatus = 'accepted' | 'rejected' | 'deferred' | 'revisit';

export interface SkoposStackOption {
  id: string;
  name: string;
  summary: string;
  tradeoffs: string[];
  operationalCosts: string[];
  requiredGateIds: string[];
}

export interface SkoposStackRecommendation {
  id: string;
  capability: SkoposStackCapability;
  status: SkoposStackRecommendationStatus;
  summary: string;
  confidence: SkoposPolicySignalConfidence;
  signals: string[];
  antiSignals: string[];
  recommendedOptions: SkoposStackOption[];
  risks: string[];
  localDevelopmentNotes: string[];
  productionNotes: string[];
  decisionPrompt?: string;
}

export interface SkoposStackRecommendationArtifact extends SkoposArtifactEnvelope<'stack-recommendations'> {
  workspaceRoot: string;
  projectProfileId?: string;
  recommendations: SkoposStackRecommendation[];
  sourcePaths: string[];
}

export interface SkoposStackDecision {
  id: string;
  capability: SkoposStackCapability;
  optionId?: string;
  status: SkoposStackDecisionStatus;
  reason: string;
  decidedAt: string;
  decidedBy?: string;
  revisitAfter?: string;
  consequences: string[];
  requiredGateIds: string[];
}

export interface SkoposStackDecisionsArtifact extends SkoposArtifactEnvelope<'stack-decisions'> {
  workspaceRoot: string;
  decisions: SkoposStackDecision[];
}
