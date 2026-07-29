import type {
  SkoposBootstrapArtifact,
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposScopesLiteArtifact,
  SkoposActionManifest,
} from '@skopos/model';

export interface BuildSkoposCommandsGraphOptions {
  workspaceRoot: string;
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  actions: SkoposActionManifest[];
}

export const buildSkoposCommandsGraph = ({
  workspaceRoot,
  bootstrap,
  scopesLite,
  actions,
}: BuildSkoposCommandsGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();
  const workspaceNodeId = 'workspace';
  const projectScopes = scopesLite.scopes.filter((scope) => scope.kind !== 'workspace');
  const workspaceScope = scopesLite.scopes.find((scope) => scope.kind === 'workspace');
  const projectScopeIds = new Set(projectScopes.map((scope) => scope.id));

  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: bootstrap.recommendedConfig.project.name,
    state: 'active',
    path: '.',
    summary: 'Workspace root for canonical commands and operational actions.',
  });

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
  }

  for (const [commandName, command] of Object.entries(bootstrap.recommendedConfig.commands)) {
    if (!command) {
      continue;
    }

    const nodeId = `command:${commandName}`;
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

    for (const scope of projectScopes) {
      if (!commandTargetsScope(command, scope.id, scope.path, scope.aliases)) {
        continue;
      }

      addEdge(edges, {
        id: `${nodeId}->scope:${scope.id}:${validationEdgeKind(commandName)}`,
        kind: validationEdgeKind(commandName),
        from: nodeId,
        to: `scope:${scope.id}`,
        state: 'recommended',
      });
    }
  }

  for (const action of actions) {
    const nodeId = `action:${action.id}`;
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
    });

    for (const scopeId of action.scope) {
      const targetNodeId =
        scopeId === 'workspace' || scopeId === workspaceScope?.id
          ? workspaceNodeId
          : projectScopeIds.has(scopeId)
            ? `scope:${scopeId}`
            : null;
      if (!targetNodeId) {
        continue;
      }

      addEdge(edges, {
        id: `${nodeId}->${targetNodeId}:targets`,
        kind: 'targets',
        from: nodeId,
        to: targetNodeId,
        state: 'recommended',
      });
    }
  }

  return {
    schemaVersion: 1,
    id: 'graph-commands',
    type: 'graph',
    status: 'generated',
    authority: 'generated',
    summary:
      'Typed commands graph for canonical root commands, operational actions, and targeted project Scopes.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    graphKind: 'commands',
    focusId: workspaceNodeId,
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
};

const commandTargetsScope = (
  command: string,
  scopeId: string,
  scopePath: string,
  aliases: string[],
): boolean => {
  const candidates = [scopeId, scopePath, ...aliases];
  if (candidates.some((candidate) => candidate.length > 0 && command.includes(candidate))) {
    return true;
  }

  const namespacePattern = scopeId.match(/^(@[^/]+)\/.+$/);
  return namespacePattern ? command.includes(`${namespacePattern[1]}/*`) : false;
};

const validationEdgeKind = (commandName: string): 'validates' | 'targets' =>
  ['build', 'test', 'typecheck', 'lint'].includes(commandName) ? 'validates' : 'targets';

const addNode = (nodes: Map<string, SkoposGraphNode>, node: SkoposGraphNode): void => {
  nodes.set(node.id, node);
};

const addEdge = (edges: Map<string, SkoposGraphEdge>, edge: SkoposGraphEdge): void => {
  edges.set(edge.id, edge);
};
