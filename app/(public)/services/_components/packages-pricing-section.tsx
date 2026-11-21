"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  Briefcase,
  Camera,
  Heart,
  Music,
  Palette,
  PenTool,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import {
  FilterSegmentedControl,
  type SegmentedOption,
} from "@/components/ui-sdk/segmented-control";
import { cn } from "@/lib/utils";

type PackageCategory = "all" | "events" | "commercial" | "studio";

interface PackageItem {
  serviceValue: string;
  category: Exclude<PackageCategory, "all">;
  badge: string;
  title: string;
  description: string;
  rateLabel: string;
  rate: string;
  featured?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const filterOptions: Array<SegmentedOption<PackageCategory>> = [
  { value: "all", label: "All Packages" },
  { value: "events", label: "Events & Weddings" },
  { value: "commercial", label: "Corporate & Branding" },
  { value: "studio", label: "Studio & Design" },
];

const PACKAGES: PackageItem[] = [
  {
    serviceValue: "anniversary_wedding",
    category: "events",
    badge: "Events",
    title: "Traditional / White Weddings",
    description:
      "Full-day ceremony, lobola, reception coverage, and bridal portraits.",
    rateLabel: "Rate Range",
    rate: "R6 000 – R30 000",
    icon: Heart,
  },
  {
    serviceValue: "corporate_event",
    category: "commercial",
    badge: "Corporate",
    title: "Corporate / Conferences",
    description:
      "Multi-day summits, keynotes, brand panels, and executive headshots.",
    rateLabel: "Rate Range",
    rate: "R6 000 – R20 000",
    icon: Briefcase,
  },
  {
    serviceValue: "entertainment_event",
    category: "events",
    badge: "Entertainment",
    title: "Entertainment Events",
    description: "Concerts, festivals, nightlife, and live stage performances.",
    rateLabel: "Rate Range",
    rate: "R5 000 – R30 000",
    icon: Music,
  },
  {
    serviceValue: "sport",
    category: "events",
    badge: "Action",
    title: "Sports Photography",
    description:
      "Tournaments, league fixtures, sideline action, and athletic branding.",
    rateLabel: "Rate Range",
    rate: "R4 500 – R15 000",
    icon: Trophy,
  },
  {
    serviceValue: "branding",
    category: "commercial",
    badge: "Commercial",
    title: "Branding Photography",
    description:
      "Product lookbooks, founder portraits, and bespoke campaign visuals.",
    rateLabel: "Rate Range",
    rate: "R4 000 – R20 000",
    icon: Palette,
  },
  {
    serviceValue: "matric_dance",
    category: "events",
    badge: "Milestone",
    title: "Matric Dance",
    description:
      "Red-carpet arrivals, couple portraits, and celebratory coverage.",
    rateLabel: "Rate Range",
    rate: "R2 000 – R15 000",
    icon: Sparkles,
  },
  {
    serviceValue: "social_media_mgmt",
    category: "commercial",
    badge: "Digital",
    title: "Social Media Management",
    description: "Monthly visual content production, scheduling & strategy.",
    rateLabel: "Rate Range",
    rate: "R3 000 – R10 000",
    icon: Share2,
  },
  {
    serviceValue: "studio",
    category: "studio",
    badge: "Studio",
    title: "Studio Shoots",
    description:
      "Controlled lighting for portraits, maternity, and family sessions.",
    rateLabel: "Rate Range",
    rate: "R1 000 – R3 000",
    icon: Camera,
  },
  {
    serviceValue: "graphic_poster",
    category: "studio",
    badge: "Design",
    title: "Graphic Design Poster",
    description:
      "High-impact event flyers, social announcement tiles & print posters.",
    rateLabel: "Flat Rate",
    rate: "R450",
    featured: true,
    icon: PenTool,
  },
];

export function PackagesPricingSection() {
  const [filter, setFilter] = React.useState<PackageCategory>("all");

  const visiblePackages = React.useMemo(() => {
    if (filter === "all") return PACKAGES;
    return PACKAGES.filter((pkg) => pkg.category === filter);
  }, [filter]);

  return (
    <section
      id="packages"
      className="w-full bg-surface px-6 py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              02 / Investment Guide
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              Bookable Packages &amp; ZAR Pricing
            </h2>
          </div>

          <FilterSegmentedControl
            ariaLabel="Filter packages by category"
            options={filterOptions}
            value={filter}
            onValueChange={setFilter}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visiblePackages.map((pkg) => {
            const Icon = pkg.icon;
            const contactHref = `/contact?service=${pkg.serviceValue}` as Route;

            return (
              <article
                key={pkg.serviceValue}
                className={cn(
                  "flex flex-col justify-between rounded-xl p-6 transition-colors",
                  pkg.featured
                    ? "bg-primary-fixed/50 hover:bg-primary-fixed"
                    : "bg-surface-container-low hover:bg-surface-container"
                )}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        pkg.featured ? "text-on-primary-fixed" : "text-primary"
                      )}
                    >
                      {pkg.badge}
                    </span>
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        pkg.featured
                          ? "text-on-primary-fixed"
                          : "text-on-surface-variant"
                      )}
                      aria-hidden="true"
                    />
                  </div>

                  <h3
                    className={cn(
                      "mb-1 text-lg font-bold",
                      pkg.featured ? "text-on-primary-fixed" : "text-on-surface"
                    )}
                  >
                    {pkg.title}
                  </h3>
                  <p
                    className={cn(
                      "mb-5 text-xs leading-relaxed",
                      pkg.featured
                        ? "text-on-primary-fixed-variant"
                        : "text-on-surface-variant"
                    )}
                  >
                    {pkg.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between rounded-lg bg-surface-container-lowest/80 px-4 py-3">
                    <span className="text-xs text-on-surface-variant">
                      {pkg.rateLabel}
                    </span>
                    <span className="font-mono text-base font-bold text-primary">
                      {pkg.rate}
                    </span>
                  </div>

                  <AppButton
                    variant={pkg.featured ? "primary" : "tonal"}
                    size="sm"
                    className="w-full justify-between"
                    render={<Link href={contactHref} />}
                  >
                    <span>
                      Inquire{" "}
                      <span className="sr-only">about {pkg.title}</span>
                    </span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </AppButton>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
