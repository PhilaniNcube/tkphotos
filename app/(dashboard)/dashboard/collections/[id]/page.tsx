import { getCollectionWithGalleries } from "@/lib/queries/collections";
import { getGalleriesPaginated } from "@/lib/queries/galleries";
import { CollectionDetail } from "./_components/collection-detail";
import { AddGalleryToCollectionForm } from "./_components/add-gallery-form";

interface CollectionPageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolved =
    (params as any)?.then && typeof (params as any).then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });

  const idNum = Number(resolved.id);
  if (Number.isNaN(idNum)) {
    return <div className="text-sm text-red-600">Invalid collection id</div>;
  }
  const collection = await getCollectionWithGalleries(idNum);
  if (!collection) {
    return (
      <div className="text-sm text-muted-foreground">Collection not found</div>
    );
  }
  // Fetch gallery options (limit 100 for selection)
  const galleriesPage = await getGalleriesPaginated({ page: 1, pageSize: 100 });
  const existingIds = new Set(collection.galleries.map((g) => g.id));
  const available = galleriesPage.data.filter((g) => !existingIds.has(g.id));
  return (
    <div className="space-y-8">
      <CollectionDetail collection={collection} />
      <AddGalleryToCollectionForm
        collectionId={collection.id}
        galleries={available.map((g) => ({ id: g.id, title: g.title }))}
      />
    </div>
  );
}
