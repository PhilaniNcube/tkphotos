import { CollectionWithGalleries } from "@/lib/queries/collections";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

interface CollectionDetailProps {
  collection: CollectionWithGalleries;
}

export function CollectionDetail({ collection }: CollectionDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span>{collection.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              ID #{collection.id}
            </span>
          </CardTitle>
          <CardDescription className="space-y-1">
            {collection.description || (
              <span className="italic opacity-70">No description</span>
            )}
            <div className="flex flex-wrap gap-4 text-xs pt-2">
              <span>
                Created: {new Date(collection.created_at).toLocaleString()}
              </span>
              <span>Slug: {collection.slug}</span>
              <span>Galleries: {collection.galleries.length}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">
          Galleries ({collection.galleries.length})
        </h2>
        {collection.galleries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No galleries added to this collection yet.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collection.galleries.map((g) => (
              <li key={g.id}>
                <Link
                  href={`/dashboard/galleries/${g.id}`}
                  className="block rounded border p-3 text-sm hover:border-ring/60 transition-colors"
                >
                  <div className="font-medium line-clamp-1" title={g.title}>
                    {g.title}
                  </div>
                  <div className="text-xs flex flex-col gap-0.5 mt-1 opacity-70">
                    <span>{new Date(g.created_at).toLocaleDateString()}</span>
                    <span>{g.is_public ? "Public" : "Private"}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
