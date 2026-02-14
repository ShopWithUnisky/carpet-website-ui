import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { cartService } from "@/services/cart-service";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types/cart";

export type { CartItem };

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  isLoading: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (user) {
      cartService.getCart().catch(() => {});
    } else {
      cartService.clearCartStore();
    }
  }, [user]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;
      const productId = item.variantId;
      cartService.addItem(productId, qty).catch(() => {});
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    cartService.removeItem(variantId).catch(() => {});
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      cartService.removeItem(variantId).catch(() => {});
      return;
    }
    cartService.updateItem(variantId, quantity).catch(() => {});
  }, []);

  const clearCart = useCallback(() => {
    cartService.clearCart().catch(() => {});
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, isLoading, addItem, removeItem, updateQuantity, clearCart]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
