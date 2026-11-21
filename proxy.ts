import { updateSession } from "@/lib/middleware";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Skip:
     * - Payload admin + REST/GraphQL API (has its own auth)
     * - Next static assets and images
     * - favicon
     */
    "/((?!_next/static|_next/image|favicon.ico|admin|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
