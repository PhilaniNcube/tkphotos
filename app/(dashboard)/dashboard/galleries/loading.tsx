import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Loading skeleton for the galleries dashboard page.
// Mirrors the layout: header + filters + gallery grid + pager.
export default function GalleriesLoading() {
  const items = Array.from({ length: 8 });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-7 w-40" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <Skeleton className="h-9 w-60" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="pt-0 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Skeleton className="h-4 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Pager placeholder */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  );
}
