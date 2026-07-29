import type { SkoposTaskRisk } from './skopos-task.js';
import type { SkoposResolvedScope } from './skopos-scope-lite.js';
import type { SkoposActionSafety } from './skopos-action.js';

export type SkoposExecutionPhase = 'admission' | 'iteration' | 'stabilization' | 'closure';

export type SkoposKnowledgeAuthority =
  | 'declared'
  | 'accepted'
  | 'observed'
  | 'inferred'
  | 'proposed'
  | 'historical';

export type SkoposKnowledgeKind =
  | 'fact'
  | 'router'
  | 'overview'
  | 'architecture'
  | 'standard'
  | 'domain'
  | 'guide'
  | 'operation'
  | 'decision'
  | 'finding'
  | 'plan'
  | 'task'
  | 'reference'
  | 'document'
  | 'preferred-pattern'
  | 'retired-pattern'
  | 'rejected-approach'
  | 'failure-pattern'
  | 'temporary-exception'
  | 'noncanonical-command';

export type SkoposKnowledgeLifecycle =
  | 'active'
  | 'temporary'
  | 'retired'
  | 'rejected'
  | 'historical';

export interface SkoposProvenanceReference {
  authority: SkoposKnowledgeAuthority;
  sourceKind:
    | 'task'
    | 'policy'
    | 'action'
    | 'guard'
    | 'project-memory'
    | 'decision'
    | 'finding'
    | 'source'
    | 'acceptance'
    | 'provider'
    | 'skill';
  sourceId: string;
  path?: string;
}

export interface SkoposKnowledgeEntry {
  id: string;
  kind: SkoposKnowledgeKind;
  title: string;
  summary: string;
  scopeId?: string;
  authority: SkoposKnowledgeAuthority;
  lifecycle: SkoposKnowledgeLifecycle;
  appliesTo: string[];
  provenance: SkoposProvenanceReference[];
  removalCondition?: string;
}

export type SkoposCanonicalKnowledgeAuthority = 'declared' | 'accepted';

export interface SkoposKnowledgePromotionRequest {
  entry: SkoposKnowledgeEntry;
  targetAuthority: SkoposCanonicalKnowledgeAuthority;
  requestedByActorId: string;
  evidence: SkoposProvenanceReference[];
}

export type SkoposKnowledgePromotionRejection =
  | 'already-canonical'
  | 'project-evidence-required'
  | 'target-authority-conflicts-with-evidence';

export interface SkoposKnowledgePromotionResult {
  status: 'promoted' | 'rejected';
  entry: SkoposKnowledgeEntry;
  targetAuthority: SkoposCanonicalKnowledgeAuthority;
  requestedByActorId: string;
  reason?: SkoposKnowledgePromotionRejection;
  acceptedEvidence: SkoposProvenanceReference[];
}

export type SkoposTaskContractField =
  | 'acceptanceCriteria'
  | 'nonGoals'
  | 'constraints'
  | 'openDecisions'
  | 'requiredProof';

export interface SkoposTaskDecision {
  id: string;
  question: string;
  blocking: boolean;
}

export interface SkoposTaskProofRequirement {
  id: string;
  kind: 'action' | 'acceptance-evidence';
  summary: string;
}

export interface SkoposTaskContract {
  goal: string;
  scope: SkoposResolvedScope;
  acceptanceCriteria: string[];
  nonGoals: string[];
  constraints: string[];
  openDecisions: SkoposTaskDecision[];
  requiredProof: SkoposTaskProofRequirement[];
  missingFields: SkoposTaskContractField[];
  provenance: SkoposProvenanceReference[];
}

export type SkoposContextKind =
  | 'task'
  | 'project-memory'
  | 'policy'
  | 'instructions'
  | 'negative-knowledge'
  | 'skill';

export interface SkoposContextEntry {
  id: string;
  kind: SkoposContextKind;
  title: string;
  summary: string;
  scopeId?: string;
  importance: 'required' | 'recommended' | 'on-demand';
  appliesTo: string[];
  provenance: SkoposProvenanceReference[];
}

export interface SkoposStructuredCommand {
  executable: string;
  arguments: string[];
  cwd: string;
}

export interface SkoposActionEvidenceContract {
  kind: 'action-run';
  requiredOutputPaths: string[];
  recordsActor: boolean;
  recordsExitStatus: boolean;
  sourceBound: boolean;
  exactCommandOwnership: boolean;
}

export interface SkoposAction {
  id: string;
  title: string;
  description: string;
  command?: SkoposStructuredCommand;
  unavailableReason?: string;
  inputs: string[];
  outputs: string[];
  affectedPaths: string[];
  safety: SkoposActionSafety;
  approval: 'none' | 'required';
  phases: SkoposExecutionPhase[];
  risks: SkoposTaskRisk[];
  evidence: SkoposActionEvidenceContract;
  provenance: SkoposProvenanceReference[];
}

export type SkoposGuardKind =
  | 'prevention'
  | 'approval'
  | 'verification'
  | 'generated-ownership'
  | 'policy'
  | 'evidence';

export interface SkoposGuard {
  id: string;
  title: string;
  summary: string;
  kind: SkoposGuardKind;
  requiredness: 'required' | 'recommended' | 'prohibited';
  enforcement: 'action-evidence' | 'manual-proof' | 'prohibition' | 'unavailable';
  command?: SkoposStructuredCommand;
  unavailableReason?: string;
  requiredActionIds: string[];
  evidence: 'source-bound-action' | 'agent-observation';
  appliesToPaths: string[];
  phases: SkoposExecutionPhase[];
  risks: SkoposTaskRisk[];
  provenance: SkoposProvenanceReference[];
}

export interface SkoposAgentNativeOperatingModel {
  schemaVersion: 1;
  context: SkoposContextEntry[];
  actions: SkoposAction[];
  guards: SkoposGuard[];
  diagnostics: string[];
}

export interface SkoposCompactCapabilitySelection<T> {
  availableCount: number;
  selectedCount: number;
  entries: T[];
}

export interface SkoposCompactSkillReference {
  packId: string;
  version: string;
  bindingId: string;
  reason: string;
  selectedModuleIds: string[];
  estimatedContextTokens: number;
}

export interface SkoposCompactTaskBrief {
  schemaVersion: 1;
  task: SkoposTaskContract;
  phase: SkoposExecutionPhase;
  risk: SkoposTaskRisk;
  context: SkoposCompactCapabilitySelection<SkoposContextEntry>;
  actions: SkoposCompactCapabilitySelection<SkoposAction>;
  guards: SkoposCompactCapabilitySelection<SkoposGuard>;
  skills: SkoposCompactCapabilitySelection<SkoposCompactSkillReference>;
  diagnostics: string[];
}
