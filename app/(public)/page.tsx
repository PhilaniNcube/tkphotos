import * as React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import {
  BookingCtaBandFallback,
  BookingCtaBandSection,
} from "./_components/home/booking-cta-band-section";
import { ClientTestimonialsSection } from "./_components/home/client-testimonials-section";
import {
  ExpertiseShowcaseFallback,
  ExpertiseShowcaseSection,
} from "./_components/home/expertise-showcase-section";
import {
  FeaturedGalleriesFallback,
  FeaturedGalleriesSection,
} from "./_components/home/featured-galleries-section";
import {
  FeaturedWorkFallback,
  FeaturedWorkSection,
} from "./_components/home/featured-work-section";
import { HeroCarouselSection } from "./_components/home/hero-carousel-section";
import { StudioManifestoSection } from "./_components/home/studio-manifesto-section";

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
    "conference photography",
    "videography",
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

export default function HomePage() {
  return (
    <div className="flex w-full flex-col">
      <HeroCarouselSection />
      <StudioManifestoSection />
      <Suspense fallback={<ExpertiseShowcaseFallback />}>
        <ExpertiseShowcaseSection />
      </Suspense>
      <Suspense fallback={<FeaturedWorkFallback />}>
        <FeaturedWorkSection />
      </Suspense>
      <Suspense fallback={<FeaturedGalleriesFallback />}>
        <FeaturedGalleriesSection />
      </Suspense>
      <ClientTestimonialsSection />
      <Suspense fallback={<BookingCtaBandFallback />}>
        <BookingCtaBandSection />
      </Suspense>
    </div>
  );
}
