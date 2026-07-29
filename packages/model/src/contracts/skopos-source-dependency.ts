export type SkoposSourceDependencyKind =
  | 'root-package'
  | 'root-config'
  | 'scope-registry'
  | 'workspace-config'
  | 'package-manifest'
  | 'package-directory'
  | 'docs-router'
  | 'docs-content'
  | 'memory-root'
  | 'instruction-source'
  | 'policy-source'
  | 'policy-pack';

export interface SkoposSourceDependency {
  path: string;
  kind: SkoposSourceDependencyKind;
  existsAtBuild: boolean;
  digest: string;
}
