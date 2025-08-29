import { MetadataRoute } from "next";
import {
  getAllCollections,
  type CollectionRow,
} from "@/lib/queries/collections";
import {
  getGalleriesPaginated,
  type GalleryRow,
} from "@/lib/queries/galleries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tkmedia.co.za";

  // Get dynamic routes data
  const collectionsResult = await getAllCollections();
  const galleriesResult = await getGalleriesPaginated({
    pageSize: 100,
    publicOnly: true,
  });

  const collections = collectionsResult.data;
  const galleries = galleriesResult.data;

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galleries`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Dynamic collection routes
  const collectionRoutes = collections.map((collection: CollectionRow) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    lastModified: new Date(collection.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic gallery routes
  const galleryRoutes = galleries.map((gallery: GalleryRow) => ({
    url: `${baseUrl}/galleries/${gallery.slug}`,
    lastModified: new Date(gallery.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...galleryRoutes];
}
