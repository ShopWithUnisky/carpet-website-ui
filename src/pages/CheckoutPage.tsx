import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/context/ToastContext";
import { haptic } from "@/lib/haptic";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getProfileAddresses } from "@/lib/profileAddress";
import { addOrder } from "@/lib/orders";
import type { SavedAddress } from "@/lib/profileAddress";

export function CheckoutPage() {
  useDocumentTitle("Checkout | Carpet Company");
  const { items, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    email: user?.email ?? "",
    phone: "",
  });
  const [shipping, setShipping] = useState({
    fullName: user?.displayName ?? "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  useEffect(() => {
    if (user?.email) setContact((c) => ({ ...c, email: user.email ?? c.email }));
    if (user?.displayName) setShipping((s) => ({ ...s, fullName: user.displayName ?? s.fullName }));
  }, [user?.email, user?.displayName]);

  useEffect(() => {
    if (!user?.uid) {
      setSavedAddresses([]);
      setSelectedAddressId("");
      return;
    }
    setSavedAddresses(getProfileAddresses(user.uid));
  }, [user?.uid]);

  const applySavedAddress = (addr: SavedAddress) => {
    setShipping((s) => ({
      ...s,
      address: addr.address,
      address2: addr.address2 ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      zip: addr.zip ?? "",
      country: addr.country ?? "United States",
      fullName: user?.displayName ?? s.fullName,
    }));
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add items from the collection to checkout.
        </p>
        <Button asChild className="mt-6">
          <Link to="/carpets">Browse carpets</Link>
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    haptic();
    if (user?.uid) {
      addOrder(user.uid, {
        items: items.map((i) => ({
          variantId: i.variantId,
          name: i.name,
          imageUrl: i.imageUrl,
          price: i.price,
          quantity: i.quantity,
        })),
        subtotal,
      });
    }
    clearCart();
    toast("Order placed successfully");
    navigate("/checkout/complete", { state: { orderPlaced: true } });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your details below to complete your order
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Contact & Shipping */}
          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Contact information</CardTitle>
                <CardDescription>
                  We’ll use this to send order updates and receipts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    placeholder="you@example.com"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-phone">Phone (optional)</Label>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping address</CardTitle>
                <CardDescription>
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedAddresses.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Ship to saved address</Label>
                    <Select
                      value={selectedAddressId || "none"}
                      onValueChange={(value) => {
                        setSelectedAddressId(value === "none" ? "" : value);
                        const addr = savedAddresses.find((a) => a.id === value);
                        if (addr) applySavedAddress(addr);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose an address" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Enter manually</SelectItem>
                        {savedAddresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            {addr.name} — {addr.address}
                            {addr.city || addr.state || addr.zip
                              ? `, ${[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="checkout-name">Full name</Label>
                  <Input
                    id="checkout-name"
                    placeholder="Jane Doe"
                    value={shipping.fullName}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, fullName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-address">Address</Label>
                  <Input
                    id="checkout-address"
                    placeholder="123 Main St"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, address: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-address2">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    id="checkout-address2"
                    placeholder="Apt 4"
                    value={shipping.address2}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, address2: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="checkout-city">City</Label>
                    <Input
                      id="checkout-city"
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, city: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="checkout-state">State / Province</Label>
                    <Input
                      id="checkout-state"
                      placeholder="CA"
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, state: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="checkout-zip">ZIP / Postal code</Label>
                    <Input
                      id="checkout-zip"
                      placeholder="94103"
                      value={shipping.zip}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, zip: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-country">Country</Label>
                  <Input
                    id="checkout-country"
                    value={shipping.country}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, country: e.target.value }))
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Order summary (sticky on desktop) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                  <CardDescription>
                    {totalItems} {totalItems === 1 ? "item" : "items"} in your
                    order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="max-h-64 space-y-3 overflow-y-auto">
                    {items.map((item) => (
                      <li
                        key={item.variantId}
                        className="flex gap-3 text-sm"
                      >
                        <div className="size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-muted-foreground">
                            Qty {item.quantity} · $
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Calculated at next step</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span>Calculated at next step</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Place order
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    By placing your order you agree to our terms and conditions.
                  </p>
                </CardContent>
              </Card>
              <Button variant="ghost" className="mt-4 w-full" asChild>
                <Link to="/cart">Back to cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
