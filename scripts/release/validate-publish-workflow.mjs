import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflowPath = new URL('../../.github/workflows/publish.yml', import.meta.url);
const cliPackagePath = new URL('../../packages/cli/package.json', import.meta.url);

const workflow = await readFile(workflowPath, 'utf8');
const cliPackage = JSON.parse(await readFile(cliPackagePath, 'utf8'));

const validatePublishWorkflowContract = (source, packageManifest) => {
  const triggerBlock = source.slice(source.indexOf('\non:\n'), source.indexOf('\npermissions:\n'));
  const certifyBlock = source.slice(source.indexOf('\n  certify:\n'), source.indexOf('\n  publish:\n'));
  const publishBlock = source.slice(source.indexOf('\n  publish:\n'));

  for (const action of [
    'actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd',
    'actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e',
    'pnpm/action-setup@d15e628ca66d93ee5f352c71671a7bc6a97af5c9',
    'actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a',
    'actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c',
  ]) {
    assert.match(source, new RegExp(action.replaceAll('/', '\\/')));
  }

  assert.match(source, /on:\n\s+workflow_dispatch:/u);
  assert.doesNotMatch(triggerBlock, /\n\s+(push|release):/u);
  assert.match(source, /permissions:\n\s+contents: read/u);
  assert.doesNotMatch(certifyBlock, /id-token: write|NODE_AUTH_TOKEN|environment:/u);
  assert.match(publishBlock, /permissions:\n\s+contents: read\n\s+id-token: write/u);
  assert.equal(source.match(/id-token: write/gu)?.length, 1);
  assert.match(source, /cancel-in-progress: false/u);
  assert.match(certifyBlock, /if: github\.ref == 'refs\/heads\/main'/u);
  assert.match(publishBlock, /needs: certify/u);
  assert.match(publishBlock, /if: github\.ref == 'refs\/heads\/main' && inputs\.mode != 'certify'/u);
  assert.match(publishBlock, /environment:\n\s+name: npm-release/u);
  assert.match(certifyBlock, /fetch-depth: 0/u);
  assert.match(certifyBlock, /persist-credentials: false/u);
  assert.match(source, /node-version: '24'/u);
  assert.match(source, /package-manager-cache: false/u);
  assert.match(source, /npm install --global npm@11\.15\.0/u);
  assert.match(certifyBlock, /pnpm install --frozen-lockfile/u);
  assert.match(certifyBlock, /git merge-base --is-ancestor HEAD origin\/main/u);
  assert.match(certifyBlock, /p\.version!==tag\|\|p\.publishConfig/u);
  assert.match(certifyBlock, /pnpm release:security:validate/u);
  assert.match(certifyBlock, /pnpm release:publish:validate/u);
  assert.match(certifyBlock, /pnpm typecheck/u);
  assert.match(certifyBlock, /pnpm test/u);
  assert.match(certifyBlock, /pnpm proof/u);
  assert.match(certifyBlock, /pnpm release:smoke/u);
  assert.match(certifyBlock, /sha256sum "packed\/skopos-cli-\$\{PACKAGE_VERSION\}\.tgz"/u);
  assert.match(publishBlock, /sha256sum --check --strict skopos-cli\.sha256/u);
  assert.match(certifyBlock, /\.release\/packed\/skopos-cli-\$\{\{ steps\.identity\.outputs\.package_version \}\}\.tgz/u);
  assert.match(publishBlock, /name: skopos-cli-publish-candidate-\$\{\{ needs\.certify\.outputs\.candidate_sha \}\}/u);
  assert.match(certifyBlock, /--tag next --access public --dry-run/u);
  assert.match(publishBlock, /if: inputs\.mode == 'bootstrap-publish'/u);
  assert.match(publishBlock, /NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_BOOTSTRAP_TOKEN \}\}/u);
  assert.match(publishBlock, /--tag next --access public --provenance/u);
  assert.match(publishBlock, /if: inputs\.mode == 'oidc-publish'/u);
  assert.match(publishBlock, /test -z "\$\{NODE_AUTH_TOKEN:-\}"/u);
  assert.doesNotMatch(source, /--tag latest/u);
  assert.doesNotMatch(source, /uses:\s+[^\n@]+@v\d+/u);

  for (const mode of ['certify', 'bootstrap-publish', 'oidc-publish']) {
    assert.match(triggerBlock, new RegExp(`- ${mode}`));
  }

  assert.equal(packageManifest.name, '@skopos/cli');
  assert.equal(packageManifest.version, '0.1.0');
  assert.equal(packageManifest.publishConfig?.access, 'public');
  assert.equal(packageManifest.publishConfig?.tag, 'next');
  assert.equal(packageManifest.repository?.url, 'git+https://github.com/Croodo/skopos.git');
};

validatePublishWorkflowContract(workflow, cliPackage);

for (const weakened of [
  workflow.replace('  workflow_dispatch:', '  push:'),
  workflow.replace('      id-token: write\n', ''),
  workflow.replace('    needs: certify\n', ''),
  workflow.replace('          - oidc-publish\n', ''),
  workflow.replace('${{ secrets.NPM_BOOTSTRAP_TOKEN }}', '${{ secrets.NPM_TOKEN }}'),
  workflow.replace('sha256sum --check --strict skopos-cli.sha256', 'echo skipped-digest-check'),
  workflow.replaceAll('--tag next', '--tag latest'),
]) {
  assert.throws(() => validatePublishWorkflowContract(weakened, cliPackage));
}

console.log('Trusted publication workflow contract is valid, including weakening regressions.');
