import { variants } from "@/data/variants";
import { VariantCard } from "@/components/listing/VariantCard";

export function ListingPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">All variants</h1>
        <p className="mt-1 text-muted-foreground">
          Browse our full collection of carpets
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant) => (
          <VariantCard key={variant.id} variant={variant} />
        ))}
      </div>
    </div>
  );
}
