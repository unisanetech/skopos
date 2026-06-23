import type {
  SkoposImpactCategory,
  SkoposImpactEntry,
  SkoposResolvedScope,
  SkoposWorkflowCategory,
  SkoposWorkflowManifest,
  SkoposWorkflowRequirement,
} from '@skopos/model';

export interface MatchSkoposPlanWorkflowsOptions {
  workflows: SkoposWorkflowManifest[];
  goal: string;
  scope: SkoposResolvedScope;
}

export interface MatchSkoposRequiredWorkflowsForImpactOptions {
  workflows: SkoposWorkflowManifest[];
  changed: SkoposImpactEntry[];
}

const workflowCategoryKeywords: Record<SkoposWorkflowCategory, string[]> = {
  'docs-generator': ['doc', 'docs', 'readme', 'guide', 'instruction', 'mirror'],
  'docs-validator': ['doc', 'docs', 'readme', 'guide', 'instruction', 'validate'],
  'reference-generator': ['api', 'endpoint', 'route', 'contract', 'schema', 'sdk', 'reference'],
  'graph-generator': ['graph', 'diagram', 'architecture', 'relationship', 'dependency'],
  'quality-check': ['check', 'validate', 'verify', 'quality', 'lint', 'test'],
  migration: ['migrate', 'migration', 'rename', 'remove', 'delete', 'drop'],
  maintenance: ['refresh', 'sync', 'generate', 'update', 'maintain'],
  'domain-tool': ['domain', 'business', 'data', 'model'],
};

const impactCategoriesByWorkflow: Record<SkoposWorkflowCategory, SkoposImpactCategory[]> = {
  'docs-generator': ['docs', 'instruction-source', 'instruction-mirror'],
  'docs-validator': ['docs', 'instruction-source', 'instruction-mirror'],
  'reference-generator': ['package-source', 'package-manifest', 'root-config'],
  'graph-generator': ['package-source', 'package-manifest', 'docs', 'workspace-file'],
  'quality-check': ['package-source', 'package-manifest', 'root-config', 'workspace-file', 'docs'],
  migration: ['package-source', 'package-manifest', 'root-config', 'workspace-file'],
  maintenance: ['package-source', 'package-manifest', 'root-config', 'workspace-file', 'docs'],
  'domain-tool': ['package-source', 'package-manifest', 'workspace-file'],
};

export const matchSkoposPlanWorkflows = ({
  workflows,
  goal,
  scope,
}: MatchSkoposPlanWorkflowsOptions): SkoposWorkflowRequirement[] => {
  const normalizedGoal = goal.toLowerCase();

  return workflows
    .filter((workflow) => matchesPlanWorkflow({ workflow, normalizedGoal, scope }))
    .map((workflow) =>
      toWorkflowRequirement(
        workflow,
        workflow.requiredForDone
          ? `Required-for-done workflow registered for ${scope.scope.id}; include it in the execution plan.`
          : workflow.whenToUse?.trim() ||
              `Registered ${workflow.category} workflow for ${scope.scope.id}.`,
      ),
    )
    .sort(sortWorkflowRequirements);
};

export const matchSkoposRequiredWorkflowsForImpact = ({
  workflows,
  changed,
}: MatchSkoposRequiredWorkflowsForImpactOptions): SkoposWorkflowRequirement[] =>
  workflows
    .filter((workflow) => workflow.requiredForDone)
    .map((workflow) => {
      const matchedEntries = changed.filter((entry) => matchesImpactWorkflow({ workflow, entry }));
      if (matchedEntries.length === 0) {
        return null;
      }

      const matchedPaths = [...new Set(matchedEntries.map((entry) => entry.path))];
      const reason = buildImpactWorkflowReason(workflow, matchedEntries);
      return toWorkflowRequirement(workflow, reason, matchedPaths);
    })
    .filter((workflow): workflow is SkoposWorkflowRequirement => Boolean(workflow))
    .sort(sortWorkflowRequirements);

const matchesPlanWorkflow = ({
  workflow,
  normalizedGoal,
  scope,
}: {
  workflow: SkoposWorkflowManifest;
  normalizedGoal: string;
  scope: SkoposResolvedScope;
}): boolean => {
  if (!workflowAppliesToScope(workflow, scope.scope.id, scope.scope.kind)) {
    return false;
  }

  if (workflow.requiredForDone) {
    return true;
  }

  if (
    workflowCategoryKeywords[workflow.category].some((keyword) => normalizedGoal.includes(keyword))
  ) {
    return true;
  }

  return hasManifestTextOverlap(workflow, normalizedGoal);
};

const matchesImpactWorkflow = ({
  workflow,
  entry,
}: {
  workflow: SkoposWorkflowManifest;
  entry: SkoposImpactEntry;
}): boolean => {
  if (workflow.inputs.some((inputPath) => pathPatternMatches(entry.path, inputPath))) {
    return true;
  }

  if (!workflowAppliesToAffectedScopes(workflow, entry.affectedScopeIds, entry.category)) {
    return false;
  }

  if (!impactCategoriesByWorkflow[workflow.category].includes(entry.category)) {
    return false;
  }

  return allowsImpactCategoryFallback(workflow, entry.category);
};

const workflowAppliesToScope = (
  workflow: SkoposWorkflowManifest,
  scopeId: string,
  scopeKind: SkoposResolvedScope['scope']['kind'],
): boolean =>
  workflow.scope.includes('workspace') ||
  workflow.scope.includes(scopeId) ||
  workflow.scope.includes(scopeKind);

const workflowAppliesToAffectedScopes = (
  workflow: SkoposWorkflowManifest,
  affectedScopeIds: string[],
  category: SkoposImpactCategory,
): boolean =>
  workflow.scope.includes('workspace') ||
  affectedScopeIds.some((scopeId) => workflow.scope.includes(scopeId)) ||
  (workflow.scope.includes('docs') &&
    ['docs', 'instruction-source', 'instruction-mirror'].includes(category));

const allowsImpactCategoryFallback = (
  workflow: SkoposWorkflowManifest,
  category: SkoposImpactCategory,
): boolean => {
  if (category === 'docs') {
    return workflow.scope.includes('docs');
  }

  if (category === 'instruction-source' || category === 'instruction-mirror') {
    return workflow.scope.includes('instructions:agents') || workflow.scope.includes('docs');
  }

  return true;
};

const pathPatternMatches = (changedPath: string, pattern: string): boolean =>
  changedPath === pattern ||
  changedPath.startsWith(`${pattern}/`) ||
  pattern.startsWith(`${changedPath}/`);

const hasManifestTextOverlap = (
  workflow: SkoposWorkflowManifest,
  normalizedGoal: string,
): boolean => {
  const manifestText =
    `${workflow.title} ${workflow.description} ${workflow.whenToUse ?? ''}`.toLowerCase();
  const goalTerms = normalizedGoal
    .split(/[^a-z0-9]+/g)
    .map((term) => term.trim())
    .filter((term) => term.length >= 4);

  return goalTerms.some((term) => manifestText.includes(term));
};

const buildImpactWorkflowReason = (
  workflow: SkoposWorkflowManifest,
  matchedEntries: SkoposImpactEntry[],
): string => {
  const inputMatchedEntries = matchedEntries.filter((entry) =>
    workflow.inputs.some((inputPath) => pathPatternMatches(entry.path, inputPath)),
  );

  if (inputMatchedEntries.length > 0) {
    return `Required workflow because registered input paths changed: ${inputMatchedEntries.map((entry) => entry.path).join(', ')}.`;
  }

  const affectedScopes = [...new Set(matchedEntries.flatMap((entry) => entry.affectedScopeIds))];
  return `Required ${workflow.category} workflow because changed surfaces match ${affectedScopes.join(', ')} and ${workflow.category} impact rules.`;
};

const toWorkflowRequirement = (
  workflow: SkoposWorkflowManifest,
  reason: string,
  matchedPaths: string[] = [],
): SkoposWorkflowRequirement => ({
  id: workflow.id,
  title: workflow.title,
  category: workflow.category,
  safety: workflow.safety,
  sourcePath: workflow.sourcePath,
  reason,
  matchedPaths,
  outputPaths: workflow.outputs,
  requiredForDone: workflow.requiredForDone,
  requiresApproval: workflow.requiresApproval,
});

const sortWorkflowRequirements = (
  left: SkoposWorkflowRequirement,
  right: SkoposWorkflowRequirement,
): number => {
  if (left.requiredForDone !== right.requiredForDone) {
    return left.requiredForDone ? -1 : 1;
  }

  return left.id.localeCompare(right.id);
};
