export const writeJsonOutput = (value: unknown): void => {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

export const writeLines = (lines: string[]): void => {
  process.stdout.write(`${lines.join('\n')}\n`);
};

export const writeOptionalLines = (lines: Array<string | undefined>): void => {
  writeLines(lines.filter((line): line is string => Boolean(line)));
};

export interface JsonOutputSelection {
  summary?: boolean;
  fields?: string[];
}

type JsonRecord = Record<string, unknown>;

export const projectJsonOutput = (
  value: unknown,
  selection: JsonOutputSelection,
): unknown => {
  if (selection.summary) {
    return {
      summary: readSummaryValue(value),
    };
  }

  const fields = selection.fields ?? [];
  if (fields.length === 0) {
    return value;
  }

  if (!isJsonRecord(value)) {
    throw new Error('Field selection requires an object-shaped JSON result.');
  }

  const projected: JsonRecord = {};
  for (const field of fields) {
    const fieldPath = field.trim();
    if (fieldPath.length === 0) {
      continue;
    }

    const resolvedValue = readFieldPath(value, fieldPath);
    assignFieldPath(projected, fieldPath, resolvedValue);
  }

  return projected;
};

export const buildSummaryLines = (value: unknown): string[] => [readSummaryValue(value)];

export const parseFieldList = (value: string): string[] =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const readSummaryValue = (value: unknown): string => {
  if (!isJsonRecord(value) || typeof value.summary !== 'string') {
    throw new Error('Summary output requires a top-level string `summary` field.');
  }

  return value.summary;
};

const readFieldPath = (value: JsonRecord, fieldPath: string): unknown => {
  const segments = fieldPath.split('.');
  let current: unknown = value;

  for (const segment of segments) {
    if (!isJsonRecord(current) || !(segment in current)) {
      throw new Error(`Unknown output field: ${fieldPath}`);
    }
    current = current[segment];
  }

  return current;
};

const assignFieldPath = (target: JsonRecord, fieldPath: string, value: unknown): void => {
  const segments = fieldPath.split('.');
  let current: JsonRecord = target;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    const isLeaf = index === segments.length - 1;

    if (isLeaf) {
      current[segment] = value;
      return;
    }

    const existing = current[segment];
    if (!isJsonRecord(existing)) {
      current[segment] = {};
    }

    current = current[segment] as JsonRecord;
  }
};

const isJsonRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
