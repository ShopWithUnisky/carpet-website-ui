/** UI cart item (id/variantId = productId for API) */
export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface AddCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartRequest {
  productId: string;
  quantity: number;
}

/** Populated product in cart line (when API returns full product) */
export interface CartLineProduct {
  _id: string;
  id?: string;
  name?: string;
  images?: string[];
  finalPrice?: number;
  price?: number;
}

/** API cart line: product can be id (string) or populated object */
export interface CartLineItem {
  product: string | CartLineProduct;
  quantity: number;
  priceAtAdd?: number;
  nameSnapshot?: string;
  imageSnapshot?: string;
}

export interface CartData {
  _id: string;
  user: string;
  items: CartLineItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface GetCartResponse {
  success: boolean;
  data?: CartData;
}

export interface CartMutationResponse {
  success: boolean;
  message?: string;
  data?: CartData;
}
