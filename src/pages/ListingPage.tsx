import { RecentlyViewedSection } from "@/components/listing/RecentlyViewedSection";
import { ProductCard } from "@/components/listing/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { productService } from "@/services/product-service";
import { useProductStore } from "@/store/product-store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const PAGE_SIZE = 12;

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const SORT_PARAM_MAP: Record<SortOption, string> = {
  "name-asc": "name",
  "name-desc": "-name",
  "price-asc": "price",
  "price-desc": "-price",
};

export function ListingPage() {
  useDocumentTitle("Carpets | Carpet Company");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [material, setMaterial] = useState<string>("all");
  const [color, setColor] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [page, setPage] = useState(1);

  const carpets = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const meta = useProductStore((state) => state.meta);

  const filterParams = useMemo(() => {
    const params: Parameters<typeof productService.getAllProducts>[0] = {
      page,
      limit: PAGE_SIZE,
      search: search.trim() || undefined,
      sort: SORT_PARAM_MAP[sort],
    };
    if (category !== "all") params.category = category;
    if (material !== "all") params.material = material;
    if (color !== "all") params.color = color;
    return params;
  }, [page, search, category, material, color, sort]);

  const fetchProducts = useCallback(async () => {
    await productService.getAllProducts(filterParams);
  }, [filterParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const filterOptions = useMemo(() => {
    const categories = Array.from(
      new Set(carpets.map((p) => p.category).filter(Boolean))
    ).sort();
    const materials = Array.from(
      new Set(carpets.map((p) => p.material).filter(Boolean))
    ).sort();
    const colors = Array.from(
      new Set(carpets.map((p) => p.color).filter(Boolean))
    ).sort();
    return { categories, materials, colors };
  }, [carpets]);

  const totalPages = meta?.pages ?? 1;
  const total = meta?.total ?? 0;
  const from =
    total === 0 || !meta
      ? 0
      : (meta.page - 1) * meta.limit + 1;
  const to =
    total === 0 || !meta ? 0 : Math.min(meta.page * meta.limit, total);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <RecentlyViewedSection />
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            All variants
          </h1>
          <p className="mt-1 text-muted-foreground">
            Browse our full collection of carpets
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap"
      >
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <Input
            placeholder="Search by name, description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </div>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {filterOptions.categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={material}
          onValueChange={(v) => {
            setMaterial(v);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All materials</SelectItem>
            {filterOptions.materials.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={color}
          onValueChange={(v) => {
            setColor(v);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All colors</SelectItem>
            {filterOptions.colors.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
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
      </form>

      {isLoading ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">Loading carpets...</p>
        </div>
      ) : carpets.length === 0 ? (
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
              setSearchInput("");
              setCategory("all");
              setMaterial("all");
              setColor("all");
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {carpets.map((product) => (
              <ProductCard key={product.id ?? product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                Showing {from}–{to} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoading}
                  aria-label="Previous page"
                >
                  <HiChevronLeft className="size-5" />
                </Button>
                <span className="min-w-32 text-center text-sm">
                  Page {meta?.page ?? 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                  aria-label="Next page"
                >
                  <HiChevronRight className="size-5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
