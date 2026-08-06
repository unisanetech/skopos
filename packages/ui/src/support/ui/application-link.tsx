'use client';

import * as React from 'react';
import { Link } from '@tanstack/react-router';

export interface ApplicationLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href?: string;
}

export const ApplicationLink = React.forwardRef<HTMLAnchorElement, ApplicationLinkProps>(
  ({ href, children, ...props }, ref) => {
    if (!href || usesNativeDocumentNavigation(href, props)) {
      return (
        <a ref={ref} href={href} {...props}>
          {children}
        </a>
      );
    }

    return (
      <Link ref={ref} to={href} {...props}>
        {children}
      </Link>
    );
  },
);

ApplicationLink.displayName = 'ApplicationLink';

const usesNativeDocumentNavigation = (
  href: string,
  props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>,
): boolean =>
  href.startsWith('#') ||
  href.startsWith('//') ||
  /^[a-z][a-z\d+.-]*:/i.test(href) ||
  Boolean(props.download) ||
  (typeof props.target === 'string' && props.target !== '_self');
