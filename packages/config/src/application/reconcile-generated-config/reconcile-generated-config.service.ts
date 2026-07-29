import type { SkoposRootConfig } from '@skopos/model';

export interface ReconcileGeneratedSkoposConfigOptions {
  existingConfig: SkoposRootConfig;
  recommendedConfig: SkoposRootConfig;
}

export interface ReconcileGeneratedSkoposConfigResult {
  config: SkoposRootConfig;
  refreshedManagedFields: boolean;
}

export const reconcileGeneratedSkoposConfig = ({
  existingConfig,
  recommendedConfig,
}: ReconcileGeneratedSkoposConfigOptions): ReconcileGeneratedSkoposConfigResult => {
  let nextConfig = existingConfig;
  let refreshedManagedFields = false;

  if (!existingConfig.project.mode && recommendedConfig.project.mode) {
    nextConfig = {
      ...nextConfig,
      project: {
        ...nextConfig.project,
        mode: recommendedConfig.project.mode,
      },
    };
    refreshedManagedFields = true;
  }

  if (
    existingConfig.project.repoMode === 'single' &&
    existingConfig.project.scopeStrategy === 'domain' &&
    recommendedConfig.project.repoMode === 'monorepo'
  ) {
    nextConfig = {
      ...nextConfig,
      project: {
        ...nextConfig.project,
        repoMode: recommendedConfig.project.repoMode,
        scopeStrategy: recommendedConfig.project.scopeStrategy,
      },
      verification: {
        ...nextConfig.verification,
        mode: recommendedConfig.verification.mode,
      },
    };
    refreshedManagedFields = true;
  }

  if (
    existingConfig.docs.root === 'docs' &&
    recommendedConfig.docs.root !== existingConfig.docs.root
  ) {
    nextConfig = {
      ...nextConfig,
      docs: {
        ...nextConfig.docs,
        root: recommendedConfig.docs.root,
      },
    };
    refreshedManagedFields = true;
  }

  const defaultStartHerePath = `${existingConfig.docs.root.replace(/\/$/, '')}/00-start-here.md`;
  if (
    (!existingConfig.docs.startHerePath ||
      existingConfig.docs.startHerePath === defaultStartHerePath) &&
    recommendedConfig.docs.startHerePath &&
    recommendedConfig.docs.startHerePath !== defaultStartHerePath &&
    recommendedConfig.docs.startHerePath !== existingConfig.docs.startHerePath
  ) {
    nextConfig = {
      ...nextConfig,
      docs: {
        ...nextConfig.docs,
        startHerePath: recommendedConfig.docs.startHerePath,
      },
    };
    refreshedManagedFields = true;
  }

  if (
    existingConfig.agents.canonicalInstructions === 'AGENTS.md' &&
    recommendedConfig.agents.canonicalInstructions !== existingConfig.agents.canonicalInstructions
  ) {
    nextConfig = {
      ...nextConfig,
      agents: {
        ...nextConfig.agents,
        canonicalInstructions: recommendedConfig.agents.canonicalInstructions,
      },
    };
    refreshedManagedFields = true;
  }

  if (
    existingConfig.verification.requireEvidenceForReadiness !==
    recommendedConfig.verification.requireEvidenceForReadiness
  ) {
    nextConfig = {
      ...nextConfig,
      verification: {
        ...nextConfig.verification,
        requireEvidenceForReadiness:
          recommendedConfig.verification.requireEvidenceForReadiness,
      },
    };
    refreshedManagedFields = true;
  }

  const refreshedCommands = { ...nextConfig.commands };
  let refreshedCommandFields = false;
  for (const commandName of ['dev', 'build', 'test', 'typecheck', 'lint'] as const) {
    const existingCommand = nextConfig.commands[commandName];
    const recommendedCommand = recommendedConfig.commands[commandName];
    if (
      typeof existingCommand === 'string' &&
      typeof recommendedCommand === 'string' &&
      !existingCommand.startsWith('pnpm ') &&
      recommendedCommand.startsWith('pnpm ')
    ) {
      refreshedCommands[commandName] = recommendedCommand;
      refreshedCommandFields = true;
    }
  }

  if (refreshedCommandFields) {
    nextConfig = {
      ...nextConfig,
      commands: refreshedCommands,
    };
    refreshedManagedFields = true;
  }

  return {
    config: nextConfig,
    refreshedManagedFields,
  };
};
