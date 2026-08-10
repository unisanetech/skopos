import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildSkoposSkillContextContentDigest,
  loadSkoposSkillContextLibrary,
  loadSkoposSkillPacks,
  parseSkoposSkillContextBrief,
  parseSkoposSkillContextContractFixture,
  parseSkoposSkillContextLibrary,
} from '../../../indexer/src/index.js';
import type { SkoposSkillContextContractFixture } from '../../../model/src/index.js';
import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const fixturePath = join(
  skoposRoot,
  'fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json',
);

const readFixture = async (): Promise<SkoposSkillContextContractFixture> =>
  parseSkoposSkillContextContractFixture(
    JSON.parse(await readFile(fixturePath, 'utf8')),
  );

describe('Product Interface Design Design Context contract', () => {
  it('keeps capability vocabulary in the Skill pack over a generic core contract', async () => {
    const fixture = await readFixture();

    expect(fixture.library.namespace).toBe('design-context');
    expect(
      fixture.library.recordTypes.map(({ typeId, displayName }) => ({
        typeId,
        displayName,
      })),
    ).toEqual([
      { typeId: 'design-context.domain-guide', displayName: 'Domain Guide' },
      {
        typeId: 'design-context.experience-guide',
        displayName: 'Experience Guide',
      },
      { typeId: 'design-context.design-signal', displayName: 'Design Signal' },
      { typeId: 'design-context.source-note', displayName: 'Source Note' },
    ]);

    const genericCoreSources = await Promise.all([
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
    ]);
    expect(genericCoreSources.join('\n')).not.toMatch(
      /Product Interface Design|Domain Guide|Experience Guide|Design Signal|design-context/,
    );
  });

  it('freezes all Phase 1 resolution categories without running a model or network call', async () => {
    const fixture = await readFixture();

    expect(fixture.cases.map((fixtureCase) => fixtureCase.category).sort()).toEqual([
      'ambiguous',
      'budget',
      'expired',
      'multi-selector',
      'negative',
      'positive',
      'retired',
    ]);
    expect(
      fixture.cases.find(
        (fixtureCase) => fixtureCase.caseId === 'explicit-multi-domain-review',
      )?.task.selectors.domain,
    ).toEqual(['developer-platforms', 'financial-high-trust']);
    expect(
      fixture.cases.find((fixtureCase) => fixtureCase.category === 'ambiguous')
        ?.expectation.selectedRecordIds,
    ).toEqual([]);
  });

  it('validates identity, relationships, provenance, freshness, and exact digests', async () => {
    const fixture = await readFixture();
    const library = fixture.library;

    const duplicate = structuredClone(library);
    duplicate.records[1]!.id = duplicate.records[0]!.id;
    expect(() => parseSkoposSkillContextLibrary(duplicate)).toThrow(
      /Duplicate Skill Context record/,
    );

    const brokenRelationship = structuredClone(library);
    brokenRelationship.records[0]!.sourceNoteIds = ['design-context.source-note.missing'];
    expect(() => parseSkoposSkillContextLibrary(brokenRelationship)).toThrow(
      /unknown Source Note/,
    );

    const missingConstraint = structuredClone(library);
    delete missingConstraint.records[0]!.constraints.accessibility;
    expect(() => parseSkoposSkillContextLibrary(missingConstraint)).toThrow(
      /requires constraint accessibility/,
    );

    const missingProvenance = structuredClone(library);
    delete missingProvenance.sourceNotes[0]!.projectPath;
    delete missingProvenance.sourceNotes[0]!.officialUrl;
    expect(() => parseSkoposSkillContextLibrary(missingProvenance)).toThrow(
      /requires an officialUrl or projectPath/,
    );

    const invalidFreshness = structuredClone(library);
    invalidFreshness.records[0]!.freshness.reviewAfter = '2026-08-09';
    expect(() => parseSkoposSkillContextLibrary(invalidFreshness)).toThrow(
      /reviewAfter must be later than reviewedAt/,
    );

    const staleDigest = structuredClone(library);
    staleDigest.records[0]!.guidance = 'Changed without updating exact identity.';
    expect(() => parseSkoposSkillContextLibrary(staleDigest)).toThrow(
      /contentDigest is inconsistent/,
    );
  });

  it('keeps the optional library absent without changing current Skill selection inputs', async () => {
    await expect(
      loadSkoposSkillContextLibrary({ cwd: skoposRoot }),
    ).resolves.toBeUndefined();

    const packs = await loadSkoposSkillPacks({ cwd: skoposRoot });
    const pack = packs.find(
      (candidate) => candidate.packId === 'ui.product-interface-design',
    );
    expect(pack?.modules.map((module) => module.id)).toEqual([
      'interface-design.structure',
      'interface-design.finish',
      'interface-design.behavior',
    ]);
  });

  it('loads an explicit portable library and rejects workspace escape', async () => {
    const fixture = await readFixture();
    const temporaryRoot = await mkdtemp(join(tmpdir(), 'skopos-skill-context-'));
    const libraryPath = join(temporaryRoot, 'library.json');
    await writeFile(libraryPath, `${JSON.stringify(fixture.library, null, 2)}\n`, 'utf8');

    try {
      await expect(
        loadSkoposSkillContextLibrary({
          cwd: temporaryRoot,
          sourcePath: 'library.json',
        }),
      ).resolves.toMatchObject({
        libraryId: 'product-interface-design-contract-fixture',
        sourcePath: 'library.json',
      });
      await expect(
        loadSkoposSkillContextLibrary({
          cwd: temporaryRoot,
          sourcePath: '../outside-library.json',
        }),
      ).rejects.toThrow(/path escapes the workspace/);
    } finally {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it('validates a compact generated Skill Context Brief with originality and budget', async () => {
    const fixture = await readFixture();
    const selectedRecord = fixture.library.records[0]!;
    const brief = {
      schemaVersion: 1,
      id: 'skill-context-brief.T-contract-proof',
      type: 'skill-context-brief',
      status: 'generated',
      authority: 'generated',
      summary: 'Resolved Design Context for a synthetic contract proof.',
      generatedAt: '2026-08-09T12:00:00.000Z',
      taskId: 'T-contract-proof',
      packId: 'ui.product-interface-design',
      packVersion: '0.5.0',
      libraryId: fixture.library.libraryId,
      libraryVersion: fixture.library.version,
      libraryDigest: fixture.library.contentDigest,
      identity: {
        algorithmId: 'skill-context-selection@1',
        selectorDigest: 'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        projectAuthorityDigest: 'sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        combinedDigest: 'sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
      },
      projectAuthorities: [
        {
          id: 'project.design-system',
          role: 'design-system',
          sourcePaths: ['packages/ui/src'],
          sourceDigest: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          summary: 'Project components and tokens remain authoritative.',
        },
      ],
      selectedRecords: [
        {
          recordId: selectedRecord.id,
          typeId: selectedRecord.typeId,
          reason: 'Task evidence matches the developer-platform domain.',
          measuredTokens: 120,
        },
      ],
      suppressedRecords: [],
      principles: [
        {
          recordId: selectedRecord.id,
          guidance: selectedRecord.guidance,
          taskEvidence: ['The Task changes a repeated technical workflow.'],
          adaptation: 'Use the project navigation and components around one primary object.',
          deliberateDifference: 'Retain the project light theme and navigation model.',
          doNotCopy: ['Do not reproduce another developer product shell.'],
        },
      ],
      unresolvedProjectContextGaps: [],
      budget: {
        maximumMeasuredTokens: 1800,
        measuredTokens: 120,
      },
      sourceNotes: [
        {
          id: fixture.library.sourceNotes[0]!.id,
          observedAt: fixture.library.sourceNotes[0]!.observedAt,
        },
      ],
      contentDigest: '',
    };
    brief.contentDigest = buildSkoposSkillContextContentDigest(brief);

    expect(parseSkoposSkillContextBrief(brief)).toMatchObject({
      taskId: 'T-contract-proof',
      budget: { measuredTokens: 120 },
    });

    const overBudget = structuredClone(brief);
    overBudget.budget.measuredTokens = 1801;
    overBudget.contentDigest = buildSkoposSkillContextContentDigest(overBudget);
    expect(() => parseSkoposSkillContextBrief(overBudget)).toThrow(
      /exceeds its Task-wide token allowance/,
    );
  });
});
