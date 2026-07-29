import { dirname, isAbsolute, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  SkoposProjectSkillBinding,
  SkoposSkillPackManifest,
} from '@skopos/model';
import { z } from 'zod';

import { listFilesUnder, readTextFile } from '../../adapters/workspace-filesystem.adapter.js';

const nonEmptyString = z.string().min(1);
const signalSchema = z
  .object({
    id: nonEmptyString,
    summary: nonEmptyString,
    confidence: z.enum(['low', 'medium', 'high']),
    evidence: z.array(nonEmptyString),
  })
  .strict();
const authorityBoundarySchema = z
  .object({
    actionAuthority: z.literal('skopos'),
    taskStateAuthority: z.literal('skopos'),
    readinessAuthority: z.literal('skopos'),
  })
  .strict();
const roleRequirementsSchema = z
  .object({
    context: z.array(nonEmptyString),
    recommendedContext: z.array(nonEmptyString),
    actions: z.array(nonEmptyString),
    recommendedActions: z.array(nonEmptyString),
    guards: z.array(nonEmptyString),
    recommendedGuards: z.array(nonEmptyString),
  })
  .strict();
const contextModuleSchema = z
  .object({
    id: nonEmptyString,
    title: nonEmptyString,
    summary: nonEmptyString,
    path: nonEmptyString,
    triggers: z.array(nonEmptyString),
    appliesTo: z.array(nonEmptyString),
    importance: z.enum(['required', 'recommended', 'on-demand']),
    estimatedTokens: z.number().int().positive(),
  })
  .strict();
const failureSignalSchema = z
  .object({
    id: nonEmptyString,
    summary: nonEmptyString,
    evidenceKinds: z.array(
      z.enum([
        'guard-failure',
        'finding',
        'user-correction',
        'review-finding',
        'source-observation',
      ]),
    ),
    minimumOccurrences: z.number().int().positive(),
  })
  .strict();
const researchSourceSchema = z
  .object({
    id: nonEmptyString,
    title: nonEmptyString,
    kind: z.enum([
      'normative-standard',
      'official-documentation',
      'project-authority',
      'expert-review',
      'supporting-research',
    ]),
    url: nonEmptyString.optional(),
    path: nonEmptyString.optional(),
    reviewedAt: nonEmptyString,
    reviewAfter: nonEmptyString.optional(),
    supports: z.array(nonEmptyString).min(1),
  })
  .strict()
  .refine((source) => source.url || source.path, {
    message: 'Research sources require a URL or project path.',
  });
const skillPackManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: nonEmptyString,
    type: z.literal('skill-pack'),
    status: z.enum(['draft', 'active', 'durable', 'historical', 'deprecated', 'dead']),
    authority: z.enum(['canonical', 'supporting']),
    summary: nonEmptyString.optional(),
    updatedAt: nonEmptyString.optional(),
    packId: nonEmptyString,
    family: z.enum([
      'project-intelligence',
      'ui-craft',
      'frontend-engineering',
      'accessibility',
      'ux-writing',
      'seo-content',
      'performance',
      'security-privacy',
      'testing',
      'production-readiness',
      'domain',
    ]),
    variant: nonEmptyString,
    version: nonEmptyString,
    displayName: nonEmptyString,
    description: nonEmptyString,
    plainLanguageSummary: nonEmptyString,
    authorityBoundary: authorityBoundarySchema,
    bestFor: z.array(nonEmptyString),
    notFor: z.array(nonEmptyString),
    projectLifecycles: z
      .array(
        z.enum([
          'greenfield',
          'early-product',
          'established-brownfield',
          'legacy-stabilization',
        ]),
      )
      .min(1),
    taskRisks: z.array(z.enum(['light', 'standard', 'high-impact'])).min(1),
    appliesWhen: z.array(signalSchema).min(1),
    avoidWhen: z.array(signalSchema),
    selection: z
      .object({
        maximumContextTokens: z.number().int().positive(),
        maximumModules: z.number().int().positive(),
        requirePositiveSignal: z.boolean(),
        blockOnMatchingAntiSignal: z.boolean(),
      })
      .strict(),
    requiredProjectRoles: roleRequirementsSchema,
    contextModules: z.array(contextModuleSchema).min(1),
    failureSignals: z.array(failureSignalSchema),
    adaptationQuestions: z.array(nonEmptyString),
    rubricPath: nonEmptyString,
    researchSources: z.array(researchSourceSchema).min(1),
    proofFixtureIds: z.array(nonEmptyString).min(1),
  })
  .strict()
  .superRefine((pack, context) => {
    collectDuplicateValues(pack.contextModules.map((entry) => entry.id), 'context module', context);
    collectDuplicateValues(pack.researchSources.map((entry) => entry.id), 'research source', context);
    collectDuplicateValues(pack.failureSignals.map((entry) => entry.id), 'failure signal', context);
    const estimatedTokens = pack.contextModules.reduce(
      (total, entry) => total + entry.estimatedTokens,
      0,
    );
    if (pack.selection.maximumContextTokens > estimatedTokens) {
      context.addIssue({
        code: 'custom',
        message: 'Skill context budget exceeds the total declared module estimate.',
      });
    }
  });
const projectSkillBindingSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: nonEmptyString,
    type: z.literal('project-skill-binding'),
    status: z.enum(['draft', 'active', 'durable', 'historical', 'deprecated', 'dead']),
    authority: z.enum(['canonical', 'supporting']),
    summary: nonEmptyString.optional(),
    updatedAt: nonEmptyString.optional(),
    bindingId: nonEmptyString,
    packId: nonEmptyString,
    packVersion: nonEmptyString,
    lifecycle: z.enum([
      'candidate',
      'recommended',
      'accepted',
      'adapted',
      'validated',
      'rejected',
      'retired',
    ]),
    sourceBindings: z.record(nonEmptyString, z.array(nonEmptyString).min(1)),
    actionBindings: z.record(nonEmptyString, nonEmptyString),
    guardBindings: z.record(nonEmptyString, nonEmptyString),
    adaptationNotes: z.array(nonEmptyString),
    acceptance: z
      .object({
        acceptedAt: nonEmptyString.refine(
          (value) => !Number.isNaN(Date.parse(value)),
          'Expected an ISO-compatible date-time.',
        ),
        acceptedBy: nonEmptyString,
        reason: nonEmptyString,
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((binding, context) => {
    if (
      (binding.lifecycle === 'accepted' || binding.lifecycle === 'validated') &&
      !binding.acceptance
    ) {
      context.addIssue({
        code: 'custom',
        message: `Binding lifecycle ${binding.lifecycle} requires explicit acceptance metadata.`,
      });
    }
    if (
      binding.acceptance &&
      binding.lifecycle !== 'accepted' &&
      binding.lifecycle !== 'validated'
    ) {
      context.addIssue({
        code: 'custom',
        message: `Binding acceptance metadata requires lifecycle accepted or validated, not ${binding.lifecycle}.`,
      });
    }
  });

export interface SkoposLoadedSkillPack extends SkoposSkillPackManifest {
  sourcePath: string;
}

export interface SkoposLoadedProjectSkillBinding extends SkoposProjectSkillBinding {
  sourcePath: string;
}

const SKILL_PACK_LOADER_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const BUNDLED_SKILL_PACK_ROOT = join(SKILL_PACK_LOADER_DIRECTORY, 'skill-packs');
const SOURCE_SKILL_PACK_ROOT = join(
  SKILL_PACK_LOADER_DIRECTORY,
  '..',
  '..',
  '..',
  '..',
  '..',
  'skill-packs',
);

export const loadSkoposSkillPacks = async ({
  cwd,
  packRoots = ['skill-packs'],
}: {
  cwd: string;
  packRoots?: string[];
}): Promise<SkoposLoadedSkillPack[]> => {
  const packs: SkoposLoadedSkillPack[] = [];
  const seenPackIds = new Set<string>();
  for (const packRoot of packRoots) {
    const rootPackIds = new Set<string>();
    for (const manifestPath of await listManifestPaths(cwd, [packRoot], '/pack.json')) {
      const contents = await readTextFile(manifestPath);
      if (!contents) continue;
      const pack = skillPackManifestSchema.parse(JSON.parse(contents));
      if (rootPackIds.has(pack.packId)) {
        throw new Error(`Duplicate skill pack id in ${packRoot}: ${pack.packId}`);
      }
      rootPackIds.add(pack.packId);
      if (seenPackIds.has(pack.packId)) continue;
      seenPackIds.add(pack.packId);
      packs.push({ ...pack, sourcePath: relative(cwd, manifestPath) || manifestPath });
    }
  }
  return packs.sort((left, right) => left.packId.localeCompare(right.packId));
};

export const loadSkoposSkillPackCatalog = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposLoadedSkillPack[]> =>
  loadSkoposSkillPacks({
    cwd,
    packRoots: ['skill-packs', BUNDLED_SKILL_PACK_ROOT, SOURCE_SKILL_PACK_ROOT],
  });

export const loadSkoposProjectSkillBindings = async ({
  cwd,
  bindingRoots = ['tools/skopos/skills'],
}: {
  cwd: string;
  bindingRoots?: string[];
}): Promise<SkoposLoadedProjectSkillBinding[]> => {
  const bindings: SkoposLoadedProjectSkillBinding[] = [];
  for (const bindingPath of [
    ...new Set(await listManifestPaths(cwd, bindingRoots, '.json')),
  ]) {
    const contents = await readTextFile(bindingPath);
    if (!contents) continue;
    const binding = projectSkillBindingSchema.parse(JSON.parse(contents));
    bindings.push({ ...binding, sourcePath: relative(cwd, bindingPath) || bindingPath });
  }
  rejectDuplicateIds(bindings.map((binding) => binding.bindingId), 'project skill binding');
  return bindings.sort((left, right) => left.bindingId.localeCompare(right.bindingId));
};

const listManifestPaths = async (
  cwd: string,
  roots: string[],
  suffix: string,
): Promise<string[]> => {
  const paths: string[] = [];
  for (const root of roots) {
    const resolved = isAbsolute(root) ? root : join(cwd, root);
    paths.push(
      ...(await listFilesUnder(resolved, ['.json'])).filter((filePath) =>
        filePath.endsWith(suffix),
      ),
    );
  }
  return paths.sort();
};

const rejectDuplicateIds = (ids: string[], label: string): void => {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`Duplicate ${label} id: ${id}`);
    seen.add(id);
  }
};

const collectDuplicateValues = (
  values: string[],
  label: string,
  context: { addIssue: (issue: { code: 'custom'; message: string }) => void },
): void => {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      context.addIssue({ code: 'custom', message: `Duplicate ${label} id: ${value}` });
    }
    seen.add(value);
  }
};
