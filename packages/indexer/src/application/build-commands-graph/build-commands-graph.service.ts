import type {
  SkoposBootstrapArtifact,
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposScopesLiteArtifact,
  SkoposWorkflowManifest,
} from '@skopos/model';

export interface BuildSkoposCommandsGraphOptions {
  workspaceRoot: string;
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  workflows: SkoposWorkflowManifest[];
}

export const buildSkoposCommandsGraph = ({
  workspaceRoot,
  bootstrap,
  scopesLite,
  workflows,
}: BuildSkoposCommandsGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();
  const workspaceNodeId = 'workspace';
  const packageScopes = scopesLite.scopes.filter((scope) => scope.kind === 'package');

  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: bootstrap.recommendedConfig.project.name,
    state: 'active',
    path: '.',
    summary: 'Workspace root for canonical commands and operational workflows.',
  });

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

    for (const scope of packageScopes) {
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

  for (const workflow of workflows) {
    const nodeId = `workflow:${workflow.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'workflow',
      label: workflow.id,
      state: workflow.requiredForDone ? 'required' : 'recommended',
      path: workflow.sourcePath,
      summary: workflow.description,
      metadata: {
        category: workflow.category,
        safety: workflow.safety,
      },
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: workspaceNodeId,
      to: nodeId,
      state: workflow.requiredForDone ? 'required' : 'recommended',
    });

    for (const scopeId of workflow.scope) {
      if (!packageScopes.some((scope) => scope.id === scopeId)) {
        continue;
      }

      addEdge(edges, {
        id: `${nodeId}->scope:${scopeId}:targets`,
        kind: 'targets',
        from: nodeId,
        to: `scope:${scopeId}`,
        state: workflow.requiredForDone ? 'required' : 'recommended',
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
      'Typed commands graph for canonical root commands, operational workflows, and targeted package scopes.',
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
