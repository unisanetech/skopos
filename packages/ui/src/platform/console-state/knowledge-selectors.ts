import type {
  SkoposUiConsoleDocumentView,
  SkoposUiConsoleTaskView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';
import {
  knowledgeCategoryForDocument,
  type KnowledgeCategory,
} from '../../support/knowledge/document-routing.js';

export interface PlanCollections {
  activePlans: SkoposUiConsolePlanView[];
  taskLinkedPlans: SkoposUiConsolePlanView[];
  libraryPlans: SkoposUiConsolePlanView[];
  latestPlan?: SkoposUiConsolePlanView;
  linkedTaskByPlanId: Map<string, SkoposUiConsoleTaskView>;
}

export interface KnowledgeDocumentCollections {
  documents: SkoposUiConsoleDocumentView[];
  primaryDocuments: SkoposUiConsoleDocumentView[];
  referenceDocuments: SkoposUiConsoleDocumentView[];
  latestDocument?: SkoposUiConsoleDocumentView;
}

export type ProjectDocumentView = 'essentials' | 'work' | 'other' | 'all';

export interface KnowledgeDocumentDetailContext {
  document?: SkoposUiConsoleDocumentView;
  relatedLinks: SkoposUiConsoleState['docsLinks'];
  previousDocument?: SkoposUiConsoleDocumentView;
  nextDocument?: SkoposUiConsoleDocumentView;
}

export const compareOptionalTimestamps = (left?: string, right?: string): number =>
  (left ?? '').localeCompare(right ?? '');

export const getPlanCollections = (state: SkoposUiConsoleState): PlanCollections => {
  const linkedTaskByPlanId = new Map<string, SkoposUiConsoleTaskView>();

  for (const taskView of state.tasks) {
    if (!taskView.task.planIds[0] || linkedTaskByPlanId.has(taskView.task.planIds[0])) {
      continue;
    }
    linkedTaskByPlanId.set(taskView.task.planIds[0], taskView);
  }

  const activePlans = state.plans
    .filter((planView) =>
      state.tasks.some(
        (taskView) =>
          taskView.task.planIds[0] === planView.plan.id &&
          taskView.task.state !== 'complete',
      ),
    )
    .sort((left, right) => compareOptionalTimestamps(right.plan.updatedAt, left.plan.updatedAt));
  const activePlanIds = new Set(activePlans.map((planView) => planView.plan.id));
  const taskLinkedPlans = state.plans.filter((planView) =>
    linkedTaskByPlanId.has(planView.plan.id),
  );
  const libraryPlans = state.plans
    .filter((planView) => !activePlanIds.has(planView.plan.id))
    .sort((left, right) => compareOptionalTimestamps(right.plan.updatedAt, left.plan.updatedAt));
  const latestPlan = [...state.plans]
    .sort((left, right) => compareOptionalTimestamps(right.plan.updatedAt, left.plan.updatedAt))[0];

  return {
    activePlans,
    taskLinkedPlans,
    libraryPlans,
    latestPlan,
    linkedTaskByPlanId,
  };
};

export const getPlanDetailContext = (
  state: SkoposUiConsoleState,
  planId: string,
): {
  planView?: SkoposUiConsolePlanView;
  relatedTask?: SkoposUiConsoleTaskView;
} => {
  const planView = state.plans.find((candidate) => candidate.plan.id === planId);

  if (!planView) {
    return {};
  }

  return {
    planView,
    relatedTask: state.tasks.find(
      (taskView) => taskView.task.planIds[0] === planView.plan.id,
    ),
  };
};

export const getKnowledgeDocumentCollections = (
  state: SkoposUiConsoleState,
  category: KnowledgeCategory,
): KnowledgeDocumentCollections => {
  const documents = state.documents
    .filter(
      (document) =>
        knowledgeCategoryForDocument(document) === category &&
        document.defaultVisible !== false,
    )
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

export const filterProjectDocuments = (
  documents: SkoposUiConsoleDocumentView[],
  view: ProjectDocumentView,
): SkoposUiConsoleDocumentView[] => {
  if (view === 'all') return documents;
  if (view === 'essentials') {
    return documents.filter((document) =>
      [
        'router',
        'overview',
        'architecture',
        'standard',
        'domain',
        'guide',
        'operation',
      ].includes(document.role ?? 'document'),
    );
  }
  if (view === 'work') {
    return documents.filter((document) => ['plan', 'task'].includes(document.role ?? 'document'));
  }
  return documents.filter((document) =>
    ['pattern', 'reference', 'document'].includes(document.role ?? 'document'),
  );
};

export const getKnowledgeDocumentDetailContext = (
  state: SkoposUiConsoleState,
  category: KnowledgeCategory,
  documentId: string,
): KnowledgeDocumentDetailContext => {
  const documents = state.documents
    .filter((candidate) => knowledgeCategoryForDocument(candidate) === category)
    .sort((left, right) => sortKnowledgeDocuments(left, right, category));
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
