import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { verifyPassword, signToken, setAuthCookie, CLIENT_COOKIE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { response_code: 400, message: "email and password are required" },
      { status: 400 }
    );
  }

  await connectDB();

  const client = await Client.findOne({ email: email.toLowerCase() });
  if (!client || !(await verifyPassword(password, client.password))) {
    return NextResponse.json(
      { response_code: 401, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = signToken({
    kind: "client",
    id: client._id.toString(),
    email: client.email,
    name: client.name,
    clientId: client.clientId,
  });
  await setAuthCookie(CLIENT_COOKIE, token);

  return NextResponse.json({
    response_code: 200,
    message: "Login successful",
    user: {
      id: client._id,
      name: client.name,
      email: client.email,
      clientId: client.clientId,
      balance: client.balance,
      status: client.status,
    },
  });
}
