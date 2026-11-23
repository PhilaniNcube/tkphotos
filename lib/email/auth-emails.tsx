import type { PayloadRequest } from "payload";
import { formatAdminURL } from "payload/shared";
import { render } from "react-email";

import { PasswordEmail } from "@/emails/password";

/** Invite and reset links stay valid for three days. */
export const PASSWORD_LINK_TTL_MS = 1000 * 60 * 60 * 72;

const FALLBACK_DASHBOARD_MESSAGE =
  "Open the TK Media dashboard and use the “Forgot password” link to set your password.";

type AuthEmailUser = {
  email?: string | null;
  name?: string | null;
  role?: string | null;
};

type AuthEmailArgs = {
  req?: PayloadRequest;
  token?: string;
  user?: unknown;
};

function buildResetUrl(req: PayloadRequest, token: string): string {
  const { config } = req.payload;
  const serverURL =
    config.serverURL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  return formatAdminURL({
    adminRoute: config.routes.admin,
    path: `${config.admin.routes.reset}/${token}`,
    serverURL,
  });
}

/**
 * Payload calls this for every password-reset email. The invite endpoint sets
 * `context.invite` on `forgotPassword` so the same token machinery can send a
 * branded invitation instead of a plain reset notice.
 */
export async function renderAuthEmail({
  req,
  token,
  user,
}: AuthEmailArgs): Promise<string> {
  if (!req || !token) return FALLBACK_DASHBOARD_MESSAGE;

  const account = (user ?? {}) as AuthEmailUser;

  return render(
    <PasswordEmail
      invited={Boolean(req.context?.invite)}
      name={account.name}
      email={account.email ?? undefined}
      role={account.role}
      resetUrl={buildResetUrl(req, token)}
      expiresInHours={Math.round(PASSWORD_LINK_TTL_MS / (60 * 60 * 1000))}
    />
  );
}

export function authEmailSubject({ req }: AuthEmailArgs): string {
  return req?.context?.invite
    ? "You've been invited to the TK Media dashboard"
    : "Reset your TK Media dashboard password";
}
