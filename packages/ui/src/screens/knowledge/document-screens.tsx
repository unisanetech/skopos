import * as React from 'react';
import { Link } from '@tanstack/react-router';

import {
  DocumentSequenceActions,
  KnowledgeDocumentArtifactCard,
  KnowledgeDocumentDetailInspectorAside,
  KnowledgeDocumentListCard,
  KnowledgeDocumentReaderCard,
  KnowledgeListInspectorAside,
} from '../../features/knowledge/documents/index.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { ReaderPage } from '../../patterns/pages/reader-page.js';
import { EmptyMessage, StatusPill } from '../../patterns/sections/inspector-primitives.js';
import { RouteFilterBar } from '../../patterns/sections/content-primitives.js';
import {
  getKnowledgeDocumentCollections,
  getKnowledgeDocumentDetailContext,
} from '../../platform/console-state/knowledge-selectors.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import type { KnowledgeCategory } from '../../support/knowledge/document-routing.js';
import { filterChipClass } from '../../support/ui/filter-chip.js';

export function DocsView(): React.JSX.Element {
  return (
    <DocumentListView
      category="docs"
      kicker="Knowledge routes"
      title="Canonical docs"
      description="Project docs, config references, and generated knowledge surfaces."
    />
  );
}

export function DocsDetailView({ docId }: { docId: string }): React.JSX.Element {
  return (
    <DocumentDetailView
      docId={docId}
      category="docs"
      kicker="Docs detail"
      emptyTitle="Unknown document"
      emptyDescription="Refresh the app after rebuilding Skopos state if the docs catalog changed."
    />
  );
}

export function DecisionDetailView({ decisionId }: { decisionId: string }): React.JSX.Element {
  return (
    <DocumentDetailView
      docId={decisionId}
      category="decisions"
      kicker="Decision detail"
      emptyTitle="Unknown decision"
      emptyDescription="Refresh the app after rebuilding Skopos state if the decision catalog changed."
    />
  );
}

export function DecisionsView({
  search,
}: {
  search: { view: 'entries' | 'reference' | 'all' };
}): React.JSX.Element {
  return (
    <DocumentListView
      category="decisions"
      view={search.view}
      kicker="Decision log"
      title="Architecture and product decisions"
      description="Accepted and active decisions for this workspace."
    />
  );
}

export function FindingsView({
  search,
}: {
  search: { view: 'entries' | 'reference' | 'all' };
}): React.JSX.Element {
  return (
    <DocumentListView
      category="findings"
      view={search.view}
      kicker="Findings"
      title="Active findings and registry"
      description="High-impact findings and the current findings registry."
    />
  );
}

export function FindingDetailView({ findingId }: { findingId: string }): React.JSX.Element {
  return (
    <DocumentDetailView
      docId={findingId}
      category="findings"
      kicker="Finding detail"
      emptyTitle="Unknown finding"
      emptyDescription="Refresh the app after rebuilding Skopos state if the findings catalog changed."
    />
  );
}

function DocumentListView({
  category,
  view = 'all',
  kicker,
  title,
  description,
}: {
  category: KnowledgeCategory;
  view?: 'entries' | 'reference' | 'all';
  kicker: string;
  title: string;
  description: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const { primaryDocuments, referenceDocuments, latestDocument } =
    getKnowledgeDocumentCollections(state, category);
  const visiblePrimaryDocuments = view === 'reference' ? [] : primaryDocuments;
  const visibleReferenceDocuments = view === 'entries' ? [] : referenceDocuments;
  const listTitle =
    category === 'docs'
      ? 'Document list'
      : category === 'decisions'
        ? 'Decision list'
        : 'Finding list';
  const listDescription =
    category === 'docs'
      ? 'Primary project docs in the current knowledge catalog.'
      : category === 'decisions'
        ? 'Decision records in the current knowledge catalog.'
        : 'Active findings in the current knowledge catalog.';

  return (
    <ListPage
      kicker={kicker}
      title={title}
      description={description}
      aside={
        <KnowledgeListInspectorAside
          primaryCount={primaryDocuments.length}
          referenceCount={referenceDocuments.length}
          availableCount={primaryDocuments.filter((document) => document.exists).length}
          updatedAt={latestDocument?.updatedAt}
          primaryLabel={category === 'docs' ? 'Documents' : 'Entries'}
        />
      }
      filters={
        category !== 'docs' ? (
          <RouteFilterBar label="List view">
            {([
              ['entries', 'Entries'],
              ['reference', 'Reference'],
              ['all', 'All'],
            ] as const).map(([valueOption, label]) => (
              <Link
                key={valueOption}
                to={category === 'decisions' ? '/decisions' : '/findings'}
                search={{ view: valueOption }}
                className={filterChipClass(view === valueOption)}
              >
                {label}
              </Link>
            ))}
          </RouteFilterBar>
        ) : null
      }
    >
      <KnowledgeDocumentListCard
        title={listTitle}
        description={listDescription}
        documents={visiblePrimaryDocuments}
        category={category}
        emptyTitle="No documents available"
        emptyDescription="No routed knowledge documents are available in this category right now."
      />
      {visibleReferenceDocuments.length > 0 ? (
        <KnowledgeDocumentListCard
          title="Reference docs"
          description="Collection indexes and routers."
          documents={visibleReferenceDocuments}
          category={category}
          compact
          emptyTitle="No reference docs"
          emptyDescription="No reference knowledge documents are available right now."
        />
      ) : null}
    </ListPage>
  );
}

function DocumentDetailView({
  docId,
  category,
  kicker,
  emptyTitle,
  emptyDescription,
}: {
  docId: string;
  category: KnowledgeCategory;
  kicker: string;
  emptyTitle: string;
  emptyDescription: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const { document, relatedLinks, previousDocument, nextDocument } =
    getKnowledgeDocumentDetailContext(state, category, docId);
  const readerSections = document?.sections.filter(
    (section) => section.kind === 'narrative' || section.kind === 'reference',
  );

  if (!document) {
    return (
      <ReaderPage
        kicker={kicker}
        title="Document not found"
        description={emptyDescription}
      >
        <EmptyMessage title={emptyTitle} description={emptyDescription} />
      </ReaderPage>
    );
  }

  return (
    <ReaderPage
      kicker={kicker}
      title={document.title}
      description={document.summary}
      badges={[
        <StatusPill key="format" value={document.format} tone="info" />,
        <StatusPill
          key="availability"
          value={document.exists ? 'available' : 'missing'}
          tone={document.exists ? 'positive' : 'danger'}
        />,
      ]}
      headerActions={
        <DocumentSequenceActions
          previousDocument={previousDocument}
          nextDocument={nextDocument}
          category={category}
        />
      }
      aside={
        <KnowledgeDocumentDetailInspectorAside
          document={document}
          relatedLinks={relatedLinks}
          sections={readerSections ?? []}
        />
      }
    >
      {document.artifactView ? (
        <KnowledgeDocumentArtifactCard document={document} />
      ) : (
        <KnowledgeDocumentReaderCard
          document={document}
          documents={state.documents}
          sections={readerSections}
        />
      )}
    </ReaderPage>
  );
}
