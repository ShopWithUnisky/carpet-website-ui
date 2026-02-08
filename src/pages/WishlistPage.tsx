import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { haptic } from "@/lib/haptic";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function WishlistPage() {
  useDocumentTitle("Wishlist | Carpet Company");
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: (typeof items)[0]) => {
    haptic();
    addItem({
      id: item.variantId,
      variantId: item.variantId,
      name: item.name,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
    });
    removeItem(item.variantId);
    toast("Added to cart");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </EmptyMedia>
            <EmptyTitle>Your wishlist is empty</EmptyTitle>
            <EmptyDescription>
              Move items from your cart to the wishlist, or add items from the collection.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/carpets">Browse carpets</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>
      <p className="mt-1 text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.variantId}
            className="flex gap-4 rounded-lg border bg-card p-4"
          >
            <div className="size-20 shrink-0 overflow-hidden rounded-md bg-muted">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="size-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                ${item.price.toFixed(2)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => handleAddToCart(item)}>
                  Add to cart
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    haptic();
                    removeItem(item.variantId);
                    toast("Removed from wishlist");
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
