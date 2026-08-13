import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import type { SkoposHostProjectionModel } from '@skopos/model';

import { normalizeInstructionSourcePath } from '../scaffold-project-instructions/scaffold-project-instructions.service.js';
import { resolveWorkspaceContainedPath } from '../shared/workspace-contained-path.js';

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
  instructionSourcePath: providedInstructionSourcePath,
  mirrorTargets: providedMirrorTargets,
  projectionModel,
}: SyncInstructionMirrorsOptions): Promise<SyncInstructionMirrorsResult> => {
  const workspaceRoot = resolve(cwd);
  const normalizedInstructionSourcePath = normalizeInstructionSourcePath(
    providedInstructionSourcePath ?? projectionModel?.instructionSourcePath,
  );
  const sourcePath = await resolveWorkspaceContainedPath({
    workspaceRoot,
    path: normalizedInstructionSourcePath,
    label: 'Canonical instruction source',
  });
  const source = await readFile(sourcePath, 'utf8');
  const writes: InstructionMirrorWrite[] = [];

  const mirrorTargets = resolveMirrorTargets(projectionModel, providedMirrorTargets);
  for (const relativeTarget of mirrorTargets) {
    if (normalizeInstructionSourcePath(relativeTarget) === normalizedInstructionSourcePath) {
      throw new Error(`Canonical instruction source cannot also be an instruction mirror: ${relativeTarget}`);
    }
    const targetPath = await resolveWorkspaceContainedPath({
      workspaceRoot,
      path: relativeTarget,
      label: 'Instruction mirror',
    });
    const rendered = renderMirror(relativeTarget, source, normalizedInstructionSourcePath);

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
  instructionSourcePath: providedInstructionSourcePath,
  mirrorTargets,
  projectionModel,
}: Pick<SyncInstructionMirrorsOptions, 'cwd' | 'instructionSourcePath' | 'mirrorTargets' | 'projectionModel'>): Promise<CheckInstructionMirrorParityResult> => {
  const workspaceRoot = resolve(cwd);
  const normalizedInstructionSourcePath = normalizeInstructionSourcePath(
    providedInstructionSourcePath ?? projectionModel?.instructionSourcePath,
  );
  const sourcePath = await resolveWorkspaceContainedPath({
    workspaceRoot,
    path: normalizedInstructionSourcePath,
    label: 'Canonical instruction source',
  });
  const source = await readFile(sourcePath, 'utf8');
  const issues: InstructionMirrorIssue[] = [];

  for (const relativeTarget of resolveMirrorTargets(projectionModel, mirrorTargets)) {
    if (normalizeInstructionSourcePath(relativeTarget) === normalizedInstructionSourcePath) {
      throw new Error(`Canonical instruction source cannot also be an instruction mirror: ${relativeTarget}`);
    }
    const targetPath = await resolveWorkspaceContainedPath({
      workspaceRoot,
      path: relativeTarget,
      label: 'Instruction mirror',
    });
    const expected = renderMirror(relativeTarget, source, normalizedInstructionSourcePath);

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
): string[] => [...new Map((projectionModel
    ? projectionModel.hosts
        .filter((host) => host.instructionProjection === 'mirror')
        .map((host) => host.instructionPath)
    : mirrorTargets ?? [...MIRROR_TARGETS])
  .map((path) => [normalizeInstructionSourcePath(path), path] as const)).values()];

export const renderMirror = (target: string, source: string, sourceLabel = 'AGENTS.md'): string => {
  const header = [
    `<!-- Generated from ${sourceLabel} for ${target}. Do not edit directly. -->`,
    '',
  ].join('\n');

  return `${header}${source}`;
};
