import * as React from 'react';

import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import {
  Card,
  TrustCheckGroup,
} from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  ExternalLinkList,
  KeyValueList,
  SidebarCard,
  SidebarList,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { formatDateTime } from '../../support/formatting/console-formatting.js';
import { cn } from '../../support/ui/classnames.js';

export function TrustInspectorAside({
  checkCount,
  warningCount,
  failureCount,
  findingCount,
  generatedAt,
  sourceLinks,
  docsPostureItems,
  workspaceSignalItems,
  allChecks,
}: {
  checkCount: number;
  warningCount: number;
  failureCount: number;
  findingCount: number;
  generatedAt?: string;
  sourceLinks: SkoposUiConsoleState['docsLinks'];
  docsPostureItems: Array<{ label: string; value: string }>;
  workspaceSignalItems: Array<{ label: string; value: string }>;
  allChecks: SkoposUiConsoleState['trustReport']['checks'];
}): React.JSX.Element {
  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Checks', value: String(checkCount) },
            { label: 'Warnings', value: String(warningCount) },
            { label: 'Failures', value: String(failureCount) },
            { label: 'Findings', value: String(findingCount) },
            { label: 'Updated', value: formatDateTime(generatedAt) },
          ]}
        />
      </SidebarCard>
      {docsPostureItems.length > 0 ? (
        <SidebarCard
          title="Docs posture"
          badge={String(docsPostureItems.length)}
          collapsible
          defaultOpen={false}
        >
          <KeyValueList items={docsPostureItems} layout="stacked" />
        </SidebarCard>
      ) : null}
      {workspaceSignalItems.length > 0 ? (
        <SidebarCard
          title="Workspace signals"
          badge={String(workspaceSignalItems.length)}
          collapsible
          defaultOpen={false}
        >
          <KeyValueList items={workspaceSignalItems} layout="stacked" />
        </SidebarCard>
      ) : null}
      {allChecks.length > 0 ? (
        <SidebarCard
          title="Check inventory"
          badge={String(allChecks.length)}
          collapsible
          defaultOpen={false}
        >
          <SidebarList
            items={allChecks}
            getKey={(check) => check.id}
            renderItem={(check) => (
              <>
                <div className="flex items-center justify-between gap-2.5">
                  <p className="text-[12.5px] font-medium tracking-[-0.01em]">{check.id}</p>
                  <StatusPill
                    value={check.status}
                    tone={
                      check.status === 'pass'
                        ? 'positive'
                        : check.status === 'warn'
                          ? 'warning'
                          : 'danger'
                    }
                  />
                </div>
                <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
                  {check.summary}
                </p>
              </>
            )}
          emptyTitle="No checks"
          emptyDescription="No trust checks are available right now."
        />
        </SidebarCard>
      ) : null}
      {sourceLinks.length > 0 ? (
        <SidebarCard
          title="Source links"
          badge={String(sourceLinks.length)}
          collapsible
          defaultOpen={false}
        >
          <ExternalLinkList
            links={sourceLinks.slice(0, 4)}
            totalCount={sourceLinks.length}
            showPaths={false}
          />
        </SidebarCard>
      ) : null}
    </>
  );
}

export function TrustAttentionCard({
  failureChecks,
  warningChecks,
  findings,
  unresolvedAssumptions,
}: {
  failureChecks: SkoposUiConsoleState['trustReport']['checks'];
  warningChecks: SkoposUiConsoleState['trustReport']['checks'];
  findings: string[];
  unresolvedAssumptions: string[];
}): React.JSX.Element {
  return (
    <Card
      title="Attention lanes"
      description="Blocking checks, warnings, findings, and unresolved assumptions stay visible here."
    >
      <div className="grid gap-5">
        {failureChecks.length > 0 ? (
          <TrustCheckGroup title="Blocking checks" checks={failureChecks} tone="danger" />
        ) : null}
        {warningChecks.length > 0 ? (
          <TrustCheckGroup title="Warnings" checks={warningChecks} tone="warning" />
        ) : null}
        {findings.length > 0 ? (
          <section className="grid gap-3">
            <p className="text-[13px] font-semibold tracking-[-0.02em]">Findings</p>
            <ul className="border-y border-[var(--line)]">
              {findings.map((finding, index) => (
                <li
                  key={finding}
                  className={cn(
                    'py-4 text-[13px] leading-6 text-[var(--muted-strong)]',
                    index > 0 ? 'border-t border-[var(--line)]' : undefined,
                  )}
                >
                  {finding}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {unresolvedAssumptions.length > 0 ? (
          <section className="grid gap-3">
            <p className="text-[13px] font-semibold tracking-[-0.02em]">
              Unresolved assumptions
            </p>
            <ul className="border-y border-[var(--line)]">
              {unresolvedAssumptions.map((assumption, index) => (
                <li
                  key={assumption}
                  className={cn(
                    'py-4 text-[13px] leading-6 text-[var(--muted-strong)]',
                    index > 0 ? 'border-t border-[var(--line)]' : undefined,
                  )}
                >
                  {assumption}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {failureChecks.length === 0 &&
        warningChecks.length === 0 &&
        findings.length === 0 &&
        unresolvedAssumptions.length === 0 ? (
          <EmptyMessage
            title="No blockers or warnings"
            description="No failure, warning, or unresolved-assumption pressure is active right now."
          />
        ) : null}
      </div>
    </Card>
  );
}
