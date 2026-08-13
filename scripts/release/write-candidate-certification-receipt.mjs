import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validatePreCandidateReleaseGates } from './validate-release-scorecard.mjs';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export const buildCandidateCertificationReceipt = ({
  candidateCommit,
  releaseTag,
  tarballName,
  tarballBytes,
  scorecardSource,
  reconstructionSource,
  setupSource,
  webSource,
  securitySource,
  runtimeSources = [],
  workflow,
}) => {
  assert.match(candidateCommit, /^[a-f0-9]{40}$/u, 'Candidate commit must be a full Git SHA.');
  assert.match(releaseTag, /^v\d+\.\d+\.\d+$/u, 'Release tag must be an exact semver tag.');
  assert.equal(
    tarballName,
    `unisane-skopos-${releaseTag.slice(1)}.tgz`,
    'Candidate tarball name must match the @unisane/skopos package identity.',
  );

  const scorecard = validatePreCandidateReleaseGates(scorecardSource);
  const reconstruction = JSON.parse(reconstructionSource);
  const setup = JSON.parse(setupSource);
  const web = JSON.parse(webSource);
  assert.equal(reconstruction.kind, 'skopos.clean-checkout-reconstruction');
  assert.equal(reconstruction.candidateCommit, candidateCommit);
  assert.equal(reconstruction.trackedWorktreeClean, true);
  assert.equal(setup.kind, 'skopos.unified-setup-reconstruction');
  assert.equal(setup.candidateCommit, candidateCommit);
  assert.equal(setup.readiness, 'ready');
  assert.equal(setup.source, 'tracked-certification');
  assert.match(setup.certificationTaskId ?? '', /^T-/u);
  assert.equal(setup.configuredDocsRoot, 'docs');
  assert.ok(
    Array.isArray(setup.detectedDocsRoots) && setup.detectedDocsRoots.includes('docs'),
    'Unified setup did not preserve the configured canonical docs root.',
  );
  assert.deepEqual(
    setup.redundantQuestionIds,
    [],
    'Unified setup asked a redundant tracked archetype or docs-root question.',
  );
  assert.match(
    setup.setupStage ?? '',
    /^(inspection-required|questions-open|plan-ready|verification-blocked|setup-ready(?:-with-deferred-options)?)$/u,
    'Unified setup Evidence did not record a valid setup stage.',
  );
  assert.equal(web.kind, 'skopos.production-web-verification');
  assert.equal(web.candidateCommit, candidateCommit);
  assert.equal(web.webVerify, 'passed');
  assert.equal(web.liveIdentity, 'passed');
  assert.equal(web.deployedIdentity?.kind, 'skopos.web-build-identity');
  assert.equal(web.deployedIdentity?.product, 'Skopos');
  assert.equal(web.deployedIdentity?.repository, 'github.com/unisanetech/skopos');
  assert.equal(web.deployedIdentity?.environment, 'production');
  assert.equal(web.deployedIdentity?.candidateCommit, candidateCommit);
  const productionOrigin = new URL(web.productionOrigin);
  assert.equal(productionOrigin.protocol, 'https:');
  assert.equal(productionOrigin.pathname, '/');
  assert.equal(productionOrigin.search, '');
  assert.equal(productionOrigin.hash, '');
  assert.equal(
    web.identityEndpoint,
    new URL('/.well-known/skopos-release', productionOrigin).toString(),
  );

  const artifactSha256 = sha256(tarballBytes);
  const candidateEvidence = new Map([
    [3, 'clean-checkout-reconstruction.json'],
    [4, 'unified-setup-reconstruction.json'],
    [15, 'protected-workflow:packed-install-smoke'],
  ]);
  let security;
  let runtimeProofs = [];
  if (securitySource) {
    security = JSON.parse(securitySource);
    assert.equal(security.kind, 'skopos.exact-candidate-security');
    assert.equal(security.candidateCommit, candidateCommit);
    assert.equal(security.tarballSha256, artifactSha256);
    for (const field of [
      'sourceAudit',
      'historySecretScan',
      'artifactSecretScan',
      'licenseReview',
      'sbom',
    ]) {
      assert.equal(security[field], 'passed', `Security field ${field} did not pass.`);
    }
  }
  if (runtimeSources.length > 0) {
    runtimeProofs = runtimeSources.map((source) => JSON.parse(source));
    const expectedRuntimeIds = new Set([
      'ubuntu-24.04|22.13.0',
      'ubuntu-24.04|24',
      'macos-15|22.13.0',
      'macos-15|24',
      'windows-2025|22.13.0',
      'windows-2025|24',
    ]);
    assert.equal(runtimeProofs.length, expectedRuntimeIds.size);
    for (const proof of runtimeProofs) {
      assert.equal(proof.kind, 'skopos.exact-candidate-runtime');
      assert.equal(proof.candidateCommit, candidateCommit);
      assert.equal(proof.tarballSha256, artifactSha256);
      assert.equal(proof.packageVersion, releaseTag.slice(1));
      for (const field of [
        'artifactInstall',
        'versionCommand',
        'helpCommand',
        'setupCommand',
        'sessionCommand',
        'installedLifecycle',
        'bundledUi',
        'sourceProof',
      ]) {
        assert.equal(proof[field], 'passed', `Runtime field ${field} did not pass.`);
      }
      assert.equal(proof.status, 'passed');
      assert.equal(expectedRuntimeIds.delete(`${proof.os}|${proof.node}`), true);
    }
    assert.equal(expectedRuntimeIds.size, 0, 'Supported runtime proof matrix is incomplete.');
  }
  if (security && runtimeProofs.length === 6) {
    candidateEvidence.set(16, 'production-web-and-exact-candidate-security-runtime-matrix');
  }
  const gates = Array.from({ length: 20 }, (_, index) => {
    const id = index + 1;
    if (id === 16 && (!security || runtimeProofs.length !== 6)) {
      assert.equal(scorecard.answers.get(id), 'No');
      return {
        id,
        status: 'pending',
        authority: 'external-candidate-certification',
        evidence: 'awaiting-exact-candidate-security-and-runtime-matrix-after-production-web-proof',
      };
    }
    if (candidateEvidence.has(id)) {
      assert.equal(
        scorecard.answers.get(id),
        'No',
        `Candidate-bound gate ${id} must remain unresolved in tracked source.`,
      );
      return {
        id,
        status: 'passed',
        authority: 'external-candidate-certification',
        evidence: candidateEvidence.get(id),
      };
    }
    assert.equal(scorecard.answers.get(id), 'Yes');
    return {
      id,
      status: 'passed',
      authority: 'accepted-tracked-scorecard',
      evidence: 'docs/operations/first-public-release-scorecard.md',
    };
  });

  const passedGateCount = gates.filter((gate) => gate.status === 'passed').length;
  return {
    schemaVersion: 1,
    kind: security && runtimeProofs.length === 6
      ? 'skopos.release-candidate-certification'
      : 'skopos.release-candidate-core-certification',
    generatedAt: new Date().toISOString(),
    candidateCommit,
    releaseTag,
    package: {
      name: '@unisane/skopos',
      version: releaseTag.slice(1),
      distTag: 'next',
    },
    artifact: {
      file: tarballName,
      sha256: artifactSha256,
    },
    trackedScorecard: {
      file: 'docs/operations/first-public-release-scorecard.md',
      sha256: sha256(scorecardSource),
      acceptedGateCount: scorecard.requiredBeforeCandidateCertification.length,
      candidateBoundGateIds: scorecard.candidateBoundGateIds,
    },
    evidence: {
      cleanCheckoutReconstructionSha256: sha256(reconstructionSource),
      unifiedSetupReconstructionSha256: sha256(setupSource),
      productionWebVerificationSha256: sha256(webSource),
      ...(securitySource ? { exactCandidateSecuritySha256: sha256(securitySource) } : {}),
      ...(runtimeSources.length > 0
        ? { exactCandidateRuntimeSha256: runtimeSources.map((source) => sha256(source)).sort() }
        : {}),
    },
    workflow,
    gates,
    effectiveGateResult: { passed: passedGateCount, pending: 20 - passedGateCount, failed: 0 },
  };
};

const scriptPath = realpathSync(fileURLToPath(import.meta.url));
if (process.argv[1] && realpathSync(resolve(process.argv[1])) === scriptPath) {
  const args = process.argv.slice(2);
  const option = (name) => {
    const index = args.indexOf(name);
    assert.notEqual(index, -1, `Missing required option ${name}.`);
    assert.ok(args[index + 1], `${name} requires a value.`);
    return args[index + 1];
  };
  const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const candidateCommit = option('--candidate-sha');
  const releaseTag = option('--tag');
  const tarballPath = resolve(workspaceRoot, option('--tarball'));
  const reconstructionPath = resolve(workspaceRoot, option('--reconstruction'));
  const setupPath = resolve(workspaceRoot, option('--setup'));
  const webPath = resolve(workspaceRoot, option('--web'));
  const outputPath = resolve(workspaceRoot, option('--output'));
  const securityOptionIndex = args.indexOf('--security');
  const securityPath = securityOptionIndex >= 0
    ? resolve(workspaceRoot, args[securityOptionIndex + 1] ?? '')
    : undefined;
  assert.notEqual(
    securityOptionIndex >= 0 && !args[securityOptionIndex + 1],
    true,
    '--security requires a value.',
  );
  const runtimeDirectoryOptionIndex = args.indexOf('--runtime-dir');
  const runtimeDirectory = runtimeDirectoryOptionIndex >= 0
    ? resolve(workspaceRoot, args[runtimeDirectoryOptionIndex + 1] ?? '')
    : undefined;
  assert.notEqual(
    runtimeDirectoryOptionIndex >= 0 && !args[runtimeDirectoryOptionIndex + 1],
    true,
    '--runtime-dir requires a value.',
  );
  const currentCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: workspaceRoot,
    encoding: 'utf8',
  }).trim();
  assert.equal(currentCommit, candidateCommit, 'Receipt candidate does not match checked-out HEAD.');
  assert.equal(
    execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
      cwd: workspaceRoot,
      encoding: 'utf8',
    }),
    '',
    'Tracked candidate files changed during certification.',
  );

  const runtimeEvidencePaths = runtimeDirectory
    ? (await readdir(runtimeDirectory))
        .filter((entry) => entry.endsWith('.json'))
        .sort()
        .map((entry) => resolve(runtimeDirectory, entry))
    : [];
  const [tarballBytes, scorecardSource, reconstructionSource, setupSource, webSource, securitySource, runtimeSources] = await Promise.all([
    readFile(tarballPath),
    readFile(resolve(workspaceRoot, 'docs/operations/first-public-release-scorecard.md'), 'utf8'),
    readFile(reconstructionPath, 'utf8'),
    readFile(setupPath, 'utf8'),
    readFile(webPath, 'utf8'),
    securityPath ? readFile(securityPath, 'utf8') : Promise.resolve(undefined),
    Promise.all(runtimeEvidencePaths.map((path) => readFile(path, 'utf8'))),
  ]);
  const receipt = buildCandidateCertificationReceipt({
    candidateCommit,
    releaseTag,
    tarballName: basename(tarballPath),
    tarballBytes,
    scorecardSource,
    reconstructionSource,
    setupSource,
    webSource,
    securitySource,
    runtimeSources,
    workflow: {
      provider: 'github-actions',
      runId: process.env.GITHUB_RUN_ID ?? null,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
      workflowRef: process.env.GITHUB_WORKFLOW_REF ?? null,
    },
  });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(receipt, null, 2));
}
