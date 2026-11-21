import * as React from "react";
import type { Metadata } from "next";
import { getServicesHeroMedia } from "@/lib/queries/editorial-media";
import { CoreOfferingsSection } from "./_components/core-offerings-section";
import { PackagesPricingSection } from "./_components/packages-pricing-section";
import { ServicesHeroSection } from "./_components/services-hero-section";
import { WorkflowAndCtaSection } from "./_components/workflow-and-cta-section";

export const metadata: Metadata = {
  title: "Photography Services & Packages | TK Media",
  description:
    "Professional photography and media services including event photography, family portraits, sports photography, corporate photography, videography, and media management in Eastern Cape.",
  keywords: [
    "photography services",
    "event photography",
    "family portraits",
    "sports photography",
    "corporate photography",
    "videography",
    "media management",
    "photography packages",
    "Eastern Cape photographer",
    "professional photography services",
  ],
  openGraph: {
    title: "Photography Services & Packages | TK Media",
    description:
      "Professional photography and media services including events, families, sports, corporate photography, videography, and media management.",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 799,
        height: 604,
        alt: "TK Media Photography Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography Services & Packages | TK Media",
    description:
      "Professional photography and media services including events, families, sports, corporate photography, and videography.",
    images: ["/logo.webp"],
  },
  alternates: {
    canonical: "/services",
  },
};

export default async function ServicesPage() {
  const heroCards = await getServicesHeroMedia();

  return (
    <div className="flex w-full flex-col">
      <ServicesHeroSection cards={heroCards} />
      <CoreOfferingsSection />
      <PackagesPricingSection />
      <WorkflowAndCtaSection />
    </div>
  );
}
