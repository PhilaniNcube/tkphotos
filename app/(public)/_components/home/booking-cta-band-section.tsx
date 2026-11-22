import * as React from "react";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { photoSrcSet } from "@/lib/media";
import { getBookingCtaBackdropMedia } from "@/lib/queries/editorial-media";
import { photoSrc } from "@/lib/utils";

export async function BookingCtaBandSection() {
  "use cache";
  cacheLife("days");
  cacheTag("homepage", "homepage-booking-cta");

  const backdropPhoto = await getBookingCtaBackdropMedia();

  return (
    <section className="relative w-full overflow-hidden bg-[#141218] px-6 py-20 text-white lg:px-12 lg:py-28">
      {backdropPhoto && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
        >
          <R2Image
            src={photoSrc(backdropPhoto, "medium")}
            srcSet={photoSrcSet(backdropPhoto)}
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#141218] via-[#141218]/90 to-primary/55" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-container/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-tertiary-container/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Let&rsquo;s frame your next story{" "}
            <span className="text-tertiary-fixed">together.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Planning a wedding, corporate summit, tournament, or milestone
            celebration? Let&rsquo;s craft a visual record you&rsquo;ll treasure
            for decades.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end">
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <AppButton
              variant="inverse"
              size="lg"
              className="h-12 gap-3 rounded-full pl-6 pr-2"
              render={<Link href="/contact" />}
            >
              <span>Start a Conversation</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-on-tertiary-fixed text-tertiary-fixed">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </AppButton>
            <AppButton
              variant="inverseOutline"
              size="lg"
              className="h-12 rounded-full px-6"
              render={<Link href="/services" />}
            >
              <Layers className="h-4 w-4" aria-hidden="true" />
              <span>View Services &amp; Rates</span>
            </AppButton>
          </div>
          <p className="font-mono text-xs text-white/60">
            Eastern Cape &amp; travel nationwide
          </p>
        </div>
      </div>
    </section>
  );
}

export function BookingCtaBandFallback() {
  return (
    <section
      aria-hidden="true"
      className="w-full bg-[#141218] px-6 py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl animate-pulse grid-cols-1 items-end gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div className="h-14 w-3/4 rounded-xl bg-white/10" />
          <div className="h-6 w-2/3 rounded-lg bg-white/10" />
        </div>
        <div className="flex gap-3 lg:col-span-5 lg:justify-end">
          <div className="h-12 w-48 rounded-full bg-white/15" />
          <div className="h-12 w-44 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}
