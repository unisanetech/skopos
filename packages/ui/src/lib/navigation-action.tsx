'use client';

import React, { useCallback } from 'react';
import { useControllableState } from '@/lib/use-controllable-state';
import type {
  NavigationItem,
  NavigationLinkRenderer,
  NavigationPresentationProps,
} from '@/types/navigation';

interface NavigationActionProps {
  item: NavigationItem;
  active: boolean;
  className: string;
  children: React.ReactNode;
  renderLink?: NavigationLinkRenderer;
  onActivate: (item: NavigationItem) => void;
  ariaLabel?: string;
  title?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
}

export function NavigationAction({
  item,
  active,
  className,
  children,
  renderLink,
  onActivate,
  ariaLabel,
  title,
  onMouseEnter,
}: NavigationActionProps) {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    onActivate(item);
  };

  const commonProps = {
    className,
    onClick: handleClick,
    'aria-current': active ? ('page' as const) : undefined,
    'aria-disabled': item.disabled || undefined,
    'aria-label': ariaLabel,
    title,
    onMouseEnter,
  };

  if (item.href && !item.disabled && renderLink) {
    return renderLink(item, {
      ...commonProps,
      href: item.href,
      target: item.external ? '_blank' : undefined,
      rel: item.external ? 'noopener noreferrer' : undefined,
      children,
    });
  }

  if (item.href) {
    return (
      <a
        {...commonProps}
        href={item.disabled ? undefined : item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        tabIndex={item.disabled ? -1 : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps} type="button" disabled={item.disabled}>
      {children}
    </button>
  );
}

export function useNavigationSelection({
  value,
  defaultValue = null,
  onValueChange,
  onItemSelect,
}: Pick<NavigationPresentationProps, 'value' | 'defaultValue' | 'onValueChange' | 'onItemSelect'>) {
  const [currentValue, setCurrentValue] = useControllableState<string | null>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const selectItem = useCallback(
    (item: NavigationItem) => {
      if (item.disabled) return;
      setCurrentValue(item.id);
      onItemSelect?.(item);
    },
    [onItemSelect, setCurrentValue],
  );

  return { currentValue, selectItem };
}

export function getVisibleNavigationItems(items: NavigationItem[]) {
  return items.filter((item) => !item.hidden);
}
