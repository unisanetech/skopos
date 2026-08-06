import * as React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';

export function SidebarCard({
  title,
  badge,
  collapsible = false,
  defaultOpen = true,
  children,
}: {
  title: string;
  badge?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  const header = (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <Typography variant={collapsible ? 'labelMedium' : 'titleSmall'} className="truncate">
        {title}
      </Typography>
      {badge ? (
        <Badge variant="tonal" color="secondary" size="sm">
          {badge}
        </Badge>
      ) : null}
    </div>
  );

  if (collapsible) {
    return (
      <div className="min-w-0">
        <Accordion
          className="min-w-0 rounded-none border-x-0 border-b-0 border-t border-outline-weak bg-transparent"
          defaultValue={defaultOpen ? ['content'] : []}
        >
          <AccordionItem value="content" className="border-0">
            <AccordionTrigger>{header}</AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <section className="min-w-0 px-4 py-3">
      <div className="flex items-center justify-between gap-3 pb-2.5">{header}</div>
      <div>{children}</div>
    </section>
  );
}
