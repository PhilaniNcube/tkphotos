import type { CSSProperties } from "react";

/**
 * Shared design tokens for transactional emails.
 * Kept as plain values so templates work in both Next.js and the React Email
 * preview server (which may not load `.env.local`).
 */
export const emailTheme = {
  colors: {
    page: "#f5f3ef",
    card: "#ffffff",
    ink: "#292524",
    muted: "#78716c",
    faint: "#a8a29e",
    line: "#e7e5e4",
    accent: "#a16207",
    accentSoft: "#fef3c7",
    buttonText: "#ffffff",
    messageBackground: "#fafaf9",
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://tkmedia.co.za"
  ).replace(/\/+$/, ""),
} as const;

export const emailStyles = {
  body: {
    backgroundColor: emailTheme.colors.page,
    color: emailTheme.colors.ink,
    fontFamily: emailTheme.fontFamily,
    margin: 0,
    padding: "32px 12px",
  },
  container: {
    backgroundColor: emailTheme.colors.card,
    border: `1px solid ${emailTheme.colors.line}`,
    borderRadius: "12px",
    margin: "0 auto",
    maxWidth: "600px",
    overflow: "hidden",
  },
  brandBar: {
    padding: "28px 32px 18px",
  },
  brand: {
    color: emailTheme.colors.ink,
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    lineHeight: "24px",
    margin: 0,
  },
  tagline: {
    color: emailTheme.colors.muted,
    fontSize: "12px",
    letterSpacing: "0.08em",
    lineHeight: "18px",
    margin: "4px 0 0",
    textTransform: "uppercase" as const,
  },
  accentRule: {
    borderColor: emailTheme.colors.accent,
    borderTopWidth: "2px",
    margin: "0 32px",
  },
  content: {
    padding: "28px 32px 8px",
  },
  heading: {
    color: emailTheme.colors.ink,
    fontSize: "22px",
    fontWeight: 600,
    lineHeight: "30px",
    margin: "0 0 18px",
  },
  paragraph: {
    color: emailTheme.colors.ink,
    fontSize: "15px",
    lineHeight: "24px",
    margin: "0 0 16px",
  },
  muted: {
    color: emailTheme.colors.muted,
    fontSize: "13px",
    lineHeight: "20px",
    margin: "0 0 12px",
  },
  label: {
    color: emailTheme.colors.faint,
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    lineHeight: "16px",
    margin: "0 0 4px",
    textTransform: "uppercase" as const,
  },
  value: {
    color: emailTheme.colors.ink,
    fontSize: "15px",
    lineHeight: "22px",
    margin: "0 0 14px",
  },
  messageBox: {
    backgroundColor: emailTheme.colors.messageBackground,
    border: `1px solid ${emailTheme.colors.line}`,
    borderRadius: "8px",
    margin: "8px 0 22px",
    padding: "18px 20px",
  },
  messageText: {
    color: emailTheme.colors.ink,
    fontSize: "15px",
    lineHeight: "24px",
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  },
  button: {
    backgroundColor: emailTheme.colors.ink,
    borderRadius: "6px",
    color: emailTheme.colors.buttonText,
    display: "inline-block",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    padding: "12px 20px",
    textDecoration: "none",
  },
  divider: {
    borderColor: emailTheme.colors.line,
    margin: "26px 32px 0",
  },
  footer: {
    padding: "18px 32px 26px",
  },
  footerText: {
    color: emailTheme.colors.faint,
    fontSize: "12px",
    lineHeight: "18px",
    margin: "0 0 4px",
  },
  footerLink: {
    color: emailTheme.colors.muted,
    textDecoration: "underline",
  },
} satisfies Record<string, CSSProperties>;
