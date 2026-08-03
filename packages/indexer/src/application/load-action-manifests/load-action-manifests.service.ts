import { isAbsolute, join, relative } from 'node:path';

import type { SkoposActionManifest } from '@skopos/model';
import { z } from 'zod';
import YAML from 'yaml';

import { listFilesUnder, readTextFile } from '../../adapters/workspace-filesystem.adapter.js';

const actionManifestSchema = z
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
    sourceExcludes: z.array(z.string().min(1)).default([]),
    outputs: z.array(z.string().min(1)).default([]),
    affects: z.array(z.string().min(1)).default([]),
    capabilities: z.object({
      process: z.literal('required'),
      network: z.enum(['none', 'required']),
      browser: z.enum(['none', 'required']),
      tools: z.array(z.string().min(1)),
      secrets: z.array(z.string().min(1)),
      services: z.array(z.string().min(1)),
    }).strict(),
    effects: z.object({
      workspace: z.enum(['none', 'declared']),
      artifacts: z.enum(['none', 'isolated']),
      external: z.enum(['none', 'declared']),
    }).strict(),
    concurrency: z.enum(['shared', 'exclusive']),
    safety: z.enum(['read-only', 'artifact-producing', 'mutating', 'destructive']),
    requiresApproval: z.boolean().default(false),
    whenToUse: z.string().min(1).optional(),
    phases: z
      .array(z.enum(['admission', 'iteration', 'stabilization', 'closure']))
      .min(1)
      .optional(),
    risks: z
      .array(z.enum(['light', 'standard', 'high-impact']))
      .min(1)
      .optional(),
    recommendedAfter: z.array(z.string().min(1)).default([]),
    owner: z.string().min(1),
  })
  .strict()
  .superRefine((manifest, context) => {
    if (manifest.effects.workspace === 'none' && manifest.affects.length > 0) {
      context.addIssue({
        code: 'custom',
        path: ['affects'],
        message: 'Action with no workspace effect cannot declare affected workspace paths.',
      });
    }
    if (manifest.effects.workspace === 'declared' && manifest.affects.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['affects'],
        message: 'Declared workspace effects require at least one affected path.',
      });
    }
    if (manifest.effects.artifacts === 'isolated' && manifest.outputs.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['outputs'],
        message: 'Isolated artifact production requires at least one output.',
      });
    }
    if (manifest.effects.artifacts === 'none' && manifest.safety === 'artifact-producing') {
      context.addIssue({
        code: 'custom',
        path: ['safety'],
        message: 'Artifact-producing safety requires isolated artifact effects.',
      });
    }
    if (manifest.safety === 'read-only' && (
      manifest.effects.workspace !== 'none' ||
      manifest.effects.artifacts !== 'none' ||
      manifest.effects.external !== 'none'
    )) {
      context.addIssue({
        code: 'custom',
        path: ['safety'],
        message: 'Read-only Actions cannot declare workspace, artifact, or external effects.',
      });
    }
    if (manifest.effects.external === 'none' && manifest.capabilities.services.length > 0) {
      context.addIssue({
        code: 'custom',
        path: ['capabilities', 'services'],
        message: 'External services require a declared external effect.',
      });
    }
  });

export interface LoadSkoposActionManifestsOptions {
  cwd: string;
  manifestDirs?: string[];
}

export const loadSkoposActionManifestFile = async ({
  cwd,
  manifestPath,
}: {
  cwd: string;
  manifestPath: string;
}): Promise<SkoposActionManifest> => {
  const absolutePath = isAbsolute(manifestPath)
    ? manifestPath
    : join(cwd, manifestPath);
  const contents = await readTextFile(absolutePath);
  if (!contents) {
    throw new Error(`Skopos Action manifest does not exist or is empty: ${manifestPath}`);
  }
  return {
    ...actionManifestSchema.parse(YAML.parse(contents)),
    sourcePath: relative(cwd, absolutePath) || absolutePath,
  };
};

export const loadSkoposActionManifests = async ({
  cwd,
  manifestDirs = ['tools/skopos/actions'],
}: LoadSkoposActionManifestsOptions): Promise<SkoposActionManifest[]> => {
  const manifests: SkoposActionManifest[] = [];

  for (const manifestDir of manifestDirs) {
    const manifestPaths = await listFilesUnder(join(cwd, manifestDir), ['.yaml', '.yml']);

    for (const manifestPath of manifestPaths) {
      const contents = await readTextFile(manifestPath);
      if (!contents) {
        continue;
      }

      manifests.push(
        await loadSkoposActionManifestFile({
          cwd,
          manifestPath,
        }),
      );
    }
  }

  return manifests.sort((left, right) => left.id.localeCompare(right.id));
};
