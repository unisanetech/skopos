import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/classnames';

const badgeVariants = cva('inline-flex items-center justify-center rounded-full font-medium', {
  variants: {
    variant: {
      filled: '',
      tonal: '',
      outlined: 'border border-outline-soft',
    },
    color: {
      primary: '',
      secondary: '',
      tertiary: '',
      error: '',
      success: '',
      warning: '',
      info: '',
    },
    size: {
      sm: 'text-label-small px-1.5 py-0.5',
      md: 'text-label-small px-2 py-0.5',
      lg: 'text-body-small px-3 py-1',
    },
  },
  compoundVariants: [
    { variant: 'filled', color: 'primary', className: 'bg-primary text-on-primary' },
    { variant: 'filled', color: 'secondary', className: 'bg-secondary text-on-secondary' },
    { variant: 'filled', color: 'tertiary', className: 'bg-tertiary text-on-tertiary' },
    { variant: 'filled', color: 'error', className: 'bg-error text-on-error' },
    { variant: 'filled', color: 'success', className: 'bg-success text-on-success' },
    { variant: 'filled', color: 'warning', className: 'bg-warning text-on-warning' },
    { variant: 'filled', color: 'info', className: 'bg-info text-on-info' },
    {
      variant: 'tonal',
      color: 'primary',
      className: 'bg-primary-container text-on-primary-container',
    },
    {
      variant: 'tonal',
      color: 'secondary',
      className: 'bg-secondary-container text-on-secondary-container',
    },
    {
      variant: 'tonal',
      color: 'tertiary',
      className: 'bg-tertiary-container text-on-tertiary-container',
    },
    { variant: 'tonal', color: 'error', className: 'bg-error-container text-on-error-container' },
    {
      variant: 'tonal',
      color: 'success',
      className: 'bg-success-container text-on-success-container',
    },
    {
      variant: 'tonal',
      color: 'warning',
      className: 'bg-warning-container text-on-warning-container',
    },
    {
      variant: 'tonal',
      color: 'info',
      className: 'bg-info-container text-on-info-container',
    },
    { variant: 'outlined', color: 'primary', className: 'text-primary border-primary-container' },
    {
      variant: 'outlined',
      color: 'secondary',
      className: 'text-secondary border-secondary-container',
    },
    {
      variant: 'outlined',
      color: 'tertiary',
      className: 'text-tertiary border-tertiary-container',
    },
    { variant: 'outlined', color: 'error', className: 'text-error border-error-container' },
    { variant: 'outlined', color: 'success', className: 'text-success border-success-container' },
    { variant: 'outlined', color: 'warning', className: 'text-warning border-warning-container' },
    { variant: 'outlined', color: 'info', className: 'text-info border-info-container' },
  ],
  defaultVariants: {
    variant: 'filled',
    color: 'primary',
    size: 'md',
  },
});

export type BadgeProps = VariantProps<typeof badgeVariants> &
  React.HTMLAttributes<HTMLSpanElement> & {
    children: React.ReactNode;
  };

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant, color, size, className, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeVariants({ variant, color, size, className }))} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';
