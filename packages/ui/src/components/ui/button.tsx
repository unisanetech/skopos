'use client';

import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type Ref,
  forwardRef,
  isValidElement,
  cloneElement,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Ripple } from '@/components/ui/ripple';
import { Icon, type IconProps } from '@/components/ui/icon';
import { cn } from '@/lib/classnames';
import { Slot } from '@/lib/slot';
import { actionButtonSizeClasses, getIconFrameSizeClass } from '@/lib/action-size';
import {
  ActionSpinner,
  ActionStateLayer,
  actionInteractiveClass,
  getActionDisabledState,
  getActionStateAttributes,
  getActionAsChildAttributes,
} from '@/lib/action-control';

function isIconElement(node: ReactNode): node is ReactElement<IconProps> {
  return isValidElement(node) && node.type === Icon;
}

function normalizeIconNode(node: ReactNode, size: NonNullable<IconProps['size']>): ReactNode {
  if (!isIconElement(node) || node.props.size !== undefined) {
    return node;
  }
  return cloneElement(node, { size });
}

function shouldOpticallyAlignIcon(node: ReactNode): boolean {
  return (
    isIconElement(node) &&
    (node.props.symbol !== undefined || typeof node.props.children === 'string')
  );
}

const buttonVariants = cva(
  `relative inline-flex items-center justify-center gap-2.5 rounded-button whitespace-nowrap font-medium leading-none transition-all duration-short ease-standard ${actionInteractiveClass}`,
  {
    variants: {
      variant: {
        filled: 'bg-primary text-on-primary',
        tonal: 'bg-secondary-container text-on-secondary-container',
        outlined:
          'border border-outline-subtle text-on-surface bg-transparent focus-visible:border-primary',
        text: 'text-primary bg-transparent',
        elevated: 'bg-surface-container-low text-primary shadow-1',
      },
      size: {
        sm: actionButtonSizeClasses.sm,
        md: actionButtonSizeClasses.md,
        lg: actionButtonSizeClasses.lg,
      },
    },
    defaultVariants: {
      variant: 'filled',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  iconSize?: NonNullable<IconProps['size']>;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'filled',
      size = 'md',
      disabled = false,
      loading = false,
      leadingIcon,
      trailingIcon,
      iconSize,
      className = '',
      type = 'button',
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = getActionDisabledState(disabled, loading);
    const canRenderAsChild = asChild && isValidElement(children);
    const buttonClasses = cn(buttonVariants({ variant, size }), className);
    const resolvedIconSize: NonNullable<IconProps['size']> =
      iconSize ?? (size === 'lg' ? 'md' : 'sm');
    const iconSizeClass = getIconFrameSizeClass(resolvedIconSize);
    const resolvedIcon = normalizeIconNode(leadingIcon, resolvedIconSize);
    const resolvedTrailingIcon = normalizeIconNode(trailingIcon, resolvedIconSize);
    const iconOpticalClass = shouldOpticallyAlignIcon(resolvedIcon) ? '-translate-y-px' : '';
    const trailingIconOpticalClass = shouldOpticallyAlignIcon(resolvedTrailingIcon)
      ? '-translate-y-px'
      : '';

    const renderContent = (content: ReactNode) => (
      <>
        <ActionStateLayer className="duration-snappy" />
        <Ripple disabled={isDisabled} />
        {loading && <ActionSpinner className={`${iconSizeClass} relative z-10`} />}

        {!loading && resolvedIcon && (
          <span
            className={cn(
              iconSizeClass,
              'pointer-events-none relative z-10 flex shrink-0 items-center justify-center',
              iconOpticalClass,
            )}
          >
            {resolvedIcon}
          </span>
        )}

        <span
          className={cn(
            'pointer-events-none relative z-10 inline-flex items-center justify-center gap-2',
            loading ? 'opacity-0' : 'opacity-100',
          )}
        >
          {content}
        </span>

        {!loading && resolvedTrailingIcon && (
          <span
            className={cn(
              iconSizeClass,
              'pointer-events-none relative z-10 flex shrink-0 items-center justify-center',
              trailingIconOpticalClass,
            )}
          >
            {resolvedTrailingIcon}
          </span>
        )}
      </>
    );

    if (canRenderAsChild) {
      const childElement = children as ReactElement<Record<string, unknown>>;
      const childProps = childElement.props as {
        children?: ReactNode;
        onClick?: (event: MouseEvent<HTMLElement>) => void;
        tabIndex?: number;
      };
      const forwardedChildProps = getActionAsChildAttributes(
        isDisabled,
        loading,
        props as Record<string, unknown> & {
          onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
          tabIndex?: number | undefined;
        },
        childProps,
      );

      return (
        <Slot ref={ref as Ref<HTMLElement>} className={buttonClasses}>
          {cloneElement(childElement, forwardedChildProps, renderContent(childProps.children))}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        {...getActionStateAttributes(isDisabled, loading)}
        {...props}
      >
        {renderContent(children)}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { buttonVariants };
