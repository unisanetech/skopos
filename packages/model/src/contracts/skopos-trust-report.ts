import type { SkoposScanSummary } from './skopos-scan-summary.js';

export type SkoposTrustLevel = 'low' | 'medium' | 'high';

export type SkoposReadiness = 'bootstrap-needed' | 'needs-review' | 'agent-ready';

export type SkoposTrustCheckStatus = 'pass' | 'warn' | 'fail';

export interface SkoposTrustCheck {
  id: string;
  status: SkoposTrustCheckStatus;
  summary: string;
}

export interface SkoposTrustReport {
  workspaceRoot: string;
  trustLevel: SkoposTrustLevel;
  readiness: SkoposReadiness;
  summary: string;
  checks: SkoposTrustCheck[];
  unresolvedAssumptions: string[];
  findings: string[];
  detected: SkoposScanSummary;
}
