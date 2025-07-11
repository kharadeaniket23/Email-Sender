// src/providers/MockProviderB.ts

import { EmailRequest, IEmailProvider } from '../types';

export class MockProviderB implements IEmailProvider {
  async send(email: EmailRequest): Promise<boolean> {
    console.log(`[MockProviderB] Sending email to ${email.to}`);

    // Simulate network delay
    await this.simulateDelay();

    // Simulate random failure (50% success rate)
    const success = Math.random() > 0.5;

    if (success) {
      console.log(`[MockProviderB] Email ${email.emailId} sent successfully.`);
      return true;
    } else {
      console.log(`[MockProviderB] Failed to send email ${email.emailId}.`);
      throw new Error('MockProviderB failed to send email.');
    }
  }

  private simulateDelay(): Promise<void> {
    const delay = 100 + Math.random() * 400; // Random delay between 100–500ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
