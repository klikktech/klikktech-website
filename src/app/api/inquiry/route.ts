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

    const { fullName, email, serviceInterest, projectBrief } = await req.json();

    if (!fullName || !email || !serviceInterest || !projectBrief) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    // Team notification — sent first, sequentially, so we can surface the real error
    const teamSend = await resend.emails.send({
      from: "Klikktek Enquiries <contact@klikktek.com>",
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
                <td style="font-size: 14px; color: #45464d; padding: 8px 0;">Service</td>
                <td style="font-size: 14px; font-weight: 600; padding: 8px 0;">${serviceInterest}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f2f4f6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 12px; font-weight: 600; color: #45464d; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">Project Brief</p>
            <p style="font-size: 14px; color: #191c1e; margin: 0; line-height: 1.6; white-space: pre-wrap;">${projectBrief}</p>
          </div>
          <p style="font-size: 12px; color: #76777d; margin: 0;">Reply directly to this email to respond to ${fullName}.</p>
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

    // Visitor confirmation — sent second
    const visitorSend = await resend.emails.send({
      from: "Klikktek <contact@klikktek.com>",
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
            Reach us directly at <a href="mailto:contact@klikktek.com" style="color: #000;">contact@klikktek.com</a>
          </p>
          <hr style="border: none; border-top: 1px solid #c6c6cd; margin: 32px 0;" />
          <p style="font-size: 12px; color: #76777d; margin: 0;">Klikktek · Precision Intelligence</p>
        </div>
      `,
    });

    if (visitorSend.error) {
      // Team email succeeded but confirmation to enquirer failed — log it, don't fail the request
      console.error("Visitor email failed:", JSON.stringify(visitorSend.error));
    }

    return NextResponse.json({
      success: true,
      teamEmailId: teamSend.data?.id,
      visitorEmailId: visitorSend.data?.id ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Inquiry route error:", message);
    return NextResponse.json(
      { error: `Failed to send enquiry: ${message}` },
      { status: 500 },
    );
  }
}
