import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposPolicySeverity } from './skopos-policy-pack.js';
export type SkoposDriftFamily =
  | 'policy'
  | 'architecture'
  | 'naming'
  | 'structure'
  | 'ui'
  | 'stack'
  | 'generated-artifact'
  | 'docs'
  | 'memory'
  | 'security'
  | 'action';

export type SkoposDriftStatus = 'open' | 'acknowledged' | 'suppressed' | 'resolved';

export interface SkoposDriftFinding {
  id: string;
  family: SkoposDriftFamily;
  status: SkoposDriftStatus;
  severity: SkoposPolicySeverity;
  verificationStatus: 'pass' | 'warn' | 'fail';
  summary: string;
  ruleId?: string;
  packId?: string;
  sourcePath?: string;
  evidence: string[];
  remediation: string[];
  overrideId?: string;
}

export interface SkoposDriftSummary {
  openMustCount: number;
  openShouldCount: number;
  advisoryCount: number;
  suppressedCount: number;
  resolvedCount: number;
}

export interface SkoposDriftReportArtifact extends SkoposArtifactEnvelope<'drift-report'> {
  workspaceRoot: string;
  resolvedPolicyPath?: string;
  memoryStatePath?: string;
  counts: SkoposDriftSummary;
  findings: SkoposDriftFinding[];
}
