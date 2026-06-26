import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposPolicySeverity } from './skopos-policy-pack.js';

export type SkoposGateKind = 'project-command' | 'skopos-native' | 'agent-proof';

export type SkoposGateStatus = 'available' | 'missing' | 'manual';

export type SkoposGateRequiredness = 'required' | 'recommended';

export interface SkoposResolvedGate {
  id: string;
  packId: string;
  label: string;
  kind: SkoposGateKind;
  requiredness: SkoposGateRequiredness;
  status: SkoposGateStatus;
  severity: SkoposPolicySeverity;
  summary: string;
  command?: string;
  matchedScript?: string;
  missingReason?: string;
}

export interface SkoposResolvedGatesArtifact extends SkoposArtifactEnvelope<'resolved-gates'> {
  workspaceRoot: string;
  packageManager: string;
  detectedScripts: string[];
  gates: SkoposResolvedGate[];
  missingRecommended: SkoposResolvedGate[];
  missingRequired: SkoposResolvedGate[];
}
