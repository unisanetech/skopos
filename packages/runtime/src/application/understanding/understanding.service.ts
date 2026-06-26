import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import type {
  SkoposBootstrapArtifact,
  SkoposFeatureInventoryArtifact,
  SkoposImplementationHotspotsArtifact,
  SkoposRepoUnderstandingSummaryArtifact,
  SkoposScopeLite,
  SkoposScopesLiteArtifact,
  SkoposUnderstandingEvidence,
  SkoposUnderstandingRuntimeResult,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface BuildSkoposUnderstandingRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
}

const UNDERSTANDING_DIRECTORY = '.skopos/understanding';
const SUMMARY_PATH = `${UNDERSTANDING_DIRECTORY}/repo-summary.json`;
const FEATURE_INVENTORY_PATH = `${UNDERSTANDING_DIRECTORY}/feature-inventory.json`;
const HOTSPOTS_PATH = `${UNDERSTANDING_DIRECTORY}/hotspots.json`;

export const buildSkoposUnderstandingRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: BuildSkoposUnderstandingRuntimeOptions): Promise<SkoposUnderstandingRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const bootstrap = await readJson<SkoposBootstrapArtifact>(
    join(workspaceRoot, '.skopos', 'bootstrap.json'),
  );
  const scopesLite = await readJson<SkoposScopesLiteArtifact>(
    join(workspaceRoot, '.skopos', 'scopes-lite.json'),
  );
  const generatedAt = new Date().toISOString();
  const summary = buildRepoSummaryArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopesLite.scopes,
  });
  const featureInventory = buildFeatureInventoryArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopesLite.scopes,
  });
  const hotspots = buildHotspotsArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopesLite.scopes,
  });
  const summaryPath = join(workspaceRoot, SUMMARY_PATH);
  const featureInventoryPath = join(workspaceRoot, FEATURE_INVENTORY_PATH);
  const hotspotsPath = join(workspaceRoot, HOTSPOTS_PATH);
  const summaryWrite = await writeJsonArtifact({
    artifactPath: summaryPath,
    artifact: summary,
    dryRun,
  });
  const featureInventoryWrite = await writeJsonArtifact({
    artifactPath: featureInventoryPath,
    artifact: featureInventory,
    dryRun,
  });
  const hotspotsWrite = await writeJsonArtifact({
    artifactPath: hotspotsPath,
    artifact: hotspots,
    dryRun,
  });
  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: 'succeeded',
    summary: `Repo understanding generated with ${featureInventory.features.length} feature areas and ${hotspots.hotspots.length} implementation hotspots.`,
    relatedArtifactPaths: [summaryPath, featureInventoryPath, hotspotsPath],
    metadata: {
      actorId: actorId ?? null,
      featureCount: featureInventory.features.length,
      hotspotCount: hotspots.hotspots.length,
      confidence: bootstrap.detected.confidence,
    },
    dryRun,
  });
  const indexResult = await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    summaryPath,
    featureInventoryPath,
    hotspotsPath,
    indexPath: indexResult.path,
    logPath: logResult.path,
    summaryWrite,
    featureInventoryWrite,
    hotspotsWrite,
    indexWrite: indexResult.write,
    logWrite: logResult.write,
    actorId,
    summary,
    featureInventory,
    hotspots,
  };
};

const buildRepoSummaryArtifact = ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
}): SkoposRepoUnderstandingSummaryArtifact => {
  const packageScopes = pickPackageScopes(scopes);
  const docsEntrypoints = buildDocsEntrypoints(bootstrap);
  const mainAreas = packageScopes.slice(0, 6).map((scope) => ({
    title: scope.title,
    path: scope.path,
    summary: scope.summary,
    confidence: scope.confidence,
  }));
  const stack = [...new Set([...bootstrap.detected.languages, ...bootstrap.detected.frameworks])].slice(0, 10);
  const commandSurface = Object.entries(bootstrap.recommendedConfig.commands)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0)
    .map(([name, command]) => ({ name, command }));
  const purpose = describeRepoPurpose({
    projectName: bootstrap.recommendedConfig.project.name,
    archetype: bootstrap.recommendedConfig.project.archetype,
    repoMode: bootstrap.recommendedConfig.project.repoMode,
    packageCount: bootstrap.detected.packageCount,
    docsEntrypoints,
  });
  const uncertainties = buildUncertainties(bootstrap, packageScopes, docsEntrypoints);

  return {
    schemaVersion: 1,
    id: 'repo-understanding-summary',
    type: 'repo-understanding-summary',
    status: 'generated',
    authority: 'inferred',
    summary: purpose,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    projectName: bootstrap.recommendedConfig.project.name,
    repoMode: bootstrap.recommendedConfig.project.repoMode,
    archetype: bootstrap.recommendedConfig.project.archetype,
    stack,
    purpose,
    mainAreas,
    docsEntrypoints,
    commandSurface,
    uncertainties,
  };
};

const buildFeatureInventoryArtifact = ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
}): SkoposFeatureInventoryArtifact => {
  const docsEntrypoints = buildDocsEntrypoints(bootstrap);
  const features = pickPackageScopes(scopes)
    .slice(0, 12)
    .map((scope) => ({
      id: `feature.${toSlug(scope.id)}`,
      title: scope.title,
      ownerPath: scope.path,
      summary: scope.summary,
      confidence: scope.confidence,
      relatedDocs: docsEntrypoints,
    }));

  return {
    schemaVersion: 1,
    id: 'feature-inventory',
    type: 'feature-inventory',
    status: 'generated',
    authority: 'inferred',
    summary: `${features.length} compact feature area${features.length === 1 ? '' : 's'} inferred from current scopes.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    features,
  };
};

const buildHotspotsArtifact = ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
}): SkoposImplementationHotspotsArtifact => {
  const docsEntrypoints = buildDocsEntrypoints(bootstrap);
  const packageHotspots = pickPackageScopes(scopes)
    .slice(0, 8)
    .map((scope) => ({
      id: `hotspot.${toSlug(scope.id)}`,
      title: scope.title,
      path: scope.path,
      reason: 'Package or workspace area surfaced by the compact scope registry; inspect here first for bounded implementation work.',
      confidence: scope.confidence,
      evidence: [
        {
          label: 'Scope registry',
          path: '.skopos/scopes-lite.json',
        },
      ],
    }));
  const docsHotspots = docsEntrypoints.slice(0, 2).map((entry, index) => ({
    id: `hotspot.docs.${index + 1}`,
    title: entry.label,
    path: entry.path,
    reason: 'Docs entrypoint can explain project-specific rules before editing code.',
    confidence: bootstrap.detected.docsHealth.hasStartHere ? ('high' as const) : ('medium' as const),
    evidence: [entry],
  }));

  return {
    schemaVersion: 1,
    id: 'implementation-hotspots',
    type: 'implementation-hotspots',
    status: 'generated',
    authority: 'inferred',
    summary: `${packageHotspots.length + docsHotspots.length} compact implementation hotspot${packageHotspots.length + docsHotspots.length === 1 ? '' : 's'} inferred from scopes and docs entrypoints.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    hotspots: [...docsHotspots, ...packageHotspots],
  };
};

const pickPackageScopes = (scopes: SkoposScopeLite[]): SkoposScopeLite[] => {
  const packages = scopes.filter((scope) => scope.kind === 'package');
  return packages.length > 0 ? packages : scopes.filter((scope) => scope.kind === 'workspace');
};

const buildDocsEntrypoints = (
  bootstrap: SkoposBootstrapArtifact,
): SkoposUnderstandingEvidence[] => {
  const entries: SkoposUnderstandingEvidence[] = [];
  const startHerePath = bootstrap.recommendedConfig.docs.startHerePath;

  if (startHerePath) {
    entries.push({
      label: 'Start here',
      path: startHerePath,
    });
  }

  for (const docsRoot of bootstrap.detected.docsRoots.slice(0, 3)) {
    if (entries.some((entry) => entry.path === docsRoot)) {
      continue;
    }

    entries.push({
      label: 'Docs root',
      path: docsRoot,
    });
  }

  return entries;
};

const describeRepoPurpose = ({
  projectName,
  archetype,
  repoMode,
  packageCount,
  docsEntrypoints,
}: {
  projectName: string;
  archetype: string;
  repoMode: string;
  packageCount: number;
  docsEntrypoints: SkoposUnderstandingEvidence[];
}): string => {
  const docsPhrase =
    docsEntrypoints.length > 0
      ? ` It has ${docsEntrypoints.length} detected docs entrypoint${docsEntrypoints.length === 1 ? '' : 's'} for project rules.`
      : '';
  return `${projectName} appears to be a ${repoMode} ${archetype} workspace with ${packageCount} package${packageCount === 1 ? '' : 's'}.${docsPhrase}`;
};

const buildUncertainties = (
  bootstrap: SkoposBootstrapArtifact,
  packageScopes: SkoposScopeLite[],
  docsEntrypoints: SkoposUnderstandingEvidence[],
): string[] => {
  const uncertainties: string[] = [];

  if (bootstrap.detected.confidence !== 'high') {
    uncertainties.push('Repo understanding confidence is not high; verify the summary against source and docs before major edits.');
  }

  if (packageScopes.length === 0) {
    uncertainties.push('No package scopes were detected, so feature areas may need manual confirmation.');
  }

  if (docsEntrypoints.length === 0) {
    uncertainties.push('No docs entrypoint was detected, so Skopos cannot confirm project purpose from maintained docs yet.');
  }

  return uncertainties;
};

const readJson = async <T>(artifactPath: string): Promise<T> =>
  JSON.parse(await readFile(artifactPath, 'utf8')) as T;

const toSlug = (value: string): string => {
  const slug = value.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : 'workspace';
};
