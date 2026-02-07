import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { landingImages, getLandingImageUrl } from "@/config/landingImages";

export function ProductShowcase() {
  const products = [...landingImages.products];

  if (products.length === 0) {
    return (
      <section className="border-t bg-background py-20">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Featured collection
          </h2>
          <p className="mt-2 text-muted-foreground">
            Add product images to public/landing/ and update
            landingImages.products in src/config/landingImages.ts
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/carpets">View all carpets</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t bg-background py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Featured collection
            </h2>
            <p className="mt-1 text-muted-foreground">
              A selection of our finest carpets
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/carpets">View all</Link>
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((filename) => (
            <Link
              key={filename}
              to="/carpets"
              className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] bg-muted">
                <img
                  src={getLandingImageUrl(filename)}
                  alt=""
                  className="size-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
