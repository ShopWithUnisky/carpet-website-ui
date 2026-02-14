import { apiCallWithAuth } from "@/apiActions/api-actions";
import { base_url, endpoints } from "@/apiActions/environment";
import { useWishlistStore } from "@/store/wishlist-store";
import type {
  WishlistItem,
  WishlistLineItem,
  GetWishlistResponse,
  WishlistMutationResponse,
} from "@/types/wishlist";

function mapLineToWishlistItem(line: WishlistLineItem): WishlistItem {
  const id = line.product;
  return {
    id,
    variantId: id,
    name: line.nameSnapshot ?? "",
    imageUrl: line.imageSnapshot ?? "",
    price: line.priceAtAdd ?? 0,
  };
}

function mapLinesToItems(lines: WishlistLineItem[]): WishlistItem[] {
  return lines.map(mapLineToWishlistItem);
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
      const raw = response.data?.items ?? [];
      const wishlist = mapLinesToItems(Array.isArray(raw) ? raw : []);
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
    const raw = response.data?.items ?? [];
    if (Array.isArray(raw)) {
      useWishlistStore.setState({ wishlist: mapLinesToItems(raw) });
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
    const raw = response.data?.items ?? [];
    if (Array.isArray(raw)) {
      useWishlistStore.setState({ wishlist: mapLinesToItems(raw) });
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
    const raw = response.data?.items ?? [];
    if (Array.isArray(raw)) {
      useWishlistStore.setState({ wishlist: mapLinesToItems(raw) });
    } else {
      await this.getWishlist();
    }
  }

  public clearWishlistStore(): void {
    useWishlistStore.setState({ wishlist: [] });
  }
}

export const wishlistService = WishlistService.getInstance();
