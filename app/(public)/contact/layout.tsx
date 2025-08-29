import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | TK Media",
  description:
    "Get in touch with TK Media for professional photography services. Contact Thandikaya Matokazi for events, family portraits, sports, and corporate photography in Eastern Cape.",
  keywords: [
    "contact photographer",
    "TK Media contact",
    "photography inquiry",
    "book photographer",
    "Eastern Cape photographer contact",
    "Thandikaya Matokazi contact",
    "photography services inquiry",
  ],
  openGraph: {
    title: "Contact Us | TK Media",
    description:
      "Get in touch with TK Media for professional photography services. Contact us for events, family portraits, sports, and corporate photography.",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 799,
        height: 604,
        alt: "Contact TK Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | TK Media",
    description:
      "Get in touch with TK Media for professional photography services.",
    images: ["/logo.webp"],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
