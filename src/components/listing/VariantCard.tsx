import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import type { Variant } from "@/data/variants";
import { haptic } from "@/lib/haptic";
import { HiHeart } from "react-icons/hi";
import { cn } from "@/lib/utils";

type VariantCardProps = {
  variant: Variant;
};

export function VariantCard({ variant }: VariantCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = isInWishlist(variant.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="relative p-0">
        <Link to={`/carpets/${variant.id}`} className="block">
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
            src={variant.imageUrl}
            alt={variant.name}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
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
        <Link to={`/carpets/${variant.id}`} className="block hover:underline">
          <h3 className="font-semibold tracking-tight">{variant.name}</h3>
        </Link>
        {variant.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {variant.description}
          </p>
        )}
        <p className="mt-2 font-medium">
          {variant.price != null ? (
            <>${variant.price}</>
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
