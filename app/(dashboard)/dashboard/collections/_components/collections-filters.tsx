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

interface CollectionsFiltersProps {
  pageSize: number;
  search?: string;
}

export function CollectionsFilters({
  pageSize,
  search,
}: CollectionsFiltersProps) {
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
    // Always reset page when changing size/search
    sp.set("page", "1");
    const url = `${pathname}?${sp.toString()}`;
    startTransition(() => router.push(url));
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="collections-search"
          className="uppercase text-xs tracking-wide"
        >
          Search
        </Label>
        <Input
          id="collections-search"
          placeholder="Search collections..."
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
        <Label
          htmlFor="collections-page-size"
          className="uppercase text-xs tracking-wide"
        >
          Page Size
        </Label>
        <Select
          defaultValue={String(pageSize)}
          onValueChange={(v) => commit({ pageSize: Number(v) })}
        >
          <SelectTrigger id="collections-page-size" className="min-w-24">
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
        onClick={() => commit({ search: undefined, pageSize })}
      >
        Reset
      </Button>
    </div>
  );
}
