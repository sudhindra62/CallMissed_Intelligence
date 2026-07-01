export class RateLimiter {
  private windowMs: number;
  private max: number;
  private hits: Map<string, { count: number; resetTime: number }>;

  constructor(windowMs: number, max: number) {
    this.windowMs = windowMs;
    this.max = max;
    this.hits = new Map();
  }

  public check(ip: string): boolean {
    const now = Date.now();
    const record = this.hits.get(ip);

    if (!record) {
      this.hits.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > record.resetTime) {
      this.hits.set(ip, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.max) {
      return false;
    }

    record.count += 1;
    return true;
  }
}

// 100 requests per 15 minutes for chat/vision
export const chatRateLimiter = new RateLimiter(15 * 60 * 1000, 100);
// 20 requests per 15 minutes for image generation
export const imageRateLimiter = new RateLimiter(15 * 60 * 1000, 20);
