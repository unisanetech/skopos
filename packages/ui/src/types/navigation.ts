import type React from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode | string;
  activeIcon?: React.ReactNode | string;
  badge?: React.ReactNode | string | number;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  items?: NavigationItem[];
}

export interface NavigationLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

export type NavigationLinkRenderer = (
  item: NavigationItem,
  props: NavigationLinkProps,
) => React.ReactElement;

export interface NavigationPresentationProps {
  items: NavigationItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  onItemSelect?: (item: NavigationItem) => void;
  renderLink?: NavigationLinkRenderer;
}
