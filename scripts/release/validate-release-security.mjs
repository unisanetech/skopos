import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateInstalledManifests } from './scan-installed-licenses.mjs';

const workflowPath = new URL('../../.github/workflows/release-security.yml', import.meta.url);
const rootPackagePath = new URL('../../package.json', import.meta.url);
const cliPackagePath = new URL('../../packages/cli/package.json', import.meta.url);
const copyUiAppPath = new URL('../../packages/cli/scripts/copy-ui-app.mjs', import.meta.url);

const expectedActionPins = [
  'actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd',
  'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e',
  'pnpm/action-setup@d15e628ca66d93ee5f352c71671a7bc6a97af5c9',
  'anchore/sbom-action@e22c389904149dbc22b58101806040fa8d37a610',
  'actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a',
];

const workflow = await readFile(workflowPath, 'utf8');
const rootPackage = JSON.parse(await readFile(rootPackagePath, 'utf8'));
const cliPackage = JSON.parse(await readFile(cliPackagePath, 'utf8'));
const copyUiApp = await readFile(copyUiAppPath, 'utf8');

for (const action of expectedActionPins) {
  assert.match(workflow, new RegExp(action.replaceAll('/', '\\/')));
}

assert.doesNotMatch(workflow, /uses:\s+[^\n@]+@v\d+/u, 'Actions must use immutable SHAs');
assert.match(workflow, /permissions:\n\s+contents: read/u);
assert.match(workflow, /fetch-depth: 0/u);
assert.match(workflow, /persist-credentials: false/u);
assert.match(workflow, /tar -xzf \.release\/packed\/skopos-cli-0\.1\.0\.tgz -C \.release\/package/u);
assert.match(workflow, /gitleaks git --redact/u);
assert.match(workflow, /gitleaks dir --redact/u);
assert.match(workflow, /find \.release\/package\/package -type f -print -quit/u);
assert.match(workflow, /gitleaks_8\.30\.1_linux_x64\.tar\.gz/u);
assert.match(workflow, /551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb/u);
assert.match(workflow, /format: cyclonedx-json/u);
assert.match(workflow, /scan-installed-licenses\.mjs \.release\/install \.release\/licenses\.json/u);
assert.match(workflow, /pnpm audit --prod --audit-level high/u);
assert.match(workflow, /name: Build workspace packages\n\s+run: pnpm build/u);
assert.match(
  workflow,
  /npm install --prefix \.release\/install "\$GITHUB_WORKSPACE\/\.release\/packed\/skopos-cli-0\.1\.0\.tgz" --omit=dev --ignore-scripts/u,
);
assert.doesNotMatch(workflow, /pnpm --dir \.release\/install add/u);
assert.doesNotMatch(workflow, /--package-lock=false/u);

for (const os of ['ubuntu-24.04', 'macos-15', 'windows-2025']) {
  assert.match(workflow, new RegExp(`os: ${os.replace('.', '\\.')}`));
}
for (const node of ["'22.13.0'", "'24'"]) assert.match(workflow, new RegExp(`node: ${node}`));

assert.equal(rootPackage.packageManager, 'pnpm@10.26.0');
assert.equal(cliPackage.engines?.node, '^22.13.0 || ^24.0.0');
assert.match(copyUiApp, /process\.env\.npm_execpath/u);
assert.match(copyUiApp, /execFileSync\(process\.execPath/u);
assert.doesNotMatch(copyUiApp, /execFileSync\(['"]pnpm['"]/u);
assert.deepEqual(cliPackage.dependencies, {
  typescript: '5.9.3',
  vite: '7.3.6',
  yaml: '2.9.0',
});

assert.deepEqual(evaluateInstalledManifests([{ name: 'safe', version: '1.0.0', license: 'MIT' }]), {
  ok: true,
  packageCount: 1,
  packages: [{ identity: 'safe@1.0.0', licenses: ['MIT'] }],
  reviewRequired: [],
});
assert.equal(
  evaluateInstalledManifests([{ name: 'review-me', version: '1.0.0', license: 'GPL-3.0-only' }]).ok,
  false,
);
assert.equal(evaluateInstalledManifests([{ name: 'review-me', version: '1.0.0' }]).ok, false);
assert.equal(evaluateInstalledManifests([]).ok, false);

console.log('Release security workflow contract is valid.');
