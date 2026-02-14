import { apiCallWithAuth } from "@/apiActions/api-actions";
import { base_url, endpoints } from "@/apiActions/environment";
import { useCartStore } from "@/store/cart-store";
import type {
  CartItem,
  CartLineItem,
  GetCartResponse,
  CartMutationResponse,
} from "@/types/cart";

function mapLineToCartItem(line: CartLineItem): CartItem {
  const id = line.product;
  return {
    id,
    variantId: id,
    name: line.nameSnapshot ?? "",
    imageUrl: line.imageSnapshot ?? "",
    price: line.priceAtAdd ?? 0,
    quantity: line.quantity,
  };
}

function mapLinesToItems(lines: CartLineItem[]): CartItem[] {
  return lines.map(mapLineToCartItem);
}

interface ICartService {
  readonly getCart: () => Promise<void>;
  readonly addItem: (productId: string, quantity: number) => Promise<void>;
  readonly updateItem: (productId: string, quantity: number) => Promise<void>;
  readonly removeItem: (productId: string) => Promise<void>;
  readonly clearCart: () => Promise<void>;
  /** Clear cart from store only (e.g. on logout). */
  readonly clearCartStore: () => void;
}

class CartService implements ICartService {
  private static instance: CartService;

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  public async getCart(): Promise<void> {
    useCartStore.setState({ isLoading: true });
    const url = base_url + endpoints.get_cart;
    try {
      const response = await apiCallWithAuth<
        GetCartResponse,
        undefined,
        undefined
      >("GET", url);
      const raw = response.data?.items ?? [];
      const items = mapLinesToItems(Array.isArray(raw) ? raw : []);
      useCartStore.setState({ items, isLoading: false });
    } catch (error) {
      useCartStore.setState({ isLoading: false });
      throw error;
    }
  }

  public async addItem(productId: string, quantity: number): Promise<void> {
    const url = base_url + endpoints.add_cart;
    const body = { productId, quantity };
    const response = await apiCallWithAuth<
      CartMutationResponse,
      undefined,
      { productId: string; quantity: number }
    >("POST", url, undefined, body);
    const raw = response.data?.items ?? [];
    if (Array.isArray(raw)) {
      useCartStore.setState({ items: mapLinesToItems(raw) });
    } else {
      await this.getCart();
    }
  }

  public async updateItem(productId: string, quantity: number): Promise<void> {
    const url = base_url + endpoints.update_cart;
    const body = { productId, quantity };
    const response = await apiCallWithAuth<
      CartMutationResponse,
      undefined,
      { productId: string; quantity: number }
    >("POST", url, undefined, body);
    const raw = response.data?.items ?? [];
    if (Array.isArray(raw)) {
      useCartStore.setState({ items: mapLinesToItems(raw) });
    } else {
      await this.getCart();
    }
  }

  public async removeItem(productId: string): Promise<void> {
    const url = base_url + endpoints.remove_cart_item.replace(
      ":productId",
      encodeURIComponent(productId)
    );
    const response = await apiCallWithAuth<
      CartMutationResponse,
      undefined,
      undefined
    >("DELETE", url);
    const raw = response.data?.items ?? [];
    if (Array.isArray(raw)) {
      useCartStore.setState({ items: mapLinesToItems(raw) });
    } else {
      await this.getCart();
    }
  }

  public async clearCart(): Promise<void> {
    const url = base_url + endpoints.clear_cart;
    await apiCallWithAuth<CartMutationResponse, undefined, undefined>(
      "POST",
      url
    );
    useCartStore.setState({ items: [] });
  }

  public clearCartStore(): void {
    useCartStore.setState({ items: [] });
  }
}

export const cartService = CartService.getInstance();
