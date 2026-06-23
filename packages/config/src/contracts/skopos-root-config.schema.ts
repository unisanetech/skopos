import { z } from 'zod';

export const skoposProjectArchetypeSchema = z.enum([
  'saas',
  'api',
  'library',
  'monorepo-platform',
  'internal-tool',
  'custom',
]);

export const skoposRepoModeSchema = z.enum(['single', 'multi-package', 'monorepo']);

export const skoposScopeStrategySchema = z.enum(['package', 'domain', 'service', 'hybrid']);

export const skoposTrustModeSchema = z.enum(['fast', 'balanced', 'strict', 'stabilize']);

export const skoposDecisionModeSchema = z.enum(['fast', 'balanced', 'strict']);

export const skoposPrivacyModeSchema = z.enum(['local-only', 'metadata-sync', 'enterprise']);

export const skoposCommandMapSchema = z
  .object({
    dev: z.string().min(1).optional(),
    build: z.string().min(1).optional(),
    test: z.string().min(1).optional(),
    typecheck: z.string().min(1).optional(),
    lint: z.string().min(1).optional(),
  })
  .strict();

export const skoposRootConfigSchema = z
  .object({
    schemaVersion: z.literal(1),
    project: z
      .object({
        name: z.string().min(1),
        archetype: skoposProjectArchetypeSchema,
        repoMode: skoposRepoModeSchema,
        scopeStrategy: skoposScopeStrategySchema,
      })
      .strict(),
    commands: skoposCommandMapSchema,
    workspace: z
      .object({
        ignore: z.array(z.string().min(1)),
      })
      .strict(),
    docs: z
      .object({
        root: z.string().min(1),
        startHerePath: z.string().min(1).optional(),
        usePerDomainArchive: z.boolean(),
        strictMetadata: z.boolean(),
        strictLinking: z.boolean(),
      })
      .strict(),
    agents: z
      .object({
        canonicalInstructions: z.string().min(1),
        syncMirrors: z.array(z.string().min(1)),
        mcp: z.boolean(),
      })
      .strict(),
    trust: z
      .object({
        mode: skoposTrustModeSchema,
        requireDocsSync: z.boolean(),
        requireProofForDone: z.boolean(),
      })
      .strict(),
    decisions: z
      .object({
        mode: skoposDecisionModeSchema,
        askFor: z.array(z.string().min(1)),
      })
      .strict(),
    security: z
      .object({
        privacyMode: skoposPrivacyModeSchema,
        redactSecrets: z.boolean(),
      })
      .strict(),
  })
  .strict();

export type ParsedSkoposRootConfig = z.infer<typeof skoposRootConfigSchema>;
