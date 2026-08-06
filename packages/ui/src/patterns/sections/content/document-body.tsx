import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '../../../support/ui/classnames.js';
import { HighlightedCodeBlock } from '../../../support/ui/code-highlighting.js';
import { MermaidDiagram } from '../../../support/ui/mermaid-diagram.js';
import { ApplicationLink } from '../../../support/ui/application-link.js';

export function DocumentBody({
  body,
  resolveHref,
}: {
  body: string;
  resolveHref?: (href: string) => string | undefined;
}): React.JSX.Element {
  return (
    <div className="skopos-markdown-body mt-3.5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const resolvedHref = href ? resolveHref?.(href) ?? href : href;
            const externalHref = isExternalHref(resolvedHref);

            return (
              <ApplicationLink
                href={resolvedHref}
                className="skopos-markdown-link"
                target={externalHref ? '_blank' : undefined}
                rel={externalHref ? 'noreferrer' : undefined}
                {...props}
              >
                {children}
              </ApplicationLink>
            );
          },
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className) || String(children).includes('\n');

            return (
              <code
                className={cn(
                  isBlock ? 'skopos-markdown-code-block' : 'skopos-markdown-inline-code',
                  className,
                )}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <MarkdownCodeBlock {...props}>{children}</MarkdownCodeBlock>
          ),
          table: ({ children, ...props }) => (
            <div className="skopos-markdown-table-wrap">
              <table className="skopos-markdown-table" {...props}>
                {children}
              </table>
            </div>
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

function MarkdownCodeBlock({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const metadata = extractMarkdownCodeMetadata(children);
  if (metadata.language === 'mermaid') {
    return <MermaidDiagram source={metadata.code} className="mt-1" />;
  }

  return <StandardMarkdownCodeBlock metadata={metadata} />;
}

function StandardMarkdownCodeBlock({
  metadata,
}: {
  metadata: { language?: string; code: string };
}): React.JSX.Element {

  const [copied, setCopied] = React.useState(false);
  const resetTimerRef = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      if (typeof window !== 'undefined' && resetTimerRef.current !== undefined) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  const handleCopy = async (): Promise<void> => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.clipboard ||
      metadata.code.trim().length === 0
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(metadata.code);
      setCopied(true);

      if (typeof window !== 'undefined') {
        if (resetTimerRef.current !== undefined) {
          window.clearTimeout(resetTimerRef.current);
        }

        resetTimerRef.current = window.setTimeout(() => {
          setCopied(false);
        }, 1600);
      }
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="skopos-markdown-code-shell">
      <div className="skopos-markdown-code-header">
        <span className="skopos-markdown-code-language">{metadata.language ?? 'text'}</span>
        <button
          type="button"
          onClick={() => {
            void handleCopy();
          }}
          className="skopos-markdown-code-copy"
          aria-label={copied ? 'Code copied' : 'Copy code'}
          title={copied ? 'Code copied' : 'Copy code'}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <HighlightedCodeBlock code={metadata.code} language={metadata.language} />
    </div>
  );
}

const extractMarkdownCodeMetadata = (
  children: React.ReactNode,
): { language?: string; code: string } => {
  if (!React.isValidElement(children)) {
    return { code: '' };
  }

  const props = children.props as { className?: string; children?: React.ReactNode };
  const className = props.className;
  const languageMatch = className ? /language-([a-z0-9#+-]+)/i.exec(className) : undefined;
  const code = extractReactText(props.children).replace(/\n$/, '');

  return {
    language: languageMatch?.[1]?.toLowerCase(),
    code,
  };
};

const isExternalHref = (href?: string): boolean =>
  typeof href === 'string' && /^(https?:)?\/\//.test(href);

const extractReactText = (value: React.ReactNode): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => extractReactText(item)).join('');
  }

  if (React.isValidElement(value)) {
    const props = value.props as { children?: React.ReactNode };
    return extractReactText(props.children);
  }

  return '';
};
