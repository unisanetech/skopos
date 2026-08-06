import { access, readFile, readdir, stat } from 'node:fs/promises';
import { extname, isAbsolute, join, relative, resolve } from 'node:path';

import type {
  SkoposContentIndexArtifact,
  SkoposDocumentAuthority,
  SkoposDocumentKnowledgeEntry,
  SkoposDocumentLifecycle,
  SkoposDocumentRole,
} from '@skopos/model';

import type {
  SkoposUiConsoleDocumentFormat,
  SkoposUiConsoleDocumentView,
  SkoposUiConsoleLink,
  SkoposUiConsoleLinkKind,
} from '../../contracts/skopos-ui-console-state.js';
import { documentLifecycleForDisplayPath, isHistoricalDocumentPath } from '../../support/knowledge/document-routing.js';
import { buildJsonArtifactDocumentView } from './document-artifact-projections.js';

interface DocumentLinkSpec {
  id: string;
  title: string;
  path: string;
  kind: SkoposUiConsoleLinkKind;
  role?: SkoposDocumentRole;
  lifecycle?: SkoposDocumentLifecycle;
  authority?: SkoposDocumentAuthority;
  defaultVisible?: boolean;
  sourceId?: string;
  scope?: string;
}

export const buildDocsLinks = async ({
  workspaceRoot,
  outputDirectory,
  indexArtifact,
  linkMode = 'static',
  fileHrefBasePath = '/__skopos/file',
}: {
  workspaceRoot: string;
  outputDirectory: string;
  indexArtifact?: SkoposContentIndexArtifact;
  linkMode?: 'static' | 'dev-server';
  fileHrefBasePath?: string;
}): Promise<SkoposUiConsoleLink[]> => {
  const outputEntryPath = join(outputDirectory, 'index.html');
  const docsRootPath = resolveWorkspacePath(workspaceRoot, indexArtifact?.docsRoot ?? 'docs');
  const targets = [
    buildLinkSpec(
      'docs-start',
      'Docs start here',
      resolveWorkspacePath(
        workspaceRoot,
        indexArtifact?.quickLinks.docsStartHerePath ?? 'docs/00-start-here.md',
      ),
      'doc',
      {
        role: 'router',
        lifecycle: 'active',
        authority: 'canonical',
        defaultVisible: true,
        sourceId: 'docs',
      },
    ),
    buildLinkSpec('instructions', 'Canonical instructions', join(workspaceRoot, 'AGENTS.md'), 'instructions'),
    buildLinkSpec('config', 'Root config', join(workspaceRoot, 'skopos.config.yaml'), 'config'),
    buildLinkSpec('bootstrap', 'Bootstrap artifact', join(workspaceRoot, '.skopos', 'index', 'bootstrap.json'), 'artifact'),
    buildLinkSpec('diagnosis', 'Diagnosis artifact', join(workspaceRoot, '.skopos', 'index', 'diagnosis.json'), 'artifact'),
    buildLinkSpec('scopes-lite', 'Scopes artifact', join(workspaceRoot, '.skopos', 'index', 'scopes.json'), 'artifact'),
    buildLinkSpec(
      'architecture',
      'Architecture artifact',
      join(workspaceRoot, '.skopos', 'index', 'architecture.json'),
      'artifact',
    ),
    buildLinkSpec('knowledge-index', 'Knowledge index', join(workspaceRoot, '.skopos', 'index', 'memory.json'), 'artifact'),
    buildLinkSpec(
      'understanding-summary',
      'Repo understanding',
      join(workspaceRoot, '.skopos', 'index', 'understanding', 'repo-summary.json'),
      'artifact',
    ),
    buildLinkSpec(
      'understanding-features',
      'Feature inventory',
      join(workspaceRoot, '.skopos', 'index', 'understanding', 'feature-inventory.json'),
      'artifact',
    ),
    buildLinkSpec(
      'understanding-hotspots',
      'Implementation hotspots',
      join(workspaceRoot, '.skopos', 'index', 'understanding', 'hotspots.json'),
      'artifact',
    ),
    buildLinkSpec(
      'understanding-setup-review',
      'Setup review',
      join(workspaceRoot, '.skopos', 'index', 'understanding', 'setup-review.json'),
      'artifact',
    ),
    buildLinkSpec(
      'understanding-setup-answers',
      'Setup answers',
      join(workspaceRoot, '.skopos', 'index', 'understanding', 'setup-answers.json'),
      'artifact',
    ),
    buildLinkSpec('proof-report', 'Proof report', join(workspaceRoot, '.skopos', 'evidence', 'proof', 'latest-report.json'), 'report'),
    buildLinkSpec(
      'snapshot-portal',
      'Snapshot portal',
      join(workspaceRoot, '.skopos', 'ui', 'index.html'),
      'portal',
    ),
    buildLinkSpec(
      'graph-portal',
      'Graph portal',
      join(workspaceRoot, '.skopos', 'ui', 'graph-portal.html'),
      'portal',
    ),
  ];
  const discoveredDocs =
    indexArtifact?.documents && indexArtifact.documents.length > 0
      ? indexArtifact.documents.map((document) =>
          buildCatalogDocumentLinkSpec(document, workspaceRoot),
        )
      : await discoverMarkdownDocLinks({
          docsRootPath,
        });

  const links = await Promise.all(
    [...targets, ...discoveredDocs].map(async (target) => ({
      id: target.id,
      title: target.title,
      displayPath: target.path,
      href: buildLinkHref(outputEntryPath, target.path, linkMode, fileHrefBasePath),
      exists: await pathExists(target.path),
      kind: target.kind,
      role: target.role,
      lifecycle: target.lifecycle,
      authority: target.authority,
      defaultVisible: target.defaultVisible,
      sourceId: target.sourceId,
      scope: target.scope,
    })),
  );

  return dedupeLinks(links);
};

export const buildDocuments = async (
  links: SkoposUiConsoleLink[],
): Promise<SkoposUiConsoleDocumentView[]> =>
  Promise.all(
    links.map(async (link) => {
      const format = detectDocumentFormat(link.displayPath);
      const exists = link.exists;
      const updatedAt = exists ? await getUpdatedAt(link.displayPath) : undefined;

      if (!exists) {
        return {
          id: link.id,
          title: link.title,
          kind: link.kind,
          format,
          ...buildDocumentSemantics(link),
          href: link.href,
          displayPath: link.displayPath,
          exists,
          summary: 'This route is declared in the console, but the underlying file is currently missing.',
          excerpt: 'Missing file.',
          headings: [],
          sections: [],
          updatedAt,
        } satisfies SkoposUiConsoleDocumentView;
      }

      if (format === 'html') {
        return {
          id: link.id,
          title: link.title,
          kind: link.kind,
          format,
          ...buildDocumentSemantics(link),
          href: link.href,
          displayPath: link.displayPath,
          exists,
          summary: 'Rendered portal output. Open it directly for the interactive or snapshot experience.',
          excerpt: 'HTML portal output is available as an external surface.',
          headings: [],
          sections: [],
          updatedAt,
        } satisfies SkoposUiConsoleDocumentView;
      }

      const raw = await readTextDocument(link.displayPath);
      if (!raw) {
        return {
          id: link.id,
          title: link.title,
          kind: link.kind,
          format,
          ...buildDocumentSemantics(link),
          href: link.href,
          displayPath: link.displayPath,
          exists,
          summary: 'The file exists, but its contents could not be loaded into the compiled console state.',
          excerpt: 'Content unavailable.',
          headings: [],
          sections: [],
          updatedAt,
        } satisfies SkoposUiConsoleDocumentView;
      }

      return buildDocumentView(link, format, raw, updatedAt);
    }),
  );

const buildLinkSpec = (
  id: string,
  title: string,
  path: string,
  kind: SkoposUiConsoleLinkKind,
  semantics: Omit<
    DocumentLinkSpec,
    'id' | 'title' | 'path' | 'kind'
  > = {},
): DocumentLinkSpec => ({
  id,
  title,
  path,
  kind,
  ...semantics,
});

const buildDocumentView = (
  link: SkoposUiConsoleLink,
  format: SkoposUiConsoleDocumentFormat,
  raw: string,
  updatedAt?: string,
): SkoposUiConsoleDocumentView => {
  if (format === 'markdown') {
    return buildMarkdownDocumentView(link, raw, updatedAt);
  }

  if (format === 'json') {
    return {
      ...buildJsonArtifactDocumentView({
        link,
        raw,
        updatedAt,
      }),
      ...buildDocumentSemantics(link),
    };
  }

  const preview = compactWhitespace(raw).slice(0, 1200);
  const excerpt = preview.slice(0, 320);

  return {
    id: link.id,
    title: link.title,
    kind: link.kind,
    format,
    ...buildDocumentSemantics(link),
    href: link.href,
    displayPath: link.displayPath,
    exists: link.exists,
    summary:
      format === 'yaml'
        ? 'Configuration or action source exposed through the console.'
        : 'Text-based source surfaced for direct human inspection.',
    excerpt,
    headings: [],
    sections: [
      {
        id: `${link.id}-body`,
        title: 'Preview',
        body: preview,
        level: 1,
        kind: 'preview',
      },
    ],
    updatedAt,
  };
};

const buildMarkdownDocumentView = (
  link: SkoposUiConsoleLink,
  raw: string,
  updatedAt?: string,
): SkoposUiConsoleDocumentView => {
  const normalized = stripMarkdownFrontmatter(raw.replace(/\r\n/g, '\n'));
  const lines = normalized.split('\n');
  const sections: SkoposUiConsoleDocumentView['sections'] = [];
  let currentTitle = 'Overview';
  let currentLevel = 1;
  let currentLines: string[] = [];

  const flush = (): void => {
    const body = trimDocumentBlock(currentLines.join('\n'));
    if (!body && sections.length > 0) {
      currentLines = [];
      return;
    }

    sections.push({
      id: `${link.id}-section-${sections.length + 1}`,
      title: currentTitle,
      body: body || 'No additional detail provided in this section.',
      level: currentLevel,
      kind: classifyMarkdownSection(currentTitle),
    });
    currentLines = [];
  };

  for (const line of lines) {
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line.trim());
    if (headingMatch) {
      if (currentLines.length > 0) {
        flush();
      }
      currentLevel = headingMatch[1].length;
      currentTitle = stripMarkdownDecorators(headingMatch[2]);
      continue;
    }
    currentLines.push(line);
  }

  if (currentLines.length > 0 || sections.length === 0) {
    flush();
  }

  const sectionLimit = link.role === 'decision' ? 18 : link.role === 'finding' ? 12 : 8;
  const sanitizedSections = sections
    .map((section) => ({
      ...section,
      body: section.body.slice(0, 1200),
    }))
    .slice(0, sectionLimit);
  const headings = sanitizedSections.map((section) => section.title);
  const summarySource =
    sanitizedSections.find(
      (section) => section.body !== 'No additional detail provided in this section.',
    )?.body ?? compactWhitespace(normalized);

  return {
    id: link.id,
    title: headings[0] ?? link.title,
    kind: link.kind,
    format: 'markdown',
    ...buildDocumentSemantics(link),
    href: link.href,
    displayPath: link.displayPath,
    exists: link.exists,
    summary: compactWhitespace(summarySource).slice(0, 240) || 'Markdown document.',
    excerpt: compactWhitespace(normalized).slice(0, 320),
    headings,
    sections: sanitizedSections,
    updatedAt,
  };
};

const stripMarkdownFrontmatter = (source: string): string => {
  if (!source.startsWith('---\n')) {
    return source;
  }

  const closingBoundary = source.indexOf('\n---\n', 4);
  if (closingBoundary === -1) {
    return source;
  }

  return source.slice(closingBoundary + 5).replace(/^\n+/, '');
};

const buildCatalogDocumentLinkSpec = (
  document: SkoposDocumentKnowledgeEntry,
  workspaceRoot: string,
): DocumentLinkSpec =>
  buildLinkSpec(document.id, document.title, resolveWorkspacePath(workspaceRoot, document.path), 'doc', {
    role: document.role,
    lifecycle: document.lifecycle,
    authority: document.authority,
    defaultVisible: document.defaultVisible,
    sourceId: document.sourceId,
    scope: document.metadata?.scope,
  });

const buildDocumentSemantics = (
  link: SkoposUiConsoleLink,
): Pick<
  SkoposUiConsoleDocumentView,
  'lifecycle' | 'role' | 'authority' | 'defaultVisible' | 'sourceId' | 'scope'
> => ({
  lifecycle: link.lifecycle ?? documentLifecycleForDisplayPath(link.displayPath),
  role: link.role,
  authority: link.authority,
  defaultVisible: link.defaultVisible,
  sourceId: link.sourceId,
  scope: link.scope,
});

const classifyMarkdownSection = (
  title: string,
): SkoposUiConsoleDocumentView['sections'][number]['kind'] => {
  const normalized = title.trim().toLowerCase();

  if (normalized === 'metadata') {
    return 'metadata';
  }

  if (normalized === 'changelog') {
    return 'changelog';
  }

  if (
    normalized === 'references' ||
    normalized === 'reference' ||
    normalized === 'related docs' ||
    normalized === 'related links' ||
    normalized === 'links'
  ) {
    return 'reference';
  }

  return 'narrative';
};

const dedupeLinks = (links: SkoposUiConsoleLink[]): SkoposUiConsoleLink[] => {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.kind}:${link.displayPath}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const detectDocumentFormat = (filePath: string): SkoposUiConsoleDocumentFormat => {
  const extension = extname(filePath).toLowerCase();
  switch (extension) {
    case '.md':
      return 'markdown';
    case '.json':
    case '.jsonl':
      return 'json';
    case '.yaml':
    case '.yml':
      return 'yaml';
    case '.html':
      return 'html';
    case '.txt':
    case '.log':
      return 'text';
    default:
      return 'unknown';
  }
};

const discoverMarkdownDocLinks = async ({
  docsRootPath,
}: {
  docsRootPath: string;
}): Promise<DocumentLinkSpec[]> => {
  const markdownPaths = await collectMarkdownPaths(docsRootPath);

  return markdownPaths.map((documentPath) => {
    const relativeDocumentPath = relative(docsRootPath, documentPath).split('\\').join('/');
    return buildLinkSpec(
      `doc-${toDocumentSlug(relativeDocumentPath)}`,
      toDocumentLinkTitle(relativeDocumentPath),
      documentPath,
      'doc',
    );
  });
};

const collectMarkdownPaths = async (directoryPath: string): Promise<string[]> => {
  if (!(await pathExists(directoryPath))) {
    return [];
  }

  const results: string[] = [];
  const entries = await readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      if (shouldSkipDocsDirectory(entry.name, entryPath, directoryPath)) {
        continue;
      }
      results.push(...(await collectMarkdownPaths(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(entryPath);
    }
  }

  return results;
};

const shouldSkipDocsDirectory = (
  entryName: string,
  entryPath: string,
  docsRootPath: string,
): boolean => {
  const normalizedRelativePath = relative(docsRootPath, entryPath).split('\\').join('/');
  return (
    entryName === 'generated' ||
    entryName === 'node_modules' ||
    isHistoricalDocumentPath(normalizedRelativePath)
  );
};

const toDocumentSlug = (relativeDocumentPath: string): string =>
  relativeDocumentPath
    .replace(/\.md$/i, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const toDocumentLinkTitle = (relativeDocumentPath: string): string => {
  const withoutExtension = relativeDocumentPath.replace(/\.md$/i, '');
  const parts = withoutExtension.split('/');
  const leaf = parts.at(-1) ?? withoutExtension;

  if (leaf.toLowerCase() === 'readme' && parts.length > 1) {
    return `${humanizeDocSegment(parts.at(-2) ?? 'docs')} overview`;
  }

  if (leaf.toLowerCase() === 'registry' && parts.length > 1) {
    return `${humanizeDocSegment(parts.at(-2) ?? 'docs')} registry`;
  }

  return humanizeDocSegment(leaf);
};

const humanizeDocSegment = (value: string): string =>
  value
    .replace(/[-_.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const readTextDocument = async (artifactPath: string): Promise<string | undefined> => {
  try {
    return await readFile(artifactPath, 'utf8');
  } catch {
    return undefined;
  }
};

const resolveWorkspacePath = (workspaceRoot: string, targetPath: string): string =>
  isAbsolute(targetPath) ? targetPath : resolve(workspaceRoot, targetPath);

const getUpdatedAt = async (artifactPath: string): Promise<string | undefined> => {
  try {
    const fileStat = await stat(artifactPath);
    return fileStat.mtime.toISOString();
  } catch {
    return undefined;
  }
};

const toRelativeHref = (fromPath: string, targetPath: string): string => {
  const relativePath = relative(resolve(fromPath, '..'), targetPath).split('\\').join('/');
  if (relativePath.length === 0) {
    return './';
  }

  if (relativePath.startsWith('.')) {
    return relativePath;
  }

  return `./${relativePath}`;
};

const buildLinkHref = (
  outputEntryPath: string,
  targetPath: string,
  linkMode: 'static' | 'dev-server',
  fileHrefBasePath: string,
): string => {
  if (linkMode === 'dev-server') {
    return `${fileHrefBasePath}?path=${encodeURIComponent(targetPath)}`;
  }

  return toRelativeHref(outputEntryPath, targetPath);
};

const pathExists = async (artifactPath: string): Promise<boolean> => {
  try {
    await access(artifactPath);
    return true;
  } catch {
    return false;
  }
};

const compactWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const trimDocumentBlock = (value: string): string =>
  value
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

const stripMarkdownDecorators = (value: string): string =>
  value.replace(/[*_`[\]#>]/g, '').replace(/\(([^)]+)\)/g, '$1').trim();
