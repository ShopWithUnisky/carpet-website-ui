import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import {
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  type SavedPaymentMethod,
} from "@/lib/paymentMethods";
import { CreditCard, Trash2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { haptic } from "@/lib/haptic";

export function PaymentMethodsTab() {
  const { toast } = useToast();
  const [methods, setMethods] = useState<SavedPaymentMethod[]>([]);
  const [adding, setAdding] = useState(false);

  const refresh = () => setMethods(getPaymentMethods());

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = () => {
    haptic();
    setAdding(true);
    addPaymentMethod({
      label: "Visa •••• 4242",
      last4: "4242",
      brand: "Visa",
    });
    refresh();
    setAdding(false);
    toast("Payment method added (demo)");
  };

  const handleRemove = (id: string) => {
    haptic();
    removePaymentMethod(id);
    refresh();
    toast("Payment method removed");
  };

  if (methods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment methods</CardTitle>
          <CardDescription>
            Add or remove cards for checkout (demo only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CreditCard className="size-10 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>No payment methods</EmptyTitle>
              <EmptyDescription>
                Add a card to speed up checkout. This is a demo — no real charges.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={handleAdd} disabled={adding}>
                Add payment method
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment methods</CardTitle>
        <CardDescription>
          Add or remove cards (demo only — no real charges)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {methods.map((m) => (
            <li key={m.id}>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-muted-foreground" />
                  <span className="font-medium">{m.brand} •••• {m.last4}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemove(m.id)}
                  aria-label="Remove"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" onClick={handleAdd} disabled={adding}>
          Add payment method
        </Button>
      </CardContent>
    </Card>
  );
}
