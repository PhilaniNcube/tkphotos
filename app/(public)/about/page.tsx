import * as React from "react";
import type { Metadata } from "next";
import {
  ABOUT_PORTRAIT_LEGACY_URL,
  getAboutMedia,
} from "@/lib/queries/editorial-media";
import { getPhotoByLegacyUrl } from "@/lib/queries/photos";
import { photoSrc } from "@/lib/utils";
import { AboutCtaSection } from "./_components/about-cta-section";
import { AboutHeroSection } from "./_components/about-hero-section";
import { PhilosophyAndPracticeSection } from "./_components/philosophy-and-practice-section";
import { StudioStatsSection } from "./_components/studio-stats-section";

export async function generateMetadata(): Promise<Metadata> {
  const portrait = await getPhotoByLegacyUrl(ABOUT_PORTRAIT_LEGACY_URL);
  const imageUrl = portrait ? photoSrc(portrait, "medium") : "/logo.webp";
  const width = portrait?.sizes.medium?.width ?? 799;
  const height = portrait?.sizes.medium?.height ?? 604;

  return {
    title: "About Thandikaya Matokazi | TK Media",
    description:
      "Meet Thandikaya Matokazi, professional photographer with 9+ years experience capturing authentic moments in events, families, sports and corporate photography in Eastern Cape, South Africa.",
    keywords: [
      "Thandikaya Matokazi",
      "professional photographer",
      "Eastern Cape photographer",
      "South African photographer",
      "photography experience",
      "event photographer",
      "family photographer",
      "sports photographer",
    ],
    openGraph: {
      title: "About Thandikaya Matokazi | TK Media",
      description:
        "Meet Thandikaya Matokazi, professional photographer with 9+ years experience capturing authentic moments in Eastern Cape, South Africa.",
      type: "profile",
      images: [
        {
          url: imageUrl,
          width,
          height,
          alt: "Portrait of Thandikaya Matokazi, Professional Photographer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About Thandikaya Matokazi | TK Media",
      description:
        "Meet Thandikaya Matokazi, professional photographer capturing authentic moments across the Eastern Cape.",
      images: [imageUrl],
    },
    alternates: {
      canonical: "/about",
    },
  };
}

export default async function AboutPage() {
  const { portrait, editorial } = await getAboutMedia();

  return (
    <div className="flex w-full flex-col">
      <AboutHeroSection portrait={portrait} />
      <PhilosophyAndPracticeSection editorialPhoto={editorial} />
      <StudioStatsSection />
      <AboutCtaSection />
    </div>
  );
}
