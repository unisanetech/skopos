import { isAbsolute, join, relative } from 'node:path';

import type {
  SkoposPolicyPackManifest,
  SkoposProjectPolicySource,
} from '@skopos/model';
import YAML from 'yaml';
import { z } from 'zod';

import { listFilesUnder, readTextFile } from '../../adapters/workspace-filesystem.adapter.js';

const policySeveritySchema = z.enum(['must', 'should', 'advisory']);
const policyLifecycleSchema = z.enum([
  'greenfield',
  'early-product',
  'established-brownfield',
  'legacy-stabilization',
]);
const policyFamilySchema = z.enum([
  'architecture',
  'clean-code',
  'structure-tree',
  'naming',
  'ui-components',
  'api-contracts',
  'data-modeling',
  'testing',
  'docs-governance',
  'security-privacy',
  'release-public-api',
  'generated-artifacts',
  'stack',
  'verification',
]);
const policySignalSchema = z
  .object({
    id: z.string().min(1),
    summary: z.string().min(1),
    confidence: z.enum(['low', 'medium', 'high']),
    evidence: z.array(z.string().min(1)),
  })
  .strict();
const policyRuleSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    severity: policySeveritySchema,
    summary: z.string().min(1),
    rationale: z.string().min(1).optional(),
    appliesTo: z.array(z.string().min(1)),
    examples: z.array(z.string().min(1)).optional(),
    antiPatterns: z.array(z.string().min(1)).optional(),
    checkIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

type PolicyStructureTreeNodeInput = {
  path: string;
  label: string;
  responsibility: string;
  required?: boolean;
  matchPaths?: string[];
  examples?: string[];
  antiPatterns?: string[];
  children?: PolicyStructureTreeNodeInput[];
};

const policyStructureTreeNodeSchema: z.ZodType<PolicyStructureTreeNodeInput> = z.lazy(() =>
  z
    .object({
      path: z.string().min(1),
      label: z.string().min(1),
      responsibility: z.string().min(1),
      required: z.boolean().optional(),
      matchPaths: z.array(z.string().min(1)).optional(),
      examples: z.array(z.string().min(1)).optional(),
      antiPatterns: z.array(z.string().min(1)).optional(),
      children: z.array(policyStructureTreeNodeSchema).optional(),
    })
    .strict(),
);

const policyStructureTreeSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().min(1),
    rootLabel: z.string().min(1),
    nodes: z.array(policyStructureTreeNodeSchema).min(1),
  })
  .strict();

const policyDependencyDirectionSchema = z
  .object({
    mayImport: z.array(z.string().min(1)),
  })
  .strict();

const policyForbiddenImportSchema = z
  .object({
    from: z.string().min(1),
    to: z.array(z.string().min(1)),
  })
  .strict();

const policyGuardSetSchema = z
  .object({
    required: z.array(z.string().min(1)),
    recommended: z.array(z.string().min(1)),
  })
  .strict();

const policyAgentPromptsSchema = z
  .object({
    beforeEditing: z.array(z.string().min(1)),
    beforeReadiness: z.array(z.string().min(1)),
  })
  .strict();

const dateTimeSchema = z.string().min(1).refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Expected an ISO-compatible date-time.',
});

const trackedPolicyAcceptanceSchema = z
  .object({
    packId: z.string().min(1),
    version: z.string().min(1),
    acceptedAt: dateTimeSchema,
    acceptedBy: z.string().min(1),
    reason: z.string().min(1),
    source: z.enum(['recommended', 'manual', 'profile']),
  })
  .strict();

const policyOverrideSchema = z
  .object({
    id: z.string().min(1),
    findingId: z.string().min(1).optional(),
    ruleId: z.string().min(1).optional(),
    packId: z.string().min(1).optional(),
    sourcePath: z.string().min(1).optional(),
    severity: policySeveritySchema.optional(),
    reason: z.string().min(1),
    owner: z.string().min(1).optional(),
    expiresAt: dateTimeSchema.optional(),
    createdAt: dateTimeSchema.optional(),
    createdBy: z.string().min(1).optional(),
    updatedAt: dateTimeSchema.optional(),
  })
  .strict()
  .refine(
    (entry) => Boolean(entry.findingId || entry.ruleId || entry.packId || entry.sourcePath),
    {
      message:
        'A policy override requires at least one of findingId, ruleId, packId, or sourcePath.',
    },
  );

const policyRoleMappingDecisionSchema = z
  .object({
    id: z.string().min(1),
    packId: z.string().min(1),
    role: z.string().min(1),
    status: z.enum(['confirmed', 'ignored']),
    matchedPaths: z.array(z.string().min(1)).optional(),
    reason: z.string().min(1),
    owner: z.string().min(1).optional(),
    createdAt: dateTimeSchema.optional(),
    createdBy: z.string().min(1).optional(),
    updatedAt: dateTimeSchema.optional(),
  })
  .strict()
  .superRefine((decision, context) => {
    if (decision.status === 'confirmed' && (decision.matchedPaths?.length ?? 0) === 0) {
      context.addIssue({
        code: 'custom',
        message: 'A confirmed policy role mapping requires at least one matched path.',
      });
    }
    if (decision.status === 'ignored' && (decision.matchedPaths?.length ?? 0) > 0) {
      context.addIssue({
        code: 'custom',
        message: 'An ignored policy role mapping cannot declare matched paths.',
      });
    }
  });

const projectPolicySourceSchema: z.ZodType<SkoposProjectPolicySource> = z
  .object({
    schemaVersion: z.literal(1),
    updatedAt: dateTimeSchema,
    defaultTaskRisk: z.enum(['light', 'standard', 'high-impact']),
    acceptedPacks: z.array(trackedPolicyAcceptanceSchema),
    overrides: z.array(policyOverrideSchema),
    roleMappings: z.array(policyRoleMappingDecisionSchema),
  })
  .strict()
  .superRefine((source, context) => {
    collectDuplicateValues(
      source.acceptedPacks.map((entry) => entry.packId),
      'accepted policy pack',
      context,
    );
    collectDuplicateValues(
      source.overrides.map((entry) => entry.id),
      'policy override',
      context,
    );
    collectDuplicateValues(
      source.roleMappings.map((entry) => `${entry.packId}:${entry.role}`),
      'policy role mapping',
      context,
    );
  });

const policyPackManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    type: z.literal('policy-pack'),
    status: z.enum(['draft', 'active', 'durable', 'historical', 'deprecated', 'dead', 'generated']),
    authority: z.enum(['canonical', 'supporting', 'generated', 'inferred']),
    summary: z.string().min(1).optional(),
    updatedAt: z.string().min(1).optional(),
    generatedAt: z.string().min(1).optional(),
    packId: z.string().min(1),
    family: policyFamilySchema,
    variant: z.string().min(1),
    version: z.string().min(1),
    displayName: z.string().min(1),
    description: z.string().min(1),
    plainLanguageSummary: z.string().min(1).optional(),
    bestFor: z.array(z.string().min(1)).optional(),
    notFor: z.array(z.string().min(1)).optional(),
    userQuestions: z.array(z.string().min(1)).optional(),
    qualityBar: z.array(z.string().min(1)).optional(),
    agentUse: z.array(z.string().min(1)).optional(),
    structureTree: policyStructureTreeSchema.optional(),
    recommendedLayers: z.array(z.string().min(1)).optional(),
    dependencyDirection: z.record(z.string().min(1), policyDependencyDirectionSchema).optional(),
    forbiddenImports: z.array(policyForbiddenImportSchema).optional(),
    guards: policyGuardSetSchema.optional(),
    agentPrompts: policyAgentPromptsSchema.optional(),
    projectLifecycles: z.array(policyLifecycleSchema).min(1),
    appliesWhen: z.array(policySignalSchema),
    avoidWhen: z.array(policySignalSchema),
    rules: z.array(policyRuleSchema).min(1),
    requiredDocs: z.array(z.string().min(1)),
    generatedArtifacts: z.array(z.string().min(1)),
    driftCheckIds: z.array(z.string().min(1)),
    proofFixtureIds: z.array(z.string().min(1)),
  })
  .strict();

export interface SkoposLoadedPolicyPack extends SkoposPolicyPackManifest {
  sourcePath: string;
}

export interface LoadSkoposPolicyPacksOptions {
  cwd: string;
  packRoots?: string[];
}

export const SKOPOS_PROJECT_POLICY_SOURCE_PATH = 'tools/skopos/policies.yaml';

export const loadSkoposProjectPolicySource = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposProjectPolicySource | null> => {
  const contents = await readTextFile(join(cwd, SKOPOS_PROJECT_POLICY_SOURCE_PATH));
  if (!contents) {
    return null;
  }

  return projectPolicySourceSchema.parse(YAML.parse(contents));
};

export const serializeSkoposProjectPolicySource = (
  source: SkoposProjectPolicySource,
): string => {
  const parsed = projectPolicySourceSchema.parse(source);
  return YAML.stringify(parsed, {
    lineWidth: 0,
  });
};

export const loadSkoposPolicyPacks = async ({
  cwd,
  packRoots = ['policy-packs'],
}: LoadSkoposPolicyPacksOptions): Promise<SkoposLoadedPolicyPack[]> => {
  const packs: SkoposLoadedPolicyPack[] = [];
  const seenPackIds = new Set<string>();

  for (const packRoot of packRoots) {
    const resolvedPackRoot = isAbsolute(packRoot) ? packRoot : join(cwd, packRoot);
    const manifestPaths = (await listFilesUnder(resolvedPackRoot, ['.json'])).filter(
      (manifestPath) => manifestPath.endsWith('/pack.json'),
    );

    for (const manifestPath of manifestPaths) {
      const contents = await readTextFile(manifestPath);
      if (!contents) {
        continue;
      }

      const parsed = policyPackManifestSchema.parse(JSON.parse(contents));
      if (seenPackIds.has(parsed.packId)) {
        continue;
      }

      seenPackIds.add(parsed.packId);
      packs.push({
        ...parsed,
        sourcePath: relative(cwd, manifestPath) || manifestPath,
      });
    }
  }

  return packs.sort((left, right) => left.packId.localeCompare(right.packId));
};

const collectDuplicateValues = (
  values: string[],
  label: string,
  context: { addIssue: (issue: { code: 'custom'; message: string }) => void },
): void => {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      context.addIssue({
        code: 'custom',
        message: `Duplicate ${label}: ${value}`,
      });
    }
    seen.add(value);
  }
};
