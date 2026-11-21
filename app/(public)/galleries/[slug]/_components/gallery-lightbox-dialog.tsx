"use client";

import * as React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@ui-sdk/react/dialog";
import { useShortcut } from "@ui-sdk/react/shortcuts";
import { toast } from "@ui-sdk/react/toast";
import { Toggle } from "@ui-sdk/react/toggle";
import { ChevronLeft, ChevronRight, Download, Heart, X } from "lucide-react";
import { AppButton } from "@/components/ui-sdk/button";
import { R2Image } from "@/components/ui-sdk/r2-image";
import { trackImageDownload } from "@/lib/analytics";
import { photoSrcSet, type PhotoRow } from "@/lib/media";
import { cn, photoSrc } from "@/lib/utils";

interface GalleryLightboxDialogProps {
  galleryTitle: string;
  photos: PhotoRow[];
  activePhoto: PhotoRow | null;
  activeIndex: number;
  isFavorite: boolean;
  onToggleFavorite: (photoId: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function GalleryLightboxDialog({
  galleryTitle,
  photos,
  activePhoto,
  activeIndex,
  isFavorite,
  onToggleFavorite,
  onPrev,
  onNext,
  onClose,
}: GalleryLightboxDialogProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  useShortcut("ArrowLeft", onPrev, {
    layer: contentRef,
    when: () => Boolean(activePhoto) && photos.length > 1,
  });

  useShortcut("ArrowRight", onNext, {
    layer: contentRef,
    when: () => Boolean(activePhoto) && photos.length > 1,
  });

  const counterLabel =
    activePhoto && photos.length > 0
      ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(
          photos.length
        ).padStart(2, "0")}`
      : "";

  const activeLabel =
    activePhoto?.caption || activePhoto?.alt || activePhoto?.filename || "";

  const fullUrl = activePhoto ? photoSrc(activePhoto, "full") : "";

  return (
    <Dialog
      open={Boolean(activePhoto)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogBackdrop className="bg-on-surface/95 backdrop-blur-xl" />
      <DialogContent
        ref={contentRef}
        className="fixed inset-0 m-0 flex h-dvh w-screen max-h-none max-w-none flex-col justify-between gap-4 rounded-none border-0 bg-transparent p-4 text-inverse-on-surface shadow-none sm:p-8"
      >
        {activePhoto && (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-inverse-on-surface/80">
                  {counterLabel}
                </span>
                <DialogTitle className="truncate text-sm font-semibold text-inverse-on-surface sm:text-base">
                  {activeLabel}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Lightbox preview from {galleryTitle}. Use arrow keys to switch
                  photos or Escape to close.
                </DialogDescription>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <Toggle
                  pressed={isFavorite}
                  onPressedChange={() => onToggleFavorite(activePhoto.id)}
                  aria-label="Favorite current photo"
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-full border-0 p-0 transition-colors cursor-pointer",
                    isFavorite
                      ? "bg-surface/20 text-error"
                      : "bg-surface/10 text-inverse-on-surface hover:bg-surface/20"
                  )}
                >
                  <Heart
                    className={cn("h-5 w-5", isFavorite && "fill-current")}
                    aria-hidden="true"
                  />
                </Toggle>

                <DialogClose
                  aria-label="Close lightbox"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border-0 bg-surface/10 p-0 text-inverse-on-surface hover:bg-surface/25 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </DialogClose>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-14">
              {photos.length > 1 && (
                <AppButton
                  variant="ghost"
                  size="icon"
                  aria-label="Previous photo"
                  onClick={onPrev}
                  className="absolute left-0 z-10 h-11 w-11 rounded-full bg-surface/15 text-inverse-on-surface hover:bg-surface/30 sm:left-2"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </AppButton>
              )}

              <div className="flex h-full w-full items-center justify-center">
                <R2Image
                  src={fullUrl}
                  srcSet={photoSrcSet(activePhoto)}
                  sizes="100vw"
                  alt={activeLabel}
                  loading="eager"
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                />
              </div>

              {photos.length > 1 && (
                <AppButton
                  variant="ghost"
                  size="icon"
                  aria-label="Next photo"
                  onClick={onNext}
                  className="absolute right-0 z-10 h-11 w-11 rounded-full bg-surface/15 text-inverse-on-surface hover:bg-surface/30 sm:right-2"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </AppButton>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-inverse-on-surface/85">
              <div className="font-mono">
                {activePhoto.width && activePhoto.height
                  ? `${activePhoto.width} × ${activePhoto.height} px • `
                  : ""}
                {galleryTitle}
              </div>

              <a
                href={fullUrl}
                download={activePhoto.filename}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackImageDownload(activePhoto.filename);
                  toast.success("Opening high-resolution image", {
                    description: activePhoto.filename,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-full bg-inverse-on-surface px-4 py-2 text-xs font-semibold text-inverse-surface hover:bg-primary-fixed transition-colors"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Save High-Res</span>
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
