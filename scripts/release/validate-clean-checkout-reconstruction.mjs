import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const evidenceDirectoryIndex = args.indexOf('--evidence-dir');
const evidenceDirectoryArgument = evidenceDirectoryIndex >= 0
  ? args[evidenceDirectoryIndex + 1]
  : undefined;
assert.notEqual(
  evidenceDirectoryIndex >= 0 && !evidenceDirectoryArgument,
  true,
  '--evidence-dir requires a path.',
);
const workspaceArgument = args.find((argument, index) =>
  !argument.startsWith('--') && index !== evidenceDirectoryIndex + 1,
);
const workspaceRoot = realpathSync(workspaceArgument
  ? resolve(workspaceArgument)
  : resolve(dirname(fileURLToPath(import.meta.url)), '../..'));
const derivedStateRoot = resolve(workspaceRoot, '.skopos');

const run = (command, args) =>
  execFileSync(command, args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });

const runCli = (args) =>
  JSON.parse(
    run(process.execPath, [
      '--import',
      'tsx',
      'packages/cli/src/cli.ts',
      ...args,
      '--json',
    ]),
  );

assert.equal(
  run('git', ['status', '--porcelain']),
  '',
  'Clean-checkout reconstruction must start from an unchanged candidate checkout.',
);
assert.equal(
  run('git', ['ls-files', '.skopos']).trim(),
  '',
  'Disposable .skopos state must not be tracked.',
);
assert.equal(
  existsSync(derivedStateRoot),
  false,
  'Clean-checkout reconstruction requires a checkout with no pre-existing .skopos state.',
);

const actor = 'release-reconstruction';
const initialized = runCli(['init', '.', '--mode', 'existing', '--actor', actor]);
const setup = runCli([
  'setup',
  '.',
  '--actor',
  actor,
  '--host',
  'codex',
  '--session-id',
  'release-reconstruction-session',
]);
const knowledge = runCli(['knowledge', '.', '--compact']);
const actions = runCli(['actions', 'list', '.']);
const session = runCli(['session', 'context', '.', '--actor', actor]);

assert.ok(initialized.projectPath?.endsWith('/.skopos/project.json'));
assert.ok(initialized.memoryPath?.endsWith('/.skopos/index/roles.json'));
const bootstrap = JSON.parse(
  readFileSync(resolve(derivedStateRoot, 'index/bootstrap.json'), 'utf8'),
);
assert.ok(
  bootstrap.detected?.docsRoots?.includes('docs'),
  'Unified setup did not detect the configured canonical docs root.',
);
const setupQuestionIds = (setup.state?.materialQuestions ?? []).map((question) => question.id);
assert.equal(
  setupQuestionIds.includes('bootstrap.project-archetype'),
  false,
  'Unified setup asked a redundant project-archetype question for tracked configuration.',
);
assert.equal(
  setupQuestionIds.includes('bootstrap.docs-root'),
  false,
  'Unified setup asked a redundant docs-root question for tracked configuration.',
);
assert.equal(resolve(knowledge.workspaceRoot), workspaceRoot);
assert.equal(knowledge.agentGuideReady, true);
assert.ok(knowledge.knownAreaCount >= 9, 'Tracked Memory did not reconstruct enough project knowledge.');
assert.ok(actions.totalActionCount > 0, 'Tracked capability sources did not reconstruct any Actions.');
assert.equal(resolve(session.workspaceRoot), workspaceRoot);
assert.deepEqual(session.warnings, []);
assert.equal(
  session.setupReadiness?.state,
  'ready',
  'Tracked unified-setup certification did not reconstruct as ready in the clean checkout.',
);
assert.equal(
  session.setupReadiness?.source,
  'tracked-certification',
  'Clean-checkout readiness must come from tracked setup certification.',
);
assert.match(
  session.setupReadiness?.certificationTaskId ?? '',
  /^T-/u,
  'Clean-checkout readiness did not identify its tracked certification Task.',
);
assert.equal(
  run('git', ['status', '--porcelain']),
  '',
  'Reconstructing disposable state must not mutate tracked candidate files.',
);

const candidateCommit = run('git', ['rev-parse', 'HEAD']).trim();
const reconstructionEvidence = {
  schemaVersion: 1,
  kind: 'skopos.clean-checkout-reconstruction',
  candidateCommit,
  knownAreaCount: knowledge.knownAreaCount,
  totalAreaCount: knowledge.totalAreaCount,
  actionCount: actions.totalActionCount,
  trackedWorktreeClean: true,
};
const setupEvidence = {
  schemaVersion: 1,
  kind: 'skopos.unified-setup-reconstruction',
  candidateCommit,
  readiness: session.setupReadiness.state,
  source: session.setupReadiness.source,
  certificationTaskId: session.setupReadiness.certificationTaskId,
  warnings: session.warnings,
  configuredDocsRoot: 'docs',
  detectedDocsRoots: bootstrap.detected.docsRoots,
  redundantQuestionIds: setupQuestionIds.filter((id) =>
    ['bootstrap.project-archetype', 'bootstrap.docs-root'].includes(id),
  ),
  setupStage: setup.state?.stage,
};

if (evidenceDirectoryArgument) {
  const evidenceDirectory = resolve(workspaceRoot, evidenceDirectoryArgument);
  await mkdir(evidenceDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      resolve(evidenceDirectory, 'clean-checkout-reconstruction.json'),
      `${JSON.stringify(reconstructionEvidence, null, 2)}\n`,
      'utf8',
    ),
    writeFile(
      resolve(evidenceDirectory, 'unified-setup-reconstruction.json'),
      `${JSON.stringify(setupEvidence, null, 2)}\n`,
      'utf8',
    ),
  ]);
}

console.log(JSON.stringify({ ...reconstructionEvidence, setup: setupEvidence }, null, 2));
