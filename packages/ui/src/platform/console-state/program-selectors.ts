import type {
  SkoposProgramInterruptRecommendation,
  SkoposProgramItem,
  SkoposProgramObligation,
  SkoposProgramRecommendedAction,
} from '@skopos/model';

import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import {
  documentHrefForCategory,
  knowledgeCategoryForDocument,
} from '../../support/knowledge/document-routing.js';

export interface ProgramOverviewContext {
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  currentActiveItem?: SkoposProgramItem;
  openObligations: SkoposProgramObligation[];
  currentItemObligations: SkoposProgramObligation[];
  openProgramQuestionCount: number;
  interruptRecommendation: SkoposProgramInterruptRecommendation;
  recommendedAction?: SkoposProgramRecommendedAction;
}

export interface MissionProgramContext {
  missionItem?: SkoposProgramItem;
  openObligations: SkoposProgramObligation[];
  doNextItem?: SkoposProgramItem;
  interruptRecommendation?: SkoposProgramInterruptRecommendation;
  recommendedAction?: SkoposProgramRecommendedAction;
}

export interface TrustProgramContext {
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  closureObligations: SkoposProgramObligation[];
  openProgramQuestionCount: number;
  interruptRecommendation?: SkoposProgramInterruptRecommendation;
  recommendedAction?: SkoposProgramRecommendedAction;
}

export const getProgramOverviewContext = (
  state: SkoposUiConsoleState,
): ProgramOverviewContext => {
  const programState = state.programState;
  const openObligations =
    programState?.obligations.filter((obligation) => obligation.status === 'open') ?? [];
  const currentActiveItem = resolveProgramItem(state, programState?.sequence.currentActiveItemId);

  return {
    doNowItem: resolveProgramItem(state, programState?.sequence.doNow),
    doNextItem: resolveProgramItem(state, programState?.sequence.doNext),
    currentActiveItem,
    openObligations,
    currentItemObligations: currentActiveItem
      ? openObligations.filter((obligation) => obligation.linkedItemId === currentActiveItem.id)
      : [],
    openProgramQuestionCount: programState?.sequence.openProgramQuestions.length ?? 0,
    interruptRecommendation:
      programState?.sequence.interruptRecommendation ?? buildIdleInterruptRecommendation(),
    recommendedAction: programState?.recommendedAction,
  };
};

export const getMissionProgramContext = (
  state: SkoposUiConsoleState,
  missionId: string,
): MissionProgramContext => {
  const programState = state.programState;
  const missionItem =
    programState?.items.find((item) => item.linkedMissionId === missionId) ??
    resolveProgramItem(state, programState?.sequence.currentActiveItemId);

  if (!programState || !missionItem || missionItem.linkedMissionId !== missionId) {
    return {
      doNextItem: resolveProgramItem(state, programState?.sequence.doNext),
      openObligations: [],
      recommendedAction: programState?.recommendedAction,
    };
  }

  return {
    missionItem,
    openObligations: programState.obligations.filter(
      (obligation) => obligation.status === 'open' && obligation.linkedItemId === missionItem.id,
    ),
    doNextItem: resolveProgramItem(state, programState.sequence.doNext),
    interruptRecommendation: programState.sequence.interruptRecommendation,
    recommendedAction: programState.recommendedAction,
  };
};

export const getTrustProgramContext = (
  state: SkoposUiConsoleState,
): TrustProgramContext => {
  const programState = state.programState;
  const openObligations =
    programState?.obligations.filter((obligation) => obligation.status === 'open') ?? [];

  return {
    doNowItem: resolveProgramItem(state, programState?.sequence.doNow),
    doNextItem: resolveProgramItem(state, programState?.sequence.doNext),
    closureObligations: openObligations.filter((obligation) =>
      ['docs', 'validation', 'workflows'].includes(obligation.kind),
    ),
    openProgramQuestionCount: programState?.sequence.openProgramQuestions.length ?? 0,
    interruptRecommendation: programState?.sequence.interruptRecommendation,
    recommendedAction: programState?.recommendedAction,
  };
};

export const resolveProgramItemHref = (
  state: SkoposUiConsoleState,
  item: SkoposProgramItem,
): string | undefined => {
  if (item.linkedMissionId) {
    return `#/missions/${encodeURIComponent(item.linkedMissionId)}`;
  }

  if (item.linkedPlanId) {
    return `#/plans/${encodeURIComponent(item.linkedPlanId)}`;
  }

  if (item.sourceKind === 'finding') {
    return resolveDocumentHrefBySourceRef(state, item.sourceRef);
  }

  return undefined;
};

export const resolveProgramObligationHref = (
  state: SkoposUiConsoleState,
  obligation: SkoposProgramObligation,
): string | undefined => {
  if (obligation.targetRef.startsWith('route:overview')) {
    return '#/overview';
  }

  if (obligation.targetRef.startsWith('route:trust')) {
    return '#/trust';
  }

  if (obligation.targetRef.startsWith('route:mission-detail')) {
    const linkedItem = resolveProgramItem(state, obligation.linkedItemId);
    if (linkedItem?.linkedMissionId) {
      return `#/missions/${encodeURIComponent(linkedItem.linkedMissionId)}`;
    }
  }

  if (obligation.targetRef.startsWith('mission:')) {
    const missionId = obligation.targetRef.slice('mission:'.length).split('#')[0];
    if (missionId) {
      return `#/missions/${encodeURIComponent(missionId)}`;
    }
  }

  const linkedItem = resolveProgramItem(state, obligation.linkedItemId);
  return linkedItem ? resolveProgramItemHref(state, linkedItem) : undefined;
};

const resolveProgramItem = (
  state: SkoposUiConsoleState,
  itemId?: string,
): SkoposProgramItem | undefined => state.programState?.items.find((item) => item.id === itemId);

const resolveDocumentHrefBySourceRef = (
  state: SkoposUiConsoleState,
  sourceRef: string,
): string | undefined => {
  const normalizedSourceRef = normalizePath(sourceRef);
  const matchingDocument =
    state.documents.find((document) =>
      normalizePath(document.displayPath).endsWith(`/${trimLeadingSlash(normalizedSourceRef)}`),
    ) ??
    state.documents.find((document) => normalizePath(document.displayPath) === normalizedSourceRef);

  if (!matchingDocument) {
    return undefined;
  }

  return documentHrefForCategory(
    knowledgeCategoryForDocument(matchingDocument),
    matchingDocument.id,
  );
};

const normalizePath = (value: string): string => value.replace(/\\/g, '/');

const trimLeadingSlash = (value: string): string =>
  value.startsWith('/') ? value.slice(1) : value;

const buildIdleInterruptRecommendation = (): SkoposProgramInterruptRecommendation => ({
  decision: 'idle',
  summary: 'No program router state is currently available.',
  reason: 'Build program state to surface queue order, obligations, and interruption guidance.',
});
