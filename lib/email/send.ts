import type { ReactElement } from "react";

import { render, toPlainText } from "react-email";
import { Resend } from "resend";

import { emailConfig, formatFromAddress, isEmailConfigured } from "./config";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(emailConfig.apiKey);
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
  from?: string;
  tags?: { name: string; value: string }[];
}

export type SendEmailResult =
  | { skipped: true; id: null }
  | { skipped: false; id: string };

/**
 * Render a React Email template and send it through Resend.
 *
 * When `RESEND_API_KEY` is not set, calls are logged and skipped instead of
 * crashing the app. This keeps local development and preview builds working
 * before the key is added.
 */
export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
  from,
  tags,
}: SendEmailOptions): Promise<SendEmailResult> {
  if (!isEmailConfigured()) {
    console.warn(
      `[email] RESEND_API_KEY is not set; skipped email "${subject}".`
    );
    return { skipped: true, id: null };
  }

  const html = await render(react);
  const text = toPlainText(html);

  const recipients = emailConfig.overrideRecipient
    ? [emailConfig.overrideRecipient]
    : Array.isArray(to)
    ? to
    : [to];

  const replyToAddresses = replyTo
    ? [replyTo]
    : emailConfig.replyTo
    ? [emailConfig.replyTo]
    : undefined;

  const { data, error } = await getResend().emails.send({
    from: from || formatFromAddress(),
    to: recipients,
    subject: emailConfig.overrideRecipient
      ? `[test:${recipients.join(",")}] ${subject}`
      : subject,
    html,
    text,
    replyTo: replyToAddresses,
    tags,
  });

  if (error) {
    throw new Error(
      `Resend failed to send "${subject}": ${error.name ?? "error"} — ${
        error.message
      }`
    );
  }

  if (!data?.id) {
    throw new Error(`Resend did not return an id for "${subject}".`);
  }

  return { skipped: false, id: data.id };
}
