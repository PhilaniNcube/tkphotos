import * as React from "react";

export function ContactHeroSection() {
  return (
    <section
      id="contact-hero"
      className="relative overflow-hidden border-b border-outline-variant/60 bg-surface pb-12 pt-14 lg:pb-16 lg:pt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-tertiary-fixed/35 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-3xl">
          <span className="mb-4 inline-flex items-center rounded-full bg-primary-fixed px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-on-primary-fixed">
            Get in Touch
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
            Let&rsquo;s Plan Your{" "}
            <span className="text-primary">Session</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Ready to book a shoot or commission coverage across the Eastern Cape
            and South Africa? Choose your service below or share your brief for
            a custom quote within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
