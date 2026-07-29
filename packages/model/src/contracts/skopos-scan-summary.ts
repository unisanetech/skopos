import type {
  SkoposCommandMap,
  SkoposProjectArchetype,
  SkoposRepoMode,
} from './skopos-root-config.js';
import type { SkoposSourceDependency } from './skopos-source-dependency.js';

export type SkoposConfidence = 'low' | 'medium' | 'high';

export interface SkoposDocsHealthSummary {
  root?: string;
  hasStartHere: boolean;
  startHerePath?: string;
  markdownFileCount: number;
  freshnessTrackedCount: number;
  staleDocPaths: string[];
}

export interface SkoposScanSummary {
  hasRootPackageJson: boolean;
  hasPnpmWorkspace: boolean;
  focusSubtree?: string;
  ignoredPaths: string[];
  docsRoots: string[];
  docsHealth: SkoposDocsHealthSummary;
  sourceDependencies: SkoposSourceDependency[];
  instructionFiles: string[];
  packageCount: number;
  workspacePackageCount: number;
  languages: string[];
  frameworks: string[];
  commands: SkoposCommandMap;
  findings: string[];
  confidence: SkoposConfidence;
  repoMode: SkoposRepoMode;
  archetypeSuggestion: SkoposProjectArchetype;
}
