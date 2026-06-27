import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import { requireAdmin } from "@/lib/guards";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const clients = await Client.find().select("-password").sort({ createdAt: -1 }).lean();

  return NextResponse.json({ response_code: 200, clients });
}
