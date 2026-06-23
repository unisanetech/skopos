import { join, relative } from 'node:path';

import type { SkoposWorkflowManifest } from '@skopos/model';
import { z } from 'zod';
import YAML from 'yaml';

import { listFilesUnder, readTextFile } from '../../adapters/workspace-filesystem.adapter.js';

const workflowManifestSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.enum([
      'docs-generator',
      'docs-validator',
      'reference-generator',
      'graph-generator',
      'quality-check',
      'migration',
      'maintenance',
      'domain-tool',
    ]),
    scope: z
      .union([z.string().min(1), z.array(z.string().min(1)).min(1)])
      .transform((value) => (typeof value === 'string' ? [value] : value)),
    command: z.string().min(1),
    cwd: z.string().min(1).default('.'),
    inputs: z.array(z.string().min(1)).default([]),
    outputs: z.array(z.string().min(1)).default([]),
    affects: z.array(z.string().min(1)).default([]),
    safety: z.enum(['read-only', 'mutating', 'destructive']),
    requiresApproval: z.boolean().default(false),
    whenToUse: z.string().min(1).optional(),
    requiredForDone: z.boolean().default(false),
    recommendedAfter: z.array(z.string().min(1)).default([]),
    owner: z.string().min(1),
  })
  .strict();

export interface LoadSkoposWorkflowManifestsOptions {
  cwd: string;
  manifestDirs?: string[];
}

export const loadSkoposWorkflowManifests = async ({
  cwd,
  manifestDirs = ['tools/skopos/workflows'],
}: LoadSkoposWorkflowManifestsOptions): Promise<SkoposWorkflowManifest[]> => {
  const manifests: SkoposWorkflowManifest[] = [];

  for (const manifestDir of manifestDirs) {
    const manifestPaths = await listFilesUnder(join(cwd, manifestDir), ['.yaml', '.yml']);

    for (const manifestPath of manifestPaths) {
      const contents = await readTextFile(manifestPath);
      if (!contents) {
        continue;
      }

      const parsed = workflowManifestSchema.parse(YAML.parse(contents));
      manifests.push({
        ...parsed,
        sourcePath: relative(cwd, manifestPath) || manifestPath,
      });
    }
  }

  return manifests.sort((left, right) => left.id.localeCompare(right.id));
};
