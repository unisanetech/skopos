'use client';

import * as React from 'react';
import { actionFrameHeightClasses, actionFramePaddingXClasses } from '@/lib/action-size';
import { cn } from '@/lib/classnames';
import { useControllableState } from '@/lib/use-controllable-state';
import { Icon, type IconProps } from '@/components/ui/icon';
import { Ripple } from '@/components/ui/ripple';

export interface SegmentedButtonOption<Value extends string = string> {
  value: Value;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export type SegmentedButtonSize = 'sm' | 'md' | 'lg';

type AccessibleGroupName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string };

type SegmentedButtonCommonProps<Value extends string = string> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange' | 'onSelect' | 'role'
> &
  AccessibleGroupName & {
    iconSize?: NonNullable<IconProps['size']>;
    options: readonly SegmentedButtonOption<Value>[];
    size?: SegmentedButtonSize;
  };

export type SegmentedButtonSingleProps<Value extends string = string> =
  SegmentedButtonCommonProps<Value> & {
    selectionMode?: 'single';
    value?: NoInfer<Value> | null;
    defaultValue?: NoInfer<Value> | null;
    onValueChange?: (value: NoInfer<Value>) => void;
  };

export type SegmentedButtonMultipleProps<Value extends string = string> =
  SegmentedButtonCommonProps<Value> & {
    selectionMode: 'multiple';
    value?: NoInfer<Value>[];
    defaultValue?: NoInfer<Value>[];
    onValueChange?: (value: NoInfer<Value>[]) => void;
  };

export type SegmentedButtonProps<Value extends string = string> =
  | SegmentedButtonSingleProps<Value>
  | SegmentedButtonMultipleProps<Value>;

type SegmentedButtonRootProps<Value extends string = string> = SegmentedButtonCommonProps<Value> & {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  isSelected: (value: Value) => boolean;
  onOptionSelect: (value: Value) => void;
  selectionMode: 'single' | 'multiple';
};

function isIconElement(node: React.ReactNode): node is React.ReactElement<IconProps> {
  return React.isValidElement(node) && node.type === Icon;
}

function normalizeIconNode(
  node: React.ReactNode,
  size: NonNullable<IconProps['size']>,
): React.ReactNode {
  if (!isIconElement(node) || node.props.size !== undefined) return node;
  return React.cloneElement(node, { size });
}

function getDefaultIconSize(size: SegmentedButtonSize): NonNullable<IconProps['size']> {
  return size === 'lg' ? 'md' : 'sm';
}

function getSegmentedButtonSizeStyles(size: SegmentedButtonSize) {
  return {
    containerHeight: actionFrameHeightClasses[size],
    itemGap: 'gap-2.5',
    itemPaddingX: actionFramePaddingXClasses[size],
    itemText: size === 'sm' ? 'text-label-medium' : 'text-label-large',
    iconClass: size === 'lg' ? 'size-icon-md' : 'size-icon-sm',
    checkWidth: size === 'lg' ? 'w-[var(--icon-md)]' : 'w-[var(--icon-sm)]',
    checkClass: size === 'lg' ? 'size-icon-md' : 'size-icon-sm',
    checkStrokeWidth: size === 'sm' ? 3 : 4,
  };
}

function getDirection(event: React.KeyboardEvent<HTMLButtonElement>): 'ltr' | 'rtl' {
  const localDirection = event.currentTarget.closest('[dir]')?.getAttribute('dir');
  const documentDirection = document.documentElement.getAttribute('dir');
  return localDirection === 'rtl' || documentDirection === 'rtl' ? 'rtl' : 'ltr';
}

function SegmentedButtonRoot<Value extends string>({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
  forwardedRef,
  iconSize,
  isSelected,
  onOptionSelect,
  options,
  selectionMode,
  size = 'md',
  ...groupProps
}: SegmentedButtonRootProps<Value>) {
  const sizeStyles = getSegmentedButtonSizeStyles(size);
  const resolvedIconSize = iconSize ?? getDefaultIconSize(size);
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex((option) => !option.disabled && isSelected(option.value));
  const firstEnabledIndex = options.findIndex((option) => !option.disabled);
  const [tabStopIndex, setTabStopIndex] = React.useState(
    selectedIndex === -1 ? firstEnabledIndex : selectedIndex,
  );

  React.useEffect(() => {
    if (selectionMode === 'single') {
      setTabStopIndex(selectedIndex === -1 ? firstEnabledIndex : selectedIndex);
    }
  }, [firstEnabledIndex, selectedIndex, selectionMode]);

  const resolvedTabStopIndex = options[tabStopIndex]?.disabled
    ? selectedIndex === -1
      ? firstEnabledIndex
      : selectedIndex
    : tabStopIndex;

  const getNextEnabledIndex = React.useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (options.length === 0) return -1;
      let index = startIndex;
      for (let attempt = 0; attempt < options.length; attempt += 1) {
        index = (index + direction + options.length) % options.length;
        if (!options[index]?.disabled) return index;
      }
      return -1;
    },
    [options],
  );

  const moveFocus = (index: number) => {
    if (index === -1) return;
    setTabStopIndex(index);
    buttonRefs.current[index]?.focus();
    if (selectionMode === 'single') {
      const value = options[index]?.value;
      if (value !== undefined) onOptionSelect(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = getDirection(event);
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        moveFocus(getNextEnabledIndex(index, direction === 'rtl' ? -1 : 1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus(getNextEnabledIndex(index, direction === 'rtl' ? 1 : -1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(getNextEnabledIndex(index, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(getNextEnabledIndex(index, -1));
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(getNextEnabledIndex(-1, 1));
        break;
      case 'End':
        event.preventDefault();
        moveFocus(getNextEnabledIndex(0, -1));
        break;
      case ' ':
      case 'Enter': {
        event.preventDefault();
        const value = options[index]?.value;
        if (value !== undefined) onOptionSelect(value);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      {...groupProps}
      ref={forwardedRef}
      className={cn(
        'border-control-outline rounded-button relative isolate inline-flex max-w-full overflow-hidden border',
        sizeStyles.containerHeight,
        className,
      )}
      role={selectionMode === 'single' ? 'radiogroup' : 'group'}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {options.map((option, index) => {
        const selected = isSelected(option.value);
        const isLast = index === options.length - 1;

        return (
          <button
            key={option.value}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            disabled={option.disabled}
            tabIndex={index === resolvedTabStopIndex ? 0 : -1}
            role={selectionMode === 'single' ? 'radio' : 'checkbox'}
            aria-checked={selected}
            onFocus={() => setTabStopIndex(index)}
            onClick={() => onOptionSelect(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'focus-visible:outline-focus-ring relative flex h-full min-w-fit flex-1 items-center justify-center leading-none font-medium whitespace-nowrap transition-all select-none focus-visible:z-10 focus-visible:outline-2',
              sizeStyles.itemGap,
              sizeStyles.itemPaddingX,
              sizeStyles.itemText,
              !isLast && 'border-control-outline border-r',
              option.disabled && 'text-on-surface cursor-not-allowed bg-transparent opacity-38',
              selected && !option.disabled
                ? 'bg-secondary-container text-on-secondary-container'
                : 'text-on-surface-variant bg-surface hover:bg-surface-container-high',
              option.className,
            )}
          >
            <Ripple disabled={option.disabled} />
            <span
              aria-hidden="true"
              className={cn(
                'duration-medium ease-emphasized flex items-center justify-center overflow-hidden transition-all',
                selected ? `${sizeStyles.checkWidth} opacity-100` : 'w-0 opacity-0',
              )}
            >
              <svg
                className={sizeStyles.checkClass}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={sizeStyles.checkStrokeWidth}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>

            {option.icon && !selected ? (
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 flex items-center justify-center',
                  sizeStyles.iconClass,
                )}
              >
                {normalizeIconNode(option.icon, resolvedIconSize)}
              </span>
            ) : null}

            <span className="relative z-10 truncate leading-none">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SegmentedButtonSingle<Value extends string>({
  defaultValue,
  onValueChange,
  // The discriminant is consumed by the wrapper and must not reach the root element.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectionMode: _selectionMode,
  value,
  forwardedRef,
  ...commonProps
}: SegmentedButtonSingleProps<Value> & { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const [currentValue, setCurrentValue] = useControllableState<Value | null>({
    value,
    defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== null) onValueChange?.(nextValue);
    },
  });

  return (
    <SegmentedButtonRoot
      {...commonProps}
      forwardedRef={forwardedRef}
      selectionMode="single"
      isSelected={(optionValue) => currentValue === optionValue}
      onOptionSelect={setCurrentValue}
    />
  );
}

function SegmentedButtonMultiple<Value extends string>({
  defaultValue = [],
  onValueChange,
  // The discriminant is consumed by the wrapper and must not reach the root element.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectionMode: _selectionMode,
  value,
  forwardedRef,
  ...commonProps
}: SegmentedButtonMultipleProps<Value> & { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const [currentValue = [], setCurrentValue] = useControllableState<Value[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <SegmentedButtonRoot
      {...commonProps}
      forwardedRef={forwardedRef}
      selectionMode="multiple"
      isSelected={(optionValue) => currentValue.includes(optionValue)}
      onOptionSelect={(optionValue) => {
        setCurrentValue(
          currentValue.includes(optionValue)
            ? currentValue.filter((item) => item !== optionValue)
            : [...currentValue, optionValue],
        );
      }}
    />
  );
}

const SegmentedButtonBase = React.forwardRef<HTMLDivElement, SegmentedButtonProps>(
  (props, forwardedRef) => {
    if (props.selectionMode === 'multiple') {
      return <SegmentedButtonMultiple {...props} forwardedRef={forwardedRef} />;
    }
    return <SegmentedButtonSingle {...props} forwardedRef={forwardedRef} />;
  },
);

SegmentedButtonBase.displayName = 'SegmentedButton';

type SegmentedButtonComponent = <Value extends string = string>(
  props: SegmentedButtonProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;

export const SegmentedButton = SegmentedButtonBase as SegmentedButtonComponent;
