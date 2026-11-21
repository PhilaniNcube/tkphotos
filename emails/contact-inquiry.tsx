import { Button, Section, Text } from "react-email";

import { EmailLayout } from "./components/email-layout";
import { emailStyles } from "./theme";

export interface ContactInquiryEmailProps {
  name?: string;
  email?: string;
  service?: string | null;
  message?: string;
  submittedAt?: string;
  siteUrl?: string;
}

/** Internal notification sent to the TK Media inbox. */
export function ContactInquiryEmail({
  name = "Thandi Mokoena",
  email = "thandi@example.com",
  service = "Wedding photography",
  message = "Hi TK Media,\n\nWe are looking for a photographer for our wedding next March. Could you share availability and packages?\n\nThanks!",
  submittedAt = "21 November 2026 at 18:30",
  siteUrl,
}: ContactInquiryEmailProps) {
  const replySubject = encodeURIComponent(
    `Re: New website enquiry from ${name ?? "a client"}`
  );
  const replyHref = `mailto:${email}?subject=${replySubject}`;

  return (
    <EmailLayout
      preview={`New enquiry from ${name ?? "a client"}`}
      heading="New website enquiry"
      siteUrl={siteUrl}
      footerNote="You are receiving this because someone submitted the contact form."
    >
      <Text style={emailStyles.paragraph}>
        A new message was submitted through the TK Media website.
      </Text>

      <Section>
        <Text style={emailStyles.label}>Name</Text>
        <Text style={emailStyles.value}>{name ?? "—"}</Text>

        <Text style={emailStyles.label}>Email</Text>
        <Text style={emailStyles.value}>{email ?? "—"}</Text>

        <Text style={emailStyles.label}>Service</Text>
        <Text style={emailStyles.value}>{service || "General enquiry"}</Text>

        <Text style={emailStyles.label}>Submitted</Text>
        <Text style={emailStyles.value}>{submittedAt}</Text>
      </Section>

      <Text style={emailStyles.label}>Message</Text>
      <Section style={emailStyles.messageBox}>
        <Text style={emailStyles.messageText}>{message ?? "—"}</Text>
      </Section>

      <Button href={replyHref} style={emailStyles.button}>
        Reply to {name ?? "client"}
      </Button>
    </EmailLayout>
  );
}

export default ContactInquiryEmail;
