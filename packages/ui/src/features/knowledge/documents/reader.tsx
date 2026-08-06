import * as React from 'react';

import type { SkoposUiConsoleDocumentView } from '../../../contracts/skopos-ui-console-state.js';
import { ContentSection, DocumentBody } from '../../../patterns/sections/content-primitives.js';
import { cn } from '../../../support/ui/classnames.js';
import {
  buildDocumentReaderEntries,
  scrollToDocumentReaderEntry,
} from '../../../support/knowledge/document-reader.js';
import { resolveKnowledgeDocumentHref } from '../../../support/knowledge/document-routing.js';

export function KnowledgeDocumentReaderCard({
  document,
  sections,
  documents,
}: {
  document: SkoposUiConsoleDocumentView;
  sections?: SkoposUiConsoleDocumentView['sections'];
  documents: SkoposUiConsoleDocumentView[];
}): React.JSX.Element {
  const readerEntries = buildDocumentReaderEntries({
    document,
    sections: sections ?? document.sections,
  });

  if (readerEntries.length === 0) {
    return (
      <div className="skopos-empty-message">
        <h3 className="text-title-medium text-on-surface">No reader sections</h3>
        <p className="text-body-medium text-on-surface-variant">
          This file is currently exposed through metadata and source linking rather than sectioned
          content.
        </p>
      </div>
    );
  }

  return (
    <div className="skopos-reader-canvas">
      {readerEntries.map(({ section, domId, hideHeading }, index) => {
        const HeadingTag = section.level <= 1 ? 'h2' : section.level === 2 ? 'h3' : 'h4';

        return (
          <section
            key={section.id}
            id={domId}
            data-skopos-doc-section={domId}
            className={cn(
              'scroll-mt-4 py-5',
              index > 0 ? 'border-t border-outline-weak' : undefined,
            )}
          >
            {!hideHeading ? (
              <div className="flex items-start justify-between gap-3">
                <HeadingTag
                  className={cn(
                    section.level <= 1
                      ? 'text-headline-small text-on-surface'
                      : section.level === 2
                        ? 'text-title-large text-on-surface'
                        : 'text-title-medium text-on-surface',
                  )}
                >
                  {section.title}
                </HeadingTag>
                <button
                  type="button"
                  onClick={() => scrollToDocumentReaderEntry(domId)}
                  className="skopos-reader-anchor"
                  aria-label={`Jump to ${section.title}`}
                  title={`Jump to ${section.title}`}
                >
                  #
                </button>
              </div>
            ) : null}
            <DocumentBody
              body={section.body}
              resolveHref={(href) =>
                resolveKnowledgeDocumentHref({
                  documents,
                  currentDisplayPath: document.displayPath,
                  href,
                })
              }
            />
          </section>
        );
      })}
    </div>
  );
}

export function KnowledgeDecisionSummaryCard({
  document,
  documents,
}: {
  document: SkoposUiConsoleDocumentView;
  documents: SkoposUiConsoleDocumentView[];
}): React.JSX.Element | null {
  const sections = document.sections.filter((section) => section.kind === 'narrative');
  const decisionIndex = sections.findIndex((section) => normalizeTitle(section.title) === 'decision');
  const contextIndex = sections.findIndex((section) => normalizeTitle(section.title) === 'context');
  const consequenceIndex = sections.findIndex(
    (section) => normalizeTitle(section.title) === 'consequences',
  );
  const context = sections.find((section) => normalizeTitle(section.title) === 'context');
  const consequences = consequenceIndex >= 0 ? sections[consequenceIndex] : undefined;
  const commitmentStartIndex = decisionIndex >= 0 ? decisionIndex + 1 : contextIndex + 1;
  const commitmentParentLevel =
    decisionIndex >= 0 ? sections[decisionIndex].level : context?.level ?? 2;
  const commitments = sections
    .slice(commitmentStartIndex, consequenceIndex >= 0 ? consequenceIndex : undefined)
    .filter((section) => section.level > commitmentParentLevel);
  const primaryCommitment = commitments[0];

  if (!primaryCommitment && !context && !consequences) {
    return null;
  }

  const resolveHref = (href: string): string | undefined =>
    resolveKnowledgeDocumentHref({
      documents,
      currentDisplayPath: document.displayPath,
      href,
    });

  return (
    <ContentSection
      title="Decision at a glance"
      description="The accepted direction, why it was chosen, and what future work must preserve."
    >
      {primaryCommitment ? (
        <section className="border-y border-outline-weak py-4">
          <p className="text-label-small uppercase text-on-surface-variant">
            Accepted direction
          </p>
          <h2 className="mt-1.5 text-title-large text-on-surface">{primaryCommitment.title}</h2>
          <DocumentBody body={primaryCommitment.body} resolveHref={resolveHref} />
        </section>
      ) : null}
      <div className="grid gap-5 py-4 md:grid-cols-2">
        {context ? (
          <section>
            <p className="text-label-small uppercase text-on-surface-variant">
              Why this was needed
            </p>
            <DocumentBody body={context.body} resolveHref={resolveHref} />
          </section>
        ) : null}
        {consequences ? (
          <section>
            <p className="text-label-small uppercase text-on-surface-variant">
              What this changes
            </p>
            <DocumentBody body={consequences.body} resolveHref={resolveHref} />
          </section>
        ) : null}
      </div>
      {commitments.length > 1 ? (
        <details className="border-t border-outline-weak pt-4">
          <summary className="cursor-pointer text-body-medium font-medium text-on-surface">
            {commitments.length - 1} more accepted commitment
            {commitments.length === 2 ? '' : 's'}
          </summary>
          <ul className="mt-3 grid gap-2 pl-4 text-body-small text-on-surface-variant">
            {commitments.slice(1).map((section) => (
              <li key={section.id}>{section.title}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </ContentSection>
  );
}

const normalizeTitle = (value: string): string => value.trim().toLowerCase();
