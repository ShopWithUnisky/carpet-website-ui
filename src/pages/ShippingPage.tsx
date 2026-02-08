import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function ShippingPage() {
  useDocumentTitle("Shipping & returns | Carpet Company");
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Shipping & returns</h1>
      <p className="mt-2 text-muted-foreground">
        Delivery and return information.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We ship within the continental US. Delivery times are typically 5–10 business days after your order is confirmed. You’ll receive tracking information by email.
          </p>
          <p>
            Shipping costs are calculated at checkout based on your address and the size of your order.
          </p>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Returns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Unused items in original packaging can be returned within 14 days of delivery. Contact us to start a return. Refunds are processed within 5–10 business days after we receive the item.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
