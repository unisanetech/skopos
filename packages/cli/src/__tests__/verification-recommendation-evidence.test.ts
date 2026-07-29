import { describe, expect, it } from 'vitest';

import {
  excludeTrackedTaskDocument,
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
  });
});
