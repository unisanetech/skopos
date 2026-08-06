'use client';

import React, { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/classnames';
import { Icon, type IconProps } from '@/components/ui/icon';
import { getFieldSizeStyles, type FieldSize } from '@/lib/field-size';

function isIconElement(node: React.ReactNode): node is React.ReactElement<IconProps> {
  return React.isValidElement(node) && node.type === Icon;
}

function normalizeIconNode(
  node: React.ReactNode,
  size: NonNullable<IconProps['size']>,
): React.ReactNode {
  if (!isIconElement(node) || node.props.size !== undefined) {
    return node;
  }
  return React.cloneElement(node, { size });
}

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onTrailingIconClick?: () => void;
  size?: FieldSize;
  iconSize?: NonNullable<IconProps['size']>;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(({
  leadingIcon,
  trailingIcon,
  onTrailingIconClick,
  iconSize,
  className,
  placeholder = 'Search',
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  type,
  size = 'md',
  ...props
}, forwardedRef) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => {
    if (typeof defaultValue === 'string') return defaultValue;
    if (typeof defaultValue === 'number') return String(defaultValue);
    return '';
  });

  const currentValue = useMemo(() => {
    if (!isControlled) return internalValue;
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return '';
  }, [internalValue, isControlled, value]);

  const canClear = !disabled && !readOnly;
  const shouldShowDefaultClear = !trailingIcon && canClear && currentValue.length > 0;
  const fieldSize = getFieldSizeStyles(size);
  const resolvedIconSize: NonNullable<IconProps['size']> =
    iconSize ?? (size === 'lg' ? 'md' : 'sm');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleTrailingAction = () => {
    if (onTrailingIconClick) {
      onTrailingIconClick();
      return;
    }
    if (!shouldShowDefaultClear) return;
    const input = inputRef.current;
    if (!input) return;
    if (!isControlled) {
      setInternalValue('');
    }
    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set;
    valueSetter?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  };

  const trailing = normalizeIconNode(
    trailingIcon ??
      (shouldShowDefaultClear ? <Icon symbol="close" size={resolvedIconSize} /> : null),
    resolvedIconSize,
  );
  const trailingIsAction = Boolean(onTrailingIconClick || shouldShowDefaultClear);
  const resolvedLeadingIcon = normalizeIconNode(
    leadingIcon ?? <Icon symbol="search" size={resolvedIconSize} />,
    resolvedIconSize,
  );

  return (
    <div
      role="search"
      className={cn(
        'group bg-surface-container-low border-control-outline hover:bg-surface-container focus-within:bg-surface-container focus-within:border-primary duration-medium ease-standard relative w-full cursor-text rounded-sm border transition-all',
        fieldSize.containerHeight,
        className,
      )}
    >
      <div
        className={cn(
          'text-on-surface pointer-events-none absolute inset-y-0 left-0 flex items-center',
          fieldSize.searchTriggerPadding,
        )}
      >
        {resolvedLeadingIcon}
      </div>

      <input
        ref={setInputRef}
        type={type ?? 'search'}
        value={value}
        defaultValue={defaultValue}
        onChange={handleInputChange}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          'text-on-surface placeholder:text-on-surface-variant h-full w-full [appearance:textfield] border-none bg-transparent outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          fieldSize.searchText,
          fieldSize.searchInputPaddingLeft,
          trailing
            ? fieldSize.searchInputPaddingRightWithTrailing
            : fieldSize.searchInputPaddingRightWithoutTrailing,
        )}
        placeholder={placeholder}
        {...props}
      />

      {trailing ? (
        trailingIsAction ? (
          <button
            type="button"
            onClick={handleTrailingAction}
            aria-label={shouldShowDefaultClear ? 'Clear search' : 'Search action'}
            className={cn(
              'text-on-surface-variant hover:bg-state-hover hover:text-on-surface focus-visible:outline-focus-ring rounded-icon-button absolute top-1/2 inline-flex -translate-y-1/2 items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2',
              fieldSize.actionInset,
              fieldSize.actionSize,
            )}
          >
            {trailing}
          </button>
        ) : (
          <div
            className={cn(
              'text-on-surface-variant pointer-events-none absolute top-1/2 inline-flex -translate-y-1/2 items-center justify-center',
              fieldSize.passiveTrailingInset,
              fieldSize.passiveTrailingSize,
            )}
          >
            {trailing}
          </div>
        )
      ) : null}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
