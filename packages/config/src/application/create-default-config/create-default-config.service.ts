import type {
  SkoposCommandMap,
  SkoposProjectArchetype,
  SkoposProjectMode,
  SkoposRepoMode,
  SkoposRootConfig,
} from '@skopos/model';

export interface CreateDefaultSkoposConfigInput {
  projectName: string;
  archetype: SkoposProjectArchetype;
  repoMode: SkoposRepoMode;
  projectMode?: SkoposProjectMode;
  docsRoot?: string;
  docsStartHerePath?: string;
  canonicalInstructions?: string;
  commands?: SkoposCommandMap;
}

export const createDefaultSkoposConfig = ({
  projectName,
  archetype,
  repoMode,
  projectMode,
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
    ...(projectMode ? { mode: projectMode } : {}),
  },
  commands: sanitizeCommandMap(commands),
  workspace: {
    ignore: [],
  },
  docs: {
    root: docsRoot,
    startHerePath: docsStartHerePath,
    usePerDomainArchive: true,
    strictMetadata: projectMode !== 'brownfield',
    strictLinking: projectMode !== 'brownfield',
  },
  agents: {
    canonicalInstructions,
    syncMirrors: ['CLAUDE.md', '.cursor/rules/project.mdc', '.github/copilot-instructions.md'],
    mcp: true,
  },
  verification: {
    mode: repoMode === 'monorepo' ? 'balanced' : 'stabilize',
    requireDocsSync: true,
    requireEvidenceForReadiness: true,
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

const sanitizeCommandMap = (commands: SkoposCommandMap): SkoposCommandMap =>
  Object.fromEntries(
    Object.entries(commands).filter(([, command]) => typeof command === 'string' && command.trim().length > 0),
  ) as SkoposCommandMap;
