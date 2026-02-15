// export const base_url = "http://192.168.29.65:5000/api/v1";
export const base_url = "https://tcc-backend-tkku.onrender.com/api/v1";

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
};
