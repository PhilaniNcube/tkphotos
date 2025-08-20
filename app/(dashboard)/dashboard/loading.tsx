import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Route-level loading skeleton for /dashboard while stats fetch
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full grid grid-cols-14 gap-2 items-end">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full rounded-sm"
                style={{ height: `${20 + (i % 7) * 10}px` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
