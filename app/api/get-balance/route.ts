import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.client_id) {
    return NextResponse.json({ response_code: 2001, message: "Client ID not found." }, { status: 400 });
  }

  await connectDB();

  const client = await Client.findOne({ clientId: body.client_id });
  if (!client) {
    return NextResponse.json({ response_code: 2001, message: "Client ID not found." }, { status: 404 });
  }

  return NextResponse.json({
    response_code: 200,
    balance: client.balance,
    status: client.status,
  });
}
