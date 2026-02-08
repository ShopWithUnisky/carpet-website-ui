import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { variants } from "@/data/variants";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { haptic } from "@/lib/haptic";
import { HiHeart } from "react-icons/hi";
import { cn } from "@/lib/utils";

export function VariantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const variant = id ? variants.find((v) => v.id === id) : null;
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    if (variant) addViewed(variant.id);
  }, [variant?.id, addViewed]);

  useDocumentTitle(variant ? `${variant.name} | Carpet Company` : "Product | Carpet Company");

  if (!variant) {
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

  const inWishlist = isInWishlist(variant.id);

  const handleAddToCart = () => {
    haptic();
    addItem({
      id: variant.id,
      variantId: variant.id,
      name: variant.name,
      imageUrl: variant.imageUrl,
      price: variant.price ?? 0,
      quantity: 1,
    });
    toast("Added to cart");
  };

  const handleWishlistToggle = () => {
    haptic();
    if (inWishlist) {
      removeFromWishlist(variant.id);
      toast("Removed from wishlist");
    } else {
      addToWishlist({
        id: variant.id,
        variantId: variant.id,
        name: variant.name,
        imageUrl: variant.imageUrl,
        price: variant.price ?? 0,
      });
      toast("Added to wishlist");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/carpets" className="hover:text-foreground">Carpets</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{variant.name}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <img
            src={variant.imageUrl}
            alt={variant.name}
            className="size-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{variant.name}</h1>
          <p className="mt-4 text-2xl font-medium">
            {variant.price != null ? (
              <>${variant.price}</>
            ) : (
              <span className="text-muted-foreground">Enquire for price</span>
            )}
          </p>
          {variant.description && (
            <p className="mt-4 text-muted-foreground">{variant.description}</p>
          )}
          {variant.tags && variant.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {variant.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={handleAddToCart} size="lg" disabled={variant.price == null}>
              Add to cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlistToggle}
              className={cn(inWishlist && "text-red-500")}
            >
              <HiHeart className={cn("mr-2 size-5", inWishlist && "fill-current")} />
              {inWishlist ? "In wishlist" : "Add to wishlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
