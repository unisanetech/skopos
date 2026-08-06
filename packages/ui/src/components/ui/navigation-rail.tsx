'use client';

import React from 'react';
import { cn } from '@/lib/classnames';
import {
  getVisibleNavigationItems,
  NavigationAction,
  useNavigationSelection,
} from '@/lib/navigation-action';
import {
  NavigationRailItemContent,
  getNavigationRailItemClasses,
} from '@/lib/navigation-visuals';
import type { NavigationPresentationProps } from '@/types/navigation';
import { Ripple } from '@/components/ui/ripple';

export type NavigationRailLabelVisibility = 'always' | 'selected' | 'hidden';

export interface NavigationRailProps
  extends NavigationPresentationProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'defaultValue' | 'onSelect'> {
  'aria-label': string;
  onItemHover?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  alignment?: 'start' | 'center' | 'end';
  labelVisibility?: NavigationRailLabelVisibility;
}

export function NavigationRail({
  items,
  value,
  defaultValue,
  onValueChange,
  onItemSelect,
  renderLink,
  onItemHover,
  header,
  footer,
  className,
  alignment = 'start',
  labelVisibility = 'always',
  'aria-label': ariaLabel,
  onMouseLeave,
  ...props
}: NavigationRailProps) {
  const { currentValue, selectItem } = useNavigationSelection({
    value,
    defaultValue,
    onValueChange,
    onItemSelect,
  });

  return (
    <nav
      className={cn(
        'border-outline-soft bg-surface-container-low text-on-surface duration-medium ease-standard z-50 flex h-full w-24 shrink-0 flex-col items-center gap-1 border-r py-3 transition-all',
        className,
      )}
      aria-label={ariaLabel}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {header ? <div className="flex w-full flex-col items-center gap-4 pb-2">{header}</div> : null}

      <div
        className={cn(
          'flex w-full flex-1 flex-col items-center gap-3',
          alignment === 'center' && 'justify-center',
          alignment === 'end' && 'justify-end pb-4',
        )}
      >
        {getVisibleNavigationItems(items).map((item) => {
          const active = currentValue === item.id;
          const showLabel =
            labelVisibility === 'always' || (labelVisibility === 'selected' && active);
          const tooltip = labelVisibility === 'hidden' ? item.label : undefined;

          return (
            <NavigationAction
              key={item.id}
              item={item}
              active={active}
              onActivate={selectItem}
              renderLink={renderLink}
              className={getNavigationRailItemClasses(item.disabled)}
              ariaLabel={showLabel ? undefined : item.label}
              title={tooltip}
              onMouseEnter={() => !item.disabled && onItemHover?.(item.id)}
            >
              <NavigationRailItemContent
                icon={item.icon ?? 'circle'}
                activeIcon={item.activeIcon}
                badge={
                  typeof item.badge === 'string' || typeof item.badge === 'number'
                    ? item.badge
                    : undefined
                }
                label={item.label}
                showLabel={showLabel}
                active={active}
                disabled={item.disabled}
                ripple={<Ripple center disabled={item.disabled} />}
              />
            </NavigationAction>
          );
        })}
      </div>

      {footer ? (
        <div className="mt-auto mb-4 flex w-full flex-col items-center gap-4 pt-2">{footer}</div>
      ) : null}
    </nav>
  );
}
