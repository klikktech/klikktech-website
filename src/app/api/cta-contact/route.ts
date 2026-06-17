import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function POST(req: NextRequest) {
  try {
    const resend = getResend();
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // Notify the team
    await resend.emails.send({
      from: "Klikktek <onboarding@resend.dev>",
      to: "contact@klikktek.com",
      replyTo: email,
      subject: `New Contact Request — ${email}`,
      html: `
        <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 24px;">New Contact Request</h1>
          <div style="background: #eceef0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-size: 14px; color: #45464d; padding: 8px 0; width: 120px;">Email</td>
                <td style="font-size: 14px; font-weight: 600; padding: 8px 0;">
                  <a href="mailto:${email}" style="color: #000;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #45464d; padding: 8px 0;">Source</td>
                <td style="font-size: 14px; padding: 8px 0;">Homepage CTA — "Get in Touch"</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 12px; color: #76777d; margin: 0;">
            Reply directly to this email to respond to the contact.
          </p>
        </div>
      `,
    });

    // Send confirmation to the visitor
    await resend.emails.send({
      from: "Klikktek <onboarding@resend.dev>",
      to: email,
      subject: "We'll be in touch — Klikktek",
      html: `
        <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Thanks for reaching out.</h1>
          <p style="font-size: 16px; color: #45464d; margin: 0 0 32px; line-height: 1.6;">
            We've received your contact request and will get back to you within one business day to discuss how we can help grow your online presence.
          </p>
          <div style="background: #eceef0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 14px; color: #45464d; margin: 0 0 8px;">In the meantime, you can:</p>
            <ul style="font-size: 14px; color: #191c1e; margin: 0; padding-left: 20px; line-height: 2;">
              <li>Browse our <a href="https://klikktek.com/services" style="color: #000;">services</a></li>
              <li>Email us directly at <a href="mailto:contact@klikktek.com" style="color: #000;">contact@klikktek.com</a></li>
            </ul>
          </div>
          <hr style="border: none; border-top: 1px solid #c6c6cd; margin: 32px 0;" />
          <p style="font-size: 12px; color: #76777d; margin: 0;">Klikktek · Precision Intelligence</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CTA contact error:", err);
    return NextResponse.json(
      { error: "Failed to send. Please try again." },
      { status: 500 },
    );
  }
}