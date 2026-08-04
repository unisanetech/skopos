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
  SkoposExecutionPhase,
  SkoposTaskRisk,
  SkoposSkillHostProjectionArtifact,
  SkoposSkillHostProjectionEntry,
  SkoposProjectSkillBinding,
  SkoposProjectLifecycle,
  SkoposResolvedSkillArtifact,
  SkoposSelectedSkill,
  SkoposSkillRecommendationArtifact,
  SkoposSkillRecommendationEntry,
  SkoposSkillAcceptedFailureEvidence,
  SkoposSkillModuleSelectionEvidence,
  SkoposSkillSelectionExplanation,
  SkoposSkillSelectionResult,
  SkoposSkillTaskPathKind,
  SkoposSkillTaskSignalEnvelope,
  SkoposTaskContract,
} from '@skopos/model';
import {
  SKOPOS_SKILL_PROJECTION_HOST_IDS,
  SKOPOS_SKILL_TASK_BUDGETS,
} from '@skopos/model';

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
  phase = 'iteration',
  ownedPaths = [],
  changedPaths = [],
  affectedCapabilities = [],
  selectedActionIds = [],
  applicableGuardIds = [],
  acceptedFailureEvidence = [],
  operatingModel,
}: {
  cwd: string;
  task: SkoposTaskContract;
  taskRisk: SkoposTaskRisk;
  phase?: SkoposExecutionPhase;
  ownedPaths?: string[];
  changedPaths?: string[];
  affectedCapabilities?: string[];
  selectedActionIds?: string[];
  applicableGuardIds?: string[];
  acceptedFailureEvidence?: SkoposSkillAcceptedFailureEvidence[];
  operatingModel: SkoposAgentNativeOperatingModel;
}): Promise<SkoposSkillSelectionResult> => {
  const workspaceRoot = resolve(cwd);
  const [packs, bindings, projectLifecycle] = await Promise.all([
    listSkoposSkillPacksRuntime({ cwd: workspaceRoot }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    inferProjectLifecycle(workspaceRoot),
  ]);
  const envelope = buildSkillTaskSignalEnvelope({
    task,
    taskRisk,
    phase,
    ownedPaths,
    changedPaths,
    affectedCapabilities,
    selectedActionIds,
    applicableGuardIds,
    acceptedFailureEvidence,
    projectLifecycle,
  });
  const budget = SKOPOS_SKILL_TASK_BUDGETS[taskRisk];
  const resolvedSkills = await buildResolvedSkillArtifactFromTrackedBindings({
    workspaceRoot,
    packs,
    bindings,
    operatingModel,
  });
  const selectedSkills: SkoposSelectedSkill[] = [];
  const explanations: SkoposSkillSelectionExplanation[] = [];
  const diagnostics: string[] = [];
  const candidatePacks: Array<{
    pack: SkoposLoadedSkillPack;
    binding: SkoposLoadedProjectSkillBinding;
    modules: SkillModuleEligibility[];
    score: number;
  }> = [];

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
    if (!pack.taskRisks.includes(taskRisk)) {
      explanations.push(suppressedPackExplanation(pack, 'risk-mismatch'));
      continue;
    }
    if (!pack.projectLifecycles.includes(projectLifecycle)) {
      explanations.push(suppressedPackExplanation(pack, 'lifecycle-mismatch'));
      continue;
    }
    const validation = await validateSkoposProjectSkillBindingRuntime({
      cwd: workspaceRoot,
      pack,
      binding,
      operatingModel,
    });
    if (validation.status === 'fail') {
      diagnostics.push(...validation.diagnostics);
      explanations.push(suppressedPackExplanation(pack, 'binding-invalid'));
      continue;
    }
    const evaluatedModules = pack.modules.map((module) =>
      evaluateSkillModuleEligibility({ module, envelope }),
    );
    explanations.push(
      ...evaluatedModules
        .filter((entry) => !entry.eligible)
        .map((entry) => ({ ...entry.explanation, packId: pack.packId })),
    );
    const eligibleModules = evaluatedModules
      .filter((entry) => entry.eligible)
      .sort(
        (left, right) =>
          right.score - left.score ||
          left.module.measuredTokens - right.module.measuredTokens ||
          left.module.id.localeCompare(right.module.id),
      );
    if (eligibleModules.length === 0) continue;
    candidatePacks.push({
      pack,
      binding,
      modules: eligibleModules,
      score: eligibleModules[0]?.score ?? 0,
    });
  }

  candidatePacks.sort(
    (left, right) => right.score - left.score || left.pack.packId.localeCompare(right.pack.packId),
  );
  let measuredTaskTokens = 0;
  let selectedModuleCount = 0;
  const selectedRubricDimensions = new Set<string>();

  for (const candidate of candidatePacks) {
    const { pack, binding } = candidate;
    if (selectedSkills.length >= budget.maximumPacks) {
      explanations.push(
        ...candidate.modules.map((entry) =>
          suppressedModuleExplanation(pack, entry, 'pack-budget-exhausted'),
        ),
      );
      continue;
    }
    const selectedModules: SkillModuleEligibility[] = [];
    let measuredPackTokens = 0;
    for (const entry of candidate.modules) {
      if (
        selectedModuleCount >= budget.maximumModules ||
        selectedModules.length >= pack.selection.maximumModules
      ) {
        explanations.push(
          suppressedModuleExplanation(pack, entry, 'module-budget-exhausted'),
        );
        continue;
      }
      if (
        measuredTaskTokens + entry.module.measuredTokens > budget.maximumMeasuredTokens ||
        measuredPackTokens + entry.module.measuredTokens > pack.selection.maximumMeasuredTokens
      ) {
        explanations.push(
          suppressedModuleExplanation(pack, entry, 'token-budget-exhausted'),
        );
        continue;
      }
      const distinctRubricDimensions = entry.module.rubricDimensions.filter(
        (dimension) => !selectedRubricDimensions.has(dimension),
      );
      if (distinctRubricDimensions.length === 0) {
        explanations.push(suppressedModuleExplanation(pack, entry, 'duplicate-judgment'));
        continue;
      }
      selectedModules.push(entry);
      measuredPackTokens += entry.module.measuredTokens;
      measuredTaskTokens += entry.module.measuredTokens;
      selectedModuleCount += 1;
      for (const dimension of distinctRubricDimensions) selectedRubricDimensions.add(dimension);
      explanations.push({
        packId: pack.packId,
        moduleId: entry.module.id,
        outcome: 'selected',
        reasonCode: 'selected',
        summary: `${entry.module.title} has positive structural evidence and relevant applicability.`,
        evidenceIds: [
          ...entry.positiveSignalIds,
          ...entry.applicabilityEvidence,
          ...entry.failureSignalIds,
        ],
        measuredTokens: entry.module.measuredTokens,
      });
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
      selectedRubricDimensions: uniqueSorted(
        selectedModuleManifests.flatMap((module) => module.rubricDimensions),
      ),
      selectedFailureSignalIds: uniqueSorted(
        selectedModuleManifests.flatMap((module) => module.failureSignalIds),
      ),
      measuredContextTokens: measuredPackTokens,
      selectionEvidence: selectedModules.map(toSkillModuleSelectionEvidence),
      sourcePaths: [
        pack.sourcePath,
        binding.sourcePath,
        ...selectedModules.map(({ module }) => join(dirname(pack.sourcePath), module.path)),
        ...selectedSourcePaths,
      ],
    });
  }
  return { envelope, budget, selectedSkills, explanations, diagnostics };
};

interface SkillModuleEligibility {
  module: SkoposLoadedSkillPack['modules'][number];
  eligible: boolean;
  score: number;
  positiveSignalIds: string[];
  applicabilityEvidence: string[];
  failureSignalIds: string[];
  explanation: SkoposSkillSelectionExplanation;
}

const buildSkillTaskSignalEnvelope = ({
  task,
  taskRisk,
  phase,
  ownedPaths,
  changedPaths,
  affectedCapabilities,
  selectedActionIds,
  applicableGuardIds,
  acceptedFailureEvidence,
  projectLifecycle,
}: {
  task: SkoposTaskContract;
  taskRisk: SkoposTaskRisk;
  phase: SkoposExecutionPhase;
  ownedPaths: string[];
  changedPaths: string[];
  affectedCapabilities: string[];
  selectedActionIds: string[];
  applicableGuardIds: string[];
  acceptedFailureEvidence: SkoposSkillAcceptedFailureEvidence[];
  projectLifecycle: SkoposProjectLifecycle;
}): SkoposSkillTaskSignalEnvelope => {
  const scope = task.scope.scope;
  const changedPathSet = new Set(changedPaths);
  const paths = uniqueSorted([...ownedPaths, ...changedPaths]).map((path) => ({
    path,
    kinds: classifySkillTaskPath(path),
    source: changedPathSet.has(path) ? 'changed' as const : 'owned' as const,
  }));
  return {
    goal: task.goal,
    acceptanceCriteria: task.acceptanceCriteria,
    constraints: task.constraints,
    nonGoals: task.nonGoals,
    openDecisions: task.openDecisions.map((decision) => decision.question),
    risk: taskRisk,
    phase,
    scopeIds: uniqueSorted([scope.id, ...(scope.ancestorIds ?? [])]),
    scopeKinds: [scope.kind],
    scopeTerms: uniqueSorted([
      scope.id,
      scope.title,
      scope.path,
      ...(scope.aliases ?? []),
      ...(scope.codeRoots ?? []),
    ]),
    paths,
    affectedCapabilities: uniqueSorted([
      ...affectedCapabilities,
      ...inferSkillPathCapabilities(paths),
    ]),
    selectedActionIds: uniqueSorted(selectedActionIds),
    applicableGuardIds: uniqueSorted(applicableGuardIds),
    acceptedFailureEvidence: [...acceptedFailureEvidence].sort((left, right) =>
      left.id.localeCompare(right.id),
    ),
    projectLifecycle,
  };
};

const evaluateSkillModuleEligibility = ({
  module,
  envelope,
}: {
  module: SkoposLoadedSkillPack['modules'][number];
  envelope: SkoposSkillTaskSignalEnvelope;
}): SkillModuleEligibility => {
  const positiveIntentText = [
    envelope.goal,
    ...envelope.acceptanceCriteria,
  ].join(' ');
  const taskText = [
    positiveIntentText,
    ...envelope.constraints,
    ...envelope.nonGoals,
    ...envelope.openDecisions,
    ...envelope.scopeTerms,
    ...envelope.paths.map((entry) => entry.path),
    ...envelope.affectedCapabilities,
    ...envelope.selectedActionIds,
    ...envelope.applicableGuardIds,
  ].join(' ');
  const negativeEvidenceText = [
    ...envelope.nonGoals,
    ...[...envelope.constraints, ...envelope.openDecisions].filter((entry) =>
      /\b(no|not|without|exclude|forbid|prohibit|only|generated|vendored|backend|infrastructure|documentation)\b/i.test(entry),
    ),
    ...envelope.paths
      .filter((entry) => entry.kinds.some((kind) => EXCLUDED_SKILL_PATH_KINDS.has(kind)))
      .flatMap((entry) => [entry.path, ...entry.kinds]),
  ].join(' ');
  const matchingPositiveSignals = module.positiveSignals.filter(
    (signal) => relevanceScore(positiveIntentText, skillSignalText(signal)) > 0,
  );
  const highSignalIds = matchingPositiveSignals
    .filter((signal) => signal.confidence === 'high')
    .map((signal) => signal.id);
  const mediumSignalIds = matchingPositiveSignals
    .filter((signal) => signal.confidence === 'medium')
    .map((signal) => signal.id);
  const failureSignalIds = module.failureSignalIds.filter((failureSignalId) =>
    envelope.acceptedFailureEvidence.some((entry) => entry.id === failureSignalId),
  );
  const positiveSignalIds = uniqueSorted([
    ...highSignalIds,
    ...(mediumSignalIds.length >= 2 ? mediumSignalIds : []),
  ]);
  const blockingAntiSignalIds = negativeEvidenceText
    ? module.negativeSignals
        .filter((signal) => relevanceScore(negativeEvidenceText, skillSignalText(signal)) > 0)
        .map((signal) => signal.id)
    : [];
  const applicabilityEvidence = collectSkillApplicabilityEvidence(module, envelope);
  const score = relevanceScore(
    taskText,
    [
      module.title,
      module.summary,
      ...matchingPositiveSignals.map(skillSignalText),
      ...module.applicability.scopeKinds,
      ...module.applicability.pathKinds,
      ...module.applicability.capabilities,
    ].join(' '),
  );
  const base = {
    module,
    score,
    positiveSignalIds,
    applicabilityEvidence,
    failureSignalIds,
  };
  if (module.importance === 'on-demand' && envelope.phase !== 'closure' && envelope.phase !== 'stabilization') {
    return ineligibleSkillModule(base, 'review-phase-mismatch', []);
  }
  if (blockingAntiSignalIds.length > 0) {
    return ineligibleSkillModule(base, 'blocking-anti-signal', blockingAntiSignalIds);
  }
  if (positiveSignalIds.length === 0) {
    return ineligibleSkillModule(base, 'positive-signal-missing', []);
  }
  if (applicabilityEvidence.length === 0 && failureSignalIds.length === 0) {
    return ineligibleSkillModule(base, 'applicability-missing', []);
  }
  return {
    ...base,
    eligible: true,
    explanation: {
      packId: '',
      moduleId: module.id,
      outcome: 'selected',
      reasonCode: 'selected',
      summary: `${module.title} is eligible.`,
      evidenceIds: [...positiveSignalIds, ...applicabilityEvidence, ...failureSignalIds],
      measuredTokens: module.measuredTokens,
    },
  };
};

const collectSkillApplicabilityEvidence = (
  module: SkoposLoadedSkillPack['modules'][number],
  envelope: SkoposSkillTaskSignalEnvelope,
): string[] => {
  if (
    envelope.paths.length > 0 &&
    envelope.paths.every((entry) =>
      entry.kinds.some((kind) => EXCLUDED_SKILL_PATH_KINDS.has(kind)),
    )
  ) {
    return [];
  }
  const scopeText = [...envelope.scopeKinds, ...envelope.scopeTerms].join(' ');
  const pathKinds = new Set(envelope.paths.flatMap((entry) => entry.kinds));
  const capabilityIds = new Set(
    [
      ...envelope.affectedCapabilities,
      ...envelope.selectedActionIds,
      ...envelope.applicableGuardIds,
    ].map((entry) => entry.toLowerCase()),
  );
  const scopeEvidence = module.applicability.scopeKinds
    .filter((kind) => relevanceScore(scopeText, kind) > 0)
    .map((kind) => `scope:${kind}`);
  const capabilityEvidence = module.applicability.capabilities
    .filter((capability) => capabilityIds.has(capability.toLowerCase()))
    .map((capability) => `capability:${capability}`);
  const pathEvidence = module.applicability.pathKinds
    .filter((kind) => pathKinds.has(kind as SkoposSkillTaskPathKind))
    .map((kind) => `path:${kind}`);
  const specializedPathEvidence = pathEvidence.filter(
    (entry) => entry !== 'path:authored-source' && entry !== 'path:test',
  );
  return uniqueSorted([
    ...scopeEvidence,
    ...capabilityEvidence,
    ...(scopeEvidence.length > 0 || capabilityEvidence.length > 0
      ? pathEvidence
      : specializedPathEvidence),
  ]);
};

const ineligibleSkillModule = (
  entry: Omit<SkillModuleEligibility, 'eligible' | 'explanation'>,
  reasonCode: SkoposSkillSelectionExplanation['reasonCode'],
  evidenceIds: string[],
): SkillModuleEligibility => ({
  ...entry,
  eligible: false,
  explanation: {
    packId: '',
    moduleId: entry.module.id,
    outcome: 'suppressed',
    reasonCode,
    summary: `${entry.module.title} was suppressed: ${reasonCode.replaceAll('-', ' ')}.`,
    evidenceIds,
    measuredTokens: entry.module.measuredTokens,
  },
});

const suppressedPackExplanation = (
  pack: SkoposLoadedSkillPack,
  reasonCode: SkoposSkillSelectionExplanation['reasonCode'],
): SkoposSkillSelectionExplanation => ({
  packId: pack.packId,
  outcome: 'suppressed',
  reasonCode,
  summary: `${pack.displayName} was suppressed: ${reasonCode.replaceAll('-', ' ')}.`,
  evidenceIds: [],
  measuredTokens: 0,
});

const suppressedModuleExplanation = (
  pack: SkoposLoadedSkillPack,
  entry: SkillModuleEligibility,
  reasonCode: SkoposSkillSelectionExplanation['reasonCode'],
): SkoposSkillSelectionExplanation => ({
  packId: pack.packId,
  moduleId: entry.module.id,
  outcome: 'suppressed',
  reasonCode,
  summary: `${entry.module.title} was suppressed: ${reasonCode.replaceAll('-', ' ')}.`,
  evidenceIds: [
    ...entry.positiveSignalIds,
    ...entry.applicabilityEvidence,
    ...entry.failureSignalIds,
  ],
  measuredTokens: entry.module.measuredTokens,
});

const toSkillModuleSelectionEvidence = (
  entry: SkillModuleEligibility,
): SkoposSkillModuleSelectionEvidence => ({
  moduleId: entry.module.id,
  positiveSignalIds: entry.positiveSignalIds,
  applicabilityEvidence: entry.applicabilityEvidence,
  failureSignalIds: entry.failureSignalIds,
  score: entry.score,
  measuredTokens: entry.module.measuredTokens,
});

const skillSignalText = (signal: { id: string; summary: string; evidence: string[] }): string =>
  `${signal.id} ${signal.summary} ${signal.evidence.join(' ')}`;

const EXCLUDED_SKILL_PATH_KINDS = new Set<SkoposSkillTaskPathKind>([
  'generated',
  'vendored',
  'build',
  'distribution',
]);

const classifySkillTaskPath = (path: string): SkoposSkillTaskPathKind[] => {
  const normalized = path.toLowerCase();
  const kinds = new Set<SkoposSkillTaskPathKind>();
  if (/(^|\/)(\.skopos|\.cache|generated|__generated__)(\/|$)/.test(normalized)) kinds.add('generated');
  if (/(^|\/)(node_modules|vendor|vendored)(\/|$)/.test(normalized)) kinds.add('vendored');
  if (/(^|\/)(dist|build|coverage)(\/|$)/.test(normalized)) kinds.add('build');
  if (/(^|\/)(release|releases|distribution)(\/|$)/.test(normalized)) kinds.add('distribution');
  if (/(^|\/)(__tests__|tests?|specs?)(\/|\.)/.test(normalized) || /\.(test|spec)\.[^.]+$/.test(normalized)) kinds.add('test');
  if (/\.(css|scss|sass|less)$/.test(normalized)) kinds.add('style');
  if (/(^|\/)(locales?|i18n|translations?)(\/|$)/.test(normalized)) kinds.add('localization');
  if (/(^|\/)(evidence|proof|fixtures?)(\/|$)/.test(normalized)) kinds.add('evidence');
  if (/(^|\/)(index|exports?)\.[^.]+$/.test(normalized)) kinds.add('public-export');
  if (/\.(md|mdx|rst|txt)$/.test(normalized) || normalized.startsWith('docs/')) kinds.add('documentation');
  if (/\.(json|ya?ml|toml|ini)$/.test(normalized)) kinds.add('configuration');
  if (/\.(c|cc|cpp|cs|go|java|js|jsx|kt|php|py|rb|rs|swift|ts|tsx|vue|svelte)$/.test(normalized)) kinds.add('authored-source');
  if (kinds.size === 0) kinds.add('unknown');
  return [...kinds].sort();
};

const inferSkillPathCapabilities = (
  paths: SkoposSkillTaskSignalEnvelope['paths'],
): string[] => {
  const capabilities: string[] = [];
  for (const entry of paths) {
    const path = entry.path.toLowerCase();
    if (/\.(jsx|tsx|vue|svelte)$/.test(path)) {
      capabilities.push('frontend', 'browser-rendering', 'client-rendering', 'component-library');
    }
    if (entry.kinds.includes('style')) {
      capabilities.push('frontend', 'browser-rendering', 'design-tokens');
    }
    if (entry.kinds.includes('localization')) capabilities.push('interface-copy');
    if (entry.kinds.includes('public-export')) capabilities.push('public-api', 'symbol-search');
  }
  return capabilities;
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
      .filter(
        (term) =>
          term.length >= 4 ||
          term === 'ui' ||
          term === 'ux' ||
          term === 'api' ||
          term === 'seo' ||
          term === 'web',
      ),
  );

const relevanceScore = (left: string, right: string): number => {
  const leftTerms = significantTerms(left);
  const rightTerms = significantTerms(right);
  let score = 0;
  for (const term of leftTerms) if (rightTerms.has(term)) score += 1;
  return score;
};
