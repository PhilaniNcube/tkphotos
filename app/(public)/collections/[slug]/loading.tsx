import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function CollectionDetailLoading() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="space-y-3 max-w-2xl">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-3 w-40" />
    </div>
  );
}
