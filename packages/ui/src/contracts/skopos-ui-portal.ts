import type { SkoposReadiness, SkoposTrustLevel } from '@skopos/model';

export interface SkoposUiArtifactCounts {
  plans: number;
  missions: number;
  runs: number;
  graphArtifacts: number;
}

export interface SkoposUiPortalRenderResult {
  workspaceRoot: string;
  outputPath: string;
  graphPortalPath: string;
  writeStatus: 'written' | 'dry-run';
  graphPortalWriteStatus: 'written' | 'dry-run';
  graphCount: number;
  trustLevel: SkoposTrustLevel;
  readiness: SkoposReadiness;
  trustSummary: string;
  artifactCounts: SkoposUiArtifactCounts;
  html: string;
  graphHtml: string;
}
