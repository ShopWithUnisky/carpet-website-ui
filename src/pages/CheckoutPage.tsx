import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAuthStore } from "@/store/auth-store";
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
import { formatRupees } from "@/lib/utils";
import { getProfileAddresses } from "@/lib/profileAddress";
import { addOrder } from "@/lib/orders";
import type { SavedAddress } from "@/lib/profileAddress";
import { Mail, Phone, MapPin, ShoppingBag, ShieldCheck } from "lucide-react";

const DEFAULT_COUNTRY = "India";

export function CheckoutPage() {
  useDocumentTitle("Checkout | Carpet Company");
  const { items, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const userProfile = useAuthStore((s) => s.userProfile);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    email: user?.email ?? "",
    phone: "",
  });
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: DEFAULT_COUNTRY,
  });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const hasAppliedProfileRef = useRef(false);

  // Sync email and name from user / userProfile
  useEffect(() => {
    const email = user?.email ?? "";
    const name = user?.displayName ?? userProfile?.name ?? "";
    if (email) setContact((c) => ({ ...c, email }));
    if (name) setShipping((s) => ({ ...s, fullName: name }));
  }, [user?.email, user?.displayName, userProfile?.name]);

  // Sync phone from userProfile
  useEffect(() => {
    if (userProfile?.phoneNumber)
      setContact((c) => ({ ...c, phone: userProfile.phoneNumber ?? c.phone }));
  }, [userProfile?.phoneNumber]);

  // Load saved addresses and pre-fill from first saved address or profile address
  useEffect(() => {
    if (!user?.uid) {
      setSavedAddresses([]);
      setSelectedAddressId("");
      return;
    }
    const addresses = getProfileAddresses(user.uid);
    setSavedAddresses(addresses);

    if (addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
      const first = addresses[0];
      setShipping((s) => ({
        ...s,
        fullName: user?.displayName ?? userProfile?.name ?? s.fullName,
        address: first.address,
        address2: first.address2 ?? "",
        city: first.city ?? "",
        state: first.state ?? "",
        zip: first.zip ?? "",
        country: first.country ?? DEFAULT_COUNTRY,
      }));
    } else if (userProfile?.address && !hasAppliedProfileRef.current) {
      hasAppliedProfileRef.current = true;
      const a = userProfile.address;
      setShipping((s) => ({
        ...s,
        address: a.addressLine ?? "",
        city: a.city ?? "",
        state: a.state ?? "",
        zip: a.pincode ?? "",
        country: a.country ?? DEFAULT_COUNTRY,
      }));
    }
  }, [user?.uid, userProfile?.address]);

  const applySavedAddress = (addr: SavedAddress) => {
    setShipping((s) => ({
      ...s,
      address: addr.address,
      address2: addr.address2 ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      zip: addr.zip ?? "",
      country: addr.country ?? DEFAULT_COUNTRY,
      fullName: user?.displayName ?? userProfile?.name ?? s.fullName,
    }));
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add items from the collection to checkout.
        </p>
        <Button asChild className="mt-6" size="lg">
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
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your details and complete your order
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Contact & Shipping */}
          <div className="space-y-6 lg:col-span-3">
            {/* Step 1: Contact */}
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    1
                  </span>
                  <CardTitle className="text-lg">Contact information</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  We’ll use this for order updates and receipts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="checkout-email" className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4" />
                    Email
                  </Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    placeholder="you@example.com"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                    className="h-10"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-phone" className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" />
                    Phone (optional)
                  </Label>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
                    className="h-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Shipping */}
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    2
                  </span>
                  <CardTitle className="text-lg">Shipping address</CardTitle>
                </div>
                <CardDescription className="mt-1 flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedAddresses.length > 0 && (
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground">Ship to saved address</Label>
                    <Select
                      value={selectedAddressId || "none"}
                      onValueChange={(value) => {
                        setSelectedAddressId(value === "none" ? "" : value);
                        const addr = savedAddresses.find((a) => a.id === value);
                        if (addr) applySavedAddress(addr);
                      }}
                    >
                      <SelectTrigger className="h-10 w-full">
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
                    placeholder="Your name"
                    value={shipping.fullName}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, fullName: e.target.value }))
                    }
                    className="h-10"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-address">Address line 1</Label>
                  <Input
                    id="checkout-address"
                    placeholder="Street address"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, address: e.target.value }))
                    }
                    className="h-10"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-address2">
                    Address line 2 (optional)
                  </Label>
                  <Input
                    id="checkout-address2"
                    placeholder="Apartment, building, etc."
                    value={shipping.address2}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, address2: e.target.value }))
                    }
                    className="h-10"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="checkout-city">City</Label>
                    <Input
                      id="checkout-city"
                      placeholder="e.g. Mumbai"
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, city: e.target.value }))
                      }
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="checkout-state">State</Label>
                    <Input
                      id="checkout-state"
                      placeholder="e.g. Maharashtra"
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, state: e.target.value }))
                      }
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="checkout-zip">Pincode</Label>
                    <Input
                      id="checkout-zip"
                      placeholder="e.g. 400001"
                      value={shipping.zip}
                      onChange={(e) =>
                        setShipping((s) => ({ ...s, zip: e.target.value }))
                      }
                      className="h-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkout-country">Country</Label>
                  <Input
                    id="checkout-country"
                    placeholder="India"
                    value={shipping.country}
                    onChange={(e) =>
                      setShipping((s) => ({ ...s, country: e.target.value }))
                    }
                    className="h-10"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Order summary (sticky on desktop) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <Card className="border-border/80 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ShoppingBag className="size-5 text-muted-foreground" />
                      Order summary
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs" asChild>
                      <Link to="/cart">Edit cart</Link>
                    </Button>
                  </div>
                  <CardDescription>
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <li
                        key={item.variantId}
                        className="flex gap-3 text-sm"
                      >
                        <div className="size-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-tight">{item.name}</p>
                          <p className="mt-0.5 text-muted-foreground">
                            Qty {item.quantity} × {formatRupees(item.price)}
                          </p>
                          <p className="mt-1 font-medium">
                            {formatRupees(item.price * item.quantity)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatRupees(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-xs">At confirmation</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax</span>
                      <span className="text-xs">As applicable</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatRupees(subtotal)}</span>
                  </div>
                  <Button type="submit" className="h-11 w-full" size="lg">
                    Place order
                  </Button>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    <span>Secure checkout</span>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    By placing your order you agree to our terms and conditions.
                  </p>
                </CardContent>
              </Card>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link to="/cart">Back to cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
