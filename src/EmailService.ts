// src/EmailService.ts

import { IEmailProvider, EmailRequest, EmailStatus } from './types';
import { RateLimiter } from './utils/RateLimiter';

export class EmailService {
  private providers: IEmailProvider[];
  private maxRetries = 3;
  private baseDelay = 500; // ms
  private sentEmails: Set<string> = new Set(); // idempotency
  private statusLog: Map<string, EmailStatus> = new Map();
  private rateLimiter: RateLimiter;

  constructor(providers: IEmailProvider[], rateLimitPerMinute = 10) {
    this.providers = providers;
    this.rateLimiter = new RateLimiter(rateLimitPerMinute, 60_000); // 60s window
  }

  public async sendEmail(email: EmailRequest): Promise<EmailStatus> {
    const { emailId } = email;

    // Idempotency check
    if (this.sentEmails.has(emailId)) {
      const status = this.statusLog.get(emailId)!;
      console.log(`[IDEMPOTENT] Email ${emailId} already sent. Status: ${status}`);
      return status;
    }

    // Rate limiting
    if (!this.rateLimiter.allow()) {
      console.log(`[RATE_LIMITED] Email ${emailId} rejected`);
      this.statusLog.set(emailId, 'RATE_LIMITED');
      return 'RATE_LIMITED';
    }

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      console.log(`[TRY] Using Provider ${i + 1}`);

      const result = await this.trySendWithRetry(email, provider);

      if (result === 'SUCCESS') {
        this.sentEmails.add(emailId);
        this.statusLog.set(emailId, result);
        console.log(`[SUCCESS] Email ${emailId} sent via Provider ${i + 1}`);
        return result;
      }

      console.log(`[FALLBACK] Provider ${i + 1} failed. Trying next provider...`);
    }

    this.statusLog.set(email.emailId, 'FAILED');
    console.log(`[FAILURE] Email ${emailId} failed with all providers`);
    return 'FAILED';
  }

  private async trySendWithRetry(email: EmailRequest, provider: IEmailProvider): Promise<EmailStatus> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const success = await provider.send(email);
        if (success) return 'SUCCESS';
      } catch (err) {
        console.log(`[ERROR] Attempt ${attempt} failed:`, err);
      }

      const backoff = this.baseDelay * 2 ** (attempt - 1);
      await this.sleep(backoff);
    }
    return 'FAILED';
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getStatus(emailId: string): EmailStatus | undefined {
    return this.statusLog.get(emailId);
  }
}
