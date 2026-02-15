import { apiCallWithAuth } from "@/apiActions/api-actions";
import { base_url, endpoints } from "@/apiActions/environment";
import { useWishlistStore } from "@/store/wishlist-store";
import type {
  WishlistItem,
  WishlistProduct,
  GetWishlistResponse,
  WishlistMutationResponse,
} from "@/types/wishlist";

function mapProductToWishlistItem(product: WishlistProduct): WishlistItem {
  const id = product._id ?? product.id ?? "";
  return {
    id,
    variantId: id,
    name: product.name ?? "",
    imageUrl: product.images?.[0] ?? "",
    price: product.finalPrice ?? product.price ?? 0,
  };
}

function mapProductsToItems(products: WishlistProduct[]): WishlistItem[] {
  return products.map(mapProductToWishlistItem);
}

interface IWishlistService {
  readonly getWishlist: () => Promise<void>;
  readonly addItem: (productId: string) => Promise<void>;
  readonly toggleItem: (productId: string) => Promise<void>;
  readonly removeItem: (productId: string) => Promise<void>;
  /** Clear wishlist from store only (e.g. on logout). */
  readonly clearWishlistStore: () => void;
}

class WishlistService implements IWishlistService {
  private static instance: WishlistService;

  static getInstance(): WishlistService {
    if (!WishlistService.instance) {
      WishlistService.instance = new WishlistService();
    }
    return WishlistService.instance;
  }

  public async getWishlist(): Promise<void> {
    useWishlistStore.setState({ isLoading: true });
    const url = base_url + endpoints.get_wishlist;
    try {
      const response = await apiCallWithAuth<
        GetWishlistResponse,
        undefined,
        undefined
      >("GET", url);
      const raw = response.data?.products ?? [];
      const wishlist = mapProductsToItems(Array.isArray(raw) ? raw : []);
      useWishlistStore.setState({ wishlist, isLoading: false });
    } catch (error) {
      useWishlistStore.setState({ isLoading: false });
      throw error;
    }
  }

  public async addItem(productId: string): Promise<void> {
    const url = base_url + endpoints.add_wishlist;
    const body = { productId };
    const response = await apiCallWithAuth<
      WishlistMutationResponse,
      undefined,
      { productId: string }
    >("POST", url, undefined, body);
    const raw = response.data?.products ?? [];
    if (Array.isArray(raw)) {
      useWishlistStore.setState({ wishlist: mapProductsToItems(raw) });
    } else {
      await this.getWishlist();
    }
  }

  public async toggleItem(productId: string): Promise<void> {
    const url = base_url + endpoints.toggle_wishlist;
    const body = { productId };
    const response = await apiCallWithAuth<
      WishlistMutationResponse,
      undefined,
      { productId: string }
    >("POST", url, undefined, body);
    const raw = response.data?.products ?? [];
    if (Array.isArray(raw)) {
      useWishlistStore.setState({ wishlist: mapProductsToItems(raw) });
    } else {
      await this.getWishlist();
    }
  }

  public async removeItem(productId: string): Promise<void> {
    const url = base_url + endpoints.remove_wishlist_item.replace(
      ":id",
      encodeURIComponent(productId)
    );
    const response = await apiCallWithAuth<
      WishlistMutationResponse,
      undefined,
      undefined
    >("DELETE", url);
    const raw = response.data?.products ?? [];
    if (Array.isArray(raw)) {
      useWishlistStore.setState({ wishlist: mapProductsToItems(raw) });
    } else {
      await this.getWishlist();
    }
  }

  public clearWishlistStore(): void {
    useWishlistStore.setState({ wishlist: [] });
  }
}

export const wishlistService = WishlistService.getInstance();
