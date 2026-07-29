import type {
  SkoposBootstrapArtifact,
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposScopeLite,
  SkoposScopesLiteArtifact,
  SkoposActionManifest,
} from '@skopos/model';

export interface BuildSkoposWorkspaceGraphOptions {
  workspaceRoot: string;
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  actions: SkoposActionManifest[];
}

export const buildSkoposWorkspaceGraph = ({
  workspaceRoot,
  bootstrap,
  scopesLite,
  actions,
}: BuildSkoposWorkspaceGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();

  const workspaceNodeId = 'workspace';
  const declaredWorkspaceScope = scopesLite.scopes.find((scope) => scope.kind === 'workspace');
  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: bootstrap.recommendedConfig.project.name,
    state: 'active',
    path: '.',
    summary:
      'Workspace root and graph focus for project structure, commands, and registered actions.',
    metadata: {
      repoMode: bootstrap.detected.repoMode,
      archetype: bootstrap.detected.archetypeSuggestion,
      packageCount: bootstrap.detected.packageCount,
      workspacePackageCount: bootstrap.detected.workspacePackageCount,
      ...(bootstrap.detected.focusSubtree ? { focusSubtree: bootstrap.detected.focusSubtree } : {}),
    },
  });

  for (const scope of scopesLite.scopes) {
    if (scope.kind === 'workspace') {
      continue;
    }
    const nodeId = scopeNodeId(scope.id);
    addNode(nodes, toScopeNode(scope));
    const parentNodeId =
      scope.parent && scope.parent !== declaredWorkspaceScope?.id
        ? scopeNodeId(scope.parent)
        : workspaceNodeId;
    addEdge(edges, {
      id: `${parentNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: parentNodeId,
      to: nodeId,
      state: 'active',
    });
  }

  for (const [commandName, command] of Object.entries(bootstrap.recommendedConfig.commands)) {
    if (!command) {
      continue;
    }

    const nodeId = commandNodeId(commandName);
    addNode(nodes, {
      id: nodeId,
      kind: 'command',
      label: commandName,
      state: 'recommended',
      summary: command,
      metadata: {
        command,
      },
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:recommends`,
      kind: 'recommends',
      from: workspaceNodeId,
      to: nodeId,
      state: 'recommended',
      label: 'canonical command',
    });
  }

  for (const action of actions) {
    const nodeId = actionNodeId(action.id);
    addNode(nodes, {
      id: nodeId,
      kind: 'action',
      label: action.id,
      state: 'recommended',
      path: action.sourcePath,
      summary: action.description,
      metadata: {
        category: action.category,
        safety: action.safety,
      },
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: workspaceNodeId,
      to: nodeId,
      state: 'recommended',
      label: 'registered Action',
    });

    for (const scopeId of action.scope) {
      const targetScopeNodeId =
        scopeId === 'workspace' || scopeId === declaredWorkspaceScope?.id
          ? workspaceNodeId
          : scopeNodeId(scopeId);
      if (!nodes.has(targetScopeNodeId)) {
        continue;
      }

      addEdge(edges, {
        id: `${nodeId}->${targetScopeNodeId}:targets`,
        kind: 'targets',
        from: nodeId,
        to: targetScopeNodeId,
        state: 'recommended',
      });
    }
  }

  return {
    schemaVersion: 1,
    id: 'graph-workspace',
    type: 'graph',
    status: 'generated',
    authority: 'generated',
    summary:
      'Typed workspace graph for scopes, commands, docs, instruction surfaces, and registered actions.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    graphKind: 'workspace',
    focusId: workspaceNodeId,
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
};

const toScopeNode = (scope: SkoposScopeLite): SkoposGraphNode => ({
  id: scopeNodeId(scope.id),
  kind: scope.kind === 'workspace' ? 'workspace' : 'scope',
  label: scope.title,
  state: 'active',
  path: scope.path,
  summary: scope.summary,
  metadata: {
    scopeKind: scope.kind,
    confidence: scope.confidence,
    aliases: scope.aliases,
    ...(scope.profile ? { profile: scope.profile } : {}),
    ...(scope.memoryRoot ? { memoryRoot: scope.memoryRoot } : {}),
    ...(scope.codeRoots ? { codeRoots: scope.codeRoots } : {}),
    ...(scope.dependsOn ? { dependsOn: scope.dependsOn } : {}),
    ...(scope.owners ? { owners: scope.owners } : {}),
  },
});

const addNode = (nodes: Map<string, SkoposGraphNode>, node: SkoposGraphNode): void => {
  nodes.set(node.id, node);
};

const addEdge = (edges: Map<string, SkoposGraphEdge>, edge: SkoposGraphEdge): void => {
  edges.set(edge.id, edge);
};

const scopeNodeId = (scopeId: string): string => `scope:${scopeId}`;
const commandNodeId = (commandName: string): string => `command:${commandName}`;
const actionNodeId = (actionId: string): string => `action:${actionId}`;
