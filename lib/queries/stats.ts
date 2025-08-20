import { createClient } from "../server";
import { subDays, startOfDay } from "date-fns";

export interface DashboardStats {
  totals: {
    photos: number;
    galleries: number;
    publicGalleries: number;
    collections: number;
    featuredPhotos: number;
  };
  photosLastNDays: { date: string; count: number }[]; // date in ISO (yyyy-mm-dd)
  generatedAt: string;
  error?: string;
}

/**
 * Fetch aggregate counts for the dashboard plus recent photo uploads trend.
 * Uses lightweight count queries (head requests) and a small window fetch for trend (default 14 days).
 */
export async function getDashboardStats(
  options: { days?: number } = {}
): Promise<DashboardStats> {
  const days = Math.min(Math.max(options.days ?? 14, 1), 90); // clamp 1..90
  const since = subDays(new Date(), days - 1); // inclusive window
  const sinceISO = startOfDay(since).toISOString();

  try {
    const supabase = await createClient();

    // Perform count queries (HEAD) in parallel
    const [
      photosCount,
      galleriesCount,
      publicGalleriesCount,
      collectionsCount,
      featuredPhotosCount,
    ] = await Promise.all([
      supabase.from("photos").select("id", { count: "exact", head: true }),
      supabase.from("galleries").select("id", { count: "exact", head: true }),
      supabase
        .from("galleries")
        .select("id", { count: "exact", head: true })
        .eq("is_public", true),
      supabase.from("collections").select("id", { count: "exact", head: true }),
      supabase
        .from("photos")
        .select("id", { count: "exact", head: true })
        .eq("is_featured", true),
    ]);

    // Fetch recent photo created_at values (only needed column)
    const { data: recentPhotos, error: recentPhotosError } = await supabase
      .from("photos")
      .select("created_at")
      .gte("created_at", sinceISO)
      .order("created_at", { ascending: true })
      .limit(5000); // hard safety cap

    const counts = {
      photos: photosCount.count ?? 0,
      galleries: galleriesCount.count ?? 0,
      publicGalleries: publicGalleriesCount.count ?? 0,
      collections: collectionsCount.count ?? 0,
      featuredPhotos: featuredPhotosCount.count ?? 0,
    };

    // Build date -> count map for window
    const byDate: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = startOfDay(subDays(new Date(), days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      byDate[key] = 0;
    }
    if (recentPhotos && !recentPhotosError) {
      for (const row of recentPhotos) {
        const key = row.created_at.slice(0, 10);
        if (key in byDate) byDate[key]++;
      }
    }
    const photosLastNDays = Object.entries(byDate).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      totals: counts,
      photosLastNDays,
      generatedAt: new Date().toISOString(),
      error: recentPhotosError?.message,
    };
  } catch (e: any) {
    return {
      totals: {
        photos: 0,
        galleries: 0,
        publicGalleries: 0,
        collections: 0,
        featuredPhotos: 0,
      },
      photosLastNDays: [],
      generatedAt: new Date().toISOString(),
      error: e?.message || "Unknown error",
    };
  }
}
