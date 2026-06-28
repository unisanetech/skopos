import * as React from 'react';

import { ListPage } from '../../patterns/pages/list-page.js';
import { Card, MetricGrid, getSkoposListRowClass } from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { requireConsoleState } from '../../platform/console-state/access.js';
import { cn } from '../../support/ui/classnames.js';
import type {
  SkoposUiConsoleMemoryView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';

type MemoryRole = NonNullable<SkoposUiConsoleState['memoryView']>['memory']['roles'][number];
type MemorySuggestion =
  NonNullable<SkoposUiConsoleState['memoryView']>['memory']['suggestions'][number];

export function MemoryView(): React.JSX.Element {
  const state = requireConsoleState();
  const memoryView = state.memoryView;

  if (!memoryView) {
    return (
      <ListPage
        kicker="Project Knowledge"
        title="What Skopos knows"
        description="The project truth Skopos found before agents start work."
        aside={<MemoryMissingAside />}
      >
        <EmptyMessage
          title="Project knowledge is not available"
          description="Run skopos init or skopos trust to generate the project knowledge view for this workspace."
        />
      </ListPage>
    );
  }

  const mappedRoles = memoryView.memory.roles.filter((role) => role.status === 'mapped');
  const reviewRoles = memoryView.memory.roles.filter((role) => role.status === 'needs-review');
  const missingRoles = memoryView.memory.roles.filter((role) => role.status === 'missing');
  const staleRoles = memoryView.memory.roles.filter((role) => role.status === 'stale');
  const needsAttention = [...missingRoles, ...reviewRoles, ...staleRoles];

  return (
    <ListPage
      kicker="Project Knowledge"
      title="What Skopos knows"
      description="The sources Skopos uses as project truth, what is ready, and what still needs review."
      aside={<MemoryInspectorAside memoryView={memoryView} />}
    >
      <MemoryIntroCard memoryView={memoryView} />
      <MetricGrid
        items={[
          {
            label: 'Known areas',
            value: `${mappedRoles.length}/${memoryView.memory.roles.length}`,
            helper: 'Project areas with a clear source.',
          },
          {
            label: 'Needs attention',
            value: needsAttention.length,
            helper: 'Areas missing, stale, or needing review.',
          },
          {
            label: 'Suggestions',
            value: memoryView.memory.suggestions.length,
            helper: 'Possible docs or instruction improvements.',
          },
          {
            label: 'Agent guide',
            value: memoryView.communicationBrief ? 'Ready' : 'Missing',
            helper: 'How coding agents should explain work.',
          },
          {
            label: 'Freshness',
            value: memoryView.memory.freshness,
            helper: 'Whether project knowledge looks current.',
          },
        ]}
      />
      {needsAttention.length > 0 ? (
        <MemoryAttentionCard roles={needsAttention} suggestions={memoryView.memory.suggestions} />
      ) : (
        <Card
          title="No knowledge gaps"
          description="All tracked project knowledge areas are mapped. Keep this current when project truth changes."
        >
          <p className="skopos-helper-copy">
            Skopos can now give agents a compact guide to the project without making them read every
            doc first.
          </p>
        </Card>
      )}
      <MemoryRolesCard roles={memoryView.memory.roles} />
      <MemoryAgentCommunicationCard memoryView={memoryView} />
    </ListPage>
  );
}

function MemoryIntroCard({
  memoryView,
}: {
  memoryView: SkoposUiConsoleMemoryView;
}): React.JSX.Element {
  return (
    <Card
      title="What this page means"
      description="This is Skopos checking whether future agents can find the right project truth quickly."
    >
      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            label: 'Known',
            text: 'Skopos found a useful source, such as AGENTS.md, docs, decisions, findings, or generated state.',
          },
          {
            label: 'Needs review',
            text: 'Skopos found a possible source, but the project should confirm whether it is the right one.',
          },
          {
            label: 'Missing',
            text: 'Skopos did not find a clear source. This is a good candidate for a docs or AGENTS update.',
          },
        ].map((item) => (
          <div key={item.label} className="border-t border-[var(--line)] pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {item.label}
            </p>
            <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <p className="skopos-caption-muted mt-4">
        Generated file: <span className="skopos-mono-caption">{memoryView.memoryPath}</span>
      </p>
    </Card>
  );
}

function MemoryAttentionCard({
  roles,
  suggestions,
}: {
  roles: MemoryRole[];
  suggestions: MemorySuggestion[];
}): React.JSX.Element {
  const suggestionsById = new Map(suggestions.map((suggestion) => [suggestion.id, suggestion]));

  return (
    <Card
      title="What needs attention"
      description="These project knowledge areas may confuse future agents unless the project clarifies them."
    >
      <div className="border-y border-[var(--line)]">
        {roles.map((role, index) => {
          const roleSuggestions = role.suggestionIds
            .map((suggestionId) => suggestionsById.get(suggestionId))
            .filter((suggestion): suggestion is MemorySuggestion => Boolean(suggestion));

          return (
            <div
              key={role.role}
              className={cn(
                getSkoposListRowClass({ interactive: false }),
                index > 0 ? 'border-t border-[var(--line)]' : undefined,
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="skopos-caption font-medium">{role.title}</p>
                  <p className="skopos-helper-copy mt-1">{role.summary}</p>
                </div>
                <StatusPill value={role.status} tone={toneForMemoryStatus(role.status)} />
              </div>
              {roleSuggestions.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {roleSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="bg-[var(--panel)] px-3 py-2.5">
                      <p className="skopos-caption font-medium">{suggestion.summary}</p>
                      <p className="skopos-helper-copy mt-1">{suggestion.nextAction}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function MemoryRolesCard({ roles }: { roles: MemoryRole[] }): React.JSX.Element {
  return (
    <Card
      title="Project truth areas"
      description="Each row shows what Skopos uses as the source of truth for a project area."
    >
      <div className="border-y border-[var(--line)]">
        {roles.map((role, index) => (
          <div
            key={role.role}
            className={cn(
              getSkoposListRowClass({ interactive: false }),
              index > 0 ? 'border-t border-[var(--line)]' : undefined,
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="skopos-caption font-medium">{role.title}</p>
                <p className="skopos-helper-copy mt-1">{role.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill value={role.status} tone={toneForMemoryStatus(role.status)} />
                <StatusPill value={role.authority} tone="neutral" />
              </div>
            </div>
            {role.sources.length > 0 ? (
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {role.sources.slice(0, 6).map((source) => (
                  <div key={`${role.role}-${source.path}`} className="bg-[var(--panel)] px-3 py-2.5">
                    <p className="skopos-mono-caption break-words">{source.path}</p>
                    <p className="skopos-caption-muted mt-1">
                      {source.kind} · {source.authority}
                    </p>
                    <p className="skopos-helper-copy mt-1">{source.summary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="skopos-caption-muted mt-3">No source found yet.</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function MemoryAgentCommunicationCard({
  memoryView,
}: {
  memoryView: SkoposUiConsoleMemoryView;
}): React.JSX.Element {
  const brief = memoryView.communicationBrief;

  if (!brief) {
    return (
      <Card
        title="Agent communication guide"
        description="This guide tells coding agents how to explain work to the developer."
      >
        <EmptyMessage
          title="Agent communication guide is missing"
          description="Run skopos init or skopos trust to refresh generated agent guidance."
        />
      </Card>
    );
  }

  return (
    <Card
      title="Agent communication guide"
      description="This is the short guide agents should follow when they explain, ask, validate, and close work."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="skopos-section-title">Default answer shape</p>
          <ul className="mt-2 grid gap-2">
            {brief.defaultResponseShape.map((item) => (
              <li key={item} className="skopos-helper-copy border-t border-[var(--line)] pt-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="skopos-section-title">When work gets heavier</p>
          <div className="mt-2 grid gap-2">
            {brief.escalationRules.map((rule) => (
              <div key={rule.id} className="border-t border-[var(--line)] pt-2">
                <p className="skopos-caption font-medium">{rule.situation}</p>
                <p className="skopos-helper-copy mt-1">{rule.agentShouldDo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="skopos-caption-muted mt-4">
        Generated file:{' '}
        <span className="skopos-mono-caption">{memoryView.communicationBriefPath}</span>
      </p>
    </Card>
  );
}

function MemoryInspectorAside({
  memoryView,
}: {
  memoryView: SkoposUiConsoleMemoryView;
}): React.JSX.Element {
  const mappedCount = memoryView.memory.roles.filter((role) => role.status === 'mapped').length;
  const attentionCount = memoryView.memory.roles.filter((role) => role.status !== 'mapped').length;

  return (
    <div className="grid gap-4">
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Freshness', value: memoryView.memory.freshness },
            { label: 'Known', value: `${mappedCount}/${memoryView.memory.roles.length}` },
            { label: 'Attention', value: String(attentionCount) },
            { label: 'Suggestions', value: String(memoryView.memory.suggestions.length) },
          ]}
        />
      </SidebarCard>
      <SidebarCard title="Agent behavior">
        <KeyValueList
          layout="stacked"
          items={[
            {
              label: 'Audience',
              value: memoryView.communicationBrief?.audience.replaceAll('-', ' ') ?? 'Missing',
            },
            {
              label: 'What agents should do',
              value:
                'Check project knowledge before broad work, ask clearer questions, and update Skopos when project truth changes.',
            },
          ]}
        />
      </SidebarCard>
    </div>
  );
}

function MemoryMissingAside(): React.JSX.Element {
  return (
    <SidebarCard title="Next step">
      <KeyValueList
        layout="stacked"
        items={[
          {
            label: 'Command',
            value: 'skopos init .',
            monospace: true,
          },
          {
            label: 'Result',
            value: 'Creates the project knowledge view and agent communication guide.',
          },
        ]}
      />
    </SidebarCard>
  );
}

const toneForMemoryStatus = (
  status: MemoryRole['status'],
): 'positive' | 'warning' | 'danger' | 'info' => {
  switch (status) {
    case 'mapped':
      return 'positive';
    case 'needs-review':
      return 'warning';
    case 'stale':
      return 'info';
    default:
      return 'danger';
  }
};
