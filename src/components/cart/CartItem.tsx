import { Button } from "@/components/ui/button";
import { useCart, type CartItem as CartItemType } from "@/context/CartContext";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="size-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            ${item.price.toFixed(2)} each
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            −
          </Button>
          <span className="min-w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
          >
            +
          </Button>
        </div>
        <p className="w-20 text-right font-medium">
          ${lineTotal.toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(item.variantId)}
        >
          ×
        </Button>
      </div>
    </div>
  );
}
