import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { getCollectionGalleries } from "@/lib/queries/collections";
import { getRecentPhotosForGalleries } from "@/lib/queries/photos";
import { CollectionDetailHeaderSection } from "./_components/collection-detail-header-section";
import { CollectionGalleriesGridSection } from "./_components/collection-galleries-grid-section";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionGalleries(slug);

  if (!collection) {
    return {
      title: "Collection Not Found | TK Media",
      description: "The requested collection was not found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const collectionName = collection.name || "Untitled Collection";
  const collectionDescription =
    collection.description ||
    `Explore the ${collectionName} collection featuring curated photography by TK Media.`;

  return {
    title: `${collectionName} | TK Media Collections`,
    description: collectionDescription,
    keywords: [
      "photo collection",
      collectionName,
      "TK Media",
      "professional photography",
      "Eastern Cape photographer",
      "photography portfolio",
      "curated photos",
    ],
    openGraph: {
      title: `${collectionName} | TK Media Collections`,
      description: collectionDescription,
      type: "website",
      images: [
        {
          url: "/logo.webp",
          width: 799,
          height: 604,
          alt: `${collectionName} - TK Media Collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${collectionName} | TK Media`,
      description: collectionDescription,
      images: ["/logo.webp"],
    },
    alternates: {
      canonical: `/collections/${slug}`,
    },
  };
}

export default async function PublicCollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionGalleries(slug);

  if (!collection) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center space-y-5">
        <h1 className="text-3xl font-bold text-on-surface">
          Collection Not Found
        </h1>
        <p className="text-sm text-on-surface-variant">
          The requested photography collection could not be found.
        </p>
        <AppButton
          variant="tonal"
          size="md"
          render={<Link href="/collections" />}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Collections</span>
        </AppButton>
      </div>
    );
  }

  const publicGalleries = collection.galleries.filter((g) => g.is_public);
  const photosByGallery = await getRecentPhotosForGalleries(
    publicGalleries.map((g) => g.id),
    { perGallery: 4 }
  );

  return (
    <div className="flex w-full flex-col">
      <CollectionDetailHeaderSection
        name={collection.name}
        description={collection.description}
        createdAt={collection.created_at}
        galleryCount={publicGalleries.length}
      />
      <CollectionGalleriesGridSection
        galleries={publicGalleries}
        photosByGallery={photosByGallery}
      />
    </div>
  );
}
