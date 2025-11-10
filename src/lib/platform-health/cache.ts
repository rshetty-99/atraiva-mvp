interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

const cacheStore = new Map<string, CacheEntry<unknown>>();

export const getFromCache = <T>(
  key: string
): { data: T; expiresAt: number } | null => {
  const entry = cacheStore.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }

  return {
    data: entry.data as T,
    expiresAt: entry.expiresAt,
  };
};

export const setCache = <T>(key: string, data: T, ttlMs: number) => {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
};

export const getCacheMetadata = (key: string) => {
  const entry = cacheStore.get(key);
  if (!entry) {
    return {
      isCached: false,
      ttlSeconds: 0,
      expiresAt: new Date(0).toISOString(),
    };
  }

  const ttlMs = entry.expiresAt - Date.now();
  return {
    isCached: ttlMs > 0,
    ttlSeconds: Math.max(Math.floor(ttlMs / 1000), 0),
    expiresAt: new Date(entry.expiresAt).toISOString(),
  };
};
