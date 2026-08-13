import { basename, join } from 'node:path';

import { createDefaultSkoposConfig, loadSkoposConfig } from '@skopos/config';
import type {
  SkoposArchitectureReport,
  SkoposBootstrapArtifact,
  SkoposDiagnosisReport,
  SkoposInitMode,
  SkoposRootConfig,
  SkoposScopesLiteArtifact,
} from '@skopos/model';

import { buildSkoposArchitectureReport } from '../build-architecture-report/build-architecture-report.service.js';
import { buildBootstrapQuestions } from '../build-bootstrap-questions/build-bootstrap-questions.service.js';
import { buildSkoposDiagnosisReport } from '../build-diagnosis-report/build-diagnosis-report.service.js';
import { buildSkoposScopesLite } from '../build-scopes-lite/build-scopes-lite.service.js';
import { scanRepo } from '../scan-repo/scan-repo.service.js';

export interface BuildSkoposBootstrapArtifactsOptions {
  cwd: string;
  mode?: SkoposInitMode;
  existingConfig?: SkoposRootConfig | null;
  subtreeTarget?: string;
}

export interface SkoposBootstrapArtifacts {
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  diagnosis: SkoposDiagnosisReport;
  architecture: SkoposArchitectureReport;
}

export const buildSkoposBootstrapArtifacts = async ({
  cwd,
  mode = 'existing',
  existingConfig,
  subtreeTarget,
}: BuildSkoposBootstrapArtifactsOptions): Promise<SkoposBootstrapArtifacts> => {
  const rootConfig =
    existingConfig === undefined
      ? await loadSkoposConfig(join(cwd, 'skopos.config.yaml'))
      : existingConfig;
  const detected = await scanRepo({ cwd, subtreeTarget, existingConfig: rootConfig });
  const inferredConfig = createDefaultSkoposConfig({
    projectName: basename(cwd),
    archetype: detected.archetypeSuggestion,
    repoMode: detected.repoMode,
    projectMode: mode === 'greenfield' ? 'new-project' : 'brownfield',
    docsRoot: detected.docsHealth.root ?? detected.docsRoots[0] ?? 'docs',
    docsStartHerePath:
      detected.docsHealth.startHerePath ??
      joinPath(detected.docsHealth.root ?? detected.docsRoots[0] ?? 'docs', '00-start-here.md'),
    canonicalInstructions:
      detectCanonicalInstructionSource(detected.instructionFiles) ?? 'AGENTS.md',
    commands: detected.commands,
  });
  const recommendedConfig = rootConfig ?? inferredConfig;
  const scopesLite = await buildSkoposScopesLite({ cwd, scanSummary: detected, subtreeTarget });
  const diagnosis = await buildSkoposDiagnosisReport({
    cwd,
    scanSummary: detected,
    subtreeTarget,
  });
  const architecture = await buildSkoposArchitectureReport({
    cwd,
    scanSummary: detected,
    diagnosis,
    scopesLite,
    subtreeTarget,
  });
  const recommendedQuestions = buildBootstrapQuestions({
    scanSummary: detected,
    existingConfig: rootConfig,
  });

  return {
    bootstrap: {
      schemaVersion: 1,
      id: 'bootstrap',
      type: 'bootstrap',
      status: 'generated',
      authority: 'generated',
      summary: 'Bootstrap scan and recommended starter config for the current workspace.',
      updatedAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      workspaceRoot: cwd,
      mode,
      focusSubtree: detected.focusSubtree,
      detected,
      sourceDependencies: detected.sourceDependencies,
      recommendedConfig,
      recommendedQuestions,
      recommendedNextSteps: buildRecommendedNextSteps(
        detected.findings,
        recommendedQuestions,
      ),
    },
    scopesLite,
    diagnosis,
    architecture,
  };
};

const buildRecommendedNextSteps = (
  findings: string[],
  questions: Array<{ id: string }>,
): string[] => {
  const questionIds = new Set(questions.map((question) => question.id));
  const steps = [
    questionIds.has('bootstrap.project-archetype')
      ? 'Review the recommended root config and confirm project archetype and Scope strategy.'
      : 'Review the configured root settings and confirm only any proposed Scope changes.',
    questionIds.has('bootstrap.commands')
      ? 'Confirm the canonical command surface for dev, build, test, typecheck, and lint.'
      : 'Use the configured canonical command surface for setup checks.',
    'Review findings and promote any durable repo rules into canonical docs before broad agent use.',
  ];

  if (findings.some((finding) => finding.includes('instruction source'))) {
    steps.push(
      'Add the configured canonical instruction source before generating tool-specific mirrors.',
    );
  }

  if (findings.some((finding) => finding.includes('docs root'))) {
    steps.push('Add a canonical docs root and a deterministic start-here router.');
  }

  if (findings.some((finding) => finding.includes('Stale docs detected'))) {
    steps.push(
      'Refresh stale docs metadata and content before treating the docs root as trusted project guidance.',
    );
  }

  return steps;
};

const detectCanonicalInstructionSource = (
  instructionFiles: string[],
): string | undefined =>
  instructionFiles.find((instructionFile) => instructionFile.endsWith('AGENTS.md')) ??
  instructionFiles[0];

const joinPath = (left: string, right: string): string =>
  `${left.replace(/\/$/, '')}/${right.replace(/^\//, '')}`;
