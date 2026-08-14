import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import {
  cp,
  appendFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const cliPackageRoot = join(workspaceRoot, 'packages/cli');
const actor = 'external-skill-portability';

type PnpmInvocation = {
  command: string;
  argsPrefix: string[];
};

export const resolvePnpmInvocation = ({
  platform = process.platform,
  packageManagerEntrypoint = process.env.npm_execpath,
  nodeExecutable = process.execPath,
  commandInterpreter = process.env.ComSpec ?? process.env.COMSPEC,
}: {
  platform?: NodeJS.Platform;
  packageManagerEntrypoint?: string | null;
  nodeExecutable?: string;
  commandInterpreter?: string;
} = {}): PnpmInvocation =>
  packageManagerEntrypoint
    ? { command: nodeExecutable, argsPrefix: [packageManagerEntrypoint] }
    : platform === 'win32'
      ? {
          command: commandInterpreter || 'cmd.exe',
          argsPrefix: ['/d', '/s', '/c', 'pnpm'],
        }
      : { command: 'pnpm', argsPrefix: [] };

export const isHandoffArtifactPath = (path: string): boolean =>
  normalize(path).endsWith('/handoff.json');

type CommandRecord = {
  command: string;
  cwd: string;
  status: 'passed' | 'failed';
  outputBytes: number;
  exitCode?: number;
  errorSummary?: string;
};

type FailureCategory =
  | 'skopos-portability'
  | 'project-adaptation'
  | 'external-project';

type FailureRecord = {
  category: FailureCategory;
  stage: string;
  project: 'harness' | 'minimal' | 'external';
  command?: string;
  message: string;
};

type ProjectProof = {
  label: 'minimal' | 'external';
  externalRoot: string;
  installedCliRoot: string;
  initialized: boolean;
  discoveredPackSource: string;
  recommendation: string;
  fixtureResult: { passed: number; failed: number };
  appliedBindingId: string;
  hostProjectionPaths: string[];
  relevantTask: {
    id: string;
    selectedPackIds: string[];
    selectedModuleIds: string[];
    selectedActionIds: string[];
    selectedGuardIds: string[];
    skillContextEntryCount: number;
  };
  irrelevantTask: {
    id: string;
    selectedPackIds: string[];
    skillContextEntryCount: number;
  };
  cache: {
    artifactPath: string;
    exactReuse: boolean;
    invalidatedAfterCapabilityChange: boolean;
    invalidationDiagnostic: string;
  };
  containment: {
    claim: 'observed-generated-artifacts-contained';
    assertionScope: string;
    generatedPathsChecked: number;
    outsideProjectPaths: string[];
    forbiddenSymlinkTargets: string[];
    installedSourceCheckoutReferences: string[];
    nodePathAbsent: boolean;
    workspaceProtocolAbsent: boolean;
    controlledTempRoot: string;
    controlledCacheRoot: string;
  };
  executedCapabilityActions: string[];
  adaptationGaps: string[];
  commands: CommandRecord[];
  limitations: string[];
  continuation: ContinuationProof;
};

type ContinuationProof = {
  taskId: string;
  classifications: Array<'current' | 'refreshable' | 'stale' | 'conflicted' | 'invalid'>;
  redactedSecret: boolean;
  nearBudget: { estimatedTokens: number; valid: boolean };
  overBudget: { estimatedTokens: number; valid: boolean; meaningRetained: boolean };
  manualPromptContains: string[];
  actionRecovery: 'interrupted';
  evidenceInvalidation: boolean;
  cleanReconstruction: { taskRecovered: boolean; localHandoffAbsent: boolean };
};

export type ExternalSkillPortabilityReport = {
  schemaVersion: 1;
  result: 'pass' | 'fail';
  generatedAt: string;
  package?: {
    name: '@unisane/skopos';
    version: string;
    tarballName: string;
    sha256: string;
    packedFrom: string;
  };
  harnessRoot: string;
  sourceCheckout: string;
  originalCanary?: string;
  originalCanaryIntegrity?: {
    gitStatusBefore: string[];
    gitStatusAfter: string[];
    unchanged: boolean;
  };
  projects: ProjectProof[];
  failure?: FailureRecord;
  classification: {
    skoposPortabilityFailures: FailureRecord[];
    projectAdaptationFailures: FailureRecord[];
    externalProjectFailures: FailureRecord[];
  };
  cleanup: {
    attempted: boolean;
    succeeded: boolean;
    harnessRootExistsAfterCleanup: boolean;
    retainedByRequest: boolean;
    error?: string;
  };
};

class PortabilityFailure extends Error {
  constructor(readonly record: FailureRecord) {
    super(record.message);
  }
}

export const runExternalSkillPortability = async ({
  canaryRoot,
  keepTemporary = false,
}: {
  canaryRoot?: string;
  keepTemporary?: boolean;
} = {}): Promise<ExternalSkillPortabilityReport> => {
  const harnessRoot = await mkdtemp(join(tmpdir(), 'skopos-skill-portability-'));
  const packRoot = join(harnessRoot, 'packed');
  const projectsRoot = join(harnessRoot, 'projects');
  await Promise.all([
    mkdir(packRoot, { recursive: true }),
    mkdir(projectsRoot, { recursive: true }),
  ]);
  const projects: ProjectProof[] = [];
  let packageIdentity: ExternalSkillPortabilityReport['package'];
  let originalCanaryStatusBefore: string[] | undefined;
  let originalCanaryStatusAfter: string[] | undefined;
  let failure: FailureRecord | undefined;
  let currentFailure: Omit<FailureRecord, 'message'> = {
    category: 'skopos-portability',
    stage: 'pack-cli',
    project: 'harness',
    command: process.env.SKOPOS_RELEASE_TARBALL
      ? 'reuse SKOPOS_RELEASE_TARBALL'
      : 'pnpm pack --pack-destination <temporary-pack-root>',
  };
  try {
    const tarballPath = packCli(packRoot);
    const packageJson = JSON.parse(
      await readFile(join(cliPackageRoot, 'package.json'), 'utf8'),
    ) as { version: string };
    packageIdentity = {
      name: '@unisane/skopos' as const,
      version: packageJson.version,
      tarballName: basename(tarballPath),
      sha256: createHash('sha256')
        .update(new Uint8Array(await readFile(tarballPath)))
        .digest('hex'),
      packedFrom: cliPackageRoot,
    };
    currentFailure = {
      category: 'skopos-portability',
      stage: 'minimal-packed-project',
      project: 'minimal',
    };
    projects.push(
      await proveMinimalProject({
        projectRoot: join(projectsRoot, 'minimal'),
        tarballPath,
      }),
    );
    if (canaryRoot) {
      currentFailure = {
        category: 'external-project',
        stage: 'read-live-canary-status-before',
        project: 'external',
        command: 'git status --short',
      };
      originalCanaryStatusBefore = readGitStatus(resolve(canaryRoot));
      currentFailure = {
        category: 'project-adaptation',
        stage: 'external-sanitized-project',
        project: 'external',
      };
      projects.push(
        await proveExternalProject({
          originalRoot: resolve(canaryRoot),
          projectRoot: join(projectsRoot, 'external-sanitized'),
          tarballPath,
        }),
      );
      currentFailure = {
        category: 'external-project',
        stage: 'read-live-canary-status-after',
        project: 'external',
        command: 'git status --short',
      };
      originalCanaryStatusAfter = readGitStatus(resolve(canaryRoot));
    }
    if (
      originalCanaryStatusBefore &&
      originalCanaryStatusAfter &&
      JSON.stringify(originalCanaryStatusBefore) !== JSON.stringify(originalCanaryStatusAfter)
    ) {
      throw new PortabilityFailure({
        category: 'external-project',
        stage: 'live-canary-integrity',
        project: 'external',
        command: 'git status --short',
        message: 'The external project Git status changed during sanitized proof.',
      });
    }
  } catch (error) {
    failure = error instanceof PortabilityFailure
      ? error.record
      : {
          ...currentFailure,
          message: errorMessage(error),
        };
  } finally {
    // Cleanup is reported below so failure runs retain machine-readable teardown evidence.
  }
  const cleanup: ExternalSkillPortabilityReport['cleanup'] = {
    attempted: !keepTemporary,
    succeeded: keepTemporary,
    harnessRootExistsAfterCleanup: true,
    retainedByRequest: keepTemporary,
  };
  if (!keepTemporary) {
    try {
      await removeHarnessRoot(harnessRoot);
      cleanup.succeeded = true;
      cleanup.harnessRootExistsAfterCleanup = await pathExists(harnessRoot);
    } catch (error) {
      cleanup.succeeded = false;
      cleanup.harnessRootExistsAfterCleanup = await pathExists(harnessRoot);
      cleanup.error = errorMessage(error);
      failure ??= {
        category: 'skopos-portability',
        stage: 'cleanup',
        project: 'harness',
        message: cleanup.error,
      };
    }
  }
  const failures = failure ? [failure] : [];
  return {
    schemaVersion: 1,
    result: failure ? 'fail' : 'pass',
    generatedAt: new Date().toISOString(),
    ...(packageIdentity ? { package: packageIdentity } : {}),
    harnessRoot,
    sourceCheckout: workspaceRoot,
    ...(canaryRoot ? { originalCanary: resolve(canaryRoot) } : {}),
    ...(originalCanaryStatusBefore && originalCanaryStatusAfter
      ? {
          originalCanaryIntegrity: {
            gitStatusBefore: originalCanaryStatusBefore,
            gitStatusAfter: originalCanaryStatusAfter,
            unchanged:
              JSON.stringify(originalCanaryStatusBefore) ===
              JSON.stringify(originalCanaryStatusAfter),
          },
        }
      : {}),
    projects,
    ...(failure ? { failure } : {}),
    classification: {
      skoposPortabilityFailures: failures.filter(
        (entry) => entry.category === 'skopos-portability',
      ),
      projectAdaptationFailures: failures.filter(
        (entry) => entry.category === 'project-adaptation',
      ),
      externalProjectFailures: failures.filter(
        (entry) => entry.category === 'external-project',
      ),
    },
    cleanup,
  };
};

const proveMinimalProject = async ({
  projectRoot,
  tarballPath,
}: {
  projectRoot: string;
  tarballPath: string;
}): Promise<ProjectProof> => {
  await Promise.all([
    mkdir(join(projectRoot, 'src/ui'), { recursive: true }),
    mkdir(join(projectRoot, 'src/runtime'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(projectRoot, 'package.json'),
      `${JSON.stringify({
        name: 'skopos-skill-portability-minimal',
        private: true,
      }, null, 2)}\n`,
      'utf8',
    ),
    writeFile(join(projectRoot, '.gitignore'), 'node_modules/\n.skopos/\n', 'utf8'),
    writeFile(
      join(projectRoot, 'src/ui/workspace.tsx'),
      'export const Workspace = () => <main className="workspace">Workspace</main>;\n',
      'utf8',
    ),
    writeFile(join(projectRoot, 'src/ui/tokens.css'), ':root { --space-page: 2rem; }\n', 'utf8'),
    writeFile(join(projectRoot, 'src/runtime/adapter.ts'), 'export const adapter = {};\n', 'utf8'),
  ]);
  const installed = await installPackedCli({ projectRoot, tarballPath, nested: false });
  const commands: CommandRecord[] = [];
  runJson(installed.cliPath, projectRoot, commands, [
    'init', '.', '--mode', 'greenfield', '--actor', actor, '--json',
  ]);
  await writeProjectCapabilityBinding({ projectRoot, kind: 'minimal' });
  initializeGitBaseline(projectRoot);
  return proveProjectBehavior({
    label: 'minimal',
    projectRoot,
    cliPath: installed.cliPath,
    installedCliRoot: installed.installedCliRoot,
    commands,
    relevant: {
      goal: 'Narrow the hydration boundary.',
      acceptance: 'Only the existing interactive island keeps client rendering.',
      ownedPath: 'src/ui/workspace.tsx',
      expectedModuleIds: ['interface-design.behavior'],
    },
    irrelevant: {
      goal: 'Refactor the backend rendering adapter without changing a product interface.',
      ownedPath: 'src/runtime/adapter.ts',
    },
    forbiddenRoots: [workspaceRoot],
    capabilityActionIds: [],
    limitations: [
      'The minimal project proves deterministic package and CLI behavior; its declared proof Actions are inert fixtures and do not certify rendered UI quality.',
    ],
  });
};

const proveExternalProject = async ({
  originalRoot,
  projectRoot,
  tarballPath,
}: {
  originalRoot: string;
  projectRoot: string;
  tarballPath: string;
}): Promise<ProjectProof> => {
  await copySanitizedProject(originalRoot, projectRoot);
  const commands: CommandRecord[] = [];
  installExternalProjectDependencies(projectRoot, commands);
  const installed = await installPackedCli({ projectRoot, tarballPath, nested: true });
  await writeExternalScopeRegistry(projectRoot);
  runJson(installed.cliPath, projectRoot, commands, [
    'init', '.', '--mode', 'existing', '--actor', actor, '--json',
  ]);
  await writeProjectCapabilityBinding({ projectRoot, kind: 'external' });
  initializeGitBaseline(projectRoot);
  return proveProjectBehavior({
    label: 'external',
    projectRoot,
    cliPath: installed.cliPath,
    installedCliRoot: installed.installedCliRoot,
    commands,
    relevant: {
      goal: 'Establish the hierarchy, layout, brand expression, and reading order of the rendered product workspace while preserving the existing form and preview behavior.',
      acceptance: 'Responsive layout preserves reading order through desktop and mobile viewport adaptation.',
      ownedPath: 'components/features/tool-workspace/ToolWorkspacePage.tsx',
      scopeId: 'product-ui',
      risk: 'standard',
      expectedModuleIds: [
        'interface-design.structure',
        'interface-design.behavior',
        'interface-design.finish',
      ],
    },
    irrelevant: {
      goal: 'Refactor the payment webhook signature adapter without changing any rendered interface.',
      ownedPath: 'lib/modules/payments',
    },
    forbiddenRoots: [workspaceRoot, originalRoot],
    capabilityActionIds: ['ui.accessibility-lint'],
    limitations: [
      'The sanitized canary executes the external project\'s existing lint command as static accessibility evidence; it does not provide or claim a rendered Axe audit.',
      'The responsive browser Action is bound to the external project\'s existing runtime proof but is not executed by this portability run because it requires a separately managed development server.',
    ],
  });
};

const proveProjectBehavior = async ({
  label,
  projectRoot,
  cliPath,
  installedCliRoot,
  commands,
  relevant,
  irrelevant,
  forbiddenRoots,
  capabilityActionIds,
  limitations,
}: {
  label: ProjectProof['label'];
  projectRoot: string;
  cliPath: string;
  installedCliRoot: string;
  commands: CommandRecord[];
  relevant: {
    goal: string;
    acceptance: string;
    ownedPath: string;
    scopeId?: string;
    risk?: 'light' | 'standard' | 'high-impact';
    expectedModuleIds: string[];
  };
  irrelevant: { goal: string; ownedPath: string };
  forbiddenRoots: string[];
  capabilityActionIds: string[];
  limitations: string[];
}): Promise<ProjectProof> => {
  const listed = runJson<{
    packs: Array<{ packId: string; sourcePath: string }>;
  }>(cliPath, projectRoot, commands, ['skills', 'list', '.', '--json']);
  const productUi = listed.packs.find((pack) => pack.packId === 'ui.product-interface-design');
  assert(productUi, 'Packed CLI did not discover Product Interface Design.');
  assert(
    normalize(productUi.sourcePath).includes('node_modules/@unisane/skopos/dist/skill-packs/'),
    `Product Interface Design resolved outside the installed package: ${productUi.sourcePath}`,
  );
  const recommendation = runJson<{
    recommendations: Array<{ packId: string; recommendation: string }>;
  }>(cliPath, projectRoot, commands, ['skills', 'recommend', '.', '--json']);
  const recommended = recommendation.recommendations.find(
    (entry) => entry.packId === 'ui.product-interface-design',
  );
  assert(recommended?.recommendation === 'adopt', 'Product Interface Design was not adoptable.');
  const evaluated = runJson<{
    artifact: { passed: number; failed: number };
  }>(cliPath, projectRoot, commands, [
    'skills', 'evaluate', 'ui.product-interface-design', '.', '--binding', `${label}.ui.product-interface-design`, '--json',
  ]);
  assert(
    evaluated.artifact.passed === 8 && evaluated.artifact.failed === 0,
    `Expected eight passing deterministic fixtures, received ${evaluated.artifact.passed}/${evaluated.artifact.failed}.`,
  );
  const applied = runJson<{
    bindingPath: string;
    fixtureEvaluation: { passed: number; failed: number };
    projections: Array<{ id: string }>;
    projectionWrites: Array<{ path: string }>;
  }>(cliPath, projectRoot, commands, [
    'skills', 'apply', 'ui.product-interface-design', '.',
    '--binding', `${label}.ui.product-interface-design`,
    '--actor', actor,
    '--reason', 'Certify packed Product Interface Design portability in an isolated external project.',
    '--json',
  ]);
  assert(
    applied.fixtureEvaluation.passed === 8 && applied.fixtureEvaluation.failed === 0,
    'Skill apply did not retain the eight-fixture gate.',
  );

  for (const actionId of capabilityActionIds) {
    runJson(cliPath, projectRoot, commands, [
      'actions', 'run', actionId, '.', '--actor', actor, '--json',
    ], {
      category: 'project-adaptation',
      stage: `execute-capability-action:${actionId}`,
      project: label,
    });
  }

  const relevantTask = startTask(cliPath, projectRoot, commands, relevant, `${label}-origin-session`);
  const relevantContext = skillContext(cliPath, projectRoot, commands, relevantTask.id);
  const relevantModules = uniqueSorted(
    relevantContext.skills.entries.flatMap((entry) => entry.selectedModuleIds),
  );
  assertEqual(relevantModules, uniqueSorted(relevant.expectedModuleIds), 'relevant modules');
  assert(relevantContext.skills.selectedCount === 1, 'Relevant Task did not select one Skill pack.');
  const skillContextEntries = relevantContext.context.entries.filter(
    (entry) => entry.kind === 'skill',
  );
  const skillContextEntryCount = skillContextEntries.length;
  assert(
    skillContextEntries.some(
      (entry) => entry.id === 'skill:ui.product-interface-design:project-adaptation',
    ),
    'Selected guidance omitted the project-adaptation context.',
  );
  assert(
    skillContextEntryCount === relevantModules.length + 1,
    'Selected guidance was not limited to project adaptation plus module-local context.',
  );

  const selectionArtifactPath = join(
    projectRoot,
    '.skopos/index/skills/selections',
    `${relevantTask.id}.json`,
  );
  const firstSelection = await readFile(selectionArtifactPath, 'utf8');
  const firstSelectionArtifact = JSON.parse(firstSelection) as {
    selectedSkills: Array<{
      selectedActionIds: string[];
      selectedGuardIds: string[];
    }>;
  };
  const relevantSkill = firstSelectionArtifact.selectedSkills[0];
  assert(relevantSkill, 'Relevant Task selection artifact omitted the selected Skill.');
  const firstSelectionStat = await stat(selectionArtifactPath);
  const reusedContext = skillContext(cliPath, projectRoot, commands, relevantTask.id);
  const secondSelection = await readFile(selectionArtifactPath, 'utf8');
  const secondSelectionStat = await stat(selectionArtifactPath);
  const exactReuse =
    firstSelection === secondSelection &&
    firstSelectionStat.mtimeMs === secondSelectionStat.mtimeMs &&
    JSON.stringify(relevantContext.skills) === JSON.stringify(reusedContext.skills);
  assert(exactReuse, 'Exact valid selection was rewritten instead of reused.');

  await writeIdentityChangeAction(projectRoot);
  const invalidatedContext = skillContext(cliPath, projectRoot, commands, relevantTask.id);
  const invalidationDiagnostic = invalidatedContext.diagnostics.find((entry) =>
    entry.includes('capabilityCatalogDigest'),
  ) ?? '';
  assert(
    invalidatedContext.skills.selectedCount === 0 && invalidationDiagnostic.length > 0,
    'Capability identity change did not invalidate accepted selection reuse.',
  );

  const continuation = await proveContinuationBehavior({
    label,
    projectRoot,
    cliPath,
    commands,
    taskId: relevantTask.id,
    ownedPath: relevant.ownedPath,
  });

  const irrelevantTask = startTask(cliPath, projectRoot, commands, {
    ...irrelevant,
    acceptance: 'The backend-only change has no rendered product behavior.',
  });
  const irrelevantContext = skillContext(cliPath, projectRoot, commands, irrelevantTask.id);
  assert(irrelevantContext.skills.selectedCount === 0, 'Irrelevant Task selected Skill context.');
  assert(
    irrelevantContext.context.entries.every((entry) => entry.kind !== 'skill'),
    'Irrelevant Task received Skill guidance.',
  );

  const containment = await inspectContainment({
    projectRoot,
    installedCliRoot,
    forbiddenRoots,
  });
  assertEqual(containment.outsideProjectPaths, [], 'outside-project generated paths');
  assertEqual(containment.forbiddenSymlinkTargets, [], 'forbidden symlink targets');
  assertEqual(containment.installedSourceCheckoutReferences, [], 'source checkout references');
  assert(containment.nodePathAbsent, 'NODE_PATH assistance was present.');
  assert(containment.workspaceProtocolAbsent, 'Installed CLI retained workspace dependencies.');

  return {
    label,
    externalRoot: projectRoot,
    installedCliRoot,
    initialized: true,
    discoveredPackSource: productUi.sourcePath,
    recommendation: recommended.recommendation,
    fixtureResult: evaluated.artifact,
    appliedBindingId: `${label}.ui.product-interface-design`,
    hostProjectionPaths: applied.projectionWrites.map((entry) => entry.path).sort(),
    relevantTask: {
      id: relevantTask.id,
      selectedPackIds: relevantContext.skills.entries.map((entry) => entry.packId),
      selectedModuleIds: relevantModules,
      selectedActionIds: relevantSkill.selectedActionIds,
      selectedGuardIds: relevantSkill.selectedGuardIds,
      skillContextEntryCount,
    },
    irrelevantTask: {
      id: irrelevantTask.id,
      selectedPackIds: irrelevantContext.skills.entries.map((entry) => entry.packId),
      skillContextEntryCount: irrelevantContext.context.entries.filter(
        (entry) => entry.kind === 'skill',
      ).length,
    },
    cache: {
      artifactPath: normalize(relative(projectRoot, selectionArtifactPath)),
      exactReuse,
      invalidatedAfterCapabilityChange: true,
      invalidationDiagnostic,
    },
    containment,
    executedCapabilityActions: capabilityActionIds,
    adaptationGaps: label === 'external'
      ? [
          'Rendered accessibility remains unbound: the external project declares no Axe audit, so this proof certifies static lint only.',
          'Responsive browser execution remains outside this portability run because the declared generator proof requires a separately managed development server.',
        ]
      : [],
    commands,
    limitations,
    continuation,
  };
};

const proveContinuationBehavior = async ({
  label,
  projectRoot,
  cliPath,
  commands,
  taskId,
  ownedPath,
}: {
  label: ProjectProof['label'];
  projectRoot: string;
  cliPath: string;
  commands: CommandRecord[];
  taskId: string;
  ownedPath: string;
}): Promise<ContinuationProof> => {
  const originSessionId = `${label}-origin-session`;
  const capsulePath = join(projectRoot, '.skopos', 'continuation-capsule.json');
  const classifications = new Set<ContinuationProof['classifications'][number]>();
  const normalCapsule = capsule(originSessionId, [
    ['objective', 'user-direction', 'Continue the exact UI Task in a fresh small-context Session.'],
    ['user-intent', 'user-direction', 'Preserve the existing behavior while reducing context bloat.'],
    ['constraint', 'user-direction', 'Do not replay a raw transcript or broaden the Task.'],
    ['completed-work', 'verified-fact', 'Packed installation and deterministic selection proof already passed.'],
    ['stopping-point', 'verified-fact', 'The next boundary is exact handoff freshness verification.'],
    ['rejected-approach', 'rejected-option', 'Native resume was rejected because it retains the large conversation.'],
    ['open-question', 'open-question', 'Host delivery must remain truthful if origin messaging is unsupported.'],
    ['recommended-first-action', 'agent-recommendation', 'Run session context and verify the handoff before editing.'],
    ['do-not-repeat', 'agent-recommendation', 'Do not repeat package installation or deterministic fixtures.'],
    ['exclusion', 'user-direction', 'Do not start paired model evaluation.'],
  ], 'api_key=portable-secret-value');
  await writeFile(capsulePath, `${JSON.stringify(normalCapsule, null, 2)}\n`, 'utf8');
  const created = runJson<HandoffResult>(cliPath, projectRoot, commands, [
    'discuss', 'handoff', 'create', '.', '--task', taskId, '--context', relative(projectRoot, capsulePath), '--json',
  ]);
  classifications.add(created.handoff.validation.freshness);
  assert(!JSON.stringify(created).includes('portable-secret-value'), 'Secret-like capsule content was persisted.');
  const redactedSecret = JSON.stringify(created).includes('[REDACTED SECRET-LIKE VALUE]');

  const steps = runJson<{ items: Array<{ id: string; status: string; kind: string }> }>(cliPath, projectRoot, commands, [
    'task', 'show', taskId, '.', '--collection', 'steps', '--json',
  ]);
  const pendingStep = steps.items.find((entry) => entry.status === 'pending' && entry.kind !== 'action');
  assert(pendingStep, 'External continuation Task has no pending step for revision freshness proof.');
  runJson(cliPath, projectRoot, commands, ['task', 'step', 'complete', taskId, pendingStep.id, '--cwd', '.', '--actor', actor, '--json']);
  classifications.add(runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'verify', '.', '--task', taskId, '--json']).handoff.validation.freshness);
  runJson(cliPath, projectRoot, commands, ['discuss', 'handoff', 'refresh', '.', '--task', taskId, '--json']);

  const sourcePath = join(projectRoot, ownedPath);
  const originalSource = await readFile(sourcePath, 'utf8');
  await appendFile(sourcePath, '\n// continuation source freshness fixture\n', 'utf8');
  classifications.add(runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'verify', '.', '--task', taskId, '--json']).handoff.validation.freshness);
  runJson(cliPath, projectRoot, commands, ['discuss', 'handoff', 'refresh', '.', '--task', taskId, '--json']);
  await writeFile(sourcePath, originalSource, 'utf8');
  runJson(cliPath, projectRoot, commands, ['discuss', 'handoff', 'refresh', '.', '--task', taskId, '--json']);

  const beforeEvidence = runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'show', '.', '--task', taskId, '--json']).handoff.compiledState.evidenceIdentities;
  runJson(cliPath, projectRoot, commands, ['evidence', 'record-observation', taskId, '.', '--requirement', 'acceptance-1', '--statement', 'Packed continuation Evidence identity fixture.', '--actor', actor, '--json']);
  const evidenceFreshness = runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'verify', '.', '--task', taskId, '--json']).handoff.validation.freshness;
  classifications.add(evidenceFreshness);
  const evidenceRefreshed = runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'refresh', '.', '--task', taskId, '--json']);
  const evidenceInvalidation = evidenceFreshness !== 'current' && JSON.stringify(beforeEvidence) !== JSON.stringify(evidenceRefreshed.handoff.compiledState.evidenceIdentities);

  runJson(cliPath, projectRoot, commands, ['coordination', 'claim', 'add', 'exact-path', ownedPath, '.', '--task', taskId, '--session', originSessionId, '--json']);
  const mutation = runJson<{ mutation: { mutationId: string } }>(cliPath, projectRoot, commands, ['coordination', 'mutation', 'begin', 'edit', ownedPath, '.', '--task', taskId, '--session', originSessionId, '--json']);
  classifications.add(runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'verify', '.', '--task', taskId, '--json']).handoff.validation.freshness);
  runJson(cliPath, projectRoot, commands, ['coordination', 'mutation', 'complete', mutation.mutation.mutationId, '.', '--session', originSessionId, '--json']);
  classifications.add(runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'verify', '.', '--task', taskId, '--json']).handoff.validation.freshness);
  runJson(cliPath, projectRoot, commands, ['discuss', 'handoff', 'refresh', '.', '--task', taskId, '--json']);

  const handoffPath = (await walk(join(projectRoot, '.skopos/handoffs'))).find(
    isHandoffArtifactPath,
  );
  assert(handoffPath, 'External continuation handoff path was not generated.');
  const currentArtifact = await readFile(handoffPath, 'utf8');
  const invalidArtifact = JSON.parse(currentArtifact) as { compiledState: { workspaceIdentity: { repositoryId: string } } };
  invalidArtifact.compiledState.workspaceIdentity.repositoryId = 'wrong-repository';
  await writeFile(handoffPath, `${JSON.stringify(invalidArtifact, null, 2)}\n`, 'utf8');
  classifications.add(runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'verify', '.', '--task', taskId, '--json']).handoff.validation.freshness);
  await writeFile(handoffPath, currentArtifact, 'utf8');

  const runId = `run-20260805T000000Z-${label}-expired`;
  await mkdir(join(projectRoot, '.skopos/runs'), { recursive: true });
  await writeFile(join(projectRoot, '.skopos/runs', `${runId}.json`), `${JSON.stringify(expiredActionRun(projectRoot, taskId, runId), null, 2)}\n`, 'utf8');
  classifications.add(runJson<HandoffInspect>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'verify', '.', '--task', taskId, '--json']).handoff.validation.freshness);
  const recovered = runJson<{ status: 'interrupted' }>(cliPath, projectRoot, commands, ['actions', 'recover', runId, '.', '--actor', actor, '--reason', 'Recover the expired packed continuation fixture.', '--json']);

  const nearCapsule = capsule(originSessionId, [['objective', 'user-direction', 'near '.repeat(2_400)]]);
  await writeFile(capsulePath, `${JSON.stringify(nearCapsule)}\n`, 'utf8');
  const near = runJson<HandoffResult>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'create', '.', '--task', taskId, '--context', relative(projectRoot, capsulePath), '--json']);
  const overCapsule = capsule(originSessionId, [['objective', 'user-direction', 'over '.repeat(4_000)]]);
  await writeFile(capsulePath, `${JSON.stringify(overCapsule)}\n`, 'utf8');
  const over = runJson<HandoffResult>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'create', '.', '--task', taskId, '--context', relative(projectRoot, capsulePath), '--json']);
  await writeFile(capsulePath, `${JSON.stringify(normalCapsule)}\n`, 'utf8');
  runJson(cliPath, projectRoot, commands, ['discuss', 'handoff', 'create', '.', '--task', taskId, '--context', relative(projectRoot, capsulePath), '--json']);
  const manual = runJson<HandoffInspect & { prompt: string }>(cliPath, projectRoot, commands, ['discuss', 'handoff', 'render', '.', '--task', taskId, '--json']);

  const backup = join(projectRoot, '.skopos-continuation-state-backup');
  await rename(join(projectRoot, '.skopos'), backup);
  const reconstructed = runJson<{ id: string }>(cliPath, projectRoot, commands, ['task', 'show', taskId, '.', '--json']);
  const reconstructedHandoffs = await walk(join(projectRoot, '.skopos/handoffs'));
  await rm(join(projectRoot, '.skopos'), { recursive: true, force: true });
  await rename(backup, join(projectRoot, '.skopos'));

  const expectedClassifications: ContinuationProof['classifications'] = ['current', 'refreshable', 'stale', 'conflicted', 'invalid'];
  for (const expected of expectedClassifications) assert(classifications.has(expected), `Missing ${expected} continuation classification.`);
  const manualPromptContains = ['objective', 'user-intent', 'stopping-point', 'rejected-approach', 'recommended-first-action'].filter((term) => manual.prompt.toLowerCase().includes(term));
  assert(manualPromptContains.length === 5, 'Manual prompt lost required semantic continuation context.');
  assert(near.handoff.validation.valid && !near.handoff.overBudget, 'Near-budget capsule was not accepted.');
  assert(!over.handoff.validation.valid && over.handoff.overBudget && over.handoff.resumeSummary.includes('over over over'), 'Over-budget capsule did not fail explicitly with meaning retained.');
  assert(evidenceInvalidation, 'Relevant Evidence identity change did not invalidate exact handoff reuse.');
  return {
    taskId,
    classifications: expectedClassifications,
    redactedSecret,
    nearBudget: { estimatedTokens: near.handoff.estimatedTokens, valid: near.handoff.validation.valid },
    overBudget: { estimatedTokens: over.handoff.estimatedTokens, valid: over.handoff.validation.valid, meaningRetained: over.handoff.resumeSummary.includes('over over over') },
    manualPromptContains,
    actionRecovery: recovered.status,
    evidenceInvalidation,
    cleanReconstruction: {
      taskRecovered: reconstructed.id === taskId,
      localHandoffAbsent: reconstructedHandoffs.every(
        (path) => !isHandoffArtifactPath(path),
      ),
    },
  };
};

type HandoffResult = { handoff: { resumeSummary: string; estimatedTokens: number; overBudget: boolean; compiledState: { evidenceIdentities: string[] }; validation: { freshness: ContinuationProof['classifications'][number]; valid: boolean } } };
type HandoffInspect = HandoffResult;

const capsule = (sessionId: string, statements: Array<[string, string, string]>, suffix = '') => ({
  authoredBy: actor,
  authoredAt: '2026-08-05T00:00:00.000Z',
  origin: { host: 'portability-harness', sessionId, threadId: `${sessionId}-thread` },
  statements: statements.map(([section, classification, text], index) => ({ id: `statement-${index + 1}`, section, classification, text: `${text}${index === 0 ? suffix : ''}`, sourceRefs: ['packed portability fixture'] })),
});

const expiredActionRun = (workspaceRoot: string, taskId: string, runId: string) => ({
  schemaVersion: 1, id: runId, type: 'action-run', status: 'generated', authority: 'generated', summary: 'expired continuation fixture', generatedAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', workspaceRoot,
  actionId: 'fixture.continuation', actionTitle: 'Fixture continuation', actionCategory: 'quality-check', actionSafety: 'read-only', sourcePath: 'tools/skopos/actions/fixture-continuation.yaml', command: 'node -e "process.exit(0)"', cwd: '.', taskId, runStatus: 'running', exitCode: null, timeoutMs: 1000, startedAt: '2026-01-01T00:00:00.000Z', outputPaths: [], evidence: {
    schemaVersion: 1, executionKey: 'expired-fixture', actionId: 'fixture.continuation', command: { raw: 'node -e "process.exit(0)"', cwd: '.', digest: 'fixture-command' }, sourceState: { algorithm: 'sha256', digest: 'fixture-source', paths: [] },
    environment: { platform: process.platform, architecture: process.arch, nodeVersion: process.version, workspace: { repositoryId: 'fixture', repositoryRoot: workspaceRoot, worktreeId: 'fixture', worktreeRoot: workspaceRoot, branch: null }, capabilities: { process: 'required', network: 'none', browser: 'none', tools: ['node'], secrets: [], services: [] }, effects: { workspace: 'none', artifacts: 'none', external: 'none' }, concurrency: 'shared', workspaceMode: 'overlay-safe' },
    owner: { runId, leaseExpiresAt: '2026-01-01T00:00:01.000Z' }, freshness: { policy: 'source-bound', capturedAt: '2026-01-01T00:00:00.000Z' },
  },
});

type TaskContext = {
  context: { entries: Array<{ id: string; kind: string }> };
  actions: { entries: Array<{ id: string }> };
  guards: { entries: Array<{ id: string }> };
  skills: {
    selectedCount: number;
    entries: Array<{
      packId: string;
      selectedModuleIds: string[];
    }>;
  };
  diagnostics: string[];
};

const skillContext = (
  cliPath: string,
  projectRoot: string,
  commands: CommandRecord[],
  taskId: string,
): TaskContext =>
  runJson<TaskContext>(cliPath, projectRoot, commands, [
    'skills', 'context', taskId, '.', '--json',
  ]);

const startTask = (
  cliPath: string,
  projectRoot: string,
  commands: CommandRecord[],
  task: {
    goal: string;
    acceptance: string;
    ownedPath: string;
    scopeId?: string;
    risk?: 'light' | 'standard' | 'high-impact';
  },
  sessionId?: string,
): { id: string } => {
  const started = runJson<{ task: { id: string } }>(cliPath, projectRoot, commands, [
    'start', task.goal, '.',
    '--accept', task.acceptance,
    '--own', task.ownedPath,
    ...(task.scopeId ? ['--scope', task.scopeId] : []),
    ...(task.risk ? ['--risk', task.risk] : []),
    '--actor', actor,
    ...(sessionId
      ? [
          '--session-id', sessionId,
          '--host', 'portability-harness',
          '--lease-seconds', '600',
        ]
      : []),
    '--json',
  ]);
  return started.task;
};

const installPackedCli = async ({
  projectRoot,
  tarballPath,
  nested,
}: {
  projectRoot: string;
  tarballPath: string;
  nested: boolean;
}): Promise<{ cliPath: string; installedCliRoot: string }> => {
  const installRoot = nested ? join(projectRoot, '.skopos-portability-runner') : projectRoot;
  await mkdir(installRoot, { recursive: true });
  if (nested) {
    await writeFile(
      join(installRoot, 'package.json'),
      `${JSON.stringify({
        name: 'skopos-portability-runner',
        private: true,
      }, null, 2)}\n`,
      'utf8',
    );
  }
  try {
    const pnpm = resolvePnpmInvocation();
    execFileSync(
      pnpm.command,
      [
        ...pnpm.argsPrefix,
        'add',
        '--prefer-offline',
        '--ignore-scripts',
        '--lockfile=false',
        tarballPath,
      ],
      { cwd: installRoot, stdio: 'pipe', env: cleanEnvironment(projectRoot) },
    );
  } catch (error) {
    const failure = error as { stdout?: Buffer | string; stderr?: Buffer | string };
    throw new PortabilityFailure({
      category: 'skopos-portability',
      stage: 'install-packed-cli',
      project: nested ? 'external' : 'minimal',
      command: `pnpm add --prefer-offline --ignore-scripts --lockfile=false ${basename(tarballPath)}`,
      message: compactCommandError(failure),
    });
  }
  const installedCliRoot = await realpath(join(installRoot, 'node_modules/@unisane/skopos'));
  return {
    cliPath: join(installedCliRoot, 'dist/cli.js'),
    installedCliRoot,
  };
};

const runJson = <T>(
  cliPath: string,
  cwd: string,
  commands: CommandRecord[],
  args: string[],
  failureContext?: Omit<FailureRecord, 'message' | 'command'>,
): T => {
  const command = `node ${JSON.stringify(cliPath)} ${args.map((entry) => JSON.stringify(entry)).join(' ')}`;
  try {
    const output = execFileSync(process.execPath, [cliPath, ...args], {
      cwd,
      encoding: 'utf8',
      env: cleanEnvironment(cwd),
      maxBuffer: 20 * 1024 * 1024,
    });
    commands.push({ command, cwd, status: 'passed', outputBytes: Buffer.byteLength(output) });
    return JSON.parse(output) as T;
  } catch (error) {
    const failure = error as {
      status?: number;
      stdout?: Buffer | string;
      stderr?: Buffer | string;
    };
    const summary = compactCommandError(failure);
    commands.push({
      command,
      cwd,
      status: 'failed',
      outputBytes: Buffer.byteLength(failure.stdout?.toString() ?? ''),
      ...(failure.status !== undefined ? { exitCode: failure.status } : {}),
      errorSummary: summary,
    });
    if (failureContext) {
      throw new PortabilityFailure({
        ...failureContext,
        command,
        message: summary,
      });
    }
    throw new PortabilityFailure({
      category: 'skopos-portability',
      stage: 'installed-cli-command',
      project: normalize(cwd).includes('/external-sanitized') ? 'external' : 'minimal',
      command,
      message: summary,
    });
  }
};

const installExternalProjectDependencies = (
  projectRoot: string,
  commands: CommandRecord[],
): void => {
  const args = ['ci', '--ignore-scripts', '--no-audit', '--no-fund'];
  const command = `npm ${args.join(' ')}`;
  try {
    const output = execFileSync('npm', args, {
      cwd: projectRoot,
      encoding: 'utf8',
      env: cleanEnvironment(projectRoot),
      maxBuffer: 20 * 1024 * 1024,
    });
    commands.push({
      command,
      cwd: projectRoot,
      status: 'passed',
      outputBytes: Buffer.byteLength(output),
    });
  } catch (error) {
    const failure = error as {
      status?: number;
      stdout?: Buffer | string;
      stderr?: Buffer | string;
    };
    const summary = compactCommandError(failure);
    commands.push({
      command,
      cwd: projectRoot,
      status: 'failed',
      outputBytes: Buffer.byteLength(failure.stdout?.toString() ?? ''),
      ...(failure.status !== undefined ? { exitCode: failure.status } : {}),
      errorSummary: summary,
    });
    throw new PortabilityFailure({
      category: 'external-project',
      stage: 'install-external-dependencies',
      project: 'external',
      command,
      message: summary,
    });
  }
};

const packCli = (packRoot: string): string => {
  if (process.env.SKOPOS_RELEASE_TARBALL) {
    return resolve(process.env.SKOPOS_RELEASE_TARBALL);
  }
  const pnpm = resolvePnpmInvocation();
  const output = execFileSync(
    pnpm.command,
    [...pnpm.argsPrefix, 'pack', '--pack-destination', packRoot],
    { cwd: cliPackageRoot, encoding: 'utf8', env: cleanEnvironment(packRoot) },
  );
  const reported = output
    .trim()
    .split('\n')
    .map((entry) => entry.trim())
    .find((entry) => entry.endsWith('.tgz'));
  if (!reported) throw new Error(`pnpm pack did not report a tarball:\n${output}`);
  return isAbsolute(reported) ? reported : resolve(cliPackageRoot, reported);
};

const writeExternalScopeRegistry = async (projectRoot: string): Promise<void> => {
  await Promise.all([
    mkdir(join(projectRoot, 'tools/skopos'), { recursive: true }),
    mkdir(join(projectRoot, 'docs/scopes/product-ui'), { recursive: true }),
  ]);
  await writeFile(
    join(projectRoot, 'tools/skopos/scopes.yaml'),
    `${[
      'schemaVersion: 1',
      'scopes:',
      '  - id: workspace',
      '    title: External Project Workspace',
      '    kind: workspace',
      '    path: .',
      '    memoryRoot: docs',
      '    codeRoots:',
      '      - .',
      '    parent: null',
      '    profile: core.workspace',
      '    dependsOn: []',
      '    owners:',
      `      - ${actor}`,
      '    aliases:',
      '      - external-project',
      '  - id: product-ui',
      '    title: Product UI',
      '    kind: application',
      '    path: components/features/tool-workspace',
      '    memoryRoot: docs/scopes/product-ui',
      '    codeRoots:',
      '      - components/features/tool-workspace',
      '      - components/ui',
      '      - app',
      '    parent: workspace',
      '    profile: core.application',
      '    dependsOn: []',
      '    owners:',
      `      - ${actor}`,
      '    aliases:',
      '      - product-interface',
      '',
    ].join('\n')}`,
    'utf8',
  );
};

const writeProjectCapabilityBinding = async ({
  projectRoot,
  kind,
}: {
  projectRoot: string;
  kind: ProjectProof['label'];
}): Promise<void> => {
  const actionRoot = join(projectRoot, 'tools/skopos/actions');
  const guardRoot = join(projectRoot, 'tools/skopos/guards');
  const skillRoot = join(projectRoot, 'tools/skopos/skills');
  await Promise.all([
    mkdir(actionRoot, { recursive: true }),
    mkdir(guardRoot, { recursive: true }),
    mkdir(skillRoot, { recursive: true }),
  ]);
  const sourceBindings = kind === 'external'
    ? {
        'brand-doctrine': ['docs/formats-library-marketplace-blueprint.md'],
        'design-tokens': ['app/globals.css'],
        'component-catalog': ['components/ui'],
        'approved-screen-precedents': ['components/features/tool-workspace'],
        'domain-language': ['README.md'],
        'ui-failure-patterns': ['docs/revamp/navigation-convergence/README.md'],
      }
    : {
        'brand-doctrine': ['docs/00-start-here.md'],
        'design-tokens': ['src/ui/tokens.css'],
        'component-catalog': ['src/ui'],
        'approved-screen-precedents': ['src/ui/workspace.tsx'],
        'domain-language': ['docs/00-start-here.md'],
        'ui-failure-patterns': ['docs/00-start-here.md'],
      };
  const binding = {
    schemaVersion: 1,
    id: `project-skill-binding.${kind}.ui.product-interface-design`,
    type: 'project-skill-binding',
    status: 'active',
    authority: 'canonical',
    summary: `${kind} external portability binding for Product Interface Design.`,
    updatedAt: '2026-08-05',
    bindingId: `${kind}.ui.product-interface-design`,
    packId: 'ui.product-interface-design',
    packVersion: '0.5.0',
    lifecycle: 'candidate',
    sourceBindings,
    actionBindings: {
      'responsive-visual-capture': 'ui.capture-responsive-proof',
      'focused-frontend-tests': 'quality.run-proof-phase',
    },
    guardBindings: {
      'frontend-type-safety': 'quality.typecheck',
      'accessibility-proof': 'ui.accessibility-proof',
      'client-boundary-review': 'quality.typecheck',
    },
    adaptationNotes: kind === 'external'
      ? [
          'Use the existing product workspace and component sources as project authority.',
          'Use the external project\'s existing runtime proof for responsive and interaction evidence.',
          'Bind the accessibility Guard to the external project\'s executed static lint capability, never to responsive proof.',
          'Leave the recommended accessibility-audit Action role unresolved because the external project declares no rendered Axe audit.',
        ]
      : ['This generated project exists only to certify deterministic packed CLI behavior.'],
  };
  await Promise.all([
    writeFile(
      join(skillRoot, `${kind}.ui.product-interface-design.json`),
      `${JSON.stringify(binding, null, 2)}\n`,
      'utf8',
    ),
    writeFile(
      join(actionRoot, 'quality-typecheck.yaml'),
      actionManifest({
        id: 'quality.typecheck',
        title: 'External project typecheck',
        command: kind === 'external' ? 'npm run typecheck' : 'node --check src/runtime/adapter.ts',
        inputs: kind === 'external' ? ['package.json', 'tsconfig.json', 'app', 'components', 'lib'] : ['src'],
      }),
      'utf8',
    ),
    writeFile(
      join(actionRoot, 'quality-run-proof-phase.yaml'),
      actionManifest({
        id: 'quality.run-proof-phase',
        title: 'External focused frontend proof',
        command: kind === 'external' ? 'npm run test:ci' : 'node --check src/runtime/adapter.ts',
        inputs: kind === 'external' ? ['package.json', 'tests', 'components'] : ['src'],
      }),
      'utf8',
    ),
    writeFile(
      join(actionRoot, 'ui-capture-responsive-proof.yaml'),
      actionManifest({
        id: 'ui.capture-responsive-proof',
        title: 'External responsive UI proof',
        command: kind === 'external'
          ? 'npm run check:generator-runtime-proofs'
          : 'node --check src/runtime/adapter.ts',
        inputs: kind === 'external'
          ? ['package.json', 'scripts/templates/proof-generator-runtime.ts', 'components/features/tool-workspace']
          : ['src/ui'],
        browser: kind === 'external' ? 'required' : 'none',
      }),
      'utf8',
    ),
    writeFile(
      join(actionRoot, 'ui-accessibility-proof.yaml'),
      actionManifest({
        id: kind === 'external' ? 'ui.accessibility-lint' : 'ui.accessibility-fixture',
        title: kind === 'external'
          ? 'External project static accessibility lint'
          : 'Minimal accessibility capability fixture',
        command: kind === 'external'
          ? 'npm run lint:ci -- --no-cache'
          : 'node --check src/runtime/adapter.ts',
        inputs: kind === 'external'
          ? ['package.json', '.eslintrc.json', 'app', 'components']
          : ['src'],
      }),
      'utf8',
    ),
    writeFile(
      join(guardRoot, 'quality-typecheck.yaml'),
      guardManifest('quality.typecheck', 'quality.typecheck'),
      'utf8',
    ),
    writeFile(
      join(guardRoot, 'ui-accessibility-proof.yaml'),
      guardManifest(
        'ui.accessibility-proof',
        kind === 'external' ? 'ui.accessibility-lint' : 'ui.accessibility-fixture',
      ),
      'utf8',
    ),
  ]);
};

const actionManifest = ({
  id,
  title,
  command,
  inputs,
  browser = 'none',
}: {
  id: string;
  title: string;
  command: string;
  inputs: string[];
  browser?: 'none' | 'required';
}): string => {
  const invokesNpm = command.startsWith('npm ');
  return `${[
  `id: ${id}`,
  `title: ${title}`,
  'description: Project-owned capability used by the packed Skill portability canary.',
  'category: quality-check',
  'scope: [workspace]',
  `command: ${command}`,
  'cwd: .',
  `inputs: ${JSON.stringify(inputs)}`,
  'outputs: []',
  `affects: ${JSON.stringify(
    invokesNpm
      ? ['.skopos-portability-cache', '.skopos-portability-tmp']
      : [],
  )}`,
  'capabilities:',
  '  process: required',
  '  network: none',
  `  browser: ${browser}`,
  `  tools: ${JSON.stringify(invokesNpm ? ['npm'] : ['node'])}`,
  '  secrets: []',
  '  services: []',
  'effects:',
  `  workspace: ${invokesNpm ? 'declared' : 'none'}`,
  '  artifacts: none',
  '  external: none',
  `concurrency: ${invokesNpm ? 'exclusive' : 'shared'}`,
  'workspaceMode: overlay-safe',
  `safety: ${invokesNpm ? 'mutating' : 'read-only'}`,
  'requiresApproval: false',
  'recommendedAfter: []',
  `owner: ${actor}`,
  '',
].join('\n')}`;
};

const guardManifest = (id: string, actionId: string): string => `${[
  `id: ${id}`,
  `title: ${id}`,
  'description: Project-bound proof requirement for the packed Skill portability canary.',
  `owner: ${actor}`,
  'scope: [workspace]',
  'strength: required',
  'appliesTo:',
  '  paths: ["**/*.ts", "**/*.tsx", "**/*.css"]',
  '  phases: [closure]',
  '  risks: [standard, high-impact]',
  'requires:',
  `  actionIds: [${actionId}]`,
  '  evidence: source-bound-action',
  '',
].join('\n')}`;

const writeIdentityChangeAction = async (projectRoot: string): Promise<void> => {
  await writeFile(
    join(projectRoot, 'tools/skopos/actions/portability-identity-change.yaml'),
    actionManifest({
      id: 'portability.identity-change',
      title: 'Portability identity change sentinel',
      command: 'node --version',
      inputs: ['package.json'],
    }),
    'utf8',
  );
};

const copySanitizedProject = async (sourceRoot: string, destinationRoot: string): Promise<void> => {
  const excludedNames = new Set([
    '.git',
    'node_modules',
    '.next',
    'dist',
    'build',
    'coverage',
    '.cache',
    'cache',
    'caches',
    '.tmp',
    '.skopos',
    '.skopos-portability-runner',
    '.project-local',
  ]);
  await cp(sourceRoot, destinationRoot, {
    recursive: true,
    dereference: false,
    filter: async (source) => {
      const name = basename(source);
      if (source !== sourceRoot && excludedNames.has(name)) return false;
      if (/^\.env(?:\.|$)/i.test(name)) return false;
      if (/\.(pem|key|p12|pfx)$/i.test(name)) return false;
      const info = await lstat(source);
      if (info.isSymbolicLink()) {
        throw new Error(`Sanitized canary refuses source symlink: ${source}`);
      }
      return true;
    },
  });
};

const inspectContainment = async ({
  projectRoot,
  installedCliRoot,
  forbiddenRoots,
}: {
  projectRoot: string;
  installedCliRoot: string;
  forbiddenRoots: string[];
}): Promise<ProjectProof['containment']> => {
  const generatedPaths = await walk(join(projectRoot, '.skopos'));
  const outsideProjectPaths = generatedPaths.filter(
    (path) => !isInside(projectRoot, path),
  );
  const forbiddenSymlinkTargets: string[] = [];
  for (const path of await walk(projectRoot, true)) {
    if (!(await lstat(path)).isSymbolicLink()) continue;
    const target = await realpath(path);
    if (forbiddenRoots.some((root) => isInside(root, target))) {
      forbiddenSymlinkTargets.push(`${path} -> ${target}`);
    }
  }
  const installedSourceCheckoutReferences: string[] = [];
  for (const path of (await walk(join(installedCliRoot, 'dist'))).filter((entry) => /\.(js|json|map)$/.test(entry))) {
    const contents = await readFile(path, 'utf8');
    if (forbiddenRoots.some((root) => contents.includes(root))) {
      installedSourceCheckoutReferences.push(
        normalize(relative(installedCliRoot, path)),
      );
    }
  }
  const installedPackage = JSON.parse(
    await readFile(join(installedCliRoot, 'package.json'), 'utf8'),
  ) as { dependencies?: Record<string, string> };
  const controlledTempRoot = join(projectRoot, '.skopos-portability-tmp');
  const controlledCacheRoot = join(projectRoot, '.skopos-portability-cache');
  return {
    claim: 'observed-generated-artifacts-contained',
    assertionScope:
      'Checks Skopos-generated paths, installed package contents, links, dependency protocols, and harness-controlled temp/npm-cache roots. It does not claim operating-system-wide observation of arbitrary third-party or package-manager global-cache writes.',
    generatedPathsChecked: generatedPaths.length,
    outsideProjectPaths,
    forbiddenSymlinkTargets,
    installedSourceCheckoutReferences,
    nodePathAbsent: !cleanEnvironment().NODE_PATH,
    workspaceProtocolAbsent: Object.values(installedPackage.dependencies ?? {}).every(
      (value) => !value.startsWith('workspace:') && !value.startsWith('link:'),
    ),
    controlledTempRoot,
    controlledCacheRoot,
  };
};

const walk = async (root: string, includeSymlinks = false): Promise<string[]> => {
  const paths: string[] = [];
  const visit = async (path: string): Promise<void> => {
    let entries;
    try {
      entries = await readdir(path, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const child = join(path, entry.name);
      paths.push(child);
      if (entry.isDirectory()) await visit(child);
      if (entry.isSymbolicLink() && includeSymlinks) continue;
    }
  };
  await visit(root);
  return paths;
};

const initializeGitBaseline = (projectRoot: string): void => {
  execFileSync('git', ['init', '--initial-branch=main'], { cwd: projectRoot, stdio: 'pipe' });
  execFileSync('git', ['config', 'user.email', 'skopos@example.test'], { cwd: projectRoot });
  execFileSync('git', ['config', 'user.name', 'Skopos Portability'], { cwd: projectRoot });
  execFileSync('git', ['add', '.'], { cwd: projectRoot, stdio: 'pipe' });
  execFileSync('git', ['commit', '-m', 'sanitized portability baseline'], {
    cwd: projectRoot,
    stdio: 'pipe',
  });
};

const readGitStatus = (projectRoot: string): string[] =>
  execFileSync('git', ['status', '--short'], {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  })
    .split('\n')
    .filter(Boolean);

const cleanEnvironment = (projectRoot?: string): NodeJS.ProcessEnv => {
  const environment = { ...process.env };
  delete environment.NODE_PATH;
  delete environment.npm_config_workspace_dir;
  delete environment.npm_config_workspace;
  delete environment.PNPM_WORKSPACE_DIR;
  if (projectRoot) {
    const controlledTempRoot = join(projectRoot, '.skopos-portability-tmp');
    const controlledCacheRoot = join(projectRoot, '.skopos-portability-cache');
    mkdirSync(controlledTempRoot, { recursive: true });
    mkdirSync(controlledCacheRoot, { recursive: true });
    environment.TMPDIR = controlledTempRoot;
    environment.TMP = controlledTempRoot;
    environment.TEMP = controlledTempRoot;
    environment.npm_config_cache = join(controlledCacheRoot, 'npm');
  }
  return environment;
};

const removeHarnessRoot = async (harnessRoot: string): Promise<void> => {
  const safeTempRoot = resolve(tmpdir());
  const resolvedHarnessRoot = resolve(harnessRoot);
  if (
    !isInside(safeTempRoot, resolvedHarnessRoot) ||
    !basename(resolvedHarnessRoot).startsWith('skopos-skill-portability-')
  ) {
    throw new Error(`Refusing to remove unsafe harness root: ${harnessRoot}`);
  }
  await rm(resolvedHarnessRoot, { recursive: true, force: true });
};

const isInside = (root: string, candidate: string): boolean => {
  const relation = relative(resolve(root), resolve(candidate));
  return relation === '' || (!relation.startsWith(`..${sep}`) && relation !== '..' && !isAbsolute(relation));
};

const normalize = (path: string): string => path.replaceAll('\\', '/');
const uniqueSorted = (values: string[]): string[] => [...new Set(values)].sort();
const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
const compactCommandError = (error: {
  status?: number;
  stdout?: Buffer | string;
  stderr?: Buffer | string;
}): string => {
  const details = [error.stderr?.toString(), error.stdout?.toString()]
    .filter((entry): entry is string => Boolean(entry?.trim()))
    .join('\n')
    .trim();
  const summary = details || `Command exited with status ${error.status ?? 'unknown'}.`;
  return summary.length > 2000 ? `${summary.slice(0, 2000)}…` : summary;
};
const pathExists = async (path: string): Promise<boolean> => {
  try {
    await lstat(path);
    return true;
  } catch {
    return false;
  }
};
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
const assertEqual = (observed: unknown, expected: unknown, label: string): void => {
  if (JSON.stringify(observed) !== JSON.stringify(expected)) {
    throw new Error(`${label} mismatch: expected ${JSON.stringify(expected)}, received ${JSON.stringify(observed)}.`);
  }
};

const parseArgs = (): { canaryRoot?: string; reportPath?: string; keepTemporary: boolean } => {
  const canaryIndex = process.argv.indexOf('--canary');
  const reportIndex = process.argv.indexOf('--report');
  return {
    ...(canaryIndex >= 0 ? { canaryRoot: process.argv[canaryIndex + 1] } : {}),
    ...(reportIndex >= 0 ? { reportPath: process.argv[reportIndex + 1] } : {}),
    keepTemporary: process.argv.includes('--keep-temporary'),
  };
};

const main = async (): Promise<void> => {
  const args = parseArgs();
  const report = await runExternalSkillPortability({
    canaryRoot: args.canaryRoot,
    keepTemporary: args.keepTemporary,
  });
  const output = `${JSON.stringify(report, null, 2)}\n`;
  if (args.reportPath) {
    const outputPath = resolve(args.reportPath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, output, 'utf8');
    process.stdout.write(`${JSON.stringify({
      schemaVersion: report.schemaVersion,
      result: report.result,
      reportPath: outputPath,
      packageSha256: report.package?.sha256,
      failure: report.failure,
      cleanup: report.cleanup,
      projects: report.projects.map((project) => ({
        label: project.label,
        fixtures: `${project.fixtureResult.passed}/${project.fixtureResult.passed + project.fixtureResult.failed}`,
        relevantModules: project.relevantTask.selectedModuleIds,
        irrelevantSkillContext: project.irrelevantTask.skillContextEntryCount,
        exactReuse: project.cache.exactReuse,
        invalidated: project.cache.invalidatedAfterCapabilityChange,
        continuation: project.continuation,
      })),
    })}\n`);
    if (report.result === 'fail') process.exitCode = 1;
    return;
  }
  process.stdout.write(output);
  if (report.result === 'fail') process.exitCode = 1;
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
