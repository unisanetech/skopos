import { resolve } from 'node:path';

import type { SkoposGraphArtifact } from '@skopos/model';

import { loadSkoposGraphArtifacts } from '../../adapters/graph-artifact-loader.adapter.js';
import type {
  LoadedSkoposGraphArtifact,
  SkoposUiGraphHighlightGroup,
  SkoposUiGraphView,
  SkoposUiGraphViewsResult,
} from '../../contracts/skopos-ui-graph-view.js';

export interface LoadSkoposUiGraphViewsOptions {
  cwd: string;
}

export const loadSkoposUiGraphViews = async ({
  cwd,
}: LoadSkoposUiGraphViewsOptions): Promise<SkoposUiGraphViewsResult> => {
  const workspaceRoot = resolve(cwd);
  const artifacts = await loadSkoposGraphArtifacts(workspaceRoot);

  return {
    workspaceRoot,
    graphPaths: artifacts.map((artifact) => artifact.artifactPath),
    graphs: artifacts.map(buildGraphView),
  };
};

const buildGraphView = ({ artifactPath, graph }: LoadedSkoposGraphArtifact): SkoposUiGraphView => {
  const focusNode = graph.nodes.find((node) => node.id === graph.focusId);

  return {
    id: graph.id,
    kind: graph.graphKind,
    title: graphTitle(graph),
    summary: graph.summary ?? '',
    focusId: graph.focusId,
    focusLabel: focusNode?.label ?? graph.focusId,
    artifactPath,
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    highlights: buildHighlights(graph),
    nodes: graph.nodes.map((node) => ({
      id: node.id,
      kind: node.kind,
      label: node.label,
      state: node.state,
      path: node.path,
      summary: node.summary,
    })),
    edges: graph.edges.map((edge) => ({
      id: edge.id,
      kind: edge.kind,
      from: edge.from,
      to: edge.to,
      state: edge.state,
      label: edge.label,
    })),
  };
};

const graphTitle = (graph: SkoposGraphArtifact): string => {
  switch (graph.graphKind) {
    case 'workspace':
      return 'Workspace Graph';
    case 'docs':
      return 'Docs Graph';
    case 'commands':
      return 'Commands Graph';
    case 'scope-relations':
      return 'Scope Relations Graph';
    case 'impact':
      return 'Impact Graph';
    case 'mission':
      return 'Mission Graph';
    default:
      return 'Graph';
  }
};

const buildHighlights = (graph: SkoposGraphArtifact): SkoposUiGraphHighlightGroup[] => {
  switch (graph.graphKind) {
    case 'workspace':
      return [
        buildHighlightGroup(graph, 'scopes', 'Scopes', ['scope', 'docs-root', 'instruction-file']),
        buildHighlightGroup(graph, 'commands', 'Commands', ['command']),
        buildHighlightGroup(graph, 'workflows', 'Registered Workflows', ['workflow']),
      ];
    case 'docs':
      return [
        buildHighlightGroup(graph, 'docs-roots', 'Docs Roots', ['docs-root']),
        buildHighlightGroup(graph, 'instructions', 'Instruction Surfaces', ['instruction-file']),
        buildHighlightGroup(graph, 'docs-workflows', 'Docs Workflows', ['workflow']),
      ];
    case 'commands':
      return [
        buildHighlightGroup(graph, 'commands', 'Canonical Commands', ['command']),
        buildHighlightGroup(graph, 'workflows', 'Operational Workflows', ['workflow']),
        buildHighlightGroup(graph, 'targeted-scopes', 'Targeted Scopes', ['scope']),
      ];
    case 'scope-relations':
      return [buildHighlightGroup(graph, 'packages', 'Package Scopes', ['scope'])];
    case 'mission':
      return [
        buildHighlightGroup(graph, 'decisions', 'Decision Gates', ['decision-question']),
        buildHighlightGroup(
          graph,
          'workflows',
          'Workflow Steps',
          ['workflow', 'mission-item'],
          (node) =>
            node.kind === 'workflow' ||
            (node.kind === 'mission-item' && node.id.startsWith('mission-item:workflow-')),
        ),
        buildHighlightGroup(graph, 'validation', 'Validation', ['command']),
      ];
    case 'impact':
      return [
        buildHighlightGroup(graph, 'changed', 'Changed Paths', ['changed-path']),
        buildHighlightGroup(graph, 'affected', 'Affected Scopes', [
          'scope',
          'docs-root',
          'instruction-file',
        ]),
        buildHighlightGroup(graph, 'required-workflows', 'Required Workflows', ['workflow']),
      ];
    default:
      return [];
  }
};

const buildHighlightGroup = (
  graph: SkoposGraphArtifact,
  id: string,
  title: string,
  kinds: Array<SkoposGraphArtifact['nodes'][number]['kind']>,
  predicate?: (node: SkoposGraphArtifact['nodes'][number]) => boolean,
): SkoposUiGraphHighlightGroup => ({
  id,
  title,
  items: graph.nodes
    .filter((node) => kinds.includes(node.kind) && (predicate ? predicate(node) : true))
    .map((node) => `${node.label} [${node.state}]`)
    .slice(0, 8),
});
