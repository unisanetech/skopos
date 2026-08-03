import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import type {
  SkoposActionCategory,
  SkoposActionManifest,
  SkoposActionPhase,
  SkoposActionSafety,
  SkoposCapabilityCandidate,
  SkoposGuardManifest,
} from '@skopos/model';

export const discoverSkoposCapabilityCandidates = async ({
  cwd,
}: {
  cwd: string;
}): Promise<SkoposCapabilityCandidate[]> => {
  const workspaceRoot = resolve(cwd);
  const candidates: SkoposCapabilityCandidate[] = [];
  const seenCommands = new Set<string>();
  const config = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));

  for (const [name, command] of Object.entries(config?.commands ?? {})) {
    if (!command || seenCommands.has(command)) continue;
    seenCommands.add(command);
    candidates.push(
      buildCandidate({
        source: 'configured-command',
        sourcePath: 'skopos.config.yaml',
        name,
        command,
      }),
    );
  }

  const packageManifest = await readPackageManifest(join(workspaceRoot, 'package.json'));
  for (const [name, script] of Object.entries(packageManifest.scripts)) {
    const command = packageScriptCommand(packageManifest.packageManager, name);
    if (seenCommands.has(command) || seenCommands.has(script)) continue;
    seenCommands.add(command);
    candidates.push(
      buildCandidate({
        source: 'package-script',
        sourcePath: 'package.json',
        name,
        command,
      }),
    );
  }

  return candidates.sort((left, right) => left.id.localeCompare(right.id));
};

interface PackageManifestCapabilities {
  packageManager?: string;
  scripts: Record<string, string>;
}

const readPackageManifest = async (
  path: string,
): Promise<PackageManifestCapabilities> => {
  try {
    const parsed = JSON.parse(await readFile(path, 'utf8')) as {
      packageManager?: unknown;
      scripts?: Record<string, unknown>;
    };
    return {
      packageManager:
        typeof parsed.packageManager === 'string'
          ? parsed.packageManager
          : undefined,
      scripts: Object.fromEntries(
        Object.entries(parsed.scripts ?? {}).filter(
          (entry): entry is [string, string] =>
            typeof entry[1] === 'string' && entry[1].trim().length > 0,
        ),
      ),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { scripts: {} };
    }
    throw error;
  }
};

const packageScriptCommand = (
  packageManager: string | undefined,
  name: string,
): string => {
  const manager = packageManager?.split('@')[0];
  if (manager === 'pnpm') return `pnpm ${name}`;
  if (manager === 'yarn') return `yarn ${name}`;
  if (manager === 'bun') return `bun run ${name}`;
  return `npm run ${name}`;
};

const buildCandidate = ({
  source,
  sourcePath,
  name,
  command,
}: Pick<SkoposCapabilityCandidate, 'source' | 'sourcePath' | 'name' | 'command'>): SkoposCapabilityCandidate => {
  const normalizedName = normalizeCapabilityName(name);
  const suggestion = capabilitySuggestion(normalizedName, command);
  const id = `CAP-${createHash('sha256')
    .update(`${source}\0${sourcePath}\0${name}\0${command}`)
    .digest('hex')
    .slice(0, 10)}`;
  return {
    id,
    source,
    sourcePath,
    name,
    command,
    cwd: '.',
    rationale: suggestion
      ? `The project declares ${name} as an executable capability; Skopos can integrate it only after review of the exact Action and Guard declarations.`
      : `The project declares ${name}, but Skopos has no safe canonical Action/Guard suggestion for it. Review it manually before integration.`,
    ...(suggestion
      ? {
          suggestedAction: actionSuggestion(suggestion, command),
          suggestedGuard: guardSuggestion(suggestion),
        }
      : {}),
  };
};

interface CapabilitySuggestion {
  id: string;
  title: string;
  description: string;
  category: SkoposActionCategory;
  safety: SkoposActionSafety;
  phases: SkoposActionPhase[];
}

const capabilitySuggestion = (
  name: string,
  command: string,
): CapabilitySuggestion | undefined => {
  const normalized = `${name} ${command}`.toLowerCase();
  if (/(^|[ :_-])(typecheck|check-types|type-check)([ :_-]|$)/.test(normalized)) {
    return suggestion('quality.typecheck', 'Typecheck affected code', 'Run the project-owned type proof.', 'quality-check', 'read-only', ['closure']);
  }
  if (/(^|[ :_-])(test|tests)([ :_-]|$)/.test(normalized)) {
    return suggestion('quality.test', 'Test affected behavior', 'Run the project-owned behavior proof.', 'quality-check', 'read-only', ['stabilization', 'closure']);
  }
  if (/(^|[ :_-])lint([ :_-]|$)/.test(normalized)) {
    return suggestion('quality.lint', 'Lint affected code', 'Run the project-owned lint proof.', 'quality-check', 'read-only', ['closure']);
  }
  if (/(^|[ :_-])build([ :_-]|$)/.test(normalized)) {
    return suggestion('quality.build', 'Build affected project', 'Run the project-owned build proof.', 'quality-check', 'mutating', ['stabilization', 'closure']);
  }
  return undefined;
};

const suggestion = (
  id: string,
  title: string,
  description: string,
  category: SkoposActionCategory,
  safety: SkoposActionSafety,
  phases: SkoposActionPhase[],
): CapabilitySuggestion => ({ id, title, description, category, safety, phases });

const actionSuggestion = (
  capability: CapabilitySuggestion,
  command: string,
): SkoposActionManifest => ({
  id: capability.id,
  title: capability.title,
  description: capability.description,
  category: capability.category,
  scope: ['workspace'],
  command,
  cwd: '.',
  inputs: ['.'],
  outputs: [],
  affects: capability.safety === 'read-only' ? [] : ['.'],
  capabilities: {
    process: 'required',
    network: 'none',
    browser: 'none',
    tools: [],
    secrets: [],
    services: [],
  },
  effects: {
    workspace: capability.safety === 'read-only' ? 'none' : 'declared',
    artifacts: 'none',
    external: 'none',
  },
  concurrency: capability.safety === 'read-only' ? 'shared' : 'exclusive',
  safety: capability.safety,
  requiresApproval: capability.safety !== 'read-only',
  whenToUse: `Use when a matching Guard selects ${capability.id} for Task impact.`,
  phases: capability.phases,
  risks: ['light', 'standard', 'high-impact'],
  recommendedAfter: [],
  owner: 'project',
  sourcePath: `tools/skopos/actions/${capability.id.replaceAll('.', '-')}.yaml`,
});

const guardSuggestion = (
  capability: CapabilitySuggestion,
): SkoposGuardManifest => ({
  id: capability.id,
  title: capability.title,
  description: `Select ${capability.id} from changed paths, phase, risk, and Scope.`,
  owner: 'project',
  scope: ['workspace'],
  strength: 'required',
  appliesTo: {
    paths: ['**/*'],
    phases: capability.phases,
    risks: ['light', 'standard', 'high-impact'],
  },
  requires: {
    actionIds: [capability.id],
    evidence: 'source-bound-action',
  },
  sourcePath: `tools/skopos/guards/${capability.id.replaceAll('.', '-')}.yaml`,
});

const normalizeCapabilityName = (name: string): string =>
  name.trim().toLowerCase().replaceAll('_', '-');
