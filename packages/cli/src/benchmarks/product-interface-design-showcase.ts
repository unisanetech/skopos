import { spawn } from 'node:child_process';
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { evaluateSkoposSkillFixturesRuntime } from '@skopos/runtime';
import { chromium } from 'playwright';

import {
  buildShowcaseWorkerPrompt,
  renderShowcaseGallery,
  selectFreshShowcaseScenarios,
  type ProductInterfaceShowcaseCaseResult,
  type ProductInterfaceShowcaseScenario,
} from './product-interface-design-showcase-support.js';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));
const packPath = join(skoposRoot, 'skill-packs/ui/product-interface-design/pack.json');
const packRoot = join(skoposRoot, 'skill-packs/ui/product-interface-design');
const bindingPath = join(skoposRoot, 'tools/skopos/skills/ui.product-interface-design.json');
const scenariosPath = join(skoposRoot, 'packages/cli/src/benchmarks/product-interface-design-showcase.scenarios.json');
const templateRoot = join(skoposRoot, 'packages/cli/src/benchmarks/fixtures/product-interface-design-showcase');
const modelId = process.env.SKOPOS_SHOWCASE_MODEL ?? 'gpt-5.6-sol';
const reasoningEffort = process.env.SKOPOS_SHOWCASE_REASONING ?? 'medium';
const codexPath = process.env.SKOPOS_CODEX_PATH ?? '/Applications/ChatGPT.app/Contents/Resources/codex';
const sanitizedPath = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
const evidenceBase = join(skoposRoot, '.skopos/evaluations');
const args = process.argv.slice(2);
const execute = args.includes('--execute');
const authorized = args.includes('--authorized');
const allowRepeat = args.includes('--allow-repeat');
const count = Number(args.find((value) => value.startsWith('--count='))?.slice('--count='.length) ?? 3);
const requestedScenarioIds = args.filter((value) => value.startsWith('--scenario=')).map((value) => value.slice('--scenario='.length));
const recaptureRunId = args.find((value) => value.startsWith('--recapture='))?.slice('--recapture='.length);
const runId = recaptureRunId ?? args.find((value) => value.startsWith('--run-id='))?.slice('--run-id='.length) ??
  `product-interface-design-showcase-${new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15)}`;
const isolatedRoot = join(tmpdir(), `skopos-${runId}`);
const evidenceRoot = join(evidenceBase, runId);

type CommandRecord = {
  scenarioId: string;
  exitCode: number | null;
  durationMs: number;
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  toolCalls: number;
  tracePath: string;
};

type ShowcaseReport = {
  schemaVersion: 1;
  type: 'product-interface-design-showcase';
  purpose: 'fresh-candidate-quality-diagnostic';
  status: 'planned' | 'complete' | 'failed';
  runId: string;
  generatedAt: string;
  authorization: 'not-required' | 'explicit-user-authorization';
  packId: string;
  packVersion: string;
  packDigest: string;
  bindingDigest: string;
  modelId: string;
  reasoningEffort: string;
  scenarioBankPath: string;
  scenarioIds: string[];
  repeatPolicy: 'fresh-only' | 'explicit-repeat-allowed';
  commands: CommandRecord[];
  results: ProductInterfaceShowcaseCaseResult[];
  galleryPath?: string;
  recapturedAt?: string;
  note: string;
  failure?: string;
};

const commands: CommandRecord[] = [];

const main = async (): Promise<void> => {
  if (recaptureRunId) {
    await recaptureExistingRun();
    return;
  }
  if (execute && !authorized) throw new Error('--execute requires --authorized because this workflow makes paid model calls.');
  await Promise.all([stat(codexPath), stat(templateRoot), stat(scenariosPath), stat(packPath), stat(bindingPath)]);
  const [pack, binding, scenarioBank, fixtureEvaluation] = await Promise.all([
    readJson<{ packId: string; version: string; modules: Array<{ id: string; title: string; path: string }> }>(packPath),
    readJson<{ bindingId: string; acceptance: { identity: Record<string, string> } }>(bindingPath),
    readJson<{ schemaVersion: number; scenarios: ProductInterfaceShowcaseScenario[] }>(scenariosPath),
    evaluateSkoposSkillFixturesRuntime({ cwd: skoposRoot, pack: 'ui.product-interface-design', binding: 'skopos.ui.product-interface-design', dryRun: true }),
  ]);
  if (scenarioBank.schemaVersion !== 1 || scenarioBank.scenarios.length === 0) throw new Error('Showcase scenario bank is empty or unsupported.');
  for (const [field, observed] of Object.entries(fixtureEvaluation.artifact.identity)) {
    if (binding.acceptance.identity[field] !== observed) throw new Error(`Accepted Product Interface Design identity is stale at ${field}.`);
  }
  if (fixtureEvaluation.artifact.failed > 0) throw new Error('Product Interface Design deterministic fixtures must pass before a showcase.');

  const packDigest = binding.acceptance.identity.packSourceDigest ?? 'unknown';
  const bindingDigest = binding.acceptance.identity.bindingSourceDigest ?? 'unknown';
  const usedScenarioIds = await collectUsedScenarioIds(packDigest);
  const scenarios = selectFreshShowcaseScenarios({
    scenarios: scenarioBank.scenarios,
    usedScenarioIds,
    count,
    requestedScenarioIds,
    allowRepeat,
  });
  const reportBase = {
    schemaVersion: 1 as const,
    type: 'product-interface-design-showcase' as const,
    purpose: 'fresh-candidate-quality-diagnostic' as const,
    runId,
    generatedAt: new Date().toISOString(),
    authorization: execute ? 'explicit-user-authorization' as const : 'not-required' as const,
    packId: pack.packId,
    packVersion: pack.version,
    packDigest,
    bindingDigest,
    modelId,
    reasoningEffort,
    scenarioBankPath: relative(skoposRoot, scenariosPath),
    scenarioIds: scenarios.map(({ id }) => id),
    repeatPolicy: allowRepeat ? 'explicit-repeat-allowed' as const : 'fresh-only' as const,
    commands,
    note: 'Candidate-only rendered showcase for qualitative inspection. It is not paired efficacy, human adjudication, or release-promotion Evidence.',
  };
  if (!execute) {
    const report: ShowcaseReport = { ...reportBase, status: 'planned', results: [] };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  await Promise.all([mkdir(isolatedRoot, { recursive: true }), mkdir(evidenceRoot, { recursive: true })]);
  const results: ProductInterfaceShowcaseCaseResult[] = [];
  for (const scenario of scenarios) {
    const moduleById = new Map(pack.modules.map((module) => [module.id, module]));
    const guidance = await Promise.all(scenario.moduleIds.map(async (moduleId) => {
      const module = moduleById.get(moduleId);
      if (!module) throw new Error(`Unknown showcase module ${moduleId}.`);
      return { title: module.title, summary: (await readFile(join(packRoot, module.path), 'utf8')).trim() };
    }));
    results.push(await runScenario(scenario, guidance));
  }
  const galleryPath = join(evidenceRoot, 'gallery.html');
  await writeFile(galleryPath, renderShowcaseGallery({
    runId,
    packVersion: pack.version,
    results,
  }));
  const report: ShowcaseReport = {
    ...reportBase,
    status: 'complete',
    commands,
    results,
    galleryPath: relative(evidenceRoot, galleryPath),
  };
  await writeFile(join(evidenceRoot, 'showcase-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
};

const recaptureExistingRun = async (): Promise<void> => {
  const reportPath = join(evidenceRoot, 'showcase-report.json');
  const report = await readJson<ShowcaseReport>(reportPath);
  if (report.status !== 'complete' || report.results.length === 0) {
    throw new Error(`Showcase ${runId} is not a completed run that can be recaptured.`);
  }
  for (const result of report.results) {
    const firstSourcePath = result.sourcePaths[0];
    if (!firstSourcePath) throw new Error(`Showcase ${runId} has no preserved source for ${result.scenario.id}.`);
    const caseRoot = resolve(evidenceRoot, dirname(firstSourcePath));
    if (caseRoot !== evidenceRoot && !caseRoot.startsWith(`${evidenceRoot}${sep}`)) {
      throw new Error(`Showcase ${runId} contains a source path outside its Evidence root.`);
    }
    result.checks = await captureRenderedArtifacts(caseRoot, caseRoot);
  }
  report.recapturedAt = new Date().toISOString();
  report.galleryPath = 'gallery.html';
  await writeFile(join(evidenceRoot, 'gallery.html'), renderShowcaseGallery({
    runId: report.runId,
    packVersion: report.packVersion,
    results: report.results,
  }));
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
};

const runScenario = async (
  scenario: ProductInterfaceShowcaseScenario,
  guidance: Array<{ title: string; summary: string }>,
): Promise<ProductInterfaceShowcaseCaseResult> => {
  const workspaceRoot = join(isolatedRoot, scenario.id);
  const caseRoot = join(evidenceRoot, 'cases', scenario.id);
  await Promise.all([cp(templateRoot, workspaceRoot, { recursive: true, errorOnExist: true }), mkdir(caseRoot, { recursive: true })]);
  const schemaPath = join(caseRoot, 'worker-schema.json');
  const finalOutputPath = join(caseRoot, 'final.json');
  const tracePath = join(caseRoot, 'events.jsonl');
  await writeFile(schemaPath, `${JSON.stringify(workerSchema, null, 2)}\n`);
  await writeFile(join(caseRoot, 'scenario.json'), `${JSON.stringify(scenario, null, 2)}\n`);
  const prompt = buildShowcaseWorkerPrompt({ scenario, guidance });
  const commandArgs = [
    'exec', '--ephemeral', '--json', '--skip-git-repo-check',
    '--disable', 'plugins', '--disable', 'apps', '--disable', 'multi_agent',
    '--disable', 'browser_use', '--disable', 'in_app_browser', '--disable', 'workspace_dependencies',
    '--model', modelId,
    '-c', `model_reasoning_effort="${reasoningEffort}"`,
    '--sandbox', 'workspace-write', '--cd', workspaceRoot,
    '--output-schema', schemaPath, '--output-last-message', finalOutputPath,
    prompt,
  ];
  const command = await runCodex(scenario.id, commandArgs, workspaceRoot, tracePath);
  if (command.exitCode !== 0) throw new Error(`Showcase worker failed for ${scenario.id}. Inspect ${tracePath}.`);
  const output = await readJson<{ summary: string }>(finalOutputPath);
  await validateGeneratedSource(workspaceRoot);
  const checks = await captureRenderedArtifacts(workspaceRoot, caseRoot);
  const sourcePaths = await Promise.all(['index.html', 'styles.css', 'src.js'].map(async (name) => {
    const destination = join(caseRoot, name);
    await cp(join(workspaceRoot, name), destination, { errorOnExist: true });
    return relative(evidenceRoot, destination);
  }));
  return {
    scenario,
    summary: output.summary,
    sourcePaths,
    desktopScreenshotPath: relative(evidenceRoot, join(caseRoot, 'desktop.png')),
    mobileScreenshotPath: relative(evidenceRoot, join(caseRoot, 'mobile.png')),
    checks,
  };
};

const runCodex = async (scenarioId: string, commandArgs: string[], cwd: string, tracePath: string): Promise<CommandRecord> => {
  const startedAt = Date.now();
  const output = await new Promise<{ exitCode: number | null; stdout: string; stderr: string }>((done) => {
    const child = spawn(codexPath, commandArgs, {
      cwd,
      env: {
        ...Object.fromEntries(Object.entries(process.env).filter(([key, value]) => key !== 'NODE_PATH' && key !== 'PATH' && value !== undefined)),
        PATH: sanitizedPath,
      } as NodeJS.ProcessEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += String(chunk); });
    child.stderr.on('data', (chunk) => { stderr += String(chunk); });
    child.on('close', (exitCode) => done({ exitCode, stdout, stderr }));
    child.on('error', (error) => done({ exitCode: null, stdout, stderr: `${stderr}\n${error.message}` }));
  });
  await writeFile(tracePath, output.stdout);
  if (output.stderr) await writeFile(`${tracePath}.stderr.txt`, output.stderr);
  const telemetry = parseTelemetry(output.stdout);
  const command = { scenarioId, exitCode: output.exitCode, durationMs: Date.now() - startedAt, ...telemetry, tracePath };
  commands.push(command);
  await writeFile(join(evidenceRoot, 'command-ledger.json'), `${JSON.stringify(commands, null, 2)}\n`);
  return command;
};

const validateGeneratedSource = async (workspaceRoot: string): Promise<void> => {
  for (const name of ['index.html', 'styles.css', 'src.js']) {
    const [baseline, generated] = await Promise.all([
      readFile(join(templateRoot, name), 'utf8'),
      readFile(join(workspaceRoot, name), 'utf8'),
    ]);
    if (baseline === generated) throw new Error(`Showcase worker did not replace minimal scaffold file ${name}.`);
    if (/(?:src|href)\s*=\s*["']https?:|url\(\s*["']?https?:/i.test(generated)) {
      throw new Error(`Showcase source ${name} references an external URL.`);
    }
  }
};

const captureRenderedArtifacts = async (workspaceRoot: string, caseRoot: string): Promise<ProductInterfaceShowcaseCaseResult['checks']> => {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
      const assetPath = resolve(workspaceRoot, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (assetPath !== workspaceRoot && !assetPath.startsWith(`${workspaceRoot}${sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const content = await readFile(assetPath);
      const contentType = new Map([
        ['.html', 'text/html; charset=utf-8'],
        ['.css', 'text/css; charset=utf-8'],
        ['.js', 'text/javascript; charset=utf-8'],
        ['.json', 'application/json; charset=utf-8'],
        ['.svg', 'image/svg+xml'],
        ['.png', 'image/png'],
      ]).get(extname(assetPath)) ?? 'application/octet-stream';
      response.writeHead(200, { 'content-type': contentType, 'cache-control': 'no-store' }).end(content);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise<void>((resolveListening, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolveListening());
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Showcase capture server did not bind a local port.');
  const browser = await chromium.launch({ headless: true });
  const pageErrors: string[] = [];
  const overflow: Record<'desktop' | 'mobile', boolean> = { desktop: false, mobile: false };
  try {
    for (const viewport of [{ name: 'desktop' as const, width: 1440, height: 1000 }, { name: 'mobile' as const, width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      page.on('pageerror', (error) => pageErrors.push(`${viewport.name}: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') pageErrors.push(`${viewport.name} console: ${message.text()}`);
      });
      page.on('requestfailed', (request) => {
        pageErrors.push(`${viewport.name} request: ${request.url()} (${request.failure()?.errorText ?? 'failed'})`);
      });
      await page.goto(`http://127.0.0.1:${address.port}/index.html`, { waitUntil: 'networkidle' });
      overflow[viewport.name] = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      await page.screenshot({ path: join(caseRoot, `${viewport.name}.png`), fullPage: true });
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise<void>((resolveClosed, reject) => server.close((error) => error ? reject(error) : resolveClosed()));
  }
  return {
    desktopHorizontalOverflow: overflow.desktop,
    mobileHorizontalOverflow: overflow.mobile,
    pageErrors,
  };
};

const collectUsedScenarioIds = async (packDigest: string): Promise<Set<string>> => {
  const used = new Set<string>();
  const entries = await readdir(evidenceBase, { withFileTypes: true }).catch(() => []);
  await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
    const report = await readJson<Partial<ShowcaseReport>>(join(evidenceBase, entry.name, 'showcase-report.json')).catch(() => undefined);
    if (report?.status === 'complete' && report.packDigest === packDigest) {
      for (const scenarioId of report.scenarioIds ?? []) used.add(scenarioId);
    }
  }));
  return used;
};

const readJson = async <T>(path: string): Promise<T> => JSON.parse(await readFile(path, 'utf8')) as T;

const workerSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['summary'],
  properties: { summary: { type: 'string' } },
};

const parseTelemetry = (jsonl: string): Omit<CommandRecord, 'scenarioId' | 'exitCode' | 'durationMs' | 'tracePath'> => {
  let inputTokens = 0;
  let cachedInputTokens = 0;
  let outputTokens = 0;
  let toolCalls = 0;
  for (const line of jsonl.split('\n').filter(Boolean)) {
    try {
      const event = JSON.parse(line) as Record<string, unknown>;
      const usage = findUsage(event);
      if (usage) {
        inputTokens = Math.max(inputTokens, usage.input);
        cachedInputTokens = Math.max(cachedInputTokens, usage.cached);
        outputTokens = Math.max(outputTokens, usage.output);
      }
      if (event.type === 'item.completed') {
        const item = event.item as Record<string, unknown> | undefined;
        if (item?.type === 'command_execution' || item?.type === 'mcp_tool_call') toolCalls += 1;
      }
    } catch { /* raw trace remains available for diagnosis */ }
  }
  return { inputTokens, cachedInputTokens, outputTokens, toolCalls };
};

const findUsage = (value: unknown): { input: number; cached: number; output: number } | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  const input = record.input_tokens ?? record.inputTokens;
  const output = record.output_tokens ?? record.outputTokens;
  const cached = record.cached_input_tokens ?? record.cachedInputTokens ?? 0;
  if (typeof input === 'number' && typeof output === 'number') return { input, cached: typeof cached === 'number' ? cached : 0, output };
  for (const child of Object.values(record)) {
    const found = findUsage(child);
    if (found) return found;
  }
  return undefined;
};

main().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (execute) {
    await mkdir(evidenceRoot, { recursive: true });
    const failure: Partial<ShowcaseReport> = {
      schemaVersion: 1,
      type: 'product-interface-design-showcase',
      purpose: 'fresh-candidate-quality-diagnostic',
      status: 'failed',
      runId,
      generatedAt: new Date().toISOString(),
      authorization: 'explicit-user-authorization',
      modelId,
      reasoningEffort,
      commands,
      results: [],
      failure: message,
    };
    await writeFile(join(evidenceRoot, 'showcase-report.json'), `${JSON.stringify(failure, null, 2)}\n`);
  }
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
