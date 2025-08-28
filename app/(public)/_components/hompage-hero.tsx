"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Sample hero images - in production, these could come from featured photos
const heroImages = [
  {
    src: "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvHp3Ev2uPJ1zb6YVQ7X8wASmdhyxevWU2tL4K",
    alt: "Sunset",
  },
  {
    src: "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxv8VDE0SCZ2cukOPCKHZ1tJvA3arexRl7bqd4I",
    alt: "Professional photography",
  },
  {
    src: "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvs6r8S60MxNnfSJ1LF2w7eUsGP9R4QBmzIkbg",
    alt: "Birds",
  },
  {
    src: "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxvP1dFiygiyHLlD9c1F6kOV073etrpfmnzqKJd",
    alt: "Nature photography",
  },

  {
    src: "https://uadq23xeqd.ufs.sh/f/XaFRTsN2LRxv4cBfHfsyqYrMLSTDF2ERoyNwCh1d0fQsGBiA",
    alt: "Wedding Photography",
  },
];

const HomePageHero = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative h-screen overflow-hidden">
      <Carousel
        setApi={setApi}
        className="h-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent className="h-screen">
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="h-screen">
              <div className="relative h-full flex items-center justify-center">
                {/* Background image using Next.js Image for optimization */}
                <Image
                  src={image.src}
                  alt={image.alt}
                  priority={index === 0} // Only prioritize first image
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  placeholder="blur"
                  blurDataURL="data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICAAAAAwAQCdASoEAAQAAVAfCWkAANwAP7mIAA=="
                  quality={50}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900/90 via-stone-900/60 to-stone-700/70" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Content overlay - positioned over the carousel */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-6xl md:text-7xl font-semibold tracking-wide mb-6">
              TK Media
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 text-stone-200">
              Event Photography & Videography
            </p>
            <p className="text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Professional photography and videography services for all your
              events, capturing moments that matter.
            </p>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  );
};

export default HomePageHero;
