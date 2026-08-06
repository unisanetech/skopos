import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Ripple } from '@/components/ui/ripple';
import { cn } from '@/lib/classnames';
import { Slot } from '@/lib/slot';
import { getIconFrameSizeClass, iconButtonSizeClasses } from '@/lib/action-size';
import { Icon, type IconProps } from '@/components/ui/icon';
import {
  ActionSpinner,
  ActionStateLayer,
  actionInteractiveClass,
  getActionAsChildAttributes,
  getActionDisabledState,
  getActionStateAttributes,
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

const iconButtonVariants = cva(
  `relative inline-flex items-center justify-center rounded-icon-button transition-all duration-snappy ease-emphasized ${actionInteractiveClass}`,
  {
    variants: {
      variant: {
        filled: 'bg-primary text-on-primary',
        tonal: 'bg-secondary-container text-on-secondary-container',
        outlined: 'bg-transparent border border-outline-subtle text-on-surface-variant',
        standard: 'bg-transparent text-on-surface-variant',
      },
      size: {
        sm: iconButtonSizeClasses.sm,
        md: iconButtonSizeClasses.md,
        lg: iconButtonSizeClasses.lg,
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'tonal',
        selected: true,
        className: 'bg-secondary-container text-on-secondary-container',
      },
      {
        variant: 'outlined',
        selected: true,
        className: 'bg-state-selected border-primary text-primary',
      },
      { variant: 'standard', selected: true, className: 'text-primary' },
    ],
    defaultVariants: {
      variant: 'standard',
      size: 'md',
      selected: false,
    },
  },
);

type IconButtonBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> &
  VariantProps<typeof iconButtonVariants> & {
    'aria-label': string;
    loading?: boolean;
    iconSize?: NonNullable<IconProps['size']>;
  };

type NativeIconButtonProps = IconButtonBaseProps & {
  asChild?: false;
  icon: ReactNode;
  children?: never;
};

type SlottedIconButtonProps = IconButtonBaseProps & {
  asChild: true;
  children: ReactElement;
  icon?: ReactNode;
};

export type IconButtonProps = NativeIconButtonProps | SlottedIconButtonProps;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      children,
      variant = 'standard',
      size = 'md',
      selected,
      disabled = false,
      loading = false,
      iconSize,
      asChild = false,
      'aria-label': ariaLabel,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isSelected = selected ?? false;
    const isDisabled = getActionDisabledState(disabled, loading);
    const canRenderAsChild = asChild && isValidElement(children);
    const resolvedIconSize: NonNullable<IconProps['size']> =
      iconSize ?? (size === 'sm' ? 'sm' : 'md');
    const resolvedContent = normalizeIconNode(icon, resolvedIconSize);
    const renderContent = (content: ReactNode) => {
      const sizeClass = getIconFrameSizeClass(resolvedIconSize);
      const normalizedContent = normalizeIconNode(content, resolvedIconSize);
      const iconOpticalClass = shouldOpticallyAlignIcon(normalizedContent) ? '-translate-y-px' : '';

      return (
        <>
          <ActionStateLayer className="z-0" />
          <Ripple center disabled={isDisabled} />
          {loading ? (
            <ActionSpinner className={cn('relative z-10', sizeClass)} />
          ) : (
            <span
              className={cn(
                'relative z-10 flex items-center justify-center',
                sizeClass,
                iconOpticalClass,
              )}
            >
              {normalizedContent}
            </span>
          )}
        </>
      );
    };

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
        <Slot
          ref={ref as Ref<HTMLElement>}
          className={cn(iconButtonVariants({ variant, size, selected: isSelected }), className)}
          aria-label={ariaLabel}
          aria-pressed={selected === undefined ? undefined : isSelected}
        >
          {cloneElement(
            childElement,
            forwardedChildProps,
            renderContent(childProps.children ?? icon),
          )}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ variant, size, selected: isSelected }), className)}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-pressed={selected === undefined ? undefined : isSelected}
        {...getActionStateAttributes(isDisabled, loading)}
        {...props}
      >
        {renderContent(resolvedContent)}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
