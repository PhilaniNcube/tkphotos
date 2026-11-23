import type { CollectionConfig } from "payload";

import {
  ensureFirstUserIsAdmin,
  protectLastAdmin,
  protectLastAdminOnDelete,
} from "../hooks/users";
import {
  authEmailSubject,
  PASSWORD_LINK_TTL_MS,
  renderAuthEmail,
} from "../lib/email/auth-emails";
import { inviteHandler } from "../lib/users/invite";
import { adminOrSelf, isAdmin, isAdminField } from "./access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    forgotPassword: {
      expiration: PASSWORD_LINK_TTL_MS,
      generateEmailHTML: (args) => renderAuthEmail(args ?? {}),
      generateEmailSubject: (args) => authEmailSubject(args ?? {}),
    },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role", "createdAt"],
    // Editors only manage content, so Users is hidden from their nav.
    hidden: ({ user }) => user?.role === "editor",
    components: {
      beforeListTable: ["/components/admin/invite-admin#InviteAdmin"],
    },
  },
  access: {
    read: adminOrSelf,
    // Payload's create-first-user endpoint bypasses access control; after that,
    // only admins create accounts (normally through the invite panel).
    create: isAdmin,
    update: adminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    // Runs before validation so the required role field is filled in even
    // though it is hidden on the create-first-user screen.
    beforeValidate: [ensureFirstUserIsAdmin],
    beforeChange: [protectLastAdmin],
    beforeDelete: [protectLastAdminOnDelete],
  },
  endpoints: [
    {
      // POST /api/users/invite — email a branded "set your password" link.
      path: "/invite",
      method: "post",
      handler: inviteHandler,
    },
  ],
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      index: true,
      options: [
        { label: "Admin — full access, manages accounts", value: "admin" },
        { label: "Editor — content only", value: "editor" },
      ],
      access: {
        // Only admins may promote or demote other users.
        update: isAdminField,
      },
      admin: {
        position: "sidebar",
        description: "Admins can invite people and manage accounts.",
        // Hidden on the create-first-user screen; that account is forced to admin.
        condition: (_data, _siblingData, { user }) => Boolean(user),
      },
    },
  ],
};
