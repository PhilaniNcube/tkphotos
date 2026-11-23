import { Button, Link, Section, Text } from "react-email";

import { EmailLayout } from "./components/email-layout";
import { emailStyles } from "./theme";

export interface PasswordEmailProps {
  /** True for an admin invitation, false for a self-service password reset. */
  invited?: boolean;
  name?: string | null;
  email?: string;
  role?: string | null;
  resetUrl?: string;
  expiresInHours?: number;
  siteUrl?: string;
}

function roleLabel(role?: string | null): string {
  if (role === "admin") return "Admin — manages accounts and content";
  if (role === "editor") return "Editor — manages content";
  return "Team member";
}

/**
 * Sent both when an admin invites someone to the Payload dashboard and when
 * someone requests a password reset from the login screen.
 */
export function PasswordEmail({
  invited = true,
  name,
  email = "info@tkmedia.co.za",
  role,
  resetUrl = "https://tkmedia.co.za/admin/reset/example-token",
  expiresInHours = 72,
  siteUrl,
}: PasswordEmailProps) {
  const greeting = name ? `Hi ${name},` : "Hi,";

  return (
    <EmailLayout
      preview={
        invited
          ? "You have been invited to the TK Media dashboard"
          : "Reset your TK Media dashboard password"
      }
      heading={invited ? "You're invited to the dashboard" : "Reset your password"}
      siteUrl={siteUrl}
      footerNote={
        invited
          ? "You are receiving this because a TK Media admin invited you."
          : "You are receiving this because someone requested a password reset."
      }
    >
      <Text style={emailStyles.paragraph}>{greeting}</Text>

      <Text style={emailStyles.paragraph}>
        {invited
          ? "You have been given access to the TK Media content dashboard, where galleries, photos, posts and services are managed. Choose a password to activate your account."
          : "We received a request to reset the password for your TK Media content dashboard account."}
      </Text>

      <Section>
        <Text style={emailStyles.label}>Account</Text>
        <Text style={emailStyles.value}>{email}</Text>

        <Text style={emailStyles.label}>Access</Text>
        <Text style={emailStyles.value}>{roleLabel(role)}</Text>
      </Section>

      <Button href={resetUrl} style={emailStyles.button}>
        {invited ? "Set my password" : "Reset my password"}
      </Button>

      <Text style={emailStyles.muted}>
        This link expires in {expiresInHours} hours and can only be used once.
        If it has expired, use the &ldquo;Forgot password&rdquo; link on the
        dashboard login screen to request a new one.
      </Text>

      <Text style={emailStyles.muted}>
        If the button does not work, open this link:
        <br />
        <Link href={resetUrl} style={emailStyles.footerLink}>
          {resetUrl}
        </Link>
      </Text>

      {invited ? (
        <Text style={emailStyles.muted}>
          If you were not expecting this invitation you can ignore this email.
        </Text>
      ) : (
        <Text style={emailStyles.muted}>
          If you did not request this you can safely ignore this email; your
          password will not change.
        </Text>
      )}
    </EmailLayout>
  );
}

export default PasswordEmail;
