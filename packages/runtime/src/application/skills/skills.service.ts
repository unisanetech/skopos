import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import {
  loadSkoposProjectSkillBindings,
  loadSkoposSkillPackCatalog,
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
  buildSkoposCombinedSkillSourceDigest,
  buildSkoposSkillSourceDigest,
} from '@skopos/indexer';
import type {
  SkoposLoadedProjectSkillBinding,
  SkoposLoadedSkillPack,
} from '@skopos/indexer';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposTaskRisk,
  SkoposSkillHostProjectionArtifact,
  SkoposSkillHostProjectionEntry,
  SkoposProjectSkillBinding,
  SkoposProjectLifecycle,
  SkoposResolvedSkillArtifact,
  SkoposSelectedSkill,
  SkoposSkillRecommendationArtifact,
  SkoposSkillRecommendationEntry,
  SkoposTaskContract,
} from '@skopos/model';
import { SKOPOS_SKILL_PROJECTION_HOST_IDS } from '@skopos/model';

import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export const SKILL_RECOMMENDATIONS_ARTIFACT_PATH = '.skopos/index/skills/recommendations.json';
export const RESOLVED_SKILLS_ARTIFACT_PATH = '.skopos/index/skills/resolved.json';
export const SKILL_PROJECTIONS_ARTIFACT_DIRECTORY = '.skopos/index/skills/projections';


export const listSkoposSkillPacksRuntime = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposLoadedSkillPack[]> =>
  loadSkoposSkillPackCatalog({
    cwd: resolve(cwd),
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
  const requiredRoles = collectSkillPackRoles(pack, false);
  const recommendedRoles = collectSkillPackRoles(pack, true);
  const missingRequiredRoles = [
    ...requiredRoles.context.filter((role) => !binding.sourceBindings[role]?.length),
    ...requiredRoles.actions.filter((role) => !binding.actionBindings[role]),
    ...requiredRoles.guards.filter((role) => !binding.guardBindings[role]),
  ];
  const missingRecommendedRoles = [
    ...recommendedRoles.context.filter((role) => !binding.sourceBindings[role]?.length),
    ...recommendedRoles.actions.filter((role) => !binding.actionBindings[role]),
    ...recommendedRoles.guards.filter((role) => !binding.guardBindings[role]),
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
  const [packs, bindings, operatingModel] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    loadOperatingModelCapabilities(workspaceRoot),
  ]);
  const lifecycle = await inferProjectLifecycle(workspaceRoot);
  const acceptedIds = new Set(
    bindings.filter((binding) => binding.acceptance).map((binding) => binding.packId),
  );
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
      signals: pack.modules.flatMap((module) => module.positiveSignals),
      antiSignals: lifecycleMatch
        ? []
        : pack.modules.flatMap((module) => module.negativeSignals),
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
  bindingPath: string;
  bindingWrite: 'written' | 'dry-run';
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

  const acceptedAt = new Date().toISOString();
  const acceptedBinding: SkoposLoadedProjectSkillBinding = {
    ...binding,
    lifecycle: 'accepted',
    updatedAt: acceptedAt,
    acceptance: {
      acceptedAt,
      acceptedBy: actorId,
      reason: reason.trim(),
    },
  };
  const nextBindings = bindings.map((candidate) =>
    candidate.bindingId === binding.bindingId ? acceptedBinding : candidate,
  );
  const bindingPath = resolve(workspaceRoot, binding.sourcePath);
  const artifact = await buildResolvedSkillArtifactFromTrackedBindings({
    workspaceRoot,
    packs: [pack, ...(await listSkoposSkillPacksRuntime({ cwd: workspaceRoot })).filter(
      (candidate) => candidate.packId !== pack.packId,
    )],
    bindings: nextBindings,
    operatingModel,
  });
  const bindingWrite = await writeProjectSkillBinding({
    bindingPath,
    binding: acceptedBinding,
    dryRun,
  });
  const artifactPath = join(workspaceRoot, RESOLVED_SKILLS_ARTIFACT_PATH);
  const artifactWrite = await writeJsonArtifact({ artifactPath, artifact, dryRun });
  const projectionResult = await buildSkoposSkillHostProjectionsRuntime({
    cwd: workspaceRoot,
    resolvedSkills: artifact,
    bindings: nextBindings,
    operatingModel,
    dryRun,
  });
  return {
    bindingPath,
    bindingWrite,
    artifact,
    artifactPath,
    artifactWrite,
    projections: projectionResult.projections,
    projectionWrites: projectionResult.writes,
    actorId,
  };
};

export const resolveSkoposSkillsRuntime = async ({
  cwd,
  operatingModel: providedOperatingModel,
  dryRun = false,
}: {
  cwd: string;
  operatingModel?: SkoposAgentNativeOperatingModel;
  dryRun?: boolean;
}): Promise<{
  artifact: SkoposResolvedSkillArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  projections: SkoposSkillHostProjectionArtifact[];
  projectionWrites: Array<{ path: string; status: 'written' | 'dry-run' }>;
}> => {
  const workspaceRoot = resolve(cwd);
  const [packs, bindings, operatingModel] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    providedOperatingModel ?? loadOperatingModelCapabilities(workspaceRoot),
  ]);
  const artifact = await buildResolvedSkillArtifactFromTrackedBindings({
    workspaceRoot,
    packs,
    bindings,
    operatingModel,
  });
  const artifactPath = join(workspaceRoot, RESOLVED_SKILLS_ARTIFACT_PATH);
  const artifactWrite = await writeJsonArtifact({ artifactPath, artifact, dryRun });
  const projectionResult = await buildSkoposSkillHostProjectionsRuntime({
    cwd: workspaceRoot,
    resolvedSkills: artifact,
    bindings,
    operatingModel,
    dryRun,
  });
  return {
    artifact,
    artifactPath,
    artifactWrite,
    projections: projectionResult.projections,
    projectionWrites: projectionResult.writes,
  };
};

export const buildSkoposSkillHostProjectionsRuntime = async ({
  cwd,
  resolvedSkills: providedResolvedSkills,
  bindings: providedBindings,
  operatingModel: providedOperatingModel,
  dryRun = false,
}: {
  cwd: string;
  resolvedSkills?: SkoposResolvedSkillArtifact;
  bindings?: SkoposLoadedProjectSkillBinding[];
  operatingModel?: SkoposAgentNativeOperatingModel;
  dryRun?: boolean;
}): Promise<{
  projections: SkoposSkillHostProjectionArtifact[];
  writes: Array<{ path: string; status: 'written' | 'dry-run' }>;
}> => {
  const workspaceRoot = resolve(cwd);
  const [packs, bindings, operatingModel] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    providedBindings ??
      listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    providedOperatingModel ?? loadOperatingModelCapabilities(workspaceRoot),
  ]);
  const resolvedSkills =
    providedResolvedSkills ??
    (await buildResolvedSkillArtifactFromTrackedBindings({
      workspaceRoot,
      packs,
      bindings,
      operatingModel,
    }));
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
      moduleIds: pack.modules.map((module) => module.id),
      capabilities: {
        actionIds: resolveBoundRoles(
          collectSkillPackRoles(pack, true, true).actions,
          binding.actionBindings,
        ),
        guardIds: resolveBoundRoles(
          collectSkillPackRoles(pack, true, true).guards,
          binding.guardBindings,
        ),
      },
      sourcePaths: digest.sourcePaths,
      sourceDigest: digest.digest,
    });
  }

  skills.sort((left, right) => left.packId.localeCompare(right.packId));
  const sourceDigest = buildSkoposCombinedSkillSourceDigest(skills);
  const generatedAt = resolvedSkills.generatedAt ?? resolvedSkills.updatedAt ?? EPOCH_TIMESTAMP;
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
      sourceAuthority: 'tracked-project-skill-bindings',
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
  taskRisk,
  changedPaths = [],
  operatingModel,
}: {
  cwd: string;
  task: SkoposTaskContract;
  taskRisk: SkoposTaskRisk;
  changedPaths?: string[];
  operatingModel: SkoposAgentNativeOperatingModel;
}): Promise<{ selectedSkills: SkoposSelectedSkill[]; diagnostics: string[] }> => {
  const workspaceRoot = resolve(cwd);
  const [packs, bindings] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
  ]);
  const resolvedSkills = await buildResolvedSkillArtifactFromTrackedBindings({
    workspaceRoot,
    packs,
    bindings,
    operatingModel,
  });
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
    if (!pack.taskRisks.includes(taskRisk)) continue;
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
    const rankedModules = pack.modules
      .filter(
        (module) =>
          !module.negativeSignals.some((signal) =>
            hasStrongRelevantTerms(
              taskText,
              `${signal.summary} ${signal.evidence.join(' ')}`,
            ),
          ),
      )
      .map((module) => ({
        module,
        score: relevanceScore(
          taskText,
          [
            module.title,
            module.summary,
            ...module.positiveSignals.flatMap((signal) => [
              signal.summary,
              ...signal.evidence,
            ]),
            ...module.applicability.scopeKinds,
            ...module.applicability.pathKinds,
            ...module.applicability.capabilities,
          ].join(' '),
        ),
      }))
      .filter(({ module, score }) => score > 0 || module.importance === 'required')
      .sort((left, right) => right.score - left.score || left.module.id.localeCompare(right.module.id));
    const selectedModules: typeof rankedModules = [];
    let estimatedContextTokens = 0;
    for (const entry of rankedModules) {
      if (selectedModules.length >= pack.selection.maximumModules) break;
      if (
        estimatedContextTokens + entry.module.measuredTokens >
        pack.selection.maximumMeasuredTokens
      ) {
        continue;
      }
      selectedModules.push(entry);
      estimatedContextTokens += entry.module.measuredTokens;
    }
    if (selectedModules.length === 0) continue;

    const packDirectory = dirname(resolve(workspaceRoot, pack.sourcePath));
    const selectedModuleManifests = selectedModules.map((entry) => entry.module);
    const selectedRoles = collectSkillModuleRoles(selectedModuleManifests, true, true);
    const selectedSourcePaths = selectedRoles.context.flatMap(
      (role) => binding.sourceBindings[role] ?? [],
    );
    const selectedContext = await Promise.all(
      selectedModules.map(async ({ module }) => ({
        id: `skill:${pack.packId}:${module.id}`,
        kind: 'skill' as const,
        title: module.title,
        summary: (await readFile(join(packDirectory, module.path), 'utf8')).trim(),
        importance: module.importance,
        appliesTo: [
          ...new Set([
            ...module.applicability.scopeKinds,
            ...module.applicability.capabilities,
          ]),
        ],
        provenance: [
          {
            authority: 'accepted' as const,
            sourceKind: 'skill' as const,
            sourceId: `${pack.packId}@${pack.version}`,
            path: join(dirname(pack.sourcePath), module.path),
          },
          ...[
            ...module.projectRoles.context,
            ...module.projectRoles.recommendedContext,
          ]
            .flatMap((role) => binding.sourceBindings[role] ?? [])
            .map((path) => ({
              authority: 'declared' as const,
              sourceKind: 'source' as const,
              sourceId: binding.bindingId,
              path,
            })),
        ],
      })),
    );
    const selectedActionIds = resolveBoundRoles(selectedRoles.actions, binding.actionBindings);
    const selectedGuardIds = resolveBoundRoles(selectedRoles.guards, binding.guardBindings);
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
        ...selectedModules.map(({ module }) => join(dirname(pack.sourcePath), module.path)),
        ...selectedSourcePaths,
      ],
    });
  }
  return { selectedSkills, diagnostics };
};

const loadOperatingModelCapabilities = async (
  workspaceRoot: string,
): Promise<SkoposAgentNativeOperatingModel> => {
  const [actions, guards] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadSkoposGuardManifests({ cwd: workspaceRoot }),
  ]);
  return {
    schemaVersion: 1,
    context: [],
    actions: actions.map((action) => ({
      id: action.id,
    })) as SkoposAgentNativeOperatingModel['actions'],
    guards: guards.map((guard) => ({
      id: guard.id,
    })) as SkoposAgentNativeOperatingModel['guards'],
    diagnostics: [],
  };
};

const flattenRequiredRoles = (pack: SkoposLoadedSkillPack): string[] => {
  const roles = collectSkillPackRoles(pack, false);
  return [...roles.context, ...roles.actions, ...roles.guards];
};

interface SkillRoles {
  context: string[];
  actions: string[];
  guards: string[];
}

const collectSkillPackRoles = (
  pack: SkoposLoadedSkillPack,
  recommended: boolean,
  includeRequired = false,
): SkillRoles => collectSkillModuleRoles(pack.modules, recommended, includeRequired);

const collectSkillModuleRoles = (
  modules: SkoposLoadedSkillPack['modules'],
  recommended: boolean,
  includeRequired = false,
): SkillRoles => ({
  context: uniqueSorted(
    modules.flatMap((module) => [
      ...(includeRequired || !recommended ? module.projectRoles.context : []),
      ...(recommended ? module.projectRoles.recommendedContext : []),
    ]),
  ),
  actions: uniqueSorted(
    modules.flatMap((module) => [
      ...(includeRequired || !recommended ? module.projectRoles.actions : []),
      ...(recommended ? module.projectRoles.recommendedActions : []),
    ]),
  ),
  guards: uniqueSorted(
    modules.flatMap((module) => [
      ...(includeRequired || !recommended ? module.projectRoles.guards : []),
      ...(recommended ? module.projectRoles.recommendedGuards : []),
    ]),
  ),
});

const resolveBoundRoles = (
  roles: string[],
  bindings: Record<string, string>,
): string[] => uniqueSorted(roles.flatMap((role) => bindings[role] ?? []));

const uniqueSorted = (values: string[]): string[] => [...new Set(values)].sort();

const EPOCH_TIMESTAMP = '1970-01-01T00:00:00.000Z';

const writeProjectSkillBinding = async ({
  bindingPath,
  binding,
  dryRun,
}: {
  bindingPath: string;
  binding: SkoposLoadedProjectSkillBinding;
  dryRun: boolean;
}): Promise<'written' | 'dry-run'> => {
  if (dryRun) {
    return 'dry-run';
  }

  const { sourcePath: _sourcePath, ...projectBinding } = binding;
  await writeFile(
    bindingPath,
    `${JSON.stringify(projectBinding satisfies SkoposProjectSkillBinding, null, 2)}\n`,
    'utf8',
  );
  return 'written';
};

const buildResolvedSkillArtifactFromTrackedBindings = async ({
  workspaceRoot,
  packs,
  bindings,
  operatingModel,
}: {
  workspaceRoot: string;
  packs: SkoposLoadedSkillPack[];
  bindings: SkoposLoadedProjectSkillBinding[];
  operatingModel: SkoposAgentNativeOperatingModel;
}): Promise<SkoposResolvedSkillArtifact> => {
  const acceptedBindings = bindings
    .filter(
      (binding) =>
        Boolean(binding.acceptance) &&
        (binding.lifecycle === 'accepted' || binding.lifecycle === 'validated'),
    )
    .sort((left, right) => left.packId.localeCompare(right.packId));
  const seenPackIds = new Set<string>();
  const acceptedSkills: SkoposResolvedSkillArtifact['acceptedSkills'] = [];

  for (const binding of acceptedBindings) {
    if (seenPackIds.has(binding.packId)) {
      throw new Error(`Multiple accepted bindings target skill pack ${binding.packId}.`);
    }
    seenPackIds.add(binding.packId);
    const pack = packs.find(
      (candidate) =>
        candidate.packId === binding.packId &&
        candidate.version === binding.packVersion,
    );
    if (!pack) {
      throw new Error(
        `Accepted skill binding ${binding.bindingId} has no matching ${binding.packId}@${binding.packVersion} pack source.`,
      );
    }
    const validation = await validateSkoposProjectSkillBindingRuntime({
      cwd: workspaceRoot,
      pack,
      binding,
      operatingModel,
    });
    if (validation.status === 'fail') {
      throw new Error(
        `Cannot resolve accepted skill ${binding.packId}: ${validation.diagnostics.join(' ')}`,
      );
    }
    const acceptance = binding.acceptance;
    if (!acceptance) {
      throw new Error(
        `Accepted skill binding ${binding.bindingId} is missing acceptance metadata.`,
      );
    }
    acceptedSkills.push({
      packId: pack.packId,
      version: pack.version,
      bindingId: binding.bindingId,
      acceptedAt: acceptance.acceptedAt,
      acceptedBy: acceptance.acceptedBy,
      reason: acceptance.reason,
      sourcePath: pack.sourcePath,
      bindingPath: binding.sourcePath,
    });
  }

  const updatedAt =
    acceptedSkills
      .map((entry) => entry.acceptedAt)
      .sort((left, right) => right.localeCompare(left))[0] ?? EPOCH_TIMESTAMP;
  return {
    schemaVersion: 1,
    id: 'resolved-skills',
    type: 'resolved-skills',
    status: 'generated',
    authority: 'generated',
    summary: `${acceptedSkills.length} project-adapted skill pack${acceptedSkills.length === 1 ? '' : 's'} accepted.`,
    updatedAt,
    generatedAt: updatedAt,
    workspaceRoot,
    acceptedSkills,
    sourcePaths: [...new Set(acceptedSkills.map((entry) => entry.sourcePath))],
    bindingPaths: [...new Set(acceptedSkills.map((entry) => entry.bindingPath))],
  };
};

export const buildSkoposSkillProjectionSourcePaths = (
  pack: SkoposLoadedSkillPack,
  binding: SkoposLoadedProjectSkillBinding,
): string[] => {
  const packDirectory = dirname(pack.sourcePath);
  return [
    pack.sourcePath,
    binding.sourcePath,
    join(packDirectory, pack.rubricPath),
    ...pack.modules.map((module) => join(packDirectory, module.path)),
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
