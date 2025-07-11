// src/types/index.ts

export interface EmailRequest {
  emailId: string;       // Unique ID for idempotency
  to: string;            // Recipient email address
  subject: string;
  body: string;
}

export type EmailStatus = 
  | 'SUCCESS'
  | 'FAILED'
  | 'RETRIED'
  | 'RATE_LIMITED'
  | 'IDEMPOTENT';

export interface IEmailProvider {
  send(email: EmailRequest): Promise<boolean>;
}
