import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import {
  loadSkoposConfig,
  reconcileGeneratedSkoposConfig,
  writeSkoposConfig,
} from '@skopos/config';
import {
  buildSkoposReferenceArtifacts,
  buildSkoposBootstrapArtifacts,
  buildSkoposCommandsGraph,
  buildSkoposDocsGraph,
  buildSkoposScopeRelationsGraph,
  buildSkoposWorkspaceGraph,
  loadSkoposWorkflowManifests,
} from '@skopos/indexer';
import {
  buildSkoposEnforcementProfile,
  scaffoldProjectInstructions,
  syncClaudeCodeHookAdapter,
  syncCodexWrapperAdapter,
  syncManualHostAdapter,
} from '@skopos/instructions';
import type {
  SkoposDocsScaffoldArtifact,
  SkoposFallbackRegistryArtifact,
  SkoposGitignoreScaffoldArtifact,
  SkoposInitMode,
  SkoposInitResult,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { refreshSkoposMemoryState } from '../shared/memory-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface InitSkoposProjectOptions {
  cwd: string;
  mode?: SkoposInitMode;
  subtreeTarget?: string;
  actor?: string;
  dryRun?: boolean;
  force?: boolean;
  scaffoldInstructions?: boolean;
  forceInstructions?: boolean;
}

export const initSkoposProject = async ({
  cwd,
  mode = 'existing',
  subtreeTarget,
  actor,
  dryRun = false,
  force = false,
  scaffoldInstructions = true,
  forceInstructions = false,
}: InitSkoposProjectOptions): Promise<SkoposInitResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const configPath = join(workspaceRoot, 'skopos.config.yaml');
  const bootstrapPath = join(workspaceRoot, '.skopos', 'bootstrap.json');
  const scopesLitePath = join(workspaceRoot, '.skopos', 'scopes-lite.json');
  const diagnosisPath = join(workspaceRoot, '.skopos', 'diagnosis.json');
  const architecturePath = join(workspaceRoot, '.skopos', 'architecture.json');
  const enforcementPath = join(workspaceRoot, '.skopos', 'enforcement.json');
  const fallbackRegistryPath = join(workspaceRoot, '.skopos', 'fallbacks', 'registry.json');
  const indexPath = join(workspaceRoot, '.skopos', 'index.json');
  const logPath = join(workspaceRoot, '.skopos', 'log.jsonl');
  const symbolsPath = join(workspaceRoot, '.skopos', 'references', 'symbols.json');
  const duplicatesPath = join(workspaceRoot, '.skopos', 'references', 'duplicates.json');
  const contradictionsPath = join(workspaceRoot, '.skopos', 'references', 'contradictions.json');
  const workspaceGraphPath = join(workspaceRoot, '.skopos', 'graph', 'workspace.json');
  const existingConfig = await loadSkoposConfig(configPath);
  let { bootstrap, scopesLite, diagnosis, architecture } = await buildSkoposBootstrapArtifacts({
    cwd: workspaceRoot,
    mode,
    existingConfig,
    subtreeTarget,
  });
  const configWrite = await writeConfigIfNeeded({
    configPath,
    config: bootstrap.recommendedConfig,
    existingConfig,
    dryRun,
    force,
  });
  const docsScaffold = await scaffoldDocsStartHere({
    workspaceRoot,
    projectName: bootstrap.recommendedConfig.project.name,
    docsRoot: bootstrap.recommendedConfig.docs.root,
    startHerePath: bootstrap.recommendedConfig.docs.startHerePath,
    commands: bootstrap.recommendedConfig.commands,
    dryRun,
  });
  const gitignoreScaffold = await scaffoldGitignore({
    workspaceRoot,
    dryRun,
  });
  const instructionScaffold = scaffoldInstructions
    ? await scaffoldProjectInstructions({
        cwd: workspaceRoot,
        instructionSourcePath: bootstrap.recommendedConfig.agents.canonicalInstructions,
        mode: bootstrap.mode,
        projectName: bootstrap.recommendedConfig.project.name,
        repoMode: bootstrap.recommendedConfig.project.repoMode,
        archetype: bootstrap.recommendedConfig.project.archetype,
        docsRoot: bootstrap.recommendedConfig.docs.root,
        docsStartHerePath: bootstrap.recommendedConfig.docs.startHerePath,
        commands: bootstrap.recommendedConfig.commands,
        dryRun,
        force: forceInstructions,
      })
    : undefined;

  if (
    !dryRun &&
    (docsScaffold.status === 'written' ||
      docsScaffold.status === 'updated-placeholder' ||
      (instructionScaffold &&
        (instructionScaffold.status === 'written' ||
          instructionScaffold.status === 'overwritten' ||
          instructionScaffold.status === 'updated-contract')))
  ) {
    ({ bootstrap, scopesLite, diagnosis, architecture } = await buildSkoposBootstrapArtifacts({
      cwd: workspaceRoot,
      mode,
      existingConfig: bootstrap.recommendedConfig,
      subtreeTarget,
    }));
  }

  const workflows = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const enforcement = buildSkoposEnforcementProfile({
    cwd: workspaceRoot,
    workflows,
    instructionSourcePath: bootstrap.recommendedConfig.agents.canonicalInstructions,
  });
  const references = await buildSkoposReferenceArtifacts({
    cwd: workspaceRoot,
    subtreeTarget,
    diagnosis,
    architecture,
  });
  const workspaceGraph = buildSkoposWorkspaceGraph({
    workspaceRoot,
    bootstrap,
    scopesLite,
    workflows,
  });
  const docsGraph = buildSkoposDocsGraph({
    workspaceRoot,
    scopesLite,
    workflows,
  });
  const commandsGraph = buildSkoposCommandsGraph({
    workspaceRoot,
    bootstrap,
    scopesLite,
    workflows,
  });
  const scopeRelationsGraph = await buildSkoposScopeRelationsGraph({
    workspaceRoot,
    scopesLite,
  });

  const bootstrapWrite = await writeBootstrap({
    bootstrapPath,
    bootstrap,
    dryRun,
  });
  const scopesLiteWrite = await writeScopesLite({
    scopesLitePath,
    scopesLite,
    dryRun,
  });
  const diagnosisWrite = await writeDiagnosis({
    diagnosisPath,
    diagnosis,
    dryRun,
  });
  const architectureWrite = await writeArchitecture({
    architecturePath,
    architecture,
    dryRun,
  });
  const enforcementWrite = await writeJsonArtifact({
    artifactPath: enforcementPath,
    artifact: enforcement,
    dryRun,
  });
  const fallbackRegistry = buildFallbackRegistryArtifact({
    projectMode: bootstrap.recommendedConfig.project.mode,
  });
  const fallbackRegistryWrite = await writeJsonArtifact({
    artifactPath: fallbackRegistryPath,
    artifact: fallbackRegistry,
    dryRun,
  });
  const symbolsWrite = await writeJsonArtifact({
    artifactPath: symbolsPath,
    artifact: references.symbols,
    dryRun,
  });
  const duplicatesWrite = await writeJsonArtifact({
    artifactPath: duplicatesPath,
    artifact: references.duplicates,
    dryRun,
  });
  const contradictionsWrite = await writeJsonArtifact({
    artifactPath: contradictionsPath,
    artifact: references.contradictions,
    dryRun,
  });
  await syncClaudeCodeHookAdapter({
    cwd: workspaceRoot,
    dryRun,
  });
  await syncCodexWrapperAdapter({
    cwd: workspaceRoot,
    dryRun,
  });
  await syncManualHostAdapter({
    cwd: workspaceRoot,
    dryRun,
  });
  const workspaceGraphWrite = await writeJsonArtifact({
    artifactPath: workspaceGraphPath,
    artifact: workspaceGraph,
    dryRun,
  });
  const docsGraphPath = join(workspaceRoot, '.skopos', 'graph', 'docs.json');
  const commandsGraphPath = join(workspaceRoot, '.skopos', 'graph', 'commands.json');
  const scopeRelationsGraphPath = join(workspaceRoot, '.skopos', 'graph', 'scope-relations.json');
  const docsGraphWrite = await writeJsonArtifact({
    artifactPath: docsGraphPath,
    artifact: docsGraph,
    dryRun,
  });
  const commandsGraphWrite = await writeJsonArtifact({
    artifactPath: commandsGraphPath,
    artifact: commandsGraph,
    dryRun,
  });
  const scopeRelationsGraphWrite = await writeJsonArtifact({
    artifactPath: scopeRelationsGraphPath,
    artifact: scopeRelationsGraph,
    dryRun,
  });
  const logWrite = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'init',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Skopos init ${dryRun ? 'previewed' : 'compiled'} ${bootstrap.mode} workspace state.`,
    relatedArtifactPaths: [
      configPath,
      bootstrapPath,
      scopesLitePath,
      diagnosisPath,
      architecturePath,
      enforcementPath,
      fallbackRegistryPath,
      symbolsPath,
      duplicatesPath,
      contradictionsPath,
      workspaceGraphPath,
      docsGraphPath,
      commandsGraphPath,
      scopeRelationsGraphPath,
      docsScaffold.path,
      gitignoreScaffold.path,
      ...(instructionScaffold ? [instructionScaffold.path] : []),
    ],
    metadata: {
      actorId: actorId ?? null,
      mode: bootstrap.mode,
      repoMode: bootstrap.detected.repoMode,
      archetype: bootstrap.detected.archetypeSuggestion,
      focusSubtree: bootstrap.focusSubtree ?? null,
      packageCount: bootstrap.detected.packageCount,
      workspacePackageCount: bootstrap.detected.workspacePackageCount,
      instructionScaffoldStatus: instructionScaffold?.status ?? null,
      instructionScaffoldPath: instructionScaffold?.relativePath ?? null,
      docsScaffoldStatus: docsScaffold.status,
      docsScaffoldPath: docsScaffold.relativePath,
      gitignoreScaffoldStatus: gitignoreScaffold.status,
      gitignoreScaffoldPath: gitignoreScaffold.relativePath,
    },
    dryRun,
  });
  const memoryState = await refreshSkoposMemoryState({
    workspaceRoot,
    dryRun,
  });
  const indexWrite = await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    configPath,
    bootstrapPath,
    memoryPath: memoryState.memoryPath,
    communicationBriefPath: memoryState.communicationBriefPath,
    scopesLitePath,
    diagnosisPath,
    architecturePath,
    enforcementPath,
    fallbackRegistryPath,
    indexPath,
    logPath,
    workspaceGraphPath,
    graphArtifacts: [
      {
        id: workspaceGraph.id,
        kind: workspaceGraph.graphKind,
        path: workspaceGraphPath,
        write: workspaceGraphWrite,
      },
      {
        id: docsGraph.id,
        kind: docsGraph.graphKind,
        path: docsGraphPath,
        write: docsGraphWrite,
      },
      {
        id: commandsGraph.id,
        kind: commandsGraph.graphKind,
        path: commandsGraphPath,
        write: commandsGraphWrite,
      },
      {
        id: scopeRelationsGraph.id,
        kind: scopeRelationsGraph.graphKind,
        path: scopeRelationsGraphPath,
        write: scopeRelationsGraphWrite,
      },
    ],
    referenceArtifacts: [
      {
        id: 'symbols',
        path: symbolsPath,
        write: symbolsWrite,
      },
      {
        id: 'duplicates',
        path: duplicatesPath,
        write: duplicatesWrite,
      },
      {
        id: 'contradictions',
        path: contradictionsPath,
        write: contradictionsWrite,
      },
    ],
    toolAdapterArtifacts: enforcement.toolAdapters,
    docsScaffold,
    gitignoreScaffold,
    instructionScaffold,
    configWrite,
    bootstrapWrite,
    scopesLiteWrite,
    diagnosisWrite,
    architectureWrite,
    enforcementWrite,
    fallbackRegistryWrite,
    indexWrite: indexWrite.write,
    memoryWrite: memoryState.memoryWrite,
    communicationBriefWrite: memoryState.communicationBriefWrite,
    logWrite: logWrite.write,
    workspaceGraphWrite,
    actorId,
    bootstrap,
    scopesLite,
    diagnosis,
    architecture,
    enforcement,
    fallbackRegistry,
  };
};

const buildFallbackRegistryArtifact = ({
  projectMode,
}: {
  projectMode?: SkoposFallbackRegistryArtifact['projectMode'];
}): SkoposFallbackRegistryArtifact => {
  const now = new Date().toISOString();

  return {
    schemaVersion: 1,
    id: 'fallback-registry',
    type: 'fallback-registry',
    status: 'generated',
    authority: 'generated',
    summary: 'Registry of accepted durable fallbacks and compatibility exceptions for agent cleanup work.',
    generatedAt: now,
    updatedAt: now,
    projectMode,
    policy:
      'If an agent keeps a fallback, shim, duplicate path, or compatibility layer, it must be recorded here with an owner, reason, affected surface, and removal condition or compatibility note. Empty entries means no durable fallbacks are currently accepted.',
    entries: [],
  };
};

const scaffoldDocsStartHere = async ({
  workspaceRoot,
  projectName,
  docsRoot,
  startHerePath,
  commands,
  dryRun,
}: {
  workspaceRoot: string;
  projectName: string;
  docsRoot: string;
  startHerePath?: string;
  commands: Record<string, string | undefined>;
  dryRun: boolean;
}): Promise<SkoposDocsScaffoldArtifact> => {
  const relativePath = startHerePath ?? join(docsRoot, '00-start-here.md');
  const absolutePath = resolve(workspaceRoot, relativePath);

  if (existsSync(absolutePath)) {
    const existing = await readTextIfExists(absolutePath);
    if (existing && isGeneratedStartHerePlaceholder(existing)) {
      if (!dryRun) {
        await writeFile(
          absolutePath,
          buildStartHereContents({
            projectName,
            docsRoot,
            commands,
            links: await collectStartHereLinks({
              workspaceRoot,
              docsRoot,
              startHerePath: relativePath,
            }),
          }),
          'utf8',
        );
      }

      return {
        path: absolutePath,
        relativePath,
        status: dryRun ? 'dry-run' : 'updated-placeholder',
        title: `${projectName} Docs Start`,
      };
    }

    return {
      path: absolutePath,
      relativePath,
      status: 'skipped-existing',
      title: `${projectName} Docs Start`,
    };
  }

  if (!dryRun) {
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(
      absolutePath,
      buildStartHereContents({
        projectName,
        docsRoot,
        commands,
        links: await collectStartHereLinks({
          workspaceRoot,
          docsRoot,
          startHerePath: relativePath,
        }),
      }),
      'utf8',
    );
  }

  return {
    path: absolutePath,
    relativePath: relative(workspaceRoot, absolutePath),
    status: dryRun ? 'dry-run' : 'written',
    title: `${projectName} Docs Start`,
  };
};

interface StartHereLink {
  label: string;
  path: string;
  reason: string;
}

const buildStartHereContents = ({
  projectName,
  docsRoot,
  commands,
  links,
}: {
  projectName: string;
  docsRoot: string;
  commands: Record<string, string | undefined>;
  links: StartHereLink[];
}): string => `# ${projectName} Start Here

This is the first page to read before changing the project. It points agents to the existing project rules, docs, and validation commands without replacing the current documentation.

## Read First

${formatStartHereLinks(links)}

## What To Keep Here

- Links to the most important project docs.
- Notes about where project rules live when they are not obvious.
- Updates only when the project source of truth changes.

## Validation

${formatStartHereCommands(commands)}

## Docs Home

Durable project docs should stay under \`${docsRoot}/\` unless the team chooses another source of truth. Keep this page as a small router, not a second copy of every rule.
`;

const formatStartHereCommands = (commands: Record<string, string | undefined>): string => {
  const entries = Object.entries(commands).filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()));

  if (entries.length === 0) {
    return 'No validation commands were detected yet. Confirm the project commands before broad agent work.';
  }

  return entries.map(([name, command]) => `- ${name}: \`${command}\``).join('\n');
};

const formatStartHereLinks = (links: StartHereLink[]): string => {
  if (links.length === 0) {
    return '- `README.md` - Project overview, if present.\n- `AGENTS.md` - Agent working rules, if present.';
  }

  return links.map((link) => `- \`${link.path}\` - ${link.reason}`).join('\n');
};

const isGeneratedStartHerePlaceholder = (contents: string): boolean =>
  contents.includes('This is the project knowledge start page for Skopos.') &&
  contents.includes('Add the current product goal, architecture notes, and important workflow links here');

const collectStartHereLinks = async ({
  workspaceRoot,
  docsRoot,
  startHerePath,
}: {
  workspaceRoot: string;
  docsRoot: string;
  startHerePath: string;
}): Promise<StartHereLink[]> => {
  const candidates: StartHereLink[] = [
    {
      label: 'Agent rules',
      path: 'AGENTS.md',
      reason: 'Agent working rules and project-specific guardrails.',
    },
    {
      label: 'Project overview',
      path: 'README.md',
      reason: 'Project overview and setup notes.',
    },
  ];
  const agentsContents = await readTextIfExists(join(workspaceRoot, 'AGENTS.md'));
  const docsMentionPaths = extractDocsMentionPaths(agentsContents ?? '').slice(0, 8);

  for (const path of docsMentionPaths) {
    candidates.push({
      label: path,
      path,
      reason: 'Canonical project documentation referenced by AGENTS.md.',
    });
  }

  const docsDirectory = resolve(workspaceRoot, docsRoot);
  let docsEntries: string[] = [];

  try {
    const { readdir } = await import('node:fs/promises');
    docsEntries = (await readdir(docsDirectory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => join(docsRoot, entry.name))
      .filter((path) => path !== startHerePath)
      .sort()
      .slice(0, 6);
  } catch {
    docsEntries = [];
  }

  for (const path of docsEntries) {
    if (candidates.some((candidate) => candidate.path === path)) {
      continue;
    }

    candidates.push({
      label: path,
      path,
      reason: 'Existing project documentation.',
    });
  }

  const existing = await Promise.all(
    candidates.map(async (candidate) => ({
      candidate,
      exists: Boolean(await readTextIfExists(join(workspaceRoot, candidate.path))),
    })),
  );

  return existing.filter((entry) => entry.exists).map((entry) => entry.candidate);
};

const extractDocsMentionPaths = (contents: string): string[] =>
  Array.from(
    new Set(
      [...contents.matchAll(/(?:`|\b)(docs\/[A-Za-z0-9._/-]+\.md)(?:`|\b)/g)]
        .map((match) => match[1])
        .filter((path): path is string => Boolean(path)),
    ),
  );

const scaffoldGitignore = async ({
  workspaceRoot,
  dryRun,
}: {
  workspaceRoot: string;
  dryRun: boolean;
}): Promise<SkoposGitignoreScaffoldArtifact> => {
  const gitignorePath = join(workspaceRoot, '.gitignore');
  const existing = await readTextIfExists(gitignorePath);
  const ignoredPaths = ['.skopos/', 'docs/generated/skopos/'];
  const missingEntries = ignoredPaths.filter((entry) => !hasGitignoreEntry(existing ?? '', entry));

  if (missingEntries.length === 0) {
    return {
      path: gitignorePath,
      relativePath: '.gitignore',
      status: 'skipped-existing',
      ignoredPaths,
    };
  }

  if (!dryRun) {
    const block = [
      '# Skopos generated local state',
      ...missingEntries,
    ].join('\n');
    const next = existing ? `${existing.trimEnd()}\n\n${block}\n` : `${block}\n`;
    await writeFile(gitignorePath, next, 'utf8');
  }

  return {
    path: gitignorePath,
    relativePath: '.gitignore',
    status: dryRun ? 'dry-run' : 'written',
    ignoredPaths,
  };
};

const hasGitignoreEntry = (contents: string, entry: string): boolean =>
  contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .some((line) => line === entry);

const readTextIfExists = async (path: string): Promise<string | undefined> => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return undefined;
  }
};

interface WriteConfigIfNeededOptions {
  configPath: string;
  config: NonNullable<SkoposInitResult['bootstrap']>['recommendedConfig'];
  existingConfig: NonNullable<SkoposInitResult['bootstrap']>['recommendedConfig'] | null;
  dryRun: boolean;
  force: boolean;
}

const writeConfigIfNeeded = async ({
  configPath,
  config,
  existingConfig,
  dryRun,
  force,
}: WriteConfigIfNeededOptions): Promise<SkoposInitResult['configWrite']> => {
  if (dryRun) {
    return 'dry-run';
  }

  if (existingConfig && !force) {
    const reconciliation = reconcileGeneratedSkoposConfig({
      existingConfig,
      recommendedConfig: config,
    });

    if (
      reconciliation.refreshedManagedFields &&
      JSON.stringify(reconciliation.config) === JSON.stringify(config)
    ) {
      await writeSkoposConfig(configPath, config);
      return 'refreshed-stale';
    }

    return 'skipped-existing';
  }

  await writeSkoposConfig(configPath, config);

  return 'written';
};

interface WriteBootstrapOptions {
  bootstrapPath: string;
  bootstrap: SkoposInitResult['bootstrap'];
  dryRun: boolean;
}

const writeBootstrap = async ({
  bootstrapPath,
  bootstrap,
  dryRun,
}: WriteBootstrapOptions): Promise<SkoposInitResult['bootstrapWrite']> => {
  return writeJsonArtifact({
    artifactPath: bootstrapPath,
    artifact: bootstrap,
    dryRun,
  });
};

interface WriteScopesLiteOptions {
  scopesLitePath: string;
  scopesLite: SkoposInitResult['scopesLite'];
  dryRun: boolean;
}

const writeScopesLite = async ({
  scopesLitePath,
  scopesLite,
  dryRun,
}: WriteScopesLiteOptions): Promise<SkoposInitResult['scopesLiteWrite']> => {
  return writeJsonArtifact({
    artifactPath: scopesLitePath,
    artifact: scopesLite,
    dryRun,
  });
};

interface WriteDiagnosisOptions {
  diagnosisPath: string;
  diagnosis: SkoposInitResult['diagnosis'];
  dryRun: boolean;
}

const writeDiagnosis = async ({
  diagnosisPath,
  diagnosis,
  dryRun,
}: WriteDiagnosisOptions): Promise<SkoposInitResult['diagnosisWrite']> => {
  return writeJsonArtifact({
    artifactPath: diagnosisPath,
    artifact: diagnosis,
    dryRun,
  });
};

interface WriteArchitectureOptions {
  architecturePath: string;
  architecture: SkoposInitResult['architecture'];
  dryRun: boolean;
}

const writeArchitecture = async ({
  architecturePath,
  architecture,
  dryRun,
}: WriteArchitectureOptions): Promise<SkoposInitResult['architectureWrite']> => {
  return writeJsonArtifact({
    artifactPath: architecturePath,
    artifact: architecture,
    dryRun,
  });
};
