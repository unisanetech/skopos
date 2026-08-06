import * as React from 'react';
import { Link } from '@tanstack/react-router';

import type { SkoposPolicySeverity } from '@skopos/model';

import type {
  PolicyPackDetail,
  PolicyPackSummary,
  PolicyRuleDetailContext,
  PolicyViewContext,
} from '../../platform/console-state/validation-selectors.js';
import {
  ContentSection,
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
              value: context.resolvedPolicy?.defaultTaskRisk
                ? humanize(context.resolvedPolicy.defaultTaskRisk)
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
      {context.taskRisks.length > 0 ? (
        <SidebarCard
          title="Task risk"
          badge={String(context.taskRisks.length)}
          collapsible
          defaultOpen={false}
        >
          <SidebarList
            items={context.taskRisks}
            getKey={(taskRisk) => taskRisk.risk}
            renderItem={(taskRisk) => (
              <>
                <div className="flex items-center justify-between gap-2.5">
                  <p className="text-body-small font-medium">
                    {humanize(taskRisk.risk)}
                  </p>
                  <StatusPill
                    value={context.resolvedPolicy?.defaultTaskRisk === taskRisk.risk ? 'default' : 'available'}
                    tone={context.resolvedPolicy?.defaultTaskRisk === taskRisk.risk ? 'positive' : 'neutral'}
                  />
                </div>
                <p className="mt-1 text-body-small leading-5 text-on-surface-variant">
                  {taskRisk.summary}
                </p>
              </>
            )}
            emptyTitle="No Task risk guidance"
            emptyDescription="No Task risk guidance is recorded yet."
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
    <ContentSection
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
    </ContentSection>
  );
}

export function RulesSummaryCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  const counts = context.driftReport?.counts;

  return (
    <ContentSection
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
    </ContentSection>
  );
}

export function AcceptedPacksCard({
  packs,
}: {
  packs: PolicyPackSummary[];
}): React.JSX.Element {
  return (
    <ContentSection
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
                  <h3 className="text-title-medium text-on-surface">{pack.displayName}</h3>
                  <p className="text-body-medium text-on-surface-variant mt-1">{pack.summary}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill value={pack.source} tone="info" />
                  <Link
                    to="/rules/packs/$packId"
                    params={{ packId: pack.packId }}
                    className="rounded-full border border-outline-weak bg-surface-container-low px-3 py-1 text-label-small text-on-surface transition-colors hover:bg-primary-container"
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
              <p className="mt-3 text-body-small leading-5 text-on-surface">
                <span className="font-medium text-on-surface">Why accepted:</span> {pack.reason}
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
    </ContentSection>
  );
}

export function PackDetailsCard({
  packs,
}: {
  packs: PolicyPackDetail[];
}): React.JSX.Element {
  return (
    <ContentSection
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
                  <h3 className="text-title-medium text-on-surface">{pack.displayName}</h3>
                  <p className="text-body-medium text-on-surface-variant mt-1">{pack.description}</p>
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
    </ContentSection>
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
    <ContentSection
      title="What this pack means"
      description="A plain-English explanation of when this guidance should shape project work."
    >
      <p className="text-body-medium leading-6 text-on-surface">{pack.description}</p>
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
    </ContentSection>
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
    <ContentSection
      title="Structure tree and role mapping"
      description="Skopos treats pack structure as architecture roles, not required folder names."
    >
      {tree ? (
        <div className="grid gap-4">
          <div className="border-y border-outline-weak py-3">
            <h3 className="text-title-medium text-on-surface">{tree.title}</h3>
            <p className="text-body-medium text-on-surface-variant mt-1">{tree.summary}</p>
            <p className="mt-2 font-mono text-body-small text-on-surface-variant">{tree.rootLabel}/</p>
            {pack.roleMappingArtifactPath ? (
              <p className="mt-2 text-body-small leading-5 text-on-surface-variant">
                Saved local mapping:{' '}
                <span className="font-mono text-on-surface">
                  {pack.roleMappingArtifactPath}
                </span>
              </p>
            ) : null}
          </div>
          <div className="grid gap-3 rounded-md border border-outline-weak bg-surface-container p-3 md:grid-cols-3">
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
    </ContentSection>
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
    <ContentSection
      title="Saved local role mapping"
      description="This is the project-specific evidence Skopos saved after matching pack roles to real folders."
    >
      {mappings.length > 0 ? (
        <div className="grid gap-4">
          <div className="grid gap-3 rounded-md border border-outline-weak bg-surface-container p-3 md:grid-cols-3">
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
                      <p className="font-mono text-body-small font-medium text-on-surface">
                        {mapping.role}
                      </p>
                      <StatusPill value={mapping.status} tone={roleMappingStatusTone(mapping.status)} />
                      <StatusPill value={mapping.required ? 'required' : 'optional'} tone={mapping.required ? 'warning' : 'neutral'} />
                    </div>
                    <p className="mt-1 text-title-small text-on-surface">
                      {mapping.label}
                    </p>
                    <p className="mt-1 text-body-small leading-5 text-on-surface">
                      {mapping.reason}
                    </p>
                    <p className="mt-2 text-body-small leading-5 text-on-surface-variant">
                      <span className="font-medium text-on-surface">Decision state:</span>{' '}
                      {roleMappingDecisionCopy(mapping)}
                    </p>
                  </div>
                  <StatusPill value={`${mapping.confidence} confidence`} tone={mapping.confidence === 'high' ? 'positive' : mapping.confidence === 'medium' ? 'warning' : 'danger'} />
                </div>

                {mapping.matchedPaths.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-body-small text-on-surface-variant">Matched local paths</p>
                    <ul className="mt-1 grid gap-1">
                      {mapping.matchedPaths.slice(0, 6).map((path) => (
                        <li key={path} className="font-mono text-body-small leading-5 text-on-surface">
                          {path}
                        </li>
                      ))}
                    </ul>
                    {mapping.matchedPaths.length > 6 ? (
                      <p className="mt-1 text-body-small leading-5 text-on-surface-variant">
                        +{mapping.matchedPaths.length - 6} more local paths are saved in the role-mapping artifact.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-body-small leading-5 text-on-surface-variant">
                    {mapping.required
                      ? 'Next step: map this required role to the local folder name, or record a decision explaining why the project intentionally does not use it.'
                      : 'Next step: no action needed unless this optional role exists under a different local name.'}
                  </p>
                )}

                {mapping.matchedAliases.length > 0 ? (
                  <p className="mt-2 text-label-small leading-5 text-on-surface-variant">
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
    </ContentSection>
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
    <section className="rounded-md border border-outline-weak bg-surface p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-title-medium text-on-surface">Role mapping decisions</h3>
          <p className="text-body-medium text-on-surface-variant mt-1">
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
      <p className="mt-3 text-body-small leading-5 text-on-surface-variant">
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
      <p className="mt-3 text-body-small leading-5 text-on-surface-variant">
        This role is already confirmed as local project truth. No command is needed unless the structure changed.
      </p>
    );
  }

  if (mapping.status === 'ignored') {
    return (
      <p className="mt-3 text-body-small leading-5 text-on-surface-variant">
        This role is intentionally ignored for this project. Remove the decision if the structure changes later.
      </p>
    );
  }

  return (
    <div className="mt-3 rounded-md border border-outline-weak bg-surface-container p-3">
      <p className="text-body-small text-on-surface-variant">Make this explicit</p>
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
    <div className="border-t border-outline-weak pt-2 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-label-small uppercase text-on-surface-variant">
          {label}
        </p>
        <button
          type="button"
          onClick={() => {
            void copyCommand();
          }}
          className="rounded-full border border-outline-weak bg-surface-container-low px-2.5 py-1 text-label-small text-on-surface transition-colors hover:bg-primary-container"
          aria-label={`Copy ${label.toLowerCase()} command`}
        >
          {copyStatus === 'copied' ? 'Copied' : copyStatus === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
      </div>
      <p className="mt-1 break-words font-mono text-label-small leading-5 text-on-surface [overflow-wrap:anywhere]">
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
    Boolean(pack.guards) ||
    Boolean(pack.agentPrompts);

  return (
    <ContentSection
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
              <p className="text-body-small text-on-surface-variant">Dependency direction</p>
              <div className="mt-2 border-y border-outline-weak">
                {pack.dependencyDirection.map((direction, index) => (
                  <div
                    key={direction.layer}
                    className={cn('py-2.5', index > 0 ? 'border-t border-outline-weak' : undefined)}
                  >
                    <p className="font-mono text-body-small font-medium text-on-surface">
                      {direction.layer}
                    </p>
                    <p className="mt-1 text-body-small leading-5 text-on-surface">
                      May import: {direction.mayImport.length > 0 ? direction.mayImport.join(', ') : 'nothing'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {pack.forbiddenImports.length > 0 ? (
            <div>
              <p className="text-body-small text-on-surface-variant">Forbidden imports</p>
              <div className="mt-2 border-y border-outline-weak">
                {pack.forbiddenImports.map((entry, index) => (
                  <div
                    key={`${entry.from}-${entry.to.join('-')}`}
                    className={cn('py-2.5', index > 0 ? 'border-t border-outline-weak' : undefined)}
                  >
                    <p className="font-mono text-body-small font-medium text-on-surface">
                      {entry.from}
                    </p>
                    <p className="mt-1 text-body-small leading-5 text-on-surface">
                      Must not import: {entry.to.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {pack.guards ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <PackDetailList title="Required guards" items={pack.guards.required} empty="No required guards are recorded." monospace />
              <PackDetailList title="Recommended guards" items={pack.guards.recommended} empty="No recommended guards are recorded." monospace />
            </div>
          ) : null}
          {pack.agentPrompts ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <PackDetailList title="Before editing" items={pack.agentPrompts.beforeEditing} empty="No before-editing prompts are recorded." />
              <PackDetailList title="Before Readiness" items={pack.agentPrompts.beforeReadiness} empty="No pre-Readiness prompts are recorded." />
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyMessage
          title="No architecture contract"
          description="This pack has not recorded layer, dependency, guard, or agent-prompt details yet."
        />
      )}
    </ContentSection>
  );
}

export function PackGuardStatusCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  return (
    <ContentSection
      title="Guard status"
      description="Shows which verification guards Skopos resolved, which need observation Evidence, and which Actions are missing."
    >
      {pack.resolvedGuards.length > 0 ? (
        <div className="grid gap-4">
          <MetricGrid
            items={[
              {
                label: 'Available',
                value: pack.guardCounts.available,
                helper: 'Project commands Skopos can run or ask the agent to run.',
              },
              {
                label: 'Manual proof',
                value: pack.guardCounts.manual,
                helper: 'Checks the agent must inspect and explain clearly.',
              },
              {
                label: 'Missing',
                value: pack.guardCounts.missing,
                helper: pack.guardCounts.missingRequired > 0
                  ? 'Required commands are missing from package scripts.'
                  : 'Recommended commands not found in package scripts.',
              },
            ]}
          />
          <div className={skoposListSurfaceClass}>
            {pack.resolvedGuards.map((guard, index) => (
              <article
                key={guard.id}
                className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-title-medium text-on-surface">{guard.label}</h3>
                    <p className="text-body-medium text-on-surface-variant mt-1">{guard.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusPill value={humanize(guard.status)} tone={guardStatusTone(guard)} />
                    <StatusPill value={humanize(guard.strength)} tone={guard.strength === 'required' ? 'warning' : 'neutral'} />
                  </div>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <SmallFact label="Kind" value={humanize(guard.kind)} />
                  <SmallFact label="Evidence" value={guard.command ?? guard.missingReason ?? 'Agent must inspect and explain.'} monospace={Boolean(guard.command)} />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <EmptyMessage
          title="No resolved Guard status"
          description="Apply this pack, then refresh Skopos so project Guards can be resolved."
        />
      )}
    </ContentSection>
  );
}

export function PackRulesCard({
  pack,
}: {
  pack: PolicyPackDetail;
}): React.JSX.Element {
  return (
    <ContentSection
      title="Rules inside this pack"
      description="The active rules this accepted pack contributes to planning, implementation, and closure."
    >
      {pack.rules.length > 0 ? (
        <div className={skoposListSurfaceClass}>
          {pack.rules.map((rule, index) => (
            <Link
              key={rule.id}
              to="/rules/packs/$packId/rules/$ruleId"
              params={{ packId: pack.packId, ruleId: rule.id }}
              className={getSkoposListRowClass({ bordered: index > 0, interactive: true })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-title-medium text-on-surface">{rule.title}</h3>
                  <p className="text-body-medium text-on-surface-variant mt-1">{rule.summary}</p>
                </div>
                <StatusPill value={rule.severity} tone={severityTone(rule.severity)} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-body-small text-primary">
                <span>Open complete rule</span>
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No active rules"
          description="This accepted pack is not contributing active rules in the current resolved policy."
        />
      )}
    </ContentSection>
  );
}

export function ActiveRulesCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  return (
    <ContentSection
      title="Active rules"
      description="The concrete rules agents should consider during planning, implementation, and closure."
    >
      {totalRuleCount(context) > 0 ? (
        <div className="grid gap-5">
          <RuleGroup title="Must follow" severity="must" rules={context.mustRules} context={context} />
          <RuleGroup title="Should follow" severity="should" rules={context.shouldRules} context={context} />
          <RuleGroup title="Advisory guidance" severity="advisory" rules={context.advisoryRules} context={context} />
        </div>
      ) : (
        <EmptyMessage
          title="No active rules"
          description="Accepted packs are required before Skopos can show active project rules."
        />
      )}
    </ContentSection>
  );
}

export function PolicyRuleInspectorAside({
  detail,
}: {
  detail: PolicyRuleDetailContext;
}): React.JSX.Element {
  const openDriftCount = detail.driftFindings.filter((finding) => finding.status === 'open').length;

  return (
    <>
      <SidebarCard title="At a glance">
        <KeyValueList
          layout="stacked"
          items={[
            { label: 'Severity', value: humanize(detail.rule.severity) },
            { label: 'Rule pack', value: detail.pack.displayName },
            { label: 'Applies to', value: `${detail.rule.appliesTo.length} areas` },
            { label: 'Rule checks', value: String(detail.rule.checkIds?.length ?? 0) },
            { label: 'Open drift', value: String(openDriftCount) },
            { label: 'Exceptions', value: String(detail.overrides.length) },
          ]}
        />
      </SidebarCard>
      <SidebarCard title="Source" collapsible defaultOpen={false}>
        <KeyValueList
          layout="stacked"
          items={[
            { label: 'Rule ID', value: detail.rule.id, monospace: true },
            { label: 'Pack ID', value: detail.pack.packId, monospace: true },
            ...(detail.pack.manifestPath
              ? [{ label: 'Manifest', value: detail.pack.manifestPath, monospace: true }]
              : []),
          ]}
        />
      </SidebarCard>
    </>
  );
}

export function PolicyRuleMeaningCard({
  detail,
}: {
  detail: PolicyRuleDetailContext;
}): React.JSX.Element {
  return (
    <ContentSection title="What this rule asks" description={detail.rule.summary}>
      <div className="border-y border-outline-weak py-4">
        <p className="text-label-small uppercase text-on-surface-variant">
          Why it matters
        </p>
        <p className="mt-1.5 text-body-medium leading-6 text-on-surface">
          {detail.rule.rationale ??
            'This accepted rule contributes to the project guidance agents should preserve.'}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {detail.rule.appliesTo.map((area) => (
          <StatusPill key={area} value={area} tone="neutral" />
        ))}
      </div>
    </ContentSection>
  );
}

export function PolicyRuleExamplesCard({
  detail,
}: {
  detail: PolicyRuleDetailContext;
}): React.JSX.Element {
  return (
    <ContentSection
      title="What good implementation looks like"
      description="Concrete examples and warning signs from the accepted policy source."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <RuleExampleList
          title="Good examples"
          items={detail.rule.examples ?? []}
          empty="This rule does not record a concrete example yet."
        />
        <RuleExampleList
          title="Avoid"
          items={detail.rule.antiPatterns ?? []}
          empty="This rule does not record an anti-pattern yet."
        />
      </div>
    </ContentSection>
  );
}

export function PolicyRuleProjectStatusCard({
  detail,
}: {
  detail: PolicyRuleDetailContext;
}): React.JSX.Element {
  const hasRecordedState = detail.driftFindings.length > 0 || detail.overrides.length > 0;

  return (
    <ContentSection
      title="Current project status"
      description="Recorded drift and accepted exceptions for this exact rule. No drift is not the same as independent proof of compliance."
    >
      {hasRecordedState ? (
        <div className={skoposListSurfaceClass}>
          {detail.driftFindings.map((finding, index) => (
            <article
              key={finding.id}
              className={getSkoposListRowClass({ bordered: index > 0, interactive: false })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-title-small text-on-surface">{finding.summary}</p>
                  <p className="mt-1 text-body-small text-on-surface-variant">
                    {finding.remediation[0] ?? 'Review the recorded Evidence before changing this rule.'}
                  </p>
                </div>
                <StatusPill value={finding.status} tone={finding.status === 'open' ? severityTone(finding.severity) : 'positive'} />
              </div>
            </article>
          ))}
          {detail.overrides.map((override, index) => (
            <article
              key={override.id}
              className={getSkoposListRowClass({ bordered: detail.driftFindings.length + index > 0, interactive: false })}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-title-small text-on-surface">Accepted exception</p>
                  <p className="mt-1 text-body-small text-on-surface-variant">{override.reason}</p>
                </div>
                <StatusPill value={override.severity ? `downgrade to ${override.severity}` : 'suppressed'} tone="warning" />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyMessage
          title="No recorded drift or exception"
          description="Skopos has not recorded a mismatch or local exception for this rule. Use the listed checks and Task Evidence when you need fresh proof."
        />
      )}
    </ContentSection>
  );
}

export function PolicyRuleEnforcementCard({
  detail,
}: {
  detail: PolicyRuleDetailContext;
}): React.JSX.Element {
  return (
    <ContentSection
      title="How Skopos checks it"
      description="Rule-specific drift checks and the broader Guards contributed by its pack. Pack Guards may protect several rules."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <RuleExampleList
          title="Rule checks"
          items={detail.rule.checkIds ?? []}
          empty="No automated drift check is attached to this rule yet."
          monospace
        />
        <div>
          <p className="text-label-small uppercase text-on-surface-variant">
            Pack Guards
          </p>
          {detail.packGuards.length > 0 ? (
            <ul className="mt-2 border-y border-outline-weak">
              {detail.packGuards.map((guard, index) => (
                <li key={guard.id} className={index > 0 ? 'border-t border-outline-weak py-3' : 'py-3'}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-body-small font-medium text-on-surface">{guard.label}</p>
                    <StatusPill value={humanize(guard.status)} tone={guardStatusTone(guard)} />
                  </div>
                  <p className="mt-1 text-body-small text-on-surface-variant">{guard.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-body-small text-on-surface-variant">
              This pack has no resolved project Guards yet.
            </p>
          )}
        </div>
      </div>
    </ContentSection>
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
    <ContentSection
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
                  <h3 className="text-title-medium text-on-surface">{finding.summary}</h3>
                  <p className="text-body-medium text-on-surface-variant mt-1">
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
                    <li key={item} className="text-body-small leading-5 text-on-surface">
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
    </ContentSection>
  );
}

export function LocalExceptionsCard({
  context,
}: {
  context: PolicyViewContext;
}): React.JSX.Element {
  return (
    <ContentSection
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
                  <h3 className="text-title-medium text-on-surface">{override.reason}</h3>
                  <p className="text-body-medium text-on-surface-variant mt-1">
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
    </ContentSection>
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
        'border-t border-outline-weak py-3',
        depth > 0 ? 'ml-5 pl-4' : undefined,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-body-small font-medium text-on-surface">{node.path}</p>
            <StatusPill value={node.status} tone={structureStatusTone(node.status)} />
          </div>
          <p className="mt-1 text-title-small text-on-surface">
            {node.label}
          </p>
          <p className="mt-1 text-body-small leading-5 text-on-surface">
            {node.responsibility}
          </p>
        </div>
      </div>
      {node.matchedPaths.length > 0 ? (
        <div className="mt-2">
          <p className="text-body-small text-on-surface-variant">Found in this project</p>
          <ul className="mt-1 grid gap-1">
            {node.matchedPaths.slice(0, 6).map((path) => (
              <li key={path} className="font-mono text-body-small leading-5 text-on-surface">
                {path}
              </li>
            ))}
          </ul>
          {node.matchedPatterns.length > 0 ? (
            <p className="mt-1 text-label-small leading-5 text-on-surface-variant">
              Matched aliases: {node.matchedPatterns.slice(0, 4).join(', ')}
              {node.matchedPatterns.length > 4 ? `, +${node.matchedPatterns.length - 4} more` : ''}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-body-small leading-5 text-on-surface-variant">
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
    <div className="mt-4 border-y border-outline-weak py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-title-medium text-on-surface">Verify against the codebase</h3>
          <p className="text-body-medium text-on-surface-variant mt-1">
            Check these signs in the actual folder tree, docs, commands, and source code before readinessing the pack blindly.
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
      <p className="text-body-small text-on-surface-variant">Rules to review inside this pack</p>
      <div className="mt-2 grid gap-2">
        {pack.rules.slice(0, 4).map((rule) => (
          <div key={rule.id} className="border-t border-outline-weak pt-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-label-medium text-on-surface">
                {rule.title}
              </p>
              <StatusPill value={rule.severity} tone={severityTone(rule.severity)} />
            </div>
            <p className="mt-1 text-body-small leading-5 text-on-surface">
              {rule.summary}
            </p>
            {rule.examples && rule.examples.length > 0 ? (
              <p className="mt-1 text-body-small leading-5 text-on-surface-variant">
                Example: {rule.examples[0]}
              </p>
            ) : null}
            {rule.antiPatterns && rule.antiPatterns.length > 0 ? (
              <p className="mt-1 text-body-small leading-5 text-on-surface-variant">
                Avoid: {rule.antiPatterns[0]}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      {pack.rules.length > 4 ? (
        <p className="mt-2 text-body-small leading-5 text-on-surface-variant">
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
      <p className="text-body-small text-on-surface-variant">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2">
          {items.slice(0, 5).map((item) => (
            <li key={`${item.signal}-${item.evidence}`} className="text-body-small leading-5 text-on-surface">
              <span className="font-medium text-on-surface">{item.evidence}</span>
              <span className="text-on-surface-variant"> - {item.signal} ({item.confidence})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-body-small leading-5 text-on-surface-variant">{empty}</p>
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
      <p className="text-body-small text-on-surface-variant">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-1.5">
          {items.slice(0, 5).map((item) => (
            <li
              key={item}
              className={cn(
                'text-body-small leading-5 text-on-surface [overflow-wrap:anywhere]',
                monospace ? 'font-mono' : undefined,
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-body-small leading-5 text-on-surface-variant">{empty}</p>
      )}
    </div>
  );
}

function RuleGroup({
  title,
  severity,
  rules,
  context,
}: {
  title: string;
  severity: SkoposPolicySeverity;
  rules: PolicyViewContext['mustRules'];
  context: PolicyViewContext;
}): React.JSX.Element | null {
  if (rules.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-title-medium text-on-surface">{title}</h3>
        <StatusPill value={`${rules.length}`} tone={severityTone(severity)} />
      </div>
      <div className={skoposListSurfaceClass}>
        {rules.map((rule, index) => (
          <RuleSummaryLink
            key={rule.id}
            rule={rule}
            packId={context.packDetails.find((pack) =>
              pack.rules.some((packRule) => packRule.id === rule.id),
            )?.packId}
            bordered={index > 0}
          />
        ))}
      </div>
    </section>
  );
}

function RuleSummaryLink({
  rule,
  packId,
  bordered,
}: {
  rule: PolicyViewContext['mustRules'][number];
  packId?: string;
  bordered: boolean;
}): React.JSX.Element {
  const content = (
    <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-title-small">{rule.title}</p>
                <p className="text-body-medium text-on-surface-variant mt-1">{rule.summary}</p>
              </div>
              <StatusPill value={rule.severity} tone={severityTone(rule.severity)} />
            </div>
            {packId ? (
              <p className="mt-1.5 text-body-small font-medium text-primary">Open complete rule →</p>
            ) : null}
    </>
  );

  if (!packId) {
    return (
      <article className={getSkoposListRowClass({ compact: true, bordered, interactive: false })}>
        {content}
      </article>
    );
  }

  return (
    <Link
      to="/rules/packs/$packId/rules/$ruleId"
      params={{ packId, ruleId: rule.id }}
      className={getSkoposListRowClass({ compact: true, bordered, interactive: true })}
    >
      {content}
    </Link>
  );
}

function RuleExampleList({
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
      <p className="text-label-small uppercase text-on-surface-variant">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 border-y border-outline-weak">
          {items.map((item, index) => (
            <li
              key={item}
              className={cn(
                index > 0 ? 'border-t border-outline-weak py-3' : 'py-3',
                'text-body-small leading-5 text-on-surface',
                monospace ? 'font-mono' : undefined,
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-body-small leading-5 text-on-surface-variant">{empty}</p>
      )}
    </div>
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
    <div className="border-t border-outline-weak pt-3">
      <p className="text-label-small uppercase text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 text-body-small text-on-surface">
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
    <div className="border-t border-outline-weak pt-2">
      <p className="text-body-small text-on-surface-variant">{label}</p>
      <p
        className={cn(
          'mt-1 break-words text-body-small leading-5 text-on-surface [overflow-wrap:anywhere]',
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

const guardStatusTone = (
  guard: PolicyPackDetail['resolvedGuards'][number],
): 'neutral' | 'positive' | 'warning' | 'danger' | 'info' => {
  switch (guard.status) {
    case 'available':
      return 'positive';
    case 'manual':
      return 'info';
    case 'missing':
      return guard.strength === 'required' ? 'danger' : 'warning';
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
