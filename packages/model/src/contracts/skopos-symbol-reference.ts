import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposSymbolReferenceKind =
  | 'function'
  | 'class'
  | 'interface'
  | 'type-alias'
  | 'enum'
  | 'variable'
  | 'namespace'
  | 'default-export';

export interface SkoposSymbolPackageSummary {
  packageId: string;
  packagePath: string;
  sourceFileCount: number;
  symbolCount: number;
}

export interface SkoposSymbolReferenceEntry {
  id: string;
  name: string;
  kind: SkoposSymbolReferenceKind;
  packageId: string;
  packagePath: string;
  sourcePath: string;
  line: number;
  exported: boolean;
  isDefaultExport: boolean;
  isTypeOnly: boolean;
}

export interface SkoposSymbolReferenceArtifact extends SkoposArtifactEnvelope<'symbols'> {
  workspaceRoot: string;
  focusSubtree?: string;
  packages: SkoposSymbolPackageSummary[];
  entries: SkoposSymbolReferenceEntry[];
}
