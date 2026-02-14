import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/types/product";
import { haptic } from "@/lib/haptic";
import { HiHeart } from "react-icons/hi";
import { cn, formatRupees } from "@/lib/utils";
import { useState, useCallback, useRef } from "react";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const productId = product.id ?? product._id;
  const inWishlist = isInWishlist(productId);
  const images = product.images?.length ? product.images : [""];
  const [currentIndex, setCurrentIndex] = useState(0);
  const price = product.finalPrice ?? product.price ?? 0;
  const imageUrl = images[0] ?? ""; // primary image for cart/wishlist

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic();
    addItem({
      id: productId,
      variantId: productId,
      name: product.name,
      imageUrl,
      price,
      quantity: 1,
    });
    toast("Added to cart");
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    haptic();
    if (inWishlist) {
      removeFromWishlist(productId);
      toast("Removed from wishlist");
    } else {
      addToWishlist({
        id: productId,
        variantId: productId,
        name: product.name,
        imageUrl,
        price,
      });
      toast("Added to wishlist");
    }
  };

  const linkTo = `/carpets/${productId}`;
  const hasMultipleImages = images.length > 1;

  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = useCallback(() => {
    if (!hasMultipleImages) return;
    cycleRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);
  }, [hasMultipleImages, images.length]);

  const stopCycle = useCallback(() => {
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
  }, []);

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="relative p-0">
        <Link to={linkTo} className="block">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden bg-muted"
            onMouseEnter={startCycle}
            onMouseLeave={stopCycle}
          >
            {images.map((src, i) => (
              <img
                key={src || i}
                src={src}
                alt={product.name}
                className={cn(
                  "absolute inset-0 size-full min-h-0 min-w-0 object-cover object-center transition-transform duration-300 group-hover:scale-105",
                  i === currentIndex
                    ? "z-0 opacity-100"
                    : "z-0 opacity-0 pointer-events-none"
                )}
              />
            ))}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1">
                {images.map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
                    aria-label={`View image ${i + 1}`}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      i === currentIndex
                        ? "bg-primary"
                        : "bg-background/60 hover:bg-background/80"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={cn(
            "absolute right-2 top-2 flex size-9 items-center justify-center rounded-full border bg-background/80 shadow-sm transition-colors hover:bg-background",
            inWishlist ? "text-red-500" : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HiHeart className={cn("size-5", inWishlist && "fill-current")} />
        </button>
      </CardHeader>
      <CardContent className="p-4">
        <Link to={linkTo} className="block hover:underline">
          <h3 className="font-semibold tracking-tight">{product.name}</h3>
        </Link>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
        <p className="mt-2 font-medium">
          {price > 0 ? (
            <>{formatRupees(price)}</>
          ) : (
            <span className="text-muted-foreground">Enquire</span>
          )}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} size="sm">
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
