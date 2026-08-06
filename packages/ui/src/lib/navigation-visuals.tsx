import React from 'react';
import { cn } from '@/lib/classnames';
import { Icon, type IconProps } from '@/components/ui/icon';

export interface NavigationIconProps {
  icon: React.ReactNode | string;
  active?: boolean;
  size?: NonNullable<IconProps['size']>;
  className?: string;
}

export function NavigationIcon({
  icon,
  active = false,
  size = 'sm',
  className,
}: NavigationIconProps) {
  if (typeof icon === 'string') {
    return <Icon symbol={icon} filled={active} size={size} className={className} />;
  }

  return <>{icon}</>;
}

export function getNavigationRailItemClasses(disabled?: boolean, className?: string) {
  return cn(
    'relative flex min-h-12 w-full cursor-pointer flex-col items-center gap-0.5 rounded-button py-1 outline-none select-none',
    'focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
    disabled && 'pointer-events-none cursor-not-allowed opacity-38',
    className,
  );
}

interface NavigationRailItemContentProps {
  icon: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: string | number;
  label: string;
  showLabel?: boolean;
  active: boolean;
  disabled?: boolean;
  ripple?: React.ReactNode;
}

export function NavigationRailItemContent({
  icon,
  activeIcon,
  badge,
  label,
  showLabel = true,
  active,
  disabled,
  ripple,
}: NavigationRailItemContentProps) {
  return (
    <>
      <div
        className="relative flex items-center justify-center"
        data-disabled={disabled ? 'true' : undefined}
      >
        <div
          className={cn(
            'rounded-button duration-medium ease-emphasized relative flex h-8 w-14 items-center justify-center overflow-hidden transition-all',
            active
              ? 'bg-state-selected text-on-surface'
              : 'text-on-surface-variant hover:bg-state-hover bg-transparent',
          )}
        >
          {ripple}
          <span className="relative z-10 flex items-center justify-center">
            <NavigationIcon
              icon={active && activeIcon ? activeIcon : icon}
              active={active}
              size="md"
            />
          </span>
        </div>

        {badge !== undefined && (
          <span
            className={cn(
              'bg-error text-on-error ring-surface text-label-small pointer-events-none absolute -top-0.5 -right-0.5 z-20 flex h-3 min-w-3 items-center justify-center rounded-full px-0.5 leading-none font-medium ring-1',
              typeof badge === 'number' && badge < 10 && 'h-2 min-w-2 p-0.5',
            )}
            role="status"
            aria-label={typeof badge === 'number' ? `${badge} notifications` : String(badge)}
          >
            {badge}
          </span>
        )}
      </div>

      {showLabel ? (
        <span
          className={cn(
            'text-label-small duration-short max-w-full px-0.5 text-center transition-colors',
            active ? 'text-on-surface font-bold' : 'text-on-surface-variant font-medium',
          )}
        >
          {label}
        </span>
      ) : null}
    </>
  );
}

export function getNavigationDrawerItemClasses(args: {
  active?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { active, disabled, className } = args;

  return cn(
    'relative flex w-full min-h-10 items-center justify-start gap-3 rounded-button px-4 py-2',
    'text-body-medium text-left transition-colors duration-short select-none overflow-hidden outline-none',
    'focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset',
    active
      ? 'bg-state-selected text-on-surface font-medium'
      : 'text-on-surface-variant font-medium hover:bg-state-hover hover:text-on-surface',
    disabled && 'opacity-38 cursor-not-allowed pointer-events-none',
    className,
  );
}

interface NavigationDrawerItemContentProps {
  icon?: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: React.ReactNode | string | number;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  ripple?: React.ReactNode;
}

export function NavigationDrawerItemContent({
  icon,
  activeIcon,
  badge,
  active,
  children,
  ripple,
}: NavigationDrawerItemContentProps) {
  return (
    <>
      {ripple}

      {icon && (
        <span className="size-icon-sm relative z-10 flex shrink-0 items-center justify-center">
          <NavigationIcon
            icon={active && activeIcon ? activeIcon : icon}
            active={!!active}
            size="sm"
          />
        </span>
      )}

      <span className="relative z-10 flex-1 truncate text-left">{children}</span>

      {badge && (
        <span className="relative z-10 ml-auto">
          {typeof badge === 'string' || typeof badge === 'number' ? (
            <span className="text-label-small text-on-surface-variant inline-block min-w-5 px-1.5 py-0.5 text-center font-medium">
              {badge}
            </span>
          ) : (
            badge
          )}
        </span>
      )}
    </>
  );
}
