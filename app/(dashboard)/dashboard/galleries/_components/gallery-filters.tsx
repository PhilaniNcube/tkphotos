"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GalleryFiltersProps {
  limit: number;
  search?: string;
}

/**
 * Client filters component using shadcn/ui parts.
 * Updates URL query (resets cursor + page when changing search/limit).
 */
export function GalleryFilters({ limit, search }: GalleryFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const commit = (next: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === "") sp.delete(k);
      else sp.set(k, String(v));
    });
    // Always reset cursor + page when changing core filters
    sp.delete("cursorCreatedAt");
    sp.delete("cursorId");
    sp.set("page", "1");
    const url = `${pathname}?${sp.toString()}`;
    startTransition(() => router.push(url));
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="gallery-search"
          className="uppercase text-xs tracking-wide"
        >
          Search
        </Label>
        <Input
          id="gallery-search"
          placeholder="Search galleries..."
          defaultValue={search || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = (e.target as HTMLInputElement).value;
              commit({ search: value || undefined });
            }
          }}
          onBlur={(e) => commit({ search: e.target.value || undefined })}
          className="w-64"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="page-size" className="uppercase text-xs tracking-wide">
          Page Size
        </Label>
        <Select
          defaultValue={String(limit)}
          onValueChange={(v) => commit({ limit: Number(v) })}
        >
          <SelectTrigger id="page-size" className="min-w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => commit({ search: undefined, limit })}
      >
        Reset
      </Button>
    </div>
  );
}
