"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  BadgeCheck,
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
import { R2Image } from "@/components/ui-sdk/r2-image";
import {
  FilterSegmentedControl,
  type SegmentedOption,
} from "@/components/ui-sdk/segmented-control";
import { mediaSrcSet, mediaUrl } from "@/lib/media";
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
              const imageSrc = mediaUrl(pkg.featuredImage, "medium");
              const imageSrcSet = mediaSrcSet(pkg.featuredImage);
              const imageAlt = `${pkg.title} — ${pkg.badge}`;

              return (
                <article
                  key={pkg.slug}
                  className={cn(
                    "group rounded-[1.75rem] border p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    pkg.featured
                      ? "border-tertiary-fixed-dim/80 bg-tertiary-fixed/25"
                      : "border-outline-variant/50 bg-surface-container-lowest"
                  )}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-surface-container">
                    <R2Image
                      src={imageSrc}
                      srcSet={imageSrcSet}
                      sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      alt={imageAlt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141218] via-[#141218]/45 to-transparent" />

                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
                      <span className="rounded-full border border-white/20 bg-[#141218]/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                        {pkg.badge}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#141218]/45 text-white backdrop-blur-md">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-2 flex items-center gap-1.5">
                        <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                          {pkg.title}
                        </h3>
                        <BadgeCheck
                          className="h-5 w-5 shrink-0 text-tertiary-fixed"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/75">
                        {pkg.description}
                      </p>

                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                            {pkg.rateLabel}
                          </p>
                          <p className="truncate font-mono text-sm font-bold text-white">
                            {pkg.rate}
                          </p>
                        </div>

                        <AppButton
                          variant="outline"
                          size="sm"
                          className="shrink-0 rounded-full border-transparent bg-surface-container-lowest text-on-surface shadow-md hover:bg-tertiary-fixed hover:text-on-tertiary-fixed"
                          render={<Link href={contactHref} />}
                        >
                          <span>
                            Inquire{" "}
                            <span className="sr-only">about {pkg.title}</span>
                          </span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </AppButton>
                      </div>
                    </div>
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
