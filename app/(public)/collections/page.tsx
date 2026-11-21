import * as React from "react";
import type { Metadata } from "next";
import { getCollectionsShowcase } from "@/lib/queries/collections";
import { CollectionsBrowser } from "./_components/collections-browser";

export const metadata: Metadata = {
  title: "Photo Collections | TK Media",
  description:
    "Explore curated photo collections showcasing the best of TK Media's professional photography work across various events and occasions.",
  keywords: [
    "photo collections",
    "curated photography",
    "professional photos",
    "photography showcase",
    "TK Media collections",
    "Eastern Cape photography",
  ],
  openGraph: {
    title: "Photo Collections | TK Media",
    description:
      "Explore curated photo collections showcasing the best of TK Media's professional photography work.",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 799,
        height: 604,
        alt: "TK Media Photo Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Collections | TK Media",
    description:
      "Explore curated photo collections showcasing the best of TK Media's professional photography work.",
    images: ["/logo.webp"],
  },
  alternates: {
    canonical: "/collections",
  },
};

export default async function CollectionsPage() {
  const { data, error } = await getCollectionsShowcase();

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <h1 className="mb-4 text-3xl font-bold text-on-surface">Collections</h1>
        <p className="text-sm text-error">Failed to load collections.</p>
      </div>
    );
  }

  return <CollectionsBrowser collections={data} />;
}
