"use client";

import { GalleryWithPhotos } from "@/lib/queries/galleries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";
import {
  updateGalleryCoverImageAction,
  updateGalleryPublicStatusAction,
} from "@/lib/actions/galleries";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Client wrapper for each photo item to allow selecting cover image
function CoverCheckbox({
  galleryId,
  photoStorageKey,
  currentCover,
}: {
  galleryId: number;
  photoStorageKey: string;
  currentCover: string | null;
}) {
  "use client";
  const [pending, setPending] = React.useState(false);
  const isActive = currentCover === photoStorageKey;

  async function onChange(checked: boolean) {
    if (!checked) return; // only allow setting, clearing handled elsewhere
    setPending(true);
    const formData = new FormData();
    formData.append("id", String(galleryId));
    formData.append("cover_image", photoStorageKey);
    await updateGalleryCoverImageAction(
      { success: false, error: null },
      formData
    );
    // Rely on revalidation to refresh page; optimistic UI could be added
    setPending(false);
  }

  return (
    <label className="absolute top-1 right-1 z-10 flex items-center gap-1 rounded bg-black/60 px-1.5 py-1 text-[10px] text-white backdrop-blur-sm">
      <Checkbox
        checked={isActive}
        disabled={pending}
        onCheckedChange={(v) => onChange(Boolean(v))}
        className="size-3.5"
        aria-label={isActive ? "Current cover image" : "Set as cover image"}
      />
      {isActive ? "Cover" : pending ? "Saving" : "Set"}
    </label>
  );
}

interface GalleryDetailProps {
  gallery: GalleryWithPhotos;
}

export function GalleryDetail({ gallery }: GalleryDetailProps) {
  const [publicPending, setPublicPending] = React.useState(false);

  async function togglePublic() {
    if (publicPending) return;
    setPublicPending(true);
    await updateGalleryPublicStatusAction(gallery.id, !gallery.is_public);
    // No local optimistic update; rely on revalidation. Could add router.refresh() for immediate.
    setPublicPending(false);
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span>{gallery.title}</span>
            <div className="flex items-center gap-x-2">
              <Button
                type="button"
                onClick={togglePublic}
                disabled={publicPending}
                className="text-white  disabled:opacity-40"
              >
                {publicPending
                  ? "Updating..."
                  : gallery.is_public
                  ? "Make Private"
                  : "Make Public"}
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="space-y-1">
            {gallery.description || (
              <span className="italic opacity-70">No description</span>
            )}
            <div className="flex flex-wrap gap-4 text-xs pt-2">
              {gallery.event_date && <span>Event: {gallery.event_date}</span>}
              <span>
                Created: {new Date(gallery.created_at).toLocaleString()}
              </span>
              <span>Access Key: {gallery.access_key}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div>
              <span className="font-medium">Slug:</span> {gallery.slug}
            </div>
            {gallery.cover_image && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Cover:</span>
                <a
                  href={gallery.cover_image}
                  className="text-primary underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {gallery.cover_image}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Photos ({gallery.photos.length})
        </h2>
        {gallery.photos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No photos uploaded yet.
          </p>
        ) : (
          <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gallery.photos.map((p) => {
              const src = photoSrc(p.storage_key);
              return (
                <li key={p.id}>
                  <Card className="overflow-hidden group p-0">
                    <div className="relative aspect-video bg-muted">
                      {src ? (
                        <>
                          <Image
                            src={src}
                            alt={p.caption || p.filename}
                            fill
                            sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <CoverCheckbox
                            galleryId={gallery.id}
                            photoStorageKey={p.storage_key}
                            currentCover={gallery.cover_image}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                      {p.is_featured && (
                        <span className="absolute top-1 left-1 rounded bg-amber-500/80 text-[10px] px-1 py-0.5 text-white">
                          Featured
                        </span>
                      )}
                    </div>
                    <CardContent className="p-2 space-y-1 text-xs">
                      <div
                        className="font-medium line-clamp-1"
                        title={p.filename}
                      >
                        {p.filename}
                      </div>
                      {p.caption && (
                        <div className="line-clamp-2 opacity-80">
                          {p.caption}
                        </div>
                      )}
                      <div className="flex justify-between opacity-60">
                        <span>
                          {new Date(p.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
