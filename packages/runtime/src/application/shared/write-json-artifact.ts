import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

export interface WriteJsonArtifactOptions {
  artifactPath: string;
  artifact: unknown;
  dryRun?: boolean;
}

export const writeJsonArtifact = async ({
  artifactPath,
  artifact,
  dryRun = false,
}: WriteJsonArtifactOptions): Promise<'written' | 'dry-run'> => {
  if (dryRun) {
    return 'dry-run';
  }

  const artifactDir = dirname(artifactPath);
  const tempPath = join(
    artifactDir,
    `.${basename(artifactPath)}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`,
  );

  await mkdir(artifactDir, { recursive: true });
  try {
    await writeFile(tempPath, JSON.stringify(artifact, null, 2), 'utf8');
    await rename(tempPath, artifactPath);
  } catch (error) {
    await rm(tempPath, { force: true });
    throw error;
  }

  return 'written';
};
