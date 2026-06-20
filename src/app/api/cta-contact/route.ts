import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Server configuration error: RESEND_API_KEY missing." },
        { status: 500 },
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // Run sequentially so we can clearly attribute which call fails
    const teamSend = await resend.emails.send({
      from: "Klikktek <contact@klikktek.com>",
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

    if (teamSend.error) {
      console.error("Team email failed:", JSON.stringify(teamSend.error));
      return NextResponse.json(
        { error: `Email failed: ${teamSend.error.message ?? "unknown Resend error"}` },
        { status: 502 },
      );
    }

    const visitorSend = await resend.emails.send({
      from: "Klikktek <contact@klikktek.com>",
      to: email,
      subject: "We'll be in touch — Klikktek",
      html: `
        <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Thanks for reaching out.</h1>
          <p style="font-size: 16px; color: #45464d; margin: 0 0 32px; line-height: 1.6;">
            We've received your contact request and will get back to you within one business day.
          </p>
          <div style="background: #eceef0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 14px; color: #45464d; margin: 0 0 8px;">In the meantime, you can:</p>
            <ul style="font-size: 14px; color: #191c1e; margin: 0; padding-left: 20px; line-height: 2;">
              <li>Browse our <a href="https://klikktek.com/services" style="color: #000;">services</a></li>
              <li>Email us at <a href="mailto:contact@klikktek.com" style="color: #000;">contact@klikktek.com</a></li>
            </ul>
          </div>
          <hr style="border: none; border-top: 1px solid #c6c6cd; margin: 32px 0;" />
          <p style="font-size: 12px; color: #76777d; margin: 0;">Klikktek · Precision Intelligence</p>
        </div>
      `,
    });

    if (visitorSend.error) {
      // Team email succeeded but visitor confirmation failed — log it but don't fail the whole request
      console.error("Visitor email failed:", JSON.stringify(visitorSend.error));
    }

    return NextResponse.json({
      success: true,
      teamEmailId: teamSend.data?.id,
      visitorEmailId: visitorSend.data?.id ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("CTA contact route error:", message);
    return NextResponse.json(
      { error: `Failed to send: ${message}` },
      { status: 500 },
    );
  }
}