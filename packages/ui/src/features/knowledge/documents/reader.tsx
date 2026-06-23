import * as React from 'react';

import type { SkoposUiConsoleDocumentView } from '../../../contracts/skopos-ui-console-state.js';
import { DocumentBody } from '../../../patterns/sections/content-primitives.js';
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
        <h3 className="skopos-section-title">No reader sections</h3>
        <p className="skopos-helper-copy">
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
              index > 0 ? 'border-t border-[var(--line)]' : undefined,
            )}
          >
            {!hideHeading ? (
              <div className="flex items-start justify-between gap-3">
                <HeadingTag
                  className={cn(
                    section.level <= 1
                      ? 'skopos-reader-heading-lg'
                      : section.level === 2
                        ? 'skopos-reader-heading-md'
                        : 'skopos-reader-heading-sm',
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
