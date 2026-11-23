import { describe, expect, it, vi } from "vitest";

import { ensureFirstUserIsAdmin, protectLastAdmin } from "@/hooks/users";

function requestWithUserCount(totalDocs: number) {
  return {
    payload: {
      count: vi.fn(async () => ({ totalDocs })),
    },
  } as never;
}

describe("user role hooks", () => {
  it("promotes the first account to admin", async () => {
    const data = await ensureFirstUserIsAdmin({
      data: { email: "info@tkmedia.co.za" },
      operation: "create",
      req: requestWithUserCount(0),
    } as never);

    expect(data.role).toBe("admin");
  });

  it("keeps the invited role once accounts exist", async () => {
    const data = await ensureFirstUserIsAdmin({
      data: { email: "editor@tkmedia.co.za", role: "editor" },
      operation: "create",
      req: requestWithUserCount(3),
    } as never);

    expect(data.role).toBe("editor");
  });

  it("refuses to demote the last admin", async () => {
    await expect(
      protectLastAdmin({
        data: { role: "editor" },
        operation: "update",
        originalDoc: { role: "admin" },
        req: requestWithUserCount(1),
      } as never)
    ).rejects.toThrow(/At least one admin/);
  });

  it("allows demoting an admin while another remains", async () => {
    const data = await protectLastAdmin({
      data: { role: "editor" },
      operation: "update",
      originalDoc: { role: "admin" },
      req: requestWithUserCount(2),
    } as never);

    expect(data.role).toBe("editor");
  });

  it("ignores role changes for non-admins", async () => {
    const data = await protectLastAdmin({
      data: { role: "editor" },
      operation: "update",
      originalDoc: { role: "editor" },
      req: requestWithUserCount(1),
    } as never);

    expect(data.role).toBe("editor");
  });
});
