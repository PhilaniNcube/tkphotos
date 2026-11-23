"use client";

import { Button, toast } from "@payloadcms/ui";
import { useState } from "react";

import styles from "./invite-admin.module.css";

type Role = "admin" | "editor";

type InviteResponse = {
  code?: "invited" | "resent" | "exists";
  deliveredTo?: string;
  emailSent?: boolean;
  message?: string;
  ok?: boolean;
  warning?: string;
};

type Feedback = {
  text: string;
  tone: "error" | "success" | "warning";
};

const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: "Editor — content only", value: "editor" },
  { label: "Admin — full access", value: "admin" },
];

/**
 * Rendered above the Users list table. Sits in the admin's own bundling, so it
 * uses Payload UI primitives rather than the site's Tailwind styles.
 */
export function InviteAdmin() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [canResend, setCanResend] = useState(false);

  async function send(resend = false) {
    setBusy(true);
    setFeedback(null);
    setCanResend(false);

    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name.trim() || undefined,
          role,
          resend,
        }),
      });
      const data = (await response.json()) as InviteResponse;

      if (!response.ok) {
        if (data.code === "exists") {
          setCanResend(true);
          setFeedback({
            tone: "warning",
            text: data.message ?? `${email} already has an account.`,
          });
        } else {
          setFeedback({
            tone: "error",
            text: data.message ?? "The invite could not be sent.",
          });
        }
        return;
      }

      toast.success(
        resend ? `Invite resent to ${email}.` : `Invite sent to ${email}.`
      );
      setFeedback({
        tone: data.warning ? "warning" : "success",
        text: data.warning ?? `Invite sent to ${email}.`,
      });

      if (!resend) {
        setEmail("");
        setName("");
        setRole("editor");
      }
    } catch {
      setFeedback({
        tone: "error",
        text: "Could not reach the server. Check your connection and try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className={styles.panel}
      onSubmit={(event) => {
        event.preventDefault();
        void send();
      }}
    >
      <h2 className={styles.title}>Invite a team member</h2>
      <p className={styles.hint}>
        They receive an email with a link to choose their own password. The link
        expires in 72 hours.
      </p>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input
            autoComplete="email"
            className={styles.input}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@tkmedia.co.za"
            required
            type="email"
            value={email}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Name (optional)</span>
          <input
            autoComplete="name"
            className={styles.input}
            onChange={(event) => setName(event.target.value)}
            placeholder="Thandi Mokoena"
            type="text"
            value={name}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Role</span>
          <select
            className={styles.select}
            onChange={(event) => setRole(event.target.value as Role)}
            value={role}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.actions}>
        <Button buttonStyle="primary" disabled={busy} type="submit">
          {busy ? "Sending…" : "Send invite"}
        </Button>

        {canResend ? (
          <Button
            buttonStyle="secondary"
            disabled={busy}
            onClick={() => void send(true)}
            type="button"
          >
            Resend invite instead
          </Button>
        ) : null}
      </div>

      {feedback ? (
        <p
          className={`${styles.feedback} ${styles[feedback.tone]}`}
          role="status"
        >
          {feedback.text}
        </p>
      ) : null}
    </form>
  );
}
