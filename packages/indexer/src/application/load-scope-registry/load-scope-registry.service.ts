import { join } from 'node:path';

import {
  SKOPOS_SCOPE_KINDS,
  type SkoposScopeRegistry,
} from '@skopos/model';
import { z } from 'zod';
import YAML from 'yaml';

import { readTextFile } from '../../adapters/workspace-filesystem.adapter.js';

export const SKOPOS_SCOPE_REGISTRY_PATH = 'tools/skopos/scopes.yaml';

const projectPathSchema = z
  .string()
  .min(1)
  .refine((value) => isWorkspaceRelativePath(value), {
    message: 'Scope paths must be normalized paths inside the workspace.',
  });

const scopeIdSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, {
  message: 'Scope ids must use lowercase kebab-case.',
});

const declaredScopeSchema = z
  .object({
    id: scopeIdSchema,
    title: z.string().min(1),
    kind: z.enum(SKOPOS_SCOPE_KINDS),
    path: projectPathSchema,
    memoryRoot: projectPathSchema,
    codeRoots: z.array(projectPathSchema).min(1),
    parent: scopeIdSchema.nullable(),
    profile: z.string().regex(/^[a-z0-9][a-z0-9.-]*$/),
    dependsOn: z.array(scopeIdSchema),
    owners: z.array(z.string().min(1)).min(1),
    aliases: z.array(z.string().min(1)),
  })
  .strict();

const scopeRegistrySchema: z.ZodType<SkoposScopeRegistry> = z
  .object({
    schemaVersion: z.literal(1),
    scopes: z.array(declaredScopeSchema).min(1),
  })
  .strict();

export interface LoadSkoposScopeRegistryOptions {
  cwd: string;
  sourcePath?: string;
}

export const loadSkoposScopeRegistry = async ({
  cwd,
  sourcePath = SKOPOS_SCOPE_REGISTRY_PATH,
}: LoadSkoposScopeRegistryOptions): Promise<SkoposScopeRegistry | null> => {
  const contents = await readTextFile(join(cwd, sourcePath));
  if (contents === null) return null;

  const registry = scopeRegistrySchema.parse(YAML.parse(contents));
  validateScopeRegistry(registry, sourcePath);
  return registry;
};

const validateScopeRegistry = (
  registry: SkoposScopeRegistry,
  sourcePath: string,
): void => {
  const ids = new Set<string>();
  const resolvableNames = new Map<string, string>();
  const memoryRootOwners = new Map<string, string>();

  for (const scope of registry.scopes) {
    assertUniqueValue(ids, scope.id, 'scope id', sourcePath);
    registerResolvableName(resolvableNames, scope.id, scope.id, sourcePath);
    for (const alias of scope.aliases) {
      registerResolvableName(resolvableNames, alias, scope.id, sourcePath);
    }
    const normalizedMemoryRoot = normalizeProjectPath(scope.memoryRoot);
    const memoryRootOwner = memoryRootOwners.get(normalizedMemoryRoot);
    if (memoryRootOwner) {
      throw new Error(
        `Scopes "${memoryRootOwner}" and "${scope.id}" in ${sourcePath} declare the same memoryRoot "${normalizedMemoryRoot}".`,
      );
    }
    memoryRootOwners.set(normalizedMemoryRoot, scope.id);

    if (!scope.codeRoots.includes(scope.path)) {
      throw new Error(
        `Scope "${scope.id}" in ${sourcePath} must include its primary path "${scope.path}" in codeRoots.`,
      );
    }
    assertUniqueStrings(scope.codeRoots, `code root for scope "${scope.id}"`, sourcePath);
    assertUniqueStrings(scope.dependsOn, `dependency for scope "${scope.id}"`, sourcePath);
    assertUniqueStrings(scope.owners, `owner for scope "${scope.id}"`, sourcePath);
    assertUniqueStrings(scope.aliases, `alias for scope "${scope.id}"`, sourcePath);
  }

  const workspaceScopes = registry.scopes.filter((scope) => scope.kind === 'workspace');
  if (workspaceScopes.length !== 1) {
    throw new Error(
      `${sourcePath} must declare exactly one workspace Scope; found ${workspaceScopes.length}.`,
    );
  }

  for (const scope of registry.scopes) {
    if (scope.kind === 'workspace' && scope.parent !== null) {
      throw new Error(`Workspace Scope "${scope.id}" in ${sourcePath} must have parent: null.`);
    }
    if (scope.kind !== 'workspace' && scope.parent === null) {
      throw new Error(
        `${scope.kind[0]!.toUpperCase()}${scope.kind.slice(1)} Scope "${scope.id}" in ${sourcePath} must declare a parent.`,
      );
    }
    if (scope.parent !== null && !ids.has(scope.parent)) {
      throw new Error(
        `Scope "${scope.id}" in ${sourcePath} references missing parent "${scope.parent}".`,
      );
    }
    if (scope.parent === scope.id) {
      throw new Error(`Scope "${scope.id}" in ${sourcePath} cannot parent itself.`);
    }
    for (const dependencyId of scope.dependsOn) {
      if (!ids.has(dependencyId)) {
        throw new Error(
          `Scope "${scope.id}" in ${sourcePath} references missing dependency "${dependencyId}".`,
        );
      }
      if (dependencyId === scope.id) {
        throw new Error(`Scope "${scope.id}" in ${sourcePath} cannot depend on itself.`);
      }
    }
  }

  assertAcyclicParents(registry, sourcePath);
};

const assertAcyclicParents = (
  registry: SkoposScopeRegistry,
  sourcePath: string,
): void => {
  const scopeById = new Map(registry.scopes.map((scope) => [scope.id, scope] as const));

  for (const scope of registry.scopes) {
    const visited = new Set<string>();
    let current = scope;
    while (current.parent !== null) {
      if (visited.has(current.id)) {
        throw new Error(`Scope parent cycle detected at "${current.id}" in ${sourcePath}.`);
      }
      visited.add(current.id);
      const parent = scopeById.get(current.parent);
      if (!parent) break;
      current = parent;
    }
  }
};

const registerResolvableName = (
  names: Map<string, string>,
  name: string,
  scopeId: string,
  sourcePath: string,
): void => {
  const normalized = name.toLowerCase();
  const owner = names.get(normalized);
  if (owner && owner !== scopeId) {
    throw new Error(
      `Scope name or alias "${name}" in ${sourcePath} is ambiguous between "${owner}" and "${scopeId}".`,
    );
  }
  names.set(normalized, scopeId);
};

const assertUniqueValue = (
  values: Set<string>,
  value: string,
  label: string,
  sourcePath: string,
): void => {
  if (values.has(value)) {
    throw new Error(`Duplicate ${label} "${value}" in ${sourcePath}.`);
  }
  values.add(value);
};

const assertUniqueStrings = (
  values: string[],
  label: string,
  sourcePath: string,
): void => {
  const unique = new Set<string>();
  for (const value of values) {
    assertUniqueValue(unique, value, label, sourcePath);
  }
};

const isWorkspaceRelativePath = (value: string): boolean => {
  const normalized = value.replaceAll('\\', '/');
  return (
    normalized === '.' ||
    (!normalized.startsWith('/') &&
      !/^[a-zA-Z]:/.test(normalized) &&
      normalized.split('/').every((segment) => segment !== '..' && segment.length > 0))
  );
};

const normalizeProjectPath = (value: string): string =>
  value.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+$/, '') || '.';
