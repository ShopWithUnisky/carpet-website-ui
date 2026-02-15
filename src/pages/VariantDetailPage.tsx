import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useProductStore } from "@/store/product-store";
import { productService } from "@/services/product-service";
import type { Product } from "@/types/product";
import { haptic } from "@/lib/haptic";
import { HiChevronDown } from "react-icons/hi";
import { cn, formatRupees } from "@/lib/utils";

function findProduct(products: Product[], idOrSlug: string): Product | undefined {
  return products.find(
    (p) =>
      p.id === idOrSlug ||
      p._id === idOrSlug ||
      p.slug === idOrSlug
  );
}

export function VariantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [fetchError, setFetchError] = useState(false);

  const product = id ? (findProduct(products, id) ?? detailProduct) : null;

  const { addItem } = useCart();
  const { toast } = useToast();
  const { addViewed } = useRecentlyViewed();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);

  const productId = product?.id ?? product?._id ?? "";
  const images = product?.images?.length ? product.images : [];
  const mainImage = images[selectedImageIndex] ?? images[0] ?? "";

  useEffect(() => {
    if (!id) return;
    const inStore = findProduct(products, id);
    if (inStore) {
      setDetailProduct(null);
      setFetchError(false);
      return;
    }
    setFetchError(false);
    setDetailProduct(null);
    productService
      .getProductById(id)
      .then((p) => {
        setDetailProduct(p);
        setFetchError(false);
      })
      .catch(() => {
        setDetailProduct(null);
        setFetchError(true);
      });
  }, [id, products]);

  useEffect(() => {
    if (productId) addViewed(productId);
  }, [productId, addViewed]);

  useEffect(() => {
    if (product) setSelectedImageIndex(0);
  }, [product?.id ?? product?._id]);

  useDocumentTitle(product ? `${product.name} | Carpet Company` : "Product | Carpet Company");

  if (!id) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Invalid link</h1>
        <Button asChild className="mt-6">
          <Link to="/carpets">Browse all carpets</Link>
        </Button>
      </div>
    );
  }

  if (isLoading && !product) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-muted" />
          <div className="space-y-4">
            <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || fetchError) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">
          The carpet you’re looking for doesn’t exist or has been removed.
        </p>
        <Button asChild className="mt-6">
          <Link to="/carpets">Browse all carpets</Link>
        </Button>
      </div>
    );
  }

  const price = product.finalPrice ?? product.price ?? 0;

  const handleAddToCart = () => {
    haptic();
    addItem({
      id: productId,
      variantId: productId,
      name: product.name,
      imageUrl: product.images?.[0] ?? "",
      price,
      quantity: 1,
    });
    toast("Added to cart");
  };

  const handleBuyNow = () => {
    haptic();
    addItem({
      id: productId,
      variantId: productId,
      name: product.name,
      imageUrl: product.images?.[0] ?? "",
      price,
      quantity: 1,
    });
    toast("Added to cart");
    navigate("/checkout");
  };

  const specs = [
    product.category && { label: "Category", value: product.category },
    product.material && { label: "Material", value: product.material },
    product.color && { label: "Color", value: product.color },
    product.size && { label: "Size", value: product.size },
    product.pattern && { label: "Pattern", value: product.pattern },
    product.shape && { label: "Shape", value: product.shape },
    product.weaveType && { label: "Weave type", value: product.weaveType },
    product.countryOfOrigin && { label: "Origin", value: product.countryOfOrigin },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/carpets" className="hover:text-foreground">
          Carpets
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={mainImage}
              alt={product.name}
              className="size-full min-h-0 min-w-0 object-cover object-center"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  type="button"
                  key={src || i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    "aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors",
                    i === selectedImageIndex
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                >
                  <img
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    className="size-full min-h-0 min-w-0 object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:py-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>
          {product.sku && (
            <p className="mt-1.5 text-sm text-muted-foreground">SKU: {product.sku}</p>
          )}

          <div className="mt-6 flex flex-wrap items-baseline gap-3 border-b border-border pb-6">
            {price > 0 ? (
              <>
                <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                  {formatRupees(price)}
                </span>
                {product.mrp > 0 && product.discountPercentage > 0 && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatRupees(product.mrp)}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-sm font-semibold text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400">
                    {product.discountPercentage}% off
                  </span>
                )}
              </>
            ) : (
              <span className="text-xl text-muted-foreground">Enquire for price</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 py-4">
            <Button
              onClick={handleBuyNow}
              size="lg"
              className="min-w-[140px] bg-primary font-semibold shadow-md hover:bg-primary/90"
              disabled={price <= 0 || !product.inStock}
            >
              Buy now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddToCart}
              disabled={price <= 0 || !product.inStock}
            >
              Add to cart
            </Button>
          </div>

          {product.description && (
            <div className="mt-6">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {specs.length > 0 && (
            <>
              {/* Mobile: accordion */}
              <div className="mt-8 block border-b border-border md:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setSpecsOpen((o) => !o);
                    haptic();
                  }}
                  className="flex w-full items-center justify-between py-3 text-left"
                  aria-expanded={specsOpen}
                >
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Specifications
                  </span>
                  <HiChevronDown
                    className={cn("size-5 shrink-0 text-muted-foreground transition-transform", specsOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>
                {specsOpen && (
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-3 pb-4">
                    {specs.map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex flex-col border-b border-border/60 pb-2 last:border-0"
                      >
                        <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium capitalize text-foreground">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              {/* Desktop: always visible */}
              <div className="mt-8 hidden md:block">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Specifications
                </p>
                <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {specs.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col border-b border-border/60 pb-2 last:border-0 sm:last:border-b sm:last:pb-2"
                    >
                      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium capitalize text-foreground">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </>
          )}

          {product.roomType?.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Room type
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.roomType.map((room) => (
                  <span
                    key={room}
                    className="rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-foreground"
                  >
                    {room}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.careInstructions && (
            <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Care instructions
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {product.careInstructions}
              </p>
            </div>
          )}

          {!product.inStock && (
            <p className="mt-6 text-sm font-medium text-amber-600 dark:text-amber-500">
              Currently out of stock
            </p>
          )}

          {/* Sticky action bar on mobile: same buttons so they're always visible when scrolling */}
          <div className="sticky bottom-0 left-0 right-0 z-10 mt-8 flex flex-wrap gap-3 border-t border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
            <Button
              onClick={handleBuyNow}
              size="lg"
              className="flex-1 font-semibold shadow-md"
              disabled={price <= 0 || !product.inStock}
            >
              Buy now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={price <= 0 || !product.inStock}
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
