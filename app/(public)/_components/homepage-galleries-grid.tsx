import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { getHomepageGalleries } from "@/lib/queries/galleries";
import { photoSrc } from "@/lib/utils";
import Link from "next/link";

const HomepageGalleriesGrid = async () => {
  const galleries = await getHomepageGalleries({
    galleryIds: [26, 18, 13],
    photosPerGallery: 1,
  });
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-stone-800 mb-4">Galleries</h2>
          <p className="text-lg text-stone-600">
            Explore different photography collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              href={`/galleries/${gallery.slug}`}
              className="block"
            >
              <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-0 gap-0">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={
                        photoSrc(gallery.cover_image) ||
                        photoSrc(gallery.photos[0]?.storage_key)
                      }
                      alt={gallery.title}
                      width={400}
                      height={300}
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 33vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3
                        className="text-2xl font-light mb-2"
                        title={gallery.title}
                      >
                        {gallery.title}
                      </h3>
                      {gallery.description && (
                        <p className="text-stone-200 text-sm leading-relaxed line-clamp-2">
                          {gallery.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageGalleriesGrid;
