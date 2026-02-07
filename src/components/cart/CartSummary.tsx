import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type CartSummaryProps = {
  subtotal: number;
};

export function CartSummary({ subtotal }: CartSummaryProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold">Summary</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tax and shipping calculated at checkout.
      </p>
      <p className="mt-4 flex justify-between text-lg font-medium">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </p>
      <Button className="mt-6 w-full" size="lg" asChild>
        <Link to="/auth">Proceed to checkout</Link>
      </Button>
    </div>
  );
}
