import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  filled?: boolean;
  symbol?: string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square' | 'inherit';
  strokeLinejoin?: 'miter' | 'round' | 'bevel' | 'inherit';
}

export const Icon = forwardRef<HTMLElement, IconProps>(
  (
    {
      size = 'md',
      filled = false,
      symbol,
      className,
      children,
      style,
      viewBox = '0 0 24 24',
      ...props
    },
    ref,
  ) => {
    const isScale = typeof size === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(size);
    const hasExplicitAccessibility =
      props['aria-hidden'] !== undefined ||
      props['aria-label'] !== undefined ||
      props.role !== undefined;
    const accessibilityProps = hasExplicitAccessibility ? {} : { 'aria-hidden': 'true' as const };

    const isSymbol =
      symbol ||
      (typeof children === 'string' && children.trim().length > 0 && !children.includes('<'));

    const iconSize = isScale ? size : undefined;
    const sizeClasses = iconSize
      ? {
          xs: 'size-icon-xs text-[var(--icon-xs)]',
          sm: 'size-icon-sm text-[var(--icon-sm)]',
          md: 'size-icon-md text-[var(--icon-md)]',
          lg: 'size-icon-lg text-[var(--icon-lg)]',
          xl: 'size-icon-xl text-[var(--icon-xl)]',
        }[iconSize]
      : '';
    const opticalSize = iconSize
      ? {
          xs: 20,
          sm: 20,
          md: 24,
          lg: 32,
          xl: 48,
        }[iconSize]
      : 24;
    const resolvedFontSize = isScale ? `var(--icon-${iconSize})` : size;

    if (isSymbol) {
      const iconName = symbol || children;
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={cn(
            'material-symbols-outlined inline-flex shrink-0 items-center justify-center align-middle leading-none select-none',
            isScale && sizeClasses,
            className,
          )}
          style={{
            fontSize: resolvedFontSize,
            lineHeight: 1,
            width: !isScale ? size : undefined,
            height: !isScale ? size : undefined,
            fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${opticalSize}`,
            ...style,
          }}
          {...accessibilityProps}
          {...props}
        >
          {iconName}
        </span>
      );
    }

    return (
      <svg
        ref={ref as React.Ref<SVGSVGElement>}
        xmlns="http://www.w3.org/2000/svg"
        width={!isScale ? size : undefined}
        height={!isScale ? size : undefined}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('inline-block shrink-0', isScale && sizeClasses, className)}
        style={style}
        {...accessibilityProps}
        {...(props as React.SVGProps<SVGSVGElement>)}
      >
        {children}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';

export const CheckIcon = (props: Omit<IconProps, 'symbol'>) => <Icon symbol="check" {...props} />;
export const ChevronRightIcon = (props: Omit<IconProps, 'symbol'>) => (
  <Icon symbol="chevron_right" {...props} />
);
export const CloseIcon = (props: Omit<IconProps, 'symbol'>) => <Icon symbol="close" {...props} />;
export const MenuIcon = (props: Omit<IconProps, 'symbol'>) => <Icon symbol="menu" {...props} />;
