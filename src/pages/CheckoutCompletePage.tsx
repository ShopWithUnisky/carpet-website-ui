import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function CheckoutCompletePage() {
  useDocumentTitle("Order confirmed | Carpet Company");
  const location = useLocation();
  const fromCheckout = location.state?.orderPlaced === true;

  if (!fromCheckout) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">No order found</h1>
        <p className="mt-2 text-muted-foreground">
          Complete a checkout to see your confirmation here.
        </p>
        <Button asChild className="mt-6">
          <Link to="/carpets">Browse carpets</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-semibold">Thank you for your order</h1>
      <p className="mt-2 text-muted-foreground">
        We’ve received your order and will send confirmation and updates to your email.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link to="/carpets">Continue shopping</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
