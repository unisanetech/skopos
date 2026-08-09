import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDirectory, '..');
const workspaceRoot = join(packageRoot, '..', '..');
const source = join(workspaceRoot, 'skill-packs');
const destination = join(packageRoot, 'dist', 'skill-packs');

// Public runtime contract. Product UI Craft stays in the package; only the files
// required to select, explain, fixture-check, and run its user-invoked evaluations
// may cross the npm boundary.
const publicSkillAssetPaths = [
  'ui/product-craft/evaluations/core.suite.json',
  'ui/product-craft/evaluations/templates/complete-service-flow/index.html',
  'ui/product-craft/evaluations/templates/complete-service-flow/src.js',
  'ui/product-craft/evaluations/templates/complete-service-flow/styles.css',
  'ui/product-craft/evaluations/templates/discovery-coordination/index.html',
  'ui/product-craft/evaluations/templates/discovery-coordination/src.js',
  'ui/product-craft/evaluations/templates/discovery-coordination/styles.css',
  'ui/product-craft/evaluations/templates/documentation-workspace/index.html',
  'ui/product-craft/evaluations/templates/documentation-workspace/src.js',
  'ui/product-craft/evaluations/templates/documentation-workspace/styles.css',
  'ui/product-craft/evaluations/templates/failure-recovery/index.html',
  'ui/product-craft/evaluations/templates/failure-recovery/src.js',
  'ui/product-craft/evaluations/templates/failure-recovery/styles.css',
  'ui/product-craft/evaluations/templates/operations-workbench/index.html',
  'ui/product-craft/evaluations/templates/operations-workbench/src.js',
  'ui/product-craft/evaluations/templates/operations-workbench/styles.css',
  'ui/product-craft/evaluations/templates/product-character/index.html',
  'ui/product-craft/evaluations/templates/product-character/src.js',
  'ui/product-craft/evaluations/templates/product-character/styles.css',
  'ui/product-craft/evaluations/templates/responsive-transformation/index.html',
  'ui/product-craft/evaluations/templates/responsive-transformation/src.js',
  'ui/product-craft/evaluations/templates/responsive-transformation/styles.css',
  'ui/product-craft/evaluations/templates/transaction-trust/index.html',
  'ui/product-craft/evaluations/templates/transaction-trust/src.js',
  'ui/product-craft/evaluations/templates/transaction-trust/styles.css',
  'ui/product-craft/fixtures/ambiguous-documentation.fixture.json',
  'ui/product-craft/fixtures/budget.fixture.json',
  'ui/product-craft/fixtures/capability-locality.fixture.json',
  'ui/product-craft/fixtures/design-system-conformance.fixture.json',
  'ui/product-craft/fixtures/generated-output.fixture.json',
  'ui/product-craft/fixtures/negative-backend.fixture.json',
  'ui/product-craft/fixtures/positive-hierarchy.fixture.json',
  'ui/product-craft/fixtures/visual-restraint-review.fixture.json',
  'ui/product-craft/guidance/anti-slop-review.md',
  'ui/product-craft/guidance/component-architecture-and-naming.md',
  'ui/product-craft/guidance/hierarchy-and-brand.md',
  'ui/product-craft/guidance/human-interface-writing.md',
  'ui/product-craft/guidance/react-boundaries.md',
  'ui/product-craft/guidance/responsive-and-states.md',
  'ui/product-craft/guidance/visual-composition-and-polish.md',
  'ui/product-craft/pack.json',
  'ui/product-craft/rubrics/product-ui-review.json',
].sort();

const listFiles = async (root, current = root) => {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(root, absolutePath));
    } else if (entry.isFile()) {
      files.push(relative(root, absolutePath));
    }
  }
  return files.sort();
};

const sourceAssetPaths = await listFiles(source);
if (JSON.stringify(sourceAssetPaths) !== JSON.stringify(publicSkillAssetPaths)) {
  const approved = new Set(publicSkillAssetPaths);
  const actual = new Set(sourceAssetPaths);
  const unexpected = sourceAssetPaths.filter((path) => !approved.has(path));
  const missing = publicSkillAssetPaths.filter((path) => !actual.has(path));
  throw new Error(
    `Public Skill asset contract changed. Review the npm boundary before building. ` +
      `Unexpected: ${unexpected.join(', ') || 'none'}. Missing: ${missing.join(', ') || 'none'}.`,
  );
}

await rm(destination, { recursive: true, force: true });
for (const assetPath of publicSkillAssetPaths) {
  const destinationPath = join(destination, assetPath);
  await mkdir(dirname(destinationPath), { recursive: true });
  await cp(join(source, assetPath), destinationPath);
}
