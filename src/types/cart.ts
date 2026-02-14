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

/** API cart line (snapshots at add time) */
export interface CartLineItem {
  product: string;
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
