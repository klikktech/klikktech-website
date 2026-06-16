import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, email } = await req.json();

    const amountInCents = Math.round(Number(amount) * 100);

    if (!amountInCents || amountInCents < 50) {
      return NextResponse.json(
        { error: "Minimum payment amount is $0.50" },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      // Store email in metadata so the webhook can read it
      metadata: {
        customer_email: email ?? "",
      },
      // Also set receipt_email so Stripe sends its own receipt as fallback
      ...(email ? { receipt_email: email } : {}),
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}