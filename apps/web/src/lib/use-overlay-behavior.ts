'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

type InertState = {
  count: number;
  inert: boolean;
  ariaHidden: string | null;
};

type ActiveLayer = {
  content: HTMLElement;
  root: HTMLElement;
  anchor: HTMLElement | null;
  sequence: number;
};

const inertStates = new Map<HTMLElement, InertState>();
const activeLayers: ActiveLayer[] = [];
let nextLayerSequence = 0;

export interface UseOverlayBehaviorOptions {
  open: boolean;
  contentRef: RefObject<HTMLElement | null>;
  rootRef?: RefObject<HTMLElement | null>;
  modalBoundaryRef?: RefObject<HTMLElement | null>;
  triggerRef?: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  modal?: boolean;
  dismissOnEscape?: boolean;
  dismissOnInteractOutside?: boolean;
  initialFocus?: boolean;
  restoreFocus?: boolean;
  isInteractionOutside?: (target: Node) => boolean;
}

function getFocusableElements(root: HTMLElement | null) {
  if (!root) {
    return [];
  }

  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  );
}

function getLayerDepth(layer: ActiveLayer) {
  return activeLayers.filter(
    (candidate) =>
      candidate !== layer && layer.anchor !== null && candidate.content.contains(layer.anchor),
  ).length;
}

function isTopmostLayer(layer: ActiveLayer) {
  return (
    activeLayers.reduce<ActiveLayer | undefined>((topmost, candidate) => {
      if (!topmost) {
        return candidate;
      }

      const candidateDepth = getLayerDepth(candidate);
      const topmostDepth = getLayerDepth(topmost);
      if (candidateDepth !== topmostDepth) {
        return candidateDepth > topmostDepth ? candidate : topmost;
      }
      return candidate.sequence > topmost.sequence ? candidate : topmost;
    }, undefined) === layer
  );
}

function registerLayer(content: HTMLElement, root: HTMLElement, anchor: HTMLElement | null) {
  const layer: ActiveLayer = {
    content,
    root,
    anchor,
    sequence: nextLayerSequence++,
  };
  activeLayers.push(layer);
  return layer;
}

function unregisterLayer(layer: ActiveLayer) {
  const index = activeLayers.indexOf(layer);
  if (index !== -1) {
    activeLayers.splice(index, 1);
  }
}

function acquireInert(element: HTMLElement) {
  const current = inertStates.get(element);
  if (current) {
    current.count += 1;
    return;
  }

  inertStates.set(element, {
    count: 1,
    inert: element.inert,
    ariaHidden: element.getAttribute('aria-hidden'),
  });
  element.inert = true;
  element.setAttribute('inert', '');
  element.setAttribute('aria-hidden', 'true');
}

function releaseInert(element: HTMLElement) {
  const current = inertStates.get(element);
  if (!current) {
    return;
  }

  current.count -= 1;
  if (current.count > 0) {
    return;
  }

  element.inert = current.inert;
  if (current.inert) {
    element.setAttribute('inert', '');
  } else {
    element.removeAttribute('inert');
  }
  if (current.ariaHidden === null) {
    element.removeAttribute('aria-hidden');
  } else {
    element.setAttribute('aria-hidden', current.ariaHidden);
  }
  inertStates.delete(element);
}

function inertOutside(layer: ActiveLayer) {
  const currentDepth = getLayerDepth(layer);
  const elements = Array.from(document.body.children).filter((element): element is HTMLElement => {
    if (
      !(element instanceof HTMLElement) ||
      element === layer.root ||
      element.contains(layer.root) ||
      layer.root.contains(element) ||
      ['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName)
    ) {
      return false;
    }

    return !activeLayers.some(
      (candidate) =>
        candidate !== layer &&
        (element === candidate.root || element.contains(candidate.root)) &&
        getLayerDepth(candidate) > currentDepth,
    );
  });

  elements.forEach(acquireInert);
  return () => elements.forEach(releaseInert);
}

function inertWithinBoundary(layer: ActiveLayer, boundary: HTMLElement | null) {
  if (!boundary) return undefined;
  const elements = Array.from(boundary.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement &&
      element !== layer.root &&
      !element.contains(layer.root) &&
      !layer.root.contains(element),
  );
  elements.forEach(acquireInert);
  return () => elements.forEach(releaseInert);
}

export function useOverlayBehavior({
  open,
  contentRef,
  rootRef,
  modalBoundaryRef,
  triggerRef,
  onDismiss,
  modal = false,
  dismissOnEscape = true,
  dismissOnInteractOutside = false,
  initialFocus = modal,
  restoreFocus = true,
  isInteractionOutside,
}: UseOverlayBehaviorOptions) {
  const onDismissRef = useRef(onDismiss);
  const isInteractionOutsideRef = useRef(isInteractionOutside);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    isInteractionOutsideRef.current = isInteractionOutside;
  }, [isInteractionOutside]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') {
      return;
    }

    const content = contentRef.current;
    if (!content) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const layer = registerLayer(
      content,
      rootRef?.current ?? content,
      triggerRef?.current ?? previouslyFocused,
    );
    const releaseDocumentBackground = modal ? inertOutside(layer) : undefined;
    const releaseBoundary = modal
      ? inertWithinBoundary(layer, modalBoundaryRef?.current ?? null)
      : undefined;
    const focusTimer = initialFocus
      ? window.setTimeout(() => {
          const focusableElements = getFocusableElements(content);
          (focusableElements[0] ?? content).focus();
        }, 0)
      : undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmostLayer(layer)) {
        return;
      }

      if (event.key === 'Escape' && dismissOnEscape) {
        event.preventDefault();
        onDismissRef.current();
        return;
      }

      if (!modal || event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements(content);
      if (focusableElements.length === 0) {
        event.preventDefault();
        content.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && (activeElement === first || activeElement === content)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!dismissOnInteractOutside || !isTopmostLayer(layer)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (
        content.contains(target) ||
        triggerRef?.current?.contains(target) ||
        rootRef?.current?.contains(target)
      ) {
        return;
      }
      if (isInteractionOutsideRef.current && !isInteractionOutsideRef.current(target)) {
        return;
      }
      onDismissRef.current();
    };

    document.addEventListener('keydown', handleKeyDown);
    if (dismissOnInteractOutside) {
      document.addEventListener('mousedown', handleMouseDown);
    }
    const focusReturnTarget = triggerRef?.current ?? previouslyFocused;

    return () => {
      if (focusTimer !== undefined) {
        window.clearTimeout(focusTimer);
      }
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      releaseBoundary?.();
      releaseDocumentBackground?.();
      unregisterLayer(layer);
      if (restoreFocus) {
        focusReturnTarget?.focus();
      }
    };
  }, [
    contentRef,
    dismissOnEscape,
    dismissOnInteractOutside,
    initialFocus,
    modal,
    modalBoundaryRef,
    open,
    restoreFocus,
    rootRef,
    triggerRef,
  ]);
}
