import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { requireClient } from "@/lib/guards";

export async function GET() {
  const { session, error } = await requireClient();
  if (error) return error;

  await connectDB();
  const client = await Client.findById(session!.id).select("-password").lean();

  return NextResponse.json({ response_code: 200, client });
}

export async function PATCH(request: NextRequest) {
  const { session, error } = await requireClient();
  if (error) return error;

  const { name, phone, senderId } = await request.json();

  await connectDB();
  const client = await Client.findByIdAndUpdate(
    session!.id,
    { $set: { name, phone, senderId } },
    { new: true }
  ).select("-password");

  return NextResponse.json({ response_code: 200, client });
}
