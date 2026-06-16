import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

// Format cents to dollar string e.g. 50000 → "$500.00"
function formatAmount(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const amountFormatted = formatAmount(intent.amount);
    const customerEmail = intent.metadata?.customer_email;
    const paymentId = intent.id;

    const emailPromises: Promise<unknown>[] = [];

    // 1. Send receipt to customer (if they provided an email)
    if (customerEmail) {
      emailPromises.push(
        resend.emails.send({
          from: "Klikktek <onboarding@resend.dev>",
          to: customerEmail,
          subject: `Payment Confirmed — ${amountFormatted}`,
          html: `
            <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
              <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Payment Confirmed</h1>
              <p style="font-size: 16px; color: #45464d; margin: 0 0 32px;">
                Thank you — your payment of <strong>${amountFormatted}</strong> has been received successfully.
              </p>

              <div style="background: #eceef0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-size: 14px; color: #45464d; padding: 6px 0;">Amount</td>
                    <td style="font-size: 14px; font-weight: 600; text-align: right;">${amountFormatted}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #45464d; padding: 6px 0;">Payment ID</td>
                    <td style="font-size: 12px; font-family: monospace; text-align: right; color: #76777d;">${paymentId}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #45464d; padding: 6px 0;">Status</td>
                    <td style="font-size: 14px; font-weight: 600; text-align: right; color: #1e6b3a;">Succeeded</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 14px; color: #45464d; margin: 0 0 8px;">
                Our team will be in touch shortly to confirm next steps. If you have any questions, reply to this email or contact us at
                <a href="mailto:contact@klikktek.com" style="color: #000;">contact@klikktek.com</a>.
              </p>

              <hr style="border: none; border-top: 1px solid #c6c6cd; margin: 32px 0;" />
              <p style="font-size: 12px; color: #76777d; margin: 0;">
                Klikktek · Precision Intelligence<br />
                Secured by Stripe
              </p>
            </div>
          `,
        }),
      );
    }

    // 2. Notify Klikktek team
    emailPromises.push(
      resend.emails.send({
        from: "Klikktek <onboarding@resend.dev>",
        to: "fuzen.ltd@gmail.com",
        subject: `💰 New Payment Received — ${amountFormatted}`,
        html: `
          <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
            <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 24px;">New Payment Received</h1>

            <div style="background: #eceef0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="font-size: 14px; color: #45464d; padding: 6px 0;">Amount</td>
                  <td style="font-size: 16px; font-weight: 700; text-align: right;">${amountFormatted}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #45464d; padding: 6px 0;">Customer Email</td>
                  <td style="font-size: 14px; text-align: right;">${customerEmail || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #45464d; padding: 6px 0;">Payment ID</td>
                  <td style="font-size: 12px; font-family: monospace; text-align: right; color: #76777d;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #45464d; padding: 6px 0;">Status</td>
                  <td style="font-size: 14px; font-weight: 600; text-align: right; color: #1e6b3a;">Succeeded</td>
                </tr>
              </table>
            </div>

            <a href="https://dashboard.stripe.com/payments/${paymentId}"
               style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
              View in Stripe Dashboard →
            </a>
          </div>
        `,
      }),
    );

    await Promise.all(emailPromises);
  }

  return NextResponse.json({ received: true });
}