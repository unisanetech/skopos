import { createHash } from 'node:crypto';
import { isAbsolute, relative, resolve, sep } from 'node:path';

import type {
  SkoposSkillContextBrief,
  SkoposSkillContextContractFixture,
  SkoposSkillContextGuidanceRecord,
  SkoposSkillContextLibrary,
} from '@skopos/model';
import { z } from 'zod';

import { readTextFile } from '../../adapters/workspace-filesystem.adapter.js';

const nonEmptyString = z.string().min(1);
const digestSchema = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const dateSchema = nonEmptyString.refine(
  (value) => !Number.isNaN(Date.parse(value)),
  'Expected an ISO-compatible date.',
);
const recordKindSchema = z.enum(['guide', 'signal', 'source-note']);
const recordStateSchema = z.enum(['active', 'needs-review', 'retired']);
const suppressionReasonSchema = z.enum([
  'irrelevant',
  'ambiguous',
  'negative-signal',
  'project-authority-precedence',
  'expired',
  'retired',
  'budget-suppressed',
  'selection-limit',
  'justification-required',
  'consumer-boundary',
]);

const recordTypeSchema = z
  .object({
    typeId: nonEmptyString,
    kind: recordKindSchema,
    displayName: nonEmptyString,
    selection: z
      .object({
        priority: z.number().int().nonnegative(),
        defaultMaximumRecords: z.number().int().positive(),
        maximumRecords: z.number().int().positive(),
        requireExplicitMultiple: z.boolean(),
        justificationRequiredFacetValues: z
          .record(nonEmptyString, z.array(nonEmptyString).min(1))
          .optional(),
      })
      .strict()
      .refine(
        (selection) => selection.defaultMaximumRecords <= selection.maximumRecords,
        'defaultMaximumRecords must not exceed maximumRecords.',
      ),
    requiredSelectorDimensions: z.array(nonEmptyString),
    requiredConstraintKinds: z.array(nonEmptyString),
    allowedFacetValues: z.record(nonEmptyString, z.array(nonEmptyString).min(1)),
  })
  .strict()
  .superRefine((recordType, context) => {
    collectDuplicateValues(
      recordType.requiredSelectorDimensions,
      `${recordType.typeId} selector dimension`,
      context,
    );
    collectDuplicateValues(
      recordType.requiredConstraintKinds,
      `${recordType.typeId} constraint kind`,
      context,
    );
  });

const applicabilitySchema = z
  .object({
    selectors: z.record(nonEmptyString, z.array(nonEmptyString).min(1)),
    positiveSignals: z.array(nonEmptyString).min(1),
    negativeSignals: z.array(nonEmptyString).min(1),
  })
  .strict()
  .superRefine((applicability, context) => {
    if (Object.keys(applicability.selectors).length === 0) {
      addIssue(context, 'Skill Context applicability requires at least one selector.');
    }
    for (const [dimension, values] of Object.entries(applicability.selectors)) {
      collectDuplicateValues(values, `selector ${dimension}`, context);
    }
  });

const freshnessSchema = z
  .object({
    state: recordStateSchema,
    createdAt: dateSchema,
    reviewedAt: dateSchema,
    reviewAfter: dateSchema,
  })
  .strict()
  .superRefine((freshness, context) => {
    if (Date.parse(freshness.createdAt) > Date.parse(freshness.reviewedAt)) {
      addIssue(context, 'Freshness reviewedAt must not precede createdAt.');
    }
    if (Date.parse(freshness.reviewedAt) >= Date.parse(freshness.reviewAfter)) {
      addIssue(context, 'Freshness reviewAfter must be later than reviewedAt.');
    }
  });

const guidanceRecordSchema = z
  .object({
    id: nonEmptyString,
    kind: z.enum(['guide', 'signal']),
    typeId: nonEmptyString,
    title: nonEmptyString,
    purpose: nonEmptyString,
    applicability: applicabilitySchema,
    problem: nonEmptyString,
    guidance: nonEmptyString,
    failureModes: z.array(nonEmptyString).min(1),
    constraints: z.record(nonEmptyString, z.array(nonEmptyString).min(1)),
    operationalCost: nonEmptyString.optional(),
    sourceNoteIds: z.array(nonEmptyString).min(1),
    facets: z.record(nonEmptyString, nonEmptyString),
    freshness: freshnessSchema,
    contentDigest: digestSchema,
  })
  .strict()
  .superRefine((record, context) => {
    collectDuplicateValues(record.sourceNoteIds, `${record.id} Source Note`, context);
    collectDuplicateValues(record.failureModes, `${record.id} failure mode`, context);
  });

const sourceNoteSchema = z
  .object({
    id: nonEmptyString,
    kind: z.literal('source-note'),
    typeId: nonEmptyString,
    title: nonEmptyString,
    sourceOwner: nonEmptyString,
    sourceType: z.enum([
      'normative-standard',
      'official-documentation',
      'official-design-system',
      'platform-guidance',
      'official-product',
      'primary-research',
      'supporting-research',
      'project-authority',
    ]),
    officialUrl: z.string().url().optional(),
    projectPath: nonEmptyString.optional(),
    relevantSurface: nonEmptyString,
    observation: nonEmptyString,
    transferRationale: nonEmptyString,
    doNotCopy: z.array(nonEmptyString).min(1),
    limitations: z.array(nonEmptyString).min(1),
    licenseOrAssetRestrictions: nonEmptyString,
    observedAt: dateSchema,
    reviewAfter: dateSchema,
    contentDigest: digestSchema,
  })
  .strict()
  .superRefine((sourceNote, context) => {
    if (!sourceNote.officialUrl && !sourceNote.projectPath) {
      addIssue(
        context,
        `Source Note ${sourceNote.id} requires an officialUrl or projectPath.`,
      );
    }
    if (Date.parse(sourceNote.observedAt) >= Date.parse(sourceNote.reviewAfter)) {
      addIssue(
        context,
        `Source Note ${sourceNote.id} reviewAfter must be later than observedAt.`,
      );
    }
  });

const librarySchema = z
  .object({
    schemaVersion: z.literal(1),
    id: nonEmptyString,
    type: z.literal('skill-context-library'),
    status: z.literal('active'),
    authority: z.literal('canonical'),
    summary: nonEmptyString,
    updatedAt: dateSchema,
    libraryId: nonEmptyString,
    namespace: nonEmptyString,
    version: nonEmptyString.regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/),
    consumerPackIds: z.array(nonEmptyString).min(1),
    recordTypes: z.array(recordTypeSchema).min(1),
    records: z.array(guidanceRecordSchema),
    sourceNotes: z.array(sourceNoteSchema).min(1),
    contentDigest: digestSchema,
  })
  .strict()
  .superRefine((library, context) => validateLibraryRelationships(library, context));

const briefRecordDecisionShape = {
  recordId: nonEmptyString,
  typeId: nonEmptyString,
  reason: nonEmptyString,
  measuredTokens: z.number().int().nonnegative(),
};

const briefSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: nonEmptyString,
    type: z.literal('skill-context-brief'),
    status: z.literal('generated'),
    authority: z.literal('generated'),
    summary: nonEmptyString,
    generatedAt: dateSchema,
    taskId: nonEmptyString,
    packId: nonEmptyString,
    packVersion: nonEmptyString,
    libraryId: nonEmptyString,
    libraryVersion: nonEmptyString,
    libraryDigest: digestSchema,
    identity: z
      .object({
        algorithmId: nonEmptyString,
        selectorDigest: digestSchema,
        projectAuthorityDigest: digestSchema,
        combinedDigest: digestSchema,
      })
      .strict(),
    projectAuthorities: z.array(
      z
        .object({
          id: nonEmptyString,
          role: nonEmptyString,
          sourcePaths: z.array(nonEmptyString).min(1),
          sourceDigest: digestSchema,
          summary: nonEmptyString,
        })
        .strict(),
    ),
    selectedRecords: z.array(z.object(briefRecordDecisionShape).strict()),
    suppressedRecords: z.array(
      z
        .object({ ...briefRecordDecisionShape, reasonCode: suppressionReasonSchema })
        .strict(),
    ),
    principles: z.array(
      z
        .object({
          recordId: nonEmptyString,
          guidance: nonEmptyString,
          taskEvidence: z.array(nonEmptyString).min(1),
          adaptation: nonEmptyString,
          deliberateDifference: nonEmptyString,
          doNotCopy: z.array(nonEmptyString).min(1),
        })
        .strict(),
    ),
    unresolvedProjectContextGaps: z.array(nonEmptyString),
    budget: z
      .object({
        maximumMeasuredTokens: z.number().int().nonnegative(),
        measuredTokens: z.number().int().nonnegative(),
      })
      .strict(),
    sourceNotes: z.array(
      z.object({ id: nonEmptyString, observedAt: dateSchema }).strict(),
    ),
    contentDigest: digestSchema,
  })
  .strict()
  .superRefine((brief, context) => {
    if (brief.budget.measuredTokens > brief.budget.maximumMeasuredTokens) {
      addIssue(context, 'Skill Context Brief exceeds its Task-wide token allowance.');
    }
    collectDuplicateValues(
      brief.projectAuthorities.map((entry) => entry.id),
      'project authority',
      context,
    );
    collectDuplicateValues(
      brief.selectedRecords.map((entry) => entry.recordId),
      'selected record',
      context,
    );
    collectDuplicateValues(
      brief.suppressedRecords.map((entry) => entry.recordId),
      'suppressed record',
      context,
    );
    const selectedIds = new Set(brief.selectedRecords.map((entry) => entry.recordId));
    for (const suppressed of brief.suppressedRecords) {
      if (selectedIds.has(suppressed.recordId)) {
        addIssue(
          context,
          `Skill Context Brief cannot both select and suppress ${suppressed.recordId}.`,
        );
      }
    }
  });

const fixtureCaseSchema = z
  .object({
    caseId: nonEmptyString,
    category: z.enum([
      'positive',
      'negative',
      'ambiguous',
      'expired',
      'retired',
      'multi-selector',
      'budget',
    ]),
    task: z
      .object({
        goal: nonEmptyString,
        selectors: z.record(nonEmptyString, z.array(nonEmptyString).min(1)),
        projectAuthorityIds: z.array(nonEmptyString),
        maximumMeasuredTokens: z.number().int().nonnegative(),
        asOf: dateSchema,
      })
      .strict(),
    expectation: z
      .object({
        selectedRecordIds: z.array(nonEmptyString),
        suppressedRecordReasonCodes: z.record(
          nonEmptyString,
          suppressionReasonSchema,
        ),
      })
      .strict(),
  })
  .strict();

const contractFixtureSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: nonEmptyString,
    type: z.literal('skill-context-contract-fixture'),
    status: z.literal('active'),
    authority: z.literal('supporting'),
    summary: nonEmptyString,
    updatedAt: dateSchema,
    fixtureId: nonEmptyString,
    library: librarySchema,
    cases: z.array(fixtureCaseSchema).min(1),
  })
  .strict()
  .superRefine((fixture, context) => {
    if (fixture.id !== `skill-context-contract-fixture.${fixture.fixtureId}`) {
      addIssue(
        context,
        `Fixture ${fixture.fixtureId} id must be skill-context-contract-fixture.${fixture.fixtureId}.`,
      );
    }
    collectDuplicateValues(
      fixture.cases.map((entry) => entry.caseId),
      'Skill Context fixture case',
      context,
    );
    const categories = new Set(fixture.cases.map((entry) => entry.category));
    for (const category of [
      'positive',
      'negative',
      'ambiguous',
      'expired',
      'retired',
      'multi-selector',
      'budget',
    ] as const) {
      if (!categories.has(category)) {
        addIssue(context, `Skill Context contract fixture is missing ${category}.`);
      }
    }
    const knownRecordIds = new Set(fixture.library.records.map((record) => record.id));
    for (const fixtureCase of fixture.cases) {
      collectDuplicateValues(
        fixtureCase.expectation.selectedRecordIds,
        `${fixtureCase.caseId} selected record`,
        context,
      );
      for (const recordId of [
        ...fixtureCase.expectation.selectedRecordIds,
        ...Object.keys(fixtureCase.expectation.suppressedRecordReasonCodes),
      ]) {
        if (!knownRecordIds.has(recordId)) {
          addIssue(
            context,
            `Fixture case ${fixtureCase.caseId} references unknown record ${recordId}.`,
          );
        }
      }
    }
  });

export interface SkoposLoadedSkillContextLibrary
  extends SkoposSkillContextLibrary {
  sourcePath: string;
}

export const buildSkoposSkillContextContentDigest = (value: unknown): string =>
  `sha256:${createHash('sha256').update(stableSerialize(withoutContentDigest(value))).digest('hex')}`;

export const parseSkoposSkillContextLibrary = (
  input: unknown,
): SkoposSkillContextLibrary => {
  const library = librarySchema.parse(input) as SkoposSkillContextLibrary;
  validateLibraryContentDigests(library);
  return library;
};

export const parseSkoposSkillContextBrief = (
  input: unknown,
): SkoposSkillContextBrief => {
  const brief = briefSchema.parse(input) as SkoposSkillContextBrief;
  assertContentDigest('Skill Context Brief', brief);
  return brief;
};

export const parseSkoposSkillContextContractFixture = (
  input: unknown,
): SkoposSkillContextContractFixture => {
  const fixture = contractFixtureSchema.parse(
    input,
  ) as SkoposSkillContextContractFixture;
  parseSkoposSkillContextLibrary(fixture.library);
  return fixture;
};

export const loadSkoposSkillContextLibrary = async ({
  cwd,
  sourcePath,
}: {
  cwd: string;
  sourcePath?: string;
}): Promise<SkoposLoadedSkillContextLibrary | undefined> => {
  if (!sourcePath) return undefined;
  const workspaceRoot = resolve(cwd);
  const absolutePath = isAbsolute(sourcePath)
    ? resolve(sourcePath)
    : resolve(workspaceRoot, sourcePath);
  const workspaceRelativePath = relative(workspaceRoot, absolutePath);
  if (
    workspaceRelativePath === '..' ||
    workspaceRelativePath.startsWith(`..${sep}`)
  ) {
    throw new Error(`Skill Context Library path escapes the workspace: ${sourcePath}.`);
  }
  const contents = await readTextFile(absolutePath);
  if (!contents) {
    throw new Error(`Skill Context Library source is missing: ${sourcePath}.`);
  }
  return {
    ...parseSkoposSkillContextLibrary(JSON.parse(contents)),
    sourcePath: workspaceRelativePath || sourcePath,
  };
};

const validateLibraryRelationships = (
  library: z.infer<typeof librarySchema>,
  context: z.RefinementCtx,
): void => {
  if (library.id !== `skill-context-library.${library.libraryId}`) {
    addIssue(
      context,
      `Library ${library.libraryId} id must be skill-context-library.${library.libraryId}.`,
    );
  }
  collectDuplicateValues(library.consumerPackIds, 'consumer pack', context);
  collectDuplicateValues(
    library.recordTypes.map((recordType) => recordType.typeId),
    'record type',
    context,
  );
  collectDuplicateValues(
    [...library.records, ...library.sourceNotes].map((record) => record.id),
    'Skill Context record',
    context,
  );
  const recordTypes = new Map(
    library.recordTypes.map((recordType) => [recordType.typeId, recordType]),
  );
  const sourceNoteIds = new Set(library.sourceNotes.map((sourceNote) => sourceNote.id));
  for (const record of [...library.records, ...library.sourceNotes]) {
    const recordType = recordTypes.get(record.typeId);
    if (!recordType) {
      addIssue(context, `Skill Context record ${record.id} has unknown type ${record.typeId}.`);
      continue;
    }
    if (record.kind !== recordType.kind) {
      addIssue(
        context,
        `Skill Context record ${record.id} kind ${record.kind} does not match ${record.typeId}.`,
      );
    }
    if (!record.typeId.startsWith(`${library.namespace}.`)) {
      addIssue(
        context,
        `Skill Context record ${record.id} type ${record.typeId} is outside namespace ${library.namespace}.`,
      );
    }
    if (!record.id.startsWith(`${record.typeId}.`)) {
      addIssue(
        context,
        `Skill Context record ${record.id} must be namespaced by type ${record.typeId}.`,
      );
    }
    if (record.kind === 'source-note') continue;
    validateRecordTypeRequirements(record, recordType, context);
    for (const sourceNoteId of record.sourceNoteIds) {
      if (!sourceNoteIds.has(sourceNoteId)) {
        addIssue(
          context,
          `Skill Context record ${record.id} references unknown Source Note ${sourceNoteId}.`,
        );
      }
    }
  }
};

const validateRecordTypeRequirements = (
  record: SkoposSkillContextGuidanceRecord,
  recordType: z.infer<typeof recordTypeSchema>,
  context: z.RefinementCtx,
): void => {
  for (const dimension of recordType.requiredSelectorDimensions) {
    if (!record.applicability.selectors[dimension]?.length) {
      addIssue(
        context,
        `Skill Context record ${record.id} requires selector dimension ${dimension}.`,
      );
    }
  }
  for (const constraintKind of recordType.requiredConstraintKinds) {
    if (!record.constraints[constraintKind]?.length) {
      addIssue(
        context,
        `Skill Context record ${record.id} requires constraint ${constraintKind}.`,
      );
    }
  }
  for (const [facet, value] of Object.entries(record.facets)) {
    const allowedValues = recordType.allowedFacetValues[facet];
    if (!allowedValues) {
      addIssue(
        context,
        `Skill Context record ${record.id} uses undeclared facet ${facet}.`,
      );
    } else if (!allowedValues.includes(value)) {
      addIssue(
        context,
        `Skill Context record ${record.id} facet ${facet} has unsupported value ${value}.`,
      );
    }
  }
  for (const requiredFacet of Object.keys(recordType.allowedFacetValues)) {
    if (!record.facets[requiredFacet]) {
      addIssue(
        context,
        `Skill Context record ${record.id} requires facet ${requiredFacet}.`,
      );
    }
  }
};

const validateLibraryContentDigests = (library: SkoposSkillContextLibrary): void => {
  for (const record of [...library.records, ...library.sourceNotes]) {
    assertContentDigest(`Skill Context record ${record.id}`, record);
  }
  assertContentDigest(`Skill Context Library ${library.libraryId}`, library);
};

const assertContentDigest = (
  label: string,
  value: { contentDigest: string },
): void => {
  const expected = buildSkoposSkillContextContentDigest(value);
  if (value.contentDigest !== expected) {
    throw new Error(
      `${label} contentDigest is inconsistent. Expected ${expected}, received ${value.contentDigest}.`,
    );
  }
};

const withoutContentDigest = (value: unknown): unknown => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const { contentDigest: _contentDigest, ...remaining } = value as Record<string, unknown>;
  return remaining;
};

const stableSerialize = (value: unknown): string => JSON.stringify(sortValue(value));

const sortValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortValue(entry)]),
  );
};

const collectDuplicateValues = (
  values: string[],
  label: string,
  context: z.RefinementCtx,
): void => {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) addIssue(context, `Duplicate ${label}: ${value}.`);
    seen.add(value);
  }
};

const addIssue = (context: z.RefinementCtx, message: string): void => {
  context.addIssue({ code: 'custom', message });
};
