import type { ReactNode } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "react-email";

import { emailStyles, emailTheme } from "../theme";

interface EmailLayoutProps {
  preview: string;
  heading: string;
  children: ReactNode;
  footerNote?: string;
  siteUrl?: string;
}

/**
 * Branded shell shared by every transactional email.
 * Uses table-based primitives from React Email and inline styles so it renders
 * consistently in Gmail, Apple Mail and Outlook.
 */
export function EmailLayout({
  preview,
  heading,
  children,
  footerNote,
  siteUrl = emailTheme.siteUrl,
}: EmailLayoutProps) {
  const displayUrl = siteUrl.replace(/^https?:\/\//, "");

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.brandBar}>
            <Text style={emailStyles.brand}>TK MEDIA</Text>
            <Text style={emailStyles.tagline}>
              Photography &amp; Videography
            </Text>
          </Section>
          <Hr style={emailStyles.accentRule} />
          <Section style={emailStyles.content}>
            <Heading style={emailStyles.heading}>{heading}</Heading>
            {children}
          </Section>
          <Hr style={emailStyles.divider} />
          <Section style={emailStyles.footer}>
            <Text style={emailStyles.footerText}>
              TK Media · Eastern Cape, South Africa
            </Text>
            {footerNote ? (
              <Text style={emailStyles.footerText}>{footerNote}</Text>
            ) : null}
            <Text style={emailStyles.footerText}>
              <Link href={siteUrl} style={emailStyles.footerLink}>
                {displayUrl}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
