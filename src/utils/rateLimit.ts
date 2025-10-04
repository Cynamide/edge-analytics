const RATE_LIMIT_WINDOW = 60; // seconds
const MAX_REQUESTS = 10;      // per name per window

export async function rateLimit(kv: KVNamespace, name: string): Promise<boolean> {
  const bucketKey = `ratelimit:${name}:${Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW)}`;

  const count = await kv.get(bucketKey);
  const usage = count ? parseInt(count) : 0;

  if (usage >= MAX_REQUESTS) return false;

  await kv.put(bucketKey, (usage + 1).toString(), {
    expirationTtl: RATE_LIMIT_WINDOW,
  });

  return true;
}