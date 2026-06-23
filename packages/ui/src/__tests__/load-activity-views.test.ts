import { mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { loadSkoposUiActivityViews } from '../application/load-activity-views/load-activity-views.service.js';

const tempDirs: string[] = [];

describe('loadSkoposUiActivityViews', () => {
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

  it('loads and sorts recent plans, missions, and workflow runs', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-activity-'));
    tempDirs.push(workspaceRoot);

    await mkdir(join(workspaceRoot, '.skopos', 'plans'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'missions'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'runs'), { recursive: true });

    await writeFile(
      join(workspaceRoot, '.skopos', 'plans', 'plan-old.json'),
      JSON.stringify(
        {
          id: 'plan-old',
          updatedAt: '2026-04-08T00:00:00.000Z',
          title: 'Old plan',
          goal: 'old goal',
          summary: 'old summary',
          scope: { scope: { id: '@fixture/old' } },
          confidence: 'medium',
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'plans', 'plan-new.json'),
      JSON.stringify(
        {
          id: 'plan-new',
          updatedAt: '2026-04-09T00:00:00.000Z',
          title: 'New plan',
          goal: 'new goal',
          summary: 'new summary',
          createdByActorId: 'agent-plan',
          parentMissionId: 'mission-parent',
          scope: { scope: { id: '@fixture/new' } },
          confidence: 'high',
        },
        null,
        2,
      ),
      'utf8',
    );

    await writeFile(
      join(workspaceRoot, '.skopos', 'missions', 'mission-new.json'),
      JSON.stringify(
        {
          id: 'mission-new',
          updatedAt: '2026-04-09T00:00:00.000Z',
          title: 'Recent mission',
          summary: 'mission summary',
          parentMissionId: 'mission-parent',
          state: 'planned',
          scope: { scope: { id: '@fixture/new' } },
          items: [{ status: 'pending' }, { status: 'complete' }],
          linkedSlices: [{ missionId: 'mission-child' }],
          recommendedWorkflowIds: ['docs.generate-note'],
          coordination: {
            claimedBy: { actorId: 'agent-alpha', claimedAt: '2026-04-09T00:10:00.000Z' },
            lastUpdatedBy: 'agent-beta',
            lastUpdatedAt: '2026-04-09T00:11:00.000Z',
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    await writeFile(
      join(workspaceRoot, '.skopos', 'runs', 'run-new.json'),
      JSON.stringify(
        {
          id: 'run-new',
          updatedAt: '2026-04-09T02:00:00.000Z',
          workflowId: 'docs.generate-note',
          workflowTitle: 'Generate docs note',
          runStatus: 'succeeded',
          runByActorId: 'agent-docs',
          outputPaths: ['docs/generated/skopos/workflow-note.md'],
          finishedAt: '2026-04-09T02:00:00.000Z',
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'log.jsonl'),
      [
        JSON.stringify({
          schemaVersion: 1,
          id: 'trust-1',
          type: 'log-entry',
          workspaceRoot,
          eventKind: 'trust',
          status: 'succeeded',
          timestamp: '2026-04-09T01:30:00.000Z',
          summary: 'Trust report built.',
          relatedArtifactPaths: ['.skopos/index.json'],
          metadata: { actorId: 'agent-review' },
        }),
        JSON.stringify({
          schemaVersion: 1,
          id: 'instructions-sync-1',
          type: 'log-entry',
          workspaceRoot,
          eventKind: 'instructions-sync',
          status: 'succeeded',
          timestamp: '2026-04-09T02:30:00.000Z',
          summary: 'Synced 3 instruction mirror(s).',
          relatedArtifactPaths: ['AGENTS.md', 'CLAUDE.md'],
          metadata: { actorId: 'agent-docs' },
        }),
      ].join('\n'),
      'utf8',
    );

    const result = await loadSkoposUiActivityViews({ cwd: workspaceRoot });

    expect(result.plans[0]).toMatchObject({
      id: 'plan-new',
      title: 'New plan',
      parentMissionId: 'mission-parent',
      scopeId: '@fixture/new',
      confidence: 'high',
      createdByActorId: 'agent-plan',
    });
    expect(result.missions[0]).toMatchObject({
      id: 'mission-new',
      parentMissionId: 'mission-parent',
      state: 'planned',
      pendingItemCount: 1,
      linkedSliceCount: 1,
      claimedByActorId: 'agent-alpha',
      lastUpdatedByActorId: 'agent-beta',
    });
    expect(result.workflowRuns[0]).toMatchObject({
      id: 'run-new',
      workflowId: 'docs.generate-note',
      runStatus: 'succeeded',
      runByActorId: 'agent-docs',
    });
    expect(result.operationalEvents[0]).toMatchObject({
      id: 'instructions-sync-1',
      eventKind: 'instructions-sync',
      actorId: 'agent-docs',
    });
    expect(result.operationalEvents[1]).toMatchObject({
      id: 'trust-1',
      eventKind: 'trust',
      actorId: 'agent-review',
    });
  });
});
