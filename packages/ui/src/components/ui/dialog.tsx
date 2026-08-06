'use client';

import React, { forwardRef, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/classnames';
import { useControllableState } from '@/lib/use-controllable-state';
import { useOverlayBehavior } from '@/lib/use-overlay-behavior';
import { Text } from '@/components/ui/text';
import { Surface } from '@/components/ui/surface';
import { IconButton } from '@/components/ui/icon-button';
import { useScrollLock } from '@/hooks/use-scroll-lock';

export type DialogTitle = Exclude<React.ReactNode, null | undefined | boolean>;

type DialogAccessibleName =
  | {
      title: DialogTitle;
      'aria-label'?: string;
    }
  | {
      title?: never;
      'aria-label': string;
    };

type DialogBaseProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  className?: string;
  mobilePresentation?: 'centered' | 'fullscreen';
  showCloseButton?: boolean;
  closeLabel?: string;
  role?: 'dialog' | 'alertdialog';
  'aria-describedby'?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
};

export type DialogProps = DialogBaseProps & DialogAccessibleName;

const closeIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      title,
      'aria-label': ariaLabel,
      'aria-describedby': externalDescribedBy,
      description,
      children,
      actions,
      icon,
      contentClassName,
      headerClassName,
      footerClassName,
      className,
      mobilePresentation = 'centered',
      showCloseButton,
      closeLabel = 'Close dialog',
      role = 'dialog',
      initialFocusRef,
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const overlayRootRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descriptionId = useId();
    const [isOpen = false, setIsOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });

    const resolvedShowCloseButton = showCloseButton ?? Boolean(title || description || icon);
    const hasHeader = Boolean(title || description || icon || resolvedShowCloseButton);
    const hasBodyContent = children !== undefined && children !== null;
    const describedBy = mergeIds(externalDescribedBy, description ? descriptionId : undefined);

    const setRefs = (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useScrollLock(isOpen);
    useOverlayBehavior({
      open: isOpen,
      contentRef: dialogRef,
      rootRef: overlayRootRef,
      onDismiss: () => setIsOpen(false),
      modal: true,
      initialFocusRef,
    });

    if (!isOpen || typeof document === 'undefined') {
      return null;
    }

    const isFullscreenMobile = mobilePresentation === 'fullscreen';

    return createPortal(
      <div
        ref={overlayRootRef}
        className={cn(
          'fixed inset-0 z-[var(--z-modal,3000)] flex items-center justify-center',
          isFullscreenMobile ? 'medium:p-10 p-0' : 'medium:p-10 p-6',
        )}
        role="presentation"
      >
        <div
          className="bg-scrim animate-fade-enter absolute inset-0"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        <Surface
          ref={setRefs}
          role={role}
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={describedBy}
          tabIndex={-1}
          tone="surface"
          elevation={5}
          rounded="lg"
          className={cn(
            'border-outline-soft relative flex w-full flex-col overflow-hidden border outline-none',
            isFullscreenMobile
              ? 'medium:h-auto medium:max-h-[calc(100dvh-var(--spacing-20))] medium:max-w-110 medium:rounded-lg medium:border expanded:medium:max-w-150 h-dvh max-h-dvh max-w-none rounded-none border-0'
              : 'expanded:max-w-150 max-w-110',
            'animate-surface-enter',
            className,
          )}
        >
          {hasHeader ? (
            <div
              className={cn(
                'border-outline-weak bg-surface-container-lowest flex items-start gap-3 border-b px-5 py-4',
                headerClassName,
              )}
            >
              {icon ? (
                <div
                  className="bg-surface-container-low text-primary border-outline-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-md border"
                  aria-hidden="true"
                >
                  {icon}
                </div>
              ) : null}

              <div className="min-w-0 flex-1 space-y-1 text-left">
                {title ? (
                  <Text
                    variant="titleLarge"
                    as="div"
                    id={titleId}
                    className="text-on-surface leading-tight wrap-break-word"
                  >
                    {title}
                  </Text>
                ) : null}
                {description ? (
                  <Text
                    variant="bodySmall"
                    as="div"
                    id={descriptionId}
                    className="text-on-surface-variant leading-relaxed wrap-break-word"
                  >
                    {description}
                  </Text>
                ) : null}
              </div>

              {resolvedShowCloseButton ? (
                <IconButton
                  aria-label={closeLabel}
                  icon={closeIcon}
                  variant="standard"
                  size="md"
                  className="bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  onClick={() => setIsOpen(false)}
                />
              ) : null}
            </div>
          ) : null}

          {hasBodyContent ? (
            <div
              className={cn(
                'flex-1 overflow-y-auto',
                isFullscreenMobile ? 'min-h-0' : 'max-h-[min(78vh,calc(100dvh-var(--spacing-24)))]',
              )}
            >
              <div
                className={cn(
                  'text-on-surface px-5 pb-5 text-left',
                  hasHeader ? 'pt-4' : 'pt-5',
                  contentClassName,
                )}
              >
                {children}
              </div>
            </div>
          ) : null}

          {actions ? (
            <div
              className={cn(
                'border-outline-weak bg-surface-container-lowest flex flex-wrap items-center justify-end gap-2 border-t px-5 py-3',
                isFullscreenMobile &&
                  'medium:flex-row medium:[&>*]:w-auto flex-col-reverse [&>*]:w-full',
                footerClassName,
              )}
            >
              {actions}
            </div>
          ) : null}
        </Surface>
      </div>,
      document.body,
    );
  },
);

Dialog.displayName = 'Dialog';

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(' ');
  return merged || undefined;
}
