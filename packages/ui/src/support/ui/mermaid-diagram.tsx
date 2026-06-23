import * as React from 'react';

import { cn } from './classnames.js';

let mermaidLoadPromise: Promise<typeof import('mermaid')> | undefined;
let mermaidInitialized = false;

const loadMermaid = async () => {
  if (!mermaidLoadPromise) {
    mermaidLoadPromise = import('mermaid');
  }

  const module = await mermaidLoadPromise;
  const mermaid = module.default;

  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'neutral',
      fontFamily: 'Avenir Next, Aptos, Segoe UI, sans-serif',
    });
    mermaidInitialized = true;
  }

  return mermaid;
};

export function MermaidDiagram({
  source,
  className,
}: {
  source: string;
  className?: string;
}): React.JSX.Element {
  const diagramId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [renderedSvg, setRenderedSvg] = React.useState<string>();
  const [errorMessage, setErrorMessage] = React.useState<string>();

  React.useEffect(() => {
    let cancelled = false;

    const renderDiagram = async (): Promise<void> => {
      const normalizedSource = source.trim();
      if (normalizedSource.length === 0) {
        setRenderedSvg(undefined);
        setErrorMessage('Diagram source is empty.');
        return;
      }

      setRenderedSvg(undefined);
      setErrorMessage(undefined);

      try {
        const mermaid = await loadMermaid();
        const renderResult = await mermaid.render(
          `skopos-mermaid-${diagramId}`,
          normalizedSource,
        );

        if (cancelled) {
          return;
        }

        setRenderedSvg(renderResult.svg);
        setErrorMessage(undefined);

        if (typeof window !== 'undefined') {
          window.requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!cancelled && container) {
              renderResult.bindFunctions?.(container);
            }
          });
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setRenderedSvg(undefined);
        setErrorMessage(
          error instanceof Error ? error.message : 'Diagram rendering failed.',
        );
      }
    };

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [diagramId, source]);

  return (
    <figure className={cn('skopos-mermaid-shell', className)}>
      <div ref={containerRef} className="skopos-mermaid-stage">
        {renderedSvg ? (
          <div
            className="skopos-mermaid-svg"
            aria-label="Rendered diagram"
            dangerouslySetInnerHTML={{ __html: renderedSvg }}
          />
        ) : errorMessage ? (
          <div className="skopos-mermaid-fallback">
            <p className="skopos-mermaid-error">
              Diagram could not render in the reader.
            </p>
            <p className="skopos-mermaid-error-detail">{errorMessage}</p>
            <pre className="skopos-markdown-pre">
              <code className="skopos-markdown-code-block">{source}</code>
            </pre>
          </div>
        ) : (
          <div className="skopos-mermaid-pending">Rendering diagram…</div>
        )}
      </div>
    </figure>
  );
}
