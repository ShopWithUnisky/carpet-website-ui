import { apiCallWithAuth } from "@/apiActions/api-actions";
import { base_url, endpoints } from "@/apiActions/environment";
import type {
    CreatePaymentOrderRequest,
    CreatePaymentOrderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
} from "@/types/payment";

/**
 * Create a Razorpay order on the backend.
 * Backend should call Razorpay Orders API and return order_id.
 * Uses apiCall (no auth). Switch to apiCallWithAuth if your backend requires login.
 */
export async function createPaymentOrder(
  payload: CreatePaymentOrderRequest
): Promise<CreatePaymentOrderResponse> {
  const url = base_url + endpoints.create_payment_order;
  const response = await apiCallWithAuth<
    CreatePaymentOrderResponse,
    undefined,
    CreatePaymentOrderRequest
  >("POST", url, undefined, payload);
  if (!response.success || !response.data?.order_id) {
    throw new Error(response.message ?? "Failed to create order");
  }
  return response;
}

/**
 * Verify payment after Razorpay checkout success.
 * Backend should verify signature with Razorpay and confirm the order.
 * Uses apiCallWithAuth as per backend requirements.
 */
export async function verifyPayment(
  payload: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> {
  const url = base_url + endpoints.verify_payment;
  const response = await apiCallWithAuth<
    VerifyPaymentResponse,
    undefined,
    VerifyPaymentRequest
  >("POST", url, undefined, payload);
  if (!response.success) {
    throw new Error(response.message ?? "Payment verification failed");
  }
  return response;
}
