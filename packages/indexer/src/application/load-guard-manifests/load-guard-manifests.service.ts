import { isAbsolute, join, relative } from 'node:path';

import type { SkoposGuardManifest } from '@skopos/model';
import YAML from 'yaml';
import { z } from 'zod';

import { listFilesUnder, readTextFile } from '../../adapters/workspace-filesystem.adapter.js';

const guardManifestSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    owner: z.string().min(1),
    scope: z
      .union([z.string().min(1), z.array(z.string().min(1)).min(1)])
      .transform((value) => (typeof value === 'string' ? [value] : value)),
    strength: z.enum(['required', 'recommended', 'prohibited']),
    appliesTo: z
      .object({
        paths: z.array(z.string().min(1)).min(1),
        phases: z
          .array(z.enum(['admission', 'iteration', 'stabilization', 'closure']))
          .min(1)
          .optional(),
        risks: z
          .array(z.enum(['light', 'standard', 'high-impact']))
          .min(1)
          .optional(),
      })
      .strict(),
    requires: z
      .object({
        actionIds: z.array(z.string().min(1)),
        evidence: z.enum(['source-bound-action', 'agent-observation']),
      })
      .strict(),
  })
  .strict();

export interface LoadSkoposGuardManifestsOptions {
  cwd: string;
  manifestDirs?: string[];
}

export const loadSkoposGuardManifestFile = async ({
  cwd,
  manifestPath,
}: {
  cwd: string;
  manifestPath: string;
}): Promise<SkoposGuardManifest> => {
  const absolutePath = isAbsolute(manifestPath)
    ? manifestPath
    : join(cwd, manifestPath);
  const contents = await readTextFile(absolutePath);
  if (!contents) {
    throw new Error(`Skopos Guard manifest does not exist or is empty: ${manifestPath}`);
  }
  return {
    ...guardManifestSchema.parse(YAML.parse(contents)),
    sourcePath: relative(cwd, absolutePath) || absolutePath,
  };
};

export const loadSkoposGuardManifests = async ({
  cwd,
  manifestDirs = ['tools/skopos/guards'],
}: LoadSkoposGuardManifestsOptions): Promise<SkoposGuardManifest[]> => {
  const manifests: SkoposGuardManifest[] = [];

  for (const manifestDir of manifestDirs) {
    const manifestPaths = await listFilesUnder(join(cwd, manifestDir), ['.yaml', '.yml']);
    for (const manifestPath of manifestPaths) {
      const contents = await readTextFile(manifestPath);
      if (!contents) {
        continue;
      }
      manifests.push(
        await loadSkoposGuardManifestFile({
          cwd,
          manifestPath,
        }),
      );
    }
  }

  assertUniqueGuardIds(manifests);
  return manifests.sort((left, right) => left.id.localeCompare(right.id));
};

const assertUniqueGuardIds = (guards: SkoposGuardManifest[]): void => {
  const seen = new Set<string>();
  for (const guard of guards) {
    if (seen.has(guard.id)) {
      throw new Error(`Duplicate Skopos Guard id: ${guard.id}`);
    }
    seen.add(guard.id);
  }
};
