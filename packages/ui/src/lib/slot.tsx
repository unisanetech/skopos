import React, { cloneElement, isValidElement } from 'react';

import { cn } from '@/lib/classnames';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    return cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...props,
      ...childProps,
      ref,
      className: cn(props.className, childProps.className as string | undefined),
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    const childType =
      children === null
        ? 'null'
        : children === undefined
          ? 'undefined'
          : Array.isArray(children)
            ? 'array'
            : typeof children;
    console.warn(
      `[Slot] Expected a single React element child for asChild pattern, but received: ${childType}. ` +
        `The Slot will render nothing. Ensure you pass a single element (e.g., <a>, <Link>) as the child.`,
    );
  }

  return null;
});
Slot.displayName = 'Slot';
