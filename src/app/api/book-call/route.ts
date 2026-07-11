import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { formatSelectedSlot } from "@/lib/booking/availability";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

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

    const { fullName, email, phone, dateKey, timeSlot, scheduledAt } =
      await req.json();

    if (!fullName?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 },
      );
    }

    if (!dateKey || !timeSlot || !scheduledAt) {
      return NextResponse.json(
        { error: "Please select a date and time for your call." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 },
      );
    }

    const formattedSlot = formatSelectedSlot(dateKey, timeSlot);

    const teamSend = await resend.emails.send({
      from: "Klikktek Bookings <contact@klikktek.com>",
      to: "contact@klikktek.com",
      replyTo: email,
      subject: `Call booked — ${fullName} (${formattedSlot})`,
      html: `
        <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 24px;">New Call Booking</h1>
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
                <td style="font-size: 14px; color: #45464d; padding: 8px 0; border-bottom: 1px solid #c6c6cd;">Phone</td>
                <td style="font-size: 14px; padding: 8px 0; border-bottom: 1px solid #c6c6cd;">${phone}</td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #45464d; padding: 8px 0;">Scheduled</td>
                <td style="font-size: 14px; font-weight: 600; padding: 8px 0;">${formattedSlot}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 12px; color: #76777d; margin: 0;">ISO: ${scheduledAt}</p>
        </div>
      `,
    });

    if (teamSend.error) {
      console.error("Team booking email failed:", JSON.stringify(teamSend.error));
      return NextResponse.json(
        { error: `Email failed: ${teamSend.error.message ?? "unknown Resend error"}` },
        { status: 502 },
      );
    }

    const visitorSend = await resend.emails.send({
      from: "Klikktek <contact@klikktek.com>",
      to: email,
      subject: "Your call is booked — Klikktek",
      html: `
        <div style="font-family: Inter, ui-sans-serif, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #191c1e;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px;">You're booked, ${fullName}.</h1>
          <p style="font-size: 16px; color: #45464d; margin: 0 0 24px; line-height: 1.6;">
            Your discovery call is scheduled for <strong>${formattedSlot}</strong>.
            We'll reach you at <strong>${phone}</strong> if we need to confirm details.
          </p>
          <p style="font-size: 14px; color: #45464d; margin: 0;">
            Questions? Email <a href="mailto:contact@klikktek.com" style="color: #000;">contact@klikktek.com</a>
          </p>
        </div>
      `,
    });

    if (visitorSend.error) {
      console.error("Visitor booking email failed:", JSON.stringify(visitorSend.error));
    }

    return NextResponse.json({
      success: true,
      teamEmailId: teamSend.data?.id,
      visitorEmailId: visitorSend.data?.id ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Book-call route error:", message);
    return NextResponse.json(
      { error: `Failed to book call: ${message}` },
      { status: 500 },
    );
  }
}
