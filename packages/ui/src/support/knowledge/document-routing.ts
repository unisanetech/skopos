import type { SkoposUiConsoleDocumentView } from '../../contracts/skopos-ui-console-state.js';

export type KnowledgeCategory = 'docs' | 'decisions' | 'findings';
export type KnowledgeDocumentLifecycle = SkoposUiConsoleDocumentView['lifecycle'];

export const documentRouteForCategory = (
  category: KnowledgeCategory,
): '/docs/$docId' | '/decisions/$decisionId' | '/findings/$findingId' => {
  switch (category) {
    case 'decisions':
      return '/decisions/$decisionId';
    case 'findings':
      return '/findings/$findingId';
    default:
      return '/docs/$docId';
  }
};

export const documentParamsForCategory = (
  category: KnowledgeCategory,
  documentId: string,
): { docId: string } | { decisionId: string } | { findingId: string } => {
  switch (category) {
    case 'decisions':
      return { decisionId: documentId };
    case 'findings':
      return { findingId: documentId };
    default:
      return { docId: documentId };
  }
};

export const documentHrefForCategory = (
  category: KnowledgeCategory,
  documentId: string,
): string => {
  const encodedId = encodeURIComponent(documentId);

  switch (category) {
    case 'decisions':
      return `/decisions/${encodedId}`;
    case 'findings':
      return `/findings/${encodedId}`;
    default:
      return `/docs/${encodedId}`;
  }
};

export const knowledgeCategoryForDocument = (
  document: Pick<SkoposUiConsoleDocumentView, 'displayPath' | 'role' | 'lifecycle'>,
): KnowledgeCategory => {
  if (document.role === 'decision') {
    return 'decisions';
  }
  if (document.role === 'finding') {
    return 'findings';
  }
  return knowledgeCategoryForDisplayPath(document.displayPath);
};

export const knowledgeCategoryForDisplayPath = (displayPath: string): KnowledgeCategory => {
  const normalizedPath = normalizeDocumentPath(displayPath);

  if (hasPathSegment(normalizedPath, 'decisions')) {
    return 'decisions';
  }

  if (
    hasPathSegment(normalizedPath, 'findings') &&
    !hasPathSegment(normalizedPath, 'archive')
  ) {
    return 'findings';
  }

  return 'docs';
};

export const documentLifecycleForDisplayPath = (
  displayPath: string,
): KnowledgeDocumentLifecycle => {
  const normalizedPath = normalizeDocumentPath(displayPath);

  if (hasPathSegment(normalizedPath, 'archive')) {
    return 'historical';
  }

  if (
    normalizedPath.endsWith('/docs/00-start-here.md') ||
    normalizedPath === 'docs/00-start-here.md'
  ) {
    return 'active';
  }

  return 'durable';
};

export const isHistoricalDocumentPath = (displayPath: string): boolean =>
  documentLifecycleForDisplayPath(displayPath) === 'historical';

export const isDefaultActionDocumentPath = (displayPath: string): boolean =>
  documentLifecycleForDisplayPath(displayPath) !== 'historical';

export const resolveKnowledgeDocumentHref = ({
  documents,
  currentDisplayPath,
  href,
}: {
  documents: ReadonlyArray<SkoposUiConsoleDocumentView>;
  currentDisplayPath: string;
  href?: string;
}): string | undefined => {
  if (!href) {
    return href;
  }

  if (href.startsWith('#') || isExternalScheme(href)) {
    return href;
  }

  const path = stripHrefSuffix(href);

  if (!path) {
    return href;
  }

  const normalizedCurrentPath = normalizeDocumentPath(currentDisplayPath);
  const resolvedAbsolutePath = path.startsWith('/')
    ? normalizeDocumentPath(path)
    : normalizeDocumentPath(`${dirname(normalizedCurrentPath)}/${path}`);
  const normalizedRelativePath = normalizeDocumentPath(path);

  const matchedDocument =
    documents.find(
      (document) => normalizeDocumentPath(document.displayPath) === resolvedAbsolutePath,
    ) ??
    documents.find(
      (document) => normalizeDocumentPath(document.displayPath) === normalizedRelativePath,
    ) ??
    documents.find((document) =>
      normalizeDocumentPath(document.displayPath).endsWith(`/${trimLeadingSlash(normalizedRelativePath)}`),
    );

  if (!matchedDocument) {
    return href;
  }

  return documentHrefForCategory(
    knowledgeCategoryForDocument(matchedDocument),
    matchedDocument.id,
  );
};

const stripHrefSuffix = (href: string): string => {
  const queryOrHashIndex = href.search(/[?#]/);

  if (queryOrHashIndex === -1) {
    return href;
  }

  return href.slice(0, queryOrHashIndex);
};

const dirname = (value: string): string => {
  const normalized = normalizeDocumentPath(value);
  const lastSlashIndex = normalized.lastIndexOf('/');

  if (lastSlashIndex <= 0) {
    return normalized.startsWith('/') ? '/' : '.';
  }

  return normalized.slice(0, lastSlashIndex);
};

const trimLeadingSlash = (value: string): string =>
  value.startsWith('/') ? value.slice(1) : value;

const isExternalScheme = (href: string): boolean =>
  /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href) || href.startsWith('//');

const normalizeDocumentPath = (value: string): string => {
  const normalizedValue = value.replace(/\\/g, '/');
  const isAbsolute = normalizedValue.startsWith('/');
  const segments: string[] = [];

  for (const segment of normalizedValue.split('/')) {
    if (!segment || segment === '.') {
      continue;
    }

    if (segment === '..') {
      if (segments.length > 0 && segments[segments.length - 1] !== '..') {
        segments.pop();
      } else if (!isAbsolute) {
        segments.push(segment);
      }
      continue;
    }

    segments.push(segment);
  }

  return `${isAbsolute ? '/' : ''}${segments.join('/')}`;
};

const hasPathSegment = (value: string, target: string): boolean =>
  value
    .split('/')
    .filter(Boolean)
    .includes(target);
