import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | TK Media",
  description:
    "Privacy policy for TK Media photography services, detailing how we collect, use, and protect your personal information and images.",
};

export default function PrivacyPage() {
  return (
    <main className="py-14 md:py-20">
      <div className="mx-auto w-full container px-4 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-stone-800">
              Privacy Policy
            </h1>
            <p className="text-base md:text-lg text-stone-600 leading-relaxed">
              Last updated: August 23, 2025
            </p>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed">
              This privacy policy explains how TK Media collects, uses, and
              protects your personal information when you use our photography
              services and website.
            </p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-10">
            {/* 1. Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <h3 className="text-lg font-semibold text-stone-800">
                  Personal Information
                </h3>
                <p>When you contact us or book our services, we may collect:</p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Name and contact information (email, phone, address)</li>
                  <li>Event details and photography requirements</li>
                  <li>Payment and billing information</li>
                  <li>Communication preferences</li>
                  <li>Any other information you choose to provide</li>
                </ul>

                <h3 className="text-lg font-semibold text-stone-800 pt-4">
                  Photographs and Images
                </h3>
                <p>As a photography service, we collect and process:</p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Photographs taken during contracted sessions</li>
                  <li>Images uploaded to client galleries</li>
                  <li>Image metadata and technical information</li>
                  <li>Client selections and favorites</li>
                </ul>

                <h3 className="text-lg font-semibold text-stone-800 pt-4">
                  Website Usage Information
                </h3>
                <p>When you visit our website, we automatically collect:</p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>IP address and browser information</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring websites and search terms</li>
                  <li>Device type and screen resolution</li>
                </ul>
              </div>
            </section>

            {/* 2. How We Use Information */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>We use your information to:</p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Provide photography services and deliver your images</li>
                  <li>Communicate about bookings, sessions, and deliveries</li>
                  <li>Process payments and manage billing</li>
                  <li>Create and maintain secure client galleries</li>
                  <li>Improve our services and website functionality</li>
                  <li>
                    Send service updates and marketing communications (with
                    consent)
                  </li>
                  <li>Comply with legal obligations and protect our rights</li>
                </ul>

                <h3 className="text-lg font-semibold text-stone-800 pt-4">
                  Portfolio and Marketing Use
                </h3>
                <p>
                  With your consent or as specified in our service agreement, we
                  may use photographs for:
                </p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Portfolio display on our website and social media</li>
                  <li>Marketing materials and promotional content</li>
                  <li>Professional awards and competition submissions</li>
                  <li>Educational purposes and industry publications</li>
                </ul>
                <p className="text-sm italic text-stone-600">
                  You can opt out of portfolio use at any time by contacting us.
                </p>
              </div>
            </section>

            {/* 3. Information Sharing */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                3. How We Share Your Information
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  We do not sell, rent, or trade your personal information. We
                  may share information only in the following circumstances:
                </p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>
                    <strong>Service Providers:</strong> Trusted vendors who help
                    deliver our services (e.g., cloud storage, printing
                    services, payment processors)
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law,
                    court order, or to protect our rights and safety
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a
                    merger, sale, or transfer of business assets
                  </li>
                  <li>
                    <strong>With Consent:</strong> When you explicitly authorize
                    us to share specific information
                  </li>
                </ul>
                <p>
                  All service providers are contractually bound to protect your
                  information and use it only for specified purposes.
                </p>
              </div>
            </section>

            {/* 4. Data Security */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                4. Data Security
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  We implement reasonable security measures to protect your
                  information:
                </p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Encrypted data transmission and storage</li>
                  <li>Secure client gallery access with password protection</li>
                  <li>Regular security assessments and updates</li>
                  <li>
                    Limited access to personal information on a need-to-know
                    basis
                  </li>
                  <li>Secure backup and disaster recovery procedures</li>
                </ul>
                <p>
                  However, no internet transmission or electronic storage is
                  100% secure. While we strive to protect your information, we
                  cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* 5. Data Retention */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                5. Data Retention
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  We retain your information for different periods based on type
                  and purpose:
                </p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>
                    <strong>Client Images:</strong> Stored securely for at least
                    1 year after delivery, with extended storage available upon
                    request
                  </li>
                  <li>
                    <strong>Contact Information:</strong> Retained while you
                    remain a client and for reasonable period afterward for
                    business purposes
                  </li>
                  <li>
                    <strong>Gallery Access Logs:</strong> Retained for 90 days
                    for security and troubleshooting purposes
                  </li>
                  <li>
                    <strong>Website Analytics:</strong> Anonymized data retained
                    for up to 2 years for business analysis
                  </li>
                </ul>
                <p>
                  You can request deletion of your personal information at any
                  time, subject to legal and contractual obligations.
                </p>
              </div>
            </section>

            {/* 6. Your Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                6. Your Privacy Rights
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Restrict or object to certain processing activities</li>
                  <li>Request a copy of your data in a portable format</li>
                  <li>Withdraw consent for portfolio use of your images</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the
                  information provided below. We will respond to your request
                  within a reasonable timeframe.
                </p>
              </div>
            </section>

            {/* 7. Cookies and Tracking */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                7. Cookies and Website Tracking
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>Our website uses cookies and similar technologies to:</p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Remember your login status for client galleries</li>
                  <li>Analyze website traffic and user behavior</li>
                  <li>Improve website functionality and user experience</li>
                  <li>Provide personalized content and recommendations</li>
                </ul>
                <p>
                  You can control cookie settings through your browser
                  preferences. Note that disabling certain cookies may affect
                  website functionality.
                </p>
              </div>
            </section>

            {/* 8. Third-Party Services */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                8. Third-Party Services
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  Our website and services may integrate with third-party
                  platforms:
                </p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Cloud storage providers for secure image hosting</li>
                  <li>Payment processors for secure transaction handling</li>
                  <li>Analytics services for website performance monitoring</li>
                  <li>Social media platforms for portfolio sharing</li>
                </ul>
                <p>
                  These services have their own privacy policies and practices.
                  We encourage you to review their policies when using
                  integrated features.
                </p>
              </div>
            </section>

            {/* 9. Children's Privacy */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                9. Children's Privacy
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  Our services are not directed to children under 13. We do not
                  knowingly collect personal information from children under 13
                  without parental consent.
                </p>
                <p>
                  When photographing events involving minors, we obtain
                  appropriate consent from parents or guardians before using
                  images for portfolio or marketing purposes.
                </p>
                <p>
                  If you believe we have collected information from a child
                  under 13, please contact us immediately so we can take
                  appropriate action.
                </p>
              </div>
            </section>

            {/* 10. International Users */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                10. International Data Transfers
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  TK Media is based in South Africa. If you are accessing our
                  services from other countries, your information may be
                  transferred to and processed in South Africa or other
                  countries where our service providers operate.
                </p>
                <p>
                  We ensure appropriate safeguards are in place for
                  international data transfers in compliance with applicable
                  privacy laws.
                </p>
              </div>
            </section>

            {/* 11. Policy Updates */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                11. Policy Updates
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  We may update this privacy policy periodically to reflect
                  changes in our practices or legal requirements. We will notify
                  you of significant changes by:
                </p>
                <ul className="pl-6 space-y-2 list-disc">
                  <li>Posting the updated policy on our website</li>
                  <li>Updating the "Last updated" date</li>
                  <li>
                    Sending email notifications for material changes (where
                    applicable)
                  </li>
                </ul>
                <p>
                  Your continued use of our services after policy updates
                  constitutes acceptance of the revised terms.
                </p>
              </div>
            </section>

            {/* 12. Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-800">
                12. Contact Us
              </h2>
              <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed">
                <p>
                  If you have questions about this privacy policy or how we
                  handle your information, please contact us:
                </p>
                <div className="pl-4 space-y-2">
                  <p>
                    <strong>TK Media</strong>
                  </p>
                  <p>Email: privacy@tkmedia.co.za</p>
                  <p>General Contact: info@tkmedia.co.za</p>
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
                <p>
                  We will respond to privacy-related inquiries within 30 days of
                  receipt.
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-stone-200">
            <p className="text-sm text-stone-500">
              By using TK Media services and website, you acknowledge that you
              have read and understood this Privacy Policy and agree to the
              collection and use of your information as described herein.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
