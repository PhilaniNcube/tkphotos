import { getPayload, type Payload } from "payload";

import config from "@payload-config";

/**
 * Payload's Local API is safe to reuse in a server process: it opens one
 * libSQL client and caches generated schema information.
 *
 * The promise is cached globally so Next.js dev/HMR and serverless warm
 * invocations do not create a new database client per request.
 */
const globalForPayload = globalThis as unknown as {
  payload?: Promise<Payload>;
};

export function getPayloadClient(): Promise<Payload> {
  if (!globalForPayload.payload) {
    globalForPayload.payload = getPayload({ config });
  }
  return globalForPayload.payload;
}
