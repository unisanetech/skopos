import { join, relative } from 'node:path';

import type { SkoposPolicyPackManifest } from '@skopos/model';
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
  'gates',
  'workflow',
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

export const loadSkoposPolicyPacks = async ({
  cwd,
  packRoots = ['policy-packs'],
}: LoadSkoposPolicyPacksOptions): Promise<SkoposLoadedPolicyPack[]> => {
  const packs: SkoposLoadedPolicyPack[] = [];

  for (const packRoot of packRoots) {
    const manifestPaths = (await listFilesUnder(join(cwd, packRoot), ['.json'])).filter(
      (manifestPath) => manifestPath.endsWith('/pack.json'),
    );

    for (const manifestPath of manifestPaths) {
      const contents = await readTextFile(manifestPath);
      if (!contents) {
        continue;
      }

      const parsed = policyPackManifestSchema.parse(JSON.parse(contents));
      packs.push({
        ...parsed,
        sourcePath: relative(cwd, manifestPath) || manifestPath,
      });
    }
  }

  return packs.sort((left, right) => left.packId.localeCompare(right.packId));
};
