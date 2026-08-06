'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/classnames';
import { NavigationAction, getVisibleNavigationItems } from '@/lib/navigation-action';
import {
  NavigationDrawerItemContent,
  NavigationRailItemContent,
  getNavigationDrawerItemClasses,
  getNavigationRailItemClasses,
} from '@/lib/navigation-visuals';
import type { NavigationItem } from '@/types/navigation';
import { Ripple } from '@/components/ui/ripple';
import { useSidebar } from '@/components/ui/sidebar/context/sidebar-provider';
import { containsNavigationId } from '@/components/ui/sidebar/model/sidebar.state';

interface SidebarNavigationProps {
  items: NavigationItem[];
  showRootIcons?: boolean;
  className?: string;
}

export function SidebarNavigation({
  items,
  showRootIcons = true,
  className,
}: SidebarNavigationProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {getVisibleNavigationItems(items).map((item) => (
        <SidebarNavigationNode key={item.id} item={item} level={0} showRootIcons={showRootIcons} />
      ))}
    </div>
  );
}

function SidebarNavigationNode({
  item,
  level,
  showRootIcons,
}: {
  item: NavigationItem;
  level: number;
  showRootIcons: boolean;
}) {
  const { value, selectItem, renderLink, isGroupExpanded, toggleGroup } = useSidebar();
  const contentId = useId();
  const hasChildren = Boolean(item.items?.length);
  const active = containsNavigationId(item, value);
  const directlyActive = value === item.id;
  const showIcon = level === 0 && showRootIcons;

  if (!hasChildren) {
    return (
      <NavigationAction
        item={item}
        active={active}
        onActivate={(selected) => selectItem(selected, 'drawer')}
        renderLink={renderLink}
        ariaLabel={item.label}
        className={getNavigationDrawerItemClasses({ active, disabled: item.disabled })}
      >
        <NavigationDrawerItemContent
          icon={showIcon ? item.icon : undefined}
          activeIcon={showIcon ? item.activeIcon : undefined}
          badge={item.badge}
          active={active}
          disabled={item.disabled}
          ripple={<Ripple disabled={item.disabled ?? false} />}
        >
          {item.label}
        </NavigationDrawerItemContent>
      </NavigationAction>
    );
  }

  const open = isGroupExpanded(item);
  const content = (
    <NavigationDrawerItemContent
      icon={showIcon ? item.icon : undefined}
      activeIcon={showIcon ? item.activeIcon : undefined}
      badge={item.badge}
      active={active}
      disabled={item.disabled}
      ripple={<Ripple disabled={item.disabled ?? false} />}
    >
      {item.label}
    </NavigationDrawerItemContent>
  );
  const action = item.href ? (
    <NavigationAction
      item={item}
      active={directlyActive}
      onActivate={(selected) => selectItem(selected, 'drawer')}
      renderLink={renderLink}
      ariaLabel={item.label}
      className={cn(
        getNavigationDrawerItemClasses({ active, disabled: item.disabled }),
        'rounded-r-none pr-1',
      )}
    >
      {content}
    </NavigationAction>
  ) : (
    <button
      type="button"
      className={getNavigationDrawerItemClasses({
        active: directlyActive,
        disabled: item.disabled,
      })}
      disabled={item.disabled}
      aria-current={directlyActive ? 'page' : undefined}
      aria-label={item.label}
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => toggleGroup(item)}
    >
      {content}
      <span
        className={cn(
          'material-symbols-outlined duration-medium relative z-10 shrink-0 text-title-medium transition-transform motion-reduce:transition-none',
          open && 'rotate-180',
        )}
        aria-hidden="true"
      >
        expand_more
      </span>
    </button>
  );

  return (
    <div className="flex flex-col">
      {item.href ? (
        <div className="flex items-stretch">
          <div className="min-w-0 flex-1">{action}</div>
          <button
            type="button"
            className="rounded-r-button hover:bg-state-hover focus-visible:ring-focus-ring grid w-10 shrink-0 place-items-center focus-visible:ring-2 focus-visible:outline-none"
            aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label}`}
            aria-expanded={open}
            aria-controls={contentId}
            onClick={() => toggleGroup(item)}
          >
            <span
              className={cn(
                'material-symbols-outlined duration-medium text-title-medium transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            >
              expand_more
            </span>
          </button>
        </div>
      ) : (
        action
      )}
      <div
        id={contentId}
        className={cn(
          'duration-medium grid transition-[grid-template-rows,opacity] motion-reduce:transition-none',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        inert={!open ? true : undefined}
      >
        <div className="overflow-hidden">
          <div className="mt-1 flex flex-col gap-1 pl-4">
            {getVisibleNavigationItems(item.items ?? []).map((child) => (
              <SidebarNavigationNode
                key={child.id}
                item={child}
                level={level + 1}
                showRootIcons={showRootIcons}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollapsedSidebarNavigation({ items }: { items: NavigationItem[] }) {
  const { value, selectItem, renderLink, setExpanded, isGroupExpanded, toggleGroup } =
    useSidebar();

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {getVisibleNavigationItems(items).map((item) => {
        const hasChildren = Boolean(item.items?.length);
        const active = hasChildren ? containsNavigationId(item, value) : value === item.id;
        return (
          <NavigationAction
            key={item.id}
            item={item}
            active={active}
            onActivate={(selected) => {
              if (selected.items?.length) {
                if (!isGroupExpanded(selected)) toggleGroup(selected);
                setExpanded(true);
                return;
              }
              selectItem(selected, 'drawer');
            }}
            renderLink={renderLink}
            className={getNavigationRailItemClasses(item.disabled)}
            ariaLabel={item.label}
            title={item.label}
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
              showLabel={false}
              active={active}
              disabled={item.disabled}
              ripple={<Ripple center disabled={item.disabled} />}
            />
          </NavigationAction>
        );
      })}
    </div>
  );
}
