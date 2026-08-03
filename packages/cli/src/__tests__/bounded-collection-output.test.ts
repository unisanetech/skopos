import { describe, expect, it } from 'vitest';

import type { SkoposImpactRunResult, SkoposWorkQueueRunResult } from '@skopos/model';

import { buildPagedActionCatalogOutput } from '../cli/commands/actions.js';
import { buildPagedImpactOutput } from '../cli/commands/impact.js';
import { buildPagedWorkQueueOutput } from '../cli/commands/work.js';
import {
  COMPACT_JSON_BUDGET_BYTES,
  jsonByteLength,
  paginateCollection,
  parseCollectionLimit,
} from '../cli/shared/pagination.js';

describe('bounded collection transport', () => {
  it('retrieves deterministic cursor pages without duplication or loss', () => {
    const source = Array.from({ length: 237 }, (_, index) => `item-${index}`);
    const collected: string[] = [];
    let cursor: string | undefined;

    do {
      const result = paginateCollection(source, {
        collection: 'fixture.items',
        cursor,
        limit: 31,
      });
      collected.push(...result.items);
      cursor = result.page.nextCursor;
    } while (cursor);

    expect(collected).toEqual(source);
    expect(new Set(collected).size).toBe(source.length);
  });

  it('rejects invalid limits and cursors from a different collection', () => {
    expect(() => parseCollectionLimit('0')).toThrow('from 1 to 100');
    expect(() => parseCollectionLimit('101')).toThrow('from 1 to 100');
    const first = paginateCollection([1, 2], {
      collection: 'left',
      limit: 1,
    });
    expect(() =>
      paginateCollection([1, 2], {
        collection: 'right',
        cursor: first.page.nextCursor,
      }),
    ).toThrow('Invalid cursor for right');
  });

  it.each([
    ['p50', 50],
    ['p95', 1_000],
  ])('keeps representative %s default payloads below 32 KiB', (_label, size) => {
    const work = buildPagedWorkQueueOutput(workQueueFixture(size));
    const impact = buildPagedImpactOutput(impactFixture(size));
    const actions = buildPagedActionCatalogOutput(
      '/project',
      Array.from({ length: size }, (_, index) => actionFixture(index)),
    );

    expect(work.page).toMatchObject({ total: size, limit: 25, returned: 25 });
    expect(impact.page).toMatchObject({ total: size, limit: 25, returned: 25 });
    expect(actions.page).toMatchObject({ total: size, limit: 25, returned: 25 });
    expect(jsonByteLength(work)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
    expect(jsonByteLength(impact)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
    expect(jsonByteLength(actions)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
  });
});

const workQueueFixture = (size: number): SkoposWorkQueueRunResult =>
  ({
    workspaceRoot: '/project',
    actorId: 'fixture-agent',
    artifactPath: '.skopos/index/work-queue.json',
    artifactWrite: 'written',
    summary: `${size} queue entries.`,
    workQueue: {
      counts: {
        ready: size,
        'in-progress': 0,
        deferred: 0,
        blocked: 0,
        verifying: 0,
        'ready-to-integrate': 0,
      },
      entries: Array.from({ length: size }, (_, index) => ({
        id: `T-${index}`,
        sourceKind: 'task',
        sourcePath: `docs/work/tasks/T-${index}.md`,
        title: `Task ${index}`,
        summary: 'A representative queue item.',
        scopeId: 'workspace',
        disposition: 'ready',
        reason: 'Ready for the next safe action.',
        priority: index,
        dependencyIds: [],
      })),
    },
  }) as SkoposWorkQueueRunResult;

const impactFixture = (size: number): SkoposImpactRunResult =>
  ({
    workspaceRoot: '/project',
    actorId: 'fixture-agent',
    summary: `${size} changed paths.`,
    graphPath: '.skopos/graph/impact.json',
    changed: Array.from({ length: size }, (_, index) => ({
      path: `src/${index}.ts`,
      category: 'source',
      reason: 'Directly changed source.',
    })),
    matchedGuards: [],
    requiredActions: [],
  }) as unknown as SkoposImpactRunResult;

const actionFixture = (index: number) => ({
  id: `quality.fixture.${index}`,
  title: `Fixture Action ${index}`,
  description: 'A representative Action declaration.',
  category: 'quality-check',
  scope: ['workspace'],
  command: 'pnpm test',
  cwd: '.',
  inputs: ['src'],
  outputs: [],
  affects: [],
  capabilities: {
    process: 'required' as const,
    network: 'none' as const,
    browser: 'none' as const,
    tools: ['pnpm'],
    secrets: [],
    services: [],
  },
  effects: {
    workspace: 'none' as const,
    artifacts: 'none' as const,
    external: 'none' as const,
  },
  concurrency: 'shared' as const,
  safety: 'read-only',
  requiresApproval: false,
  recommendedAfter: [],
  owner: 'fixture',
  sourcePath: `tools/skopos/actions/quality-fixture-${index}.yaml`,
});
