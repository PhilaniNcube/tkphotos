"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Narrow shape sent to the client for the masonry grid. Keeping only the
 * thumbnail URL avoids serialising every R2 variant into the RSC payload.
 */
export interface PhotoGridItem {
  id: string;
  filename: string;
  caption: string | null;
  alt: string;
  created_at: string;
  src: string;
  width: number | null;
  height: number | null;
}

interface PhotoGridProps {
  photos: PhotoGridItem[];
}

/** Masonry gallery. Uses the 480px WebP `thumbnail` variant for grid cells. */
export function PhotoGrid({ photos }: PhotoGridProps) {
  if (!photos.length) {
    return <p className="text-sm text-muted-foreground">No photos found.</p>;
  }

  return (
    <ul className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 [column-fill:_balance]">
      {photos.map((photo) => (
        <li
          key={photo.id}
          className="mb-4 break-inside-avoid relative group focus-within:z-10"
          style={{ breakInside: "avoid" }}
        >
          <Card className="overflow-hidden group p-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative bg-muted">
              <PhotoTile photo={photo} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-white">
                <span className="font-medium truncate" title={photo.filename}>
                  {photo.filename}
                </span>
                <span className="opacity-80">
                  {format(photo.created_at, "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            {photo.caption && (
              <CardContent className="p-2 pt-1 text-[11px] leading-snug line-clamp-2 opacity-80">
                {photo.caption}
              </CardContent>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}

function PhotoTile({ photo }: { photo: PhotoGridItem }) {
  const width = photo.width ?? 1200;
  const height = photo.height ?? 800;
  const ratio = height / width;

  return (
    <div className="w-full relative">
      <div style={{ paddingTop: `${ratio * 100}%` }} />
      <div className="absolute inset-0">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={width}
          height={height}
          sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02] h-full w-full"
          placeholder="empty"
          quality={70}
          unoptimized
        />
      </div>
    </div>
  );
}
