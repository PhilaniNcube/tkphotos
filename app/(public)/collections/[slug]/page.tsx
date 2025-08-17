import { getCollectionBySlug } from "@/lib/queries/collections";
import Link from "next/link";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicCollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) {
    return (
      <div className="container mx-auto py-10 space-y-6">
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
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold" title={collection.name}>
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
    </div>
  );
}
