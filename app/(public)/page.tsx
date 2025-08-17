import Image from "next/image";
import HomePageHero from "./_components/hompage-hero";
import FeaturedPhotos from "./_components/featured-photos";
import HomepageGalleriesGrid from "./_components/homepage-galleries-grid";
import CollectionsCTA from "./_components/collections-cta";

export default function Home() {
  return (
    <>
      <HomePageHero />
      <FeaturedPhotos />
      <HomepageGalleriesGrid />
      <CollectionsCTA />
    </>
  );
}
