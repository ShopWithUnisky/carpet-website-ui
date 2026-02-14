import type { WishlistItem } from "@/types/wishlist";
import { create } from "zustand";

interface WishlistStore {
  wishlist: WishlistItem[];
  isLoading: boolean;
}

export const useWishlistStore = create<WishlistStore>(() => ({
  wishlist: [],
  isLoading: false,
}));
