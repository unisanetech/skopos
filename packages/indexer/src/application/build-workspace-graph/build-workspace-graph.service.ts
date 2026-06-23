import type {
  SkoposBootstrapArtifact,
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposScopeLite,
  SkoposScopesLiteArtifact,
  SkoposWorkflowManifest,
} from '@skopos/model';

export interface BuildSkoposWorkspaceGraphOptions {
  workspaceRoot: string;
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  workflows: SkoposWorkflowManifest[];
}

export const buildSkoposWorkspaceGraph = ({
  workspaceRoot,
  bootstrap,
  scopesLite,
  workflows,
}: BuildSkoposWorkspaceGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();

  const workspaceNodeId = 'workspace';
  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: bootstrap.recommendedConfig.project.name,
    state: 'active',
    path: '.',
    summary:
      'Workspace root and graph focus for project structure, commands, and registered workflows.',
    metadata: {
      repoMode: bootstrap.detected.repoMode,
      archetype: bootstrap.detected.archetypeSuggestion,
      packageCount: bootstrap.detected.packageCount,
      workspacePackageCount: bootstrap.detected.workspacePackageCount,
      ...(bootstrap.detected.focusSubtree ? { focusSubtree: bootstrap.detected.focusSubtree } : {}),
    },
  });

  for (const scope of scopesLite.scopes) {
    const nodeId = scopeNodeId(scope.id);
    addNode(nodes, toScopeNode(scope));
    if (scope.id !== 'workspace') {
      addEdge(edges, {
        id: `${workspaceNodeId}->${nodeId}:contains`,
        kind: 'contains',
        from: workspaceNodeId,
        to: nodeId,
        state: 'active',
      });
    }
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

  for (const workflow of workflows) {
    const nodeId = workflowNodeId(workflow.id);
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
        requiredForDone: workflow.requiredForDone,
      },
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: workspaceNodeId,
      to: nodeId,
      state: workflow.requiredForDone ? 'required' : 'recommended',
      label: 'registered workflow',
    });

    for (const scopeId of workflow.scope) {
      const targetScopeNodeId = scopeId === 'workspace' ? workspaceNodeId : scopeNodeId(scopeId);
      if (!nodes.has(targetScopeNodeId)) {
        continue;
      }

      addEdge(edges, {
        id: `${nodeId}->${targetScopeNodeId}:targets`,
        kind: 'targets',
        from: nodeId,
        to: targetScopeNodeId,
        state: workflow.requiredForDone ? 'required' : 'recommended',
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
      'Typed workspace graph for scopes, commands, docs, instruction surfaces, and registered workflows.',
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
  kind:
    scope.kind === 'docs-root'
      ? 'docs-root'
      : scope.kind === 'instruction-file'
        ? 'instruction-file'
        : scope.kind === 'workspace'
          ? 'workspace'
          : 'scope',
  label: scope.title,
  state: 'active',
  path: scope.path,
  summary: scope.summary,
  metadata: {
    scopeKind: scope.kind,
    confidence: scope.confidence,
    aliases: scope.aliases,
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
const workflowNodeId = (workflowId: string): string => `workflow:${workflowId}`;
