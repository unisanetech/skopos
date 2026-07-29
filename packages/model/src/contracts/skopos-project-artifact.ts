import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export const SKOPOS_LOCAL_STATE_FAMILIES = [
  'index',
  'graph',
  'sessions',
  'tasks',
  'evidence',
  'handoffs',
  'runs',
  'ui',
  'coordination.sqlite',
  'cache',
] as const;

export type SkoposLocalStateFamily = (typeof SKOPOS_LOCAL_STATE_FAMILIES)[number];

export interface SkoposProjectSourceFile {
  path: string;
  digest: string;
}

export interface SkoposProjectSourceState {
  algorithm: 'sha256';
  digest: string;
  files: SkoposProjectSourceFile[];
  missingRoots: string[];
}

export interface SkoposProjectArtifact extends SkoposArtifactEnvelope<'project'> {
  projectName: string;
  configPath: 'skopos.config.yaml';
  instructionsPath: string;
  docsRoot: string;
  trackedRoots: string[];
  sourceState: SkoposProjectSourceState;
  localState: {
    root: '.skopos';
    families: SkoposLocalStateFamily[];
  };
}

export interface SkoposProjectArtifactValidation {
  status: 'pass' | 'fail';
  diagnostics: string[];
}
