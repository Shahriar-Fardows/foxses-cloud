import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json(
      { response_code: 400, message: "token and password are required" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { response_code: 400, message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  await connectDB();

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const client = await Client.findOne({
    resetTokenHash: tokenHash,
    resetTokenExpires: { $gt: new Date() },
  });

  if (!client) {
    return NextResponse.json(
      { response_code: 400, message: "Reset link is invalid or has expired" },
      { status: 400 }
    );
  }

  client.password = await hashPassword(password);
  client.resetTokenHash = undefined;
  client.resetTokenExpires = undefined;
  await client.save();

  return NextResponse.json({ response_code: 200, message: "Password has been reset. You can now log in." });
}
