import { dirname, join, relative } from 'node:path';

import type {
  SkoposArchitectureReport,
  SkoposConfidence,
  SkoposContradictionReferenceArtifact,
  SkoposContradictionReferenceEntry,
  SkoposDiagnosisReport,
  SkoposDuplicateReferenceArtifact,
  SkoposDuplicateReferenceEntry,
  SkoposSymbolPackageSummary,
  SkoposSymbolReferenceArtifact,
  SkoposSymbolReferenceEntry,
} from '@skopos/model';
import * as ts from 'typescript';

import {
  findFilesNamed,
  listFilesUnder,
  readJsonFile,
  readTextFile,
} from '../../adapters/workspace-filesystem.adapter.js';
import { scanRepo } from '../scan-repo/scan-repo.service.js';
import { isPackageScopePath } from '../shared/package-scope-path.policy.js';
import { isWithinSubtree, normalizeSubtreeTarget } from '../shared/subtree-target.policy.js';

const COMMAND_NAMES = ['dev', 'build', 'test', 'typecheck', 'lint'] as const;
const DOC_ID_PATTERN = /^-\s+Doc ID:\s+`([^`]+)`/m;

type CommandName = (typeof COMMAND_NAMES)[number];

interface BuildSkoposReferenceArtifactsOptions {
  cwd: string;
  subtreeTarget?: string;
  diagnosis?: SkoposDiagnosisReport;
  architecture?: SkoposArchitectureReport;
}

export interface BuildSkoposReferenceArtifactsResult {
  symbols: SkoposSymbolReferenceArtifact;
  duplicates: SkoposDuplicateReferenceArtifact;
  contradictions: SkoposContradictionReferenceArtifact;
}

interface PackageSurface {
  id: string;
  path: string;
  commandNames: CommandName[];
}

export const buildSkoposReferenceArtifacts = async ({
  cwd,
  subtreeTarget,
  diagnosis,
  architecture,
}: BuildSkoposReferenceArtifactsOptions): Promise<BuildSkoposReferenceArtifactsResult> => {
  const generatedAt = new Date().toISOString();
  const scanSummary = await scanRepo({ cwd, subtreeTarget });
  const focusSubtree = normalizeSubtreeTarget(cwd, subtreeTarget ?? scanSummary.focusSubtree);
  const packageSurfaces = await collectPackageSurfaces(cwd, focusSubtree, scanSummary.ignoredPaths);
  const symbols = await buildSkoposSymbolReferenceArtifact({
    cwd,
    focusSubtree,
    packageSurfaces,
    generatedAt,
  });
  const duplicates = await buildSkoposDuplicateReferenceArtifact({
    cwd,
    focusSubtree,
    packageSurfaces,
    docsRoot: scanSummary.docsHealth.root,
    rootCommands: scanSummary.commands,
    generatedAt,
  });
  const contradictionsArtifact = buildSkoposContradictionReferenceArtifact({
    cwd,
    focusSubtree,
    diagnosis,
    architecture,
    generatedAt,
  });

  return {
    symbols,
    duplicates,
    contradictions: contradictionsArtifact,
  };
};

interface BuildSkoposSymbolReferenceArtifactOptions {
  cwd: string;
  focusSubtree?: string;
  packageSurfaces: PackageSurface[];
  generatedAt: string;
}

const buildSkoposSymbolReferenceArtifact = async ({
  cwd,
  focusSubtree,
  packageSurfaces,
  generatedAt,
}: BuildSkoposSymbolReferenceArtifactOptions): Promise<SkoposSymbolReferenceArtifact> => {
  const packageSummaries: SkoposSymbolPackageSummary[] = [];
  const entries: SkoposSymbolReferenceEntry[] = [];

  for (const packageSurface of packageSurfaces) {
    const sourceRoot = join(cwd, packageSurface.path, 'src');
    const sourceFiles = (await listFilesUnder(sourceRoot, [
      '.ts',
      '.tsx',
      '.mts',
      '.cts',
    ])).filter(isIndexableSourceFile);
    let symbolCount = 0;

    for (const sourceFilePath of sourceFiles) {
      const sourceEntries = await collectSourceFileEntries({
        cwd,
        packageId: packageSurface.id,
        packagePath: packageSurface.path,
        sourceFilePath,
      });
      symbolCount += sourceEntries.length;
      entries.push(...sourceEntries);
    }

    packageSummaries.push({
      packageId: packageSurface.id,
      packagePath: packageSurface.path,
      sourceFileCount: sourceFiles.length,
      symbolCount,
    });
  }

  return {
    schemaVersion: 1,
    id: 'symbols',
    type: 'symbols',
    status: 'generated',
    authority: 'generated',
    summary: 'Compiled exported symbol inventory for package-level agent reference.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot: cwd,
    focusSubtree,
    packages: packageSummaries.sort((left, right) => left.packageId.localeCompare(right.packageId)),
    entries: entries.sort((left, right) =>
      `${left.packageId}:${left.sourcePath}:${left.line}:${left.name}`.localeCompare(
        `${right.packageId}:${right.sourcePath}:${right.line}:${right.name}`,
      ),
    ),
  };
};

interface CollectSourceFileEntriesOptions {
  cwd: string;
  packageId: string;
  packagePath: string;
  sourceFilePath: string;
}

const collectSourceFileEntries = async ({
  cwd,
  packageId,
  packagePath,
  sourceFilePath,
}: CollectSourceFileEntriesOptions): Promise<SkoposSymbolReferenceEntry[]> => {
  const sourceText = await readTextFile(sourceFilePath);
  if (!sourceText) {
    return [];
  }

  const sourceFile = ts.createSourceFile(
    sourceFilePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    detectScriptKind(sourceFilePath),
  );
  const sourcePath = relative(cwd, sourceFilePath) || '.';
  const entries: SkoposSymbolReferenceEntry[] = [];

  for (const statement of sourceFile.statements) {
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
    const exported =
      ts.isExportAssignment(statement) || hasModifier(modifiers, ts.SyntaxKind.ExportKeyword);
    if (!exported) {
      continue;
    }

    const isDefaultExport =
      ts.isExportAssignment(statement) || hasModifier(modifiers, ts.SyntaxKind.DefaultKeyword);
    const line = sourceFile.getLineAndCharacterOfPosition(statement.getStart(sourceFile)).line + 1;
    const statementEntries = buildStatementSymbolEntries({
      statement,
      packageId,
      packagePath,
      sourcePath,
      line,
      isDefaultExport,
    });
    entries.push(...statementEntries);
  }

  return entries;
};

interface BuildStatementSymbolEntriesOptions {
  statement: ts.Statement;
  packageId: string;
  packagePath: string;
  sourcePath: string;
  line: number;
  isDefaultExport: boolean;
}

const buildStatementSymbolEntries = ({
  statement,
  packageId,
  packagePath,
  sourcePath,
  line,
  isDefaultExport,
}: BuildStatementSymbolEntriesOptions): SkoposSymbolReferenceEntry[] => {
  const createEntry = (
    name: string,
    kind: SkoposSymbolReferenceEntry['kind'],
    isTypeOnly: boolean,
  ): SkoposSymbolReferenceEntry => ({
    id: `${packageId}:${sourcePath}:${line}:${name}`,
    name,
    kind,
    packageId,
    packagePath,
    sourcePath,
    line,
    exported: true,
    isDefaultExport,
    isTypeOnly,
  });

  if (ts.isFunctionDeclaration(statement)) {
    return [createEntry(statement.name?.text ?? 'default', isDefaultExport ? 'default-export' : 'function', false)];
  }

  if (ts.isClassDeclaration(statement)) {
    return [createEntry(statement.name?.text ?? 'default', isDefaultExport ? 'default-export' : 'class', false)];
  }

  if (ts.isInterfaceDeclaration(statement)) {
    return [createEntry(statement.name.text, 'interface', true)];
  }

  if (ts.isTypeAliasDeclaration(statement)) {
    return [createEntry(statement.name.text, 'type-alias', true)];
  }

  if (ts.isEnumDeclaration(statement)) {
    return [createEntry(statement.name.text, 'enum', false)];
  }

  if (ts.isModuleDeclaration(statement)) {
    return [createEntry(statement.name.getText(), 'namespace', false)];
  }

  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations.flatMap((declaration) =>
      collectBindingIdentifiers(declaration.name).map((name) => createEntry(name, 'variable', false)),
    );
  }

  if (ts.isExportAssignment(statement)) {
    return [createEntry('default', 'default-export', false)];
  }

  return [];
};

interface BuildSkoposDuplicateReferenceArtifactOptions {
  cwd: string;
  focusSubtree?: string;
  packageSurfaces: PackageSurface[];
  docsRoot?: string;
  rootCommands: Record<string, string | undefined>;
  generatedAt: string;
}

const buildSkoposDuplicateReferenceArtifact = async ({
  cwd,
  focusSubtree,
  packageSurfaces,
  docsRoot,
  rootCommands,
  generatedAt,
}: BuildSkoposDuplicateReferenceArtifactOptions): Promise<SkoposDuplicateReferenceArtifact> => {
  const entries: SkoposDuplicateReferenceEntry[] = [];
  const rootCommandNames = COMMAND_NAMES.filter((commandName) => rootCommands[commandName]);
  const packageOwnersByCommand = collectPackageOwnersByCommand(packageSurfaces);

  if (rootCommandNames.length === 0) {
    for (const commandName of COMMAND_NAMES) {
      const owners = packageOwnersByCommand[commandName] ?? [];
      if (owners.length < 2) {
        continue;
      }

      entries.push({
        id: `package-command:${commandName}`,
        kind: 'package-command',
        key: commandName,
        summary: `Command "${commandName}" appears in multiple package manifests without a canonical root lane.`,
        owners: owners.map((owner) => ({
          label: owner.id,
          path: join(owner.path, 'package.json'),
        })),
        recommendedAction:
          'Promote one workspace-level command lane so agents do not have to guess between package-local scripts.',
      });
    }
  }

  const docDuplicates = await collectDocIdDuplicates(cwd, docsRoot);
  entries.push(...docDuplicates);

  return {
    schemaVersion: 1,
    id: 'duplicates',
    type: 'duplicates',
    status: 'generated',
    authority: 'generated',
    summary: 'Compiled duplicate references for doc ids and ambiguous command surfaces.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot: cwd,
    focusSubtree,
    entries: entries.sort((left, right) => `${left.kind}:${left.key}`.localeCompare(`${right.kind}:${right.key}`)),
  };
};

const collectDocIdDuplicates = async (
  cwd: string,
  docsRoot?: string,
): Promise<SkoposDuplicateReferenceEntry[]> => {
  if (!docsRoot) {
    return [];
  }

  const markdownPaths = await listFilesUnder(join(cwd, docsRoot), ['.md']);
  const ownersByDocId = new Map<string, Array<{ label: string; path: string }>>();

  for (const filePath of markdownPaths) {
    const source = await readTextFile(filePath);
    if (!source) {
      continue;
    }

    const docIdMatch = source.match(DOC_ID_PATTERN);
    const docId = docIdMatch?.[1]?.trim();
    if (!docId) {
      continue;
    }

    const owners = ownersByDocId.get(docId) ?? [];
    owners.push({
      label: relative(cwd, filePath) || '.',
      path: relative(cwd, filePath) || '.',
    });
    ownersByDocId.set(docId, owners);
  }

  return [...ownersByDocId.entries()]
    .filter(([, owners]) => owners.length > 1)
    .map(([docId, owners]) => ({
      id: `doc-id:${docId}`,
      kind: 'doc-id',
      key: docId,
      summary: `Doc ID "${docId}" is declared in multiple markdown documents.`,
      owners,
      recommendedAction:
        'Keep one canonical doc id per document so exact retrieval and canonical routing stay stable.',
    }));
};

interface BuildSkoposContradictionReferenceArtifactOptions {
  cwd: string;
  focusSubtree?: string;
  diagnosis?: SkoposDiagnosisReport;
  architecture?: SkoposArchitectureReport;
  generatedAt: string;
}

const buildSkoposContradictionReferenceArtifact = ({
  cwd,
  focusSubtree,
  diagnosis,
  architecture,
  generatedAt,
}: BuildSkoposContradictionReferenceArtifactOptions): SkoposContradictionReferenceArtifact => {
  const entries: SkoposContradictionReferenceEntry[] = [];

  if (diagnosis) {
    entries.push(
      ...diagnosis.findings
        .filter((finding) => finding.classification === 'conflicting')
        .map((finding) => ({
          id: `diagnosis:${finding.id}`,
          source: 'diagnosis' as const,
          summary: finding.summary,
          confidence: finding.confidence,
          severity: finding.severity,
          classification: finding.classification,
          evidence: finding.evidence,
          relatedIds: [finding.id],
          recommendedAction: finding.recommendedAction,
        })),
    );
  }

  if (architecture && architecture.alignmentStatus !== 'aligned') {
    entries.push({
      id: 'architecture:alignment',
      source: 'architecture',
      summary: `Current architecture reads as ${architecture.current.topology}, but the recommended target is ${architecture.recommended.topology}.`,
      confidence: deriveArchitectureConfidence(architecture),
      severity: architecture.alignmentStatus === 'divergent' ? 'high' : 'medium',
      classification: 'divergent-architecture',
      evidence: [
        ...architecture.current.evidence,
        ...architecture.recommended.evidence,
      ].slice(0, 12),
      relatedIds: architecture.unresolvedDecisions.map((decision) => decision.id),
      recommendedAction:
        architecture.unresolvedDecisions[0]?.recommendedAction ??
        'Resolve the architecture divergence before broad agent autonomy depends on it.',
    });
  }

  return {
    schemaVersion: 1,
    id: 'contradictions',
    type: 'contradictions',
    status: 'generated',
    authority: 'generated',
    summary: 'Compiled contradiction references derived from diagnosis conflicts and architecture divergence.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot: cwd,
    focusSubtree,
    entries: entries.sort((left, right) => left.id.localeCompare(right.id)),
  };
};

const deriveArchitectureConfidence = (architecture: SkoposArchitectureReport): SkoposConfidence => {
  const confidences = [
    ...architecture.current.units.map((unit) => unit.confidence),
    ...architecture.recommended.units.map((unit) => unit.confidence),
    ...architecture.unresolvedDecisions.map((decision) => decision.confidence),
  ];

  if (confidences.includes('low')) {
    return 'low';
  }

  if (confidences.includes('medium')) {
    return 'medium';
  }

  return 'high';
};

const collectPackageSurfaces = async (
  cwd: string,
  focusSubtree: string | undefined,
  ignoredPaths: string[],
): Promise<PackageSurface[]> => {
  const packageJsonPaths = (await findFilesNamed(cwd, 'package.json'))
    .filter((filePath) => {
      const packageDir = relative(cwd, dirname(filePath)) || '.';
      return (
        packageDir !== '.' &&
        isPackageScopePath(packageDir, ignoredPaths) &&
        isWithinSubtree(packageDir, focusSubtree)
      );
    })
    .sort();

  const surfaces: PackageSurface[] = [];

  for (const packageJsonPath of packageJsonPaths) {
    const packageJson = await readJsonFile<Record<string, unknown>>(packageJsonPath);
    if (!packageJson) {
      continue;
    }

    const packagePath = relative(cwd, dirname(packageJsonPath)) || '.';
    const scripts = (packageJson.scripts ?? {}) as Record<string, unknown>;
    const commandNames = COMMAND_NAMES.filter((commandName) => typeof scripts[commandName] === 'string');
    surfaces.push({
      id:
        (typeof packageJson.name === 'string' && packageJson.name.trim().length > 0
          ? packageJson.name
          : packagePath),
      path: packagePath,
      commandNames,
    });
  }

  return surfaces;
};

const collectPackageOwnersByCommand = (
  packageSurfaces: PackageSurface[],
): Record<CommandName, PackageSurface[]> =>
  COMMAND_NAMES.reduce(
    (accumulator, commandName) => {
      accumulator[commandName] = packageSurfaces.filter((surface) =>
        surface.commandNames.includes(commandName),
      );
      return accumulator;
    },
    {
      dev: [],
      build: [],
      test: [],
      typecheck: [],
      lint: [],
    } as Record<CommandName, PackageSurface[]>,
  );

const collectBindingIdentifiers = (name: ts.BindingName): string[] => {
  if (ts.isIdentifier(name)) {
    return [name.text];
  }

  if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
    return name.elements.flatMap((element) =>
      ts.isBindingElement(element) && element.name ? collectBindingIdentifiers(element.name) : [],
    );
  }

  return [];
};

const hasModifier = (
  modifiers: readonly ts.ModifierLike[] | undefined,
  kind: ts.SyntaxKind,
): boolean => modifiers?.some((modifier) => modifier.kind === kind) ?? false;

const detectScriptKind = (filePath: string): ts.ScriptKind => {
  if (filePath.endsWith('.tsx')) {
    return ts.ScriptKind.TSX;
  }

  if (filePath.endsWith('.jsx')) {
    return ts.ScriptKind.JSX;
  }

  return ts.ScriptKind.TS;
};

const isIndexableSourceFile = (filePath: string): boolean =>
  !filePath.endsWith('.d.ts') &&
  !filePath.includes('/__tests__/') &&
  !filePath.includes('/fixtures/') &&
  !filePath.includes('/internal/') &&
  !/\.test\.[cm]?tsx?$/.test(filePath) &&
  !/\.spec\.[cm]?tsx?$/.test(filePath);
