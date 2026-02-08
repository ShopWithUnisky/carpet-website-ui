import { useMemo, useState } from "react";
import { variants } from "@/data/variants";
import { VariantCard } from "@/components/listing/VariantCard";
import { RecentlyViewedSection } from "@/components/listing/RecentlyViewedSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { Variant } from "@/data/variants";

const ALL_TAGS = Array.from(
  new Set(variants.flatMap((v) => v.tags ?? []))
).sort();

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export function ListingPage() {
  useDocumentTitle("Carpets | Carpet Company");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("name-asc");

  const filteredAndSorted = useMemo(() => {
    let list: Variant[] = variants;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          (v.description?.toLowerCase().includes(q) ?? false) ||
          (v.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
      );
    }

    if (tagFilter !== "all") {
      list = list.filter((v) => v.tags?.includes(tagFilter));
    }

    const sorted = [...list].sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      const pa = a.price ?? 0;
      const pb = b.price ?? 0;
      if (sort === "price-asc") return pa - pb;
      return pb - pa;
    });

    return sorted;
  }, [search, tagFilter, sort]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <RecentlyViewedSection />
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">All variants</h1>
          <p className="mt-1 text-muted-foreground">
            Browse our full collection of carpets
          </p>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name, description, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {ALL_TAGS.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name A–Z</SelectItem>
            <SelectItem value="name-desc">Name Z–A</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="font-medium">No carpets match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or clear filters.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setTagFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((variant) => (
            <VariantCard key={variant.id} variant={variant} />
          ))}
        </div>
      )}
    </div>
  );
}
