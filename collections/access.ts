import type { Access, FieldAccess } from "payload";

/** Any logged-in Payload user, whether admin or editor. */
export const isStaff: Access = ({ req }) => Boolean(req.user);

/** Full-access user. Only admins can manage accounts and invite people. */
export const isAdmin: Access = ({ req }) => req.user?.role === "admin";

/** Admins, or the signed-in user acting on their own account. */
export const adminOrSelf: Access = ({ req }) => {
  if (req.user?.role === "admin") return true;
  if (req.user) return { id: { equals: req.user.id } };
  return false;
};

/** Field-level guard so only admins can change a user's role. */
export const isAdminField: FieldAccess = ({ req }) =>
  req.user?.role === "admin";

/** Public read for published records, full read for logged-in staff. */
export const publicOrAdmin: Access = ({ req }) => {
  if (req.user) return true;
  return {
    isPublic: {
      equals: true,
    },
  };
};
