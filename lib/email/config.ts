function value(name: string): string {
  return (process.env[name] || "").trim();
}

function list(name: string): string[] {
  return value(name)
    .split(/[,;]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const fromAddress = value("EMAIL_FROM_ADDRESS") || "noreply@tkmedia.co.za";
const fromName = value("EMAIL_FROM_NAME") || "TK Media";
const contactRecipients = list("CONTACT_TO_EMAIL");
const replyTo = value("EMAIL_REPLY_TO");

export const emailConfig = {
  apiKey: value("RESEND_API_KEY"),
  fromAddress,
  fromName,
  /** Inbox that receives website enquiries. */
  contactInbox: contactRecipients.length
    ? contactRecipients
    : [value("EMAIL_REPLY_TO") || "hello@tkmedia.co.za"],
  replyTo: replyTo || undefined,
  /** Route every outgoing email here (useful while testing a new domain). */
  overrideRecipient: value("RESEND_OVERRIDE_RECIPIENT") || undefined,
  siteUrl: (
    value("NEXT_PUBLIC_SITE_URL") || "https://tkmedia.co.za"
  ).replace(/\/+$/, ""),
} as const;

export function isEmailConfigured(): boolean {
  return emailConfig.apiKey.length > 0;
}

export function formatFromAddress(): string {
  return `${emailConfig.fromName} <${emailConfig.fromAddress}>`;
}
