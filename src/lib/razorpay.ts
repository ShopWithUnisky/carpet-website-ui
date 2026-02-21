const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
let scriptLoaded: Promise<void> | null = null;

/** Load Razorpay checkout script once. */
export function loadRazorpayScript(): Promise<void> {
  if (typeof document === "undefined") {
    return Promise.reject(new Error("Document not available"));
  }
  const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
  if (existing) {
    return Promise.resolve();
  }
  if (scriptLoaded) {
    return scriptLoaded;
  }
  scriptLoaded = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoaded = null;
      reject(new Error("Failed to load Razorpay"));
    };
    document.body.appendChild(script);
  });
  return scriptLoaded;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

/**
 * Open Razorpay checkout. Call after loadRazorpayScript().
 * keyId: Razorpay Key ID (public key).
 */
export function openRazorpayCheckout(
  keyId: string,
  options: Omit<RazorpayCheckoutOptions, "key">
): void {
  const Razorpay = window.Razorpay;
  if (!Razorpay) {
    throw new Error("Razorpay script not loaded. Call loadRazorpayScript() first.");
  }
  const instance = new Razorpay({
    ...options,
    key: keyId,
  });
  instance.open();
}
