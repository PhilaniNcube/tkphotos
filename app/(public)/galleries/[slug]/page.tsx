import { getGalleryBySlug } from "@/lib/queries/galleries";
import React from "react";

type GalleryPageProps = {
  params: Promise<{ slug: string }>;
};

const GalleryPage = async ({ params }: GalleryPageProps) => {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) {
    return <div>Gallery not found</div>;
  }
  return <div>GalleryPage: {gallery.title}</div>;
};

export default GalleryPage;
