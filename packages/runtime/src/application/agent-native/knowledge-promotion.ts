import type {
  SkoposKnowledgePromotionRequest,
  SkoposKnowledgePromotionResult,
  SkoposProvenanceReference,
} from '@skopos/model';

const CANONICAL_AUTHORITIES = new Set(['declared', 'accepted']);

export const evaluateSkoposKnowledgePromotion = ({
  entry,
  targetAuthority,
  requestedByActorId,
  evidence,
}: SkoposKnowledgePromotionRequest): SkoposKnowledgePromotionResult => {
  if (CANONICAL_AUTHORITIES.has(entry.authority)) {
    return {
      status: 'rejected',
      entry,
      targetAuthority,
      requestedByActorId,
      reason: 'already-canonical',
      acceptedEvidence: [],
    };
  }

  const authoritativeEvidence = dedupeEvidence(
    evidence.filter((reference) => CANONICAL_AUTHORITIES.has(reference.authority)),
  );

  if (authoritativeEvidence.length === 0) {
    return {
      status: 'rejected',
      entry,
      targetAuthority,
      requestedByActorId,
      reason: 'project-evidence-required',
      acceptedEvidence: [],
    };
  }

  if (
    targetAuthority === 'accepted' &&
    authoritativeEvidence.every((reference) => reference.authority !== 'accepted')
  ) {
    return {
      status: 'rejected',
      entry,
      targetAuthority,
      requestedByActorId,
      reason: 'target-authority-conflicts-with-evidence',
      acceptedEvidence: authoritativeEvidence,
    };
  }

  return {
    status: 'promoted',
    entry: {
      ...entry,
      authority: targetAuthority,
      provenance: dedupeEvidence([...entry.provenance, ...authoritativeEvidence]),
    },
    targetAuthority,
    requestedByActorId,
    acceptedEvidence: authoritativeEvidence,
  };
};

const dedupeEvidence = (
  references: SkoposProvenanceReference[],
): SkoposProvenanceReference[] => {
  const unique = new Map<string, SkoposProvenanceReference>();
  for (const reference of references) {
    unique.set(
      [
        reference.authority,
        reference.sourceKind,
        reference.sourceId,
        reference.path ?? '',
      ].join(':'),
      reference,
    );
  }
  return [...unique.values()];
};
