import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scorecardPath = new URL('../../docs/operations/first-public-release-scorecard.md', import.meta.url);

export const parseCanonicalReleaseAnswers = (source) => {
  const answers = new Map();

  for (const line of source.split('\n')) {
    const match = line.match(/^\|\s*(\d+)\s*\|[^|]+\|\s*(Yes|No)\s*\|/u);
    if (match) answers.set(Number(match[1]), match[2]);
  }

  return answers;
};

export const validatePreCandidateReleaseGates = (source) => {
  const answers = parseCanonicalReleaseAnswers(source);
  assert.equal(answers.size, 17, 'The canonical release scorecard must contain exactly 17 answers.');

  // Candidate-bound gates are proved inside the protected workflow:
  // 3 = clean-checkout reconstruction, 4 = final adoption matrix,
  // 15 = packed-install smoke, and 16 = the complete candidate proof matrix.
  const candidateBoundGateIds = new Set([3, 4, 15, 16]);
  const requiredBeforeCandidateCertification = Array.from({ length: 17 }, (_, index) => index + 1)
    .filter((gateId) => !candidateBoundGateIds.has(gateId));
  const unresolved = requiredBeforeCandidateCertification.filter(
    (gateId) => answers.get(gateId) !== 'Yes',
  );

  assert.deepEqual(
    unresolved,
    [],
    `Release scorecard has unresolved non-candidate gates: ${unresolved.join(', ')}.`,
  );
  assert.match(
    source,
    /Product Interface Design is therefore \*\*publishable: yes\*\* and \*\*efficacy-certified:\s*no\*\*/u,
    'The accepted Product Interface Design release boundary must remain explicit.',
  );

  return { candidateBoundGateIds: [...candidateBoundGateIds], requiredBeforeCandidateCertification };
};

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? '')) {
  const source = await readFile(scorecardPath, 'utf8');
  validatePreCandidateReleaseGates(source);
  console.log('All non-candidate public-release scorecard gates are satisfied.');
}
