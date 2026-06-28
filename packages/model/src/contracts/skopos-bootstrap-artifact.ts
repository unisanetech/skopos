import type { SkoposArchitectureReport } from './skopos-architecture-report.js';
import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposDiagnosisReport } from './skopos-diagnosis-report.js';
import type {
  SkoposEnforcementProfileArtifact,
  SkoposToolAdapterSummary,
} from './skopos-enforcement-profile.js';
import type { SkoposGraphKind } from './skopos-graph.js';
import type { SkoposRootConfig } from './skopos-root-config.js';
import type { SkoposScanSummary } from './skopos-scan-summary.js';
import type { SkoposDecisionQuestion } from './skopos-decision-question.js';
import type { SkoposScopesLiteArtifact } from './skopos-scope-lite.js';
import type { SkoposSourceDependency } from './skopos-source-dependency.js';

export type SkoposInitMode = 'existing' | 'greenfield';

export interface SkoposBootstrapArtifact extends SkoposArtifactEnvelope<'bootstrap'> {
  workspaceRoot: string;
  mode: SkoposInitMode;
  focusSubtree?: string;
  detected: SkoposScanSummary;
  sourceDependencies: SkoposSourceDependency[];
  recommendedConfig: SkoposRootConfig;
  recommendedQuestions: SkoposDecisionQuestion[];
  recommendedNextSteps: string[];
}

export type SkoposWriteStatus = 'written' | 'refreshed-stale' | 'skipped-existing' | 'dry-run';

export interface SkoposInitGraphArtifact {
  id: string;
  kind: SkoposGraphKind;
  path: string;
  write: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
}

export interface SkoposInitReferenceArtifact {
  id: 'symbols' | 'duplicates' | 'contradictions';
  path: string;
  write: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
}

export type SkoposInstructionScaffoldWriteStatus =
  | 'written'
  | 'overwritten'
  | 'skipped-existing'
  | 'dry-run';

export interface SkoposInstructionScaffoldArtifact {
  path: string;
  relativePath: string;
  status: SkoposInstructionScaffoldWriteStatus;
  mode: SkoposInitMode;
  projectName: string;
  templateVersion: 1;
  sections: string[];
}

export type SkoposDocsScaffoldWriteStatus = 'written' | 'skipped-existing' | 'dry-run';

export interface SkoposDocsScaffoldArtifact {
  path: string;
  relativePath: string;
  status: SkoposDocsScaffoldWriteStatus;
  title: string;
}

export type SkoposGitignoreScaffoldWriteStatus = 'written' | 'skipped-existing' | 'dry-run';

export interface SkoposGitignoreScaffoldArtifact {
  path: string;
  relativePath: string;
  status: SkoposGitignoreScaffoldWriteStatus;
  ignoredPaths: string[];
}

export interface SkoposInitResult {
  configPath: string;
  bootstrapPath: string;
  memoryPath?: string;
  communicationBriefPath?: string;
  scopesLitePath: string;
  diagnosisPath: string;
  architecturePath: string;
  enforcementPath: string;
  indexPath: string;
  logPath: string;
  workspaceGraphPath: string;
  graphArtifacts: SkoposInitGraphArtifact[];
  referenceArtifacts: SkoposInitReferenceArtifact[];
  toolAdapterArtifacts: SkoposToolAdapterSummary[];
  docsScaffold?: SkoposDocsScaffoldArtifact;
  gitignoreScaffold?: SkoposGitignoreScaffoldArtifact;
  instructionScaffold?: SkoposInstructionScaffoldArtifact;
  configWrite: SkoposWriteStatus;
  bootstrapWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  scopesLiteWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  diagnosisWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  architectureWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  enforcementWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  indexWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  memoryWrite?: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  communicationBriefWrite?: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  logWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  workspaceGraphWrite: Extract<SkoposWriteStatus, 'written' | 'dry-run'>;
  actorId?: string;
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  diagnosis: SkoposDiagnosisReport;
  architecture: SkoposArchitectureReport;
  enforcement: SkoposEnforcementProfileArtifact;
}
