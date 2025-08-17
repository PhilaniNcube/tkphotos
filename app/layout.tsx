import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000"; // Assumption fallback

export const metadata: Metadata = {
  title: {
    default: "TK Photos | Eastern Cape Photographer",
    template: "%s | TK Photos",
  },
  description:
    "Professional photography & media services by Thandikaya Matokazi: events, families, sports, conferences, videography & media management in the Eastern Cape.",
  keywords: [
    "Eastern Cape photographer",
    "South Africa photography",
    "event photography",
    "family portraits",
    "sports photographer",
    "conference photography",
    "videography",
  ],
  authors: [{ name: "Thandikaya Matokazi" }],
  creator: "Thandikaya Matokazi",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "TK Photos",
    title: "TK Photos | Eastern Cape Photographer",
    description:
      "Professional photography & media services: events, families, sports, conferences, videography & media management.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "TK Photos portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@",
    creator: "@",
    title: "TK Photos | Eastern Cape Photographer",
    description:
      "Professional photography & media services: events, families, sports, conferences, videography & media management.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  category: "Photography",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
