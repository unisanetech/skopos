import { basename, dirname, relative } from 'node:path';

import type {
  SkoposConfidence,
  SkoposScopeLite,
  SkoposScopesLiteArtifact,
  SkoposScanSummary,
} from '@skopos/model';

import { findFilesNamed, readJsonFile } from '../../adapters/workspace-filesystem.adapter.js';
import { isPackageScopePath } from '../shared/package-scope-path.policy.js';
import { isWithinSubtree, normalizeSubtreeTarget } from '../shared/subtree-target.policy.js';

export interface BuildSkoposScopesLiteOptions {
  cwd: string;
  scanSummary: SkoposScanSummary;
  subtreeTarget?: string;
}

export const buildSkoposScopesLite = async ({
  cwd,
  scanSummary,
  subtreeTarget,
}: BuildSkoposScopesLiteOptions): Promise<SkoposScopesLiteArtifact> => {
  const focusSubtree = normalizeSubtreeTarget(cwd, subtreeTarget ?? scanSummary.focusSubtree);
  const packageJsonPaths = await findFilesNamed(cwd, 'package.json');
  const scopes: SkoposScopeLite[] = [
    {
      id: 'workspace',
      kind: 'workspace',
      title: basename(cwd),
      path: '.',
      aliases: ['root'],
      summary: 'Workspace root scope.',
      confidence: scanSummary.confidence,
    },
  ];

  for (const packageJsonPath of packageJsonPaths) {
    const packageDir = relative(cwd, dirname(packageJsonPath)) || '.';
    if (!isPackageScopePath(packageDir, scanSummary.ignoredPaths)) {
      continue;
    }

    if (!isWithinSubtree(packageDir, focusSubtree)) {
      continue;
    }

    const packageJson = await readJsonFile<Record<string, unknown>>(packageJsonPath);
    const packageName = asOptionalString(packageJson?.name) ?? packageDir.replaceAll('/', '-');
    const description = asOptionalString(packageJson?.description);

    scopes.push({
      id: packageName,
      kind: 'package',
      title: packageName,
      path: packageDir,
      aliases: uniqueAliases([packageDir, basename(packageDir)]),
      summary: description ?? `Package scope for ${packageName}.`,
      confidence: 'high',
    });
  }

  for (const docsRoot of scanSummary.docsRoots) {
    scopes.push({
      id: `docs:${docsRoot}`,
      kind: 'docs-root',
      title: docsRoot,
      path: docsRoot,
      aliases: uniqueAliases([docsRoot]),
      summary: `Canonical docs root at ${docsRoot}.`,
      confidence: confidenceFromSummary(scanSummary),
    });
  }

  for (const instructionFile of scanSummary.instructionFiles) {
    const fileName = basename(instructionFile, '.md').toLowerCase();

    scopes.push({
      id: `instructions:${fileName}`,
      kind: 'instruction-file',
      title: instructionFile,
      path: instructionFile,
      aliases: uniqueAliases([instructionFile, fileName]),
      summary: `Instruction surface at ${instructionFile}.`,
      confidence: confidenceFromSummary(scanSummary),
    });
  }

  return {
    schemaVersion: 1,
    id: 'scopes-lite',
    type: 'scopes-lite',
    status: 'generated',
    authority: 'generated',
    summary: 'Compact scope cards for exact resolution and compact context assembly.',
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot: cwd,
    focusSubtree,
    scopes,
  };
};

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;

const uniqueAliases = (aliases: string[]): string[] => [
  ...new Set(aliases.filter((alias) => alias.trim().length > 0)),
];

const confidenceFromSummary = (scanSummary: SkoposScanSummary): SkoposConfidence =>
  scanSummary.confidence;
