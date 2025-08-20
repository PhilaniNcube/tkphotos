import { getDashboardStats } from "@/lib/queries/stats";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PhotosTrendChart } from "./_components/photos-trend-chart";

// Clean rebuilt dashboard page (previous file was corrupted by duplicate content)
export default async function DashboardPage() {
  const stats = await getDashboardStats({ days: 14 });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <StatsOverview stats={stats} />
      <PhotosTrend stats={stats} />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function StatsOverview({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getDashboardStats>>;
}) {
  const { totals } = stats;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Photos" value={totals.photos} />
      <StatCard label="Galleries" value={totals.galleries} />
      <StatCard label="Public Galleries" value={totals.publicGalleries} />
      <StatCard label="Collections" value={totals.collections} />
      <StatCard label="Featured Photos" value={totals.featuredPhotos} />
    </div>
  );
}

function PhotosTrend({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getDashboardStats>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Uploads (Last 14 Days)
        </CardTitle>
      </CardHeader>
      <PhotosTrendChart stats={stats} />
    </Card>
  );
}
