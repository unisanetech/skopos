import * as React from 'react';

import type {
  SkoposUiConsoleArtifactEntry,
  SkoposUiConsoleArtifactSection,
  SkoposUiConsoleDocumentView,
} from '../../../contracts/skopos-ui-console-state.js';
import { HighlightedCodeBlock } from '../../../support/ui/code-highlighting.js';
import { cn } from '../../../support/ui/classnames.js';
import { Card } from '../../../patterns/sections/content-primitives.js';
import { EmptyMessage, StatusPill } from '../../../patterns/sections/inspector-primitives.js';

export function KnowledgeDocumentArtifactCard({
  document,
}: {
  document: SkoposUiConsoleDocumentView;
}): React.JSX.Element {
  const artifactView = document.artifactView;

  if (!artifactView || artifactView.sections.length === 0) {
    return (
      <EmptyMessage
        title="No structured artifact view"
        description="This JSON artifact is available through source links, but no structured presentation was generated."
      />
    );
  }

  return (
    <div className="skopos-artifact-canvas">
      {artifactView.sections.map((section) => (
        <Card
          key={section.id}
          title={section.title}
          description={section.description ?? 'Structured artifact section.'}
        >
          <ArtifactSectionBody section={section} />
        </Card>
      ))}
    </div>
  );
}

function ArtifactSectionBody({
  section,
}: {
  section: SkoposUiConsoleArtifactSection;
}): React.JSX.Element | null {
  switch (section.layout) {
    case 'key-value':
      return section.items && section.items.length > 0 ? (
        <dl className="skopos-artifact-kv">
          {section.items.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                'skopos-artifact-kv-row',
                index > 0 ? 'border-t border-[var(--line)]' : undefined,
              )}
            >
              <dt className="skopos-artifact-kv-label">{item.label}</dt>
              <dd
                className={cn(
                  item.monospace ? 'skopos-mono-caption' : 'skopos-artifact-kv-value',
                )}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null;
    case 'entries':
      return section.entries && section.entries.length > 0 ? (
        <ul className="border-y border-[var(--line)]">
          {section.entries.map((entry, index) => (
            <li
              key={`${section.id}-${entry.title}-${index}`}
              className={cn(
                'py-3.5',
                index > 0 ? 'border-t border-[var(--line)]' : undefined,
              )}
            >
              <ArtifactEntryRow entry={entry} />
            </li>
          ))}
        </ul>
      ) : null;
    case 'list':
      return section.listItems && section.listItems.length > 0 ? (
        <ul className="skopos-artifact-list">
          {section.listItems.map((item, index) => (
            <li key={`${section.id}-${index}`} className="skopos-helper-copy">
              {item}
            </li>
          ))}
        </ul>
      ) : null;
    case 'table':
      return section.table && section.table.rows.length > 0 ? (
        <div className="skopos-artifact-table-wrap">
          <table className="skopos-artifact-table">
            <thead>
              <tr>
                {section.table.columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, rowIndex) => (
                <tr key={`${section.id}-${rowIndex}`}>
                  {row.map((value, cellIndex) => (
                    <td key={`${section.id}-${rowIndex}-${cellIndex}`}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null;
    case 'json':
      return section.code ? (
        <details className="skopos-artifact-raw" open={section.defaultExpanded}>
          <summary className="skopos-artifact-raw-summary">Open raw JSON</summary>
          <div className="pt-3">
            <HighlightedCodeBlock code={section.code} language="json" />
          </div>
        </details>
      ) : null;
    default:
      return null;
  }
}

function ArtifactEntryRow({
  entry,
}: {
  entry: SkoposUiConsoleArtifactEntry;
}): React.JSX.Element {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-[14px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
          {entry.title}
        </p>
        {entry.badge ? <StatusPill value={entry.badge} tone={entry.tone ?? 'neutral'} /> : null}
      </div>
      {entry.summary ? <p className="skopos-helper-copy mt-1.5">{entry.summary}</p> : null}
      {entry.meta ? <p className="skopos-caption-muted mt-1.5">{entry.meta}</p> : null}
    </div>
  );
}
