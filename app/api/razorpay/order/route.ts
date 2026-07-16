import { NextRequest, NextResponse } from "next/server";

/**
 * Creates a Razorpay order server-side.
 *
 * SETUP REQUIRED:
 * 1. npm install razorpay
 * 2. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local
 *    (server-side only — never prefix these with NEXT_PUBLIC_).
 * 3. Uncomment the implementation below.
 */
export async function POST(req: NextRequest) {
  const { amount, planName } = await req.json();

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      {
        error:
          "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.",
      },
      { status: 501 }
    );
  }

  // Example implementation once the `razorpay` package is installed:
  //
  // import Razorpay from "razorpay";
  // const instance = new Razorpay({
  //   key_id: process.env.RAZORPAY_KEY_ID!,
  //   key_secret: process.env.RAZORPAY_KEY_SECRET!,
  // });
  // const order = await instance.orders.create({
  //   amount: amount * 100, // paise
  //   currency: "INR",
  //   receipt: `receipt_${Date.now()}`,
  //   notes: { planName },
  // });
  // return NextResponse.json(order);

  return NextResponse.json(
    { error: "Order creation not implemented yet." },
    { status: 501 }
  );
}
