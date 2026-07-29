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
  const projectScopes = scopesLite.scopes.filter((scope) => scope.kind !== 'workspace');
  const workspaceScope = scopesLite.scopes.find((scope) => scope.kind === 'workspace');
  const scopesById = new Map(scopesLite.scopes.map((scope) => [scope.id, scope]));

  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: workspaceScope?.title ?? 'workspace',
    state: 'active',
    path: '.',
    summary: 'Workspace root for declared cross-Scope relationships.',
  });

  const scopeByResolvableName = new Map(
    projectScopes.flatMap((scope) =>
      [scope.id, ...scope.aliases].map((name) => [name, scope] as const),
    ),
  );

  for (const scope of projectScopes) {
    const nodeId = `scope:${scope.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'scope',
      label: scope.title,
      state: 'active',
      path: scope.path,
      summary: scope.summary,
      metadata: {
        scopeKind: scope.kind,
      },
    });
    const parentNodeId =
      scope.parent &&
      scope.parent !== workspaceScope?.id &&
      scopesById.get(scope.parent)?.kind !== 'workspace'
        ? `scope:${scope.parent}`
        : workspaceNodeId;
    addEdge(edges, {
      id: `${parentNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: parentNodeId,
      to: nodeId,
      state: 'active',
    });
  }

  for (const scope of projectScopes) {
    const packageJson = await readJsonFile<Record<string, unknown>>(
      join(workspaceRoot, scope.path, 'package.json'),
    );

    const dependencyIds = new Set(scope.dependsOn ?? []);
    if (packageJson) {
      for (const dependencyName of collectDependencyNames(packageJson)) {
        const dependencyScope = scopeByResolvableName.get(dependencyName);
        if (dependencyScope) dependencyIds.add(dependencyScope.id);
      }
    }

    for (const dependencyId of dependencyIds) {
      const dependencyScope = scopesById.get(dependencyId);
      if (!dependencyScope || dependencyScope.id === scope.id) {
        continue;
      }
      const dependencyNodeId =
        dependencyScope.kind === 'workspace'
          ? workspaceNodeId
          : `scope:${dependencyScope.id}`;

      addEdge(edges, {
        id: `scope:${scope.id}->${dependencyNodeId}:depends-on`,
        kind: 'depends-on',
        from: `scope:${scope.id}`,
        to: dependencyNodeId,
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
    summary:
      'Typed Scope-relations graph for declared hierarchy, dependencies, and package-manifest enrichment.',
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
