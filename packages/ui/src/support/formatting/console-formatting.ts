export const formatDateTime = (value?: string): string => {
  if (!value) {
    return '(unknown)';
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
};

export const formatTimeRange = (start?: string, end?: string): string => {
  if (!start && !end) {
    return '(unknown)';
  }

  if (!start || !end) {
    return formatDateTime(start ?? end);
  }

  const startValue = Date.parse(start);
  const endValue = Date.parse(end);

  if (Number.isNaN(startValue) || Number.isNaN(endValue)) {
    return `${start} -> ${end}`;
  }

  const sameDay =
    new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(startValue) ===
    new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(endValue);

  if (sameDay) {
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      timeStyle: 'short',
    });
    return `${timeFormatter.format(startValue)} -> ${timeFormatter.format(endValue)}`;
  }

  return `${formatDateTime(start)} -> ${formatDateTime(end)}`;
};

export const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

export const formatSignedPercent = (value: number): string => {
  const percent = Math.round(value * 100);
  if (percent > 0) {
    return `+${percent}%`;
  }

  return `${percent}%`;
};

export const humanize = (value: string): string =>
  value
    .replace(/[-_.]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

export const groupBy = <T, Key extends string>(
  items: T[],
  getKey: (item: T) => Key,
): Partial<Record<Key, T[]>> => {
  const groups: Partial<Record<Key, T[]>> = {};

  for (const item of items) {
    const key = getKey(item);
    groups[key] = [...(groups[key] ?? []), item];
  }

  return groups;
};
