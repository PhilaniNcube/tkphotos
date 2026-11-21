import * as React from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface R2ImageProps {
  src?: string | null;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}

export function R2Image({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  fetchPriority,
}: R2ImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-surface-container text-on-surface-variant",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <Camera className="h-7 w-7 opacity-40" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width ?? undefined}
      height={height ?? undefined}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
