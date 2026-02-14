export const base_url = "http://192.168.29.65:5000/api/v1";

export const endpoints = {
  get_products: "/products",
  get_product: "/products/:id",
  send_email_otp: "/auth/send-email-otp",
  verify_email_otp: "/auth/verify-email-otp",
  get_user_profile: "/users/profile",
};
