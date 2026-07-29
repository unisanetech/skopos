import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import type {
  SkoposDeclaredScope,
  SkoposDocumentAuthority,
  SkoposDocumentKnowledgeEntry,
  SkoposDocumentLifecycle,
  SkoposDocumentMetadata,
  SkoposDocumentRole,
  SkoposFindingSeverity,
  SkoposRootConfig,
} from '@skopos/model';
import YAML from 'yaml';

import { loadSkoposScopeRegistry } from '../load-scope-registry/load-scope-registry.service.js';

export interface BuildSkoposDocumentCatalogOptions {
  cwd: string;
  config?: SkoposRootConfig | null;
}

export type SkoposDocumentCatalogIssueKind = 'metadata' | 'link';

export interface SkoposDocumentCatalogIssue {
  kind: SkoposDocumentCatalogIssueKind;
  code: string;
  path: string;
  summary: string;
  reference?: string;
}

export interface SkoposDocumentCatalogResult {
  documents: SkoposDocumentKnowledgeEntry[];
  issues: SkoposDocumentCatalogIssue[];
}

export const buildSkoposDocumentCatalog = async ({
  cwd,
  config: providedConfig,
}: BuildSkoposDocumentCatalogOptions): Promise<SkoposDocumentCatalogResult> => {
  const workspaceRoot = resolve(cwd);
  const config =
    providedConfig === undefined
      ? await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'))
      : providedConfig;
  const docsRoot = config?.docs.root ?? 'docs';
  const documents: SkoposDocumentKnowledgeEntry[] = [];
  const issues: SkoposDocumentCatalogIssue[] = [];
  const strictMetadata = config?.docs.strictMetadata ?? false;
  const scopeRegistry = await loadSkoposScopeRegistry({ cwd: workspaceRoot });
  const declaredScopeIds = scopeRegistry
    ? new Set(scopeRegistry.scopes.map((scope) => scope.id))
    : undefined;
  const memoryRoots = buildMemoryRootOwners(scopeRegistry?.scopes ?? []);
  const catalogRoots = [
    docsRoot,
    ...memoryRoots.map((entry) => entry.memoryRoot),
  ];
  const absolutePaths = [
    ...new Set(
      (
        await Promise.all(
          catalogRoots.map((root) =>
            collectMarkdownPaths(resolveProjectPath(workspaceRoot, root, 'memory root')),
          ),
        )
      ).flat(),
    ),
  ].sort();

  if (strictMetadata && !scopeRegistry) {
    issues.push(
      metadataIssue(
        'tools/skopos/scopes.yaml',
        'missing-scope-registry',
        'Strict Project Memory requires a declared Scope registry.',
      ),
    );
  }

  for (const absolutePath of absolutePaths) {
    const workspacePath = normalizePath(relative(workspaceRoot, absolutePath));
    const contents = await readFile(absolutePath, 'utf8');
    const parsedMetadata = parseDocumentMetadata(contents, {
      strict: strictMetadata,
    });
    const metadata = parsedMetadata.metadata;
    const owningMemoryRoot = resolveOwningMemoryRoot(workspacePath, memoryRoots);
    const semantics = inferDocumentSemantics({
      workspacePath,
      startHerePath: config?.docs.startHerePath,
      metadata,
    });
    const metadataIssues = strictMetadata
      ? validateStrictDocumentMetadata({
          workspacePath,
          metadata,
          fields: parsedMetadata.fields,
          format: parsedMetadata.format,
          parseError: parsedMetadata.parseError,
          hasLegacyMetadataSection: parsedMetadata.hasLegacyMetadataSection,
          declaredScopeIds,
          owningMemoryRoot,
        })
      : [];

    issues.push(...metadataIssues);
    if (config?.docs.strictLinking && metadata.lifecycle !== 'historical') {
      issues.push(
        ...(await validateDocumentLinks({
          workspaceRoot,
          absolutePath,
          workspacePath,
          contents,
          allowLegacyMetadataSection: !strictMetadata,
        })),
      );
    }

    if (strictMetadata && (!scopeRegistry || metadataIssues.length > 0)) {
      continue;
    }

    documents.push({
      id: metadata.id ?? buildDocumentId(workspacePath),
      title: extractDocumentTitle(contents, absolutePath),
      path: workspacePath,
      sourceId: 'docs',
      adoption: strictMetadata ? 'adopted' : 'discovery',
      role: semantics.role,
      lifecycle: semantics.lifecycle,
      authority: semantics.authority,
      defaultVisible:
        !['historical', 'dead'].includes(semantics.lifecycle) &&
        semantics.authority !== 'generated',
      summary: extractDocumentSummary(contents),
      metadata,
    });
  }

  const duplicateIds = collectDuplicateDocumentIdIssues(documents);
  issues.push(...duplicateIds.issues);
  if (strictMetadata && duplicateIds.ids.size > 0) {
    for (let index = documents.length - 1; index >= 0; index -= 1) {
      if (duplicateIds.ids.has(documents[index]!.id)) {
        documents.splice(index, 1);
      }
    }
  }

  return {
    documents: documents.sort((left, right) => left.path.localeCompare(right.path)),
    issues: issues.sort(
      (left, right) =>
        left.path.localeCompare(right.path) ||
        left.kind.localeCompare(right.kind) ||
        left.code.localeCompare(right.code) ||
        (left.reference ?? '').localeCompare(right.reference ?? ''),
    ),
  };
};

interface MemoryRootOwner {
  scopeId: string;
  memoryRoot: string;
}

const buildMemoryRootOwners = (
  scopes: SkoposDeclaredScope[],
): MemoryRootOwner[] =>
  scopes
    .map((scope) => ({
      scopeId: scope.id,
      memoryRoot: normalizePath(scope.memoryRoot).replace(/\/+$/, ''),
    }))
    .sort(
      (left, right) =>
        right.memoryRoot.split('/').length - left.memoryRoot.split('/').length ||
        left.scopeId.localeCompare(right.scopeId),
    );

const resolveOwningMemoryRoot = (
  workspacePath: string,
  memoryRoots: MemoryRootOwner[],
): MemoryRootOwner | undefined =>
  memoryRoots.find(
    ({ memoryRoot }) =>
      workspacePath === memoryRoot ||
      workspacePath.startsWith(`${memoryRoot}/`),
  );

export const assertSkoposDocumentCatalogConforms = (
  catalog: SkoposDocumentCatalogResult,
): void => {
  if (catalog.issues.length === 0) return;

  throw new Error(
    [
      `Project Memory validation failed with ${catalog.issues.length} issue${
        catalog.issues.length === 1 ? '' : 's'
      }:`,
      ...catalog.issues.map(
        (issue) =>
          `- [${issue.kind}:${issue.code}] ${issue.path}: ${issue.summary}`,
      ),
    ].join('\n'),
  );
};

export const isSkoposAdoptedProjectMemoryDocument = (
  document: SkoposDocumentKnowledgeEntry,
): boolean => {
  const metadata = document.metadata;
  if (
    document.adoption !== 'adopted' ||
    document.role === 'document' ||
    !['active', 'durable'].includes(document.lifecycle) ||
    document.authority === 'generated' ||
    !document.defaultVisible ||
    !metadata?.id ||
    !metadata.owner ||
    !metadata.scope ||
    !metadata.role ||
    !metadata.lifecycle ||
    !metadata.authority ||
    !metadata.provenance ||
    !metadata.view
  ) {
    return false;
  }

  if (
    document.role === 'finding' &&
    document.lifecycle === 'active' &&
    !metadata.severity
  ) {
    return false;
  }

  return document.role !== 'pattern' ||
    Boolean(metadata.patternKind && metadata.appliesTo?.length);
};

const resolveProjectPath = (
  workspaceRoot: string,
  projectPath: string,
  label: string,
): string => {
  const absolutePath = resolve(workspaceRoot, projectPath);
  const relativePath = relative(workspaceRoot, absolutePath);
  if (relativePath === '..' || relativePath.startsWith('../') || relativePath.startsWith('..\\')) {
    throw new Error(`Skopos ${label} must stay inside the workspace: ${projectPath}`);
  }
  return absolutePath;
};

const collectMarkdownPaths = async (directoryPath: string): Promise<string[]> => {
  let entries;
  try {
    entries = await readdir(directoryPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const results: string[] = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.skopos') {
      continue;
    }
    const entryPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectMarkdownPaths(entryPath)));
    } else if (entry.isFile() && ['.md', '.mdx'].includes(extname(entry.name).toLowerCase())) {
      results.push(entryPath);
    }
  }
  return results;
};

const inferDocumentSemantics = ({
  workspacePath,
  startHerePath,
  metadata,
}: {
  workspacePath: string;
  startHerePath?: string;
  metadata: SkoposDocumentMetadata;
}): {
  role: SkoposDocumentRole;
  lifecycle: SkoposDocumentLifecycle;
  authority: SkoposDocumentAuthority;
} => {
  const normalizedPath = normalizePath(workspacePath).toLowerCase();
  const segments = normalizedPath.split('/').filter(Boolean);
  const isStartHere =
    Boolean(startHerePath) && normalizedPath === normalizePath(startHerePath ?? '').toLowerCase();
  const lifecycle = inferLifecycle(segments, metadata.lifecycle, metadata.status, isStartHere);
  const role = inferRole(segments, metadata.role, isStartHere);
  const authority: SkoposDocumentAuthority =
    segments.includes('generated')
      ? 'generated'
      : metadata.authority ?? (isCanonicalRole(role) ? 'canonical' : 'supporting');
  return { role, lifecycle, authority };
};

const inferLifecycle = (
  segments: string[],
  lifecycle: SkoposDocumentLifecycle | undefined,
  status: string | undefined,
  isStartHere: boolean,
): SkoposDocumentLifecycle => {
  if (lifecycle) return lifecycle;
  const normalizedStatus = status?.toLowerCase();
  if (
    segments.includes('archive') ||
    ['historical', 'archived', 'superseded', 'deprecated', 'dead'].includes(
      normalizedStatus ?? '',
    )
  ) {
    return 'historical';
  }
  if (isStartHere || normalizedStatus === 'active' || normalizedStatus === 'in-progress') {
    return 'active';
  }
  return 'durable';
};

const inferRole = (
  segments: string[],
  declaredRole: SkoposDocumentRole | undefined,
  isStartHere: boolean,
): SkoposDocumentRole => {
  if (isStartHere) return 'router';
  if (declaredRole) return declaredRole;
  if (segments.includes('patterns') || segments.includes('failure-patterns')) return 'pattern';
  if (segments.includes('decisions') || segments.includes('decision')) return 'decision';
  if (segments.includes('findings') || segments.includes('issues')) return 'finding';
  if (segments.includes('plans')) return 'plan';
  if (segments.includes('tasks') || segments.includes('execution')) return 'task';
  if (segments.includes('architecture')) return 'architecture';
  if (segments.includes('standards') || segments.includes('ssot')) return 'standard';
  if (segments.includes('domains')) return 'domain';
  if (segments.includes('guides') || segments.includes('how-to')) return 'guide';
  if (segments.includes('operations')) return 'operation';
  if (segments.includes('reference') || segments.includes('references') || segments.includes('generated')) {
    return 'reference';
  }
  if (segments.at(-1) === 'overview.md') return 'overview';
  return 'document';
};

const isCanonicalRole = (role: SkoposDocumentRole): boolean =>
  ['router', 'overview', 'architecture', 'standard', 'domain', 'operation', 'decision'].includes(
    role,
  );

const parseDocumentMetadata = (
  contents: string,
  {
    strict,
  }: {
    strict: boolean;
  },
): {
  metadata: SkoposDocumentMetadata;
  fields: Map<string, string>;
  format: 'frontmatter' | 'metadata-section' | 'none';
  parseError?: string;
  hasLegacyMetadataSection: boolean;
} => {
  const lines = contents.replace(/\r\n/g, '\n').split('\n');
  const frontmatter = parseFrontmatter(lines);
  const metadataSection = parseMetadataSectionFields(lines);
  const format =
    frontmatter.present
      ? 'frontmatter'
      : metadataSection.size > 0
        ? 'metadata-section'
        : 'none';
  const fields =
    frontmatter.present
      ? frontmatter.fields
      : strict
        ? new Map<string, string>()
        : metadataSection;
  const idFields = strict ? CANONICAL_DOCUMENT_ID_FIELDS : DISCOVERY_DOCUMENT_ID_FIELDS;
  const patternKindFields = strict
    ? CANONICAL_PATTERN_KIND_FIELDS
    : DISCOVERY_PATTERN_KIND_FIELDS;
  const appliesToFields = strict
    ? CANONICAL_APPLIES_TO_FIELDS
    : DISCOVERY_APPLIES_TO_FIELDS;

  return {
    fields,
    format,
    parseError: frontmatter.error,
    hasLegacyMetadataSection: metadataSection.size > 0,
    metadata: {
      id: readMetadataField(fields, idFields),
      status: readMetadataField(fields, ['status']),
      owner: readMetadataField(fields, ['owner']),
      scope: readMetadataField(fields, ['scope']),
      role: parseEnum(readMetadataField(fields, ['role']), DOCUMENT_ROLES),
      lifecycle: parseEnum(
        readMetadataField(fields, ['lifecycle']),
        DOCUMENT_LIFECYCLES,
      ),
      authority: parseEnum(
        readMetadataField(fields, ['authority']),
        DOCUMENT_AUTHORITIES,
      ),
      provenance: parseEnum(
        readMetadataField(fields, ['provenance']),
        DOCUMENT_PROVENANCE,
      ),
      view: parseEnum(readMetadataField(fields, ['view']), DOCUMENT_VIEWS),
      severity: parseEnum(
        readMetadataField(fields, ['severity']),
        FINDING_SEVERITIES,
      ),
      priority: parsePriority(readMetadataField(fields, ['priority'])),
      dependencyIds: parseList(
        readMetadataField(fields, ['dependencies', 'dependencyIds']),
      ),
      patternKind: parseEnum(
        readMetadataField(fields, patternKindFields),
        PATTERN_KINDS,
      ),
      appliesTo: parseList(readMetadataField(fields, appliesToFields)),
    },
  };
};

interface ParsedFrontmatter {
  present: boolean;
  fields: Map<string, string>;
  error?: string;
}

const parseFrontmatter = (lines: string[]): ParsedFrontmatter => {
  const fields = new Map<string, string>();
  if (lines[0]?.trim() !== '---') return { present: false, fields };
  const closingIndex = lines.slice(1).findIndex((line) => line?.trim() === '---');
  if (closingIndex < 0) {
    return {
      present: true,
      fields,
      error: 'YAML frontmatter is missing its closing delimiter.',
    };
  }

  let parsed: unknown;
  try {
    parsed = YAML.parse(lines.slice(1, closingIndex + 1).join('\n')) as unknown;
  } catch (error) {
    return {
      present: true,
      fields,
      error: `YAML frontmatter could not be parsed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
  if (!isRecord(parsed)) {
    return {
      present: true,
      fields,
      error: 'YAML frontmatter must be a mapping of metadata fields.',
    };
  }

  for (const [key, value] of Object.entries(parsed)) {
    const normalized = normalizeMetadataValue(value);
    if (normalized !== undefined) {
      fields.set(key, normalized);
    }
  }

  return { present: true, fields };
};

const parseFrontmatterFields = (lines: string[]): Map<string, string> =>
  parseFrontmatter(lines).fields;

const parseMetadataSectionFields = (lines: string[]): Map<string, string> => {
  const fields = new Map<string, string>();
  let inMetadata = false;

  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line.trim());
    if (heading) {
      inMetadata = heading[2].trim().toLowerCase() === 'metadata';
      continue;
    }
    if (!inMetadata) continue;

    const match = /^-\s+([^:]+):\s*(.+)$/.exec(line.trim());
    if (match) {
      fields.set(match[1].trim().toLowerCase(), stripMarkdownValue(match[2]));
    }
  }

  return fields;
};

const normalizeMetadataValue = (value: unknown): string | undefined => {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    const values = value
      .map(normalizeMetadataValue)
      .filter((entry): entry is string => Boolean(entry));
    return values.length > 0 ? values.join(',') : undefined;
  }
  return undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const validateStrictDocumentMetadata = ({
  workspacePath,
  metadata,
  fields,
  format,
  parseError,
  hasLegacyMetadataSection,
  declaredScopeIds,
  owningMemoryRoot,
}: {
  workspacePath: string;
  metadata: SkoposDocumentMetadata;
  fields: Map<string, string>;
  format: 'frontmatter' | 'metadata-section' | 'none';
  parseError?: string;
  hasLegacyMetadataSection: boolean;
  declaredScopeIds?: Set<string>;
  owningMemoryRoot?: MemoryRootOwner;
}): SkoposDocumentCatalogIssue[] => {
  const issues: SkoposDocumentCatalogIssue[] = [];

  if (format !== 'frontmatter') {
    issues.push(
      metadataIssue(
        workspacePath,
        'noncanonical-metadata-format',
        'Adopted Project Memory documents must use canonical YAML frontmatter.',
      ),
    );
  }

  if (parseError) {
    issues.push(
      metadataIssue(
        workspacePath,
        'invalid-frontmatter',
        parseError,
      ),
    );
  }

  if (hasLegacyMetadataSection) {
    issues.push(
      metadataIssue(
        workspacePath,
        'legacy-metadata-section',
        'Adopted Project Memory must not declare a second Markdown Metadata section.',
      ),
    );
  }

  for (const field of fields.keys()) {
    if (field !== 'appliesTo' && LEGACY_FRONTMATTER_FIELDS.has(field.toLowerCase())) {
      issues.push(
        metadataIssue(
          workspacePath,
          'noncanonical-metadata-field',
          `Metadata field "${field}" is a legacy alias; use the canonical YAML field name.`,
        ),
      );
    }
  }

  for (const requirement of STRICT_METADATA_REQUIREMENTS) {
    if (!readMetadataField(fields, requirement.names)) {
      issues.push(
        metadataIssue(
          workspacePath,
          `missing-${requirement.code}`,
          `Required metadata field "${requirement.label}" is missing.`,
        ),
      );
    }
  }

  validateDeclaredEnum({
    workspacePath,
    fields,
    names: ['role'],
    label: 'Role',
    code: 'invalid-role',
    allowedValues: ADOPTED_DOCUMENT_ROLES,
    issues,
  });
  validateDeclaredEnum({
    workspacePath,
    fields,
    names: ['lifecycle'],
    label: 'Lifecycle',
    code: 'invalid-lifecycle',
    allowedValues: DOCUMENT_LIFECYCLES,
    issues,
  });
  validateDeclaredEnum({
    workspacePath,
    fields,
    names: ['authority'],
    label: 'Authority',
    code: 'invalid-authority',
    allowedValues: DOCUMENT_AUTHORITIES,
    issues,
  });
  validateDeclaredEnum({
    workspacePath,
    fields,
    names: ['provenance'],
    label: 'Provenance',
    code: 'invalid-provenance',
    allowedValues: DOCUMENT_PROVENANCE,
    issues,
  });
  validateDeclaredEnum({
    workspacePath,
    fields,
    names: ['view'],
    label: 'View',
    code: 'invalid-view',
    allowedValues: DOCUMENT_VIEWS,
    issues,
  });

  const declaredFindingSeverity = readMetadataField(fields, ['severity']);
  if (metadata.role === 'finding') {
    if (metadata.lifecycle === 'active' && !declaredFindingSeverity) {
      issues.push(
        metadataIssue(
          workspacePath,
          'missing-finding-severity',
          'Active Finding documents must declare severity as MUST, SHOULD, or COULD.',
        ),
      );
    }
    if (declaredFindingSeverity) {
      validateDeclaredEnum({
        workspacePath,
        fields,
        names: ['severity'],
        label: 'Severity',
        code: 'invalid-finding-severity',
        allowedValues: FINDING_SEVERITIES,
        issues,
      });
    }
  }

  const declaredPatternKind = readMetadataField(fields, CANONICAL_PATTERN_KIND_FIELDS);
  if (declaredPatternKind) {
    validateDeclaredEnum({
      workspacePath,
      fields,
      names: CANONICAL_PATTERN_KIND_FIELDS,
      label: 'kind',
      code: 'invalid-pattern-kind',
      allowedValues: PATTERN_KINDS,
      issues,
    });
  }

  if (
    metadata.scope &&
    declaredScopeIds &&
    !declaredScopeIds.has(metadata.scope)
  ) {
    issues.push(
      metadataIssue(
        workspacePath,
        'unknown-scope',
        `Scope "${metadata.scope}" is not declared in the project Scope registry.`,
      ),
    );
  }

  if (!owningMemoryRoot) {
    issues.push(
      metadataIssue(
        workspacePath,
        'unowned-memory-path',
        'Document path is not owned by any declared Scope memoryRoot.',
      ),
    );
  } else if (metadata.scope && metadata.scope !== owningMemoryRoot.scopeId) {
    issues.push(
      metadataIssue(
        workspacePath,
        'scope-memory-root-mismatch',
        `Document declares Scope "${metadata.scope}" but its memoryRoot owner is "${owningMemoryRoot.scopeId}".`,
      ),
    );
  }

  if (
    owningMemoryRoot &&
    metadata.role &&
    !isCanonicalRolePlacement({
      workspacePath,
      memoryRoot: owningMemoryRoot.memoryRoot,
      role: metadata.role,
      lifecycle: metadata.lifecycle,
    })
  ) {
    issues.push(
      metadataIssue(
        workspacePath,
        'role-path-mismatch',
        `Role "${metadata.role}" is not stored in its canonical location relative to Scope "${owningMemoryRoot.scopeId}".`,
      ),
    );
  }

  if (metadata.role === 'pattern') {
    if (!declaredPatternKind) {
      issues.push(
        metadataIssue(
          workspacePath,
          'missing-pattern-kind',
          'Pattern documents must declare kind as preferred-pattern or failure-pattern.',
        ),
      );
    }
    if (!metadata.appliesTo?.length) {
      issues.push(
        metadataIssue(
          workspacePath,
          'missing-pattern-applicability',
          'Pattern documents must declare at least one Applies To signal.',
        ),
      );
    }
    if (metadata.id && !metadata.id.startsWith('PAT-')) {
      issues.push(
        metadataIssue(
          workspacePath,
          'invalid-pattern-id',
          `Pattern id "${metadata.id}" must use the PAT-<collision-resistant-id> form.`,
        ),
      );
    }
  }

  const pathSegments = normalizePath(workspacePath).toLowerCase().split('/');
  if (
    pathSegments.includes('archive') &&
    metadata.lifecycle &&
    metadata.lifecycle !== 'historical'
  ) {
    issues.push(
      metadataIssue(
        workspacePath,
        'archive-lifecycle-mismatch',
        'Documents routed through archive/ must declare Lifecycle historical.',
      ),
    );
  }

  if (owningMemoryRoot) {
    const memoryRelativeSegments = getMemoryRelativePathSegments(
      workspacePath,
      owningMemoryRoot.memoryRoot,
    );
    const directorySegments = memoryRelativeSegments.slice(0, -1);
    const usesGeneratedDirectory = directorySegments.includes('generated');
    const isGeneratedReference =
      directorySegments[0] === 'reference' &&
      directorySegments[1] === 'generated';

    if (usesGeneratedDirectory && !isGeneratedReference) {
      issues.push(
        metadataIssue(
          workspacePath,
          'generated-path-mismatch',
          'Generated Project Memory may only be stored under reference/generated/ relative to its owning Scope memoryRoot.',
        ),
      );
    }
    if (
      isGeneratedReference &&
      metadata.authority &&
      metadata.authority !== 'generated'
    ) {
      issues.push(
        metadataIssue(
          workspacePath,
          'generated-authority-mismatch',
          'Documents under reference/generated/ must declare Authority generated.',
        ),
      );
    }
    if (metadata.authority === 'generated' && !isGeneratedReference) {
      issues.push(
        metadataIssue(
          workspacePath,
          'generated-authority-path-mismatch',
          'Authority generated is valid only under reference/generated/ relative to the owning Scope memoryRoot.',
        ),
      );
    }
  }

  return issues;
};

const getMemoryRelativePathSegments = (
  workspacePath: string,
  memoryRoot: string,
): string[] =>
  workspacePath
    .slice(memoryRoot.length)
    .replace(/^\/+/, '')
    .toLowerCase()
    .split('/')
    .filter(Boolean);

const isCanonicalRolePlacement = ({
  workspacePath,
  memoryRoot,
  role,
  lifecycle,
}: {
  workspacePath: string;
  memoryRoot: string;
  role: SkoposDocumentRole;
  lifecycle?: SkoposDocumentLifecycle;
}): boolean => {
  const relativePath = workspacePath.slice(memoryRoot.length).replace(/^\/+/, '');
  const segments = getMemoryRelativePathSegments(workspacePath, memoryRoot);
  const filename = segments.at(-1) ?? '';

  if (lifecycle === 'historical' && segments.includes('archive')) return true;
  if (
    filename === 'readme.md' &&
    ['router', 'standard'].includes(role) &&
    segments.length > 1
  ) {
    return true;
  }

  switch (role) {
    case 'router':
      return relativePath.toLowerCase() === '00-start-here.md';
    case 'overview':
      return relativePath.toLowerCase() === 'overview.md';
    case 'architecture':
      return segments[0] === 'architecture';
    case 'standard':
      return segments[0] === 'standards';
    case 'domain':
      return segments[0] === 'domains';
    case 'guide':
      return segments[0] === 'guides';
    case 'operation':
      return segments[0] === 'operations';
    case 'decision':
      return segments[0] === 'decisions';
    case 'finding':
      return segments[0] === 'findings';
    case 'plan':
      return segments[0] === 'work' && segments[1] === 'plans';
    case 'task':
      return segments[0] === 'work' && segments[1] === 'tasks';
    case 'pattern':
      return segments[0] === 'patterns';
    case 'reference':
      return segments[0] === 'reference';
    case 'document':
      return false;
  }
};

const validateDeclaredEnum = <TValue extends string>({
  workspacePath,
  fields,
  names,
  label,
  code,
  allowedValues,
  issues,
}: {
  workspacePath: string;
  fields: Map<string, string>;
  names: readonly string[];
  label: string;
  code: string;
  allowedValues: readonly TValue[];
  issues: SkoposDocumentCatalogIssue[];
}): void => {
  const value = readMetadataField(fields, names);
  if (
    !value ||
    allowedValues.some(
      (allowedValue) => allowedValue.toLowerCase() === value.toLowerCase(),
    )
  ) {
    return;
  }

  issues.push(
    metadataIssue(
      workspacePath,
      code,
      `${label} "${value}" is invalid; expected one of ${allowedValues.join(', ')}.`,
    ),
  );
};

const metadataIssue = (
  path: string,
  code: string,
  summary: string,
): SkoposDocumentCatalogIssue => ({
  kind: 'metadata',
  code,
  path,
  summary,
});

const validateDocumentLinks = async ({
  workspaceRoot,
  absolutePath,
  workspacePath,
  contents,
  allowLegacyMetadataSection,
}: {
  workspaceRoot: string;
  absolutePath: string;
  workspacePath: string;
  contents: string;
  allowLegacyMetadataSection: boolean;
}): Promise<SkoposDocumentCatalogIssue[]> => {
  const references = [
    ...extractMarkdownLinkTargets(contents),
    ...extractRelatedDocumentTargets(contents, allowLegacyMetadataSection),
  ];
  const issues: SkoposDocumentCatalogIssue[] = [];

  for (const reference of [...new Set(references)].sort()) {
    const target = normalizeLocalReference(reference);
    if (!target) continue;

    const targetPath = target.startsWith('/')
      ? resolve(workspaceRoot, `.${target}`)
      : resolve(dirname(absolutePath), target);
    const workspaceRelativeTarget = relative(workspaceRoot, targetPath);
    if (
      workspaceRelativeTarget === '..' ||
      workspaceRelativeTarget.startsWith('../') ||
      workspaceRelativeTarget.startsWith('..\\')
    ) {
      issues.push({
        kind: 'link',
        code: 'outside-workspace',
        path: workspacePath,
        reference,
        summary: `Local reference "${reference}" resolves outside the workspace.`,
      });
      continue;
    }

    try {
      await stat(targetPath);
    } catch {
      issues.push({
        kind: 'link',
        code: 'missing-target',
        path: workspacePath,
        reference,
        summary: `Local reference "${reference}" does not resolve to an existing path.`,
      });
    }
  }

  return issues;
};

const extractMarkdownLinkTargets = (contents: string): string[] => {
  const withoutCode = stripMarkdownCode(contents);
  return [...withoutCode.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)]
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value));
};

const extractRelatedDocumentTargets = (
  contents: string,
  allowLegacyMetadataSection: boolean,
): string[] => {
  const lines = contents.replace(/\r\n/g, '\n').split('\n');
  const frontmatterFields = parseFrontmatterFields(lines);
  const references = parseList(
    readMetadataField(
      frontmatterFields,
      allowLegacyMetadataSection
        ? ['relatedDocs', 'relateddocs', 'related docs']
        : ['relatedDocs'],
    ),
  ) ?? [];
  if (!allowLegacyMetadataSection) return references.filter(looksLikeLocalPath);

  let inMetadata = false;
  let collectingRelatedDocs = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      inMetadata = heading[2].trim().toLowerCase() === 'metadata';
      collectingRelatedDocs = false;
      continue;
    }
    if (!inMetadata) continue;

    const declaration = /^-\s+related\s*docs:\s*(.*)$/i.exec(trimmed);
    if (declaration) {
      collectingRelatedDocs = true;
      const inlineReference = stripMarkdownValue(declaration[1] ?? '');
      if (looksLikeLocalPath(inlineReference)) references.push(inlineReference);
      continue;
    }
    if (!collectingRelatedDocs) continue;

    const nestedReference = /^-\s+`([^`]+)`/.exec(trimmed);
    if (nestedReference?.[1]) {
      references.push(nestedReference[1]);
      continue;
    }
    if (trimmed && !line.startsWith(' ') && !line.startsWith('\t')) {
      collectingRelatedDocs = false;
    }
  }

  return references.filter(looksLikeLocalPath);
};

const stripMarkdownCode = (contents: string): string => {
  const visibleLines: string[] = [];
  let fenceMarker: string | undefined;

  for (const line of contents.replace(/\r\n/g, '\n').split('\n')) {
    const fence = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
    if (fence) {
      if (!fenceMarker) {
        fenceMarker = fence[0];
      } else if (fence[0] === fenceMarker) {
        fenceMarker = undefined;
      }
      continue;
    }
    if (!fenceMarker) visibleLines.push(line);
  }

  return visibleLines.join('\n').replace(/`[^`\n]*`/g, '');
};

const normalizeLocalReference = (reference: string): string | undefined => {
  let value = reference.trim();
  if (value.startsWith('<')) {
    const closingBracket = value.indexOf('>');
    value =
      closingBracket >= 0 ? value.slice(1, closingBracket) : value.slice(1);
  } else {
    value = value.split(/\s+(?=["'])/, 1)[0] ?? value;
  }

  if (
    !value ||
    value.startsWith('#') ||
    /^[a-z][a-z0-9+.-]*:/i.test(value) ||
    value.startsWith('//')
  ) {
    return undefined;
  }

  value = value.split('#', 1)[0]?.split('?', 1)[0] ?? '';
  if (!value) return undefined;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const looksLikeLocalPath = (value: string): boolean =>
  Boolean(
    value &&
      value.toLowerCase() !== 'none' &&
      value.toLowerCase() !== 'n/a' &&
      (value.includes('/') || /\.[a-z0-9]+(?:[#?].*)?$/i.test(value)),
  );

const extractDocumentTitle = (contents: string, path: string): string => {
  const heading = contents.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading ? stripMarkdownValue(heading) : humanize(basename(path, extname(path)));
};

const extractDocumentSummary = (contents: string): string | undefined => {
  const lines = contents.replace(/\r\n/g, '\n').split('\n');
  let inFrontmatter = lines[0]?.trim() === '---';
  let excludedSection = false;
  const paragraph: string[] = [];

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();
    if (inFrontmatter) {
      if (index > 0 && trimmed === '---') inFrontmatter = false;
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      if (paragraph.length > 0) break;
      excludedSection = ['metadata', 'changelog'].includes(
        heading[2].trim().toLowerCase(),
      );
      continue;
    }

    if (excludedSection) continue;
    if (!trimmed && paragraph.length > 0) break;
    if (
      !trimmed ||
      trimmed.startsWith('- ') ||
      trimmed === '---' ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('|') ||
      /^[A-Za-z][^:]+:\s/.test(trimmed)
    ) {
      continue;
    }
    paragraph.push(trimmed.replace(/^>\s*/, ''));
  }
  const summary = paragraph.join(' ').replace(/[`*_]/g, '').trim();
  return summary ? summary.slice(0, 240) : undefined;
};

const buildDocumentId = (path: string): string => {
  const slug = path
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80);
  const digest = createHash('sha256').update(path).digest('hex').slice(0, 8);
  return `doc-${slug}-${digest}`;
};

const stripMarkdownValue = (value: string): string =>
  value.trim().replace(/^`|`$/g, '').replace(/^['"]|['"]$/g, '');

const CANONICAL_DOCUMENT_ID_FIELDS = ['id'] as const;
const DISCOVERY_DOCUMENT_ID_FIELDS = [
  'id',
  'doc id',
  'decision id',
  'finding id',
  'plan id',
  'task id',
  'pattern id',
] as const;

const CANONICAL_PATTERN_KIND_FIELDS = ['kind'] as const;
const DISCOVERY_PATTERN_KIND_FIELDS = [
  'kind',
  'patternKind',
  'pattern kind',
  'patternkind',
] as const;
const CANONICAL_APPLIES_TO_FIELDS = ['appliesTo'] as const;
const DISCOVERY_APPLIES_TO_FIELDS = [
  'appliesTo',
  'appliesto',
  'applies to',
] as const;

const STRICT_METADATA_REQUIREMENTS = [
  { code: 'id', label: 'id', names: CANONICAL_DOCUMENT_ID_FIELDS },
  { code: 'owner', label: 'Owner', names: ['owner'] },
  { code: 'scope', label: 'Scope', names: ['scope'] },
  { code: 'role', label: 'Role', names: ['role'] },
  { code: 'lifecycle', label: 'Lifecycle', names: ['lifecycle'] },
  { code: 'authority', label: 'Authority', names: ['authority'] },
  { code: 'provenance', label: 'Provenance', names: ['provenance'] },
  { code: 'view', label: 'View', names: ['view'] },
] as const;

const DOCUMENT_ROLES = [
  'router',
  'overview',
  'architecture',
  'standard',
  'domain',
  'guide',
  'operation',
  'decision',
  'finding',
  'plan',
  'task',
  'pattern',
  'reference',
  'document',
] as const satisfies readonly SkoposDocumentRole[];

const ADOPTED_DOCUMENT_ROLES = DOCUMENT_ROLES.filter(
  (role): role is Exclude<SkoposDocumentRole, 'document'> => role !== 'document',
);

const DOCUMENT_LIFECYCLES = [
  'active',
  'durable',
  'historical',
  'dead',
] as const satisfies readonly SkoposDocumentLifecycle[];

const DOCUMENT_AUTHORITIES = [
  'canonical',
  'supporting',
  'generated',
] as const satisfies readonly SkoposDocumentAuthority[];

const DOCUMENT_PROVENANCE = [
  'declared',
  'accepted',
  'observed',
  'inferred',
  'proposed',
] as const satisfies readonly NonNullable<SkoposDocumentMetadata['provenance']>[];

const DOCUMENT_VIEWS = [
  'current',
  'target',
  'transition',
  'exception',
] as const satisfies readonly NonNullable<SkoposDocumentMetadata['view']>[];

const PATTERN_KINDS = [
  'preferred-pattern',
  'failure-pattern',
] as const satisfies readonly NonNullable<SkoposDocumentMetadata['patternKind']>[];

const FINDING_SEVERITIES = [
  'MUST',
  'SHOULD',
  'COULD',
] as const satisfies readonly SkoposFindingSeverity[];

const LEGACY_FRONTMATTER_FIELDS = new Set([
  'doc id',
  'docid',
  'decision id',
  'decisionid',
  'finding id',
  'findingid',
  'plan id',
  'planid',
  'task id',
  'taskid',
  'pattern id',
  'patternid',
  'pattern kind',
  'patternkind',
  'applies to',
  'appliesto',
]);

const readMetadataField = (
  fields: Map<string, string>,
  names: readonly string[],
): string | undefined => {
  for (const name of names) {
    const value = fields.get(name);
    if (value) return value;
  }
  return undefined;
};

const parseEnum = <TValue extends string>(
  value: string | undefined,
  allowedValues: readonly TValue[],
): TValue | undefined =>
  value
    ? allowedValues.find(
        (allowedValue) => allowedValue.toLowerCase() === value.toLowerCase(),
      )
    : undefined;

const parseList = (value: string | undefined): string[] | undefined => {
  if (!value) return undefined;
  const normalized = value.replace(/^\[|\]$/g, '');
  const entries = normalized
    .split(',')
    .map((entry) => stripMarkdownValue(entry))
    .filter(Boolean);
  return entries.length > 0 ? entries : undefined;
};

const parsePriority = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const priority = Number(value);
  return Number.isInteger(priority) && priority >= 0 && priority <= 100
    ? priority
    : undefined;
};

const collectDuplicateDocumentIdIssues = (
  documents: SkoposDocumentKnowledgeEntry[],
): {
  ids: Set<string>;
  issues: SkoposDocumentCatalogIssue[];
} => {
  const pathsById = new Map<string, string[]>();
  for (const document of documents) {
    const paths = pathsById.get(document.id) ?? [];
    paths.push(document.path);
    pathsById.set(document.id, paths);
  }

  const ids = new Set<string>();
  const issues: SkoposDocumentCatalogIssue[] = [];
  for (const [id, paths] of pathsById) {
    if (paths.length < 2) continue;
    ids.add(id);
    for (const path of paths) {
      issues.push({
        kind: 'metadata',
        code: 'duplicate-id',
        path,
        reference: id,
        summary: `Document id "${id}" is also declared by ${paths
          .filter((candidate) => candidate !== path)
          .join(', ')}.`,
      });
    }
  }

  return { ids, issues };
};

const normalizePath = (value: string): string =>
  value.replace(/\\/g, '/').replace(/^\.\//, '');

const humanize = (value: string): string =>
  value
    .replace(/[-_.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
