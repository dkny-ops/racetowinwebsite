const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const realIp = request.headers.get("x-real-ip") || "";

  const ip = (forwarded || realIp || "unknown").split(",")[0].trim();

  return ip || "unknown";
}

export function checkServerRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key) || { count: 0, resetAt: now + windowMs };

  if (bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);

  return { ok: true, retryAfter: 0 };
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

export function sanitizePlayerName(value: string): string {
  const cleaned = value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "";
  }

  if (cleaned.length < 2 || cleaned.length > 20) {
    return "";
  }

  if (!/^[a-zA-Z0-9 _-]+$/.test(cleaned)) {
    return "";
  }

  return cleaned;
}

export function parseFiniteNumber(
  value: unknown,
  {
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    integer = false,
  }: { min?: number; max?: number; integer?: boolean } = {},
): number | null {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  if (number < min || number > max) {
    return null;
  }

  if (integer && !Number.isInteger(number)) {
    return null;
  }

  return number;
}
