import { Button, Section, Text } from "react-email";

import { EmailLayout } from "./components/email-layout";
import { emailStyles, emailTheme } from "./theme";

export interface ContactAutoReplyEmailProps {
  name?: string;
  service?: string | null;
  message?: string;
  siteUrl?: string;
}

function firstName(name: string | undefined): string {
  if (!name) return "there";
  return name.trim().split(/\s+/)[0] || "there";
}

/** Confirmation sent to the person who submitted the contact form. */
export function ContactAutoReplyEmail({
  name = "Thandi Mokoena",
  service = "Wedding photography",
  message = "Hi TK Media,\n\nWe are looking for a photographer for our wedding next March. Could you share availability and packages?\n\nThanks!",
  siteUrl = emailTheme.siteUrl,
}: ContactAutoReplyEmailProps) {
  return (
    <EmailLayout
      preview="Thanks for reaching out to TK Media"
      heading={`Thanks for reaching out, ${firstName(name)}`}
      siteUrl={siteUrl}
      footerNote="Please reply to this email if you need to add anything."
    >
      <Text style={emailStyles.paragraph}>
        I&apos;ve received your message and will get back to you within 1–2
        business days with availability and next steps.
      </Text>

      <Text style={emailStyles.label}>Your enquiry</Text>
      <Text style={emailStyles.value}>{service || "General enquiry"}</Text>

      <Section style={emailStyles.messageBox}>
        <Text style={emailStyles.messageText}>{message ?? "—"}</Text>
      </Section>

      <Text style={emailStyles.paragraph}>
        In the meantime, you can browse recent galleries or reply directly to
        this email if you have any extra details to share.
      </Text>

      <Button href={`${siteUrl}/galleries`} style={emailStyles.button}>
        View recent work
      </Button>
    </EmailLayout>
  );
}

export default ContactAutoReplyEmail;
