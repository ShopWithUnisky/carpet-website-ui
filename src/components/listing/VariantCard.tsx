import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Variant } from "@/data/variants";
import { haptic } from "@/lib/haptic";

type VariantCardProps = {
  variant: Variant;
};

export function VariantCard({ variant }: VariantCardProps) {
  const { addItem } = useCart();

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
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={variant.imageUrl}
            alt={variant.name}
            className="size-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold tracking-tight">{variant.name}</h3>
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
