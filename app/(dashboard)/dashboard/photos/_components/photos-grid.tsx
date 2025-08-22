"use client";
import { PhotoRow } from "@/lib/queries/photos";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";
import { toggleFeaturedPhotoAction } from "@/lib/actions/photos";
import { Star, StarOff } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface PhotosGridProps {
  photos: PhotoRow[];
  readonly?: boolean;
}

export function PhotosGrid({ photos, readonly }: PhotosGridProps) {
  const [items, setItems] = React.useState(photos);
  const [busy, setBusy] = React.useState<string | null>(null);

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No photos found.</p>;
  }
  return (
    <ul className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 [column-fill:_balance]">
      {items.map((p) => {
        const src = photoSrc(p.storage_key);
        return (
          <li
            key={p.id}
            className="mb-4 break-inside-avoid relative group focus-within:z-10"
            style={{ breakInside: "avoid" }}
          >
            <Card className="overflow-hidden group p-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative bg-muted">
                {src ? (
                  <PhotoWithKnownDims
                    photo={p}
                    className="transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center text-[10px] text-muted-foreground">
                    No image
                  </div>
                )}
                {!readonly && (
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
                )}
                {/* Hover overlay with filename/date */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-white">
                  <span className="font-medium truncate" title={p.filename}>
                    {p.filename}
                  </span>
                  <span className="opacity-80">
                    {format(p.created_at, "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
              {p.caption && (
                <CardContent className="p-2 pt-1 text-[11px] leading-snug line-clamp-2 opacity-80">
                  {p.caption}
                </CardContent>
              )}
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

// PhotoWithKnownDims: uses width/height from metadata (populated server-side) without client probing
function PhotoWithKnownDims({
  photo,
  className,
}: {
  photo: PhotoRow;
  className?: string;
}) {
  const meta = (photo.metadata || {}) as Record<string, any>;
  const origW =
    typeof meta.width === "number" && meta.width > 0 ? meta.width : 1200;
  const origH =
    typeof meta.height === "number" && meta.height > 0 ? meta.height : 800;
  // Clamp the intrinsic sizing passed to <Image> so Next doesn't consider enormous source dimensions.
  // Our grid never displays wider than ~400px per item (see sizes attr), so 1000px gives ample Retina headroom.
  const MAX_BASE_WIDTH = 1000;
  const scale = origW > MAX_BASE_WIDTH ? MAX_BASE_WIDTH / origW : 1;
  const w = Math.round(origW * scale);
  const h = Math.round(origH * scale);
  const ratioPadding = (origH / origW) * 100; // use original ratio for placeholder box
  const src = photoSrc(photo.storage_key);
  return (
    <div className="w-full relative">
      <div style={{ paddingTop: `${ratioPadding}%` }} />
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={photo.caption || photo.filename}
          width={w}
          height={h}
          sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
          className={"object-cover " + (className || "")}
          placeholder="empty"
          quality={70}
        />
      </div>
    </div>
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
    <Button
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
    </Button>
  );
}
