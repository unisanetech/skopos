import type {
  SkoposArtifactLifecycleValidation,
  SkoposCompactProjectArtifact,
} from '@skopos/model';

export const buildSkoposCompactProjectArtifact = ({
  workspaceRoot,
  generatedAt = new Date().toISOString(),
}: {
  workspaceRoot: string;
  generatedAt?: string;
}): SkoposCompactProjectArtifact => ({
  schemaVersion: 1,
  id: 'compact-project',
  type: 'compact-project',
  status: 'generated',
  authority: 'generated',
  summary:
    'Compact artifact lifecycle projection; existing Skopos workflow artifacts remain authoritative during staged migration.',
  updatedAt: generatedAt,
  generatedAt,
  workspaceRoot,
  workflowAuthority: 'skopos',
  migrationVersion: 1,
  migrationStrategy: 'staged',
  families: [
    {
      id: 'project-model',
      authorityPaths: [
        'skopos.config.yaml',
        'AGENTS.md',
        '.skopos/policies/resolved.json',
        '.skopos/enforcement.json',
      ],
      compactPaths: ['.skopos/project.json'],
      compatibilityPaths: [
        '.skopos/bootstrap.json',
        '.skopos/scopes-lite.json',
        '.skopos/architecture.json',
      ],
      retention: 'shared',
      migrationState: 'staged-projection',
      summary:
        'Project configuration, instructions, policy, and enforcement compile into one compact generated project view.',
    },
    {
      id: 'current-task',
      authorityPaths: [
        '.skopos/plans/*.json',
        '.skopos/missions/*.json',
        '.skopos/tasks/<worktree-id>/<task-id>/**',
      ],
      compactPaths: [
        '.skopos/current/task.json',
        '.skopos/current/brief.json',
      ],
      compatibilityPaths: [
        '.skopos/questions.json',
        '.skopos/recommendations.json',
        '.skopos/program/state.json',
        '.skopos/agent/program-brief.json',
      ],
      retention: 'local',
      migrationState: 'staged-projection',
      summary:
        'The active mission and task-scoped state remain authoritative; current files are replaceable compact projections.',
      removalCondition:
        'Retire compatibility projections only after resume, worktree-isolation, and public migration proof pass.',
    },
    {
      id: 'workflow-receipts',
      authorityPaths: ['.skopos/runs/*.json'],
      compactPaths: ['.skopos/receipts/*.json'],
      compatibilityPaths: [],
      retention: 'local',
      migrationState: 'staged-projection',
      summary:
        'Receipt files project source-bound evidence from their authoritative workflow-run artifacts.',
      removalCondition:
        'Move receipt authority only after legacy run readers and recovery behavior have migration proof.',
    },
    {
      id: 'content-index',
      authorityPaths: ['docs/**', '.skopos/memory/state.json'],
      compactPaths: ['.skopos/index.json'],
      compatibilityPaths: [],
      retention: 'shared',
      migrationState: 'current-authority',
      summary:
        'The compact content index remains the primary retrieval projection over declared project knowledge.',
    },
    {
      id: 'advanced-workflow-history',
      authorityPaths: [
        '.skopos/plans/*.json',
        '.skopos/missions/*.json',
        '.skopos/evals/*.json',
      ],
      compactPaths: [],
      compatibilityPaths: [],
      retention: 'local',
      migrationState: 'compatibility-retained',
      summary:
        'Workpack history remains available because it has a distinct coordination and recovery lifecycle.',
      removalCondition:
        'Retain only bounded history after compact task recovery and audit proof cover the same needs.',
    },
    {
      id: 'derived-cache',
      authorityPaths: [],
      compactPaths: ['.skopos/cache/**'],
      compatibilityPaths: [
        '.skopos/agent/**',
        '.skopos/discussions/**',
        '.skopos/graph/**',
        '.skopos/proof/**',
        '.skopos/recommendations.json',
        '.skopos/log.jsonl',
      ],
      retention: 'disposable',
      migrationState: 'cache-candidate',
      summary:
        'High-churn briefs, discussion views, graphs, proof snapshots, recommendations, and logs are reproducible local cache candidates.',
      removalCondition:
        'Relocate only after every reader uses the lifecycle resolver and regeneration/recovery proof passes.',
    },
  ],
});

export const validateSkoposCompactProjectArtifact = (
  artifact: SkoposCompactProjectArtifact,
): SkoposArtifactLifecycleValidation => {
  const diagnostics: string[] = [];

  if (artifact.authority !== 'generated') {
    diagnostics.push('Compact project artifact must remain a generated projection.');
  }
  if (artifact.workflowAuthority !== 'skopos') {
    diagnostics.push('Compact project artifact must reserve workflow authority for Skopos.');
  }
  if (artifact.migrationStrategy !== 'staged') {
    diagnostics.push('Artifact migration must remain staged until compatibility proof passes.');
  }

  const familyIds = new Set<string>();
  const compactPaths = new Set<string>();
  for (const family of artifact.families) {
    if (familyIds.has(family.id)) {
      diagnostics.push(`Duplicate artifact family id: ${family.id}.`);
    }
    familyIds.add(family.id);

    for (const compactPath of family.compactPaths) {
      if (compactPaths.has(compactPath)) {
        diagnostics.push(`Compact artifact path is owned by more than one family: ${compactPath}.`);
      }
      compactPaths.add(compactPath);
    }

    if (
      (family.migrationState === 'compatibility-retained' ||
        family.migrationState === 'cache-candidate') &&
      !family.removalCondition
    ) {
      diagnostics.push(
        `Artifact family ${family.id} needs an explicit removal condition before migration.`,
      );
    }
  }

  for (const requiredFamilyId of [
    'project-model',
    'current-task',
    'workflow-receipts',
    'content-index',
    'derived-cache',
  ]) {
    if (!familyIds.has(requiredFamilyId)) {
      diagnostics.push(`Required artifact family is missing: ${requiredFamilyId}.`);
    }
  }

  return {
    status: diagnostics.length === 0 ? 'pass' : 'fail',
    diagnostics,
  };
};
