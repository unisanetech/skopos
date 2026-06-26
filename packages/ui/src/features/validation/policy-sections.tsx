import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposPolicySeverity } from '@skopos/model';

import type {
  PolicyPackDetail,
  PolicyPackSummary,
  PolicyViewContext,
} from '../../platform/console-state/validation-selectors.js';
import {
  Card,
  MetricGrid,
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
import { formatDateTime, humanize } from '../../support/formatting/console-formatting.js';
import { cn } from '../../support/ui/classnames.js';

export function RulesInspectorAside({
  context,
  generatedAt,
}: {
  context: PolicyViewContext;
  generatedAt?: string;
}): React.JSX.Element {
  const counts = context.driftReport?.counts;

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Accepted packs', value: String(context.acceptedPacks.length) },
            { label: 'Active rules', value: String(totalRuleCount(context)) },
            { label: 'Open must drift', value: String(counts?.openMustCount ?? 0) },
            { label: 'Open should drift', value: String(counts?.openShouldCount ?? 0) },
            { label: 'Local exceptions', value: String(context.localOverrides.length) },
            {
              label: 'Default lane',
              value: context.resolvedPolicy?.defaultExecutionLane
                ? humanize(context.resolvedPolicy.defaultExecutionLane)
                : 'Not recorded',
            },
            { label: 'Updated', value: formatDateTime(generatedAt) },
          ]}
        />
      </SidebarCard>
      {context.sourceItems.length > 0 ? (
        <SidebarCard
          title="Source files"
          badge={String(context.sourceItems.length)}
          collapsible
          defaultOpen={false}
        >
          <KeyValueList items={context.sourceItems.map((item) => ({ ...item, monospace: true }))} layout="stacked" />
        </SidebarCard>
      ) : null}
      {context.executionLanes.length > 0 ? (
        <SidebarCard
          title="Work lanes"
          badge={String(context.executionLanes.length)}
          collapsible
          defaultOpen={false}
        >
          <SidebarList
            items={context.executionLanes}
            getKey={(lane) => lane.lane}
            renderItem={(lane) => (
              <>
                <div className="flex items-center justify-between gap-2.5">
                  <p className="text-[12.5px] font-medium tracking-[-0.01em]">
                    {humanize(lane.lane)}
                  </p>
                  <StatusPill
                    value={context.resolvedPolicy?.defaultExecutionLane === lane.lane ? 'default' : 'available'}
                    tone={context.resolvedPolicy?.defaultExecutionLane === lane.lane ? 'positive' : 'neutral'}
                  />
                </div>
                <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
                  {lane.summary}
                </p>
              </>
            )}
            emptyTitle="No lanes"
            emptyDescription="No execution lane guidance is recorded yet."
          />
        </SidebarCard>
      ) : null}
    </>
  );
}

export function RulesGuidanceCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  const hasOpenDrift = context.openDriftFindings.length > 0;
  const hasPolicy = Boolean(context.resolvedPolicy);

  return (
    <Card
      title="How to use this page"
      description="Rules explain what Skopos expects agents to follow when they build, refactor, or close work."
    >
      <div className="grid gap-3 md:grid-cols-3">
        <GuidancePoint
          label="Start here"
          text={
            hasPolicy
              ? 'Check which rule packs are active before starting a meaningful change.'
              : 'No accepted project rules are recorded yet. Apply a pack before using this page for guidance.'
          }
        />
        <GuidancePoint
          label="When it matters"
          text="Use this page when architecture, stack, validation, or local exception choices could change how agents work."
        />
        <GuidancePoint
          label="Next step"
          text={
            hasOpenDrift
              ? 'Fix open rule drift or add a clear local exception with an owner and reason.'
              : 'Keep the active rules in mind and use the suggested lane for the size of the task.'
          }
        />
      </div>
    </Card>
  );
}

export function RulesSummaryCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  const counts = context.driftReport?.counts;

  return (
    <Card
      title="Current rule state"
      description="A quick view of the accepted rules, current drift, and local exceptions."
    >
      <MetricGrid
        items={[
          {
            label: 'Accepted packs',
            value: context.acceptedPacks.length,
            helper: 'Rule packs currently active for this project.',
          },
          {
            label: 'Must rules',
            value: context.mustRules.length,
            helper: 'Rules that should block closure when drift is open.',
          },
          {
            label: 'Should rules',
            value: context.shouldRules.length,
            helper: 'Strong guidance that may need review if drift appears.',
          },
          {
            label: 'Open drift',
            value: (counts?.openMustCount ?? 0) + (counts?.openShouldCount ?? 0),
            helper: 'Accepted rules currently not matched by project state.',
          },
          {
            label: 'Exceptions',
            value: context.localOverrides.length,
            helper: 'Local reasons to suppress or downgrade a rule finding.',
          },
        ]}
      />
    </Card>
  );
}

export function AcceptedPacksCard({
  packs,
}: {
  packs: PolicyPackSummary[];
}): React.JSX.Element {
  return (
    <Card
      title="Accepted rule packs"
      description="These packs define the project guidance Skopos expects agents to follow."
    >
      {packs.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {packs.map((pack, index) => (
            <article
              key={pack.packId}
              className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="skopos-section-title">{pack.displayName}</p>
                  <p className="skopos-helper-copy mt-1">{pack.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill value={pack.source} tone="info" />
                  <Link
                    to="/rules/packs/$packId"
                    params={{ packId: pack.packId }}
                    className="rounded-full border border-[var(--line)] bg-[var(--panel-strong)] px-3 py-1 text-[11.5px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
                  >
                    Open details
                  </Link>
                </div>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <SmallFact label="Pack" value={pack.packId} monospace />
                <SmallFact
                  label="Accepted"
                  value={[
                    formatDateTime(pack.acceptedAt),
                    pack.acceptedBy ? `by ${pack.acceptedBy}` : undefined,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                {pack.family ? <SmallFact label="Family" value={pack.family} /> : null}
                {pack.variant ? <SmallFact label="Variant" value={pack.variant} /> : null}
              </div>
              <p className="mt-3 text-[12.5px] leading-5 text-[var(--muted-strong)]">
                <span className="font-semibold text-[var(--ink)]">Why accepted:</span> {pack.reason}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No accepted packs"
          description="Apply a rule pack before expecting Skopos to guide architecture, stack, or validation choices."
        />
      )}
    </Card>
  );
}

export function PackDetailsCard({
  packs,
}: {
  packs: PolicyPackDetail[];
}): React.JSX.Element {
  return (
    <Card
      title="Pack details"
      description="Use these details to understand what each pack means and verify whether it matches the real codebase."
    >
      {packs.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {packs.map((pack, index) => (
            <article
              key={pack.packId}
              className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="skopos-section-title">{pack.displayName}</p>
                  <p className="skopos-helper-copy mt-1">{pack.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pack.family ? <StatusPill value={pack.family} tone="info" /> : null}
                  <StatusPill value={`${pack.rules.length} rules`} tone="neutral" />
                </div>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <PackDetailList
                  title="Good fit when"
                  items={pack.bestFor}
                  empty="This pack has not recorded best-fit guidance yet."
                />
                <PackDetailList
                  title="Not needed when"
                  items={pack.notFor}
                  empty="This pack has not recorded not-for guidance yet."
                />
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <PackDetailList
                  title="Questions to ask"
                  items={pack.userQuestions}
                  empty="No guided questions are recorded for this pack yet."
                />
                <PackDetailList
                  title="Quality bar"
                  items={pack.qualityBar}
                  empty="No quality bar is recorded for this pack yet."
                />
              </div>

              <CodebaseVerificationPanel pack={pack} />

              <div className="mt-4 grid gap-2 md:grid-cols-3">
                <SmallFact label="Must rules" value={String(pack.ruleCounts.must)} />
                <SmallFact label="Should rules" value={String(pack.ruleCounts.should)} />
                <SmallFact label="Advisory rules" value={String(pack.ruleCounts.advisory)} />
              </div>

              <RulePreviewList pack={pack} />

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {pack.sourcePath ? <SmallFact label="Source path" value={pack.sourcePath} monospace /> : null}
                {pack.manifestPath ? <SmallFact label="Manifest file" value={pack.manifestPath} monospace /> : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No pack details"
          description="Accepted pack details will appear here after Skopos can read the pack manifests."
        />
      )}
    </Card>
  );
}

export function PackDetailInspectorAside({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  const structureNodes = flattenStructureNodes(pack.structureMatch?.nodes ?? []);
  const matchedCount = structureNodes.filter((node) => node.status === 'matched').length;
  const missingCount = structureNodes.filter((node) => node.status === 'missing').length;
  const missingRequiredMappingCount = pack.roleMappings.filter((mapping) => mapping.status === 'missing').length;
  const needsReviewMappingCount = pack.roleMappings.filter((mapping) => mapping.status === 'needs-review').length;

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          items={[
            { label: 'Pack', value: pack.packId, monospace: true },
            ...(pack.family ? [{ label: 'Family', value: pack.family }] : []),
            ...(pack.variant ? [{ label: 'Variant', value: pack.variant }] : []),
            { label: 'Must rules', value: String(pack.ruleCounts.must) },
            { label: 'Should rules', value: String(pack.ruleCounts.should) },
            { label: 'Advisory rules', value: String(pack.ruleCounts.advisory) },
            ...(pack.structureMatch
              ? [
                  { label: 'Structure matched', value: `${matchedCount}/${structureNodes.length}` },
                  { label: 'Missing required', value: String(missingCount) },
                ]
              : []),
            ...(pack.roleMappings.length > 0
              ? [
                  { label: 'Saved mappings', value: String(pack.roleMappings.length) },
                  {
                    label: 'Mapping review',
                    value:
                      missingRequiredMappingCount > 0
                        ? `${missingRequiredMappingCount} missing`
                        : needsReviewMappingCount > 0
                          ? `${needsReviewMappingCount} optional to review`
                          : 'No required gaps',
                  },
                ]
              : []),
          ]}
        />
      </SidebarCard>
      {pack.sourcePath || pack.manifestPath ? (
        <SidebarCard title="Source" collapsible defaultOpen={false}>
          <KeyValueList
            layout="stacked"
            items={[
              ...(pack.sourcePath ? [{ label: 'Source path', value: pack.sourcePath, monospace: true }] : []),
              ...(pack.manifestPath ? [{ label: 'Manifest file', value: pack.manifestPath, monospace: true }] : []),
            ]}
          />
        </SidebarCard>
      ) : null}
    </>
  );
}

export function PackOverviewCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  return (
    <Card
      title="What this pack means"
      description="A plain-English explanation of when this guidance should shape project work."
    >
      <p className="text-[13px] leading-6 text-[var(--muted-strong)]">{pack.description}</p>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <PackDetailList
          title="Good fit when"
          items={pack.bestFor}
          empty="This pack has not recorded best-fit guidance yet."
        />
        <PackDetailList
          title="Not needed when"
          items={pack.notFor}
          empty="This pack has not recorded not-for guidance yet."
        />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <PackDetailList
          title="Questions to ask"
          items={pack.userQuestions}
          empty="No guided questions are recorded for this pack yet."
        />
        <PackDetailList
          title="Quality bar"
          items={pack.qualityBar}
          empty="No quality bar is recorded for this pack yet."
        />
      </div>
    </Card>
  );
}

export function PackStructureTreeCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  const tree = pack.structureMatch;
  const structureNodes = flattenStructureNodes(tree?.nodes ?? []);
  const matchedRoleCount = structureNodes.filter((node) => node.status === 'matched').length;
  const missingRequiredCount = structureNodes.filter((node) => node.status === 'missing').length;

  return (
    <Card
      title="Structure tree and role mapping"
      description="Skopos treats pack structure as architecture roles, not required folder names."
    >
      {tree ? (
        <div className="grid gap-4">
          <div className="border-y border-[var(--line)] py-3">
            <p className="skopos-section-title">{tree.title}</p>
            <p className="skopos-helper-copy mt-1">{tree.summary}</p>
            <p className="mt-2 font-mono text-[12px] text-[var(--muted)]">{tree.rootLabel}/</p>
            {pack.roleMappingArtifactPath ? (
              <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
                Saved local mapping:{' '}
                <span className="font-mono text-[var(--muted-strong)]">
                  {pack.roleMappingArtifactPath}
                </span>
              </p>
            ) : null}
          </div>
          <div className="grid gap-3 rounded-md border border-[var(--line)] bg-[var(--panel-soft)] p-3 md:grid-cols-3">
            <GuidancePoint
              label="Brownfield rule"
              text="A different folder structure is fine when the roles are clear and consistent."
            />
            <GuidancePoint
              label="Matched roles"
              text={`${matchedRoleCount} ${matchedRoleCount === 1 ? 'role is' : 'roles are'} mapped to folders Skopos found in this project.`}
            />
            <GuidancePoint
              label="Needs mapping"
              text={
                missingRequiredCount > 0
                  ? `${missingRequiredCount} required ${missingRequiredCount === 1 ? 'role needs' : 'roles need'} a local mapping or a decision before refactoring.`
                  : 'All required roles have a local mapping.'
              }
            />
          </div>
          <div className="grid gap-2">
            {tree.nodes.map((node) => (
              <StructureTreeNodeView key={node.path} node={node} depth={0} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyMessage
          title="No role mapping"
          description="This pack has not recorded role-mapping guidance yet."
        />
      )}
    </Card>
  );
}

export function PackRoleMappingReviewCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  const mappings = pack.roleMappings;
  const mappedCount = mappings.filter((mapping) => ['confirmed', 'inferred'].includes(mapping.status)).length;
  const confirmedCount = mappings.filter((mapping) => mapping.status === 'confirmed').length;
  const inferredCount = mappings.filter((mapping) => mapping.status === 'inferred').length;
  const ignoredCount = mappings.filter((mapping) => mapping.status === 'ignored').length;
  const missingRequiredCount = mappings.filter((mapping) => mapping.required && mapping.status === 'missing').length;
  const needsReviewCount = mappings.filter((mapping) => mapping.status === 'needs-review').length;

  return (
    <Card
      title="Saved local role mapping"
      description="This is the project-specific evidence Skopos saved after matching pack roles to real folders."
    >
      {mappings.length > 0 ? (
        <div className="grid gap-4">
          <div className="grid gap-3 rounded-md border border-[var(--line)] bg-[var(--panel-soft)] p-3 md:grid-cols-3">
            <GuidancePoint
              label="Mapped roles"
              text={`${mappedCount} ${mappedCount === 1 ? 'role has' : 'roles have'} local folder evidence.`}
            />
            <GuidancePoint
              label="Needs review"
              text={
                needsReviewCount > 0
                  ? `${needsReviewCount} optional ${needsReviewCount === 1 ? 'role has' : 'roles have'} no mapped folder yet.`
                  : 'Optional roles do not need attention right now.'
              }
            />
            <GuidancePoint
              label="Required gaps"
              text={
                missingRequiredCount > 0
                  ? `${missingRequiredCount} required ${missingRequiredCount === 1 ? 'role is' : 'roles are'} missing local evidence.`
                  : 'All required roles have local evidence.'
              }
            />
          </div>

          <RoleMappingDecisionSummary
            confirmedCount={confirmedCount}
            inferredCount={inferredCount}
            ignoredCount={ignoredCount}
            needsReviewCount={needsReviewCount}
            missingRequiredCount={missingRequiredCount}
          />

          <div className={skoposListSurfaceClass}>
            {mappings.map((mapping, index) => (
              <article
                key={`${mapping.packId}:${mapping.role}`}
                className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-[12.5px] font-semibold text-[var(--ink)]">
                        {mapping.role}
                      </p>
                      <StatusPill value={mapping.status} tone={roleMappingStatusTone(mapping.status)} />
                      <StatusPill value={mapping.required ? 'required' : 'optional'} tone={mapping.required ? 'warning' : 'neutral'} />
                    </div>
                    <p className="mt-1 text-[13px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                      {mapping.label}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-5 text-[var(--muted-strong)]">
                      {mapping.reason}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-5 text-[var(--muted)]">
                      <span className="font-semibold text-[var(--ink)]">Decision state:</span>{' '}
                      {roleMappingDecisionCopy(mapping)}
                    </p>
                  </div>
                  <StatusPill value={`${mapping.confidence} confidence`} tone={mapping.confidence === 'high' ? 'positive' : mapping.confidence === 'medium' ? 'warning' : 'danger'} />
                </div>

                {mapping.matchedPaths.length > 0 ? (
                  <div className="mt-3">
                    <p className="skopos-caption-muted">Matched local paths</p>
                    <ul className="mt-1 grid gap-1">
                      {mapping.matchedPaths.slice(0, 6).map((path) => (
                        <li key={path} className="font-mono text-[12px] leading-5 text-[var(--muted-strong)]">
                          {path}
                        </li>
                      ))}
                    </ul>
                    {mapping.matchedPaths.length > 6 ? (
                      <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
                        +{mapping.matchedPaths.length - 6} more local paths are saved in the role-mapping artifact.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-[12.5px] leading-5 text-[var(--muted)]">
                    {mapping.required
                      ? 'Next step: map this required role to the local folder name, or record a decision explaining why the project intentionally does not use it.'
                      : 'Next step: no action needed unless this optional role exists under a different local name.'}
                  </p>
                )}

                {mapping.matchedAliases.length > 0 ? (
                  <p className="mt-2 text-[11.5px] leading-5 text-[var(--muted)]">
                    Matched aliases: {mapping.matchedAliases.slice(0, 4).join(', ')}
                    {mapping.matchedAliases.length > 4 ? `, +${mapping.matchedAliases.length - 4} more` : ''}
                  </p>
                ) : null}

                <RoleMappingCommandHints mapping={mapping} />
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyMessage
          title="No saved role mapping"
          description="Run or refresh accepted policy so Skopos can save local folder evidence for this pack."
        />
      )}
    </Card>
  );
}

function RoleMappingDecisionSummary({
  confirmedCount,
  inferredCount,
  ignoredCount,
  needsReviewCount,
  missingRequiredCount,
}: {
  confirmedCount: number;
  inferredCount: number;
  ignoredCount: number;
  needsReviewCount: number;
  missingRequiredCount: number;
}): React.JSX.Element {
  const attentionCount = needsReviewCount + missingRequiredCount;

  return (
    <section className="rounded-md border border-[var(--line)] bg-[var(--panel)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="skopos-section-title">Role mapping decisions</p>
          <p className="skopos-helper-copy mt-1">
            Confirmed and ignored rows are saved project decisions. Inferred rows are Skopos suggestions that should be confirmed when they are correct.
          </p>
        </div>
        <StatusPill
          value={attentionCount > 0 ? `${attentionCount} to review` : 'no blockers'}
          tone={attentionCount > 0 ? 'warning' : 'positive'}
        />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <SmallFact label="Confirmed" value={`${confirmedCount} saved`} />
        <SmallFact label="Inferred" value={`${inferredCount} suggested`} />
        <SmallFact label="Ignored" value={`${ignoredCount} saved`} />
        <SmallFact label="Needs attention" value={`${attentionCount} roles`} />
      </div>
      <p className="mt-3 text-[12.5px] leading-5 text-[var(--muted)]">
        The UI is read-only today. Copy a command below and run it in the project root to update the saved decision file.
      </p>
    </section>
  );
}

function RoleMappingCommandHints({
  mapping,
}: {
  mapping: PolicyPackDetail['roleMappings'][number];
}): React.JSX.Element {
  const primaryPath = mapping.matchedPaths[0];
  const confirmCommand = [
    'skopos policies mappings confirm',
    `--pack ${shellQuote(mapping.packId)}`,
    `--role ${shellQuote(mapping.role)}`,
    primaryPath ? `--path ${shellQuote(primaryPath)}` : undefined,
    '--reason "Confirmed this local folder satisfies the pack role."',
  ].filter(Boolean).join(' ');
  const ignoreCommand = [
    'skopos policies mappings ignore',
    `--pack ${shellQuote(mapping.packId)}`,
    `--role ${shellQuote(mapping.role)}`,
    '--reason "This project intentionally does not use this role yet."',
  ].join(' ');

  if (mapping.status === 'confirmed') {
    return (
      <p className="mt-3 text-[12px] leading-5 text-[var(--muted)]">
        This role is already confirmed as local project truth. No command is needed unless the structure changed.
      </p>
    );
  }

  if (mapping.status === 'ignored') {
    return (
      <p className="mt-3 text-[12px] leading-5 text-[var(--muted)]">
        This role is intentionally ignored for this project. Remove the decision if the structure changes later.
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-md border border-[var(--line)] bg-[var(--panel-soft)] p-3">
      <p className="skopos-caption-muted">Make this explicit</p>
      <div className="mt-2 grid gap-2">
        <CommandHint label="Confirm mapping" command={confirmCommand} />
        <CommandHint label="Ignore role" command={ignoreCommand} />
      </div>
    </div>
  );
}

function CommandHint({
  label,
  command,
}: {
  label: string;
  command: string;
}): React.JSX.Element {
  const [copyStatus, setCopyStatus] = React.useState<'idle' | 'copied' | 'failed'>('idle');

  const copyCommand = async (): Promise<void> => {
    const copied = await copyTextToClipboard(command);
    setCopyStatus(copied ? 'copied' : 'failed');
    window.setTimeout(() => {
      setCopyStatus('idle');
    }, 1800);
  };

  return (
    <div className="border-t border-[var(--line)] pt-2 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          {label}
        </p>
        <button
          type="button"
          onClick={() => {
            void copyCommand();
          }}
          className="rounded-full border border-[var(--line)] bg-[var(--panel-strong)] px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
          aria-label={`Copy ${label.toLowerCase()} command`}
        >
          {copyStatus === 'copied' ? 'Copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
      </div>
      <p className="mt-1 break-words font-mono text-[11.5px] leading-5 text-[var(--muted-strong)] [overflow-wrap:anywhere]">
        {command}
      </p>
    </div>
  );
}

const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => {
          window.setTimeout(() => {
            reject(new Error('Clipboard write timed out.'));
          }, 700);
        }),
      ]);
      return true;
    } catch {
      // Fall through to the textarea fallback below.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
};

export function PackArchitectureContractCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  const hasContract =
    pack.recommendedLayers.length > 0 ||
    pack.dependencyDirection.length > 0 ||
    pack.forbiddenImports.length > 0 ||
    Boolean(pack.gates) ||
    Boolean(pack.agentPrompts);

  return (
    <Card
      title="Architecture contract"
      description="The pack's YAML-style contract rendered as readable guidance for humans and agents."
    >
      {hasContract ? (
        <div className="grid gap-5">
          <PackDetailList
            title="Recommended layers"
            items={pack.recommendedLayers}
            empty="No recommended layers are recorded for this pack yet."
            monospace
          />
          {pack.dependencyDirection.length > 0 ? (
            <div>
              <p className="skopos-caption-muted">Dependency direction</p>
              <div className="mt-2 border-y border-[var(--line)]">
                {pack.dependencyDirection.map((direction, index) => (
                  <div
                    key={direction.layer}
                    className={cn('py-2.5', index > 0 ? 'border-t border-[var(--line)]' : undefined)}
                  >
                    <p className="font-mono text-[12.5px] font-semibold text-[var(--ink)]">
                      {direction.layer}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-5 text-[var(--muted-strong)]">
                      May import: {direction.mayImport.length > 0 ? direction.mayImport.join(', ') : 'nothing'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {pack.forbiddenImports.length > 0 ? (
            <div>
              <p className="skopos-caption-muted">Forbidden imports</p>
              <div className="mt-2 border-y border-[var(--line)]">
                {pack.forbiddenImports.map((entry, index) => (
                  <div
                    key={`${entry.from}-${entry.to.join('-')}`}
                    className={cn('py-2.5', index > 0 ? 'border-t border-[var(--line)]' : undefined)}
                  >
                    <p className="font-mono text-[12.5px] font-semibold text-[var(--ink)]">
                      {entry.from}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-5 text-[var(--muted-strong)]">
                      Must not import: {entry.to.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {pack.gates ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <PackDetailList title="Required gates" items={pack.gates.required} empty="No required gates are recorded." monospace />
              <PackDetailList title="Recommended gates" items={pack.gates.recommended} empty="No recommended gates are recorded." monospace />
            </div>
          ) : null}
          {pack.agentPrompts ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <PackDetailList title="Before editing" items={pack.agentPrompts.beforeEditing} empty="No before-editing prompts are recorded." />
              <PackDetailList title="Before done" items={pack.agentPrompts.beforeDone} empty="No before-done prompts are recorded." />
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyMessage
          title="No architecture contract"
          description="This pack has not recorded layer, dependency, gate, or agent-prompt details yet."
        />
      )}
    </Card>
  );
}

export function PackGateStatusCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  return (
    <Card
      title="Gate status"
      description="Shows which checks Skopos found in this project, which checks need manual proof, and which commands are missing."
    >
      {pack.resolvedGates.length > 0 ? (
        <div className="grid gap-4">
          <MetricGrid
            items={[
              {
                label: 'Available',
                value: pack.gateCounts.available,
                helper: 'Project commands Skopos can run or ask the agent to run.',
              },
              {
                label: 'Manual proof',
                value: pack.gateCounts.manual,
                helper: 'Checks the agent must inspect and explain clearly.',
              },
              {
                label: 'Missing',
                value: pack.gateCounts.missing,
                helper: pack.gateCounts.missingRequired > 0
                  ? 'Required commands are missing from package scripts.'
                  : 'Recommended commands not found in package scripts.',
              },
            ]}
          />
          <div className={skoposListSurfaceClass}>
            {pack.resolvedGates.map((gate, index) => (
              <article
                key={gate.id}
                className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="skopos-section-title">{gate.label}</p>
                    <p className="skopos-helper-copy mt-1">{gate.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill value={humanize(gate.status)} tone={gateStatusTone(gate)} />
                    <StatusPill value={humanize(gate.requiredness)} tone={gate.requiredness === 'required' ? 'warning' : 'neutral'} />
                  </div>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <SmallFact label="Kind" value={humanize(gate.kind)} />
                  <SmallFact label="Proof" value={gate.command ?? gate.missingReason ?? 'Agent must inspect and explain.'} monospace={Boolean(gate.command)} />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyMessage
          title="No resolved gate status"
          description="Apply this pack, then run skopos gates resolve . to generate the gate plan for this project."
        />
      )}
    </Card>
  );
}

export function PackRulesCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  return (
    <Card
      title="Rules inside this pack"
      description="The active rules this accepted pack contributes to planning, implementation, and closure."
    >
      {pack.rules.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {pack.rules.map((rule, index) => (
            <article
              key={rule.id}
              className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="skopos-section-title">{rule.title}</p>
                  <p className="skopos-helper-copy mt-1">{rule.summary}</p>
                </div>
                <StatusPill value={rule.severity} tone={severityTone(rule.severity)} />
              </div>
              {rule.rationale ? (
                <p className="mt-2 text-[12.5px] leading-5 text-[var(--muted-strong)]">
                  <span className="font-semibold text-[var(--ink)]">Why:</span> {rule.rationale}
                </p>
              ) : null}
              <div className="mt-3 grid gap-4 xl:grid-cols-2">
                <PackDetailList title="Examples" items={rule.examples ?? []} empty="No examples recorded." />
                <PackDetailList title="Avoid" items={rule.antiPatterns ?? []} empty="No anti-patterns recorded." />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No active rules"
          description="This accepted pack is not contributing active rules in the current resolved policy."
        />
      )}
    </Card>
  );
}

export function ActiveRulesCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  return (
    <Card
      title="Active rules"
      description="The concrete rules agents should consider during planning, implementation, and closure."
    >
      {totalRuleCount(context) > 0 ? (
        <div className="grid gap-5">
          <RuleGroup title="Must follow" severity="must" rules={context.mustRules} />
          <RuleGroup title="Should follow" severity="should" rules={context.shouldRules} />
          <RuleGroup title="Advisory guidance" severity="advisory" rules={context.advisoryRules} />
        </div>
      ) : (
        <EmptyMessage
          title="No active rules"
          description="Accepted packs are required before Skopos can show active project rules."
        />
      )}
    </Card>
  );
}

export function RuleDriftCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  const visibleFindings = [
    ...context.openDriftFindings,
    ...context.suppressedDriftFindings,
  ];

  return (
    <Card
      title="Rule drift"
      description="Drift means accepted rules and current project state no longer line up."
    >
      {visibleFindings.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {visibleFindings.map((finding, index) => (
            <article
              key={finding.id}
              className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="skopos-section-title">{finding.summary}</p>
                  <p className="skopos-helper-copy mt-1">
                    {finding.sourcePath ?? finding.ruleId ?? finding.packId ?? finding.family}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill value={finding.status} tone={finding.status === 'open' ? severityTone(finding.severity) : 'positive'} />
                  <StatusPill value={finding.severity} tone={severityTone(finding.severity)} />
                </div>
              </div>
              {finding.remediation.length > 0 ? (
                <ul className="mt-3 grid gap-1.5">
                  {finding.remediation.slice(0, 3).map((item) => (
                    <li key={item} className="text-[12.5px] leading-5 text-[var(--muted-strong)]">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No rule drift"
          description="Skopos is not reporting accepted-rule drift that needs attention right now."
        />
      )}
    </Card>
  );
}

export function LocalExceptionsCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  return (
    <Card
      title="Local exceptions"
      description="Exceptions explain why a rule finding is suppressed or downgraded for this project."
    >
      {context.localOverrides.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {context.localOverrides.map((override, index) => (
            <article
              key={override.id}
              className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="skopos-section-title">{override.reason}</p>
                  <p className="skopos-helper-copy mt-1">
                    {[override.ruleId, override.packId, override.sourcePath].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <StatusPill
                  value={override.severity ? `downgrade to ${override.severity}` : 'suppress'}
                  tone={override.severity ? severityTone(override.severity) : 'positive'}
                />
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <SmallFact label="Owner" value={override.owner ?? 'Not assigned'} />
                <SmallFact label="Expires" value={override.expiresAt ? formatDateTime(override.expiresAt) : 'No expiry'} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No local exceptions"
          description="No accepted policy findings are currently suppressed or downgraded."
        />
      )}
    </Card>
  );
}

function StructureTreeNodeView({
  node,
  depth,
}: {
  node: NonNullable<PolicyPackDetail['structureMatch']>['nodes'][number];
  depth: number;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        'border-t border-[var(--line)] py-3',
        depth > 0 ? 'ml-5 pl-4' : undefined,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[12.5px] font-semibold text-[var(--ink)]">{node.path}</p>
            <StatusPill value={node.status} tone={structureStatusTone(node.status)} />
          </div>
          <p className="mt-1 text-[13px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
            {node.label}
          </p>
          <p className="mt-1 text-[12.5px] leading-5 text-[var(--muted-strong)]">
            {node.responsibility}
          </p>
        </div>
      </div>
      {node.matchedPaths.length > 0 ? (
        <div className="mt-2">
          <p className="skopos-caption-muted">Found in this project</p>
          <ul className="mt-1 grid gap-1">
            {node.matchedPaths.slice(0, 6).map((path) => (
              <li key={path} className="font-mono text-[12px] leading-5 text-[var(--muted-strong)]">
                {path}
              </li>
            ))}
          </ul>
          {node.matchedPatterns.length > 0 ? (
            <p className="mt-1 text-[11.5px] leading-5 text-[var(--muted)]">
              Matched aliases: {node.matchedPatterns.slice(0, 4).join(', ')}
              {node.matchedPatterns.length > 4 ? `, +${node.matchedPatterns.length - 4} more` : ''}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
          {node.required
            ? 'Skopos did not find this required role yet. Map the local folder name or record a project decision before changing structure.'
            : 'Optional: this role is useful when the project needs it. Different local names are fine when they are mapped.'}
        </p>
      )}
      {node.children.length > 0 ? (
        <div className="mt-2">
          {node.children.map((child) => (
            <StructureTreeNodeView key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CodebaseVerificationPanel({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  const signalEvidence = pack.appliesWhen.flatMap((signal) =>
    signal.evidence.slice(0, 3).map((item) => ({
      signal: signal.summary,
      evidence: item,
      confidence: signal.confidence,
    })),
  );
  const avoidEvidence = pack.avoidWhen.flatMap((signal) =>
    signal.evidence.slice(0, 2).map((item) => ({
      signal: signal.summary,
      evidence: item,
      confidence: signal.confidence,
    })),
  );

  return (
    <div className="mt-4 border-y border-[var(--line)] py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="skopos-section-title">Verify against the codebase</p>
          <p className="skopos-helper-copy mt-1">
            Check these signs in the actual folder tree, docs, commands, and source code before trusting the pack blindly.
          </p>
        </div>
        {pack.projectLifecycles.length > 0 ? (
          <div className="flex max-w-full flex-wrap gap-2">
            {pack.projectLifecycles.map((lifecycle) => (
              <StatusPill key={lifecycle} value={lifecycle} tone="neutral" />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <SignalEvidenceList
          title="Look for these signs"
          items={signalEvidence}
          empty="No codebase signals are recorded for this pack yet."
        />
        <SignalEvidenceList
          title="Be careful if you see"
          items={avoidEvidence}
          empty="No avoid signals are recorded for this pack yet."
        />
      </div>

      <div className="mt-3 grid gap-4 xl:grid-cols-2">
        <PackDetailList
          title="How agents should use it"
          items={pack.agentUse}
          empty="No agent-use notes are recorded for this pack yet."
        />
        <PackDetailList
          title="Generated or checked outputs"
          items={[...pack.generatedArtifacts, ...pack.driftCheckIds, ...pack.proofFixtureIds]}
          empty="No generated artifacts, drift checks, or proof fixtures are recorded yet."
          monospace
        />
      </div>
    </div>
  );
}

function RulePreviewList({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element | null {
  if (pack.rules.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <p className="skopos-caption-muted">Rules to review inside this pack</p>
      <div className="mt-2 grid gap-2">
        {pack.rules.slice(0, 4).map((rule) => (
          <div key={rule.id} className="border-t border-[var(--line)] pt-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-[12.5px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                {rule.title}
              </p>
              <StatusPill value={rule.severity} tone={severityTone(rule.severity)} />
            </div>
            <p className="mt-1 text-[12.5px] leading-5 text-[var(--muted-strong)]">
              {rule.summary}
            </p>
            {rule.examples && rule.examples.length > 0 ? (
              <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
                Example: {rule.examples[0]}
              </p>
            ) : null}
            {rule.antiPatterns && rule.antiPatterns.length > 0 ? (
              <p className="mt-1 text-[12px] leading-5 text-[var(--muted)]">
                Avoid: {rule.antiPatterns[0]}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      {pack.rules.length > 4 ? (
        <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
          {pack.rules.length - 4} more {pack.rules.length - 4 === 1 ? 'rule' : 'rules'} are shown in the Active rules section.
        </p>
      ) : null}
    </div>
  );
}

function SignalEvidenceList({
  title,
  items,
  empty,
}: {
  title: string;
  items: Array<{ signal: string; evidence: string; confidence: string }>;
  empty: string;
}): React.JSX.Element {
  return (
    <div>
      <p className="skopos-caption-muted">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2">
          {items.slice(0, 5).map((item) => (
            <li key={`${item.signal}-${item.evidence}`} className="text-[12.5px] leading-5 text-[var(--muted-strong)]">
              <span className="font-semibold text-[var(--ink)]">{item.evidence}</span>
              <span className="text-[var(--muted)]"> - {item.signal} ({item.confidence})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[12.5px] leading-5 text-[var(--muted)]">{empty}</p>
      )}
    </div>
  );
}

function PackDetailList({
  title,
  items,
  empty,
  monospace = false,
}: {
  title: string;
  items: string[];
  empty: string;
  monospace?: boolean;
}): React.JSX.Element {
  return (
    <div>
      <p className="skopos-caption-muted">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-1.5">
          {items.slice(0, 5).map((item) => (
            <li
              key={item}
              className={cn(
                'text-[12.5px] leading-5 text-[var(--muted-strong)] [overflow-wrap:anywhere]',
                monospace ? 'font-mono' : undefined,
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[12.5px] leading-5 text-[var(--muted)]">{empty}</p>
      )}
    </div>
  );
}

function RuleGroup({
  title,
  severity,
  rules,
}: {
  title: string;
  severity: SkoposPolicySeverity;
  rules: PolicyViewContext['mustRules'];
}): React.JSX.Element | null {
  if (rules.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="skopos-section-title">{title}</p>
        <StatusPill value={`${rules.length}`} tone={severityTone(severity)} />
      </div>
      <div className={skoposListSurfaceClass}>
        {rules.map((rule, index) => (
          <article
            key={rule.id}
            className={getSkoposListRowClass({ compact: true, bordered: index > 0, interactive: false })}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold tracking-[-0.02em]">{rule.title}</p>
                <p className="skopos-helper-copy mt-1">{rule.summary}</p>
              </div>
              <StatusPill value={rule.severity} tone={severityTone(rule.severity)} />
            </div>
          </article>
        ))}
      </div>
    </section>
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

function SmallFact({
  label,
  value,
  monospace = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}): React.JSX.Element {
  return (
    <div className="border-t border-[var(--line)] pt-2">
      <p className="skopos-caption-muted">{label}</p>
      <p
        className={cn(
          'mt-1 break-words text-[12.5px] leading-5 text-[var(--muted-strong)] [overflow-wrap:anywhere]',
          monospace ? 'font-mono' : undefined,
        )}
      >
        {value}
      </p>
    </div>
  );
}

const totalRuleCount = (context: PolicyViewContext): number =>
  context.mustRules.length + context.shouldRules.length + context.advisoryRules.length;

const flattenStructureNodes = (
  nodes: NonNullable<PolicyPackDetail['structureMatch']>['nodes'],
): Array<NonNullable<PolicyPackDetail['structureMatch']>['nodes'][number]> =>
  nodes.flatMap((node) => [node, ...flattenStructureNodes(node.children)]);

const roleMappingDecisionCopy = (
  mapping: PolicyPackDetail['roleMappings'][number],
): string => {
  if (mapping.status === 'confirmed') {
    return 'Saved as a project decision. Agents can treat this role mapping as project truth.';
  }

  if (mapping.status === 'ignored') {
    return 'Saved as intentionally not used in this project. Agents should not ask about this role again unless the structure changes.';
  }

  if (mapping.status === 'inferred') {
    return 'Suggested by Skopos from local folders. Confirm it when the match is correct.';
  }

  if (mapping.status === 'needs-review') {
    return 'Optional role with no clear local match. Ignore it if this project does not need it.';
  }

  return 'Required role with no local evidence yet. Map it to the real folder or record why the project does not use it.';
};

const shellQuote = (value: string): string => `'${value.replaceAll("'", "'\\''")}'`;

const structureStatusTone = (
  status: 'matched' | 'missing' | 'optional',
): 'neutral' | 'positive' | 'warning' | 'danger' | 'info' => {
  switch (status) {
    case 'matched':
      return 'positive';
    case 'missing':
      return 'danger';
    case 'optional':
      return 'neutral';
  }
};

const roleMappingStatusTone = (
  status: PolicyPackDetail['roleMappings'][number]['status'],
): 'neutral' | 'positive' | 'warning' | 'danger' | 'info' => {
  switch (status) {
    case 'confirmed':
      return 'positive';
    case 'inferred':
      return 'info';
    case 'needs-review':
      return 'warning';
    case 'missing':
      return 'danger';
    case 'ignored':
      return 'neutral';
  }
};

const gateStatusTone = (
  gate: PolicyPackDetail['resolvedGates'][number],
): 'neutral' | 'positive' | 'warning' | 'danger' | 'info' => {
  switch (gate.status) {
    case 'available':
      return 'positive';
    case 'manual':
      return 'info';
    case 'missing':
      return gate.requiredness === 'required' ? 'danger' : 'warning';
  }
};

const severityTone = (
  severity: SkoposPolicySeverity,
): 'neutral' | 'positive' | 'warning' | 'danger' | 'info' => {
  switch (severity) {
    case 'must':
      return 'danger';
    case 'should':
      return 'warning';
    case 'advisory':
      return 'info';
  }
};
