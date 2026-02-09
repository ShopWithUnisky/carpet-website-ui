import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
import { getOrders, type SavedOrder } from "@/lib/orders";
import { ChevronDown, ChevronUp } from "lucide-react";

export function HistoryTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setOrders([]);
      return;
    }
    setOrders(getOrders(user.uid));
  }, [user?.uid]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order history</CardTitle>
          <CardDescription>
            Sign in to see your order history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Sign in for order history</EmptyTitle>
              <EmptyDescription>
                Your orders will appear here once you’re signed in.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order history</CardTitle>
          <CardDescription>
            View and track your past orders
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>
              </EmptyMedia>
              <EmptyTitle>No order history</EmptyTitle>
              <EmptyDescription>
                Your orders will appear here once you place them.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" asChild>
                <Link to="/carpets">Browse carpets</Link>
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
        <CardTitle>Order history</CardTitle>
        <CardDescription>
          View and track your past orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order.id}>
              <Card>
                <button
                  type="button"
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg"
                  onClick={() =>
                    setOpenId((id) => (id === order.id ? null : order.id))
                  }
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""} · $
                      {order.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {openId === order.id ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </button>
                {openId === order.id && (
                  <CardContent className="pt-0 border-t">
                    <ul className="space-y-3 py-3">
                      {order.items.map((item) => (
                        <li
                          key={item.variantId}
                          className="flex gap-3 text-sm"
                        >
                          <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
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
                    <p className="text-sm font-medium text-right">
                      Total ${order.subtotal.toFixed(2)}
                    </p>
                  </CardContent>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
