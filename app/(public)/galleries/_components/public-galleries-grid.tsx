import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GalleryRow } from "@/lib/queries/galleries";
import { photoSrc } from "@/lib/utils";

export interface PublicGalleriesGridProps {
  galleries: GalleryRow[];
}

export function PublicGalleriesGrid({ galleries }: PublicGalleriesGridProps) {
  if (!galleries.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No public galleries yet.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {galleries.map((g) => {
        const href = `/galleries/${g.slug}`;
        const cover = g.cover_image ? photoSrc(g.cover_image) : "";
        return (
          <Link
            key={g.id}
            href={href}
            className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          >
            <Card className="h-full overflow-hidden p-0 transition-colors hover:border-ring/60">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {cover ? (
                  <Image
                    src={cover}
                    alt={g.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    placeholder="empty"
                    priority={false}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-600 flex items-center justify-center text-xs text-stone-300">
                    No Cover
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardHeader className="px-4 pb-4 pt-4">
                <CardTitle
                  className="text-base font-medium line-clamp-1"
                  title={g.title}
                >
                  {g.title}
                </CardTitle>
                {g.description && (
                  <CardDescription className="line-clamp-2 text-xs">
                    {g.description}
                  </CardDescription>
                )}
                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
                  <span>
                    {g.event_date
                      ? new Date(g.event_date).toLocaleDateString()
                      : new Date(g.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
