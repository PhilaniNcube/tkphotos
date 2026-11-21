import type { NextRequest } from "next/server";

import { getGalleriesPaginated } from "@/lib/queries/galleries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const orderByParam = searchParams.get("orderBy");
  const orderBy =
    orderByParam === "title" || orderByParam === "event_date"
      ? orderByParam
      : "created_at";

  const result = await getGalleriesPaginated({
    page: Number(searchParams.get("page") ?? 1) || 1,
    pageSize: Number(searchParams.get("pageSize") ?? 20) || 20,
    publicOnly: true,
    collectionSlug: searchParams.get("collection") ?? undefined,
    includeMeta: searchParams.get("includeMeta") !== "false",
    search: searchParams.get("search") ?? undefined,
    orderBy,
    ascending: searchParams.get("ascending") === "true",
  });

  return Response.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
