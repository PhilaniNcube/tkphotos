import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | TK Media",
  description:
    "Terms of service for TK Media photography services, including client galleries, downloads, and usage rights.",
};

export default function TermsPage() {
  return (
    <main className="py-14 md:py-20">
      <div className="mx-auto w-full container px-4 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-800">
              Terms of Service
            </h1>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed">
              Last updated: August 23, 2025
            </p>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              These terms govern your use of TK Media photography services and
              this website. By using our services, you agree to these terms.
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-10">
            {/* 1. Services */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                1. Photography Services
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  TK Media provides professional photography services including
                  but not limited to: events, portraits, corporate photography,
                  sports photography, and brand imagery. All services are
                  subject to availability and booking confirmation.
                </p>
                <p>
                  Service packages, pricing, and deliverables are outlined in
                  individual contracts or service agreements provided at the
                  time of booking.
                </p>
              </div>
            </section>

            {/* 2. Client Galleries */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                2. Client Galleries & Access
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  Client galleries are private and accessible only with valid
                  login credentials provided by TK Media. Gallery access is
                  limited to the contracted client and authorized individuals
                  specified in the service agreement.
                </p>
                <p>
                  Gallery links and passwords are confidential and should not be
                  shared publicly or with unauthorized parties. Clients are
                  responsible for maintaining the confidentiality of their
                  access credentials.
                </p>
                <p>
                  Gallery access is typically provided for 90 days from delivery
                  date, unless otherwise specified in your service agreement.
                  Extensions may be available upon request and additional fees.
                </p>
              </div>
            </section>

            {/* 3. Image Rights & Usage */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                3. Image Rights & Usage
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  TK Media retains copyright ownership of all photographs unless
                  explicitly transferred in writing. Clients receive usage
                  rights as specified in their service agreement, typically
                  including personal use, social media sharing, and printing for
                  personal purposes.
                </p>
                <p>
                  Commercial use of images requires separate licensing
                  agreements and additional fees. Images may not be altered,
                  edited, or manipulated without written permission from TK
                  Media.
                </p>
                <p>
                  TK Media reserves the right to use images for portfolio,
                  marketing, and promotional purposes unless client has
                  purchased exclusive rights or specifically opted out in
                  writing.
                </p>
              </div>
            </section>

            {/* 4. Downloads & Delivery */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                4. Downloads & Delivery
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  Final edited images are delivered through secure client
                  galleries within the timeframe specified in your service
                  agreement. High-resolution downloads are available for images
                  included in your package.
                </p>
                <p>
                  Download limits may apply based on your service package.
                  Additional downloads or extended access periods are available
                  for additional fees.
                </p>
                <p>
                  Clients are responsible for downloading and backing up their
                  images during the access period. TK Media is not responsible
                  for lost access or data loss after the gallery access period
                  expires.
                </p>
              </div>
            </section>

            {/* 5. Payment & Cancellation */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                5. Payment & Cancellation
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  Payment terms are specified in individual service agreements.
                  Deposits are typically required to secure booking dates and
                  are non-refundable except in cases of photographer
                  cancellation.
                </p>
                <p>
                  Final payment is due before image delivery unless alternative
                  arrangements have been made in writing. Late payment fees may
                  apply to overdue accounts.
                </p>
                <p>
                  Cancellation policies vary by service type and are outlined in
                  individual contracts. Cancellations with less than 48 hours
                  notice may result in full payment being due.
                </p>
              </div>
            </section>

            {/* 6. Website Use */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                6. Website Use & Conduct
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  This website is provided for informational purposes and client
                  gallery access. Users must not attempt to access unauthorized
                  areas, upload malicious content, or interfere with website
                  functionality.
                </p>
                <p>
                  All images displayed on the public portfolio are copyrighted
                  and may not be downloaded, copied, or used without written
                  permission from TK Media.
                </p>
                <p>
                  User accounts may be suspended or terminated for violation of
                  these terms or misuse of the website or gallery systems.
                </p>
              </div>
            </section>

            {/* 7. Liability & Disclaimers */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                7. Liability & Disclaimers
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  TK Media's liability is limited to the total amount paid for
                  services. We are not liable for indirect, consequential, or
                  special damages arising from our services or website use.
                </p>
                <p>
                  While we take reasonable measures to secure client galleries
                  and data, we cannot guarantee absolute security and are not
                  liable for unauthorized access or data breaches beyond our
                  reasonable control.
                </p>
                <p>
                  Photography services are subject to weather, venue conditions,
                  and other factors beyond our control. Alternative arrangements
                  will be made when possible, but TK Media is not liable for
                  circumstances preventing service delivery.
                </p>
              </div>
            </section>

            {/* 8. Privacy */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                8. Privacy & Data Protection
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  Client information and images are handled according to our{" "}
                  <Link
                    href="/privacy"
                    className="text-stone-800 hover:text-stone-600 underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  . We collect only necessary information for service delivery
                  and maintain reasonable security measures to protect client
                  data.
                </p>
                <p>
                  Client images and personal information are not shared with
                  third parties except as necessary for service delivery (e.g.,
                  print vendors) or as required by law.
                </p>
              </div>
            </section>

            {/* 9. Changes to Terms */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                9. Changes to Terms
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  These terms may be updated periodically. Continued use of our
                  services or website after changes constitutes acceptance of
                  updated terms. Significant changes will be communicated to
                  active clients when possible.
                </p>
                <p>
                  Individual service agreements take precedence over these
                  general terms for specific projects and bookings.
                </p>
              </div>
            </section>

            {/* 10. Contact */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                10. Contact Information
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  For questions about these terms or our services, please
                  contact us:
                </p>
                <div className="pl-4 space-y-2">
                  <p>TK Media</p>
                  <p>Email: info@tkmedia.co.za</p>
                  <p>
                    Website:{" "}
                    <Link
                      href="/contact"
                      className="text-stone-800 hover:text-stone-600 underline underline-offset-2"
                    >
                      Contact Form
                    </Link>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              By using TK Media services, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
