import assert from 'node:assert/strict';
import { realpathSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const IDENTITY_PATH = '/.well-known/skopos-release';
const EXPECTED_IDENTITY = {
  schemaVersion: 1,
  kind: 'skopos.web-build-identity',
  product: 'Skopos',
  repository: 'github.com/unisanetech/skopos',
  environment: 'production',
};

const delay = (milliseconds) => new Promise((resolveDelay) => {
  setTimeout(resolveDelay, milliseconds);
});

export const validateProductionWebIdentity = ({ identity, candidateCommit, productionOrigin }) => {
  assert.match(candidateCommit, /^[a-f0-9]{40}$/u, 'Candidate commit must be a full Git SHA.');
  const origin = new URL(productionOrigin);
  assert.equal(origin.protocol, 'https:', 'The production web origin must use HTTPS.');
  assert.equal(origin.pathname, '/', 'The production web URL must be an origin without a path.');
  assert.equal(origin.search, '', 'The production web origin must not include a query.');
  assert.equal(origin.hash, '', 'The production web origin must not include a fragment.');
  assert.deepEqual(
    {
      schemaVersion: identity?.schemaVersion,
      kind: identity?.kind,
      product: identity?.product,
      repository: identity?.repository,
      environment: identity?.environment,
    },
    EXPECTED_IDENTITY,
    'The deployed website did not expose the canonical Skopos production identity.',
  );
  assert.equal(
    identity?.candidateCommit,
    candidateCommit,
    'The deployed website does not match the exact release candidate commit.',
  );

  return {
    schemaVersion: 1,
    kind: 'skopos.production-web-verification',
    candidateCommit,
    productionOrigin: origin.origin,
    identityEndpoint: new URL(IDENTITY_PATH, origin).toString(),
    deployedIdentity: identity,
    webVerify: 'passed',
    liveIdentity: 'passed',
  };
};

export const verifyProductionWeb = async ({
  candidateCommit,
  productionOrigin,
  attempts = 12,
  retryDelayMs = 10_000,
  fetchImpl = fetch,
}) => {
  const identityUrl = new URL(IDENTITY_PATH, productionOrigin);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(identityUrl, {
        headers: { accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      });
      assert.equal(response.ok, true, `Production identity returned HTTP ${response.status}.`);
      return validateProductionWebIdentity({
        identity: await response.json(),
        candidateCommit,
        productionOrigin,
      });
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await delay(retryDelayMs);
  }
  throw lastError ?? new Error('Production web identity verification failed.');
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
  const workspaceRoot = resolve(dirname(scriptPath), '../..');
  const outputPath = resolve(workspaceRoot, option('--output'));
  const evidence = await verifyProductionWeb({
    candidateCommit: option('--candidate-sha'),
    productionOrigin: option('--origin'),
  });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(evidence, null, 2));
}
