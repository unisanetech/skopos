import type {
  SkoposUiConsoleDocumentView,
  SkoposUiConsoleMissionView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';
import {
  knowledgeCategoryForDocument,
  type KnowledgeCategory,
} from '../../support/knowledge/document-routing.js';

export interface PlanCollections {
  activePlans: SkoposUiConsolePlanView[];
  missionLinkedPlans: SkoposUiConsolePlanView[];
  libraryPlans: SkoposUiConsolePlanView[];
  latestPlan?: SkoposUiConsolePlanView;
  linkedMissionByPlanId: Map<string, SkoposUiConsoleMissionView>;
}

export interface KnowledgeDocumentCollections {
  documents: SkoposUiConsoleDocumentView[];
  primaryDocuments: SkoposUiConsoleDocumentView[];
  referenceDocuments: SkoposUiConsoleDocumentView[];
  latestDocument?: SkoposUiConsoleDocumentView;
}

export interface KnowledgeDocumentDetailContext {
  document?: SkoposUiConsoleDocumentView;
  relatedLinks: SkoposUiConsoleState['docsLinks'];
  previousDocument?: SkoposUiConsoleDocumentView;
  nextDocument?: SkoposUiConsoleDocumentView;
}

export const compareOptionalTimestamps = (left?: string, right?: string): number =>
  (left ?? '').localeCompare(right ?? '');

export const getPlanCollections = (state: SkoposUiConsoleState): PlanCollections => {
  const linkedMissionByPlanId = new Map<string, SkoposUiConsoleMissionView>();

  for (const missionView of state.missions) {
    if (!missionView.mission.planId || linkedMissionByPlanId.has(missionView.mission.planId)) {
      continue;
    }
    linkedMissionByPlanId.set(missionView.mission.planId, missionView);
  }

  const activePlans = state.plans
    .filter((planView) =>
      state.missions.some(
        (missionView) =>
          missionView.mission.planId === planView.plan.id &&
          missionView.mission.state !== 'complete',
      ),
    )
    .sort((left, right) => compareOptionalTimestamps(right.plan.updatedAt, left.plan.updatedAt));
  const activePlanIds = new Set(activePlans.map((planView) => planView.plan.id));
  const missionLinkedPlans = state.plans.filter((planView) =>
    linkedMissionByPlanId.has(planView.plan.id),
  );
  const libraryPlans = state.plans
    .filter((planView) => !activePlanIds.has(planView.plan.id))
    .sort((left, right) => compareOptionalTimestamps(right.plan.updatedAt, left.plan.updatedAt));
  const latestPlan = [...state.plans]
    .sort((left, right) => compareOptionalTimestamps(right.plan.updatedAt, left.plan.updatedAt))[0];

  return {
    activePlans,
    missionLinkedPlans,
    libraryPlans,
    latestPlan,
    linkedMissionByPlanId,
  };
};

export const getPlanDetailContext = (
  state: SkoposUiConsoleState,
  planId: string,
): {
  planView?: SkoposUiConsolePlanView;
  relatedMission?: SkoposUiConsoleMissionView;
} => {
  const planView = state.plans.find((candidate) => candidate.plan.id === planId);

  if (!planView) {
    return {};
  }

  return {
    planView,
    relatedMission: state.missions.find(
      (missionView) => missionView.mission.planId === planView.plan.id,
    ),
  };
};

export const getKnowledgeDocumentCollections = (
  state: SkoposUiConsoleState,
  category: KnowledgeCategory,
): KnowledgeDocumentCollections => {
  const documents = state.documents
    .filter((document) => knowledgeCategoryForDocument(document) === category)
    .sort((left, right) => sortKnowledgeDocuments(left, right, category));
  const referenceDocuments =
    category === 'docs' ? [] : documents.filter((document) => isReferenceKnowledgeDocument(document));
  const primaryDocuments =
    category === 'docs'
      ? documents
      : documents.filter((document) => !isReferenceKnowledgeDocument(document));
  const latestDocument = [...primaryDocuments, ...referenceDocuments].find(
    (document) => document.updatedAt,
  );

  return {
    documents,
    primaryDocuments,
    referenceDocuments,
    latestDocument,
  };
};

export const getKnowledgeDocumentDetailContext = (
  state: SkoposUiConsoleState,
  category: KnowledgeCategory,
  documentId: string,
): KnowledgeDocumentDetailContext => {
  const { documents } = getKnowledgeDocumentCollections(state, category);
  const document = documents.find((candidate) => candidate.id === documentId);

  if (!document) {
    return {
      relatedLinks: [],
    };
  }

  const currentIndex = documents.findIndex((candidate) => candidate.id === document.id);

  return {
    document,
    relatedLinks: state.docsLinks.filter((link) => link.id === document.id),
    previousDocument: currentIndex > 0 ? documents[currentIndex - 1] : undefined,
    nextDocument:
      currentIndex >= 0 && currentIndex < documents.length - 1
        ? documents[currentIndex + 1]
        : undefined,
  };
};

const sortKnowledgeDocuments = (
  left: SkoposUiConsoleDocumentView,
  right: SkoposUiConsoleDocumentView,
  category: KnowledgeCategory,
): number => {
  const leftPriority = specialDocumentPriority(left);
  const rightPriority = specialDocumentPriority(right);

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  if (category === 'decisions') {
    return right.displayPath.localeCompare(left.displayPath);
  }

  return left.displayPath.localeCompare(right.displayPath);
};

const specialDocumentPriority = (document: SkoposUiConsoleDocumentView): number => {
  const normalizedPath = document.displayPath.toLowerCase().split('\\').join('/');

  if (normalizedPath.endsWith('/registry.md')) {
    return -2;
  }

  if (normalizedPath.endsWith('/readme.md')) {
    return -1;
  }

  return 0;
};

const isReferenceKnowledgeDocument = (document: SkoposUiConsoleDocumentView): boolean => {
  const normalizedPath = document.displayPath.toLowerCase().split('\\').join('/');
  return normalizedPath.endsWith('/registry.md') || normalizedPath.endsWith('/readme.md');
};
