/**
 * Send a real test email through Resend.
 *
 * Usage:
 *   pnpm email:test -- --to=you@example.com
 *
 * Requires RESEND_API_KEY plus a verified EMAIL_FROM_ADDRESS (or Resend's
 * onboarding@resend.dev sender while testing).
 */
import { ContactAutoReplyEmail } from "../../emails";
import { emailConfig, isEmailConfigured } from "../../lib/email/config";
import { sendEmail } from "../../lib/email/send";

const args = process.argv.slice(2);
const to =
  args.find((arg) => arg.startsWith("--to="))?.split("=")[1] ?? args[0];

if (!to || to.startsWith("--")) {
  console.error(
    "Usage: pnpm email:test -- --to=you@example.com\n" +
      "If RESEND_OVERRIDE_RECIPIENT is set, the email is routed there instead."
  );
  process.exit(1);
}

if (!isEmailConfigured()) {
  console.error(
    "RESEND_API_KEY is not set. Add it to .env.local (and Vercel) first."
  );
  process.exit(1);
}

console.log(
  `Sending test email from ${emailConfig.fromName} <${emailConfig.fromAddress}>...`
);
if (emailConfig.overrideRecipient) {
  console.log(
    `RESEND_OVERRIDE_RECIPIENT is set — delivering to ${emailConfig.overrideRecipient} instead of ${to}.`
  );
}

try {
  const result = await sendEmail({
    to,
    subject: "TK Media email test",
    tags: [{ name: "type", value: "email-test" }],
    react: (
      <ContactAutoReplyEmail
        name="Test Recipient"
        service="Email delivery test"
        message="This is a test of the TK Media Resend + React Email pipeline."
      />
    ),
  });

  console.log(`Sent successfully. Resend id: ${result.id}`);
} catch (error) {
  console.error(
    `Send failed: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exit(1);
}
