import * as React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import {
  getGalleryBySlug,
  getGalleryWithPhotos,
} from "@/lib/queries/galleries";
import { GalleryDetailView } from "./_components/gallery-detail-view";

type GalleryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);

  if (!gallery || !gallery.is_public) {
    return {
      title: "Gallery Not Found | TK Media",
      description:
        "The requested gallery was not found or is not publicly available.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const galleryTitle = gallery.title || "Untitled Gallery";
  const galleryDescription =
    gallery.description ||
    `View photos from the ${galleryTitle} gallery by TK Media professional photography.`;

  return {
    title: `${galleryTitle} | TK Media Gallery`,
    description: galleryDescription,
    keywords: [
      "photo gallery",
      galleryTitle,
      "TK Media",
      "professional photography",
      "Eastern Cape photographer",
      "photography portfolio",
    ],
    openGraph: {
      title: `${galleryTitle} | TK Media Gallery`,
      description: galleryDescription,
      type: "website",
      images: gallery.cover_image
        ? [
            {
              url: gallery.cover_image,
              width: 1200,
              height: 800,
              alt: `Featured image from ${galleryTitle}`,
            },
          ]
        : [
            {
              url: "/logo.webp",
              width: 799,
              height: 604,
              alt: `${galleryTitle} - TK Media`,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${galleryTitle} | TK Media`,
      description: galleryDescription,
      images: gallery.cover_image ? [gallery.cover_image] : ["/logo.webp"],
    },
    alternates: {
      canonical: `/galleries/${slug}`,
    },
  };
}

export default function PublicGalleryPage({ params }: GalleryPageProps) {
  return (
    <Suspense fallback={<GalleryPageFallback />}>
      <GalleryDetails params={params} />
    </Suspense>
  );
}

async function GalleryDetails({ params }: GalleryPageProps) {
  const { slug } = await params;
  const galleryMeta = await getGalleryBySlug(slug);

  if (!galleryMeta || !galleryMeta.is_public) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center space-y-5">
        <h1 className="text-3xl font-bold text-on-surface">Gallery Not Found</h1>
        <p className="text-sm text-on-surface-variant">
          The gallery you are looking for doesn&rsquo;t exist or isn&rsquo;t
          public.
        </p>
        <AppButton
          variant="tonal"
          size="md"
          render={<Link href="/galleries" />}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Galleries</span>
        </AppButton>
      </div>
    );
  }

  const gallery = await getGalleryWithPhotos(galleryMeta.id, { limit: 500 });
  if (!gallery) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center space-y-5">
        <h1 className="text-3xl font-bold text-on-surface">Gallery Not Found</h1>
        <AppButton
          variant="tonal"
          size="md"
          render={<Link href="/galleries" />}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Galleries</span>
        </AppButton>
      </div>
    );
  }

  return <GalleryDetailView gallery={gallery} />;
}

function GalleryPageFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-12">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-2/3 animate-pulse rounded-lg bg-surface-container" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-container" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-xl bg-surface-container"
          />
        ))}
      </div>
    </div>
  );
}
