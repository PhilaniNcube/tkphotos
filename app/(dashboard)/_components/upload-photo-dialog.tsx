"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { createPhotoAction } from "@/lib/actions/photos";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UploadPhotoDialogProps {
  galleryId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simple submit button that works with form actions (if needed later)
function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="button" disabled={pending || disabled}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export function UploadPhotoDialog({
  galleryId,
  open,
  onOpenChange,
}: UploadPhotoDialogProps) {
  const [uploaded, setUploaded] = useState<
    { name: string; ufsUrl: string; width?: number; height?: number }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [creating, startCreate] = useTransition();
  const [creatingCount, setCreatingCount] = useState(0);

  const router = useRouter();

  // Reset state each time dialog is newly opened (fresh session)
  useEffect(() => {
    if (open === true) {
      setUploaded([]);
      setCreatingCount(0);
    }
  }, [open]);

  const handlePersistRecords = () => {
    // For each successfully uploaded file, create a photo DB record
    if (uploaded.length === 0) {
      toast.error("No uploaded files to persist");
      return;
    }
    setCreatingCount(uploaded.length);
    startCreate(async () => {
      let created = 0;
      for (const file of uploaded) {
        // Build FormData for action
        const fd = new FormData();
        fd.append("filename", file.name);
        fd.append("storage_key", file.ufsUrl);
        fd.append("gallery_id", String(galleryId));
        if (file.width && file.height) {
          fd.append(
            "metadata",
            JSON.stringify({ width: file.width, height: file.height })
          );
        }
        const res = await createPhotoAction(undefined as any, fd);
        if (res.success) {
          created++;
        } else {
          toast.error(`Failed to save record for ${file.name}: ${res.error}`);
        }
      }
      if (created === uploaded.length) {
        toast.success(`Added ${created} photo${created > 1 ? "s" : ""}`);
        // Close dialog & clear local state
        setUploaded([]);
        onOpenChange(false);
      } else if (created > 0) {
        // Partial success; let user know
        toast.info(
          `Successfully added ${created} of ${uploaded.length} photos`
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-md p-2">
            <UploadDropzone<OurFileRouter, "photoUploader">
              endpoint="photoUploader"
              onClientUploadComplete={(
                res:
                  | { name: string; url?: string; ufsUrl?: string }[]
                  | undefined
              ) => {
                setUploading(false);
                if (res) {
                  const mapped = res
                    .map((r) => ({
                      name: r.name,
                      ufsUrl: r.ufsUrl ?? r.url ?? "",
                    }))
                    .filter((r) => !!r.ufsUrl);

                  // For each uploaded image, load it to get dimensions
                  Promise.all(
                    mapped.map(
                      (file) =>
                        new Promise<
                          typeof file & { width?: number; height?: number }
                        >((resolve) => {
                          const img = new Image();
                          // Attempt to avoid tainting canvas if needed later
                          img.crossOrigin = "anonymous";
                          img.onload = () => {
                            resolve({
                              ...file,
                              width: img.naturalWidth,
                              height: img.naturalHeight,
                            });
                          };
                          img.onerror = () => resolve(file); // fallback without dims
                          img.src = file.ufsUrl;
                        })
                    )
                  ).then((withDims) => {
                    setUploaded((prev) => [...prev, ...withDims]);
                    toast.success(
                      `Uploaded ${withDims.length} file${
                        withDims.length > 1 ? "s" : ""
                      }`
                    );
                  });
                }
              }}
              onUploadError={(error: Error) => {
                setUploading(false);
                toast.error(error.message);
              }}
              onUploadBegin={() => {
                setUploading(true);
              }}
            />
            {uploaded.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                {uploaded.length} file{uploaded.length > 1 ? "s" : ""} ready to
                save.
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePersistRecords}
              disabled={creating || uploading || uploaded.length === 0}
            >
              {creating
                ? `Saving ${creatingCount}...`
                : uploaded.length === 0
                ? "Upload files first"
                : `Save ${uploaded.length} to Library`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPhotoDialog;
