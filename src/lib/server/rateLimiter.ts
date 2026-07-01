export class RateLimiter {
  private cache: Map<string, number> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  check(ip: string): boolean {
    const key = ip;
    const count = this.cache.get(key) || 0;
    
    if (count >= this.limit) {
      return false;
    }
    
    this.cache.set(key, count + 1);
    
    if (count === 0) {
      setTimeout(() => {
        this.cache.delete(key);
      }, this.windowMs);
    }
    
    return true;
  }
}

// Global instances for rate limiting
export const chatRateLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes
export const imageRateLimiter = new RateLimiter(20, 15 * 60 * 1000); // 20 requests per 15 minutes
