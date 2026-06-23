import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { loadSkoposUiGraphViews } from '../application/load-graph-views/load-graph-views.service.js';

const tempDirs: string[] = [];

describe('loadSkoposUiGraphViews', () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((directory) =>
        rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );
  });

  it('loads workspace, impact, and mission graphs into curated view models', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-graphs-'));
    tempDirs.push(workspaceRoot);
    const graphRoot = join(workspaceRoot, '.skopos', 'graph');
    await mkdir(graphRoot, { recursive: true });

    await Promise.all([
      writeFile(
        join(graphRoot, 'workspace.json'),
        JSON.stringify(
          {
            schemaVersion: 1,
            id: 'graph-workspace',
            type: 'graph',
            status: 'generated',
            authority: 'generated',
            summary: 'Workspace relationships.',
            updatedAt: '2026-04-09T00:00:00.000Z',
            generatedAt: '2026-04-09T00:00:00.000Z',
            workspaceRoot,
            graphKind: 'workspace',
            focusId: 'workspace',
            nodes: [
              { id: 'workspace', kind: 'workspace', label: 'workspace', state: 'active' },
              { id: 'scope:@fixture/api', kind: 'scope', label: '@fixture/api', state: 'active' },
              {
                id: 'command:typecheck',
                kind: 'command',
                label: 'typecheck',
                state: 'recommended',
              },
              {
                id: 'workflow:reference.refresh-api-note',
                kind: 'workflow',
                label: 'reference.refresh-api-note',
                state: 'required',
              },
            ],
            edges: [],
          },
          null,
          2,
        ),
        'utf8',
      ),
      writeFile(
        join(graphRoot, 'impact.json'),
        JSON.stringify(
          {
            schemaVersion: 1,
            id: 'graph-impact',
            type: 'graph',
            status: 'generated',
            authority: 'generated',
            summary: 'Impact relationships.',
            updatedAt: '2026-04-09T00:00:00.000Z',
            generatedAt: '2026-04-09T00:00:00.000Z',
            workspaceRoot,
            graphKind: 'impact',
            focusId: 'workspace',
            nodes: [
              { id: 'workspace', kind: 'workspace', label: 'workspace', state: 'active' },
              {
                id: 'changed:packages/api/package.json',
                kind: 'changed-path',
                label: 'packages/api/package.json',
                state: 'changed',
              },
              { id: 'scope:@fixture/api', kind: 'scope', label: '@fixture/api', state: 'active' },
              {
                id: 'workflow:reference.refresh-api-note',
                kind: 'workflow',
                label: 'reference.refresh-api-note',
                state: 'required',
              },
            ],
            edges: [],
          },
          null,
          2,
        ),
        'utf8',
      ),
      writeFile(
        join(graphRoot, 'mission-demo.json'),
        JSON.stringify(
          {
            schemaVersion: 1,
            id: 'graph-mission-demo',
            type: 'graph',
            status: 'generated',
            authority: 'generated',
            summary: 'Mission relationships.',
            updatedAt: '2026-04-09T00:00:00.000Z',
            generatedAt: '2026-04-09T00:00:00.000Z',
            workspaceRoot,
            graphKind: 'mission',
            focusId: 'mission:demo',
            nodes: [
              { id: 'mission:demo', kind: 'mission', label: 'Mission: Demo', state: 'generated' },
              {
                id: 'decision:plan.public-api-change',
                kind: 'decision-question',
                label: 'Should this change a public API?',
                state: 'required',
              },
              {
                id: 'workflow:reference.refresh-api-note',
                kind: 'workflow',
                label: 'reference.refresh-api-note',
                state: 'required',
              },
              {
                id: 'command:typecheck',
                kind: 'command',
                label: 'pnpm typecheck',
                state: 'recommended',
              },
              {
                id: 'mission-item:workflow-reference.refresh-api-note',
                kind: 'mission-item',
                label: 'Run API workflow',
                state: 'required',
              },
            ],
            edges: [],
          },
          null,
          2,
        ),
        'utf8',
      ),
    ]);

    const result = await loadSkoposUiGraphViews({
      cwd: workspaceRoot,
    });

    expect(result.graphs.map((graph) => graph.kind)).toEqual(['workspace', 'impact', 'mission']);

    const workspaceGraph = result.graphs[0];
    expect(workspaceGraph?.title).toBe('Workspace Graph');
    expect(workspaceGraph?.highlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'workflows',
          items: expect.arrayContaining(['reference.refresh-api-note [required]']),
        }),
      ]),
    );

    const impactGraph = result.graphs[1];
    expect(impactGraph?.highlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'changed',
          items: expect.arrayContaining(['packages/api/package.json [changed]']),
        }),
      ]),
    );

    const missionGraph = result.graphs[2];
    expect(missionGraph?.highlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'decisions',
          items: expect.arrayContaining(['Should this change a public API? [required]']),
        }),
      ]),
    );
  });
});
