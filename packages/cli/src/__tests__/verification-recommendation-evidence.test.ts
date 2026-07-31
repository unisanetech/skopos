import { describe, expect, it } from 'vitest';

import {
  excludeTrackedTaskDocument,
  isApplicableAcceptanceRequirement,
  selectApplicableAcceptanceActionIds,
} from '../../../runtime/src/application/verification/verification.service.js';
import { archiveTrackedTaskDocumentPath } from '../../../runtime/src/application/task/task.service.js';

describe('Task acceptance Action evidence', () => {
  it('does not turn planning recommendations or retired Actions into closure requirements', () => {
    expect(
      selectApplicableAcceptanceActionIds(
        ['docs.check', 'retired.index.refresh', 'unrelated.primitives.check'],
        new Set(['docs.check']),
      ),
    ).toEqual(['docs.check']);
  });

  it('deduplicates and orders only Actions required by current impact', () => {
    expect(
      selectApplicableAcceptanceActionIds(
        ['scope.check', 'docs.check', 'scope.check'],
        new Set(['scope.check', 'docs.check']),
      ),
    ).toEqual(['docs.check', 'scope.check']);
  });

  it('keeps ordinary acceptance required while excluding stale Guard requirements', () => {
    const matchedGuardIds = new Set(['docs.sync']);

    expect(isApplicableAcceptanceRequirement([], matchedGuardIds)).toBe(true);
    expect(
      isApplicableAcceptanceRequirement(['docs.sync'], matchedGuardIds),
    ).toBe(true);
    expect(
      isApplicableAcceptanceRequirement(['knowledge.refresh'], matchedGuardIds),
    ).toBe(false);
    expect(
      isApplicableAcceptanceRequirement(
        ['docs.sync', 'knowledge.refresh'],
        matchedGuardIds,
      ),
    ).toBe(false);
  });

  it('excludes the generated tracked Task document from source-bound proof', () => {
    expect(
      excludeTrackedTaskDocument(
        ['docs/architecture.md', 'docs/work/tasks/T-123-task.md'],
        'docs/work/tasks/T-123-task.md',
      ),
    ).toEqual(['docs/architecture.md']);
  });

  it('routes completed tracked Task documents to the historical archive', () => {
    expect(
      archiveTrackedTaskDocumentPath('docs/work/tasks/T-123-task.md'),
    ).toBe('docs/work/archive/tasks/T-123-task.md');
    expect(
      archiveTrackedTaskDocumentPath('docs/work/archive/tasks/T-123-task.md'),
    ).toBe('docs/work/archive/tasks/T-123-task.md');
    expect(
      archiveTrackedTaskDocumentPath('docs/work/archive/archive/tasks/T-123-task.md'),
    ).toBe('docs/work/archive/tasks/T-123-task.md');
  });
});
