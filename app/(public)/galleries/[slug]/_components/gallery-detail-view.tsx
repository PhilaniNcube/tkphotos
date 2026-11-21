"use client";

import * as React from "react";
import { toast } from "@ui-sdk/react/toast";
import { trackGalleryView, trackImageDownload } from "@/lib/analytics";
import type { GalleryWithPhotos } from "@/lib/queries/galleries";
import { GalleryDetailHeaderSection } from "./gallery-detail-header-section";
import { GalleryLightboxDialog } from "./gallery-lightbox-dialog";
import { GalleryMasonrySection } from "./gallery-masonry-section";

interface GalleryDetailViewProps {
  gallery: GalleryWithPhotos;
}

export function GalleryDetailView({ gallery }: GalleryDetailViewProps) {
  const storageKey = `tk-favorites-${gallery.slug}`;
  const [favoriteList, setFavoriteList] = React.useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const [activePhotoId, setActivePhotoId] = React.useState<string | null>(null);

  React.useEffect(() => {
    trackGalleryView(gallery.title);
  }, [gallery.title]);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavoriteList(parsed.filter((v): v is string => typeof v === "string"));
        }
      }
    } catch {
      // Ignore storage read errors in restricted browsers.
    }
  }, [storageKey]);

  const favoriteIds = React.useMemo(
    () => new Set(favoriteList),
    [favoriteList]
  );

  const handleToggleFavorite = React.useCallback(
    (photoId: string) => {
      setFavoriteList((prev) => {
        const next = prev.includes(photoId)
          ? prev.filter((id) => id !== photoId)
          : [...prev, photoId];
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ignore quota errors.
        }
        return next;
      });
    },
    [storageKey]
  );

  const visiblePhotos = React.useMemo(() => {
    if (!favoritesOnly) return gallery.photos;
    return gallery.photos.filter((p) => favoriteIds.has(p.id));
  }, [favoritesOnly, gallery.photos, favoriteIds]);

  const activeIndex = React.useMemo(() => {
    if (!activePhotoId) return -1;
    return visiblePhotos.findIndex((p) => p.id === activePhotoId);
  }, [activePhotoId, visiblePhotos]);

  const activePhoto =
    activeIndex >= 0 ? visiblePhotos[activeIndex] ?? null : null;

  const handlePrev = React.useCallback(() => {
    if (visiblePhotos.length < 2 || activeIndex < 0) return;
    const prevIdx =
      (activeIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
    setActivePhotoId(visiblePhotos[prevIdx].id);
  }, [activeIndex, visiblePhotos]);

  const handleNext = React.useCallback(() => {
    if (visiblePhotos.length < 2 || activeIndex < 0) return;
    const nextIdx = (activeIndex + 1) % visiblePhotos.length;
    setActivePhotoId(visiblePhotos[nextIdx].id);
  }, [activeIndex, visiblePhotos]);

  const handleDownloadAll = React.useCallback(() => {
    trackImageDownload(`${gallery.slug}-all`);
    toast.info(`Full gallery archive (${gallery.photos.length} frames)`, {
      description:
        "Open any photo to save its 2560px WebP file, or contact TK Media with your favorites shortlist for original RAW/JPEG ZIP delivery.",
    });
  }, [gallery.photos.length, gallery.slug]);

  return (
    <div className="flex w-full flex-col">
      <GalleryDetailHeaderSection
        gallery={gallery}
        favoritesCount={favoriteIds.size}
        favoritesOnly={favoritesOnly}
        onFavoritesOnlyChange={setFavoritesOnly}
        onDownloadAll={handleDownloadAll}
      />

      <GalleryMasonrySection
        photos={visiblePhotos}
        totalCount={gallery.photos.length}
        favoritesOnly={favoritesOnly}
        favoriteIds={favoriteIds}
        onToggleFavorite={handleToggleFavorite}
        onOpenLightbox={setActivePhotoId}
        onClearFavoritesFilter={() => setFavoritesOnly(false)}
      />

      <GalleryLightboxDialog
        galleryTitle={gallery.title}
        photos={visiblePhotos}
        activePhoto={activePhoto}
        activeIndex={activeIndex}
        isFavorite={activePhoto ? favoriteIds.has(activePhoto.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={() => setActivePhotoId(null)}
      />
    </div>
  );
}
