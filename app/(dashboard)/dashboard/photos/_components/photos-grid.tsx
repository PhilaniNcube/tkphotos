import { PhotoRow } from "@/lib/queries/photos";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";

interface PhotosGridProps {
  photos: PhotoRow[];
}

export function PhotosGrid({ photos }: PhotosGridProps) {
  if (!photos.length) {
    return <p className="text-sm text-muted-foreground">No photos found.</p>;
  }
  return (
    <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((p) => {
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
                {p.is_featured && (
                  <span className="absolute top-1 left-1 rounded bg-amber-500/80 text-[10px] px-1 py-0.5 text-white">
                    Featured
                  </span>
                )}
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
