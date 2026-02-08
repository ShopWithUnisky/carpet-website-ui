import { Link } from "react-router-dom";
import { variants, type Variant } from "@/data/variants";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

export function RecentlyViewedSection() {
  const { variantIds } = useRecentlyViewed();
  const recent = variantIds
    .map((id) => variants.find((v) => v.id === id))
    .filter((v): v is Variant => v != null);

  if (recent.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold tracking-tight">Recently viewed</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick up where you left off
      </p>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {recent.map((v) => (
          <Link
            key={v.id}
            to={`/carpets/${v.id}`}
            className="flex w-40 shrink-0 flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
          >
            <div className="aspect-[4/3] bg-muted">
              <img
                src={v.imageUrl}
                alt={v.name}
                className="size-full object-cover"
              />
            </div>
            <div className="p-2">
              <p className="truncate text-sm font-medium">{v.name}</p>
              <p className="text-xs text-muted-foreground">
                {v.price != null ? `$${v.price}` : "Enquire"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
