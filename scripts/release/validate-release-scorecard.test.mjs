import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

import {
  parseCanonicalReleaseAnswers,
  validatePreCandidateReleaseGates,
} from './validate-release-scorecard.mjs';
import { buildCandidateCertificationReceipt } from './write-candidate-certification-receipt.mjs';

const scorecardPath = new URL('../../docs/operations/first-public-release-scorecard.md', import.meta.url);

describe('public-release scorecard guard', () => {
  it('parses the exact 20 canonical answers', async () => {
    const source = await readFile(scorecardPath, 'utf8');
    const answers = parseCanonicalReleaseAnswers(source);

    assert.equal(answers.size, 20);
    assert.equal(answers.get(11), 'Yes');
    assert.equal(answers.get(12), 'Yes');
    assert.equal(answers.get(18), 'Yes');
    assert.equal(answers.get(19), 'Yes');
    assert.equal(answers.get(20), 'Yes');
  });

  it('accepts the current claimed-host certification boundary', async () => {
    const source = await readFile(scorecardPath, 'utf8');

    const result = validatePreCandidateReleaseGates(source);
    assert.deepEqual(result.candidateBoundGateIds, [3, 4, 15, 16]);
  });

  it('rejects a scorecard that loses claimed-host certification', async () => {
    const source = await readFile(scorecardPath, 'utf8');
    const weakened = source.replace(
      /\| 11 \| Every host claimed supported has real-host behavioral proof \| Yes \|/u,
      '| 11 | Every host claimed supported has real-host behavioral proof | No |',
    );

    assert.throws(
      () => validatePreCandidateReleaseGates(weakened),
      /unresolved non-candidate gates: 11/u,
    );
  });

  it('rejects a scorecard that omits a canonical unified-setup gate', async () => {
    const source = await readFile(scorecardPath, 'utf8');
    const incomplete = source.replace(/^\| 20 \|.*\n/mu, '');

    assert.throws(
      () => validatePreCandidateReleaseGates(incomplete),
      /must contain exactly 20 answers/u,
    );
  });

  it('keeps exact-candidate gates unresolved in tracked source', async () => {
    const source = await readFile(scorecardPath, 'utf8');
    const result = validatePreCandidateReleaseGates(source);

    for (const gateId of result.candidateBoundGateIds) {
      assert.equal(result.answers.get(gateId), 'No');
    }
  });

  it('keeps the core receipt provisional until exact-SHA security and runtime proof pass', async () => {
    const source = await readFile(scorecardPath, 'utf8');
    const candidateCommit = 'a'.repeat(40);
    const receipt = buildCandidateCertificationReceipt({
      candidateCommit,
      releaseTag: 'v0.1.0',
      tarballName: 'unisane-skopos-0.1.0.tgz',
      tarballBytes: Buffer.from('reviewed tarball'),
      scorecardSource: source,
      reconstructionSource: JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.clean-checkout-reconstruction',
        candidateCommit,
        trackedWorktreeClean: true,
      }),
      setupSource: JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.unified-setup-reconstruction',
        candidateCommit,
        readiness: 'ready',
        source: 'tracked-certification',
        certificationTaskId: 'T-setup-certification',
        configuredDocsRoot: 'docs',
        detectedDocsRoots: ['docs'],
        redundantQuestionIds: [],
        setupStage: 'setup-ready',
      }),
      webSource: JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.production-web-verification',
        candidateCommit,
        productionOrigin: 'https://skopos.example',
        identityEndpoint: 'https://skopos.example/.well-known/skopos-release',
        deployedIdentity: {
          schemaVersion: 1,
          kind: 'skopos.web-build-identity',
          product: 'Skopos',
          repository: 'github.com/unisanetech/skopos',
          candidateCommit,
          environment: 'production',
        },
        webVerify: 'passed',
        liveIdentity: 'passed',
      }),
      workflow: { provider: 'test' },
    });

    assert.deepEqual(receipt.effectiveGateResult, { passed: 19, pending: 1, failed: 0 });
    assert.equal(receipt.kind, 'skopos.release-candidate-core-certification');
    assert.deepEqual(
      receipt.gates
        .filter((gate) => gate.status === 'passed' && gate.authority === 'external-candidate-certification')
        .map((gate) => gate.id),
      [3, 4, 15],
    );
    assert.match(receipt.artifact.sha256, /^[a-f0-9]{64}$/u);

    const finalReceipt = buildCandidateCertificationReceipt({
      candidateCommit,
      releaseTag: 'v0.1.0',
      tarballName: 'unisane-skopos-0.1.0.tgz',
      tarballBytes: Buffer.from('reviewed tarball'),
      scorecardSource: source,
      reconstructionSource: JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.clean-checkout-reconstruction',
        candidateCommit,
        trackedWorktreeClean: true,
      }),
      setupSource: JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.unified-setup-reconstruction',
        candidateCommit,
        readiness: 'ready',
        source: 'tracked-certification',
        certificationTaskId: 'T-setup-certification',
        configuredDocsRoot: 'docs',
        detectedDocsRoots: ['docs'],
        redundantQuestionIds: [],
        setupStage: 'setup-ready',
      }),
      webSource: JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.production-web-verification',
        candidateCommit,
        productionOrigin: 'https://skopos.example',
        identityEndpoint: 'https://skopos.example/.well-known/skopos-release',
        deployedIdentity: {
          schemaVersion: 1,
          kind: 'skopos.web-build-identity',
          product: 'Skopos',
          repository: 'github.com/unisanetech/skopos',
          candidateCommit,
          environment: 'production',
        },
        webVerify: 'passed',
        liveIdentity: 'passed',
      }),
      securitySource: JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.exact-candidate-security',
        candidateCommit,
        tarballSha256: receipt.artifact.sha256,
        sourceAudit: 'passed',
        historySecretScan: 'passed',
        artifactSecretScan: 'passed',
        licenseReview: 'passed',
        sbom: 'passed',
      }),
      runtimeSources: [
        ['ubuntu-24.04', '22.13.0'],
        ['ubuntu-24.04', '24'],
        ['macos-15', '22.13.0'],
        ['macos-15', '24'],
        ['windows-2025', '22.13.0'],
        ['windows-2025', '24'],
      ].map(([os, node]) => JSON.stringify({
        schemaVersion: 1,
        kind: 'skopos.exact-candidate-runtime',
        candidateCommit,
        tarballSha256: receipt.artifact.sha256,
        packageVersion: '0.1.0',
        os,
        node,
        artifactInstall: 'passed',
        versionCommand: 'passed',
        helpCommand: 'passed',
        setupCommand: 'passed',
        sessionCommand: 'passed',
        installedLifecycle: 'passed',
        bundledUi: 'passed',
        sourceProof: 'passed',
        status: 'passed',
      })),
      workflow: { provider: 'test' },
    });
    assert.equal(finalReceipt.kind, 'skopos.release-candidate-certification');
    assert.deepEqual(finalReceipt.effectiveGateResult, { passed: 20, pending: 0, failed: 0 });
  });
});
