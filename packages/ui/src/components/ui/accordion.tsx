'use client';

import React, { useState, useId } from 'react';
import { cn } from '@/lib/classnames';
import { Icon } from '@/components/ui/icon';
import { Ripple } from '@/components/ui/ripple';

interface AccordionContextValue {
  expanded: string[];
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  children: React.ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  type = 'single',
  defaultValue = [],
  children,
  className,
}) => {
  const [expanded, setExpanded] = useState<string[]>(defaultValue);

  const toggle = (value: string) => {
    if (type === 'single') {
      setExpanded((prev) => (prev.includes(value) ? [] : [value]));
      return;
    }

    setExpanded((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  return (
    <AccordionContext.Provider value={{ expanded, toggle }}>
      <div
        className={cn(
          'border-outline-soft bg-surface flex flex-col overflow-hidden rounded-sm border',
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ value, children, className }) => {
  const context = React.useContext(AccordionContext);
  const isExpanded = context?.expanded.includes(value);
  const contentId = useId();
  const triggerId = useId();

  return (
    <div
      className={cn(
        'border-outline-weak border-b last:border-none',
        isExpanded && 'bg-surface-container-low',
        className,
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            value,
            isExpanded,
            contentId,
            triggerId,
          });
        }
        return child;
      })}
    </div>
  );
};

export interface AccordionTriggerProps {
  children: React.ReactNode;
  value?: string;
  isExpanded?: boolean;
  contentId?: string;
  triggerId?: string;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  value,
  isExpanded,
  contentId,
  triggerId,
}) => {
  const context = React.useContext(AccordionContext);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      context?.toggle(value!);
    }
  };

  return (
    <button
      id={triggerId}
      onClick={() => context?.toggle(value!)}
      onKeyDown={handleKeyDown}
      aria-expanded={isExpanded}
      aria-controls={contentId}
      className={cn(
        'text-label-medium group relative flex h-12 w-full items-center justify-between overflow-hidden px-4 font-medium transition-all',
        isExpanded ? 'text-primary' : 'text-on-surface hover:bg-state-hover',
      )}
    >
      <Ripple />
      <span className="relative z-10 flex-1 pt-0.5 text-left">{children}</span>
      <Icon
        symbol="expand_more"
        className={cn(
          'duration-medium ease-emphasized relative z-10 transition-transform',
          isExpanded && 'rotate-180',
        )}
      />
    </button>
  );
};

export interface AccordionContentProps {
  children: React.ReactNode;
  isExpanded?: boolean;
  contentId?: string;
  triggerId?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  isExpanded,
  contentId,
  triggerId,
}) => (
  <div
    id={contentId}
    role="region"
    aria-labelledby={triggerId}
    inert={!isExpanded ? true : undefined}
    className={cn(
      'duration-medium ease-emphasized overflow-hidden transition-all',
      isExpanded ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0',
    )}
  >
    <div className="text-on-surface-variant text-body-small px-4 pt-1 pb-4 leading-relaxed font-medium">
      {children}
    </div>
  </div>
);
