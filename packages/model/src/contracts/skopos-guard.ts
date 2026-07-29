import type { SkoposActionPhase } from './skopos-action.js';
import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposPolicySeverity } from './skopos-policy-pack.js';
import type { SkoposTaskRisk } from './skopos-task.js';

export type SkoposGuardStrength = 'required' | 'recommended' | 'prohibited';
export type SkoposGuardEvidenceKind = 'source-bound-action' | 'agent-observation';

export interface SkoposGuardManifest {
  id: string;
  title: string;
  description: string;
  owner: string;
  scope: string[];
  strength: SkoposGuardStrength;
  appliesTo: {
    paths: string[];
    phases?: SkoposActionPhase[];
    risks?: SkoposTaskRisk[];
  };
  requires: {
    actionIds: string[];
    evidence: SkoposGuardEvidenceKind;
  };
  sourcePath: string;
}

export interface SkoposGuardMatch {
  id: string;
  title: string;
  strength: SkoposGuardStrength;
  sourcePath: string;
  reason: string;
  matchedPaths: string[];
  requiredActionIds: string[];
  evidence: SkoposGuardEvidenceKind;
}

export type SkoposResolvedGuardKind = 'project-action' | 'skopos-native' | 'agent-observation';
export type SkoposResolvedGuardStatus = 'available' | 'missing' | 'manual';

export interface SkoposResolvedGuard {
  id: string;
  packId: string;
  label: string;
  kind: SkoposResolvedGuardKind;
  strength: 'required' | 'recommended';
  status: SkoposResolvedGuardStatus;
  severity: SkoposPolicySeverity;
  summary: string;
  actionId?: string;
  command?: string;
  matchedScript?: string;
  missingReason?: string;
}

export interface SkoposResolvedGuardsArtifact
  extends SkoposArtifactEnvelope<'resolved-guards'> {
  workspaceRoot: string;
  packageManager: string;
  detectedScripts: string[];
  guards: SkoposResolvedGuard[];
  missingRecommended: SkoposResolvedGuard[];
  missingRequired: SkoposResolvedGuard[];
}
