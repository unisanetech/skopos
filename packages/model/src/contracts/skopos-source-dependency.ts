export type SkoposSourceDependencyKind =
  | 'root-package'
  | 'workspace-config'
  | 'package-manifest'
  | 'package-directory'
  | 'docs-router'
  | 'docs-content'
  | 'instruction-source';

export interface SkoposSourceDependency {
  path: string;
  kind: SkoposSourceDependencyKind;
  existsAtBuild: boolean;
}
