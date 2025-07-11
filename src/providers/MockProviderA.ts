// src/providers/MockProviderA.ts

import { EmailRequest, IEmailProvider } from '../types';

export class MockProviderA implements IEmailProvider {
  async send(email: EmailRequest): Promise<boolean> {
    console.log(`[MockProviderA] Sending email to ${email.to}`);

    // Simulate network delay
    await this.simulateDelay();

    // Simulate random failure (70% success rate)
    const success = Math.random() > 0.3;

    if (success) {
      console.log(`[MockProviderA] Email ${email.emailId} sent successfully.`);
      return true;
    } else {
      console.log(`[MockProviderA] Failed to send email ${email.emailId}.`);
      throw new Error('MockProviderA failed to send email.');
    }
  }

  private simulateDelay(): Promise<void> {
    const delay = 200 + Math.random() * 300; // Random delay between 200–500ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
