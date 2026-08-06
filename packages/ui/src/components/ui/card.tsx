'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/classnames';
import { focusRing } from '@/lib/focus-ring';
import { Ripple } from '@/components/ui/ripple';

const cardVariants = cva(
  'rounded-sm overflow-hidden flex flex-col transition-all duration-medium ease-emphasized relative isolate',
  {
    variants: {
      variant: {
        elevated: 'bg-surface shadow-1 border border-outline-weak',
        filled: 'bg-surface-container border-none shadow-0',
        outlined: 'bg-surface border border-outline-soft shadow-0',
        low: 'bg-surface-container-low border-none shadow-0',
        high: 'bg-surface-container-high border-none shadow-1',
      },
      interactive: {
        true: 'group cursor-pointer appearance-none text-left',
        false: '',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    compoundVariants: [
      {
        variant: 'outlined',
        interactive: true,
        className: 'hover:border-primary',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      padding: 'none',
      interactive: false,
    },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof cardVariants> {
  interactive?: boolean;
}

const CardRoot = React.forwardRef<HTMLElement, CardProps>(
  ({ className, variant, padding, interactive, onClick, children, ...props }, ref) => {
    const hasInteractiveStyles = interactive || !!onClick;
    const cardClasses = cn(
      cardVariants({ variant, padding, interactive: hasInteractiveStyles }),
      onClick && focusRing,
      className,
    );
    const cardContent = (
      <>
        {hasInteractiveStyles && (
          <>
            <div className="bg-primary pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-8" />
            <Ripple />
          </>
        )}
        <div className="pointer-events-none relative z-10 flex h-full flex-col text-left">
          <div className="pointer-events-auto flex h-full flex-col">{children}</div>
        </div>
      </>
    );

    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={cardClasses}
          onClick={onClick}
          {...props}
        >
          {cardContent}
        </button>
      );
    }

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={cardClasses} {...props}>
        {cardContent}
      </div>
    );
  },
);
CardRoot.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-10 flex flex-col gap-1 px-6 pt-6 pb-4', className)}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-on-surface-variant text-body-medium relative z-10 px-6 py-4 leading-relaxed font-medium',
        className,
      )}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-10 mt-auto flex items-center gap-3 px-6 pt-4 pb-6', className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';

const CardMedia = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, alt, ...props }, ref) => (
    <img
      ref={ref}
      className={cn('relative z-10 w-full object-cover', className)}
      alt={alt || ''}
      {...props}
    />
  ),
);
CardMedia.displayName = 'CardMedia';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-title-large leading-none', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-body-small text-on-surface-variant', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
  Media: CardMedia,
  Title: CardTitle,
  Description: CardDescription,
});
