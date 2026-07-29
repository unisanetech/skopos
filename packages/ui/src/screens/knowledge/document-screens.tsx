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
import { Card, RouteFilterBar } from '../../patterns/sections/content-primitives.js';
import {
  filterProjectDocuments,
  getKnowledgeDocumentCollections,
  getKnowledgeDocumentDetailContext,
  type ProjectDocumentView,
} from '../../platform/console-state/knowledge-selectors.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import type { KnowledgeCategory } from '../../support/knowledge/document-routing.js';
import { filterChipClass } from '../../support/ui/filter-chip.js';

export function DocsView(): React.JSX.Element {
  return (
    <DocumentListView
      category="docs"
      kicker="Docs"
      title="Project handbook"
      description="The main documents that explain how this project is meant to work."
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
      kicker="Decisions"
      title="Why the project works this way"
      description="Important choices the team or agent should keep following."
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
      kicker="Issues"
      title="Tracked project issues"
      description="Problems, risks, and repeated friction that should not be forgotten."
    />
  );
}

export function FindingDetailView({ findingId }: { findingId: string }): React.JSX.Element {
  return (
    <DocumentDetailView
      docId={findingId}
      category="findings"
      kicker="Issue detail"
      emptyTitle="Unknown issue"
      emptyDescription="Refresh the app after rebuilding Skopos state if the issues catalog changed."
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
  const [projectView, setProjectView] = React.useState<ProjectDocumentView>('essentials');
  const visiblePrimaryDocuments =
    category === 'docs'
      ? filterProjectDocuments(primaryDocuments, projectView)
      : view === 'reference'
        ? []
        : primaryDocuments;
  const visibleReferenceDocuments = view === 'entries' ? [] : referenceDocuments;
  const guidance = getKnowledgeGuidance(category);

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
        category === 'docs' ? (
          <RouteFilterBar label="Document view">
            {([
              ['essentials', 'Essentials'],
              ['work', 'Plans & tasks'],
              ['other', 'Other'],
              ['all', 'All'],
            ] as const).map(([valueOption, label]) => (
              <button
                key={valueOption}
                type="button"
                onClick={() => setProjectView(valueOption)}
                className={filterChipClass(projectView === valueOption)}
              >
                {label}
              </button>
            ))}
          </RouteFilterBar>
        ) : (
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
        )
      }
    >
      <KnowledgeRouteGuidanceCard guidance={guidance} />
      <KnowledgeDocumentListCard
        title={guidance.listTitle}
        description={guidance.listDescription}
        documents={visiblePrimaryDocuments}
        category={category}
        emptyTitle={guidance.emptyTitle}
        emptyDescription={guidance.emptyDescription}
      />
      {visibleReferenceDocuments.length > 0 ? (
        <KnowledgeDocumentListCard
          title="Supporting references"
          description="Indexes and router documents that help Skopos organize this memory surface."
          documents={visibleReferenceDocuments}
          category={category}
          compact
          emptyTitle="No supporting references"
          emptyDescription="No supporting reference documents are available right now."
        />
      ) : null}
    </ListPage>
  );
}

function KnowledgeRouteGuidanceCard({
  guidance,
}: {
  guidance: KnowledgeRouteGuidance;
}): React.JSX.Element {
  return (
    <Card title="How to use this page" description={guidance.useCase}>
      <div className="grid gap-3 md:grid-cols-3">
        {guidance.points.map((point) => (
          <div key={point.label} className="border-t border-[var(--line)] pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {point.label}
            </p>
            <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]">
              {point.text}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

type KnowledgeRouteGuidance = {
  useCase: string;
  listTitle: string;
  listDescription: string;
  emptyTitle: string;
  emptyDescription: string;
  points: Array<{ label: string; text: string }>;
};

const getKnowledgeGuidance = (category: KnowledgeCategory): KnowledgeRouteGuidance => {
  if (category === 'decisions') {
    return {
      useCase: 'Read decisions when you need to understand why a pattern exists before changing it.',
      listTitle: 'Decision records',
      listDescription: 'Use these before changing architecture, action, policy, or product direction.',
      emptyTitle: 'No decisions recorded',
      emptyDescription:
        'No decision records are available yet. Add one when a choice should guide future work.',
      points: [
        { label: 'Use before', text: 'Refactors, architecture changes, new policies, or stack choices.' },
        { label: 'Look for', text: 'The accepted choice, the reason, and what should not be changed casually.' },
        { label: 'Update when', text: 'The project makes a new durable choice or replaces an old one.' },
      ],
    };
  }

  if (category === 'findings') {
    return {
      useCase: 'Use issues to keep important problems visible until they are fixed or intentionally closed.',
      listTitle: 'Tracked issues',
      listDescription: 'These are problems, risks, or repeated friction that can affect future work.',
      emptyTitle: 'No issues tracked',
      emptyDescription:
        'No tracked issues are available yet. Add one when a problem should not be lost in chat.',
      points: [
        { label: 'Use before', text: 'Touching risky code, closing work, or deciding what to fix next.' },
        { label: 'Look for', text: 'What is wrong, why it matters, owner or scope, and current status.' },
        { label: 'Update when', text: 'A problem is fixed, becomes worse, or changes the plan.' },
      ],
    };
  }

  return {
    useCase: 'Use docs to understand the project rules, setup, architecture, and operating model.',
    listTitle: 'Project documents',
    listDescription: 'Start here when you need the project handbook instead of raw generated state.',
    emptyTitle: 'No project documents found',
    emptyDescription:
      'No project documents are available yet. Build or refresh Skopos state after adding docs.',
    points: [
      { label: 'Use before', text: 'Starting work, onboarding to the repo, or checking project rules.' },
      { label: 'Look for', text: 'The current source of truth, command action, and package boundaries.' },
      { label: 'Update when', text: 'A rule, action, architecture decision, or setup step changes.' },
    ],
  };
};

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
        ...(document.role
          ? [<StatusPill key="role" value={document.role} tone="neutral" />]
          : []),
        <StatusPill
          key="lifecycle"
          value={document.lifecycle}
          tone={document.lifecycle === 'active' ? 'positive' : 'neutral'}
        />,
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
