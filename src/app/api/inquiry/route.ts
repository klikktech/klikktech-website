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
    const { fullName, email, serviceInterest, projectBrief } = await req.json();

    // Send notification to Klikktek team
    await resend.emails.send({
      from: "Klikktek Enquiries <onboarding@resend.dev>",
      to: "contact@klikktek.com",
      replyTo: email,
      subject: `New Enquiry — ${serviceInterest} from ${fullName}`,
      html: `
        <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 24px;">New Project Enquiry</h1>

          <div style="background: #eceef0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-size: 14px; color: #45464d; padding: 8px 0; border-bottom: 1px solid #c6c6cd; width: 140px;">Name</td>
                <td style="font-size: 14px; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #c6c6cd;">${fullName}</td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #45464d; padding: 8px 0; border-bottom: 1px solid #c6c6cd;">Email</td>
                <td style="font-size: 14px; padding: 8px 0; border-bottom: 1px solid #c6c6cd;">
                  <a href="mailto:${email}" style="color: #000;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #45464d; padding: 8px 0;">Service Interest</td>
                <td style="font-size: 14px; font-weight: 600; padding: 8px 0;">${serviceInterest}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f2f4f6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 12px; font-weight: 600; color: #45464d; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">Project Brief</p>
            <p style="font-size: 14px; color: #191c1e; margin: 0; line-height: 1.6; white-space: pre-wrap;">${projectBrief}</p>
          </div>

          <p style="font-size: 12px; color: #76777d; margin: 0;">
            Reply directly to this email to respond to ${fullName}.
          </p>
        </div>
      `,
    });

    // Send confirmation to the enquirer
    await resend.emails.send({
      from: "Klikktek <onboarding@resend.dev>",
      to: email,
      subject: "We received your enquiry — Klikktek",
      html: `
        <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">Thanks, ${fullName}.</h1>
          <p style="font-size: 16px; color: #45464d; margin: 0 0 32px; line-height: 1.6;">
            We've received your enquiry about <strong>${serviceInterest}</strong> and will get back to you within one business day.
          </p>

          <div style="background: #eceef0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 12px; font-weight: 600; color: #45464d; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">Your Message</p>
            <p style="font-size: 14px; color: #191c1e; margin: 0; line-height: 1.6; white-space: pre-wrap;">${projectBrief}</p>
          </div>

          <p style="font-size: 14px; color: #45464d; margin: 0 0 8px;">
            In the meantime, feel free to reach us directly at
            <a href="mailto:contact@klikktek.com" style="color: #000;">contact@klikktek.com</a>
            or call any of our founders.
          </p>

          <hr style="border: none; border-top: 1px solid #c6c6cd; margin: 32px 0;" />
          <p style="font-size: 12px; color: #76777d; margin: 0;">
            Klikktek · Precision Intelligence
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enquiry email error:", err);
    return NextResponse.json(
      { error: "Failed to send enquiry. Please try again." },
      { status: 500 },
    );
  }
}