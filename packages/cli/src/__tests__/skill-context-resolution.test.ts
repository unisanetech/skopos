import { cp, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildSkoposSkillContextContentDigest,
  loadSkoposSkillPacks,
  parseSkoposSkillContextLibrary,
} from '../../../indexer/src/index.js';
import type {
  SkoposSkillContextLibrary,
  SkoposSkillContextProjectAuthority,
} from '../../../model/src/index.js';
import {
  renderSkoposSkillContextBriefRuntime,
  resolveSkoposSkillContextBriefRuntime,
  SKOPOS_SKILL_CONTEXT_SELECTION_ALGORITHM_ID,
} from '../../../runtime/src/application/skills/skill-context.service.js';
import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const packId = 'ui.product-interface-design';
const packVersion = '0.3.0';
const generatedAt = '2026-08-09T18:00:00.000Z';
const asOf = '2026-08-09';
const projectAuthority: SkoposSkillContextProjectAuthority = {
  id: 'project.interface-authority',
  role: 'design-system',
  sourcePaths: ['packages/ui/src'],
  sourceDigest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  summary: 'Project components, tokens, language, and precedents remain authoritative.',
};

const loadLibrary = async (): Promise<SkoposSkillContextLibrary> => {
  const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
  const pack = packs.find((candidate) => candidate.packId === packId);
  if (!pack?.loadedContextLibrary) throw new Error('Expected a bound context Library.');
  return pack.loadedContextLibrary;
};

const resolve = ({
  library,
  selectors,
  ...overrides
}: {
  library: SkoposSkillContextLibrary;
  selectors: Record<string, string[]>;
  taskId?: string;
  maximumMeasuredTokens?: number;
  baseMeasuredTokens?: number;
  projectAuthorities?: SkoposSkillContextProjectAuthority[];
  projectAuthorityPrecedence?: Record<string, string>;
  negativeRecordIds?: string[];
  justifiedRecordIds?: string[];
  explicitMultipleSelectorDimensions?: string[];
  asOf?: string;
}) =>
  resolveSkoposSkillContextBriefRuntime({
    taskId: overrides.taskId ?? 'T-context-resolution',
    packId,
    packVersion,
    library,
    selectors,
    taskEvidence: ['The Task explicitly declares these product-interface selectors.'],
    projectAuthorities: overrides.projectAuthorities ?? [projectAuthority],
    projectAuthorityPrecedence: overrides.projectAuthorityPrecedence,
    negativeRecordIds: overrides.negativeRecordIds,
    justifiedRecordIds: overrides.justifiedRecordIds,
    explicitMultipleSelectorDimensions:
      overrides.explicitMultipleSelectorDimensions,
    maximumMeasuredTokens: overrides.maximumMeasuredTokens ?? 2800,
    baseMeasuredTokens: overrides.baseMeasuredTokens ?? 0,
    asOf: overrides.asOf ?? asOf,
    generatedAt,
  });

describe('generic Skill Context resolution for Product Interface Design', () => {
  it('loads the reviewed Library through the pack-owned portable binding', async () => {
    const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const pack = packs.find((candidate) => candidate.packId === packId);

    expect(pack?.contextLibrary).toEqual({
      path: 'design-context/library.json',
      maximumMeasuredTokens: 420,
    });
    expect(pack?.loadedContextLibrary).toMatchObject({
      libraryId: 'product-interface-design',
      namespace: 'design-context',
      version: '0.1.0',
    });
    expect(pack?.loadedContextLibrary?.records).toHaveLength(13);
    expect(pack?.loadedContextLibrary?.sourceNotes).toHaveLength(10);
  });

  it('freezes a neutral evaluation matrix without claiming efficacy', async () => {
    const matrix = JSON.parse(
      await readFile(
        join(
          skoposRoot,
          'skill-packs/ui/product-interface-design/design-context/evaluations/candidate.matrix.json',
        ),
        'utf8',
      ),
    ) as {
      status: string;
      cases: Array<{ taskPrompt: string; selectors: Record<string, string[]> }>;
      pilotPreparation: Array<{ status: string }>;
    };

    expect(matrix.status).toBe('prepared-not-executed');
    expect(matrix.cases).toHaveLength(6);
    expect(matrix.cases.every((entry) => Object.keys(entry.selectors).length === 2)).toBe(true);
    expect(matrix.cases.map((entry) => entry.taskPrompt).join(' ')).not.toMatch(
      /Linear|Vercel|Stripe|Shopify|Atlassian|Microsoft|Apple|Material|Wise/,
    );
    expect(matrix.pilotPreparation.every((entry) => entry.status.startsWith('awaiting-'))).toBe(true);
  });

  it('selects every declared domain and experience from explicit selectors', async () => {
    const library = await loadLibrary();
    const domains = [
      'developer-platforms',
      'ai-assisted-products',
      'commerce-operations',
      'financial-high-trust',
    ];
    const experiences = [
      'application-workbench',
      'setup-onboarding',
      'review-approval-transaction',
      'monitoring-operational-status',
      'ai-assisted-delegated-work',
      'mobile-task-transformation',
    ];

    for (const domain of domains) {
      const brief = resolve({ library, selectors: { domain: [domain] } });
      expect(
        brief.selectedRecords.filter((record) =>
          record.typeId.endsWith('.domain-guide'),
        ).map((record) => record.recordId),
      ).toEqual([`design-context.domain-guide.${domain}`]);
    }
    for (const experience of experiences) {
      const brief = resolve({ library, selectors: { experience: [experience] } });
      expect(
        brief.selectedRecords.filter((record) =>
          record.typeId.endsWith('.experience-guide'),
        ).map((record) => record.recordId),
      ).toEqual([`design-context.experience-guide.${experience}`]);
    }
  });

  it('fails closed for irrelevant, public-page, and ambiguous Tasks', async () => {
    const library = await loadLibrary();
    for (const selectors of [{}, { surface: ['public-page'] }]) {
      const brief = resolve({ library, selectors });
      expect(brief.selectedRecords).toEqual([]);
      expect(brief.principles).toEqual([]);
    }

    const ambiguous = resolve({
      library,
      selectors: {
        domain: ['developer-platforms', 'financial-high-trust'],
      },
    });
    expect(ambiguous.selectedRecords).toEqual([]);
    expect(
      ambiguous.suppressedRecords.filter(
        (record) => record.reasonCode === 'ambiguous',
      ).map((record) => record.recordId),
    ).toEqual(expect.arrayContaining([
      'design-context.domain-guide.developer-platforms',
      'design-context.domain-guide.financial-high-trust',
    ]));
  });

  it('allows explicit multi-domain evidence but keeps deterministic limits', async () => {
    const library = await loadLibrary();
    const brief = resolve({
      library,
      selectors: {
        domain: ['developer-platforms', 'financial-high-trust'],
      },
      explicitMultipleSelectorDimensions: ['domain'],
    });
    expect(
      brief.selectedRecords.filter((record) =>
        record.typeId.endsWith('.domain-guide'),
      ).map((record) => record.recordId),
    ).toEqual([
      'design-context.domain-guide.developer-platforms',
      'design-context.domain-guide.financial-high-trust',
    ]);
  });

  it('preserves project authority, expiry, retirement, and Task-wide budget precedence', async () => {
    const library = await loadLibrary();
    const domainId = 'design-context.domain-guide.developer-platforms';
    const precedence = resolve({
      library,
      selectors: { domain: ['developer-platforms'] },
      projectAuthorityPrecedence: {
        [domainId]: projectAuthority.id,
      },
    });
    expect(precedence.selectedRecords.map((record) => record.recordId)).not.toContain(
      domainId,
    );
    expect(precedence.suppressedRecords).toContainEqual(
      expect.objectContaining({
        recordId: domainId,
        reasonCode: 'project-authority-precedence',
      }),
    );

    const expiredLibrary = withRecordFreshness(library, domainId, {
      state: 'needs-review',
      createdAt: '2026-01-01',
      reviewedAt: '2026-01-01',
      reviewAfter: '2026-08-08',
    });
    expect(
      resolve({
        library: expiredLibrary,
        selectors: { domain: ['developer-platforms'] },
      }).suppressedRecords,
    ).toContainEqual(
      expect.objectContaining({ recordId: domainId, reasonCode: 'expired' }),
    );

    const retiredLibrary = withRecordFreshness(library, domainId, {
      state: 'retired',
    });
    expect(
      resolve({
        library: retiredLibrary,
        selectors: { domain: ['developer-platforms'] },
      }).suppressedRecords,
    ).toContainEqual(
      expect.objectContaining({ recordId: domainId, reasonCode: 'retired' }),
    );

    const budgeted = resolve({
      library,
      selectors: { domain: ['developer-platforms'] },
      maximumMeasuredTokens: 1800,
      baseMeasuredTokens: 1800,
    });
    expect(budgeted.selectedRecords).toEqual([]);
    expect(budgeted.budget).toEqual({
      maximumMeasuredTokens: 1800,
      measuredTokens: 1800,
    });
    expect(budgeted.suppressedRecords).toContainEqual(
      expect.objectContaining({ reasonCode: 'budget-suppressed' }),
    );
  });

  it('requires explicit Task justification for pack-declared saturated signals', async () => {
    const source = await loadLibrary();
    const signalId = 'design-context.design-signal.quiet-structural-hierarchy';
    const library = withRecordFacets(source, signalId, { maturity: 'saturated' });
    const withoutJustification = resolve({
      library,
      selectors: { domain: ['developer-platforms'] },
    });
    expect(withoutJustification.suppressedRecords).toContainEqual(
      expect.objectContaining({
        recordId: signalId,
        reasonCode: 'justification-required',
      }),
    );

    const justified = resolve({
      library,
      selectors: { domain: ['developer-platforms'] },
      justifiedRecordIds: [signalId],
    });
    expect(justified.selectedRecords.map((record) => record.recordId)).toContain(
      signalId,
    );
  });

  it('binds reuse identity to selectors, project authority, algorithm, and Library', async () => {
    const library = await loadLibrary();
    const first = resolve({
      library,
      selectors: { domain: ['developer-platforms'] },
      taskId: 'T-identity',
    });
    const same = resolve({
      library,
      selectors: { domain: ['developer-platforms'] },
      taskId: 'T-identity',
    });
    const changedSelector = resolve({
      library,
      selectors: { domain: ['commerce-operations'] },
      taskId: 'T-identity',
    });

    expect(first.identity.algorithmId).toBe(
      SKOPOS_SKILL_CONTEXT_SELECTION_ALGORITHM_ID,
    );
    expect(same.contentDigest).toBe(first.contentDigest);
    expect(changedSelector.identity.selectorDigest).not.toBe(
      first.identity.selectorDigest,
    );
    expect(changedSelector.identity.combinedDigest).not.toBe(
      first.identity.combinedDigest,
    );
  });

  it('renders the exact resolved Brief without leaking capability-specific vocabulary into core', async () => {
    const library = await loadLibrary();
    const brief = resolve({
      library,
      selectors: {
        domain: ['financial-high-trust'],
        experience: ['review-approval-transaction'],
      },
      taskId: 'T-rendered-context',
    });
    const rendered = renderSkoposSkillContextBriefRuntime(brief);

    expect(rendered).toContain(brief.identity.combinedDigest);
    expect(rendered).toContain(brief.libraryDigest);
    expect(rendered).toContain('Prioritize consequence visibility');
    expect(rendered).toContain('Do not copy:');
    expect(rendered).toContain(
      `${brief.budget.measuredTokens}/${brief.budget.maximumMeasuredTokens}`,
    );
  });

  it('loads the same Library after copying the pack without source-checkout access', async () => {
    const sourceLibrary = await loadLibrary();
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'skopos-context-pack-'));
    const targetPack = join(
      temporaryRoot,
      'skill-packs/ui/product-interface-design',
    );
    try {
      await cp(
        join(skoposRoot, 'skill-packs/ui/product-interface-design'),
        targetPack,
        { recursive: true },
      );
      const [packed] = await loadSkoposSkillPacks({ cwd: temporaryRoot });
      expect(packed?.sourcePath).toBe(
        'skill-packs/ui/product-interface-design/pack.json',
      );
      expect(packed?.loadedContextLibrary?.contentDigest).toBe(
        sourceLibrary.contentDigest,
      );
      expect(
        packed?.loadedContextLibrary?.records.map((record) => record.id),
      ).toEqual(sourceLibrary.records.map((record) => record.id));
      const sourceBrief = resolve({
        library: sourceLibrary,
        selectors: { domain: ['developer-platforms'] },
        taskId: 'T-packed-equivalence',
      });
      const packedBrief = resolve({
        library: packed!.loadedContextLibrary!,
        selectors: { domain: ['developer-platforms'] },
        taskId: 'T-packed-equivalence',
      });
      expect(packedBrief.identity).toEqual(sourceBrief.identity);
      expect(packedBrief.selectedRecords).toEqual(sourceBrief.selectedRecords);
      expect(packedBrief.contentDigest).toBe(sourceBrief.contentDigest);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it('keeps all capability vocabulary outside generic core', async () => {
    const sources = await Promise.all([
      readFile(
        join(skoposRoot, 'packages/model/src/contracts/skopos-skill-context.ts'),
        'utf8',
      ),
      readFile(
        join(
          skoposRoot,
          'packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts',
        ),
        'utf8',
      ),
      readFile(
        join(
          skoposRoot,
          'packages/runtime/src/application/skills/skill-context.service.ts',
        ),
        'utf8',
      ),
    ]);
    expect(sources.join('\n')).not.toMatch(
      /Product Interface Design|Domain Guide|Experience Guide|Design Signal|design-context/,
    );
  });
});

const withRecordFreshness = (
  source: SkoposSkillContextLibrary,
  recordId: string,
  patch: Partial<SkoposSkillContextLibrary['records'][number]['freshness']>,
): SkoposSkillContextLibrary => {
  const library = structuredClone(source);
  delete (library as SkoposSkillContextLibrary & { sourcePath?: string }).sourcePath;
  const record = library.records.find((candidate) => candidate.id === recordId);
  if (!record) throw new Error(`Unknown record ${recordId}.`);
  record.freshness = { ...record.freshness, ...patch };
  record.contentDigest = buildSkoposSkillContextContentDigest(record);
  library.contentDigest = buildSkoposSkillContextContentDigest(library);
  return parseSkoposSkillContextLibrary(library);
};

const withRecordFacets = (
  source: SkoposSkillContextLibrary,
  recordId: string,
  patch: Record<string, string>,
): SkoposSkillContextLibrary => {
  const library = structuredClone(source);
  delete (library as SkoposSkillContextLibrary & { sourcePath?: string }).sourcePath;
  const record = library.records.find((candidate) => candidate.id === recordId);
  if (!record) throw new Error(`Unknown record ${recordId}.`);
  record.facets = { ...record.facets, ...patch };
  record.contentDigest = buildSkoposSkillContextContentDigest(record);
  library.contentDigest = buildSkoposSkillContextContentDigest(library);
  return parseSkoposSkillContextLibrary(library);
};
