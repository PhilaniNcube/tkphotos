"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import UploadPhotoDialog from "@/app/(dashboard)/_components/upload-photo-dialog";
import { ImagesIcon } from "lucide-react";

interface UploadPhotosButtonProps {
  galleryId: number;
}

export function UploadPhotosButton({ galleryId }: UploadPhotosButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <ImagesIcon className="size-4 mr-2" /> Upload Photos
      </Button>
      <UploadPhotoDialog
        open={open}
        onOpenChange={setOpen}
        galleryId={galleryId}
      />
    </>
  );
}
