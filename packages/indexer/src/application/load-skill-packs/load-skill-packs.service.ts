import { dirname, isAbsolute, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  SkoposProjectSkillBinding,
  SkoposSkillModuleManifest,
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
const moduleApplicabilitySchema = z
  .object({
    scopeKinds: z.array(nonEmptyString),
    pathKinds: z.array(nonEmptyString),
    capabilities: z.array(nonEmptyString),
  })
  .strict();
const skillModuleSchema = z
  .object({
    id: nonEmptyString,
    title: nonEmptyString,
    summary: nonEmptyString,
    path: nonEmptyString,
    importance: z.enum(['required', 'recommended', 'on-demand']),
    positiveSignals: z.array(signalSchema).min(1),
    negativeSignals: z.array(signalSchema),
    applicability: moduleApplicabilitySchema,
    projectRoles: roleRequirementsSchema,
    rubricDimensions: z.array(nonEmptyString).min(1),
    failureSignalIds: z.array(nonEmptyString),
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
    ownership: z
      .object({
        purpose: nonEmptyString,
        owns: z.array(nonEmptyString).min(1),
        excludes: z.array(nonEmptyString).min(1),
        overlapRules: z.array(nonEmptyString),
      })
      .strict(),
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
    selection: z
      .object({
        maximumMeasuredTokens: z.number().int().positive(),
        maximumModules: z.number().int().positive(),
      })
      .strict(),
    modules: z.array(skillModuleSchema).min(1),
    failureSignals: z.array(failureSignalSchema),
    rubricPath: nonEmptyString,
    researchSources: z.array(researchSourceSchema).min(1),
    proofFixtureIds: z.array(nonEmptyString).min(1),
  })
  .strict()
  .superRefine((pack, context) => {
    collectDuplicateValues(pack.modules.map((entry) => entry.id), 'skill module', context);
    collectDuplicateValues(pack.researchSources.map((entry) => entry.id), 'research source', context);
    collectDuplicateValues(pack.failureSignals.map((entry) => entry.id), 'failure signal', context);
    for (const module of pack.modules) {
      collectDuplicateValues(module.positiveSignals.map((entry) => entry.id), `${module.id} positive signal`, context);
      collectDuplicateValues(module.negativeSignals.map((entry) => entry.id), `${module.id} negative signal`, context);
      collectDuplicateValues(module.failureSignalIds, `${module.id} failure signal reference`, context);
      const knownFailureSignalIds = new Set(pack.failureSignals.map((entry) => entry.id));
      for (const failureSignalId of module.failureSignalIds) {
        if (!knownFailureSignalIds.has(failureSignalId)) {
          context.addIssue({
            code: 'custom',
            message: `Skill module ${module.id} references unknown failure signal ${failureSignalId}.`,
          });
        }
      }
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

export interface SkoposLoadedSkillModule extends SkoposSkillModuleManifest {
  measuredTokens: number;
}

export interface SkoposLoadedSkillPack
  extends Omit<SkoposSkillPackManifest, 'modules'> {
  modules: SkoposLoadedSkillModule[];
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
      const packDirectory = dirname(manifestPath);
      const modules = await Promise.all(
        pack.modules.map(async (module): Promise<SkoposLoadedSkillModule> => {
          const moduleContents = await readTextFile(join(packDirectory, module.path));
          if (!moduleContents?.trim()) {
            throw new Error(`Skill module ${module.id} is missing ${module.path}.`);
          }
          return {
            ...module,
            measuredTokens: measureSkillModuleTokens(moduleContents),
          };
        }),
      );
      await validateSkillRubricDimensions({ pack, packDirectory });
      packs.push({
        ...pack,
        modules,
        sourcePath: relative(cwd, manifestPath) || manifestPath,
      });
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

const measureSkillModuleTokens = (contents: string): number =>
  Math.ceil(contents.trim().length / 4);

const validateSkillRubricDimensions = async ({
  pack,
  packDirectory,
}: {
  pack: SkoposSkillPackManifest;
  packDirectory: string;
}): Promise<void> => {
  const rubricContents = await readTextFile(join(packDirectory, pack.rubricPath));
  if (!rubricContents) {
    throw new Error(`Skill pack ${pack.packId} is missing rubric ${pack.rubricPath}.`);
  }
  const rubric = z
    .object({ dimensions: z.array(nonEmptyString).min(1) })
    .passthrough()
    .parse(JSON.parse(rubricContents));
  const dimensionIds = new Set(rubric.dimensions);
  for (const module of pack.modules) {
    for (const dimension of module.rubricDimensions) {
      if (!dimensionIds.has(dimension)) {
        throw new Error(
          `Skill module ${module.id} references unknown rubric dimension ${dimension}.`,
        );
      }
    }
  }
};
