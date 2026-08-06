import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/classnames';
import { focusRing } from '@/lib/focus-ring';
import { Divider, type DividerProps } from '@/components/ui/divider';
import { Typography } from '@/components/ui/typography';
import { Ripple } from '@/components/ui/ripple';

export type ListProps = React.HTMLAttributes<HTMLUListElement>;

export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn('bg-surface m-0 flex list-none flex-col py-2', className)}
        {...props}
      >
        {children}
      </ul>
    );
  },
);

List.displayName = 'List';

export interface ListSubheaderProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

export const ListSubheader = forwardRef<HTMLLIElement, ListSubheaderProps>(
  ({ children, className, role = 'presentation', ...props }, ref) => (
    <li
      ref={ref}
      role={role}
      className={cn('text-label-medium text-on-surface-variant px-4 py-2 font-medium', className)}
      {...props}
    >
      {children}
    </li>
  ),
);

ListSubheader.displayName = 'ListSubheader';

export type ListDividerProps = DividerProps;

export const ListDivider = forwardRef<HTMLDivElement, ListDividerProps>((props, ref) => (
  <li role="presentation">
    <Divider ref={ref} {...props} />
  </li>
));

ListDivider.displayName = 'ListDivider';

const listItemVariants = cva(
  'relative flex min-h-10 w-full items-center gap-3 overflow-hidden px-4 py-2 text-left transition-colors duration-snappy ease-emphasized select-none',
  {
    variants: {
      interactive: {
        true: cn('cursor-pointer hover:bg-state-hover', focusRing),
        false: '',
      },
      selected: {
        true: 'bg-state-selected text-on-surface',
        false: 'text-on-surface',
      },
      disabled: {
        true: 'pointer-events-none opacity-38 grayscale',
        false: '',
      },
    },
    defaultVariants: {
      interactive: false,
      selected: false,
      disabled: false,
    },
  },
);

type ListItemCommonProps = {
  headline: React.ReactNode;
  supportingText?: React.ReactNode;
  leading?: React.ReactNode;
  trailingText?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
};

export type ListItemStaticProps = ListItemCommonProps &
  Omit<React.HTMLAttributes<HTMLLIElement>, keyof ListItemCommonProps | 'children' | 'onClick'> & {
    href?: never;
    onClick?: never;
    renderLink?: never;
  };

export type ListItemButtonProps = ListItemCommonProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ListItemCommonProps | 'children' | 'href'
  > & {
    href?: never;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    renderLink?: never;
  };

export type ListItemRenderLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

export type ListItemRenderLink = (props: ListItemRenderLinkProps) => React.ReactElement;

export type ListItemLinkProps = ListItemCommonProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof ListItemCommonProps | 'children' | 'href'
  > & {
    href: string;
    renderLink?: ListItemRenderLink;
  };

export type ListItemProps = ListItemStaticProps | ListItemButtonProps | ListItemLinkProps;

function hasContent(value: React.ReactNode): boolean {
  return value !== null && value !== undefined && value !== false;
}

function ListItemBody({
  headline,
  supportingText,
  leading,
  trailingText,
  trailing,
  interactive,
  disabled,
}: Pick<
  ListItemCommonProps,
  'headline' | 'supportingText' | 'leading' | 'trailingText' | 'trailing' | 'disabled'
> & {
  interactive: boolean;
}) {
  return (
    <>
      {interactive ? <Ripple disabled={disabled} /> : null}

      {hasContent(leading) ? (
        <span className="size-icon-sm relative z-10 flex shrink-0 items-center justify-center text-inherit">
          {leading}
        </span>
      ) : null}

      <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center">
        <Typography
          component="span"
          variant="bodyLarge"
          className="truncate leading-none font-medium text-inherit"
        >
          {headline}
        </Typography>
        {hasContent(supportingText) ? (
          <Typography
            component="span"
            variant="labelSmall"
            className="text-on-surface-variant mt-1.5 truncate leading-none opacity-60"
          >
            {supportingText}
          </Typography>
        ) : null}
      </span>

      {hasContent(trailingText) || hasContent(trailing) ? (
        <span className="text-on-surface-variant relative z-10 flex shrink-0 items-center gap-2">
          {hasContent(trailingText) ? (
            <Typography component="span" variant="labelSmall" className="font-medium tabular-nums">
              {trailingText}
            </Typography>
          ) : null}
          {hasContent(trailing) ? (
            <span className="size-icon-sm flex items-center justify-center">{trailing}</span>
          ) : null}
        </span>
      ) : null}
    </>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars -- Component-only props must be omitted before forwarding intrinsic element props. */
export const ListItem = forwardRef<HTMLLIElement, ListItemProps>((props, ref) => {
  const {
    headline,
    supportingText,
    leading,
    trailingText,
    trailing,
    selected = false,
    disabled = false,
    className,
  } = props;

  if ('href' in props && typeof props.href === 'string') {
    const {
      href,
      renderLink,
      onClick,
      headline: _headline,
      supportingText: _supportingText,
      leading: _leading,
      trailingText: _trailingText,
      trailing: _trailing,
      selected: _selected,
      disabled: _disabled,
      className: _className,
      tabIndex,
      ...anchorProps
    } = props;
    const linkProps: ListItemRenderLinkProps = {
      ...anchorProps,
      href,
      tabIndex: disabled ? -1 : tabIndex,
      'aria-disabled': disabled || undefined,
      onClick: (event) => {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      },
      className: cn(listItemVariants({ interactive: true, selected, disabled }), className),
      children: (
        <ListItemBody
          headline={headline}
          supportingText={supportingText}
          leading={leading}
          trailingText={trailingText}
          trailing={trailing}
          interactive
          disabled={disabled}
        />
      ),
    };

    return <li ref={ref}>{renderLink ? renderLink(linkProps) : <a {...linkProps} />}</li>;
  }

  if ('onClick' in props && typeof props.onClick === 'function') {
    const {
      onClick,
      type = 'button',
      headline: _headline,
      supportingText: _supportingText,
      leading: _leading,
      trailingText: _trailingText,
      trailing: _trailing,
      selected: _selected,
      disabled: _disabled,
      className: _className,
      ...buttonProps
    } = props;

    return (
      <li ref={ref}>
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={cn(listItemVariants({ interactive: true, selected, disabled }), className)}
          {...buttonProps}
        >
          <ListItemBody
            headline={headline}
            supportingText={supportingText}
            leading={leading}
            trailingText={trailingText}
            trailing={trailing}
            interactive
            disabled={disabled}
          />
        </button>
      </li>
    );
  }

  const {
    headline: _headline,
    supportingText: _supportingText,
    leading: _leading,
    trailingText: _trailingText,
    trailing: _trailing,
    selected: _selected,
    disabled: _disabled,
    className: _className,
    ...itemProps
  } = props;

  return (
    <li
      {...itemProps}
      ref={ref}
      aria-disabled={disabled || undefined}
      className={cn(listItemVariants({ interactive: false, selected, disabled }), className)}
    >
      <ListItemBody
        headline={headline}
        supportingText={supportingText}
        leading={leading}
        trailingText={trailingText}
        trailing={trailing}
        interactive={false}
        disabled={disabled}
      />
    </li>
  );
});

ListItem.displayName = 'ListItem';
/* eslint-enable @typescript-eslint/no-unused-vars */
