import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { describe, it } from 'node:test';

import {
  validatePublishedMetadata,
  validateRegistryTarball,
} from './verify-published-release.mjs';

const version = '0.1.0';
const metadata = {
  name: '@unisane/skopos',
  version,
  bin: { skopos: 'dist/cli.js' },
  repository: { url: 'git+https://github.com/unisanetech/skopos.git' },
  maintainers: [{ name: 'release-owner' }],
  dist: {
    integrity: 'sha512-fixture',
    tarball: 'https://registry.npmjs.org/@unisane/skopos/-/skopos-0.1.0.tgz',
    attestations: {
      url: 'https://registry.npmjs.org/-/npm/v1/attestations/@unisane%2fskopos@0.1.0',
      provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
    },
  },
};

describe('published release verification', () => {
  it('accepts exact metadata, provenance, repository, maintainer, and next-tag identity', () => {
    assert.equal(
      validatePublishedMetadata({ metadata, distTags: { next: version }, version }).maintainerCount,
      1,
    );
  });

  it('rejects latest promotion and missing provenance', () => {
    assert.throws(() => validatePublishedMetadata({
      metadata,
      distTags: { next: version, latest: version },
      version,
    }));
    assert.throws(() => validatePublishedMetadata({
      metadata: { ...metadata, dist: { ...metadata.dist, attestations: undefined } },
      distTags: { next: version },
      version,
    }));
  });

  it('rejects the wrong next tag, repository, or maintainer authority', () => {
    assert.throws(() => validatePublishedMetadata({
      metadata,
      distTags: { next: '0.1.1' },
      version,
    }));
    assert.throws(() => validatePublishedMetadata({
      metadata: { ...metadata, repository: { url: 'https://github.com/example/skopos.git' } },
      distTags: { next: version },
      version,
    }));
    assert.throws(() => validatePublishedMetadata({
      metadata: { ...metadata, maintainers: [] },
      distTags: { next: version },
      version,
    }));
    assert.throws(() => validatePublishedMetadata({
      metadata: { ...metadata, name: '@example/skopos' },
      distTags: { next: version },
      version,
    }));
    assert.throws(() => validatePublishedMetadata({
      metadata: { ...metadata, bin: { other: 'dist/cli.js' } },
      distTags: { next: version },
      version,
    }));
  });

  it('binds the downloaded registry bytes to both npm integrity and candidate SHA-256', () => {
    const bytes = Buffer.from('registry tarball fixture');
    const expectedSha256 = createHash('sha256').update(bytes).digest('hex');
    const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
    assert.equal(
      validateRegistryTarball({ bytes, integrity, expectedSha256 }),
      expectedSha256,
    );
    assert.throws(() => validateRegistryTarball({
      bytes,
      integrity,
      expectedSha256: '0'.repeat(64),
    }));
  });
});
