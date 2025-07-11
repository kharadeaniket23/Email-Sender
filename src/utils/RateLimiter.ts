// src/utils/RateLimiter.ts

export class RateLimiter {
  private timestamps: number[] = [];

  constructor(
    private maxRequests: number,
    private interval: number // in milliseconds (e.g., 60_000 for 1 minute)
  ) {}

  public allow(): boolean {
    const now = Date.now();

    // Remove timestamps older than the interval
    this.timestamps = this.timestamps.filter(ts => now - ts <= this.interval);

    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  public getRemainingRequests(): number {
    return this.maxRequests - this.timestamps.length;
  }
}
