import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | TK Media",
  description:
    "Learn about Thandikaya Matokazi – Eastern Cape photographer with 6+ years experience capturing events, families, sport and corporate stories.",
};

export default function AboutPage() {
  return (
    <main className="py-14 md:py-20">
      <div className="mx-auto w-full container px-4 space-y-16">
        {/* Hero / Intro */}
        <section className="grid gap-10 md:grid-cols-[380px_minmax(0,1fr)] items-start">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-stone-300/60 shadow-sm bg-stone-100">
            <Image
              src="https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvZFXisQnCMRxelq86Yd95OruyTwQtaIKSNHzB"
              alt="Portrait of Thandikaya Matokazi"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 380px"
              className="object-cover object-center"
            />
          </div>
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-800">
              About Thandikaya Matokazi
            </h1>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed">
              I'm a photographer based in the Eastern Cape with over six years
              of professional experience—shaped by a visual storytelling
              approach and a foundation in media studies from the University of
              Fort Hare. My work spans community events, family milestones,
              corporate conferences, sports & action, and brand-focused visual
              narratives. Each assignment is an opportunity to preserve
              atmosphere, emotion and detail with clean, purposeful imagery.
            </p>
          </div>
        </section>

        {/* Philosophy / Approach */}
        <section className="grid gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
              Approach & Values
            </h2>
            <ul className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
              <li>
                <span className="font-medium text-stone-900">
                  Documentary Foundations –
                </span>{" "}
                unobtrusive coverage that lets authentic moments breathe.
              </li>
              <li>
                <span className="font-medium text-stone-900">
                  Natural Light First –
                </span>{" "}
                leveraging ambient mood; adding light only when it serves the
                story.
              </li>
              <li>
                <span className="font-medium text-stone-900">
                  Collaborative Planning –
                </span>{" "}
                clear pre‑shoot communication, logistics mapping and shot
                alignment.
              </li>
              <li>
                <span className="font-medium text-stone-900">
                  Technical Consistency –
                </span>{" "}
                calibrated color, sharpness discipline, intentional framing.
              </li>
              <li>
                <span className="font-medium text-stone-900">
                  Efficient Delivery –
                </span>{" "}
                organized galleries, practical licensing guidance, and archival
                readiness.
              </li>
            </ul>
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
              Services In Context
            </h2>
            <p className="text-sm md:text-base text-stone-700 leading-relaxed">
              My service range has grown organically from community
              roots—covering local sports fixtures, university events and family
              gatherings—into a broader offering that now supports conferences,
              brands and media partners. A structured media management workflow
              underpins everything: redundant backups, metadata discipline and
              client‑friendly delivery. This ensures your assets retain value
              long after the day itself.
            </p>
            <p className="text-sm md:text-base text-stone-700 leading-relaxed">
              Whether you need fast same‑day selects for social channels or a
              full curated gallery for long‑term brand use, the process is
              adaptable and transparent from start to finish.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-6 sm:grid-cols-3">
          {[
            { label: "Years Experience", value: "6+" },
            { label: "Sessions Covered", value: "400+" },
            { label: "Images Delivered", value: "50K+" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border bg-white/60 p-6 text-center flex flex-col gap-2"
            >
              <span className="text-3xl font-semibold text-stone-800">
                {s.value}
              </span>
              <span className="text-xs uppercase tracking-wide text-stone-500">
                {s.label}
              </span>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="bg-stone-100 rounded-xl p-8 md:p-12 space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
            Let's Plan Your Session
          </h2>
          <p className="text-sm md:text-base text-stone-700 max-w-2xl">
            Ready to discuss ideas, timelines or specific deliverables? Reach
            out to build a tailored brief—or browse the portfolio for a wider
            sense of style and range.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/contact"
              className="px-8 py-3 bg-stone-800 text-white hover:bg-stone-700 transition-colors duration-200 font-medium text-center"
            >
              Contact
            </Link>
            <Link
              href="/collections"
              className="px-8 py-3 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-200 font-medium text-center"
            >
              View Collections
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
