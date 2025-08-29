"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

interface GalleriesProviderProps {
  children: React.ReactNode;
}

export function GalleriesProvider({ children }: GalleriesProviderProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
