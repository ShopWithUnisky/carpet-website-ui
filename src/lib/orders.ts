const ORDERS_KEY_PREFIX = "profile_orders_";

export type OrderItem = {
  variantId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

export type SavedOrder = {
  id: string;
  createdAt: string; // ISO
  items: OrderItem[];
  subtotal: number;
  status: "confirmed";
};

function storageKey(uid: string): string {
  return `${ORDERS_KEY_PREFIX}${uid}`;
}

function parseOrders(raw: string | null): SavedOrder[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown): item is SavedOrder =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "createdAt" in item &&
        "items" in item &&
        "subtotal" in item
    );
  } catch {
    return [];
  }
}

export function getOrders(uid: string): SavedOrder[] {
  return parseOrders(localStorage.getItem(storageKey(uid)));
}

export function addOrder(
  uid: string,
  data: Omit<SavedOrder, "id" | "createdAt" | "status">
): SavedOrder {
  const list = getOrders(uid);
  const order: SavedOrder = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };
  list.unshift(order);
  localStorage.setItem(storageKey(uid), JSON.stringify(list));
  return order;
}
