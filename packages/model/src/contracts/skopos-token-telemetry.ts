import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposTokenTelemetrySurfaceKind =
  | 'agent-brief'
  | 'discussion-handoff'
  | 'resume-context';

export interface SkoposTokenTelemetryMeasurement {
  id: string;
  title: string;
  surfaceKind: SkoposTokenTelemetrySurfaceKind;
  path?: string;
  estimatedTokens: number;
  budgetTokens: number;
  status: 'within-budget' | 'over-budget' | 'missing';
}

export interface SkoposTokenTelemetryArtifact
  extends SkoposArtifactEnvelope<'token-telemetry'> {
  workspaceRoot: string;
  activeMissionId?: string;
  measurementCount: number;
  overBudgetCount: number;
  missingCount: number;
  measurements: SkoposTokenTelemetryMeasurement[];
  suggestedActions: string[];
}
