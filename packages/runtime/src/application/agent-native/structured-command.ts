import type { SkoposStructuredCommand } from '@skopos/model';

const UNSAFE_SHELL_SYNTAX = /(?:[|&;<>`\n\r]|\$\(|\$\{)/;

export const parseSkoposStructuredCommand = (
  command: string,
  cwd: string,
): SkoposStructuredCommand | undefined => {
  const normalized = command.trim();
  if (normalized.length === 0 || UNSAFE_SHELL_SYNTAX.test(normalized)) {
    return undefined;
  }

  const tokens = tokenizeCommand(normalized);
  const [executable, ...arguments_] = tokens;
  if (!executable || /^[A-Za-z_][A-Za-z0-9_]*=/.test(executable)) {
    return undefined;
  }

  return {
    executable,
    arguments: arguments_,
    cwd,
  };
};

export const formatSkoposStructuredCommand = (command: SkoposStructuredCommand): string =>
  [command.executable, ...command.arguments].join(' ');

const tokenizeCommand = (command: string): string[] => {
  const tokens: string[] = [];
  let current = '';
  let quote: "'" | '"' | undefined;

  for (let index = 0; index < command.length; index += 1) {
    const character = command[index];

    if (quote) {
      if (character === quote) {
        quote = undefined;
      } else if (character === '\\' && quote === '"' && index + 1 < command.length) {
        index += 1;
        current += command[index];
      } else {
        current += character;
      }
      continue;
    }

    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }

    if (/\s/.test(character)) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    if (character === '\\' && index + 1 < command.length) {
      index += 1;
      current += command[index];
      continue;
    }

    current += character;
  }

  if (quote) {
    return [];
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
};
