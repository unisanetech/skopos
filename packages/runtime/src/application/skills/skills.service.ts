import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadSkoposProjectSkillBindings,
  loadSkoposSkillPacks,
  loadSkoposWorkflowManifests,
  buildSkoposCombinedSkillSourceDigest,
  buildSkoposSkillSourceDigest,
} from '@skopos/indexer';
import type {
  SkoposLoadedProjectSkillBinding,
  SkoposLoadedSkillPack,
} from '@skopos/indexer';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposExecutionLane,
  SkoposSkillHostProjectionArtifact,
  SkoposSkillHostProjectionEntry,
  SkoposProjectLifecycle,
  SkoposResolvedGatesArtifact,
  SkoposResolvedSkillArtifact,
  SkoposSelectedSkill,
  SkoposSkillRecommendationArtifact,
  SkoposSkillRecommendationEntry,
  SkoposTaskContract,
} from '@skopos/model';
import { SKOPOS_SKILL_PROJECTION_HOST_IDS } from '@skopos/model';

import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export const SKILL_RECOMMENDATIONS_ARTIFACT_PATH = '.skopos/skills/recommendations.json';
export const RESOLVED_SKILLS_ARTIFACT_PATH = '.skopos/skills/resolved.json';
export const SKILL_PROJECTIONS_ARTIFACT_DIRECTORY = '.skopos/skills/projections';

const BUNDLED_SKILL_PACK_ROOT = join(dirname(fileURLToPath(import.meta.url)), 'skill-packs');
const SOURCE_SKILL_PACK_ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  '..',
  'skill-packs',
);
const RESOLVED_GATES_ARTIFACT_PATH = '.skopos/gates/resolved.json';

export const listSkoposSkillPacksRuntime = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposLoadedSkillPack[]> =>
  loadSkoposSkillPacks({
    cwd: resolve(cwd),
    packRoots: ['skill-packs', BUNDLED_SKILL_PACK_ROOT, SOURCE_SKILL_PACK_ROOT],
  });

export const listSkoposProjectSkillBindingsRuntime = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposLoadedProjectSkillBinding[]> =>
  loadSkoposProjectSkillBindings({ cwd: resolve(cwd) });

export const showSkoposSkillPackRuntime = async ({
  cwd,
  pack,
}: {
  cwd: string;
  pack: string;
}): Promise<SkoposLoadedSkillPack> => {
  const match = (await listSkoposSkillPacksRuntime({ cwd })).find(
    (candidate) =>
      candidate.packId === pack || candidate.id === pack || candidate.sourcePath === pack,
  );
  if (!match) throw new Error(`Unknown Skopos skill pack: ${pack}`);
  return match;
};

export interface SkoposSkillBindingValidation {
  status: 'pass' | 'fail';
  diagnostics: string[];
  missingRequiredRoles: string[];
  missingRecommendedRoles: string[];
}

export const validateSkoposProjectSkillBindingRuntime = async ({
  cwd,
  pack,
  binding,
  operatingModel,
}: {
  cwd: string;
  pack: SkoposLoadedSkillPack;
  binding: SkoposLoadedProjectSkillBinding;
  operatingModel?: SkoposAgentNativeOperatingModel;
}): Promise<SkoposSkillBindingValidation> => {
  const workspaceRoot = resolve(cwd);
  const diagnostics: string[] = [];
  if (binding.packId !== pack.packId) {
    diagnostics.push(`Binding ${binding.bindingId} targets ${binding.packId}, not ${pack.packId}.`);
  }
  if (binding.packVersion !== pack.version) {
    diagnostics.push(
      `Binding ${binding.bindingId} targets ${binding.packVersion}, not ${pack.version}.`,
    );
  }
  if (binding.lifecycle === 'rejected' || binding.lifecycle === 'retired') {
    diagnostics.push(`Binding ${binding.bindingId} is ${binding.lifecycle}.`);
  }

  const availableActionIds = new Set(operatingModel?.actions.map((entry) => entry.id) ?? []);
  const availableGuardIds = new Set(operatingModel?.guards.map((entry) => entry.id) ?? []);
  const missingRequiredRoles = [
    ...pack.requiredProjectRoles.context.filter(
      (role) => !binding.sourceBindings[role]?.length,
    ),
    ...pack.requiredProjectRoles.actions.filter((role) => !binding.actionBindings[role]),
    ...pack.requiredProjectRoles.guards.filter((role) => !binding.guardBindings[role]),
  ];
  const missingRecommendedRoles = [
    ...pack.requiredProjectRoles.recommendedContext.filter(
      (role) => !binding.sourceBindings[role]?.length,
    ),
    ...pack.requiredProjectRoles.recommendedActions.filter(
      (role) => !binding.actionBindings[role],
    ),
    ...pack.requiredProjectRoles.recommendedGuards.filter(
      (role) => !binding.guardBindings[role],
    ),
  ];

  for (const [role, paths] of Object.entries(binding.sourceBindings)) {
    for (const path of paths) {
      if (!(await pathExists(resolve(workspaceRoot, path)))) {
        diagnostics.push(`Binding ${binding.bindingId} context role ${role} is missing ${path}.`);
      }
    }
  }
  if (operatingModel) {
    for (const [role, actionId] of Object.entries(binding.actionBindings)) {
      if (!availableActionIds.has(actionId)) {
        diagnostics.push(
          `Binding ${binding.bindingId} action role ${role} references unknown action ${actionId}.`,
        );
      }
    }
    for (const [role, guardId] of Object.entries(binding.guardBindings)) {
      if (!availableGuardIds.has(guardId)) {
        diagnostics.push(
          `Binding ${binding.bindingId} guard role ${role} references unknown guard ${guardId}.`,
        );
      }
    }
  }
  if (missingRequiredRoles.length > 0) {
    diagnostics.push(
      `Binding ${binding.bindingId} is missing required roles: ${missingRequiredRoles.join(', ')}.`,
    );
  }

  return {
    status: diagnostics.length === 0 ? 'pass' : 'fail',
    diagnostics,
    missingRequiredRoles,
    missingRecommendedRoles,
  };
};

export const recommendSkoposSkillPacksRuntime = async ({
  cwd,
  dryRun = false,
}: {
  cwd: string;
  dryRun?: boolean;
}): Promise<SkoposSkillRecommendationArtifact> => {
  const workspaceRoot = resolve(cwd);
  const [packs, bindings, resolvedSkills, operatingModel] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    readJsonIfExists<SkoposResolvedSkillArtifact>(
      join(workspaceRoot, RESOLVED_SKILLS_ARTIFACT_PATH),
    ),
    loadOperatingModelCapabilities(workspaceRoot),
  ]);
  const lifecycle = await inferProjectLifecycle(workspaceRoot);
  const acceptedIds = new Set(resolvedSkills?.acceptedSkills.map((entry) => entry.packId) ?? []);
  const recommendations: SkoposSkillRecommendationEntry[] = [];

  for (const pack of packs) {
    const binding = bindings.find(
      (entry) => entry.packId === pack.packId && entry.packVersion === pack.version,
    );
    const validation = binding
      ? await validateSkoposProjectSkillBindingRuntime({
          cwd: workspaceRoot,
          pack,
          binding,
          operatingModel,
        })
      : undefined;
    const lifecycleMatch = pack.projectLifecycles.includes(lifecycle);
    const accepted = acceptedIds.has(pack.packId);
    const missingRequiredRoles =
      validation?.missingRequiredRoles ?? flattenRequiredRoles(pack);

    recommendations.push({
      packId: pack.packId,
      version: pack.version,
      family: pack.family,
      displayName: pack.displayName,
      confidence: binding && validation?.status === 'pass' ? 'high' : 'medium',
      recommendation: accepted
        ? 'review'
        : binding && validation?.status === 'pass' && lifecycleMatch
          ? 'adopt'
          : lifecycleMatch
            ? 'review'
            : 'avoid',
      reason: accepted
        ? `${pack.displayName} is already accepted; review it when sources, roles, or version change.`
        : !lifecycleMatch
          ? `${pack.displayName} does not target the inferred ${lifecycle} lifecycle.`
          : !binding
            ? `${pack.displayName} fits this lifecycle but needs a project binding before adoption.`
            : validation?.status === 'pass'
              ? `${pack.displayName} has a complete project binding and can be adopted with explicit approval.`
              : `${pack.displayName} needs binding corrections before adoption: ${validation?.diagnostics.join(' ')}`,
      accepted,
      signals: pack.appliesWhen,
      antiSignals: lifecycleMatch ? [] : pack.avoidWhen,
      missingRequiredRoles,
      sourcePath: pack.sourcePath,
      bindingPath: binding?.sourcePath,
    });
  }

  const artifact: SkoposSkillRecommendationArtifact = {
    schemaVersion: 1,
    id: 'skill-recommendations',
    type: 'skill-recommendations',
    status: 'generated',
    authority: 'generated',
    summary: `Skopos evaluated ${packs.length} skill pack${packs.length === 1 ? '' : 's'} for ${lifecycle}.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    projectLifecycle: lifecycle,
    recommendations,
  };
  await writeJsonArtifact({
    artifactPath: join(workspaceRoot, SKILL_RECOMMENDATIONS_ARTIFACT_PATH),
    artifact,
    dryRun,
  });
  return artifact;
};

export const applySkoposSkillPackRuntime = async ({
  cwd,
  pack: packId,
  binding: bindingId,
  actor,
  reason,
  dryRun = false,
}: {
  cwd: string;
  pack: string;
  binding: string;
  actor?: string;
  reason: string;
  dryRun?: boolean;
}): Promise<{
  artifact: SkoposResolvedSkillArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  projections: SkoposSkillHostProjectionArtifact[];
  projectionWrites: Array<{ path: string; status: 'written' | 'dry-run' }>;
  actorId: string;
}> => {
  const workspaceRoot = resolve(cwd);
  if (!actor?.trim()) throw new Error('Skill adoption requires an explicit actor.');
  if (!reason.trim()) throw new Error('Skill adoption requires an explicit reason.');
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) throw new Error('Skill adoption requires an explicit actor.');
  const [pack, bindings, operatingModel] = await Promise.all([
    showSkoposSkillPackRuntime({ cwd: workspaceRoot, pack: packId }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    loadOperatingModelCapabilities(workspaceRoot),
  ]);
  const binding = bindings.find(
    (candidate) =>
      candidate.bindingId === bindingId || candidate.sourcePath === bindingId,
  );
  if (!binding) throw new Error(`Unknown project skill binding: ${bindingId}`);
  const validation = await validateSkoposProjectSkillBindingRuntime({
    cwd: workspaceRoot,
    pack,
    binding,
    operatingModel,
  });
  if (validation.status === 'fail') {
    throw new Error(`Cannot adopt ${pack.packId}: ${validation.diagnostics.join(' ')}`);
  }

  const artifactPath = join(workspaceRoot, RESOLVED_SKILLS_ARTIFACT_PATH);
  const existing = await readJsonIfExists<SkoposResolvedSkillArtifact>(artifactPath);
  const acceptedAt = new Date().toISOString();
  const acceptedSkills = [
    ...(existing?.acceptedSkills.filter((entry) => entry.packId !== pack.packId) ?? []),
    {
      packId: pack.packId,
      version: pack.version,
      bindingId: binding.bindingId,
      acceptedAt,
      acceptedBy: actorId,
      reason,
      sourcePath: pack.sourcePath,
      bindingPath: binding.sourcePath,
    },
  ].sort((left, right) => left.packId.localeCompare(right.packId));
  const artifact: SkoposResolvedSkillArtifact = {
    schemaVersion: 1,
    id: 'resolved-skills',
    type: 'resolved-skills',
    status: 'generated',
    authority: 'generated',
    summary: `${acceptedSkills.length} project-adapted skill pack${acceptedSkills.length === 1 ? '' : 's'} accepted.`,
    updatedAt: acceptedAt,
    generatedAt: acceptedAt,
    workspaceRoot,
    acceptedSkills,
    sourcePaths: [...new Set(acceptedSkills.map((entry) => entry.sourcePath))],
    bindingPaths: [...new Set(acceptedSkills.map((entry) => entry.bindingPath))],
  };
  const artifactWrite = await writeJsonArtifact({ artifactPath, artifact, dryRun });
  const projectionResult = await buildSkoposSkillHostProjectionsRuntime({
    cwd: workspaceRoot,
    resolvedSkills: artifact,
    dryRun,
  });
  return {
    artifact,
    artifactPath,
    artifactWrite,
    projections: projectionResult.projections,
    projectionWrites: projectionResult.writes,
    actorId,
  };
};

export const buildSkoposSkillHostProjectionsRuntime = async ({
  cwd,
  resolvedSkills: providedResolvedSkills,
  dryRun = false,
}: {
  cwd: string;
  resolvedSkills?: SkoposResolvedSkillArtifact;
  dryRun?: boolean;
}): Promise<{
  projections: SkoposSkillHostProjectionArtifact[];
  writes: Array<{ path: string; status: 'written' | 'dry-run' }>;
}> => {
  const workspaceRoot = resolve(cwd);
  const resolvedSkills =
    providedResolvedSkills ??
    (await readJsonIfExists<SkoposResolvedSkillArtifact>(
      join(workspaceRoot, RESOLVED_SKILLS_ARTIFACT_PATH),
    ));
  if (!resolvedSkills) return { projections: [], writes: [] };
  const [packs, bindings, operatingModel] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    loadOperatingModelCapabilities(workspaceRoot),
  ]);
  const skills: SkoposSkillHostProjectionEntry[] = [];

  for (const accepted of resolvedSkills.acceptedSkills) {
    const pack = packs.find(
      (candidate) =>
        candidate.packId === accepted.packId && candidate.version === accepted.version,
    );
    const binding = bindings.find((candidate) => candidate.bindingId === accepted.bindingId);
    if (!pack || !binding) {
      throw new Error(`Cannot project accepted skill ${accepted.packId}: source is missing.`);
    }
    const validation = await validateSkoposProjectSkillBindingRuntime({
      cwd: workspaceRoot,
      pack,
      binding,
      operatingModel,
    });
    if (validation.status === 'fail') {
      throw new Error(
        `Cannot project accepted skill ${accepted.packId}: ${validation.diagnostics.join(' ')}`,
      );
    }
    const sourcePaths = buildSkoposSkillProjectionSourcePaths(pack, binding);
    const digest = await buildSkoposSkillSourceDigest({
      cwd: workspaceRoot,
      sourcePaths,
    });
    if (digest.missingPaths.length > 0) {
      throw new Error(
        `Cannot project accepted skill ${accepted.packId}; missing sources: ${digest.missingPaths.join(', ')}.`,
      );
    }
    skills.push({
      packId: pack.packId,
      version: pack.version,
      bindingId: binding.bindingId,
      selectedBy: 'skopos-task-admission',
      moduleIds: pack.contextModules.map((module) => module.id),
      capabilities: {
        actionIds: [...new Set(Object.values(binding.actionBindings))].sort(),
        guardIds: [...new Set(Object.values(binding.guardBindings))].sort(),
      },
      sourcePaths: digest.sourcePaths,
      sourceDigest: digest.digest,
    });
  }

  skills.sort((left, right) => left.packId.localeCompare(right.packId));
  const sourceDigest = buildSkoposCombinedSkillSourceDigest(skills);
  const generatedAt = new Date().toISOString();
  const acceptedSkillPackIds = skills.map((skill) => skill.packId);
  const projections = SKOPOS_SKILL_PROJECTION_HOST_IDS.map(
    (hostId): SkoposSkillHostProjectionArtifact => ({
      schemaVersion: 1,
      id: `skill-host-projection.${hostId}`,
      type: 'skill-host-projection',
      status: 'generated',
      authority: 'generated',
      summary: `Projected ${skills.length} accepted skill pack${skills.length === 1 ? '' : 's'} for ${hostId}.`,
      updatedAt: generatedAt,
      generatedAt,
      workspaceRoot,
      hostId,
      sourceAuthority: 'skopos-resolved-skills',
      resolvedSkillsPath: RESOLVED_SKILLS_ARTIFACT_PATH,
      acceptedSkillPackIds,
      sourceDigest,
      skills,
    }),
  );
  const writes = await Promise.all(
    projections.map(async (projection) => {
      const path = join(
        workspaceRoot,
        SKILL_PROJECTIONS_ARTIFACT_DIRECTORY,
        `${projection.hostId}.json`,
      );
      const status = await writeJsonArtifact({ artifactPath: path, artifact: projection, dryRun });
      return { path, status };
    }),
  );
  return { projections, writes };
};

export const selectSkoposSkillsForTaskRuntime = async ({
  cwd,
  task,
  riskLane,
  changedPaths = [],
  operatingModel,
}: {
  cwd: string;
  task: SkoposTaskContract;
  riskLane: SkoposExecutionLane;
  changedPaths?: string[];
  operatingModel: SkoposAgentNativeOperatingModel;
}): Promise<{ selectedSkills: SkoposSelectedSkill[]; diagnostics: string[] }> => {
  const workspaceRoot = resolve(cwd);
  const resolvedSkills = await readJsonIfExists<SkoposResolvedSkillArtifact>(
    join(workspaceRoot, RESOLVED_SKILLS_ARTIFACT_PATH),
  );
  if (!resolvedSkills) return { selectedSkills: [], diagnostics: [] };
  const [packs, bindings] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
  ]);
  const selectedSkills: SkoposSelectedSkill[] = [];
  const diagnostics: string[] = [];
  const taskText = [
    task.goal,
    task.scope.scope.id,
    task.scope.scope.title,
    task.scope.scope.path,
    ...changedPaths,
  ].join(' ');

  for (const accepted of resolvedSkills.acceptedSkills) {
    const pack = packs.find(
      (candidate) =>
        candidate.packId === accepted.packId && candidate.version === accepted.version,
    );
    const binding = bindings.find((candidate) => candidate.bindingId === accepted.bindingId);
    if (!pack || !binding) {
      diagnostics.push(`Accepted skill ${accepted.packId} is missing its pack or binding source.`);
      continue;
    }
    if (!pack.riskLanes.includes(riskLane)) continue;
    const validation = await validateSkoposProjectSkillBindingRuntime({
      cwd: workspaceRoot,
      pack,
      binding,
      operatingModel,
    });
    if (validation.status === 'fail') {
      diagnostics.push(...validation.diagnostics);
      continue;
    }
    const negativeMatch =
      pack.selection.blockOnMatchingAntiSignal &&
      (pack.notFor.some((entry) => hasStrongRelevantTerms(taskText, entry)) ||
        pack.avoidWhen.some((entry) =>
          hasStrongRelevantTerms(taskText, `${entry.summary} ${entry.evidence.join(' ')}`),
        ));
    if (negativeMatch) continue;

    const rankedModules = pack.contextModules
      .map((module) => ({
        module,
        score: relevanceScore(
          taskText,
          `${module.title} ${module.summary} ${module.triggers.join(' ')} ${module.appliesTo.join(' ')}`,
        ),
      }))
      .filter(({ module, score }) => score > 0 || module.importance === 'required')
      .sort((left, right) => right.score - left.score || left.module.id.localeCompare(right.module.id));
    if (pack.selection.requirePositiveSignal && rankedModules.every((entry) => entry.score === 0)) {
      continue;
    }
    const selectedModules: typeof rankedModules = [];
    let estimatedContextTokens = 0;
    for (const entry of rankedModules) {
      if (selectedModules.length >= pack.selection.maximumModules) break;
      if (
        estimatedContextTokens + entry.module.estimatedTokens >
        pack.selection.maximumContextTokens
      ) {
        continue;
      }
      selectedModules.push(entry);
      estimatedContextTokens += entry.module.estimatedTokens;
    }
    if (selectedModules.length === 0) continue;

    const packDirectory = dirname(resolve(workspaceRoot, pack.sourcePath));
    const selectedContext = await Promise.all(
      selectedModules.map(async ({ module }) => ({
        id: `skill:${pack.packId}:${module.id}`,
        kind: 'skill' as const,
        title: module.title,
        summary: (await readFile(join(packDirectory, module.path), 'utf8')).trim(),
        importance: module.importance,
        appliesTo: module.appliesTo,
        provenance: [
          {
            authority: 'accepted' as const,
            sourceKind: 'skill' as const,
            sourceId: `${pack.packId}@${pack.version}`,
            path: join(dirname(pack.sourcePath), module.path),
          },
          ...Object.values(binding.sourceBindings)
            .flat()
            .map((path) => ({
              authority: 'declared' as const,
              sourceKind: 'source' as const,
              sourceId: binding.bindingId,
              path,
            })),
        ],
      })),
    );
    const selectedActionIds = Object.values(binding.actionBindings);
    const selectedGuardIds = Object.values(binding.guardBindings);
    selectedSkills.push({
      packId: pack.packId,
      version: pack.version,
      bindingId: binding.bindingId,
      reason: `Selected ${pack.displayName} because ${selectedModules.map((entry) => entry.module.id).join(', ')} matched the current task.`,
      selectedModuleIds: selectedModules.map((entry) => entry.module.id),
      selectedContext,
      selectedActionIds,
      selectedGuardIds,
      estimatedContextTokens,
      sourcePaths: [
        pack.sourcePath,
        binding.sourcePath,
        ...Object.values(binding.sourceBindings).flat(),
      ],
    });
  }
  return { selectedSkills, diagnostics };
};

const loadOperatingModelCapabilities = async (
  workspaceRoot: string,
): Promise<SkoposAgentNativeOperatingModel> => {
  const [workflows, gates] = await Promise.all([
    loadSkoposWorkflowManifests({ cwd: workspaceRoot }),
    readJsonIfExists<SkoposResolvedGatesArtifact>(
      join(workspaceRoot, RESOLVED_GATES_ARTIFACT_PATH),
    ),
  ]);
  return {
    schemaVersion: 1,
    context: [],
    actions: workflows.map((workflow) => ({
      id: workflow.id,
    })) as SkoposAgentNativeOperatingModel['actions'],
    guards: (gates?.gates ?? []).map((gate) => ({
      id: gate.id,
    })) as SkoposAgentNativeOperatingModel['guards'],
    diagnostics: [],
  };
};

const flattenRequiredRoles = (pack: SkoposLoadedSkillPack): string[] => [
  ...pack.requiredProjectRoles.context,
  ...pack.requiredProjectRoles.actions,
  ...pack.requiredProjectRoles.guards,
];

export const buildSkoposSkillProjectionSourcePaths = (
  pack: SkoposLoadedSkillPack,
  binding: SkoposLoadedProjectSkillBinding,
): string[] => {
  const packDirectory = dirname(pack.sourcePath);
  return [
    pack.sourcePath,
    binding.sourcePath,
    join(packDirectory, pack.rubricPath),
    ...pack.contextModules.map((module) => join(packDirectory, module.path)),
    ...pack.researchSources
      .map((source) => source.path)
      .filter((path): path is string => Boolean(path))
      .map((path) => join(packDirectory, path)),
    ...Object.values(binding.sourceBindings).flat(),
  ];
};

const inferProjectLifecycle = async (
  workspaceRoot: string,
): Promise<SkoposProjectLifecycle> => {
  const entries = await readdir(workspaceRoot).catch(() => [] as string[]);
  if (!entries.includes('package.json') && !entries.includes('src') && !entries.includes('docs')) {
    return 'greenfield';
  }
  if (entries.includes('AGENTS.md') || entries.includes('docs') || entries.includes('.skopos')) {
    return 'established-brownfield';
  }
  return 'early-product';
};

const readJsonIfExists = async <T>(artifactPath: string): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(artifactPath, 'utf8')) as T;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return undefined;
    }
    throw error;
  }
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const significantTerms = (value: string): Set<string> =>
  new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter((term) => term.length >= 4),
  );

const relevanceScore = (left: string, right: string): number => {
  const leftTerms = significantTerms(left);
  const rightTerms = significantTerms(right);
  let score = 0;
  for (const term of leftTerms) if (rightTerms.has(term)) score += 1;
  return score;
};

const hasStrongRelevantTerms = (left: string, right: string): boolean =>
  relevanceScore(left, right) >= 2;
