#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_IGNORED_DIRECTORIES = new Set(['.git', '.skopos', 'node_modules']);

export const checkSemanticGuidance = async ({ cwd, configPath, targets }) => {
  const workspaceRoot = resolve(cwd);
  const config = JSON.parse(await readFile(resolve(workspaceRoot, configPath), 'utf8'));
  validateConfig(config);
  const extensions = new Set(config.includeExtensions ?? ['.md', '.mdx', '.txt']);
  const files = (
    await Promise.all(
      targets.map((target) => collectFiles(resolve(workspaceRoot, target), extensions)),
    )
  )
    .flat()
    .sort((left, right) => left.localeCompare(right));
  const violations = [];

  for (const file of files) {
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/u);
    for (const rule of config.rules) {
      const retiredPatterns = rule.retiredPatterns.map(toExpression);
      const allowedPatterns = rule.allowedContextPatterns.map(toExpression);
      lines.forEach((line, index) => {
        const retiredPattern = retiredPatterns.find((pattern) => pattern.test(line));
        if (!retiredPattern) return;
        const surroundingContext = line.replace(retiredPattern, ' ');
        if (allowedPatterns.some((pattern) => pattern.test(surroundingContext))) return;
        violations.push({
          ruleId: rule.id,
          path: relative(workspaceRoot, file),
          line: index + 1,
          text: line.trim(),
          summary: rule.description,
        });
      });
    }
  }

  return {
    schemaVersion: 1,
    status: violations.length === 0 ? 'pass' : 'fail',
    summary:
      violations.length === 0
        ? `Semantic guidance passed across ${files.length} file${files.length === 1 ? '' : 's'}.`
        : `Semantic guidance found ${violations.length} active retired-guidance violation${violations.length === 1 ? '' : 's'}.`,
    checkedFiles: files.map((file) => relative(workspaceRoot, file)),
    violations,
  };
};

const collectFiles = async (path, extensions) => {
  const metadata = await stat(path);
  if (metadata.isFile()) return extensions.has(extname(path).toLowerCase()) ? [path] : [];
  if (!metadata.isDirectory()) return [];
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter(
        (entry) =>
          !(entry.isDirectory() && DEFAULT_IGNORED_DIRECTORIES.has(entry.name)),
      )
      .map((entry) => collectFiles(resolve(path, entry.name), extensions)),
  );
  return nested.flat();
};

const validateConfig = (config) => {
  if (config?.schemaVersion !== 1 || !Array.isArray(config.rules) || config.rules.length === 0) {
    throw new Error('Semantic guidance config requires schemaVersion 1 and at least one rule.');
  }
  for (const rule of config.rules) {
    if (
      typeof rule.id !== 'string' ||
      typeof rule.description !== 'string' ||
      !Array.isArray(rule.retiredPatterns) ||
      rule.retiredPatterns.length === 0 ||
      !Array.isArray(rule.allowedContextPatterns) ||
      rule.allowedContextPatterns.length === 0
    ) {
      throw new Error(`Semantic guidance rule ${rule?.id ?? '(unknown)'} is incomplete.`);
    }
  }
};

const toExpression = (pattern) => {
  try {
    return new RegExp(pattern, 'iu');
  } catch (error) {
    throw new Error(`Invalid semantic guidance pattern ${JSON.stringify(pattern)}: ${error instanceof Error ? error.message : String(error)}`);
  }
};

const parseArgs = (args) => {
  let configPath;
  const targets = [];
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--config') {
      configPath = args[++index];
      if (!configPath) throw new Error('Missing value for --config.');
    } else if (argument.startsWith('--config=')) {
      configPath = argument.slice('--config='.length);
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown semantic guidance flag: ${argument}`);
    } else {
      targets.push(argument);
    }
  }
  if (!configPath) throw new Error('Missing --config <path>.');
  if (targets.length === 0) throw new Error('Provide at least one file or directory to check.');
  return { configPath, targets };
};

const isEntrypoint = process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isEntrypoint) {
  try {
    const parsed = parseArgs(process.argv.slice(2));
    const report = await checkSemanticGuidance({
      cwd: process.cwd(),
      configPath: parsed.configPath,
      targets: parsed.targets,
    });
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (report.status === 'fail') process.exitCode = 1;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
