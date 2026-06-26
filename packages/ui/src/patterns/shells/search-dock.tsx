import * as React from 'react';

import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import { cn } from '../../support/ui/classnames.js';
import {
  getSkoposConsoleSearchContext,
  type SkoposConsoleSearchGroup,
  type SkoposConsoleSearchKind,
  type SkoposConsoleSearchResult,
} from '../../platform/console-state/search-selectors.js';

export function getSkoposSearchShortcutLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'Cmd/Ctrl K';
  }

  return /mac/i.test(navigator.platform) ? '⌘K' : 'Ctrl K';
}

export function SearchDock({
  state,
  currentPath,
  openSignal = 0,
}: {
  state: SkoposUiConsoleState;
  currentPath: string;
  openSignal?: number;
}): React.JSX.Element {
  const shortcutLabel = React.useMemo(() => getSkoposSearchShortcutLabel(), []);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const lastOpenSignalRef = React.useRef(openSignal);
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const deferredQuery = React.useDeferredValue(query);
  const searchContext = React.useMemo(
    () =>
      getSkoposConsoleSearchContext({
        state,
        rawQuery: deferredQuery,
        currentPath,
      }),
    [currentPath, deferredQuery, state],
  );

  const focusInput = React.useCallback(() => {
    if (typeof window === 'undefined') {
      inputRef.current?.focus();
      return;
    }

    const schedule =
      typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame.bind(window)
        : (callback: FrameRequestCallback) => window.setTimeout(callback, 0);

    schedule(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  }, []);

  const closeDock = React.useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
    inputRef.current?.blur();
  }, []);

  const openDock = React.useCallback(
    (options?: { clearQuery?: boolean }) => {
      setIsOpen(true);
      if (options?.clearQuery) {
        setQuery('');
      }
      setSelectedIndex(0);
      focusInput();
    },
    [focusInput],
  );

  const openResult = React.useCallback(
    (result: SkoposConsoleSearchResult | undefined) => {
      if (!result || typeof window === 'undefined') {
        return;
      }

      setIsOpen(false);
      setQuery('');
      setSelectedIndex(0);

      if (result.external || !result.href.startsWith('#')) {
        window.location.assign(new URL(result.href, window.location.href).toString());
        return;
      }

      const nextHash = result.href.slice(1);
      if (window.location.hash !== nextHash) {
        window.location.hash = nextHash;
      }
    },
    [],
  );

  React.useEffect(() => {
    if (openSignal === lastOpenSignalRef.current) {
      return;
    }

    lastOpenSignalRef.current = openSignal;
    openDock({ clearQuery: true });
  }, [openDock, openSignal]);

  React.useEffect(() => {
    closeDock();
  }, [closeDock, currentPath]);

  React.useEffect(() => {
    const resultCount = searchContext.flatResults.length;
    if (resultCount === 0) {
      setSelectedIndex(-1);
      return;
    }

    setSelectedIndex((currentIndex) => {
      if (currentIndex < 0 || currentIndex >= resultCount) {
        return 0;
      }
      return currentIndex;
    });
  }, [searchContext.flatResults.length, deferredQuery]);

  React.useEffect(() => {
    const handleGlobalKeydown = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openDock();
        return;
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        closeDock();
      }
    };

    window.addEventListener('keydown', handleGlobalKeydown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, [closeDock, isOpen, openDock]);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }

      closeDock();
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [closeDock, isOpen]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const resultCount = searchContext.flatResults.length;

    if (event.key === 'ArrowDown') {
      if (resultCount === 0) {
        return;
      }

      event.preventDefault();
      setSelectedIndex((currentIndex) => Math.min(currentIndex + 1, resultCount - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      if (resultCount === 0) {
        return;
      }

      event.preventDefault();
      setSelectedIndex((currentIndex) => Math.max(currentIndex - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      if (selectedIndex < 0) {
        return;
      }

      event.preventDefault();
      openResult(searchContext.flatResults[selectedIndex]);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDock();
    }
  };

  const activeDescendant =
    selectedIndex >= 0 ? searchResultOptionId(searchContext.flatResults[selectedIndex]?.id) : undefined;

  return (
    <div className="skopos-search-dock-host" aria-live="polite">
      <div
        ref={rootRef}
        className={cn('skopos-search-dock-shell', isOpen && 'skopos-search-dock-shell-open')}
      >
        <div
          className={cn(
            'skopos-search-results-sheet',
            isOpen ? 'skopos-search-results-sheet-open' : 'skopos-search-results-sheet-closed',
          )}
        >
          <div className="skopos-search-results-head">
            <p className="skopos-search-results-title">
              {searchContext.query.isEmpty
                ? 'Search project knowledge'
                : `${searchContext.total} result${searchContext.total === 1 ? '' : 's'}`}
            </p>
            <p className="skopos-search-results-copy">
              Search docs, decisions, missions, plans, issues, and project areas. Filters like{' '}
              <code>mission:</code>, <code>plan:</code>, and <code>doc:</code> also work.
            </p>
          </div>
          {searchContext.groups.length > 0 ? (
            <div
              id="skopos-search-results"
              role="listbox"
              className="skopos-search-results-scroll skopos-scroll"
            >
              {searchContext.groups.map((group, groupIndex) => {
                const offset = countResultsBeforeGroup(searchContext.groups, groupIndex);
                return (
                  <SearchResultGroupBlock
                    key={group.id}
                    group={group}
                    selectedIndex={selectedIndex}
                    selectedOffset={offset}
                    onSelect={setSelectedIndex}
                    onOpen={openResult}
                  />
                );
              })}
            </div>
          ) : (
            <div className="skopos-search-empty-state">
              <p className="skopos-search-empty-title">No exact result</p>
              <p className="skopos-search-empty-copy">
                Try a shorter phrase or narrow the query with a structured filter.
              </p>
            </div>
          )}
        </div>
        <div className="skopos-search-dock">
          <label htmlFor="skopos-search-input" className="sr-only">
            Search Skopos workspace
          </label>
          <span aria-hidden="true" className="skopos-search-dock-icon">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="skopos-search-dock-icon-svg"
            >
              <circle cx="8.5" cy="8.5" r="4.75" />
              <path d="M12.25 12.25 16 16" />
            </svg>
          </span>
          <input
            id="skopos-search-input"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="skopos-search-results"
            aria-activedescendant={activeDescendant}
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setIsOpen(true);
              setQuery(event.target.value);
            }}
            onKeyDown={handleInputKeyDown}
            className="skopos-search-dock-input"
            placeholder="Search docs, scopes, missions, plans..."
            autoComplete="off"
            spellCheck={false}
          />
          <SearchDockShortcut label={shortcutLabel} />
        </div>
      </div>
    </div>
  );
}

function SearchResultGroupBlock({
  group,
  selectedIndex,
  selectedOffset,
  onSelect,
  onOpen,
}: {
  group: SkoposConsoleSearchGroup;
  selectedIndex: number;
  selectedOffset: number;
  onSelect: (index: number) => void;
  onOpen: (result: SkoposConsoleSearchResult) => void;
}): React.JSX.Element {
  return (
    <section className="skopos-search-group">
      <div className="skopos-search-group-head">
        <p className="skopos-search-group-title">{group.label}</p>
        <p className="skopos-search-group-count">{group.total}</p>
      </div>
      <div className="skopos-search-group-results">
        {group.results.map((result, index) => {
          const absoluteIndex = selectedOffset + index;
          return (
            <button
              key={result.id}
              id={searchResultOptionId(result.id)}
              type="button"
              role="option"
              aria-selected={selectedIndex === absoluteIndex}
              className={cn(
                'skopos-search-result-row',
                selectedIndex === absoluteIndex && 'skopos-search-result-row-active',
              )}
              onMouseEnter={() => onSelect(absoluteIndex)}
              onFocus={() => onSelect(absoluteIndex)}
              onClick={() => onOpen(result)}
            >
              <div className="min-w-0">
                <div className="skopos-search-result-title-row">
                  <p className="skopos-search-result-title truncate">{result.title}</p>
                  <span className="skopos-search-kind-badge">
                    {labelForSearchKind(result.kind)}
                  </span>
                </div>
                <p className="skopos-search-result-summary truncate">{result.summary}</p>
              </div>
              <div className="skopos-search-result-aside">
                {result.meta ? <span className="skopos-search-result-meta">{result.meta}</span> : null}
                {result.external ? <span className="skopos-search-result-external">↗</span> : null}
              </div>
            </button>
          );
        })}
      </div>
      {group.truncated ? (
        <p className="skopos-search-group-more">Showing top {group.results.length} of {group.total}.</p>
      ) : null}
    </section>
  );
}

const countResultsBeforeGroup = (
  groups: SkoposConsoleSearchGroup[],
  groupIndex: number,
): number =>
  groups.slice(0, groupIndex).reduce((total, group) => total + group.results.length, 0);

const searchResultOptionId = (resultId?: string): string | undefined =>
  resultId ? `skopos-search-option-${resultId}` : undefined;

function SearchDockShortcut({ label }: { label: string }): React.JSX.Element {
  if (label.startsWith('⌘')) {
    return (
      <span className="skopos-search-dock-shortcut">
        <span className="skopos-search-dock-shortcut-symbol" aria-hidden="true">
          ⌘
        </span>
        <span className="skopos-search-dock-shortcut-key">K</span>
      </span>
    );
  }

  return <span className="skopos-search-dock-shortcut">{label}</span>;
}

const labelForSearchKind = (kind: SkoposConsoleSearchKind): string => {
  switch (kind) {
    case 'decision':
      return 'decision';
    case 'finding':
      return 'finding';
    case 'discussion':
      return 'discussion';
    case 'program':
      return 'program';
    case 'obligation':
      return 'obligation';
    case 'artifact':
      return 'source';
    case 'portal':
      return 'portal';
    case 'report':
      return 'report';
    case 'plan':
      return 'plan';
    case 'mission':
      return 'mission';
    case 'scope':
      return 'scope';
    case 'workflow':
      return 'workflow';
    case 'event':
      return 'event';
    case 'graph':
      return 'map';
    default:
      return kind;
  }
};
