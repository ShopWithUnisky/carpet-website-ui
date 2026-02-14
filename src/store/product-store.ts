import type { Pagination, Product } from "@/types/product";
import { create } from "zustand";

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  meta: Pagination | null;
}

export const useProductStore = create<ProductStore>(() => ({
  products: [],
  isLoading: false,
  meta: null,
}));
