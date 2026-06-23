import type {
  SkoposUiConsoleArtifactEntry,
  SkoposUiConsoleArtifactMetric,
  SkoposUiConsoleArtifactSection,
  SkoposUiConsoleDocumentView,
  SkoposUiConsoleLink,
} from '../../contracts/skopos-ui-console-state.js';
import { documentLifecycleForDisplayPath } from '../../support/knowledge/document-routing.js';

export const buildJsonArtifactDocumentView = ({
  link,
  raw,
  updatedAt,
}: {
  link: SkoposUiConsoleLink;
  raw: string;
  updatedAt?: string;
}): SkoposUiConsoleDocumentView => {
  const parsed = parseJsonValue(raw);
  const artifactView = parsed
    ? buildStructuredArtifactView({
        link,
        parsed,
        raw,
      })
    : buildGenericFallbackArtifactView({
        raw,
      });

  return {
    id: link.id,
    title: link.title,
    kind: link.kind,
    format: 'json',
    lifecycle: documentLifecycleForDisplayPath(link.displayPath),
    href: link.href,
    displayPath: link.displayPath,
    exists: link.exists,
    summary:
      artifactView.summary ??
      'Structured generated or compiled state exposed through the console.',
    excerpt: compactWhitespace(raw).slice(0, 320),
    headings: artifactView.sections.map((section) => section.title).slice(0, 8),
    sections: [],
    artifactView,
    updatedAt,
  };
};

const buildStructuredArtifactView = ({
  link,
  parsed,
  raw,
}: {
  link: SkoposUiConsoleLink;
  parsed: unknown;
  raw: string;
}): NonNullable<SkoposUiConsoleDocumentView['artifactView']> => {
  const artifactKind = detectArtifactKind(link, parsed);

  switch (artifactKind) {
    case 'architecture':
      return buildArchitectureArtifactView(parsed, raw);
    case 'bootstrap':
      return buildBootstrapArtifactView(parsed, raw);
    case 'diagnosis':
      return buildDiagnosisArtifactView(parsed, raw);
    case 'index':
      return buildIndexArtifactView(parsed, raw);
    default:
      return buildGenericStructuredArtifactView(parsed, raw);
  }
};

const buildArchitectureArtifactView = (
  parsed: unknown,
  raw: string,
): NonNullable<SkoposUiConsoleDocumentView['artifactView']> => {
  const record = asRecord(parsed);
  const current = asRecord(record.current);
  const recommended = asRecord(record.recommended);
  const currentUnits = asArrayOfRecords(current.units);
  const recommendedUnits = asArrayOfRecords(recommended.units);
  const currentEvidence = asStringArray(current.evidence);
  const recommendedEvidence = asStringArray(recommended.evidence);

  return {
    kind: 'architecture',
    summary:
      readString(record.summary) ??
      'Compiled architecture interpretation for the current workspace.',
    metrics: compactMetrics([
      metric('Alignment', readString(record.alignmentStatus), toneForState(readString(record.alignmentStatus))),
      metric('Repo mode', readString(record.repoMode)),
      metric('Archetype', readString(record.archetypeSuggestion)),
      metric('Units', countValue(currentUnits.length || recommendedUnits.length)),
    ]),
    sections: [
      keyValueSection(
        'current',
        'Current architecture',
        'Current workspace posture and boundary reading.',
        compactItems([
          item('Topology', readString(current.topology)),
          item('Boundary quality', readString(current.boundaryQuality)),
          item('Summary', readString(current.summary)),
        ]),
      ),
      ...(currentUnits.length > 0
        ? [
            entriesSection(
              'current-units',
              'Current units',
              'Detected workspace and package boundaries.',
              currentUnits.map((unit) => ({
                title: readString(unit.title) ?? readString(unit.scopeId) ?? 'Unnamed unit',
                summary: readString(unit.summary),
                meta: compactParts([
                  readString(unit.role),
                  readString(unit.confidence),
                  readString(unit.path),
                ]),
              })),
            ),
          ]
        : []),
      keyValueSection(
        'recommended',
        'Recommended target',
        'Recommended architecture target for the same workspace.',
        compactItems([
          item('Topology', readString(recommended.topology)),
          item('Boundary quality', readString(recommended.boundaryQuality)),
          item('Summary', readString(recommended.summary)),
        ]),
      ),
      ...(recommendedUnits.length > 0 && !sameUnitSet(currentUnits, recommendedUnits)
        ? [
            entriesSection(
              'recommended-units',
              'Recommended units',
              'Recommended canonical boundaries when they differ from the current shape.',
              recommendedUnits.map((unit) => ({
                title: readString(unit.title) ?? readString(unit.scopeId) ?? 'Unnamed unit',
                summary: readString(unit.summary),
                meta: compactParts([
                  readString(unit.role),
                  readString(unit.confidence),
                  readString(unit.path),
                ]),
              })),
            ),
          ]
        : []),
      ...listSectionIfAny(
        'evidence',
        'Architecture evidence',
        'Signals used to produce the current and recommended architecture reading.',
        [...currentEvidence, ...recommendedEvidence.filter((entry) => !currentEvidence.includes(entry))],
      ),
      jsonSection(raw),
    ],
  };
};

const buildBootstrapArtifactView = (
  parsed: unknown,
  raw: string,
): NonNullable<SkoposUiConsoleDocumentView['artifactView']> => {
  const record = asRecord(parsed);
  const detected = asRecord(record.detected);
  const docsRoots = asStringArray(detected.docsRoots);
  const ignoredPaths = asStringArray(detected.ignoredPaths);
  const docsHealth = asRecord(detected.docsHealth);
  const sourceDependencies = asArrayOfRecords(detected.sourceDependencies);

  return {
    kind: 'bootstrap',
    summary:
      readString(record.summary) ??
      'Bootstrap scan and starter configuration posture for the current workspace.',
    metrics: compactMetrics([
      metric('Mode', readString(record.mode)),
      metric('Docs roots', countValue(docsRoots.length)),
      metric('Ignored paths', countValue(ignoredPaths.length)),
      metric('Source surfaces', countValue(sourceDependencies.length)),
    ]),
    sections: [
      keyValueSection(
        'workspace-bootstrap',
        'Workspace bootstrap',
        'Top-level bootstrap posture for the current workspace.',
        compactItems([
          item('Mode', readString(record.mode)),
          item('Workspace root', readString(record.workspaceRoot), true),
          item('Root package', booleanLabel(detected.hasRootPackageJson)),
          item('pnpm workspace', booleanLabel(detected.hasPnpmWorkspace)),
          item('Docs roots', docsRoots.join(', ')),
        ]),
      ),
      keyValueSection(
        'docs-health',
        'Docs health',
        'Current docs-root status seen during bootstrap.',
        compactItems([
          item('Root', readString(docsHealth.root)),
          item('Start here', booleanLabel(docsHealth.hasStartHere)),
          item('Markdown files', countValue(readNumber(docsHealth.markdownFileCount))),
          item('Tracked freshness', countValue(readNumber(docsHealth.freshnessTrackedCount))),
          item('Stale docs', countValue(asArray(docsHealth.staleDocPaths).length)),
        ]),
      ),
      ...listSectionIfAny(
        'ignored-paths',
        'Ignored paths',
        'Paths intentionally excluded from the bootstrap scan.',
        ignoredPaths,
      ),
      ...entriesSectionIfAny(
        'source-dependencies',
        'Source surfaces',
        'Instruction, config, and docs sources contributing to the bootstrap artifact.',
        summarizeSourceDependencies(sourceDependencies),
      ),
      jsonSection(raw),
    ],
  };
};

const buildDiagnosisArtifactView = (
  parsed: unknown,
  raw: string,
): NonNullable<SkoposUiConsoleDocumentView['artifactView']> => {
  const record = asRecord(parsed);
  const findings = asArrayOfRecords(record.findings);
  const remediationMissions = asArrayOfRecords(record.remediationMissions);

  return {
    kind: 'diagnosis',
    summary:
      readString(record.summary) ?? 'Pattern and remediation report for the current workspace.',
    metrics: compactMetrics([
      metric('Health', readString(record.health), toneForState(readString(record.health))),
      metric('Confidence', readString(record.confidence)),
      metric('Findings', countValue(findings.length)),
      metric('Remediations', countValue(remediationMissions.length)),
    ]),
    sections: [
      keyValueSection(
        'diagnosis-posture',
        'Diagnosis posture',
        'Workspace-wide diagnosis state and confidence.',
        compactItems([
          item('Health', readString(record.health)),
          item('Repo mode', readString(record.repoMode)),
          item('Archetype', readString(record.archetypeSuggestion)),
          item('Package count', countValue(readNumber(record.packageCount))),
          item('Workspace packages', countValue(readNumber(record.workspacePackageCount))),
        ]),
      ),
      ...entriesSectionIfAny(
        'findings',
        'Findings',
        'Current structural or governance findings detected in the workspace.',
        findings.map((finding) => ({
          title: readString(finding.id) ?? readString(finding.family) ?? 'Finding',
          summary: readString(finding.summary),
          meta: compactParts([
            readString(finding.classification),
            readString(finding.severity),
            readString(finding.confidence),
            countLabel(asArray(finding.evidence).length, 'signal'),
          ]),
          badge: readString(finding.severity),
          tone: toneForState(readString(finding.severity)),
        })),
      ),
      ...entriesSectionIfAny(
        'remediation',
        'Remediation missions',
        'Recommended or linked missions for diagnosis follow-up.',
        remediationMissions.map((mission) => ({
          title: readString(mission.title) ?? readString(mission.id) ?? 'Mission',
          summary: readString(mission.summary),
          meta: compactParts([
            readString(mission.status),
            readString(mission.updatedAt),
          ]),
          badge: readString(mission.status),
          tone: toneForState(readString(mission.status)),
        })),
      ),
      jsonSection(raw),
    ],
  };
};

const buildIndexArtifactView = (
  parsed: unknown,
  raw: string,
): NonNullable<SkoposUiConsoleDocumentView['artifactView']> => {
  const record = asRecord(parsed);
  const counts = asRecord(record.counts);
  const quickLinks = asRecord(record.quickLinks);
  const latestEvent = asRecord(record.latestEvent);
  const entries = asArrayOfRecords(record.entries);

  return {
    kind: 'index',
    summary:
      readString(record.summary) ?? 'Compiled knowledge index for the current workspace.',
    metrics: compactMetrics([
      metric('Readiness', readString(record.readiness), toneForState(readString(record.readiness))),
      metric('Trust', readString(record.trustLevel), toneForState(readString(record.trustLevel))),
      metric('Plans', countValue(readNumber(counts.planCount))),
      metric('Missions', countValue(readNumber(counts.missionCount))),
    ]),
    sections: [
      keyValueSection(
        'runtime-summary',
        'Runtime summary',
        'High-signal index posture for the current workspace.',
        compactItems([
          item('Readiness', readString(record.readiness)),
          item('Trust level', readString(record.trustLevel)),
          item('Docs root', readString(record.docsRoot)),
          item('Workspace root', readString(record.workspaceRoot), true),
        ]),
      ),
      keyValueSection(
        'counts',
        'Catalog counts',
        'Compiled object counts available through the knowledge index.',
        compactItems([
          item('Packages', countValue(readNumber(counts.packageCount))),
          item('Workspace packages', countValue(readNumber(counts.workspacePackageCount))),
          item('Scopes', countValue(readNumber(counts.scopeCount))),
          item('Graphs', countValue(readNumber(counts.graphCount))),
          item('Plans', countValue(readNumber(counts.planCount))),
          item('Missions', countValue(readNumber(counts.missionCount))),
          item('Workflow runs', countValue(readNumber(counts.workflowRunCount))),
          item('Workflow manifests', countValue(readNumber(counts.workflowManifestCount))),
          item('Overrides', countValue(readNumber(counts.overrideEntryCount))),
        ]),
      ),
      keyValueSection(
        'quick-links',
        'Quick links',
        'Canonical source paths exposed directly by the knowledge index.',
        compactItems([
          item('Config', readString(quickLinks.configPath), true),
          item('Bootstrap', readString(quickLinks.bootstrapPath), true),
          item('Docs start', readString(quickLinks.docsStartHerePath), true),
          item('Log', readString(quickLinks.logPath), true),
        ]),
      ),
      keyValueSection(
        'latest-event',
        'Latest event',
        'Most recent event captured in the compiled knowledge snapshot.',
        compactItems([
          item('Kind', readString(latestEvent.eventKind)),
          item('Status', readString(latestEvent.status)),
          item('When', readString(latestEvent.timestamp)),
          item('Summary', readString(latestEvent.summary)),
        ]),
      ),
      ...entriesSectionIfAny(
        'entries',
        'Important entries',
        'High-signal catalog entries exposed by the knowledge index.',
        entries.slice(0, 12).map((entry) => ({
          title: readString(entry.title) ?? readString(entry.id) ?? 'Entry',
          summary: readString(entry.summary),
          meta: compactParts([
            readString(entry.kind),
            readString(entry.path),
            readString(entry.updatedAt),
          ]),
        })),
      ),
      jsonSection(raw),
    ],
  };
};

const buildGenericStructuredArtifactView = (
  parsed: unknown,
  raw: string,
): NonNullable<SkoposUiConsoleDocumentView['artifactView']> => {
  if (Array.isArray(parsed)) {
    const entries = parsed.slice(0, 12).map((value, index) => ({
      title: `Entry ${index + 1}`,
      summary: summarizeUnknownValue(value),
    }));

    return {
      kind: 'generic',
      summary: 'Structured JSON artifact exposed through the console.',
      metrics: compactMetrics([metric('Items', countValue(parsed.length))]),
      sections: [
        ...entriesSectionIfAny(
          'items',
          'Items',
          'Top-level entries captured in the JSON artifact.',
          entries,
        ),
        jsonSection(raw),
      ],
    };
  }

  const record = asRecord(parsed);
  const primitiveItems = compactItems(
    Object.entries(record)
      .filter(([, value]) => isPrimitiveValue(value))
      .map(([key, value]) => item(humanizeKey(key), stringifyValue(value))),
  );
  const nestedEntries = Object.entries(record)
    .filter(([, value]) => isPlainObject(value))
    .map(([key, value]) => ({
      title: humanizeKey(key),
      summary: summarizeObjectValue(asRecord(value)),
      meta: countLabel(Object.keys(asRecord(value)).length, 'field'),
    }));
  const collectionEntries = Object.entries(record)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => {
      const collection = asArray(value);

      return {
      title: humanizeKey(key),
      summary: summarizeArrayValue(collection),
      meta: countLabel(collection.length, 'item'),
    };
    });

  return {
    kind: 'generic',
    summary:
      readString(record.summary) ?? 'Structured JSON artifact exposed through the console.',
    metrics: compactMetrics([
      metric('Type', readString(record.type)),
      metric('Status', readString(record.status), toneForState(readString(record.status))),
      metric('Authority', readString(record.authority)),
      metric('Top-level keys', countValue(Object.keys(record).length)),
    ]),
    sections: [
      ...(primitiveItems.length > 0
        ? [
            keyValueSection(
              'fields',
              'Top-level fields',
              'Primitive fields exposed at the top level of the artifact.',
              primitiveItems,
            ),
          ]
        : []),
      ...entriesSectionIfAny(
        'objects',
        'Structured objects',
        'Nested object surfaces with their primary fields.',
        nestedEntries,
      ),
      ...entriesSectionIfAny(
        'collections',
        'Collections',
        'Top-level arrays and their current item counts.',
        collectionEntries,
      ),
      jsonSection(raw),
    ],
  };
};

const buildGenericFallbackArtifactView = ({
  raw,
}: {
  raw: string;
}): NonNullable<SkoposUiConsoleDocumentView['artifactView']> => ({
  kind: 'generic',
  summary: 'Raw JSON or JSONL artifact exposed through the console.',
  metrics: [],
  sections: [jsonSection(raw, 'Raw content', 'This artifact could not be structured automatically.')],
});

const parseJsonValue = (raw: string): unknown => {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

const detectArtifactKind = (
  link: Pick<SkoposUiConsoleLink, 'id' | 'displayPath'>,
  parsed: unknown,
): NonNullable<SkoposUiConsoleDocumentView['artifactView']>['kind'] => {
  const record = asRecord(parsed);
  const normalizedType = readString(record.type)?.toLowerCase();
  const normalizedId = readString(record.id)?.toLowerCase();
  const normalizedPath = link.displayPath.toLowerCase().split('\\').join('/');

  if (
    normalizedType === 'architecture' ||
    normalizedId === 'architecture' ||
    normalizedPath.endsWith('/architecture.json')
  ) {
    return 'architecture';
  }

  if (
    normalizedType === 'bootstrap' ||
    normalizedId === 'bootstrap' ||
    normalizedPath.endsWith('/bootstrap.json')
  ) {
    return 'bootstrap';
  }

  if (
    normalizedType === 'diagnosis' ||
    normalizedId === 'diagnosis' ||
    normalizedPath.endsWith('/diagnosis.json')
  ) {
    return 'diagnosis';
  }

  if (
    normalizedType === 'index' ||
    normalizedId === 'knowledge-index' ||
    normalizedPath.endsWith('/index.json')
  ) {
    return 'index';
  }

  return 'generic';
};

const summarizeSourceDependencies = (
  dependencies: Array<Record<string, unknown>>,
): SkoposUiConsoleArtifactEntry[] => {
  const grouped = new Map<string, Array<Record<string, unknown>>>();

  for (const dependency of dependencies) {
    const kind = readString(dependency.kind) ?? 'unknown';
    const group = grouped.get(kind);

    if (group) {
      group.push(dependency);
    } else {
      grouped.set(kind, [dependency]);
    }
  }

  return [...grouped.entries()]
    .sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]))
    .map(([kind, items]) => ({
      title: humanizeKey(kind),
      summary: countLabel(items.length, 'source'),
      meta: items
        .slice(0, 3)
        .map((item) => readString(item.path))
        .filter((value): value is string => Boolean(value))
        .join(' · '),
    }));
};

const sameUnitSet = (left: Array<Record<string, unknown>>, right: Array<Record<string, unknown>>): boolean =>
  JSON.stringify(
    left.map((item) => ({
      scopeId: readString(item.scopeId),
      title: readString(item.title),
      role: readString(item.role),
      path: readString(item.path),
    })),
  ) ===
  JSON.stringify(
    right.map((item) => ({
      scopeId: readString(item.scopeId),
      title: readString(item.title),
      role: readString(item.role),
      path: readString(item.path),
    })),
  );

const keyValueSection = (
  id: string,
  title: string,
  description: string,
  items: Array<{ label: string; value: string; monospace?: boolean }>,
): SkoposUiConsoleArtifactSection => ({
  id,
  title,
  description,
  layout: 'key-value',
  items,
});

const entriesSection = (
  id: string,
  title: string,
  description: string,
  entries: SkoposUiConsoleArtifactEntry[],
): SkoposUiConsoleArtifactSection => ({
  id,
  title,
  description,
  layout: 'entries',
  entries,
});

const entriesSectionIfAny = (
  id: string,
  title: string,
  description: string,
  entries: SkoposUiConsoleArtifactEntry[],
): SkoposUiConsoleArtifactSection[] => (entries.length > 0 ? [entriesSection(id, title, description, entries)] : []);

const listSectionIfAny = (
  id: string,
  title: string,
  description: string,
  items: string[],
): SkoposUiConsoleArtifactSection[] =>
  items.length > 0
    ? [
        {
          id,
          title,
          description,
          layout: 'list',
          listItems: items,
        },
      ]
    : [];

const jsonSection = (
  raw: string,
  title = 'Raw JSON',
  description = 'Raw source preview remains available here. Use the source link for the full artifact payload.',
): SkoposUiConsoleArtifactSection => ({
  id: 'raw-json',
  title,
  description,
  layout: 'json',
  code: trimLargeCodeBlock(raw),
  defaultExpanded: false,
});

const metric = (
  label: string,
  value?: string,
  tone?: SkoposUiConsoleArtifactMetric['tone'],
  monospace = false,
): SkoposUiConsoleArtifactMetric | undefined =>
  value
    ? {
        label,
        value,
        tone,
        monospace,
      }
    : undefined;

const compactMetrics = (
  metrics: Array<SkoposUiConsoleArtifactMetric | undefined>,
): SkoposUiConsoleArtifactMetric[] => metrics.filter((metricValue): metricValue is SkoposUiConsoleArtifactMetric => Boolean(metricValue));

const item = (
  label: string,
  value?: string,
  monospace = false,
): { label: string; value: string; monospace?: boolean } | undefined =>
  value
    ? {
        label,
        value,
        monospace,
      }
    : undefined;

const compactItems = (
  items: Array<{ label: string; value: string; monospace?: boolean } | undefined>,
): Array<{ label: string; value: string; monospace?: boolean }> =>
  items.filter((entry): entry is { label: string; value: string; monospace?: boolean } => Boolean(entry));

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const asArrayOfRecords = (value: unknown): Array<Record<string, unknown>> =>
  asArray(value).map(asRecord).filter((entry) => Object.keys(entry).length > 0);

const asStringArray = (value: unknown): string[] =>
  asArray(value)
    .map((entry) => readString(entry))
    .filter((entry): entry is string => Boolean(entry));

const readString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return undefined;
};

const readNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const isPrimitiveValue = (value: unknown): boolean =>
  value == null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const isPlainObject = (value: unknown): boolean =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const stringifyValue = (value: unknown): string => {
  if (value == null) {
    return '—';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return compactWhitespace(JSON.stringify(value));
};

const summarizeUnknownValue = (value: unknown): string => {
  if (isPrimitiveValue(value)) {
    return stringifyValue(value);
  }

  if (Array.isArray(value)) {
    return summarizeArrayValue(value);
  }

  return summarizeObjectValue(asRecord(value));
};

const summarizeObjectValue = (value: Record<string, unknown>): string => {
  const summary = readString(value.summary);
  if (summary) {
    return summary;
  }

  const title = readString(value.title) ?? readString(value.name) ?? readString(value.id);
  const detail = compactParts(
    Object.entries(value)
      .filter(([, candidate]) => isPrimitiveValue(candidate))
      .slice(0, 3)
      .map(([key, candidate]) => `${humanizeKey(key)}: ${stringifyValue(candidate)}`),
  );

  return compactParts([title, detail]) ?? `${countLabel(Object.keys(value).length, 'field')} available`;
};

const summarizeArrayValue = (value: unknown[]): string => {
  if (value.length === 0) {
    return 'No items';
  }

  const preview = value
    .slice(0, 3)
    .map((entry) => summarizeUnknownValue(entry))
    .join(' · ');

  return compactParts([countLabel(value.length, 'item'), preview]) ?? countLabel(value.length, 'item');
};

const toneForState = (
  value?: string,
): SkoposUiConsoleArtifactMetric['tone'] => {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return 'neutral';
  }

  if (
    normalized.includes('fail') ||
    normalized.includes('error') ||
    normalized.includes('danger') ||
    normalized.includes('missing')
  ) {
    return 'danger';
  }

  if (
    normalized.includes('warning') ||
    normalized.includes('needs-review') ||
    normalized.includes('medium')
  ) {
    return 'warning';
  }

  if (
    normalized.includes('pass') ||
    normalized.includes('aligned') ||
    normalized.includes('healthy') ||
    normalized.includes('available') ||
    normalized.includes('high') ||
    normalized.includes('canonical')
  ) {
    return 'positive';
  }

  if (normalized.includes('generated') || normalized.includes('json')) {
    return 'info';
  }

  return 'neutral';
};

const booleanLabel = (value: unknown): string | undefined =>
  typeof value === 'boolean' ? (value ? 'Yes' : 'No') : undefined;

const countValue = (value?: number): string | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? String(value) : undefined;

const countLabel = (value: number, noun: string): string =>
  `${value} ${noun}${value === 1 ? '' : 's'}`;

const compactParts = (parts: Array<string | undefined>): string | undefined => {
  const visible = parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part));
  return visible.length > 0 ? visible.join(' · ') : undefined;
};

const humanizeKey = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const compactWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const trimLargeCodeBlock = (value: string, maxLength = 24_000): string =>
  value.length > maxLength
    ? `${value.slice(0, maxLength).trimEnd()}\n\n... truncated in console preview ...`
    : value;
