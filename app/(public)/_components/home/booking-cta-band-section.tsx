import * as React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";

export function BookingCtaBandSection() {
  return (
    <section className="relative w-full overflow-hidden bg-primary py-20 text-on-primary lg:py-24 px-6 lg:px-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-container/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-tertiary-container/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-tertiary-fixed">
          Bookings Open
        </span>
        <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-5xl">
          Let&rsquo;s Create Together
        </h2>
        <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-on-primary-container sm:text-lg">
          Planning a wedding, corporate summit, or milestone celebration?
          Let&rsquo;s craft a visual record you&rsquo;ll treasure for decades.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <AppButton
            variant="inverse"
            size="lg"
            render={<Link href="/contact" />}
          >
            <span>Contact Me</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AppButton>
          <AppButton
            variant="inverseOutline"
            size="lg"
            render={<Link href="/collections" />}
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
            <span>View Full Portfolio</span>
          </AppButton>
        </div>
      </div>
    </section>
  );
}
