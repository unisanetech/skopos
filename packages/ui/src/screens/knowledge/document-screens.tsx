import * as React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';

import {
  DocumentSequenceActions,
  KnowledgeDecisionSummaryCard,
  KnowledgeDocumentArtifactCard,
  KnowledgeDocumentDetailInspectorAside,
  KnowledgeDocumentListCard,
  KnowledgeDocumentReaderCard,
  KnowledgeListInspectorAside,
} from '../../features/knowledge/documents/index.js';
import { SegmentedButton } from '../../components/ui/segmented-button.js';
import { ListPage } from '../../patterns/pages/list-page.js';
import { ReaderPage } from '../../patterns/pages/reader-page.js';
import { EmptyMessage, StatusPill } from '../../patterns/sections/inspector-primitives.js';
import { ContentSection, RouteFilterBar } from '../../patterns/sections/content-primitives.js';
import {
  filterProjectDocuments,
  getKnowledgeDocumentCollections,
  getKnowledgeDocumentDetailContext,
  type ProjectDocumentView,
} from '../../platform/console-state/knowledge-selectors.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import type { KnowledgeCategory } from '../../support/knowledge/document-routing.js';

export function DocsView(): React.JSX.Element {
  return (
    <DocumentListView
      category="docs"
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
      emptyTitle="Unknown issue"
      emptyDescription="Refresh the app after rebuilding Skopos state if the issues catalog changed."
    />
  );
}

function DocumentListView({
  category,
  view = 'all',
  title,
  description,
}: {
  category: KnowledgeCategory;
  view?: 'entries' | 'reference' | 'all';
  title: string;
  description: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const navigate = useNavigate();
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
            <SegmentedButton
              aria-label="Document view"
              size="sm"
              value={projectView}
              options={[
                { value: 'essentials', label: 'Essentials' },
                { value: 'work', label: 'Plans & tasks' },
                { value: 'other', label: 'Other' },
                { value: 'all', label: 'All' },
              ]}
              onValueChange={setProjectView}
            />
          </RouteFilterBar>
        ) : (
          <RouteFilterBar label="List view">
            <SegmentedButton
              aria-label="List view"
              size="sm"
              value={view}
              options={[
                { value: 'entries', label: 'Entries' },
                { value: 'reference', label: 'Reference' },
                { value: 'all', label: 'All' },
              ]}
              onValueChange={(nextView) =>
                void navigate({
                  to: category === 'decisions' ? '/decisions' : '/findings',
                  search: { view: nextView },
                })
              }
            />
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
    <ContentSection title="How to use this page" description={guidance.useCase}>
      <div className="grid gap-3 md:grid-cols-3">
        {guidance.points.map((point) => (
          <div key={point.label} className="border-t border-outline-weak pt-3">
            <p className="text-label-small uppercase text-on-surface-variant">
              {point.label}
            </p>
            <p className="mt-1 text-body-small text-on-surface">
              {point.text}
            </p>
          </div>
        ))}
      </div>
    </ContentSection>
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
  emptyTitle,
  emptyDescription,
}: {
  docId: string;
  category: KnowledgeCategory;
  emptyTitle: string;
  emptyDescription: string;
}): React.JSX.Element {
  const state = requireConsoleState();
  const { document, relatedLinks, previousDocument, nextDocument } =
    getKnowledgeDocumentDetailContext(state, category, docId);
  const readerSections = document?.sections.filter(
    (section) =>
      (section.kind === 'narrative' || section.kind === 'reference') &&
      !isPlaceholderSectionBody(section.body),
  );

  if (!document) {
    return (
      <ReaderPage
        title="Document not found"
        description={emptyDescription}
      >
        <EmptyMessage title={emptyTitle} description={emptyDescription} />
      </ReaderPage>
    );
  }

  const isDecision = category === 'decisions';
  const description = isPlaceholderSummary(document.summary)
    ? isDecision
      ? 'The accepted choice, its reasoning, and the constraints future work should preserve.'
      : document.excerpt
    : document.summary;

  return (
    <ReaderPage
      title={document.title}
      description={description}
      badges={[
        ...(!isDecision
          ? [<StatusPill key="format" value={document.format} tone="info" />]
          : []),
        ...(document.role
          ? [<StatusPill key="role" value={document.role} tone="neutral" />]
          : []),
        <StatusPill
          key="lifecycle"
          value={document.lifecycle}
          tone={document.lifecycle === 'active' ? 'positive' : 'neutral'}
        />,
        ...(!isDecision || !document.exists
          ? [
              <StatusPill
                key="availability"
                value={document.exists ? 'available' : 'missing'}
                tone={document.exists ? 'positive' : 'danger'}
              />,
            ]
          : []),
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
        <>
          {isDecision ? (
            <KnowledgeDecisionSummaryCard document={document} documents={state.documents} />
          ) : null}
          <ContentSection
            title={isDecision ? 'Full decision' : 'Document'}
            description={
              isDecision
                ? 'Read the complete source when you need implementation detail, alternatives, or history.'
                : 'Read the canonical source with its original structure and references.'
            }
          >
            <KnowledgeDocumentReaderCard
              document={document}
              documents={state.documents}
              sections={readerSections}
            />
          </ContentSection>
        </>
      )}
    </ReaderPage>
  );
}

const isPlaceholderSummary = (summary: string): boolean =>
  summary.trim().length === 0 ||
  summary.toLowerCase().includes('no additional detail provided') ||
  summary.toLowerCase() === 'markdown document.';

const isPlaceholderSectionBody = (body: string): boolean =>
  body.trim().toLowerCase() === 'no additional detail provided in this section.';
