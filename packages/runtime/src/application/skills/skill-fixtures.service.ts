import { join, resolve } from 'node:path';

import {
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
} from '@skopos/indexer';
import type { SkoposLoadedProjectSkillBinding } from '@skopos/indexer';
import type {
  SkoposAgentNativeOperatingModel,
  SkoposSkillFixtureEvaluationArtifact,
  SkoposSkillFixtureFailure,
  SkoposSkillFixtureManifest,
  SkoposTaskContract,
} from '@skopos/model';

import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  buildSkoposSkillAcceptanceIdentityRuntime,
} from './skill-identity.service.js';
import {
  listSkoposProjectSkillBindingsRuntime,
  selectSkoposSkillsForTaskRuntime,
  showSkoposSkillPackRuntime,
} from './skills.service.js';

export const SKILL_FIXTURE_EVALUATIONS_ARTIFACT_DIRECTORY =
  '.skopos/index/skills/evaluations';

export const evaluateSkoposSkillFixturesRuntime = async ({
  cwd,
  pack: packId,
  binding: bindingId,
  dryRun = false,
  candidateBinding,
}: {
  cwd: string;
  pack: string;
  binding: string;
  dryRun?: boolean;
  candidateBinding?: SkoposLoadedProjectSkillBinding;
}): Promise<{
  artifact: SkoposSkillFixtureEvaluationArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
}> => {
  const workspaceRoot = resolve(cwd);
  const [pack, bindings, operatingModel] = await Promise.all([
    showSkoposSkillPackRuntime({ cwd: workspaceRoot, pack: packId }),
    listSkoposProjectSkillBindingsRuntime({ cwd: workspaceRoot }),
    loadOperatingModelCapabilities(workspaceRoot),
  ]);
  const trackedBinding = bindings.find(
    (candidate) =>
      candidate.bindingId === bindingId || candidate.sourcePath === bindingId,
  );
  if (!trackedBinding) throw new Error(`Unknown project skill binding: ${bindingId}`);
  const { acceptance: _acceptance, ...bindingDeclaration } =
    candidateBinding ?? trackedBinding;
  const binding: SkoposLoadedProjectSkillBinding = {
    ...bindingDeclaration,
    lifecycle: 'accepted',
  };
  const identity = await buildSkoposSkillAcceptanceIdentityRuntime({
    workspaceRoot,
    pack,
    binding,
    operatingModel,
  });
  const results = [];
  for (const fixture of pack.fixtures) {
    const result = await selectSkoposSkillsForTaskRuntime({
      cwd: workspaceRoot,
      taskId: `fixture-${fixture.fixtureId}`,
      task: toTaskContract(fixture),
      taskRisk: fixture.task.risk,
      phase: fixture.task.phase,
      ownedPaths: fixture.task.ownedPaths,
      changedPaths: fixture.task.changedPaths,
      affectedCapabilities: fixture.task.affectedCapabilities,
      selectedActionIds: fixture.task.selectedActionIds,
      applicableGuardIds: fixture.task.applicableGuardIds,
      acceptedFailureEvidence: fixture.task.acceptedFailureEvidence,
      operatingModel,
      cacheMode: 'bypass',
      candidateSkill: {
        pack,
        binding,
        projectLifecycle: fixture.task.projectLifecycle,
      },
    });
    const selectedModuleIds = uniqueSorted(
      result.selectedSkills.flatMap((skill) => skill.selectedModuleIds),
    );
    const selectedActionIds = uniqueSorted(
      result.selectedSkills.flatMap((skill) => skill.selectedActionIds),
    );
    const selectedGuardIds = uniqueSorted(
      result.selectedSkills.flatMap((skill) => skill.selectedGuardIds),
    );
    const measuredTokens = result.selectedSkills.reduce(
      (total, skill) => total + skill.measuredContextTokens,
      0,
    );
    const failures = evaluateFixtureExpectation({
      fixture,
      selectedModuleIds,
      selectedActionIds,
      selectedGuardIds,
      measuredTokens,
      explanations: result.explanations,
    });
    results.push({
      fixtureId: fixture.fixtureId,
      category: fixture.category,
      sourcePath: fixture.sourcePath,
      status: failures.length === 0 ? 'pass' as const : 'fail' as const,
      selectedModuleIds,
      selectedActionIds,
      selectedGuardIds,
      measuredTokens,
      failures,
    });
  }
  const generatedAt = new Date().toISOString();
  const artifact: SkoposSkillFixtureEvaluationArtifact = {
    schemaVersion: 1,
    id: `skill-fixture-evaluation.${pack.packId}`,
    type: 'skill-fixture-evaluation',
    status: 'generated',
    authority: 'generated',
    summary: `${results.filter((result) => result.status === 'pass').length} of ${results.length} deterministic Skill fixtures passed.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    packId: pack.packId,
    packVersion: pack.version,
    bindingId: binding.bindingId,
    identity,
    passed: results.filter((result) => result.status === 'pass').length,
    failed: results.filter((result) => result.status === 'fail').length,
    results,
  };
  const artifactPath = join(
    workspaceRoot,
    SKILL_FIXTURE_EVALUATIONS_ARTIFACT_DIRECTORY,
    `${pack.packId}.json`,
  );
  const artifactWrite = await writeJsonArtifact({ artifactPath, artifact, dryRun });
  return { artifact, artifactPath, artifactWrite };
};

const evaluateFixtureExpectation = ({
  fixture,
  selectedModuleIds,
  selectedActionIds,
  selectedGuardIds,
  measuredTokens,
  explanations,
}: {
  fixture: SkoposSkillFixtureManifest;
  selectedModuleIds: string[];
  selectedActionIds: string[];
  selectedGuardIds: string[];
  measuredTokens: number;
  explanations: Array<{
    moduleId?: string;
    outcome: 'selected' | 'suppressed';
    reasonCode: string;
  }>;
}): SkoposSkillFixtureFailure[] => {
  const failures: SkoposSkillFixtureFailure[] = [];
  compareExact(failures, 'selectedModuleIds', fixture.expectation.selectedModuleIds, selectedModuleIds);
  compareExact(failures, 'selectedActionIds', fixture.expectation.selectedActionIds, selectedActionIds);
  compareExact(failures, 'selectedGuardIds', fixture.expectation.selectedGuardIds, selectedGuardIds);
  for (const [moduleId, reasonCode] of Object.entries(
    fixture.expectation.suppressedModuleReasonCodes,
  )) {
    const observed = explanations.find(
      (entry) => entry.moduleId === moduleId && entry.outcome === 'suppressed',
    )?.reasonCode;
    if (observed !== reasonCode) {
      failures.push({
        field: `suppressedModuleReasonCodes.${moduleId}`,
        expected: reasonCode,
        observed: observed ?? null,
      });
    }
  }
  if (
    fixture.expectation.maximumSelectedModules !== undefined &&
    selectedModuleIds.length > fixture.expectation.maximumSelectedModules
  ) {
    failures.push({
      field: 'maximumSelectedModules',
      expected: fixture.expectation.maximumSelectedModules,
      observed: selectedModuleIds.length,
    });
  }
  if (
    fixture.expectation.maximumMeasuredTokens !== undefined &&
    measuredTokens > fixture.expectation.maximumMeasuredTokens
  ) {
    failures.push({
      field: 'maximumMeasuredTokens',
      expected: fixture.expectation.maximumMeasuredTokens,
      observed: measuredTokens,
    });
  }
  return failures;
};

const compareExact = (
  failures: SkoposSkillFixtureFailure[],
  field: string,
  expected: string[],
  observed: string[],
): void => {
  const expectedSorted = uniqueSorted(expected);
  if (JSON.stringify(expectedSorted) !== JSON.stringify(observed)) {
    failures.push({ field, expected: expectedSorted, observed });
  }
};

const toTaskContract = (fixture: SkoposSkillFixtureManifest): SkoposTaskContract => ({
  goal: fixture.task.goal,
  scope: {
    query: fixture.task.scope.id,
    matchedBy: 'id',
    scope: {
      ...fixture.task.scope,
      summary: fixture.task.scope.title,
      confidence: 'high',
    },
  },
  acceptanceCriteria: fixture.task.acceptanceCriteria,
  constraints: fixture.task.constraints,
  nonGoals: fixture.task.nonGoals,
  openDecisions: fixture.task.openDecisions.map((question, index) => ({
    id: `fixture-decision-${index + 1}`,
    question,
    blocking: false,
  })),
  requiredProof: [],
  missingFields: [],
  provenance: [],
});

const loadOperatingModelCapabilities = async (
  workspaceRoot: string,
): Promise<SkoposAgentNativeOperatingModel> => {
  const [actions, guards] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadSkoposGuardManifests({ cwd: workspaceRoot }),
  ]);
  return {
    schemaVersion: 1,
    context: [],
    actions: actions.map((action) => ({ id: action.id })) as SkoposAgentNativeOperatingModel['actions'],
    guards: guards.map((guard) => ({ id: guard.id })) as SkoposAgentNativeOperatingModel['guards'],
    diagnostics: [],
  };
};

const uniqueSorted = (values: string[]): string[] => [...new Set(values)].sort();
