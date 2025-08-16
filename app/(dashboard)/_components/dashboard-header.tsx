"use client";

import { usePathname } from "next/navigation";
import React from "react";
import PhotoGalleryDialog from "./photo-gallery-dialog";

const DashboardHeader = () => {
  const pathname = usePathname();

  // use a regex to write the pathname as a readable title also remove the leading / and just get the text after the last /
  const title = pathname
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/^\//, "")
    .replace(/.*\//, "");

  return (
    <header className="bg-card border-b border-border px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="ml-12 lg:ml-0">
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        </div>
        <div className="flex gap-x-3">
          <PhotoGalleryDialog />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
