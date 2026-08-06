import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';

import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { List, ListItem } from '@/components/ui/list';
import { SearchBar } from '@/components/ui/search-bar';
import { Typography } from '@/components/ui/typography';
import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
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

export function ProjectSearchDialog({
  state,
  currentPath,
  openSignal = 0,
}: {
  state: SkoposUiConsoleState;
  currentPath: string;
  openSignal?: number;
}): React.JSX.Element {
  const navigate = useNavigate();
  const shortcutLabel = React.useMemo(() => getSkoposSearchShortcutLabel(), []);
  const lastOpenSignalRef = React.useRef(openSignal);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
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

  const closeDock = React.useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const openDock = React.useCallback((options?: { clearQuery?: boolean }) => {
    setIsOpen(true);
    if (options?.clearQuery) {
      setQuery('');
    }
    setSelectedIndex(0);
  }, []);

  const openResult = React.useCallback(
    (result: SkoposConsoleSearchResult | undefined) => {
      if (!result || typeof window === 'undefined') {
        return;
      }

      setIsOpen(false);
      setQuery('');
      setSelectedIndex(0);

      if (result.external) {
        window.location.assign(new URL(result.href, window.location.href).toString());
        return;
      }

      void navigate({ href: result.href });
    },
    [navigate],
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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) openDock();
        else closeDock();
      }}
      title="Search your project"
      description="Find the exact task, decision, document, issue, or project area."
      mobilePresentation="fullscreen"
      className="md:max-w-3xl"
      contentClassName="p-0"
      initialFocusRef={searchInputRef}
    >
      <div className="border-b border-outline-weak bg-surface-container-low p-4">
        <label htmlFor="skopos-search-input" className="sr-only">
          Search Skopos workspace
        </label>
        <SearchBar
          ref={searchInputRef}
          id="skopos-search-input"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="skopos-search-results"
          aria-activedescendant={activeDescendant}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search docs, scopes, tasks, plans..."
          autoComplete="off"
          spellCheck={false}
          size="lg"
          trailingIcon={<span className="text-label-small">{shortcutLabel}</span>}
        />
        <Typography variant="bodySmall" className="mt-2 text-on-surface-variant">
          Filters such as <code>task:</code>, <code>plan:</code>, and <code>doc:</code> also work.
        </Typography>
      </div>
      <div aria-live="polite">
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <Typography variant="labelMedium" className="text-on-surface-variant">
            {searchContext.query.isEmpty
              ? 'Start here'
              : `${searchContext.total} result${searchContext.total === 1 ? '' : 's'}`}
          </Typography>
          {!searchContext.query.isEmpty ? (
            <Badge variant="tonal" color="secondary" size="sm">
              {searchContext.total}
            </Badge>
          ) : null}
        </div>
          {searchContext.groups.length > 0 ? (
            <div
              id="skopos-search-results"
              role="listbox"
              className="skopos-scroll max-h-[55dvh] overflow-y-auto border-t border-outline-weak"
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
            <div className="p-5">
              <Alert variant="info" title="Nothing matched that search">
                Try fewer words, a Task id, or a filter such as <code>task:</code>.
              </Alert>
            </div>
          )}
      </div>
    </Dialog>
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
    <section className="border-b border-outline-weak last:border-b-0">
      <div className="flex items-center justify-between gap-3 bg-surface-container-low px-5 py-2">
        <Typography variant="labelSmall" className="text-on-surface-variant">
          {group.label}
        </Typography>
        <Badge variant="tonal" color="secondary" size="sm">
          {group.total}
        </Badge>
      </div>
      <List className="py-0">
        {group.results.map((result, index) => {
          const absoluteIndex = selectedOffset + index;
          return (
            <ListItem
              key={result.id}
              id={searchResultOptionId(result.id)}
              role="option"
              aria-selected={selectedIndex === absoluteIndex}
              selected={selectedIndex === absoluteIndex}
              headline={result.title}
              supportingText={result.summary}
              trailing={
                <span className="flex items-center gap-2">
                  <Badge variant="tonal" color="secondary" size="sm">
                    {labelForSearchKind(result.kind)}
                  </Badge>
                  {result.meta ? (
                    <Typography
                      variant="labelSmall"
                      className="hidden max-w-36 truncate text-on-surface-variant md:block"
                    >
                      {result.meta}
                    </Typography>
                  ) : null}
                  {result.external ? <Icon symbol="open_in_new" size="sm" /> : null}
                </span>
              }
              onMouseEnter={() => onSelect(absoluteIndex)}
              onFocus={() => onSelect(absoluteIndex)}
              onClick={() => onOpen(result)}
            />
          );
        })}
      </List>
      {group.truncated ? (
        <Typography variant="bodySmall" className="px-5 py-2 text-on-surface-variant">
          Showing top {group.results.length} of {group.total}.
        </Typography>
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

const labelForSearchKind = (kind: SkoposConsoleSearchKind): string => {
  switch (kind) {
    case 'decision':
      return 'decision';
    case 'finding':
      return 'finding';
    case 'discussion':
      return 'discussion';
    case 'artifact':
      return 'source';
    case 'portal':
      return 'portal';
    case 'report':
      return 'report';
    case 'plan':
      return 'plan';
    case 'task':
      return 'task';
    case 'scope':
      return 'scope';
    case 'action':
      return 'action';
    case 'event':
      return 'event';
    case 'graph':
      return 'map';
    default:
      return kind;
  }
};
