import type {
  SkoposImpactEntry,
  SkoposActionManifest,
  SkoposActionRequirement,
  SkoposGuardManifest,
  SkoposGuardMatch,
  SkoposActionPhase,
  SkoposTaskRisk,
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
}

export const matchSkoposRequiredActionsForImpact = ({
  actions,
  guards,
  changed,
  phase,
  risk,
}: MatchSkoposRequiredActionsForImpactOptions): SkoposImpactGuardSelection => {
  const matchedGuards = guards
    .map((guard) => matchGuardToImpact(guard, changed, phase, risk))
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

  return {
    guards: matchedGuards,
    actions: actionRequirements,
  };
};

const matchGuardToImpact = (
  guard: SkoposGuardManifest,
  changed: SkoposImpactEntry[],
  phase?: SkoposActionPhase,
  risk?: SkoposTaskRisk,
): SkoposGuardMatch | null => {
  if (phase && guard.appliesTo.phases && !guard.appliesTo.phases.includes(phase)) {
    return null;
  }
  if (risk && guard.appliesTo.risks && !guard.appliesTo.risks.includes(risk)) {
    return null;
  }
  const matchedPaths = changed
    .filter((entry) =>
      guard.appliesTo.paths.some((pattern) => pathPatternMatches(entry.path, pattern)) &&
      guardAppliesToImpactScope(guard, entry),
    )
    .map((entry) => entry.path);
  if (matchedPaths.length === 0) {
    return null;
  }

  return {
    id: guard.id,
    title: guard.title,
    strength: guard.strength,
    sourcePath: guard.sourcePath,
    reason: `Guard applies because ${[...new Set(matchedPaths)].join(', ')} changed.`,
    matchedPaths: [...new Set(matchedPaths)],
    requiredActionIds: guard.requires.actionIds,
    evidence: guard.requires.evidence,
  };
};

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
