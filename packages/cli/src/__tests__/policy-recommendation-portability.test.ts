import { readFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  applySkoposPolicyPackRuntime,
  recommendSkoposPolicyPacksRuntime,
} from '../../../runtime/src/application/policies/policies.service.js';

interface FixtureRegistry {
  schemaVersion: 1;
  consumer: string;
  fixtures: Array<{
    id: string;
    family: string;
    languages: string[];
    purpose: string;
    expected: {
      primaryFamily: string;
      architectureMidApp: 'apply' | 'review' | 'avoid';
    };
  }>;
}

const workspaceRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const fixtureRoot = join(workspaceRoot, 'fixtures', 'repos');
const architecturePackRoot = join(workspaceRoot, 'policy-packs', 'architecture', 'mid-app');
const registry = JSON.parse(
  await readFile(join(fixtureRoot, 'registry.json'), 'utf8'),
) as FixtureRegistry;

const directoryContainsFile = async (directory: string): Promise<boolean> => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) return true;
    if (entry.isDirectory() && await directoryContainsFile(join(directory, entry.name))) return true;
  }
  return false;
};

describe('policy recommendation portability fixture registry', () => {
  it('registers every non-empty active fixture with a current executable consumer', async () => {
    const directoryEntries = await readdir(fixtureRoot, { withFileTypes: true });
    const nonEmptyFixtureIds: string[] = [];
    for (const entry of directoryEntries) {
      if (!entry.isDirectory()) continue;
      if (await directoryContainsFile(join(fixtureRoot, entry.name))) nonEmptyFixtureIds.push(entry.name);
    }

    expect(registry.consumer).toBe('packages/cli/src/__tests__/policy-recommendation-portability.test.ts');
    expect(registry.fixtures.map((fixture) => fixture.id).sort()).toEqual(nonEmptyFixtureIds.sort());
    expect(registry.fixtures.every((fixture) => fixture.purpose.trim().length > 0)).toBe(true);
  });

  it.each(registry.fixtures)('$id matches its registered repository profile and policy outcome', async (fixture) => {
    const result = await recommendSkoposPolicyPacksRuntime({
      cwd: join(fixtureRoot, fixture.id),
      dryRun: true,
    });
    const architecture = result.recommendations.find((entry) => entry.packId === 'architecture.mid-app');

    expect(result.repositoryProfile.primaryFamily).toBe(fixture.expected.primaryFamily);
    expect(result.repositoryProfile.languages).toEqual(expect.arrayContaining(fixture.languages));
    expect(architecture?.recommendation).toBe(fixture.expected.architectureMidApp);
    expect(architecture?.signals.every((signal) => signal.evidence.length > 0)).toBe(true);
  });

  it('uses observed evidence and lets the public-library anti-signal veto application', async () => {
    const result = await recommendSkoposPolicyPacksRuntime({
      cwd: join(fixtureRoot, 'go-public-library'),
      dryRun: true,
    });
    const architecture = result.recommendations.find((entry) => entry.packId === 'architecture.mid-app');

    expect(architecture).toMatchObject({
      recommendation: 'avoid',
      confidence: 'high',
    });
    expect(architecture?.antiSignals.map((signal) => signal.id)).toContain('anti.public-library-first');
    expect(architecture?.signals).toEqual([]);
  });

  it('keeps every policy review-only when the repository family is unknown', async () => {
    const result = await recommendSkoposPolicyPacksRuntime({
      cwd: join(fixtureRoot, 'unknown-project'),
      dryRun: true,
    });

    expect(result.repositoryProfile.primaryFamily).toBe('unknown');
    expect(result.recommendations.every((entry) => entry.recommendation === 'review')).toBe(true);
  });

  it('keeps unfinished architecture checks non-mandatory and exercises portable counterexamples', async () => {
    const driftRules = JSON.parse(
      await readFile(join(architecturePackRoot, 'checks', 'drift-rules.json'), 'utf8'),
    ) as { rules: Array<{ id: string; severity: string; strategy: string }> };
    const unfinished = driftRules.rules.filter((rule) => /later|heuristic|manual-now/.test(rule.strategy));
    const counterexamples = [
      'vertical-slice',
      'plugin',
      'event-driven',
      'rails-django',
      'hexagonal',
      'public-library',
      'large-platform',
    ];

    expect(unfinished.every((rule) => rule.severity !== 'must')).toBe(true);
    for (const counterexample of counterexamples) {
      const contents = await readFile(
        join(architecturePackRoot, 'fixtures', 'counterexamples', counterexample, 'README.md'),
        'utf8',
      );
      expect(contents).toMatch(/mapping|counterexample/i);
    }
  });

  it('maps existing framework conventions without declaring unmatched role names missing', async () => {
    const result = await applySkoposPolicyPackRuntime({
      cwd: join(fixtureRoot, 'ruby-rails-service'),
      pack: 'architecture.mid-app',
      actor: 'fixture-test',
      reason: 'Exercise portable role mapping without writing fixture state.',
      dryRun: true,
    });

    expect(result.roleMapping.mappings.some((mapping) => mapping.status === 'inferred')).toBe(true);
    expect(result.roleMapping.mappings.filter((mapping) => mapping.required).every(
      (mapping) => mapping.status === 'inferred' || mapping.status === 'needs-review',
    )).toBe(true);
    expect(result.roleMapping.mappings.some((mapping) => mapping.status === 'missing')).toBe(false);
  });
});
