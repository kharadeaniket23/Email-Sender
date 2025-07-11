# 📧 Resilient Email Sending Service

A robust, testable email sending service built in **TypeScript** with the following features:

- ✅ Retry with exponential backoff
- ✅ Provider fallback mechanism
- ✅ Idempotency to prevent duplicate sends
- ✅ Basic rate limiting
- ✅ Status tracking
- ⭐ Circuit breaker pattern (bonus)
- ⭐ Simple logging
- ⭐ Mock providers (no actual emails sent)

---

## 📁 Project Structure

src/
├── EmailService.ts
├── index.ts
├── types/
│ └── index.ts
├── providers/
│ ├── MockProviderA.ts
│ └── MockProviderB.ts
├── utils/
│ ├── RateLimiter.ts
│ └── CircuitBreaker.ts
tests/
└── EmailService.test.ts

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Clone the Repo


git clone https://github.com/your-username/email-service.git
cd email-service
2. Install Dependencies

npm install
3. Run the Example

npx ts-node src/index.ts
4. Run Tests

npm test

🧩 Usage
Example code to send an email:

ts
Copy
Edit
const email: EmailRequest = {
  emailId: 'abc123',
  to: 'test@example.com',
  subject: 'Hello!',
  body: 'This is a test email.'
};

await emailService.sendEmail(email);
🧠 Features Explained
Feature	Description
Retry Logic	Tries up to 3 times with exponential backoff.
Fallback	Switches to next provider if one fails.
Idempotency	Uses emailId to prevent duplicate sends.
Rate Limiting	Configurable limit (default: 5 emails/min).
Status Tracking	Query email status via getStatus(emailId).
Circuit Breaker	Temporarily disables failing providers.

🔧 Assumptions
Email requests contain a unique emailId.

Mock providers simulate network and random failures.

No actual emails are sent.

🧪 Testing
Includes unit tests for:

Successful email sending

Retry and fallback behavior

Idempotent request handling

Rate limiting

Circuit breaker triggering

📚 Tech Stack
TypeScript

Node.js

Jest (for testing)

📝 License
MIT © [ Aniket Kharade ]