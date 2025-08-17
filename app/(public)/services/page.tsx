import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services | TK Media",
  description:
    "Professional photography and media services: events, families, sports, conferences, videography, and media management.",
};

const SERVICES: Array<{
  title: string;
  blurb: string;
  points?: string[];
}> = [
  {
    title: "Event Photography",
    blurb:
      "From intimate celebrations to large-scale productions, I capture the authentic atmosphere, key moments, and candid interactions that tell the full story of your event.",
    points: [
      "Weddings, parties, launches, galas",
      "Discreet, documentary-focused approach",
      "Rapid turnaround highlight set (on request)",
    ],
  },
  {
    title: "Family Photography",
    blurb:
      "Natural, relaxed sessions that freeze genuine connection—perfect for growing families, milestones, and annual keepsakes.",
    points: [
      "On-location or in-home lifestyle sessions",
      "Gentle direction—no stiff posing",
      "Optional heirloom print preparation",
    ],
  },
  {
    title: "Sports / Action Photography",
    blurb:
      "High-impact imagery that tracks speed, emotion, and decisive moments—ideal for clubs, athletes, and promotional campaigns.",
    points: [
      "Fast autofocus + burst capture workflow",
      "Coverage for tournaments, matches, endurance events",
      "License-ready images for media + sponsors",
    ],
  },
  {
    title: "Conference Photography",
    blurb:
      "Comprehensive coverage of plenaries, breakout sessions, networking, branding, and speaker portraits for post-event marketing and reports.",
    points: [
      "Agenda-aware shot planning",
      "Same-day selects for socials (when needed)",
      "Consistent color + brand alignment",
    ],
  },
  {
    title: "Videography",
    blurb:
      "Cinematic short-form video for promos, recaps, social reels, and storytelling—capturing motion, mood, and narrative with clean audio.",
    points: [
      "4K acquisition + stabilized motion",
      "Interview + ambient audio capture",
      "Editing, color, light sound design",
    ],
  },
  {
    title: "Media Management",
    blurb:
      "Secure, organized handling of your visual assets—ingest, culling, color workflow, backups, and structured delivery ready for ongoing use.",
    points: [
      "Redundant backup + catalog structure",
      "File naming + metadata hygiene",
      "Cloud delivery + archive strategy",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="py-14 md:py-20">
      <div className="mx-auto w-full container px-4 space-y-16">
        {/* Hero / Intro */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-800">
            Crafted Visual Stories
          </h1>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed">
            I provide end‑to‑end photo and media services designed to preserve
            moments, elevate brands, and communicate clearly. Whether you need
            energetic action frames, warm family portraits, or sleek conference
            coverage, each service is delivered with intention and technical
            precision.
          </p>
        </section>

        {/* Services Grid */}
        <section>
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Card key={s.title} className="h-full">
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{s.blurb}</CardDescription>
                </CardHeader>
                {s.points && (
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-stone-600">
                      {s.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Process / CTA */}
        <section className="bg-stone-100 rounded-xl p-8 md:p-12 space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
              How It Works
            </h2>
            <ol className="space-y-4 text-sm md:text-base text-stone-700">
              <li>
                <span className="font-medium text-stone-900">
                  1. Discovery –
                </span>{" "}
                Share your goals, audience, and any timelines or deliverable
                needs.
              </li>
              <li>
                <span className="font-medium text-stone-900">
                  2. Planning –
                </span>{" "}
                Shot lists, logistics, permissions, and technical prep handled
                collaboratively.
              </li>
              <li>
                <span className="font-medium text-stone-900">3. Capture –</span>{" "}
                Professional on‑site execution with adaptability and clear
                communication.
              </li>
              <li>
                <span className="font-medium text-stone-900">
                  4. Post‑Production –
                </span>{" "}
                Culling, color work, retouching, sound polish (video), and asset
                structuring.
              </li>
              <li>
                <span className="font-medium text-stone-900">
                  5. Delivery –
                </span>{" "}
                Secure gallery / download links in web + high‑res formats, ready
                to deploy.
              </li>
            </ol>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-stone-800 text-white hover:bg-stone-700 transition-colors duration-200 font-medium text-center"
            >
              Start a Project
            </Link>
            <Link
              href="/collections"
              className="px-8 py-3 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-200 font-medium text-center"
            >
              View Portfolio
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
