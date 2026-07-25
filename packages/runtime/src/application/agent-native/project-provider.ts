import type {
  SkoposAgentNativeOperatingModel,
  SkoposProjectProviderBriefResponse,
  SkoposProjectProviderDescription,
  SkoposProjectProviderVerifyResponse,
} from '@skopos/model';

const SUPPORTED_PROVIDER_PROTOCOL_VERSION = 1;

export const validateSkoposProjectProviderDescription = (
  description: SkoposProjectProviderDescription,
): string[] => {
  const diagnostics: string[] = [];

  if (description.protocolVersion !== SUPPORTED_PROVIDER_PROTOCOL_VERSION) {
    diagnostics.push(
      `Provider ${description.providerId} uses unsupported protocol version ${description.protocolVersion}.`,
    );
  }
  if (
    description.authorityBoundary.workflowAuthority !== 'skopos' ||
    description.authorityBoundary.taskStateAuthority !== 'skopos' ||
    description.authorityBoundary.closureAuthority !== 'skopos'
  ) {
    diagnostics.push(`Provider ${description.providerId} claims authority reserved for Skopos.`);
  }
  collectDuplicateIds(description.context, 'context', diagnostics);
  collectDuplicateIds(description.actions, 'action', diagnostics);
  collectDuplicateIds(description.guards, 'guard', diagnostics);

  return diagnostics;
};

export const mergeSkoposProjectProviderDescription = ({
  operatingModel,
  description,
}: {
  operatingModel: SkoposAgentNativeOperatingModel;
  description: SkoposProjectProviderDescription;
}): SkoposAgentNativeOperatingModel => {
  const diagnostics = validateSkoposProjectProviderDescription(description);
  if (diagnostics.length > 0) {
    return {
      ...operatingModel,
      diagnostics: [...operatingModel.diagnostics, ...diagnostics],
    };
  }

  return {
    ...operatingModel,
    context: mergeUnique(operatingModel.context, description.context, 'context', diagnostics),
    actions: mergeUnique(operatingModel.actions, description.actions, 'action', diagnostics),
    guards: mergeUnique(operatingModel.guards, description.guards, 'guard', diagnostics),
    diagnostics: [...operatingModel.diagnostics, ...diagnostics],
  };
};

export const validateSkoposProjectProviderBrief = ({
  description,
  brief,
}: {
  description: SkoposProjectProviderDescription;
  brief: SkoposProjectProviderBriefResponse;
}): string[] => {
  const diagnostics: string[] = [];
  if (brief.providerId !== description.providerId) {
    diagnostics.push('Provider brief identity does not match its description.');
  }
  collectUndeclaredIds(description.context, brief.context, 'context', diagnostics);
  collectUndeclaredIds(description.actions, brief.actions, 'action', diagnostics);
  collectUndeclaredIds(description.guards, brief.guards, 'guard', diagnostics);
  return diagnostics;
};

export const validateSkoposProjectProviderVerification = (
  verification: SkoposProjectProviderVerifyResponse,
): string[] => {
  const diagnostics: string[] = [];
  collectDuplicateIds(verification.evidence, 'evidence', diagnostics);
  for (const evidence of verification.evidence) {
    if (
      evidence.status !== 'unavailable' &&
      !evidence.command &&
      !evidence.path &&
      !evidence.sourceDigest
    ) {
      diagnostics.push(
        `Provider evidence ${evidence.id} has no command, path, or source digest.`,
      );
    }
  }
  return diagnostics;
};

const collectDuplicateIds = (
  entries: Array<{ id: string }>,
  kind: string,
  diagnostics: string[],
): void => {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.id)) {
      diagnostics.push(`Provider declares duplicate ${kind} id ${entry.id}.`);
    }
    seen.add(entry.id);
  }
};

const collectUndeclaredIds = (
  declared: Array<{ id: string }>,
  selected: Array<{ id: string }>,
  kind: string,
  diagnostics: string[],
): void => {
  const declaredIds = new Set(declared.map((entry) => entry.id));
  for (const entry of selected) {
    if (!declaredIds.has(entry.id)) {
      diagnostics.push(`Provider brief returned undeclared ${kind} id ${entry.id}.`);
    }
  }
};

const mergeUnique = <T extends { id: string }>(
  existing: T[],
  contributed: T[],
  kind: string,
  diagnostics: string[],
): T[] => {
  const result = [...existing];
  const ids = new Set(existing.map((entry) => entry.id));
  for (const entry of contributed) {
    if (ids.has(entry.id)) {
      diagnostics.push(`Provider ${kind} id ${entry.id} conflicts with Skopos state.`);
      continue;
    }
    ids.add(entry.id);
    result.push(entry);
  }
  return result;
};
