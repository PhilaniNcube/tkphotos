import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCollection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-16" />
          </CardTitle>
          <CardDescription className="space-y-2">
            <Skeleton className="h-4 w-full max-w-md" />
            <div className="flex flex-wrap gap-4 text-xs pt-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
      <section className="space-y-3">
        <Skeleton className="h-5 w-56" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded p-3 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
