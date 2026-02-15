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

/** Product as returned in wishlist API (full or minimal) */
export interface WishlistProduct {
  _id: string;
  id?: string;
  name?: string;
  images?: string[];
  finalPrice?: number;
  price?: number;
}

export interface WishlistData {
  _id?: string;
  user?: string;
  products: WishlistProduct[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
