import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  typographyRoleClasses,
  typographyRoleDefaultTags,
  type TypographyRole,
} from '@/lib/typography-roles';
import { cn } from '@/lib/utils';

const typographyVariants = cva('text-on-surface', {
  variants: {
    variant: {
      displayLarge: 'text-display-large',
      displayMedium: 'text-display-medium',
      displaySmall: 'text-display-small',
      headlineLarge: 'text-headline-large',
      headlineMedium: 'text-headline-medium',
      headlineSmall: 'text-headline-small',
      titleLarge: 'text-title-large',
      titleMedium: 'text-title-medium',
      titleSmall: 'text-title-small',
      bodyLarge: 'text-body-large',
      bodyMedium: 'text-body-medium',
      bodySmall: 'text-body-small',
      labelLarge: 'text-label-large',
      labelMedium: 'text-label-medium',
      labelSmall: 'text-label-small',
    },
  },
  defaultVariants: {
    variant: 'bodyLarge',
  },
});

export type TypographyScale = NonNullable<VariantProps<typeof typographyVariants>['variant']>;
export type TypographyVariant = TypographyScale | TypographyRole;

type BaseTypographyProps = React.HTMLAttributes<HTMLElement> & {
  component?: React.ElementType;
};

export type TypographyProps = BaseTypographyProps & {
  variant?: TypographyVariant;
};

const defaultTags: Record<TypographyScale, React.ElementType> = {
  displayLarge: 'h1',
  displayMedium: 'h2',
  displaySmall: 'h3',
  headlineLarge: 'h4',
  headlineMedium: 'h5',
  headlineSmall: 'h6',
  titleLarge: 'p',
  titleMedium: 'p',
  titleSmall: 'p',
  bodyLarge: 'p',
  bodyMedium: 'p',
  bodySmall: 'p',
  labelLarge: 'span',
  labelMedium: 'span',
  labelSmall: 'span',
};

function isTypographyRole(variant: TypographyVariant): variant is TypographyRole {
  return variant in typographyRoleClasses;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyLarge',
  component,
  className,
  children,
  ...props
}) => {
  const role = isTypographyRole(variant) ? variant : undefined;
  const scale: TypographyScale | undefined = role ? undefined : (variant as TypographyScale);
  const Component =
    component ||
    (role ? typographyRoleDefaultTags[role] : defaultTags[scale ?? 'bodyLarge']) ||
    'p';
  return (
    <Component
      className={cn(
        role ? 'text-on-surface' : typographyVariants({ variant: scale }),
        role && typographyRoleClasses[role],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export type { TypographyRole };
