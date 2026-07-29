import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  discoverBundledPolicyPackRoots,
  listSkoposPolicyPacksRuntime,
} from '../../../runtime/src/application/policies/policies.service.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('external adopter policy pack discovery', () => {
  it('finds bundled packs independently of the adopter cwd', async () => {
    const externalProject = await mkdtemp(join(tmpdir(), 'skopos-external-adopter-'));
    temporaryRoots.push(externalProject);

    const packs = await listSkoposPolicyPacksRuntime({ cwd: externalProject });

    expect(packs.map((pack) => pack.packId)).toEqual(
      expect.arrayContaining([
        'clean-code.maintainability',
        'verification.progressive-validation',
      ]),
    );
  });

  it('discovers a policy-packs ancestor from source and built module locations', () => {
    const sourceDirectory = dirname(
      fileURLToPath(
        new URL(
          '../../../runtime/src/application/policies/policies.service.ts',
          import.meta.url,
        ),
      ),
    );

    expect(discoverBundledPolicyPackRoots(sourceDirectory)).toContain(
      join(sourceDirectory, '..', '..', '..', '..', '..', 'policy-packs'),
    );
  });
});
