import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

import {
  parseCanonicalReleaseAnswers,
  validatePreCandidateReleaseGates,
} from './validate-release-scorecard.mjs';

const scorecardPath = new URL('../../docs/operations/first-public-release-scorecard.md', import.meta.url);

describe('public-release scorecard guard', () => {
  it('parses the exact 17 canonical answers', async () => {
    const source = await readFile(scorecardPath, 'utf8');
    const answers = parseCanonicalReleaseAnswers(source);

    assert.equal(answers.size, 17);
    assert.equal(answers.get(11), 'Yes');
    assert.equal(answers.get(12), 'Yes');
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
});
