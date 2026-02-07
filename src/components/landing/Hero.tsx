import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { landingImages, getLandingImageUrl } from "@/config/landingImages";

export function Hero() {
  const heroImages = [...landingImages.hero];

  if (heroImages.length === 0) {
    return (
      <section className="relative flex min-h-[70vh] items-center justify-center bg-muted">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Premium Carpets
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Add hero images to public/landing/ and update landingImages.hero in
            src/config/landingImages.ts
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link to="/carpets">Explore collection</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <Carousel className="size-full" opts={{ loop: true }}>
        <CarouselContent className="ml-0">
          {heroImages.map((filename) => (
            <CarouselItem key={filename} className="pl-0">
              <div className="relative aspect-[21/9] w-full min-h-[70vh] bg-muted">
                <img
                  src={getLandingImageUrl(filename)}
                  alt=""
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="container mx-auto max-w-7xl px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow md:text-5xl lg:text-6xl">
                      Premium Carpets
                    </h1>
                    <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
                      Crafted for comfort and style. Discover our collection.
                    </p>
                    <Button asChild className="mt-8" size="lg">
                      <Link to="/carpets">Explore collection</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 border-white/80 text-white hover:bg-white/20 hover:text-white" />
        <CarouselNext className="right-4 border-white/80 text-white hover:bg-white/20 hover:text-white" />
      </Carousel>
    </section>
  );
}
