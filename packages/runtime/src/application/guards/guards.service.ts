import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import {
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
} from '@skopos/indexer';
import type {
  SkoposGuardManifest,
  SkoposPolicyPackManifest,
  SkoposResolvedGuard,
  SkoposResolvedGuardsArtifact,
  SkoposResolvedPolicyArtifact,
} from '@skopos/model';

import {
  listSkoposPolicyPacksRuntime,
  resolveSkoposPolicyRuntime,
} from '../policies/policies.service.js';

export const RESOLVED_GUARDS_ARTIFACT_PATH = '.skopos/index/guards.json';

export interface ResolveSkoposGuardsRuntimeOptions {
  cwd: string;
  actor?: string;
  policy?: SkoposResolvedPolicyArtifact;
  dryRun?: boolean;
}

export interface ResolveSkoposGuardsRuntimeResult {
  artifact: SkoposResolvedGuardsArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  actorId?: string;
}

export interface PolicyGuardRequirement {
  guardId: string;
  packId: string;
  strength: 'required' | 'recommended';
}

export const resolveSkoposGuardsRuntime = async ({
  cwd,
  actor,
  policy: providedPolicy,
  dryRun = false,
}: ResolveSkoposGuardsRuntimeOptions): Promise<ResolveSkoposGuardsRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const artifactPath = join(workspaceRoot, RESOLVED_GUARDS_ARTIFACT_PATH);
  const [packs, manifests, actions] = await Promise.all([
    listSkoposPolicyPacksRuntime({ cwd: workspaceRoot }),
    loadSkoposGuardManifests({ cwd: workspaceRoot }),
    loadSkoposActionManifests({ cwd: workspaceRoot }),
  ]);
  const resolvedPolicy =
    providedPolicy ??
    (await resolveSkoposPolicyRuntime({ cwd: workspaceRoot, dryRun }))?.policy;
  const acceptedPackIds = new Set(
    resolvedPolicy?.acceptedPacks.map((pack) => pack.packId) ?? [],
  );
  const requirements = collectPolicyGuardRequirements(
    packs.filter((pack) => acceptedPackIds.has(pack.packId)),
  );
  const manifestById = new Map(manifests.map((manifest) => [manifest.id, manifest]));
  const actionIds = new Set(actions.map((action) => action.id));
  const requirementById = new Map(requirements.map((entry) => [entry.guardId, entry]));
  const allGuardIds = new Set([
    ...manifests.map((manifest) => manifest.id),
    ...requirements.map((requirement) => requirement.guardId),
  ]);
  const guards = [...allGuardIds]
    .map((guardId) =>
      projectGuardAvailability({
        guardId,
        manifest: manifestById.get(guardId),
        requirement: requirementById.get(guardId),
        actionIds,
      }),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const missingRequired = guards.filter(
    (guard) => guard.strength === 'required' && guard.status === 'missing',
  );
  const missingRecommended = guards.filter(
    (guard) => guard.strength === 'recommended' && guard.status === 'missing',
  );
  const now = resolvedPolicy?.updatedAt ?? '1970-01-01T00:00:00.000Z';
  const artifact: SkoposResolvedGuardsArtifact = {
    schemaVersion: 1,
    id: 'skopos.guard-availability',
    type: 'resolved-guards',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary: `Projected availability for ${guards.length} declared or policy-required Guard${guards.length === 1 ? '' : 's'}.`,
    workspaceRoot,
    packageManager: 'project-actions',
    detectedScripts: [],
    guards,
    missingRecommended,
    missingRequired,
  };

  if (!dryRun) {
    await mkdir(dirname(artifactPath), { recursive: true });
    await writeFile(`${artifactPath}.tmp`, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
    await rename(`${artifactPath}.tmp`, artifactPath);
  }

  return {
    artifact,
    artifactPath: RESOLVED_GUARDS_ARTIFACT_PATH,
    artifactWrite: dryRun ? 'dry-run' : 'written',
    actorId: actor,
  };
};

const collectPolicyGuardRequirements = (
  packs: SkoposPolicyPackManifest[],
): PolicyGuardRequirement[] => {
  const requirements = new Map<string, PolicyGuardRequirement>();
  for (const pack of packs) {
    for (const guardId of pack.guards?.recommended ?? []) {
      requirements.set(guardId, {
        guardId,
        packId: pack.packId,
        strength: 'recommended',
      });
    }
    for (const guardId of pack.guards?.required ?? []) {
      requirements.set(guardId, {
        guardId,
        packId: pack.packId,
        strength: 'required',
      });
    }
  }
  return [...requirements.values()];
};

export const projectGuardAvailability = ({
  guardId,
  manifest,
  requirement,
  actionIds,
}: {
  guardId: string;
  manifest?: SkoposGuardManifest;
  requirement?: PolicyGuardRequirement;
  actionIds: ReadonlySet<string>;
}): SkoposResolvedGuard => {
  if (!manifest) {
    return {
      id: guardId,
      packId: requirement?.packId ?? 'project',
      label: guardId,
      kind: 'project-action',
      strength: requirement?.strength ?? 'required',
      status: 'missing',
      severity: requirement?.strength === 'recommended' ? 'should' : 'must',
      summary: `Accepted policy requires Guard ${guardId}, but the project has not declared it.`,
      missingReason: `Declare Guard ${guardId} under the configured Guard source and bind it to explicit project Actions or observation Evidence.`,
    };
  }

  const missingActionIds = manifest.requires.actionIds.filter(
    (actionId) => !actionIds.has(actionId),
  );
  const manual =
    manifest.requires.evidence === 'agent-observation' &&
    manifest.requires.actionIds.length === 0;
  const status =
    missingActionIds.length > 0
      ? 'missing'
      : manual
        ? 'manual'
        : 'available';

  return {
    id: manifest.id,
    packId: requirement?.packId ?? manifest.owner,
    label: manifest.title,
    kind: manual ? 'agent-observation' : 'project-action',
    strength:
      manifest.strength === 'recommended'
        ? 'recommended'
        : requirement?.strength ?? 'required',
    status,
    severity:
      manifest.strength === 'recommended' && requirement?.strength !== 'required'
        ? 'should'
        : 'must',
    summary:
      status === 'missing'
        ? `Guard ${manifest.id} references missing Action provider${missingActionIds.length === 1 ? '' : 's'}: ${missingActionIds.join(', ')}.`
        : manifest.description,
    actionId:
      manifest.requires.actionIds.length === 1
        ? manifest.requires.actionIds[0]
        : undefined,
    missingReason:
      status === 'missing'
        ? `Declare the missing Action provider${missingActionIds.length === 1 ? '' : 's'}: ${missingActionIds.join(', ')}.`
        : undefined,
  };
};
