import type { CartItem } from "@/types/cart";
import { create } from "zustand";

interface CartStore {
  cart: CartItem[];
  isLoading: boolean;
}

export const useCartStore = create<CartStore>(() => ({
  cart: [],
  isLoading: false,
}));
