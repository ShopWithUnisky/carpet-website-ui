import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { wishlistService } from "@/services/wishlist-service";
import { useWishlistStore } from "@/store/wishlist-store";
import type { WishlistItem } from "@/types/wishlist";

export type { WishlistItem };

type WishlistContextValue = {
  items: WishlistItem[];
  isLoading: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (variantId: string) => void;
  isInWishlist: (variantId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const items = useWishlistStore((s) => s.wishlist);
  const isLoading = useWishlistStore((s) => s.isLoading);

  useEffect(() => {
    if (user) {
      wishlistService.getWishlist().catch(() => {});
    } else {
      wishlistService.clearWishlistStore();
    }
  }, [user]);

  const addItem = useCallback((item: WishlistItem) => {
    wishlistService.addItem(item.variantId).catch(() => {});
  }, []);

  const removeItem = useCallback((variantId: string) => {
    wishlistService.removeItem(variantId).catch(() => {});
  }, []);

  const isInWishlist = useCallback(
    (variantId: string) => items.some((i) => i.variantId === variantId),
    [items]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      isLoading,
      addItem,
      removeItem,
      isInWishlist,
    }),
    [items, isLoading, addItem, removeItem, isInWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
