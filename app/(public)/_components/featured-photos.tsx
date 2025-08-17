import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedPhotos } from "@/lib/queries/photos";
import Image from "next/image";
import React from "react";
import { photoSrc } from "@/lib/utils";

const FeaturedPhotos = async () => {
  const featuredPhotos = await getFeaturedPhotos(3);
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-stone-800 mb-4">
            Featured Work
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            A curated selection of recent photography showcasing various styles
            and moments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPhotos.map((photo) => (
            <Card
              key={photo.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
            >
              <CardContent className="p-0">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={photoSrc(photo.storage_key) || "/placeholder.svg"}
                    alt={photo.caption || photo.filename}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3
                      className="text-lg font-medium mb-1"
                      title={photo.filename}
                    >
                      {photo.caption || photo.filename}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30"
                    >
                      Gallery #{photo.gallery_id}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPhotos;
