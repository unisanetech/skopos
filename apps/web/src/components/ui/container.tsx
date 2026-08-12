import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ children, maxWidth = 'lg', className, ...props }: ContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  return (
    <div
      {...props}
      className={cn('mx-auto px-[var(--layout-margin)]', maxWidthClasses[maxWidth], className)}
    >
      {children}
    </div>
  );
}
