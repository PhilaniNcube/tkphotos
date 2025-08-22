import React from "react";
import Link from "next/link";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";
import {
  getGalleryBySlug,
  getGalleryWithPhotos,
} from "@/lib/queries/galleries";

type GalleryPageProps = { params: Promise<{ slug: string }> };

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
        {gallery.photos.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No photos have been added to this gallery yet.
          </p>
        )}
        {gallery.photos.length > 0 && (
          <ul className="columns-2 gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 [column-fill:_balance]">
            {gallery.photos.map((p) => {
              const src = photoSrc(p.storage_key);
              return (
                <li
                  key={p.id}
                  className="mb-4 break-inside-avoid group relative overflow-hidden rounded border bg-card"
                >
                  {src ? (
                    <figure className="relative w-full overflow-hidden">
                      {/* Using fixed width/height placeholder to satisfy next/image; adjust if dimensions become available */}
                      <Image
                        src={src}
                        alt={p.caption || p.filename}
                        width={800}
                        height={600}
                        loading="lazy"
                        sizes="(max-width:640px) 50vw, (max-width:1280px) 33vw, 20vw"
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      {p.is_featured && (
                        <span className="absolute top-1.5 right-1.5 text-amber-500 drop-shadow-sm">
                          ★
                        </span>
                      )}
                    </figure>
                  ) : (
                    <div className="flex items-center justify-center text-[10px] text-muted-foreground p-8 bg-muted">
                      No image
                    </div>
                  )}
                  <div className="p-2 space-y-1">
                    <div
                      className="text-[11px] font-medium line-clamp-1"
                      title={p.filename}
                    >
                      {p.filename}
                    </div>
                    {p.caption && (
                      <div
                        className="text-[10px] text-muted-foreground line-clamp-2"
                        title={p.caption}
                      >
                        {p.caption}
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground flex justify-between">
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
