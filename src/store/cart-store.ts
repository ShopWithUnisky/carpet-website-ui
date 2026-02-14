import type { CartItem } from "@/types/cart";
import { create } from "zustand";

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
}

export const useCartStore = create<CartStore>(() => ({
  items: [],
  isLoading: false,
}));
