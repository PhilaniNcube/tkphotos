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
import { format } from "date-fns";
import { deletePhotoAction } from "@/lib/actions/photos";
import { updateGalleryTitleAction } from "@/lib/actions/galleries";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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
  const [photos, setPhotos] = React.useState(gallery.photos);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(gallery.title);
  const [titlePending, setTitlePending] = React.useState(false);
  const router = useRouter();

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
            <div className="flex items-center gap-2 min-w-0">
              {!editingTitle ? (
                <>
                  <span className="truncate" title={titleValue}>
                    {titleValue}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTitle(true)}
                    className="h-7 text-xs"
                  >
                    Edit
                  </Button>
                </>
              ) : (
                <form
                  className="flex items-center gap-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!titleValue.trim() || titleValue === gallery.title) {
                      setEditingTitle(false);
                      setTitleValue((v) => v.trim() || gallery.title);
                      return;
                    }
                    setTitlePending(true);
                    const fd = new FormData();
                    fd.append("id", String(gallery.id));
                    fd.append("title", titleValue.trim());
                    const res = await updateGalleryTitleAction(
                      { success: false, error: null },
                      fd
                    );
                    if (!res.success) {
                      // Basic inline error handling; could use toast
                      console.error("Failed to update title", res.error);
                      setTitleValue(gallery.title); // revert
                    }
                    setTitlePending(false);
                    setEditingTitle(false);
                    router.refresh();
                  }}
                >
                  <input
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    autoFocus
                    maxLength={150}
                    className="border rounded px-2 py-1 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={titlePending}
                      className="h-7 text-xs"
                    >
                      {titlePending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={titlePending}
                      onClick={() => {
                        setEditingTitle(false);
                        setTitleValue(gallery.title);
                      }}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
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
              {gallery.event_date && (
                <span>Event: {format(gallery.event_date, "PP")}</span>
              )}
              <span>Created: {format(gallery.created_at, "PP")}</span>
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
        <h2 className="text-lg font-semibold">Photos ({photos.length})</h2>
        {photos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No photos uploaded yet.
          </p>
        ) : (
          <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => {
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
                          {/* Delete overlay */}
                          <DeletePhotoButton
                            photoId={p.id}
                            galleryId={gallery.id}
                            onDeleted={() =>
                              setPhotos((prev) =>
                                prev.filter((ph) => ph.id !== p.id)
                              )
                            }
                            busy={deleting === p.id}
                            setBusy={(v) => setDeleting(v ? p.id : null)}
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

function DeletePhotoButton({
  photoId,
  galleryId,
  onDeleted,
  busy,
  setBusy,
}: {
  photoId: string;
  galleryId: number;
  onDeleted: () => void;
  busy: boolean;
  setBusy: (b: boolean) => void;
}) {
  const [confirming, setConfirming] = React.useState(false);

  async function handleDelete() {
    setBusy(true);
    const res = await deletePhotoAction(photoId, galleryId);
    if (res.success) {
      onDeleted();
    } else {
      // TODO: surface toast; for now console
      console.error("Delete failed", res.error);
    }
    setBusy(false);
    setConfirming(false);
  }

  return (
    <div className="absolute top-1 left-1 z-10 flex flex-col gap-1">
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={busy}
          className="bg-red-600/80 hover:bg-red-600 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40"
          aria-label="Delete photo"
        >
          <Trash2 className="size-4" />
        </button>
      ) : (
        <div className="flex items-center gap-1 bg-black/70 text-white rounded px-1 py-0.5 text-[10px]">
          <span>Delete?</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="px-1 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] disabled:opacity-50"
          >
            {busy ? "..." : "Yes"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={busy}
            className="px-1 rounded bg-zinc-500/60 hover:bg-zinc-500 text-white text-[10px] disabled:opacity-50"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
