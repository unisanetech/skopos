import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';

import { buildSkoposSkillSourceDigest } from '@skopos/indexer';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposProjectSkillBinding,
  SkoposResolvedPolicyArtifact,
  SkoposSkillAcceptanceIdentity,
  SkoposSkillSelectionIdentity,
  SkoposSkillTaskSignalEnvelope,
} from '@skopos/model';
import type {
  SkoposLoadedProjectSkillBinding,
  SkoposLoadedSkillPack,
} from '@skopos/indexer';

export const SKOPOS_SKILL_SELECTION_ALGORITHM_ID = 'task-skill-selection@1';

export const buildSkoposSkillAcceptanceIdentityRuntime = async ({
  workspaceRoot,
  pack,
  binding,
  operatingModel,
}: {
  workspaceRoot: string;
  pack: SkoposLoadedSkillPack;
  binding: SkoposLoadedProjectSkillBinding;
  operatingModel: SkoposAgentNativeOperatingModel;
}): Promise<SkoposSkillAcceptanceIdentity> => {
  const packDirectory = dirname(pack.sourcePath);
  const packSourceDigest = await buildRequiredSourceDigest({
    workspaceRoot,
    label: `${pack.packId} pack`,
    sourcePaths: [packDirectory],
  });
  const projectSourceDigest = await buildRequiredSourceDigest({
    workspaceRoot,
    label: `${binding.bindingId} project binding`,
    sourcePaths: Object.values(binding.sourceBindings).flat(),
  });
  const evaluationSourceDigest = await buildRequiredSourceDigest({
    workspaceRoot,
    label: `${pack.packId} evaluation`,
    sourcePaths: [join(packDirectory, pack.rubricPath), join(packDirectory, 'fixtures')],
  });
  const bindingSourceDigest = digestValue(bindingDeclaration(binding));
  const capabilityCatalogDigest = buildSkoposSkillCapabilityCatalogDigest(operatingModel);
  const components = {
    packSourceDigest,
    bindingSourceDigest,
    projectSourceDigest,
    capabilityCatalogDigest,
    evaluationSourceDigest,
  };
  return {
    ...components,
    combinedDigest: digestValue(components),
  };
};

export const assertSkoposSkillAcceptanceIdentityRuntime = async ({
  workspaceRoot,
  pack,
  binding,
  operatingModel,
}: {
  workspaceRoot: string;
  pack: SkoposLoadedSkillPack;
  binding: SkoposLoadedProjectSkillBinding;
  operatingModel: SkoposAgentNativeOperatingModel;
}): Promise<SkoposSkillAcceptanceIdentity> => {
  const acceptedIdentity = binding.acceptance?.identity;
  if (!acceptedIdentity) {
    throw new Error(
      `Accepted skill binding ${binding.bindingId} is missing exact acceptance identity. Re-accept it explicitly.`,
    );
  }
  const currentIdentity = await buildSkoposSkillAcceptanceIdentityRuntime({
    workspaceRoot,
    pack,
    binding,
    operatingModel,
  });
  const changedComponents = acceptanceIdentityKeys.filter(
    (key) => currentIdentity[key] !== acceptedIdentity[key],
  );
  if (changedComponents.length > 0) {
    throw new Error(
      `Accepted skill binding ${binding.bindingId} is stale because ${changedComponents.join(', ')} changed. Re-accept the exact sources explicitly.`,
    );
  }
  return currentIdentity;
};

export const buildSkoposSkillSelectionIdentity = ({
  envelope,
  acceptedSkills,
  operatingModel,
  resolvedPolicy,
}: {
  envelope: SkoposSkillTaskSignalEnvelope;
  acceptedSkills: Array<{
    packId: string;
    version: string;
    bindingId: string;
    identity: SkoposSkillAcceptanceIdentity;
  }>;
  operatingModel: SkoposAgentNativeOperatingModel;
  resolvedPolicy?: SkoposResolvedPolicyArtifact;
}): SkoposSkillSelectionIdentity => {
  const acceptedSkillEntries = acceptedSkills
    .map((skill) => ({
      packId: skill.packId,
      version: skill.version,
      bindingId: skill.bindingId,
      acceptanceDigest: skill.identity.combinedDigest,
    }))
    .sort((left, right) =>
      `${left.packId}:${left.bindingId}`.localeCompare(`${right.packId}:${right.bindingId}`),
    );
  const identity = {
    algorithmId: SKOPOS_SKILL_SELECTION_ALGORITHM_ID,
    taskSignalDigest: digestValue(envelope),
    acceptedSkills: acceptedSkillEntries,
    acceptedSkillsDigest: digestValue(acceptedSkillEntries),
    capabilityCatalogDigest: buildSkoposSkillCapabilityCatalogDigest(operatingModel),
    resolvedPolicyDigest: digestValue(resolvedPolicy ?? null),
  };
  return {
    ...identity,
    combinedDigest: digestValue(identity),
  };
};

export const buildSkoposSkillCapabilityCatalogDigest = (
  operatingModel: SkoposAgentNativeOperatingModel,
): string =>
  digestValue({
    actionIds: [...new Set(operatingModel.actions.map((action) => action.id))].sort(),
    guardIds: [...new Set(operatingModel.guards.map((guard) => guard.id))].sort(),
  });

const buildRequiredSourceDigest = async ({
  workspaceRoot,
  label,
  sourcePaths,
}: {
  workspaceRoot: string;
  label: string;
  sourcePaths: string[];
}): Promise<string> => {
  const result = await buildSkoposSkillSourceDigest({
    cwd: workspaceRoot,
    sourcePaths,
  });
  if (result.missingPaths.length > 0) {
    throw new Error(`${label} source is missing: ${result.missingPaths.join(', ')}.`);
  }
  return result.digest;
};

const bindingDeclaration = (
  binding: SkoposLoadedProjectSkillBinding,
): SkoposProjectSkillBinding => {
  const { sourcePath: _sourcePath, acceptance: _acceptance, ...declaration } = binding;
  return declaration;
};

const acceptanceIdentityKeys: Array<keyof SkoposSkillAcceptanceIdentity> = [
  'packSourceDigest',
  'bindingSourceDigest',
  'projectSourceDigest',
  'capabilityCatalogDigest',
  'evaluationSourceDigest',
  'combinedDigest',
];

const digestValue = (value: unknown): string =>
  `sha256:${createHash('sha256').update(stableSerialize(value)).digest('hex')}`;

const stableSerialize = (value: unknown): string => JSON.stringify(sortValue(value));

const sortValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortValue(entry)]),
  );
};
