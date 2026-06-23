import type {
  SkoposUiConsoleDocumentSection,
  SkoposUiConsoleDocumentView,
} from '../../contracts/skopos-ui-console-state.js';

export interface DocumentReaderEntry {
  section: SkoposUiConsoleDocumentSection;
  domId: string;
  hideHeading: boolean;
}

export const buildDocumentReaderEntries = ({
  document,
  sections,
}: {
  document: SkoposUiConsoleDocumentView;
  sections?: SkoposUiConsoleDocumentSection[];
}): DocumentReaderEntry[] => {
  const visibleSections = sections ?? document.sections;

  return visibleSections.map((section, index) => ({
    section,
    domId: buildDocumentSectionDomId(document.id, section.id, section.title, index),
    hideHeading: shouldSuppressDocumentSectionHeading(section, document, index),
  }));
};

const buildDocumentSectionDomId = (
  documentId: string,
  sectionId: string,
  title: string,
  index: number,
): string => {
  const base = sanitizeForDomId(sectionId || title) || `section-${index + 1}`;
  return `skopos-doc-${sanitizeForDomId(documentId)}-${base}`;
};

const sanitizeForDomId = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const shouldSuppressDocumentSectionHeading = (
  section: SkoposUiConsoleDocumentSection,
  document: SkoposUiConsoleDocumentView,
  index: number,
): boolean => {
  if (index !== 0) {
    return false;
  }

  const normalizedTitle = section.title.trim().toLowerCase();
  const normalizedDocumentTitle = document.title.trim().toLowerCase();
  const normalizedBody = compactWhitespace(section.body);
  const normalizedSummary = compactWhitespace(document.summary);

  if (normalizedTitle === normalizedDocumentTitle || normalizedTitle === 'overview') {
    return true;
  }

  return normalizedBody === normalizedSummary;
};

const compactWhitespace = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();
