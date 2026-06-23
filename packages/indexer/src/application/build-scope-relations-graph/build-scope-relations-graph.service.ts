import { join } from 'node:path';

import type {
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposScopesLiteArtifact,
} from '@skopos/model';

import { readJsonFile } from '../../adapters/workspace-filesystem.adapter.js';

export interface BuildSkoposScopeRelationsGraphOptions {
  workspaceRoot: string;
  scopesLite: SkoposScopesLiteArtifact;
}

export const buildSkoposScopeRelationsGraph = async ({
  workspaceRoot,
  scopesLite,
}: BuildSkoposScopeRelationsGraphOptions): Promise<SkoposGraphArtifact> => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();
  const workspaceNodeId = 'workspace';
  const packageScopes = scopesLite.scopes.filter((scope) => scope.kind === 'package');

  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: 'workspace',
    state: 'active',
    path: '.',
    summary: 'Workspace root for cross-scope package relationships.',
  });

  const scopeById = new Map(packageScopes.map((scope) => [scope.id, scope] as const));

  for (const scope of packageScopes) {
    const nodeId = `scope:${scope.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'scope',
      label: scope.title,
      state: 'active',
      path: scope.path,
      summary: scope.summary,
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: workspaceNodeId,
      to: nodeId,
      state: 'active',
    });
  }

  for (const scope of packageScopes) {
    const packageJson = await readJsonFile<Record<string, unknown>>(
      join(workspaceRoot, scope.path, 'package.json'),
    );
    if (!packageJson) {
      continue;
    }

    const dependencyNames = collectDependencyNames(packageJson);

    for (const dependencyName of dependencyNames) {
      if (!scopeById.has(dependencyName)) {
        continue;
      }

      addEdge(edges, {
        id: `scope:${scope.id}->scope:${dependencyName}:depends-on`,
        kind: 'depends-on',
        from: `scope:${scope.id}`,
        to: `scope:${dependencyName}`,
        state: 'active',
      });
    }
  }

  return {
    schemaVersion: 1,
    id: 'graph-scope-relations',
    type: 'graph',
    status: 'generated',
    authority: 'generated',
    summary: 'Typed scope-relations graph for package scopes and inferred internal dependencies.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    graphKind: 'scope-relations',
    focusId: workspaceNodeId,
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
};

const collectDependencyNames = (packageJson: Record<string, unknown>): string[] => {
  const names = new Set<string>();

  for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
    const value = packageJson[field];
    if (typeof value !== 'object' || value === null) {
      continue;
    }

    for (const dependencyName of Object.keys(value)) {
      names.add(dependencyName);
    }
  }

  return [...names];
};

const addNode = (nodes: Map<string, SkoposGraphNode>, node: SkoposGraphNode): void => {
  nodes.set(node.id, node);
};

const addEdge = (edges: Map<string, SkoposGraphEdge>, edge: SkoposGraphEdge): void => {
  edges.set(edge.id, edge);
};
