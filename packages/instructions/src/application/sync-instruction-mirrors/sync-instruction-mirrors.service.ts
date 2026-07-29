import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';

import type { SkoposHostProjectionModel } from '@skopos/model';

export interface SyncInstructionMirrorsOptions {
  cwd: string;
  dryRun?: boolean;
  instructionSourcePath?: string;
  mirrorTargets?: string[];
  projectionModel?: SkoposHostProjectionModel;
}

export interface InstructionMirrorWrite {
  path: string;
  status: 'written' | 'dry-run';
}

export interface SyncInstructionMirrorsResult {
  sourcePath: string;
  writes: InstructionMirrorWrite[];
}

export interface InstructionMirrorIssue {
  path: string;
  status: 'missing' | 'out-of-sync';
}

export interface CheckInstructionMirrorParityResult {
  sourcePath: string;
  issues: InstructionMirrorIssue[];
}

export const MIRROR_TARGETS = [
  'CLAUDE.md',
  '.cursor/rules/project.mdc',
  '.github/copilot-instructions.md',
] as const;

export const syncInstructionMirrors = async ({
  cwd,
  dryRun = false,
  instructionSourcePath = 'AGENTS.md',
  projectionModel,
}: SyncInstructionMirrorsOptions): Promise<SyncInstructionMirrorsResult> => {
  const workspaceRoot = resolve(cwd);
  const sourcePath = join(workspaceRoot, instructionSourcePath);
  const source = await readFile(sourcePath, 'utf8');
  const writes: InstructionMirrorWrite[] = [];

  const mirrorTargets = resolveMirrorTargets(projectionModel);
  for (const relativeTarget of mirrorTargets) {
    const targetPath = join(workspaceRoot, relativeTarget);
    const rendered = renderMirror(relativeTarget, source, basename(instructionSourcePath));

    if (!dryRun) {
      await mkdir(dirname(targetPath), { recursive: true });
      await writeFile(targetPath, rendered, 'utf8');
    }

    writes.push({
      path: targetPath,
      status: dryRun ? 'dry-run' : 'written',
    });
  }

  return {
    sourcePath,
    writes,
  };
};

export const checkInstructionMirrorParity = async ({
  cwd,
  instructionSourcePath = 'AGENTS.md',
  mirrorTargets,
  projectionModel,
}: Pick<SyncInstructionMirrorsOptions, 'cwd' | 'instructionSourcePath' | 'mirrorTargets' | 'projectionModel'>): Promise<CheckInstructionMirrorParityResult> => {
  const workspaceRoot = resolve(cwd);
  const sourcePath = join(workspaceRoot, instructionSourcePath);
  const source = await readFile(sourcePath, 'utf8');
  const issues: InstructionMirrorIssue[] = [];

  for (const relativeTarget of resolveMirrorTargets(projectionModel, mirrorTargets)) {
    const targetPath = join(workspaceRoot, relativeTarget);
    const expected = renderMirror(relativeTarget, source, basename(instructionSourcePath));

    let current: string;
    try {
      current = await readFile(targetPath, 'utf8');
    } catch {
      issues.push({
        path: targetPath,
        status: 'missing',
      });
      continue;
    }

    if (current !== expected) {
      issues.push({
        path: targetPath,
        status: 'out-of-sync',
      });
    }
  }

  return {
    sourcePath,
    issues,
  };
};

const resolveMirrorTargets = (
  projectionModel?: SkoposHostProjectionModel,
  mirrorTargets?: string[],
): string[] =>
  projectionModel
    ? projectionModel.hosts
        .filter((host) => host.instructionProjection === 'mirror')
        .map((host) => host.instructionPath)
    : mirrorTargets ?? [...MIRROR_TARGETS];

export const renderMirror = (target: string, source: string, sourceLabel = 'AGENTS.md'): string => {
  const header = [
    `<!-- Generated from ${sourceLabel} for ${target}. Do not edit directly. -->`,
    '',
  ].join('\n');

  return `${header}${source}`;
};
