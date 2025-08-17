import React from "react";
import Image from "next/image";

const HomePageHero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image using Next.js Image for optimization */}
      <Image
        src="https://ooxvvuililixounsknpj.supabase.co/storage/v1/object/public/photos/4/vice-chancellor.jpg" /* Add this image (optimized ~150-300KB webp) to /public */
        alt="" /* Decorative background */
        priority
        fill
        sizes="100vw"
        className="object-cover object-center scale-105 animate-[slow-zoom_30s_ease-in-out_infinite_alternate]"
        placeholder="blur"
        blurDataURL="data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICAAAAAwAQCdASoEAAQAAVAfCWkAANwAP7mIAA==" /* tiny transparent placeholder */
        quality={70}
      />
      {/* Gradient & overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/90 via-stone-900/60 to-stone-700/70" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-7xl font-light tracking-wide mb-6">
          TK Media
        </h1>
        <p className="text-xl md:text-2xl font-light mb-8 text-stone-200">
          Event Photography & Videography
        </p>
        <p className="text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Professional photography and videography services for all your events,
          capturing moments that matter.
        </p>
      </div>
    </section>
  );
};

export default HomePageHero;
