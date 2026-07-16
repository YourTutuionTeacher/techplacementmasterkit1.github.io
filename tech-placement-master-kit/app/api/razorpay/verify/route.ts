import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Verifies the Razorpay payment signature server-side, then should trigger:
 *   - download link generation / delivery
 *   - confirmation email (see notes below)
 *
 * SETUP REQUIRED:
 * 1. Add RAZORPAY_KEY_SECRET to your .env.local (server-side only).
 * 2. Wire up an email provider (e.g. Resend, SendGrid, Postmark) to send
 *    the confirmation email with the download link after verification.
 * 3. Generate a signed/expiring download URL rather than a public static file,
 *    so the kit isn't freely shareable.
 */
export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json();

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Razorpay is not configured on the server." },
      { status: 501 }
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // TODO: generate a signed download URL and send the confirmation email here.

  return NextResponse.json({ success: true });
}
