import * as React from 'react';

import type { SkoposUiConsoleDocumentView } from '../../../contracts/skopos-ui-console-state.js';
import type { KnowledgeCategory } from '../../../support/knowledge/document-routing.js';
import { HeaderIconButton } from '../../../patterns/shells/page-frame.js';
import { documentHrefForCategory } from '../../../support/knowledge/document-routing.js';

export function DocumentSequenceActions({
  previousDocument,
  nextDocument,
  category,
}: {
  previousDocument?: SkoposUiConsoleDocumentView;
  nextDocument?: SkoposUiConsoleDocumentView;
  category: KnowledgeCategory;
}): React.JSX.Element {
  return (
    <>
      <HeaderIconButton
        label="Previous document"
        title={previousDocument?.title ?? 'No previous document'}
        disabled={!previousDocument}
        href={previousDocument ? documentHrefForCategory(category, previousDocument.id) : undefined}
      >
        ←
      </HeaderIconButton>
      <HeaderIconButton
        label="Next document"
        title={nextDocument?.title ?? 'No next document'}
        disabled={!nextDocument}
        href={nextDocument ? documentHrefForCategory(category, nextDocument.id) : undefined}
      >
        →
      </HeaderIconButton>
    </>
  );
}
