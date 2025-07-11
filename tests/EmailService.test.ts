// tests/EmailService.test.ts

import { EmailService } from '../src/EmailService';
import { MockProviderA } from '../src/providers/MockProviderA';
import { MockProviderB } from '../src/providers/MockProviderB';
import { EmailRequest } from '../src/types';

jest.setTimeout(10000); // Increase timeout for retries/backoff

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    const providerA = new MockProviderA();
    const providerB = new MockProviderB();
    emailService = new EmailService([providerA, providerB], 10); // 10 emails/min rate
  });

  const mockEmail = (): EmailRequest => ({
    emailId: Math.random().toString(36).substring(2),
    to: 'test@example.com',
    subject: 'Test Subject',
    body: 'Test Body',
  });

  test('sends email successfully', async () => {
    const email = mockEmail();
    const status = await emailService.sendEmail(email);
    expect(['SUCCESS', 'FAILED']).toContain(status); // Because it's probabilistic
  });

  test('respects idempotency', async () => {
    const email = mockEmail();
    const firstStatus = await emailService.sendEmail(email);
    const secondStatus = await emailService.sendEmail(email); // Re-sending same email
    expect(secondStatus).toBe(firstStatus); // Idempotent
  });

  test('rate limits after threshold', async () => {
    const emails: EmailRequest[] = [];
    for (let i = 0; i < 12; i++) {
      emails.push({
        emailId: `id-${i}`,
        to: `test${i}@example.com`,
        subject: 'Test',
        body: 'Rate limit test'
      });
    }

    const results = await Promise.all(
      emails.map(email => emailService.sendEmail(email))
    );

    const rateLimited = results.filter(status => status === 'RATE_LIMITED');
    expect(rateLimited.length).toBeGreaterThan(0); // At least one should be blocked
  });

  test('tracks status for each email', async () => {
    const email = mockEmail();
    await emailService.sendEmail(email);
    const status = emailService.getStatus(email.emailId);
    expect(status).toBeDefined();
    expect(['SUCCESS', 'FAILED', 'RATE_LIMITED']).toContain(status);
  });
});
