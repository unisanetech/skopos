import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type {
  SkoposUiConsoleTaskView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleScopeView,
} from '../../contracts/skopos-ui-console-state.js';
import {
  Card,
  getSkoposListRowClass,
  skoposListSurfaceClass,
} from '../../patterns/sections/content-primitives.js';
import {
  EmptyMessage,
  KeyValueList,
  SidebarCard,
  SidebarList,
  StatusPill,
} from '../../patterns/sections/inspector-primitives.js';
import { cn } from '../../support/ui/classnames.js';
import { toneForTaskState } from '../../support/ui/tone-helpers.js';

interface ScopePracticalGuide {
  owns: string[];
  doesNotOwn: string[];
  commonWork: string[];
  checks: string[];
}

const packageGuides: Record<string, ScopePracticalGuide> = {
  'skopos-cli': {
    owns: ['Command routing', 'CLI argument handling', 'human-readable terminal output'],
    doesNotOwn: ['Core planning rules', 'readiness engine internals', 'UI rendering'],
    commonWork: ['Add or improve a command', 'wire a command to an application service', 'improve CLI guidance text'],
    checks: ['pnpm --filter @skopos/cli check-types', 'pnpm --filter @skopos/cli exec vitest run'],
  },
  'skopos-ui': {
    owns: ['Console screens', 'sidebar navigation', 'human-readable workspace views'],
    doesNotOwn: ['Readiness scoring rules', 'task artifact schemas', 'CLI command parsing'],
    commonWork: ['Improve a page flow', 'add a state-aware empty state', 'render project knowledge more clearly'],
    checks: ['pnpm --filter @skopos/ui check-types', 'pnpm --filter @skopos/ui app:build'],
  },
  'skopos-verification': {
    owns: ['Readiness checks', 'risk signals', 'workspace confidence reporting'],
    doesNotOwn: ['UI labels', 'CLI command routing', 'task planning policy'],
    commonWork: ['Add a readiness check', 'improve warning text', 'tighten closure safety rules'],
    checks: ['pnpm --filter @skopos/verification check-types', 'pnpm skopos:readiness'],
  },
  'skopos-model': {
    owns: ['Shared artifact contracts', 'runtime data shapes', 'cross-package TypeScript types'],
    doesNotOwn: ['Feature implementation logic', 'screen layout', 'command output formatting'],
    commonWork: ['Add a contract field', 'tighten artifact typing', 'share a reusable model type'],
    checks: ['pnpm --filter @skopos/model check-types', 'pnpm -w typecheck'],
  },
  'skopos-runtime': {
    owns: ['Application orchestration', 'artifact assembly services', 'cross-package action behavior'],
    doesNotOwn: ['React view layout', 'terminal formatting details', 'raw schema definitions'],
    commonWork: ['Build or load an artifact', 'connect services across packages', 'improve action behavior'],
    checks: ['pnpm --filter @skopos/runtime check-types', 'pnpm skopos:readiness'],
  },
};

const genericGuides: Record<string, ScopePracticalGuide> = {
  workspace: {
    owns: ['Repository-wide direction', 'shared docs', 'cross-Scope action rules'],
    doesNotOwn: ['Scope-specific implementation details', 'temporary execution output', 'generated files by hand'],
    commonWork: ['Set product direction', 'update project-wide guidance', 'coordinate a cross-Scope change'],
    checks: ['pnpm skopos:readiness', 'pnpm -w typecheck'],
  },
  package: {
    owns: ['Implementation inside this package', 'package-local tests', 'package-local public surface'],
    doesNotOwn: ['Unrelated package behavior', 'repo-wide policy unless explicitly linked', 'generated output by hand'],
    commonWork: ['Change package behavior', 'add focused tests', 'update package-level docs or exports'],
    checks: ['Run the package typecheck', 'Run focused tests for this package'],
  },
};

const genericProjectScopeGuide: ScopePracticalGuide = {
  owns: ['Implementation in this declared Scope', 'Scope-local tests', 'Scope-local public surfaces'],
  doesNotOwn: ['Unrelated Scope behavior', 'workspace-wide policy unless explicitly linked', 'generated output by hand'],
  commonWork: ['Change Scope behavior', 'add focused tests', 'update Scope-owned docs or exports'],
  checks: ['Run focused checks for this Scope', 'Run affected integration checks'],
};

const getScopePracticalGuide = (scopeView: SkoposUiConsoleScopeView): ScopePracticalGuide => {
  return (
    packageGuides[scopeView.scope.id] ??
    genericGuides[scopeView.scope.kind] ??
    genericProjectScopeGuide
  );
};

function GuideList({
  title,
  items,
}: {
  title: string;
  items: string[];
}): React.JSX.Element {
  return (
    <section className="py-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {title}
      </p>
      <ul className="mt-2 grid gap-1.5 text-[12.5px] leading-[1.45rem] text-[var(--muted-strong)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function ScopesInspectorAside({
  scopeCount,
  projectScopeCount,
  workspaceCount,
  activeWorkCount,
}: {
  scopeCount: number;
  projectScopeCount: number;
  workspaceCount: number;
  activeWorkCount: number;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: 'Declared scopes', value: String(scopeCount) },
          ...(projectScopeCount > 0
            ? [{ label: 'Project areas', value: String(projectScopeCount) }]
            : []),
          { label: 'Workspace roots', value: String(workspaceCount) },
          { label: 'Active work', value: String(activeWorkCount) },
        ]}
      />
    </SidebarCard>
  );
}

export function ScopeListCard({
  scopes,
}: {
  scopes: SkoposUiConsoleScopeView[];
}): React.JSX.Element {
  return (
    <Card
      title="Project areas"
      description="Declared Scopes Skopos can resolve for context, ownership, and impact."
    >
      <div className={skoposListSurfaceClass}>
        {scopes.map((scopeView, index) => (
          <Link
            key={scopeView.scope.id}
            to="/scopes/$scopeId"
            params={{ scopeId: encodeURIComponent(scopeView.scope.id) }}
            className={getSkoposListRowClass({ bordered: index > 0 })}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill value={scopeView.scope.kind} tone="neutral" />
                <StatusPill
                  value={scopeView.scope.confidence}
                  tone={scopeView.scope.confidence === 'high' ? 'positive' : 'warning'}
                />
              </div>
              <h2 className="mt-2 text-[14px] font-semibold tracking-[-0.03em]">
                {scopeView.scope.title}
              </h2>
              <p className="mt-1 text-[12.75px] leading-[1.5rem] text-[var(--muted)]">
                {scopeView.scope.summary}
              </p>
              <p className="mt-2.5 text-[12.25px] leading-[1.45rem] text-[var(--muted)]">
                {scopeView.relatedTaskCount > 0 || scopeView.relatedPlanCount > 0
                  ? [
                      scopeView.relatedTaskCount > 0
                        ? `${scopeView.relatedTaskCount} task${
                            scopeView.relatedTaskCount === 1 ? '' : 's'
                          }`
                        : null,
                      scopeView.relatedPlanCount > 0
                        ? `${scopeView.relatedPlanCount} plan${
                            scopeView.relatedPlanCount === 1 ? '' : 's'
                          }`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')
                  : 'No active work'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function ScopeDetailInspectorAside({
  scopeView,
  relatedTasks,
  relatedPlans,
  relatedGraphs,
}: {
  scopeView: SkoposUiConsoleScopeView;
  relatedTasks: SkoposUiConsoleTaskView[];
  relatedPlans: SkoposUiConsolePlanView[];
  relatedGraphs: Array<{ id: string; title: string }>;
}): React.JSX.Element {
  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Type', value: scopeView.scope.kind },
            { label: 'Match quality', value: scopeView.scope.confidence },
            {
              label: 'Current work',
              value:
                relatedTasks.length > 0 || relatedPlans.length > 0
                  ? [
                      relatedTasks.length > 0
                        ? `${relatedTasks.length} task${relatedTasks.length === 1 ? '' : 's'}`
                        : null,
                      relatedPlans.length > 0
                        ? `${relatedPlans.length} plan${relatedPlans.length === 1 ? '' : 's'}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')
                  : 'No active plans or tasks',
            },
          ]}
        />
      </SidebarCard>
      {relatedGraphs.length > 0 ? (
        <SidebarCard
          title="Related graphs"
          badge={String(relatedGraphs.length)}
          collapsible
          defaultOpen={false}
        >
          <SidebarList
            items={relatedGraphs.slice(0, 4)}
            totalCount={relatedGraphs.length}
            previewNoun="graphs"
            getKey={(graph) => graph.id}
            renderItem={(graph) => (
              <p className="text-[13px] leading-6 text-[var(--muted-strong)]">{graph.title}</p>
            )}
            emptyTitle="No related graphs"
            emptyDescription="This scope does not currently map to graph views."
          />
        </SidebarCard>
      ) : null}
    </>
  );
}

export function ScopeFrameCard({
  scopeView,
  relatedTaskCount,
  relatedPlanCount,
}: {
  scopeView: SkoposUiConsoleScopeView;
  relatedTaskCount: number;
  relatedPlanCount: number;
}): React.JSX.Element {
  return (
    <Card
      title="What belongs here"
      description="Use this as a quick ownership guide before editing this area."
    >
      {(() => {
        const guide = getScopePracticalGuide(scopeView);
        return (
      <div className="border-y border-[var(--line)]">
        <section className="py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Summary
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
            {scopeView.scope.summary}
          </p>
        </section>
        <div className="border-t border-[var(--line)]">
          <GuideList title="Owns" items={guide.owns} />
        </div>
        <div className="border-t border-[var(--line)]">
          <GuideList title="Does not own" items={guide.doesNotOwn} />
        </div>
        <div className="border-t border-[var(--line)]">
          <GuideList title="Common work" items={guide.commonWork} />
        </div>
        <div className="border-t border-[var(--line)]">
          <GuideList title="Useful checks" items={guide.checks} />
        </div>
        <section className="border-t border-[var(--line)] py-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Active work
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[1.4rem] text-[var(--muted-strong)]">
            {relatedTaskCount > 0 || relatedPlanCount > 0
              ? [
                  relatedTaskCount > 0
                    ? `${relatedTaskCount} task${relatedTaskCount === 1 ? '' : 's'} currently map back to this scope`
                    : null,
                  relatedPlanCount > 0
                    ? `${relatedPlanCount} plan${relatedPlanCount === 1 ? '' : 's'} stay tied to this scope`
                    : null,
                ]
                  .filter(Boolean)
                  .join(', ') + '.'
              : 'No active task or plan is currently tied to this project area.'}
          </p>
        </section>
      </div>
        );
      })()}
    </Card>
  );
}

export function ScopeCurrentWorkCard({
  plans,
  tasks,
}: {
  plans: SkoposUiConsolePlanView[];
  tasks: SkoposUiConsoleTaskView[];
}): React.JSX.Element {
  return (
    <Card
      title="Current work"
      description="Plans and tasks currently tied to this project area."
    >
      {plans.length > 0 || tasks.length > 0 ? (
        <div className="border-y border-[var(--line)]">
          <section className="py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Plans
            </p>
            {plans.length > 0 ? (
              <div className="mt-2.5 grid gap-0">
                {plans.map((planView, index) => (
                  <Link
                    key={planView.plan.id}
                    to="/plans/$planId"
                    params={{ planId: planView.plan.id }}
                    className={cn(
                      'block py-3 transition-colors hover:bg-[color:rgba(255,252,246,0.4)]',
                      index > 0 ? 'border-t border-[var(--line)]' : undefined,
                    )}
                  >
                    <p className="text-[13px] font-medium tracking-[-0.01em]">
                      {planView.plan.title}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                      {planView.plan.summary}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No plans are currently tied to this project area.
              </p>
            )}
          </section>
          <section className="border-t border-[var(--line)] py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Tasks
            </p>
            {tasks.length > 0 ? (
              <div className="mt-2.5 grid gap-0">
                {tasks.map((taskView, index) => (
                  <Link
                    key={taskView.task.id}
                    to="/tasks/$taskId"
                    params={{ taskId: taskView.task.id }}
                    className={cn(
                      'block py-3 transition-colors hover:bg-[color:rgba(255,252,246,0.4)]',
                      index > 0 ? 'border-t border-[var(--line)]' : undefined,
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[13px] font-medium tracking-[-0.01em]">
                        {taskView.task.title}
                      </p>
                      <StatusPill
                        value={taskView.task.state}
                        tone={toneForTaskState(taskView.task.state)}
                      />
                    </div>
                    <p className="mt-1 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                      {taskView.task.summary}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-2.5 text-[12.5px] leading-[1.45rem] text-[var(--muted)]">
                No tasks are currently tied to this project area.
              </p>
            )}
          </section>
        </div>
      ) : (
        <EmptyMessage
          title="No related work"
          description="No plans or tasks are currently tied to this project area."
        />
      )}
    </Card>
  );
}
