"use client";
import { useState, useTransition } from "react";
import { updatePhotoMetadataAction } from "@/lib/actions/maintenance";
import { Button } from "@/components/ui/button";

interface Props {
  admin: boolean;
}

export function UpdateMetadataButton({ admin }: Props) {
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!admin) return null;

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const res = await updatePhotoMetadataAction(null as any, formData);
          if (!res.ok) {
            setResult(res.message || "Failed");
          } else {
            setResult(
              `Updated ${res.updated} / ${res.total} (skipped ${res.skipped}, errors ${res.errors}) in ${res.durationMs}ms`
            );
          }
        });
      }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Updating..." : "Update Photo Metadata"}
        </Button>
        <label className="flex items-center gap-1 text-xs">
          <input type="checkbox" name="force" className="h-3 w-3" /> Force
        </label>
      </div>
      {result && <p className="text-xs text-muted-foreground">{result}</p>}
    </form>
  );
}
