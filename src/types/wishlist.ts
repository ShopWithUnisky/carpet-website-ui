/** UI wishlist item (id/variantId = productId for API) */
export interface WishlistItem {
  id: string;
  variantId: string;
  name: string;
  imageUrl: string;
  price: number;
}

export interface AddWishlistRequest {
  productId: string;
}

/** API wishlist line (snapshots at add time, similar to cart) */
export interface WishlistLineItem {
  product: string;
  nameSnapshot?: string;
  imageSnapshot?: string;
  priceAtAdd?: number;
}

export interface WishlistData {
  _id?: string;
  user?: string;
  items: WishlistLineItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetWishlistResponse {
  success: boolean;
  data?: WishlistData;
}

export interface WishlistMutationResponse {
  success: boolean;
  message?: string;
  data?: WishlistData;
}
