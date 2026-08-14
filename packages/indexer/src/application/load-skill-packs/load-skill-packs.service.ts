import { dirname, isAbsolute, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  SkoposProjectSkillBinding,
  SkoposSkillEvaluationSuiteManifest,
  SkoposSkillFixtureManifest,
  SkoposSkillModuleManifest,
  SkoposSkillPackManifest,
} from '@skopos/model';
import { SKOPOS_SCOPE_KINDS } from '@skopos/model';
import { z } from 'zod';

import { listFilesUnder, readTextFile } from '../../adapters/workspace-filesystem.adapter.js';
import {
  loadSkoposSkillContextLibrary,
  type SkoposLoadedSkillContextLibrary,
} from '../load-skill-context-library/load-skill-context-library.service.js';

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
    scopeKinds: z.array(z.enum(SKOPOS_SCOPE_KINDS)),
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
      'interface-design',
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
    contextLibrary: z
      .object({
        path: nonEmptyString,
        maximumMeasuredTokens: z.number().int().positive(),
      })
      .strict()
      .optional(),
    modules: z.array(skillModuleSchema).min(1),
    failureSignals: z.array(failureSignalSchema),
    rubricPath: nonEmptyString,
    researchSources: z.array(researchSourceSchema).min(1),
    proofFixtureIds: z.array(nonEmptyString).min(1),
    evaluationSuiteIds: z.array(nonEmptyString).min(1),
  })
  .strict()
  .superRefine((pack, context) => {
    collectDuplicateValues(pack.modules.map((entry) => entry.id), 'skill module', context);
    collectDuplicateValues(pack.researchSources.map((entry) => entry.id), 'research source', context);
    collectDuplicateValues(pack.failureSignals.map((entry) => entry.id), 'failure signal', context);
    collectDuplicateValues(pack.proofFixtureIds, 'proof fixture', context);
    collectDuplicateValues(pack.evaluationSuiteIds, 'evaluation suite', context);
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
        identity: z
          .object({
            packSourceDigest: nonEmptyString,
            bindingSourceDigest: nonEmptyString,
            projectSourceDigest: nonEmptyString,
            capabilityCatalogDigest: nonEmptyString,
            evaluationSourceDigest: nonEmptyString,
            combinedDigest: nonEmptyString,
          })
          .strict(),
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

const skillSelectionReasonCodeSchema = z.enum([
  'selected',
  'risk-mismatch',
  'lifecycle-mismatch',
  'binding-invalid',
  'positive-signal-missing',
  'applicability-missing',
  'blocking-anti-signal',
  'review-phase-mismatch',
  'duplicate-judgment',
  'pack-budget-exhausted',
  'module-budget-exhausted',
  'token-budget-exhausted',
]);
const skillFixtureSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: nonEmptyString,
    type: z.literal('skill-selection-fixture'),
    status: z.literal('active'),
    authority: z.literal('supporting'),
    summary: nonEmptyString,
    updatedAt: nonEmptyString.optional(),
    fixtureId: nonEmptyString,
    packId: nonEmptyString,
    category: z.enum([
      'positive',
      'negative',
      'ambiguous',
      'generated-output',
      'capability-locality',
      'budget',
    ]),
    task: z
      .object({
        goal: nonEmptyString,
        scope: z
          .object({
            id: nonEmptyString,
            title: nonEmptyString,
            path: nonEmptyString,
            kind: z.enum([
              'workspace',
              'product',
              'application',
              'service',
              'package',
              'domain',
              'infrastructure',
              'tool',
            ]),
            ancestorIds: z.array(nonEmptyString),
            aliases: z.array(nonEmptyString),
            codeRoots: z.array(nonEmptyString).min(1),
          })
          .strict(),
        acceptanceCriteria: z.array(nonEmptyString),
        constraints: z.array(nonEmptyString),
        nonGoals: z.array(nonEmptyString),
        openDecisions: z.array(nonEmptyString),
        risk: z.enum(['light', 'standard', 'high-impact']),
        phase: z.enum(['admission', 'iteration', 'stabilization', 'closure']),
        ownedPaths: z.array(nonEmptyString),
        changedPaths: z.array(nonEmptyString),
        affectedCapabilities: z.array(nonEmptyString),
        selectedActionIds: z.array(nonEmptyString),
        applicableGuardIds: z.array(nonEmptyString),
        acceptedFailureEvidence: z.array(
          z.object({ id: nonEmptyString, summary: nonEmptyString }).strict(),
        ),
        projectLifecycle: z.enum([
          'greenfield',
          'early-product',
          'established-brownfield',
          'legacy-stabilization',
        ]),
      })
      .strict(),
    expectation: z
      .object({
        selectedModuleIds: z.array(nonEmptyString),
        suppressedModuleReasonCodes: z.record(
          nonEmptyString,
          skillSelectionReasonCodeSchema,
        ),
        selectedActionIds: z.array(nonEmptyString),
        selectedGuardIds: z.array(nonEmptyString),
        maximumSelectedModules: z.number().int().nonnegative().optional(),
        maximumMeasuredTokens: z.number().int().nonnegative().optional(),
      })
      .strict(),
  })
  .strict()
  .superRefine((fixture, context) => {
    if (fixture.id !== `skill-selection-fixture.${fixture.fixtureId}`) {
      context.addIssue({
        code: 'custom',
        message: `Fixture ${fixture.fixtureId} id must be skill-selection-fixture.${fixture.fixtureId}.`,
      });
    }
    collectDuplicateValues(fixture.expectation.selectedModuleIds, `${fixture.fixtureId} selected module`, context);
    collectDuplicateValues(fixture.expectation.selectedActionIds, `${fixture.fixtureId} selected action`, context);
    collectDuplicateValues(fixture.expectation.selectedGuardIds, `${fixture.fixtureId} selected guard`, context);
  });

const skillEvaluationSuiteSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: nonEmptyString,
    type: z.literal('skill-evaluation-suite'),
    status: z.literal('active'),
    authority: z.literal('supporting'),
    summary: nonEmptyString,
    updatedAt: nonEmptyString.optional(),
    suiteId: nonEmptyString,
    packId: nonEmptyString,
    cases: z
      .array(
        z
          .object({
            caseId: nonEmptyString,
            title: nonEmptyString,
            taskPrompt: nonEmptyString,
            projectTemplatePath: nonEmptyString,
            candidateModuleIds: z.array(nonEmptyString).min(1),
            rubricDimensions: z.array(nonEmptyString).min(1),
          })
          .strict(),
      )
      .min(1),
  })
  .strict()
  .superRefine((suite, context) => {
    if (suite.id !== `skill-evaluation-suite.${suite.suiteId}`) {
      context.addIssue({
        code: 'custom',
        message: `Evaluation suite ${suite.suiteId} id must be skill-evaluation-suite.${suite.suiteId}.`,
      });
    }
    collectDuplicateValues(suite.cases.map((entry) => entry.caseId), `${suite.suiteId} case`, context);
  });

export interface SkoposLoadedSkillModule extends SkoposSkillModuleManifest {
  measuredTokens: number;
}

export interface SkoposLoadedSkillPack
  extends Omit<SkoposSkillPackManifest, 'modules'> {
  modules: SkoposLoadedSkillModule[];
  fixtures: SkoposLoadedSkillFixture[];
  evaluationSuites: SkoposLoadedSkillEvaluationSuite[];
  loadedContextLibrary?: SkoposLoadedSkillContextLibrary;
  sourcePath: string;
}

export interface SkoposLoadedSkillFixture extends SkoposSkillFixtureManifest {
  sourcePath: string;
}

export interface SkoposLoadedSkillEvaluationSuite
  extends SkoposSkillEvaluationSuiteManifest {
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
      const fixtures = await loadSkillFixtures({
        cwd,
        pack,
        packDirectory,
      });
      const evaluationSuites = await loadSkillEvaluationSuites({
        cwd,
        pack,
        packDirectory,
      });
      const loadedContextLibrary = pack.contextLibrary
        ? await loadSkoposSkillContextLibrary({
            cwd: packDirectory,
            sourcePath: pack.contextLibrary.path,
          })
        : undefined;
      if (loadedContextLibrary && !loadedContextLibrary.consumerPackIds.includes(pack.packId)) {
        throw new Error(
          `Skill Context Library ${loadedContextLibrary.libraryId} does not declare consumer ${pack.packId}.`,
        );
      }
      packs.push({
        ...pack,
        modules,
        fixtures,
        evaluationSuites,
        ...(loadedContextLibrary ? { loadedContextLibrary } : {}),
        sourcePath: normalizeSkoposSkillCatalogPath(
          relative(cwd, manifestPath) || manifestPath,
        ),
      });
    }
  }
  return packs.sort((left, right) => left.packId.localeCompare(right.packId));
};

const loadSkillEvaluationSuites = async ({
  cwd,
  pack,
  packDirectory,
}: {
  cwd: string;
  pack: SkoposSkillPackManifest;
  packDirectory: string;
}): Promise<SkoposLoadedSkillEvaluationSuite[]> => {
  const suiteDirectory = join(packDirectory, 'evaluations');
  const suites: SkoposLoadedSkillEvaluationSuite[] = [];
  const knownModuleIds = new Set(pack.modules.map((module) => module.id));
  const rubricContents = await readTextFile(join(packDirectory, pack.rubricPath));
  const rubric = z
    .object({ dimensions: z.array(nonEmptyString).min(1) })
    .passthrough()
    .parse(JSON.parse(rubricContents ?? '{}'));
  const knownRubricDimensions = new Set(rubric.dimensions);
  for (const suitePath of (await listFilesUnder(suiteDirectory, ['.json']))
    .filter((path) => path.endsWith('.suite.json'))
    .sort()) {
    const contents = await readTextFile(suitePath);
    if (!contents) continue;
    const suite = skillEvaluationSuiteSchema.parse(JSON.parse(contents));
    if (suite.packId !== pack.packId) {
      throw new Error(
        `Skill evaluation suite ${suite.suiteId} belongs to ${suite.packId}, not ${pack.packId}.`,
      );
    }
    for (const evaluationCase of suite.cases) {
      for (const moduleId of evaluationCase.candidateModuleIds) {
        if (!knownModuleIds.has(moduleId)) {
          throw new Error(
            `Skill evaluation case ${evaluationCase.caseId} references unknown module ${moduleId}.`,
          );
        }
      }
      for (const dimension of evaluationCase.rubricDimensions) {
        if (!knownRubricDimensions.has(dimension)) {
          throw new Error(
            `Skill evaluation case ${evaluationCase.caseId} references unknown rubric dimension ${dimension}.`,
          );
        }
      }
      const templateFiles = await listFilesUnder(
        join(packDirectory, evaluationCase.projectTemplatePath),
      );
      if (templateFiles.length === 0) {
        throw new Error(
          `Skill evaluation case ${evaluationCase.caseId} has no project template at ${evaluationCase.projectTemplatePath}.`,
        );
      }
    }
    suites.push({
      ...suite,
      sourcePath: normalizeSkoposSkillCatalogPath(relative(cwd, suitePath) || suitePath),
    });
  }
  rejectDuplicateIds(suites.map((suite) => suite.suiteId), 'skill evaluation suite');
  const declared = [...pack.evaluationSuiteIds].sort();
  const discovered = suites.map((suite) => suite.suiteId).sort();
  const undeclared = discovered.filter((suiteId) => !declared.includes(suiteId));
  const missing = declared.filter((suiteId) => !discovered.includes(suiteId));
  if (undeclared.length > 0 || missing.length > 0) {
    throw new Error(
      `Skill pack ${pack.packId} evaluation suite declarations do not match discovered manifests.` +
        `${missing.length > 0 ? ` Missing: ${missing.join(', ')}.` : ''}` +
        `${undeclared.length > 0 ? ` Undeclared: ${undeclared.join(', ')}.` : ''}`,
    );
  }
  return suites;
};

const loadSkillFixtures = async ({
  cwd,
  pack,
  packDirectory,
}: {
  cwd: string;
  pack: SkoposSkillPackManifest;
  packDirectory: string;
}): Promise<SkoposLoadedSkillFixture[]> => {
  const fixtureDirectory = join(packDirectory, 'fixtures');
  const fixtures: SkoposLoadedSkillFixture[] = [];
  for (const fixturePath of (await listFilesUnder(fixtureDirectory, ['.json'])).sort()) {
    const contents = await readTextFile(fixturePath);
    if (!contents) continue;
    const fixture = skillFixtureSchema.parse(JSON.parse(contents));
    if (fixture.packId !== pack.packId) {
      throw new Error(
        `Skill fixture ${fixture.fixtureId} belongs to ${fixture.packId}, not ${pack.packId}.`,
      );
    }
    fixtures.push({
      ...fixture,
      sourcePath: normalizeSkoposSkillCatalogPath(
        relative(cwd, fixturePath) || fixturePath,
      ),
    });
  }
  rejectDuplicateIds(fixtures.map((fixture) => fixture.fixtureId), 'skill fixture');
  const declared = [...pack.proofFixtureIds].sort();
  const discovered = fixtures.map((fixture) => fixture.fixtureId).sort();
  const undeclared = discovered.filter((fixtureId) => !declared.includes(fixtureId));
  const missing = declared.filter((fixtureId) => !discovered.includes(fixtureId));
  if (undeclared.length > 0 || missing.length > 0) {
    throw new Error(
      `Skill pack ${pack.packId} fixture declarations do not match discovered manifests.` +
        `${missing.length > 0 ? ` Missing: ${missing.join(', ')}.` : ''}` +
        `${undeclared.length > 0 ? ` Undeclared: ${undeclared.join(', ')}.` : ''}`,
    );
  }
  return fixtures;
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
    bindings.push({
      ...binding,
      sourcePath: normalizeSkoposSkillCatalogPath(
        relative(cwd, bindingPath) || bindingPath,
      ),
    });
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
        normalizeSkoposSkillCatalogPath(filePath).endsWith(
          normalizeSkoposSkillCatalogPath(suffix),
        ),
      ),
    );
  }
  return paths.sort();
};

export const normalizeSkoposSkillCatalogPath = (path: string): string =>
  path.replaceAll('\\', '/');

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
