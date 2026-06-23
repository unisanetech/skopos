import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { renderSkoposUiPortal } from '../application/render-portal/render-portal.service.js';

const tempDirs: string[] = [];

describe('renderSkoposUiPortal', () => {
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

  it('renders a portal shell and graph portal from graph artifacts', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-portal-'));
    tempDirs.push(workspaceRoot);
    const graphRoot = join(workspaceRoot, '.skopos', 'graph');
    await mkdir(graphRoot, { recursive: true });
    await mkdir(join(workspaceRoot, 'docs'), { recursive: true });
    await writeFile(join(workspaceRoot, 'docs', '00-start-here.md'), '# Start here\n', 'utf8');
    await writeFile(join(workspaceRoot, 'AGENTS.md'), '# Agent rules\n', 'utf8');
    await writeFile(
      join(workspaceRoot, 'skopos.config.yaml'),
      `schemaVersion: 1
project:
  name: skopos-ui-fixture
  archetype: monorepo-platform
  repoMode: monorepo
  scopeStrategy: hybrid
commands: {}
workspace:
  ignore: []
docs:
  root: docs
  usePerDomainArchive: true
  strictMetadata: true
  strictLinking: true
agents:
  canonicalInstructions: AGENTS.md
  syncMirrors:
    - CLAUDE.md
    - .cursor/rules/project.mdc
    - .github/copilot-instructions.md
  mcp: true
trust:
  mode: balanced
  requireDocsSync: true
  requireProofForDone: true
decisions:
  mode: balanced
  askFor:
    - public-api-change
security:
  privacyMode: local-only
  redactSecrets: true
`,
      'utf8',
    );
    await writeFile(join(workspaceRoot, '.skopos', 'bootstrap.json'), '{}\n', 'utf8');
    await writeFile(join(workspaceRoot, '.skopos', 'diagnosis.json'), '{}\n', 'utf8');
    await writeFile(join(workspaceRoot, '.skopos', 'scopes-lite.json'), '{}\n', 'utf8');
    await writeFile(
      join(workspaceRoot, '.skopos', 'architecture.json'),
      JSON.stringify(
        {
          id: 'architecture',
          updatedAt: '2026-04-09T00:00:00.000Z',
          alignmentStatus: 'aligned',
          current: {
            topology: 'platform-monorepo',
          },
          recommended: {
            topology: 'platform-monorepo',
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await mkdir(join(workspaceRoot, '.skopos', 'plans'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'missions'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'runs'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'proof'), { recursive: true });
    await writeFile(join(workspaceRoot, '.skopos', 'log.jsonl'), '', 'utf8');
    await writeFile(
      join(workspaceRoot, '.skopos', 'plans', 'plan-sample.json'),
      JSON.stringify(
        {
          id: 'plan-sample',
          updatedAt: '2026-04-09T01:00:00.000Z',
          title: 'Sample plan',
          goal: 'Add an API endpoint',
          summary: 'Plan summary',
          createdByActorId: 'agent-plan',
          parentMissionId: 'mission-batch',
          scope: { scope: { id: '@fixture/api' } },
          confidence: 'high',
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'missions', 'mission-sample.json'),
      JSON.stringify(
        {
          id: 'mission-sample',
          updatedAt: '2026-04-09T01:00:00.000Z',
          title: 'Sample mission',
          summary: 'Mission summary',
          parentMissionId: 'mission-batch',
          state: 'planned',
          scope: { scope: { id: '@fixture/api' } },
          items: [{ status: 'pending' }, { status: 'complete' }],
          linkedSlices: [{ missionId: 'mission-child' }],
          recommendedWorkflowIds: ['docs.generate-note'],
          coordination: {
            claimedBy: { actorId: 'agent-alpha', claimedAt: '2026-04-09T01:05:00.000Z' },
            lastUpdatedBy: 'agent-beta',
            lastUpdatedAt: '2026-04-09T01:06:00.000Z',
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'runs', 'run-sample.json'),
      JSON.stringify(
        {
          id: 'run-sample',
          updatedAt: '2026-04-09T01:10:00.000Z',
          workflowId: 'docs.generate-note',
          workflowTitle: 'Generate docs note',
          runStatus: 'succeeded',
          runByActorId: 'agent-docs',
          outputPaths: ['docs/generated/skopos/workflow-note.md'],
          finishedAt: '2026-04-09T01:10:00.000Z',
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'proof', 'latest-report.json'),
      JSON.stringify(
        {
          id: 'proof-latest-report',
          updatedAt: '2026-04-09T01:12:00.000Z',
          scorecard: {
            status: 'pass',
            benchmarkCount: 12,
            failedBenchmarks: 0,
            weightedPassRate: 1,
            categorySummaries: [
              { category: 'brownfield-clean', benchmarkCount: 1, weightedPassRate: 1 },
              { category: 'workflow-closure', benchmarkCount: 1, weightedPassRate: 1 },
            ],
          },
          comparison: {
            status: 'pass',
          },
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
          id: 'instructions-sync-1',
          type: 'log-entry',
          workspaceRoot,
          eventKind: 'instructions-sync',
          status: 'succeeded',
          timestamp: '2026-04-09T01:11:00.000Z',
          summary: 'Synced 3 instruction mirror(s).',
          relatedArtifactPaths: ['AGENTS.md', 'CLAUDE.md'],
          metadata: { actorId: 'agent-docs' },
        }),
      ].join('\n'),
      'utf8',
    );

    await writeFile(
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
    );
    await writeFile(
      join(graphRoot, 'docs.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'graph-docs',
          type: 'graph',
          status: 'generated',
          authority: 'generated',
          summary: 'Docs relationships.',
          updatedAt: '2026-04-09T00:00:00.000Z',
          generatedAt: '2026-04-09T00:00:00.000Z',
          workspaceRoot,
          graphKind: 'docs',
          focusId: 'scope:docs:docs',
          nodes: [
            { id: 'workspace', kind: 'workspace', label: 'workspace', state: 'active' },
            {
              id: 'scope:docs:docs',
              kind: 'docs-root',
              label: 'docs',
              state: 'active',
              path: 'docs',
            },
            {
              id: 'scope:instructions:agents',
              kind: 'instruction-file',
              label: 'AGENTS.md',
              state: 'active',
              path: 'AGENTS.md',
            },
            {
              id: 'workflow:docs.generate-note',
              kind: 'workflow',
              label: 'docs.generate-note',
              state: 'recommended',
            },
          ],
          edges: [],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(graphRoot, 'commands.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'graph-commands',
          type: 'graph',
          status: 'generated',
          authority: 'generated',
          summary: 'Command relationships.',
          updatedAt: '2026-04-09T00:00:00.000Z',
          generatedAt: '2026-04-09T00:00:00.000Z',
          workspaceRoot,
          graphKind: 'commands',
          focusId: 'workspace',
          nodes: [
            { id: 'workspace', kind: 'workspace', label: 'workspace', state: 'active' },
            { id: 'command:typecheck', kind: 'command', label: 'typecheck', state: 'recommended' },
            { id: 'scope:@fixture/api', kind: 'scope', label: '@fixture/api', state: 'active' },
          ],
          edges: [],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(graphRoot, 'scope-relations.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'graph-scope-relations',
          type: 'graph',
          status: 'generated',
          authority: 'generated',
          summary: 'Scope dependency relationships.',
          updatedAt: '2026-04-09T00:00:00.000Z',
          generatedAt: '2026-04-09T00:00:00.000Z',
          workspaceRoot,
          graphKind: 'scope-relations',
          focusId: 'workspace',
          nodes: [
            { id: 'workspace', kind: 'workspace', label: 'workspace', state: 'active' },
            { id: 'scope:@fixture/api', kind: 'scope', label: '@fixture/api', state: 'active' },
            {
              id: 'scope:@fixture/shared',
              kind: 'scope',
              label: '@fixture/shared',
              state: 'active',
            },
          ],
          edges: [
            {
              id: 'scope:@fixture/api->scope:@fixture/shared:depends-on',
              kind: 'depends-on',
              from: 'scope:@fixture/api',
              to: 'scope:@fixture/shared',
              state: 'active',
            },
          ],
        },
        null,
        2,
      ),
      'utf8',
    );

    const result = await renderSkoposUiPortal({
      cwd: workspaceRoot,
    });

    expect(result.writeStatus).toBe('written');
    expect(result.graphPortalWriteStatus).toBe('written');
    expect(result.graphCount).toBe(4);
    expect(result.outputPath).toBe(join(workspaceRoot, 'docs/generated/skopos/index.html'));
    expect(result.graphPortalPath).toBe(
      join(workspaceRoot, 'docs/generated/skopos/graph-portal.html'),
    );
    expect(result.trustLevel).toBe('medium');
    expect(result.html).toContain('Skopos Console');
    expect(result.html).toContain('Project intelligence console');
    expect(result.html).toContain('Trust surface');
    expect(result.html).toContain('Operational surfaces');
    expect(result.html).toContain('Docs Surface');
    expect(result.html).toContain('Command Surface');
    expect(result.html).toContain('Scope Relations');
    expect(result.html).toContain('Proof snapshot');
    expect(result.html).toContain('Recent plans');
    expect(result.html).toContain('Recent missions');
    expect(result.html).toContain('Sample plan');
    expect(result.html).toContain('Sample mission');
    expect(result.html).toContain('1 slice');
    expect(result.html).toContain('parent: mission-batch');
    expect(result.html).toContain('Generate docs note');
    expect(result.html).toContain('planned by agent-plan');
    expect(result.html).toContain('claimed by: agent-alpha');
    expect(result.html).toContain('updated by: agent-beta');
    expect(result.html).toContain('run by: agent-docs');
    expect(result.html).toContain('Operations');
    expect(result.html).toContain('instructions-sync');
    expect(result.html).toContain('actor: agent-docs');
    expect(result.html).toContain('Latest proof report');
    expect(result.html).toContain('12');
    expect(result.graphHtml).toContain('Graph Portal');
    expect(result.graphHtml).toContain('Workspace Graph');
    expect(result.graphHtml).toContain('reference.refresh-api-note');

    const written = await readFile(result.outputPath, 'utf8');
    expect(written).toContain('Skopos Console');
    expect(written).toContain('Graph portal');
    expect(written).toContain('Canonical instructions');
    expect(written).toContain('Docs Surface');
    expect(written).toContain('Sample plan');
    expect(written).toContain('Proof snapshot');
    expect(written).toContain('Operations');

    const writtenGraphPortal = await readFile(result.graphPortalPath, 'utf8');
    expect(writtenGraphPortal).toContain('Graph Portal');
    expect(writtenGraphPortal).toContain('Workspace Graph');
    expect(writtenGraphPortal).toContain('Docs Graph');
  });
});
