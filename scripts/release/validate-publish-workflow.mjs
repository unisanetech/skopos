import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflowPath = new URL('../../.github/workflows/publish.yml', import.meta.url);
const rootPackagePath = new URL('../../package.json', import.meta.url);
const cliPackagePath = new URL('../../packages/cli/package.json', import.meta.url);

const workflow = await readFile(workflowPath, 'utf8');
const rootPackage = JSON.parse(await readFile(rootPackagePath, 'utf8'));
const cliPackage = JSON.parse(await readFile(cliPackagePath, 'utf8'));

const validateGitleaksProof = (source) => {
  assert.match(source, /gitleaks_8\.18\.4_linux_x64\.tar\.gz/u);
  assert.match(source, /ba6dbb656933921c775ee5a2d1c13a91046e7952e9d919f9bac4cec61d628e7d/u);
  assert.doesNotMatch(source, /gitleaks_8\.30\.1/u);
  assert.match(source, /name: Prove the secret scanner detects a positive canary/u);
  assert.match(source, /printf 'token = "%s%s"\\n' 'ghp_'/u);
  assert.match(source, /gitleaks detect --no-git --no-banner --redact/u);
  assert.match(source, /test "\$canary_exit" -eq 1/u);
  assert.match(source, /x\[0\]\.RuleID!=='github-pat'/u);
  assert.match(source, /rm -rf "\$canary_root"/u);
  assert.match(source, /gitleaks detect --redact --no-banner --source \./u);
  assert.match(
    source,
    /gitleaks detect --no-git --redact --no-banner --source \.release\/package\/package/u,
  );
};

const validatePublishWorkflowContract = (source, packageManifest) => {
  const triggerBlock = source.slice(source.indexOf('\non:\n'), source.indexOf('\npermissions:\n'));
  const certifyBlock = source.slice(
    source.indexOf('\n  certify:\n'),
    source.indexOf('\n  exact-candidate-security:\n'),
  );
  const securityBlock = source.slice(
    source.indexOf('\n  exact-candidate-security:\n'),
    source.indexOf('\n  exact-candidate-runtime:\n'),
  );
  const runtimeBlock = source.slice(
    source.indexOf('\n  exact-candidate-runtime:\n'),
    source.indexOf('\n  finalize-candidate-receipt:\n'),
  );
  const finalizationBlock = source.slice(
    source.indexOf('\n  finalize-candidate-receipt:\n'),
    source.indexOf('\n  publish:\n'),
  );
  const publishBlock = source.slice(
    source.indexOf('\n  publish:\n'),
    source.indexOf('\n  verify-published-registry:\n'),
  );
  const registryBlock = source.slice(source.indexOf('\n  verify-published-registry:\n'));
  const artifactUploadBlocks = source
    .split(/\n\s+- name:/u)
    .filter((block) => block.includes('uses: actions/upload-artifact@'));

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
  assert.equal(
    artifactUploadBlocks.length,
    5,
    'The protected publication workflow must preserve exactly five Evidence artifacts.',
  );
  for (const block of artifactUploadBlocks) {
    assert.match(
      block,
      /\n\s+include-hidden-files: true/u,
      'Every .release/** artifact upload must explicitly include hidden paths.',
    );
  }
  assert.match(certifyBlock, /if: github\.ref == 'refs\/heads\/main'/u);
  assert.match(securityBlock, /needs: certify/u);
  assert.match(runtimeBlock, /needs: certify/u);
  assert.match(
    finalizationBlock,
    /needs: \[certify, exact-candidate-security, exact-candidate-runtime\]/u,
  );
  assert.match(
    publishBlock,
    /needs: \[certify, exact-candidate-security, exact-candidate-runtime, finalize-candidate-receipt\]/u,
  );
  assert.match(
    registryBlock,
    /needs: \[certify, finalize-candidate-receipt, publish\]/u,
  );
  assert.match(publishBlock, /if: github\.ref == 'refs\/heads\/main' && inputs\.mode != 'certify'/u);
  assert.match(registryBlock, /if: github\.ref == 'refs\/heads\/main' && inputs\.mode != 'certify'/u);
  assert.match(publishBlock, /environment:\n\s+name: npm-release/u);
  assert.match(certifyBlock, /fetch-depth: 0/u);
  assert.match(certifyBlock, /persist-credentials: false/u);
  assert.match(source, /node-version: '24'/u);
  assert.match(source, /package-manager-cache: false/u);
  assert.match(source, /npm install --global npm@11\.15\.0/u);
  assert.match(certifyBlock, /pnpm install --frozen-lockfile/u);
  assert.match(
    certifyBlock,
    /name: Build workspace packages for source-level certification\n\s+run: pnpm build/u,
  );
  assert.match(certifyBlock, /git merge-base --is-ancestor HEAD origin\/main/u);
  assert.ok(certifyBlock.includes("p.name!=='@unisane/skopos'"));
  assert.ok(certifyBlock.includes("p.bin?.skopos!=='dist/cli.js'"));
  assert.match(certifyBlock, /p\.version!==tag/u);
  assert.match(certifyBlock, /p\.publishConfig\?\.access!=='public'/u);
  assert.match(certifyBlock, /p\.publishConfig\?\.tag!=='next'/u);
  assert.ok(
    certifyBlock.includes(
      "p.repository?.url!=='git+https://github.com/unisanetech/skopos.git'",
    ),
  );
  assert.match(certifyBlock, /pnpm release:security:validate/u);
  assert.match(certifyBlock, /pnpm release:publish:validate/u);
  assert.match(certifyBlock, /pnpm release:scorecard:validate/u);
  assert.match(
    certifyBlock,
    /node scripts\/release\/validate-clean-checkout-reconstruction\.mjs \. --evidence-dir \.release\/evidence/u,
  );
  assert.ok(
    certifyBlock.indexOf('run: pnpm build')
      < certifyBlock.indexOf('node scripts/release/validate-clean-checkout-reconstruction.mjs'),
    'Workspace packages must be built before clean-checkout reconstruction runs.',
  );
  assert.match(certifyBlock, /pnpm typecheck/u);
  assert.match(certifyBlock, /pnpm test/u);
  assert.match(certifyBlock, /pnpm proof/u);
  assert.match(
    certifyBlock,
    /name: Prove the independent production website\n\s+env:\n\s+CANDIDATE_SHA: \$\{\{ steps\.identity\.outputs\.candidate_sha \}\}\n\s+NEXT_PUBLIC_SITE_URL: \$\{\{ vars\.SKOPOS_PUBLIC_SITE_URL \}\}\n\s+SKOPOS_WEB_CANDIDATE_SHA: \$\{\{ steps\.identity\.outputs\.candidate_sha \}\}/u,
  );
  assert.match(certifyBlock, /test -n "\$NEXT_PUBLIC_SITE_URL"/u);
  assert.match(certifyBlock, /pnpm release:web:test/u);
  assert.match(certifyBlock, /pnpm web:verify/u);
  assert.match(certifyBlock, /pnpm release:web:verify/u);
  assert.match(certifyBlock, /--candidate-sha "\$CANDIDATE_SHA"/u);
  assert.match(certifyBlock, /--origin "\$NEXT_PUBLIC_SITE_URL"/u);
  assert.match(certifyBlock, /SKOPOS_WEB_CANDIDATE_SHA/u);
  assert.match(certifyBlock, /production-web\.json/u);
  assert.match(certifyBlock, /SKOPOS_RELEASE_TARBALL:/u);
  assert.match(certifyBlock, /pnpm release:smoke:artifact/u);
  assert.doesNotMatch(certifyBlock, /pnpm release:smoke(?:\s|$)/mu);
  assert.equal(
    certifyBlock.match(/pnpm --filter @unisane\/skopos pack --pack-destination/gu)?.length,
    1,
    'Candidate certification must pack exactly once.',
  );
  assert.match(certifyBlock, /sha256sum "packed\/unisane-skopos-\$\{PACKAGE_VERSION\}\.tgz"/u);
  assert.match(certifyBlock, /release:receipt:write/u);
  assert.match(certifyBlock, /clean-checkout-reconstruction\.json/u);
  assert.match(certifyBlock, /unified-setup-reconstruction\.json/u);
  assert.match(certifyBlock, /--web "\.release\/evidence\/production-web\.json"/u);
  assert.match(certifyBlock, /candidate-core-certification\.json/u);
  assert.doesNotMatch(certifyBlock, /\.release\/final\/candidate-certification\.json/u);
  assert.match(securityBlock, /test "\$\(git rev-parse HEAD\)" = "\$CANDIDATE_SHA"/u);
  assert.match(securityBlock, /pnpm audit --prod --audit-level high/u);
  validateGitleaksProof(securityBlock);
  assert.match(securityBlock, /scan-installed-licenses\.mjs/u);
  assert.match(securityBlock, /format: cyclonedx-json/u);
  assert.match(securityBlock, /exact-candidate-security\.json/u);
  assert.match(securityBlock, /tarballSha256:digest/u);
  assert.match(securityBlock, /sha256sum --check --strict unisane-skopos\.sha256/u);
  assert.doesNotMatch(securityBlock, /pnpm .* pack --pack-destination/u);
  for (const runtime of [
    "os: ubuntu-24.04\n            node: '22.13.0'",
    "os: ubuntu-24.04\n            node: '24'",
    "os: macos-15\n            node: '22.13.0'",
    "os: macos-15\n            node: '24'",
    "os: windows-2025\n            node: '22.13.0'",
    "os: windows-2025\n            node: '24'",
  ]) {
    assert.ok(runtimeBlock.includes(runtime));
  }
  assert.match(runtimeBlock, /test "\$\(git rev-parse HEAD\)" = "\$CANDIDATE_SHA"/u);
  assert.match(runtimeBlock, /name: unisane-skopos-publish-candidate-/u);
  assert.match(runtimeBlock, /crypto\.createHash\('sha256'\)/u);
  assert.match(runtimeBlock, /actual!==expected/u);
  assert.match(runtimeBlock, /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\),'skopos-exact-runtime-'\)\)/u);
  assert.match(runtimeBlock, /Runtime consumer must live outside the source checkout/u);
  assert.match(runtimeBlock, /RUNTIME_PROJECT=/u);
  assert.doesNotMatch(runtimeBlock, /\.release\/runtime-project/u);
  assert.match(runtimeBlock, /npm install --prefix "\$RUNTIME_PROJECT" "\$GITHUB_WORKSPACE\/\.release\/packed\/unisane-skopos-\$\{PACKAGE_VERSION\}\.tgz"/u);
  assert.match(runtimeBlock, /RUNTIME_CLI="\$RUNTIME_PROJECT\/node_modules\/@unisane\/skopos\/dist\/cli\.js"/u);
  assert.match(runtimeBlock, /node "\$RUNTIME_CLI" --version/u);
  assert.match(runtimeBlock, /node "\$RUNTIME_CLI" --help/u);
  assert.match(runtimeBlock, /node "\$RUNTIME_CLI" setup "\$RUNTIME_PROJECT"/u);
  assert.match(runtimeBlock, /node "\$RUNTIME_CLI" session context "\$RUNTIME_PROJECT"/u);
  assert.match(runtimeBlock, /node "\$RUNTIME_CLI" ui build "\$RUNTIME_PROJECT"/u);
  assert.match(runtimeBlock, /path\.resolve\(process\.env\.RUNTIME_PROJECT,p\)/u);
  assert.match(runtimeBlock, /name: Remove the isolated runtime consumer\n\s+if: always\(\)/u);
  assert.match(runtimeBlock, /const temp=path\.resolve\(os\.tmpdir\(\)\)/u);
  assert.match(runtimeBlock, /Refusing to remove an unsafe runtime path/u);
  assert.match(runtimeBlock, /fs\.rmSync\(resolved,\{recursive:true,force:true\}\)/u);
  assert.match(runtimeBlock, /SKOPOS_RELEASE_TARBALL:/u);
  assert.match(runtimeBlock, /pnpm release:smoke:artifact/u);
  assert.match(runtimeBlock, /pnpm build/u);
  assert.match(runtimeBlock, /pnpm release:check/u);
  assert.match(runtimeBlock, /pnpm proof/u);
  assert.match(runtimeBlock, /kind:'skopos\.exact-candidate-runtime'/u);
  assert.match(runtimeBlock, /tarballSha256:process\.env\.TARBALL_SHA/u);
  assert.match(runtimeBlock, /artifactInstall:'passed'/u);
  assert.match(runtimeBlock, /setupCommand:'passed'/u);
  assert.match(runtimeBlock, /installedLifecycle:'passed'/u);
  assert.match(runtimeBlock, /bundledUi:'passed'/u);
  assert.match(runtimeBlock, /unisane-skopos-runtime-/u);
  assert.match(
    finalizationBlock,
    /needs: \[certify, exact-candidate-security, exact-candidate-runtime\]/u,
  );
  assert.match(finalizationBlock, /--security "\.release\/security\/exact-candidate-security\.json"/u);
  assert.match(finalizationBlock, /--runtime-dir "\.release\/runtime"/u);
  assert.match(finalizationBlock, /--web "\.release\/evidence\/production-web\.json"/u);
  assert.match(finalizationBlock, /merge-multiple: true/u);
  assert.match(finalizationBlock, /--output "\.release\/final\/candidate-certification\.json"/u);
  assert.match(finalizationBlock, /unisane-skopos-final-certification-/u);
  assert.ok(
    source.indexOf('\n  exact-candidate-security:\n')
      < source.indexOf('\n  exact-candidate-runtime:\n')
      && source.indexOf('\n  exact-candidate-runtime:\n')
        < source.indexOf('\n  finalize-candidate-receipt:\n'),
    'Final candidate receipt must be downstream of exact security and runtime proof.',
  );
  assert.match(publishBlock, /sha256sum --check --strict unisane-skopos\.sha256/u);
  assert.match(publishBlock, /final\/candidate-certification\.json/u);
  assert.match(publishBlock, /r\.candidateCommit!==process\.env\.CANDIDATE_SHA/u);
  assert.match(publishBlock, /r\.package\?\.name!=='@unisane\/skopos'/u);
  assert.match(publishBlock, /r\.artifact\?\.sha256!==digest/u);
  assert.match(publishBlock, /r\.effectiveGateResult\?\.passed!==20/u);
  assert.match(certifyBlock, /\.release\/packed\/unisane-skopos-\$\{\{ steps\.identity\.outputs\.package_version \}\}\.tgz/u);
  assert.match(publishBlock, /name: unisane-skopos-publish-candidate-\$\{\{ needs\.certify\.outputs\.candidate_sha \}\}/u);
  assert.match(publishBlock, /https:\/\/www\.npmjs\.com\/package\/@unisane\/skopos/u);
  assert.ok(publishBlock.includes("p.name!=='@unisane/skopos'"));
  assert.ok(publishBlock.includes("p.bin?.skopos!=='dist/cli.js'"));
  assert.match(certifyBlock, /--tag next --access public --dry-run/u);
  assert.match(publishBlock, /if: inputs\.mode == 'bootstrap-publish'/u);
  assert.match(publishBlock, /NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_BOOTSTRAP_TOKEN \}\}/u);
  assert.match(publishBlock, /--tag next --access public --provenance/u);
  assert.match(publishBlock, /if: inputs\.mode == 'oidc-publish'/u);
  assert.match(publishBlock, /test -z "\$\{NODE_AUTH_TOKEN:-\}"/u);
  assert.match(registryBlock, /ref: \$\{\{ inputs\.tag \}\}/u);
  assert.match(registryBlock, /persist-credentials: false/u);
  assert.match(registryBlock, /pnpm install --frozen-lockfile/u);
  assert.match(registryBlock, /pnpm build/u);
  assert.match(registryBlock, /unisane-skopos-final-certification-/u);
  assert.match(registryBlock, /pnpm release:registry:test/u);
  assert.match(registryBlock, /pnpm release:registry:verify/u);
  assert.match(registryBlock, /--receipt "\.release\/final\/candidate-certification\.json"/u);
  assert.match(registryBlock, /published-registry-verification\.json/u);
  assert.match(registryBlock, /unisane-skopos-published-registry-/u);
  assert.doesNotMatch(source, /--tag latest/u);
  assert.doesNotMatch(source, /uses:\s+[^\n@]+@v\d+/u);

  for (const mode of ['certify', 'bootstrap-publish', 'oidc-publish']) {
    assert.match(triggerBlock, new RegExp(`- ${mode}`));
  }

  assert.equal(packageManifest.name, '@unisane/skopos');
  assert.equal(packageManifest.version, rootPackage.version);
  assert.match(packageManifest.version, /^0\.1\.\d+$/u);
  assert.deepEqual(packageManifest.bin, { skopos: 'dist/cli.js' });
  assert.equal(packageManifest.publishConfig?.access, 'public');
  assert.equal(packageManifest.publishConfig?.tag, 'next');
  assert.equal(packageManifest.repository?.url, 'git+https://github.com/unisanetech/skopos.git');
};

validatePublishWorkflowContract(workflow, cliPackage);

for (const weakened of [
  workflow.replace('  workflow_dispatch:', '  push:'),
  workflow.replace('      id-token: write\n', ''),
  workflow.replace("p.name!=='@unisane/skopos'", "p.name!=='@example/skopos'"),
  workflow.replace("p.bin?.skopos!=='dist/cli.js'||", ''),
  workflow.replace(
    '    needs: [certify, exact-candidate-security, exact-candidate-runtime, finalize-candidate-receipt]\n',
    '    needs: certify\n',
  ),
  workflow.replace('          - oidc-publish\n', ''),
  workflow.replace('${{ secrets.NPM_BOOTSTRAP_TOKEN }}', '${{ secrets.NPM_TOKEN }}'),
  workflow.replace('          pnpm release:scorecard:validate\n', ''),
  workflow.replace('          include-hidden-files: true\n', ''),
  workflow.replace('          pnpm web:verify\n', '          echo skipped-web-verify\n'),
  workflow.replace('          pnpm release:web:verify -- \\\n', '          echo skipped-live-web-identity \\\n'),
  workflow.replace('            --candidate-sha "$CANDIDATE_SHA" \\\n', ''),
  workflow.replace('          NEXT_PUBLIC_SITE_URL: ${{ vars.SKOPOS_PUBLIC_SITE_URL }}\n', ''),
  workflow.replace('          SKOPOS_WEB_CANDIDATE_SHA: ${{ steps.identity.outputs.candidate_sha }}\n', ''),
  workflow.replace('        run: pnpm build\n', '        run: echo skipped-workspace-build\n'),
  workflow.replace(
    '        run: node scripts/release/validate-clean-checkout-reconstruction.mjs . --evidence-dir .release/evidence\n',
    '        run: echo skipped-reconstruction\n',
  ),
  workflow.replace('          SKOPOS_RELEASE_TARBALL:', '          REPACKED_TARBALL:'),
  workflow.replace('        run: pnpm release:smoke:artifact\n', '        run: pnpm release:smoke\n'),
  workflow.replace('          pnpm release:receipt:write -- \\\n', '          echo skipped-receipt \\\n'),
  workflow.replace('          test "$(git rev-parse HEAD)" = "$CANDIDATE_SHA"\n', ''),
  workflow.replace('        run: pnpm audit --prod --audit-level high\n', '        run: echo skipped-audit\n'),
  workflow.replace('gitleaks_8.18.4_linux_x64.tar.gz', 'gitleaks_8.30.1_linux_x64.tar.gz'),
  workflow.replace(
    'ba6dbb656933921c775ee5a2d1c13a91046e7952e9d919f9bac4cec61d628e7d',
    '0'.repeat(64),
  ),
  workflow.replace('      - name: Prove the secret scanner detects a positive canary\n', '      - name: Skip scanner canary\n'),
  workflow.replace('          test "$canary_exit" -eq 1\n', '          test "$canary_exit" -eq 0\n'),
  workflow.replace("x[0].RuleID!=='github-pat'", "x[0].RuleID!=='anything'"),
  workflow.replace(
    '    needs: [certify, exact-candidate-security, exact-candidate-runtime]\n',
    '    needs: certify\n',
  ),
  workflow.replace('            --security ".release/security/exact-candidate-security.json" \\\n', ''),
  workflow.replace('            --runtime-dir ".release/runtime" \\\n', ''),
  workflow.replace('            --web ".release/evidence/production-web.json" \\\n', ''),
  workflow.replace("const actual=crypto.createHash('sha256')", "const actual=crypto.createHash('sha1')"),
  workflow.replace("fs.mkdtempSync(path.join(os.tmpdir(),'skopos-exact-runtime-'))", "path.join(process.env.GITHUB_WORKSPACE,'.release','runtime-project')"),
  workflow.replace('          npm install --prefix "$RUNTIME_PROJECT"', '          echo skipped-artifact-install'),
  workflow.replace(
    '          npm install --prefix "$RUNTIME_PROJECT" "$GITHUB_WORKSPACE/.release/packed/unisane-skopos-${PACKAGE_VERSION}.tgz"',
    '          npm install --prefix "$RUNTIME_PROJECT" ".release/packed/unisane-skopos-${PACKAGE_VERSION}.tgz"',
  ),
  workflow.replace('path.resolve(process.env.RUNTIME_PROJECT,p)', "path.resolve('.release/runtime-project',p)"),
  workflow.replace(
    '      - name: Remove the isolated runtime consumer\n        if: always()\n',
    '      - name: Remove the isolated runtime consumer\n',
  ),
  workflow.replace('          pnpm release:smoke:artifact\n', '          echo skipped-runtime-lifecycle\n'),
  workflow.replace('installedLifecycle:\'passed\'', 'installedLifecycle:\'skipped\''),
  workflow.replace('bundledUi:\'passed\'', 'bundledUi:\'skipped\''),
  workflow.replace("tarballSha256:process.env.TARBALL_SHA", "tarballSha256:'unbound'"),
  workflow.replace("r.candidateCommit!==process.env.CANDIDATE_SHA", 'false'),
  workflow.replace('git+https://github.com/unisanetech/skopos.git', 'git+https://github.com/Croodo/skopos.git'),
  workflow.replace('sha256sum --check --strict unisane-skopos.sha256', 'echo skipped-digest-check'),
  workflow.replace(
    '    needs: [certify, finalize-candidate-receipt, publish]\n',
    '    needs: publish\n',
  ),
  workflow.replace('          pnpm release:registry:verify -- \\\n', '          echo skipped-registry-verify \\\n'),
  workflow.replace('            --receipt ".release/final/candidate-certification.json" \\\n', ''),
  workflow.replaceAll('--tag next', '--tag latest'),
]) {
  assert.throws(() => validatePublishWorkflowContract(weakened, cliPackage));
}

console.log('Trusted publication workflow contract is valid, including weakening regressions.');
