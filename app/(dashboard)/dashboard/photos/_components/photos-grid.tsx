"use client";
import { PhotoRow } from "@/lib/queries/photos";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";
import { toggleFeaturedPhotoAction } from "@/lib/actions/photos";
import { Star, StarOff } from "lucide-react";
import React from "react";

interface PhotosGridProps {
  photos: PhotoRow[];
}

export function PhotosGrid({ photos }: PhotosGridProps) {
  const [items, setItems] = React.useState(photos);
  const [busy, setBusy] = React.useState<string | null>(null);

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No photos found.</p>;
  }
  return (
    <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((p) => {
        const src = photoSrc(p.storage_key);
        return (
          <li key={p.id}>
            <Card className="overflow-hidden group p-0">
              <div className="relative aspect-video bg-muted">
                {src ? (
                  <Image
                    src={src}
                    alt={p.caption || p.filename}
                    fill
                    sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105 aspect-video"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                    No image
                  </div>
                )}
                <FeatureToggleButton
                  id={p.id}
                  isFeatured={p.is_featured}
                  disabled={busy === p.id}
                  onToggle={async (next) => {
                    setBusy(p.id);
                    const res = await toggleFeaturedPhotoAction(p.id, next);
                    if (res.success) {
                      setItems((prev) =>
                        prev.map((it) =>
                          it.id === p.id ? { ...it, is_featured: next } : it
                        )
                      );
                    } else {
                      console.error("Toggle failed", res.error);
                    }
                    setBusy(null);
                  }}
                />
              </div>
              <CardContent className="p-2 space-y-1 text-xs">
                <div className="font-medium line-clamp-1" title={p.filename}>
                  {p.filename}
                </div>
                {p.caption && (
                  <div className="line-clamp-2 opacity-80">{p.caption}</div>
                )}
                <div className="flex justify-between opacity-60">
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

function FeatureToggleButton({
  id,
  isFeatured,
  onToggle,
  disabled,
}: {
  id: string;
  isFeatured: boolean;
  onToggle: (next: boolean) => void | Promise<void>;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={isFeatured ? "Unfeature photo" : "Feature photo"}
      disabled={disabled}
      onClick={() => onToggle(!isFeatured)}
      className="absolute top-1 left-1 z-10 inline-flex items-center justify-center rounded bg-black/60 hover:bg-black/80 text-white p-1 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-40"
    >
      {isFeatured ? (
        <Star className="size-4 fill-amber-400 text-amber-400" />
      ) : (
        <StarOff className="size-4" />
      )}
    </button>
  );
}
