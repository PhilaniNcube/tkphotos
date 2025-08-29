"use client";

import { useEffect } from "react";
import { trackGalleryView } from "@/lib/analytics";

interface GalleryAnalyticsProps {
  galleryTitle: string;
}

export function GalleryAnalytics({ galleryTitle }: GalleryAnalyticsProps) {
  useEffect(() => {
    // Track gallery view when component mounts
    trackGalleryView(galleryTitle);
  }, [galleryTitle]);

  return null; // This component doesn't render anything
}
