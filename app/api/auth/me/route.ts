import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { getClientSession } from "@/lib/auth";

export async function GET() {
  const session = await getClientSession();
  if (!session) {
    return NextResponse.json({ response_code: 401, message: "Not authenticated" }, { status: 401 });
  }

  await connectDB();
  const client = await Client.findById(session.id).lean();
  if (!client) {
    return NextResponse.json({ response_code: 401, message: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    response_code: 200,
    user: {
      id: client._id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      clientId: client.clientId,
      apiKey: client.apiKey,
      balance: client.balance,
      status: client.status,
      senderId: client.senderId,
    },
  });
}
