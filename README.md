# TK Media — photographer portfolio

Next.js 16 App Router site with a Payload CMS admin, Turso (libSQL) database
and Cloudflare R2 media storage.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| CMS / admin | Payload 3 (`/admin`) |
| Database | Turso / libSQL via `@payloadcms/db-sqlite` |
| Media storage | Cloudflare R2 via `@payloadcms/storage-s3` |
| Image processing | `sharp` (inside Payload) |

## Content model

- **Users** — photographer / staff admin accounts (Payload auth).
- **Media** — the single image library. Every upload produces:
  - `thumbnail` — 480px wide WebP (grids, cards, admin thumbnails)
  - `medium` — 1280px wide WebP (featured work, covers, social previews)
  - `full` — 2560px wide WebP (hero, lightbox / full-screen)
  - the untouched original (kept in R2 for downloads)
- **Galleries** — title, slug, description, event date, public flag, cover image.
- **Photo collections** — named groups of galleries.
- **Tags** — reusable labels for media.
- **Services** — bookable packages, ZAR pricing, category, and inquiry identifiers.

Frontend queries use Payload's Local API (`lib/queries/*`) and map documents to
the existing snake_case view models in `lib/media.ts`.

## Local setup

> **Node version:** use Node 24 LTS (`.nvmrc` is included). The libSQL native
> client currently crashes on process exit on Node 26/Windows *after* Payload
> CLI commands finish; Node 24 exits cleanly.

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm migrate                 # apply Payload migrations to Turso
pnpm dev
```

Open <http://localhost:3000> for the site and
<http://localhost:3000/admin> for the CMS. On a fresh database Payload shows
the **Create first user** screen.

### Useful scripts

```bash
pnpm dev                 # Next + Payload admin
pnpm build               # production build
pnpm migrate             # apply pending migrations to Turso
pnpm migrate:create      # generate a migration after changing collections
pnpm seed:services       # seed the Services collection with default packages
pnpm generate:types      # regenerate payload-types.ts
pnpm generate:importmap  # regenerate the admin import map after custom components
pnpm email:dev           # React Email preview server on :3001
pnpm email:test -- --to=you@example.com   # send a real Resend test email
```

## Email

Transactional email is built on **Resend** and **React Email**:

- `react-email` — templates, rendering and the local preview server
- `resend` — delivery
- `@payloadcms/email-resend` — Payload's auth emails (password reset, etc.)

Templates live in `emails/`:

- `contact-inquiry.tsx` — internal notification for the contact form
- `contact-autoreply.tsx` — confirmation sent to the person who wrote in
- `components/email-layout.tsx` — shared branded shell
- `theme.ts` — colors, spacing and typography tokens

`lib/email/send.ts` renders the React template to HTML + plain text and sends
it via Resend. `lib/actions/contact.tsx` sends the internal notification first,
then the auto-reply (best-effort).

Payload is configured in `payload.config.ts`; when `RESEND_API_KEY` is present,
the Resend adapter is attached and Payload auth emails use it. Without the key,
the adapter is omitted so local development and builds still work.

### Required env

```bash
RESEND_API_KEY=re_...
EMAIL_FROM_ADDRESS=noreply@tkmedia.co.za   # must be on a verified Resend domain
EMAIL_FROM_NAME=TK Media
CONTACT_TO_EMAIL=hello@tkmedia.co.za       # where enquiries are delivered
```

Optional:

```bash
EMAIL_REPLY_TO=
RESEND_OVERRIDE_RECIPIENT=                 # route all sends to one inbox while testing
```

Verify the sending domain in Resend before going live. For a quick test you can
use `onboarding@resend.dev` as `EMAIL_FROM_ADDRESS`, but production sends should
come from your verified domain.

Preview templates locally:

```bash
pnpm email:dev
# http://localhost:3001
```

## Users and access

`Users` is the Payload auth collection for the dashboard (`/admin`). There are
two roles:

| Role | Can do |
| --- | --- |
| **Admin** | Everything: content, media, accounts and invitations. |
| **Editor** | Content, media and tags. The Users collection is hidden. |

Accounts are **not** created by signing up. An admin invites people:

1. Open `/admin` → **Users**.
2. Use **Invite a team member** above the list: enter the email, an optional
   name and the role, then **Send invite**.
3. The invitee gets a branded email with a **Set my password** button. The link
   is valid for 72 hours and opens `/admin/reset/:token`, where they choose a
   password and land in the dashboard.

The account is created with a random password the invitee never sees, so the
email link is the only way in. Use **Resend invite** if the first email expired.
Only admins can call `POST /api/users/invite`.

The first account created on a fresh database is always promoted to **Admin**,
and the app refuses to demote or delete the last remaining admin. Existing
accounts created before roles existed were migrated to **Admin**.

> **Testing tip:** while `RESEND_OVERRIDE_RECIPIENT` is set, every invite is
> redirected to that inbox. The invite panel says where the email actually
> went, so check it before inviting real people.

Email templates live in `emails/`: `password.tsx` covers both invites and
self-service password resets, and `lib/email/auth-emails.tsx` wires it into
Payload's `forgotPassword` flow.

## Content migration (legacy Supabase → Turso/R2)

The one-off migration is idempotent and resumable:

```bash
pnpm migrate:data:export     # read-only Supabase export -> scripts/migrate/data/
pnpm migrate:data:import     # Payload creates + sharp variants + R2 uploads
```

Useful flags:

```bash
pnpm migrate:data:import -- --skip-media       # metadata only
pnpm migrate:data:import -- --limit-media=5    # smoke test
pnpm migrate:data:import -- --skip-covers      # skip cover-image pass
pnpm migrate:data:import -- --concurrency=5    # parallel uploads (default 3)
pnpm migrate:data:import -- --update-existing  # re-apply source metadata
```

Progress and failures are written to:

- `scripts/migrate/data/migration-map.json` — legacy id → Payload id map
- `scripts/migrate/data/migration-report.json` — summary + failures

Re-running the import skips records already present by `legacyId` /
`legacyUrl`, so it is safe to resume after an interruption.

> **Legacy auth:** Supabase Auth is still used for client login pages while the
> content and media layers run on Payload. Auth can be moved to a Payload
> `clients` collection in a follow-up pass.

## Images in the frontend

`lib/media.ts` exposes `mediaUrl`, `mediaSrcSet` and the `PhotoRow` view model.
Components request the cheapest variant that is still sharp:

- masonry / cards → `thumbnail`
- featured work, covers → `medium`
- hero / full-screen → `full`

Payload-generated variants are served straight from R2 (`unoptimized` on
`next/image`), so Vercel does not re-encode images that already exist in the
right size and format.

## Deployment notes (Vercel)

1. Add `PAYLOAD_SECRET`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, all `R2_*`
   variables and `NEXT_PUBLIC_R2_PUBLIC_URL` to the Vercel project.
2. Run `pnpm migrate` as part of the release/deploy step (or once from a local
   machine) before serving traffic.
3. Payload and Next.js are configured to allow uploads up to **50 MB** per
   image (`60 MB` total request ceiling). Because Vercel hard-caps server-proxied
   serverless requests at **4.5 MB**, direct browser-to-R2 client uploads are
   enabled by default whenever R2 is configured (set `R2_CLIENT_UPLOADS=false`
   to disable). Ensure the R2 bucket has a CORS rule allowing your site origin
   (and any Vercel preview domain):
   - Allowed origins: `https://tkmedia.co.za` (and the Vercel preview domain)
   - Allowed methods: `PUT`, `GET`, `HEAD`
   - Allowed headers: `*` (at minimum `If-None-Match`, `Content-Type`)
   Payload still generates the resized variants server-side after the browser
   upload finishes.
4. Prefer a custom domain for the R2 bucket (for example
   `media.tkmedia.co.za`) instead of the `*.r2.dev` development URL.
5. The R2 bucket must be publicly readable (custom domain or R2.dev) because
   the media collection uses direct public URLs.
6. Add a Cloudflare Cache Rule for `<media host>/media/*` with a long Edge TTL
   (assets are content-addressed by filename and immutable). This keeps R2
   reads and egress low.
