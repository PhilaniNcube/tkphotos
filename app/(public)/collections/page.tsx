import Link from "next/link";
import { getAllCollections } from "@/lib/queries/collections";

// Public Collections Listing
// Displays all collections (could filter to public-only if a flag existed; assuming all collections are public facing here)
export default async function CollectionsPage() {
  const { data, error } = await getAllCollections({ orderBy: "created_at" });

  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-semibold mb-6">Collections</h1>
        <div className="text-sm text-red-600">Failed to load collections.</div>
      </div>
    );
  }

  const collections = data || [];

  return (
    <div className="container mx-auto py-10 space-y-8 px-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Collections</h1>
        <span className="text-sm text-muted-foreground">
          {collections.length} total
        </span>
      </div>
      {collections.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No collections available yet.
        </div>
      )}
      {collections.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="group rounded-xl border bg-card text-card-foreground p-4 flex flex-col gap-3 hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex-1 space-y-1">
                <h2
                  className="text-base font-semibold line-clamp-2"
                  title={c.name}
                >
                  {c.name}
                </h2>
                {c.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {c.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
                <span className="group-hover:text-primary transition-colors">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
