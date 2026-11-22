import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@ui-sdk/react/avatar";
import { ArrowRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  initials: string;
  badgeStyle: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mbenya. Z",
    role: "Long-time Client • Fort Hare & Eastern Cape",
    initials: "MZ",
    badgeStyle: "bg-primary-fixed text-on-primary-fixed",
    content:
      "I've worked with TK for years, from my student leadership days at Fort Hare to personal family events and professional collaborations. His quality, patience, and professionalism are unmatched. Highly recommended!",
    rating: 5,
  },
  {
    id: 2,
    name: "Lihle Nkosi",
    role: "Event Coordinator, InnovateX",
    initials: "LN",
    badgeStyle: "bg-secondary-container text-on-secondary-container",
    content:
      "TK Photography was a pleasure to work with for our annual tech conference. Their team was professional, creative, and captured the energy of the event perfectly. The photos were delivered ahead of schedule and exceeded our expectations.",
    rating: 5,
  },
  {
    id: 3,
    name: "Bulumnko",
    role: "Event Client • Same-Day Delivery",
    initials: "BU",
    badgeStyle: "bg-tertiary-fixed text-on-tertiary-fixed",
    content:
      "Great photographer, on time and understanding of event and venue demands while on site. Pricing is transparent through consultation, picture quality is outstanding, and on-site selects are ready when needed.",
    rating: 5,
  },
];

export function ClientTestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Trusted Across the Eastern Cape
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {testimonials.map((testimonial, index) => (
          <article
            key={testimonial.id}
            className="flex flex-col justify-between gap-6 rounded-2xl border border-outline-variant/40 bg-surface-container-low p-7 shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div
                  className="flex items-center gap-1"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-tertiary-container text-tertiary-container"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-semibold text-outline">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <blockquote className="text-sm leading-relaxed text-on-surface sm:text-base">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Avatar
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${testimonial.badgeStyle}`}
              >
                <AvatarFallback className={testimonial.badgeStyle}>
                  {testimonial.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-on-surface">
                  {testimonial.name}
                </p>
                <p className="truncate text-xs text-on-surface-variant">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-container"
        >
          <span>Get in touch</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
