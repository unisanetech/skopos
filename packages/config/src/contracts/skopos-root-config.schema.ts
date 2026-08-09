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

export const skoposProjectModeSchema = z.enum([
  'brownfield',
  'clean-refactor',
  'greenfield-in-existing-repo',
  'new-project',
]);

export const skoposScopeStrategySchema = z.enum(['package', 'domain', 'service', 'hybrid']);

export const skoposVerificationModeSchema = z.enum(['fast', 'balanced', 'strict', 'stabilize']);

export const skoposDecisionModeSchema = z.enum(['fast', 'balanced', 'strict']);

export const skoposPrivacyModeSchema = z.enum(['local-only', 'metadata-sync', 'enterprise']);

export const skoposStoragePolicySchema = z
  .object({
    softLimitMb: z.number().int().positive(),
    hardLimitMb: z.number().int().positive(),
    retentionDays: z
      .object({
        temporary: z.number().int().nonnegative(),
        cache: z.number().int().nonnegative(),
        diagnostic: z.number().int().nonnegative(),
        taskEvidence: z.number().int().nonnegative(),
        releaseEvidence: z.number().int().nonnegative(),
      })
      .strict(),
  })
  .strict()
  .refine((policy) => policy.hardLimitMb >= policy.softLimitMb, {
    message: 'Skopos storage hardLimitMb must be greater than or equal to softLimitMb.',
    path: ['hardLimitMb'],
  });

export const skoposCommandMapSchema = z
  .object({
    dev: z.string().min(1).optional(),
    build: z.string().min(1).optional(),
    test: z.string().min(1).optional(),
    typecheck: z.string().min(1).optional(),
    lint: z.string().min(1).optional(),
  })
  .strict();

const workspaceRelativePathSchema = (label: string) =>
  z
    .string()
    .min(1)
    .refine(isWorkspaceRelativePath, (value) => ({
      message: `Skopos ${label} must stay inside the workspace: ${value}`,
    }));

export const skoposRootConfigSchema = z
  .object({
    schemaVersion: z.literal(1),
    project: z
      .object({
        name: z.string().min(1),
        archetype: skoposProjectArchetypeSchema,
        repoMode: skoposRepoModeSchema,
        scopeStrategy: skoposScopeStrategySchema,
        mode: skoposProjectModeSchema.optional(),
      })
      .strict(),
    commands: skoposCommandMapSchema,
    workspace: z
      .object({
        ignore: z.array(workspaceRelativePathSchema('workspace ignore path')),
      })
      .strict(),
    docs: z
      .object({
        root: workspaceRelativePathSchema('memory root'),
        startHerePath: workspaceRelativePathSchema('docs start-here path').optional(),
        usePerDomainArchive: z.boolean(),
        strictMetadata: z.boolean(),
        strictLinking: z.boolean(),
      })
      .strict(),
    agents: z
      .object({
        canonicalInstructions: workspaceRelativePathSchema('canonical instructions path'),
        syncMirrors: z.array(workspaceRelativePathSchema('instruction mirror path')),
        mcp: z.boolean(),
      })
      .strict(),
    verification: z
      .object({
        mode: skoposVerificationModeSchema,
        requireDocsSync: z.boolean(),
        requireEvidenceForReadiness: z.boolean(),
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
    storage: skoposStoragePolicySchema.optional(),
  })
  .strict()
  .superRefine((config, context) => {
    const startHerePath = config.docs.startHerePath;
    if (
      startHerePath &&
      isWorkspaceRelativePath(startHerePath) &&
      !isPathWithinRoot(startHerePath, config.docs.root)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['docs', 'startHerePath'],
        message: `Skopos docs start-here path must stay inside the configured memory root ${config.docs.root}: ${startHerePath}`,
      });
    }
  });

export type ParsedSkoposRootConfig = z.infer<typeof skoposRootConfigSchema>;

function isWorkspaceRelativePath(value: string): boolean {
  const normalized = value.replaceAll('\\', '/');
  return (
    normalized === '.' ||
    (!normalized.startsWith('/') &&
      !/^[a-zA-Z]:/.test(normalized) &&
      normalized.split('/').every((segment) => segment !== '..' && segment.length > 0))
  );
}

function isPathWithinRoot(path: string, root: string): boolean {
  const normalizedPath = normalizeWorkspacePath(path);
  const normalizedRoot = normalizeWorkspacePath(root);
  return normalizedRoot === '.'
    ? normalizedPath !== '.'
    : normalizedPath.startsWith(`${normalizedRoot}/`);
}

function normalizeWorkspacePath(value: string): string {
  return value.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+$/, '') || '.';
}
