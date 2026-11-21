import path from "path";
import { fileURLToPath } from "url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Galleries } from "./collections/Galleries";
import { Media } from "./collections/Media";
import { PhotoCollections } from "./collections/PhotoCollections";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { emailConfig, isEmailConfigured } from "./lib/email/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const serverURL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : siteUrl;
const allowedOrigins = Array.from(
  new Set([siteUrl, serverURL, "http://localhost:3000"])
);
const r2PublicUrl = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(
  /\/+$/,
  ""
);
const r2Enabled = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    r2PublicUrl
);

// Payload uses this adapter for auth emails (password reset, first-user
// verification, etc.). When the key is absent the adapter is omitted so local
// development and preview builds keep working.
const emailAdapter = isEmailConfigured()
  ? resendAdapter({
      apiKey: emailConfig.apiKey,
      defaultFromAddress: emailConfig.fromAddress,
      defaultFromName: emailConfig.fromName,
      overrideRecipientAddress: emailConfig.overrideRecipient,
    })
  : undefined;

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Galleries, PhotoCollections, Tags],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  email: emailAdapter,
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL,
  editor: lexicalEditor(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.TURSO_DATABASE_URL || "file:./payload.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
    // Remote Turso databases should be changed through generated migrations,
    // never by dev-mode schema pushes.
    push: false,
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      bucket: process.env.R2_BUCKET_NAME || "",
      // Enable for production uploads larger than Vercel's 4.5MB request
      // limit. Requires a CORS rule on the bucket allowing PUT from the site
      // origin plus the If-None-Match header.
      clientUploads: process.env.R2_CLIENT_UPLOADS === "true",
      collections: {
        media: {
          prefix: "media",
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${r2PublicUrl}/${key}`;
          },
        },
      },
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        // R2 requires region "auto" and path-style addressing.
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
      },
    }),
  ],
});
