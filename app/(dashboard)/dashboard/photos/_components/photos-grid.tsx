"use client";
import { PhotoRow } from "@/lib/queries/photos";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";
import { toggleFeaturedPhotoAction } from "@/lib/actions/photos";
import { Star, StarOff } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

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
                  <MeasuredImage
                    src={src}
                    alt={p.caption || p.filename}
                    className="transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center text-[10px] text-muted-foreground">
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
                {/* Hover overlay with filename/date */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-white">
                  <span className="font-medium truncate" title={p.filename}>
                    {p.filename}
                  </span>
                  <span className="opacity-80">
                    {new Date(p.created_at).toLocaleDateString()}
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

// MeasuredImage: probes natural dimensions first, then renders optimized Next/Image
function MeasuredImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [dims, setDims] = React.useState<{ w: number; h: number } | null>(null);
  React.useEffect(() => {
    let active = true;
    const img = new window.Image();
    img.src = src;
    img.decoding = "async";
    img.onload = () => {
      if (!active) return;
      const w = img.naturalWidth || 1;
      const h = img.naturalHeight || 1;
      setDims({ w, h });
    };
    return () => {
      active = false;
    };
  }, [src]);

  const ratioPadding = dims ? (dims.h / dims.w) * 100 : 66.6667; // fallback 3/2

  return (
    <div className="w-full relative" style={{}}>
      {/* Aspect box while we wait for dimensions */}
      <div style={{ paddingTop: `${ratioPadding}%` }} />
      <div className="absolute inset-0">
        {dims ? (
          <Image
            src={src}
            alt={alt}
            width={dims.w}
            height={dims.h}
            sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
            className={"object-cover " + (className || "")}
            placeholder="empty"
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-accent" />
        )}
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
