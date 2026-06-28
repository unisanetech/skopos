import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildSkoposUiConsoleApp } from '../application/build-console-app/build-console-app.service.js';

const tempDirs: string[] = [];

describe('buildSkoposUiConsoleApp', () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((directory) =>
        rm(directory, {
          recursive: true,
          force: true,
        }),
      ),
    );
  }, 30_000);

  it('builds a routed app bundle and injects compiled console state', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-ui-app-'));
    tempDirs.push(workspaceRoot);

    await mkdir(join(workspaceRoot, '.skopos', 'graph'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'plans'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'missions'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'evals'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'runs'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'proof'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'policies'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'drift'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'program'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'discussions', 'checkpoints'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'discussions', 'handoffs'), { recursive: true });
    await mkdir(join(workspaceRoot, '.skopos', 'discussions', 'raw'), { recursive: true });
    await mkdir(join(workspaceRoot, 'policy-packs', 'architecture', 'mid-app'), { recursive: true });
    await mkdir(join(workspaceRoot, 'src', 'routes'), { recursive: true });
    await mkdir(join(workspaceRoot, 'src', 'use-cases'), { recursive: true });
    await mkdir(join(workspaceRoot, 'src', 'gateways'), { recursive: true });
    await mkdir(join(workspaceRoot, 'src', 'presenters'), { recursive: true });
    await mkdir(join(workspaceRoot, 'docs', 'generated', 'skopos'), { recursive: true });

    await writeFile(join(workspaceRoot, 'docs', '00-start-here.md'), '# Start here\n', 'utf8');
    await writeFile(join(workspaceRoot, 'AGENTS.md'), '# Agent rules\n', 'utf8');
    await writeFile(join(workspaceRoot, 'CLAUDE.md'), '# Agent rules\n', 'utf8');
    await mkdir(join(workspaceRoot, '.cursor', 'rules'), { recursive: true });
    await writeFile(join(workspaceRoot, '.cursor', 'rules', 'project.mdc'), '# Agent rules\n', 'utf8');
    await mkdir(join(workspaceRoot, '.github'), { recursive: true });
    await writeFile(
      join(workspaceRoot, '.github', 'copilot-instructions.md'),
      '# Agent rules\n',
      'utf8',
    );
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
    await writeFile(
      join(workspaceRoot, '.skopos', 'bootstrap.json'),
      JSON.stringify(
        {
          workspaceRoot,
          detected: {
            packageCount: 1,
            workspacePackageCount: 1,
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'diagnosis.json'),
      JSON.stringify(
        {
          health: 'healthy',
          findings: [],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'architecture.json'),
      JSON.stringify(
        {
          id: 'architecture',
          updatedAt: '2026-04-10T00:00:00.000Z',
          alignmentStatus: 'aligned',
          current: { topology: 'platform-monorepo' },
          recommended: { topology: 'platform-monorepo' },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'enforcement.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'enforcement',
          type: 'enforcement',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:00:00.000Z',
          generatedAt: '2026-04-10T00:00:00.000Z',
          workspaceRoot,
          instructionSourcePath: 'AGENTS.md',
          primarySurface: 'cli-and-mcp',
          requiredWorkflowCount: 1,
          approvalRequiredWorkflowCount: 0,
          rules: [],
          toolAdapters: [
            {
              toolId: 'claude-code',
              displayName: 'Claude Code',
              summary: 'Native lifecycle adapter.',
              adapterKind: 'hook-settings',
              supportTier: 'native-lifecycle',
              supportStatus: 'implemented',
              path: '.skopos/tooling/claude-code/settings.json',
              generatedFiles: ['.skopos/tooling/claude-code/settings.json'],
              installMode: 'manual-merge',
              lifecycleCoverage: {
                sessionStart: true,
                userTurn: true,
                assistantTurn: true,
                majorStateChange: true,
                preCompact: true,
              },
              workflowRouterCoverage: {
                sessionStart: true,
                stopBoundary: true,
              },
            },
            {
              toolId: 'codex',
              displayName: 'OpenAI Codex',
              summary: 'Wrapper-mediated lifecycle adapter.',
              adapterKind: 'wrapper-manifest',
              supportTier: 'wrapper-mediated',
              supportStatus: 'implemented',
              path: '.skopos/tooling/codex/adapter-manifest.json',
              generatedFiles: ['.skopos/tooling/codex/adapter-manifest.json'],
              installMode: 'wrapper-runner',
              lifecycleCoverage: {
                sessionStart: true,
                userTurn: true,
                assistantTurn: true,
                majorStateChange: true,
                preCompact: true,
              },
              workflowRouterCoverage: {
                sessionStart: true,
                stopBoundary: true,
              },
            },
          ],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'scopes-lite.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'scopes-lite',
          type: 'scopes-lite',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:00:00.000Z',
          generatedAt: '2026-04-10T00:00:00.000Z',
          workspaceRoot,
          scopes: [
            {
              id: '@skopos/ui',
              kind: 'package',
              title: '@skopos/ui',
              path: 'packages/ui',
              aliases: ['ui'],
              summary: 'UI package',
              confidence: 'high',
            },
            {
              id: 'workspace',
              kind: 'workspace',
              title: 'workspace',
              path: '.',
              aliases: ['root'],
              summary: 'Workspace root',
              confidence: 'high',
            },
          ],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'program', 'state.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'program-state',
          type: 'program-state',
          status: 'generated',
          authority: 'generated',
          summary: 'stale program state should be replaced during ui build',
          updatedAt: '2026-04-09T00:00:00.000Z',
          generatedAt: '2026-04-09T00:00:00.000Z',
          workspaceRoot,
          items: [],
          sequence: {
            currentActiveItemId: 'program-item.mission.stale',
            doNow: 'program-item.mission.stale',
            doNext: undefined,
            deferred: [],
            interruptRecommendation: {
              decision: 'continue-current',
              summary: 'stale',
            },
          },
          obligations: [],
          attention: {
            highestPriority: 'medium',
            needsAttention: [],
          },
          sourcesDigest: {
            activeFindingCount: 0,
            activeMissionCount: 0,
            promotedCheckpointCount: 0,
            workflowQuestionCount: 0,
            workflowRecommendationCount: 0,
            trustLevel: 'medium',
            readiness: 'needs-review',
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'index.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'index',
          type: 'index',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:00:00.000Z',
          generatedAt: '2026-04-10T00:00:00.000Z',
          workspaceRoot,
          readiness: 'agent-ready',
          trustLevel: 'high',
          counts: {
            packageCount: 1,
            workspacePackageCount: 1,
            scopeCount: 2,
            graphCount: 1,
            planCount: 1,
            missionCount: 1,
            workflowRunCount: 1,
            workflowManifestCount: 1,
            overrideEntryCount: 0,
          },
          quickLinks: {
            configPath: 'skopos.config.yaml',
            bootstrapPath: '.skopos/bootstrap.json',
            docsStartHerePath: 'docs/00-start-here.md',
            logPath: '.skopos/log.jsonl',
          },
          latestEvent: {
            id: 'trust-1',
            eventKind: 'trust',
            status: 'succeeded',
            timestamp: '2026-04-10T00:00:00.000Z',
            summary: 'Trust refreshed.',
          },
          entries: [
            {
              id: 'docs-start',
              kind: 'doc-router',
              title: 'Docs start',
              summary: 'Docs entrypoint',
              path: 'docs/00-start-here.md',
              updatedAt: '2026-04-10T00:00:00.000Z',
            },
          ],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'plans', 'plan-ui.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'plan-ui',
          type: 'plan',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:10:00.000Z',
          generatedAt: '2026-04-10T00:10:00.000Z',
          workspaceRoot,
          goal: 'Build the routed console',
          title: 'Build the routed console',
          summary: 'Plan summary',
          scope: {
            query: '@skopos/ui',
            matchedBy: 'id',
            scope: {
              id: '@skopos/ui',
              kind: 'package',
              title: '@skopos/ui',
              path: 'packages/ui',
              aliases: ['ui'],
              summary: 'UI package',
              confidence: 'high',
            },
          },
          confidence: 'high',
          references: [],
          implementationSteps: [],
          recommendedChecks: ['pnpm typecheck'],
          recommendedWorkflows: [],
          decisionQuestions: [],
          risks: [],
          nextSteps: [],
          missionId: 'mission-ui',
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'missions', 'mission-ui.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'mission-ui',
          type: 'mission',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:11:00.000Z',
          generatedAt: '2026-04-10T00:11:00.000Z',
          workspaceRoot,
          planId: 'plan-ui',
          state: 'active',
          title: 'Mission: Build the routed console',
          summary: 'Mission summary',
          objective: 'Build the routed console',
          scope: {
            query: '@skopos/ui',
            matchedBy: 'id',
            scope: {
              id: '@skopos/ui',
              kind: 'package',
              title: '@skopos/ui',
              path: 'packages/ui',
              aliases: ['ui'],
              summary: 'UI package',
              confidence: 'high',
            },
          },
          items: [
            {
              id: 'step-1',
              kind: 'implementation',
              title: 'Build routed shell',
              detail: 'Implement the routed shell.',
              status: 'complete',
            },
          ],
          recommendedChecks: ['pnpm typecheck'],
          recommendedWorkflowIds: ['graph.render-local-portal'],
          decisionQuestionIds: [],
          linkedSlices: [],
          coordination: {
            claimedBy: {
              actorId: 'agent-ui',
              claimedAt: '2026-04-10T00:11:00.000Z',
            },
            lastUpdatedBy: 'agent-ui',
            lastUpdatedAt: '2026-04-10T00:11:00.000Z',
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'evals', 'mission-ui.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'eval-mission-ui',
          type: 'eval',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:13:00.000Z',
          generatedAt: '2026-04-10T00:13:00.000Z',
          workspaceRoot,
          missionId: 'mission-ui',
          evaluationStatus: 'complete',
          summary: 'Eval complete for mission-ui.',
          checkResults: [],
          workflowEvidence: [],
          pendingItemIds: [],
          blockingQuestionIds: [],
          proof: {
            status: 'pass',
            summary: 'Proof pass.',
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'runs', 'run-ui.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'run-ui',
          type: 'workflow-run',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:12:00.000Z',
          generatedAt: '2026-04-10T00:12:00.000Z',
          workspaceRoot,
          workflowId: 'graph.render-local-portal',
          workflowTitle: 'Render local portal',
          workflowSafety: 'mutating',
          runStatus: 'succeeded',
          outputPaths: ['docs/generated/skopos/index.html'],
          runByActorId: 'agent-ui',
          finishedAt: '2026-04-10T00:12:00.000Z',
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
          schemaVersion: 1,
          id: 'proof-latest-report',
          type: 'proof-report',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:15:00.000Z',
          generatedAt: '2026-04-10T00:15:00.000Z',
          workspaceRoot,
          definitionSetPath: 'internal/evals/proof-phase-benchmarks.json',
          baselinePath: 'internal/evals/proof-phase-baseline.json',
          scorecard: {
            definitionSetId: 'proof-phase',
            status: 'pass',
            benchmarkCount: 4,
            passedBenchmarks: 4,
            failedBenchmarks: 0,
            mustWinBenchmarks: 4,
            passedMustWinBenchmarks: 4,
            failedMustWinBenchmarks: 0,
            score: 8,
            maxScore: 8,
            weightedPassRate: 1,
            scoringPolicy: {
              minimumWeightedPassRate: 1,
              failOnAnyBenchmarkFailure: true,
              failOnAnyMustWinBenchmarkFailure: true,
            },
            categorySummaries: [
              {
                category: 'brownfield-clean',
                benchmarkCount: 1,
                passedBenchmarks: 1,
                failedBenchmarks: 0,
                score: 2,
                maxScore: 2,
                weightedPassRate: 1,
              },
            ],
            benchmarks: [],
          },
          comparison: {
            baselineId: 'proof-phase-baseline',
            definitionSetId: 'proof-phase',
            status: 'pass',
            benchmarkCountMatches: true,
            weightedPassRateDelta: 0,
            regressedBenchmarks: [],
            regressedCategories: [],
            benchmarkComparisons: [],
            categoryComparisons: [],
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'policies', 'resolved.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'resolved-policy',
          type: 'resolved-policy',
          status: 'generated',
          authority: 'generated',
          summary: 'Accepted policy resolves 1 pack with 1 active rule.',
          updatedAt: '2026-04-10T00:15:30.000Z',
          generatedAt: '2026-04-10T00:15:30.000Z',
          workspaceRoot,
          projectLifecycle: 'established-brownfield',
          defaultExecutionLane: 'normal',
          recommendedExecutionLanes: [
            {
              lane: 'normal',
              summary: 'Use for ordinary feature and maintenance work.',
              triggers: ['bounded feature work'],
              defaultGates: ['typecheck'],
            },
          ],
          acceptedPacks: [
            {
              packId: 'architecture.mid-app',
              version: '0.1.0',
              acceptedAt: '2026-04-10T00:15:30.000Z',
              acceptedBy: 'agent-ui',
              reason: 'Use the mid-app architecture rules for UI fixture work.',
              source: 'manual',
            },
          ],
          overrides: [],
          activeRules: [
            {
              id: 'architecture.mid-app.feature-owns-product-behavior',
              title: 'Feature owns product behavior',
              severity: 'must',
              summary: 'A feature should own its user workflow and local UI.',
              appliesTo: ['features', 'screens'],
            },
          ],
          sourcePaths: ['policy-packs/architecture/mid-app/pack.json'],
          generatedDocPaths: [],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'policies', 'recommendations.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'policy-recommendations',
          type: 'policy-recommendations',
          status: 'generated',
          authority: 'generated',
          summary: '1 policy recommendation is available.',
          updatedAt: '2026-04-10T00:15:30.000Z',
          generatedAt: '2026-04-10T00:15:30.000Z',
          workspaceRoot,
          projectLifecycle: 'established-brownfield',
          defaultExecutionLane: 'normal',
          recommendedExecutionLanes: [],
          recommendations: [
            {
              packId: 'architecture.mid-app',
              version: '0.1.0',
              family: 'architecture',
              variant: 'mid-app',
              displayName: 'Mid-App Architecture',
              confidence: 'high',
              recommendation: 'apply',
              reason: 'The fixture behaves like a mid-sized app.',
              plainLanguageSummary: 'Keep app wiring, feature code, and shared utilities easy to understand.',
              accepted: true,
              signals: [],
              antiSignals: [],
              sourcePath: 'policy-packs/architecture/mid-app/pack.json',
            },
          ],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'policies', 'role-mapping.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'policy-role-mapping',
          type: 'policy-role-mapping',
          status: 'generated',
          authority: 'generated',
          summary: 'Mapped accepted policy roles to local project paths.',
          updatedAt: '2026-04-10T00:15:30.000Z',
          generatedAt: '2026-04-10T00:15:30.000Z',
          workspaceRoot,
          resolvedPolicyPath: '.skopos/policies/resolved.json',
          mappings: [
            {
              packId: 'architecture.mid-app',
              sourcePath: 'policy-packs/architecture/mid-app/pack.json',
              role: 'features / modules / domains',
              label: 'Product features',
              required: true,
              status: 'inferred',
              confidence: 'high',
              checkedAliases: ['src/features', 'src/use-cases'],
              matchedAliases: ['src/use-cases'],
              matchedPaths: ['src/use-cases'],
              reason: 'Matched Product features through 1 local alias.',
            },
          ],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, 'policy-packs', 'architecture', 'mid-app', 'pack.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'policy-pack.architecture.mid-app',
          type: 'policy-pack',
          status: 'active',
          authority: 'canonical',
          summary: 'Architecture policy for mid-sized product apps.',
          updatedAt: '2026-04-10T00:00:00.000Z',
          packId: 'architecture.mid-app',
          family: 'architecture',
          variant: 'mid-app',
          version: '0.1.0',
          displayName: 'Mid-App Architecture',
          description: 'Architecture guidance for projects with several features and shared runtime boundaries.',
          plainLanguageSummary: 'Keep app wiring, feature code, and shared utilities easy to understand.',
          bestFor: ['Several feature areas', 'Shared API or runtime code'],
          notFor: ['One-off scripts'],
          userQuestions: ['Where does each feature own behavior, UI, and tests?'],
          qualityBar: ['Agents can explain what to do differently before editing code.'],
          agentUse: ['Check the folder tree before moving feature code.'],
          structureTree: {
            title: 'Mid-app structure tree',
            summary: 'A clear app shape for runtime wiring, product behavior, infrastructure, and UI roles. These are roles, not required folder names.',
            rootLabel: 'source root',
            nodes: [
              {
                path: 'app / composition root',
                label: 'App shell and composition root',
                responsibility: 'Owns route setup and dependency assembly.',
                required: true,
                matchPaths: ['src/app', 'src/routes'],
              },
              {
                path: 'features / modules / domains',
                label: 'Product features',
                responsibility: 'Owns user workflows and local UI.',
                required: true,
                matchPaths: ['src/features', 'src/use-cases'],
              },
              {
                path: 'infrastructure / adapters',
                label: 'Infrastructure and adapters',
                responsibility: 'Owns external service and vendor boundaries.',
                required: true,
                matchPaths: ['src/infrastructure', 'src/gateways'],
              },
              {
                path: 'ui / components / design system',
                label: 'Reusable UI primitives',
                responsibility: 'Owns reusable UI and presentation primitives.',
                required: false,
                matchPaths: ['src/ui', 'src/presenters'],
              },
            ],
          },
          recommendedLayers: ['composition-root', 'features', 'application', 'domain', 'infrastructure', 'shared'],
          dependencyDirection: {
            'composition-root': { mayImport: ['features', 'infrastructure', 'shared'] },
            features: { mayImport: ['application', 'domain', 'infrastructure', 'shared'] },
            infrastructure: { mayImport: ['application', 'domain', 'shared'] },
            shared: { mayImport: [] },
          },
          forbiddenImports: [
            {
              from: 'domain',
              to: ['composition-root', 'infrastructure', 'ui'],
            },
          ],
          gates: {
            required: ['pnpm typecheck'],
            recommended: ['pnpm test', 'pnpm build'],
          },
          agentPrompts: {
            beforeEditing: ['Identify the current architecture layers before adding files.'],
            beforeDone: ['Confirm no second pattern was introduced.'],
          },
          projectLifecycles: ['established-brownfield'],
          appliesWhen: [
            {
              id: 'signal.multiple-product-features',
              summary: 'The project has several feature areas.',
              confidence: 'high',
              evidence: ['Multiple feature, route, or domain directories'],
            },
          ],
          avoidWhen: [],
          rules: [
            {
              id: 'architecture.mid-app.feature-owns-product-behavior',
              title: 'Feature owns product behavior',
              severity: 'must',
              summary: 'A feature should own its user workflow and local UI.',
              appliesTo: ['features', 'screens'],
            },
          ],
          requiredDocs: [],
          generatedArtifacts: ['.skopos/policies/resolved.json'],
          driftCheckIds: ['architecture.mid-app.business-logic-in-shared-helper'],
          proofFixtureIds: ['architecture.mid-app.good-feature-boundary'],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'drift', 'report.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'drift-report',
          type: 'drift-report',
          status: 'generated',
          authority: 'generated',
          summary: 'No open accepted-policy drift was detected.',
          updatedAt: '2026-04-10T00:15:40.000Z',
          generatedAt: '2026-04-10T00:15:40.000Z',
          workspaceRoot,
          resolvedPolicyPath: '.skopos/policies/resolved.json',
          counts: {
            openMustCount: 0,
            openShouldCount: 0,
            advisoryCount: 0,
            suppressedCount: 0,
            resolvedCount: 0,
          },
          findings: [],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'discussions', 'index.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'discussion-index',
          type: 'discussion-index',
          status: 'generated',
          authority: 'generated',
          summary: '1 discussion checkpoint is available for routed history and resume state.',
          updatedAt: '2026-04-10T00:12:30.000Z',
          generatedAt: '2026-04-10T00:12:30.000Z',
          workspaceRoot,
          latestCheckpointId: 'discussion-checkpoint-ui',
          latestCheckpointPath: '.skopos/discussions/checkpoints/discussion-checkpoint-ui.json',
          checkpointCount: 1,
          entries: [
            {
              id: 'discussion-checkpoint-ui',
              threadId: 'mission:mission-ui',
              artifactPath: '.skopos/discussions/checkpoints/discussion-checkpoint-ui.json',
              activeMissionId: 'mission-ui',
              linkedPlanId: 'plan-ui',
              summary: 'Current routed-console discussion checkpoint.',
              currentDirection:
                'Keep the routed console work tied to the latest accepted UI direction.',
              updatedAt: '2026-04-10T00:12:30.000Z',
            },
          ],
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'discussions', 'checkpoints', 'discussion-checkpoint-ui.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'discussion-checkpoint-ui',
          type: 'discussion-checkpoint',
          status: 'generated',
          authority: 'generated',
          summary: 'Current routed-console discussion checkpoint.',
          updatedAt: '2026-04-10T00:12:30.000Z',
          generatedAt: '2026-04-10T00:12:30.000Z',
          workspaceRoot,
          threadId: 'mission:mission-ui',
          checkpointKind: 'workflow-state',
          activeMissionId: 'mission-ui',
          linkedPlanId: 'plan-ui',
          currentDirection: 'Keep the routed console work tied to the latest accepted UI direction.',
          acceptedDecisions: [
            {
              id: 'plan.scope-confirmation',
              title: 'Scope Confirmation',
              resolvedOptionId: 'narrow-scope-first',
              resolvedOptionLabel: 'Narrow scope first',
            },
          ],
          openQuestions: [],
          recommendedNextCommand: 'skopos next /workspace --mission mission-ui',
          linkedArtifactPaths: ['.skopos/questions.json'],
          resumeSummary: 'Resume the current mission with the latest accepted UI direction.',
          estimatedTokens: 104,
          budgetTokens: 900,
          overBudget: false,
          promotionTrigger: 'workflow-decision',
          promotionKinds: ['accepted-decisions-changed', 'open-questions-changed'],
          supersedesCheckpointId: 'discussion-checkpoint-ui-previous',
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'discussions', 'handoffs', 'latest-workflow.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'discussion-handoff-latest-workflow',
          type: 'discussion-handoff',
          status: 'generated',
          authority: 'generated',
          summary: 'Latest workflow handoff.',
          updatedAt: '2026-04-10T00:13:00.000Z',
          generatedAt: '2026-04-10T00:13:00.000Z',
          workspaceRoot,
          handoffKind: 'workflow-resume',
          activeMissionId: 'mission-ui',
          currentDirection: 'Keep the routed console work tied to the latest accepted UI direction.',
          acceptedDecisions: [
            {
              id: 'plan.scope-confirmation',
              title: 'Scope Confirmation',
              resolvedOptionId: 'narrow-scope-first',
              resolvedOptionLabel: 'Narrow scope first',
            },
          ],
          openQuestions: [],
          recommendedNextCommand: 'skopos next /workspace --mission mission-ui',
          linkedCheckpointIds: ['discussion-checkpoint-ui'],
          linkedArtifactPaths: ['.skopos/questions.json'],
          resumeSummary: 'Resume the current mission with the latest accepted UI direction.',
          estimatedTokens: 104,
          budgetTokens: 1200,
          overBudget: false,
        },
        null,
        2,
      ),
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'discussions', 'raw', 'mission-mission-ui.jsonl'),
      [
        JSON.stringify({
          schemaVersion: 1,
          id: 'discussion-turn-user-1',
          type: 'discussion-turn',
          recordedAt: '2026-04-10T00:11:00.000Z',
          workspaceRoot,
          threadId: 'mission:mission-ui',
          sessionId: 'session-ui',
          role: 'user',
          sourceEvent: 'user-prompt-submit',
          message: 'Add discussion context to the routed console without replaying the full chat.',
          excerpt: 'Add discussion context to the routed console without replaying the full chat.',
          estimatedTokens: 18,
          activeMissionId: 'mission-ui',
        }),
        ...Array.from({ length: 13 }, (_, index) =>
          JSON.stringify({
            schemaVersion: 1,
            id: `discussion-turn-assistant-${index + 1}`,
            type: 'discussion-turn',
            recordedAt: `2026-04-10T00:${String(11 + index).padStart(2, '0')}:30.000Z`,
            workspaceRoot,
            threadId: 'mission:mission-ui',
            sessionId: 'session-ui',
            role: 'assistant',
            sourceEvent: 'assistant-turn',
            message:
              index === 0
                ? 'Load the latest handoff and checkpoints into console state, then surface them in overview and mission detail.'
                : `Assistant follow-up ${index + 1} keeps extending the latest discussion tail.`,
            excerpt:
              index === 0
                ? 'Load the latest handoff and checkpoints into console state, then surface them in overview and mission detail.'
                : `Assistant follow-up ${index + 1} keeps extending the latest discussion tail.`,
            estimatedTokens: 24,
            activeMissionId: 'mission-ui',
          }),
        ),
      ].join('\n') + '\n',
      'utf8',
    );
    await writeFile(
      join(workspaceRoot, '.skopos', 'graph', 'workspace.json'),
      JSON.stringify(
        {
          schemaVersion: 1,
          id: 'graph-workspace',
          type: 'graph',
          status: 'generated',
          authority: 'generated',
          updatedAt: '2026-04-10T00:00:00.000Z',
          generatedAt: '2026-04-10T00:00:00.000Z',
          workspaceRoot,
          graphKind: 'workspace',
          focusId: 'workspace',
          summary: 'Workspace relationships.',
          nodes: [
            { id: 'workspace', kind: 'workspace', label: 'workspace', state: 'active' },
            {
              id: '@skopos/ui',
              kind: 'scope',
              label: '@skopos/ui',
              state: 'active',
              path: 'packages/ui',
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
      join(workspaceRoot, '.skopos', 'log.jsonl'),
      `${JSON.stringify({
        schemaVersion: 1,
        id: 'log-1',
        type: 'log-entry',
        workspaceRoot,
        eventKind: 'trust',
        status: 'succeeded',
        timestamp: '2026-04-10T00:16:00.000Z',
        summary: 'Trust refreshed.',
        relatedArtifactPaths: ['.skopos/proof/latest-report.json'],
        metadata: { actorId: 'agent-ui' },
      })}\n`,
      'utf8',
    );

    const result = await buildSkoposUiConsoleApp({
      cwd: workspaceRoot,
    });

    expect(result.writeStatus).toBe('written');
    expect(result.trustLevel).toBe('medium');
    expect(result.readiness).toBe('needs-review');
    expect(result.entryHtmlPath).toBe(join(workspaceRoot, 'docs/generated/skopos/app/index.html'));
    expect(result.statePath).toBe(join(workspaceRoot, 'docs/generated/skopos/app/ui-state.json'));
    expect(result.searchIndexPath).toBe(
      join(workspaceRoot, 'docs/generated/skopos/app/search-index.json'),
    );
    expect(result.assetPaths).toEqual(
      expect.arrayContaining([
        result.entryHtmlPath,
        result.statePath,
        result.searchIndexPath,
      ]),
    );
    expect(result.assetPaths.some((assetPath) => assetPath.endsWith('.js'))).toBe(true);

    const html = await readFile(result.entryHtmlPath, 'utf8');
    const stateJson = await readFile(result.statePath, 'utf8');
    const searchIndexJson = await readFile(result.searchIndexPath, 'utf8');

    expect(html).toContain('Skopos Console');
    expect(html).not.toContain('__SKOPOS_UI_STATE__');
    expect(html).toContain('"workspaceLabel":"');
    expect(stateJson).toContain('"uiMode": "snapshot"');
    expect(stateJson).toContain('"workspaceLabel"');
    expect(stateJson).toContain('"workspaceRoot"');
    expect(stateJson).toContain('"proofReport"');
    expect(stateJson).toContain('"policyReview"');
    expect(stateJson).toContain('"packManifests"');
    expect(stateJson).toContain('"roleMapping"');
    expect(stateJson).toContain('"policy-role-mapping"');
    expect(stateJson).toContain('"architecture.mid-app"');
    expect(stateJson).toContain('Multiple feature, route, or domain directories');
    expect(stateJson).toContain('"structureMatch"');
    expect(stateJson).toContain('"matchedPaths"');
    expect(stateJson).toContain('"checkedPatterns"');
    expect(stateJson).toContain('"matchedPatterns"');
    expect(stateJson).toContain('src/use-cases');
    expect(stateJson).toContain('src/gateways');
    expect(stateJson).toContain('"driftReport"');
    expect(stateJson).toContain('"documents"');
    expect(stateJson).toContain('"latestDiscussionHandoff"');
    expect(stateJson).toContain('"discussionCheckpoints"');
    expect(stateJson).toContain('"programState"');
    expect(stateJson).toContain('"currentActiveItemId": "program-item.mission.mission-ui"');
    expect(stateJson).toContain('"recommendedAction": {');
    expect(stateJson).toContain('"kind": "complete-current-mission"');
    expect(stateJson).toContain('"command": "skopos mission complete mission-ui');
    expect(stateJson).not.toContain('stale program state should be replaced during ui build');
    expect(stateJson).not.toContain('"latestDiscussionRawJournal"');
    expect(stateJson).not.toContain('"discussion-turn-user-1"');
    expect(stateJson).not.toContain('"discussion-turn-assistant-1"');
    expect(stateJson).toContain('"promotionTrigger": "workflow-decision"');
    expect(stateJson).toContain('"promotionKinds": [');
    expect(stateJson).toContain('"accepted-decisions-changed"');
    expect(stateJson).toContain('"open-questions-changed"');
    expect(stateJson).toContain('"adapterSupport"');
    expect(stateJson).toContain('"OpenAI Codex"');
    expect(stateJson).toContain('"workflowRouterCoverage"');
    expect(stateJson).toContain('"stopBoundary": true');
    expect(stateJson).toContain('"searchIndex"');
    expect(stateJson).toContain('"Docs start here"');
    expect(searchIndexJson).toContain('"entries"');
    expect(searchIndexJson).toContain('"docs-start"');
    expect(searchIndexJson).toContain('"discussion-handoff-latest-workflow"');
    expect(searchIndexJson).toContain('"discussion-checkpoint-ui"');
    expect(searchIndexJson).toContain('"#/rules"');
    expect(searchIndexJson).toContain('"#/rules/packs/architecture.mid-app"');
  }, 120_000);
});
