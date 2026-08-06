import type React from 'react';

export const typographyRoleClasses = {
  heroTitle: 'text-role-hero-title',
  pageTitle: 'text-role-page-title',
  sectionTitle: 'text-role-section-title',
  sectionLead: 'text-role-section-lead',
  panelTitle: 'text-role-panel-title',
  cardTitle: 'text-role-card-title',
  eyebrow: 'text-role-eyebrow',
} as const;

export type TypographyRole = keyof typeof typographyRoleClasses;

export const typographyRoleDefaultTags = {
  heroTitle: 'h1',
  pageTitle: 'h1',
  sectionTitle: 'h2',
  sectionLead: 'p',
  panelTitle: 'h3',
  cardTitle: 'h3',
  eyebrow: 'p',
} as const satisfies Record<TypographyRole, React.ElementType>;
