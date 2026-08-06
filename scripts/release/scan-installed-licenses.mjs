import { lstat, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const REVIEW_REQUIRED = /(?:^|[^A-Z])(?:AGPL|GPL|SSPL|BUSL|UNLICENSED|UNKNOWN|SEE LICENSE)(?:[^A-Z]|$)/iu;

function manifestLicenseExpressions(manifest) {
  const expressions = new Set();
  if (typeof manifest.license === 'string') expressions.add(manifest.license.trim());
  for (const entry of manifest.licenses ?? []) {
    if (typeof entry === 'string') expressions.add(entry.trim());
    if (typeof entry?.type === 'string') expressions.add(entry.type.trim());
  }
  return [...expressions].filter(Boolean).sort((left, right) => left.localeCompare(right));
}

export function evaluateInstalledManifests(manifests) {
  const unique = new Map();
  for (const manifest of manifests) {
    if (typeof manifest?.name !== 'string' || typeof manifest?.version !== 'string') continue;
    const identity = `${manifest.name}@${manifest.version}`;
    const licenses = manifestLicenseExpressions(manifest);
    const current = unique.get(identity) ?? new Set();
    for (const license of licenses) current.add(license);
    unique.set(identity, current);
  }

  const packages = [...unique.entries()]
    .map(([identity, licenses]) => ({ identity, licenses: [...licenses].sort() }))
    .sort((left, right) => left.identity.localeCompare(right.identity));
  const reviewRequired = packages.flatMap((dependency) => {
    if (dependency.licenses.length === 0) return [`${dependency.identity}:NO-LICENSE-DATA`];
    return dependency.licenses
      .filter((license) => REVIEW_REQUIRED.test(license))
      .map((license) => `${dependency.identity}:${license}`);
  });

  if (packages.length === 0) reviewRequired.push('NO-PACKAGE-MANIFESTS');
  return { ok: reviewRequired.length === 0, packageCount: packages.length, packages, reviewRequired };
}

async function collectPackageManifests(directory, manifests) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      await collectPackageManifests(path, manifests);
      continue;
    }
    if (!entry.isFile() || entry.name !== 'package.json') continue;
    try {
      manifests.push(JSON.parse(await readFile(path, 'utf8')));
    } catch (error) {
      throw new Error(`Cannot read installed package manifest ${path}: ${error.message}`);
    }
  }
}

async function main() {
  const [installRoot, reportPath] = process.argv.slice(2);
  if (!installRoot || !reportPath) {
    throw new Error('Usage: node scan-installed-licenses.mjs <install-root> <license-report.json>');
  }
  const rootStat = await lstat(installRoot);
  if (!rootStat.isDirectory()) throw new Error(`Install root is not a directory: ${installRoot}`);

  const manifests = [];
  await collectPackageManifests(resolve(installRoot), manifests);
  const result = evaluateInstalledManifests(manifests);
  await writeFile(
    reportPath,
    `${JSON.stringify({ schemaVersion: 1, source: installRoot, ...result }, null, 2)}\n`,
    'utf8',
  );

  if (!result.ok) {
    throw new Error(`Dependency license review required for: ${result.reviewRequired.join(', ')}`);
  }
  console.log(`License policy passed for ${result.packageCount} installed packages.`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
