"use client";

import { useEffect } from "react";
import { trackCollectionView } from "@/lib/analytics";

interface CollectionAnalyticsProps {
  collectionTitle: string;
}

export function CollectionAnalytics({
  collectionTitle,
}: CollectionAnalyticsProps) {
  useEffect(() => {
    // Track collection view when component mounts
    trackCollectionView(collectionTitle);
  }, [collectionTitle]);

  return null; // This component doesn't render anything
}
