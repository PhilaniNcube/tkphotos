import type { Access } from "payload";

/** Any logged-in Payload user (the photographer / staff). */
export const isAdmin: Access = ({ req }) => Boolean(req.user);

/** Public read for published records, full read for logged-in staff. */
export const publicOrAdmin: Access = ({ req }) => {
  if (req.user) return true;
  return {
    isPublic: {
      equals: true,
    },
  };
};
