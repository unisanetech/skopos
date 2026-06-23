import type {
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposScopesLiteArtifact,
  SkoposWorkflowManifest,
} from '@skopos/model';

export interface BuildSkoposDocsGraphOptions {
  workspaceRoot: string;
  scopesLite: SkoposScopesLiteArtifact;
  workflows: SkoposWorkflowManifest[];
}

export const buildSkoposDocsGraph = ({
  workspaceRoot,
  scopesLite,
  workflows,
}: BuildSkoposDocsGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();
  const workspaceNodeId = 'workspace';
  const docsScopes = scopesLite.scopes.filter((scope) => scope.kind === 'docs-root');
  const instructionScopes = scopesLite.scopes.filter((scope) => scope.kind === 'instruction-file');
  const relevantWorkflows = workflows.filter(isDocsWorkflow);

  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: 'workspace',
    state: 'active',
    path: '.',
    summary: 'Workspace root for documentation and instruction surfaces.',
  });

  for (const scope of [...docsScopes, ...instructionScopes]) {
    const nodeId = `scope:${scope.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: scope.kind === 'docs-root' ? 'docs-root' : 'instruction-file',
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

  for (const workflow of relevantWorkflows) {
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
        requiredForDone: workflow.requiredForDone,
      },
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: workspaceNodeId,
      to: nodeId,
      state: workflow.requiredForDone ? 'required' : 'recommended',
    });

    for (const docsScope of docsScopes) {
      if (workflowTouchesPathFamily(workflow, docsScope.path)) {
        addEdge(edges, {
          id: `${nodeId}->scope:${docsScope.id}:touches`,
          kind: 'touches',
          from: nodeId,
          to: `scope:${docsScope.id}`,
          state: workflow.requiredForDone ? 'required' : 'recommended',
        });
      }
    }

    for (const instructionScope of instructionScopes) {
      if (workflowTouchesExactPath(workflow, instructionScope.path)) {
        addEdge(edges, {
          id: `${nodeId}->scope:${instructionScope.id}:touches`,
          kind: 'touches',
          from: nodeId,
          to: `scope:${instructionScope.id}`,
          state: workflow.requiredForDone ? 'required' : 'recommended',
        });
      }
    }
  }

  const focusScope = docsScopes[0] ?? instructionScopes[0];

  return {
    schemaVersion: 1,
    id: 'graph-docs',
    type: 'graph',
    status: 'generated',
    authority: 'generated',
    summary:
      'Typed docs graph for canonical docs roots, instruction surfaces, and docs-affecting workflows.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    graphKind: 'docs',
    focusId: focusScope ? `scope:${focusScope.id}` : workspaceNodeId,
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
};

const isDocsWorkflow = (workflow: SkoposWorkflowManifest): boolean =>
  ['docs-generator', 'docs-validator', 'reference-generator', 'graph-generator'].includes(
    workflow.category,
  ) ||
  workflow.outputs.some((path) => path.startsWith('docs/')) ||
  workflow.affects.some((path) => path.startsWith('docs/'));

const workflowTouchesPathFamily = (workflow: SkoposWorkflowManifest, pathPrefix: string): boolean =>
  [...workflow.outputs, ...workflow.affects].some(
    (path) => path === pathPrefix || path.startsWith(`${pathPrefix}/`),
  );

const workflowTouchesExactPath = (workflow: SkoposWorkflowManifest, targetPath: string): boolean =>
  [...workflow.outputs, ...workflow.affects].some((path) => path === targetPath);

const addNode = (nodes: Map<string, SkoposGraphNode>, node: SkoposGraphNode): void => {
  nodes.set(node.id, node);
};

const addEdge = (edges: Map<string, SkoposGraphEdge>, edge: SkoposGraphEdge): void => {
  edges.set(edge.id, edge);
};
