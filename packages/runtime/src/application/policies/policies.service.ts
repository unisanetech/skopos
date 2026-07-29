import { createHash } from 'node:crypto';
import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadSkoposConfig } from '@skopos/config';
import {
  buildSkoposSourceDependencyDigest,
  isWorkspaceIgnoredPath,
  loadSkoposProjectPolicySource,
  loadSkoposPolicyPacks,
  normalizeWorkspaceIgnorePaths,
  serializeSkoposProjectPolicySource,
  SKOPOS_PROJECT_POLICY_SOURCE_PATH,
} from '@skopos/indexer';
import type { SkoposLoadedPolicyPack } from '@skopos/indexer';
import type {
  SkoposDriftFamily,
  SkoposDriftFinding,
  SkoposDriftReportArtifact,
  SkoposTaskRiskRule,
  SkoposPolicyOverride,
  SkoposPolicyOverrideArtifact,
  SkoposPolicyRecommendationArtifact,
  SkoposPolicyRecommendationEntry,
  SkoposPolicyRoleMapping,
  SkoposPolicyRoleMappingArtifact,
  SkoposPolicyRoleMappingDecision,
  SkoposPolicyRoleMappingDecisionArtifact,
  SkoposPolicyRoleMappingDecisionStatus,
  SkoposProjectLifecycle,
  SkoposProjectPolicySource,
  SkoposResolvedPolicyArtifact,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import {
  buildSkoposAgentPolicyBrief,
  writeSkoposAgentBrief,
} from '../shared/agent-briefs.js';
import {
  DRIFT_REPORT_ARTIFACT_PATH,
  POLICY_BRIEF_ARTIFACT_PATH,
  POLICY_RECOMMENDATIONS_ARTIFACT_PATH,
  POLICY_ROLE_MAPPING_ARTIFACT_PATH,
  RESOLVED_POLICY_ARTIFACT_PATH,
} from '../shared/token-control-constants.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface ListSkoposPolicyPacksRuntimeOptions {
  cwd: string;
}

export interface ShowSkoposPolicyPackRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  pack: string;
}

export interface RecommendSkoposPolicyPacksRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  dryRun?: boolean;
}

export interface ApplySkoposPolicyPackRuntimeOptions extends ShowSkoposPolicyPackRuntimeOptions {
  actor?: string;
  reason?: string;
  dryRun?: boolean;
}

export interface BuildSkoposPolicyDriftRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  actor?: string;
  dryRun?: boolean;
}

export interface ListSkoposPolicyOverridesRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {}

export interface AddSkoposPolicyOverrideRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  id?: string;
  findingId?: string;
  ruleId?: string;
  packId?: string;
  sourcePath?: string;
  severity?: SkoposPolicyOverride['severity'];
  reason: string;
  owner?: string;
  expiresAt?: string;
  actor?: string;
  dryRun?: boolean;
}

export interface RemoveSkoposPolicyOverrideRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  id: string;
  actor?: string;
  dryRun?: boolean;
}

export interface UpsertSkoposPolicyRoleMappingDecisionRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  packId: string;
  role: string;
  status: SkoposPolicyRoleMappingDecisionStatus;
  matchedPaths?: string[];
  reason: string;
  owner?: string;
  actor?: string;
  dryRun?: boolean;
}

export interface RemoveSkoposPolicyRoleMappingDecisionRuntimeOptions extends ListSkoposPolicyPacksRuntimeOptions {
  id: string;
  actor?: string;
  dryRun?: boolean;
}

export interface ApplySkoposPolicyPackRuntimeResult {
  policySourcePath: string;
  policySourceWrite: 'written' | 'dry-run';
  policy: SkoposResolvedPolicyArtifact;
  policyWrite: 'written' | 'dry-run';
  policyPath: string;
  roleMapping: SkoposPolicyRoleMappingArtifact;
  roleMappingPath: string;
  roleMappingWrite: 'written' | 'dry-run';
  policyBriefPath: string;
  policyBriefWrite: 'written' | 'dry-run';
  agentsPath: string;
  agentsWrite: 'written' | 'dry-run';
  actorId?: string;
}

export interface BuildSkoposPolicyDriftRuntimeResult {
  report: SkoposDriftReportArtifact;
  reportPath: string;
  reportWrite: 'written' | 'dry-run';
  actorId?: string;
}

export interface SkoposPolicyOverridesRuntimeResult {
  artifact: SkoposPolicyOverrideArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  resolvedPolicyPath: string;
  resolvedPolicyWrite: 'written' | 'dry-run' | 'not-present';
  actorId?: string;
}

export interface SkoposPolicyRoleMappingDecisionsRuntimeResult {
  artifact: SkoposPolicyRoleMappingDecisionArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  roleMapping: SkoposPolicyRoleMappingArtifact;
  roleMappingPath: string;
  roleMappingWrite: 'written' | 'dry-run' | 'not-present';
  policyBriefPath: string;
  policyBriefWrite: 'written' | 'dry-run' | 'not-present';
  actorId?: string;
}

const BUNDLED_POLICY_PACK_ROOT = join(dirname(fileURLToPath(import.meta.url)), 'policy-packs');
const SOURCE_POLICY_PACK_ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  '..',
  'policy-packs',
);

const resolvePolicyPackRoots = (_workspaceRoot: string): string[] => [
  'policy-packs',
  BUNDLED_POLICY_PACK_ROOT,
  SOURCE_POLICY_PACK_ROOT,
];

export const listSkoposPolicyPacksRuntime = async ({
  cwd,
}: ListSkoposPolicyPacksRuntimeOptions): Promise<SkoposLoadedPolicyPack[]> =>
  loadSkoposPolicyPacks({
    cwd: resolve(cwd),
    packRoots: resolvePolicyPackRoots(resolve(cwd)),
  });

export const showSkoposPolicyPackRuntime = async ({
  cwd,
  pack,
}: ShowSkoposPolicyPackRuntimeOptions): Promise<SkoposLoadedPolicyPack> => {
  const packs = await listSkoposPolicyPacksRuntime({ cwd });
  const matched = packs.find(
    (candidate) => candidate.packId === pack || candidate.id === pack || candidate.sourcePath === pack,
  );

  if (!matched) {
    throw new Error(`Unknown Skopos policy pack: ${pack}`);
  }

  return matched;
};

export const recommendSkoposPolicyPacksRuntime = async ({
  cwd,
  dryRun = false,
}: RecommendSkoposPolicyPacksRuntimeOptions): Promise<SkoposPolicyRecommendationArtifact> => {
  const workspaceRoot = resolve(cwd);
  const packs = await listSkoposPolicyPacksRuntime({ cwd: workspaceRoot });
  const projectLifecycle = await inferProjectLifecycle(workspaceRoot);
  const projectSignals = await analyzeProjectPolicySignals(workspaceRoot);
  const policySource = await loadSkoposProjectPolicySource({ cwd: workspaceRoot });
  const acceptedPackIds = new Set(
    policySource?.acceptedPacks.map((pack) => pack.packId) ?? [],
  );
  const recommendations = packs.map((pack) =>
    recommendPack(pack, projectLifecycle, acceptedPackIds.has(pack.packId), projectSignals),
  );
  const artifact: SkoposPolicyRecommendationArtifact = {
    schemaVersion: 1,
    id: 'policy-recommendations',
    type: 'policy-recommendations',
    status: 'generated',
    authority: 'generated',
    summary: `Skopos evaluated ${packs.length} policy pack${packs.length === 1 ? '' : 's'} for ${projectLifecycle}.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    projectLifecycle,
    defaultTaskRisk: policySource?.defaultTaskRisk ?? 'standard',
    recommendedTaskRisks: buildDefaultTaskRiskRules(),
    recommendations,
  };

  await writeJsonArtifact({
    artifactPath: join(workspaceRoot, POLICY_RECOMMENDATIONS_ARTIFACT_PATH),
    artifact,
    dryRun,
  });

  return artifact;
};

export const applySkoposPolicyPackRuntime = async ({
  cwd,
  pack,
  actor,
  reason,
  dryRun = false,
}: ApplySkoposPolicyPackRuntimeOptions): Promise<ApplySkoposPolicyPackRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireTrackedPolicyActor(actor);
  if (!reason?.trim()) {
    throw new Error('Policy acceptance requires an explicit reason.');
  }
  const selected = await showSkoposPolicyPackRuntime({ cwd: workspaceRoot, pack });
  const now = new Date().toISOString();
  const existingSource =
    (await loadSkoposProjectPolicySource({ cwd: workspaceRoot })) ??
    createEmptyProjectPolicySource(now);
  const policySource: SkoposProjectPolicySource = {
    ...existingSource,
    updatedAt: now,
    acceptedPacks: [
      ...existingSource.acceptedPacks.filter((entry) => entry.packId !== selected.packId),
      {
        packId: selected.packId,
        version: selected.version,
        acceptedAt: now,
        acceptedBy: actorId,
        reason: reason.trim(),
        source: 'manual' as const,
      },
    ].sort((left, right) => left.packId.localeCompare(right.packId)),
  };
  const policySourcePath = join(workspaceRoot, SKOPOS_PROJECT_POLICY_SOURCE_PATH);
  if (!dryRun) {
    await writeResolvedPolicyProjections({
      workspaceRoot,
      source: policySource,
      dryRun: true,
    });
  }
  const policySourceWrite = await writeProjectPolicySource({
    policySourcePath,
    source: policySource,
    dryRun,
  });
  const projections = await writeResolvedPolicyProjections({
    workspaceRoot,
    source: policySource,
    dryRun,
  });
  const agentsPath = join(workspaceRoot, 'AGENTS.md');
  const agentsWrite = await upsertAgentsPolicySection({
    agentsPath,
    policy: projections.policy,
    dryRun,
  });

  if (!dryRun) {
    await appendSkoposOperationalLogEntry({
      workspaceRoot,
      eventKind: 'policy',
      status: 'succeeded',
      summary: `Accepted policy pack ${selected.packId}.`,
      metadata: {
        actorId,
        packId: selected.packId,
        policySourcePath: SKOPOS_PROJECT_POLICY_SOURCE_PATH,
        policyPath: RESOLVED_POLICY_ARTIFACT_PATH,
        roleMappingPath: POLICY_ROLE_MAPPING_ARTIFACT_PATH,
      },
    });
    await refreshSkoposKnowledgeIndex({ workspaceRoot });
  }

  return {
    policySourcePath,
    policySourceWrite,
    ...projections,
    agentsPath,
    agentsWrite,
    actorId,
  };
};

export const resolveSkoposPolicyRuntime = async ({
  cwd,
  dryRun = false,
}: {
  cwd: string;
  dryRun?: boolean;
}): Promise<
  Omit<
    ApplySkoposPolicyPackRuntimeResult,
    'policySourcePath' | 'policySourceWrite' | 'agentsPath' | 'agentsWrite' | 'actorId'
  > | null
> => {
  const workspaceRoot = resolve(cwd);
  const source = await loadSkoposProjectPolicySource({ cwd: workspaceRoot });
  if (!source) {
    return null;
  }

  const projections = await writeResolvedPolicyProjections({
    workspaceRoot,
    source,
    dryRun,
  });
  await upsertAgentsPolicySection({
    agentsPath: join(workspaceRoot, 'AGENTS.md'),
    policy: projections.policy,
    dryRun,
  });
  return projections;
};

const writeResolvedPolicyProjections = async ({
  workspaceRoot,
  source,
  dryRun,
}: {
  workspaceRoot: string;
  source: SkoposProjectPolicySource;
  dryRun: boolean;
}): Promise<
  Omit<
    ApplySkoposPolicyPackRuntimeResult,
    'policySourcePath' | 'policySourceWrite' | 'agentsPath' | 'agentsWrite' | 'actorId'
  >
> => {
  const packs = await listSkoposPolicyPacksRuntime({ cwd: workspaceRoot });
  const projectLifecycle = await inferProjectLifecycle(workspaceRoot);
  const acceptedPacks = source.acceptedPacks.map((acceptance) => {
    const matched = packs.find(
      (candidate) =>
        candidate.packId === acceptance.packId && candidate.version === acceptance.version,
    );
    if (!matched) {
      throw new Error(
        `Tracked policy ${acceptance.packId}@${acceptance.version} has no matching pack source.`,
      );
    }
    return { acceptance, pack: matched };
  });
  const activeRules = dedupePolicyRules(
    acceptedPacks.flatMap(({ pack }) => pack.rules),
  );
  const sourcePaths = dedupeStrings([
    SKOPOS_PROJECT_POLICY_SOURCE_PATH,
    ...acceptedPacks.map(({ pack }) => pack.sourcePath),
  ]);
  const sourceDependencies = await buildResolvedPolicySourceDependencies({
    workspaceRoot,
    source,
    sourcePaths,
    dryRun,
  });
  const policy: SkoposResolvedPolicyArtifact = {
    schemaVersion: 1,
    id: 'resolved-policy',
    type: 'resolved-policy',
    status: 'generated',
    authority: 'generated',
    summary: `Accepted policy resolves ${acceptedPacks.length} pack${acceptedPacks.length === 1 ? '' : 's'} with ${activeRules.length} active rules.`,
    updatedAt: source.updatedAt,
    generatedAt: source.updatedAt,
    workspaceRoot,
    profileId: `${projectLifecycle}.${acceptedPacks.map(({ acceptance }) => acceptance.packId).join('+')}`,
    projectLifecycle,
    defaultTaskRisk: source.defaultTaskRisk,
    recommendedTaskRisks: buildDefaultTaskRiskRules(),
    acceptedPacks: acceptedPacks.map(({ acceptance }) => acceptance),
    overrides: source.overrides,
    activeRules,
    sourceDependencies,
    generatedDocPaths: [],
  };
  const policyPath = join(workspaceRoot, RESOLVED_POLICY_ARTIFACT_PATH);
  const policyWrite = await writeJsonArtifact({
    artifactPath: policyPath,
    artifact: policy,
    dryRun,
  });
  const roleMapping = await buildPolicyRoleMappingArtifact({
    workspaceRoot,
    policy,
    packs,
    decisions: source.roleMappings,
  });
  const roleMappingPath = join(workspaceRoot, POLICY_ROLE_MAPPING_ARTIFACT_PATH);
  const roleMappingWrite = await writeJsonArtifact({
    artifactPath: roleMappingPath,
    artifact: roleMapping,
    dryRun,
  });
  const policyBrief = await writeSkoposAgentBrief({
    artifactPath: join(workspaceRoot, POLICY_BRIEF_ARTIFACT_PATH),
    artifact: buildSkoposAgentPolicyBrief({
      workspaceRoot,
      policy,
      roleMappingPath: POLICY_ROLE_MAPPING_ARTIFACT_PATH,
      mappedRoleCount: roleMapping.mappings.filter((mapping) =>
        ['confirmed', 'inferred'].includes(mapping.status),
      ).length,
      missingRequiredRoleCount: roleMapping.mappings.filter(
        (mapping) => mapping.status === 'missing',
      ).length,
    }),
    dryRun,
  });

  return {
    policy,
    policyWrite,
    policyPath,
    roleMapping,
    roleMappingPath,
    roleMappingWrite,
    policyBriefPath: policyBrief.path,
    policyBriefWrite: policyBrief.write,
  };
};

const buildPolicyRoleMappingArtifact = async ({
  workspaceRoot,
  policy,
  packs,
  decisions = [],
}: {
  workspaceRoot: string;
  policy: SkoposResolvedPolicyArtifact;
  packs: SkoposLoadedPolicyPack[];
  decisions?: SkoposPolicyRoleMappingDecision[];
}): Promise<SkoposPolicyRoleMappingArtifact> => {
  const acceptedPackIds = new Set(policy.acceptedPacks.map((entry) => entry.packId));
  const decisionByKey = new Map(decisions.map((decision) => [buildPolicyRoleMappingDecisionKey(decision), decision]));
  const projectSignals = await analyzeProjectPolicySignals(workspaceRoot);
  const mappings = (
    await Promise.all(
      packs
        .filter((pack) => acceptedPackIds.has(pack.packId) && Boolean(pack.structureTree))
        .flatMap((pack) =>
          (pack.structureTree?.nodes ?? []).map((node) =>
            buildPolicyRoleMapping({
              workspaceRoot,
              pack,
              role: node,
              projectSignals,
            }),
          ),
        ),
    )
  )
    .map((mapping) => applyPolicyRoleMappingDecision(mapping, decisionByKey.get(buildPolicyRoleMappingDecisionKey(mapping))))
    .sort((left, right) => `${left.packId}:${left.role}`.localeCompare(`${right.packId}:${right.role}`));
  const missingRequiredCount = mappings.filter((mapping) => mapping.status === 'missing').length;

  return {
    schemaVersion: 1,
    id: 'policy-role-mapping',
    type: 'policy-role-mapping',
    status: 'generated',
    authority: 'generated',
    summary:
      missingRequiredCount === 0
        ? `Mapped ${mappings.length} accepted policy role${mappings.length === 1 ? '' : 's'} to local project paths.`
        : `Mapped accepted policy roles with ${missingRequiredCount} required role${missingRequiredCount === 1 ? '' : 's'} still needing a local mapping.`,
    updatedAt: policy.updatedAt,
    generatedAt: policy.generatedAt,
    workspaceRoot,
    resolvedPolicyPath: RESOLVED_POLICY_ARTIFACT_PATH,
    mappings,
  };
};

const applyPolicyRoleMappingDecision = (
  mapping: SkoposPolicyRoleMapping,
  decision?: SkoposPolicyRoleMappingDecision,
): SkoposPolicyRoleMapping => {
  if (!decision) {
    return mapping;
  }

  if (decision.status === 'ignored') {
    return {
      ...mapping,
      status: 'ignored',
      confidence: 'high',
      reason: decision.reason,
    };
  }

  const matchedPaths = decision.matchedPaths && decision.matchedPaths.length > 0
    ? dedupeStrings(decision.matchedPaths)
    : mapping.matchedPaths;

  return {
    ...mapping,
    status: 'confirmed',
    confidence: 'high',
    matchedPaths,
    matchedAliases:
      decision.matchedPaths && decision.matchedPaths.length > 0
        ? ['manual decision']
        : mapping.matchedAliases,
    reason: decision.reason,
  };
};

const buildPolicyRoleMapping = async ({
  workspaceRoot,
  pack,
  role,
  projectSignals,
}: {
  workspaceRoot: string;
  pack: SkoposLoadedPolicyPack;
  role: NonNullable<SkoposLoadedPolicyPack['structureTree']>['nodes'][number];
  projectSignals: ProjectPolicySignals;
}): Promise<SkoposPolicyRoleMapping> => {
  const checkedAliases = role.matchPaths && role.matchPaths.length > 0 ? role.matchPaths : [role.path];
  const aliasMatches = await Promise.all(
    checkedAliases.map(async (alias) => ({
      alias,
      paths: await findExistingRelativePaths(workspaceRoot, alias),
    })),
  );
  const matchedPaths = [...new Set(aliasMatches.flatMap((match) => match.paths))].sort((left, right) =>
    left.localeCompare(right),
  );
  const matchedAliases = aliasMatches
    .filter((match) => match.paths.length > 0)
    .map((match) => match.alias)
    .sort((left, right) => left.localeCompare(right));
  const required = role.required ?? false;
  const simpleProjectFallback =
    matchedPaths.length === 0
      ? buildSmallProjectRoleFallback({ pack, role, checkedAliases, projectSignals })
      : undefined;
  if (simpleProjectFallback) {
    return simpleProjectFallback;
  }
  const status: SkoposPolicyRoleMapping['status'] =
    matchedPaths.length > 0 ? 'inferred' : required ? 'missing' : 'needs-review';
  const confidence: SkoposPolicyRoleMapping['confidence'] =
    matchedAliases.length > 0 ? 'high' : required ? 'low' : 'medium';

  return {
    packId: pack.packId,
    sourcePath: pack.sourcePath,
    role: role.path,
    label: role.label,
    required,
    status,
    confidence,
    checkedAliases,
    matchedAliases,
    matchedPaths,
    reason:
      matchedPaths.length > 0
        ? `Matched ${role.label} through ${matchedAliases.length} local alias${matchedAliases.length === 1 ? '' : 'es'}.`
        : required
          ? `No local path matched required role ${role.label}.`
          : `Optional role ${role.label} has no local mapping yet.`,
  };
};

export const buildSkoposPolicyDriftRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: BuildSkoposPolicyDriftRuntimeOptions): Promise<BuildSkoposPolicyDriftRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const resolved = await resolveSkoposPolicyRuntime({
    cwd: workspaceRoot,
    dryRun: true,
  });
  const policy = resolved?.policy;
  if (!policy || policy.acceptedPacks.length === 0) {
    throw new Error(
      `No accepted policy found in ${SKOPOS_PROJECT_POLICY_SOURCE_PATH}. Run \`skopos policies apply <pack> .\` before drift detection.`,
    );
  }
  const config = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));

  const rawFindings = await detectPolicyDrift({
    workspaceRoot,
    policy,
    ignoredPaths: normalizeWorkspaceIgnorePaths(config?.workspace.ignore ?? []),
  });
  const findings = applyPolicyOverridesToFindings({
    findings: rawFindings,
    overrides: policy.overrides,
  });
  const report: SkoposDriftReportArtifact = {
    schemaVersion: 1,
    id: 'drift-report',
    type: 'drift-report',
    status: 'generated',
    authority: 'generated',
    summary:
      findings.length === 0
        ? 'No open accepted-policy drift was detected.'
        : `Detected ${findings.length} accepted-policy drift finding${findings.length === 1 ? '' : 's'}.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    resolvedPolicyPath: RESOLVED_POLICY_ARTIFACT_PATH,
    counts: {
      openMustCount: findings.filter((finding) => finding.status === 'open' && finding.severity === 'must').length,
      openShouldCount: findings.filter((finding) => finding.status === 'open' && finding.severity === 'should').length,
      advisoryCount: findings.filter((finding) => finding.severity === 'advisory').length,
      suppressedCount: findings.filter((finding) => finding.status === 'suppressed').length,
      resolvedCount: findings.filter((finding) => finding.status === 'resolved').length,
    },
    findings,
  };
  const reportPath = join(workspaceRoot, DRIFT_REPORT_ARTIFACT_PATH);
  const reportWrite = await writeJsonArtifact({
    artifactPath: reportPath,
    artifact: report,
    dryRun,
  });

  if (!dryRun) {
    await appendSkoposOperationalLogEntry({
      workspaceRoot,
      eventKind: 'policy-drift',
      status: 'succeeded',
      summary: report.summary ?? 'Policy drift report refreshed.',
      metadata: {
        actorId: actorId ?? null,
        findingCount: findings.length,
        openMustCount: report.counts.openMustCount,
        reportPath: DRIFT_REPORT_ARTIFACT_PATH,
      },
    });
    await refreshSkoposKnowledgeIndex({ workspaceRoot });
  }

  return {
    report,
    reportPath,
    reportWrite,
    actorId,
  };
};

export const listSkoposPolicyOverridesRuntime = async ({
  cwd,
}: ListSkoposPolicyOverridesRuntimeOptions): Promise<SkoposPolicyOverrideArtifact> => {
  const workspaceRoot = resolve(cwd);
  const source = await readProjectPolicySource(workspaceRoot);
  return buildPolicyOverrideArtifact({
    workspaceRoot,
    overrides: source.overrides,
  });
};

export const addSkoposPolicyOverrideRuntime = async ({
  cwd,
  id,
  findingId,
  ruleId,
  packId,
  sourcePath,
  severity,
  reason,
  owner,
  expiresAt,
  actor,
  dryRun = false,
}: AddSkoposPolicyOverrideRuntimeOptions): Promise<SkoposPolicyOverridesRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireTrackedPolicyActor(actor);
  const now = new Date().toISOString();
  const overrideId = id ?? buildPolicyOverrideId({ findingId, ruleId, packId, sourcePath });
  const source = await readProjectPolicySource(workspaceRoot);
  const existing = source.overrides;
  const nextOverride: SkoposPolicyOverride = {
    id: overrideId,
    findingId,
    ruleId,
    packId,
    sourcePath,
    severity,
    reason,
    owner,
    expiresAt,
    createdAt: existing.find((entry) => entry.id === overrideId)?.createdAt ?? now,
    createdBy: existing.find((entry) => entry.id === overrideId)?.createdBy ?? actorId,
    updatedAt: now,
  };
  const overrides = dedupePolicyOverrides([
    ...existing.filter((entry) => entry.id !== overrideId),
    nextOverride,
  ]);
  return writePolicySourceOverridesAndRefresh({
    workspaceRoot,
    source,
    overrides,
    dryRun,
    actorId,
    eventSummary: `Added policy override ${overrideId}.`,
  });
};

export const removeSkoposPolicyOverrideRuntime = async ({
  cwd,
  id,
  actor,
  dryRun = false,
}: RemoveSkoposPolicyOverrideRuntimeOptions): Promise<SkoposPolicyOverridesRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireTrackedPolicyActor(actor);
  const source = await readProjectPolicySource(workspaceRoot);
  const existing = source.overrides;
  const overrides = existing.filter((entry) => entry.id !== id);
  if (overrides.length === existing.length) {
    throw new Error(`Unknown Skopos policy override: ${id}`);
  }

  return writePolicySourceOverridesAndRefresh({
    workspaceRoot,
    source,
    overrides,
    dryRun,
    actorId,
    eventSummary: `Removed policy override ${id}.`,
  });
};

export const listSkoposPolicyRoleMappingDecisionsRuntime = async ({
  cwd,
}: ListSkoposPolicyPacksRuntimeOptions): Promise<SkoposPolicyRoleMappingDecisionArtifact> => {
  const workspaceRoot = resolve(cwd);
  const source = await readProjectPolicySource(workspaceRoot);
  return buildPolicyRoleMappingDecisionArtifact({
    workspaceRoot,
    decisions: source.roleMappings,
  });
};

export const upsertSkoposPolicyRoleMappingDecisionRuntime = async ({
  cwd,
  packId,
  role,
  status,
  matchedPaths = [],
  reason,
  owner,
  actor,
  dryRun = false,
}: UpsertSkoposPolicyRoleMappingDecisionRuntimeOptions): Promise<SkoposPolicyRoleMappingDecisionsRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireTrackedPolicyActor(actor);
  const now = new Date().toISOString();
  const decisionId = buildPolicyRoleMappingDecisionId({ packId, role });
  const source = await readProjectPolicySource(workspaceRoot);
  const existing = source.roleMappings;
  const currentDecision = existing.find((entry) => entry.id === decisionId);
  const nextDecision: SkoposPolicyRoleMappingDecision = {
    id: decisionId,
    packId,
    role,
    status,
    matchedPaths: dedupeStrings(matchedPaths),
    reason,
    owner,
    createdAt: currentDecision?.createdAt ?? now,
    createdBy: currentDecision?.createdBy ?? actorId,
    updatedAt: now,
  };

  return writePolicySourceRoleMappingsAndRefresh({
    workspaceRoot,
    source,
    decisions: dedupePolicyRoleMappingDecisions([
      ...existing.filter((entry) => entry.id !== decisionId),
      nextDecision,
    ]),
    dryRun,
    actorId,
    eventSummary: `Updated role mapping decision ${decisionId}.`,
  });
};

export const removeSkoposPolicyRoleMappingDecisionRuntime = async ({
  cwd,
  id,
  actor,
  dryRun = false,
}: RemoveSkoposPolicyRoleMappingDecisionRuntimeOptions): Promise<SkoposPolicyRoleMappingDecisionsRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireTrackedPolicyActor(actor);
  const source = await readProjectPolicySource(workspaceRoot);
  const existing = source.roleMappings;
  const decisions = existing.filter((entry) => entry.id !== id);
  if (decisions.length === existing.length) {
    throw new Error(`Unknown Skopos policy role mapping decision: ${id}`);
  }

  return writePolicySourceRoleMappingsAndRefresh({
    workspaceRoot,
    source,
    decisions,
    dryRun,
    actorId,
    eventSummary: `Removed role mapping decision ${id}.`,
  });
};

const recommendPack = (
  pack: SkoposLoadedPolicyPack,
  projectLifecycle: SkoposProjectLifecycle,
  accepted: boolean,
  projectSignals: ProjectPolicySignals,
): SkoposPolicyRecommendationEntry => {
  const lifecycleMatch = pack.projectLifecycles.includes(projectLifecycle);
  const antiSignals = lifecycleMatch ? [] : pack.avoidWhen;

  if (accepted) {
    return {
      packId: pack.packId,
      version: pack.version,
      family: pack.family,
      variant: pack.variant,
      displayName: pack.displayName,
      confidence: 'high',
      recommendation: 'review',
      reason: `${pack.displayName} is already accepted. Review it only if the project profile or local policy changed.`,
      plainLanguageSummary: pack.plainLanguageSummary,
      qualityBar: pack.qualityBar,
      accepted: true,
      signals: pack.appliesWhen,
      antiSignals: [],
      sourcePath: pack.sourcePath,
    };
  }

  if (!lifecycleMatch) {
    return {
      packId: pack.packId,
      version: pack.version,
      family: pack.family,
      variant: pack.variant,
      displayName: pack.displayName,
      confidence: 'medium',
      recommendation: 'review',
      reason: `Review manually because the pack targets ${pack.projectLifecycles.join(', ')} while the inferred lifecycle is ${projectLifecycle}.`,
      plainLanguageSummary: pack.plainLanguageSummary,
      qualityBar: pack.qualityBar,
      accepted: false,
      signals: pack.appliesWhen,
      antiSignals,
      sourcePath: pack.sourcePath,
    };
  }

  if (pack.packId === 'stack.async-work' && !projectSignals.hasAsyncWorkSignals) {
    return {
      packId: pack.packId,
      version: pack.version,
      family: pack.family,
      variant: pack.variant,
      displayName: pack.displayName,
      confidence: 'low',
      recommendation: 'review',
      reason: 'Review only when the project is adding jobs, queues, cron, Redis, workers, webhooks, retries, or other background work. This scan found no async-work signals.',
      plainLanguageSummary: pack.plainLanguageSummary,
      qualityBar: pack.qualityBar,
      accepted: false,
      signals: [],
      antiSignals: pack.avoidWhen,
      sourcePath: pack.sourcePath,
    };
  }

  if (pack.packId === 'architecture.mid-app' && projectSignals.simpleSourceProject) {
    return {
      packId: pack.packId,
      version: pack.version,
      family: pack.family,
      variant: pack.variant,
      displayName: pack.displayName,
      confidence: 'medium',
      recommendation: 'review',
      reason: 'Review manually because this looks like a small source package, not a product app with app shell, feature areas, and infrastructure adapters.',
      plainLanguageSummary: pack.plainLanguageSummary,
      qualityBar: pack.qualityBar,
      accepted: false,
      signals: pack.appliesWhen,
      antiSignals: pack.avoidWhen,
      sourcePath: pack.sourcePath,
    };
  }

  return {
    packId: pack.packId,
    version: pack.version,
    family: pack.family,
    variant: pack.variant,
    displayName: pack.displayName,
    confidence: pack.appliesWhen.some((signal) => signal.confidence === 'high') ? 'high' : 'medium',
    recommendation: 'apply',
    reason: `${pack.displayName} matches the inferred ${projectLifecycle} lifecycle and provides ${pack.rules.length} operational rule${pack.rules.length === 1 ? '' : 's'}.`,
    plainLanguageSummary: pack.plainLanguageSummary,
    qualityBar: pack.qualityBar,
    accepted: false,
    signals: pack.appliesWhen,
    antiSignals: [],
    sourcePath: pack.sourcePath,
  };
};

interface ProjectPolicySignals {
  hasPackageJson: boolean;
  hasSourceRoot: boolean;
  hasWorkspaceManifest: boolean;
  hasAsyncWorkSignals: boolean;
  hasAppArchitectureSignals: boolean;
  simpleSourceProject: boolean;
  sourceFileCount: number;
}

const analyzeProjectPolicySignals = async (workspaceRoot: string): Promise<ProjectPolicySignals> => {
  const entries = await readDirectoryNames(workspaceRoot);
  const packageJson = await readJsonIfExists<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    workspaces?: unknown;
  }>(join(workspaceRoot, 'package.json'));
  const sourceFiles = await listFilesUnder(workspaceRoot, [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '.cjs',
    '.mts',
    '.cts',
  ]);
  const sourceFileText = (
    await Promise.all(
      sourceFiles.slice(0, 80).map(async (filePath) => (await readTextIfExists(filePath)) ?? ''),
    )
  ).join('\n');
  const dependencyNames = Object.keys({
    ...(packageJson?.dependencies ?? {}),
    ...(packageJson?.devDependencies ?? {}),
  });
  const searchableText = [
    entries.join(' '),
    sourceFiles.map((filePath) => relative(workspaceRoot, filePath)).join(' '),
    dependencyNames.join(' '),
    sourceFileText,
  ]
    .join('\n')
    .toLowerCase();
  const hasWorkspaceManifest =
    entries.includes('pnpm-workspace.yaml') ||
    entries.includes('lerna.json') ||
    entries.includes('turbo.json') ||
    Array.isArray(packageJson?.workspaces) ||
    Boolean(packageJson?.workspaces && typeof packageJson.workspaces === 'object');
  const hasAsyncWorkSignals =
    /\b(redis|bullmq|queue|queues|queued|worker|workers|cron|schedule|scheduler|webhook|retry|retries|inngest|temporal|background job|job queue)\b/.test(
      searchableText,
    );
  const hasAppArchitectureSignals =
    /\b(next|react|vue|svelte|express|fastify|hono|koa|router|routes|pages|server|app shell|controller|middleware)\b/.test(
      searchableText,
    );

  return {
    hasPackageJson: entries.includes('package.json'),
    hasSourceRoot: entries.includes('src'),
    hasWorkspaceManifest,
    hasAsyncWorkSignals,
    hasAppArchitectureSignals,
    sourceFileCount: sourceFiles.length,
    simpleSourceProject:
      entries.includes('package.json') &&
      entries.includes('src') &&
      sourceFiles.length <= 16 &&
      !hasWorkspaceManifest &&
      !hasAppArchitectureSignals &&
      !hasAsyncWorkSignals,
  };
};

const buildSmallProjectRoleFallback = ({
  pack,
  role,
  checkedAliases,
  projectSignals,
}: {
  pack: SkoposLoadedPolicyPack;
  role: NonNullable<SkoposLoadedPolicyPack['structureTree']>['nodes'][number];
  checkedAliases: string[];
  projectSignals: ProjectPolicySignals;
}): SkoposPolicyRoleMapping | undefined => {
  if (!projectSignals.simpleSourceProject) {
    return undefined;
  }

  const rolePath = role.path.toLowerCase();
  const isBehaviorOwner =
    rolePath.includes('feature') ||
    rolePath.includes('modules') ||
    rolePath.includes('domains') ||
    rolePath.includes('use-case');
  if (isBehaviorOwner && projectSignals.hasSourceRoot) {
    return {
      packId: pack.packId,
      sourcePath: pack.sourcePath,
      role: role.path,
      label: role.label,
      required: role.required ?? false,
      status: 'inferred',
      confidence: 'medium',
      checkedAliases,
      matchedAliases: ['src'],
      matchedPaths: ['src'],
      reason: `Small source package fallback: \`src\` is the local owner for ${role.label}.`,
    };
  }

  if (rolePath.includes('composition root') || rolePath.includes('infrastructure') || rolePath.includes('adapter')) {
    return {
      packId: pack.packId,
      sourcePath: pack.sourcePath,
      role: role.path,
      label: role.label,
      required: role.required ?? false,
      status: 'needs-review',
      confidence: 'medium',
      checkedAliases,
      matchedAliases: [],
      matchedPaths: [],
      reason: `This looks like a small source package. Map ${role.label} only if the project actually has this app-level role.`,
    };
  }

  return undefined;
};

const createEmptyProjectPolicySource = (
  updatedAt: string,
): SkoposProjectPolicySource => ({
  schemaVersion: 1,
  updatedAt,
  defaultTaskRisk: 'standard',
  acceptedPacks: [],
  overrides: [],
  roleMappings: [],
});

const readProjectPolicySource = async (
  workspaceRoot: string,
): Promise<SkoposProjectPolicySource> =>
  (await loadSkoposProjectPolicySource({ cwd: workspaceRoot })) ??
  createEmptyProjectPolicySource(new Date().toISOString());

const writeProjectPolicySource = async ({
  policySourcePath,
  source,
  dryRun,
}: {
  policySourcePath: string;
  source: SkoposProjectPolicySource;
  dryRun: boolean;
}): Promise<'written' | 'dry-run'> => {
  if (dryRun) {
    return 'dry-run';
  }

  await mkdir(dirname(policySourcePath), { recursive: true });
  await writeFile(
    policySourcePath,
    serializeSkoposProjectPolicySource(source),
    'utf8',
  );
  return 'written';
};

const buildResolvedPolicySourceDependencies = async ({
  workspaceRoot,
  source,
  sourcePaths,
  dryRun,
}: {
  workspaceRoot: string;
  source: SkoposProjectPolicySource;
  sourcePaths: string[];
  dryRun: boolean;
}): Promise<SkoposResolvedPolicyArtifact['sourceDependencies']> =>
  Promise.all(
    [...sourcePaths].sort().map(async (sourcePath) => {
      if (sourcePath === SKOPOS_PROJECT_POLICY_SOURCE_PATH) {
        return {
          path: sourcePath,
          kind: 'policy-source' as const,
          existsAtBuild: true,
          digest: dryRun
            ? digestProjectedPolicySource(sourcePath, source)
            : await buildSkoposSourceDependencyDigest(
                workspaceRoot,
                sourcePath,
                'policy-source',
              ),
        };
      }

      const existsAtBuild = await pathExists(resolve(workspaceRoot, sourcePath));
      if (!existsAtBuild) {
        throw new Error(`Accepted policy source is missing: ${sourcePath}`);
      }

      return {
        path: sourcePath,
        kind: 'policy-pack' as const,
        existsAtBuild,
        digest: await buildSkoposSourceDependencyDigest(
          workspaceRoot,
          sourcePath,
          'policy-pack',
        ),
      };
    }),
  );

const digestProjectedPolicySource = (
  sourcePath: string,
  source: SkoposProjectPolicySource,
): string => {
  const hash = createHash('sha256');
  hash.update(sourcePath);
  hash.update('\0');
  hash.update('file\0');
  hash.update(
    Buffer.from(serializeSkoposProjectPolicySource(source), 'utf8').toString('base64'),
  );
  return `sha256:${hash.digest('hex')}`;
};

const requireTrackedPolicyActor = (actor?: string): string => {
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Tracked policy changes require an explicit actor.');
  }
  return actorId;
};

const buildPolicyRoleMappingDecisionArtifact = ({
  workspaceRoot,
  decisions,
}: {
  workspaceRoot: string;
  decisions: SkoposPolicyRoleMappingDecision[];
}): SkoposPolicyRoleMappingDecisionArtifact => ({
  schemaVersion: 1,
  id: 'policy-role-mapping-decisions',
  type: 'policy-role-mapping-decisions',
  status: 'generated',
  authority: 'generated',
  summary:
    decisions.length === 0
      ? 'No local role mapping decisions are active.'
      : `${decisions.length} local role mapping decision${decisions.length === 1 ? '' : 's'} configured.`,
  updatedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  workspaceRoot,
  decisions,
});

const writePolicySourceRoleMappingsAndRefresh = async ({
  workspaceRoot,
  source,
  decisions,
  dryRun,
  actorId,
  eventSummary,
}: {
  workspaceRoot: string;
  source: SkoposProjectPolicySource;
  decisions: SkoposPolicyRoleMappingDecision[];
  dryRun: boolean;
  actorId?: string;
  eventSummary: string;
}): Promise<SkoposPolicyRoleMappingDecisionsRuntimeResult> => {
  const nextSource: SkoposProjectPolicySource = {
    ...source,
    updatedAt: new Date().toISOString(),
    roleMappings: decisions,
  };
  if (!dryRun) {
    await writeResolvedPolicyProjections({
      workspaceRoot,
      source: nextSource,
      dryRun: true,
    });
  }
  const artifact = buildPolicyRoleMappingDecisionArtifact({ workspaceRoot, decisions });
  const artifactPath = join(workspaceRoot, SKOPOS_PROJECT_POLICY_SOURCE_PATH);
  const artifactWrite = await writeProjectPolicySource({
    policySourcePath: artifactPath,
    source: nextSource,
    dryRun,
  });
  const refresh = await writeResolvedPolicyProjections({
    workspaceRoot,
    source: nextSource,
    dryRun,
  });

  if (!dryRun) {
    await appendSkoposOperationalLogEntry({
      workspaceRoot,
      eventKind: 'policy',
      status: 'succeeded',
      summary: eventSummary,
      metadata: {
        actorId: actorId ?? null,
        decisionCount: decisions.length,
        policySourcePath: SKOPOS_PROJECT_POLICY_SOURCE_PATH,
        roleMappingPath: POLICY_ROLE_MAPPING_ARTIFACT_PATH,
      },
    });
    await refreshSkoposKnowledgeIndex({ workspaceRoot });
  }

  return {
    artifact,
    artifactPath,
    artifactWrite,
    roleMapping: refresh.roleMapping,
    roleMappingPath: refresh.roleMappingPath,
    roleMappingWrite: refresh.roleMappingWrite,
    policyBriefPath: refresh.policyBriefPath,
    policyBriefWrite: refresh.policyBriefWrite,
    actorId,
  };
};

const buildPolicyOverrideArtifact = ({
  workspaceRoot,
  overrides,
}: {
  workspaceRoot: string;
  overrides: SkoposPolicyOverride[];
}): SkoposPolicyOverrideArtifact => ({
  schemaVersion: 1,
  id: 'policy-overrides',
  type: 'policy-overrides',
  status: 'generated',
  authority: 'generated',
  summary:
    overrides.length === 0
      ? 'No local policy overrides are active.'
      : `${overrides.length} local policy override${overrides.length === 1 ? '' : 's'} configured.`,
  updatedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  workspaceRoot,
  overrides,
});

const writePolicySourceOverridesAndRefresh = async ({
  workspaceRoot,
  source,
  overrides,
  dryRun,
  actorId,
  eventSummary,
}: {
  workspaceRoot: string;
  source: SkoposProjectPolicySource;
  overrides: SkoposPolicyOverride[];
  dryRun: boolean;
  actorId?: string;
  eventSummary: string;
}): Promise<SkoposPolicyOverridesRuntimeResult> => {
  const nextSource: SkoposProjectPolicySource = {
    ...source,
    updatedAt: new Date().toISOString(),
    overrides,
  };
  if (!dryRun) {
    await writeResolvedPolicyProjections({
      workspaceRoot,
      source: nextSource,
      dryRun: true,
    });
  }
  const artifact = buildPolicyOverrideArtifact({ workspaceRoot, overrides });
  const artifactPath = join(workspaceRoot, SKOPOS_PROJECT_POLICY_SOURCE_PATH);
  const artifactWrite = await writeProjectPolicySource({
    policySourcePath: artifactPath,
    source: nextSource,
    dryRun,
  });
  const resolved = await writeResolvedPolicyProjections({
    workspaceRoot,
    source: nextSource,
    dryRun,
  });
  const resolvedPolicyPath = resolved.policyPath;
  const resolvedPolicyWrite = resolved.policyWrite;

  if (!dryRun) {
    await appendSkoposOperationalLogEntry({
      workspaceRoot,
      eventKind: 'policy',
      status: 'succeeded',
      summary: eventSummary,
      metadata: {
        actorId: actorId ?? null,
        overrideCount: overrides.length,
        policySourcePath: SKOPOS_PROJECT_POLICY_SOURCE_PATH,
      },
    });
    await refreshSkoposKnowledgeIndex({ workspaceRoot });
  }

  return {
    artifact,
    artifactPath,
    artifactWrite,
    resolvedPolicyPath,
    resolvedPolicyWrite,
    actorId,
  };
};

const buildPolicyOverrideId = ({
  findingId,
  ruleId,
  packId,
  sourcePath,
}: {
  findingId?: string;
  ruleId?: string;
  packId?: string;
  sourcePath?: string;
}): string => {
  const basis = findingId ?? ruleId ?? packId ?? sourcePath;
  if (!basis) {
    throw new Error(
      'Policy override needs at least one of --finding, --rule, --pack, or --source-path.',
    );
  }

  const pathSuffix = sourcePath && sourcePath !== basis ? `-${sourcePath}` : '';
  return `override-${`${basis}${pathSuffix}`.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')}`;
};

const buildPolicyRoleMappingDecisionId = ({
  packId,
  role,
}: {
  packId: string;
  role: string;
}): string =>
  `role-map-${`${packId}-${role}`.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '')}`;

const buildPolicyRoleMappingDecisionKey = ({
  packId,
  role,
}: {
  packId: string;
  role: string;
}): string => `${packId}:${role}`;

const applyPolicyOverridesToFindings = ({
  findings,
  overrides,
}: {
  findings: SkoposDriftFinding[];
  overrides: SkoposPolicyOverride[];
}): SkoposDriftFinding[] => {
  const activeOverrides = overrides.filter((override) => !isExpiredPolicyOverride(override));

  return findings.map((finding) => {
    const override = activeOverrides.find((entry) => policyOverrideMatchesFinding(entry, finding));
    if (!override) {
      return finding;
    }

    if (override.severity) {
      return {
        ...finding,
        severity: override.severity,
        verificationStatus: verificationStatusForPolicySeverity(override.severity),
        overrideId: override.id,
        evidence: [
          ...finding.evidence,
          `Local policy override \`${override.id}\` changes severity to \`${override.severity}\`: ${override.reason}`,
        ],
      };
    }

    return {
      ...finding,
      status: 'suppressed',
      verificationStatus: 'pass',
      overrideId: override.id,
      evidence: [
        ...finding.evidence,
        `Local policy override \`${override.id}\` suppresses this finding: ${override.reason}`,
      ],
    };
  });
};

const policyOverrideMatchesFinding = (
  override: SkoposPolicyOverride,
  finding: SkoposDriftFinding,
): boolean => {
  if (override.findingId && override.findingId !== finding.id) {
    return false;
  }

  if (override.ruleId && override.ruleId !== finding.ruleId) {
    return false;
  }

  if (override.packId && override.packId !== finding.packId) {
    return false;
  }

  if (override.sourcePath && override.sourcePath !== finding.sourcePath) {
    return false;
  }

  return Boolean(override.findingId || override.ruleId || override.packId || override.sourcePath);
};

const isExpiredPolicyOverride = (override: SkoposPolicyOverride): boolean => {
  if (!override.expiresAt) {
    return false;
  }

  const expiresAt = Date.parse(override.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt < Date.now();
};

const verificationStatusForPolicySeverity = (
  severity: NonNullable<SkoposPolicyOverride['severity']>,
): SkoposDriftFinding['verificationStatus'] =>
  severity === 'must' ? 'fail' : severity === 'should' ? 'warn' : 'pass';

const detectPolicyDrift = async ({
  workspaceRoot,
  policy,
  ignoredPaths,
}: {
  workspaceRoot: string;
  policy: SkoposResolvedPolicyArtifact;
  ignoredPaths: string[];
}): Promise<SkoposDriftFinding[]> => {
  const sourceFiles = await listFilesUnder(
    workspaceRoot,
    ['.ts', '.tsx', '.js', '.jsx'],
    ignoredPaths,
  );
  const relativeSourceFiles = sourceFiles.map((filePath) => relative(workspaceRoot, filePath));
  const fileContents = new Map<string, string>();
  for (const filePath of sourceFiles) {
    const contents = await readTextIfExists(filePath);
    if (contents !== undefined) {
      fileContents.set(relative(workspaceRoot, filePath), contents);
    }
  }

  const findings: SkoposDriftFinding[] = [
    ...detectGenericHelperBuckets(policy, relativeSourceFiles, fileContents),
    ...detectCrossFeaturePrivateImports(policy, fileContents),
    ...detectReversePlatformImports(policy, fileContents),
    ...detectRuntimeWiringInFeatures(policy, fileContents),
    ...(await detectMissingValidationLanes(policy, workspaceRoot)),
    ...(await detectGeneratedOwnerMissing(policy, workspaceRoot)),
  ];

  return dedupeFindings(findings).sort((left, right) => left.id.localeCompare(right.id));
};

const detectGenericHelperBuckets = (
  policy: SkoposResolvedPolicyArtifact,
  files: string[],
  fileContents: Map<string, string>,
): SkoposDriftFinding[] => {
  const findings: SkoposDriftFinding[] = [];
  const genericHelperFiles = files.filter((filePath) =>
    /(^|\/)(utils|shared|support|lib)\/(helpers|helper|misc|utils|common)\.(t|j)sx?$/.test(filePath) ||
    /(^|\/)(utils|shared|support|lib)\/(helpers|misc|common)\//.test(filePath),
  );

  for (const sourcePath of genericHelperFiles) {
    findings.push(
      buildFinding({
        policy,
        ruleId: 'architecture.mid-app.generic-helper-bucket',
        family: 'architecture',
        sourcePath,
        summary: `Generic helper bucket detected at \`${sourcePath}\`.`,
        evidence: ['Generic helper or misc naming makes ownership unclear.'],
        remediation: ['Split by stable responsibility or move feature-specific behavior back to the owning feature.'],
      }),
    );

    const contents = fileContents.get(sourcePath) ?? '';
    const featureNouns = findFeatureNounsInText(contents);
    if (featureNouns.length > 0) {
      findings.push(
        buildFinding({
          policy,
          ruleId: 'architecture.mid-app.business-logic-in-shared-helper',
          family: 'architecture',
          sourcePath,
          summary: `Shared helper \`${sourcePath}\` appears to contain feature-specific behavior.`,
          evidence: [`Feature terms found in shared helper: ${featureNouns.join(', ')}.`],
          remediation: ['Move product behavior to the owning feature and keep shared code domain-neutral.'],
        }),
      );
    }
  }

  return findings;
};

const detectCrossFeaturePrivateImports = (
  policy: SkoposResolvedPolicyArtifact,
  fileContents: Map<string, string>,
): SkoposDriftFinding[] => {
  const findings: SkoposDriftFinding[] = [];

  for (const [sourcePath, contents] of fileContents) {
    const featureMatch = sourcePath.match(/(^|\/)(features|modules|domains)\/([^/]+)\//);
    if (!featureMatch) {
      continue;
    }

    const ownerFeature = featureMatch[3];
    const imports = extractImportSpecifiers(contents);
    for (const specifier of imports) {
      const siblingFeature = inferSiblingFeatureImport({
        sourcePath,
        ownerFeature,
        specifier,
      });
      if (!siblingFeature) {
        continue;
      }

      findings.push(
        buildFinding({
          policy,
          ruleId: 'architecture.mid-app.cross-feature-private-import',
          preferredRuleId: 'architecture.mid-app.import-direction-is-one-way',
          family: 'architecture',
          sourcePath,
          summary: `Feature \`${ownerFeature}\` imports private internals from feature \`${siblingFeature}\`.`,
          evidence: [`Import specifier: ${specifier}.`],
          remediation: ['Expose an intentional public surface or move shared behavior to a neutral shared/infrastructure layer.'],
        }),
      );
    }
  }

  return findings;
};

const detectReversePlatformImports = (
  policy: SkoposResolvedPolicyArtifact,
  fileContents: Map<string, string>,
): SkoposDriftFinding[] => {
  const findings: SkoposDriftFinding[] = [];

  for (const [sourcePath, contents] of fileContents) {
    if (!/(^|\/)(infrastructure|infra|adapters|platform|shared|support|lib)\//.test(sourcePath)) {
      continue;
    }

    const imports = extractImportSpecifiers(contents);
    const featureImports = imports.filter(
      (specifier) =>
        specifier.includes('/features/') ||
        specifier.includes('../features/') ||
        specifier.includes('/modules/') ||
        specifier.includes('../modules/') ||
        specifier.includes('/domains/') ||
        specifier.includes('../domains/'),
    );
    if (featureImports.length === 0) {
      continue;
    }

    findings.push(
      buildFinding({
        policy,
        ruleId: 'architecture.mid-app.reverse-platform-import',
        family: 'architecture',
        sourcePath,
        summary: `Infrastructure or shared file \`${sourcePath}\` imports feature internals.`,
        evidence: featureImports.map((specifier) => `Import specifier: ${specifier}.`),
        remediation: ['Keep infrastructure and shared code feature-agnostic and invert composition through the app boundary.'],
      }),
    );
  }

  return findings;
};

const detectRuntimeWiringInFeatures = (
  policy: SkoposResolvedPolicyArtifact,
  fileContents: Map<string, string>,
): SkoposDriftFinding[] => {
  const findings: SkoposDriftFinding[] = [];

  for (const [sourcePath, contents] of fileContents) {
    if (!/(^|\/)(features|modules|domains)\//.test(sourcePath)) {
      continue;
    }

    const evidence: string[] = [];
    if (/\bprocess\.env\b/.test(contents)) {
      evidence.push('Reads `process.env` inside feature code.');
    }
    if (/\bnew\s+\w*(Client|Pool|Connection|Adapter)\b/.test(contents)) {
      evidence.push('Instantiates runtime client/adapter inside feature code.');
    }
    if (/\b(createClient|connect|createPool)\s*\(/.test(contents)) {
      evidence.push('Calls runtime client/pool setup inside feature code.');
    }

    if (evidence.length === 0) {
      continue;
    }

    findings.push(
      buildFinding({
        policy,
        ruleId: 'architecture.mid-app.runtime-wiring-outside-features',
        family: 'architecture',
        sourcePath,
        summary: `Feature file \`${sourcePath}\` appears to own runtime wiring.`,
        evidence,
        remediation: ['Move runtime setup to the composition root or infrastructure/adapters layer, then inject or import stable adapter functions from features.'],
      }),
    );
  }

  return findings;
};

const detectMissingValidationLanes = async (
  policy: SkoposResolvedPolicyArtifact,
  workspaceRoot: string,
): Promise<SkoposDriftFinding[]> => {
  if (!policy.activeRules.some((rule) => rule.id === 'architecture.mid-app.validation-lanes-are-declared')) {
    return [];
  }

  const likelyDocs = ['AGENTS.md', 'README.md', 'docs/00-start-here.md'];
  const docsText = (await Promise.all(likelyDocs.map((path) => readTextIfExists(join(workspaceRoot, path)))))
    .filter((value): value is string => value !== undefined)
    .join('\n')
    .toLowerCase();
  const hasLaneLanguage =
    /validation lane|fast lane|targeted|release check|typecheck|test/.test(docsText);

  if (hasLaneLanguage) {
    return [];
  }

  return [
    buildFinding({
      policy,
      ruleId: 'architecture.mid-app.missing-validation-lanes',
      family: 'architecture',
      summary: 'No validation lane guidance was found in AGENTS.md, README.md, or docs/00-start-here.md.',
      evidence: ['Expected fast, targeted, or release validation guidance in project instructions/docs.'],
      remediation: ['Document proportional validation lanes for small, normal, and risky changes.'],
    }),
  ];
};

const detectGeneratedOwnerMissing = async (
  policy: SkoposResolvedPolicyArtifact,
  workspaceRoot: string,
): Promise<SkoposDriftFinding[]> => {
  if (!policy.activeRules.some((rule) => rule.id === 'architecture.mid-app.generated-artifacts-have-owners')) {
    return [];
  }

  const agentsText = (await readTextIfExists(join(workspaceRoot, 'AGENTS.md')))?.toLowerCase() ?? '';
  if (/generated/.test(agentsText) && /(regenerate|owning command|hand-edit|source\/generator|runtime-managed)/.test(agentsText)) {
    return [];
  }

  return [
    buildFinding({
      policy,
      ruleId: 'architecture.mid-app.generated-owner-missing',
      family: 'generated-artifact',
      sourcePath: 'AGENTS.md',
      summary: 'Generated artifact ownership rule is missing from project instructions.',
      evidence: ['AGENTS.md does not explain generated artifact ownership or regeneration expectations.'],
      remediation: ['Add generated artifact ownership and regeneration guidance to project instructions.'],
    }),
  ];
};

const buildFinding = ({
  policy,
  ruleId,
  preferredRuleId,
  family,
  sourcePath,
  summary,
  evidence,
  remediation,
}: {
  policy: SkoposResolvedPolicyArtifact;
  ruleId: string;
  preferredRuleId?: string;
  family: SkoposDriftFamily;
  sourcePath?: string;
  summary: string;
  evidence: string[];
  remediation: string[];
}): SkoposDriftFinding => {
  const rule =
    (preferredRuleId ? policy.activeRules.find((entry) => entry.id === preferredRuleId) : undefined) ??
    policy.activeRules.find((entry) => entry.checkIds?.includes(ruleId) || entry.id === ruleId);
  const severity = rule?.severity ?? 'should';
  const packId = policy.acceptedPacks.find((entry) => rule?.id.startsWith(entry.packId))?.packId ?? policy.acceptedPacks[0]?.packId;

  return {
    id: ['drift', ruleId, sourcePath ?? 'workspace'].join(':'),
    family,
    status: 'open',
    severity,
    verificationStatus: severity === 'must' ? 'fail' : severity === 'should' ? 'warn' : 'pass',
    summary,
    ruleId: rule?.id,
    packId,
    sourcePath,
    evidence,
    remediation,
  };
};

const dedupeFindings = (findings: SkoposDriftFinding[]): SkoposDriftFinding[] => {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    if (seen.has(finding.id)) {
      return false;
    }

    seen.add(finding.id);
    return true;
  });
};

const dedupePolicyRules = <TRule extends { id: string }>(rules: TRule[]): TRule[] => {
  const byId = new Map<string, TRule>();
  for (const rule of rules) {
    byId.set(rule.id, rule);
  }

  return [...byId.values()].sort((left, right) => left.id.localeCompare(right.id));
};

const dedupeStrings = (values: string[]): string[] => [...new Set(values)].sort((left, right) => left.localeCompare(right));

const dedupePolicyOverrides = (overrides: SkoposPolicyOverride[]): SkoposPolicyOverride[] => {
  const byId = new Map<string, SkoposPolicyOverride>();
  for (const override of overrides) {
    byId.set(override.id, override);
  }

  return [...byId.values()].sort((left, right) => left.id.localeCompare(right.id));
};

const dedupePolicyRoleMappingDecisions = (
  decisions: SkoposPolicyRoleMappingDecision[],
): SkoposPolicyRoleMappingDecision[] => {
  const byId = new Map<string, SkoposPolicyRoleMappingDecision>();
  for (const decision of decisions) {
    byId.set(decision.id, {
      ...decision,
      matchedPaths: decision.matchedPaths ? dedupeStrings(decision.matchedPaths) : undefined,
    });
  }

  return [...byId.values()].sort((left, right) => left.id.localeCompare(right.id));
};

const extractImportSpecifiers = (contents: string): string[] => {
  const specifiers: string[] = [];
  const importRegex = /\bimport\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(contents)) !== null) {
    specifiers.push(match[1]);
  }

  return specifiers;
};

const inferSiblingFeatureImport = ({
  sourcePath,
  ownerFeature,
  specifier,
}: {
  sourcePath: string;
  ownerFeature: string;
  specifier: string;
}): string | undefined => {
  const absoluteLike = specifier.match(/(?:features|modules|domains)\/([^/]+)\//);
  if (absoluteLike && absoluteLike[1] !== ownerFeature) {
    return absoluteLike[1];
  }

  if (!specifier.startsWith('.')) {
    return undefined;
  }

  const sourceDirectory = dirname(sourcePath);
  const normalizedTarget = resolve('/', sourceDirectory, specifier).replace(/^\//, '');
  const targetFeature = normalizedTarget.match(/(^|\/)(features|modules|domains)\/([^/]+)\//)?.[3];
  if (targetFeature && targetFeature !== ownerFeature) {
    return targetFeature;
  }

  return undefined;
};

const findFeatureNounsInText = (contents: string): string[] => {
  const matches = new Set<string>();
  for (const noun of ['order', 'orders', 'billing', 'invoice', 'customer', 'payment', 'subscription', 'cart', 'checkout']) {
    if (new RegExp(`\\b${noun}\\b`, 'i').test(contents)) {
      matches.add(noun);
    }
  }

  return [...matches];
};


const buildDefaultTaskRiskRules = (): SkoposTaskRiskRule[] => [
  {
    risk: 'light',
    summary: 'Use for narrow local edits with no project-truth or architecture impact.',
    triggers: [
      'single-file copy or styling edit',
      'small bug fix inside one owner',
      'no public API, data, security, or architecture impact',
    ],
    defaultEvidence: ['focused test or typecheck when available'],
  },
  {
    risk: 'standard',
    summary: 'Use for ordinary feature and maintenance work that touches a bounded area.',
    triggers: [
      'multiple related files in one feature or package',
      'new behavior that needs tests or docs sync',
      'accepted policy remains unchanged',
    ],
    defaultEvidence: ['typecheck', 'relevant unit or e2e tests'],
  },
  {
    risk: 'high-impact',
    summary: 'Use for big, risky, or cross-cutting work that needs durable checkpoints and staged closure.',
    triggers: [
      'public API or package boundary change',
      'architecture, stack, security, auth, migration, or data integrity change',
      'multi-package refactor',
      'long-running work that may need resume or handoff',
    ],
    defaultEvidence: ['focused checks per phase', 'full affected verification before closure'],
  },
];

const inferProjectLifecycle = async (workspaceRoot: string): Promise<SkoposProjectLifecycle> => {
  const entries = await readDirectoryNames(workspaceRoot);
  if (!entries.includes('package.json') && !entries.includes('src') && !entries.includes('docs')) {
    return 'greenfield';
  }

  if (entries.includes('AGENTS.md') || entries.includes('docs') || entries.includes('.skopos')) {
    return 'established-brownfield';
  }

  return 'early-product';
};

const readDirectoryNames = async (directory: string): Promise<string[]> => {
  try {
    return await readdir(directory);
  } catch {
    return [];
  }
};

const upsertAgentsPolicySection = async ({
  agentsPath,
  policy,
  dryRun,
}: {
  agentsPath: string;
  policy: SkoposResolvedPolicyArtifact;
  dryRun: boolean;
}): Promise<'written' | 'dry-run'> => {
  const startMarker = '<!-- skopos:policy:start -->';
  const endMarker = '<!-- skopos:policy:end -->';
  const existing = await readTextIfExists(agentsPath);
  const section = [
    startMarker,
    '## Skopos Accepted Policy (Derived Projection)',
    '',
    '- This block is generated from tracked project policy; do not edit it directly.',
    `- Source of truth: \`${SKOPOS_PROJECT_POLICY_SOURCE_PATH}\``,
    `- Accepted packs: ${policy.acceptedPacks.map((entry) => `\`${entry.packId}@${entry.version}\``).join(', ')}`,
    `- Default Task risk: \`${policy.defaultTaskRisk}\``,
    '- Progressive verification: keep small Tasks light, use proportional Actions and Guards for standard work, and use detailed high-impact Tasks or child Tasks for public API, architecture, stack, security, migration, multi-Scope, or long-running changes.',
    `- Agent brief: \`${POLICY_BRIEF_ARTIFACT_PATH}\``,
    '',
    endMarker,
  ].join('\n');
  const next = existing
    ? replaceOrAppendSection(existing, startMarker, endMarker, section)
    : `# Project Agent Instructions\n\n${section}\n`;

  if (dryRun) {
    return 'dry-run';
  }

  await mkdir(dirname(agentsPath), { recursive: true });
  await writeFile(agentsPath, next.endsWith('\n') ? next : `${next}\n`, 'utf8');
  return 'written';
};

const replaceOrAppendSection = (
  contents: string,
  startMarker: string,
  endMarker: string,
  section: string,
): string => {
  const start = contents.indexOf(startMarker);
  const end = contents.indexOf(endMarker);
  if (start !== -1 && end !== -1 && end > start) {
    return `${contents.slice(0, start).trimEnd()}\n\n${section}\n\n${contents.slice(end + endMarker.length).trimStart()}`;
  }

  return `${contents.trimEnd()}\n\n${section}\n`;
};

const readTextIfExists = async (path: string): Promise<string | undefined> => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return undefined;
  }
};

const readJsonIfExists = async <TValue>(path: string): Promise<TValue | null> => {
  const contents = await readTextIfExists(path);
  return contents ? (JSON.parse(contents) as TValue) : null;
};

const findExistingRelativePaths = async (
  workspaceRoot: string,
  pattern: string,
): Promise<string[]> => {
  const segments = pattern.split(/[\\/]+/).filter(Boolean);
  const matches = await expandPathPattern(workspaceRoot, segments);

  return matches.map((match) => relative(workspaceRoot, match)).sort((left, right) => left.localeCompare(right));
};

const expandPathPattern = async (
  basePath: string,
  segments: string[],
): Promise<string[]> => {
  if (segments.length === 0) {
    return (await pathExists(basePath)) ? [basePath] : [];
  }

  const segment = segments[0] ?? '';
  const remainingSegments = segments.slice(1);

  if (segment === '*') {
    const childDirectories = await readChildDirectoryPaths(basePath);
    const nestedMatches = await Promise.all(
      childDirectories.map((childPath) => expandPathPattern(childPath, remainingSegments)),
    );

    return nestedMatches.flat();
  }

  return expandPathPattern(join(basePath, segment), remainingSegments);
};

const readChildDirectoryPaths = async (directoryPath: string): Promise<string[]> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(directoryPath, entry.name));
  } catch {
    return [];
  }
};

const SCAN_IGNORED_DIRS = new Set([
  '.cache',
  '.git',
  '.next',
  '.skopos',
  '.tmp',
  '.turbo',
  'coverage',
  'dist',
  'fixtures',
  'internal',
  'node_modules',
  'policy-packs',
  'stack-packs',
  'tests',
]);

const listFilesUnder = async (
  root: string,
  extensions: string[],
  ignoredPaths: string[] = [],
): Promise<string[]> => {
  if (!(await pathExists(root))) {
    return [];
  }

  const results: string[] = [];
  const normalizedExtensions = extensions.map((extension) => extension.toLowerCase());

  const visit = async (directory: string): Promise<void> => {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = join(directory, entry.name);
      if (isWorkspaceIgnoredPath(relative(root, entryPath), ignoredPaths)) {
        continue;
      }
      if (entry.isDirectory()) {
        if (!SCAN_IGNORED_DIRS.has(entry.name)) {
          await visit(entryPath);
        }
        continue;
      }

      if (
        entry.isFile() &&
        normalizedExtensions.some((extension) => entry.name.toLowerCase().endsWith(extension))
      ) {
        results.push(entryPath);
      }
    }
  };

  await visit(root);
  return results.sort();
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
