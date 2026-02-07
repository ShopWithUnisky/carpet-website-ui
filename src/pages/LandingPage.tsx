import { Hero } from "@/components/landing/Hero";
import { ProductShowcase } from "@/components/landing/ProductShowcase";

export function LandingPage() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Craftsmanship you can feel
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We source the finest materials and work with skilled artisans to
              bring you carpets that last. Every piece is chosen for quality,
              comfort, and timeless design.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
