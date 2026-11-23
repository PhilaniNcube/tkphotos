import type { PayloadRequest } from "payload";
import { describe, expect, it } from "vitest";

import { authEmailSubject, renderAuthEmail } from "@/lib/email/auth-emails";

function requestWith(context: Record<string, unknown>): PayloadRequest {
  return {
    context,
    payload: {
      config: {
        serverURL: "https://tkmedia.co.za",
        routes: { admin: "/admin" },
        admin: { routes: { reset: "/reset" } },
      },
    },
  } as unknown as PayloadRequest;
}

const user = {
  email: "info@tkmedia.co.za",
  name: "TK Media",
  role: "admin",
};

describe("dashboard invite email", () => {
  it("links to the admin reset route with the invite copy", async () => {
    const html = await renderAuthEmail({
      req: requestWith({ invite: true }),
      token: "invite-token",
      user,
    });

    expect(html).toContain("https://tkmedia.co.za/admin/reset/invite-token");
    expect(html).toContain("invited to the dashboard");
    expect(html).toContain("Admin");
  });

  it("falls back to reset copy for self-service password resets", async () => {
    const html = await renderAuthEmail({
      req: requestWith({}),
      token: "reset-token",
      user,
    });

    expect(html).toContain("Reset your password");
    expect(html).not.toContain("invited to the dashboard");
  });

  it("uses an invite-specific subject only for invitations", () => {
    expect(authEmailSubject({ req: requestWith({ invite: true }) })).toBe(
      "You've been invited to the TK Media dashboard"
    );
    expect(authEmailSubject({ req: requestWith({}) })).toBe(
      "Reset your TK Media dashboard password"
    );
  });
});
