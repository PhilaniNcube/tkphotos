import Image from "next/image";
import type { Metadata } from "next";
import HomePageHero from "./_components/hompage-hero";
import FeaturedPhotos from "./_components/featured-photos";
import HomepageGalleriesGrid from "./_components/homepage-galleries-grid";
import CollectionsCTA from "./_components/collections-cta";
import Testimonials from "./_components/testimonials";

export const metadata: Metadata = {
  title: "TK Media | Professional Photography Services in Eastern Cape",
  description:
    "Professional photographer Thandikaya Matokazi captures authentic moments through events, family portraits, sports, and corporate photography in Eastern Cape, South Africa.",
  keywords: [
    "professional photography",
    "Eastern Cape photographer",
    "event photography",
    "family portraits",
    "sports photography",
    "corporate photography",
    "Thandikaya Matokazi",
    "South Africa photography",
  ],
  openGraph: {
    title: "TK Media | Professional Photography Services",
    description:
      "Professional photographer capturing authentic moments through events, family portraits, sports, and corporate photography in Eastern Cape, South Africa.",
    type: "website",
    locale: "en_ZA",
    siteName: "TK Media",
    images: [
      {
        url: "/logo.webp",
        width: 799,
        height: 604,
        alt: "TK Media Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TK Media | Professional Photography Services",
    description:
      "Professional photographer capturing authentic moments through events, family portraits, sports, and corporate photography.",
    images: ["/logo.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <HomePageHero />
      <FeaturedPhotos />
      <HomepageGalleriesGrid />
      <CollectionsCTA />
      <Testimonials />
    </>
  );
}
