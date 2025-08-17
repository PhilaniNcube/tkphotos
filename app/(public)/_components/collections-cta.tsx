import Link from "next/link";
import React from "react";

const CollectionsCTA = () => {
  return (
    <section className="py-20 bg-stone-100">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-light text-stone-800 mb-6">
          Let's Create Together
        </h2>
        <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
          Ready to capture your special moments? Get in touch to discuss your
          photography needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="px-8 py-3 bg-stone-800 text-white hover:bg-stone-700 transition-colors duration-200 font-medium"
          >
            Contact Me
          </Link>
          <Link
            href="/collections"
            className="px-8 py-3 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-200 font-medium"
          >
            View Full Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CollectionsCTA;
