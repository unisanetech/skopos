export interface SkoposUiArtifactCounts {
  plans: number;
  tasks: number;
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
  readiness: 'ready' | 'attention' | 'blocked';
  readinessSummary: string;
  artifactCounts: SkoposUiArtifactCounts;
  html: string;
  graphHtml: string;
}
