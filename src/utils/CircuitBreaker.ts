// src/utils/CircuitBreaker.ts

export class CircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' = 'CLOSED';
  private lastFailureTime: number = 0;

  constructor(
    private failureThreshold: number = 3,
    private cooldownTime: number = 10_000 // 10 seconds
  ) {}

  public canAttempt(): boolean {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.cooldownTime) {
        console.log('[CircuitBreaker] Cooldown complete, resetting breaker.');
        this.reset();
        return true;
      }
      console.log('[CircuitBreaker] Circuit is OPEN. Skipping attempt.');
      return false;
    }

    return true;
  }

  public recordSuccess(): void {
    this.reset();
  }

  public recordFailure(): void {
    this.failureCount += 1;
    console.log(`[CircuitBreaker] Failure count: ${this.failureCount}`);

    if (this.failureCount >= this.failureThreshold) {
      this.trip();
    }
  }

  private trip(): void {
    this.state = 'OPEN';
    this.lastFailureTime = Date.now();
    console.log('[CircuitBreaker] Tripped! Circuit is now OPEN.');
  }

  private reset(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  public getState(): 'CLOSED' | 'OPEN' {
    return this.state;
  }
}
