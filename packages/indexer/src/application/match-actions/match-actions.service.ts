import type {
  SkoposImpactCategory,
  SkoposImpactEntry,
  SkoposResolvedScope,
  SkoposActionCategory,
  SkoposActionManifest,
  SkoposActionRequirement,
  SkoposGuardManifest,
  SkoposGuardMatch,
  SkoposActionPhase,
  SkoposTaskRisk,
} from '@skopos/model';

export interface MatchSkoposPlanActionsOptions {
  actions: SkoposActionManifest[];
  goal: string;
  scope: SkoposResolvedScope;
}

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

const actionCategoryKeywords: Record<SkoposActionCategory, string[]> = {
  'docs-generator': ['doc', 'docs', 'readme', 'guide', 'instruction', 'mirror'],
  'docs-validator': ['doc', 'docs', 'readme', 'guide', 'instruction', 'validate'],
  'reference-generator': ['api', 'endpoint', 'route', 'contract', 'schema', 'sdk', 'reference'],
  'graph-generator': ['graph', 'diagram', 'architecture', 'relationship', 'dependency'],
  'quality-check': ['check', 'validate', 'verify', 'quality', 'lint', 'test'],
  migration: ['migrate', 'migration', 'rename', 'remove', 'delete', 'drop'],
  maintenance: ['refresh', 'sync', 'generate', 'update', 'maintain'],
  'domain-tool': ['domain', 'business', 'data', 'model'],
};

const impactCategoriesByAction: Record<SkoposActionCategory, SkoposImpactCategory[]> = {
  'docs-generator': ['docs', 'instruction-source', 'instruction-mirror'],
  'docs-validator': ['docs', 'instruction-source', 'instruction-mirror'],
  'reference-generator': ['scope-source', 'package-manifest', 'root-config'],
  'graph-generator': ['scope-source', 'package-manifest', 'docs', 'workspace-file'],
  'quality-check': ['scope-source', 'package-manifest', 'root-config', 'workspace-file', 'docs'],
  migration: ['scope-source', 'package-manifest', 'root-config', 'workspace-file'],
  maintenance: ['scope-source', 'package-manifest', 'root-config', 'workspace-file', 'docs'],
  'domain-tool': ['scope-source', 'package-manifest', 'workspace-file'],
};

export const matchSkoposPlanActions = ({
  actions,
  goal,
  scope,
}: MatchSkoposPlanActionsOptions): SkoposActionRequirement[] => {
  const normalizedGoal = goal.toLowerCase();

  return actions
    .filter((action) => matchesPlanAction({ action, normalizedGoal, scope }))
    .map((action) =>
      toActionRequirement(
        action,
        action.whenToUse?.trim() ||
          `Registered ${action.category} Action for ${scope.scope.id}.`,
      ),
    )
    .sort(sortActionRequirements);
};

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
      guard.appliesTo.paths.some((pattern) => pathPatternMatches(entry.path, pattern)),
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

const matchesPlanAction = ({
  action,
  normalizedGoal,
  scope,
}: {
  action: SkoposActionManifest;
  normalizedGoal: string;
  scope: SkoposResolvedScope;
}): boolean => {
  if (!actionAppliesToScope(action, scope.scope.id, scope.scope.kind)) {
    return false;
  }

  if (
    actionCategoryKeywords[action.category].some((keyword) => normalizedGoal.includes(keyword))
  ) {
    return true;
  }

  return hasManifestTextOverlap(action, normalizedGoal);
};

const matchesImpactAction = ({
  action,
  entry,
}: {
  action: SkoposActionManifest;
  entry: SkoposImpactEntry;
}): boolean => {
  if (action.inputs.some((inputPath) => pathPatternMatches(entry.path, inputPath))) {
    return true;
  }

  if (action.inputs.length > 0) {
    return false;
  }

  if (!actionAppliesToAffectedScopes(action, entry.affectedScopeIds, entry.category)) {
    return false;
  }

  if (!impactCategoriesByAction[action.category].includes(entry.category)) {
    return false;
  }

  return allowsImpactCategoryFallback(action, entry.category);
};

const actionAppliesToScope = (
  action: SkoposActionManifest,
  scopeId: string,
  scopeKind: SkoposResolvedScope['scope']['kind'],
): boolean =>
  action.scope.includes('workspace') ||
  action.scope.includes(scopeId) ||
  action.scope.includes(scopeKind);

const actionAppliesToAffectedScopes = (
  action: SkoposActionManifest,
  affectedScopeIds: string[],
  category: SkoposImpactCategory,
): boolean =>
  action.scope.includes('workspace') ||
  affectedScopeIds.some((scopeId) => action.scope.includes(scopeId)) ||
  (action.scope.includes('docs') &&
    ['docs', 'instruction-source', 'instruction-mirror'].includes(category));

const allowsImpactCategoryFallback = (
  action: SkoposActionManifest,
  category: SkoposImpactCategory,
): boolean => {
  if (category === 'docs') {
    return action.scope.includes('docs');
  }

  if (category === 'instruction-source' || category === 'instruction-mirror') {
    return action.scope.includes('docs');
  }

  return true;
};

const pathPatternMatches = (changedPath: string, pattern: string): boolean =>
  changedPath === pattern ||
  changedPath.startsWith(`${pattern}/`) ||
  pattern.startsWith(`${changedPath}/`);

const hasManifestTextOverlap = (
  action: SkoposActionManifest,
  normalizedGoal: string,
): boolean => {
  const manifestText =
    `${action.title} ${action.description} ${action.whenToUse ?? ''}`.toLowerCase();
  const goalTerms = normalizedGoal
    .split(/[^a-z0-9]+/g)
    .map((term) => term.trim())
    .filter((term) => term.length >= 4);

  return goalTerms.some((term) => manifestText.includes(term));
};

const buildImpactActionReason = (
  action: SkoposActionManifest,
  matchedEntries: SkoposImpactEntry[],
): string => {
  const inputMatchedEntries = matchedEntries.filter((entry) =>
    action.inputs.some((inputPath) => pathPatternMatches(entry.path, inputPath)),
  );

  if (inputMatchedEntries.length > 0) {
    const matchedPaths = inputMatchedEntries.map((entry) => entry.path);
    const visiblePaths = matchedPaths.slice(0, 5);
    const remainingCount = matchedPaths.length - visiblePaths.length;
    return `Action Evidence is required because registered input paths changed: ${visiblePaths.join(', ')}${remainingCount > 0 ? `, and ${remainingCount} more path${remainingCount === 1 ? '' : 's'}` : ''}.`;
  }

  const affectedScopes = [...new Set(matchedEntries.flatMap((entry) => entry.affectedScopeIds))];
  return `${action.category} Action Evidence is required because changed surfaces match ${affectedScopes.join(', ')} and ${action.category} impact rules.`;
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
