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
            { label: 'Issues', value: String(findingCount) },
            { label: 'Updated', value: formatDateTime(generatedAt) },
          ]}
        />
      </SidebarCard>
      {docsPostureItems.length > 0 ? (
        <SidebarCard
          title="Docs health"
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
          title="All checks"
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
          emptyDescription="No readiness checks are available right now."
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

export function TrustGuidanceCard({
  failureCount,
  warningCount,
  findingCount,
}: {
  failureCount: number;
  warningCount: number;
  findingCount: number;
}): React.JSX.Element {
  const hasAttention = failureCount > 0 || warningCount > 0 || findingCount > 0;

  return (
    <Card
      title="How to use this page"
      description="Readiness tells you whether Skopos sees anything that should block or slow down the current work."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Start here"
          text={
            hasAttention
              ? 'Review the warning or failure items before closing work.'
              : 'No blocking readiness items are active right now.'
          }
        />
        <GuidancePoint
          label="Use when"
          text="You need to know if project state, docs, policy, and workflow checks are safe enough to continue."
        />
        <GuidancePoint
          label="Next step"
          text={
            hasAttention
              ? 'Fix the listed items, refresh Skopos state, then check this page again.'
              : 'Continue the active mission and use Evidence when closure needs test proof.'
          }
        />
      </div>
    </Card>
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
      title="Items that need attention"
      description="Fix failures first, then review warnings, tracked issues, and unresolved assumptions."
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
            <p className="text-[13px] font-semibold tracking-[-0.02em]">Issues</p>
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
            description="Skopos is not reporting readiness problems that need attention before continuing."
          />
        ) : null}
      </div>
    </Card>
  );
}

function GuidancePoint({
  label,
  text,
}: {
  label: string;
  text: string;
}): React.JSX.Element {
  return (
    <div className="border-t border-[var(--line)] pt-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]">
        {text}
      </p>
    </div>
  );
}
