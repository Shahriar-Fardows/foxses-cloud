import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ response_code: 400, message: "Email is required" }, { status: 400 });
  }

  await connectDB();
  const client = await Client.findOne({ email: email.toLowerCase() });

  if (client) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    client.resetTokenHash = tokenHash;
    client.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await client.save();

    const origin = request.nextUrl.origin;
    const resetUrl = `${origin}/reset-password?token=${rawToken}`;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (process.env.RESEND_API_KEY) {
      await resend.emails
        .send({
          from: `Foxses Cloude <${fromEmail}>`,
          to: [client.email],
          subject: "Reset your password",
          html: `
            <h3>Hello ${client.name},</h3>
            <p>We received a request to reset your password. Click the link below to set a new password. This link expires in 1 hour.</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>If you did not request this, you can safely ignore this email.</p>
          `,
        })
        .catch((err) => console.error("Resend error (reset password):", err));
    }
  }

  return NextResponse.json({
    response_code: 200,
    message: "If an account with that email exists, a reset link has been sent.",
  });
}
