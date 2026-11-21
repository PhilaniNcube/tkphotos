import * as React from "react";
import type { Metadata } from "next";
import { getHomepageGalleries } from "@/lib/queries/galleries";
import { getHeroCarouselMedia } from "@/lib/queries/editorial-media";
import { getFeaturedPhotos } from "@/lib/queries/photos";
import { BookingCtaBandSection } from "./_components/home/booking-cta-band-section";
import { ClientTestimonialsSection } from "./_components/home/client-testimonials-section";
import { FeaturedGalleriesSection } from "./_components/home/featured-galleries-section";
import { FeaturedWorkSection } from "./_components/home/featured-work-section";
import { HeroCarouselSection } from "./_components/home/hero-carousel-section";

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

export default async function HomePage() {
  const [heroPhotos, featuredPhotos, homepageGalleries] = await Promise.all([
    getHeroCarouselMedia(),
    getFeaturedPhotos(3),
    getHomepageGalleries({
      gallerySlugs: ["swazi-luxe-opening", "dj-buja", "chippa-vs-ts-galaxy"],
      photosPerGallery: 1,
      fallbackToRecent: true,
    }),
  ]);

  return (
    <div className="flex w-full flex-col">
      <HeroCarouselSection photos={heroPhotos} />
      <FeaturedWorkSection photos={featuredPhotos} />
      <FeaturedGalleriesSection galleries={homepageGalleries} />
      <BookingCtaBandSection />
      <ClientTestimonialsSection />
    </div>
  );
}
