"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { createPhotoAction } from "@/lib/actions/photos";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

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
  const upload = useSupabaseUpload({
    bucketName: "photos",
    path: `${galleryId}`,
    allowedMimeTypes: ["image/*"],
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    upsert: false,
  });
  const [creating, startCreate] = useTransition();
  const [creatingCount, setCreatingCount] = useState(0);

  const handlePersistRecords = async () => {
    // For each successfully uploaded file, create a photo DB record
    const successfulFiles = upload.successes
      .map((name) => upload.files.find((f) => f.name === name))
      .filter(Boolean) as File[];
    if (successfulFiles.length === 0) {
      toast.error("No uploaded files to persist");
      return;
    }
    setCreatingCount(successfulFiles.length);
    startCreate(async () => {
      let created = 0;
      for (const file of successfulFiles) {
        // Build FormData for action
        const fd = new FormData();
        fd.append("filename", file.name);
        fd.append("storage_key", `${galleryId}/${file.name}`);
        fd.append("gallery_id", String(galleryId));
        const res = await createPhotoAction(undefined as any, fd);
        if (res.success) {
          created++;
        } else {
          toast.error(`Failed to save record for ${file.name}: ${res.error}`);
        }
      }
      if (created === successfulFiles.length) {
        toast.success(`Added ${created} photo${created > 1 ? "s" : ""}`);
        onOpenChange(false);
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
          <Dropzone
            {...upload}
            className="min-h-52 flex flex-col justify-center"
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            {!upload.isSuccess && (
              <Button
                onClick={upload.onUpload}
                disabled={upload.loading || upload.files.length === 0}
              >
                {upload.loading ? "Uploading..." : "Upload to Storage"}
              </Button>
            )}
            {upload.isSuccess && (
              <Button onClick={handlePersistRecords} disabled={creating}>
                {creating
                  ? `Saving ${creatingCount}...`
                  : `Save ${upload.successes.length} to Library`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadPhotoDialog;
