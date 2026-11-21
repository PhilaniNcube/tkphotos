"use server";

import { revalidatePath } from "next/cache";

import { ContactAutoReplyEmail, ContactInquiryEmail } from "@/emails";
import { emailConfig, isEmailConfigured } from "@/lib/email/config";
import { sendEmail } from "@/lib/email/send";

import { ContactInput, contactSchema, SERVICE_OPTIONS } from "../schema";

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Johannesburg",
  }).format(date);
}

function serviceLabel(value?: string): string {
  if (!value) return "General enquiry";
  return (
    SERVICE_OPTIONS.find((option) => option.value === value)?.label ??
    "General enquiry"
  );
}

function shortServiceLabel(value?: string): string {
  if (!value) return "General";
  const label = SERVICE_OPTIONS.find((option) => option.value === value)?.label;
  return label ? label.replace(/\s*\(.*\)$/, "") : "General";
}

export async function submitContact(formData: ContactInput) {
  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    } as const;
  }

  if (!isEmailConfigured()) {
    console.warn(
      "[contact] RESEND_API_KEY is not set; submission was not emailed.",
      parsed.data
    );
    return {
      error:
        "Email is not configured yet. Please try again later or contact us directly.",
    } as const;
  }

  const submittedAt = new Date();
  const submittedAtLabel = formatSubmittedAt(submittedAt);
  const fullService = serviceLabel(parsed.data.service);
  const serviceForSubject = shortServiceLabel(parsed.data.service);

  try {
    const notification = await sendEmail({
      to: emailConfig.contactInbox,
      subject: `New ${serviceForSubject} enquiry from ${parsed.data.name}`,
      replyTo: parsed.data.email,
      tags: [{ name: "type", value: "contact-inquiry" }],
      react: (
        <ContactInquiryEmail
          name={parsed.data.name}
          email={parsed.data.email}
          service={fullService}
          message={parsed.data.message}
          submittedAt={submittedAtLabel}
          siteUrl={emailConfig.siteUrl}
        />
      ),
    });

    if (notification.skipped) {
      return {
        error:
          "Email is not configured yet. Please try again later or contact us directly.",
      } as const;
    }

    // The auto-reply is best-effort: the enquiry has already reached the inbox.
    try {
      await sendEmail({
        to: parsed.data.email,
        subject: "Thanks for reaching out — TK Media",
        replyTo: emailConfig.contactInbox[0],
        tags: [{ name: "type", value: "contact-autoreply" }],
        react: (
          <ContactAutoReplyEmail
            name={parsed.data.name}
            service={fullService}
            message={parsed.data.message}
            siteUrl={emailConfig.siteUrl}
          />
        ),
      });
    } catch (error) {
      console.error("[contact] Auto-reply failed:", error);
    }

    revalidatePath("/contact");
    return { error: null } as const;
  } catch (error) {
    console.error("[contact] Failed to send enquiry:", error);
    return {
      error: `We could not send your message. Please try again or email us at ${emailConfig.contactInbox[0]}.`,
    } as const;
  }
}
