// src/index.ts

import { EmailService } from './EmailService';
import { MockProviderA } from './providers/MockProviderA';
import { MockProviderB } from './providers/MockProviderB';
import { EmailRequest } from './types';

// Initialize mock providers
const providerA = new MockProviderA();
const providerB = new MockProviderB();

// Create EmailService instance with both providers and 5 emails/minute rate limit
const emailService = new EmailService([providerA, providerB], 5);

// Sample email
const email: EmailRequest = {
  emailId: '12345',
  to: 'user@example.com',
  subject: 'Hello from EmailService!',
  body: 'This is a test email.'
};

async function run() {
  const result = await emailService.sendEmail(email);
  console.log(`Final Status: ${result}`);

  // Try sending the same email again (idempotency test)
  const repeatResult = await emailService.sendEmail(email);
  console.log(`Repeat Send Status (should be idempotent): ${repeatResult}`);
}

run();
