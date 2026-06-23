import type {
  SkoposGraphArtifact,
  SkoposGraphEdge,
  SkoposGraphNode,
  SkoposMissionArtifact,
  SkoposPlanArtifact,
} from '@skopos/model';

export interface BuildSkoposMissionGraphOptions {
  workspaceRoot: string;
  plan: SkoposPlanArtifact;
  mission: SkoposMissionArtifact;
}

export const buildSkoposMissionGraph = ({
  workspaceRoot,
  plan,
  mission,
}: BuildSkoposMissionGraphOptions): SkoposGraphArtifact => {
  const generatedAt = new Date().toISOString();
  const nodes = new Map<string, SkoposGraphNode>();
  const edges = new Map<string, SkoposGraphEdge>();
  const scopeId = `scope:${plan.scope.scope.id}`;
  const planId = `plan:${plan.id}`;
  const missionId = `mission:${mission.id}`;

  addNode(nodes, {
    id: planId,
    kind: 'plan',
    label: plan.title,
    state: 'generated',
    summary: plan.summary,
  });
  addNode(nodes, {
    id: missionId,
    kind: 'mission',
    label: mission.title,
    state: mission.state === 'complete' ? 'complete' : 'generated',
    summary: mission.summary,
  });
  addNode(nodes, {
    id: scopeId,
    kind:
      plan.scope.scope.kind === 'docs-root'
        ? 'docs-root'
        : plan.scope.scope.kind === 'instruction-file'
          ? 'instruction-file'
          : 'scope',
    label: plan.scope.scope.title,
    state: 'active',
    path: plan.scope.scope.path,
    summary: plan.scope.scope.summary,
  });

  addEdge(edges, {
    id: `${planId}->${scopeId}:targets`,
    kind: 'targets',
    from: planId,
    to: scopeId,
    state: 'recommended',
  });
  addEdge(edges, {
    id: `${missionId}->${planId}:belongs-to`,
    kind: 'belongs-to',
    from: missionId,
    to: planId,
    state: 'generated',
  });
  addEdge(edges, {
    id: `${missionId}->${scopeId}:targets`,
    kind: 'targets',
    from: missionId,
    to: scopeId,
    state: 'generated',
  });

  if (plan.parentPlanId) {
    const parentPlanId = `plan:${plan.parentPlanId}`;
    addNode(nodes, {
      id: parentPlanId,
      kind: 'plan',
      label: `Parent ${plan.parentPlanId}`,
      state: 'active',
      summary: 'Parent plan for this slice.',
    });
    addEdge(edges, {
      id: `${planId}->${parentPlanId}:belongs-to`,
      kind: 'belongs-to',
      from: planId,
      to: parentPlanId,
      state: 'generated',
    });
  }

  if (mission.parentMissionId) {
    const parentMissionId = `mission:${mission.parentMissionId}`;
    addNode(nodes, {
      id: parentMissionId,
      kind: 'mission',
      label: `Parent ${mission.parentMissionId}`,
      state: 'active',
      summary: 'Parent mission for this slice.',
    });
    addEdge(edges, {
      id: `${missionId}->${parentMissionId}:belongs-to`,
      kind: 'belongs-to',
      from: missionId,
      to: parentMissionId,
      state: 'generated',
    });
  }

  for (const question of plan.decisionQuestions) {
    const nodeId = `decision:${question.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'decision-question',
      label: question.question,
      state: question.escalation === 'must-ask' ? 'required' : 'recommended',
      summary: question.whyItMatters,
      metadata: {
        escalation: question.escalation,
        category: question.category,
      },
    });
    addEdge(edges, {
      id: `${planId}->${nodeId}:requires`,
      kind: 'requires',
      from: planId,
      to: nodeId,
      state: question.escalation === 'must-ask' ? 'required' : 'recommended',
    });
  }

  for (const workflow of plan.recommendedWorkflows) {
    const nodeId = `workflow:${workflow.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'workflow',
      label: workflow.id,
      state: workflow.requiredForDone ? 'required' : 'recommended',
      path: workflow.sourcePath,
      summary: workflow.reason,
      metadata: {
        category: workflow.category,
        safety: workflow.safety,
      },
    });
    addEdge(edges, {
      id: `${planId}->${nodeId}:recommends`,
      kind: 'recommends',
      from: planId,
      to: nodeId,
      state: workflow.requiredForDone ? 'required' : 'recommended',
    });
  }

  for (const command of plan.recommendedChecks) {
    const nodeId = `command:${slugify(command)}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'command',
      label: command,
      state: 'recommended',
      summary: 'Canonical validation command.',
    });
    addEdge(edges, {
      id: `${missionId}->${nodeId}:validates`,
      kind: 'validates',
      from: missionId,
      to: nodeId,
      state: 'recommended',
    });
  }

  for (const item of mission.items) {
    const nodeId = `mission-item:${item.id}`;
    addNode(nodes, {
      id: nodeId,
      kind: 'mission-item',
      label: item.title,
      state:
        item.status === 'complete'
          ? 'complete'
          : item.kind === 'workflow'
            ? 'required'
            : 'generated',
      summary: item.detail,
      metadata: {
        itemKind: item.kind,
        itemStatus: item.status,
      },
    });
    addEdge(edges, {
      id: `${missionId}->${nodeId}:contains`,
      kind: 'contains',
      from: missionId,
      to: nodeId,
      state: item.status === 'complete' ? 'complete' : 'generated',
    });

    if (item.kind === 'workflow') {
      const workflowId = item.id.replace(/^workflow-/, '');
      addEdge(edges, {
        id: `${nodeId}->workflow:${workflowId}:requires`,
        kind: 'requires',
        from: nodeId,
        to: `workflow:${workflowId}`,
        state: item.status === 'complete' ? 'complete' : 'required',
      });
    }
  }

  for (const slice of mission.linkedSlices ?? []) {
    const childMissionId = `mission:${slice.missionId}`;
    const childPlanId = `plan:${slice.planId}`;
    const childScopeId = `scope:${slice.scopeId}`;

    addNode(nodes, {
      id: childMissionId,
      kind: 'mission',
      label: slice.title,
      state: slice.state === 'complete' ? 'complete' : 'generated',
      summary: slice.goal,
      metadata: {
        createdByActorId: slice.createdByActorId ?? 'unknown',
        claimedByActorId: slice.claimedByActorId ?? 'none',
      },
    });
    addNode(nodes, {
      id: childPlanId,
      kind: 'plan',
      label: slice.title,
      state: 'generated',
      summary: slice.goal,
    });
    addNode(nodes, {
      id: childScopeId,
      kind:
        slice.scopeKind === 'docs-root'
          ? 'docs-root'
          : slice.scopeKind === 'instruction-file'
            ? 'instruction-file'
            : 'scope',
      label: slice.scopeTitle,
      state: 'active',
      path: slice.scopePath,
      summary: 'Slice target scope.',
    });

    addEdge(edges, {
      id: `${missionId}->${childMissionId}:contains`,
      kind: 'contains',
      from: missionId,
      to: childMissionId,
      state: 'generated',
    });
    addEdge(edges, {
      id: `${childMissionId}->${childPlanId}:belongs-to`,
      kind: 'belongs-to',
      from: childMissionId,
      to: childPlanId,
      state: 'generated',
    });
    addEdge(edges, {
      id: `${childMissionId}->${childScopeId}:targets`,
      kind: 'targets',
      from: childMissionId,
      to: childScopeId,
      state: 'generated',
    });
  }

  return {
    schemaVersion: 1,
    id: `graph-${mission.id}`,
    type: 'graph',
    status: 'generated',
    authority: 'generated',
    summary: `Typed mission graph for ${mission.id}.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    graphKind: 'mission',
    focusId: missionId,
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

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
