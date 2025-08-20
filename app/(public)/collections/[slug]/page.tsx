import { getCollectionGalleries } from "@/lib/queries/collections";
import { getRecentPhotosForGalleries } from "@/lib/queries/photos";
import Image from "next/image";
import Link from "next/link";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicCollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionGalleries(slug);
  if (!collection) {
    return (
      <div className="container mx-auto py-10 space-y-6 px-4">
        <h1 className="text-2xl font-semibold">Collection Not Found</h1>
        <Link
          href="/collections"
          className="text-sm underline text-muted-foreground hover:text-primary"
        >
          ← Back to collections
        </Link>
      </div>
    );
  }
  const publicGalleries = collection.galleries.filter((g) => g.is_public);
  const photosByGallery = await getRecentPhotosForGalleries(
    publicGalleries.map((g) => g.id),
    { perGallery: 4 }
  );

  return (
    <div className="mx-auto w-full max-w-7xl py-10 space-y-10 px-4">
      <header className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1
            className="text-3xl font-semibold tracking-tight"
            title={collection.name}
          >
            {collection.name}
          </h1>
          <Link
            href="/collections"
            className="text-xs underline text-muted-foreground hover:text-primary"
          >
            ← All collections
          </Link>
        </div>
        {collection.description && (
          <p className="max-w-2xl text-sm text-muted-foreground whitespace-pre-line">
            {collection.description}
          </p>
        )}
        <div className="text-xs text-muted-foreground">
          Created {new Date(collection.created_at).toLocaleDateString()}
        </div>
      </header>
      <section className="space-y-6">
        <h2 className="text-xl font-medium flex items-center gap-2">
          Galleries{" "}
          <span className="text-sm text-muted-foreground">
            ({publicGalleries.length})
          </span>
        </h2>
        {publicGalleries.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No public galleries in this collection yet.
          </p>
        )}
        {publicGalleries.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicGalleries.map((g) => {
              const photos = photosByGallery[g.id] || [];
              return (
                <li
                  key={g.id}
                  className="group border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow transition-shadow"
                >
                  <Link href={`/galleries/${g.slug}`} className="block">
                    <div className="grid grid-cols-4 gap-0 border-b bg-muted/40">
                      {photos.length === 0 && (
                        <div className="col-span-4 aspect-[4/3] flex items-center justify-center text-[10px] text-muted-foreground">
                          No photos
                        </div>
                      )}
                      {photos.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          className="relative aspect-square overflow-hidden"
                        >
                          <Image
                            src={p.storage_key}
                            alt={p.caption || p.filename}
                            width={100}
                            height={100}
                            sizes="(max-width:768px) 25vw, (max-width:1200px) 15vw, 10vw"
                            className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="p-4 space-y-1">
                      <h3
                        className="text-sm font-medium line-clamp-1"
                        title={g.title}
                      >
                        {g.title}
                      </h3>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <span>
                          {new Date(g.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          {photos.length} photo{photos.length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
