const SKOPOS_PAGE_SCROLL_ROOT_SELECTOR = '[data-skopos-page-scroll-root="true"]';

export interface DocumentReaderSectionOffset {
  domId: string;
  top: number;
}

export const scrollToDocumentReaderEntry = (domId: string): void => {
  if (typeof document === 'undefined') {
    return;
  }

  document.getElementById(domId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

export const observeActiveDocumentReaderEntry = ({
  ids,
  onActive,
  offset = 96,
}: {
  ids: string[];
  onActive: (domId: string) => void;
  offset?: number;
}): (() => void) => {
  if (typeof document === 'undefined' || typeof window === 'undefined' || ids.length === 0) {
    return () => undefined;
  }

  const scrollRoot = document.querySelector<HTMLElement>(SKOPOS_PAGE_SCROLL_ROOT_SELECTOR);

  if (!scrollRoot) {
    return () => undefined;
  }

  let animationFrame = 0;

  const syncActive = (): void => {
    const rootRect = scrollRoot.getBoundingClientRect();
    const sectionOffsets = ids
      .map((domId) => {
        const element = document.getElementById(domId);

        if (!element) {
          return undefined;
        }

        return {
          domId,
          top: element.getBoundingClientRect().top - rootRect.top + scrollRoot.scrollTop,
        } satisfies DocumentReaderSectionOffset;
      })
      .filter((entry): entry is DocumentReaderSectionOffset => Boolean(entry));

    const activeDomId = pickActiveDocumentReaderEntry({
      sectionOffsets,
      scrollTop: scrollRoot.scrollTop,
      offset,
    });

    if (activeDomId) {
      onActive(activeDomId);
    }
  };

  const requestSync = (): void => {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = window.requestAnimationFrame(syncActive);
  };

  syncActive();
  scrollRoot.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    scrollRoot.removeEventListener('scroll', requestSync);
    window.removeEventListener('resize', requestSync);
  };
};

export const pickActiveDocumentReaderEntry = ({
  sectionOffsets,
  scrollTop,
  offset = 96,
}: {
  sectionOffsets: DocumentReaderSectionOffset[];
  scrollTop: number;
  offset?: number;
}): string | undefined => {
  if (sectionOffsets.length === 0) {
    return undefined;
  }

  const orderedOffsets = [...sectionOffsets].sort((left, right) => left.top - right.top);
  const threshold = Math.max(0, scrollTop + offset);
  let activeDomId = orderedOffsets[0]?.domId;

  for (const entry of orderedOffsets) {
    if (entry.top <= threshold) {
      activeDomId = entry.domId;
      continue;
    }

    break;
  }

  return activeDomId;
};
