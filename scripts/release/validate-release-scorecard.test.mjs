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
    assert.equal(answers.get(11), 'No');
    assert.equal(answers.get(12), 'No');
  });

  it('rejects the current scorecard while Claude and Unisane proof remain open', async () => {
    const source = await readFile(scorecardPath, 'utf8');

    assert.throws(
      () => validatePreCandidateReleaseGates(source),
      /unresolved non-candidate gates: 11, 12/u,
    );
  });

  it('permits candidate certification after only non-candidate gates are accepted', async () => {
    const source = await readFile(scorecardPath, 'utf8');
    const accepted = source
      .replace(
        /\| 11 \| Codex and Claude are behaviorally equivalent \| No \|/u,
        '| 11 | Codex and Claude are behaviorally equivalent | Yes |',
      )
      .replace(
        /\| 12 \| Unisane deleted its parallel LLM workflow \| No \|/u,
        '| 12 | Unisane deleted its parallel LLM workflow | Yes |',
      );

    const result = validatePreCandidateReleaseGates(accepted);
    assert.deepEqual(result.candidateBoundGateIds, [3, 4, 15, 16]);
  });
});
