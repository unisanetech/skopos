import { createHash } from 'node:crypto';

import {
  buildSkoposSkillContextContentDigest,
  parseSkoposSkillContextBrief,
} from '@skopos/indexer';
import type {
  SkoposSkillContextBrief,
  SkoposSkillContextGuidanceRecord,
  SkoposSkillContextLibrary,
  SkoposSkillContextProjectAuthority,
  SkoposSkillContextSuppressionReason,
} from '@skopos/model';

export const SKOPOS_SKILL_CONTEXT_SELECTION_ALGORITHM_ID =
  'skill-context-selection@1';

export interface SkoposSkillContextAdaptation {
  adaptation: string;
  deliberateDifference: string;
}

export interface SkoposSkillContextResolutionInput {
  taskId: string;
  packId: string;
  packVersion: string;
  library: SkoposSkillContextLibrary;
  selectors: Record<string, string[]>;
  taskEvidence: string[];
  projectAuthorities: SkoposSkillContextProjectAuthority[];
  projectAuthorityPrecedence?: Record<string, string>;
  negativeRecordIds?: string[];
  justifiedRecordIds?: string[];
  explicitMultipleSelectorDimensions?: string[];
  adaptations?: Record<string, SkoposSkillContextAdaptation>;
  maximumMeasuredTokens: number;
  baseMeasuredTokens: number;
  asOf: string;
  generatedAt: string;
}

interface Candidate {
  record: SkoposSkillContextGuidanceRecord;
  measuredTokens: number;
  specificity: number;
}

export const resolveSkoposSkillContextBriefRuntime = (
  input: SkoposSkillContextResolutionInput,
): SkoposSkillContextBrief => {
  assertResolutionInput(input);
  const recordTypes = new Map(
    input.library.recordTypes.map((recordType) => [recordType.typeId, recordType]),
  );
  const sourceNotes = new Map(
    input.library.sourceNotes.map((sourceNote) => [sourceNote.id, sourceNote]),
  );
  const precedence = input.projectAuthorityPrecedence ?? {};
  const negativeRecordIds = new Set(input.negativeRecordIds ?? []);
  const justifiedRecordIds = new Set(input.justifiedRecordIds ?? []);
  const explicitMultipleDimensions = new Set(
    input.explicitMultipleSelectorDimensions ?? [],
  );
  const suppressions: SkoposSkillContextBrief['suppressedRecords'] = [];
  const candidatesByType = new Map<string, Candidate[]>();
  const consumerMatches = input.library.consumerPackIds.includes(input.packId);

  for (const record of input.library.records) {
    const measuredTokens = measureRecordTokens(record);
    if (!consumerMatches) {
      suppressions.push(
        suppress(record, measuredTokens, 'consumer-boundary', 'The Library does not declare this Skill pack as a consumer.'),
      );
      continue;
    }
    if (record.freshness.state === 'retired') {
      suppressions.push(
        suppress(record, measuredTokens, 'retired', 'The record is retired and cannot enter a new Brief.'),
      );
      continue;
    }
    if (
      record.freshness.state === 'needs-review' ||
      Date.parse(record.freshness.reviewAfter) <= Date.parse(input.asOf) ||
      record.sourceNoteIds.some((sourceNoteId) => {
        const sourceNote = sourceNotes.get(sourceNoteId);
        return !sourceNote || Date.parse(sourceNote.reviewAfter) <= Date.parse(input.asOf);
      })
    ) {
      suppressions.push(
        suppress(record, measuredTokens, 'expired', 'The record or one of its Source Notes requires semantic review.'),
      );
      continue;
    }
    const authorityId = precedence[record.id];
    if (authorityId) {
      if (!input.projectAuthorities.some((authority) => authority.id === authorityId)) {
        throw new Error(
          `Skill Context precedence for ${record.id} references unknown project authority ${authorityId}.`,
        );
      }
      suppressions.push(
        suppress(record, measuredTokens, 'project-authority-precedence', `Project authority ${authorityId} supersedes this reusable record.`),
      );
      continue;
    }
    if (negativeRecordIds.has(record.id)) {
      suppressions.push(
        suppress(record, measuredTokens, 'negative-signal', 'Explicit Task evidence conflicts with this record.'),
      );
      continue;
    }
    const recordType = recordTypes.get(record.typeId);
    if (!recordType) throw new Error(`Unknown Skill Context record type ${record.typeId}.`);
    const requiresJustification = Object.entries(
      recordType.selection.justificationRequiredFacetValues ?? {},
    ).some(
      ([facet, values]) =>
        record.facets[facet] !== undefined && values.includes(record.facets[facet]!),
    );
    if (requiresJustification && !justifiedRecordIds.has(record.id)) {
      suppressions.push(
        suppress(record, measuredTokens, 'justification-required', 'This record requires explicit Task justification for its declared facet value.'),
      );
      continue;
    }
    const match = matchRecord(record, recordType.requiredSelectorDimensions, input.selectors);
    if (!match.matches) {
      suppressions.push(
        suppress(record, measuredTokens, 'irrelevant', 'Declared Task selectors do not match this record.'),
      );
      continue;
    }
    const candidates = candidatesByType.get(record.typeId) ?? [];
    candidates.push({ record, measuredTokens, specificity: match.specificity });
    candidatesByType.set(record.typeId, candidates);
  }

  const selectedCandidates: Candidate[] = [];
  let primarySelectionAmbiguous = false;
  for (const recordType of [...input.library.recordTypes]
    .filter((entry) => entry.kind !== 'source-note')
    .sort((left, right) => left.selection.priority - right.selection.priority || left.typeId.localeCompare(right.typeId))) {
    const candidates = (candidatesByType.get(recordType.typeId) ?? []).sort(
      (left, right) =>
        right.specificity - left.specificity || left.record.id.localeCompare(right.record.id),
    );
    if (candidates.length === 0) continue;
    const explicitMultiple = recordType.requiredSelectorDimensions.some(
      (dimension) =>
        explicitMultipleDimensions.has(dimension) &&
        (input.selectors[dimension]?.length ?? 0) > 1,
    );
    const implicitMultiple = recordType.requiredSelectorDimensions.some(
      (dimension) =>
        (input.selectors[dimension]?.length ?? 0) > 1 &&
        !explicitMultipleDimensions.has(dimension),
    );
    if (recordType.selection.requireExplicitMultiple && implicitMultiple) {
      primarySelectionAmbiguous = true;
      suppressions.push(
        ...candidates.map((candidate) =>
          suppress(candidate.record, candidate.measuredTokens, 'ambiguous', 'Multiple primary selectors require explicit Task evidence.'),
        ),
      );
      continue;
    }
    const maximum = explicitMultiple
      ? recordType.selection.maximumRecords
      : recordType.selection.defaultMaximumRecords;
    const boundary = candidates[maximum - 1];
    const next = candidates[maximum];
    if (
      recordType.selection.requireExplicitMultiple &&
      boundary &&
      next &&
      boundary.specificity === next.specificity
    ) {
      primarySelectionAmbiguous = true;
      suppressions.push(
        ...candidates.map((candidate) =>
          suppress(candidate.record, candidate.measuredTokens, 'ambiguous', 'Equal-strength primary matches cannot be selected safely.'),
        ),
      );
      continue;
    }
    if (recordType.kind === 'signal' && primarySelectionAmbiguous) {
      suppressions.push(
        ...candidates.map((candidate) =>
          suppress(candidate.record, candidate.measuredTokens, 'ambiguous', 'Supporting context cannot enter without an unambiguous primary selection.'),
        ),
      );
      continue;
    }
    selectedCandidates.push(...candidates.slice(0, maximum));
    suppressions.push(
      ...candidates.slice(maximum).map((candidate) =>
        suppress(candidate.record, candidate.measuredTokens, 'selection-limit', 'The record type selection limit was reached.'),
      ),
    );
  }

  let measuredTokens = input.baseMeasuredTokens;
  const acceptedCandidates: Candidate[] = [];
  for (const candidate of selectedCandidates) {
    if (measuredTokens + candidate.measuredTokens > input.maximumMeasuredTokens) {
      suppressions.push(
        suppress(candidate.record, candidate.measuredTokens, 'budget-suppressed', 'The Task-wide Skill Context token ceiling was reached.'),
      );
      continue;
    }
    measuredTokens += candidate.measuredTokens;
    acceptedCandidates.push(candidate);
  }

  const selectedSourceNoteIds = uniqueSorted(
    acceptedCandidates.flatMap(({ record }) => record.sourceNoteIds),
  );
  const selectorIdentity = {
    selectors: normalizeStringRecord(input.selectors),
    taskEvidence: uniqueSorted(input.taskEvidence),
    negativeRecordIds: uniqueSorted(input.negativeRecordIds ?? []),
    justifiedRecordIds: uniqueSorted(input.justifiedRecordIds ?? []),
    explicitMultipleSelectorDimensions: uniqueSorted(
      input.explicitMultipleSelectorDimensions ?? [],
    ),
    projectAuthorityPrecedence: normalizeStringRecord(precedence),
    maximumMeasuredTokens: input.maximumMeasuredTokens,
    baseMeasuredTokens: input.baseMeasuredTokens,
    asOf: input.asOf,
  };
  const selectorDigest = digestValue(selectorIdentity);
  const projectAuthorityDigest = digestValue(
    [...input.projectAuthorities].sort((left, right) => left.id.localeCompare(right.id)),
  );
  const identityBase = {
    algorithmId: SKOPOS_SKILL_CONTEXT_SELECTION_ALGORITHM_ID,
    libraryDigest: input.library.contentDigest,
    selectorDigest,
    projectAuthorityDigest,
  };
  const identity = {
    algorithmId: SKOPOS_SKILL_CONTEXT_SELECTION_ALGORITHM_ID,
    selectorDigest,
    projectAuthorityDigest,
    combinedDigest: digestValue(identityBase),
  };
  const brief: SkoposSkillContextBrief = {
    schemaVersion: 1,
    id: `skill-context-brief.${input.taskId}`,
    type: 'skill-context-brief',
    status: 'generated',
    authority: 'generated',
    summary: `${acceptedCandidates.length} Skill Context record${acceptedCandidates.length === 1 ? '' : 's'} selected for ${input.taskId}.`,
    generatedAt: input.generatedAt,
    taskId: input.taskId,
    packId: input.packId,
    packVersion: input.packVersion,
    libraryId: input.library.libraryId,
    libraryVersion: input.library.version,
    libraryDigest: input.library.contentDigest,
    identity,
    projectAuthorities: [...input.projectAuthorities].sort((left, right) => left.id.localeCompare(right.id)),
    selectedRecords: acceptedCandidates.map(({ record, measuredTokens }) => ({
      recordId: record.id,
      typeId: record.typeId,
      reason: 'Declared Task selectors match this active record.',
      measuredTokens,
    })),
    suppressedRecords: suppressions.sort((left, right) => left.recordId.localeCompare(right.recordId)),
    principles: acceptedCandidates.map(({ record }) => {
      const adaptation = input.adaptations?.[record.id];
      const linkedNotes = record.sourceNoteIds
        .map((sourceNoteId) => sourceNotes.get(sourceNoteId))
        .filter((sourceNote): sourceNote is NonNullable<typeof sourceNote> => Boolean(sourceNote));
      return {
        recordId: record.id,
        guidance: record.guidance,
        taskEvidence: uniqueSorted(input.taskEvidence),
        adaptation:
          adaptation?.adaptation ??
          'Apply the principle through the project-owned components, tokens, terminology, and interaction model.',
        deliberateDifference:
          adaptation?.deliberateDifference ??
          'Preserve the project identity and omit source-specific visual expression.',
        doNotCopy: uniqueSorted([
          ...(record.constraints.originality ?? []),
          ...linkedNotes.flatMap((sourceNote) => sourceNote.doNotCopy),
        ]),
      };
    }),
    unresolvedProjectContextGaps:
      input.projectAuthorities.length === 0
        ? ['No project design authority was supplied; reusable guidance cannot replace project truth.']
        : [],
    budget: {
      maximumMeasuredTokens: input.maximumMeasuredTokens,
      measuredTokens,
    },
    sourceNotes: selectedSourceNoteIds.map((id) => ({
      id,
      observedAt: sourceNotes.get(id)!.observedAt,
    })),
    contentDigest: '',
  };
  brief.contentDigest = buildSkoposSkillContextContentDigest(brief);
  return parseSkoposSkillContextBrief(brief);
};

export const renderSkoposSkillContextBriefRuntime = (
  brief: SkoposSkillContextBrief,
): string => {
  const adaptations = uniqueSorted(brief.principles.map((principle) => principle.adaptation));
  const deliberateDifferences = uniqueSorted(
    brief.principles.map((principle) => principle.deliberateDifference),
  );
  const originalityBoundaries = uniqueSorted(
    brief.principles.flatMap((principle) => principle.doNotCopy),
  );
  const lines = [
    `Context Brief ${brief.identity.combinedDigest}`,
    `Library: ${brief.libraryId}@${brief.libraryVersion} (${brief.libraryDigest})`,
    '',
    'Apply these selected principles through project-owned components, tokens, terminology, and behavior:',
  ];
  for (const principle of brief.principles) {
    lines.push(`- ${principle.guidance}`);
  }
  if (adaptations.length > 0) {
    lines.push('', `Project adaptation: ${adaptations.join(' ')}`);
  }
  if (deliberateDifferences.length > 0) {
    lines.push(`Deliberate difference: ${deliberateDifferences.join(' ')}`);
  }
  if (originalityBoundaries.length > 0) {
    lines.push(`Do not copy: ${originalityBoundaries.join('; ')}`);
  }
  if (brief.unresolvedProjectContextGaps.length > 0) {
    lines.push(
      '',
      'Unresolved project context:',
      ...brief.unresolvedProjectContextGaps.map((gap) => `- ${gap}`),
    );
  }
  lines.push(
    '',
    `Budget: ${brief.budget.measuredTokens}/${brief.budget.maximumMeasuredTokens} measured tokens including base Skill context.`,
  );
  return lines.join('\n');
};

const assertResolutionInput = (input: SkoposSkillContextResolutionInput): void => {
  if (input.baseMeasuredTokens > input.maximumMeasuredTokens) {
    throw new Error('Base Skill context already exceeds the Task-wide token ceiling.');
  }
  if (input.taskEvidence.length === 0) {
    throw new Error('Skill Context resolution requires explicit Task evidence.');
  }
  if (Number.isNaN(Date.parse(input.asOf)) || Number.isNaN(Date.parse(input.generatedAt))) {
    throw new Error('Skill Context resolution requires valid asOf and generatedAt dates.');
  }
};

const matchRecord = (
  record: SkoposSkillContextGuidanceRecord,
  requiredDimensions: string[],
  selectors: Record<string, string[]>,
): { matches: boolean; specificity: number } => {
  let specificity = 0;
  for (const dimension of requiredDimensions) {
    const taskValues = selectors[dimension] ?? [];
    const recordValues = record.applicability.selectors[dimension] ?? [];
    if (taskValues.length === 0 || !taskValues.some((value) => recordValues.includes(value))) {
      return { matches: false, specificity: 0 };
    }
  }
  for (const [dimension, taskValues] of Object.entries(selectors)) {
    const recordValues = record.applicability.selectors[dimension];
    if (!recordValues) continue;
    if (!taskValues.some((value) => recordValues.includes(value))) {
      return { matches: false, specificity: 0 };
    }
    specificity += 1;
  }
  return { matches: specificity > 0, specificity };
};

const suppress = (
  record: SkoposSkillContextGuidanceRecord,
  measuredTokens: number,
  reasonCode: SkoposSkillContextSuppressionReason,
  reason: string,
): SkoposSkillContextBrief['suppressedRecords'][number] => ({
  recordId: record.id,
  typeId: record.typeId,
  reason,
  reasonCode,
  measuredTokens,
});

const measureRecordTokens = (record: SkoposSkillContextGuidanceRecord): number =>
  Math.ceil(
    [
      record.title,
      record.purpose,
      record.problem,
      record.guidance,
      ...record.failureModes,
      ...Object.values(record.constraints).flat(),
    ].join('\n').length / 4,
  );

const digestValue = (value: unknown): string =>
  `sha256:${createHash('sha256').update(stableSerialize(value)).digest('hex')}`;

const normalizeStringRecord = (
  value: Record<string, string> | Record<string, string[]>,
): Record<string, string | string[]> =>
  Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, Array.isArray(entry) ? uniqueSorted(entry) : entry]),
  );

const uniqueSorted = (values: string[]): string[] => [...new Set(values)].sort();

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
