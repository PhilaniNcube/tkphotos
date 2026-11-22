import { cacheLife, cacheTag } from "next/cache";

import type { Service } from "@/payload-types";

import { getPayloadClient } from "../payload";
import {
  DEFAULT_SERVICES,
  type ServiceCategory,
  type ServiceIconName,
  type ServicePackageItem,
  type ServiceRateLabel,
} from "../services-data";

export function toServicePackageItem(doc: Service): ServicePackageItem {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    category: doc.category as ServiceCategory,
    badge: doc.badge,
    description: doc.description,
    rateLabel: doc.rateLabel as ServiceRateLabel,
    rate: doc.rate,
    icon: doc.icon as ServiceIconName,
    featured: Boolean(doc.featured),
    isActive: Boolean(doc.isActive),
    sortOrder: doc.sortOrder,
  };
}

export async function getActiveServices(): Promise<ServicePackageItem[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "services",
      where: { isActive: { equals: true } },
      sort: "sortOrder",
      limit: 100,
      depth: 0,
      overrideAccess: true,
    });

    if (result.docs.length > 0) {
      return result.docs.map((doc) => toServicePackageItem(doc as Service));
    }

    const count = await payload.count({
      collection: "services",
      overrideAccess: true,
    });

    return count.totalDocs === 0 ? DEFAULT_SERVICES : [];
  } catch {
    return DEFAULT_SERVICES;
  }
}

export async function getServiceBySlug(
  slug: string
): Promise<ServicePackageItem | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("services");

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "services",
      where: {
        and: [{ slug: { equals: slug } }, { isActive: { equals: true } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const doc = result.docs[0] as Service | undefined;
    if (doc) {
      return toServicePackageItem(doc);
    }

    const count = await payload.count({
      collection: "services",
      overrideAccess: true,
    });

    if (count.totalDocs === 0) {
      return DEFAULT_SERVICES.find((service) => service.slug === slug) ?? null;
    }

    return null;
  } catch {
    return DEFAULT_SERVICES.find((service) => service.slug === slug) ?? null;
  }
}
