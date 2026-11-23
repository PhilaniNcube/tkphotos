import type {
  CollectionBeforeChangeHook as BeforeChangeHook,
  CollectionBeforeDeleteHook as BeforeDeleteHook,
  CollectionBeforeValidateHook as BeforeValidateHook,
  Payload,
} from "payload";
import { APIError } from "payload";

async function countAdmins(payload: Payload) {
  const { totalDocs } = await payload.count({
    collection: "users",
    where: { role: { equals: "admin" } },
    overrideAccess: true,
  });

  return totalDocs;
}

/**
 * The account made from Payload's "create first user" screen has no user
 * session yet, so the role field access strips it and the default would be
 * "editor". Force the first account to be an admin so the site is never left
 * without someone who can invite the rest of the team.
 */
export const ensureFirstUserIsAdmin: BeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== "create") return data;

  const { totalDocs } = await req.payload.count({
    collection: "users",
    overrideAccess: true,
  });

  if (totalDocs === 0) {
    return { ...data, role: "admin" };
  }

  return data;
};

/** Never allow the last admin to be demoted to editor. */
export const protectLastAdmin: BeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation !== "update" || originalDoc?.role !== "admin") return data;

  const nextRole = data.role ?? originalDoc.role;
  if (nextRole === "admin") return data;

  if ((await countAdmins(req.payload)) <= 1) {
    throw new APIError(
      "At least one admin account is required. Promote someone else first.",
      400
    );
  }

  return data;
};

/** Never allow the last admin to be deleted. */
export const protectLastAdminOnDelete: BeforeDeleteHook = async ({
  id,
  req,
}) => {
  const user = await req.payload.findByID({
    collection: "users",
    id,
    depth: 0,
    overrideAccess: true,
  });

  if (user.role !== "admin") return;

  if ((await countAdmins(req.payload)) <= 1) {
    throw new APIError(
      "At least one admin account is required. Promote someone else first.",
      400
    );
  }
};
