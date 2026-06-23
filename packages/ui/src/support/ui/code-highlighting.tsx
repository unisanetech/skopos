import * as React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { cn } from './classnames.js';

const REGISTERED_LANGUAGES = [
  ['bash', bash],
  ['diff', diff],
  ['javascript', javascript],
  ['json', json],
  ['jsx', jsx],
  ['markdown', markdown],
  ['sql', sql],
  ['tsx', tsx],
  ['typescript', typescript],
  ['yaml', yaml],
] as const;

for (const [language, grammar] of REGISTERED_LANGUAGES) {
  SyntaxHighlighter.registerLanguage(language, grammar);
}

const LANGUAGE_ALIASES: Record<string, string | undefined> = {
  bash: 'bash',
  console: undefined,
  diff: 'diff',
  env: 'bash',
  javascript: 'javascript',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx',
  markdown: 'markdown',
  md: 'markdown',
  plaintext: undefined,
  shell: 'bash',
  shellscript: 'bash',
  sh: 'bash',
  sql: 'sql',
  text: undefined,
  ts: 'typescript',
  tsx: 'tsx',
  typescript: 'typescript',
  yaml: 'yaml',
  yml: 'yaml',
  zsh: 'bash',
};

const SKOPOS_CODE_THEME = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...(oneLight['pre[class*="language-"]'] ?? {}),
    background: 'transparent',
    margin: 0,
    padding: '0.9rem 1rem',
  },
  'code[class*="language-"]': {
    ...(oneLight['code[class*="language-"]'] ?? {}),
    background: 'transparent',
    fontFamily:
      'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '12.5px',
    lineHeight: 1.6,
    textShadow: 'none',
  },
} as const;

export const normalizeCodeLanguage = (language?: string): string | undefined => {
  if (!language) {
    return undefined;
  }

  return LANGUAGE_ALIASES[language.trim().toLowerCase()];
};

export function HighlightedCodeBlock({
  code,
  language,
}: {
  code: string;
  language?: string;
}): React.JSX.Element {
  const normalizedLanguage = normalizeCodeLanguage(language);

  if (!normalizedLanguage) {
    return (
      <pre className="skopos-markdown-pre">
        <code className="skopos-markdown-code-block">{code}</code>
      </pre>
    );
  }

  return (
    <SyntaxHighlighter
      language={normalizedLanguage}
      style={SKOPOS_CODE_THEME}
      customStyle={{}}
      wrapLongLines
      PreTag={CodePre}
      CodeTag="code"
      codeTagProps={{ className: 'skopos-markdown-code-block' }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

function CodePre({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>): React.JSX.Element {
  return (
    <pre className={cn('skopos-markdown-pre', className)} {...props}>
      {children}
    </pre>
  );
}
