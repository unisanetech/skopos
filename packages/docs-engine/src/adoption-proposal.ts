import { createHash } from 'node:crypto';
import { access } from 'node:fs/promises';
import { isAbsolute, join, posix } from 'node:path';

import type {
  SkoposAdoptionExecutionInput,
  SkoposAdoptionAnalysisClaim,
  SkoposAdoptionDocumentDisposition,
  SkoposAdoptionDocumentOperationKind,
  SkoposAdoptionIntakeArtifact,
  SkoposAdoptionMaterialQuestion,
  SkoposAdoptionRestructuringProposalArtifact,
  SkoposAdoptionReviewedAnalysisArtifact,
  SkoposAdoptionReviewedAnalysisInput,
} from '@skopos/model';

export const SKOPOS_ADOPTION_ANALYSIS_PATH = '.skopos/adoption/reviewed-analysis.json';
export const SKOPOS_ADOPTION_PROPOSAL_PATH = '.skopos/adoption/restructuring-proposal.json';
export const SKOPOS_ADOPTION_APPROVAL_PATH = '.skopos/adoption/proposal-approval.json';
export const SKOPOS_ADOPTION_EXECUTION_BRIEF_PATH =
  '.skopos/adoption/execution-brief.json';
export const SKOPOS_ADOPTION_VERIFICATION_PATH =
  '.skopos/adoption/standard-verification.json';
export const SKOPOS_ADOPTION_ACTIVATION_PATH =
  '.skopos/adoption/activation.json';

export interface BuildSkoposAdoptionProposalOptions {
  workspaceRoot: string;
  generatedAt: string;
  actorId: string;
  intake: SkoposAdoptionIntakeArtifact;
  input: unknown;
}

export interface SkoposAdoptionProposalArtifacts {
  analysis: SkoposAdoptionReviewedAnalysisArtifact;
  proposal?: SkoposAdoptionRestructuringProposalArtifact;
}

export const buildSkoposAdoptionProposal = async ({
  workspaceRoot,
  generatedAt,
  actorId,
  intake,
  input: unknownInput,
}: BuildSkoposAdoptionProposalOptions): Promise<SkoposAdoptionProposalArtifacts> => {
  const input = parseSkoposAdoptionReviewedAnalysisInput(unknownInput);

  if (input.intakeDigest !== intake.inputDigest) {
    throw new Error(
      'Setup analysis is stale because its project evidence changed. Run `skopos setup . --actor <id>` and review the refreshed recommendations.',
    );
  }

  assertUniqueIds(input.claims, 'claim');
  assertUniqueIds(input.materialQuestions, 'material question');
  assertUniqueIds(input.documentDispositions, 'document disposition');
  await assertEvidencePathsExist({
    workspaceRoot,
    claims: input.claims,
    materialQuestions: input.materialQuestions,
  });
  assertClaimsAreGrounded(input.claims);
  validateDispositions({
    intake,
    dispositions: input.documentDispositions,
    requireCompleteCoverage: input.materialQuestions.length === 0,
  });

  const adoptionState =
    input.materialQuestions.length > 0
      ? 'questions-open' as const
      : 'restructuring-proposed' as const;
  const analysis: SkoposAdoptionReviewedAnalysisArtifact = {
    schemaVersion: 1,
    id: 'adoption-reviewed-analysis',
    type: 'adoption-reviewed-analysis',
    status: 'active',
    authority: 'supporting',
    summary:
      adoptionState === 'questions-open'
        ? `Agent review recorded with ${input.materialQuestions.length} material question${input.materialQuestions.length === 1 ? '' : 's'} still open.`
        : 'Agent review recorded and a restructuring proposal can be generated.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    intakeDigest: intake.inputDigest,
    adoptionState,
    reviewedByActorId: actorId,
    reviewedAt: generatedAt,
    claims: input.claims,
    materialQuestions: input.materialQuestions,
    documentDispositions: input.documentDispositions,
  };

  if (adoptionState === 'questions-open') {
    return { analysis };
  }

  const operations = [...input.documentDispositions].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  const proposalContent = {
    intakeDigest: intake.inputDigest,
    operations,
    targetTree: buildTargetTree(intake, operations),
  };
  const proposalDigest = createHash('sha256')
    .update(JSON.stringify(proposalContent))
    .digest('hex');
  const proposal: SkoposAdoptionRestructuringProposalArtifact = {
    schemaVersion: 1,
    id: 'adoption-restructuring-proposal',
    type: 'adoption-restructuring-proposal',
    status: 'draft',
    authority: 'supporting',
    summary: `Approval-required restructuring proposal with ${operations.length} operation${operations.length === 1 ? '' : 's'}.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    intakeDigest: intake.inputDigest,
    proposalDigest,
    adoptionState: 'restructuring-proposed',
    approval: 'pending',
    requiresApproval: true,
    operations,
    targetTree: proposalContent.targetTree,
    linkImpact: operations
      .filter((operation) => operation.linkImpact.length > 0)
      .map((operation) => ({
        operationId: operation.id,
        references: [...operation.linkImpact].sort(),
      })),
    authorityImpact: operations.map((operation) => ({
      operationId: operation.id,
      summary: operation.authorityImpact,
    })),
    informationLossRisks: operations
      .filter((operation) => operation.informationLossRisk !== 'none')
      .map((operation) => ({
        operationId: operation.id,
        risk: operation.informationLossRisk as 'low' | 'material',
        retainedTruth: operation.retainedTruth,
      })),
  };

  return { analysis, proposal };
};

export const parseSkoposAdoptionReviewedAnalysisInput = (
  value: unknown,
): SkoposAdoptionReviewedAnalysisInput => {
  const record = asRecord(value, 'Adoption analysis input');
  if (record.schemaVersion !== 1) {
    throw new Error('Adoption analysis schemaVersion must be 1.');
  }

  return {
    schemaVersion: 1,
    intakeDigest: requiredString(record.intakeDigest, 'intakeDigest'),
    claims: requiredArray(record.claims, 'claims').map(parseClaim),
    materialQuestions: requiredArray(
      record.materialQuestions,
      'materialQuestions',
    ).map(parseMaterialQuestion),
    documentDispositions: requiredArray(
      record.documentDispositions,
      'documentDispositions',
    ).map(parseDisposition),
  };
};

export const parseSkoposAdoptionExecutionInput = (
  value: unknown,
): SkoposAdoptionExecutionInput => {
  const record = asRecord(value, 'Adoption execution input');
  if (record.schemaVersion !== 1) {
    throw new Error('Adoption execution schemaVersion must be 1.');
  }
  const operations = requiredArray(record.operations, 'operations').map(
    (entry, index) => {
      const operation = asRecord(entry, `operations[${index}]`);
      if (operation.retainedTruthVerified !== true) {
        throw new Error(
          `operations[${index}].retainedTruthVerified must be true after agent review.`,
        );
      }
      return {
        operationId: requiredString(
          operation.operationId,
          `operations[${index}].operationId`,
        ),
        resultPaths: requiredArray(
          operation.resultPaths,
          `operations[${index}].resultPaths`,
        ).map((path, pathIndex) =>
          normalizeProjectPath(
            requiredString(path, `operations[${index}].resultPaths[${pathIndex}]`),
            `operations[${index}].resultPaths[${pathIndex}]`,
          ),
        ),
        summary: requiredString(operation.summary, `operations[${index}].summary`),
        retainedTruthVerified: true as const,
      };
    },
  );
  const duplicateOperationId = findDuplicate(
    operations.map((operation) => operation.operationId),
  );
  if (duplicateOperationId) {
    throw new Error(
      `Execution evidence includes operation ${duplicateOperationId} more than once.`,
    );
  }
  return {
    schemaVersion: 1,
    proposalDigest: requiredString(record.proposalDigest, 'proposalDigest'),
    operations,
  };
};

const parseClaim = (value: unknown, index: number): SkoposAdoptionAnalysisClaim => {
  const record = asRecord(value, `claims[${index}]`);
  const kind = requiredString(record.kind, `claims[${index}].kind`);
  const confidence = requiredString(
    record.confidence,
    `claims[${index}].confidence`,
  );

  if (!['fact', 'inference', 'assumption', 'contradiction'].includes(kind)) {
    throw new Error(`claims[${index}].kind is invalid: ${kind}`);
  }
  if (!['low', 'medium', 'high'].includes(confidence)) {
    throw new Error(`claims[${index}].confidence is invalid: ${confidence}`);
  }

  return {
    id: requiredString(record.id, `claims[${index}].id`),
    kind: kind as SkoposAdoptionAnalysisClaim['kind'],
    summary: requiredString(record.summary, `claims[${index}].summary`),
    evidencePaths: stringArray(record.evidencePaths, `claims[${index}].evidencePaths`),
    confidence: confidence as SkoposAdoptionAnalysisClaim['confidence'],
  };
};

const parseMaterialQuestion = (
  value: unknown,
  index: number,
): SkoposAdoptionMaterialQuestion => {
  const record = asRecord(value, `materialQuestions[${index}]`);
  if (record.material !== true) {
    throw new Error(`materialQuestions[${index}].material must be true.`);
  }
  const options = requiredArray(
    record.options,
    `materialQuestions[${index}].options`,
  ).map((option, optionIndex) => {
    const optionRecord = asRecord(
      option,
      `materialQuestions[${index}].options[${optionIndex}]`,
    );
    return {
      id: requiredString(
        optionRecord.id,
        `materialQuestions[${index}].options[${optionIndex}].id`,
      ),
      label: requiredString(
        optionRecord.label,
        `materialQuestions[${index}].options[${optionIndex}].label`,
      ),
      rationale: requiredString(
        optionRecord.rationale,
        `materialQuestions[${index}].options[${optionIndex}].rationale`,
      ),
    };
  });
  const recommendedOptionId = requiredString(
    record.recommendedOptionId,
    `materialQuestions[${index}].recommendedOptionId`,
  );
  if (!options.some((option) => option.id === recommendedOptionId)) {
    throw new Error(
      `materialQuestions[${index}].recommendedOptionId must match one option.`,
    );
  }

  return {
    id: requiredString(record.id, `materialQuestions[${index}].id`),
    question: requiredString(
      record.question,
      `materialQuestions[${index}].question`,
    ),
    whyItMatters: requiredString(
      record.whyItMatters,
      `materialQuestions[${index}].whyItMatters`,
    ),
    evidencePaths: stringArray(
      record.evidencePaths,
      `materialQuestions[${index}].evidencePaths`,
    ),
    material: true,
    recommendedOptionId,
    options,
    whatHappensAfterAnswer: requiredString(
      record.whatHappensAfterAnswer,
      `materialQuestions[${index}].whatHappensAfterAnswer`,
    ),
  };
};

const parseDisposition = (
  value: unknown,
  index: number,
): SkoposAdoptionDocumentDisposition => {
  const record = asRecord(value, `documentDispositions[${index}]`);
  const operation = requiredString(
    record.operation,
    `documentDispositions[${index}].operation`,
  );
  const informationLossRisk = requiredString(
    record.informationLossRisk,
    `documentDispositions[${index}].informationLossRisk`,
  );

  if (!DOCUMENT_OPERATION_KINDS.includes(operation as SkoposAdoptionDocumentOperationKind)) {
    throw new Error(`documentDispositions[${index}].operation is invalid: ${operation}`);
  }
  if (!['none', 'low', 'material'].includes(informationLossRisk)) {
    throw new Error(
      `documentDispositions[${index}].informationLossRisk is invalid: ${informationLossRisk}`,
    );
  }

  return {
    id: requiredString(record.id, `documentDispositions[${index}].id`),
    operation: operation as SkoposAdoptionDocumentOperationKind,
    sourcePaths: stringArray(
      record.sourcePaths,
      `documentDispositions[${index}].sourcePaths`,
    ),
    targetPaths: stringArray(
      record.targetPaths,
      `documentDispositions[${index}].targetPaths`,
    ),
    rationale: requiredString(
      record.rationale,
      `documentDispositions[${index}].rationale`,
    ),
    retainedTruth: requiredString(
      record.retainedTruth,
      `documentDispositions[${index}].retainedTruth`,
    ),
    informationLossRisk: informationLossRisk as SkoposAdoptionDocumentDisposition['informationLossRisk'],
    linkImpact: stringArray(
      record.linkImpact,
      `documentDispositions[${index}].linkImpact`,
    ),
    authorityImpact: requiredString(
      record.authorityImpact,
      `documentDispositions[${index}].authorityImpact`,
    ),
  };
};

const validateDispositions = ({
  intake,
  dispositions,
  requireCompleteCoverage,
}: {
  intake: SkoposAdoptionIntakeArtifact;
  dispositions: SkoposAdoptionDocumentDisposition[];
  requireCompleteCoverage: boolean;
}): void => {
  const candidates = new Set(
    intake.documents.map((document) => document.path),
  );
  const ownedSources = new Set<string>();
  const ownedTargets = new Set<string>();

  for (const disposition of dispositions) {
    if (disposition.sourcePaths.length === 0) {
      throw new Error(`Disposition ${disposition.id} must own at least one source path.`);
    }

    for (const sourcePath of disposition.sourcePaths) {
      assertProjectRelativePath(sourcePath, `Disposition ${disposition.id} source`);
      if (!candidates.has(sourcePath)) {
        throw new Error(
          `Disposition ${disposition.id} references unknown or non-current document source: ${sourcePath}`,
        );
      }
      if (ownedSources.has(sourcePath)) {
        throw new Error(`Document source is owned by more than one disposition: ${sourcePath}`);
      }
      ownedSources.add(sourcePath);
    }

    validateOperationShape(disposition);
    for (const targetPath of disposition.targetPaths) {
      assertProjectRelativePath(targetPath, `Disposition ${disposition.id} target`);
      if (disposition.operation !== 'keep' && disposition.operation !== 'rewrite') {
        assertInsideMemoryRoot(targetPath, intake);
      }
      if (ownedTargets.has(targetPath)) {
        throw new Error(`Document target is produced by more than one disposition: ${targetPath}`);
      }
      ownedTargets.add(targetPath);
    }

    if (
      disposition.operation === 'delete' &&
      disposition.informationLossRisk === 'none'
    ) {
      throw new Error(
        `Delete disposition ${disposition.id} must declare low or material information-loss risk.`,
      );
    }
  }

  if (requireCompleteCoverage) {
    const missing = [...candidates].filter((path) => !ownedSources.has(path)).sort();
    if (missing.length > 0) {
      throw new Error(
        `Restructuring proposal does not classify ${missing.length} current document${missing.length === 1 ? '' : 's'}: ${missing.join(', ')}`,
      );
    }
  }
};

const validateOperationShape = (
  disposition: SkoposAdoptionDocumentDisposition,
): void => {
  const sources = disposition.sourcePaths.length;
  const targets = disposition.targetPaths.length;
  const invalid = (expected: string): never => {
    throw new Error(
      `Disposition ${disposition.id} (${disposition.operation}) requires ${expected}; received ${sources} source(s) and ${targets} target(s).`,
    );
  };

  switch (disposition.operation) {
    case 'keep':
      if (targets !== 0) invalid('one or more sources and no explicit targets');
      return;
    case 'move':
    case 'rewrite':
    case 'archive':
      if (sources !== 1 || targets !== 1) invalid('exactly one source and one target');
      if (
        disposition.operation === 'rewrite' &&
        disposition.sourcePaths[0] !== disposition.targetPaths[0]
      ) {
        invalid('rewrite target to equal its source');
      }
      return;
    case 'merge':
      if (sources < 2 || targets !== 1) invalid('at least two sources and one target');
      return;
    case 'split':
      if (sources !== 1 || targets < 2) invalid('one source and at least two targets');
      return;
    case 'delete':
      if (targets !== 0) invalid('one or more sources and no targets');
  }
};

const assertInsideMemoryRoot = (
  path: string,
  intake: SkoposAdoptionIntakeArtifact,
): void => {
  const inside = intake.memoryRoots.some(
    (root) => path === root.path || path.startsWith(`${root.path}/`),
  );
  if (!inside) {
    throw new Error(
      `Restructuring target must stay inside a declared Scope Memory root: ${path}`,
    );
  }
};

const buildTargetTree = (
  intake: SkoposAdoptionIntakeArtifact,
  operations: SkoposAdoptionDocumentDisposition[],
): string[] => {
  const paths = new Set(
    intake.documents
      .filter((document) => document.lifecycle !== 'dead')
      .map((document) => document.path),
  );

  for (const operation of operations) {
    if (!['keep', 'rewrite'].includes(operation.operation)) {
      for (const sourcePath of operation.sourcePaths) paths.delete(sourcePath);
    }
    for (const targetPath of operation.targetPaths) paths.add(targetPath);
  }

  return [...paths].sort();
};

const assertEvidencePathsExist = async ({
  workspaceRoot,
  claims,
  materialQuestions,
}: {
  workspaceRoot: string;
  claims: SkoposAdoptionAnalysisClaim[];
  materialQuestions: SkoposAdoptionMaterialQuestion[];
}): Promise<void> => {
  const paths = [
    ...new Set([
      ...claims.flatMap((claim) => claim.evidencePaths),
      ...materialQuestions.flatMap((question) => question.evidencePaths),
    ]),
  ];

  for (const path of paths) {
    assertProjectRelativePath(path, 'Evidence');
    try {
      await access(join(workspaceRoot, path));
    } catch {
      throw new Error(`Adoption analysis evidence path does not exist: ${path}`);
    }
  }
};

const assertClaimsAreGrounded = (claims: SkoposAdoptionAnalysisClaim[]): void => {
  if (!claims.some((claim) => claim.kind === 'fact')) {
    throw new Error('Adoption analysis must include at least one observed fact.');
  }

  for (const claim of claims) {
    if (claim.evidencePaths.length === 0) {
      throw new Error(`Adoption analysis claim ${claim.id} must include evidence paths.`);
    }
    if (claim.kind === 'contradiction' && claim.evidencePaths.length < 2) {
      throw new Error(
        `Contradiction ${claim.id} must cite at least two conflicting evidence paths.`,
      );
    }
  }
};

const assertUniqueIds = (
  entries: Array<{ id: string }>,
  label: string,
): void => {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) throw new Error(`Duplicate ${label} id: ${entry.id}`);
    seen.add(entry.id);
  }
};

const assertProjectRelativePath = (path: string, label: string): void => {
  const normalized = posix.normalize(path.replaceAll('\\', '/'));
  if (
    !path.trim() ||
    isAbsolute(path) ||
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized !== path.replaceAll('\\', '/')
  ) {
    throw new Error(`${label} path must be normalized and project-relative: ${path}`);
  }
};

const normalizeProjectPath = (path: string, label: string): string => {
  const normalized = path.replaceAll('\\', '/');
  assertProjectRelativePath(normalized, label);
  return normalized;
};

const findDuplicate = (entries: string[]): string | undefined => {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry)) return entry;
    seen.add(entry);
  }
  return undefined;
};

const asRecord = (value: unknown, label: string): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  return value as Record<string, unknown>;
};

const requiredArray = (value: unknown, label: string): unknown[] => {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  return value;
};

const requiredString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  return value.trim();
};

const stringArray = (value: unknown, label: string): string[] =>
  requiredArray(value, label).map((entry, index) =>
    requiredString(entry, `${label}[${index}]`),
  );

const DOCUMENT_OPERATION_KINDS = [
  'keep',
  'move',
  'merge',
  'split',
  'rewrite',
  'archive',
  'delete',
] as const;
