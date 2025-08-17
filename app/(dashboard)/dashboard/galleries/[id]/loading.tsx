import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Loading skeleton for an individual gallery detail page.
export default function GalleryLoading() {
  const photos = Array.from({ length: 12 });
  return (
    <div className="space-y-6">
      {/* Gallery meta card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-20" />
          </CardTitle>
          <CardDescription className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex flex-wrap gap-4 pt-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Photos section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-10" />
        </div>
        <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((_, i) => (
            <li key={i} className="text-xs">
              <Card className="overflow-hidden">
                <div className="relative aspect-video">
                  <Skeleton className="absolute inset-0" />
                </div>
                <CardContent className="p-2 space-y-2">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
