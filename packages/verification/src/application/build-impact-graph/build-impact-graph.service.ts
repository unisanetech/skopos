import type {
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposImpactReport,
} from '@skopos/model';

export interface BuildSkoposImpactGraphOptions {
  workspaceRoot: string;
  impact: SkoposImpactReport;
}

export const buildSkoposImpactGraph = ({
  workspaceRoot,
  impact,
}: BuildSkoposImpactGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();
  const workspaceNodeId = 'workspace';

  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: 'workspace',
    state: 'active',
    path: '.',
    summary: 'Workspace root for the current impact analysis.',
  });

  for (const scope of impact.affectedScopes) {
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

  for (const changed of impact.changed) {
    const nodeId = `changed:${changed.path}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'changed-path',
      label: changed.path,
      state: 'changed',
      path: changed.path,
      summary: changed.category,
      metadata: {
        category: changed.category,
      },
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: workspaceNodeId,
      to: nodeId,
      state: 'changed',
    });

    for (const scopeId of changed.affectedScopeIds) {
      addEdge(edges, {
        id: `${nodeId}->scope:${scopeId}:touches`,
        kind: 'touches',
        from: nodeId,
        to: `scope:${scopeId}`,
        state: 'changed',
      });
    }
  }

  for (const action of impact.requiredActions) {
    const nodeId = `action:${action.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'action',
      label: action.id,
      state: 'required',
      path: action.sourcePath,
      summary: action.reason,
      metadata: {
        category: action.category,
        safety: action.safety,
      },
    });

    for (const matchedPath of action.matchedPaths) {
      addEdge(edges, {
        id: `changed:${matchedPath}->${nodeId}:requires`,
        kind: 'requires',
        from: `changed:${matchedPath}`,
        to: nodeId,
        state: 'required',
      });
    }
  }

  return {
    schemaVersion: 1,
    id: 'graph-impact',
    type: 'graph',
    status: 'generated',
    authority: 'generated',
    summary: 'Typed impact graph for the latest changed surfaces and required Actions.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    graphKind: 'impact',
    focusId: workspaceNodeId,
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
};

const addNode = (nodes: Map<string, SkoposGraphNode>, node: SkoposGraphNode): void => {
  nodes.set(node.id, node);
};

const addEdge = (edges: Map<string, SkoposGraphEdge>, edge: SkoposGraphEdge): void => {
  edges.set(edge.id, edge);
};
