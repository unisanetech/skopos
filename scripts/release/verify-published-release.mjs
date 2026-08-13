import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_NAME = '@skopos/cli';
const EXPECTED_REPOSITORY = 'github.com/unisanetech/skopos';

const sha = (algorithm, bytes, encoding) =>
  createHash(algorithm).update(bytes).digest(encoding);

export const validatePublishedMetadata = ({ metadata, distTags, version }) => {
  assert.equal(metadata.name, PACKAGE_NAME);
  assert.equal(metadata.version, version);
  assert.equal(distTags.next, version, 'The npm next tag does not select the published candidate.');
  assert.notEqual(
    distTags.latest,
    version,
    'The first next release must not create or move the latest tag.',
  );

  assert.match(metadata.dist?.integrity ?? '', /^sha512-[A-Za-z0-9+/=]+$/u);
  assert.match(metadata.dist?.tarball ?? '', /^https:\/\/registry\.npmjs\.org\//u);
  const repository = typeof metadata.repository === 'string'
    ? metadata.repository
    : metadata.repository?.url;
  assert.ok(
    typeof repository === 'string' && repository.includes(EXPECTED_REPOSITORY),
    `Published repository identity must remain ${EXPECTED_REPOSITORY}.`,
  );
  assert.ok(
    Array.isArray(metadata.maintainers) && metadata.maintainers.length > 0,
    'Published package metadata did not identify any npm maintainer.',
  );
  assert.match(metadata.dist?.attestations?.url ?? '', /^https:\/\//u);
  assert.match(
    metadata.dist?.attestations?.provenance?.predicateType ?? '',
    /^https:\/\/slsa\.dev\/provenance\//u,
  );

  return {
    repository,
    maintainerCount: metadata.maintainers.length,
    integrity: metadata.dist.integrity,
    tarball: metadata.dist.tarball,
    provenanceUrl: metadata.dist.attestations.url,
  };
};

export const validateRegistryTarball = ({ bytes, integrity, expectedSha256 }) => {
  const actualSha256 = sha('sha256', bytes, 'hex');
  assert.equal(
    actualSha256,
    expectedSha256,
    'The registry tarball does not match the certified candidate tarball.',
  );
  assert.equal(
    `sha512-${sha('sha512', bytes, 'base64')}`,
    integrity,
    'The downloaded registry tarball does not match npm dist.integrity.',
  );
  return actualSha256;
};

const delay = (milliseconds) => new Promise((resolveDelay) => {
  setTimeout(resolveDelay, milliseconds);
});

const run = (command, args, cwd, environment = {}) =>
  execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', ...environment },
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 32 * 1024 * 1024,
  });

const runJson = (command, args, cwd, environment) =>
  JSON.parse(run(command, args, cwd, environment));

const assertVersionOutput = (output, version, command) => {
  const lines = output.trim().split(/\r?\n/u).filter(Boolean);
  assert.equal(
    lines.at(-1),
    version,
    `${command} did not execute the expected published Skopos version.`,
  );
};

export const verifyPublishedRelease = async ({
  workspaceRoot,
  version,
  receiptPath,
  outputPath,
  attempts = 12,
  retryDelayMs = 10_000,
}) => {
  assert.match(version, /^\d+\.\d+\.\d+$/u);
  const receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
  assert.equal(receipt.kind, 'skopos.release-candidate-certification');
  assert.equal(receipt.package?.name, PACKAGE_NAME);
  assert.equal(receipt.package?.version, version);
  assert.equal(receipt.package?.distTag, 'next');
  assert.match(receipt.artifact?.sha256 ?? '', /^[a-f0-9]{64}$/u);
  assert.deepEqual(receipt.effectiveGateResult, { passed: 20, pending: 0, failed: 0 });
  assert.equal(
    run('git', ['rev-parse', 'HEAD'], workspaceRoot).trim(),
    receipt.candidateCommit,
    'Registry verification must run from the certified candidate source.',
  );

  let metadata;
  let distTags;
  let published;
  let lastRegistryError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      metadata = runJson('npm', ['view', `${PACKAGE_NAME}@${version}`, '--json'], workspaceRoot);
      distTags = runJson('npm', ['view', PACKAGE_NAME, 'dist-tags', '--json'], workspaceRoot);
      published = validatePublishedMetadata({ metadata, distTags, version });
      break;
    } catch (error) {
      lastRegistryError = error;
    }
    if (attempt < attempts) await delay(retryDelayMs);
  }
  assert.ok(
    metadata && distTags && published,
    lastRegistryError ?? 'Published metadata, tags, and provenance did not propagate.',
  );

  const registryDirectory = resolve(workspaceRoot, '.release/registry');
  await mkdir(registryDirectory, { recursive: true });
  const packResult = runJson(
    'npm',
    ['pack', `${PACKAGE_NAME}@${version}`, '--pack-destination', registryDirectory, '--json'],
    workspaceRoot,
  );
  assert.equal(packResult.length, 1, 'npm pack returned more than one registry artifact.');
  assert.equal(packResult[0]?.name, PACKAGE_NAME);
  assert.equal(packResult[0]?.version, version);
  const registryTarballPath = resolve(registryDirectory, packResult[0].filename);
  const registryTarballBytes = await readFile(registryTarballPath);
  const registryTarballSha256 = validateRegistryTarball({
    bytes: registryTarballBytes,
    integrity: published.integrity,
    expectedSha256: receipt.artifact.sha256,
  });

  const launcherRoot = await mkdtemp(resolve(tmpdir(), 'skopos-registry-launchers-'));
  const installedRoot = await mkdtemp(resolve(tmpdir(), 'skopos-registry-installed-'));
  try {
    await Promise.all([
      writeFile(
        resolve(launcherRoot, 'package.json'),
        '{"name":"skopos-registry-launchers","private":true}\n',
        'utf8',
      ),
      mkdir(resolve(installedRoot, 'src'), { recursive: true }),
      writeFile(
        resolve(installedRoot, 'package.json'),
        '{"name":"skopos-registry-installed","private":true}\n',
        'utf8',
      ),
      writeFile(resolve(installedRoot, 'src/index.ts'), 'export {};\n', 'utf8'),
    ]);

    const launcherSpec = `${PACKAGE_NAME}@next`;
    assertVersionOutput(
      run('npx', ['--yes', launcherSpec, '--version'], launcherRoot),
      version,
      'npx',
    );
    assertVersionOutput(
      run('npm', ['exec', '--yes', `--package=${launcherSpec}`, '--', 'skopos', '--version'], launcherRoot),
      version,
      'npm exec',
    );
    assertVersionOutput(
      run('pnpm', ['dlx', launcherSpec, '--version'], launcherRoot),
      version,
      'pnpm dlx',
    );

    run(
      'npm',
      ['install', registryTarballPath, '--omit=dev', '--ignore-scripts'],
      installedRoot,
    );
    const installedCli = resolve(installedRoot, 'node_modules/@skopos/cli/dist/cli.js');
    assert.equal(run(process.execPath, [installedCli, '--version'], installedRoot).trim(), version);
    runJson(process.execPath, [
      installedCli,
      'setup',
      '.',
      '--actor',
      'registry-verification',
      '--host',
      'codex',
      '--session-id',
      'registry-verification',
      '--json',
    ], installedRoot);
    runJson(process.execPath, [
      installedCli,
      'session',
      'context',
      '.',
      '--actor',
      'registry-verification',
      '--host',
      'codex',
      '--session-id',
      'registry-verification',
      '--json',
    ], installedRoot);
    const ui = runJson(process.execPath, [
      installedCli,
      'ui',
      'build',
      '.',
      '--output-dir',
      '.skopos/registry-ui',
      '--json',
    ], installedRoot);
    for (const artifactPath of [ui.entryHtmlPath, ui.statePath, ui.searchIndexPath]) {
      assert.ok(
        typeof artifactPath === 'string' && existsSync(resolve(installedRoot, artifactPath)),
        `Installed bundled UI did not create ${String(artifactPath)}.`,
      );
    }
    assert.ok(Array.isArray(ui.assetPaths) && ui.assetPaths.length > 0);

    run('pnpm', ['release:smoke:artifact'], workspaceRoot, {
      SKOPOS_RELEASE_TARBALL: registryTarballPath,
    });
  } finally {
    await Promise.all([
      rm(launcherRoot, { recursive: true, force: true }),
      rm(installedRoot, { recursive: true, force: true }),
    ]);
  }

  const evidence = {
    schemaVersion: 1,
    kind: 'skopos.published-registry-verification',
    candidateCommit: receipt.candidateCommit,
    package: { name: PACKAGE_NAME, version, distTag: 'next' },
    registry: {
      integrity: published.integrity,
      tarball: published.tarball,
      repository: published.repository,
      maintainerCount: published.maintainerCount,
      provenanceUrl: published.provenanceUrl,
      distTags,
    },
    artifact: {
      candidateSha256: receipt.artifact.sha256,
      registrySha256: registryTarballSha256,
      file: basename(registryTarballPath),
    },
    commands: {
      npx: 'passed',
      npmExec: 'passed',
      pnpmDlx: 'passed',
      installedLifecycle: 'passed',
      bundledUi: 'passed',
    },
    status: 'passed',
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  return evidence;
};

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(scriptPath)) {
  const args = process.argv.slice(2);
  const option = (name) => {
    const index = args.indexOf(name);
    assert.notEqual(index, -1, `Missing required option ${name}.`);
    assert.ok(args[index + 1], `${name} requires a value.`);
    return args[index + 1];
  };
  const workspaceRoot = resolve(dirname(scriptPath), '../..');
  const evidence = await verifyPublishedRelease({
    workspaceRoot,
    version: option('--version'),
    receiptPath: resolve(workspaceRoot, option('--receipt')),
    outputPath: resolve(workspaceRoot, option('--output')),
  });
  console.log(JSON.stringify(evidence, null, 2));
}
