import type {
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposScopesLiteArtifact,
  SkoposActionManifest,
} from '@skopos/model';

interface ProjectSurface {
  id: string;
  kind: 'docs-root' | 'instruction-file';
  title: string;
  path: string;
  summary: string;
}

export interface BuildSkoposDocsGraphOptions {
  workspaceRoot: string;
  actions: SkoposActionManifest[];
  scopesLite: SkoposScopesLiteArtifact;
  docsRoots: string[];
  instructionFiles: string[];
}

export const buildSkoposDocsGraph = ({
  workspaceRoot,
  actions,
  scopesLite,
  docsRoots,
  instructionFiles,
}: BuildSkoposDocsGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();
  const workspaceNodeId = 'workspace';
  const resolvedDocsRoots = [
    ...new Set([
      ...docsRoots,
      ...scopesLite.scopes.flatMap((scope) =>
        scope.memoryRoot ? [scope.memoryRoot] : [],
      ),
    ]),
  ];
  const docsSurfaces: ProjectSurface[] = resolvedDocsRoots.map((path) => ({
    id: path,
    kind: 'docs-root',
    title: path,
    path,
    summary: `Canonical docs root at ${path}.`,
  }));
  const instructionSurfaces: ProjectSurface[] = instructionFiles.map((path) => ({
    id: path,
    kind: 'instruction-file',
    title: path,
    path,
    summary: `Instruction surface at ${path}.`,
  }));
  const relevantWorkflows = actions.filter(isDocsWorkflow);

  addNode(nodes, {
    id: workspaceNodeId,
    kind: 'workspace',
    label: 'workspace',
    state: 'active',
    path: '.',
    summary: 'Workspace root for documentation and instruction surfaces.',
  });

  for (const surface of [...docsSurfaces, ...instructionSurfaces]) {
    const nodeId = surfaceNodeId(surface);
    addNode(nodes, {
      id: nodeId,
      kind: surface.kind,
      label: surface.title,
      state: 'active',
      path: surface.path,
      summary: surface.summary,
    });
    addEdge(edges, {
      id: `${workspaceNodeId}->${nodeId}:contains`,
      kind: 'contains',
      from: workspaceNodeId,
      to: nodeId,
      state: 'active',
    });
  }

  for (const action of relevantWorkflows) {
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

    for (const docsSurface of docsSurfaces) {
      if (actionTouchesPathFamily(action, docsSurface.path)) {
        const targetNodeId = surfaceNodeId(docsSurface);
        addEdge(edges, {
          id: `${nodeId}->${targetNodeId}:touches`,
          kind: 'touches',
          from: nodeId,
          to: targetNodeId,
          state: 'recommended',
        });
      }
    }

    for (const instructionSurface of instructionSurfaces) {
      if (actionTouchesExactPath(action, instructionSurface.path)) {
        const targetNodeId = surfaceNodeId(instructionSurface);
        addEdge(edges, {
          id: `${nodeId}->${targetNodeId}:touches`,
          kind: 'touches',
          from: nodeId,
          to: targetNodeId,
          state: 'recommended',
        });
      }
    }
  }

  const focusSurface = docsSurfaces[0] ?? instructionSurfaces[0];

  return {
    schemaVersion: 1,
    id: 'graph-docs',
    type: 'graph',
    status: 'generated',
    authority: 'generated',
    summary:
      'Typed docs graph for canonical docs roots, instruction surfaces, and docs-affecting actions.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    graphKind: 'docs',
    focusId: focusSurface ? surfaceNodeId(focusSurface) : workspaceNodeId,
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
};

const surfaceNodeId = (surface: ProjectSurface): string => `${surface.kind}:${surface.id}`;

const isDocsWorkflow = (action: SkoposActionManifest): boolean =>
  ['docs-generator', 'docs-validator', 'reference-generator', 'graph-generator'].includes(
    action.category,
  ) ||
  action.outputs.some((path) => path.startsWith('docs/')) ||
  action.affects.some((path) => path.startsWith('docs/'));

const actionTouchesPathFamily = (action: SkoposActionManifest, pathPrefix: string): boolean =>
  [...action.outputs, ...action.affects].some(
    (path) => path === pathPrefix || path.startsWith(`${pathPrefix}/`),
  );

const actionTouchesExactPath = (action: SkoposActionManifest, targetPath: string): boolean =>
  [...action.outputs, ...action.affects].some((path) => path === targetPath);

const addNode = (nodes: Map<string, SkoposGraphNode>, node: SkoposGraphNode): void => {
  nodes.set(node.id, node);
};

const addEdge = (edges: Map<string, SkoposGraphEdge>, edge: SkoposGraphEdge): void => {
  edges.set(edge.id, edge);
};
