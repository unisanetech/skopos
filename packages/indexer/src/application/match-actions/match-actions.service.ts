import type {
  SkoposImpactEntry,
  SkoposActionManifest,
  SkoposActionRequirement,
  SkoposGuardManifest,
  SkoposGuardMatch,
  SkoposActionPhase,
  SkoposTaskRisk,
  SkoposImpactSelectionExplanation,
} from '@skopos/model';

export interface MatchSkoposRequiredActionsForImpactOptions {
  actions: SkoposActionManifest[];
  guards: SkoposGuardManifest[];
  changed: SkoposImpactEntry[];
  phase?: SkoposActionPhase;
  risk?: SkoposTaskRisk;
}

export interface SkoposImpactGuardSelection {
  guards: SkoposGuardMatch[];
  actions: SkoposActionRequirement[];
  explanation: SkoposImpactSelectionExplanation;
}

export const matchSkoposRequiredActionsForImpact = ({
  actions,
  guards,
  changed,
  phase,
  risk,
}: MatchSkoposRequiredActionsForImpactOptions): SkoposImpactGuardSelection => {
  const guardDecisions = guards.map((guard) =>
    explainGuardSelection(guard, changed, phase, risk),
  );
  const matchedGuards = guardDecisions
    .map((decision) => decision.match)
    .filter((guard): guard is SkoposGuardMatch => Boolean(guard))
    .sort((left, right) => left.id.localeCompare(right.id));
  const requiredActionIds = new Set(
    matchedGuards
      .filter((guard) => guard.strength === 'required')
      .flatMap((guard) => guard.requiredActionIds),
  );
  const actionRequirements = actions
    .filter((action) => requiredActionIds.has(action.id))
    .map((action) => {
      const owningGuards = matchedGuards.filter((guard) =>
        guard.requiredActionIds.includes(action.id),
      );
      const matchedPaths = [...new Set(owningGuards.flatMap((guard) => guard.matchedPaths))];
      return toActionRequirement(
        action,
        `Required by Guard${owningGuards.length === 1 ? '' : 's'} ${owningGuards.map((guard) => guard.id).join(', ')}.`,
        matchedPaths,
      );
    })
    .sort(sortActionRequirements);
  const actionExplanations = actions
    .map((action) => {
      const requiredByGuardIds = matchedGuards
        .filter(
          (guard) =>
            guard.strength === 'required' && guard.requiredActionIds.includes(action.id),
        )
        .map((guard) => guard.id)
        .sort();
      return {
        id: action.id,
        status: requiredByGuardIds.length > 0 ? 'selected' as const : 'skipped' as const,
        reason:
          requiredByGuardIds.length > 0
            ? `Selected because required Guard${requiredByGuardIds.length === 1 ? '' : 's'} ${requiredByGuardIds.join(', ')} matched.`
            : 'Skipped because no selected required Guard requires this Action.',
        requiredByGuardIds,
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));

  return {
    guards: matchedGuards,
    actions: actionRequirements,
    explanation: {
      guards: guardDecisions
        .map((decision) => decision.explanation)
        .sort((left, right) => left.id.localeCompare(right.id)),
      actions: actionExplanations,
    },
  };
};

const explainGuardSelection = (
  guard: SkoposGuardManifest,
  changed: SkoposImpactEntry[],
  phase?: SkoposActionPhase,
  risk?: SkoposTaskRisk,
): {
  match: SkoposGuardMatch | null;
  explanation: SkoposImpactSelectionExplanation['guards'][number];
} => {
  if (phase && guard.appliesTo.phases && !guard.appliesTo.phases.includes(phase)) {
    return skippedGuard(
      guard,
      `Skipped because phase ${phase} is outside ${guard.appliesTo.phases.join(', ')}.`,
    );
  }
  if (risk && guard.appliesTo.risks && !guard.appliesTo.risks.includes(risk)) {
    return skippedGuard(
      guard,
      `Skipped because risk ${risk} is outside ${guard.appliesTo.risks.join(', ')}.`,
    );
  }
  const pathMatches = changed.filter((entry) =>
    guard.appliesTo.paths.some((pattern) => pathPatternMatches(entry.path, pattern)),
  );
  if (pathMatches.length === 0) {
    return skippedGuard(guard, 'Skipped because no changed path matches this Guard.');
  }
  const matchedPaths = pathMatches
    .filter((entry) =>
      guardAppliesToImpactScope(guard, entry),
    )
    .map((entry) => entry.path);
  if (matchedPaths.length === 0) {
    return skippedGuard(
      guard,
      'Skipped because matching paths do not belong to a Scope governed by this Guard.',
      pathMatches.map((entry) => entry.path),
    );
  }

  const uniqueMatchedPaths = [...new Set(matchedPaths)];
  const match: SkoposGuardMatch = {
    id: guard.id,
    title: guard.title,
    strength: guard.strength,
    sourcePath: guard.sourcePath,
    reason: `Guard applies because ${uniqueMatchedPaths.join(', ')} changed.`,
    matchedPaths: uniqueMatchedPaths,
    requiredActionIds: guard.requires.actionIds,
    evidence: guard.requires.evidence,
  };
  return {
    match,
    explanation: {
      id: guard.id,
      status: 'selected',
      reason: match.reason,
      matchedPaths: uniqueMatchedPaths,
    },
  };
};

const skippedGuard = (
  guard: SkoposGuardManifest,
  reason: string,
  matchedPaths: string[] = [],
): {
  match: null;
  explanation: SkoposImpactSelectionExplanation['guards'][number];
} => ({
  match: null,
  explanation: {
    id: guard.id,
    status: 'skipped',
    reason,
    matchedPaths: [...new Set(matchedPaths)],
  },
});

const guardAppliesToImpactScope = (
  guard: SkoposGuardManifest,
  entry: SkoposImpactEntry,
): boolean =>
  guard.scope.includes('workspace') ||
  entry.affectedScopeIds.some((scopeId) => guard.scope.includes(scopeId)) ||
  (guard.scope.includes('docs') &&
    ['docs', 'instruction-source', 'instruction-mirror'].includes(entry.category));

const pathPatternMatches = (changedPath: string, pattern: string): boolean => {
  const normalizedPath = changedPath.replaceAll('\\', '/').replace(/^\.\/+/, '');
  const normalizedPattern = pattern.replaceAll('\\', '/').replace(/^\.\/+/, '');
  if (!/[*?]/.test(normalizedPattern)) {
    return (
      normalizedPath === normalizedPattern ||
      normalizedPath.startsWith(`${normalizedPattern}/`) ||
      normalizedPattern.startsWith(`${normalizedPath}/`)
    );
  }

  const expression = normalizedPattern
    .split('**')
    .map((segment) =>
      segment
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '[^/]'),
    )
    .join('.*');
  return new RegExp(`^${expression}$`).test(normalizedPath);
};

const toActionRequirement = (
  action: SkoposActionManifest,
  reason: string,
  matchedPaths: string[] = [],
): SkoposActionRequirement => ({
  id: action.id,
  title: action.title,
  category: action.category,
  safety: action.safety,
  sourcePath: action.sourcePath,
  reason,
  matchedPaths,
  outputPaths: action.outputs,
  requiresApproval: action.requiresApproval,
});

const sortActionRequirements = (
  left: SkoposActionRequirement,
  right: SkoposActionRequirement,
): number => {
  return left.id.localeCompare(right.id);
};
