import { getGalleryWithPhotos } from "@/lib/queries/galleries";
import { UploadPhotosButton } from "./_components/upload-photos-button";
import { GalleryDetail } from "./_components/gallery-detail";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryPage({ params }: PageProps) {
  const { id } = await params;
  const idNum = Number(id);
  if (Number.isNaN(idNum)) {
    return <div className="p-6 text-sm text-red-600">Invalid gallery id.</div>;
  }
  const gallery = await getGalleryWithPhotos(idNum, { limit: 200 });
  if (!gallery) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-sm">Gallery not found.</div>
        <Link
          href="/dashboard/galleries"
          className="text-xs text-primary underline"
        >
          Back to galleries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link
          href="/dashboard/galleries"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          ← Back
        </Link>
        <UploadPhotosButton galleryId={gallery.id} />
      </div>
      <GalleryDetail gallery={gallery} />
    </div>
  );
}
