import type { SkoposReadiness, SkoposTrustLevel } from '@skopos/model';
import type { Server } from 'node:http';

import type { SkoposUiConsoleState } from './skopos-ui-console-state.js';

export interface SkoposUiConsoleBuildResult {
  workspaceRoot: string;
  outputDirectory: string;
  entryHtmlPath: string;
  statePath: string;
  searchIndexPath: string;
  assetPaths: string[];
  writeStatus: 'written' | 'dry-run';
  generatedAt: string;
  trustLevel: SkoposTrustLevel;
  readiness: SkoposReadiness;
  state: SkoposUiConsoleState;
}

export interface SkoposUiConsoleServeResult extends SkoposUiConsoleBuildResult {
  host: string;
  port: number;
  url: string;
  server: Server;
}

export interface SkoposUiConsoleDevResult {
  workspaceRoot: string;
  host: string;
  port: number;
  url: string;
  stateEndpointPath: string;
  fileEndpointPath: string;
  generatedAt: string;
  trustLevel: SkoposTrustLevel;
  readiness: SkoposReadiness;
  state: SkoposUiConsoleState;
  server: {
    close(): Promise<void>;
  };
}
