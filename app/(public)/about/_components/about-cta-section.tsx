import * as React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";

export function AboutCtaSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-20 lg:px-12">
      <div className="flex flex-col items-start justify-between gap-8 rounded-xl bg-surface-container-highest p-8 shadow-sm sm:p-12 lg:flex-row lg:items-center lg:p-16">
        <div className="max-w-xl space-y-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            04 / Next Steps
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Let&rsquo;s Plan Your Session
          </h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            Ready to discuss ideas, timelines, or specific deliverables? Reach
            out to build a tailored brief — or explore our collections for a
            wider sense of style and range.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <AppButton
            variant="primary"
            size="lg"
            render={<Link href="/contact" />}
          >
            <span>Contact</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AppButton>
          <AppButton
            variant="outline"
            size="lg"
            render={<Link href="/collections" />}
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
            <span>View Collections</span>
          </AppButton>
        </div>
      </div>
    </section>
  );
}
