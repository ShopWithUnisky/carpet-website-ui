import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WishlistItem = {
  id: string;
  variantId: string;
  name: string;
  imageUrl: string;
  price: number;
};

type WishlistContextValue = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (variantId: string) => void;
  isInWishlist: (variantId: string) => boolean;
};

const WISHLIST_STORAGE_KEY = "carpet-wishlist";

function loadWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(loadWishlist);

  const addItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.variantId === item.variantId)) return prev;
      const next = [...prev, item];
      saveWishlist(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.variantId !== variantId);
      saveWishlist(next);
      return next;
    });
  }, []);

  const isInWishlist = useCallback(
    (variantId: string) => items.some((i) => i.variantId === variantId),
    [items]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ items, addItem, removeItem, isInWishlist }),
    [items, addItem, removeItem, isInWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
