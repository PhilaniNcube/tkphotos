import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";

const studioProofStats = [
  { value: "9+", label: "Years in the Field" },
  { value: "400+", label: "Sessions Covered" },
  { value: "50K+", label: "Graded Frames" },
];

export function StudioManifestoSection() {
  return (
    <section className="mx-auto w-full max-w-7xl bg-surface px-6 py-16 md:py-24 lg:px-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-between gap-6 lg:col-span-4">
          <p className="font-mono text-xs text-on-surface-variant">
            32.7875&deg; S, 26.8475&deg; E
          </p>

          <p className="font-mono text-xs uppercase tracking-[0.18em] text-outline">
            Thandikaya Matokazi &bull; Est. 2016
          </p>
        </div>

        <div className="lg:col-span-8">
          <h2 className="text-2xl font-medium leading-[1.2] tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
            Visual storytelling rooted in{" "}
            <span className="font-semibold text-primary">natural light</span>,
            unhurried documentary timing, and genuine human connection.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant">
            From Xhosa cultural celebrations and packed stadiums to executive
            summits across the Eastern Cape, every commission is photographed
            with quiet precision and delivered ready for print and press.
          </p>

          <div className="mt-7">
            <AppButton
              variant="outline"
              size="md"
              className="h-11 gap-3 rounded-full pl-5 pr-2"
              render={<Link href="/about" />}
            >
              <span>More About TK</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary">
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </AppButton>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-outline-variant/60 pt-8">
            {studioProofStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-2xl font-bold tracking-tight text-on-surface sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-on-surface-variant sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
