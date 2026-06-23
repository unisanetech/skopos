import type {
  SkoposCommandMap,
  SkoposProjectArchetype,
  SkoposRepoMode,
  SkoposRootConfig,
} from '@skopos/model';

export interface CreateDefaultSkoposConfigInput {
  projectName: string;
  archetype: SkoposProjectArchetype;
  repoMode: SkoposRepoMode;
  docsRoot?: string;
  docsStartHerePath?: string;
  canonicalInstructions?: string;
  commands?: SkoposCommandMap;
}

export const createDefaultSkoposConfig = ({
  projectName,
  archetype,
  repoMode,
  docsRoot = 'docs',
  docsStartHerePath = `${docsRoot}/00-start-here.md`,
  canonicalInstructions = 'AGENTS.md',
  commands = {},
}: CreateDefaultSkoposConfigInput): SkoposRootConfig => ({
  schemaVersion: 1,
  project: {
    name: projectName,
    archetype,
    repoMode,
    scopeStrategy: repoMode === 'single' ? 'domain' : 'hybrid',
  },
  commands,
  workspace: {
    ignore: [],
  },
  docs: {
    root: docsRoot,
    startHerePath: docsStartHerePath,
    usePerDomainArchive: true,
    strictMetadata: true,
    strictLinking: true,
  },
  agents: {
    canonicalInstructions,
    syncMirrors: ['CLAUDE.md', '.cursor/rules/project.mdc', '.github/copilot-instructions.md'],
    mcp: true,
  },
  trust: {
    mode: repoMode === 'monorepo' ? 'balanced' : 'stabilize',
    requireDocsSync: true,
    requireProofForDone: true,
  },
  decisions: {
    mode: 'balanced',
    askFor: [
      'architecture-shift',
      'public-api-change',
      'destructive-migration',
      'vendor-choice',
      'security-privacy-change',
    ],
  },
  security: {
    privacyMode: 'local-only',
    redactSecrets: true,
  },
});
