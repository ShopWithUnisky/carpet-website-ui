import { Link } from "react-router-dom";
import { useProductStore } from "@/store/product-store";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { formatRupees } from "@/lib/utils";
import type { Product } from "@/types/product";

function findProduct(products: Product[], idOrSlug: string): Product | undefined {
  return products.find(
    (p) => p.id === idOrSlug || p._id === idOrSlug || p.slug === idOrSlug
  );
}

export function RecentlyViewedSection() {
  const { variantIds } = useRecentlyViewed();
  const products = useProductStore((state) => state.products);

  const recent = variantIds
    .map((id) => findProduct(products, id))
    .filter((p): p is Product => p != null);

  if (recent.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold tracking-tight">Recently viewed</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick up where you left off
      </p>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {recent.map((p) => {
          const productId = p.id ?? p._id;
          const linkTo = `/carpets/${productId}`;
          const imageUrl = p.images?.[0] ?? "";
          const price = p.finalPrice ?? p.price ?? 0;
          return (
            <Link
              key={productId}
              to={linkTo}
              className="flex w-40 shrink-0 flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={p.name}
                  className="size-full min-h-0 min-w-0 object-cover object-center"
                />
              </div>
              <div className="p-2">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {price > 0 ? formatRupees(price) : "Enquire"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
