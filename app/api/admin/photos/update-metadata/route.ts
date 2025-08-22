import { NextRequest, NextResponse } from "next/server";
import { updateAllPhotoMetadata } from "../../../../../lib/maintenance/update-photo-metadata";
import { createClient } from "../../../../../lib/server";

// Simple admin guard using rpc is_admin()
async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return !!data;
}

export const dynamic = "force-dynamic"; // ensure not cached

export async function POST(req: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const force = !!body.force;
    const summary = await updateAllPhotoMetadata({ force });
    return NextResponse.json({ ok: true, ...summary });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Use POST to trigger metadata update." });
}
