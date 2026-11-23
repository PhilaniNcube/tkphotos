import { randomBytes } from "node:crypto";

import type { PayloadHandler, PayloadRequest } from "payload";
import { z } from "zod";

import { emailConfig } from "../email/config";

const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  name: z.string().trim().max(120).optional(),
  role: z.enum(["admin", "editor"]).default("editor"),
  /** Send a fresh invite to an account that already exists. */
  resend: z.boolean().optional(),
});

type InviteInput = z.infer<typeof inviteSchema>;

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status });
}

/**
 * Create the account with a random password the invitee never sees, then reuse
 * Payload's password-reset token to email them a "set your password" link.
 */
async function sendInviteEmail(
  req: PayloadRequest,
  email: string
): Promise<string | null> {
  return req.payload.forgotPassword({
    collection: "users",
    data: { email },
    context: { invite: true },
    req,
  });
}

export const inviteHandler: PayloadHandler = async (req) => {
  if (req.user?.role !== "admin") {
    return json({ message: "Only admins can invite people." }, 403);
  }

  let input: InviteInput;
  try {
    input = inviteSchema.parse(await req.json?.());
  } catch {
    return json(
      { message: "Enter a valid email address and choose a role." },
      400
    );
  }

  const { email } = input;

  const existing = await req.payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const alreadyExists = existing.docs.length > 0;

  if (alreadyExists && !input.resend) {
    return json(
      {
        code: "exists",
        message: `${email} already has an account. Send them a reset link instead?`,
      },
      409
    );
  }

  if (!alreadyExists) {
    await req.payload.create({
      collection: "users",
      data: {
        email,
        name: input.name || undefined,
        role: input.role,
        password: randomBytes(24).toString("base64url"),
      },
      req,
    });
  }

  let emailSent = true;
  let warning: string | undefined;

  try {
    const token = await sendInviteEmail(req, email);

    // Payload throttles reset emails per user (15s by default) and returns
    // null instead of sending another one.
    if (!token) {
      emailSent = false;
      warning =
        "An invite was sent moments ago. Wait 15 seconds, then resend it.";
    }
  } catch (error) {
    emailSent = false;
    warning =
      "The account is ready, but the invite email could not be sent. Use “Resend invite” or the Forgot password link.";
    req.payload.logger.error({
      err: error,
      msg: "[invite] Failed to send the invite email",
    });
  }

  // Every outgoing email is routed to the override inbox while testing.
  const deliveredTo = emailConfig.overrideRecipient || email;
  if (emailSent && deliveredTo !== email) {
    warning = `Test mode is on: the invite went to ${deliveredTo} instead of ${email}. Remove RESEND_OVERRIDE_RECIPIENT to email real recipients.`;
  }

  return json({
    ok: true,
    code: alreadyExists ? "resent" : "invited",
    emailSent,
    deliveredTo,
    warning,
  });
};
