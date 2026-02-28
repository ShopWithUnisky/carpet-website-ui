/** Request to create a Razorpay order on the backend. Amount is computed server-side from items. */
export interface CreatePaymentOrderRequest {
  userId?: string;
  currency: string;
  receipt: string;
  notes?: Record<string, unknown>;
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  shipping?: {
    fullName: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items?: Array<{
    variantId: string;
    name: string;
    imageUrl?: string;
    price: number;
    quantity: number;
  }>;
}

export interface CreatePaymentOrderResponse {
  success: boolean;
  message?: string;
  data: {
    order_id: string;
    amount: number;
    currency: string;
    receipt?: string;
    status?: string;
  };
  keyId?: string;
}

/** Request to verify payment after Razorpay checkout success. */
export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  orderId?: string;
  paymentId?: string;
  data?: Record<string, unknown>;
}

/** Response object passed to Razorpay checkout handler. */
export interface RazorpaySuccessHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
