import * as React from 'react';

import type {
  SkoposUiConsoleArtifactMetric,
  SkoposUiConsoleDocumentView,
  SkoposUiConsoleLink,
} from '../../../contracts/skopos-ui-console-state.js';
import {
  ExternalLinkList,
  KeyValueList,
  SidebarCard,
} from '../../../patterns/sections/inspector-primitives.js';
import { cn } from '../../../support/ui/classnames.js';
import {
  buildDocumentReaderEntries,
  observeActiveDocumentReaderEntry,
  scrollToDocumentReaderEntry,
} from '../../../support/knowledge/document-reader.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';

export function KnowledgeDocumentDetailInspectorAside({
  document,
  relatedLinks,
  sections,
}: {
  document: SkoposUiConsoleDocumentView;
  relatedLinks: SkoposUiConsoleLink[];
  sections: SkoposUiConsoleDocumentView['sections'];
}): React.JSX.Element {
  const artifactView = document.artifactView;
  const metadataSection = document.sections.find((section) => section.kind === 'metadata');
  const changelogSection = document.sections.find((section) => section.kind === 'changelog');
  const metadataItems = metadataSection ? parseMetadataSection(metadataSection.body) : [];
  const changelogEntries = changelogSection ? parseLineEntries(changelogSection.body) : [];
  const outlineEntries = React.useMemo(
    () => buildDocumentReaderEntries({ document, sections }).filter((entry) => !entry.hideHeading),
    [document, sections],
  );
  const [activeDomId, setActiveDomId] = React.useState(outlineEntries[0]?.domId);

  React.useEffect(() => {
    setActiveDomId(outlineEntries[0]?.domId);

    return observeActiveDocumentReaderEntry({
      ids: outlineEntries.map((entry) => entry.domId),
      onActive: setActiveDomId,
    });
  }, [outlineEntries]);

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={
            artifactView
              ? buildArtifactAtAGlanceItems({
                  metrics: artifactView.metrics,
                  updatedAt: document.updatedAt,
                  format: document.format,
                  exists: document.exists,
                })
              : buildReaderAtAGlanceItems({
                  updatedAt: document.updatedAt,
                  format: document.format,
                  exists: document.exists,
                  sectionCount: outlineEntries.length,
                })
          }
        />
      </SidebarCard>
      {metadataItems.length > 0 ? (
        <SidebarCard
          title="Metadata"
          badge={String(metadataItems.length)}
          collapsible
          defaultOpen={false}
        >
          <KeyValueList items={metadataItems} layout="stacked" />
        </SidebarCard>
      ) : null}
      {changelogEntries.length > 0 ? (
        <SidebarCard
          title="Changelog"
          badge={String(changelogEntries.length)}
          collapsible
          defaultOpen={false}
        >
          <ul className="border-y border-[var(--line)]">
            {changelogEntries.map((entry, index) => (
              <li
                key={`${entry}-${index}`}
                className={cn('py-3.5', index > 0 ? 'border-t border-[var(--line)]' : undefined)}
              >
                <p className="skopos-helper-copy">{entry}</p>
              </li>
            ))}
          </ul>
        </SidebarCard>
      ) : null}
      {!artifactView && outlineEntries.length > 1 ? (
        <SidebarCard
          title="Outline"
          badge={String(outlineEntries.length)}
          collapsible
          defaultOpen
        >
          <ul className="border-y border-[var(--line)]">
            {outlineEntries.map(({ section, domId }, index) => (
              <li
                key={domId}
                className={cn('py-2.5', index > 0 ? 'border-t border-[var(--line)]' : undefined)}
              >
                <button
                  type="button"
                  onClick={() => scrollToDocumentReaderEntry(domId)}
                  className={cn(
                    'skopos-outline-link w-full text-left transition-colors hover:text-[var(--ink)]',
                    activeDomId === domId ? 'skopos-outline-link-active' : undefined,
                    section.level <= 1
                      ? 'pl-0'
                      : section.level === 2
                        ? 'pl-3'
                        : 'pl-6',
                  )}
                >
                  <span className="skopos-caption font-medium tracking-[-0.01em]">
                    {section.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </SidebarCard>
      ) : null}
      <SidebarCard
        title="Source links"
        badge={String(relatedLinks.length)}
        collapsible
        defaultOpen={artifactView ? true : false}
      >
        <ExternalLinkList links={relatedLinks} showPaths={false} />
      </SidebarCard>
    </>
  );
}

const stripInlineMarkdown = (value: string): string =>
  value.replace(/[`*_]/g, '').trim();

const parseMetadataSection = (
  body: string,
): Array<{ label: string; value: string; monospace?: boolean }> => {
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s+/, ''));

  const items: Array<{ label: string; value: string; monospace?: boolean }> = [];
  let current: { label: string; value: string; monospace?: boolean } | undefined;

  for (const line of lines) {
    const pairMatch = /^([^:]+):\s*(.*)$/.exec(line);

    if (pairMatch) {
      current = {
        label: stripInlineMarkdown(pairMatch[1]),
        value: stripInlineMarkdown(pairMatch[2]) || '—',
        monospace: /id|scope|path|config/i.test(pairMatch[1]),
      };
      items.push(current);
      continue;
    }

    if (current) {
      current.value =
        current.value === '—'
          ? stripInlineMarkdown(line)
          : `${current.value} · ${stripInlineMarkdown(line)}`;
    }
  }

  return items;
};

const parseLineEntries = (body: string): string[] =>
  body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))
    .map(stripInlineMarkdown);

const buildReaderAtAGlanceItems = ({
  updatedAt,
  format,
  exists,
  sectionCount,
}: {
  updatedAt?: string;
  format: SkoposUiConsoleDocumentView['format'];
  exists: boolean;
  sectionCount: number;
}): Array<{ label: string; value: string; monospace?: boolean }> => [
  { label: 'Format', value: format.toUpperCase() },
  { label: 'Availability', value: exists ? 'Available' : 'Missing' },
  ...(sectionCount > 0 ? [{ label: 'Reader sections', value: String(sectionCount) }] : []),
  { label: 'Updated', value: formatDateTime(updatedAt) },
];

const buildArtifactAtAGlanceItems = (
  {
    metrics,
    updatedAt,
    format,
    exists,
  }: {
    metrics: SkoposUiConsoleArtifactMetric[];
    updatedAt?: string;
    format: SkoposUiConsoleDocumentView['format'];
    exists: boolean;
  },
): Array<{ label: string; value: string; monospace?: boolean }> => [
  { label: 'Format', value: format.toUpperCase() },
  { label: 'Availability', value: exists ? 'Available' : 'Missing' },
  ...metrics.map((metric) => ({
    label: metric.label,
    value: metric.value,
    monospace: metric.monospace,
  })),
  { label: 'Updated', value: formatDateTime(updatedAt) },
];
