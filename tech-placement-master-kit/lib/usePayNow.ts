"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PayNowArgs = {
  planName: string;
  amount: number; // in INR
};

/**
 * Triggers the Razorpay checkout flow.
 *
 * SETUP REQUIRED before this works end-to-end:
 * 1. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to your .env.local
 * 2. Implement /api/razorpay/order and /api/razorpay/verify (see those files)
 *
 * Until configured, this shows a friendly console warning instead of
 * opening checkout, so the UI stays safe to ship as-is.
 */
export function usePayNow() {
  const payNow = async ({ planName, amount }: PayNowArgs) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      console.warn(
        "Razorpay SDK not loaded yet. Make sure the checkout.js script tag is present on the page."
      );
      return;
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      console.warn(
        "Razorpay is not configured yet. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and implement /api/razorpay/order + /api/razorpay/verify to enable checkout."
      );
      return;
    }

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planName }),
      });
      const order = await orderRes.json();

      const rzp = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: "INR",
        name: "Tech Placement Master Kit",
        description: `${planName} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const result = await verifyRes.json();
          if (result.success) {
            window.location.href = `/success?plan=${encodeURIComponent(planName)}`;
          }
        },
        theme: { color: "#2563EB" },
      });

      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed", err);
    }
  };

  return { payNow };
}
