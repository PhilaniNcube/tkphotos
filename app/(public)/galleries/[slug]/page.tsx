import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PhotosGrid } from "@/app/(dashboard)/dashboard/photos/_components/photos-grid";
import {
  getGalleryBySlug,
  getGalleryWithPhotos,
} from "@/lib/queries/galleries";

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

export default async function PublicGalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const galleryMeta = await getGalleryBySlug(slug);
  if (!galleryMeta || !galleryMeta.is_public) {
    return (
      <div className="mx-auto container px-4 py-12 space-y-6">
        <h1 className="text-2xl font-semibold">Gallery Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The gallery you are looking for doesn&apos;t exist or isn&apos;t
          public.
        </p>
        <Link
          href="/galleries"
          className="text-xs underline text-muted-foreground hover:text-primary"
        >
          ← All galleries
        </Link>
      </div>
    );
  }

  const gallery = await getGalleryWithPhotos(galleryMeta.id, { limit: 500 });
  if (!gallery) {
    return (
      <div className="mx-auto container px-4 py-12 space-y-6">
        <h1 className="text-2xl font-semibold">Gallery Not Found</h1>
        <Link
          href="/galleries"
          className="text-xs underline text-muted-foreground hover:text-primary"
        >
          ← All galleries
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full container px-4 py-10 space-y-10">
      <header className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1
            className="text-3xl font-semibold tracking-tight"
            title={gallery.title}
          >
            {gallery.title}
          </h1>
          <Link
            href="/galleries"
            className="text-xs underline text-muted-foreground hover:text-primary"
          >
            ← All galleries
          </Link>
        </div>
        {gallery.description && (
          <p className="max-w-2xl text-sm text-muted-foreground whitespace-pre-line">
            {gallery.description}
          </p>
        )}
        <div className="text-[11px] text-muted-foreground flex flex-wrap gap-3">
          <span>
            Created {new Date(gallery.created_at).toLocaleDateString()}
          </span>
          {gallery.event_date && <span>Event {gallery.event_date}</span>}
          <span>
            {gallery.photos.length} photo
            {gallery.photos.length === 1 ? "" : "s"}
          </span>
        </div>
      </header>
      <section className="space-y-4">
        {gallery.photos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No photos have been added to this gallery yet.
          </p>
        ) : (
          // Cast because gallery.photos includes subset + metadata; component only reads needed fields
          <PhotosGrid photos={gallery.photos as any} readonly />
        )}
      </section>
    </div>
  );
}
