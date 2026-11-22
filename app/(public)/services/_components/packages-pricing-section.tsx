"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  Briefcase,
  Camera,
  Film,
  Heart,
  Music,
  Palette,
  PenTool,
  Presentation,
  Share2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import {
  FilterSegmentedControl,
  type SegmentedOption,
} from "@/components/ui-sdk/segmented-control";
import {
  DEFAULT_SERVICES,
  type ServiceCategory,
  type ServiceIconName,
  type ServicePackageItem,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";

type PackageCategory = "all" | ServiceCategory;

interface PackagesPricingSectionProps {
  packages?: ServicePackageItem[];
}

const filterOptions: Array<SegmentedOption<PackageCategory>> = [
  { value: "all", label: "All Packages" },
  { value: "events", label: "Events & Weddings" },
  { value: "commercial", label: "Corporate & Branding" },
  { value: "studio", label: "Studio & Design" },
];

const ICON_MAP: Record<
  ServiceIconName,
  React.ComponentType<{ className?: string }>
> = {
  heart: Heart,
  briefcase: Briefcase,
  music: Music,
  trophy: Trophy,
  palette: Palette,
  sparkles: Sparkles,
  share2: Share2,
  camera: Camera,
  "pen-tool": PenTool,
  film: Film,
  presentation: Presentation,
  users: Users,
};

export function PackagesPricingSection({
  packages = DEFAULT_SERVICES,
}: PackagesPricingSectionProps) {
  const [filter, setFilter] = React.useState<PackageCategory>("all");

  const visiblePackages = React.useMemo(() => {
    if (filter === "all") return packages;
    return packages.filter((pkg) => pkg.category === filter);
  }, [filter, packages]);

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

        {visiblePackages.length === 0 ? (
          <div className="rounded-xl bg-surface-container-low p-10 text-center">
            <p className="text-sm text-on-surface-variant">
              No packages available in this category right now. Please select
              another filter or contact us for a custom quote.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visiblePackages.map((pkg) => {
              const Icon = ICON_MAP[pkg.icon] ?? Camera;
              const contactHref = `/contact?service=${pkg.slug}` as Route;

              return (
                <article
                  key={pkg.slug}
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
        )}
      </div>
    </section>
  );
}
