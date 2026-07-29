export type SkoposProjectArchetype =
  | 'saas'
  | 'api'
  | 'library'
  | 'monorepo-platform'
  | 'internal-tool'
  | 'custom';

export type SkoposRepoMode = 'single' | 'multi-package' | 'monorepo';

export type SkoposProjectMode =
  | 'brownfield'
  | 'clean-refactor'
  | 'greenfield-in-existing-repo'
  | 'new-project';

export type SkoposScopeStrategy = 'package' | 'domain' | 'service' | 'hybrid';

export type SkoposVerificationMode = 'fast' | 'balanced' | 'strict' | 'stabilize';

export type SkoposDecisionMode = 'fast' | 'balanced' | 'strict';

export type SkoposPrivacyMode = 'local-only' | 'metadata-sync' | 'enterprise';

export type SkoposCommandName = 'dev' | 'build' | 'test' | 'typecheck' | 'lint';

export type SkoposCommandMap = Partial<Record<SkoposCommandName, string>>;
export type SkoposValidationMode = 'commands' | 'actions';

export interface SkoposRootConfig {
  schemaVersion: 1;
  project: {
    name: string;
    archetype: SkoposProjectArchetype;
    repoMode: SkoposRepoMode;
    scopeStrategy: SkoposScopeStrategy;
    mode?: SkoposProjectMode;
  };
  commands: SkoposCommandMap;
  validation?: {
    mode: SkoposValidationMode;
  };
  workspace: {
    ignore: string[];
  };
  docs: {
    root: string;
    startHerePath?: string;
    usePerDomainArchive: boolean;
    strictMetadata: boolean;
    strictLinking: boolean;
  };
  agents: {
    canonicalInstructions: string;
    syncMirrors: string[];
    mcp: boolean;
  };
  verification: {
    mode: SkoposVerificationMode;
    requireDocsSync: boolean;
    requireEvidenceForReadiness: boolean;
  };
  decisions: {
    mode: SkoposDecisionMode;
    askFor: string[];
  };
  security: {
    privacyMode: SkoposPrivacyMode;
    redactSecrets: boolean;
  };
}
