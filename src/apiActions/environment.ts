export const base_url = "http://localhost:5000/api/v1";
// export const base_url = "https://tcc-backend-tkku.onrender.com/api/v1";

/** Razorpay Key ID (public). Set VITE_RAZORPAY_KEY_ID in .env for payment checkout. */
export const razorpayKeyId =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_RAZORPAY_KEY_ID) || "";

export const endpoints = {
  get_products: "/products",
  get_product: "/products/:id",
  send_email_otp: "/auth/send-email-otp",
  verify_email_otp: "/auth/verify-email-otp",
  get_user_profile: "/users/profile",
  update_user_profile: "/users/profile",
  get_cart: "/cart",
  add_cart: "/cart/add",
  update_cart: "/cart/update",
  remove_cart_item: "/cart/item/:productId",
  clear_cart: "/cart/clear",
  get_wishlist: "/wishlist",
  add_wishlist: "/wishlist/add",
  toggle_wishlist: "/wishlist/toggle",
  remove_wishlist_item: "/wishlist/item/:id",
  create_payment_order: "/payment/create-order",
  verify_payment: "/payment/verify",
};
