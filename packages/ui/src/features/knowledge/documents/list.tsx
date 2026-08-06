import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposUiConsoleDocumentView } from '../../../contracts/skopos-ui-console-state.js';
import type { KnowledgeCategory } from '../../../support/knowledge/document-routing.js';
import {
  ContentSection,
  getSkoposListRowClass,
  skoposListSurfaceClass,
} from '../../../patterns/sections/content-primitives.js';
import { EmptyMessage, StatusPill } from '../../../patterns/sections/inspector-primitives.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';
import { cn } from '../../../support/ui/classnames.js';
import {
  documentParamsForCategory,
  documentRouteForCategory,
} from '../../../support/knowledge/document-routing.js';

export function KnowledgeDocumentListCard({
  title,
  description,
  documents,
  category,
  compact = false,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description: string;
  documents: SkoposUiConsoleDocumentView[];
  category: KnowledgeCategory;
  compact?: boolean;
  emptyTitle: string;
  emptyDescription: string;
}): React.JSX.Element {
  return (
    <ContentSection title={title} description={description}>
      {documents.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {documents.map((document, index) => (
            <Link
              key={document.id}
              to={documentRouteForCategory(category)}
              params={documentParamsForCategory(category, document.id)}
              className={getSkoposListRowClass({ compact, bordered: index > 0 })}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill value={document.format} tone="info" />
                  {document.role ? <StatusPill value={document.role} tone="neutral" /> : null}
                  {document.lifecycle !== 'durable' ? (
                    <StatusPill
                      value={document.lifecycle}
                      tone={document.lifecycle === 'active' ? 'positive' : 'warning'}
                    />
                  ) : null}
                  {!document.exists ? <StatusPill value="missing" tone="danger" /> : null}
                </div>
                <p
                  className={cn(
                    compact
                      ? 'mt-1.5 text-body-medium font-medium'
                      : 'mt-2 text-title-small',
                  )}
                >
                  {document.title}
                </p>
                <p
                  className={cn(
                    compact
                      ? 'mt-1 text-body-small text-on-surface-variant'
                      : 'mt-1 text-body-small text-on-surface-variant',
                  )}
                >
                  {document.summary}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-body-small text-on-surface-variant">
                  <span>{formatDateTime(document.updatedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage title={emptyTitle} description={emptyDescription} />
      )}
    </ContentSection>
  );
}
