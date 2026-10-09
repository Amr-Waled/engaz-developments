function createPublishedCache(snapshot, fetchPublished, now = Date.now) {
  let cache = { content: snapshot.content, updatedAt: snapshot.updatedAt, revision: snapshot.revision, until: 0 };
  let pending;
  return async function published() {
    if (now() < cache.until) return cache;
    if (pending) return pending;
    pending = (async () => {
      try {
        const result = await fetchPublished();
        if (!result.content?.values || typeof result.content.values !== 'object' || Array.isArray(result.content.values)) throw new Error('Invalid published content');
        cache = { content: result.content, updatedAt: result.updatedAt, revision: result.revision, until: now() + 10000 };
      } catch {
        // Preserve the last successful publication, including explicit deletions.
        cache = { ...cache, until: now() + 10000 };
      }
      return cache;
    })();
    try { return await pending; } finally { pending = undefined; }
  };
}
module.exports = { createPublishedCache };
