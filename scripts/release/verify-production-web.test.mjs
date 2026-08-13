import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateProductionWebIdentity } from './verify-production-web.mjs';

const candidateCommit = 'a'.repeat(40);
const productionOrigin = 'https://skopos.example';
const identity = {
  schemaVersion: 1,
  kind: 'skopos.web-build-identity',
  product: 'Skopos',
  repository: 'github.com/unisanetech/skopos',
  candidateCommit,
  environment: 'production',
};

describe('production web identity verification', () => {
  it('binds the live product, repository, origin, and deployed SHA', () => {
    const evidence = validateProductionWebIdentity({ identity, candidateCommit, productionOrigin });
    assert.equal(evidence.identityEndpoint, 'https://skopos.example/.well-known/skopos-release');
    assert.equal(evidence.deployedIdentity.candidateCommit, candidateCommit);
    assert.equal(evidence.liveIdentity, 'passed');
  });

  it('rejects stale deployments and non-canonical product identity', () => {
    assert.throws(() => validateProductionWebIdentity({
      identity: { ...identity, candidateCommit: 'b'.repeat(40) },
      candidateCommit,
      productionOrigin,
    }));
    assert.throws(() => validateProductionWebIdentity({
      identity: { ...identity, repository: 'github.com/example/skopos' },
      candidateCommit,
      productionOrigin,
    }));
  });

  it('rejects a non-HTTPS or path-bearing deployment URL', () => {
    assert.throws(() => validateProductionWebIdentity({
      identity,
      candidateCommit,
      productionOrigin: 'http://skopos.example',
    }));
    assert.throws(() => validateProductionWebIdentity({
      identity,
      candidateCommit,
      productionOrigin: 'https://skopos.example/site',
    }));
  });
});
