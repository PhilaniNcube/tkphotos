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

interface GalleryDetailProps {
  gallery: GalleryWithPhotos;
}

export function GalleryDetail({ gallery }: GalleryDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span>{gallery.title}</span>
            <span className="text-xs font-normal text-muted-foreground">
              ID #{gallery.id}
            </span>
          </CardTitle>
          <CardDescription className="space-y-1">
            {gallery.description || (
              <span className="italic opacity-70">No description</span>
            )}
            <div className="flex flex-wrap gap-4 text-xs pt-2">
              <span>Status: {gallery.is_public ? "Public" : "Private"}</span>
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
                <Link
                  href={
                    gallery.cover_image.startsWith("http")
                      ? gallery.cover_image
                      : `#`
                  }
                  className="text-primary underline text-xs"
                >
                  {gallery.cover_image}
                </Link>
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
                        <Image
                          src={src}
                          alt={p.caption || p.filename}
                          fill
                          sizes="(max-width:768px) 50vw, (max-width:1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
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
