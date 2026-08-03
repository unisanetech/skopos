export const DEFAULT_COLLECTION_PAGE_SIZE = 25;
export const MAX_COLLECTION_PAGE_SIZE = 100;
export const COMPACT_JSON_BUDGET_BYTES = 32 * 1024;

export interface CollectionPageOptions {
  collection: string;
  cursor?: string;
  limit?: number;
}

export interface CollectionPage<T> {
  items: T[];
  page: {
    total: number;
    offset: number;
    limit: number;
    returned: number;
    nextCursor?: string;
  };
}

export const paginateCollection = <T>(
  items: T[],
  { collection, cursor, limit = DEFAULT_COLLECTION_PAGE_SIZE }: CollectionPageOptions,
): CollectionPage<T> => {
  const pageLimit = normalizePageLimit(limit);
  const offset = cursor ? decodeCursor(cursor, collection) : 0;
  if (offset > items.length) {
    throw new Error(
      `Cursor offset ${offset} exceeds ${collection} collection size ${items.length}.`,
    );
  }
  const pageItems = items.slice(offset, offset + pageLimit);
  const nextOffset = offset + pageItems.length;
  return {
    items: pageItems,
    page: {
      total: items.length,
      offset,
      limit: pageLimit,
      returned: pageItems.length,
      nextCursor:
        nextOffset < items.length ? encodeCursor(collection, nextOffset) : undefined,
    },
  };
};

export const parseCollectionLimit = (value: string): number => {
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_COLLECTION_PAGE_SIZE) {
    throw new Error(
      `Collection limit must be an integer from 1 to ${MAX_COLLECTION_PAGE_SIZE}.`,
    );
  }
  return limit;
};

export const jsonByteLength = (value: unknown): number =>
  Buffer.byteLength(JSON.stringify(value), 'utf8');

const normalizePageLimit = (limit: number): number => {
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_COLLECTION_PAGE_SIZE) {
    throw new Error(
      `Collection limit must be an integer from 1 to ${MAX_COLLECTION_PAGE_SIZE}.`,
    );
  }
  return limit;
};

const encodeCursor = (collection: string, offset: number): string =>
  Buffer.from(JSON.stringify({ version: 1, collection, offset }), 'utf8').toString(
    'base64url',
  );

const decodeCursor = (cursor: string, collection: string): number => {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as {
      version?: number;
      collection?: string;
      offset?: number;
    };
    if (
      decoded.version !== 1 ||
      decoded.collection !== collection ||
      !Number.isInteger(decoded.offset) ||
      decoded.offset! < 0
    ) {
      throw new Error('cursor payload does not match the requested collection');
    }
    return decoded.offset!;
  } catch (error) {
    throw new Error(
      `Invalid cursor for ${collection}: ${error instanceof Error ? error.message : 'malformed cursor'}.`,
    );
  }
};
